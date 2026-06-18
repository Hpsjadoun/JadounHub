import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import AdminScreen from './screens/AdminScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import PaymentScreen from './screens/PaymentScreen';
import SuccessScreen from './screens/SuccessScreen';
import OrdersDashboard from './screens/OrdersDashboard';
import translations from './i18n';
import ChatWidget from './components/ChatWidget';
import ReferralWidget from './components/ReferralWidget';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('shop');
  const [dbProducts, setDbProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [cartOpen, setCartOpen] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  const t = translations[lang];

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const updated = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const ADMIN_CREDENTIALS = { email: 'admin@jadounhub.com', password: 'adminrootsecure' };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'https://jadounhub-server.onrender.com'}/api/products`);
      const data = await res.json();
      if (data.success) setDbProducts(data.products);
    } catch (err) { console.error("DB fetch error:", err); }
  };

  useEffect(() => { fetchInventory(); }, [currentScreen]);

  const handleAdminLoginAttempt = () => {
    const email = prompt("🔒 Enter Admin Email:");
    const password = prompt("🔑 Enter Admin Password:");
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setCurrentUser(null); setIsAdminLoggedIn(true); setCurrentScreen('admin');
      alert("🎉 Welcome Admin!");
    } else { alert("❌ Invalid Credentials!"); }
  };

  const handleLogout = () => {
    setCurrentUser(null); setIsAdminLoggedIn(false);
    setCart([]); setCheckoutItem(null); setCurrentScreen('shop');
  };

  const removeFromCart = (index) => setCart(prev => prev.filter((_, i) => i !== index));

  const dm = darkMode;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${dm ? 'bg-gray-900 text-white' : 'bg-gray-50/50 text-gray-900'}`}>
      <Navbar
        user={currentUser} cartCount={cart.length} wishlistCount={wishlist.length}
        isAdmin={isAdminLoggedIn} t={t} lang={lang} onToggleLang={toggleLang}
        onAuthClick={() => setCurrentScreen('auth')}
        onAdminPortalClick={handleAdminLoginAttempt}
        onBrandClick={() => setCurrentScreen('shop')}
        onCartClick={() => setCartOpen(true)}
        onOrdersClick={() => { if (!currentUser) { alert("👋 Please Sign In first!"); setCurrentScreen('auth'); return; } setCurrentScreen('orders'); }}
        onLogout={handleLogout}
        darkMode={dm} onToggleDark={() => setDarkMode(!darkMode)}
      />

      <main className="flex-grow">
        {currentScreen === 'shop' && <HomeScreen dbProducts={dbProducts} darkMode={dm} wishlist={wishlist} t={t} onToggleWishlist={toggleWishlist} onProductClick={(prod) => { setSelectedProduct(prod); setCurrentScreen('detail'); }} onAddToCart={(prod) => { if (!currentUser) { alert("👋 Please Sign In first!"); setCurrentScreen('auth'); return; } setCart([...cart, prod]); alert(`🛒 ${t.addToCart}!`); }} onBuyNow={(prod) => { if (!currentUser) { alert("👋 Please Sign In first!"); setCurrentScreen('auth'); return; } setCheckoutItem(prod); setCurrentScreen('checkout'); }} />}
        {currentScreen === 'auth' && <AuthScreen darkMode={dm} onAuthSuccess={(user) => { setIsAdminLoggedIn(false); setCurrentUser(user); setCurrentScreen('shop'); }} />}
        {currentScreen === 'admin' && isAdminLoggedIn && <AdminScreen darkMode={dm} onBackToShop={() => { setIsAdminLoggedIn(false); setCurrentScreen('shop'); }} />}
        {currentScreen === 'detail' && selectedProduct && <ProductDetailScreen product={selectedProduct} darkMode={dm} t={t} onBack={() => setCurrentScreen('shop')} onAddToCart={(prod) => { setCart([...cart, prod]); alert("🛒 Item added to bag!"); }} onBuyNow={(prod) => { setCheckoutItem(prod); setCurrentScreen('checkout'); }} />}
        {currentScreen === 'checkout' && <CheckoutScreen darkMode={dm} t={t} item={checkoutItem} onProceedToPayment={() => setCurrentScreen('payment')} />}
        {currentScreen === 'payment' && <PaymentScreen darkMode={dm} t={t} item={checkoutItem} cart={cart} onPaymentSuccess={() => { setCart([]); setCheckoutItem(null); setCurrentScreen('success'); }} />}
        {currentScreen === 'orders' && <OrdersDashboard darkMode={dm} t={t} onBackToShop={() => setCurrentScreen('shop')} />}
          {currentScreen === 'orders' && <ReferralWidget darkMode={dm} user={currentUser} />}
        {currentScreen === 'success' && <SuccessScreen darkMode={dm} onReturnHome={() => setCurrentScreen('shop')} />}
      </main>

      {/* CART SIDEBAR */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className={`relative w-full max-w-sm h-full flex flex-col shadow-2xl animate-slideIn ${dm ? 'bg-gray-900' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-5 border-b ${dm ? 'border-gray-700' : 'border-gray-100'}`}>
              <h2 className={`font-black text-base uppercase tracking-wider ${dm ? 'text-white' : 'text-gray-800'}`}>🛒 {t.myBag} ({cart.length})</h2>
              <button onClick={() => setCartOpen(false)} className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-lg ${dm ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <span className="text-5xl mb-4">🛍️</span>
                  <p className={`font-bold text-sm ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{t.bagEmpty}</p>
                  <button onClick={() => setCartOpen(false)} className="mt-4 bg-indigo-600 text-white text-xs font-black px-5 py-2 rounded-xl">{t.continueShopping}</button>
                </div>
              ) : cart.map((item, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 border rounded-2xl ${dm ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                  <img src={item.img} alt={item.name} className="w-14 h-14 object-cover rounded-xl border bg-white" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${dm ? 'text-white' : 'text-gray-800'}`}>{item.name}</p>
                    {item.selectedColor && <p className={`text-[10px] ${dm ? 'text-gray-400' : 'text-gray-400'}`}>{t.color}: {item.selectedColor}</p>}
                    {item.selectedSize && item.selectedSize !== 'Standard' && <p className={`text-[10px] ${dm ? 'text-gray-400' : 'text-gray-400'}`}>{t.size}: {item.selectedSize}</p>}
                    <p className="text-xs font-black text-indigo-600 mt-0.5">₹{Number(item.price).toLocaleString('en-IN')}</p>
                  </div>
                  <button onClick={() => removeFromCart(idx)} className="text-red-400 hover:text-red-600 font-black text-lg">✕</button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className={`p-4 border-t space-y-3 ${dm ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className={`flex justify-between items-center p-3 rounded-xl ${dm ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <span className={`text-xs font-bold ${dm ? 'text-gray-300' : 'text-gray-600'}`}>{t.total}:</span>
                  <span className="text-base font-black text-indigo-600">₹{cart.reduce((sum, item) => sum + Number(item.price), 0).toLocaleString('en-IN')}</span>
                </div>
                <button onClick={() => { setCartOpen(false); if (!currentUser) { alert("👋 Please Sign In first!"); setCurrentScreen('auth'); return; } setCheckoutItem(cart[0]); setCurrentScreen('checkout'); }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-md">
                  {t.proceedCheckout} 🛍️
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp */}
      <a href="https://wa.me/919389720893?text=Hi! I'm interested in ordering from JadounHub 🛍️" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}