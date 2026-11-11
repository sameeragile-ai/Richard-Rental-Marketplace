import React, { useState } from 'react';
import { Home } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSeed?: string;
  className?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Richard Rentals Property',
  fallbackSeed = 'richard-stay',
  className = '',
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [hasFailedOnce, setHasFailedOnce] = useState(false);
  const [hasCompletelyFailed, setHasCompletelyFailed] = useState(false);

  const handleError = () => {
    if (!hasFailedOnce) {
      setHasFailedOnce(true);
      // Fallback to picsum with seed
      setCurrentSrc(`https://picsum.photos/seed/${fallbackSeed}/1200/800`);
    } else {
      setHasCompletelyFailed(true);
    }
  };

  if (hasCompletelyFailed || !currentSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F1EBE1] text-[#6B7A73] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-10 h-10 rounded-full bg-[#0E6B50]/10 flex items-center justify-center mb-2 text-[#0E6B50]">
          <Home className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-[#0F1A17]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={className}
      {...props}
    />
  );
};
