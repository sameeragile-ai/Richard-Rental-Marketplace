import React from 'react';
import { WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfflineBanner: React.FC = () => {
  const { state } = useApp();

  if (!state.isOffline) return null;

  return (
    <div
      role="status"
      className="fixed top-0 left-0 right-0 z-50 bg-[#D9643A] text-white py-2 px-4 text-center text-xs font-semibold shadow-md flex items-center justify-center gap-2"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>You're offline — showing cached listings and wishlist. Actions will sync when reconnected.</span>
    </div>
  );
};
