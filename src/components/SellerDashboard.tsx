/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { useI18n } from '../i18n';
import { KapadaDB } from '../db';
import { Listing, Profile, ClothType, ListingStatus, Offer, OfferStatus, DealStatus } from '../types';
import { PlusCircle, CircleDollarSign, ArrowRight, ShieldCheck, HelpCircle, Package, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface SellerDashboardProps {
  currentUser: Profile;
  onSelectListing: (id: string) => void;
  onSelectDeal: (id: string) => void;
}

export default function SellerDashboard({
  currentUser,
  onSelectListing,
  onSelectDeal,
}: SellerDashboardProps) {
  const { t } = useI18n();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [clothType, setClothType] = useState<ClothType>(ClothType.PURE_COTTON);
  const [quantity, setQuantity] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [openToOffers, setOpenToOffers] = useState(true);
  const [condition, setCondition] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const listings = KapadaDB.getListings().filter(l => l.seller_id === currentUser.id);
  const offers = KapadaDB.getOffers().filter(o => {
    const listing = KapadaDB.getListing(o.listing_id);
    return listing && listing.seller_id === currentUser.id && o.status === OfferStatus.PENDING;
  });

  const deals = KapadaDB.getDeals().filter(d => d.seller_id === currentUser.id);

  // Compute mock earnings
  const escrowHeld = deals
    .filter(d => d.status === DealStatus.PAID || d.status === DealStatus.IN_TRANSIT || d.status === DealStatus.DELIVERED)
    .reduce((sum, d) => sum + d.total_amount, 0);

  const totalWithdrawn = deals
    .filter(d => d.status === DealStatus.COMPLETED)
    .reduce((sum, d) => sum + d.total_amount * 0.95, 0); // 5% platform fee deducted

  const handleSubmitListing = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const qty = parseFloat(quantity);
    const price = openToOffers ? undefined : parseFloat(expectedPrice);

    if (!title.trim() || !quantity.trim() || !condition.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isNaN(qty) || qty <= 0) {
      setError('Quantity must be a positive number of kilograms.');
      return;
    }

    if (!openToOffers && (isNaN(price || 0) || (price || 0) <= 0)) {
      setError('Please enter a valid expected price per kg, or mark open to offers.');
      return;
    }

    // Assign realistic image based on cloth type
    let photoUrl = 'https://images.unsplash.com/photo-1524295928322-4b986a49dda6?q=80&w=600&auto=format&fit=crop';
    if (clothType === ClothType.MIXED) {
      photoUrl = 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop';
    } else if (clothType === ClothType.SYNTHETIC) {
      photoUrl = 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600&auto=format&fit=crop';
    } else if (clothType === ClothType.OTHER) {
      photoUrl = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop';
    }

    const newListing = KapadaDB.createListing({
      seller_id: currentUser.id,
      title: title.trim(),
      description: `Condition: ${condition.trim()}. Sourced from ${currentUser.business_name}.`,
      cloth_type: clothType,
      quantity_kg: qty,
      condition: condition.trim(),
      photos: [photoUrl],
      expected_price_per_kg: price,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    });

    setSuccess('Waste listing posted successfully! It is now live for buyers to discover.');
    setShowCreateForm(false);
    
    // Reset form
    setTitle('');
    setClothType(ClothType.PURE_COTTON);
    setQuantity('');
    setExpectedPrice('');
    setOpenToOffers(true);
    setCondition('');
  };

  const handleAcceptOffer = (offer: Offer) => {
    KapadaDB.updateOfferStatus(offer.id, OfferStatus.ACCEPTED);
    setSuccess('Offer accepted! Deal is initiated. Moving to payment phase.');
  };

  const handleRejectOffer = (offer: Offer) => {
    KapadaDB.updateOfferStatus(offer.id, OfferStatus.REJECTED);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-8 py-4">
      {/* Wallet / Earnings Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0, ease: [0.16, 1, 0.3, 1] }} className="bg-emerald-600 rounded-3xl p-6 text-white flex flex-col justify-between shadow-md relative overflow-hidden card-3d-tilt">
          <div className="absolute right-0 bottom-0 translate-y-4 translate-x-4 opacity-10">
            <CircleDollarSign className="w-40 h-40" />
          </div>
          <div>
            <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-1 rounded uppercase tracking-wider">
              {t('earnings')}
            </span>
            <p className="text-3xl font-extrabold mt-3">₹{totalWithdrawn.toLocaleString('en-IN')}</p>
          </div>
          <p className="text-[10px] text-emerald-100/80 mt-2 font-medium">
            {t('totalWithdrawn')} (5% Platform Comm deducted)
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="bg-stone-900 rounded-3xl p-6 text-white flex flex-col justify-between shadow-md relative overflow-hidden card-3d-tilt">
          <div className="absolute right-0 bottom-0 translate-y-4 translate-x-4 opacity-10">
            <ShieldCheck className="w-40 h-40" />
          </div>
          <div>
            <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-1 rounded uppercase tracking-wider">
              Secure Escrow Lock
            </span>
            <p className="text-3xl font-extrabold mt-3">₹{escrowHeld.toLocaleString('en-IN')}</p>
          </div>
          <p className="text-[10px] text-stone-300/80 mt-2 font-medium">
            {t('escrowHeld')} (Held in trust, released on delivery confirmation)
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="bg-white rounded-3xl p-6 border border-stone-200 flex flex-col justify-between shadow-xs card-cinematic">
          <div>
            <span className="text-[10px] bg-stone-100 text-stone-600 font-bold px-2 py-1 rounded uppercase tracking-wider">
              My Active Listings
            </span>
            <p className="text-3xl font-extrabold text-stone-900 mt-3">{listings.length}</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider btn-premium btn-ripple"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Waste
          </button>
        </motion.div>
      </div>

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

      {/* Post Waste Form */}
      {showCreateForm && (
        <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-inner">
          <h3 className="font-sans font-bold text-lg text-stone-900 mb-4">{t('postWasteTitle')}</h3>
          <form onSubmit={handleSubmitListing} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-500 block mb-1 uppercase tracking-wider">
                  Listing Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Pure Cotton scrap clippings from boutique"
                  className="w-full border border-stone-200 bg-white rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 block mb-1 uppercase tracking-wider">
                  {t('clothType')}
                </label>
                <select
                  value={clothType}
                  onChange={e => setClothType(e.target.value as ClothType)}
                  className="w-full border border-stone-200 bg-white rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600"
                >
                  <option value={ClothType.PURE_COTTON}>{t('pureCotton')}</option>
                  <option value={ClothType.MIXED}>{t('mixedCloth')}</option>
                  <option value={ClothType.SYNTHETIC}>{t('synthetic')}</option>
                  <option value={ClothType.OTHER}>{t('otherCloth')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-500 block mb-1 uppercase tracking-wider">
                  {t('qtyKg')} *
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full border border-stone-200 bg-white rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 block mb-1 uppercase tracking-wider flex justify-between">
                  <span>{t('expectedPrice')}</span>
                  <label className="flex items-center gap-1 cursor-pointer text-[9px] text-stone-400 lowercase">
                    <input
                      type="checkbox"
                      checked={openToOffers}
                      onChange={e => setOpenToOffers(e.target.checked)}
                      className="rounded-xs text-emerald-600"
                    />
                    {t('openToOffers')}
                  </label>
                </label>
                <input
                  type="number"
                  value={expectedPrice}
                  onChange={e => setExpectedPrice(e.target.value)}
                  disabled={openToOffers}
                  placeholder={openToOffers ? 'Bargaining Open' : 'e.g. 45'}
                  className="w-full border border-stone-200 bg-white disabled:bg-stone-100 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 block mb-1 uppercase tracking-wider">
                {t('conditionNotes')} *
              </label>
              <textarea
                value={condition}
                onChange={e => setCondition(e.target.value)}
                rows={3}
                placeholder={t('conditionPlaceholder')}
                className="w-full border border-stone-200 bg-white rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600"
                required
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 font-bold px-4 py-2 rounded-xl text-xs transition-colors uppercase tracking-wider"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs transition-colors uppercase tracking-wider btn-premium btn-ripple"
              >
                {t('postBtn')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Two-Column Workstation: Left (Live Listings), Right (Offers / Live Deals) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: My Listings */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-2">
            <h4 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              {t('myListings')}
            </h4>
            <span className="text-[10px] bg-stone-100 text-stone-600 font-mono font-bold px-2 py-0.5 rounded-full">
              {listings.length} live
            </span>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-150 p-6 text-stone-400 text-xs">
              {t('noListings')}
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map(l => (
                <div
                  key={l.id}
                  onClick={() => onSelectListing(l.id)}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex gap-3 p-3.5 card-cinematic"
                >
                  <img
                    src={l.photos[0]}
                    alt={l.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0 border border-stone-100"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h5 className="font-bold text-xs sm:text-sm text-stone-900 truncate leading-tight">
                          {l.title}
                        </h5>
                        <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-xs leading-none shrink-0 ${
                          l.status === ListingStatus.OPEN ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          l.status === ListingStatus.NEGOTIATING ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                          'bg-stone-100 text-stone-600'
                        }`}>
                          {l.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-1 uppercase font-mono font-bold">
                        {l.cloth_type.replace('_', ' ')} • {l.quantity_kg} kg
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-stone-50">
                      <span className="text-xs font-bold text-stone-800">
                        ₹{l.expected_price_per_kg ? `${l.expected_price_per_kg}/kg` : t('openOfferLabel')}
                      </span>
                      <span className="text-[9px] text-emerald-600 hover:underline font-semibold flex items-center gap-0.5">
                        Negotiate / Detail <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Active Deals and Offers received */}
        <div className="space-y-6">
          
          {/* Offers Received */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <h4 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                <CircleDollarSign className="w-5 h-5 text-emerald-600" />
                {t('offersReceived')}
              </h4>
              {offers.length > 0 && (
                <span className="text-[9px] bg-orange-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                  {offers.length} new
                </span>
              )}
            </div>

            {offers.length === 0 ? (
              <div className="text-center py-6 bg-stone-50 rounded-2xl border border-stone-150 p-4 text-stone-400 text-xs">
                No active buyer bids right now. Open listings are visible on the buyers' map.
              </div>
            ) : (
              <div className="space-y-3">
                {offers.map(o => {
                  const listing = KapadaDB.getListing(o.listing_id);
                  return (
                    <div key={o.id} className="bg-stone-50 border border-stone-200 hover:border-emerald-500 hover:-translate-y-1 rounded-2xl p-4 space-y-3 shadow-xs transition-all duration-300 card-cinematic">
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <p className="text-[10px] text-stone-400 font-mono font-bold uppercase">Offer on: {listing?.title}</p>
                          <p className="font-bold text-xs text-stone-950 mt-0.5">
                            Buyer: {o.buyer_business_name} ({KapadaDB.getProfile(o.buyer_id)?.city})
                          </p>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                          ₹{o.price_per_kg}/kg
                        </span>
                      </div>
                      
                      <div className="bg-white p-2.5 rounded-xl text-[11px] text-stone-600 italic border border-stone-100">
                        "{o.message}"
                      </div>

                      <div className="flex justify-between items-center gap-2 pt-1">
                        <button
                          onClick={() => onSelectListing(o.listing_id)}
                          className="text-[10px] text-stone-500 hover:text-stone-900 font-bold"
                        >
                          Chat / Counter
                        </button>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => handleRejectOffer(o)}
                            className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-extrabold text-[10px] py-1.5 px-3 rounded-lg transition-colors uppercase"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleAcceptOffer(o)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-xs transition-colors uppercase"
                          >
                            Accept Offer
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Deals / Cargo Tracker */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <h4 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                📦 {t('deals')} & Cargo Pickups
              </h4>
              <span className="text-[10px] bg-stone-100 text-stone-600 font-mono font-bold px-2 py-0.5 rounded-full">
                {deals.length} deals
              </span>
            </div>

            {deals.length === 0 ? (
              <div className="text-center py-6 bg-stone-50 rounded-2xl border border-stone-150 p-4 text-stone-400 text-xs">
                No active transactions yet. Once an offer is accepted, the deal ledger starts here.
              </div>
            ) : (
              <div className="space-y-2.5">
                {deals.map(d => (
                  <div
                    key={d.id}
                    onClick={() => onSelectDeal(d.id)}
                    className="bg-white border border-stone-200 hover:border-emerald-500 rounded-2xl p-4 flex justify-between items-center gap-3 cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 card-cinematic"
                  >
                    <div className="min-w-0">
                      <p className="text-[8px] text-stone-400 font-bold tracking-widest font-mono uppercase">
                        DEAL ID: {d.id}
                      </p>
                      <h5 className="font-bold text-xs text-stone-900 truncate mt-0.5">
                        {d.listing_title}
                      </h5>
                      <p className="text-[10px] text-stone-500 mt-1 font-mono">
                        Value: <strong className="text-stone-800">₹{d.total_amount}</strong> ({d.quantity_kg}kg @ ₹{d.agreed_price_per_kg}/kg)
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-1 rounded-md inline-block ${
                        d.status === DealStatus.AWAITING_PAYMENT ? 'bg-orange-50 text-orange-700' :
                        d.status === DealStatus.PAID ? 'bg-blue-50 text-blue-700 animate-pulse' :
                        d.status === DealStatus.IN_TRANSIT ? 'bg-teal-50 text-teal-700' :
                        d.status === DealStatus.DELIVERED ? 'bg-amber-50 text-amber-700' :
                        d.status === DealStatus.COMPLETED ? 'bg-emerald-50 text-emerald-700' :
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {d.status.replace('_', ' ')}
                      </span>
                      <span className="text-[8px] text-emerald-600 hover:underline block mt-1.5 font-bold">
                        Open Timeline →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
}
