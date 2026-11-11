import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, KeyRound, ShieldCheck, Check, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { SafeImage } from '../components/common/SafeImage';

export const AuthPage: React.FC = () => {
  const { dispatch, showToast } = useApp();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('guest');
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAdminMode) {
      if (adminUsername === 'admin' && adminPassword === 'admin123') {
        dispatch({ type: 'SET_ROLE', payload: 'admin' });
        showToast('Admin Authorized', 'Welcome to Richard Regional Administration Portal.', 'success');
        navigate('/admin');
      } else {
        showToast('Invalid credentials', 'Please use hint: admin / admin123', 'error');
      }
      return;
    }

    dispatch({ type: 'SET_ROLE', payload: selectedRole });
    showToast(`Signed in as ${selectedRole}`, `Welcome back!`, 'success');
    navigate(selectedRole === 'landlord' ? '/host' : '/trips');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Left Visual Column */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#0B3D2E] text-white p-12 flex-col justify-between overflow-hidden">
          <div className="absolute inset-0">
            <SafeImage
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Richard Hospitality"
              className="w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D2E] via-[#0B3D2E]/80 to-transparent" />
          </div>

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-serif text-xl font-bold text-[#F2A541]">
                R
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold">Richard</h2>
                <p className="text-[9px] tracking-widest text-[#F2A541] uppercase">RENTAL MARKETPLACE</p>
              </div>
            </Link>
          </div>

          <div className="relative z-10 space-y-4 max-w-sm">
            <h3 className="font-serif text-3xl font-bold leading-tight">
              African hospitality, reimagined for modern explorers and visionary hosts.
            </h3>
            <p className="text-xs text-white/80 leading-relaxed font-light">
              Verified private estates, instant Mobile Money deposits, and human direct negotiation across East and West Africa.
            </p>
          </div>

          <div className="relative z-10 text-[11px] text-white/60">
            © 2026 Richard Rentals. Kampala · Nairobi · Kigali
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="font-serif text-3xl font-bold text-[#0F1A17]">
                  {isAdminMode ? 'Admin Sign In' : 'Welcome to Richard'}
                </h1>

                <button
                  type="button"
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className="text-xs font-bold text-[#0E6B50] hover:underline flex items-center gap-1"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{isAdminMode ? 'Standard Sign In' : 'Admin Login'}</span>
                </button>
              </div>

              <p className="text-xs text-[#6B7A73] mt-1">
                {isAdminMode
                  ? 'Access the African country configuration and landlord approval portal.'
                  : 'Select your account type to continue.'}
              </p>
            </div>

            {isAdminMode ? (
              /* Admin Sign-In Form */
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                  <p className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Demo Credentials Hint:
                  </p>
                  <p className="mt-0.5 font-mono text-[11px]">Username: <strong>admin</strong> / Password: <strong>admin123</strong></p>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0F1A17]">Admin Username</label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    required
                    className="w-full mt-1.5 px-4 py-3 rounded-xl bg-white border border-[#0F1A17]/15 text-xs text-[#0F1A17] focus:outline-hidden focus:border-[#0E6B50]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0F1A17]">Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    className="w-full mt-1.5 px-4 py-3 rounded-xl bg-white border border-[#0F1A17]/15 text-xs text-[#0F1A17] focus:outline-hidden focus:border-[#0E6B50]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate to Admin Console</span>
                </button>
              </form>
            ) : (
              /* Standard Guest / Landlord Flow */
              <div className="space-y-6">
                {/* Role Selection Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedRole('guest')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedRole === 'guest'
                        ? 'border-[#0E6B50] bg-emerald-50/50 shadow-xs'
                        : 'border-[#0F1A17]/10 bg-white hover:border-[#0F1A17]/30'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0E6B50]/10 text-[#0E6B50] flex items-center justify-center mb-2">
                      <User className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif font-bold text-sm text-[#0F1A17]">I'm a Guest</h3>
                    <p className="text-[10px] text-[#6B7A73] mt-0.5">Explore stays & negotiate</p>
                  </div>

                  <div
                    onClick={() => setSelectedRole('landlord')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedRole === 'landlord'
                        ? 'border-[#F2A541] bg-amber-50/50 shadow-xs'
                        : 'border-[#0F1A17]/10 bg-white hover:border-[#0F1A17]/30'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F2A541]/15 text-[#D9643A] flex items-center justify-center mb-2">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif font-bold text-sm text-[#0F1A17]">I'm a Landlord</h3>
                    <p className="text-[10px] text-[#6B7A73] mt-0.5">List homes & earn up to 90%</p>
                  </div>
                </div>

                {/* "What you'll need" Requirements List */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#0F1A17]/8 text-xs space-y-2">
                  <span className="font-bold text-[#0F1A17] block">
                    {selectedRole === 'guest' ? "What You'll Need as a Guest:" : "What You'll Need as a Landlord:"}
                  </span>
                  <ul className="space-y-1.5 text-[#6B7A73] text-[11px]">
                    {selectedRole === 'guest' ? (
                      <>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#0E6B50] shrink-0" />
                          <span>Any valid mobile phone number (for SMS booking codes)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#0E6B50] shrink-0" />
                          <span>MTN MoMo, Airtel Money, or international card for 30% deposit</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#0E6B50] shrink-0" />
                          <span>National ID or Passport copy presented to host at check-in</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#0E6B50] shrink-0" />
                          <span>Uganda National ID (NIN) or international passport scan</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#0E6B50] shrink-0" />
                          <span>Minimum 5 high-resolution property interior & exterior photos</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#0E6B50] shrink-0" />
                          <span>MTN or Airtel Mobile Money registered number for deposit payouts</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Mock Sign-In Form (any input works for prototype demo) */}
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#0F1A17]">Email or Phone Number</label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.mercer@gmail.com or +256 782..."
                      className="w-full mt-1.5 px-4 py-3 rounded-xl bg-white border border-[#0F1A17]/15 text-xs text-[#0F1A17] focus:outline-hidden focus:border-[#0E6B50]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0F1A17]">Password (optional in demo)</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full mt-1.5 px-4 py-3 rounded-xl bg-white border border-[#0F1A17]/15 text-xs text-[#0F1A17] focus:outline-hidden focus:border-[#0E6B50]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
                  >
                    <span>Continue as {selectedRole === 'guest' ? 'Guest' : 'Landlord'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-center text-[#6B7A73]">
                    Prototype demo mode active. You can enter any details or use the demo role switcher.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
