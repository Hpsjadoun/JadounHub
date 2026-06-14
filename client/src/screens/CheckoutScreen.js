import React, { useState } from 'react';

export default function CheckoutScreen({ item, cart, onProceedToPayment }) {
  const [address, setAddress] = useState({
    fullName: '', phone: '', flatNo: '', area: '', pinCode: '', city: '', state: 'Uttar Pradesh'
  });

  // DYNAMIC PRICE FALLBACK ENGINE: Handles both single product (Buy Now) and full cart matrix
  const checkoutItemsList = item ? [item] : (cart?.items || []);
  const finalBillAmount = item ? Number(item.price * (item.qty || 1)) : Number(cart?.totalPrice || 0);

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmitDispatch = (e) => {
    e.preventDefault();
    if (address.phone.length !== 10) {
      return alert("⚠️ Please enter a valid 10-digit mobile number!");
    }
    alert("📍 Shipping Address Saved to Secure Checkout Session pipeline!");
    onProceedToPayment(); // Move user safely to PaymentScreen state node
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
      
      {/* LEFT COLUMN: SECURE SHIPPING FORM ADDRESS FIELDS */}
      <div className="md:col-span-2 bg-white p-5 sm:p-6 border rounded-3xl shadow-sm space-y-4">
        <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest border-l-4 border-indigo-600 pl-2 mb-2">
          Secure Order Logistics Address
        </h3>
        
        <form onSubmit={handleSubmitDispatch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Receiver's Full Name *</label>
              <input type="text" name="fullName" required value={address.fullName} onChange={handleInputChange} placeholder="e.g. Himanshu Singh" className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 font-medium" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">10-Digit Mobile Number *</label>
              <input type="text" name="phone" required maxLength="10" value={address.phone} onChange={handleInputChange} placeholder="e.g. 9876543210" className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">6-Digit Pin Code *</label>
              <input type="text" name="pinCode" required maxLength="6" value={address.pinCode} onChange={handleInputChange} placeholder="202001" className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 font-medium" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Flat / House No. / Building *</label>
              <input type="text" name="flatNo" required value={address.flatNo} onChange={handleInputChange} placeholder="Flat 405, Jadoun Tower" className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 font-medium" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Colony / Street / Area / Landmark *</label>
            <input type="text" name="area" required value={address.area} onChange={handleInputChange} placeholder="Near Central Market, Agra Fort Road" className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 font-medium" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">City / Town *</label>
              <input type="text" name="city" required value={address.city} onChange={handleInputChange} placeholder="Agra" className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 font-medium" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">State Region *</label>
              <select name="state" value={address.state} onChange={handleInputChange} className="w-full text-xs p-2.5 border rounded-xl bg-gray-50 outline-none font-bold text-gray-700">
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Delhi">Delhi</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-md mt-2">
            Proceed to Payment Hub <i className="fa-solid fa-credit-card ml-1"></i>
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: BILLING INVENTORY CONTEXT BOX */}
      <div className="bg-white p-5 border rounded-3xl shadow-sm h-fit space-y-4">
        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-wider border-b pb-2">Order Summary Summary</h4>
        
        <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto scrollbar-none">
          {checkoutItemsList.map((prod, idx) => (
            <div key={idx} className="flex items-center gap-3 py-2.5">
              <img src={prod.img} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border bg-gray-50" />
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-gray-800 truncate leading-tight">{prod.name}</h5>
                <p className="text-[10px] text-gray-400 font-medium">Qty: {prod.qty || 1} • {prod.category}</p>
              </div>
              <span className="text-xs font-extrabold text-gray-900">₹{Number(prod.price).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 space-y-2 bg-gray-50/50 p-3 rounded-xl border border-dashed">
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>Subtotal Delivery</span>
            <span>FREE Delivery</span>
          </div>
          <div className="flex justify-between items-baseline pt-1 border-t border-gray-200/60">
            <span className="text-xs font-bold text-gray-700">Total Payable:</span>
            <span className="text-lg font-black text-indigo-600">₹{finalBillAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

    </div>
  );
}