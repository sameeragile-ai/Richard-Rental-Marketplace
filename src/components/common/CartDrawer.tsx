import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Calendar, Users, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatUGX, formatUSD, formatShortDate } from '../../utils/format';
import { SafeImage } from './SafeImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const totalDeposit = state.cart.reduce((sum, item) => sum + item.depositAmount, 0);
  const totalBalance = state.cart.reduce((sum, item) => sum + item.balanceDue, 0);
  const grandTotal = totalDeposit + totalBalance;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleRemove = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative w-full max-w-md bg-[#FAF7F2] text-[#0F1A17] shadow-2xl flex flex-col h-full z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#0F1A17]/8 bg-white/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0E6B50]/10 text-[#0E6B50] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#0F1A17]">Your Stays Cart</h3>
                  <p className="text-[11px] text-[#6B7A73]">
                    {state.cart.length} {state.cart.length === 1 ? 'reservation' : 'reservations'} selected
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[#F1EBE1] text-[#6B7A73] transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {state.cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#F1EBE1] flex items-center justify-center text-[#6B7A73]">
                    <ShoppingBag className="w-8 h-8 opacity-40" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#0F1A17]">Cart is empty</h4>
                    <p className="text-xs text-[#6B7A73] max-w-xs mt-1">
                      Explore verified luxury villas, modern lofts, and lakeside retreats across Uganda.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/explore');
                    }}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-sm transition-transform active:scale-98"
                  >
                    Explore Stays
                  </button>
                </div>
              ) : (
                state.cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl p-4 border border-[#0F1A17]/8 shadow-2xs space-y-3 relative group"
                  >
                    <div className="flex gap-3">
                      <SafeImage
                        src={item.property.images[0]}
                        alt={item.property.title}
                        fallbackSeed={item.property.id}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-serif font-bold text-sm text-[#0F1A17] line-clamp-1">
                            {item.property.title}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="text-[#6B7A73] hover:text-[#C8452F] p-1 rounded transition-colors"
                            title="Remove stay"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-[11px] text-[#6B7A73] mt-0.5">
                          {item.property.district} · {item.property.type}
                        </p>

                        <div className="flex items-center gap-2 mt-2 text-[11px] text-[#0F1A17]/80">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#0E6B50]" />
                            {formatShortDate(item.checkIn)} – {formatShortDate(item.checkOut)} ({item.nights}n)
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 font-medium">
                            <Users className="w-3.5 h-3.5 text-[#0E6B50]" />
                            {item.guests} {item.guests === 1 ? 'guest' : 'guests'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#0F1A17]/5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold tabular-nums text-[#0F1A17]">
                          {formatUGX(item.ratePerNight)}
                        </span>
                        <span className="text-[10px] text-[#6B7A73]">/night</span>
                        {item.isNegotiated && (
                          <span className="text-[10px] font-bold text-[#D9643A] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Agreed Offer
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-bold tabular-nums text-[#0E6B50]">
                          {formatUGX(item.totalAmount)}
                        </p>
                        <p className="text-[10px] text-[#6B7A73] tabular-nums">
                          30% deposit: {formatUGX(item.depositAmount)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Breakdown & Checkout */}
            {state.cart.length > 0 && (
              <div className="p-5 border-t border-[#0F1A17]/8 bg-white/90 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6B7A73]">
                    <span>Total stay value</span>
                    <span className="font-medium tabular-nums text-[#0F1A17]">
                      {formatUGX(grandTotal)} <span className="text-[11px] text-[#6B7A73]">{formatUSD(grandTotal)}</span>
                    </span>
                  </div>

                  <div className="flex justify-between text-[#0E6B50] font-bold">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Deposit due now (30%)
                    </span>
                    <span className="tabular-nums text-sm">{formatUGX(totalDeposit)}</span>
                  </div>

                  <div className="flex justify-between text-[#6B7A73] text-[11px]">
                    <span>Balance payable to landlord on arrival</span>
                    <span className="tabular-nums font-medium">{formatUGX(totalBalance)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white gradient-cta hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
                >
                  <span>Proceed to MoMo Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-[#6B7A73]">
                  Protected by Richard Guarantee · Free cancellation up to 48 hrs prior
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
