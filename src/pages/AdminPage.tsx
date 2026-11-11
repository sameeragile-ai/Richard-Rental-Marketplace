import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  ShieldCheck,
  Building2,
  DollarSign,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Plus,
  Sliders,
  TrendingUp,
  FileText,
  KeyRound,
  ArrowRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX, formatUSD } from '../utils/format';
import { CountryConfig, Landlord, SubAdmin } from '../types';
import { SafeImage } from '../components/common/SafeImage';

export const AdminPage: React.FC = () => {
  const { state, dispatch, showToast } = useApp();

  const [activeSection, setActiveSection] = useState<'overview' | 'countries' | 'approvals' | 'bookings' | 'reconciliation' | 'subadmins'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Selected Country for Deep Config Panel
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(state.countries[0]);
  const [newHierarchyLevel, setNewHierarchyLevel] = useState('');

  // Manual Date Blocking State
  const [blockPropertyId, setBlockPropertyId] = useState(state.properties[0].id);
  const [blockStartDate, setBlockStartDate] = useState('2026-12-15');
  const [blockEndDate, setBlockEndDate] = useState('2026-12-18');

  // Sub-Admin Invite State
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Regional Operations Manager');

  // Pending Landlords Queue
  const pendingLandlords = state.landlords.filter((l) => l.approvalStatus === 'pending');

  const handleToggleCountry = (countryId: string) => {
    dispatch({ type: 'TOGGLE_COUNTRY_LIVE', payload: countryId });
    const target = state.countries.find((c) => c.id === countryId);
    showToast(
      target?.isLive ? `${target.name} Deactivated` : `${target?.name} is now LIVE!`,
      `Country selector updated in navbar.`,
      'info'
    );
  };

  const handleSaveCountryConfig = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_COUNTRY_CONFIG', payload: selectedCountry });
    showToast('Country Architecture Updated', `${selectedCountry.name} settings saved successfully.`, 'success');
  };

  const handleAddHierarchyLevel = () => {
    if (!newHierarchyLevel.trim()) return;
    setSelectedCountry({
      ...selectedCountry,
      addressHierarchy: [...selectedCountry.addressHierarchy, newHierarchyLevel.trim()],
    });
    setNewHierarchyLevel('');
  };

  const handleRemoveHierarchyLevel = (levelIndex: number) => {
    const updated = [...selectedCountry.addressHierarchy];
    updated.splice(levelIndex, 1);
    setSelectedCountry({ ...selectedCountry, addressHierarchy: updated });
  };

  const handleBlockDates = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate dates in range
    const dates: string[] = [];
    const cur = new Date(blockStartDate);
    const end = new Date(blockEndDate);
    while (cur <= end) {
      dates.push(cur.toISOString().split('T')[0]);
      cur.setDate(cur.getDate() + 1);
    }

    dispatch({ type: 'BLOCK_DATES', payload: { propertyId: blockPropertyId, dates } });
    showToast('Dates Blocked', `Calendar reserved for offline payment at ${blockPropertyId}.`, 'success');
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Invoice,Landlord,Property,BookingRef,TotalStay,Commission,Status\n' +
      state.invoices
        .map(
          (inv) =>
            `${inv.invoiceNumber},"${inv.landlordName}","${inv.propertyTitle}",${inv.bookingRef},${inv.totalBookingAmount},${inv.commissionAmount},${inv.status}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Richard_Commission_Reconciliation_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported', 'Commission ledger exported.', 'success');
  };

  const handleInviteSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdmin: SubAdmin = {
      id: `sa-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      roleTitle: inviteRole,
      permissions: {
        approvals: true,
        payments: true,
        countries: false,
        support: true,
      },
      lastActive: 'Invited just now',
    };
    dispatch({ type: 'ADD_SUB_ADMIN', payload: newAdmin });
    showToast('Sub-Admin Invited', `Invitation sent to ${inviteEmail}.`, 'success');
    setInviteName('');
    setInviteEmail('');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      {/* =====================================================
          ADMIN SIDEBAR
          ===================================================== */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0B3D2E] text-white flex flex-col justify-between p-6 z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Logo Header */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center font-serif text-lg font-bold text-[#F2A541]">
                R
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">Richard Admin</h2>
                <p className="text-[9px] tracking-widest text-[#F2A541] uppercase">HQ CONTROL</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveSection('overview');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-colors text-left ${
                activeSection === 'overview' ? 'bg-[#0E6B50] text-white' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Overview KPIs</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSection('countries');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-colors text-left ${
                activeSection === 'countries' ? 'bg-[#0E6B50] text-white' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <Globe className="w-4 h-4 text-[#F2A541]" />
              <span>Countries & Regions</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSection('approvals');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-colors text-left ${
                activeSection === 'approvals' ? 'bg-[#0E6B50] text-white' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Host Approvals</span>
              </div>
              {pendingLandlords.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#D9643A] text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingLandlords.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSection('bookings');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-colors text-left ${
                activeSection === 'bookings' ? 'bg-[#0E6B50] text-white' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Bookings & Date Blocking</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSection('reconciliation');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-colors text-left ${
                activeSection === 'reconciliation' ? 'bg-[#0E6B50] text-white' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Commission Reconciliation</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSection('subadmins');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-colors text-left ${
                activeSection === 'subadmins' ? 'bg-[#0E6B50] text-white' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Sub-Admin Team</span>
            </button>
          </nav>
        </div>

        {/* Bottom Switcher */}
        <div className="pt-6 border-t border-white/10 space-y-3 text-xs">
          <Link
            to="/architecture"
            className="text-[11px] text-[#F2A541] hover:underline block font-semibold"
          >
            Client Architecture Brief →
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
              AD
            </div>
            <div>
              <p className="font-bold text-white leading-tight">Admin System</p>
              <span className="text-[10px] text-white/60">Super Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN ADMIN WORKSPACE
          ===================================================== */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 pt-20 lg:pt-10 overflow-y-auto">
        {/* Mobile menu trigger */}
        <div className="lg:hidden fixed top-4 left-4 z-30">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-xl bg-[#0B3D2E] text-white shadow-md"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* =====================================================
            SECTION 1: OVERVIEW KPIS
            ===================================================== */}
        {activeSection === 'overview' && (
          <div className="space-y-8 max-w-6xl">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#0F1A17]">Platform Overview & GMV</h1>
              <p className="text-xs text-[#6B7A73] mt-1">Aggregated transaction volume across Uganda and active markets.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-3xl p-6 border border-[#0F1A17]/8 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A73]">Total GMV (2026)</span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#0E6B50] tabular-nums">
                  UGX 184,200,000
                </p>
                <p className="text-[11px] text-[#6B7A73]">≈ $49,780 USD equivalent</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#0F1A17]/8 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A73]">Confirmed Bookings</span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#0F1A17] tabular-nums">
                  342
                </p>
                <p className="text-[11px] text-[#0E6B50] font-semibold">+24 this week</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#0F1A17]/8 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A73]">10% Commission Billed</span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#F2A541] tabular-nums">
                  UGX 18,420,000
                </p>
                <p className="text-[11px] text-[#6B7A73]">UGX 14.2M settled via MoMo</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#0F1A17]/8 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A73]">Host Queue</span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#D9643A] tabular-nums">
                  {pendingLandlords.length} Pending
                </p>
                <p className="text-[11px] text-[#6B7A73]">Requires ID check</p>
              </div>
            </div>

            {/* Quick Country Health */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#0F1A17]">Pan-African Deployment Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {state.countries.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#0F1A17]/6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <p className="font-bold text-[#0F1A17]">{c.name}</p>
                        <span className="text-[10px] text-[#6B7A73]">{c.currency} ({c.idPrefix})</span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isLive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {c.isLive ? 'LIVE' : 'STANDBY'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            SECTION 2: COUNTRIES & REGIONS CONFIG (KEY FEATURE)
            ===================================================== */}
        {activeSection === 'countries' && (
          <div className="space-y-8 max-w-6xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#0E6B50] text-[10px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero-Hardcoding Architecture</span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#0F1A17]">African Market Configurations</h1>
              <p className="text-xs text-[#6B7A73] mt-1">
                Toggle new countries live. Their address schemas, payment providers, and currencies instantly populate across the client navbar and landlord forms.
              </p>
            </div>

            {/* Countries Table with Live Toggles */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#0F1A17]/8 shadow-2xs">
              <div className="p-5 border-b border-[#0F1A17]/8 font-serif font-bold text-base text-[#0F1A17]">
                Supported African Countries
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF7F2] text-[#6B7A73] uppercase tracking-wider text-[10px] border-b border-[#0F1A17]/6">
                    <tr>
                      <th className="py-3 px-4">Country</th>
                      <th className="py-3 px-4">Currency & Code</th>
                      <th className="py-3 px-4">ID Prefix</th>
                      <th className="py-3 px-4">Address Levels</th>
                      <th className="py-3 px-4">Commission</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Configure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0F1A17]/6">
                    {state.countries.map((c) => (
                      <tr key={c.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#0F1A17] flex items-center gap-2">
                          <span className="text-lg">{c.flag}</span>
                          <span>{c.name}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          {c.currency} ({c.currencySymbol})
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0E6B50]">
                          {c.idPrefix}
                        </td>
                        <td className="py-3.5 px-4 text-[#6B7A73]">
                          {c.addressHierarchy.join(' → ')}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums font-semibold">
                          {(c.commissionRate * 100).toFixed(0)}%
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleCountry(c.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                              c.isLive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${c.isLive ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                            <span>{c.isLive ? 'Live in App' : 'Enable'}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedCountry(c)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FAF7F2] hover:bg-[#F1EBE1] text-[#0E6B50] border border-[#0F1A17]/10"
                          >
                            Edit Schema
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Deep Configuration Panel for Selected Country */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#0F1A17]/8">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedCountry.flag}</span>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0F1A17]">
                      {selectedCountry.name} Market Architecture
                    </h3>
                    <p className="text-xs text-[#6B7A73]">
                      Changes dynamically alter landlord forms and ID generators for {selectedCountry.code}.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleCountry(selectedCountry.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-[#0F1A17]/15 hover:bg-[#FAF7F2]"
                  >
                    Toggle Live State ({selectedCountry.isLive ? 'Live' : 'Standby'})
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveCountryConfig} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-[#0F1A17] block mb-1">Currency Code</label>
                    <input
                      type="text"
                      value={selectedCountry.currency}
                      onChange={(e) =>
                        setSelectedCountry({ ...selectedCountry, currency: e.target.value.toUpperCase() })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0F1A17] block mb-1">Currency Symbol</label>
                    <input
                      type="text"
                      value={selectedCountry.currencySymbol}
                      onChange={(e) =>
                        setSelectedCountry({ ...selectedCountry, currencySymbol: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0F1A17] block mb-1">Sequence ID Prefix</label>
                    <input
                      type="text"
                      value={selectedCountry.idPrefix}
                      onChange={(e) =>
                        setSelectedCountry({ ...selectedCountry, idPrefix: e.target.value.toUpperCase() })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 font-bold"
                    />
                  </div>
                </div>

                {/* Address Hierarchy Builder */}
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#0F1A17]/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#0F1A17]">Address Hierarchy Builder</h4>
                      <p className="text-[11px] text-[#6B7A73]">
                        Defines the administrative divisions rendered in the host onboarding wizard.
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0F1A17]">
                      <input
                        type="checkbox"
                        checked={selectedCountry.requiresPostalCode}
                        onChange={(e) =>
                          setSelectedCountry({
                            ...selectedCountry,
                            requiresPostalCode: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-[#0E6B50]"
                      />
                      <span>Postal Code Required</span>
                    </label>
                  </div>

                  {/* Level Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedCountry.addressHierarchy.map((level, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#0F1A17]/15 text-xs font-bold text-[#0F1A17] shadow-2xs"
                      >
                        <span className="text-[#0E6B50] font-mono">L{idx + 1}:</span>
                        <span>{level}</span>
                        {selectedCountry.addressHierarchy.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveHierarchyLevel(idx)}
                            className="text-[#6B7A73] hover:text-[#C8452F] p-0.5"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add level */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHierarchyLevel}
                      onChange={(e) => setNewHierarchyLevel(e.target.value)}
                      placeholder="Add division (e.g. Ward, Sub-County, Parish)"
                      className="flex-1 px-4 py-2 rounded-xl bg-white border border-[#0F1A17]/15 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddHierarchyLevel}
                      className="px-4 py-2 rounded-xl bg-[#0E6B50] text-white font-bold text-xs"
                    >
                      Add Level
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-sm"
                  >
                    Save {selectedCountry.name} Configuration
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =====================================================
            SECTION 3: LANDLORD APPROVALS QUEUE
            ===================================================== */}
        {activeSection === 'approvals' && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#0F1A17]">Landlord Verification Queue</h1>
              <p className="text-xs text-[#6B7A73] mt-1">Review government ID documents and tenancy verification before enabling listings.</p>
            </div>

            {pendingLandlords.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#0F1A17]/8 max-w-md mx-auto space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#0E6B50] mx-auto" />
                <h3 className="font-serif font-bold text-xl text-[#0F1A17]">Queue is Clear</h3>
                <p className="text-xs text-[#6B7A73]">All pending landlord registrations have been audited.</p>
              </div>
            ) : (
              pendingLandlords.map((landlord) => (
                <div
                  key={landlord.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#0F1A17]/8">
                    <div className="flex items-center gap-4">
                      <SafeImage
                        src={landlord.avatar}
                        alt={landlord.name}
                        fallbackSeed={landlord.id}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#0F1A17]/10"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#0E6B50]">{landlord.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                            PENDING AUDIT
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-lg text-[#0F1A17] mt-0.5">{landlord.name}</h3>
                        <p className="text-xs text-[#6B7A73]">{landlord.email} · {landlord.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({
                            type: 'REJECT_LANDLORD',
                            payload: { landlordId: landlord.id, reason: 'ID copy unclear' },
                          });
                          showToast('Application Rejected', `Host notified to re-upload clear ID.`, 'info');
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-[#C8452F] hover:bg-rose-50 border border-rose-200"
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          dispatch({ type: 'APPROVE_LANDLORD', payload: landlord.id });
                          showToast('Landlord Approved', `${landlord.name} verified and activated.`, 'success');
                        }}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white gradient-brand shadow-2xs"
                      >
                        Approve & Verify
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-[#FAF7F2] rounded-xl flex items-center justify-between">
                      <span className="text-[#6B7A73]">Attached Identity Doc:</span>
                      <span className="font-mono font-bold text-[#0F1A17]">{landlord.identityDocName}</span>
                    </div>
                    <div className="p-3 bg-[#FAF7F2] rounded-xl flex items-center justify-between">
                      <span className="text-[#6B7A73]">Payout Mobile Money:</span>
                      <span className="font-bold text-[#0E6B50]">{landlord.phone} (MTN MoMo)</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* =====================================================
            SECTION 4: BOOKINGS & DATE BLOCKING
            ===================================================== */}
        {activeSection === 'bookings' && (
          <div className="space-y-8 max-w-5xl">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#0F1A17]">Bookings & Offline Calendar Control</h1>
              <p className="text-xs text-[#6B7A73] mt-1">Block property dates for offline walk-ins, phone reservations, or maintenance.</p>
            </div>

            {/* Date Blocking Tool */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#0F1A17]">Manually Block Dates (Offline Payment)</h3>

              <form onSubmit={handleBlockDates} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#0F1A17] block mb-1">Select Property</label>
                  <select
                    value={blockPropertyId}
                    onChange={(e) => setBlockPropertyId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 font-semibold cursor-pointer"
                  >
                    {state.properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.district})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#0F1A17] block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={blockStartDate}
                    onChange={(e) => setBlockStartDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0F1A17] block mb-1">End Date</label>
                  <input
                    type="date"
                    value={blockEndDate}
                    onChange={(e) => setBlockEndDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 font-semibold"
                  />
                </div>

                <div className="sm:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-sm"
                  >
                    Block Calendar Dates
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =====================================================
            SECTION 5: COMMISSION RECONCILIATION
            ===================================================== */}
        {activeSection === 'reconciliation' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#0F1A17]">Commission Reconciliation Ledger</h1>
                <p className="text-xs text-[#6B7A73] mt-1">Exportable audit logs for 10% marketplace host commission.</p>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-white gradient-brand flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV Ledger</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-[#0F1A17]/8 shadow-2xs">
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF7F2] text-[#6B7A73] uppercase tracking-wider text-[10px] border-b border-[#0F1A17]/6">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Landlord</th>
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Booking Ref</th>
                      <th className="py-3 px-4">Stay Amount</th>
                      <th className="py-3 px-4">10% Commission</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0F1A17]/6">
                    {state.invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#FAF7F2]/60">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0F1A17]">{inv.invoiceNumber}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#0F1A17]">{inv.landlordName}</td>
                        <td className="py-3.5 px-4 text-[#6B7A73]">{inv.propertyTitle}</td>
                        <td className="py-3.5 px-4 font-mono text-[#6B7A73]">{inv.bookingRef}</td>
                        <td className="py-3.5 px-4 tabular-nums font-semibold">{formatUGX(inv.totalBookingAmount)}</td>
                        <td className="py-3.5 px-4 tabular-nums font-bold text-[#0E6B50]">{formatUGX(inv.commissionAmount)}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {inv.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            SECTION 6: SUB-ADMIN TEAM & PERMISSIONS
            ===================================================== */}
        {activeSection === 'subadmins' && (
          <div className="space-y-8 max-w-5xl">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#0F1A17]">Sub-Admin Team & Permissions</h1>
              <p className="text-xs text-[#6B7A73] mt-1">Granular RBAC controls for country managers, auditors, and customer support.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs space-y-6">
              <h3 className="font-serif font-bold text-xl text-[#0F1A17]">Active Operators</h3>

              <div className="divide-y divide-[#0F1A17]/8 text-xs">
                {state.subAdmins.map((adm) => (
                  <div key={adm.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="font-bold text-sm text-[#0F1A17]">{adm.name}</p>
                      <p className="text-[#6B7A73] text-[11px]">{adm.email} · {adm.roleTitle}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${adm.permissions.approvals ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                        Approvals
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${adm.permissions.payments ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                        Payments
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${adm.permissions.countries ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                        Countries
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${adm.permissions.support ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                        Support
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invite Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#0F1A17]">Invite Regional Administrator</h3>
              <form onSubmit={handleInviteSubAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-[#0F1A17] block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    required
                    placeholder="e.g. Claire Akello"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#0F1A17] block mb-1">Work Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    placeholder="claire.a@richardrentals.ug"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#0F1A17] block mb-1">Designation</label>
                  <input
                    type="text"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 font-semibold"
                  />
                </div>
                <div className="sm:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-sm"
                  >
                    Send Admin Credentials
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
