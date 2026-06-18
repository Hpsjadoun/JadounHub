import React, { useState } from 'react';

export default function ReferralWidget({ darkMode, user }) {
  const [copied, setCopied] = useState(false);
  const points = Number(localStorage.getItem('loyaltyPoints') || 0);
  const referralCode = user ? `JADOUN${(user.name||'USER').substring(0,4).toUpperCase()}${String(user.phone||'0000').slice(-4)}` : 'JADOUN-GUEST';
  const dm = darkMode;

  const handleCopy = () => {
    navigator.clipboard.writeText(`Use my referral code ${referralCode} on JadounHub and get 10% off your first order! https://jadounhub.pages.dev`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <div className={`max-w-md mx-auto my-6 p-5 rounded-3xl border shadow-sm ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-black uppercase tracking-wide flex items-center gap-2 ${dm ? 'text-white' : 'text-gray-800'}`}>
          🎁 Referral & Rewards
        </h3>
        <span className="bg-amber-100 text-amber-700 text-xs font-black px-3 py-1 rounded-full">⭐ {points} Points</span>
      </div>

      <div className={`p-4 rounded-2xl border-2 border-dashed mb-3 text-center ${dm ? 'bg-gray-700 border-indigo-700' : 'bg-indigo-50 border-indigo-200'}`}>
        <p className={`text-[10px] font-bold uppercase mb-1 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Your Referral Code</p>
        <p className="text-xl font-black text-indigo-600 tracking-widest">{referralCode}</p>
      </div>

      <button onClick={handleCopy} className={`w-full font-black text-xs py-3 rounded-xl transition ${copied ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
        {copied ? '✅ Copied! Share with friends' : '📋 Copy & Share Referral Link'}
      </button>

      <div className={`mt-4 grid grid-cols-2 gap-2 text-center`}>
        <div className={`p-3 rounded-xl ${dm ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className="text-lg font-black text-indigo-600">₹50</p>
          <p className={`text-[9px] font-bold ${dm ? 'text-gray-400' : 'text-gray-500'}`}>You Get (per referral)</p>
        </div>
        <div className={`p-3 rounded-xl ${dm ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className="text-lg font-black text-green-600">10%</p>
          <p className={`text-[9px] font-bold ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Friend Gets Off</p>
        </div>
      </div>

      <p className={`text-[10px] text-center font-medium mt-3 ${dm ? 'text-gray-400' : 'text-gray-400'}`}>
        💡 Earn 50 points on every order. Redeem 100 points = ₹50 off!
      </p>
    </div>
  );
}