/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Role {
  SELLER = 'seller',
  BUYER = 'buyer',
  ADMIN = 'admin',
}

export enum ClothType {
  PURE_COTTON = 'pure_cotton',
  MIXED = 'mixed',
  SYNTHETIC = 'synthetic',
  OTHER = 'other',
}

export enum ListingStatus {
  OPEN = 'open',
  NEGOTIATING = 'negotiating',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum OfferStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COUNTERED = 'countered',
}

export enum DealStatus {
  AWAITING_PAYMENT = 'awaiting_payment',
  PAID = 'paid',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  DISPUTED = 'disputed',
  CANCELLED = 'cancelled',
}

export enum TransportStatus {
  AWAITING_PICKUP = 'awaiting_pickup',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
}

export enum TransactionStatus {
  CREATED = 'created',
  CAPTURED = 'captured',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface Profile {
  id: string;
  email: string;
  role: Role;
  full_name: string;
  business_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  gstin?: string;
  kyc_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  cloth_type: ClothType;
  quantity_kg: number;
  condition: string;
  photos: string[]; // standard urls or base64 data
  expected_price_per_kg?: number; // open to offers if undefined
  status: ListingStatus;
  created_at: string;
  expires_at: string;
  seller_name?: string;
  seller_business_name?: string;
  distance?: number; // computed dynamically
}

export interface Offer {
  id: string;
  listing_id: string;
  buyer_id: string;
  buyer_name?: string;
  buyer_business_name?: string;
  price_per_kg: number;
  quantity_kg: number;
  message: string;
  status: OfferStatus;
  created_at: string;
}

export interface Deal {
  id: string;
  listing_id: string;
  offer_id: string;
  seller_id: string;
  buyer_id: string;
  agreed_price_per_kg: number;
  quantity_kg: number;
  total_amount: number;
  commission_pct: number;
  status: DealStatus;
  payment_ref?: string;
  created_at: string;
  listing_title?: string;
  cloth_type?: ClothType;
  seller_name?: string;
  buyer_name?: string;
}

export interface TransportBooking {
  id: string;
  deal_id: string;
  arranged_by: 'seller' | 'buyer';
  provider: 'self' | 'third_party';
  pickup_address: string;
  pickup_slot: string;
  vehicle_type: string;
  cost: number;
  status: TransportStatus;
  tracking_notes: string;
  created_at: string;
}

export interface Message {
  id: string;
  deal_id: string; // or listing_id for pre-deal negotiations
  listing_id?: string;
  sender_id: string;
  sender_name: string;
  body: string;
  created_at: string;
}

export interface Review {
  id: string;
  deal_id: string;
  reviewer_role: 'seller' | 'buyer';
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  deal_id: string;
  amount: number;
  currency: 'INR';
  gateway: 'razorpay_mock';
  gateway_payment_id: string;
  seller_payout: number;
  platform_fee: number;
  status: TransactionStatus;
  created_at: string;
}

export interface Dispute {
  id: string;
  deal_id: string;
  raised_by: string; // user id
  raised_by_name: string;
  reason: string;
  status: 'raised' | 'resolved';
  resolution_notes?: string;
  created_at: string;
}

// Fallback lookup of coordinates for major Indian pincodes/cities
export interface PincodeCoords {
  lat: number;
  lng: number;
  city: string;
  state: string;
}

export const PINCODE_MAP: Record<string, PincodeCoords> = {
  '110001': { lat: 28.6304, lng: 77.2177, city: 'New Delhi', state: 'Delhi' },
  '400001': { lat: 18.9220, lng: 72.8347, city: 'Mumbai', state: 'Maharashtra' },
  '411001': { lat: 18.5204, lng: 73.8567, city: 'Pune', state: 'Maharashtra' },
  '560001': { lat: 12.9716, lng: 77.5946, city: 'Bengaluru', state: 'Karnataka' },
  '600001': { lat: 13.0827, lng: 80.2707, city: 'Chennai', state: 'Tamil Nadu' },
  '700001': { lat: 22.5726, lng: 88.3639, city: 'Kolkata', state: 'West Bengal' },
  '380001': { lat: 23.0225, lng: 72.5714, city: 'Ahmedabad', state: 'Gujarat' },
  '500001': { lat: 17.3850, lng: 78.4867, city: 'Hyderabad', state: 'Telangana' },
  '208001': { lat: 26.4499, lng: 80.3319, city: 'Kanpur', state: 'Uttar Pradesh' },
  '141001': { lat: 30.9010, lng: 75.8573, city: 'Ludhiana', state: 'Punjab' },
  '342001': { lat: 26.2389, lng: 73.0243, city: 'Jodhpur', state: 'Rajasthan' },
  '800001': { lat: 25.5941, lng: 85.1376, city: 'Patna', state: 'Bihar' },
  '751001': { lat: 20.2961, lng: 85.8245, city: 'Bhubaneswar', state: 'Odisha' },
  '302001': { lat: 26.9124, lng: 75.7873, city: 'Jaipur', state: 'Rajasthan' },
  '395001': { lat: 21.1702, lng: 72.8311, city: 'Surat', state: 'Gujarat' },
  '641001': { lat: 11.0168, lng: 76.9558, city: 'Coimbatore', state: 'Tamil Nadu' },
  '695001': { lat: 8.5241, lng: 76.9366, city: 'Thiruvananthapuram', state: 'Kerala' },
  '781001': { lat: 26.1445, lng: 91.7362, city: 'Guwahati', state: 'Assam' },
};

// Standard helper to resolve geolocation from pincode or return default (Mumbai)
export function getGeoFromPincode(pincode: string): PincodeCoords {
  const code = pincode.trim();
  if (PINCODE_MAP[code]) {
    return PINCODE_MAP[code];
  }
  // Fallback to general location based on first few digits, or default to Mumbai
  const digits = code.substring(0, 2);
  if (digits === '11') return { lat: 28.63, lng: 77.21, city: 'New Delhi', state: 'Delhi' };
  if (digits === '40') return { lat: 18.92, lng: 72.83, city: 'Mumbai', state: 'Maharashtra' };
  if (digits === '56') return { lat: 12.97, lng: 77.59, city: 'Bengaluru', state: 'Karnataka' };
  if (digits === '60') return { lat: 13.08, lng: 80.27, city: 'Chennai', state: 'Tamil Nadu' };
  if (digits === '70') return { lat: 22.57, lng: 88.36, city: 'Kolkata', state: 'West Bengal' };
  if (digits === '38') return { lat: 23.02, lng: 72.57, city: 'Ahmedabad', state: 'Gujarat' };
  if (digits === '50') return { lat: 17.38, lng: 78.48, city: 'Hyderabad', state: 'Telangana' };
  if (digits === '20') return { lat: 26.45, lng: 80.33, city: 'Kanpur', state: 'Uttar Pradesh' };
  
  return { lat: 20.5937, lng: 78.9629, city: 'India Central', state: 'India' }; // Default central India
}

// Haversine formula to compute distance in km between two lat/lng pairs
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
