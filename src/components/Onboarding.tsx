/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { useI18n } from '../i18n';
import { KapadaDB } from '../db';
import { Profile, Role, getGeoFromPincode } from '../types';
import { ShoppingBag, Truck, Check, HelpCircle, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingProps {
  onOnboardingComplete: (profile: Profile) => void;
}

export default function Onboarding({ onOnboardingComplete }: OnboardingProps) {
  const { t } = useI18n();
  const [role, setRole] = useState<Role>(Role.SELLER);
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [gstin, setGstin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Field Validations
    if (!fullName.trim() || !businessName.trim() || !phone.trim() || !pincode.trim() || !addressLine.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/^\+91\d{10}$|^\d{10}$/.test(phone.trim())) {
      setError('Please enter a valid 10-digit Indian phone number (+91 or simple 10 digits).');
      return;
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      setError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Resolve geo coordinates from PIN code fallback
      const geo = getGeoFromPincode(pincode);
      const formattedPhone = phone.trim().startsWith('+91') ? phone.trim() : `+91${phone.trim()}`;

      const newProfile: Profile = {
        id: `user_${Date.now()}`,
        email: `${fullName.toLowerCase().replace(/\s+/g, '')}@kapadasetu.com`,
        role,
        full_name: fullName.trim(),
        business_name: businessName.trim(),
        phone: formattedPhone,
        address_line: addressLine.trim(),
        city: geo.city,
        state: geo.state,
        pincode: pincode.trim(),
        lat: geo.lat,
        lng: geo.lng,
        gstin: gstin.trim() ? gstin.trim() : undefined,
        kyc_status: 'verified', // Auto-verify in sandbox to facilitate instant trading
        created_at: new Date().toISOString(),
      };

      // Create profile in database and active user state
      KapadaDB.createProfile(newProfile);
      KapadaDB.setCurrentUser(newProfile);
      setLoading(false);
      onOnboardingComplete(newProfile);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-xl mx-auto py-8 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Ambient background blob */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-100/20 rounded-full blur-3xl pointer-events-none animate-blob-1" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-green-100/15 rounded-full blur-3xl pointer-events-none animate-blob-2" />

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-stone-200 shadow-xl overflow-hidden p-6 sm:p-10 relative">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Onboarding • ऑनबोर्डिंग
          </span>
          <h2 className="font-sans font-extrabold text-2xl text-stone-900 mt-2">
            {t('onboardTitle')}
          </h2>
          <p className="text-xs text-stone-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
            {t('onboardSubtitle')}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 mb-6 font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 block shrink-0"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Role Chooser */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider">
              {t('selectRole')} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Seller option */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setRole(Role.SELLER)}
                className={`p-4 border rounded-2xl text-left flex gap-3 transition-all cursor-pointer card-cinematic ${
                  role === Role.SELLER
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  role === Role.SELLER ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500'
                }`}>
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-stone-900">{t('sellerRoleName')}</span>
                    {role === Role.SELLER && <Check className="w-4 h-4 text-emerald-600 font-extrabold" />}
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1 leading-normal">
                    {t('sellerRoleDesc')}
                  </p>
                </div>
              </motion.button>

              {/* Buyer option */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setRole(Role.BUYER)}
                className={`p-4 border rounded-2xl text-left flex gap-3 transition-all cursor-pointer card-cinematic ${
                  role === Role.BUYER
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  role === Role.BUYER ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500'
                }`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-stone-900">{t('buyerRoleName')}</span>
                    {role === Role.BUYER && <Check className="w-4 h-4 text-emerald-600 font-extrabold" />}
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1 leading-normal">
                    {t('buyerRoleDesc')}
                  </p>
                </div>
              </motion.button>
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Form Fields */}
          <div className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-400 block mb-1 uppercase tracking-wider">
                  {t('fullName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 input-cinematic"
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-400 block mb-1 uppercase tracking-wider">
                  {t('businessName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 input-cinematic"
                  placeholder="e.g. Kumar Garments & Tailoring"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-400 block mb-1 uppercase tracking-wider">
                  {t('phone')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 input-cinematic"
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-400 block mb-1 uppercase tracking-wider flex items-center gap-1">
                  {t('pincode')} <span className="text-red-500">*</span>
                  <span className="group relative cursor-pointer text-stone-400">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-48 bg-stone-900 text-white text-[9px] p-2 rounded-lg leading-normal shadow-md">
                      {t('pincodeHelper')}
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  maxLength={6}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 font-mono input-cinematic"
                  placeholder="e.g. 400001"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-400 block mb-1 uppercase tracking-wider">
                {t('addressLine')} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={addressLine}
                onChange={e => setAddressLine(e.target.value)}
                rows={2}
                className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 input-cinematic"
                placeholder="Shop No, Street details, Landmark, City name..."
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-400 block mb-1 uppercase tracking-wider flex items-center gap-1">
                {t('gstin')}
                <FileText className="w-3.5 h-3.5 text-stone-400" />
              </label>
              <input
                type="text"
                value={gstin}
                onChange={e => setGstin(e.target.value)}
                maxLength={15}
                className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 font-mono input-cinematic"
                placeholder="15-digit GSTIN (e.g. 27AAAAA1111A1Z1)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-sm transition-colors uppercase tracking-wider flex items-center justify-center gap-2 btn-premium btn-ripple btn-glow"
          >
            {loading ? t('loading') : t('registerBtn')}
          </button>

        </form>
      </div>
    </motion.div>
  );
}
