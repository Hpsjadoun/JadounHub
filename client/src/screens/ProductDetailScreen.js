import React, { useState } from 'react';

export default function ProductDetailScreen({ product, onAddToCart, onBuyNow, onBack }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'N/A');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Standard');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

  // PREMIUM HOVER MOUSE ZOOM CONTROLLER
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Back Button Breadcrumb Navigation */}
      <button onClick={onBack} className="mb-6 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 transition uppercase tracking-wider">
        <i className="fa-solid fa-arrow-left-long"></i> Back to Products Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 sm:p-8 border rounded-3xl shadow-sm">
        
        {/* LEFT COLUMN: INTERACTIVE IMAGE MULTI-ZOOM PANEL */}
        <div className="space-y-4">
          <div 
            className="h-96 w-full border border-gray-100 rounded-2xl overflow-hidden bg-gray-50 relative cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomPos({ ...zoomPos, show: false })}
          >
            <img src={product.img} alt={product.name} className={`w-full h-full object-cover transition-transform duration-100 ${zoomPos.show ? 'opacity-0' : 'opacity-100'}`} />
            
            {/* Live Hover Zoom Lens Display */}
            {zoomPos.show && (
              <div 
                className="absolute inset-0 bg-no-repeat rounded-2xl shadow-inner border border-gray-100"
                style={{
                  backgroundImage: `url(${product.img})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: '200%'
                }}
              />
            )}

            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
              🔍 Hover image to zoom details
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: TECHNICAL METRICS & CART INTERACTION PIPELINE */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{product.category} Hub</span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-800 leading-tight mt-1">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-bold">
                <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">★ {product.rating || '4.8'}</span>
                <span>Verified JadounHub Quality Seal Assured</span>
              </div>
            </div>

            {/* Price Blocks Panel Sheet */}
            <div className="bg-gray-50/70 border border-gray-100 p-4 rounded-2xl flex items-baseline gap-3">
              <span className="text-3xl font-black text-gray-900">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-sm text-gray-400 line-through font-medium">MRP ₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                  <span className="text-xs bg-red-100 text-red-600 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">🔥 {product.discount}% OFF</span>
                </>
              )}
            </div>

            {/* Color Swatch Selector Engine */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Select Available Color Variant:</h4>
                <div className="flex gap-2">
                  {product.colors.map(col => (
                    <button key={col} onClick={() => setSelectedColor(col)} className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition ${selectedColor === col ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>{col}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Configuration Selection Box */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Select Premium Size Parameter:</h4>
                <div className="flex gap-2">
                  {product.sizes.map(sz => (
                    <button key={sz} onClick={() => setSelectedSize(sz)} className={`text-xs min-w-[36px] h-9 px-2 flex items-center justify-center font-extrabold rounded-xl border transition ${selectedSize === sz ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>{sz}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Functional Processing Trigger Box */}
          <div className="border-t pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <button 
              onClick={() => onAddToCart({ ...product, selectedColor, selectedSize })}
              className="bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-700 font-extrabold py-3 rounded-2xl text-xs sm:text-sm transition border border-gray-200 flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <i className="fa-solid fa-cart-plus text-base"></i> Add Item to Bag
            </button>
            <button 
              onClick={() => onBuyNow({ ...product, selectedColor, selectedSize })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-2xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              Express Checkout <i className="fa-solid fa-bolt text-amber-300"></i>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}