import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  Map as MapIcon,
  LayoutGrid,
  List,
  X,
  Star,
  Check,
  Search,
  Tag,
  ShieldCheck,
  Zap,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/common/PropertyCard';
import { SkeletonPropertyCard } from '../components/common/SkeletonPropertyCard';
import { formatUGX, formatUSD } from '../utils/format';
import { ugandaDistricts } from '../data/districts';
import { Property } from '../types';
import { SafeImage } from '../components/common/SafeImage';

export const ExplorePage: React.FC = () => {
  const { state } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Sync
  const districtParam = searchParams.get('district') || '';
  const typeParam = searchParams.get('type') || '';

  // Local Filter States
  const [selectedDistrict, setSelectedDistrict] = useState(districtParam);
  const [selectedType, setSelectedType] = useState(typeParam);
  const [maxPrice, setMaxPrice] = useState<number>(1000000); // 1M UGX
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [onlyNegotiable, setOnlyNegotiable] = useState(false);
  const [onlyInstantBook, setOnlyInstantBook] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMapView, setShowMapView] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  // Sync with URL params
  useEffect(() => {
    if (districtParam) setSelectedDistrict(districtParam);
    if (typeParam) setSelectedType(typeParam);
  }, [districtParam, typeParam]);

  // Shimmer effect on filter change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedDistrict, selectedType, maxPrice, minBedrooms, onlyNegotiable, onlyInstantBook, selectedAmenities, sortBy]);

  const allAmenities = [
    'Infinity swimming pool',
    '100% Solar backup & generator',
    'High-speed Fiber Wi-Fi (150 Mbps)',
    '24/7 Gated security guard',
    'Chef on request',
    'Lake Victoria direct view',
    'Dedicated workspace desk',
    'Air conditioning',
  ];

  const propertyTypes = ['All', 'Villa', 'Apartment', 'Lakeside', 'Long Stay', 'Studio', 'Safari Lodge', 'Hilltop Cottage'];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const clearAllFilters = () => {
    setSelectedDistrict('');
    setSelectedType('');
    setMaxPrice(1000000);
    setMinBedrooms(0);
    setOnlyNegotiable(false);
    setOnlyInstantBook(false);
    setSelectedAmenities([]);
    setSearchQuery('');
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return state.properties
      .filter((prop) => {
        if (selectedDistrict && prop.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
          return false;
        }
        if (selectedType && selectedType !== 'All' && prop.type !== selectedType) {
          return false;
        }
        if (prop.pricePerNight > maxPrice) {
          return false;
        }
        if (minBedrooms > 0 && prop.bedrooms < minBedrooms) {
          return false;
        }
        if (onlyNegotiable && !prop.isNegotiable) {
          return false;
        }
        if (onlyInstantBook && !prop.isInstantBook) {
          return false;
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = prop.title.toLowerCase().includes(q);
          const matchDistrict = prop.district.toLowerCase().includes(q);
          const matchDesc = prop.description.toLowerCase().includes(q);
          if (!matchTitle && !matchDistrict && !matchDesc) return false;
        }
        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((a) =>
            prop.amenities.some((pAmenity) => pAmenity.toLowerCase().includes(a.toLowerCase()))
          );
          if (!hasAll) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
        if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // recommended
      });
  }, [
    state.properties,
    selectedDistrict,
    selectedType,
    maxPrice,
    minBedrooms,
    onlyNegotiable,
    onlyInstantBook,
    searchQuery,
    selectedAmenities,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[#6B7A73] mb-1">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span>Uganda Stays</span>
            {selectedDistrict && (
              <>
                <span>/</span>
                <span className="text-[#0E6B50] font-semibold">{selectedDistrict}</span>
              </>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F1A17]">
            {selectedDistrict ? `Stays in ${selectedDistrict}` : 'Explore All Stays in Uganda'}
          </h1>
          <p className="text-xs text-[#6B7A73] mt-1">
            Showing {filteredProperties.length} verified properties with direct host negotiation.
          </p>
        </div>

        {/* Filter Toolbar Bar */}
        <div className="bg-white rounded-2xl p-4 border border-[#0F1A17]/8 shadow-2xs mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A73]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search villas, pools, Kololo, Jinja..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/10 focus:outline-hidden focus:border-[#0E6B50]"
              />
            </div>

            {/* Quick District Selector */}
            <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setSelectedDistrict('')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  !selectedDistrict
                    ? 'bg-[#0E6B50] text-white'
                    : 'bg-[#FAF7F2] text-[#0F1A17] hover:bg-[#F1EBE1]'
                }`}
              >
                All Uganda
              </button>
              {ugandaDistricts.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDistrict(d.name)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    selectedDistrict === d.name
                      ? 'bg-[#0E6B50] text-white'
                      : 'bg-[#FAF7F2] text-[#0F1A17] hover:bg-[#F1EBE1]'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>

            {/* Controls: Filter modal, Map toggle, Grid toggle, Sort */}
            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#0F1A17]/10 text-[#0F1A17]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Map Toggle */}
              <button
                type="button"
                onClick={() => setShowMapView(!showMapView)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                  showMapView
                    ? 'bg-[#0E6B50] text-white border-[#0E6B50]'
                    : 'bg-[#FAF7F2] text-[#0F1A17] border-[#0F1A17]/10 hover:bg-[#F1EBE1]'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{showMapView ? 'Hide Map' : 'Map View'}</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#0F1A17]/10 text-[#0F1A17] appearance-none pr-8 cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7A73]" />
              </div>
            </div>
          </div>

          {/* Secondary Filter Row: Types, Negotiable, Instant Book */}
          <div className="hidden lg:flex items-center justify-between pt-3 border-t border-[#0F1A17]/5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A73]">Stay Type:</span>
              <div className="flex items-center gap-1">
                {propertyTypes.slice(0, 5).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type === 'All' ? '' : type)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      (selectedType === type || (!selectedType && type === 'All'))
                        ? 'bg-[#0F1A17] text-white'
                        : 'bg-[#FAF7F2] text-[#6B7A73] hover:text-[#0F1A17]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-[#0F1A17]">
                <input
                  type="checkbox"
                  checked={onlyNegotiable}
                  onChange={(e) => setOnlyNegotiable(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#0E6B50] rounded"
                />
                <Tag className="w-3 h-3 text-[#D9643A]" />
                <span>Negotiable Only</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-[#0F1A17]">
                <input
                  type="checkbox"
                  checked={onlyInstantBook}
                  onChange={(e) => setOnlyInstantBook(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#0E6B50] rounded"
                />
                <Zap className="w-3 h-3 text-[#F2A541]" />
                <span>Instant Book</span>
              </label>

              {(selectedDistrict || selectedType || onlyNegotiable || onlyInstantBook || searchQuery) && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-[11px] text-[#D9643A] hover:underline font-bold"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout: Split or full-width based on showMapView */}
        <div className={`grid gap-8 ${showMapView ? 'lg:grid-cols-12' : 'grid-cols-1'}`}>
          {/* Main Listings Grid */}
          <div className={showMapView ? 'lg:col-span-7' : 'w-full'}>
            {isLoading ? (
              <div className={`grid gap-6 ${showMapView ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                {[...Array(6)].map((_, i) => (
                  <SkeletonPropertyCard key={i} />
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#0F1A17]/8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#F1EBE1] flex items-center justify-center text-[#6B7A73] mx-auto">
                  <Search className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#0F1A17]">No properties matched your criteria</h3>
                <p className="text-xs text-[#6B7A73] max-w-sm mx-auto">
                  Try broadening your price range or district filters to view available stays in Uganda.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${showMapView ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                {filteredProperties.map((prop) => (
                  <div
                    key={prop.id}
                    onMouseEnter={() => setHoveredPinId(prop.id)}
                    onMouseLeave={() => setHoveredPinId(null)}
                  >
                    <PropertyCard property={prop} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Stylized Map View Panel (SVG/CSS map without external keys) */}
          {showMapView && (
            <div className="lg:col-span-5 sticky top-24 h-[calc(100vh-140px)] rounded-3xl overflow-hidden border border-[#0F1A17]/10 bg-[#E8E1D5] shadow-lg relative flex flex-col">
              <div className="p-4 bg-white/90 backdrop-blur-md border-b border-[#0F1A17]/8 flex items-center justify-between text-xs font-semibold z-10">
                <span className="flex items-center gap-1.5 text-[#0F1A17]">
                  <MapPin className="w-4 h-4 text-[#0E6B50]" />
                  <span>Uganda Regional Map</span>
                </span>
                <span className="text-[11px] text-[#6B7A73]">{filteredProperties.length} pins active</span>
              </div>

              {/* Stylized Map Canvas */}
              <div className="relative flex-1 bg-[#d8cfbe] overflow-hidden flex items-center justify-center">
                {/* Stylized Lake Victoria representation */}
                <svg
                  viewBox="0 0 500 500"
                  className="w-full h-full opacity-65 absolute inset-0 pointer-events-none"
                >
                  {/* Topography contours */}
                  <path
                    d="M50 100 Q150 50 250 80 T450 120 L480 350 Q300 420 150 380 Z"
                    fill="#E2DACF"
                    stroke="#D0C6B8"
                    strokeWidth="2"
                  />
                  {/* Lake Victoria water mass */}
                  <path
                    d="M260 280 C320 280, 420 300, 440 380 C440 440, 360 480, 280 460 C240 430, 230 350, 260 280 Z"
                    fill="#B3D0C6"
                    opacity="0.8"
                  />
                  {/* River Nile flow */}
                  <path
                    d="M320 280 Q330 200 310 150 T280 50"
                    fill="none"
                    stroke="#B3D0C6"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Lake Albert */}
                  <path
                    d="M80 140 Q110 180 140 260"
                    fill="none"
                    stroke="#B3D0C6"
                    strokeWidth="14"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>

                {/* Map Pins positioned over coordinates */}
                <div className="absolute inset-0 p-8">
                  {filteredProperties.map((prop, idx) => {
                    // Normalize lat/long roughly into canvas 0-100%
                    // Uganda lat ranges roughly from -1.4 to 4.0; lng from 29.5 to 35.0
                    const latNorm = prop.coordinates
                      ? 100 - ((prop.coordinates.lat + 1.2) / 4.2) * 100
                      : 40 + (idx % 4) * 12;
                    const lngNorm = prop.coordinates
                      ? ((prop.coordinates.lng - 29.8) / 4.5) * 100
                      : 35 + (idx % 5) * 10;

                    const isHovered = hoveredPinId === prop.id;

                    return (
                      <div
                        key={prop.id}
                        style={{
                          top: `${Math.max(10, Math.min(88, latNorm))}%`,
                          left: `${Math.max(10, Math.min(88, lngNorm))}%`,
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                      >
                        <Link
                          to={`/property/${prop.id}`}
                          className={`px-2 py-1 rounded-full text-[11px] font-bold shadow-md transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                            isHovered
                              ? 'bg-[#0E6B50] text-white scale-110 ring-4 ring-[#0E6B50]/30'
                              : 'bg-white text-[#0F1A17] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          <span className="tabular-nums">
                            {formatUGX(prop.pricePerNight).replace('UGX ', '')}
                          </span>
                        </Link>

                        {/* Hover Popup card on map pin */}
                        <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-xl shadow-xl p-2 z-30 pointer-events-none border border-[#0F1A17]/10">
                          <SafeImage
                            src={prop.images[0]}
                            alt={prop.title}
                            fallbackSeed={prop.id}
                            className="w-full h-24 object-cover rounded-lg mb-1.5"
                          />
                          <p className="font-serif font-bold text-xs text-[#0F1A17] line-clamp-1">{prop.title}</p>
                          <p className="text-[10px] text-[#0E6B50] font-bold">{formatUGX(prop.pricePerNight)}/night</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-h-[85vh] bg-[#FAF7F2] text-[#0F1A17] rounded-t-3xl shadow-2xl overflow-y-auto p-6 space-y-6 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#0F1A17]/10">
                <h3 className="font-serif font-bold text-lg text-[#0F1A17]">Filter Stays</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-[#6B7A73]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* District Filter */}
              <div>
                <label className="text-xs font-bold text-[#0F1A17] block mb-2">District</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedDistrict('')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      !selectedDistrict ? 'bg-[#0E6B50] text-white' : 'bg-white text-[#0F1A17]'
                    }`}
                  >
                    All Uganda
                  </button>
                  {ugandaDistricts.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDistrict(d.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        selectedDistrict === d.name ? 'bg-[#0E6B50] text-white' : 'bg-white text-[#0F1A17]'
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#0F1A17]">Max Rate / Night</label>
                  <span className="font-bold text-xs tabular-nums text-[#0E6B50]">{formatUGX(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={1000000}
                  step={50000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#0E6B50]"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#0F1A17]/10 flex gap-3">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="flex-1 py-3 rounded-xl font-bold text-xs text-[#0F1A17] bg-white border border-[#0F1A17]/15"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-xs text-white gradient-cta shadow-md"
                >
                  Show {filteredProperties.length} Stays
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
