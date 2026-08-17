/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Deal } from '../types';
import { CreditCard, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Smartphone } from 'lucide-react';

interface RazorpayModalProps {
  deal: Deal;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

export default function RazorpayModal({ deal, onSuccess, onCancel }: RazorpayModalProps) {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4315 2894 1056 3491');
  const [cardExpiry, setCardExpiry] = useState('12/29');
  const [cardCvv, setCardCvv] = useState('123');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  const amountRupees = deal.total_amount;

  const handlePay = (simulateSuccess: boolean) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (simulateSuccess) {
        setPaymentStatus('success');
        setTimeout(() => {
          onSuccess(`pay_rzp_${Date.now()}`);
        }, 1200);
      } else {
        setPaymentStatus('failed');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-cinematic-overlay">
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-stone-100 flex flex-col max-h-[90vh]">
        
        {/* Razorpay Top Header */}
        <div className="bg-[#1C2C54] text-white p-5 flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-blue-400 font-extrabold text-sm font-sans tracking-wide uppercase">Razorpay</span>
              <span className="text-[10px] bg-emerald-500 text-white px-1 py-0.5 rounded-xs leading-none font-bold">SANDBOX</span>
            </div>
            <h3 className="font-bold text-base mt-1">KapadaSETU Escrow Trust</h3>
            <p className="text-[10px] text-stone-300 mt-0.5">Order Ref: {deal.id}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone-300 uppercase font-bold block">Amount to Pay</span>
            <span className="text-xl font-extrabold text-emerald-400 block">₹{amountRupees.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {isProcessing ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
              <CreditCard className="w-6 h-6 text-blue-600 absolute" />
            </div>
            <h4 className="font-bold text-stone-800 text-base mt-2">Processing Secure Escrow Payment</h4>
            <p className="text-xs text-stone-400 max-w-xs">
              Communicating with Razorpay gateway & NPCI UPI switches. Please do not close or reload the browser.
            </p>
          </div>
        ) : paymentStatus === 'success' ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-stone-900 text-lg">Deposit Successful!</h4>
            <p className="text-xs text-stone-500 max-w-xs">
              ₹{amountRupees} is now safely secured in KapadaSETU's commission-protected escrow wallet. Release code generated.
            </p>
          </div>
        ) : paymentStatus === 'failed' ? (
          <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">Payment Simulator Rejected</h4>
            <p className="text-xs text-stone-500 max-w-xs">
              Transaction declined by UPI partner bank (Insufficient funds simulation). Please retry with another payment mode.
            </p>
            <div className="flex gap-2 w-full mt-2">
              <button
                onClick={() => setPaymentStatus('idle')}
                className="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors"
              >
                Retry Payment
              </button>
              <button
                onClick={onCancel}
                className="flex-1 border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold py-2 px-4 rounded-xl text-xs transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Payment Method Selector */}
            <div className="flex border-b border-stone-100 shrink-0">
              <button
                onClick={() => setActiveTab('upi')}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                  activeTab === 'upi' ? 'border-blue-600 text-blue-600 bg-blue-50/10' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                BHIM / UPI
              </button>
              <button
                onClick={() => setActiveTab('card')}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                  activeTab === 'card' ? 'border-blue-600 text-blue-600 bg-blue-50/10' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Cards (Visa/Mastercard)
              </button>
              <button
                onClick={() => setActiveTab('netbanking')}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                  activeTab === 'netbanking' ? 'border-blue-600 text-blue-600 bg-blue-50/10' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Netbanking
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto space-y-4">
              {activeTab === 'upi' && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider">UPI App / ID</span>
                  <div className="grid grid-cols-4 gap-2">
                    {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                      <button
                        key={app}
                        onClick={() => setUpiId(`user@ok${app.toLowerCase()}`)}
                        className={`p-2 border rounded-xl text-center text-xs font-semibold hover:bg-stone-50 transition-all ${
                          upiId.includes(app.toLowerCase()) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-stone-200 text-stone-600'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 mx-auto mb-1 text-stone-500" />
                        {app}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-400 block mb-1">Enter UPI VPA Address</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-blue-500"
                      placeholder="e.g. mobile@upi"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-stone-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-blue-500"
                      placeholder="16-digit card number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-blue-500"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 block mb-1">CVV Code</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-blue-500"
                        placeholder="3 digits"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'netbanking' && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider">Popular Banks</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map(bank => (
                      <button
                        key={bank}
                        className="p-2.5 border border-stone-200 rounded-xl text-left text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:border-blue-500 transition-colors"
                      >
                        🏦 {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-stone-50 border border-stone-150 p-3.5 rounded-2xl">
                <div className="flex gap-2 text-[10px] text-stone-500">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="text-stone-700 block">KapadaSETU Escrow Protocol:</strong>
                    The buyer deposits funds. Money is frozen securely. Released to the seller ONLY after you mark "Order Received".
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Simulation Buttons */}
            <div className="p-5 bg-stone-50 border-t border-stone-100 grid grid-cols-2 gap-2 shrink-0">
              <button
                onClick={() => handlePay(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors btn-premium btn-ripple btn-glow"
              >
                Simulate Success
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePay(false)}
                className="bg-red-50 border border-red-200 hover:bg-red-100/50 text-red-700 font-bold py-3 px-4 rounded-xl text-xs transition-colors"
              >
                Simulate Failure
              </button>
              <button
                onClick={onCancel}
                className="col-span-2 text-stone-400 hover:text-stone-600 font-bold text-xs py-1 mt-1 block"
              >
                Cancel and Go Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
