import React from 'react';

export const SkeletonPropertyCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#0F1A17]/8 shadow-2xs">
      <div className="aspect-4/3 w-full bg-[#EAE4D9] animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="w-2/5 h-3 bg-[#EAE4D9] rounded-md animate-shimmer" />
        <div className="w-4/5 h-5 bg-[#EAE4D9] rounded-md animate-shimmer" />
        <div className="w-1/3 h-3 bg-[#EAE4D9] rounded-md animate-shimmer" />
        <div className="pt-3 border-t border-[#0F1A17]/6 flex justify-between items-center">
          <div className="w-1/3 h-5 bg-[#EAE4D9] rounded-md animate-shimmer" />
          <div className="w-9 h-9 bg-[#EAE4D9] rounded-xl animate-shimmer" />
        </div>
      </div>
    </div>
  );
};
