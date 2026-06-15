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

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('shop'); 
  const [dbProducts, setDbProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const ADMIN_CREDENTIALS = {
    email: 'admin@jadounhub.com',
    password: 'adminrootsecure'
  };

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'https://jadounhub-server.onrender.com'}/api/products`);
      const data = await res.json();
      if (data.success) {
        setDbProducts(data.products);
      }
    } catch (err) {
      console.error("Database fetch error:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [currentScreen]);

  const handleAdminLoginAttempt = () => {
    const email = prompt("🔒 Enter Admin Official Email Address:");
    const password = prompt("🔑 Enter Admin Master Secret Password:");

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setCurrentUser(null);
      setIsAdminLoggedIn(true);
      setCurrentScreen('admin');
      alert("🎉 Access Granted! Welcome Admin Control Center.");
    } else {
      alert("❌ Security Alert: Invalid Admin Credentials!");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    setCart([]);
    setCheckoutItem(null);
    setCurrentScreen('shop');
    alert("🔒 Session ended securely.");
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50/50 text-gray-900'}`}>
      <Navbar 
        user={currentUser} 
        cartCount={cart.length}
        isAdmin={isAdminLoggedIn} 
        onAuthClick={() => setCurrentScreen('auth')}
        onAdminPortalClick={handleAdminLoginAttempt}
        onBrandClick={() => setCurrentScreen('shop')}
        onOrdersClick={() => {
          if (!currentUser) {
            alert("👋 Please Sign In / Register to view your order track timeline!");
            setCurrentScreen('auth');
          } else {
            setCurrentScreen('orders');
          }
        }}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
      />

      <main className="flex-grow">
        {currentScreen === 'shop' && (
          <HomeScreen 
            dbProducts={dbProducts} 
            darkMode={darkMode}
            onProductClick={(prod) => { setSelectedProduct(prod); setCurrentScreen('detail'); }}
            onAddToCart={(prod) => {
              if(!currentUser) { alert("👋 Please Sign In / Register first!"); setCurrentScreen('auth'); return; }
              setCart([...cart, prod]);
              alert(`🛒 Added ${prod.name} to Bag!`);
            }}
            onBuyNow={(prod) => {
              if(!currentUser) { alert("👋 Please Sign In / Register first!"); setCurrentScreen('auth'); return; }
              setCheckoutItem(prod);
              setCurrentScreen('checkout');
            }}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen darkMode={darkMode} onAuthSuccess={(user) => { 
            setIsAdminLoggedIn(false); 
            setCurrentUser(user); 
            setCurrentScreen('shop'); 
          }} />
        )}

        {currentScreen === 'admin' && isAdminLoggedIn && (
          <AdminScreen darkMode={darkMode} onBackToShop={() => { setIsAdminLoggedIn(false); setCurrentScreen('shop'); }} />
        )}

        {currentScreen === 'detail' && selectedProduct && (
          <ProductDetailScreen 
            product={selectedProduct}
            darkMode={darkMode}
            onBack={() => setCurrentScreen('shop')}
            onAddToCart={(prod) => { setCart([...cart, prod]); alert("🛒 Item added to bag!"); }}
            onBuyNow={(prod) => { setCheckoutItem(prod); setCurrentScreen('checkout'); }}
          />
        )}

        {currentScreen === 'checkout' && (
          <CheckoutScreen darkMode={darkMode} item={checkoutItem} onProceedToPayment={() => setCurrentScreen('payment')} />
        )}

        {currentScreen === 'payment' && (
          <PaymentScreen 
            darkMode={darkMode}
            item={checkoutItem} 
            cart={cart}
            onPaymentSuccess={() => { setCart([]); setCheckoutItem(null); setCurrentScreen('success'); }} 
          />
        )}

        {currentScreen === 'orders' && (
          <OrdersDashboard darkMode={darkMode} onBackToShop={() => setCurrentScreen('shop')} />
        )}

        {currentScreen === 'success' && (
          <SuccessScreen darkMode={darkMode} onReturnHome={() => setCurrentScreen('shop')} />
        )}
      </main>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/919389720893?text=Hi! I'm interested in ordering from JadounHub 🛍️`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        title="Order on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}