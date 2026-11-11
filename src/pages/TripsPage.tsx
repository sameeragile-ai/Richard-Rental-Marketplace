import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Luggage,
  Heart,
  Tag,
  Star,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX, formatDate } from '../utils/format';
import { PropertyCard } from '../components/common/PropertyCard';
import { SafeImage } from '../components/common/SafeImage';

export const TripsPage: React.FC = () => {
  const { state, dispatch, showToast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'bookings';

  // Review Modal State
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewCleanliness, setReviewCleanliness] = useState(5);
  const [reviewAccuracy, setReviewAccuracy] = useState(5);
  const [reviewLocation, setReviewLocation] = useState(5);
  const [reviewValue, setReviewValue] = useState(5);
  const [reviewCommunication, setReviewCommunication] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const savedProperties = state.properties.filter((p) =>
    state.savedPropertyIds.includes(p.id)
  );

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Review Published', 'Thank you! Your feedback helps verified hosts and future travelers.', 'success');
    setReviewBookingId(null);
    setReviewComment('');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#6B7A73] mb-1">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-[#0E6B50] font-semibold">Guest Trips & Saved</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F1A17]">
            Guest Dashboard
          </h1>
          <p className="text-xs text-[#6B7A73] mt-1">
            Track confirmed reservations, active price negotiation threads, and your curated stay wishlist.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#0F1A17]/10 mb-8 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'bookings' })}
            className={`flex items-center gap-2 py-3 px-4 font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'border-[#0E6B50] text-[#0E6B50]'
                : 'border-transparent text-[#6B7A73] hover:text-[#0F1A17]'
            }`}
          >
            <Luggage className="w-4 h-4" />
            <span>Bookings ({state.bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'offers' })}
            className={`flex items-center gap-2 py-3 px-4 font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'offers'
                ? 'border-[#0E6B50] text-[#0E6B50]'
                : 'border-transparent text-[#6B7A73] hover:text-[#0F1A17]'
            }`}
          >
            <Tag className="w-4 h-4 text-[#D9643A]" />
            <span>Price Offers ({state.offers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'saved' })}
            className={`flex items-center gap-2 py-3 px-4 font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'saved'
                ? 'border-[#0E6B50] text-[#0E6B50]'
                : 'border-transparent text-[#6B7A73] hover:text-[#0F1A17]'
            }`}
          >
            <Heart className="w-4 h-4 text-[#D9643A]" />
            <span>Wishlist ({savedProperties.length})</span>
          </button>
        </div>

        {/* =====================================================
            TAB 1: BOOKINGS
            ===================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {state.bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#0F1A17]/8 max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#F1EBE1] flex items-center justify-center text-[#6B7A73] mx-auto">
                  <Luggage className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#0F1A17]">No reservations yet</h3>
                <p className="text-xs text-[#6B7A73]">
                  When you book a stay with Mobile Money, your access instructions will appear here.
                </p>
                <Link
                  to="/explore"
                  className="inline-block px-5 py-2.5 rounded-xl font-bold text-xs text-white gradient-cta"
                >
                  Explore Stays
                </Link>
              </div>
            ) : (
              state.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl p-6 border border-[#0F1A17]/8 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-4 border-b border-[#0F1A17]/6">
                    <div className="flex items-center gap-3">
                      <SafeImage
                        src={booking.propertyImage}
                        alt={booking.propertyTitle}
                        fallbackSeed={booking.propertyId}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-[#6B7A73] font-bold">
                            {booking.referenceNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {booking.status === 'confirmed' ? 'Confirmed (Deposit Paid)' : 'Completed'}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-lg text-[#0F1A17] mt-0.5">
                          {booking.propertyTitle}
                        </h3>
                        <p className="text-xs text-[#6B7A73]">{booking.propertyDistrict}, Uganda</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-[#6B7A73]">Total Stay Value</p>
                      <p className="font-serif font-bold text-lg text-[#0F1A17] tabular-nums">
                        {formatUGX(booking.totalAmount)}
                      </p>
                      <span className="text-[10px] font-semibold text-[#0E6B50]">
                        Deposit Paid: {formatUGX(booking.depositPaid)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[#6B7A73]">Check-In</span>
                      <p className="font-bold text-[#0F1A17]">{formatDate(booking.checkIn)}</p>
                    </div>
                    <div>
                      <span className="text-[#6B7A73]">Check-Out</span>
                      <p className="font-bold text-[#0F1A17]">{formatDate(booking.checkOut)}</p>
                    </div>
                    <div>
                      <span className="text-[#6B7A73]">Guests</span>
                      <p className="font-bold text-[#0F1A17]">{booking.guests} Guests ({booking.nights} Nights)</p>
                    </div>
                    <div>
                      <span className="text-[#6B7A73]">Balance on Arrival</span>
                      <p className="font-bold text-[#D9643A] tabular-nums">{formatUGX(booking.balanceDue)}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#0F1A17]/6 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-[11px] text-[#6B7A73]">
                      Host WhatsApp: +256 772 458 912 · Gate security code: #4182
                    </span>

                    <button
                      type="button"
                      onClick={() => setReviewBookingId(booking.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#0E6B50] bg-[#0E6B50]/10 hover:bg-[#0E6B50]/20 transition-colors"
                    >
                      Leave a Structured Review
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* =====================================================
            TAB 2: ACTIVE OFFERS
            ===================================================== */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            {state.offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-3xl p-6 border border-[#0F1A17]/8 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#0F1A17]/6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#6B7A73] font-bold">{offer.id}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          offer.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : offer.status === 'countered'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {offer.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#0F1A17] mt-1">
                      {offer.propertyTitle}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#6B7A73]">Listed: {formatUGX(offer.originalPrice)}</span>
                    <p className="font-bold text-sm text-[#0E6B50]">
                      Your Offer: {formatUGX(offer.offeredPrice)}/night
                    </p>
                  </div>
                </div>

                {/* Event Thread */}
                <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-2xl border border-[#0F1A17]/5 text-xs">
                  {offer.events.map((ev) => (
                    <div key={ev.id} className="space-y-0.5">
                      <div className="flex justify-between font-bold text-[10px] text-[#6B7A73]">
                        <span className="uppercase text-[#0F1A17]">
                          {ev.actor === 'guest' ? 'You' : offer.landlordName}
                        </span>
                        <span>{ev.timestamp.split('T')[0]}</span>
                      </div>
                      <p className="text-xs text-[#0F1A17]">{ev.message}</p>
                    </div>
                  ))}
                </div>

                {offer.status === 'accepted' && (
                  <div className="pt-2 flex justify-end">
                    <Link
                      to={`/property/${offer.propertyId}`}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs text-white gradient-cta shadow-xs"
                    >
                      Book Stay at Agreed Price →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* =====================================================
            TAB 3: WISHLIST / SAVED
            ===================================================== */}
        {activeTab === 'saved' && (
          <div>
            {savedProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#0F1A17]/8 max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#F1EBE1] flex items-center justify-center text-[#6B7A73] mx-auto">
                  <Heart className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#0F1A17]">No saved stays yet</h3>
                <p className="text-xs text-[#6B7A73]">
                  Tap the heart on any property card to save homes for your upcoming journey.
                </p>
                <Link
                  to="/explore"
                  className="inline-block px-5 py-2.5 rounded-xl font-bold text-xs text-white gradient-cta"
                >
                  Explore Stays
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            LEAVE A STRUCTURED REVIEW MODAL
            ===================================================== */}
        {reviewBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-[#FAF7F2] text-[#0F1A17] rounded-3xl p-6 shadow-2xl border border-[#0F1A17]/10 space-y-5">
              <h3 className="font-serif font-bold text-xl text-[#0F1A17]">Rate Your Experience</h3>

              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                {/* Cleanliness */}
                <div className="flex justify-between items-center">
                  <span className="font-bold">Cleanliness</span>
                  <div className="flex gap-1 text-[#F2A541]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        onClick={() => setReviewCleanliness(s)}
                        className={`w-5 h-5 cursor-pointer ${
                          s <= reviewCleanliness ? 'fill-current' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Accuracy */}
                <div className="flex justify-between items-center">
                  <span className="font-bold">Accuracy of listing</span>
                  <div className="flex gap-1 text-[#F2A541]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        onClick={() => setReviewAccuracy(s)}
                        className={`w-5 h-5 cursor-pointer ${
                          s <= reviewAccuracy ? 'fill-current' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="flex justify-between items-center">
                  <span className="font-bold">Location & Safety</span>
                  <div className="flex gap-1 text-[#F2A541]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        onClick={() => setReviewLocation(s)}
                        className={`w-5 h-5 cursor-pointer ${
                          s <= reviewLocation ? 'fill-current' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Value */}
                <div className="flex justify-between items-center">
                  <span className="font-bold">Value for Money</span>
                  <div className="flex gap-1 text-[#F2A541]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        onClick={() => setReviewValue(s)}
                        className={`w-5 h-5 cursor-pointer ${
                          s <= reviewValue ? 'fill-current' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Communication */}
                <div className="flex justify-between items-center">
                  <span className="font-bold">Host Communication</span>
                  <div className="flex gap-1 text-[#F2A541]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        onClick={() => setReviewCommunication(s)}
                        className={`w-5 h-5 cursor-pointer ${
                          s <= reviewCommunication ? 'fill-current' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1">Your Written Review</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe the hospitality, solar reliability, and views..."
                    rows={3}
                    required
                    className="w-full p-3 bg-white border border-[#0F1A17]/15 rounded-xl text-xs"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewBookingId(null)}
                    className="flex-1 py-3 rounded-xl bg-white border border-[#0F1A17]/15 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl text-white gradient-cta font-bold shadow-md"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
