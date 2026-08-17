-- 20260718000000_init.sql
-- KapadaSETU SQL Schema Migrations (Supabase Compatible)

-- Enums Definition
CREATE TYPE user_role AS ENUM ('seller', 'buyer', 'admin');
CREATE TYPE cloth_material_type AS ENUM ('pure_cotton', 'mixed', 'synthetic', 'other');
CREATE TYPE listing_status AS ENUM ('open', 'negotiating', 'accepted', 'completed', 'cancelled');
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected', 'countered');
CREATE TYPE deal_status AS ENUM ('awaiting_payment', 'paid', 'in_transit', 'delivered', 'completed', 'disputed', 'cancelled');
CREATE TYPE transport_status AS ENUM ('awaiting_pickup', 'in_transit', 'delivered');
CREATE TYPE transaction_status AS ENUM ('created', 'captured', 'failed', 'refunded');

-- 1. Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'seller',
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode VARCHAR(6) NOT NULL,
  lat NUMERIC(9,6) NOT NULL,
  lng NUMERIC(9,6) NOT NULL,
  gstin VARCHAR(15),
  kyc_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Listings Table
CREATE TABLE public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cloth_type cloth_material_type NOT NULL DEFAULT 'pure_cotton',
  quantity_kg NUMERIC(10,2) NOT NULL,
  condition TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  expected_price_per_kg NUMERIC(10,2), -- NULL means open to offers
  status listing_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

-- 3. Offers Table
CREATE TABLE public.offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  price_per_kg NUMERIC(10,2) NOT NULL,
  quantity_kg NUMERIC(10,2) NOT NULL,
  message TEXT NOT NULL,
  status offer_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Deals Table
CREATE TABLE public.deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL NOT NULL,
  offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  agreed_price_per_kg NUMERIC(10,2) NOT NULL,
  quantity_kg NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  commission_pct NUMERIC(4,2) NOT NULL DEFAULT 5.00,
  status deal_status NOT NULL DEFAULT 'awaiting_payment',
  payment_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Transport Bookings Table
CREATE TABLE public.transport_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  arranged_by VARCHAR(20) NOT NULL,
  provider VARCHAR(20) NOT NULL DEFAULT 'third_party',
  pickup_address TEXT NOT NULL,
  pickup_slot TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  cost NUMERIC(10,2) NOT NULL,
  status transport_status NOT NULL DEFAULT 'awaiting_pickup',
  tracking_notes TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Messages Table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Reviews Table
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  reviewer_role VARCHAR(10) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Transactions / Escrow Payments Log Table
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  gateway TEXT NOT NULL,
  gateway_payment_id TEXT UNIQUE NOT NULL,
  seller_payout NUMERIC(10,2) NOT NULL,
  platform_fee NUMERIC(10,2) NOT NULL,
  status transaction_status NOT NULL DEFAULT 'created',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Disputes / Platform operator Audits Table
CREATE TABLE public.disputes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  raised_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'raised',
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- Row-Level Security (RLS) Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can edit only their own profile, public read for buyers & sellers
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: Public read for open listings, sellers can CRUD their own
CREATE POLICY "Public read open listings" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Sellers can manage own listings" ON public.listings FOR ALL USING (auth.uid() = seller_id);

-- Offers: Buyers can CRUD own offers, sellers can read offers on their listings
CREATE POLICY "Buyers manage own offers" ON public.offers FOR ALL USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers view offers on own listings" ON public.offers FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.listings
    WHERE public.listings.id = listing_id AND public.listings.seller_id = auth.uid()
  )
);

-- Deals: Only buyer or seller in the deal can view/modify
CREATE POLICY "Deals viewable by participants" ON public.deals FOR SELECT USING (
  auth.uid() = seller_id OR auth.uid() = buyer_id
);
CREATE POLICY "Deals editable by participants" ON public.deals FOR UPDATE USING (
  auth.uid() = seller_id OR auth.uid() = buyer_id
);

-- Transport Bookings: Participants can read/update
CREATE POLICY "Transport viewable by participants" ON public.transport_bookings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.deals
    WHERE public.deals.id = deal_id AND (public.deals.seller_id = auth.uid() OR public.deals.buyer_id = auth.uid())
  )
);

-- Messages: Realtime chat between seller & buyer
CREATE POLICY "Messages readable by deal participants" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.deals
    WHERE public.deals.id = deal_id AND (public.deals.seller_id = auth.uid() OR public.deals.buyer_id = auth.uid())
  ) OR EXISTS (
    SELECT 1 FROM public.listings
    WHERE public.listings.id = listing_id AND public.listings.seller_id = auth.uid()
  ) OR auth.uid() = sender_id
);
CREATE POLICY "Messages writeable by deal participants" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id
);

-- Disputes: Visible to admin or disputing parties
CREATE POLICY "Disputes viewable by admin or parties" ON public.disputes FOR SELECT USING (
  auth.uid() = raised_by OR EXISTS (
    SELECT 1 FROM public.profiles WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
  )
);


-- Seed Queries for Development
-- Note: Replace placeholders with valid auth.uid() values in live environment

-- INSERT INTO public.profiles (id, role, full_name, business_name, phone, address_line, city, state, pincode, lat, lng, kyc_status) VALUES
-- ('00000000-0000-0000-0000-000000000001', 'seller', 'Ramesh Gupta', 'Gupta Boutique', '+919876543210', '124, Textile Market', 'Ludhiana', 'Punjab', '141001', 30.9010, 75.8573, 'verified'),
-- ('00000000-0000-0000-0000-000000000002', 'buyer', 'Anil Agrawal', 'Agrawal Recyclers', '+917654321098', 'Plot 18, MIDC Area', 'Mumbai', 'Maharashtra', '400001', 18.9220, 72.8347, 'verified');
