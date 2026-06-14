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

  const ADMIN_CREDENTIALS = {
    email: 'admin@jadounhub.com',
    password: 'adminrootsecure'
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      if (data.success) {
        setDbProducts(data.products);
      }
    } catch (err) {
      console.error("Database fetch error:", err);
    }
  };

  // Auto trigger catalog pooling on initial load and navigation switches
  useEffect(() => {
    fetchInventory();
  }, [currentScreen]);

  const handleAdminLoginAttempt = () => {
    const email = prompt("🔒 Enter Admin Official Email Address:");
    const password = prompt("🔑 Enter Admin Master Secret Password:");

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setCurrentUser(null); // Explicitly remove normal buyer context
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
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      {/* 🚀 UPGRADED NAVBAR: Now with onOrdersClick Pipeline Trigger */}
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
      />

      <main className="flex-grow">
        {currentScreen === 'shop' && (
          <HomeScreen 
            dbProducts={dbProducts} 
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
          <AuthScreen onAuthSuccess={(user) => { 
            setIsAdminLoggedIn(false); 
            setCurrentUser(user); 
            setCurrentScreen('shop'); 
          }} />
        )}

        {currentScreen === 'admin' && isAdminLoggedIn && (
          <AdminScreen onBackToShop={() => { setIsAdminLoggedIn(false); setCurrentScreen('shop'); }} />
        )}

        {currentScreen === 'detail' && selectedProduct && (
          <ProductDetailScreen 
            product={selectedProduct} 
            onBack={() => setCurrentScreen('shop')}
            onAddToCart={(prod) => { setCart([...cart, prod]); alert("🛒 Item added to bag!"); }}
            onBuyNow={(prod) => { setCheckoutItem(prod); setCurrentScreen('checkout'); }}
          />
        )}

        {currentScreen === 'checkout' && (
          <CheckoutScreen item={checkoutItem} onProceedToPayment={() => setCurrentScreen('payment')} />
        )}

        {currentScreen === 'payment' && (
          <PaymentScreen 
            item={checkoutItem} 
            cart={cart}
            onPaymentSuccess={() => { setCart([]); setCheckoutItem(null); setCurrentScreen('success'); }} 
          />
        )}

        {currentScreen === 'orders' && (
          <OrdersDashboard onBackToShop={() => setCurrentScreen('shop')} />
        )}

        {currentScreen === 'success' && (
          <SuccessScreen onReturnHome={() => setCurrentScreen('shop')} />
        )}
      </main>
    </div>
  );
}