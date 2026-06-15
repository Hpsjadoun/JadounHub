import React, { useState } from 'react';

export default function Navbar({ user, cartCount, isAdmin, onAuthClick, onAdminPortalClick, onBrandClick, onOrdersClick, onLogout, darkMode, onToggleDark }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className={`border-b sticky top-0 z-50 shadow-sm px-4 py-3.5 transition-colors duration-300 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Core Identity */}
        <div onClick={() => { onBrandClick(); setIsDropdownOpen(false); }} className="text-2xl font-black text-indigo-600 cursor-pointer tracking-tighter uppercase">
          Jadoun<span className={darkMode ? 'text-white' : 'text-gray-800'}>Hub</span>
        </div>

        {/* Center links row */}
        <div className={`hidden md:flex items-center gap-6 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          <button onClick={() => { onBrandClick(); setIsDropdownOpen(false); }} className="hover:text-indigo-500 transition">Marketplace</button>
          <a href="#about" className="hover:text-indigo-500 transition">About Us</a>
          <a href="#contact" className="hover:text-indigo-500 transition">Contact Us</a>
        </div>

        {/* Right Corner Control Panel */}
        <div className="flex items-center gap-3.5 relative">

          {/* 🌙 Dark Mode Toggle */}
          <button
            onClick={onToggleDark}
            className={`text-xl p-1.5 rounded-xl transition border ${darkMode ? 'bg-gray-700 border-gray-600 text-yellow-300 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          {/* Admin Lock System Control */}
          {!isAdmin ? (
            <button 
              onClick={() => { onAdminPortalClick(); setIsDropdownOpen(false); }}
              className={`text-xs font-bold border px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${darkMode ? 'text-gray-300 border-gray-600 bg-gray-800 hover:text-red-400' : 'text-gray-500 border-gray-200 bg-gray-50/50 hover:text-red-600'}`}
            >
              <i className="fa-solid fa-lock text-[10px]"></i> Admin Login
            </button>
          ) : (
            <span className="text-xs font-black bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl uppercase tracking-wider">
              🛡️ Admin Mode Active
            </span>
          )}

          {/* Cart Icon Badge */}
          <div onClick={() => setIsDropdownOpen(false)} className={`relative cursor-pointer p-1 transition ${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}>
            <i className="fa-solid fa-bag-shopping text-xl"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </div>

          {/* Profile Dropdown */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-xs font-black bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-2 rounded-xl uppercase flex items-center gap-1.5 hover:bg-indigo-100 transition shadow-sm"
              >
                👤 {user.name} <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {isDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 border rounded-2xl shadow-xl py-2 z-50 animate-fadeIn ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                  <button onClick={() => { alert("Profile Settings Node Coming Soon!"); setIsDropdownOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}`}>
                    <i className="fa-regular fa-id-card text-sm"></i> My Profile
                  </button>
                  
                  <button onClick={() => { alert("❤️ Item pinned to Wishlist!"); setIsDropdownOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}`}>
                    <i className="fa-regular fa-heart text-sm"></i> My Favorite
                  </button>

                  <button 
                    onClick={() => { onOrdersClick(); setIsDropdownOpen(false); }} 
                    className="w-full text-left px-4 py-2.5 text-xs font-black text-indigo-600 bg-indigo-50/40 hover:bg-indigo-50 transition flex items-center gap-2 border-y border-indigo-50"
                  >
                    <i className="fa-solid fa-box text-sm"></i> Orders & Tracking
                  </button>

                  <button onClick={() => { alert("💬 JadounHub Support Chatbot is Live 24x7!"); setIsDropdownOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}`}>
                    <i className="fa-regular fa-circle-question text-sm"></i> Help & Support
                  </button>

                  <button 
                    onClick={() => { onLogout(); setIsDropdownOpen(false); }} 
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition flex items-center gap-2 border-t mt-1"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket text-sm"></i> Logout Session
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={onAuthClick} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2 rounded-xl transition shadow-md uppercase tracking-wider">
              Join / Register
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}