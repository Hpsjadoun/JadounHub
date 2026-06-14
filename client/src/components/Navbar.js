import React, { useState } from 'react';

export default function Navbar({ user, cartCount, isAdmin, onAuthClick, onAdminPortalClick, onBrandClick, onOrdersClick, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm px-4 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Core Identity */}
        <div onClick={() => { onBrandClick(); setIsDropdownOpen(false); }} className="text-2xl font-black text-indigo-600 cursor-pointer tracking-tighter uppercase">
          Jadoun<span className="text-gray-800">Hub</span>
        </div>

        {/* Center links row */}
        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-500">
          <button onClick={() => { onBrandClick(); setIsDropdownOpen(false); }} className="hover:text-indigo-600 transition">Marketplace</button>
          <a href="#about" className="hover:text-indigo-600 transition">About Us</a>
          <a href="#contact" className="hover:text-indigo-600 transition">Contact Us</a>
        </div>

        {/* Right Corner Control Panel */}
        <div className="flex items-center gap-3.5 relative">
          
          {/* Admin Lock System Control */}
          {!isAdmin ? (
            <button 
              onClick={() => { onAdminPortalClick(); setIsDropdownOpen(false); }}
              className="text-xs font-bold text-gray-500 hover:text-red-600 border border-gray-200 px-3 py-1.5 rounded-xl bg-gray-50/50 transition flex items-center gap-1"
            >
              <i className="fa-solid fa-lock text-[10px]"></i> Admin Login
            </button>
          ) : (
            <span className="text-xs font-black bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl uppercase tracking-wider">
              🛡️ Admin Mode Active
            </span>
          )}

          {/* Cart Icon Badge Pipeline */}
          <div onClick={() => setIsDropdownOpen(false)} className="relative cursor-pointer p-1 text-gray-600 hover:text-indigo-600 transition">
            <i className="fa-solid fa-bag-shopping text-xl"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </div>

          {/* DYNAMIC DROP-DOWN PROFILE ENGINE */}
          {user ? (
            <div className="relative">
              {/* Profile Main Trigger Button */}
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-xs font-black bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-2 rounded-xl uppercase flex items-center gap-1.5 hover:bg-indigo-100 transition shadow-sm"
              >
                👤 {user.name} <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* Floating Menu Popover */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <button onClick={() => { alert("Profile Settings Node Coming Soon!"); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center gap-2">
                    <i className="fa-regular fa-id-card text-sm"></i> My Profile
                  </button>
                  
                  <button onClick={() => { alert("❤️ Item pinned to Wishlist!"); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center gap-2">
                    <i className="fa-regular fa-heart text-sm"></i> My Favorite
                  </button>

                  {/* 📦 ORDERS TRIGGER CLICK */}
                  <button 
                    onClick={() => { onOrdersClick(); setIsDropdownOpen(false); }} 
                    className="w-full text-left px-4 py-2.5 text-xs font-black text-indigo-600 bg-indigo-50/40 hover:bg-indigo-50 transition flex items-center gap-2 border-y border-indigo-50"
                  >
                    <i className="fa-solid fa-box text-sm"></i> Orders & Tracking
                  </button>

                  <button onClick={() => { alert("💬 JadounHub Support Chatbot is Live 24x7!"); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center gap-2">
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