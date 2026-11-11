import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, User, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const RoleSwitcherPill: React.FC = () => {
  const { state, dispatch, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSwitch = (role: UserRole) => {
    dispatch({ type: 'SET_ROLE', payload: role });
    showToast(
      `Viewing as ${role.toUpperCase()}`,
      role === 'admin'
        ? 'Full access to African market configs & approvals'
        : role === 'landlord'
        ? 'Switched to Landlord Hosting & Invoices view'
        : 'Switched to Guest Explorer view',
      'info'
    );

    // If currently on admin page and switching away from admin, navigate to appropriate view
    if (location.pathname.startsWith('/admin') && role !== 'admin') {
      navigate(role === 'landlord' ? '/host' : '/explore');
    } else if (role === 'admin' && !location.pathname.startsWith('/admin')) {
      navigate('/admin');
    }
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 z-40 print:hidden select-none">
      <div className="flex items-center gap-1.5 p-1.5 bg-[#0F1A17]/90 text-white rounded-full shadow-2xl backdrop-blur-md border border-white/15 text-xs">
        <span className="hidden sm:inline-block px-2 text-[10px] font-semibold text-white/60 uppercase tracking-wider">
          Demo Mode:
        </span>

        <button
          type="button"
          onClick={() => handleSwitch('guest')}
          className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
            state.currentRole === 'guest'
              ? 'bg-[#0E6B50] text-white shadow-xs'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Guest</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitch('landlord')}
          className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
            state.currentRole === 'landlord'
              ? 'bg-[#F2A541] text-[#0F1A17] shadow-xs'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Landlord</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitch('admin')}
          className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
            state.currentRole === 'admin'
              ? 'bg-[#D9643A] text-white shadow-xs'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      </div>
    </div>
  );
};
