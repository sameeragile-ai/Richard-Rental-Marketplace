import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Smartphone,
  CreditCard,
  Building,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Download,
  Calendar,
  Lock,
  Clock,
  Check,
  Luggage,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX, formatUSD, generateBookingRef, formatDate } from '../utils/format';
import { Booking } from '../types';
import { SafeImage } from '../components/common/SafeImage';

export const CheckoutPage: React.FC = () => {
  const { state, dispatch, showToast } = useApp();
  const navigate = useNavigate();

  // Redirect if cart is empty and no confirmed booking yet
  useEffect(() => {
    if (state.cart.length === 0 && !completedBooking) {
      navigate('/cart');
    }
  }, [state.cart]);

  // Stepper: 1: Guest Details, 2: Payment Method, 3: Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [guestName, setGuestName] = useState('Alex Mercer');
  const [guestEmail, setGuestEmail] = useState('alex.mercer@gmail.com');
  const [guestPhone, setGuestPhone] = useState('+256 782 994 100');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'mtn_momo' | 'airtel_money' | 'card' | 'bank_transfer'>('mtn_momo');
  const [momoPhoneNumber, setMomoPhoneNumber] = useState('782994100');

  // MoMo Processing Simulation
  const [isProcessingMomo, setIsProcessingMomo] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Calculate totals from cart
  const totalDeposit = state.cart.reduce((sum, item) => sum + item.depositAmount, 0);
  const totalBalance = state.cart.reduce((sum, item) => sum + item.balanceDue, 0);
  const grandTotal = totalDeposit + totalBalance;
  const primaryItem = state.cart[0];

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePayNow = () => {
    if (paymentMethod === 'mtn_momo' || paymentMethod === 'airtel_money') {
      setIsProcessingMomo(true);
      setCountdown(8);
    } else {
      finalizeBooking();
    }
  };

  // Countdown timer for simulated USSD PIN approval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isProcessingMomo && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isProcessingMomo && countdown === 0) {
      finalizeBooking();
    }
    return () => clearTimeout(timer);
  }, [isProcessingMomo, countdown]);

  const finalizeBooking = () => {
    setIsProcessingMomo(false);

    const bookingRef = generateBookingRef();
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      referenceNumber: bookingRef,
      propertyId: primaryItem?.property.id || 'UG-KLA-P-000124',
      propertyTitle: primaryItem?.property.title || 'Kololo Hillside Villa',
      propertyImage: primaryItem?.property.images[0] || '',
      propertyDistrict: primaryItem?.property.district || 'Kampala',
      checkIn: primaryItem?.checkIn || '2026-11-20',
      checkOut: primaryItem?.checkOut || '2026-11-23',
      nights: primaryItem?.nights || 3,
      guests: primaryItem?.guests || 2,
      ratePerNight: primaryItem?.ratePerNight || 450000,
      totalAmount: grandTotal,
      depositPaid: totalDeposit,
      balanceDue: totalBalance,
      paymentMethod,
      paymentPhone: `+256 ${momoPhoneNumber}`,
      guestName,
      guestEmail,
      guestPhone,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      isNegotiated: primaryItem?.isNegotiated || false,
    };

    setCompletedBooking(newBooking);
    dispatch({ type: 'CREATE_BOOKING', payload: newBooking });
    setCurrentStep(3);

    // Trigger confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0E6B50', '#F2A541', '#D9643A', '#FAF7F2'],
      });
    } catch {}

    showToast('Booking Confirmed!', `Booking ${bookingRef} has been secured with Mobile Money.`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stepper Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentStep >= 1 ? 'bg-[#0E6B50] text-white' : 'bg-[#EAE4D9] text-[#6B7A73]'
                }`}
              >
                1
              </div>
              <span className="text-xs font-bold text-[#0F1A17]">Guest Info</span>
            </div>

            <div className={`h-0.5 w-12 ${currentStep >= 2 ? 'bg-[#0E6B50]' : 'bg-[#EAE4D9]'}`} />

            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentStep >= 2 ? 'bg-[#0E6B50] text-white' : 'bg-[#EAE4D9] text-[#6B7A73]'
                }`}
              >
                2
              </div>
              <span className="text-xs font-bold text-[#0F1A17]">Deposit Payment</span>
            </div>

            <div className={`h-0.5 w-12 ${currentStep === 3 ? 'bg-[#0E6B50]' : 'bg-[#EAE4D9]'}`} />

            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentStep === 3 ? 'bg-[#1F9D6B] text-white' : 'bg-[#EAE4D9] text-[#6B7A73]'
                }`}
              >
                3
              </div>
              <span className="text-xs font-bold text-[#0F1A17]">Confirmed</span>
            </div>
          </div>
        </div>

        {/* =====================================================
            STEP 1: GUEST DETAILS
            ===================================================== */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs space-y-6">
              <h2 className="font-serif font-bold text-2xl text-[#0F1A17]">Who is checking in?</h2>
              <p className="text-xs text-[#6B7A73]">
                Your booking confirmation and gate pass security clearance will be sent here.
              </p>

              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#0F1A17]">Full Legal Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    className="w-full mt-1.5 px-4 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 focus:outline-hidden focus:border-[#0E6B50]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#0F1A17]">Email Address</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                      className="w-full mt-1.5 px-4 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 focus:outline-hidden focus:border-[#0E6B50]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0F1A17]">Mobile Phone (WhatsApp)</label>
                    <input
                      type="text"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      required
                      className="w-full mt-1.5 px-4 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 focus:outline-hidden focus:border-[#0E6B50]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0F1A17]">
                    Special Requests / Flight Arrival Time (optional)
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Arriving on Qatar Airways at 6 PM. Would appreciate airport pickup coordination."
                    rows={3}
                    className="w-full mt-1.5 px-4 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#0F1A17]/15 focus:outline-hidden focus:border-[#0E6B50]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  <span>Continue to Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Stay Preview Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#0F1A17]/8 shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#0F1A17]">Stay Summary</h3>
              {primaryItem && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <SafeImage
                      src={primaryItem.property.images[0]}
                      alt={primaryItem.property.title}
                      fallbackSeed={primaryItem.property.id}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0F1A17] line-clamp-1">
                        {primaryItem.property.title}
                      </h4>
                      <p className="text-xs text-[#6B7A73]">{primaryItem.property.district}</p>
                      <p className="text-xs text-[#0F1A17] font-semibold mt-1">
                        {primaryItem.nights} nights · {primaryItem.guests} guests
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#0F1A17]/6 space-y-2 text-xs">
                    <div className="flex justify-between text-[#6B7A73]">
                      <span>Total Stay Value</span>
                      <span className="font-bold text-[#0F1A17] tabular-nums">{formatUGX(grandTotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#0E6B50] font-bold">
                      <span>30% Deposit Due Now</span>
                      <span className="tabular-nums">{formatUGX(totalDeposit)}</span>
                    </div>
                    <div className="flex justify-between text-[#6B7A73] text-[11px]">
                      <span>70% Balance on arrival</span>
                      <span className="tabular-nums">{formatUGX(totalBalance)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* =====================================================
            STEP 2: PAYMENT METHOD
            ===================================================== */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#0F1A17]/8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1 text-xs text-[#6B7A73] hover:text-[#0F1A17]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to details</span>
                </button>
                <span className="text-[11px] font-mono text-[#0E6B50] bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  UGANDA ESCROW
                </span>
              </div>

              <div>
                <h2 className="font-serif font-bold text-2xl text-[#0F1A17]">Pay Deposit via MoMo</h2>
                <p className="text-xs text-[#6B7A73] mt-1">
                  Pay only the 30% deposit ({formatUGX(totalDeposit)}) to lock in your booking dates.
                </p>
              </div>

              {/* Selectable Payment Gateways */}
              <div className="space-y-3">
                {/* MTN MoMo */}
                <div
                  onClick={() => setPaymentMethod('mtn_momo')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'mtn_momo'
                      ? 'border-[#F2A541] bg-amber-50/40 shadow-xs'
                      : 'border-[#0F1A17]/10 hover:border-[#0F1A17]/30 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F2A541] text-[#0F1A17] font-black flex items-center justify-center text-xs">
                      MTN
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#0F1A17]">MTN Mobile Money</p>
                      <p className="text-[11px] text-[#6B7A73]">USSD prompt sent to your phone</p>
                    </div>
                  </div>
                  {paymentMethod === 'mtn_momo' && (
                    <div className="w-5 h-5 rounded-full bg-[#0E6B50] text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Airtel Money */}
                <div
                  onClick={() => setPaymentMethod('airtel_money')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'airtel_money'
                      ? 'border-[#D9643A] bg-rose-50/40 shadow-xs'
                      : 'border-[#0F1A17]/10 hover:border-[#0F1A17]/30 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D9643A] text-white font-black flex items-center justify-center text-xs">
                      AM
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#0F1A17]">Airtel Money Uganda</p>
                      <p className="text-[11px] text-[#6B7A73]">Instant push notification confirmation</p>
                    </div>
                  </div>
                  {paymentMethod === 'airtel_money' && (
                    <div className="w-5 h-5 rounded-full bg-[#0E6B50] text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Cards */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'card'
                      ? 'border-[#0E6B50] bg-emerald-50/40 shadow-xs'
                      : 'border-[#0F1A17]/10 hover:border-[#0F1A17]/30 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0E6B50] text-white flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#0F1A17]">Visa / Mastercard</p>
                      <p className="text-[11px] text-[#6B7A73]">International 3D Secure cards</p>
                    </div>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="w-5 h-5 rounded-full bg-[#0E6B50] text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>

              {/* MoMo Phone Input */}
              {(paymentMethod === 'mtn_momo' || paymentMethod === 'airtel_money') && (
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#0F1A17]/10 space-y-2">
                  <label className="text-xs font-bold text-[#0F1A17]">
                    {paymentMethod === 'mtn_momo' ? 'MTN' : 'Airtel'} Phone Number
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-2.5 rounded-xl bg-white border border-[#0F1A17]/15 font-bold text-xs text-[#0F1A17]">
                      +256
                    </div>
                    <input
                      type="text"
                      value={momoPhoneNumber}
                      onChange={(e) => setMomoPhoneNumber(e.target.value)}
                      placeholder="772 123 456"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#0F1A17]/15 text-xs font-bold text-[#0F1A17] focus:outline-hidden focus:border-[#0E6B50]"
                    />
                  </div>
                  <p className="text-[10px] text-[#6B7A73]">
                    A prompt will appear automatically on this handset to approve {formatUGX(totalDeposit)}.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handlePayNow}
                className="w-full py-4 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <Lock className="w-4 h-4" />
                <span>Authorize {formatUGX(totalDeposit)} Deposit</span>
              </button>
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#0F1A17]/8 shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#0F1A17]">Final Authorization</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#6B7A73]">
                  <span>Guest</span>
                  <span className="font-semibold text-[#0F1A17]">{guestName}</span>
                </div>
                <div className="flex justify-between text-[#6B7A73]">
                  <span>Phone</span>
                  <span className="font-semibold text-[#0F1A17]">{guestPhone}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl text-[#0E6B50] font-bold flex justify-between">
                  <span>Due Today via MoMo</span>
                  <span className="tabular-nums">{formatUGX(totalDeposit)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* =====================================================
            SIMULATED MOMO USSD PROMPT OVERLAY
            ===================================================== */}
        <AnimatePresence>
          {isProcessingMomo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-sm rounded-3xl bg-[#FAF7F2] p-8 text-center text-[#0F1A17] shadow-2xl space-y-5"
              >
                {/* Pulsing Phone Graphic */}
                <div className="relative w-20 h-20 rounded-3xl gradient-brand text-white flex items-center justify-center mx-auto shadow-xl">
                  <Smartphone className="w-10 h-10 animate-pulse text-[#F2A541]" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <div>
                  <h3 className="font-serif font-bold text-xl text-[#0F1A17]">Check Your Phone</h3>
                  <p className="text-xs text-[#6B7A73] mt-1">
                    A secure Mobile Money push prompt has been sent to{' '}
                    <strong className="text-[#0F1A17]">+256 {momoPhoneNumber}</strong>.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#0F1A17]/10 font-mono text-xs space-y-1">
                  <p className="text-[#6B7A73]">PAY TO: <strong>Richard Rentals Escrow</strong></p>
                  <p className="text-[#0E6B50] font-bold text-sm">AMOUNT: {formatUGX(totalDeposit)}</p>
                  <p className="text-[10px] text-[#6B7A73]">REF: DEPOSIT-{primaryItem?.property.id}</p>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-[#6B7A73]">
                  <Clock className="w-4 h-4 animate-spin text-[#0E6B50]" />
                  <span>Awaiting PIN approval ({countdown}s)...</span>
                </div>

                <button
                  type="button"
                  onClick={finalizeBooking}
                  className="w-full py-2.5 rounded-xl bg-[#0E6B50] text-white font-bold text-xs hover:bg-[#0B3D2E]"
                >
                  Simulate PIN Entered (Instant Approval)
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================
            STEP 3: CONFIRMATION & DOWNLOADABLE RECEIPT
            ===================================================== */}
        {currentStep === 3 && completedBooking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            {/* Success Card */}
            <div className="bg-white rounded-3xl p-8 border border-[#0F1A17]/8 shadow-lg text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0E6B50] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#0E6B50] uppercase tracking-wider">
                  BOOKING CONFIRMED & SECURED
                </span>
                <h2 className="font-serif font-bold text-3xl text-[#0F1A17] mt-1">
                  You're going to {completedBooking.propertyDistrict}!
                </h2>
                <p className="text-xs text-[#6B7A73] mt-1">
                  We've sent your receipt and check-in instructions to <strong>{completedBooking.guestEmail}</strong>.
                </p>
              </div>

              {/* Printable-Looking Booking Receipt Card */}
              <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#0F1A17]/10 text-left space-y-4 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-[#0F1A17]/10">
                  <div>
                    <span className="text-[10px] text-[#6B7A73] uppercase font-bold">Booking Reference</span>
                    <p className="font-serif font-bold text-lg text-[#0F1A17]">{completedBooking.referenceNumber}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Deposit Paid (30%)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[#6B7A73]">Property</span>
                    <p className="font-bold text-[#0F1A17]">{completedBooking.propertyTitle}</p>
                  </div>
                  <div>
                    <span className="text-[#6B7A73]">Dates</span>
                    <p className="font-bold text-[#0F1A17]">
                      {formatDate(completedBooking.checkIn)} – {formatDate(completedBooking.checkOut)} ({completedBooking.nights}n)
                    </p>
                  </div>
                  <div>
                    <span className="text-[#6B7A73]">Guest</span>
                    <p className="font-bold text-[#0F1A17]">{completedBooking.guestName}</p>
                  </div>
                  <div>
                    <span className="text-[#6B7A73]">Payment via</span>
                    <p className="font-bold text-[#0F1A17] capitalize">
                      {completedBooking.paymentMethod.replace('_', ' ')} ({completedBooking.paymentPhone})
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#0F1A17]/10 space-y-1">
                  <div className="flex justify-between text-[#6B7A73]">
                    <span>Total stay value:</span>
                    <span className="tabular-nums font-semibold text-[#0F1A17]">
                      {formatUGX(completedBooking.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-[#0E6B50]">
                    <span>Deposit paid via MoMo:</span>
                    <span className="tabular-nums">{formatUGX(completedBooking.depositPaid)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B7A73]">
                    <span>Balance payable directly to host on arrival:</span>
                    <span className="tabular-nums font-semibold text-[#0F1A17]">
                      {formatUGX(completedBooking.balanceDue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link
                  to="/trips"
                  className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs text-white gradient-cta hover:opacity-95 shadow-md flex items-center justify-center gap-2"
                >
                  <Luggage className="w-4 h-4" />
                  <span>View in Guest Trips</span>
                </Link>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-3.5 rounded-xl font-bold text-xs text-[#0F1A17] bg-[#FAF7F2] border border-[#0F1A17]/15 hover:bg-[#F1EBE1] flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Print Receipt</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
