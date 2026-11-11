import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Compass, Heart, ShoppingBag, Luggage, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BottomTabBarProps {
  onOpenCart?: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ onOpenCart }) => {
  const { state } = useApp();
  const location = useLocation();

  // Hide on admin routes or full screen checkout to maximize viewport
  if (location.pathname.startsWith('/admin') || location.pathname === '/checkout') {
    return null;
  }

  const cartCount = state.cart.length;
  const savedCount = state.savedPropertyIds.length;

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-xl border-t border-[#0F1A17]/10 px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg"
    >
      <div className="flex items-center justify-around">
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors min-w-[56px] min-h-[44px] ${
              isActive ? 'text-[#0E6B50]' : 'text-[#6B7A73]'
            }`
          }
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Explore</span>
        </NavLink>

        <NavLink
          to="/trips?tab=saved"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors min-w-[56px] min-h-[44px] ${
              isActive ? 'text-[#0E6B50]' : 'text-[#6B7A73]'
            }`
          }
        >
          <Heart className="w-5 h-5 mb-0.5" />
          <span>Saved</span>
          {savedCount > 0 && (
            <span className="absolute top-1 right-2.5 w-3.5 h-3.5 rounded-full bg-[#D9643A] text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
              {savedCount}
            </span>
          )}
        </NavLink>

        <button
          type="button"
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold text-[#6B7A73] hover:text-[#0E6B50] min-w-[56px] min-h-[44px]"
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-2.5 w-4 h-4 rounded-full gradient-cta text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
              {cartCount}
            </span>
          )}
        </button>

        <NavLink
          to="/trips"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors min-w-[56px] min-h-[44px] ${
              isActive ? 'text-[#0E6B50]' : 'text-[#6B7A73]'
            }`
          }
        >
          <Luggage className="w-5 h-5 mb-0.5" />
          <span>Trips</span>
        </NavLink>

        <NavLink
          to={state.currentRole === 'admin' ? '/admin' : state.currentRole === 'landlord' ? '/host' : '/auth'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors min-w-[56px] min-h-[44px] ${
              isActive ? 'text-[#0E6B50]' : 'text-[#6B7A73]'
            }`
          }
        >
          <UserCheck className="w-5 h-5 mb-0.5" />
          <span className="capitalize">{state.currentRole}</span>
        </NavLink>
      </div>
    </nav>
  );
};
