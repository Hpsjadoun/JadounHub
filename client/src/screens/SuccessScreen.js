import React from 'react';

export default function SuccessScreen({ onReturnHome }) {
  const mockOrderTrackingId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const mockTxnId = "TXN-" + Math.floor(10000000 + Math.random() * 90000000);
  
  // Get current real-time timestamp layout matching the invoice manifest
  const currentDate = new Date().toLocaleString('en-IN', { hour12: true });

  const handleInvoicePrintTrigger = () => {
    window.print(); // Triggers direct system native dialog configured optimized layout
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 animate-fadeIn">
      
      {/* SECTION 1: CUSTOMER SCREEN INTERFACE VIEW (Will hide cleanly when printing) */}
      <div className="print:hidden bg-white p-8 border rounded-3xl shadow-sm text-center space-y-6 max-w-md mx-auto mb-8">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 text-4xl shadow-inner border border-green-100">
          <i className="fa-solid fa-circle-check animate-bounce"></i>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Order Placed Successfully!</h2>
          <p className="text-xs text-gray-400 font-medium">Thank you for shopping on JadounHub Marketplace</p>
        </div>

        <div className="bg-gray-50/70 p-4 border rounded-2xl border-dashed border-gray-200 space-y-2">
          <div className="flex justify-between items-center text-xs font-medium text-gray-500">
            <span>Tracking Reference Token:</span>
            <span className="font-mono font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md text-[11px]">
              {mockOrderTrackingId}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs font-medium text-gray-500 border-t pt-2 border-gray-200/50">
            <span>Logistic Delivery Dispatch:</span>
            <span className="text-gray-700 font-bold">Standard Free (3-5 Days)</span>
          </div>
        </div>

        {/* DOUBLE BUTTON CONTROLLERS CONTAINER */}
        <div className="grid grid-cols-1 gap-2.5 pt-2">
          <button 
            onClick={handleInvoicePrintTrigger}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-file-arrow-down text-sm"></i> Download Invoice Receipt
          </button>
          
          <button 
            onClick={onReturnHome}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1"
          >
            <i className="fa-solid fa-basket-shopping"></i> Return to Shop Front
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* SECTION 2: THE OFFICIAL JADOUNHUB TRANSACTION MANIFEST ARCHITECTURE    */}
      {/* (Hidden on web UI, gets rendered exclusively inside generated PDF document) */}
      {/* ======================================================================= */}
      <div className="hidden print:block bg-white p-10 border border-gray-300 font-sans text-gray-800 tracking-tight leading-relaxed">
        
        {/* TOP BRAND EMBLEM HEADER */}
        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-indigo-600">JADOUNHUB</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mt-0.5">Secure Transaction Manifest Record</p>
          </div>
          <div className="text-right border-2 border-dashed border-emerald-500 bg-emerald-50/30 p-3 rounded-xl max-w-xs">
            <h4 className="text-xs font-black text-emerald-700 uppercase tracking-wider flex items-center justify-end gap-1">
              ✓ JadounHub Security Verified
            </h4>
            <p className="text-[9px] text-gray-500 font-medium mt-0.5">100% Secure Cryptographic Seal Verified Token</p>
          </div>
        </div>

        <h2 className="text-xl font-black text-gray-900 border-b pb-2 mb-4 uppercase tracking-wide">Invoice {mockOrderTrackingId}</h2>

        {/* METADATA CORE REFERENCES GRID */}
        <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
          <div className="space-y-4">
            <h3 className="font-black uppercase tracking-widest text-gray-400 text-[10px] border-b pb-1">Transaction References</h3>
            <table className="w-full border-none">
              <tbody>
                <tr>
                  <td className="font-bold text-gray-500 py-1">Order Reference:</td>
                  <td className="font-black text-gray-900 py-1">{mockOrderTrackingId}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-500 py-1">Gateway TXN ID:</td>
                  <td className="font-mono font-bold text-gray-900 py-1">{mockTxnId}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-500 py-1">Date Timestamp:</td>
                  <td className="font-medium text-gray-700 py-1">{currentDate}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-500 py-1">Payment Status:</td>
                  <td className="py-1"><span className="bg-green-100 text-green-800 text-[9px] font-black px-2 py-0.5 rounded-md uppercase">UPI Verified</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-4">
            <h3 className="font-black uppercase tracking-widest text-gray-400 text-[10px] border-b pb-1">Shipping Consignee Destination</h3>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-700 space-y-0.5 font-medium">
              <p className="font-black text-gray-900">Himanshu Pratap Singh</p>
              <p>1, Bakrol Building</p>
              <p>Bakrol, Ahmedabad, Ahmedabad</p>
              <p>Gujarat - 382430</p>
            </div>
          </div>
        </div>

        {/* ITEM DESCRIPTION PRICING TABLE MATRIX */}
        <div className="space-y-3 mb-8">
          <h3 className="font-black uppercase tracking-widest text-gray-400 text-[10px] border-b pb-1">Itemized Metrics Breakdown</h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 font-bold text-gray-600 uppercase tracking-wider">
                <th className="p-3">Item Description</th>
                <th className="p-3">Config Variant</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="font-medium text-gray-800">
                <td className="p-3 font-bold text-gray-900">Noise Buds Pro Wireless Earbuds</td>
                <td className="p-3 text-gray-500">Size: Standard | Color: White</td>
                <td className="p-3 text-right">₹1,999</td>
                <td className="p-3 text-center">1</td>
                <td className="p-3 text-right font-bold">₹1,999</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* FINAL FINANCIAL CALCULATION SETTLEMENT */}
        <div className="border-t-2 border-gray-800 pt-4 flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
          <div>
            <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Account Fully Settled</span>
            <p className="text-[10px] font-medium text-gray-400 mt-1">Ref Digit ID: JDH-2942644 • SSL Secured Network Node</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Grand Total Paid Amount</span>
            <h3 className="text-2xl font-black text-indigo-600 leading-none mt-1">₹1,999</h3>
          </div>
        </div>

        {/* INVOICE LEGAL FOOTER BLOCK */}
        <p className="text-center text-[9px] text-gray-400 font-medium pt-12 border-t mt-12">
          © 2026 JadounHub Corporate Pvt Ltd. All legal entity transaction data layers rights reserved.
        </p>
      </div>

    </div>
  );
}