import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { Property } from '../../types';
import { formatUGX, formatUSD } from '../../utils/format';
import { useApp } from '../../context/AppContext';
import { SafeImage } from './SafeImage';

interface PropertyCardProps {
  property: Property;
  onQuickAddToCart?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onQuickAddToCart }) => {
  const { toggleSave, isSaved, showToast, dispatch } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const saved = isSaved(property.id);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(property.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Default 2 nights booking starting tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkInStr = tomorrow.toISOString().split('T')[0];
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 2);
    const checkOutStr = dayAfter.toISOString().split('T')[0];

    const cleaningFee = 50000;
    const serviceFee = Math.round(property.pricePerNight * 2 * 0.05);
    const totalAmount = property.pricePerNight * 2 + cleaningFee + serviceFee;
    const depositAmount = Math.round(totalAmount * 0.3);
    const balanceDue = totalAmount - depositAmount;

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: `cart-${Date.now()}`,
        property,
        checkIn: checkInStr,
        checkOut: checkOutStr,
        nights: 2,
        guests: 2,
        ratePerNight: property.pricePerNight,
        isNegotiated: false,
        originalRate: property.pricePerNight,
        cleaningFee,
        serviceFee,
        totalAmount,
        depositAmount,
        balanceDue,
      },
    });

    showToast('Added to Cart', `${property.title} (2 nights) added to your cart.`, 'success');
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#0F1A17]/8 shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
      {/* Image Carousel Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F1EBE1]">
        <Link to={`/property/${property.id}`} className="block w-full h-full">
          <SafeImage
            src={property.images[currentImageIndex]}
            alt={property.title}
            fallbackSeed={`${property.id}-${currentImageIndex}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
          />
        </Link>

        {/* Carousel arrows (visible on desktop hover) */}
        {property.images.length > 1 && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Previous photo"
              className="pointer-events-auto absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 text-[#0F1A17] flex items-center justify-center shadow-md hover:bg-white hover:scale-105 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next photo"
              className="pointer-events-auto absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 text-[#0F1A17] flex items-center justify-center shadow-md hover:bg-white hover:scale-105 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Carousel Dot Indicators */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
            {property.images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
          {property.isNegotiable && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/95 backdrop-blur-md text-[#D9643A] shadow-xs flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>Negotiable</span>
            </span>
          )}
          {property.isVerified && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#0E6B50]/95 backdrop-blur-md text-white shadow-xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* Heart / Wishlist Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label={saved ? 'Remove from saved' : 'Save property'}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#0F1A17] flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all"
        >
          <motion.div whileTap={{ scale: 1.3 }}>
            <Heart
              className={`w-4 h-4 transition-colors ${
                saved ? 'fill-[#D9643A] text-[#D9643A]' : 'text-[#0F1A17]/80'
              }`}
            />
          </motion.div>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <Link to={`/property/${property.id}`} className="block group-hover:text-[#0E6B50] transition-colors">
          {/* Unboxed Metadata Line with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-[#6B7A73] mb-1">
            <span className="font-semibold text-[#0F1A17]">{property.district}</span>
            <span aria-hidden="true">·</span>
            <span>{property.type}</span>
            <span aria-hidden="true">·</span>
            <span>{property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-base text-[#0F1A17] leading-snug line-clamp-1 mb-1">
            {property.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-[#0F1A17] mb-3">
            <Star className="w-3.5 h-3.5 fill-[#F2A541] text-[#F2A541]" />
            <span className="font-bold tabular-nums">{property.rating.toFixed(2)}</span>
            <span className="text-[#6B7A73]">({property.reviewCount} reviews)</span>
          </div>
        </Link>

        {/* Price & Quick Action */}
        <div className="pt-3 border-t border-[#0F1A17]/6 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif font-bold text-lg text-[#0F1A17] tabular-nums">
                {formatUGX(property.pricePerNight)}
              </span>
              <span className="text-xs text-[#6B7A73]">/night</span>
            </div>
            <p className="text-[10px] text-[#6B7A73] tabular-nums">
              {formatUSD(property.pricePerNight)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            title="Quick add to stays cart"
            className="w-9 h-9 rounded-xl bg-[#FAF7F2] hover:bg-[#0E6B50] text-[#0E6B50] hover:text-white border border-[#0F1A17]/10 flex items-center justify-center transition-all shadow-2xs active:scale-95"
            aria-label={`Add ${property.title} to cart`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
