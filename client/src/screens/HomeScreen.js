import React, { useState } from 'react';

export default function HomeScreen({ onBuyNow, onAddToCart, dbProducts = [], onProductClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [sizeFilter, setSizeFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(15000);

  const [selectedVariants, setSelectedVariants] = useState({});

  const handleVariantSelect = (productId, type, value) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: { ...prev[productId], [type]: value }
    }));
  };

  // ROBUST FILTERING ENGINE FOR CUSTOMERS
  const filteredProducts = dbProducts.filter(prod => {
    // Check if product keys are present or fall back to safe defaults
    const name = prod.name || '';
    const cat = prod.category || '';
    const price = Number(prod.price || 0);
    const gender = prod.gender || 'All';
    const sizes = prod.sizes || ['Standard'];

    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cat.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = category === 'All' || cat === category;
    
    // Flexible segment checking (All/Unisex bypasses gender check)
    const matchesGender = genderFilter === 'All' || gender === 'All' || gender === genderFilter;
    
    const matchesPrice = price <= maxPrice;
    
    const matchesSize = sizeFilter === 'All' || sizes.includes(sizeFilter) || sizes.includes('Standard');

    return matchesSearch && matchesCategory && matchesGender && matchesPrice && matchesSize;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fadeIn">
      
      {/* SIDEBAR FILTERS SYSTEM PANEL */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-gray-800 text-sm sm:text-base">
            <i className="fa-solid fa-sliders text-indigo-600 mr-1"></i> Advanced Filters
          </h3>
          <button 
            onClick={() => { setCategory('All'); setGenderFilter('All'); setSizeFilter('All'); setMaxPrice(15000); setSearchQuery(''); }} 
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            Clear All
          </button>
        </div>

        {/* Price Slider Range Limit Control */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Max Price: ₹{maxPrice.toLocaleString('en-IN')}
          </label>
          <input 
            type="range" min="500" max="15000" step="500" value={maxPrice} 
            onChange={(e) => setMaxPrice(Number(e.target.value))} 
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
          />
        </div>

        {/* Gender Filter Category Segment Matrix */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Segment / Gender</label>
          <select 
            value={genderFilter} onChange={e => setGenderFilter(e.target.value)} 
            className="w-full text-sm p-2 border rounded-xl outline-none bg-gray-50 text-gray-700 font-medium"
          >
            <option value="All">All Segments</option>
            <option value="Male">Male / Men</option>
            <option value="Female">Female / Women</option>
            <option value="Boys">Boys (Kids)</option>
            <option value="Girls">Girls (Kids)</option>
          </select>
        </div>

        {/* Size Filter Box Segment Grid */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Filter by Size</label>
          <div className="flex flex-wrap gap-1.5">
            {['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10'].map(sz => (
              <button 
                key={sz} onClick={() => setSizeFilter(sz)} 
                className={`text-xs px-2.5 py-1.5 font-bold rounded-lg transition border ${
                  sizeFilter === sz ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CATALOG MATRIX + DISCOVERY HEADER */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Real-time Dynamic Input Tracking Engine */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input 
            type="text" placeholder="Search tech components, home decor, fashion clothes, shoes..." 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm font-medium placeholder:text-gray-400 text-sm" 
          />
        </div>

        {/* Main Category Dynamic Ribbon Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Electronics', 'Fashion', 'Shoes', 'Home Decor'].map((cat) => (
            <button 
              key={cat} onClick={() => setCategory(cat)} 
              className={`px-4 py-1.5 rounded-full font-bold text-xs shadow-sm border whitespace-nowrap transition ${
                category === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Products Rendering Layout Interface */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => {
              const productIdToken = product._id || product.id;
              
              const currentSelections = selectedVariants[productIdToken] || {
                color: product.colors?.[0] || 'N/A',
                size: product.sizes?.[0] || 'Standard'
              };

              return (
                <div key={productIdToken} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition">
                  
                  {/* CLICK FRAMEWORK: Opens the Premium Product Detail View */}
                  <div className="cursor-pointer" onClick={() => onProductClick && onProductClick(product)}>
                    <div className="h-44 bg-gray-50 overflow-hidden relative">
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      
                      {product.discount > 0 ? (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                          🔥 {product.discount}% OFF
                        </span>
                      ) : (
                        <span className="absolute top-3 left-3 bg-gray-600/90 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
                          Hub Verified
                        </span>
                      )}
                      
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-[11px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">★ {product.rating || '5.0'}</span>
                    </div>

                    <div className="px-4 pt-4">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{product.category}</span>
                      <h4 className="font-bold text-gray-800 text-sm mt-0.5 line-clamp-2 h-10 leading-tight">{product.name}</h4>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4 pt-0">
                    {/* INTERACTIVE VARIANT DISPLAY */}
                    <div className="space-y-2 border-t pt-3 border-gray-50">
                      {product.colors && product.colors.length > 0 && product.colors[0] !== 'N/A' && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Color:</span>
                          <div className="flex gap-1">
                            {product.colors.map(col => (
                              <button 
                                key={col} type="button" onClick={() => handleVariantSelect(productIdToken, 'color', col)} 
                                className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition ${
                                  currentSelections.color === col ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {col}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'Standard' && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Size:</span>
                          <div className="flex gap-1 overflow-x-auto scrollbar-none">
                            {product.sizes.map(sz => (
                              <button 
                                key={sz} type="button" onClick={() => handleVariantSelect(productIdToken, 'size', sz)} 
                                className={`text-[10px] min-w-[24px] h-6 px-1.5 flex items-center justify-center font-extrabold rounded-md border transition ${
                                  currentSelections.size === sz ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200'
                                }`}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price structure and operational dispatch handlers */}
                    <div className="border-t pt-3 border-gray-50">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-extrabold text-gray-900">
                          ₹{Number(product.price || 0).toLocaleString('en-IN')}
                        </span>
                        {product.discount > 0 && product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => onAddToCart({ ...product, id: productIdToken, selectedColor: currentSelections.color, selectedSize: currentSelections.size })} 
                          className="bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 font-bold py-2 rounded-xl text-xs transition border border-gray-100"
                        >
                          <i className="fa-solid fa-cart-plus mr-1"></i> Add to Cart
                        </button>
                        <button 
                          onClick={() => onBuyNow({ ...product, id: productIdToken, selectedColor: currentSelections.color, selectedSize: currentSelections.size })} 
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-sm uppercase tracking-wider"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
              <i className="fa-solid fa-store-slash text-4xl text-gray-300 mb-2 animate-pulse"></i>
              <p className="text-gray-500 text-sm font-medium">No active products found inside database stock.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}