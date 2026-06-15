import React, { useState } from 'react';

const COUPONS = {
  'JADOUN10': { type: 'percent', value: 10, label: '10% Off' },
  'WELCOME20': { type: 'percent', value: 20, label: '20% Off for New Users' },
  'FLAT50': { type: 'flat', value: 50, label: '₹50 Flat Off' },
};

export default function CheckoutScreen({ item, cart, onProceedToPayment, darkMode }) {
  const [address, setAddress] = useState({
    fullName: '', phone: '', flatNo: '', area: '', pinCode: '', city: '', state: 'Uttar Pradesh'
  });
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState('');

  const checkoutItemsList = item ? [item] : (cart?.items || []);
  const baseAmount = item ? Number(item.price * (item.qty || 1)) : Number(cart?.totalPrice || 0);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = Math.round(baseAmount * appliedCoupon.value / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }
  const finalBillAmount = Math.max(0, baseAmount - discount);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(COUPONS[code]);
      setCouponMsg(`✅ "${code}" applied! You save ₹${COUPONS[code].type === 'percent' ? Math.round(baseAmount * COUPONS[code].value / 100) : COUPONS[code].value}`);
    } else {
      setAppliedCoupon(null);
      setCouponMsg('❌ Invalid coupon code. Try: JADOUN10, WELCOME20, FLAT50');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponMsg('');
  };

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmitDispatch = (e) => {
    e.preventDefault();
    if (address.phone.length !== 10) {
      return alert("⚠️ Please enter a valid 10-digit mobile number!");
    }
    alert("📍 Shipping Address Saved to Secure Checkout Session pipeline!");
    onProceedToPayment(finalBillAmount);
  };

  const dm = darkMode;
  const inputClass = `w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${dm ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'bg-gray-50/50 border-gray-200 text-gray-800'}`;

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">

      {/* LEFT: SHIPPING FORM */}
      <div className={`md:col-span-2 p-5 sm:p-6 border rounded-3xl shadow-sm space-y-4 ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest border-l-4 border-indigo-600 pl-2 mb-2">
          Secure Order Logistics Address
        </h3>

        <form onSubmit={handleSubmitDispatch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-[10px] font-bold uppercase mb-1 ${dm ? 'text-gray-400' : 'text-gray-400'}`}>Receiver's Full Name *</label>
              <input type="text" name="fullName" required value={address.fullName} onChange={handleInputChange} placeholder="e.g. Himanshu Singh" className={inputClass} />
            </div>
            <div>
              <label className={`block text-[10px] font-bold uppercase mb-1 ${dm ? 'text-gray-400' : 'text-gray-400'}`}>10-Digit Mobile Number *</label>
              <input type="text" name="phone" required maxLength="10" value={address.phone} onChange={handleInputChange} placeholder="e.g. 9876543210" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className={`block text-[10px] font-bold uppercase mb-1 ${dm ? 'text-gray-400' : 'text-gray-400'}`}>6-Digit Pin Code *</label>
              <input type="text" name="pinCode" required maxLength="6" value={address.pinCode} onChange={handleInputChange} placeholder="202001" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-[10px] font-bold uppercase mb-1 ${dm ? 'text-gray-400' : 'text-gray-400'}`}>Flat / House No. / Building *</label>
              <input type="text" name="flatNo" required value={address.flatNo} onChange={handleInputChange} placeholder="Flat 405, Jadoun Tower" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-bold uppercase mb-1 ${dm ? 'text-gray-400' : 'text-gray-400'}`}>Colony / Street / Area / Landmark *</label>
            <input type="text" name="area" required value={address.area} onChange={handleInputChange} placeholder="Near Central Market, Agra Fort Road" className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-[10px] font-bold uppercase mb-1 ${dm ? 'text-gray-400' : 'text-gray-400'}`}>City / Town *</label>
              <input type="text" name="city" required value={address.city} onChange={handleInputChange} placeholder="Agra" className={inputClass} />
            </div>
            <div>
              <label className={`block text-[10px] font-bold uppercase mb-1 ${dm ? 'text-gray-400' : 'text-gray-400'}`}>State Region *</label>
              <select name="state" value={address.state} onChange={handleInputChange} className={inputClass}>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Delhi">Delhi</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Haryana">Haryana</option>
                <option value="Punjab">Punjab</option>
              </select>
            </div>
          </div>

          {/* 🎟️ COUPON CODE SECTION */}
          <div className={`p-4 rounded-2xl border ${dm ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50/50 border-indigo-100'}`}>
            <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">
              🎟️ Apply Coupon Code
            </label>
            
            {/* Available coupons hint */}
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(COUPONS).map(([code, info]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCouponInput(code)}
                  className={`text-[10px] font-black px-2.5 py-1 rounded-lg border transition ${
                    appliedCoupon === info
                      ? 'bg-green-500 text-white border-green-500'
                      : dm ? 'bg-gray-600 text-indigo-300 border-gray-500 hover:border-indigo-400' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
                  }`}
                >
                  {code} <span className="opacity-70">• {info.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter coupon code..."
                className={`flex-1 text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold tracking-widest ${dm ? 'bg-gray-600 border-gray-500 text-white placeholder:text-gray-400' : 'bg-white border-indigo-200 text-gray-800'}`}
              />
              {appliedCoupon ? (
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-black px-3 py-2 rounded-xl transition"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-3 py-2 rounded-xl transition"
                >
                  Apply
                </button>
              )}
            </div>

            {couponMsg && (
              <p className={`text-[11px] font-bold mt-2 ${couponMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                {couponMsg}
              </p>
            )}
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-md mt-2">
            Proceed to Payment Hub <i className="fa-solid fa-credit-card ml-1"></i>
          </button>
        </form>
      </div>

      {/* RIGHT: ORDER SUMMARY */}
      <div className={`p-5 border rounded-3xl shadow-sm h-fit space-y-4 ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h4 className={`text-[11px] font-black uppercase tracking-wider border-b pb-2 ${dm ? 'text-gray-400 border-gray-700' : 'text-gray-400 border-gray-100'}`}>Order Summary</h4>

        <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto scrollbar-none">
          {checkoutItemsList.map((prod, idx) => (
            <div key={idx} className="flex items-center gap-3 py-2.5">
              <img src={prod.img} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border bg-gray-50" />
              <div className="flex-1 min-w-0">
                <h5 className={`text-xs font-bold truncate leading-tight ${dm ? 'text-white' : 'text-gray-800'}`}>{prod.name}</h5>
                <p className="text-[10px] text-gray-400 font-medium">Qty: {prod.qty || 1} • {prod.category}</p>
              </div>
              <span className={`text-xs font-extrabold ${dm ? 'text-white' : 'text-gray-900'}`}>₹{Number(prod.price).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>

        <div className={`border-t pt-3 space-y-2 p-3 rounded-xl border border-dashed ${dm ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50/50 border-gray-200'}`}>
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>Subtotal</span>
            <span>₹{baseAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>Delivery</span>
            <span className="text-green-600 font-bold">FREE</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-xs font-bold text-green-600">
              <span>🎟️ Coupon Discount</span>
              <span>- ₹{discount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className={`flex justify-between items-baseline pt-1 border-t ${dm ? 'border-gray-600' : 'border-gray-200'}`}>
            <span className={`text-xs font-bold ${dm ? 'text-gray-300' : 'text-gray-700'}`}>Total Payable:</span>
            <span className="text-lg font-black text-indigo-600">₹{finalBillAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {appliedCoupon && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 text-center">
            <p className="text-[11px] font-black text-green-700">🎉 You're saving ₹{discount.toLocaleString('en-IN')}!</p>
          </div>
        )}
      </div>

    </div>
  );
}