import React, { useState } from 'react';

export default function ProductDetailScreen({ product, onAddToCart, onBuyNow, onBack, darkMode }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'N/A');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Standard');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

  // Reviews state - localStorage se load karo
  const reviewKey = `reviews_${product._id || product.id}`;
  const [reviews, setReviews] = useState(() => JSON.parse(localStorage.getItem(reviewKey) || '[]'));
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleSubmitReview = () => {
    if (!userRating) return alert('⭐ Please select a star rating!');
    if (!reviewerName.trim()) return alert('👤 Please enter your name!');
    if (!reviewText.trim()) return alert('💬 Please write a review!');

    const newReview = {
      id: Date.now(),
      name: reviewerName.trim(),
      rating: userRating,
      text: reviewText.trim(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(reviewKey, JSON.stringify(updatedReviews));
    setUserRating(0);
    setReviewText('');
    setReviewerName('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating || '4.8';

  const dm = darkMode;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <button onClick={onBack} className={`mb-6 flex items-center gap-1.5 text-xs font-bold transition uppercase tracking-wider ${dm ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'}`}>
        <i className="fa-solid fa-arrow-left-long"></i> Back to Products Catalog
      </button>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 sm:p-8 border rounded-3xl shadow-sm ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

        {/* LEFT: IMAGE */}
        <div className="space-y-4">
          <div
            className="h-96 w-full border border-gray-100 rounded-2xl overflow-hidden bg-gray-50 relative cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomPos({ ...zoomPos, show: false })}
          >
            <img src={product.img} alt={product.name} className={`w-full h-full object-cover transition-transform duration-100 ${zoomPos.show ? 'opacity-0' : 'opacity-100'}`} />
            {zoomPos.show && (
              <div
                className="absolute inset-0 bg-no-repeat rounded-2xl shadow-inner border border-gray-100"
                style={{ backgroundImage: `url(${product.img})`, backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`, backgroundSize: '200%' }}
              />
            )}
            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
              🔍 Hover image to zoom details
            </span>
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{product.category} Hub</span>
              <h1 className={`text-xl sm:text-2xl font-black leading-tight mt-1 ${dm ? 'text-white' : 'text-gray-800'}`}>{product.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-sm font-bold">
                <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">★ {avgRating}</span>
                <span className={`text-xs ${dm ? 'text-gray-400' : 'text-gray-500'}`}>({reviews.length} reviews) • Verified JadounHub Quality</span>
              </div>
            </div>

            <div className={`border p-4 rounded-2xl flex items-baseline gap-3 ${dm ? 'bg-gray-700 border-gray-600' : 'bg-gray-50/70 border-gray-100'}`}>
              <span className={`text-3xl font-black ${dm ? 'text-white' : 'text-gray-900'}`}>₹{product.price?.toLocaleString('en-IN')}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-sm text-gray-400 line-through font-medium">MRP ₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                  <span className="text-xs bg-red-100 text-red-600 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">🔥 {product.discount}% OFF</span>
                </>
              )}
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <h4 className={`text-xs font-black uppercase tracking-wider ${dm ? 'text-gray-400' : 'text-gray-400'}`}>Select Color:</h4>
                <div className="flex gap-2">
                  {product.colors.map(col => (
                    <button key={col} onClick={() => setSelectedColor(col)} className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition ${selectedColor === col ? 'bg-indigo-600 text-white border-indigo-600' : dm ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-600 border-gray-200'}`}>{col}</button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <h4 className={`text-xs font-black uppercase tracking-wider ${dm ? 'text-gray-400' : 'text-gray-400'}`}>Select Size:</h4>
                <div className="flex gap-2">
                  {product.sizes.map(sz => (
                    <button key={sz} onClick={() => setSelectedSize(sz)} className={`text-xs min-w-[36px] h-9 px-2 flex items-center justify-center font-extrabold rounded-xl border transition ${selectedSize === sz ? 'bg-indigo-600 text-white border-indigo-600' : dm ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-500 border-gray-200'}`}>{sz}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`border-t pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 ${dm ? 'border-gray-700' : ''}`}>
            <button onClick={() => onAddToCart({ ...product, selectedColor, selectedSize })} className={`font-extrabold py-3 rounded-2xl text-xs sm:text-sm transition border flex items-center justify-center gap-2 uppercase tracking-wider ${dm ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' : 'bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-700 border-gray-200'}`}>
              <i className="fa-solid fa-cart-plus text-base"></i> Add Item to Bag
            </button>
            <button onClick={() => onBuyNow({ ...product, selectedColor, selectedSize })} className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-2xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 uppercase tracking-wider">
              Express Checkout <i className="fa-solid fa-bolt text-amber-300"></i>
            </button>
          </div>
        </div>
      </div>

      {/* ⭐ REVIEWS SECTION */}
      <div className={`mt-8 p-6 border rounded-3xl shadow-sm ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h2 className={`text-base font-black uppercase tracking-widest border-l-4 border-indigo-600 pl-3 mb-6 ${dm ? 'text-white' : 'text-gray-800'}`}>
          ⭐ Customer Reviews & Ratings
        </h2>

        {/* Rating Summary */}
        <div className={`flex items-center gap-6 p-4 rounded-2xl border mb-6 ${dm ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50/50 border-indigo-100'}`}>
          <div className="text-center">
            <div className="text-4xl font-black text-indigo-600">{avgRating}</div>
            <div className="text-yellow-400 text-lg">{'★'.repeat(Math.round(Number(avgRating)))}</div>
            <div className={`text-[10px] font-bold ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{reviews.length} Reviews</div>
          </div>
          <div className="flex-1 space-y-1">
            {[5,4,3,2,1].map(star => {
              const count = reviews.filter(r => r.rating === star).length;
              const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold w-4 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{star}★</span>
                  <div className={`flex-1 h-1.5 rounded-full ${dm ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    <div className="h-1.5 rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className={`text-[10px] w-6 font-bold ${dm ? 'text-gray-400' : 'text-gray-400'}`}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write Review Form */}
        <div className={`p-4 rounded-2xl border mb-6 ${dm ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
          <h3 className={`text-xs font-black uppercase tracking-wider mb-3 ${dm ? 'text-white' : 'text-gray-700'}`}>✍️ Write a Review</h3>

          {/* Star Selector */}
          <div className="flex items-center gap-1 mb-3">
            <span className={`text-[10px] font-bold mr-1 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Your Rating:</span>
            {[1,2,3,4,5].map(star => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setUserRating(star)}
                className={`text-2xl transition-transform hover:scale-110 ${star <= (hoverRating || userRating) ? 'text-amber-400' : dm ? 'text-gray-600' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
            {userRating > 0 && <span className="text-xs text-indigo-600 font-bold ml-1">{['','Poor','Fair','Good','Very Good','Excellent'][userRating]}</span>}
          </div>

          <input
            type="text"
            placeholder="Your name..."
            value={reviewerName}
            onChange={e => setReviewerName(e.target.value)}
            className={`w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium mb-2 ${dm ? 'bg-gray-600 border-gray-500 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-800'}`}
          />
          <textarea
            placeholder="Share your experience with this product..."
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            rows={3}
            className={`w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium resize-none mb-3 ${dm ? 'bg-gray-600 border-gray-500 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-800'}`}
          />

          <button
            onClick={handleSubmitReview}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            Submit Review ⭐
          </button>

          {reviewSubmitted && (
            <p className="text-green-600 text-xs font-bold mt-2">✅ Review submitted! Thank you!</p>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className={`text-center py-8 rounded-2xl border border-dashed ${dm ? 'border-gray-600 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
              <p className="text-sm font-bold">No reviews yet — be the first to review! ⭐</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review.id} className={`p-4 rounded-2xl border ${dm ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className={`text-xs font-black ${dm ? 'text-white' : 'text-gray-800'}`}>{review.name}</span>
                    <div className="text-amber-400 text-sm">{'★'.repeat(review.rating)}<span className={`text-xs ml-1 ${dm ? 'text-gray-500' : 'text-gray-300'}`}>{'★'.repeat(5 - review.rating)}</span></div>
                  </div>
                  <span className={`text-[10px] font-medium ${dm ? 'text-gray-500' : 'text-gray-400'}`}>{review.date}</span>
                </div>
                <p className={`text-xs font-medium leading-relaxed ${dm ? 'text-gray-300' : 'text-gray-600'}`}>{review.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}