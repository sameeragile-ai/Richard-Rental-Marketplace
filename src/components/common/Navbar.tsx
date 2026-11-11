import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  PlusCircle,
  User,
  Compass,
  CalendarCheck,
  Building2,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const { state, dispatch, activeCountry } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (totalScroll > 0) {
        setScrollProgress((currentScrollY / totalScroll) * 100);
      }

      setIsScrolled(currentScrollY > 40);

      // Smart sticky logic
      if (currentScrollY > 180) {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 8) {
          // Scrolling down fast
          setIsVisible(false);
        } else if (lastScrollY - currentScrollY > 5) {
          // Scrolling up
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCountryDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Explore', href: '/explore' },
    { label: 'Long Stays', href: '/explore?type=Long+Stay' },
    { label: 'Become a Host', href: '/host' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Architecture', href: '/architecture' },
  ];

  // Visual appearance
  // When over hero and not scrolled: transparent with white text
  // When scrolled or not on home: frosted glass with dark text
  const isLightModeHeader = !isHomePage || isScrolled;

  const totalCartCount = state.cart.length;
  const savedCount = state.savedPropertyIds.length;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isLightModeHeader
            ? 'bg-[#FAF7F2]/85 backdrop-blur-xl border-b border-[#0F1A17]/8 shadow-xs text-[#0F1A17]'
            : 'bg-transparent text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              isLightModeHeader ? 'h-[68px]' : 'h-[84px]'
            }`}
          >
            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-hidden"
              aria-label="Richard Rental Marketplace Home"
            >
              <div
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm ${
                  isLightModeHeader
                    ? 'bg-gradient-to-br from-[#0E6B50] to-[#0B3D2E] text-white'
                    : 'bg-white/15 backdrop-blur-md border border-white/25 text-white'
                }`}
              >
                <svg
                  viewBox="0 0 40 40"
                  className="w-6 h-6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 7 L32 17 L29 17 L29 32 L11 32 L11 17 L8 17 Z"
                    stroke={isLightModeHeader ? '#FAF7F2' : '#FFFFFF'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text
                    x="20"
                    y="27"
                    textAnchor="middle"
                    fontFamily="'Fraunces', Georgia, serif"
                    fontSize="16"
                    fontWeight="700"
                    fill={isLightModeHeader ? '#FAF7F2' : '#FFFFFF'}
                  >
                    R
                  </text>
                </svg>
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-serif text-2xl font-bold tracking-tight leading-none ${
                    isLightModeHeader ? 'text-[#0F1A17]' : 'text-white'
                  }`}
                >
                  Richard
                </span>
                <span
                  className={`text-[9px] font-bold tracking-[0.22em] uppercase mt-0.5 ${
                    isLightModeHeader ? 'text-[#0E6B50]' : 'text-[#F2A541]'
                  }`}
                >
                  RENTALS
                </span>
              </div>
            </Link>

            {/* Center Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-1" onMouseLeave={() => setHoveredLink(null)}>
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.href ||
                  (link.href.startsWith('/#') && location.pathname === '/' && location.hash === link.href.substring(1));

                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    onMouseEnter={() => setHoveredLink(link.label)}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded-lg ${
                      isLightModeHeader
                        ? isActive
                          ? 'text-[#0E6B50] font-semibold'
                          : 'text-[#0F1A17]/80 hover:text-[#0F1A17]'
                        : isActive
                        ? 'text-[#F2A541] font-semibold'
                        : 'text-white/85 hover:text-white'
                    }`}
                  >
                    {link.label}

                    {/* Animated Sliding Pill / Indicator */}
                    {(hoveredLink === link.label || (isActive && !hoveredLink)) && (
                      <motion.div
                        layoutId="navPill"
                        className={`absolute inset-0 rounded-lg -z-10 ${
                          isLightModeHeader ? 'bg-[#0E6B50]/10' : 'bg-white/15 backdrop-blur-xs'
                        }`}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Zone Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Country Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    isLightModeHeader
                      ? 'border-[#0F1A17]/10 bg-[#FAF7F2] hover:bg-[#F1EBE1] text-[#0F1A17]'
                      : 'border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
                  }`}
                  aria-expanded={countryDropdownOpen}
                >
                  <span className="text-base">{activeCountry.flag}</span>
                  <span className="tabular-nums font-bold">{activeCountry.code} · {activeCountry.currency}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                <AnimatePresence>
                  {countryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 rounded-xl bg-white text-[#0F1A17] shadow-xl border border-[#0F1A17]/10 p-2 z-50 overflow-hidden"
                    >
                      <div className="px-3 py-2 border-b border-[#0F1A17]/5 mb-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7A73]">
                          Choose Country & Currency
                        </p>
                      </div>

                      <div className="space-y-1">
                        {state.countries.map((country) => (
                          <button
                            key={country.id}
                            type="button"
                            disabled={!country.isLive}
                            onClick={() => {
                              if (country.isLive) {
                                dispatch({ type: 'SET_ACTIVE_COUNTRY', payload: country.code });
                                setCountryDropdownOpen(false);
                              }
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left ${
                              country.code === activeCountry.code
                                ? 'bg-[#0E6B50]/10 text-[#0E6B50] font-bold'
                                : country.isLive
                                ? 'hover:bg-[#F1EBE1] text-[#0F1A17]'
                                : 'opacity-45 cursor-not-allowed bg-slate-50 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">{country.flag}</span>
                              <div>
                                <p className="font-medium text-xs leading-tight">{country.name}</p>
                                <span className="text-[10px] text-[#6B7A73]">
                                  {country.currency} ({country.currencySymbol})
                                </span>
                              </div>
                            </div>
                            {country.code === activeCountry.code ? (
                              <Check className="w-4 h-4 text-[#0E6B50]" />
                            ) : country.isLive ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                                Live
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                                Soon
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="mt-2 pt-2 border-t border-[#0F1A17]/5 text-center">
                        <Link
                          to="/admin"
                          className="text-[11px] text-[#0E6B50] hover:underline font-semibold block py-1"
                        >
                          Configure African Markets in Admin →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Saved / Wishlist Icon */}
              <Link
                to="/trips?tab=saved"
                className={`relative p-2 rounded-lg transition-colors ${
                  isLightModeHeader
                    ? 'hover:bg-[#F1EBE1] text-[#0F1A17]'
                    : 'hover:bg-white/15 text-white'
                }`}
                aria-label="View saved properties"
              >
                <Heart className={`w-5 h-5 ${savedCount > 0 ? 'fill-[#D9643A] text-[#D9643A]' : ''}`} />
                {savedCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#D9643A] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {savedCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={onOpenCart}
                className={`relative p-2 rounded-lg transition-colors ${
                  isLightModeHeader
                    ? 'hover:bg-[#F1EBE1] text-[#0F1A17]'
                    : 'hover:bg-white/15 text-white'
                }`}
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-cta text-white text-[10px] font-bold flex items-center justify-center shadow-xs tabular-nums"
                  >
                    {totalCartCount}
                  </motion.span>
                )}
              </button>

              {/* User Avatar / Role link */}
              <Link
                to={state.currentRole === 'admin' ? '/admin' : state.currentRole === 'landlord' ? '/host' : '/trips'}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isLightModeHeader
                    ? 'text-[#0F1A17] hover:bg-[#F1EBE1]'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="capitalize">{state.currentRole === 'guest' ? 'My Trips' : state.currentRole}</span>
              </Link>

              {/* Primary CTA Button: "List your property" */}
              <Link
                to="/host"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-cta hover:opacity-95 shadow-xs transition-transform active:scale-98"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List your property</span>
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  isLightModeHeader
                    ? 'text-[#0F1A17] hover:bg-[#F1EBE1]'
                    : 'text-white hover:bg-white/15'
                }`}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="w-full h-[2px] bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-[#F2A541] via-[#D9643A] to-[#0E6B50] transition-all duration-75"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* Full-Screen Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-gradient-to-b from-[#0B3D2E] via-[#0E6B50] to-[#0F1A17] text-white p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              {/* Header inside mobile menu */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center font-serif font-bold text-lg">
                    R
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold">Richard</h2>
                    <p className="text-[9px] tracking-widest text-[#F2A541] uppercase">RENTALS</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Large Nav Links */}
              <div className="space-y-4">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * idx }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block font-serif text-2xl font-bold text-white hover:text-[#F2A541] transition-colors py-2"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 border-t border-white/10"
                >
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-[#F2A541] font-semibold py-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Admin Control Center</span>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Bottom Actions inside mobile drawer */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Selected Country</span>
                <span className="font-semibold flex items-center gap-1.5">
                  <span>{activeCountry.flag}</span>
                  <span>{activeCountry.name} ({activeCountry.currency})</span>
                </span>
              </div>

              <Link
                to="/host"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-center font-bold text-white gradient-cta shadow-md"
              >
                <PlusCircle className="w-5 h-5" />
                <span>List your property in {activeCountry.name}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
