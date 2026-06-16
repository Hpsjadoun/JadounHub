import React, { useState, useEffect, useRef } from 'react';

// Flash Sale Timer Component
function FlashSaleTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) return setTimeLeft({ h:'00', m:'00', s:'00' });
      setTimeLeft({ h: String(Math.floor(diff/3600000)).padStart(2,'0'), m: String(Math.floor((diff%3600000)/60000)).padStart(2,'0'), s: String(Math.floor((diff%60000)/1000)).padStart(2,'0') });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [endTime]);
  return (
    <div className="flex items-center gap-1">
      {[timeLeft.h, timeLeft.m, timeLeft.s].map((val, i) => (
        <React.Fragment key={i}>
          <span className="bg-white text-red-600 font-black text-sm px-2 py-1 rounded-lg min-w-[32px] text-center">{val}</span>
          {i < 2 && <span className="text-white font-black text-sm">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function HomeScreen({ onBuyNow, onAddToCart, dbProducts = [], onProductClick, darkMode, wishlist = [], onToggleWishlist }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [sizeFilter, setSizeFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [showWishlist, setShowWishlist] = useState(false);
  const [showFlashOnly, setShowFlashOnly] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const searchRef = useRef(null);
  const flashSaleEnd = useState(() => Date.now() + 6 * 60 * 60 * 1000)[0];
  const flashProducts = dbProducts.filter(p => Number(p.discount||0) >= 10);

  // Smart Search - generate suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 1) { setSuggestions([]); setShowSuggestions(false); return; }
    const q = searchQuery.toLowerCase();
    const productMatches = dbProducts.filter(p => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)).slice(0, 5).map(p => ({ type: 'product', label: p.name, category: p.category, img: p.img, price: p.price, id: p._id || p.id }));
    const categoryMatches = [...new Set(dbProducts.map(p => p.category))].filter(c => c?.toLowerCase().includes(q)).map(c => ({ type: 'category', label: c }));
    const allSuggestions = [...categoryMatches.slice(0,2), ...productMatches];
    setSuggestions(allSuggestions);
    setShowSuggestions(allSuggestions.length > 0);
    setActiveSuggestion(-1);
  }, [searchQuery, dbProducts]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'category') { setCategory(suggestion.label); setSearchQuery(''); }
    else { setSearchQuery(suggestion.label); }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') { setActiveSuggestion(prev => Math.min(prev + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { setActiveSuggestion(prev => Math.max(prev - 1, -1)); }
    else if (e.key === 'Enter' && activeSuggestion >= 0) { handleSuggestionClick(suggestions[activeSuggestion]); }
    else if (e.key === 'Escape') { setShowSuggestions(false); }
  };

  const handleVariantSelect = (productId, type, value) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: { ...prev[productId], [type]: value } }));
  };

  const baseList = showFlashOnly ? flashProducts : dbProducts;
  const filteredProducts = (showWishlist ? baseList.filter(p => wishlist.includes(p._id||p.id)) : baseList).filter(prod => {
    const matchesSearch = (prod.name||'').toLowerCase().includes(searchQuery.toLowerCase()) || (prod.category||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'All' || prod.category === category;
    const matchesGender = genderFilter === 'All' || (prod.gender||'All') === 'All' || prod.gender === genderFilter;
    const matchesPrice = Number(prod.price||0) <= maxPrice;
    const matchesSize = sizeFilter === 'All' || (prod.sizes||['Standard']).includes(sizeFilter) || (prod.sizes||['Standard']).includes('Standard');
    return matchesSearch && matchesCategory && matchesGender && matchesPrice && matchesSize;
  });

  const dm = darkMode;

  return (
    <div className="w-full">

      {/* FLASH SALE BANNER */}
      {flashProducts.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-white font-black text-lg animate-pulse">⚡</span>
              <div>
                <p className="text-white font-black text-sm uppercase tracking-wider">Flash Sale Live!</p>
                <p className="text-red-100 text-[10px] font-medium">{flashProducts.length} products on sale!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-red-100 text-xs font-bold">Ends in:</span>
              <FlashSaleTimer endTime={flashSaleEnd} />
              <button onClick={() => { setShowFlashOnly(!showFlashOnly); setCategory('All'); }} className={`text-xs font-black px-3 py-1.5 rounded-xl transition ${showFlashOnly ? 'bg-white text-red-600' : 'bg-red-700 text-white hover:bg-red-800'}`}>
                {showFlashOnly ? '✕ Show All' : '🔥 View Deals'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <div className={`p-5 rounded-2xl border shadow-sm h-fit space-y-6 ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between border-b pb-2 border-gray-200">
            <h3 className={`font-bold text-sm ${dm ? 'text-white' : 'text-gray-800'}`}><i className="fa-solid fa-sliders text-indigo-600 mr-1"></i> Advanced Filters</h3>
            <button onClick={() => { setCategory('All'); setGenderFilter('All'); setSizeFilter('All'); setMaxPrice(15000); setSearchQuery(''); setShowWishlist(false); setShowFlashOnly(false); }} className="text-xs text-indigo-600 font-semibold hover:underline">Clear All</button>
          </div>
          {flashProducts.length > 0 && (
            <button onClick={() => setShowFlashOnly(!showFlashOnly)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border font-bold text-xs transition ${showFlashOnly ? 'bg-red-50 border-red-300 text-red-600' : dm ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
              <span>⚡ Flash Sale Only</span>
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-black">{flashProducts.length}</span>
            </button>
          )}
          <button onClick={() => setShowWishlist(!showWishlist)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border font-bold text-xs transition ${showWishlist ? 'bg-pink-50 border-pink-300 text-pink-600' : dm ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
            <span>❤️ My Wishlist</span>
            <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full text-[10px] font-black">{wishlist.length}</span>
          </button>
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Max Price: ₹{maxPrice.toLocaleString('en-IN')}</label>
            <input type="range" min="500" max="15000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Segment / Gender</label>
            <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className={`w-full text-sm p-2 border rounded-xl outline-none font-medium ${dm ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
              <option value="All">All Segments</option>
              <option value="Male">Male / Men</option>
              <option value="Female">Female / Women</option>
              <option value="Boys">Boys (Kids)</option>
              <option value="Girls">Girls (Kids)</option>
            </select>
          </div>
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Filter by Size</label>
            <div className="flex flex-wrap gap-1.5">
              {['All','XS','S','M','L','XL','XXL','6','7','8','9','10'].map(sz => (
                <button key={sz} onClick={() => setSizeFilter(sz)} className={`text-xs px-2.5 py-1.5 font-bold rounded-lg transition border ${sizeFilter===sz ? 'bg-indigo-600 text-white border-indigo-600' : dm ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-600 border-gray-200'}`}>{sz}</button>
              ))}
            </div>
          </div>
        </div>

        {/* CATALOG */}
        <div className="lg:col-span-3 space-y-6">

          {/* SMART SEARCH BAR */}
          <div className="relative" ref={searchRef}>
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 z-10"><i className="fa-solid fa-magnifying-glass"></i></span>
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className={`w-full pl-11 pr-10 py-3 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium text-sm ${dm ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'}`}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">✕</button>
            )}

            {/* AUTOCOMPLETE DROPDOWN */}
            {showSuggestions && suggestions.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-2 border rounded-2xl shadow-xl z-50 overflow-hidden ${dm ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-100'}`}>
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition ${activeSuggestion===i ? dm ? 'bg-gray-700' : 'bg-indigo-50' : dm ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  >
                    {s.type === 'category' ? (
                      <>
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${dm ? 'bg-gray-600' : 'bg-indigo-100'}`}>📂</span>
                        <div>
                          <p className={`text-xs font-black ${dm ? 'text-white' : 'text-gray-800'}`}>{s.label}</p>
                          <p className="text-[10px] text-indigo-500 font-bold">Category</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <img src={s.img} alt={s.label} className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border bg-gray-50" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold truncate ${dm ? 'text-white' : 'text-gray-800'}`}>
                            {s.label.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, j) =>
                              part.toLowerCase() === searchQuery.toLowerCase()
                                ? <mark key={j} className="bg-yellow-200 text-gray-800 rounded px-0.5">{part}</mark>
                                : part
                            )}
                          </p>
                          <p className="text-[10px] text-indigo-500 font-bold">₹{Number(s.price).toLocaleString('en-IN')} • {s.category}</p>
                        </div>
                        <i className="fa-solid fa-arrow-up-left text-gray-300 text-xs"></i>
                      </>
                    )}
                  </button>
                ))}
                <div className={`px-4 py-2 border-t text-[10px] font-bold text-gray-400 ${dm ? 'border-gray-700' : 'border-gray-100'}`}>
                  ↑↓ Navigate • Enter to select • Esc to close
                </div>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['All','Electronics','Fashion','Shoes','Home Decor'].map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1.5 rounded-full font-bold text-xs border whitespace-nowrap transition ${category===cat ? 'bg-indigo-600 text-white border-indigo-600' : dm ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-600 border-gray-100'}`}>{cat}</button>
            ))}
          </div>

          {showFlashOnly && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
              <span className="text-lg animate-pulse">⚡</span>
              <h2 className="font-black text-sm text-red-600">Flash Sale — {flashProducts.length} Hot Deals!</h2>
              <FlashSaleTimer endTime={flashSaleEnd} />
            </div>
          )}
          {showWishlist && (
            <div className="flex items-center gap-2">
              <span className="text-lg">❤️</span>
              <h2 className={`font-black text-base ${dm ? 'text-white' : 'text-gray-800'}`}>My Wishlist ({wishlist.length} items)</h2>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? filteredProducts.map(product => {
              const pid = product._id||product.id;
              const isWishlisted = wishlist.includes(pid);
              const isFlash = Number(product.discount||0) >= 10;
              const sel = selectedVariants[pid] || { color: product.colors?.[0]||'N/A', size: product.sizes?.[0]||'Standard' };
              return (
                <div key={pid} className={`border rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} ${isFlash&&showFlashOnly ? 'ring-2 ring-red-400 ring-offset-1' : ''}`}>
                  <div className="cursor-pointer" onClick={() => onProductClick && onProductClick(product)}>
                    <div className="h-44 bg-gray-50 overflow-hidden relative">
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      {isFlash ? (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase animate-pulse">⚡ {product.discount}% OFF</span>
                      ) : (
                        <span className="absolute top-3 left-3 bg-gray-600/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full">Hub Verified</span>
                      )}
                      <span className="absolute top-3 right-3 bg-white/90 text-gray-800 text-[11px] font-extrabold px-2 py-0.5 rounded-lg">★ {product.rating||'5.0'}</span>
                      <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(pid); }} className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 ${isWishlisted ? 'bg-pink-500 text-white' : 'bg-white/90 text-gray-400'}`}>
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
                      {product.colors && product.colors[0] !== 'N/A' && (
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase ${dm ? 'text-gray-400' : 'text-gray-400'}`}>Color:</span>
                          <div className="flex gap-1">
                            {product.colors.map(col => (
                              <button key={col} type="button" onClick={() => handleVariantSelect(pid,'color',col)} className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition ${sel.color===col ? 'bg-indigo-600 text-white' : dm ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{col}</button>
                            ))}
                          </div>
                        </div>
                      )}
                      {product.sizes && product.sizes[0] !== 'Standard' && (
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase ${dm ? 'text-gray-400' : 'text-gray-400'}`}>Size:</span>
                          <div className="flex gap-1 overflow-x-auto">
                            {product.sizes.map(sz => (
                              <button key={sz} type="button" onClick={() => handleVariantSelect(pid,'size',sz)} className={`text-[10px] min-w-[24px] h-6 px-1.5 flex items-center justify-center font-extrabold rounded-md border transition ${sel.size===sz ? 'bg-indigo-600 text-white border-indigo-600' : dm ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-500 border-gray-200'}`}>{sz}</button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="border-t pt-3 border-gray-100">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className={`text-lg font-extrabold ${dm ? 'text-white' : 'text-gray-900'}`}>₹{Number(product.price||0).toLocaleString('en-IN')}</span>
                        {product.discount > 0 && product.originalPrice && <span className="text-xs text-gray-400 line-through">₹{Number(product.originalPrice).toLocaleString('en-IN')}</span>}
                        {isFlash && <span className="text-[10px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md">FLASH</span>}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => onAddToCart({...product,id:pid,selectedColor:sel.color,selectedSize:sel.size})} className={`font-bold py-2 rounded-xl text-xs transition border ${dm ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' : 'bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 border-gray-100'}`}>
                          <i className="fa-solid fa-cart-plus mr-1"></i> Add to Cart
                        </button>
                        <button onClick={() => onBuyNow({...product,id:pid,selectedColor:sel.color,selectedSize:sel.size})} className={`text-white font-bold py-2 rounded-xl text-xs transition shadow-sm uppercase ${isFlash ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                          {isFlash ? '⚡ Buy Now' : 'Buy Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className={`col-span-full text-center py-16 rounded-2xl border border-dashed ${dm ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                <i className="fa-solid fa-magnifying-glass text-4xl text-gray-300 mb-2"></i>
                <p className="text-gray-500 text-sm font-medium">No products found for "{searchQuery}"</p>
                <button onClick={() => { setSearchQuery(''); setCategory('All'); }} className="mt-3 text-xs text-indigo-600 font-bold hover:underline">Clear search</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className={`py-16 px-6 border-t ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest border-b-2 border-indigo-600 pb-1">About JadounHub</span>
          <h2 className={`text-3xl font-black mt-4 ${dm ? 'text-white' : 'text-gray-900'}`}>India's Trusted <span className="text-indigo-600">Marketplace</span></h2>
          <p className={`text-sm font-medium leading-relaxed max-w-2xl mx-auto ${dm ? 'text-gray-300' : 'text-gray-600'}`}>JadounHub is a premium multi-category online marketplace founded with a mission to deliver high-quality products at competitive prices across India.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            {[{icon:'🚀',title:'Fast Delivery',desc:'Pan-India delivery in 3-5 business days'},{icon:'🛡️',title:'Secure Payments',desc:'UPI, COD & encrypted payment gateway'},{icon:'⭐',title:'Quality Products',desc:'Verified & quality-checked inventory'}].map((item,i) => (
              <div key={i} className={`p-5 rounded-2xl border text-center ${dm ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className={`font-black text-sm ${dm ? 'text-white' : 'text-gray-800'}`}>{item.title}</h4>
                <p className={`text-xs mt-1 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className={`py-16 px-6 border-t ${dm ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest border-b-2 border-indigo-600 pb-1">Contact Us</span>
          <h2 className={`text-3xl font-black mt-4 ${dm ? 'text-white' : 'text-gray-900'}`}>Get In <span className="text-indigo-600">Touch</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            {[{icon:'📱',title:'WhatsApp',value:'+91 9389720893',link:'https://wa.me/919389720893'},{icon:'📧',title:'Email',value:'support@jadounhub.com',link:'mailto:support@jadounhub.com'},{icon:'📍',title:'Location',value:'Uttar Pradesh, India',link:'#'}].map((item,i) => (
              <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className={`p-5 rounded-2xl border text-center transition hover:border-indigo-400 hover:shadow-md ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className={`font-black text-sm ${dm ? 'text-white' : 'text-gray-800'}`}>{item.title}</h4>
                <p className="text-xs text-indigo-600 font-bold mt-1">{item.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}