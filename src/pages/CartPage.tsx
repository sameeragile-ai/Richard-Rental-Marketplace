import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Calendar, Users, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX, formatUSD, formatShortDate } from '../utils/format';
import { SafeImage } from '../components/common/SafeImage';

export const CartPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const totalDeposit = state.cart.reduce((sum, item) => sum + item.depositAmount, 0);
  const totalBalance = state.cart.reduce((sum, item) => sum + item.balanceDue, 0);
  const grandTotal = totalDeposit + totalBalance;

  const handleRemove = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-24 lg:pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#6B7A73] mb-1">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-[#0E6B50] font-semibold">Your Stays Cart</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F1A17]">
            Your Stays Cart
          </h1>
          <p className="text-xs text-[#6B7A73] mt-1">
            Review your selected homes across Uganda. Pay a 30% Mobile Money deposit now to lock dates.
          </p>
        </div>

        {state.cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#0F1A17]/8 shadow-2xs space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#F1EBE1] flex items-center justify-center text-[#6B7A73] mx-auto">
              <ShoppingBag className="w-8 h-8 opacity-40" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-[#0F1A17]">Your cart is empty</h2>
            <p className="text-xs text-[#6B7A73]">
              You haven't added any stays yet. Explore verified villas and apartments with direct landlord pricing.
            </p>
            <Link
              to="/explore"
              className="inline-block px-6 py-3 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-sm"
            >
              Explore Uganda Stays
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Column */}
            <div className="lg:col-span-7 space-y-4">
              {state.cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-[#0F1A17]/8 shadow-2xs space-y-4"
                >
                  <div className="flex gap-4">
                    <SafeImage
                      src={item.property.images[0]}
                      alt={item.property.title}
                      fallbackSeed={item.property.id}
                      className="w-24 h-24 rounded-2xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <Link
                          to={`/property/${item.property.id}`}
                          className="font-serif font-bold text-base text-[#0F1A17] hover:text-[#0E6B50] line-clamp-1"
                        >
                          {item.property.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="p-1.5 text-[#6B7A73] hover:text-[#C8452F] rounded-lg transition-colors"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-[#6B7A73] mt-0.5">
                        {item.property.district} · {item.property.type}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-xs text-[#0F1A17]/80">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#0E6B50]" />
                          {formatShortDate(item.checkIn)} – {formatShortDate(item.checkOut)} ({item.nights} nights)
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Users className="w-3.5 h-3.5 text-[#0E6B50]" />
                          {item.guests} guests
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#0F1A17]/6 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold tabular-nums text-[#0F1A17]">
                        {formatUGX(item.ratePerNight)}/night
                      </span>
                      {item.isNegotiated && (
                        <span className="text-[10px] font-bold text-[#D9643A] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Agreed Rate
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-bold tabular-nums text-sm text-[#0F1A17]">
                        {formatUGX(item.totalAmount)}
                      </p>
                      <p className="text-[10px] text-[#0E6B50] font-semibold tabular-nums">
                        30% Deposit: {formatUGX(item.depositAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-white rounded-3xl p-6 border border-[#0F1A17]/10 shadow-lg space-y-6">
                <h3 className="font-serif font-bold text-xl text-[#0F1A17] pb-3 border-b border-[#0F1A17]/8">
                  Payment Summary
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#6B7A73]">
                    <span>Total stay value ({state.cart.length} stays)</span>
                    <span className="font-semibold text-[#0F1A17] tabular-nums">
                      {formatUGX(grandTotal)}
                    </span>
                  </div>

                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-emerald-950">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-[#0E6B50]" />
                        Deposit due today (30%)
                      </span>
                      <span className="tabular-nums text-sm text-[#0E6B50]">
                        {formatUGX(totalDeposit)}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-800">
                      Instant verification via MTN or Airtel Mobile Money.
                    </p>
                  </div>

                  <div className="flex justify-between text-[#6B7A73] text-[11px] pt-1">
                    <span>Remaining 70% balance</span>
                    <span className="font-medium text-[#0F1A17] tabular-nums">
                      {formatUGX(totalBalance)} (pay host on arrival)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 px-4 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
                >
                  <span>Proceed to Mobile Money Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-[10px] text-center text-[#6B7A73] space-y-1">
                  <p>Richard Escrow Guarantee · 100% Refundable if Host Cancels</p>
                  <p>Customer Support: +256 701 440 229 (WhatsApp / Call)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
