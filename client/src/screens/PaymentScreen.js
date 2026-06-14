import React, { useState } from 'react';

export default function PaymentScreen({ item, cart, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  // DYNAMIC PRICE DETECTOR: Read directly from item (Buy Now) or cart array fallback safely
  const finalBillAmount = item ? Number(item.price * (item.qty || 1)) : Number(cart?.totalPrice || 0);

  const handlePaymentDispatchSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate secure network transaction pipeline loading
    setTimeout(() => {
      setIsProcessing(false);
      alert("💳 Network Authorization Token Captured Successfully!");
      onPaymentSuccess(); // Route safely to SuccessScreen node state
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 animate-fadeIn">
      <div className="bg-white p-6 border rounded-3xl shadow-sm space-y-6">
        
        {/* HEADER BRAND GATEWAY */}
        <div className="border-b pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest border-l-4 border-indigo-600 pl-2">
              Secure Payment Gateway
            </h3>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">JadounHub Authorized Financial Network</p>
          </div>
          <i className="fa-solid fa-building-shield text-xl text-gray-400"></i>
        </div>

        {/* PRICE EMBED TOTAL BOX */}
        <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between">
          <span className="text-xs font-bold text-gray-600">Amount Payable:</span>
          <span className="text-xl font-black text-indigo-600">₹{finalBillAmount.toLocaleString('en-IN')}</span>
        </div>

        {/* PAYMENT CONTROLLERS FORM */}
        <form onSubmit={handlePaymentDispatchSubmit} className="space-y-4">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Select Payment Mode</label>
          
          <div className="space-y-2.5">
            {/* OPTION 1: UPI PORTAL */}
            <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${paymentMethod === 'UPI' ? 'border-indigo-600 bg-indigo-50/20' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payMethod" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="accent-indigo-600" />
                <span className="text-xs font-bold text-gray-700">UPI / QR Code (PhonePe, GPay, Paytm)</span>
              </div>
              <i className="fa-solid fa-qrcode text-gray-400 text-sm"></i>
            </label>

            {/* OPTION 2: CARD GATEWAY */}
            <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${paymentMethod === 'CARD' ? 'border-indigo-600 bg-indigo-50/20' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payMethod" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} className="accent-indigo-600" />
                <span className="text-xs font-bold text-gray-700">Credit / Debit Card (Visa, MasterCard, RuPay)</span>
              </div>
              <i className="fa-solid fa-credit-card text-gray-400 text-sm"></i>
            </label>

            {/* OPTION 3: COD GATEWAY */}
            <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${paymentMethod === 'COD' ? 'border-indigo-600 bg-indigo-50/20' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payMethod" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-indigo-600" />
                <span className="text-xs font-bold text-gray-700">Cash on Delivery (COD Available)</span>
              </div>
              <i className="fa-solid fa-truck-ramp-box text-gray-400 text-sm"></i>
            </label>
          </div>

          {/* DISPATCH EXECUTION ACTIONS BUTTON */}
          <button 
            type="submit" 
            disabled={isProcessing}
            className={`w-full font-extrabold py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 mt-4 ${
              isProcessing ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isProcessing ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin text-sm"></i> Authorizing Secure Funds...
              </>
            ) : (
              <>
                Confirm & Pay ₹{finalBillAmount.toLocaleString('en-IN')} <i className="fa-solid fa-circle-check"></i>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}