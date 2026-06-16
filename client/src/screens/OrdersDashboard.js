import React, { useState } from 'react';

export default function OrdersDashboard({ onBackToShop, darkMode }) {
  const [activeOrders, setActiveOrders] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('jadounhub_orders') || '[]');
    // Default demo order agar koi order nahi hai
    if (saved.length === 0) {
      return [
        {
          orderId: "ORD-805779",
          date: "13 June 2026",
          itemName: "Noise Buds Pro Wireless Earbuds",
          variant: "Size: Standard | Color: White",
          price: 1999,
          img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
          currentStatus: "Booked",
          paymentMode: "UPI"
        }
      ];
    }
    return saved;
  });

  const statusStepsSequence = ["Booked", "Shipped", "Out for Delivery", "Delivered"];

  const handleCancelOrderAction = (orderId) => {
    const confirmCancel = window.confirm("⚠️ Are you sure? Kya aap sach mein ye order cancel karna chahte hain?");
    if (confirmCancel) {
      const updated = activeOrders.map(order =>
        order.orderId === orderId ? { ...order, currentStatus: 'Cancelled' } : order
      );
      setActiveOrders(updated);
      localStorage.setItem('jadounhub_orders', JSON.stringify(updated));
      alert("🛑 Order Cancelled! Refund 2-3 din mein source account mein bhej diya jaayega.");
    }
  };

  const statusIcon = {
    'Booked': '📋',
    'Shipped': '🚚',
    'Out for Delivery': '🛵',
    'Delivered': '✅',
    'Cancelled': '❌'
  };

  const dm = darkMode;

  return (
    <div className={`max-w-4xl mx-auto my-8 px-4 space-y-6 animate-fadeIn`}>

      {/* HEADER */}
      <div className={`flex items-center justify-between border-b pb-4 ${dm ? 'border-gray-700' : ''}`}>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-boxes-packing text-2xl text-indigo-600"></i>
          <h2 className={`text-xl font-black uppercase tracking-tight ${dm ? 'text-white' : 'text-gray-800'}`}>
            Your Orders & Logistics Panel
          </h2>
        </div>
        <button onClick={onBackToShop} className="text-xs bg-indigo-600 text-white font-black px-4 py-2 rounded-xl hover:bg-indigo-700 transition shadow-md uppercase">
          Return to Shop
        </button>
      </div>

      {/* ORDERS LIST */}
      {activeOrders.map((order) => {
        const currentStepIndex = statusStepsSequence.indexOf(order.currentStatus);
        const isCancelled = order.currentStatus === 'Cancelled';

        return (
          <div key={order.orderId} className={`border rounded-3xl p-5 sm:p-6 shadow-sm space-y-6 ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

            {/* ORDER META */}
            <div className={`flex flex-wrap justify-between items-center gap-4 p-4 rounded-2xl border ${dm ? 'bg-gray-700 border-gray-600' : 'bg-gray-50/60 border-gray-100'}`}>
              <div className={`text-xs font-medium space-y-0.5 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>Order ID: <span className={`font-bold ${dm ? 'text-white' : 'text-gray-800'}`}>{order.orderId}</span></p>
                <p>Date: <span className={`font-semibold ${dm ? 'text-gray-300' : 'text-gray-700'}`}>{order.date}</span></p>
                {order.paymentMode && (
                  <p>Payment: <span className="font-bold text-indigo-500">{order.paymentMode}</span></p>
                )}
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold uppercase ${dm ? 'text-gray-500' : 'text-gray-400'}`}>Total Amount</span>
                <p className="text-base font-black text-indigo-600 leading-none mt-0.5">₹{order.price?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* PRODUCT INFO */}
            <div className={`flex items-center justify-between gap-4 border-b pb-4 flex-wrap sm:flex-nowrap ${dm ? 'border-gray-700' : 'border-gray-50'}`}>
              <div className="flex items-center gap-4">
                <img src={order.img} alt={order.itemName} className="w-16 h-16 object-cover rounded-xl border bg-gray-50" />
                <div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                    isCancelled ? 'bg-red-50 border-red-100 text-red-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                  }`}>
                    {statusIcon[order.currentStatus]} {order.currentStatus}
                  </span>
                  <h4 className={`font-bold text-sm sm:text-base mt-1 ${dm ? 'text-white' : 'text-gray-800'}`}>{order.itemName}</h4>
                  <p className={`text-[11px] font-medium mt-0.5 ${dm ? 'text-gray-400' : 'text-gray-400'}`}>{order.variant}</p>
                </div>
              </div>

              {!isCancelled && order.currentStatus === 'Booked' && (
                <button
                  onClick={() => handleCancelOrderAction(order.orderId)}
                  className="w-full sm:w-auto text-xs bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-black px-4 py-2 rounded-xl transition uppercase flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-rectangle-xmark"></i> Cancel Order
                </button>
              )}
            </div>

            {/* TRACKING STEPPER */}
            {isCancelled ? (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-700">
                <i className="fa-solid fa-ban text-lg animate-pulse"></i>
                <p className="text-xs font-bold uppercase tracking-wider">Order has been Cancelled & Voided from registry.</p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <h5 className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dm ? 'text-gray-500' : 'text-gray-400'}`}>
                  Live Tracking Progress
                </h5>

                <div className="relative flex justify-between items-center">
                  <div className={`absolute left-0 right-0 h-1 top-1/2 -translate-y-1/2 z-0 rounded-full ${dm ? 'bg-gray-700' : 'bg-gray-100'}`} />
                  <div
                    className="absolute left-0 h-1 bg-indigo-600 top-1/2 -translate-y-1/2 z-0 transition-all duration-500 rounded-full"
                    style={{ width: `${(currentStepIndex / (statusStepsSequence.length - 1)) * 100}%` }}
                  />

                  {statusStepsSequence.map((step, idx) => {
                    const isDone = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <div key={step} className="flex flex-col items-center z-10 text-center space-y-2">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs transition-all duration-300 shadow-sm ${
                          isDone ? 'bg-indigo-600 text-white border-indigo-600 font-black' : dm ? 'bg-gray-700 text-gray-500 border-gray-600' : 'bg-white text-gray-400 border-gray-200'
                        } ${isCurrent ? 'ring-4 ring-indigo-100 animate-pulse' : ''}`}>
                          {isDone ? "✓" : idx + 1}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-1 ${isDone ? 'text-indigo-600' : dm ? 'text-gray-600' : 'text-gray-400'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* ETA */}
                {order.currentStatus !== 'Delivered' && (
                  <div className={`text-center text-[11px] font-bold pt-2 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
                    🕐 Estimated Delivery: <span className="text-indigo-600">3-5 Business Days</span>
                  </div>
                )}
                {order.currentStatus === 'Delivered' && (
                  <div className="text-center text-[11px] font-bold text-green-600 pt-2">
                    🎉 Package Delivered Successfully!
                  </div>
                )}
              </div>
            )}

          </div>
        );
      })}

      {activeOrders.length === 0 && (
        <div className={`text-center py-16 rounded-3xl border border-dashed ${dm ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-white border-gray-200 text-gray-400'}`}>
          <i className="fa-solid fa-box-open text-4xl mb-3 text-gray-300"></i>
          <p className="font-bold text-sm">No orders yet!</p>
          <p className="text-xs mt-1">Place your first order from the marketplace.</p>
          <button onClick={onBackToShop} className="mt-4 bg-indigo-600 text-white text-xs font-black px-5 py-2 rounded-xl hover:bg-indigo-700 transition">
            Start Shopping 🛍️
          </button>
        </div>
      )}
    </div>
  );
}