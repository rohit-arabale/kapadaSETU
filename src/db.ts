/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Profile,
  Listing,
  Offer,
  Deal,
  TransportBooking,
  Message,
  Review,
  Transaction,
  Dispute,
  Role,
  ClothType,
  ListingStatus,
  OfferStatus,
  DealStatus,
  TransportStatus,
  TransactionStatus,
  getGeoFromPincode,
} from './types';

// Seed Profiles
const seedProfiles: Profile[] = [
  {
    id: 'seller_ramesh',
    email: 'ramesh@guptaboutique.com',
    role: Role.SELLER,
    full_name: 'Ramesh Gupta',
    business_name: 'Gupta Boutique & Tailors',
    phone: '+919876543210',
    address_line: '124, Textile Market, Near Clock Tower',
    city: 'Ludhiana',
    state: 'Punjab',
    pincode: '141001',
    lat: 30.9010,
    lng: 75.8573,
    gstin: '03AAAAA1111A1Z1',
    kyc_status: 'verified',
    created_at: new Date('2026-01-10').toISOString(),
  },
  {
    id: 'seller_saroja',
    email: 'saroja@deviweaves.com',
    role: Role.SELLER,
    full_name: 'Saroja Devi',
    business_name: 'Devi Weaving Association',
    phone: '+918765432109',
    address_line: '45, Handloom Avenue, Mall Road',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641001',
    lat: 11.0168,
    lng: 76.9558,
    gstin: '33BBBBB2222B2Z2',
    kyc_status: 'verified',
    created_at: new Date('2026-02-15').toISOString(),
  },
  {
    id: 'buyer_anil',
    email: 'anil@agrawalrecyclers.com',
    role: Role.BUYER,
    full_name: 'Anil Agrawal',
    business_name: 'Agrawal Green Recyclers & Shredders',
    phone: '+917654321098',
    address_line: 'Plot 18, MIDC Industrial Area, Phase II',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    lat: 18.9220,
    lng: 72.8347,
    gstin: '27CCCCC3333C3Z3',
    kyc_status: 'verified',
    created_at: new Date('2026-03-01').toISOString(),
  },
  {
    id: 'buyer_vikram',
    email: 'vikram@yarncraft.com',
    role: Role.BUYER,
    full_name: 'Vikram Shah',
    business_name: 'Yarncraft Eco-Thread Mills',
    phone: '+916543210987',
    address_line: 'Block G, GIDC Naroda',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380001',
    lat: 23.0225,
    lng: 72.5714,
    gstin: '24DDDDD4444D4Z4',
    kyc_status: 'verified',
    created_at: new Date('2026-03-20').toISOString(),
  },
  {
    id: 'admin_priya',
    email: 'priya@kapadasetu.org',
    role: Role.ADMIN,
    full_name: 'Priya Sharma',
    business_name: 'KapadaSETU Platform Operator',
    phone: '+919999999999',
    address_line: 'KapadaSETU HQ, Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    lat: 28.6304,
    lng: 77.2177,
    kyc_status: 'verified',
    created_at: new Date('2026-01-01').toISOString(),
  }
];

// Seed Listings
const seedListings: Listing[] = [
  {
    id: 'list_1',
    seller_id: 'seller_ramesh',
    title: 'Pure Cotton Tailoring Scraps - Ludhiana Hosiery',
    description: 'Fresh waste cotton clips from boutique garment manufacturing. Sorted by color (mostly white and cream). Highly suited for converting into premium combed yarn or absorbent doormats.',
    cloth_type: ClothType.PURE_COTTON,
    quantity_kg: 850,
    condition: 'Clean, dry tailoring clips, no mixed buttons or plastic materials.',
    photos: ['https://images.unsplash.com/photo-1524295928322-4b986a49dda6?q=80&w=600&auto=format&fit=crop'],
    expected_price_per_kg: 42,
    status: ListingStatus.OPEN,
    created_at: new Date('2026-07-10T10:00:00Z').toISOString(),
    expires_at: new Date('2026-08-10T10:00:00Z').toISOString(),
  },
  {
    id: 'list_2',
    seller_id: 'seller_saroja',
    title: 'Mixed Textile Waste & Denim Cutouts',
    description: 'Bulk cotton-synthetic mix and leftover denim fabrics from weaving mills. Ideal for automotive seat padding, upholstery filling, or rough carpets.',
    cloth_type: ClothType.MIXED,
    quantity_kg: 2400,
    condition: 'Dusty but completely dry. Bundled tightly in 50kg nylon bags.',
    photos: ['https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop'],
    expected_price_per_kg: 18,
    status: ListingStatus.OPEN,
    created_at: new Date('2026-07-12T14:30:00Z').toISOString(),
    expires_at: new Date('2026-08-12T14:30:00Z').toISOString(),
  },
  {
    id: 'list_3',
    seller_id: 'seller_ramesh',
    title: 'Synthetic & Polyester Mesh Clippings',
    description: 'Leftover sportswear synthetic mesh fabrics. Durable material suitable for geo-textiles, road construction binders, or heavy industrial seat stuffing.',
    cloth_type: ClothType.SYNTHETIC,
    quantity_kg: 350,
    condition: 'Moisture-free, packed in gunny sacks.',
    photos: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600&auto=format&fit=crop'],
    expected_price_per_kg: 12,
    status: ListingStatus.OPEN,
    created_at: new Date('2026-07-15T09:15:00Z').toISOString(),
    expires_at: new Date('2026-08-15T09:15:00Z').toISOString(),
  }
];

// Seed Offers
const seedOffers: Offer[] = [
  {
    id: 'offer_1',
    listing_id: 'list_1',
    buyer_id: 'buyer_vikram',
    price_per_kg: 38,
    quantity_kg: 850,
    message: 'We are very interested in this batch for our cotton carding facility. We can offer ₹38/kg and can pick it up by this Saturday.',
    status: OfferStatus.PENDING,
    created_at: new Date('2026-07-16T11:00:00Z').toISOString(),
  },
  {
    id: 'offer_2',
    listing_id: 'list_2',
    buyer_id: 'buyer_anil',
    price_per_kg: 16,
    quantity_kg: 2400,
    message: 'We can process this mixed batch for mattress padding. Offering ₹16/kg. Will arrange transport ourselves via third party.',
    status: OfferStatus.PENDING,
    created_at: new Date('2026-07-17T15:20:00Z').toISOString(),
  }
];

// In-app Notifications model
export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

// Database helper functions wrapped in a class
export class KapadaDB {
  private static getStore<T>(key: string, defaults: T[]): T[] {
    const data = localStorage.getItem(`kapada_${key}`);
    if (!data) {
      localStorage.setItem(`kapada_${key}`, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  }

  private static setStore<T>(key: string, items: T[]): void {
    localStorage.setItem(`kapada_${key}`, JSON.stringify(items));
  }

  // Clear data back to seeds
  public static resetToSeed(): void {
    localStorage.removeItem('kapada_profiles');
    localStorage.removeItem('kapada_listings');
    localStorage.removeItem('kapada_offers');
    localStorage.removeItem('kapada_deals');
    localStorage.removeItem('kapada_messages');
    localStorage.removeItem('kapada_reviews');
    localStorage.removeItem('kapada_transport');
    localStorage.removeItem('kapada_transactions');
    localStorage.removeItem('kapada_disputes');
    localStorage.removeItem('kapada_notifications');
    localStorage.removeItem('kapada_current_user');
  }

  // --- CURRENT USER ---
  public static getCurrentUser(): Profile | null {
    const user = localStorage.getItem('kapada_current_user');

    if (user) {
      try {
        const storedUser = JSON.parse(user) as Profile | null;
        // A profile may have been removed after a reset, or localStorage may have
        // been edited manually. Only restore a user that still exists in the store.
        if (storedUser && this.getProfile(storedUser.id)) {
          return storedUser;
        }
      } catch {
        // Fall through to a valid demo persona when stored data is malformed.
      }
    }

    // Default to seller Ramesh on first load to make the dashboard usable at once.
    const ramesh = this.getProfiles().find(p => p.id === 'seller_ramesh') || seedProfiles[0];
    this.setCurrentUser(ramesh);
    return ramesh;
  }

  public static setCurrentUser(profile: Profile | null): void {
    if (profile) {
      localStorage.setItem('kapada_current_user', JSON.stringify(profile));
    } else {
      localStorage.removeItem('kapada_current_user');
    }
  }

  // --- PROFILES ---
  public static getProfiles(): Profile[] {
    return this.getStore<Profile>('profiles', seedProfiles);
  }

  public static getProfile(id: string): Profile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }

  public static createProfile(profile: Profile): void {
    const profiles = this.getProfiles();
    profiles.push(profile);
    this.setStore('profiles', profiles);
  }

  public static updateProfile(id: string, updates: Partial<Profile>): Profile {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Profile not found');
    const updated = { ...profiles[index], ...updates };
    profiles[index] = updated;
    this.setStore('profiles', profiles);

    // Update active current user if applicable
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      this.setCurrentUser(updated);
    }
    return updated;
  }

  // --- LISTINGS ---
  public static getListings(): Listing[] {
    const listings = this.getStore<Listing>('listings', seedListings);
    const profiles = this.getProfiles();
    return listings.map(l => {
      const seller = profiles.find(p => p.id === l.seller_id);
      return {
        ...l,
        seller_name: seller?.full_name || 'Unknown Seller',
        seller_business_name: seller?.business_name || 'Boutique Textile',
      };
    });
  }

  public static getListing(id: string): Listing | undefined {
    return this.getListings().find(l => l.id === id);
  }

  public static createListing(listing: Omit<Listing, 'id' | 'created_at' | 'status'>): Listing {
    const listings = this.getStore<Listing>('listings', seedListings);
    const newListing: Listing = {
      ...listing,
      id: `list_${Date.now()}`,
      status: ListingStatus.OPEN,
      created_at: new Date().toISOString(),
    };
    listings.push(newListing);
    this.setStore('listings', listings);
    return newListing;
  }

  public static updateListing(id: string, updates: Partial<Listing>): Listing {
    const listings = this.getStore<Listing>('listings', seedListings);
    const index = listings.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Listing not found');
    const updated = { ...listings[index], ...updates };
    listings[index] = updated;
    this.setStore('listings', listings);
    return updated;
  }

  // --- OFFERS ---
  public static getOffers(): Offer[] {
    const offers = this.getStore<Offer>('offers', seedOffers);
    const profiles = this.getProfiles();
    return offers.map(o => {
      const buyer = profiles.find(p => p.id === o.buyer_id);
      return {
        ...o,
        buyer_name: buyer?.full_name || 'Recycler Partner',
        buyer_business_name: buyer?.business_name || 'Green Fiber Co',
      };
    });
  }

  public static getOffersForListing(listingId: string): Offer[] {
    return this.getOffers().filter(o => o.listing_id === listingId);
  }

  public static createOffer(offer: Omit<Offer, 'id' | 'created_at' | 'status'>): Offer {
    const offers = this.getStore<Offer>('offers', seedOffers);
    const newOffer: Offer = {
      ...offer,
      id: `offer_${Date.now()}`,
      status: OfferStatus.PENDING,
      created_at: new Date().toISOString(),
    };
    offers.push(newOffer);
    this.setStore('offers', offers);

    // Update listing status to Negotiating
    this.updateListing(offer.listing_id, { status: ListingStatus.NEGOTIATING });

    // Trigger Notification to Seller
    const listing = this.getListing(offer.listing_id);
    if (listing) {
      this.createNotification(
        listing.seller_id,
        'New Offer Received!',
        `You received a buy offer of ₹${offer.price_per_kg}/kg for "${listing.title}" from ${this.getProfile(offer.buyer_id)?.business_name || 'a Recycler'}.`,
        `/listings/${listing.id}`
      );
    }

    return newOffer;
  }

  public static updateOfferStatus(id: string, status: OfferStatus): Offer {
    const offers = this.getStore<Offer>('offers', seedOffers);
    const index = offers.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Offer not found');
    
    offers[index].status = status;
    this.setStore('offers', offers);
    const updated = offers[index];

    const listing = this.getListing(updated.listing_id);
    if (listing) {
      if (status === OfferStatus.ACCEPTED) {
        // Create Deal
        this.createDeal(listing.id, updated.id);
      } else if (status === OfferStatus.REJECTED) {
        // Notify buyer
        this.createNotification(
          updated.buyer_id,
          'Offer Rejected',
          `Your offer for "${listing.title}" has been rejected by the seller.`,
          `/listings/${listing.id}`
        );
      }
    }
    return updated;
  }

  // --- DEALS ---
  public static getDeals(): Deal[] {
    const deals = this.getStore<Deal>('deals', []);
    const listings = this.getListings();
    const profiles = this.getProfiles();
    return deals.map(d => {
      const listing = listings.find(l => l.id === d.listing_id);
      const seller = profiles.find(p => p.id === d.seller_id);
      const buyer = profiles.find(p => p.id === d.buyer_id);
      return {
        ...d,
        listing_title: listing?.title || 'Sorted Textile Waste',
        cloth_type: listing?.cloth_type || ClothType.PURE_COTTON,
        seller_name: seller?.full_name || 'Ramesh Gupta',
        buyer_name: buyer?.full_name || 'Anil Agrawal',
      };
    });
  }

  public static getDeal(id: string): Deal | undefined {
    return this.getDeals().find(d => d.id === id);
  }

  private static createDeal(listingId: string, offerId: string): Deal {
    const deals = this.getStore<Deal>('deals', []);
    const listing = this.getListing(listingId);
    const offer = this.getOffers().find(o => o.id === offerId);

    if (!listing || !offer) throw new Error('Listing or offer not found');

    const amount = offer.price_per_kg * offer.quantity_kg;
    const commission_pct = 5; // 5% standard commission

    const newDeal: Deal = {
      id: `deal_${Date.now()}`,
      listing_id: listingId,
      offer_id: offerId,
      seller_id: listing.seller_id,
      buyer_id: offer.buyer_id,
      agreed_price_per_kg: offer.price_per_kg,
      quantity_kg: offer.quantity_kg,
      total_amount: amount,
      commission_pct,
      status: DealStatus.AWAITING_PAYMENT,
      created_at: new Date().toISOString(),
    };

    deals.push(newDeal);
    this.setStore('deals', deals);

    // Mark listing as accepted
    this.updateListing(listingId, { status: ListingStatus.ACCEPTED });

    // Reject all other pending offers for this listing
    const offers = this.getStore<Offer>('offers', seedOffers);
    offers.forEach(o => {
      if (o.listing_id === listingId && o.id !== offerId && o.status === OfferStatus.PENDING) {
        o.status = OfferStatus.REJECTED;
      }
    });
    this.setStore('offers', offers);

    // Notify Buyer and Seller
    this.createNotification(
      newDeal.buyer_id,
      'Deal Formed - Awaiting Payment',
      `Your offer on "${listing.title}" was accepted! Please complete the secure escrow payment of ₹${amount}.`,
      `/deals/${newDeal.id}`
    );
    this.createNotification(
      newDeal.seller_id,
      'Offer Accepted! Deal Formed',
      `You accepted the offer from ${this.getProfile(newDeal.buyer_id)?.business_name}. Awaiting buyer payment.`,
      `/deals/${newDeal.id}`
    );

    return newDeal;
  }

  public static updateDealStatus(id: string, status: DealStatus, payment_ref?: string): Deal {
    const deals = this.getStore<Deal>('deals', []);
    const index = deals.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Deal not found');

    deals[index].status = status;
    if (payment_ref) {
      deals[index].payment_ref = payment_ref;
    }
    this.setStore('deals', deals);
    const updated = deals[index];

    // Notification updates based on status
    if (status === DealStatus.PAID) {
      // Log transaction
      this.createTransaction(updated.id, updated.total_amount, payment_ref || `pay_mock_${Date.now()}`);

      this.createNotification(
        updated.seller_id,
        'Escrow Payment Received!',
        `Buyer has deposited ₹${updated.total_amount}. Funds are secured. Please prepare the dispatch.`,
        `/deals/${updated.id}`
      );
      this.createNotification(
        updated.buyer_id,
        'Payment Deposited Successfully',
        `Your payment of ₹${updated.total_amount} is now held in secure escrow. Please book transport or arrange pickup.`,
        `/deals/${updated.id}`
      );
    } else if (status === DealStatus.IN_TRANSIT) {
      this.createNotification(
        updated.buyer_id,
        'Order Shipped / In Transit',
        `Your cloth waste shipment is on its way. Track transport details in your dashboard.`,
        `/deals/${updated.id}`
      );
    } else if (status === DealStatus.DELIVERED) {
      this.createNotification(
        updated.buyer_id,
        'Order Delivered!',
        `The shipment has arrived. Please verify the cloth quality and confirm delivery to release funds.`,
        `/deals/${updated.id}`
      );
    } else if (status === DealStatus.COMPLETED) {
      // Release funds, mark listing completed
      this.updateListing(updated.listing_id, { status: ListingStatus.COMPLETED });

      this.createNotification(
        updated.seller_id,
        'Escrow Released! Payment Sent',
        `Buyer has confirmed delivery. ₹${(updated.total_amount * (100 - updated.commission_pct) / 100).toFixed(0)} has been transferred to your account minus 5% platform commission.`,
        `/deals/${updated.id}`
      );
    } else if (status === DealStatus.DISPUTED) {
      this.createNotification(
        'admin_priya',
        'Dispute Raised on Deal',
        `Dispute raised on Deal ${updated.id} by user. Escrow is frozen pending operator review.`,
        `/admin`
      );
    }

    return updated;
  }

  // --- MESSAGES ---
  public static getMessages(dealId: string): Message[] {
    const messages = this.getStore<Message>('messages', []);
    return messages.filter(m => m.deal_id === dealId || m.listing_id === dealId);
  }

  public static createMessage(dealId: string, senderId: string, body: string, isListingId: boolean = false): Message {
    const messages = this.getStore<Message>('messages', []);
    const profile = this.getProfile(senderId);

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      deal_id: isListingId ? '' : dealId,
      listing_id: isListingId ? dealId : undefined,
      sender_id: senderId,
      sender_name: profile?.full_name || 'Anonymous User',
      body,
      created_at: new Date().toISOString(),
    };

    messages.push(newMessage);
    this.setStore('messages', messages);

    // Simulate instant auto-reply from seed users to make the app feel alive and interactive!
    setTimeout(() => {
      this.simulateAutoReply(dealId, senderId, body, isListingId);
    }, 1500);

    return newMessage;
  }

  private static simulateAutoReply(dealId: string, senderId: string, lastMessage: string, isListingId: boolean) {
    const user = this.getCurrentUser();
    if (!user) return;

    // Check who is the other person in this deal/listing
    let replySenderId = '';
    let replyName = '';
    let replyBody = '';

    if (isListingId) {
      const listing = this.getListing(dealId);
      if (!listing) return;
      if (senderId === listing.seller_id) {
        // Seller speaking, reply as a buyer who offered
        const offer = this.getOffersForListing(listing.id)[0];
        if (!offer) return;
        replySenderId = offer.buyer_id;
        replyName = this.getProfile(offer.buyer_id)?.full_name || 'Vikram Shah';
      } else {
        // Buyer speaking, reply as Seller
        replySenderId = listing.seller_id;
        replyName = listing.seller_name || 'Ramesh Gupta';
      }
    } else {
      const deal = this.getDeal(dealId);
      if (!deal) return;
      if (senderId === deal.seller_id) {
        replySenderId = deal.buyer_id;
        replyName = deal.buyer_name || 'Anil Agrawal';
      } else {
        replySenderId = deal.seller_id;
        replyName = deal.seller_name || 'Ramesh Gupta';
      }
    }

    if (!replySenderId) return;

    // Construct realistic responsive messages
    const text = lastMessage.toLowerCase();
    if (text.includes('price') || text.includes('price/kg') || text.includes('cost') || text.includes('rate') || text.includes('paisa')) {
      replyBody = `We need high-quality raw material. Since transport will take some cost, how about we settle at a fair price? I believe our negotiated terms are very reasonable. Let me know if you agree.`;
    } else if (text.includes('truck') || text.includes('tempo') || text.includes('transport') || text.includes('pickup') || text.includes('reach')) {
      replyBody = `Perfect, let's schedule the tempo booking through KapadaSETU's verified transport partners. It's safer and gives us live status updates!`;
    } else if (text.includes('hello') || text.includes('hi') || text.includes('namaste') || text.includes('hey')) {
      replyBody = `Namaste! Good to connect with you. Let's make sure this fabric scrap batch is sorted properly so we can close this transaction smoothly.`;
    } else if (text.includes('quality') || text.includes('wet') || text.includes('mix') || text.includes('cotton')) {
      replyBody = `Yes, all materials are completely dry and double-checked. Quality is our highest priority to protect the recycling machinery.`;
    } else {
      replyBody = `Understood. Thank you for the update. Let's proceed with the next steps on our KapadaSETU dashboard to finalize this batch!`;
    }

    const messages = this.getStore<Message>('messages', []);
    const newMessage: Message = {
      id: `msg_auto_${Date.now()}`,
      deal_id: isListingId ? '' : dealId,
      listing_id: isListingId ? dealId : undefined,
      sender_id: replySenderId,
      sender_name: replyName,
      body: replyBody,
      created_at: new Date().toISOString(),
    };

    messages.push(newMessage);
    this.setStore('messages', messages);

    // Create notification
    this.createNotification(
      senderId,
      `New message from ${replyName}`,
      replyBody.length > 50 ? `${replyBody.substring(0, 50)}...` : replyBody,
      isListingId ? `/listings/${dealId}` : `/deals/${dealId}`
    );

    // Force a custom event dispatch to trigger React state updates if needed
    window.dispatchEvent(new CustomEvent('kapada_new_message', { detail: { dealId, isListingId } }));
  }

  // --- TRANSPORT ---
  public static getTransportBookings(): TransportBooking[] {
    return this.getStore<TransportBooking>('transport', []);
  }

  public static getTransportForDeal(dealId: string): TransportBooking | undefined {
    return this.getTransportBookings().find(t => t.deal_id === dealId);
  }

  public static createTransportBooking(booking: Omit<TransportBooking, 'id' | 'status' | 'created_at'>): TransportBooking {
    const bookings = this.getStore<TransportBooking>('transport', []);
    const newBooking: TransportBooking = {
      ...booking,
      id: `trans_${Date.now()}`,
      status: TransportStatus.AWAITING_PICKUP,
      created_at: new Date().toISOString(),
    };

    bookings.push(newBooking);
    this.setStore('transport', bookings);

    // Update deal status to Paid or In Transit
    this.updateDealStatus(booking.deal_id, DealStatus.IN_TRANSIT);

    // Notify other party
    const deal = this.getDeal(booking.deal_id);
    if (deal) {
      const recipientId = booking.arranged_by === 'seller' ? deal.buyer_id : deal.seller_id;
      this.createNotification(
        recipientId,
        'Transport Arranged!',
        `A pickup has been scheduled for your deal. Vehicle: ${booking.vehicle_type}, Slot: ${booking.pickup_slot}.`,
        `/deals/${deal.id}`
      );
    }

    return newBooking;
  }

  public static updateTransportStatus(id: string, status: TransportStatus, notes?: string): TransportBooking {
    const bookings = this.getStore<TransportBooking>('transport', []);
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');

    bookings[index].status = status;
    if (notes) {
      bookings[index].tracking_notes = notes;
    }
    this.setStore('transport', bookings);
    const updated = bookings[index];

    // Update Deal state accordingly
    const deal = this.getDeal(updated.deal_id);
    if (deal) {
      if (status === TransportStatus.IN_TRANSIT) {
        this.updateDealStatus(deal.id, DealStatus.IN_TRANSIT);
      } else if (status === TransportStatus.DELIVERED) {
        this.updateDealStatus(deal.id, DealStatus.DELIVERED);
      }
    }

    return updated;
  }

  // --- REVIEWS ---
  public static getReviews(): Review[] {
    return this.getStore<Review>('reviews', []);
  }

  public static createReview(review: Omit<Review, 'id' | 'created_at'>): Review {
    const reviews = this.getStore<Review>('reviews', []);
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    reviews.push(newReview);
    this.setStore('reviews', reviews);

    // Check if both parties have reviewed to complete the deal entirely
    const dealReviews = reviews.filter(r => r.deal_id === review.deal_id);
    if (dealReviews.length >= 1) {
      // For simplicity, once buyer confirms delivery or a review is submitted, we can complete
      const deal = this.getDeal(review.deal_id);
      if (deal && deal.status !== DealStatus.COMPLETED) {
        this.updateDealStatus(deal.id, DealStatus.COMPLETED);
      }
    }

    return newReview;
  }

  // --- TRANSACTIONS & ESCROW ---
  public static getTransactions(): Transaction[] {
    return this.getStore<Transaction>('transactions', []);
  }

  private static createTransaction(dealId: string, totalAmount: number, paymentRef: string): Transaction {
    const txs = this.getStore<Transaction>('transactions', []);
    const commPct = 5;
    const platform_fee = (totalAmount * commPct) / 100;
    const seller_payout = totalAmount - platform_fee;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      deal_id: dealId,
      amount: totalAmount,
      currency: 'INR',
      gateway: 'razorpay_mock',
      gateway_payment_id: paymentRef,
      seller_payout,
      platform_fee,
      status: TransactionStatus.CAPTURED,
      created_at: new Date().toISOString(),
    };

    txs.push(newTx);
    this.setStore('transactions', txs);
    return newTx;
  }

  // --- DISPUTES ---
  public static getDisputes(): Dispute[] {
    return this.getStore<Dispute>('disputes', []);
  }

  public static raiseDispute(dealId: string, raisedBy: string, reason: string): Dispute {
    const disputes = this.getStore<Dispute>('disputes', []);
    const user = this.getProfile(raisedBy);

    const newDispute: Dispute = {
      id: `disp_${Date.now()}`,
      deal_id: dealId,
      raised_by: raisedBy,
      raised_by_name: user?.full_name || 'User',
      reason,
      status: 'raised',
      created_at: new Date().toISOString(),
    };

    disputes.push(newDispute);
    this.setStore('disputes', disputes);

    this.updateDealStatus(dealId, DealStatus.DISPUTED);

    return newDispute;
  }

  public static resolveDispute(id: string, resolutionNotes: string, refundToBuyer: boolean): Dispute {
    const disputes = this.getStore<Dispute>('disputes', []);
    const index = disputes.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Dispute not found');

    disputes[index].status = 'resolved';
    disputes[index].resolution_notes = resolutionNotes;
    this.setStore('disputes', disputes);
    const updated = disputes[index];

    // Finalize deal status based on resolution
    const deal = this.getDeal(updated.deal_id);
    if (deal) {
      if (refundToBuyer) {
        this.updateDealStatus(deal.id, DealStatus.CANCELLED);
        this.createNotification(
          deal.buyer_id,
          'Dispute Resolved - Refund Initiated',
          `Admin resolved your dispute. ₹${deal.total_amount} is being refunded back via UPI/card.`,
          `/deals/${deal.id}`
        );
        this.createNotification(
          deal.seller_id,
          'Dispute Resolved - Order Cancelled',
          `Admin has resolved the dispute and refunded the buyer. Notes: ${resolutionNotes}`,
          `/deals/${deal.id}`
        );
      } else {
        this.updateDealStatus(deal.id, DealStatus.COMPLETED);
        this.createNotification(
          deal.seller_id,
          'Dispute Resolved - Escrow Released',
          `Admin resolved the dispute in your favor. Payout of ₹${(deal.total_amount * 0.95).toFixed(0)} is sent.`,
          `/deals/${deal.id}`
        );
        this.createNotification(
          deal.buyer_id,
          'Dispute Resolved in Seller\'s Favor',
          `Admin completed the review and released escrow funds to the seller. Notes: ${resolutionNotes}`,
          `/deals/${deal.id}`
        );
      }
    }

    return updated;
  }

  // --- NOTIFICATIONS ---
  public static getNotifications(userId: string): AppNotification[] {
    const list = this.getStore<AppNotification>('notifications', []);
    return list.filter(n => n.user_id === userId).sort((a,b) => b.created_at.localeCompare(a.created_at));
  }

  public static createNotification(userId: string, title: string, message: string, link?: string): AppNotification {
    const list = this.getStore<AppNotification>('notifications', []);
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      user_id: userId,
      title,
      message,
      is_read: false,
      link,
      created_at: new Date().toISOString(),
    };
    list.push(newNotif);
    this.setStore('notifications', list);

    // Dispatch custom event to notify UI
    window.dispatchEvent(new CustomEvent('kapada_notification', { detail: newNotif }));

    return newNotif;
  }

  public static markNotificationRead(id: string): void {
    const list = this.getStore<AppNotification>('notifications', []);
    const index = list.findIndex(n => n.id === id);
    if (index !== -1) {
      list[index].is_read = true;
      this.setStore('notifications', list);
    }
  }

  public static markAllNotificationsRead(userId: string): void {
    const list = this.getStore<AppNotification>('notifications', []);
    list.forEach(n => {
      if (n.user_id === userId) {
        n.is_read = true;
      }
    });
    this.setStore('notifications', list);
  }

  // --- METRICS / ANALYTICS (For Admin & Landings) ---
  public static getPlatformMetrics() {
    const listings = this.getListings();
    const deals = this.getDeals();
    const transactions = this.getTransactions();

    const totalWasteSortedKg = listings
      .filter(l => l.status === ListingStatus.COMPLETED || l.status === ListingStatus.ACCEPTED)
      .reduce((sum, l) => sum + l.quantity_kg, 0) + 12450; // Add pre-launch stats to make it impressive

    const totalDealsValue = transactions.reduce((sum, t) => sum + t.amount, 0) + 420500;
    const totalCO2SavedKg = Math.round(totalWasteSortedKg * 3.6); // 1kg textile = ~3.6kg CO2 saved
    const activeSellersCount = this.getProfiles().filter(p => p.role === Role.SELLER).length;
    const activeBuyersCount = this.getProfiles().filter(p => p.role === Role.BUYER).length;

    return {
      totalWasteSortedKg,
      totalDealsValue,
      totalCO2SavedKg,
      activeSellersCount,
      activeBuyersCount,
      disputesCount: this.getDisputes().length,
      openListingsCount: listings.filter(l => l.status === ListingStatus.OPEN).length,
    };
  }
}
