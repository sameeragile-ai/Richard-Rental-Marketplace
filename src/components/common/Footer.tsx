import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Mail, MapPin, Phone, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallPrompt } from './PWAInstallPrompt';

export const Footer: React.FC = () => {
  const { state, dispatch, activeCountry, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast('Subscribed to Richard Journal', 'You will receive monthly curated stay collections.', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#0B3D2E] text-[#FAF7F2] pt-16 pb-24 lg:pb-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Expansion Notice */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center font-serif text-xl font-bold text-[#F2A541]">
                R
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-white">Richard</h3>
                <p className="text-[10px] tracking-[0.2em] font-bold text-[#F2A541] uppercase">RENTAL MARKETPLACE</p>
              </div>
            </div>

            <p className="text-sm text-[#FAF7F2]/80 leading-relaxed max-w-md">
              A bespoke marketplace for verified short and long stays across Uganda, built with direct landlord negotiation and instant Mobile Money deposits.
            </p>

            <div className="pt-2">
              <PWAInstallPrompt variant="footer" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
              <h4 className="font-serif text-xl font-bold text-white mb-2">The East African Host & Traveler Journal</h4>
              <p className="text-xs text-[#FAF7F2]/75 mb-5 max-w-lg">
                Exclusive property debuts, travel itineraries around Lake Victoria and the Nile, and regulatory insights for hospitality investors.
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs focus:outline-hidden focus:border-[#F2A541]"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 transition-opacity shrink-0 flex items-center justify-center gap-2"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-white/10 text-xs text-[#FAF7F2]/75">
          <div>
            <h5 className="font-serif text-sm font-bold text-white mb-4 uppercase tracking-wider">Explore Uganda</h5>
            <ul className="space-y-2.5">
              <li><Link to="/explore?district=Kampala" className="hover:text-white transition-colors">Kampala Hills & Lofts</Link></li>
              <li><Link to="/explore?district=Entebbe" className="hover:text-white transition-colors">Entebbe Lakefront</Link></li>
              <li><Link to="/explore?district=Jinja" className="hover:text-white transition-colors">Jinja Nile Retreats</Link></li>
              <li><Link to="/explore?district=Fort+Portal" className="hover:text-white transition-colors">Fort Portal Crater Lodges</Link></li>
              <li><Link to="/explore?district=Mbarara" className="hover:text-white transition-colors">Mbarara Hilltop Cottages</Link></li>
              <li><Link to="/explore?district=Gulu" className="hover:text-white transition-colors">Gulu Eco-Villas</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-sm font-bold text-white mb-4 uppercase tracking-wider">Stay Categories</h5>
            <ul className="space-y-2.5">
              <li><Link to="/explore?type=Villa" className="hover:text-white transition-colors">Luxury Private Villas</Link></li>
              <li><Link to="/explore?type=Lakeside" className="hover:text-white transition-colors">Lakeside & Riverfront</Link></li>
              <li><Link to="/explore?type=Long+Stay" className="hover:text-white transition-colors">Long-Term Residencies</Link></li>
              <li><Link to="/explore?type=Apartment" className="hover:text-white transition-colors">Executive City Apartments</Link></li>
              <li><Link to="/explore?type=Studio" className="hover:text-white transition-colors">Co-Working Studios</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-sm font-bold text-white mb-4 uppercase tracking-wider">For Landlords</h5>
            <ul className="space-y-2.5">
              <li><Link to="/host" className="hover:text-white transition-colors">List Your Property</Link></li>
              <li><Link to="/host?tab=onboarding" className="hover:text-white transition-colors">Host Verification</Link></li>
              <li><Link to="/host?tab=invoices" className="hover:text-white transition-colors">Commission Invoices</Link></li>
              <li><Link to="/host?tab=channels" className="hover:text-white transition-colors">iCal Channel Sync</Link></li>
              <li><Link to="/architecture" className="hover:text-white transition-colors">System Architecture</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-sm font-bold text-white mb-4 uppercase tracking-wider">Active Markets</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="flex items-center gap-1.5 font-medium text-white">
                  <span>🇺🇬</span> Uganda
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  LIVE
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="flex items-center gap-1.5 opacity-60">
                  <span>🇰🇪</span> Kenya
                </span>
                <span className="text-[10px] text-amber-300 opacity-80">Q1 Launch</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="flex items-center gap-1.5 opacity-60">
                  <span>🇷🇼</span> Rwanda
                </span>
                <span className="text-[10px] text-amber-300 opacity-80">Q1 Launch</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-1.5 opacity-60">
                  <span>🇬🇭</span> Ghana
                </span>
                <span className="text-[10px] text-amber-300 opacity-80">Q2 Launch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F2]/60">
          <p>© 2026 Richard Rental Marketplace Ltd. All rights reserved. Registered in Kampala, Uganda.</p>

          <div className="flex items-center gap-4">
            <Link to="/architecture" className="text-[#F2A541] hover:underline font-semibold">
              Architecture & Data Model Brief
            </Link>
            <span>·</span>
            <Link to="/admin" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
