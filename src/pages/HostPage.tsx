import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  KeyRound,
  PlusCircle,
  FileText,
  Upload,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
  AlertCircle,
  Smartphone,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX, formatUSD, generatePropertyId } from '../utils/format';
import { Property, Landlord } from '../types';
import { SafeImage } from '../components/common/SafeImage';

export const HostPage: React.FC = () => {
  const { state, dispatch, activeCountry, showToast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';

  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'offers' | 'calendar' | 'channels' | 'invoices' | 'onboarding'>(
    initialTab as any
  );

  // Sync state for iCal
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedText, setLastSyncedText] = useState('4 mins ago');
  const [airbnbIcal, setAirbnbIcal] = useState('https://www.airbnb.com/calendar/ical/948201.ics?s=829f0');
  const [bookingIcal, setBookingIcal] = useState('https://admin.booking.com/hotel/hoteladmin/ical.html?t=294021');

  // Multi-step Onboarding State
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [submittedForApproval, setSubmittedForApproval] = useState(false);

  // Wizard Step 1: Personal info
  const [hostName, setHostName] = useState('David Mukasa');
  const [hostEmail, setHostEmail] = useState('david.mukasa@kololostays.ug');
  const [hostPhone, setHostPhone] = useState('+256 772 458 912');
  const [idDocName, setIdDocName] = useState('Uganda_National_ID_Mukasa_David.pdf');

  // Wizard Step 2: Dynamic Address Form
  const [propertyTitle, setPropertyTitle] = useState('Nakasero Hill Executive Suite');
  const [propertyType, setPropertyType] = useState<Property['type']>('Apartment');
  const [addressFields, setAddressFields] = useState<Record<string, string>>({
    Region: 'Central',
    District: 'Kampala',
    'City/Town': 'Kampala',
    'Area/Neighborhood': 'Nakasero Hill',
  });

  // Wizard Step 3: Photos (min 5 photos)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  ]);

  // Wizard Step 4: Pricing & Negotiation
  const [pricePerNight, setPricePerNight] = useState(380000);
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [minOfferPercent, setMinOfferPercent] = useState(80); // 80%

  // Host properties
  const myProperties = state.properties.filter(
    (p) => p.landlordId === 'UG-L-00031' || p.landlord.name.includes('Mukasa')
  );

  const handleSyncChannels = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedText('Just now');
      showToast('iCal Synced', 'Airbnb and Booking.com calendars successfully synchronized.', 'success');
    }, 1400);
  };

  const handlePayInvoice = (invoiceId: string) => {
    dispatch({ type: 'PAY_INVOICE', payload: invoiceId });
    showToast('Commission Settled', `Invoice marked paid via MTN Mobile Money.`, 'success');
  };

  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPropId = generatePropertyId('UG', addressFields['District'] || 'KLA');
    const newProperty: Property = {
      id: newPropId,
      landlordId: 'UG-L-00031',
      title: propertyTitle,
      tagline: 'Brand new luxury residence listed on Richard',
      description: 'Newly listed residence with high-grade interior furnishings, reliable power backup, and prime neighborhood security.',
      type: propertyType,
      district: addressFields['District'] || 'Kampala',
      city: addressFields['City/Town'] || 'Kampala',
      region: addressFields['Region'] || 'Central',
      countryCode: activeCountry.code,
      images: uploadedPhotos,
      pricePerNight,
      bedrooms: 3,
      beds: 3,
      baths: 2,
      maxGuests: 6,
      amenities: ['100% Solar backup & generator', 'High-speed Fiber Wi-Fi (150 Mbps)', '24/7 Gated security guard'],
      rating: 5.0,
      reviewCount: 1,
      reviewScores: { cleanliness: 5.0, accuracy: 5.0, location: 5.0, value: 5.0, communication: 5.0 },
      isNegotiable,
      minOfferPercent: minOfferPercent / 100,
      isInstantBook: false,
      isVerified: false,
      bookedDates: [],
      landlord: state.landlords[0],
      addressDetails: addressFields,
      houseRules: ['No smoking indoors', 'Quiet hours after 10 PM'],
    };

    dispatch({ type: 'ADD_PROPERTY', payload: newProperty });
    setSubmittedForApproval(true);
    showToast('Application Submitted', 'Your listing is queued for Admin review.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#6B7A73] mb-1">
              <Link to="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span className="text-[#0E6B50] font-semibold">Landlord Portal</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F1A17]">
              Host Management Center
            </h1>
            <p className="text-xs text-[#6B7A73] mt-1">
              Managing verified homes in {activeCountry.name} · Flat 10% commission only when you earn.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('onboarding')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-sm flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Property</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#0F1A17]/10 mb-8 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 px-4 font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-[#0E6B50] text-[#0E6B50]'
                : 'border-transparent text-[#6B7A73] hover:text-[#0F1A17]'
            }`}
          >
            Overview & Earnings
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('properties')}
            className={`py-3 px-4 font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'properties'
                ? 'border-[#0E6B50] text-[#0E6B50]'
                : 'border-transparent text-[#6B7A73] hover:text-[#0F1A17]'
            }`}
          >
            My Properties ({myProperties.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('offers')}
            className={`py-3 px-4 font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'offers'
                ? 'border-[#0E6B50] text-[#0E6B50]'
                : 'border-transparent text-[#6B7A73] hover:text-[#0F1A17]'
            }`}
          >
            Offers Inbox ({state.offers.filter((o) => o.status === 'pending' || o.status === 'countered').length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('channels')}
            className={`py-3 px-4 font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'channels'
                ? 'border-[#0E6B50] text-[#0E6B50]'
                : 'border-transparent text-[#6B7A73] hover:text-[#0F1A17]'
            }`}
          >
            Channel Sync (iCal)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`py-3 px-4 font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'invoices'
                ? 'border-[#0E6B50] text-[#0E6B50]'
                : 'border-transparent text-[#6B7A73] hover:text-[#0F1A17]'
            }`}
          >
            Commission Invoices
          </button>
        </div>

        {/* =====================================================
            TAB 1: DASHBOARD & EARNINGS
            ===================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-3xl p-6 border border-[#0F1A17]/8 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A73]">
                  Gross Monthly Revenue
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#0E6B50] tabular-nums">
                  UGX 14,850,000
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +18% vs last month
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#0F1A17]/8 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A73]">
                  Average Occupancy
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#0F1A17] tabular-nums">
                  78.4%
                </p>
                <p className="text-[11px] text-[#6B7A73]">23 nights booked this month</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#0F1A17]/8 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A73]">
                  Direct MoMo Payouts
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#F2A541] tabular-nums">
                  UGX 4,455,000
                </p>
                <p className="text-[11px] text-[#6B7A73]">30% upfront deposits</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#0F1A17]/8 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A73]">
                  Superhost Score
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#D9643A] tabular-nums">
                  4.96 / 5
                </p>
                <p className="text-[11px] text-[#0E6B50] font-semibold">100% Response Rate</p>
              </div>
            </div>

            {/* Occupancy & Monthly Performance Bar Chart */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#0F1A17]">Monthly Occupancy Trends</h3>
                  <p className="text-xs text-[#6B7A73]">Kampala Stays Occupancy (2026)</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#6B7A73]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#0E6B50]" />
                    Booked Nights
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#FAF7F2] border border-[#0F1A17]/10" />
                    Available
                  </span>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 border-b border-[#0F1A17]/10">
                {[
                  { month: 'Jun', booked: 21, rate: 'UGX 10.2M' },
                  { month: 'Jul', booked: 26, rate: 'UGX 13.8M' },
                  { month: 'Aug', booked: 28, rate: 'UGX 15.1M' },
                  { month: 'Sep', booked: 19, rate: 'UGX 9.8M' },
                  { month: 'Oct', booked: 24, rate: 'UGX 12.6M' },
                  { month: 'Nov (Now)', booked: 27, rate: 'UGX 14.8M' },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] text-[#0E6B50] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.rate}
                    </div>
                    <div
                      className="w-full max-w-[48px] bg-gradient-to-t from-[#0E6B50] to-[#1F9D6B] rounded-t-xl transition-all group-hover:brightness-110"
                      style={{ height: `${(item.booked / 30) * 100}%` }}
                    />
                    <span className="text-[11px] font-semibold text-[#0F1A17]">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: MY PROPERTIES
            ===================================================== */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#0F1A17]/8 shadow-2xs space-y-4"
                >
                  <div className="relative aspect-16/9 bg-[#F1EBE1]">
                    <SafeImage
                      src={prop.images[0]}
                      alt={prop.title}
                      fallbackSeed={prop.id}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#0E6B50] shadow-xs">
                      Live on Marketplace
                    </div>
                  </div>

                  <div className="p-5 pt-0 space-y-3">
                    <h3 className="font-serif font-bold text-base text-[#0F1A17] line-clamp-1">{prop.title}</h3>
                    <p className="text-xs text-[#6B7A73]">{prop.district} · {prop.type}</p>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-[#0F1A17]/6">
                      <span className="font-bold tabular-nums text-[#0F1A17]">
                        {formatUGX(prop.pricePerNight)}/night
                      </span>
                      <Link
                        to={`/property/${prop.id}`}
                        className="text-[#0E6B50] font-bold hover:underline"
                      >
                        View Stay Page →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 3: OFFERS INBOX
            ===================================================== */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            {state.offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-3xl p-6 border border-[#0F1A17]/8 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#0F1A17]/6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#6B7A73]">{offer.id}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                        {offer.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#0F1A17] mt-1">
                      {offer.guestName} ({offer.guestPhone})
                    </h4>
                    <p className="text-xs text-[#6B7A73]">
                      Wants to book {offer.propertyTitle} for {offer.nights} nights ({offer.checkIn} – {offer.checkOut})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#6B7A73]">Listed: {formatUGX(offer.originalPrice)}</span>
                    <p className="font-serif font-bold text-lg text-[#0E6B50] tabular-nums">
                      Offered: {formatUGX(offer.offeredPrice)}/night
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF7F2] rounded-2xl text-xs text-[#0F1A17]/85 italic">
                  "{offer.message}"
                </div>

                {offer.status === 'pending' || offer.status === 'countered' ? (
                  <div className="flex gap-3 justify-end text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        dispatch({
                          type: 'UPDATE_OFFER_STATUS',
                          payload: {
                            offerId: offer.id,
                            status: 'declined',
                            message: 'Host declined offer due to conflicting scheduling.',
                          },
                        });
                        showToast('Offer Declined', 'Guest has been notified.', 'info');
                      }}
                      className="px-4 py-2 rounded-xl border border-[#0F1A17]/15 font-semibold text-[#6B7A73] hover:text-[#0F1A17]"
                    >
                      Decline
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        dispatch({
                          type: 'UPDATE_OFFER_STATUS',
                          payload: {
                            offerId: offer.id,
                            status: 'accepted',
                            message: 'Host accepted your offer! You may now finalize reservation.',
                          },
                        });
                        showToast('Offer Accepted!', `Guest ${offer.guestName} can now book.`, 'success');
                      }}
                      className="px-5 py-2 rounded-xl font-bold text-white gradient-cta shadow-sm"
                    >
                      Accept Offer ({formatUGX(offer.offeredPrice)})
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {/* =====================================================
            TAB 4: CHANNEL SYNC (iCAL)
            ===================================================== */}
        {activeTab === 'channels' && (
          <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-[#0F1A17]">Multi-Calendar iCal Sync</h3>
                <span className="text-xs text-[#6B7A73]">Last synced: {lastSyncedText}</span>
              </div>
              <p className="text-xs text-[#6B7A73] mt-1">
                Prevent double-bookings across Airbnb, Booking.com, and VRBO automatically.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#0F1A17] block mb-1">Airbnb iCal Export Feed</label>
                <input
                  type="text"
                  value={airbnbIcal}
                  onChange={(e) => setAirbnbIcal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F1A17] block mb-1">Booking.com iCal URL</label>
                <input
                  type="text"
                  value={bookingIcal}
                  onChange={(e) => setBookingIcal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F1A17] block mb-1">Your Richard Calendar Export Feed (for Airbnb)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://api.richardrentals.ug/v1/calendar/UG-KLA-P-000124.ics"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 font-mono text-[11px] select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('https://api.richardrentals.ug/v1/calendar/UG-KLA-P-000124.ics');
                      showToast('Copied', 'Richard iCal link copied.', 'info');
                    }}
                    className="px-3 py-2.5 rounded-xl bg-[#0E6B50] text-white font-bold text-xs"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSyncChannels}
              disabled={isSyncing}
              className="w-full py-3.5 rounded-xl font-bold text-xs text-white gradient-brand flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing Calendars...' : 'Sync All Channels Now'}</span>
            </button>
          </div>
        )}

        {/* =====================================================
            TAB 5: COMMISSION INVOICES
            ===================================================== */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs space-y-6">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#0F1A17]">Host Commission Invoices</h3>
              <p className="text-xs text-[#6B7A73] mt-1">
                Standard 10% platform commission billed on completed check-ins. Settle instantly via Mobile Money.
              </p>
            </div>

            <div className="divide-y divide-[#0F1A17]/8 text-xs">
              {state.invoices.map((inv) => (
                <div key={inv.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0F1A17]">{inv.invoiceNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-medium text-[#0F1A17] mt-1">{inv.propertyTitle}</p>
                    <p className="text-[#6B7A73] text-[11px]">
                      Booking Ref: {inv.bookingRef} · Total Value: {formatUGX(inv.totalBookingAmount)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[#6B7A73] text-[10px]">10% Commission</span>
                      <p className="font-serif font-bold text-sm text-[#0F1A17] tabular-nums">
                        {formatUGX(inv.commissionAmount)}
                      </p>
                    </div>

                    {inv.status === 'due' ? (
                      <button
                        type="button"
                        onClick={() => handlePayInvoice(inv.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-cta hover:opacity-95 shadow-2xs"
                      >
                        Pay via MoMo
                      </button>
                    ) : (
                      <span className="text-xs text-[#0E6B50] font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Settled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 6: MULTI-STEP ONBOARDING WIZARD
            ===================================================== */}
        {activeTab === 'onboarding' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#0F1A17]/8 shadow-xl space-y-8">
            {submittedForApproval ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <Clock className="w-10 h-10" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#0F1A17]">Application Under Review</h3>
                <p className="text-xs text-[#6B7A73] max-w-sm mx-auto">
                  Your property listing <strong>{propertyTitle}</strong> has been submitted. Our compliance team verifies land title / tenancy agreement in under 24 hours.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <Link
                    to="/admin"
                    className="px-4 py-2.5 rounded-xl font-bold text-xs text-white gradient-brand"
                  >
                    View in Admin Approval Queue →
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedForApproval(false);
                      setActiveTab('properties');
                    }}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs text-[#0F1A17] bg-[#FAF7F2] border border-[#0F1A17]/15"
                  >
                    Back to Properties
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Wizard Progress */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-bold text-[#0E6B50]">Step {wizardStep} of 4</span>
                    <span className="text-[#6B7A73]">
                      {wizardStep === 1
                        ? 'Host Identity'
                        : wizardStep === 2
                        ? `Address in ${activeCountry.name}`
                        : wizardStep === 3
                        ? 'Property Photos'
                        : 'Pricing & Negotiation'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#FAF7F2] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0E6B50] to-[#F2A541] transition-all duration-300"
                      style={{ width: `${(wizardStep / 4) * 100}%` }}
                    />
                  </div>
                </div>

                <form onSubmit={handleWizardSubmit} className="space-y-6 text-xs">
                  {/* Step 1: Host identity */}
                  {wizardStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="font-serif font-bold text-xl text-[#0F1A17]">1. Host Identity & MoMo Payouts</h3>
                      <div>
                        <label className="font-bold block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={hostName}
                          onChange={(e) => setHostName(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 text-xs font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-bold block mb-1">Email</label>
                          <input
                            type="email"
                            value={hostEmail}
                            onChange={(e) => setHostEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-1">Registered MoMo Phone</label>
                          <input
                            type="text"
                            value={hostPhone}
                            onChange={(e) => setHostPhone(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 text-xs font-semibold"
                          />
                        </div>
                      </div>

                      {/* Drag & Drop ID upload preview */}
                      <div>
                        <label className="font-bold block mb-1">Upload National ID / Passport (PDF or Image)</label>
                        <div className="p-6 border-2 border-dashed border-[#0E6B50]/40 rounded-2xl bg-[#0E6B50]/5 text-center space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-[#0E6B50]" />
                          <p className="font-bold text-[#0F1A17]">{idDocName}</p>
                          <span className="text-[10px] text-[#6B7A73]">Verified Document Attached (2.4 MB)</span>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => setWizardStep(2)}
                          className="px-6 py-3 rounded-xl font-bold text-xs text-white gradient-cta"
                        >
                          Continue to Property Details →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: DYNAMIC ADDRESS FORM DRIVEN BY COUNTRY CONFIG */}
                  {wizardStep === 2 && (
                    <div className="space-y-4">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[#0E6B50] font-semibold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>Dynamic address levels populated from active {activeCountry.name} config:</span>
                      </div>

                      <h3 className="font-serif font-bold text-xl text-[#0F1A17]">2. Property Location & Details</h3>

                      <div>
                        <label className="font-bold block mb-1">Property Name / Title</label>
                        <input
                          type="text"
                          value={propertyTitle}
                          onChange={(e) => setPropertyTitle(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="font-bold block mb-1">Stay Category</label>
                        <select
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value as any)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 text-xs font-semibold cursor-pointer"
                        >
                          <option value="Villa">Villa</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Lakeside">Lakeside Retreat</option>
                          <option value="Long Stay">Long Stay</option>
                          <option value="Studio">Studio</option>
                          <option value="Safari Lodge">Safari Lodge</option>
                        </select>
                      </div>

                      {/* Render dynamic address hierarchy levels from country config */}
                      <div className="space-y-3">
                        <span className="font-bold text-[#0F1A17] block">
                          Address Hierarchy for {activeCountry.name} ({activeCountry.addressHierarchy.join(' → ')}):
                        </span>

                        {activeCountry.addressHierarchy.map((level) => (
                          <div key={level}>
                            <label className="font-bold text-[#6B7A73] block mb-1">{level}</label>
                            <input
                              type="text"
                              value={addressFields[level] || ''}
                              onChange={(e) =>
                                setAddressFields({ ...addressFields, [level]: e.target.value })
                              }
                              required
                              placeholder={`Enter ${level}`}
                              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 text-xs"
                            />
                          </div>
                        ))}

                        {activeCountry.requiresPostalCode && (
                          <div>
                            <label className="font-bold text-[#6B7A73] block mb-1">Postal Code (Required in {activeCountry.name})</label>
                            <input
                              type="text"
                              placeholder="e.g. 00100"
                              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 text-xs"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setWizardStep(1)}
                          className="px-5 py-3 rounded-xl border border-[#0F1A17]/15 font-semibold text-[#6B7A73]"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setWizardStep(3)}
                          className="px-6 py-3 rounded-xl font-bold text-xs text-white gradient-cta"
                        >
                          Continue to Photos →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Photos (validation min 5 photos) */}
                  {wizardStep === 3 && (
                    <div className="space-y-4">
                      <h3 className="font-serif font-bold text-xl text-[#0F1A17]">3. Property Photography</h3>
                      <p className="text-[#6B7A73]">Minimum 5 photos required to ensure verified listing status.</p>

                      <div className="grid grid-cols-3 gap-3">
                        {uploadedPhotos.map((photo, i) => (
                          <div key={i} className="aspect-4/3 rounded-xl overflow-hidden relative border border-[#0F1A17]/10">
                            <SafeImage src={photo} alt="" className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                              #{i + 1}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900 font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0E6B50]" />
                        <span>5 of 5 Photos Validated & Ready</span>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setWizardStep(2)}
                          className="px-5 py-3 rounded-xl border border-[#0F1A17]/15 font-semibold text-[#6B7A73]"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setWizardStep(4)}
                          className="px-6 py-3 rounded-xl font-bold text-xs text-white gradient-cta"
                        >
                          Continue to Pricing →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Pricing & Negotiation Rules */}
                  {wizardStep === 4 && (
                    <div className="space-y-4">
                      <h3 className="font-serif font-bold text-xl text-[#0F1A17]">4. Pricing & Direct Negotiation</h3>

                      <div>
                        <label className="font-bold block mb-1">Standard Listed Rate (per night)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={pricePerNight}
                            onChange={(e) => setPricePerNight(Number(e.target.value))}
                            step={10000}
                            required
                            className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 text-sm font-bold tabular-nums"
                          />
                          <span className="text-xs font-bold text-[#6B7A73]">{activeCountry.currency}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#0F1A17]/10 space-y-3">
                        <label className="flex items-center gap-2 font-bold text-[#0F1A17] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isNegotiable}
                            onChange={(e) => setIsNegotiable(e.target.checked)}
                            className="w-4 h-4 accent-[#0E6B50]"
                          />
                          <span>Allow guests to negotiate and name their price</span>
                        </label>

                        {isNegotiable && (
                          <div className="pt-2 border-t border-[#0F1A17]/10">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[11px] text-[#6B7A73]">Minimum Acceptable Offer</span>
                              <span className="font-bold text-[#0E6B50]">{minOfferPercent}% ({formatUGX(pricePerNight * (minOfferPercent / 100))})</span>
                            </div>
                            <input
                              type="range"
                              min={60}
                              max={95}
                              value={minOfferPercent}
                              onChange={(e) => setMinOfferPercent(Number(e.target.value))}
                              className="w-full accent-[#0E6B50]"
                            />
                            <p className="text-[10px] text-[#6B7A73] mt-1">
                              Offers at or above {minOfferPercent}% will automatically receive acceptance options.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setWizardStep(3)}
                          className="px-5 py-3 rounded-xl border border-[#0F1A17]/15 font-semibold text-[#6B7A73]"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3.5 rounded-xl font-bold text-xs text-white gradient-cta shadow-md"
                        >
                          Submit Listing for Admin Approval
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
