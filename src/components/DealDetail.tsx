/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useI18n } from '../i18n';
import { KapadaDB } from '../db';
import { Deal, DealStatus, Profile, TransportBooking, TransportStatus, Review, Message, Role } from '../types';
import RazorpayModal from './RazorpayModal';
import { ArrowLeft, Clock, ShieldCheck, Truck, ShieldAlert, Send, CheckCircle2, MessageSquare, Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface DealDetailProps {
  dealId: string;
  currentUser: Profile;
  onBack: () => void;
}

export default function DealDetail({ dealId, currentUser, onBack }: DealDetailProps) {
  const { t, language } = useI18n();
  const [deal, setDeal] = useState<Deal | undefined>(undefined);
  const [transport, setTransport] = useState<TransportBooking | undefined>(undefined);
  const [showRazorpay, setShowRazorpay] = useState(false);

  // Transport Booking Form States
  const [vehicle, setVehicle] = useState('Tata Ace');
  const [pickupSlot, setPickupSlot] = useState('');
  const [provider, setProvider] = useState<'self' | 'third_party'>('third_party');
  const [pickupAddress, setPickupAddress] = useState('');

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  // Dispute states
  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  // Chat/Messages states
  const [chatText, setChatText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = KapadaDB.getDeal(dealId);
    setDeal(d);
    if (d) {
      setTransport(KapadaDB.getTransportForDeal(dealId));
      setMessages(KapadaDB.getMessages(dealId));
      
      // Check if user has already reviewed
      const revs = KapadaDB.getReviews().filter(r => r.deal_id === dealId && r.reviewer_role === currentUser.role);
      setHasReviewed(revs.length > 0);
    }
  }, [dealId, currentUser]);

  // Subscribe to auto reply message updates
  useEffect(() => {
    const handleNewMessage = (e: any) => {
      if (!e.detail.isListingId && e.detail.dealId === dealId) {
        setMessages(KapadaDB.getMessages(dealId));
        setDeal(KapadaDB.getDeal(dealId));
        setTransport(KapadaDB.getTransportForDeal(dealId));
      }
    };
    window.addEventListener('kapada_new_message', handleNewMessage);
    return () => {
      window.removeEventListener('kapada_new_message', handleNewMessage);
    };
  }, [dealId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!deal) {
    return <div className="text-center py-12 text-stone-500 text-xs">Deal not found.</div>;
  }

  const handlePaymentSuccess = (paymentId: string) => {
    const updated = KapadaDB.updateDealStatus(dealId, DealStatus.PAID, paymentId);
    setDeal(updated);
    setShowRazorpay(false);
  };

  const handleBookTransport = (e: FormEvent) => {
    e.preventDefault();
    if (!pickupSlot.trim() || !pickupAddress.trim()) return;

    // Estimate transit cost based on vehicle
    const cost = vehicle === 'Tata Zip' ? 400 : vehicle === 'Tata Ace' ? 800 : 1500;

    const newBooking = KapadaDB.createTransportBooking({
      deal_id: dealId,
      arranged_by: currentUser.role === Role.SELLER ? 'seller' : 'buyer',
      provider,
      pickup_address: pickupAddress,
      pickup_slot: pickupSlot,
      vehicle_type: vehicle,
      cost,
      tracking_notes: 'Scheduled for dispatch. Transporter contact: +919001122334',
    });

    setTransport(newBooking);
    setDeal(KapadaDB.getDeal(dealId));
  };

  const handleUpdateTransportStatus = (status: TransportStatus, notes: string) => {
    if (!transport) return;
    const updated = KapadaDB.updateTransportStatus(transport.id, status, notes);
    setTransport(updated);
    setDeal(KapadaDB.getDeal(dealId));
  };

  const handleConfirmDelivery = () => {
    // Release escrow payout to seller
    const updated = KapadaDB.updateDealStatus(dealId, DealStatus.COMPLETED);
    setDeal(updated);
  };

  const handleRaiseDispute = (e: FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;

    KapadaDB.raiseDispute(dealId, currentUser.id, disputeReason.trim());
    setDeal(KapadaDB.getDeal(dealId));
    setShowDisputeForm(false);
    setDisputeReason('');
  };

  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    KapadaDB.createReview({
      deal_id: dealId,
      reviewer_role: currentUser.role === Role.SELLER ? 'seller' : 'buyer',
      rating,
      comment: comment.trim(),
    });

    setHasReviewed(true);
    setComment('');
  };

  const handleSendChat = (e: FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    KapadaDB.createMessage(dealId, currentUser.id, chatText.trim(), false);
    setChatText('');
    setMessages(KapadaDB.getMessages(dealId));
  };

  const isBuyer = currentUser.role === Role.BUYER;
  const isSeller = currentUser.role === Role.SELLER;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 py-4 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <button
        onClick={onBack}
        className="text-stone-500 hover:text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Main Grid: Left Timeline/Details, Right Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Deal Progress Timeline & Setup */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Deal Summary Header */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4 card-cinematic">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div>
                <span className="text-[8px] text-stone-400 font-mono font-bold uppercase tracking-wider">
                  DEAL LEDGER ID: {deal.id}
                </span>
                <h3 className="font-sans font-extrabold text-base text-stone-900 mt-0.5 leading-tight">
                  {deal.listing_title}
                </h3>
              </div>
              <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-md self-start ${
                deal.status === DealStatus.AWAITING_PAYMENT ? 'bg-orange-50 text-orange-700' :
                deal.status === DealStatus.PAID ? 'bg-blue-50 text-blue-700' :
                deal.status === DealStatus.IN_TRANSIT ? 'bg-teal-50 text-teal-700' :
                deal.status === DealStatus.DELIVERED ? 'bg-amber-50 text-amber-700 animate-pulse' :
                deal.status === DealStatus.COMPLETED ? 'bg-emerald-50 text-emerald-700' :
                'bg-stone-100 text-stone-600'
              }`}>
                {deal.status.replace('_', ' ')}
              </span>
            </div>

            {/* Financial break up */}
            <div className="bg-stone-50/50 rounded-2xl border border-stone-150 p-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[8px] text-stone-400 font-bold uppercase block leading-none">Net Weight</span>
                <strong className="text-stone-900 text-xs mt-1 block">{deal.quantity_kg} kg</strong>
              </div>
              <div>
                <span className="text-[8px] text-stone-400 font-bold uppercase block leading-none">Agreed Rate</span>
                <strong className="text-emerald-700 text-xs mt-1 block">₹{deal.agreed_price_per_kg}/kg</strong>
              </div>
              <div>
                <span className="text-[8px] text-stone-400 font-bold uppercase block leading-none">Escrow Total</span>
                <strong className="text-emerald-700 text-xs mt-1 block">₹{deal.total_amount}</strong>
              </div>
            </div>

            {/* Transaction Timeline Stages */}
            <div className="pt-4 border-t border-stone-100 space-y-4">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                {t('dealStatusLabel')}
              </span>

              <div className="relative pl-6 space-y-6">
                {/* Visual Line connector */}
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-stone-200"></div>

                {/* Stage 1: Payment */}
                <div className="relative">
                  <div className={`absolute -left-5 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 ${
                    deal.status !== DealStatus.AWAITING_PAYMENT ? 'bg-emerald-600 border-white' : 'bg-white border-orange-500'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${deal.status !== DealStatus.AWAITING_PAYMENT ? 'bg-white' : 'bg-orange-500'}`}></div>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">1. Escrow Deposit (Razorpay)</h5>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      {deal.status === DealStatus.AWAITING_PAYMENT
                        ? 'Buyer must fund the contract. Funds are secured in platform-controlled escrow.'
                        : `Funds successfully captured. Razorpay Ref: ${deal.payment_ref}`}
                    </p>
                    
                    {/* Buyer Action to Pay */}
                    {deal.status === DealStatus.AWAITING_PAYMENT && isBuyer && (
                      <button
                        onClick={() => setShowRazorpay(true)}
                        className="mt-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors uppercase tracking-wider btn-premium btn-ripple btn-glow"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                        {t('payWithRazorpay', { amount: deal.total_amount.toString() })}
                      </button>
                    )}

                    {deal.status === DealStatus.AWAITING_PAYMENT && isSeller && (
                      <span className="inline-block mt-2 text-[10px] text-orange-600 font-semibold bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">
                        ⏳ Awaiting buyer's deposit. Prepare fabric packing in the meantime.
                      </span>
                    )}
                  </div>
                </div>

                {/* Stage 2: Transport/Logistics */}
                <div className="relative">
                  <div className={`absolute -left-5 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 ${
                    deal.status === DealStatus.AWAITING_PAYMENT ? 'bg-stone-100 border-stone-300' :
                    deal.status === DealStatus.PAID ? 'bg-white border-blue-500' : 'bg-emerald-600 border-white'
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">2. Local Logistics & Dispatch</h5>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      {deal.status === DealStatus.AWAITING_PAYMENT ? 'Scheduled after secure payment.' :
                       !transport ? 'Securely paid. Setup pickup slot and transport cargo.' :
                       `Cargo picked up. Vehicle: ${transport.vehicle_type} (${transport.status.replace('_', ' ')})`}
                    </p>

                    {/* Book Transport form trigger */}
                    {deal.status === DealStatus.PAID && !transport && (
                      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mt-3 space-y-3">
                        <h6 className="font-bold text-xs text-stone-900 flex items-center gap-1">
                          <Truck className="w-4 h-4 text-emerald-600" />
                          {t('transportBookingTitle')}
                        </h6>
                        <form onSubmit={handleBookTransport} className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] font-bold text-stone-400 block mb-0.5">Vehicle Type</label>
                              <select
                                value={vehicle}
                                onChange={e => setVehicle(e.target.value)}
                                className="w-full border border-stone-200 bg-white rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-hidden focus:border-emerald-600"
                              >
                                <option value="Tata Zip">{t('threeWheeler')}</option>
                                <option value="Tata Ace">{t('chotaHathi')}</option>
                                <option value="Bolero">{t('pickupTruck')}</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-stone-400 block mb-0.5">Pickup Date/Slot</label>
                              <input
                                type="text"
                                value={pickupSlot}
                                onChange={e => setPickupSlot(e.target.value)}
                                placeholder="e.g. Sat 10:00 AM"
                                className="w-full border border-stone-200 bg-white rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-hidden focus:border-emerald-600"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-stone-400 block mb-0.5">Pickup Address</label>
                            <input
                              type="text"
                              value={pickupAddress}
                              onChange={e => setPickupAddress(e.target.value)}
                              placeholder="Confirm exact workshop pickup location"
                              className="w-full border border-stone-200 bg-white rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-hidden focus:border-emerald-600"
                              required
                            />
                          </div>

                          <div className="flex justify-between items-center bg-white p-2 border border-stone-100 rounded-xl">
                            <span className="text-[10px] text-stone-500 font-bold">Transit Cost:</span>
                            <span className="text-xs font-extrabold text-emerald-700">
                              ₹{vehicle === 'Tata Zip' ? 400 : vehicle === 'Tata Ace' ? 800 : 1500} (UPI on delivery)
                            </span>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-[10px] py-2 px-3 rounded-lg transition-colors uppercase btn-premium btn-ripple"
                          >
                            {t('bookTransportConfirm')}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Transport Tracking Updates */}
                    {transport && (
                      <div className="bg-stone-50 border border-stone-150 rounded-2xl p-4 mt-3 space-y-2">
                        <div className="flex justify-between items-center border-b border-stone-100 pb-1.5">
                          <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-emerald-600 animate-bounce" />
                            Transit Status Tracker
                          </span>
                          <span className="text-[9px] bg-stone-200 text-stone-700 font-bold uppercase px-2 py-0.5 rounded">
                            {transport.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-600 font-semibold leading-normal">
                          📍 {transport.tracking_notes}
                        </p>
                        <p className="text-[9px] text-stone-400 font-medium">
                          Pickup Slot: <strong className="text-stone-700">{transport.pickup_slot}</strong> • Vehicle: <strong className="text-stone-700">{transport.vehicle_type}</strong>
                        </p>

                        {/* Cargo controls for Seller to dispatch or complete */}
                        {isSeller && transport.status === TransportStatus.AWAITING_PICKUP && (
                          <button
                            onClick={() => handleUpdateTransportStatus(TransportStatus.IN_TRANSIT, 'Cargo loaded. Driver headed to recyclers.')}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-[10px] uppercase transition-colors btn-premium btn-ripple"
                          >
                            {t('markDispatched')}
                          </button>
                        )}

                        {isSeller && transport.status === TransportStatus.IN_TRANSIT && (
                          <button
                            onClick={() => handleUpdateTransportStatus(TransportStatus.DELIVERED, 'Weighed & delivered. Awaiting buyer quality check.')}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-[10px] uppercase transition-colors btn-premium btn-ripple"
                          >
                            {t('markDelivered')}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stage 3: Verification & Release */}
                <div className="relative">
                  <div className={`absolute -left-5 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 ${
                    deal.status === DealStatus.COMPLETED ? 'bg-emerald-600 border-white' :
                    deal.status === DealStatus.DELIVERED ? 'bg-white border-amber-500' : 'bg-stone-100 border-stone-300'
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">3. Verification & Escrow Payout</h5>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      {deal.status === DealStatus.COMPLETED
                        ? 'Escrow released! ₹' + (deal.total_amount * 0.95).toFixed(0) + ' disbursed to Seller.'
                        : 'Once fabric arrives, Buyer confirms delivery. Commission released.'}
                    </p>

                    {/* Buyer Release CTAs */}
                    {deal.status === DealStatus.DELIVERED && isBuyer && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={handleConfirmDelivery}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors uppercase tracking-wider btn-premium btn-ripple"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          Verify & Release Payment
                        </button>
                        <button
                          onClick={() => setShowDisputeForm(!showDisputeForm)}
                          className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 px-3 rounded-xl text-xs transition-colors uppercase"
                        >
                          Dispute
                        </button>
                      </div>
                    )}

                    {deal.status === DealStatus.DELIVERED && isSeller && (
                      <span className="inline-block mt-2.5 text-[10px] text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                        ⏳ Buyer is checking cloth quality. Escrow will release soon.
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Raise Dispute Overlay / Form */}
            {showDisputeForm && (
              <div className="border-t border-stone-100 pt-4 mt-3 space-y-3">
                <h6 className="font-bold text-xs text-stone-900 flex items-center gap-1 text-red-700">
                  <ShieldAlert className="w-4 h-4" />
                  {t('raiseDisputeBtn')}
                </h6>
                <form onSubmit={handleRaiseDispute} className="space-y-2">
                  <textarea
                    value={disputeReason}
                    onChange={e => setDisputeReason(e.target.value)}
                    placeholder={t('disputeReason')}
                    rows={2}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-red-500"
                    required
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowDisputeForm(false)}
                      className="border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 font-bold px-3 py-1.5 rounded-lg text-[10px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-1.5 rounded-lg text-[10px]"
                    >
                      Submit Dispute
                    </button>
                  </div>
                </form>
              </div>
            )}

            {deal.status === DealStatus.DISPUTED && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mt-4 text-red-800 text-xs">
                <div className="flex gap-2 font-bold">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  {t('disputePending')}
                </div>
                <p className="text-[10px] text-red-600 leading-normal mt-1.5">
                  Weighed mass disputes freeze escrow release. An operator from Priya Sharma's admin desk is validating driver weights and checking pictures.
                </p>
              </div>
            )}
          </div>

          {/* Ratings & Double Sided Reviews Card */}
          {deal.status === DealStatus.COMPLETED && (
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4 card-cinematic">
              <h4 className="font-sans font-bold text-sm text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                <Heart className="w-4 h-4 text-red-500" />
                {t('ratingTitle')}
              </h4>

              {hasReviewed ? (
                <div className="text-center py-4 text-xs text-stone-500 font-semibold flex items-center justify-center gap-1">
                  <span>⭐️</span> Review Submitted! Thank you for establishing trust on KapadaSETU.
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="flex gap-1.5 items-center">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-2">Stars Rating:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-orange-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= rating ? 'fill-orange-400' : 'text-stone-300'}`} />
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-400 block mb-1 uppercase tracking-wider">
                      {t('commentLabel')}
                    </label>
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Excellent sorting, highly recommended..."
                      rows={2}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 input-cinematic"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors uppercase tracking-wider btn-premium btn-ripple"
                  >
                    {t('submitReview')}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Direct Chat Box for Logistics discussions */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs h-[500px] flex flex-col justify-between">
            {/* Header */}
            <div className="bg-stone-900 text-white px-4 py-3 shrink-0 flex items-center justify-between glass-panel-dark">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs">Deal Logistics Discussion</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50">
              {messages.length === 0 ? (
                <div className="text-center py-20 text-stone-400 text-xs flex flex-col items-center justify-center gap-1.5">
                  <span>💬</span>
                  Negotiations frozen. Discuss vehicle timings and coordinates here.
                </div>
              ) : (
                messages.map(m => {
                  const myMsg = m.sender_id === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col max-w-[85%] ${myMsg ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <span className="text-[8px] text-stone-400 font-bold mb-0.5 px-1">
                        {myMsg ? 'Me' : m.sender_name}
                      </span>
                      <div
                        className={`p-2.5 rounded-2xl text-xs ${
                          myMsg
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-white border border-stone-150 text-stone-950 rounded-tl-none'
                        }`}
                      >
                        {m.body}
                      </div>
                      <span className="text-[7px] text-stone-400 mt-0.5 px-1 font-mono">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef}></div>
            </div>

            {/* Send input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-stone-100 flex gap-2 shrink-0 bg-white">
              <input
                type="text"
                value={chatText}
                onChange={e => setChatText(e.target.value)}
                placeholder="Type details..."
                className="flex-1 border border-stone-200 rounded-xl px-3 py-1.5 text-xs focus:outline-hidden focus:border-emerald-600 input-cinematic"
              />
              <button
                type="submit"
                className="bg-stone-950 hover:bg-stone-850 text-white p-2 rounded-xl shrink-0 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Razorpay Modal Overlay */}
      {showRazorpay && (
        <RazorpayModal
          deal={deal}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowRazorpay(false)}
        />
      )}
    </motion.div>
  );
}
