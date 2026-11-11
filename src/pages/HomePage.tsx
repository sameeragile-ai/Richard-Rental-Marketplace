import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Calendar,
  Users,
  ShieldCheck,
  Smartphone,
  Tag,
  WifiOff,
  ChevronDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  Sparkles,
  MapPin,
  TrendingUp,
  Percent,
  Home,
  Waves,
  Building,
  Key,
  Flame,
  ArrowDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/common/PropertyCard';
import { ugandaDistricts } from '../data/districts';
import { formatUGX, formatUSD } from '../utils/format';
import { SafeImage } from '../components/common/SafeImage';

export const HomePage: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  // Hero Background Crossfader
  const heroImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=85',
  ];
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Search State
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showGuestsPopover, setShowGuestsPopover] = useState(false);

  // Live offer notification animation
  const [liveOfferVisible, setLiveOfferVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLiveOfferVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDistrict) params.set('district', selectedDistrict);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests > 1) params.set('guests', guests.toString());
    navigate(`/explore?${params.toString()}`);
  };

  const featuredProperties = state.properties.slice(0, 6);

  const stayTypes = [
    { label: 'Private Villas', type: 'Villa', icon: Home, count: '14 stays', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80' },
    { label: 'Lakeside & River', type: 'Lakeside', icon: Waves, count: '8 stays', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' },
    { label: 'City Lofts & Suites', type: 'Apartment', icon: Building, count: '22 stays', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80' },
    { label: 'Long Stays (1mo+)', type: 'Long Stay', icon: Key, count: '11 stays', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80' },
    { label: 'Safari & Crater Lodges', type: 'Safari Lodge', icon: Flame, count: '6 stays', image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=600&q=80' },
  ];

  const testimonials = [
    {
      quote: "Negotiated 20% off our Kololo villa for a 10-day family reunion. Paid 30% via MTN MoMo and the balance at check-in. Seamless, professional, and transparent.",
      author: "Julius & Brenda Kato",
      role: "Travelers from Nairobi",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      stayTitle: "Kololo Hillside Villa",
    },
    {
      quote: "As a landlord with three properties in Entebbe, Richard keeps my calendar full without charging the extortionate 20% fee other portals demand. The MoMo deposit arrives instantly.",
      author: "David Mukasa",
      role: "Superhost · 4 Properties",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      stayTitle: "Munyonyo Waterfront",
    },
    {
      quote: "The offline mode was a lifesaver when our mobile signal dropped driving past Fort Portal. We had our host directions and booking confirmation right on our home screen.",
      author: "Sarah Lindqvist",
      role: "Expedition Filmmaker",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      stayTitle: "Fort Portal Crater Lodge",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#FAF7F2]">
      {/* =====================================================
          1. FULL-VIEWPORT HERO SECTION
          ===================================================== */}
      <section className="relative w-full min-h-[100svh] flex flex-col justify-between pt-24 pb-12 overflow-hidden bg-[#0F1A17]">
        {/* Crossfading Ken Burns Background Images */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {heroImages.map((img, idx) => (
            <motion.div
              key={img}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{
                opacity: idx === heroIndex ? 1 : 0,
                scale: idx === heroIndex ? 1.08 : 1.02,
              }}
              transition={{
                opacity: { duration: 1.5, ease: 'easeInOut' },
                scale: { duration: 8, ease: 'easeOut' },
              }}
              className="absolute inset-0"
            >
              <SafeImage
                src={img}
                alt="Luxury African Stays"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          ))}

          {/* Dark luxury gradient scrim overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A17] via-[#0F1A17]/60 to-[#0B3D2E]/40" />
        </div>

        {/* Hero Content Area */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12">
          <div className="max-w-3xl">
            {/* Top Market Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold tracking-wider uppercase mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#1F9D6B] animate-pulse" />
              <span>NOW LIVE IN UGANDA · KENYA, RWANDA & GHANA NEXT</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6 text-balance"
            >
              Find your place.{' '}
              <span className="text-gradient-amber">Name your price.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-white/85 max-w-2xl font-light leading-relaxed mb-8"
            >
              Book verified homes across Uganda, and negotiate directly with landlords.
              Pay a small deposit with Mobile Money and the rest on arrival.
            </motion.p>
          </div>

          {/* Floating Glassmorphism Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full max-w-4xl bg-white/95 backdrop-blur-2xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/30 text-[#0F1A17]"
          >
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Location autocomplete */}
              <div className="relative sm:col-span-4 border-b sm:border-b-0 sm:border-r border-[#0F1A17]/10 pb-3 sm:pb-0 px-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7A73]">
                  Location / District
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-[#0E6B50] shrink-0" />
                  <input
                    type="text"
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setShowLocationDropdown(true);
                    }}
                    onFocus={() => setShowLocationDropdown(true)}
                    placeholder="Kampala, Entebbe, Jinja..."
                    className="w-full text-xs font-semibold bg-transparent focus:outline-hidden placeholder:text-[#6B7A73]/70"
                  />
                  {selectedDistrict && (
                    <button
                      type="button"
                      onClick={() => setSelectedDistrict('')}
                      className="text-[#6B7A73] hover:text-[#0F1A17] text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* District Dropdown Suggestions */}
                <AnimatePresence>
                  {showLocationDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-[#0F1A17]/10 p-2 z-50 max-h-56 overflow-y-auto"
                    >
                      <div className="text-[10px] font-bold text-[#6B7A73] px-3 py-1.5 uppercase">
                        Popular Uganda Stays
                      </div>
                      {ugandaDistricts.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => {
                            setSelectedDistrict(d.name);
                            setShowLocationDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-[#F1EBE1] flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-[#0F1A17]">{d.name}</span>
                            <span className="text-[10px] text-[#6B7A73] block">{d.region} Uganda</span>
                          </div>
                          <span className="text-[10px] text-[#0E6B50] font-semibold">{d.listingCount} homes</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dates */}
              <div className="sm:col-span-5 border-b sm:border-b-0 sm:border-r border-[#0F1A17]/10 pb-3 sm:pb-0 px-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7A73]">
                  Dates
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0E6B50] shrink-0" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-xs font-semibold bg-transparent focus:outline-hidden text-[#0F1A17]"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#6B7A73]">to</span>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-xs font-semibold bg-transparent focus:outline-hidden text-[#0F1A17]"
                    />
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div className="relative sm:col-span-3 px-3 flex items-center justify-between">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7A73]">
                    Guests
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowGuestsPopover(!showGuestsPopover)}
                    className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-[#0F1A17]"
                  >
                    <Users className="w-3.5 h-3.5 text-[#0E6B50]" />
                    <span>{guests} {guests === 1 ? 'guest' : 'guests'}</span>
                    <ChevronDown className="w-3 h-3 text-[#6B7A73]" />
                  </button>

                  <AnimatePresence>
                    {showGuestsPopover && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute bottom-full sm:bottom-auto sm:top-full right-0 mt-2 p-4 bg-white rounded-2xl shadow-xl border border-[#0F1A17]/10 z-50 w-48 space-y-3"
                      >
                        <span className="text-xs font-bold text-[#0F1A17] block">Select Guests</span>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-8 h-8 rounded-lg bg-[#F1EBE1] font-bold flex items-center justify-center hover:bg-[#FAF7F2]"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold tabular-nums">{guests}</span>
                          <button
                            type="button"
                            onClick={() => setGuests(guests + 1)}
                            className="w-8 h-8 rounded-lg bg-[#0E6B50] text-white font-bold flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  className="py-3 px-5 rounded-2xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>
          </motion.div>

          {/* Trust Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 text-xs text-white/80"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F2A541]" />
              <span>Verified Landlords</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#F2A541]" />
              <span>MTN & Airtel MoMo</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#F2A541]" />
              <span>Offer-Based Pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-[#F2A541]" />
              <span>Works Offline (PWA)</span>
            </div>
          </motion.div>
        </div>

        {/* Floating "Live Offer" Card Bottom-Right */}
        <AnimatePresence>
          {liveOfferVisible && (
            <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: 'spring', damping: 20 }}
              className="hidden md:flex absolute bottom-8 right-8 z-20 items-center gap-3 p-3.5 pr-5 bg-white/95 backdrop-blur-md text-[#0F1A17] rounded-2xl shadow-2xl border border-white/40 max-w-sm"
            >
              <div className="relative">
                <SafeImage
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                  alt="Grace"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#0E6B50]"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#0F1A17]">Grace accepted an offer</p>
                <p className="text-[11px] text-[#6B7A73]">
                  Offered <strong className="text-[#0E6B50] font-bold">UGX 160,000</strong> on Kololo Villa
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll-down cue */}
        <div className="relative z-10 flex flex-col items-center justify-center text-white/50 text-[11px] uppercase tracking-widest">
          <span className="mb-1">Scroll to explore</span>
          <ArrowDown className="w-4 h-4 animate-bounce text-[#F2A541]" />
        </div>
      </section>

      {/* =====================================================
          2. STATS STRIP
          ===================================================== */}
      <section className="bg-white border-y border-[#0F1A17]/8 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#0E6B50] tabular-nums">
                1,240+
              </p>
              <p className="text-xs text-[#6B7A73] uppercase tracking-wider font-semibold">
                Verified Homes
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#0F1A17] tabular-nums">
                38
              </p>
              <p className="text-xs text-[#6B7A73] uppercase tracking-wider font-semibold">
                Uganda Districts
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#F2A541] tabular-nums">
                4.92 / 5
              </p>
              <p className="text-xs text-[#6B7A73] uppercase tracking-wider font-semibold">
                Average Guest Rating
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#D9643A] tabular-nums">
                74%
              </p>
              <p className="text-xs text-[#6B7A73] uppercase tracking-wider font-semibold">
                Of Offers Accepted
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          3. FEATURED STAYS SNAP CAROUSEL
          ===================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E6B50]">
              CURATED COLLECTION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F1A17] mt-1">
              Featured Stays in Uganda
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7A73] mt-1">
              Handpicked luxury estates, waterfront suites, and scenic hillside lofts with direct landlord negotiation.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E6B50] hover:text-[#0B3D2E] transition-colors shrink-0"
          >
            <span>View all 16+ verified homes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid of properties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* =====================================================
          4. BROWSE BY DISTRICT
          ===================================================== */}
      <section className="py-16 bg-[#F1EBE1]/60 border-y border-[#0F1A17]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E6B50]">
              DESTINATIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F1A17] mt-1">
              Browse by District
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7A73] mt-1">
              From the seven hills of Kampala to the mist-shrouded crater lakes of Fort Portal.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ugandaDistricts.map((d) => (
              <Link
                key={d.id}
                to={`/explore?district=${encodeURIComponent(d.name)}`}
                className="group relative rounded-2xl overflow-hidden aspect-3/4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
              >
                <SafeImage
                  src={d.image}
                  alt={d.name}
                  fallbackSeed={`district-${d.id}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif font-bold text-base leading-tight">{d.name}</h3>
                  <span className="text-[11px] text-white/80 tabular-nums">{d.listingCount} properties</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          5. HOW NEGOTIATION WORKS (4-STEP TIMELINE)
          ===================================================== */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9643A]">
            DIRECT NEGOTIATION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F1A17] mt-1">
            How Naming Your Price Works
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7A73] mt-2">
            No rigid algorithms. Real human hospitality and transparent pricing agreed between you and the host.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs relative">
            <div className="w-12 h-12 rounded-2xl bg-[#0E6B50]/10 text-[#0E6B50] flex items-center justify-center font-serif text-xl font-bold mb-6">
              01
            </div>
            <h3 className="font-serif font-bold text-lg text-[#0F1A17] mb-2">Choose your dates</h3>
            <p className="text-xs text-[#6B7A73] leading-relaxed">
              Select your check-in and check-out days. Review calendar availability and listed host rates in UGX.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs relative">
            <div className="w-12 h-12 rounded-2xl bg-[#F2A541]/15 text-[#D9643A] flex items-center justify-center font-serif text-xl font-bold mb-6">
              02
            </div>
            <h3 className="font-serif font-bold text-lg text-[#0F1A17] mb-2">Make your offer</h3>
            <p className="text-xs text-[#6B7A73] leading-relaxed">
              Use the price slider to propose your rate per night. Add a friendly note explaining your stay purpose.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs relative">
            <div className="w-12 h-12 rounded-2xl bg-[#0E6B50]/10 text-[#0E6B50] flex items-center justify-center font-serif text-xl font-bold mb-6">
              03
            </div>
            <h3 className="font-serif font-bold text-lg text-[#0F1A17] mb-2">Host accepts or counters</h3>
            <p className="text-xs text-[#6B7A73] leading-relaxed">
              Verified landlords typically respond in under 30 minutes via WhatsApp or SMS with acceptance or an honest counter.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1F9D6B] flex items-center justify-center font-serif text-xl font-bold mb-6">
              04
            </div>
            <h3 className="font-serif font-bold text-lg text-[#0F1A17] mb-2">Pay 30% via MoMo</h3>
            <p className="text-xs text-[#6B7A73] leading-relaxed">
              Confirm your booking instantly with MTN or Airtel Mobile Money. Pay the remaining 70% in cash or MoMo on arrival.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          6. STAY TYPES
          ===================================================== */}
      <section className="py-16 bg-white border-y border-[#0F1A17]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E6B50]">
                CATEGORIES
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#0F1A17] mt-1">
                Explore by Stay Type
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stayTypes.map((st) => {
              const IconComp = st.icon;
              return (
                <Link
                  key={st.type}
                  to={`/explore?type=${encodeURIComponent(st.type)}`}
                  className="group relative rounded-2xl overflow-hidden aspect-4/5 shadow-2xs hover:shadow-lg transition-all duration-300 block"
                >
                  <SafeImage
                    src={st.image}
                    alt={st.label}
                    fallbackSeed={`stay-${st.type}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <IconComp className="w-5 h-5 text-[#F2A541] mb-1" />
                    <h3 className="font-serif font-bold text-sm leading-tight">{st.label}</h3>
                    <span className="text-[10px] text-white/80">{st.count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          7. PAYMENT PARTNERS STRIP
          ===================================================== */}
      <section className="py-12 bg-[#FAF7F2] border-b border-[#0F1A17]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B7A73] mb-6">
            Supported Payment Methods in Uganda
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <div className="px-5 py-3 rounded-2xl bg-white border border-[#0F1A17]/10 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F2A541] text-[#0F1A17] font-extrabold flex items-center justify-center text-xs">
                MTN
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F1A17]">MTN Mobile Money</p>
                <p className="text-[10px] text-[#6B7A73]">Instant *165# Push Prompt</p>
              </div>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-white border border-[#0F1A17]/10 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D9643A] text-white font-extrabold flex items-center justify-center text-xs">
                AM
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F1A17]">Airtel Money</p>
                <p className="text-[10px] text-[#6B7A73]">Instant *185# USSD Prompt</p>
              </div>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-white border border-[#0F1A17]/10 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0E6B50] text-white font-bold flex items-center justify-center text-xs">
                VISA
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F1A17]">Visa & Mastercard</p>
                <p className="text-[10px] text-[#6B7A73]">International 3D Secure</p>
              </div>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-white border border-[#0F1A17]/10 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0B3D2E] text-white font-bold flex items-center justify-center text-xs">
                EFT
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F1A17]">Bank Transfer</p>
                <p className="text-[10px] text-[#6B7A73]">Stanbic & Standard Chartered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          8. HOST CTA BAND ON FOREST GRADIENT
          ===================================================== */}
      <section className="py-20 bg-gradient-to-br from-[#0E6B50] via-[#0B3D2E] to-[#0F1A17] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2A541]">
                BECOME A VERIFIED HOST
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                Earn from your property. Keep up to 90%.
              </h2>
              <p className="text-sm sm:text-base text-white/80 font-light max-w-xl leading-relaxed">
                List your residential home, lakeside retreat or serviced apartment on Uganda’s fastest-growing marketplace. You control your minimum acceptable rate and get direct deposit settlements.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
                <div>
                  <p className="font-bold text-lg text-[#F2A541]">10% Flat</p>
                  <p className="text-white/70">Commission only when you earn</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-[#F2A541]">Direct MoMo</p>
                  <p className="text-white/70">Instant guest deposit payout</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-[#F2A541]">iCal Sync</p>
                  <p className="text-white/70">Auto-blocks Airbnb & Booking</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/host"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white gradient-cta hover:opacity-95 shadow-lg transition-transform active:scale-98"
                >
                  <span>Start Hosting in Uganda</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 aspect-4/3">
                <SafeImage
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                  alt="Host Villa in Kampala"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md text-[#0F1A17]">
                  <p className="font-serif font-bold text-sm">David & Sarah Mukasa</p>
                  <p className="text-[11px] text-[#6B7A73]">Earned UGX 14.8M last month on Kololo Villa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          9. TESTIMONIALS CAROUSEL
          ===================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E6B50]">
            TESTIMONIALS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F1A17] mt-1">
            Loved by Guests and Landlords
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-[#0F1A17]/8 shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#F2A541]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#0F1A17] leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-[#0F1A17]/6 mt-6">
                <SafeImage
                  src={t.avatar}
                  alt={t.author}
                  fallbackSeed={`avatar-${idx}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#0F1A17]">{t.author}</h4>
                  <p className="text-[10px] text-[#6B7A73]">{t.role} · {t.stayTitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          10. EXPANDING ACROSS AFRICA
          ===================================================== */}
      <section className="py-20 bg-[#F1EBE1]/70 border-t border-[#0F1A17]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9643A]">
                PAN-AFRICAN VISION
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F1A17]">
                Expanding Across East & West Africa
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7A73] leading-relaxed">
                Richard's database architecture was engineered from day one to scale across Africa. Each country configures its own address hierarchies, currency units, mobile money integrations, and commission sequences without altering core code.
              </p>

              <div className="space-y-3 pt-2">
                {state.countries.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#0F1A17]/8 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <h4 className="font-bold text-[#0F1A17]">{c.name}</h4>
                        <span className="text-[11px] text-[#6B7A73]">
                          {c.currency} ({c.currencySymbol}) · {c.paymentGateways.length} payment gateways
                        </span>
                      </div>
                    </div>

                    {c.isLive ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        LIVE NOW
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        Launching Soon
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to="/admin"
                  className="text-xs font-bold text-[#0E6B50] hover:underline inline-flex items-center gap-1.5"
                >
                  <span>Test country expansion toggle in Admin Panel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Stylized African Map Visual */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md p-8 rounded-3xl bg-white border border-[#0F1A17]/10 shadow-lg text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-[#0E6B50]/10 text-[#0E6B50] flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#0F1A17]">Multi-Country Scalable Engine</h3>
                  <p className="text-xs text-[#6B7A73] mt-2">
                    Dynamic address fields adjust automatically between Uganda’s Regions/Districts, Kenya’s Counties, and Rwanda’s Sectors.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF7F2] rounded-2xl text-left font-mono text-[11px] text-[#0F1A17] space-y-1">
                  <div className="text-[#6B7A73]">// System sequence example:</div>
                  <div className="text-[#0E6B50] font-bold">UG-KLA-P-000124 (Uganda)</div>
                  <div className="text-[#D9643A] font-bold">KE-NBO-P-000042 (Kenya)</div>
                  <div className="text-[#F2A541] font-bold">RW-KGL-P-000019 (Rwanda)</div>
                </div>

                <Link
                  to="/architecture"
                  className="block w-full py-3 px-4 rounded-xl text-center text-xs font-bold text-white gradient-brand hover:opacity-95 shadow-sm"
                >
                  View Technical Entity Diagram →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
