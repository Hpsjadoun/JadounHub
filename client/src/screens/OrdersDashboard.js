import React, { useState } from 'react';

export default function OrdersDashboard({ onBackToShop }) {
  const [activeOrders, setActiveOrders] = useState([
    {
      orderId: "ORD-805779",
      date: "13 June 2026",
      itemName: "Noise Buds Pro Wireless Earbuds",
      variant: "Size: Standard | Color: White",
      price: 1999,
      img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
      // Status sequence options: 'Booked', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'
      currentStatus: "Booked" 
    }
  ]);

  const statusStepsSequence = ["Booked", "Shipped", "Out for Delivery", "Delivered"];

  // CANCEL ORDER INTERACTION TRIGGER
  const handleCancelOrderAction = (orderId) => {
    const confirmCancel = window.confirm("⚠️ Are you sure? Kya aap sach mein ye order cancel karna chahte hain?");
    if (confirmCancel) {
      setActiveOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId ? { ...order, currentStatus: 'Cancelled' } : order
        )
      );
      alert("🛑 Order Cancelled Successfully! Aapka refund source account mein 2-3 din mein bhej diya jayega.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 space-y-6 anonymity-layer animate-fadeIn">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-boxes-packing text-2xl text-indigo-600"></i>
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Your Orders & Logistics Panel</h2>
        </div>
        <button onClick={onBackToShop} className="text-xs bg-indigo-600 text-white font-black px-4 py-2 rounded-xl hover:bg-indigo-700 transition shadow-md uppercase">
          Return to Shop front
        </button>
      </div>

      {activeOrders.map((order) => {
        const currentStepIndex = statusStepsSequence.indexOf(order.currentStatus);
        const isCancelled = order.currentStatus === 'Cancelled';

        return (
          <div key={order.orderId} className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
            
            {/* CARD META HEADER */}
            <div className="flex flex-wrap justify-between items-center gap-4 bg-gray-50/60 p-4 rounded-2xl border border-gray-100/50">
              <div className="text-xs font-medium text-gray-500 space-y-0.5">
                <p>Order Reference: <span className="font-bold text-gray-800">{order.orderId}</span></p>
                <p>Date Block: <span className="font-semibold text-gray-700">{order.date}</span></p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-gray-400">Total Settlement</span>
                <p className="text-base font-black text-indigo-600 leading-none mt-0.5">₹{order.price.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* PRODUCT CONTEXT DESCRIPTION */}
            <div className="flex items-center justify-between gap-4 border-b pb-4 border-gray-50 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-4">
                <img src={order.img} alt={order.itemName} className="w-16 h-16 object-cover rounded-xl border bg-gray-50" />
                <div>
                  <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-black px-2 py-0.5 rounded-md uppercase tracking-wider">Active Cargo</span>
                  <h4 className="font-bold text-gray-800 text-sm sm:text-base mt-1">{order.itemName}</h4>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">{order.variant}</p>
                </div>
              </div>

              {/* DYNAMIC CANCELLATION CONTROLLER ACTION BUTTON */}
              {!isCancelled && order.currentStatus === 'Booked' && (
                <button 
                  onClick={() => handleCancelOrderAction(order.orderId)}
                  className="w-full sm:w-auto text-xs bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-black px-4 py-2 rounded-xl transition shadow-sm uppercase tracking-wide flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-rectangle-xmark"></i> Cancel Order
                </button>
              )}
            </div>

            {/* STEPPER PROGRESS MATRIX INTERFACE */}
            {isCancelled ? (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-700">
                <i className="fa-solid fa-ban text-lg animate-pulse"></i>
                <p className="text-xs font-bold uppercase tracking-wider">This package routing has been successfully Cancelled and Voided inside registry.</p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Live Progress Steppers</h5>
                
                <div className="relative flex justify-between items-center">
                  <div className="absolute left-0 right-0 h-1 bg-gray-100 top-1/2 -translate-y-1/2 z-0" />
                  <div 
                    className="absolute left-0 h-1 bg-indigo-600 top-1/2 -translate-y-1/2 z-0 transition-all duration-500" 
                    style={{ width: `${(currentStepIndex / (statusStepsSequence.length - 1)) * 100}%` }}
                  />

                  {statusStepsSequence.map((step, idx) => {
                    const isDone = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div key={step} className="flex flex-col items-center z-10 text-center space-y-2">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs transition-all duration-300 shadow-sm ${
                          isDone ? 'bg-indigo-600 text-white border-indigo-600 font-black' : 'bg-white text-gray-400 border-gray-200 font-medium'
                        } ${isCurrent ? 'ring-4 ring-indigo-100 animate-pulse' : ''}`}>
                          {isDone ? "✓" : idx + 1}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-1 ${isDone ? 'text-indigo-600 font-black' : 'text-gray-400'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}