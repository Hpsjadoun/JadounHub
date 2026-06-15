import React, { useState } from 'react';

export default function PaymentScreen({ item, cart, onPaymentSuccess, darkMode }) {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);

  const finalBillAmount = item ? Number(item.price * (item.qty || 1)) : Number(cart?.totalPrice || 0);
  const UPI_ID = '9389720893@yapl';

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const handlePaymentDispatchSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (paymentMethod === 'COD') {
        alert("📦 Order Confirmed! Cash on Delivery selected. Our team will contact you shortly.");
      } else {
        alert("✅ Payment Confirmed! Thank you for shopping at JadounHub.");
      }
      onPaymentSuccess();
    }, 2000);
  };

  const dm = darkMode;

  return (
    <div className="max-w-md mx-auto my-12 px-4 animate-fadeIn">
      <div className={`p-6 border rounded-3xl shadow-sm space-y-6 ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

        {/* HEADER */}
        <div className={`border-b pb-3 flex items-center justify-between ${dm ? 'border-gray-700' : ''}`}>
          <div>
            <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest border-l-4 border-indigo-600 pl-2">
              Secure Payment Gateway
            </h3>
            <p className={`text-[10px] font-medium mt-0.5 ${dm ? 'text-gray-400' : 'text-gray-400'}`}>JadounHub Authorized Financial Network</p>
          </div>
          <i className="fa-solid fa-building-shield text-xl text-gray-400"></i>
        </div>

        {/* AMOUNT */}
        <div className={`border p-4 rounded-2xl flex items-center justify-between ${dm ? 'bg-indigo-900/30 border-indigo-800' : 'bg-indigo-50/50 border-indigo-100'}`}>
          <span className={`text-xs font-bold ${dm ? 'text-gray-300' : 'text-gray-600'}`}>Amount Payable:</span>
          <span className="text-xl font-black text-indigo-600">₹{finalBillAmount.toLocaleString('en-IN')}</span>
        </div>

        {/* PAYMENT METHOD */}
        <form onSubmit={handlePaymentDispatchSubmit} className="space-y-4">
          <label className={`block text-[10px] font-black uppercase tracking-wider mb-2 ${dm ? 'text-gray-400' : 'text-gray-400'}`}>Select Payment Mode</label>

          <div className="space-y-2.5">
            {/* UPI / QR */}
            <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${paymentMethod === 'UPI' ? 'border-indigo-600 bg-indigo-50/20' : dm ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payMethod" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="accent-indigo-600" />
                <span className={`text-xs font-bold ${dm ? 'text-gray-200' : 'text-gray-700'}`}>UPI / QR Code (PhonePe, GPay, Paytm)</span>
              </div>
              <i className="fa-solid fa-qrcode text-gray-400 text-sm"></i>
            </label>

            {/* COD */}
            <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${paymentMethod === 'COD' ? 'border-indigo-600 bg-indigo-50/20' : dm ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payMethod" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-indigo-600" />
                <span className={`text-xs font-bold ${dm ? 'text-gray-200' : 'text-gray-700'}`}>Cash on Delivery (COD Available)</span>
              </div>
              <i className="fa-solid fa-truck-ramp-box text-gray-400 text-sm"></i>
            </label>
          </div>

          {/* QR CODE SECTION */}
          {paymentMethod === 'UPI' && (
            <div className={`rounded-2xl border p-4 space-y-3 ${dm ? 'bg-gray-700 border-gray-600' : 'bg-orange-50/50 border-orange-100'}`}>
              
              <p className={`text-[10px] font-black uppercase tracking-wider text-center ${dm ? 'text-gray-300' : 'text-gray-500'}`}>
                📱 Scan QR Code to Pay
              </p>

              {/* QR IMAGE */}
              <div className="flex justify-center">
                <div className="bg-white p-3 rounded-2xl shadow-md border border-orange-200 inline-block">
                  <img
                    src="/qr-payment.jpeg"
                    alt="UPI QR Code - HIMANSHU PRATAP SINGH"
                    className="w-48 h-48 object-contain rounded-xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback if image not found */}
                  <div style={{display:'none'}} className="w-48 h-48 flex flex-col items-center justify-center bg-gray-100 rounded-xl">
                    <i className="fa-solid fa-qrcode text-5xl text-gray-400 mb-2"></i>
                    <p className="text-xs text-gray-500 font-bold text-center">Use UPI ID below</p>
                  </div>
                </div>
              </div>

              {/* UPI ID */}
              <div className={`flex items-center justify-between p-3 rounded-xl border ${dm ? 'bg-gray-600 border-gray-500' : 'bg-white border-orange-200'}`}>
                <div>
                  <p className={`text-[10px] font-bold ${dm ? 'text-gray-400' : 'text-gray-400'}`}>UPI ID</p>
                  <p className={`text-sm font-black tracking-wide ${dm ? 'text-white' : 'text-gray-800'}`}>{UPI_ID}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUPI}
                  className={`text-xs font-black px-3 py-1.5 rounded-lg transition ${upiCopied ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                >
                  {upiCopied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>

              {/* Supported Apps */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className={`text-[9px] font-bold ${dm ? 'text-gray-500' : 'text-gray-400'}`}>Accepted:</span>
                <span className="text-xs">📱 GPay</span>
                <span className="text-xs">📱 PhonePe</span>
                <span className="text-xs">📱 Paytm</span>
                <span className="text-xs">📱 BHIM</span>
              </div>

              <p className={`text-[10px] text-center font-medium ${dm ? 'text-gray-400' : 'text-gray-400'}`}>
                After payment, click <strong>"Confirm & Pay"</strong> below ↓
              </p>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full font-extrabold py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 mt-2 ${
              isProcessing ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isProcessing ? (
              <><i className="fa-solid fa-circle-notch animate-spin text-sm"></i> Processing Order...</>
            ) : (
              <>{paymentMethod === 'COD' ? '📦 Confirm COD Order' : `✅ I've Paid ₹${finalBillAmount.toLocaleString('en-IN')}`}</>
            )}
          </button>
        </form>

      </div>
    </div>
  );
} 