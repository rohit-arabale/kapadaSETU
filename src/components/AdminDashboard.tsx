/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useI18n } from '../i18n';
import { KapadaDB } from '../db';
import { Dispute, Profile, Role } from '../types';
import { Shield, Sparkles, Scale, Heart, ShieldCheck, FileText, Check, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const { t } = useI18n();
  const [disputes, setDisputes] = useState<Dispute[]>(() => KapadaDB.getDisputes());
  const [profiles, setProfiles] = useState<Profile[]>(() => KapadaDB.getProfiles());
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const metrics = KapadaDB.getPlatformMetrics();

  const handleResolve = (id: string, refundToBuyer: boolean) => {
    const notes = resolutionNotes[id] || 'Platform review completed. Standard resolution applied.';
    
    KapadaDB.resolveDispute(id, notes, refundToBuyer);
    
    // Refresh states
    setDisputes(KapadaDB.getDisputes());
    setSuccess(`Dispute resolved successfully! ${refundToBuyer ? 'Refund processed back to buyer.' : 'Funds released to seller.'}`);
    
    // Clear notes field
    setResolutionNotes(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    setTimeout(() => setSuccess(''), 3000);
  };

  const handleVerifyKYC = (profileId: string) => {
    KapadaDB.updateProfile(profileId, { kyc_status: 'verified' });
    setProfiles(KapadaDB.getProfiles());
    setSuccess('User business registration successfully verified.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const activeDisputes = disputes.filter(d => d.status === 'raised');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-8 py-4">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
        <Shield className="w-6 h-6 text-orange-600 animate-pulse" />
        <div>
          <h2 className="font-sans font-extrabold text-lg text-stone-900">{t('adminTitle')}</h2>
          <p className="text-xs text-stone-500">Platform operational compliance, escrow ledgers, and KYC registry.</p>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl p-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 block shrink-0"></span>
          {success}
        </div>
      )}

      {/* Analytics KPI counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs card-cinematic">
          <span className="text-[9px] bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider block w-max">
            Textile Waste Diverted
          </span>
          <p className="text-2xl font-extrabold text-stone-900 mt-2">
            {(metrics.totalWasteSortedKg / 1000).toFixed(1)} Tonnes
          </p>
          <span className="text-[10px] text-stone-400 block mt-1 font-medium">
            Saved from Indian landfill dumps
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs card-cinematic">
          <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase tracking-wider block w-max">
            Carbon Offset Saved
          </span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">
            {metrics.totalCO2SavedKg.toLocaleString()} kg
          </p>
          <span className="text-[10px] text-emerald-600/80 block mt-1 font-medium flex items-center gap-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            Reduction in methane emissions
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs card-cinematic">
          <span className="text-[9px] bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider block w-max">
            Secured Escrow Volume
          </span>
          <p className="text-2xl font-extrabold text-stone-900 mt-2">
            ₹{metrics.totalDealsValue.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-stone-400 block mt-1 font-medium">
            Protected split payments captured
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs card-cinematic">
          <span className="text-[9px] bg-orange-50 text-orange-800 font-bold px-2 py-0.5 rounded uppercase tracking-wider block w-max">
            Unresolved Disputes
          </span>
          <p className="text-2xl font-extrabold text-orange-700 mt-2">
            {activeDisputes.length} Raised
          </p>
          <span className="text-[10px] text-orange-600 block mt-1 font-medium">
            Requires driver invoice audit
          </span>
        </motion.div>

      </div>

      {/* Double Column Workstation: Disputes & KYC logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Escrow Disputes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center border-b border-stone-150 pb-2">
            <h4 className="font-sans font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              {t('disputesTitle')}
            </h4>
            <span className="text-[10px] bg-stone-100 text-stone-600 font-mono font-bold px-2.5 py-0.5 rounded-full">
              {activeDisputes.length} active
            </span>
          </div>

          {activeDisputes.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-150 p-6 text-stone-400 text-xs">
              🎉 Excellent! No open disputes in the platform registry. All transactions are flowing smoothly.
            </div>
          ) : (
            <div className="space-y-4">
              {activeDisputes.map(d => {
                const deal = KapadaDB.getDeal(d.deal_id);
                return (
                  <div key={d.id} className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-3.5 shadow-xs card-cinematic">
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <span className="text-[8px] text-stone-400 font-mono font-bold block uppercase">DISPUTE: {d.id}</span>
                        <h5 className="font-bold text-xs text-stone-900 mt-0.5">
                          Deal Ref: {deal?.listing_title} ({d.deal_id})
                        </h5>
                      </div>
                      <span className="text-xs font-extrabold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-md">
                        ₹{deal?.total_amount} Escrow
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-stone-150 text-xs space-y-1.5">
                      <p className="text-stone-500 font-medium">
                        Raised by: <strong className="text-stone-800">{d.raised_by_name}</strong>
                      </p>
                      <p className="text-stone-600 italic">
                        "Reason: {d.reason}"
                      </p>
                    </div>

                    {/* Resolution inputs */}
                    <div className="space-y-2 pt-1.5 border-t border-stone-150">
                      <label className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider">
                        Compliance Resolution Audit Notes
                      </label>
                      <input
                        type="text"
                        value={resolutionNotes[d.id] || ''}
                        onChange={e => setResolutionNotes(prev => ({ ...prev, [d.id]: e.target.value }))}
                        placeholder="e.g. Verified driver receipt. Mismatch was within 1.2kg tolerance. Releasing escrow."
                        className="w-full border border-stone-200 bg-white rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 input-cinematic"
                      />

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          onClick={() => handleResolve(d.id, true)}
                          className="bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-[10px] py-2 px-3.5 rounded-lg uppercase tracking-wider transition-colors btn-premium btn-ripple"
                        >
                          {t('resolveRefundBtn')}
                        </button>
                        <button
                          onClick={() => handleResolve(d.id, false)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] py-2 px-3.5 rounded-lg uppercase tracking-wider transition-colors shadow-xs btn-premium btn-ripple"
                        >
                          {t('resolveReleaseBtn')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: User Management / KYC list */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center border-b border-stone-150 pb-2">
            <h4 className="font-sans font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t('userManagement')}
            </h4>
            <span className="text-[10px] bg-stone-100 text-stone-600 font-mono font-bold px-2 py-0.5 rounded-full">
              {profiles.length} total
            </span>
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {profiles.map(p => (
              <div key={p.id} className="bg-white border border-stone-200 rounded-2xl p-3.5 flex justify-between items-center gap-3 shadow-xs card-cinematic">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-stone-900 truncate block">
                      {p.full_name}
                    </span>
                    <span className="text-[8px] border border-stone-200 text-stone-500 bg-stone-50 px-1 py-0.5 rounded font-mono uppercase shrink-0">
                      {p.role}
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-stone-700 mt-0.5 leading-snug truncate">
                    🏢 {p.business_name}
                  </p>
                  <p className="text-[9px] text-stone-400 mt-0.5 font-medium">
                    📞 {p.phone} • {p.city}
                  </p>
                  {p.gstin && (
                    <span className="text-[8px] text-stone-400 block font-mono font-semibold">
                      GSTIN: {p.gstin}
                    </span>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded leading-none inline-block ${
                    p.kyc_status === 'verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-orange-50 text-orange-700 border border-orange-100'
                  }`}>
                    {p.kyc_status}
                  </span>
                  
                  {p.kyc_status !== 'verified' && (
                    <button
                      onClick={() => handleVerifyKYC(p.id)}
                      className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[8px] py-1 px-1.5 rounded transition-colors uppercase btn-premium btn-ripple"
                    >
                      Verify Business
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
