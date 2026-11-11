import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { state, dispatch } = useApp();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {state.toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-50/95 border-rose-200 text-rose-950'
                : toast.type === 'warning'
                ? 'bg-amber-50/95 border-amber-200 text-amber-950'
                : toast.type === 'info'
                ? 'bg-[#F1EBE1]/95 border-[#0F1A17]/10 text-[#0F1A17]'
                : 'bg-emerald-50/95 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              ) : toast.type === 'warning' ? (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              ) : toast.type === 'info' ? (
                <Info className="w-5 h-5 text-[#0E6B50]" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
              {toast.message && (
                <p className="text-[11px] opacity-85 mt-0.5 leading-snug">{toast.message}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
              className="shrink-0 p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
