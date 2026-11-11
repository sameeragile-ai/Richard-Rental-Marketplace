import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BrandedLoaderProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({
  onComplete,
  minDurationMs = 1800,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only run if not already shown in this session
    const hasLoadedBefore = sessionStorage.getItem('richard_loader_shown');
    if (hasLoadedBefore) {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem('richard_loader_shown', 'true');
      setIsVisible(false);
      onComplete?.();
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [minDurationMs, onComplete]);

  const brandLetters = 'Richard'.split('');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.65, ease: [0.77, 0, 0.175, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAF7F2] text-[#0F1A17]"
        >
          <div className="flex flex-col items-center">
            {/* Architectural House + R Monogram SVG */}
            <div className="relative w-28 h-28 mb-6">
              <svg
                viewBox="0 0 120 120"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F2A541" />
                    <stop offset="100%" stopColor="#D9643A" />
                  </linearGradient>
                </defs>

                {/* Animated house outline stroke */}
                <motion.path
                  d="M60 16 L102 52 L90 52 L90 100 L30 100 L30 52 L18 52 Z"
                  stroke="#0E6B50"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                />

                {/* Chimney */}
                <motion.path
                  d="M80 34 L80 22 L88 22 L88 41"
                  stroke="#0E6B50"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />

                {/* Warm gradient fill appearing */}
                <motion.path
                  d="M60 20 L98 52 L86 52 L86 96 L34 96 L34 52 L22 52 Z"
                  fill="url(#loaderGrad)"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 0.9, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                />

                {/* Monogram R */}
                <motion.text
                  x="60"
                  y="82"
                  textAnchor="middle"
                  fontFamily="'Fraunces', Georgia, serif"
                  fontSize="46"
                  fontWeight="700"
                  fill="#FAF7F2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  R
                </motion.text>
              </svg>
            </div>

            {/* Letter by letter wordmark */}
            <div className="flex items-center space-x-1 font-serif text-3xl font-bold tracking-tight text-[#0F1A17] mb-2">
              {brandLetters.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.7 + i * 0.07 }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="text-xs font-semibold tracking-[0.2em] text-[#6B7A73] uppercase mb-6"
            >
              RENTAL MARKETPLACE
            </motion.p>

            {/* Thin gradient progress line */}
            <div className="w-48 h-0.5 bg-[#E2DACF] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.3, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-[#0E6B50] via-[#F2A541] to-[#D9643A]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
