/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { Listing, Profile } from '../types';
import L from 'leaflet';

interface MapComponentProps {
  listings: Listing[];
  userProfile: Profile;
  onSelectListing?: (listingId: string) => void;
  selectedListingId?: string;
}

export default function MapComponent({
  listings,
  userProfile,
  onSelectListing,
  selectedListingId,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const [leafletError, setLeafletError] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || leafletError) return;

    try {
      // Create map centered on user pincode location
      const map = L.map(mapContainerRef.current, {
        center: [userProfile.lat, userProfile.lng],
        zoom: 7,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add custom marker styles to avoid bundler asset path errors
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `<div class="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-lg animate-pulse font-bold text-xs">Me</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([userProfile.lat, userProfile.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`<b>${userProfile.business_name}</b><br/>My Location (${userProfile.city})`)
        .openPopup();

      return () => {
        map.remove();
        mapInstanceRef.current = null;
      };
    } catch (err) {
      console.warn('Leaflet failed to initialize. Activating hybrid visual fallback map.', err);
      setLeafletError(true);
    }
  }, [userProfile, leafletError]);

  // Update Markers when listings or selectedListingId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || leafletError) return;

    // Clear old markers
    (Object.values(markersRef.current) as L.Marker[]).forEach(marker => marker.remove());
    markersRef.current = {};

    listings.forEach(listing => {
      const listingProfile = userProfile.id === listing.seller_id ? userProfile : null;
      // Use fallback coords or default offset if profile isn't fully loaded
      const lat = listingProfile ? userProfile.lat : (userProfile.lat + (Math.random() - 0.5) * 1.5);
      const lng = listingProfile ? userProfile.lng : (userProfile.lng + (Math.random() - 0.5) * 1.5);

      const isSelected = selectedListingId === listing.id;

      const markerColor = isSelected ? 'bg-orange-500' : 'bg-green-600';
      const markerIcon = L.divIcon({
        className: `custom-listing-marker-${listing.id}`,
        html: `<div class="w-7 h-7 rounded-full ${markerColor} border-2 border-white flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform cursor-pointer">📦</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);

      marker.bindPopup(`
        <div class="p-1 max-w-[200px]">
          <h4 class="font-bold text-sm text-gray-900">${listing.title}</h4>
          <p class="text-xs text-gray-600 my-1">${listing.quantity_kg} kg • ${listing.cloth_type.replace('_', ' ')}</p>
          <div class="text-xs font-semibold text-emerald-700">₹${listing.expected_price_per_kg || 'Open'}/kg</div>
          <button class="mt-2 w-full bg-emerald-600 text-white font-bold text-xs py-1 rounded select-btn" data-id="${listing.id}">Select Batch</button>
        </div>
      `);

      marker.on('popupopen', () => {
        const btn = document.querySelector(`.select-btn[data-id="${listing.id}"]`);
        if (btn) {
          btn.addEventListener('click', () => {
            if (onSelectListing) onSelectListing(listing.id);
          });
        }
      });

      markersRef.current[listing.id] = marker;

      if (isSelected) {
        map.setView([lat, lng], 8);
        marker.openPopup();
      }
    });
  }, [listings, selectedListingId, leafletError, userProfile, onSelectListing]);

  // Fallback Radar/List View for restricted environments
  if (leafletError) {
    return (
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center shadow-inner relative overflow-hidden h-[380px] flex flex-col justify-between">
        {/* Background grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

        <div className="z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h3 className="font-sans font-semibold text-sm text-stone-800 uppercase tracking-wider">
              KapadaSETU Local Textile Finder (Offline Geo-Matcher)
            </h3>
          </div>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Interactive map initialized in lightweight offline mode. Showing listings indexed by distance from your pincode: <strong className="text-emerald-700 font-bold">{userProfile.pincode}</strong>.
          </p>
        </div>

        {/* Vector radar scanner representation */}
        <div className="my-auto relative flex items-center justify-center h-48">
          {/* Radar circles */}
          <div className="absolute w-44 h-44 rounded-full border border-emerald-200 flex items-center justify-center animate-[pulse_3s_infinite]">
            <div className="w-28 h-28 rounded-full border border-emerald-100 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border border-emerald-50/50"></div>
            </div>
          </div>
          {/* Scanning line */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-1/2 h-0.5 bg-gradient-to-r from-emerald-400/0 to-emerald-500/30 origin-left animate-[spin_5s_linear_infinite]"></div>
          </div>

          {/* User Location Center Spot */}
          <div className="absolute z-10 w-8 h-8 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
            MY SHOP
          </div>

          {/* Listing Marker nodes orbiting */}
          {listings.map((l, i) => {
            const angle = (i * (360 / Math.max(listings.length, 1)) * Math.PI) / 180;
            const radius = 65 + (i * 10); // spiral radius
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isSelected = selectedListingId === l.id;

            return (
              <button
                key={l.id}
                id={`radar-marker-${l.id}`}
                onClick={() => onSelectListing && onSelectListing(l.id)}
                style={{ transform: `translate(${x}px, ${y}px)` }}
                className={`absolute z-20 w-10 h-10 rounded-xl flex flex-col items-center justify-center border transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-300 scale-125 shadow-orange-300/50 shadow-lg'
                    : 'bg-white text-emerald-800 border-emerald-200 shadow-md hover:bg-emerald-50'
                }`}
                title={`${l.title} (${l.distance ? l.distance.toFixed(1) : '??'} km)`}
              >
                <span className="text-xs">📦</span>
                <span className="text-[8px] font-bold">
                  {l.distance ? `${l.distance.toFixed(0)}km` : 'Local'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-stone-500 flex justify-between px-4 z-10 border-t border-stone-100 pt-3">
          <span>Active listings found: <strong>{listings.length}</strong></span>
          <span>Center pin: <strong>{userProfile.city}</strong></span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-200 shadow-sm overflow-hidden h-[380px] relative">
      <div ref={mapContainerRef} className="h-full w-full z-0"></div>
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-md text-[10px] font-mono text-stone-600 border border-stone-200 z-10 shadow-xs pointer-events-none">
        🌿 OSM Map Tiles • Near {userProfile.city}
      </div>
    </div>
  );
}
