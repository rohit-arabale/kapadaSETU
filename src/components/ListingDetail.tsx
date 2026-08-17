/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useI18n } from '../i18n';
import { KapadaDB } from '../db';
import { Listing, Profile, Offer, OfferStatus, Message, Role } from '../types';
import { MessageSquare, ArrowLeft, Send, Sparkles, Scale, CircleDollarSign } from 'lucide-react';
import { motion } from 'motion/react';

interface ListingDetailProps {
  listingId: string;
  currentUser: Profile;
  onBack: () => void;
  onSelectDeal: (id: string) => void;
}

export default function ListingDetail({
  listingId,
  currentUser,
  onBack,
  onSelectDeal,
}: ListingDetailProps) {
  const { t } = useI18n();
  const listing = KapadaDB.getListing(listingId);
  const seller = listing ? KapadaDB.getProfile(listing.seller_id) : null;

  const [pricePerKg, setPricePerKg] = useState('');
  const [quantityKg, setQuantityKg] = useState('');
  const [offerMsg, setOfferMsg] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [chatText, setChatText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load existing offers and messages
  const offers = KapadaDB.getOffersForListing(listingId);

  useEffect(() => {
    setMessages(KapadaDB.getMessages(listingId));
  }, [listingId]);

  // Subscribe to real-time auto replies
  useEffect(() => {
    const handleNewMessage = (e: any) => {
      if (e.detail.isListingId && e.detail.dealId === listingId) {
        setMessages(KapadaDB.getMessages(listingId));
      }
    };
    window.addEventListener('kapada_new_message', handleNewMessage);
    return () => {
      window.removeEventListener('kapada_new_message', handleNewMessage);
    };
  }, [listingId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!listing) {
    return (
      <div className="text-center py-12 text-stone-500 text-xs">
        Listing not found or expired.
      </div>
    );
  }

  const handleMakeOffer = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const price = parseFloat(pricePerKg);
    const qty = parseFloat(quantityKg);

    if (!pricePerKg.trim() || !quantityKg.trim() || !offerMsg.trim()) {
      setError('Please fill in all buy offer fields.');
      return;
    }

    if (isNaN(price) || price <= 0) {
      setError('Offered price must be a valid positive number.');
      return;
    }

    if (isNaN(qty) || qty <= 0 || qty > listing.quantity_kg) {
      setError(`Quantity must be a positive number up to ${listing.quantity_kg} kg.`);
      return;
    }

    KapadaDB.createOffer({
      listing_id: listingId,
      buyer_id: currentUser.id,
      price_per_kg: price,
      quantity_kg: qty,
      message: offerMsg.trim(),
    });

    setSuccess('Bargaining offer submitted successfully! The seller has been notified.');
    setPricePerKg('');
    setQuantityKg('');
    setOfferMsg('');
  };

  const handleSendChat = (e: FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    KapadaDB.createMessage(listingId, currentUser.id, chatText.trim(), true);
    setChatText('');
    setMessages(KapadaDB.getMessages(listingId));
  };

  const isSeller = currentUser.id === listing.seller_id;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 py-4 max-w-4xl mx-auto">
      
      {/* Back navigation */}
      <button
        onClick={onBack}
        className="text-stone-500 hover:text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('backToListings')}
      </button>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl p-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 block shrink-0"></span>
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl p-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 block shrink-0"></span>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand: Listing Details Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs card-cinematic">
            {/* Visual Header Banner */}
            <div className="h-60 w-full relative bg-stone-100 img-reveal">
              <img
                src={listing.photos[0]}
                alt={listing.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[9px] bg-emerald-600 text-white font-extrabold uppercase px-2 py-0.5 rounded-sm">
                  {listing.cloth_type.replace('_', ' ')}
                </span>
                <h3 className="font-sans font-extrabold text-base sm:text-lg mt-1.5 leading-tight">
                  {listing.title}
                </h3>
              </div>
            </div>

            {/* Core Listing stats */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] text-stone-400 uppercase font-bold block">Available Mass</span>
                    <span className="text-sm font-extrabold text-stone-900">{listing.quantity_kg} {t('kg')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CircleDollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] text-stone-400 uppercase font-bold block">Expected Price</span>
                    <span className="text-sm font-extrabold text-stone-900">
                      {listing.expected_price_per_kg ? `₹${listing.expected_price_per_kg}/${t('kg')}` : t('openOfferLabel')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Material Description</span>
                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50/50 p-3 rounded-xl border border-stone-150">
                  {listing.description}
                </p>
              </div>

              {/* Condition */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Sorted Condition & Pack Notes</span>
                <p className="text-xs text-stone-600 leading-relaxed font-semibold">
                  🌿 {listing.condition}
                </p>
              </div>

              {/* Seller details */}
              <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 font-extrabold text-xs shrink-0">
                  {seller ? seller.full_name.substring(0, 2).toUpperCase() : 'SE'}
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] text-stone-400 uppercase font-bold block leading-none">Seller Boutique / Business</span>
                  <strong className="text-xs text-stone-950 font-bold block mt-0.5 truncate">{listing.seller_business_name}</strong>
                  <span className="text-[10px] text-stone-500 block">
                    📍 {seller?.city}, {seller?.state} ({seller?.pincode})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Negotiations and Bids panel */}
          <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-3 card-cinematic">
            <h4 className="font-sans font-bold text-sm text-stone-900 border-b border-stone-100 pb-2">
              Bidding Ledger ({offers.length} offers)
            </h4>
            {offers.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-4">No bidding history yet. Post the first offer!</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {offers.map(o => (
                  <div key={o.id} className="bg-stone-50 border border-stone-150 p-3 rounded-xl flex justify-between items-center gap-3 text-xs">
                    <div>
                      <p className="font-bold text-stone-800">
                        {o.buyer_business_name}
                      </p>
                      <p className="text-[10px] text-stone-400 italic">"{o.message}"</p>
                      <span className="text-[8px] text-stone-400 font-mono block mt-0.5">
                        {new Date(o.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-emerald-700 block">₹{o.price_per_kg}/kg</span>
                      <span className="text-[9px] text-stone-500 block">{o.quantity_kg} kg</span>
                      <span className={`text-[8px] font-bold uppercase inline-block px-1 rounded-xs mt-1 ${
                        o.status === OfferStatus.PENDING ? 'bg-orange-50 text-orange-700' :
                        o.status === OfferStatus.ACCEPTED ? 'bg-emerald-50 text-emerald-700' :
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Hand: Context-Based Action Box (Propose Offer or Chat) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Propose Offer Form - Only visible to BUYER who doesn't own listing */}
          {!isSeller && currentUser.role === Role.BUYER && (
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4 card-cinematic">
              <div className="flex items-center gap-1.5 border-b border-stone-100 pb-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h4 className="font-sans font-bold text-sm text-stone-950">
                  {t('makeOfferTitle')}
                </h4>
              </div>

              <form onSubmit={handleMakeOffer} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block mb-1">
                      {t('offerPrice')} *
                    </label>
                    <input
                      type="number"
                      value={pricePerKg}
                      onChange={e => setPricePerKg(e.target.value)}
                      placeholder="e.g. 38"
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 input-cinematic"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block mb-1">
                      {t('offerQty')} *
                    </label>
                    <input
                      type="number"
                      value={quantityKg}
                      onChange={e => setQuantityKg(e.target.value)}
                      placeholder={`Max ${listing.quantity_kg}`}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 input-cinematic"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 block mb-1">
                    {t('offerMsg')} *
                  </label>
                  <textarea
                    value={offerMsg}
                    onChange={e => setOfferMsg(e.target.value)}
                    placeholder="Describe pickup intent or ask about moisture/sorting..."
                    rows={2}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 input-cinematic"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-xs transition-colors uppercase tracking-wider btn-premium btn-ripple"
                >
                  {t('submitOffer')}
                </button>
              </form>
            </div>
          )}

          {/* Chat Negotiation Terminal */}
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs h-[420px] flex flex-col justify-between">
            {/* Header */}
            <div className="bg-stone-900 text-white px-4 py-3 shrink-0 flex items-center justify-between glass-panel-dark">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs">Direct Negotiations Room</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50">
              {messages.length === 0 ? (
                <div className="text-center py-16 text-stone-400 text-xs flex flex-col items-center justify-center gap-2">
                  <span>💬</span>
                  No chat history yet. Ask about fabric quality, sorting correctness, or delivery arrangements.
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
                placeholder="Ask or bargain..."
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
    </motion.div>
  );
}
