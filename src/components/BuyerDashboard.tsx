/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { KapadaDB } from '../db';
import { Listing, Profile, ClothType, ListingStatus, calculateDistance } from '../types';
import MapComponent from './MapComponent';
import { Search, SlidersHorizontal, MapPin, Scale, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface BuyerDashboardProps {
  currentUser: Profile;
  onSelectListing: (id: string) => void;
  onSelectDeal: (id: string) => void;
}

export default function BuyerDashboard({
  currentUser,
  onSelectListing,
  onSelectDeal,
}: BuyerDashboardProps) {
  const { t, language } = useI18n();
  const [selectedType, setSelectedType] = useState<string>('all');
  // The demo data is distributed across India. Start with a country-wide radius so
  // first-time buyers can discover the seeded listings immediately.
  const [maxDistance, setMaxDistance] = useState<number>(2000);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListingId, setSelectedListingId] = useState<string | undefined>(undefined);

  const activeDeals = KapadaDB.getDeals().filter(d => d.buyer_id === currentUser.id);

  // Load and enrich all open / negotiating listings with calculated distances
  const listingsWithDistance = useMemo(() => {
    const allListings = KapadaDB.getListings().filter(
      l => l.status === ListingStatus.OPEN || l.status === ListingStatus.NEGOTIATING
    );

    return allListings
      .map(l => {
        // Find seller profile to get exact location
        const sellerProfile = KapadaDB.getProfile(l.seller_id);
        const distance = sellerProfile
          ? calculateDistance(currentUser.lat, currentUser.lng, sellerProfile.lat, sellerProfile.lng)
          : Math.floor(Math.random() * 200) + 10; // realistic randomized fallback distance

        return {
          ...l,
          distance,
        };
      })
      .sort((a, b) => a.distance - b.distance); // Proximity ranking with nearest listings first!
  }, [currentUser]);

  // Apply filters: Search query, Cloth type, and Max distance
  const filteredListings = useMemo(() => {
    return listingsWithDistance.filter(l => {
      const matchesSearch =
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || l.cloth_type === selectedType;
      const matchesDistance = l.distance <= maxDistance;
      return matchesSearch && matchesType && matchesDistance;
    });
  }, [listingsWithDistance, searchQuery, selectedType, maxDistance]);

  const handleSelectListing = (id: string) => {
    setSelectedListingId(id);
    // Smooth scroll down to details if on mobile, or directly open detail page
    onSelectListing(id);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 py-4">
      
      {/* Search & Filters Controls */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center card-cinematic">
        
        {/* Search Input */}
        <div className="relative md:col-span-5">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search scraps e.g. white cotton, denim..."
            className="w-full border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-hidden focus:border-emerald-600 bg-stone-50/50 input-cinematic"
          />
        </div>

        {/* Fabric Type dropdown */}
        <div className="md:col-span-3">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 bg-stone-50/50"
          >
            <option value="all">{t('allTypes')}</option>
            <option value={ClothType.PURE_COTTON}>{t('pureCotton')}</option>
            <option value={ClothType.MIXED}>{t('mixedCloth')}</option>
            <option value={ClothType.SYNTHETIC}>{t('synthetic')}</option>
            <option value={ClothType.OTHER}>{t('otherCloth')}</option>
          </select>
        </div>

        {/* Distance Radius range slider */}
        <div className="md:col-span-4 flex items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-stone-400 shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-stone-500 font-bold mb-1">
              <span>{t('filterDistance')}</span>
              <span className="text-emerald-700">{maxDistance} km</span>
            </div>
            <input
              type="range"
              min={10}
              max={2500}
              step={10}
              value={maxDistance}
              onChange={e => setMaxDistance(parseInt(e.target.value))}
              className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

      </div>

      {/* Map Layout Integration */}
      <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-xs">
        <div className="flex items-center gap-1.5 mb-3 px-1">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h4 className="font-sans font-bold text-xs text-stone-700 uppercase tracking-wider">
            {language === 'en' ? 'Live Geo-Matching Radar Map' : 'लाइव भू-मिलान राडार मानचित्र'}
          </h4>
        </div>
        <MapComponent
          listings={filteredListings}
          userProfile={currentUser}
          onSelectListing={handleSelectListing}
          selectedListingId={selectedListingId}
        />
      </div>

      {/* Main Panel Content: Split into matching results & Active Purchases timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: List of Listings */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-2">
            <h4 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
              📦 {t('browseList')}
            </h4>
            <span className="text-[10px] bg-stone-100 text-stone-600 font-mono font-bold px-2 py-0.5 rounded-full">
              {filteredListings.length} found
            </span>
          </div>

          {filteredListings.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-150 p-6 text-stone-400 text-xs">
              No matching scrap listings found within {maxDistance}km radius. Try widening your distance filter!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredListings.map(l => (
                <div
                  key={l.id}
                  onClick={() => handleSelectListing(l.id)}
                  className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between card-cinematic ${
                    selectedListingId === l.id ? 'border-orange-500 ring-1 ring-orange-500' : 'border-stone-200 hover:border-emerald-500'
                  }`}
                >
                  <div>
                    {/* Photo with badges */}
                    <div className="h-40 w-full relative img-reveal">
                      <img
                        src={l.photos[0]}
                        alt={l.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="text-[8px] bg-stone-900/80 backdrop-blur-xs text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                          {l.cloth_type.replace('_', ' ')}
                        </span>
                        <span className="text-[8px] bg-emerald-600/90 backdrop-blur-xs text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          {l.distance ? `${l.distance.toFixed(0)} km` : 'Near me'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <h5 className="font-bold text-xs sm:text-sm text-stone-950 line-clamp-1 leading-snug">
                        {l.title}
                      </h5>
                      <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed">
                        {l.description}
                      </p>
                      
                      <div className="flex items-center gap-1.5 text-[9px] text-stone-400 uppercase font-mono font-bold">
                        <Scale className="w-3.5 h-3.5 text-stone-400" />
                        <span>Weight: <strong className="text-stone-700">{l.quantity_kg} kg</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing footer */}
                  <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-between items-center shrink-0">
                    <div>
                      <span className="text-[8px] text-stone-400 uppercase font-bold block leading-none">Price per kg</span>
                      <span className="text-xs font-bold text-stone-900 mt-0.5 block">
                        {l.expected_price_per_kg ? `₹${l.expected_price_per_kg}` : t('openOfferLabel')}
                      </span>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-0.5 shadow-xs transition-colors uppercase tracking-wider btn-premium btn-ripple">
                      {t('viewDetails')}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Active Purchase Deals */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-2">
            <h4 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
              💼 My Active Purchases
            </h4>
            <span className="text-[10px] bg-stone-100 text-stone-600 font-mono font-bold px-2 py-0.5 rounded-full">
              {activeDeals.length}
            </span>
          </div>

          {activeDeals.length === 0 ? (
            <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-150 p-4 text-stone-400 text-xs">
              No active fabric contracts. Find a batch near your pincode and make a negotiation offer!
            </div>
          ) : (
            <div className="space-y-3">
              {activeDeals.map(d => (
                <div
                  key={d.id}
                  onClick={() => onSelectDeal(d.id)}
                  className="bg-white border border-stone-200 hover:border-emerald-500 rounded-2xl p-4 cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-2 card-cinematic"
                >
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[8px] text-stone-400 font-bold font-mono">ID: {d.id}</span>
                    <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${
                      d.status === 'awaiting_payment' ? 'bg-orange-100 text-orange-700' :
                      d.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                      d.status === 'in_transit' ? 'bg-teal-100 text-teal-700' :
                      d.status === 'delivered' ? 'bg-amber-100 text-amber-700' :
                      d.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-stone-100'
                    }`}>
                      {d.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-stone-900 line-clamp-1 leading-snug">{d.listing_title}</h5>
                  <p className="text-[10px] text-stone-500 font-mono">
                    Total: <strong className="text-stone-800">₹{d.total_amount}</strong> ({d.quantity_kg}kg @ ₹{d.agreed_price_per_kg}/kg)
                  </p>
                  <span className="text-[9px] text-emerald-600 hover:underline block text-right font-bold mt-1">
                    Track Deal Timeline →
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
