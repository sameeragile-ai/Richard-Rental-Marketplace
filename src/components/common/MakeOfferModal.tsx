import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
  ShoppingBag,
  Send
} from 'lucide-react';
import { Property, Offer } from '../../types';
import { formatUGX, formatUSD, generateOfferId } from '../../utils/format';
import { useApp } from '../../context/AppContext';
import { SafeImage } from './SafeImage';

interface MakeOfferModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  onOfferAcceptedAndAddedToCart?: (agreedRate: number) => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  property,
  isOpen,
  onClose,
  checkIn,
  checkOut,
  nights,
  guests,
  onOfferAcceptedAndAddedToCart,
}) => {
  const { dispatch, showToast } = useApp();

  const listedRate = property.pricePerNight;
  const minAllowedRate = Math.round(listedRate * 0.6); // 40% discount max limit
  const initialSuggestedRate = Math.round(listedRate * 0.85);

  const [offeredRate, setOfferedRate] = useState<number>(initialSuggestedRate);
  const [message, setMessage] = useState('');
  const [guestName, setGuestName] = useState('Alex Mercer');
  const [guestPhone, setGuestPhone] = useState('+256 701 440 229');

  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [isSimulatingLandlord, setIsSimulatingLandlord] = useState(false);

  const discountPercent = Math.round(((listedRate - offeredRate) / listedRate) * 100);

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();

    const newOffer: Offer = {
      id: generateOfferId(),
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.images[0],
      propertyDistrict: property.district,
      landlordId: property.landlord.id,
      landlordName: property.landlord.name,
      guestName,
      guestEmail: 'alex.mercer@gmail.com',
      guestPhone,
      checkIn,
      checkOut,
      nights,
      guests,
      originalPrice: listedRate,
      offeredPrice: offeredRate,
      status: 'pending',
      message: message || `Offering ${formatUGX(offeredRate)}/night for ${nights} nights.`,
      createdAt: new Date().toISOString(),
      events: [
        {
          id: `ev-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'guest',
          type: 'offer_created',
          amount: offeredRate,
          message: message || `Initial offer of ${formatUGX(offeredRate)}/night (${discountPercent}% off)`,
        },
      ],
    };

    setActiveOffer(newOffer);
    dispatch({ type: 'CREATE_OFFER', payload: newOffer });
    showToast('Offer submitted to landlord', `Landlord ${property.landlord.name} was notified via SMS/WhatsApp.`, 'info');

    // Simulate landlord auto-reply after 2 seconds
    setIsSimulatingLandlord(true);
    setTimeout(() => {
      setIsSimulatingLandlord(false);
      const isAcceptable = offeredRate >= listedRate * property.minOfferPercent;

      if (isAcceptable) {
        // Landlord accepts!
        const acceptedOffer: Offer = {
          ...newOffer,
          status: 'accepted',
          events: [
            ...newOffer.events,
            {
              id: `ev-${Date.now() + 1}`,
              timestamp: new Date().toISOString(),
              actor: 'landlord',
              type: 'offer_accepted',
              amount: offeredRate,
              message: `Offer accepted! We look forward to welcoming you to ${property.title}.`,
            },
          ],
        };
        setActiveOffer(acceptedOffer);
        dispatch({
          type: 'UPDATE_OFFER_STATUS',
          payload: {
            offerId: newOffer.id,
            status: 'accepted',
            message: `Offer accepted by ${property.landlord.name}!`,
          },
        });
        showToast('Offer Accepted!', `${property.landlord.name} accepted your offer of ${formatUGX(offeredRate)}/night.`, 'success');
      } else {
        // Landlord counters with slightly higher rate
        const counterRate = Math.round((offeredRate + listedRate) / 2);
        const counteredOffer: Offer = {
          ...newOffer,
          status: 'countered',
          landlordCounterPrice: counterRate,
          events: [
            ...newOffer.events,
            {
              id: `ev-${Date.now() + 1}`,
              timestamp: new Date().toISOString(),
              actor: 'landlord',
              type: 'counter_offered',
              amount: counterRate,
              message: `Thank you for your interest! The lowest we can do for these dates with solar power & breakfast is ${formatUGX(counterRate)}/night.`,
            },
          ],
        };
        setActiveOffer(counteredOffer);
        dispatch({
          type: 'UPDATE_OFFER_STATUS',
          payload: {
            offerId: newOffer.id,
            status: 'countered',
            counterPrice: counterRate,
            message: `Landlord countered with ${formatUGX(counterRate)}/night.`,
          },
        });
        showToast('Counter-Offer Received', `${property.landlord.name} proposed ${formatUGX(counterRate)}/night.`, 'info');
      }
    }, 2200);
  };

  const handleGuestAcceptCounter = () => {
    if (!activeOffer || !activeOffer.landlordCounterPrice) return;
    const finalPrice = activeOffer.landlordCounterPrice;
    const acceptedOffer: Offer = {
      ...activeOffer,
      status: 'accepted',
      offeredPrice: finalPrice,
    };
    setActiveOffer(acceptedOffer);
    dispatch({
      type: 'UPDATE_OFFER_STATUS',
      payload: {
        offerId: activeOffer.id,
        status: 'accepted',
        message: 'Guest accepted landlord counter-offer.',
      },
    });
    showToast('Agreed!', `You accepted the rate of ${formatUGX(finalPrice)}/night.`, 'success');
  };

  const handleAddToCartAtAgreedPrice = () => {
    const agreedPrice = activeOffer?.status === 'accepted' ? (activeOffer.landlordCounterPrice || activeOffer.offeredPrice) : offeredRate;
    const cleaningFee = 50000;
    const serviceFee = Math.round(agreedPrice * nights * 0.05);
    const totalAmount = agreedPrice * nights + cleaningFee + serviceFee;
    const depositAmount = Math.round(totalAmount * 0.3);
    const balanceDue = totalAmount - depositAmount;

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: `cart-${Date.now()}`,
        property,
        checkIn,
        checkOut,
        nights,
        guests,
        ratePerNight: agreedPrice,
        isNegotiated: true,
        originalRate: listedRate,
        agreedOfferId: activeOffer?.id,
        cleaningFee,
        serviceFee,
        totalAmount,
        depositAmount,
        balanceDue,
      },
    });

    showToast('Added to Cart at Agreed Price', `Stay reserved at ${formatUGX(agreedPrice)}/night.`, 'success');
    onOfferAcceptedAndAddedToCart?.(agreedPrice);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="w-full max-w-lg bg-[#FAF7F2] text-[#0F1A17] rounded-3xl shadow-2xl border border-[#0F1A17]/10 overflow-hidden my-8"
      >
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#0F1A17]/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SafeImage
              src={property.images[0]}
              alt={property.title}
              fallbackSeed={property.id}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
            <div>
              <h3 className="font-serif font-bold text-base text-[#0F1A17] line-clamp-1">
                Name Your Price
              </h3>
              <p className="text-xs text-[#6B7A73]">
                Negotiate directly with {property.landlord.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F1EBE1] text-[#6B7A73]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {!activeOffer ? (
            /* Phase 1: Make initial offer */
            <form onSubmit={handleSendOffer} className="space-y-5">
              {/* Listed vs Offer Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#0F1A17]/8 space-y-4">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-[#0F1A17]/5">
                  <span className="text-[#6B7A73]">Listed Host Rate</span>
                  <span className="font-semibold text-sm tabular-nums line-through text-[#6B7A73]">
                    {formatUGX(listedRate)}/night
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#0F1A17] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#F2A541]" />
                      <span>Your Offered Rate</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0E6B50] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 tabular-nums">
                        {discountPercent}% OFF
                      </span>
                      <span className="font-serif font-bold text-lg text-[#0F1A17] tabular-nums">
                        {formatUGX(offeredRate)}
                      </span>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min={minAllowedRate}
                    max={listedRate}
                    step={5000}
                    value={offeredRate}
                    onChange={(e) => setOfferedRate(Number(e.target.value))}
                    className="w-full accent-[#0E6B50] cursor-pointer h-2 bg-[#F1EBE1] rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-[#6B7A73] mt-1 tabular-nums">
                    <span>Min {formatUGX(minAllowedRate)}</span>
                    <span>Listed {formatUGX(listedRate)}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl text-xs space-y-1">
                  <div className="flex justify-between text-[#6B7A73]">
                    <span>Total for {nights} nights</span>
                    <span className="font-bold tabular-nums text-[#0F1A17]">
                      {formatUGX(offeredRate * nights)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#0E6B50] text-[11px] font-semibold">
                    <span>You save</span>
                    <span className="tabular-nums">
                      {formatUGX((listedRate - offeredRate) * nights)} ({formatUSD((listedRate - offeredRate) * nights)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Message to Host */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0F1A17]">
                  Note to Landlord (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Quiet family visiting Kampala for Makerere graduation. No parties, respectful guests."
                  rows={3}
                  className="w-full p-3 text-xs bg-white border border-[#0F1A17]/15 rounded-xl focus:outline-hidden focus:border-[#0E6B50]"
                />
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#6B7A73]">Your Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    className="w-full mt-1 px-3 py-2 text-xs bg-white border border-[#0F1A17]/15 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#6B7A73]">WhatsApp / Phone</label>
                  <input
                    type="text"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                    className="w-full mt-1 px-3 py-2 text-xs bg-white border border-[#0F1A17]/15 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Send Offer to {property.landlord.name}</span>
              </button>
            </form>
          ) : (
            /* Phase 2: Live Negotiation Thread */
            <div className="space-y-5">
              {/* Status Header */}
              <div className="p-4 rounded-2xl bg-white border border-[#0F1A17]/8 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6B7A73] uppercase tracking-wider font-bold">Offer Status</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {activeOffer.status === 'accepted' ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Offer Accepted!
                      </span>
                    ) : activeOffer.status === 'countered' ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Landlord Counter-Offer
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        Pending Landlord Review
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#6B7A73]">Reference</span>
                  <p className="text-xs font-bold font-mono text-[#0F1A17]">{activeOffer.id}</p>
                </div>
              </div>

              {/* Message Timeline */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#0F1A17]/8 max-h-64 overflow-y-auto">
                {activeOffer.events.map((ev) => (
                  <div
                    key={ev.id}
                    className={`p-3 rounded-xl text-xs space-y-1 ${
                      ev.actor === 'guest'
                        ? 'bg-[#FAF7F2] border border-[#0F1A17]/5 ml-4'
                        : 'bg-emerald-50 border border-emerald-100 mr-4'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] text-[#6B7A73]">
                      <span className="font-bold uppercase tracking-wider text-[#0F1A17]">
                        {ev.actor === 'guest' ? 'You (Guest)' : `${property.landlord.name} (Landlord)`}
                      </span>
                      <span>Just now</span>
                    </div>
                    <p className="text-xs text-[#0F1A17]">{ev.message}</p>
                    {ev.amount && (
                      <p className="text-xs font-bold tabular-nums text-[#0E6B50]">
                        Proposed Rate: {formatUGX(ev.amount)}/night
                      </p>
                    )}
                  </div>
                ))}

                {isSimulatingLandlord && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs flex items-center gap-2 text-[#6B7A73]">
                    <div className="w-2 h-2 rounded-full bg-[#0E6B50] animate-ping" />
                    <span>{property.landlord.name} is reviewing your offer...</span>
                  </div>
                )}
              </div>

              {/* Action Buttons depending on status */}
              {activeOffer.status === 'accepted' ? (
                <button
                  type="button"
                  onClick={handleAddToCartAtAgreedPrice}
                  className="w-full py-4 px-4 rounded-xl font-bold text-xs text-white gradient-brand hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4 text-[#F2A541]" />
                  <span>Add to Cart at Agreed Price ({formatUGX(activeOffer.landlordCounterPrice || activeOffer.offeredPrice)}/night)</span>
                </button>
              ) : activeOffer.status === 'countered' ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleGuestAcceptCounter}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Counter-Offer ({formatUGX(activeOffer.landlordCounterPrice!)}/night)</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-[#6B7A73] hover:text-[#0F1A17] transition-colors text-center"
                  >
                    Decline & keep looking
                  </button>
                </div>
              ) : (
                <p className="text-xs text-center text-[#6B7A73]">
                  Host typically replies in {property.landlord.responseTime.toLowerCase()}. You will receive SMS alerts.
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
