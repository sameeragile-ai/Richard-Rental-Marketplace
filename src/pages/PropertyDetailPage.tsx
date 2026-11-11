import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Calendar,
  Users,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Zap,
  Waves,
  Coffee,
  Car,
  Lock,
  Wind,
  Tv,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { formatUGX, formatUSD, calculateNights, formatDate } from '../utils/format';
import { MakeOfferModal } from '../components/common/MakeOfferModal';
import { SafeImage } from '../components/common/SafeImage';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch, isSaved, toggleSave, showToast } = useApp();

  const property = state.properties.find((p) => p.id === id) || state.properties[0];
  const saved = isSaved(property.id);

  // Booking & Dates State
  // Default check-in: 3 days from now, check-out: 6 days from now
  const defaultCheckIn = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  }, []);

  const defaultCheckOut = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 6);
    return d.toISOString().split('T')[0];
  }, []);

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(2);
  const [agreedRate, setAgreedRate] = useState<number | null>(null);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Make Offer Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Mobile Booking Sheet State
  const [isMobileBookSheetOpen, setIsMobileBookSheetOpen] = useState(false);

  // Calculate pricing
  const nights = calculateNights(checkIn, checkOut);
  const currentRate = agreedRate || property.pricePerNight;
  const stayCost = currentRate * nights;
  const cleaningFee = 50000; // Flat UGX 50,000
  const serviceFee = Math.round(stayCost * 0.05); // 5% platform fee
  const totalAmount = stayCost + cleaningFee + serviceFee;
  const depositAmount = Math.round(totalAmount * 0.3); // 30% Mobile Money deposit
  const balanceDue = totalAmount - depositAmount;

  const isDateBooked = (dateStr: string) => {
    return property.bookedDates.includes(dateStr);
  };

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: `cart-${Date.now()}`,
        property,
        checkIn,
        checkOut,
        nights,
        guests,
        ratePerNight: currentRate,
        isNegotiated: agreedRate !== null,
        originalRate: property.pricePerNight,
        cleaningFee,
        serviceFee,
        totalAmount,
        depositAmount,
        balanceDue,
      },
    });

    showToast('Added to Cart', `${property.title} has been added.`, 'success');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out ${property.title} in ${property.district} on Richard Rentals`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Property link copied to clipboard.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-[#6B7A73]">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link to="/explore" className="hover:underline">Explore</Link>
            <span>/</span>
            <span className="text-[#0E6B50] font-semibold">{property.district}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#0F1A17]/10 hover:bg-[#F1EBE1] text-[#0F1A17] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={() => toggleSave(property.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#0F1A17]/10 hover:bg-[#F1EBE1] text-[#0F1A17] transition-colors"
            >
              <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-[#D9643A] text-[#D9643A]' : ''}`} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Title, Badges & Ratings Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            {property.isNegotiable && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-200">
                Direct Host Negotiation Allowed
              </span>
            )}
            {property.isInstantBook && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-900 border border-emerald-200">
                Instant Book
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F1A17] leading-tight mb-2">
            {property.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#0F1A17]/80">
            <div className="flex items-center gap-1 text-[#0F1A17] font-bold">
              <Star className="w-4 h-4 fill-[#F2A541] text-[#F2A541]" />
              <span>{property.rating.toFixed(2)}</span>
              <span className="text-[#6B7A73] font-normal underline">({property.reviewCount} verified reviews)</span>
            </div>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#0E6B50]" />
              <span>{property.district}, {property.city}, {property.region} Uganda</span>
            </span>
            <span>·</span>
            <span className="font-mono text-[#6B7A73]">{property.id}</span>
          </div>
        </div>

        {/* =====================================================
            IMAGE MOSAIC (1 LARGE + 4 SMALL)
            ===================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden mb-12 shadow-sm bg-[#F1EBE1]">
          {/* Main Large Image */}
          <div
            className="md:col-span-2 md:row-span-2 relative aspect-4/3 md:aspect-auto h-72 md:h-[480px] cursor-pointer group"
            onClick={() => setLightboxIndex(0)}
          >
            <SafeImage
              src={property.images[0]}
              alt={property.title}
              fallbackSeed={`${property.id}-0`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* 4 Small Images */}
          {property.images.slice(1, 5).map((img, i) => (
            <div
              key={i}
              className="relative aspect-4/3 h-36 md:h-[234px] cursor-pointer group overflow-hidden"
              onClick={() => setLightboxIndex(i + 1)}
            >
              <SafeImage
                src={img}
                alt={`${property.title} - photo ${i + 2}`}
                fallbackSeed={`${property.id}-${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              {i === 3 && property.images.length > 5 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xs">
                  +{property.images.length - 4} photos
                </div>
              )}
            </div>
          ))}
        </div>

        {/* =====================================================
            MAIN CONTENT & STICKY BOOKING CARD SPLIT
            ===================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-10">
            {/* Hosted By Card */}
            <div className="flex items-center justify-between p-6 rounded-3xl bg-white border border-[#0F1A17]/8 shadow-2xs">
              <div className="flex items-center gap-4">
                <SafeImage
                  src={property.landlord.avatar}
                  alt={property.landlord.name}
                  fallbackSeed={`landlord-${property.landlord.id}`}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#0E6B50]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-bold text-base text-[#0F1A17]">
                      Hosted by {property.landlord.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-[#0E6B50]" />
                  </div>
                  <p className="text-xs text-[#6B7A73]">
                    Superhost · Joined {property.landlord.joinedYear} · Responds {property.landlord.responseTime.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 justify-end text-xs font-bold text-[#0F1A17]">
                  <Star className="w-3.5 h-3.5 fill-[#F2A541] text-[#F2A541]" />
                  <span>{property.landlord.rating.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-[#6B7A73]">{property.landlord.totalReviews} reviews</p>
              </div>
            </div>

            {/* Room specs */}
            <div className="grid grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F1EBE1]/60 text-center text-xs">
              <div>
                <p className="text-[11px] text-[#6B7A73]">Max Guests</p>
                <p className="font-bold text-sm text-[#0F1A17]">{property.maxGuests}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7A73]">Bedrooms</p>
                <p className="font-bold text-sm text-[#0F1A17]">{property.bedrooms}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7A73]">Beds</p>
                <p className="font-bold text-sm text-[#0F1A17]">{property.beds}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7A73]">Bathrooms</p>
                <p className="font-bold text-sm text-[#0F1A17]">{property.baths}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#0F1A17]">About this home</h2>
              <p className="text-sm text-[#0F1A17]/85 leading-relaxed font-light">
                {property.description}
              </p>
              {property.monthlyPrice && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
                  <p className="font-bold text-amber-900">Considering an extended stay?</p>
                  <p className="text-amber-800 mt-0.5">
                    Monthly rate for 30+ nights: <strong className="tabular-nums">{formatUGX(property.monthlyPrice)}</strong>/month ({formatUSD(property.monthlyPrice)}). Includes weekly housekeeping and utilities.
                  </p>
                </div>
              )}
            </div>

            {/* Amenities Grid */}
            <div className="space-y-4 pt-6 border-t border-[#0F1A17]/8">
              <h2 className="font-serif text-2xl font-bold text-[#0F1A17]">What this place offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#0F1A17]/8 text-xs text-[#0F1A17]"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#0E6B50]/10 text-[#0E6B50] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="space-y-3 pt-6 border-t border-[#0F1A17]/8 text-xs">
              <h2 className="font-serif text-xl font-bold text-[#0F1A17]">House Rules</h2>
              <ul className="space-y-2 text-[#0F1A17]/80">
                {property.houseRules.map((rule, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9643A]" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Structured Reviews with Category Score Bars */}
            <div className="space-y-6 pt-6 border-t border-[#0F1A17]/8">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 fill-[#F2A541] text-[#F2A541]" />
                <h2 className="font-serif text-2xl font-bold text-[#0F1A17]">
                  {property.rating.toFixed(2)} · {property.reviewCount} Reviews
                </h2>
              </div>

              {/* Category Breakdown Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-3xl border border-[#0F1A17]/8">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#6B7A73]">Cleanliness</span>
                    <span className="font-bold tabular-nums">{property.reviewScores.cleanliness.toFixed(1)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F1EBE1] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0E6B50]"
                      style={{ width: `${(property.reviewScores.cleanliness / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#6B7A73]">Accuracy</span>
                    <span className="font-bold tabular-nums">{property.reviewScores.accuracy.toFixed(1)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F1EBE1] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0E6B50]"
                      style={{ width: `${(property.reviewScores.accuracy / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#6B7A73]">Location</span>
                    <span className="font-bold tabular-nums">{property.reviewScores.location.toFixed(1)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F1EBE1] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0E6B50]"
                      style={{ width: `${(property.reviewScores.location / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#6B7A73]">Communication</span>
                    <span className="font-bold tabular-nums">{property.reviewScores.communication.toFixed(1)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F1EBE1] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0E6B50]"
                      style={{ width: `${(property.reviewScores.communication / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#6B7A73]">Value for money</span>
                    <span className="font-bold tabular-nums">{property.reviewScores.value.toFixed(1)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F1EBE1] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F2A541]"
                      style={{ width: `${(property.reviewScores.value / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT COLUMN: STICKY BOOKING CARD (Desktop)
              ===================================================== */}
          <div className="hidden lg:block lg:col-span-5 sticky top-24">
            <div className="bg-white rounded-3xl p-6 border border-[#0F1A17]/10 shadow-xl space-y-6">
              {/* Rate Header */}
              <div className="flex items-baseline justify-between pb-4 border-b border-[#0F1A17]/8">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-3xl font-bold text-[#0F1A17] tabular-nums">
                      {formatUGX(currentRate)}
                    </span>
                    <span className="text-xs text-[#6B7A73]">/ night</span>
                  </div>
                  <p className="text-[11px] text-[#6B7A73] tabular-nums">
                    {formatUSD(currentRate)} USD equivalent
                  </p>
                </div>

                {agreedRate && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                    Agreed Offer
                  </span>
                )}
              </div>

              {/* Dates & Guests Box */}
              <div className="rounded-2xl border border-[#0F1A17]/15 overflow-hidden text-xs">
                <div className="grid grid-cols-2 border-b border-[#0F1A17]/10 divide-x divide-[#0F1A17]/10 bg-[#FAF7F2]">
                  <div className="p-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7A73]">
                      Check-In
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full mt-1 bg-transparent font-semibold focus:outline-hidden text-[#0F1A17]"
                    />
                  </div>
                  <div className="p-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7A73]">
                      Check-Out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full mt-1 bg-transparent font-semibold focus:outline-hidden text-[#0F1A17]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] flex items-center justify-between">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7A73]">
                      Guests
                    </label>
                    <p className="font-semibold text-[#0F1A17]">{guests} guests (max {property.maxGuests})</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-7 h-7 rounded-md bg-white border border-[#0F1A17]/10 font-bold flex items-center justify-center hover:bg-[#F1EBE1]"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuests(Math.min(property.maxGuests, guests + 1))}
                      className="w-7 h-7 rounded-md bg-[#0E6B50] text-white font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Booked dates warning notice */}
              {isDateBooked(checkIn) || isDateBooked(checkOut) ? (
                <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
                  <X className="w-4 h-4 shrink-0" />
                  <span>Selected dates overlap with an existing booking. Please pick another range.</span>
                </div>
              ) : null}

              {/* Two Primary Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Stays Cart</span>
                </button>

                {property.isNegotiable && (
                  <button
                    type="button"
                    onClick={() => setIsOfferModalOpen(true)}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-[#0E6B50] bg-white border-2 border-[#0E6B50] hover:bg-[#0E6B50]/5 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#F2A541]" />
                    <span>Make an Offer (Name Your Price)</span>
                  </button>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-[#0F1A17]/8 space-y-2 text-xs">
                <div className="flex justify-between text-[#6B7A73]">
                  <span>{formatUGX(currentRate)} × {nights} nights</span>
                  <span className="font-medium tabular-nums text-[#0F1A17]">{formatUGX(stayCost)}</span>
                </div>

                <div className="flex justify-between text-[#6B7A73]">
                  <span>Cleaning & turnover fee</span>
                  <span className="font-medium tabular-nums text-[#0F1A17]">{formatUGX(cleaningFee)}</span>
                </div>

                <div className="flex justify-between text-[#6B7A73]">
                  <span>Service & guarantee fee (5%)</span>
                  <span className="font-medium tabular-nums text-[#0F1A17]">{formatUGX(serviceFee)}</span>
                </div>

                <div className="pt-2 border-t border-[#0F1A17]/8 flex justify-between font-bold text-sm text-[#0F1A17]">
                  <span>Total Amount</span>
                  <span className="tabular-nums">{formatUGX(totalAmount)}</span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex justify-between items-center text-emerald-950 font-bold">
                  <span>Deposit due now via MoMo (30%)</span>
                  <span className="tabular-nums text-sm text-[#0E6B50]">{formatUGX(depositAmount)}</span>
                </div>

                <div className="text-[11px] text-[#6B7A73] flex justify-between">
                  <span>Balance payable directly to host on arrival</span>
                  <span className="tabular-nums">{formatUGX(balanceDue)}</span>
                </div>
              </div>

              <div className="text-[10px] text-center text-[#6B7A73] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0E6B50]" />
                <span>Richard Guest Protection · Direct Landlord Escrow</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE BOTTOM STICKY BAR
          ===================================================== */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md p-3 px-4 border-t border-[#0F1A17]/10 flex items-center justify-between shadow-lg">
        <div>
          <span className="font-serif font-bold text-base text-[#0F1A17] tabular-nums">
            {formatUGX(currentRate)}
          </span>
          <span className="text-[11px] text-[#6B7A73]"> / night</span>
          <p className="text-[10px] text-[#0E6B50] font-semibold">{nights} nights selected</p>
        </div>

        <div className="flex gap-2">
          {property.isNegotiable && (
            <button
              type="button"
              onClick={() => setIsOfferModalOpen(true)}
              className="px-3 py-2.5 rounded-xl font-bold text-xs text-[#0E6B50] bg-[#0E6B50]/10 border border-[#0E6B50]/20"
            >
              Offer
            </button>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white gradient-cta shadow-md flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          FULLSCREEN LIGHTBOX MODAL
          ===================================================== */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6">
            <div className="flex items-center justify-between text-white z-10">
              <span className="text-xs font-semibold tabular-nums">
                Photo {lightboxIndex + 1} of {property.images.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <SafeImage
                src={property.images[lightboxIndex]}
                alt={property.title}
                fallbackSeed={`${property.id}-${lightboxIndex}`}
                className="max-h-full max-w-full object-contain rounded-xl select-none"
              />

              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) => (prev! === 0 ? property.images.length - 1 : prev! - 1))
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) => (prev! === property.images.length - 1 ? 0 : prev! + 1))
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Thumbnail selector */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 transition-opacity ${
                    idx === lightboxIndex ? 'ring-2 ring-[#F2A541] opacity-100' : 'opacity-50'
                  }`}
                >
                  <SafeImage
                    src={img}
                    alt=""
                    fallbackSeed={`${property.id}-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Make Offer Modal */}
      <MakeOfferModal
        property={property}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        checkIn={checkIn}
        checkOut={checkOut}
        nights={nights}
        guests={guests}
        onOfferAcceptedAndAddedToCart={(rate) => {
          setAgreedRate(rate);
        }}
      />
    </div>
  );
};
