import React, { useState } from 'react';

export default function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(false); // Default view is Sign Up for new users
  const [authData, setAuthData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      // 1. DIRECT ABSOLUTE SERVER SIGN UP
      if (authData.password !== authData.confirmPassword) {
        return alert("❌ Passwords matching error! Dono password same hone chahiye.");
      }

      try {
        const response = await fetch('https://jadounhub-server.onrender.com/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: authData.name,
            email: authData.email,
            password: authData.password
          })
        });
        const data = await response.json();

        if (!data.success) {
          return alert(`⚠️ ${data.message}`);
        }

        alert("🎉 Account Created Successfully on JadounHub Server! Please Sign In now.");
        setIsLogin(true); // Automatically shift user to Sign In tab
      } catch (err) {
        alert("❌ Server registration connection failed.");
      }
    } else {
      // 2. DIRECT ABSOLUTE SERVER SIGN IN
      try {
        const response = await fetch('https://jadounhub-server.onrender.com/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: authData.email,
            password: authData.password
          })
        });
        const data = await response.json();

        if (!data.success) {
          return alert(`❌ ${data.message}`);
        }

        alert(`👋 Welcome back, ${data.user.name}!`);
        onAuthSuccess(data.user); // Pass server validated user state to main App.js
      } catch (err) {
        alert("❌ Server login validation network failed.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
      {/* Tab Selectors */}
      <div className="flex border-b mb-6 text-center text-lg font-semibold">
        <button 
          type="button"
          onClick={() => setIsLogin(false)} 
          className={`flex-1 pb-3 transition ${!isLogin ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400'}`}
        >
          Sign Up (New User)
        </button>
        <button 
          type="button"
          onClick={() => setIsLogin(true)} 
          className={`flex-1 pb-3 transition ${isLogin ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400'}`}
        >
          Sign In (Existing)
        </button>
      </div>

      <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
        {isLogin ? "Welcome Back to JadounHub" : "Create Your Account"}
      </h3>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" name="name" required value={authData.name} onChange={handleInputChange}
              placeholder="e.g. Himanshu Singh" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" name="email" required value={authData.email} onChange={handleInputChange}
            placeholder="example@domain.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" name="password" required value={authData.password} onChange={handleInputChange}
            placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input 
              type="password" name="confirmPassword" required value={authData.confirmPassword} onChange={handleInputChange}
              placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
        )}

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition mt-2 shadow-md">
          {isLogin ? "SIGN IN" : "REGISTER ACCOUNT"}
        </button>
      </form>
    </div>
  );
}