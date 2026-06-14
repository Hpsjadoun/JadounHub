import React, { useState, useEffect } from 'react';

export default function AdminScreen({ onBackToShop }) {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  
  // Update states
  const [updateFields, setUpdateFields] = useState({ price: '', originalPrice: '', discount: '0' });
  
  // Add states
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', originalPrice: '', discount: '0',
    category: 'Electronics', gender: 'All', sizes: 'Standard', colors: 'Black', img: ''
  });

  // Fetch live active stock list for dropdown selection mapping
  const loadStockList = async () => {
    try {
      const res = await fetch('https://jadounhub-server.onrender.com/api/products');
      const data = await res.json();
      if (data.success) {
        setAllProducts(data.products);
        if(data.products.length > 0) {
          setSelectedProductId(data.products[0]._id);
          setUpdateFields({
            price: data.products[0].price,
            originalPrice: data.products[0].originalPrice,
            discount: data.products[0].discount || '0'
          });
        }
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadStockList(); }, []);

  // Dropdown select automatic value filler logic
  const handleProductDropdownChange = (e) => {
    const pId = e.target.value;
    setSelectedProductId(pId);
    const matched = allProducts.find(p => p._id === pId);
    if (matched) {
      setUpdateFields({
        price: matched.price,
        originalPrice: matched.originalPrice || matched.price,
        discount: matched.discount || '0'
      });
    }
  };

  // LIVE RATE LAUNCH HANDLER
  const handleLiveRateUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://jadounhub-server.onrender.com/api/products/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedProductId, ...updateFields })
      });
      const data = await response.json();
      if (data.success) {
        alert("🚀 Rates Refreshed! Discount Offers Launched on Shop Front Live!");
        loadStockList();
      }
    } catch (err) { alert("Server connection failed."); }
  };

  const handleAddNewProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://jadounhub-server.onrender.com/api/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          originalPrice: Number(newProduct.originalPrice || newProduct.price),
          discount: Number(newProduct.discount),
          sizes: newProduct.sizes.split(',').map(s => s.trim()),
          colors: newProduct.colors.split(',').map(c => c.trim()),
          rating: 4.7
        })
      });
      const data = await response.json();
      if (data.success) {
        alert("🎉 New Product added to stock!");
        loadStockList();
        setNewProduct({ name: '', price: '', originalPrice: '', discount: '0', category: 'Electronics', gender: 'All', sizes: 'Standard', colors: 'Black', img: '' });
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white border rounded-3xl shadow-sm space-y-10 animate-fadeIn">
      
      {/* HEADER BAR */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-shield-halved text-2xl text-indigo-600"></i>
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">JadounHub Master Control Switchboard</h2>
        </div>
        <button onClick={onBackToShop} className="text-xs bg-indigo-600 text-white font-black px-4 py-2 rounded-xl hover:bg-indigo-700 transition shadow-md uppercase">
          Launch & View Shop front
        </button>
      </div>

      {/* SECTION 1: LIVE DISCOUNT AND PRICE RE-SET SIMULATOR */}
      <div className="bg-gray-50/70 border border-gray-100 p-5 rounded-2xl space-y-4">
        <h3 className="text-xs font-black text-red-600 uppercase tracking-widest border-l-4 border-red-600 pl-2">
          🔥 Live Discount & Price Alteration Engine (Daily Sales Tuning)
        </h3>
        <form onSubmit={handleLiveRateUpdateSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="sm:col-span-1">
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Active Product</label>
            <select value={selectedProductId} onChange={handleProductDropdownChange} className="w-full text-xs p-2.5 border rounded-xl bg-white outline-none font-bold text-gray-700">
              {allProducts.map(p => (
                <option key={p._id} value={p._id}>{p.name} ({p.category})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">New Offer Price (₹)</label>
            <input type="number" value={updateFields.price} onChange={e => setUpdateFields({...updateFields, price: e.target.value})} className="w-full text-xs p-2.5 border rounded-xl outline-none" required />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Original MRP Price (₹)</label>
            <input type="number" value={updateFields.originalPrice} onChange={e => setUpdateFields({...updateFields, originalPrice: e.target.value})} className="w-full text-xs p-2.5 border rounded-xl outline-none" required />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Set Discount Offer (%)</label>
            <div className="flex gap-2">
              <input type="number" value={updateFields.discount} onChange={e => setUpdateFields({...updateFields, discount: e.target.value})} className="w-full text-xs p-2.5 border rounded-xl outline-none" required />
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 rounded-xl text-xs uppercase tracking-wider whitespace-nowrap shadow-sm">
                Push Live
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* SECTION 2: ADD ABSOLUTE NEW FRESH ITEMS */}
      <form onSubmit={handleAddNewProductSubmit} className="space-y-4 border-t pt-6">
        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest border-l-4 border-indigo-600 pl-2">Incorporate Brand New Asset Stock</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Product Title / Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="text-xs p-2.5 border rounded-xl bg-gray-50/50" required />
          <input type="url" placeholder="Image CDN URL Link" value={newProduct.img} onChange={e => setNewProduct({...newProduct, img: e.target.value})} className="text-xs p-2.5 border rounded-xl bg-gray-50/50" required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="number" placeholder="Selling Price (₹)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="text-xs p-2.5 border rounded-xl bg-gray-50/50" required />
          <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="text-xs p-2.5 border rounded-xl bg-gray-50 font-bold text-gray-600">
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Shoes">Shoes</option>
            <option value="Home Decor">Home Decor</option>
          </select>
          <input type="text" placeholder="Sizes (e.g. M, L, XL or 7, 8, 9)" value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} className="text-xs p-2.5 border rounded-xl bg-gray-50/50" required />
        </div>
        <button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider">
          Add New Item Entry to Master Catalog
        </button>
      </form>

    </div>
  );
}