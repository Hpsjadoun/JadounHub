import React from 'react';

export default function AdminAnalytics({ darkMode, products = [] }) {
  const dm = darkMode;

  // Get orders from localStorage
  const orders = JSON.parse(localStorage.getItem('jadounhub_orders') || '[]');
  const totalOrders = orders.length || 1; // demo fallback
  const totalRevenue = orders.length > 0 ? orders.reduce((sum, o) => sum + Number(o.price || 0), 0) : 1999;
  const deliveredCount = orders.filter(o => o.currentStatus === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.currentStatus === 'Cancelled').length;

  // Category breakdown
  const categoryCount = {};
  products.forEach(p => { categoryCount[p.category] = (categoryCount[p.category] || 0) + 1; });

  // Best sellers by rating
  const topProducts = [...products].sort((a,b) => Number(b.rating||0) - Number(a.rating||0)).slice(0, 5);

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: '💰', color: 'from-green-500 to-emerald-600' },
    { label: 'Total Orders', value: totalOrders, icon: '📦', color: 'from-blue-500 to-indigo-600' },
    { label: 'Total Products', value: products.length, icon: '🛍️', color: 'from-purple-500 to-pink-600' },
    { label: 'Delivered', value: deliveredCount, icon: '✅', color: 'from-teal-500 to-cyan-600' },
  ];

  return (
    <div className={`p-5 rounded-3xl border shadow-sm space-y-6 mb-6 ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      <h2 className={`text-base font-black uppercase tracking-wide border-l-4 border-indigo-600 pl-3 ${dm ? 'text-white' : 'text-gray-800'}`}>
        📊 Sales Analytics Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.color} p-4 rounded-2xl text-white shadow-md`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-lg font-black">{s.value}</p>
            <p className="text-[10px] font-bold opacity-90 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <div className={`p-4 rounded-2xl border ${dm ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
          <h4 className={`text-xs font-black uppercase mb-3 ${dm ? 'text-gray-300' : 'text-gray-600'}`}>📂 Products by Category</h4>
          <div className="space-y-2">
            {Object.entries(categoryCount).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-2">
                <span className={`text-xs font-bold w-20 truncate ${dm ? 'text-gray-300' : 'text-gray-600'}`}>{cat}</span>
                <div className={`flex-1 h-2 rounded-full ${dm ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${(count/products.length)*100}%` }}></div>
                </div>
                <span className={`text-xs font-black w-6 text-right ${dm ? 'text-gray-300' : 'text-gray-500'}`}>{count}</span>
              </div>
            ))}
            {products.length === 0 && <p className="text-xs text-gray-400">No products yet</p>}
          </div>
        </div>

        {/* Top Rated Products */}
        <div className={`p-4 rounded-2xl border ${dm ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
          <h4 className={`text-xs font-black uppercase mb-3 ${dm ? 'text-gray-300' : 'text-gray-600'}`}>⭐ Top Rated Products</h4>
          <div className="space-y-2">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-500 w-4">#{i+1}</span>
                <span className={`text-xs font-bold truncate flex-1 ${dm ? 'text-gray-300' : 'text-gray-700'}`}>{p.name}</span>
                <span className="text-xs font-black text-amber-500">★ {p.rating || '5.0'}</span>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-xs text-gray-400">No products yet</p>}
          </div>
        </div>
      </div>

      {/* Order Status Summary */}
      <div className={`p-4 rounded-2xl border flex items-center justify-around text-center ${dm ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50/50 border-indigo-100'}`}>
        <div>
          <p className="text-lg font-black text-indigo-600">{totalOrders}</p>
          <p className={`text-[9px] font-bold uppercase ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Total Orders</p>
        </div>
        <div className={`w-px h-8 ${dm ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
        <div>
          <p className="text-lg font-black text-green-600">{deliveredCount}</p>
          <p className={`text-[9px] font-bold uppercase ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Delivered</p>
        </div>
        <div className={`w-px h-8 ${dm ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
        <div>
          <p className="text-lg font-black text-red-500">{cancelledCount}</p>
          <p className={`text-[9px] font-bold uppercase ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Cancelled</p>
        </div>
      </div>
    </div>
  );
}