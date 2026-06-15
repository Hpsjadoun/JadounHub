import React, { useState } from 'react';

export default function HomeScreen({ onBuyNow, onAddToCart, dbProducts = [], onProductClick, darkMode, wishlist = [], onToggleWishlist }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [sizeFilter, setSizeFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [showWishlist, setShowWishlist] = useState(false);

  const handleVariantSelect = (productId, type, value) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: { ...prev[productId], [type]: value }
    }));
  };

  const filteredProducts = (showWishlist ? dbProducts.filter(p => wishlist.includes(p._id || p.id)) : dbProducts).filter(prod => {
    const name = prod.name || '';
    const cat = prod.category || '';
    const price = Number(prod.price || 0);
    const gender = prod.gender || 'All';
    const sizes = prod.sizes || ['Standard'];

    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || cat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'All' || cat === category;
    const matchesGender = genderFilter === 'All' || gender === 'All' || gender === genderFilter;
    const matchesPrice = price <= maxPrice;
    const matchesSize = sizeFilter === 'All' || sizes.includes(sizeFilter) || sizes.includes('Standard');

    return matchesSearch && matchesCategory && matchesGender && matchesPrice && matchesSize;
  });

  const dm = darkMode;

  return (
    <div className={`max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fadeIn`}>

      {/* SIDEBAR FILTERS */}
      <div className={`p-5 rounded-2xl border shadow-sm h-fit space-y-6 ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center justify-between border-b pb-2 border-gray-200">
          <h3 className={`font-bold text-sm sm:text-base ${dm ? 'text-white' : 'text-gray-800'}`}>
            <i className="fa-solid fa-sliders text-indigo-600 mr-1"></i> Advanced Filters
          </h3>
          <button
            onClick={() => { setCategory('All'); setGenderFilter('All'); setSizeFilter('All'); setMaxPrice(15000); setSearchQuery(''); setShowWishlist(false); }}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            Clear All
          </button>
        </div>

        {/* Wishlist Toggle */}
        <button
          onClick={() => setShowWishlist(!showWishlist)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border font-bold text-xs transition ${
            showWishlist
              ? 'bg-pink-50 border-pink-300 text-pink-600'
              : dm ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-pink-400' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-pink-300'
          }`}
        >
          <span>❤️ My Wishlist</span>
          <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full text-[10px] font-black">{wishlist.length}</span>
        </button>

        {/* Price Slider */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
            Max Price: ₹{maxPrice.toLocaleString('en-IN')}
          </label>
          <input
            type="range" min="500" max="15000" step="500" value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Gender Filter */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Segment / Gender</label>
          <select
            value={genderFilter} onChange={e => setGenderFilter(e.target.value)}
            className={`w-full text-sm p-2 border rounded-xl outline-none font-medium ${dm ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
          >
            <option value="All">All Segments</option>
            <option value="Male">Male / Men</option>
            <option value="Female">Female / Women</option>
            <option value="Boys">Boys (Kids)</option>
            <option value="Girls">Girls (Kids)</option>
          </select>
        </div>

        {/* Size Filter */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Filter by Size</label>
          <div className="flex flex-wrap gap-1.5">
            {['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10'].map(sz => (
              <button
                key={sz} onClick={() => setSizeFilter(sz)}
                className={`text-xs px-2.5 py-1.5 font-bold rounded-lg transition border ${
                  sizeFilter === sz ? 'bg-indigo-600 text-white border-indigo-600' : dm ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CATALOG */}
      <div className="lg:col-span-3 space-y-6">

        {/* Search Bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            type="text" placeholder="Search tech components, home decor, fashion clothes, shoes..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium placeholder:text-gray-400 text-sm ${dm ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'}`}
          />
        </div>

        {/* Category Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Electronics', 'Fashion', 'Shoes', 'Home Decor'].map((cat) => (
            <button
              key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-bold text-xs shadow-sm border whitespace-nowrap transition ${
                category === cat ? 'bg-indigo-600 text-white border-indigo-600' : dm ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Wishlist Header */}
        {showWishlist && (
          <div className="flex items-center gap-2">
            <span className="text-lg">❤️</span>
            <h2 className={`font-black text-base ${dm ? 'text-white' : 'text-gray-800'}`}>My Wishlist ({wishlist.length} items)</h2>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => {
              const productIdToken = product._id || product.id;
              const isWishlisted = wishlist.includes(productIdToken);
              const currentSelections = selectedVariants[productIdToken] || {
                color: product.colors?.[0] || 'N/A',
                size: product.sizes?.[0] || 'Standard'
              };

              return (
                <div key={productIdToken} className={`border rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

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

                      {/* ❤️ Wishlist Heart Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleWishlist(productIdToken); }}
                        className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
                          isWishlisted ? 'bg-pink-500 text-white' : 'bg-white/90 text-gray-400 hover:text-pink-500'
                        }`}
                        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        {isWishlisted ? '❤️' : '🤍'}
                      </button>
                    </div>

                    <div className="px-4 pt-4">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{product.category}</span>
                      <h4 className={`font-bold text-sm mt-0.5 line-clamp-2 h-10 leading-tight ${dm ? 'text-white' : 'text-gray-800'}`}>{product.name}</h4>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4 pt-0">
                    <div className="space-y-2 border-t pt-3 border-gray-100">
                      {product.colors && product.colors.length > 0 && product.colors[0] !== 'N/A' && (
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase ${dm ? 'text-gray-400' : 'text-gray-400'}`}>Color:</span>
                          <div className="flex gap-1">
                            {product.colors.map(col => (
                              <button
                                key={col} type="button" onClick={() => handleVariantSelect(productIdToken, 'color', col)}
                                className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition ${currentSelections.color === col ? 'bg-indigo-600 text-white' : dm ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                              >
                                {col}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'Standard' && (
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase ${dm ? 'text-gray-400' : 'text-gray-400'}`}>Size:</span>
                          <div className="flex gap-1 overflow-x-auto scrollbar-none">
                            {product.sizes.map(sz => (
                              <button
                                key={sz} type="button" onClick={() => handleVariantSelect(productIdToken, 'size', sz)}
                                className={`text-[10px] min-w-[24px] h-6 px-1.5 flex items-center justify-center font-extrabold rounded-md border transition ${
                                  currentSelections.size === sz ? 'bg-indigo-600 text-white border-indigo-600' : dm ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-500 border-gray-200'
                                }`}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-3 border-gray-100">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className={`text-lg font-extrabold ${dm ? 'text-white' : 'text-gray-900'}`}>
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
                          className={`font-bold py-2 rounded-xl text-xs transition border ${dm ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' : 'bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 border-gray-100'}`}
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
            <div className={`col-span-full text-center py-16 rounded-2xl border border-dashed ${dm ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
              <i className="fa-solid fa-store-slash text-4xl text-gray-300 mb-2 animate-pulse"></i>
              <p className="text-gray-500 text-sm font-medium">
                {showWishlist ? '💔 No items in wishlist yet!' : 'No active products found inside database stock.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}