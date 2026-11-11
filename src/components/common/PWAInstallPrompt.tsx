import React, { useState, useEffect } from 'react';
import { Download, Share2, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt: React.FC<{ variant?: 'button' | 'banner' | 'footer' }> = ({
  variant = 'button',
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      // Ambient guide for desktop or unsupported
      setShowIOSModal(true);
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {variant === 'footer' ? (
        <button
          type="button"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#0F1A17] hover:bg-[#F1EBE1] border border-[#0F1A17]/10 transition-colors shadow-2xs"
        >
          <Download className="w-4 h-4 text-[#0E6B50]" />
          <span>Install Richard App</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white gradient-brand hover:opacity-95 shadow-xs transition-transform active:scale-98"
        >
          <Download className="w-4 h-4 text-[#F2A541]" />
          <span>Install App for Offline Use</span>
        </button>
      )}

      {/* iOS or Manual Install Modal */}
      <AnimatePresence>
        {showIOSModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowIOSModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-[#FAF7F2] text-[#0F1A17] p-6 shadow-2xl border border-[#0F1A17]/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl gradient-brand text-white flex items-center justify-center font-serif font-bold text-lg">
                    R
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#0F1A17]">Install Richard App</h3>
                    <p className="text-[11px] text-[#6B7A73]">Save homes & view offline</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSModal(false)}
                  className="p-1 rounded-lg hover:bg-[#F1EBE1] text-[#6B7A73]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 my-4 text-xs text-[#0F1A17]/85">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-[#0F1A17]/5">
                  <div className="w-6 h-6 rounded-full bg-[#0E6B50]/10 text-[#0E6B50] flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <p>
                    Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-1 text-[#0E6B50]" /> in your browser toolbar (Safari or Chrome).
                  </p>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-[#0F1A17]/5">
                  <div className="w-6 h-6 rounded-full bg-[#0E6B50]/10 text-[#0E6B50] flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <p>
                    Scroll down and select <strong>Add to Home Screen</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-[#0F1A17]/5">
                  <div className="w-6 h-6 rounded-full bg-[#0E6B50]/10 text-[#0E6B50] flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <p>
                    Open Richard from your home screen for instant offline browsing!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#0E6B50] text-white hover:bg-[#0B3D2E] transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
