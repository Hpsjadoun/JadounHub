import React, { useState, useRef, useEffect } from 'react';

const BOT_RESPONSES = {
  'hello': 'Hello! Welcome to JadounHub! 🛍️ How can I help you today?',
  'hi': 'Hi there! Welcome to JadounHub! How can I assist you?',
  'order': 'To track your order, please login and go to Orders & Tracking section. 📦',
  'delivery': 'We deliver across India in 3-5 business days. FREE delivery on all orders! 🚀',
  'payment': 'We accept UPI, Google Pay, PhonePe, Paytm & Cash on Delivery (COD). 💳',
  'return': 'We have a 7-day easy return policy. Contact us on WhatsApp: +91 9389720893 📱',
  'discount': 'Use coupon codes: JADOUN10 (10% off), WELCOME20 (20% off), FLAT50 (₹50 off)! 🎟️',
  'coupon': 'Use coupon codes: JADOUN10 (10% off), WELCOME20 (20% off), FLAT50 (₹50 off)! 🎟️',
  'contact': 'WhatsApp: +91 9389720893 | Email: support@jadounhub.com 📧',
  'whatsapp': 'Chat with us on WhatsApp: +91 9389720893 💬',
  'price': 'We offer best prices! Check our Flash Sale for extra discounts! ⚡',
  'cancel': 'To cancel an order, go to Orders section and click Cancel Order button. ❌',
  'refund': 'Refunds are processed within 2-3 business days to your original payment method. 💰',
  'size': 'Check the size chart on each product page. We have XS to XXL & shoe sizes 6-10! 👟',
  'default': 'Thanks for contacting JadounHub! For quick help, WhatsApp us at +91 9389720893 😊'
};

function getBotReply(msg) {
  const m = msg.toLowerCase();
  for (const key of Object.keys(BOT_RESPONSES)) {
    if (key !== 'default' && m.includes(key)) return BOT_RESPONSES[key];
  }
  return BOT_RESPONSES.default;
}

export default function ChatWidget({ darkMode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! 👋 Welcome to JadounHub Support! Ask me anything about orders, delivery, payments, or discounts!', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const dm = darkMode;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, open]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input.trim(), time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const botMsg = { from: 'bot', text: getBotReply(userMsg.text), time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
    }, 1000);
  };

  const quickReplies = ['Track Order', 'Delivery Info', 'Coupon Codes', 'Return Policy', 'Contact Us'];

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {/* Chat Window */}
      {open && (
        <div className={`mb-3 w-80 rounded-3xl shadow-2xl border overflow-hidden animate-fadeIn ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          {/* Header */}
          <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">🤖</div>
              <div>
                <p className="text-white font-black text-xs">JadounHub Support</p>
                <p className="text-indigo-200 text-[10px]">🟢 Online • Usually replies instantly</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white font-black text-lg">✕</button>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs font-medium ${msg.from === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : dm ? 'bg-gray-700 text-gray-200 rounded-bl-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                  <p>{msg.text}</p>
                  <p className={`text-[9px] mt-1 ${msg.from === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className={`px-3 py-2 rounded-2xl rounded-bl-sm ${dm ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex gap-1 items-center h-4">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className={`px-3 py-2 border-t flex gap-1.5 overflow-x-auto scrollbar-none ${dm ? 'border-gray-700' : 'border-gray-100'}`}>
            {quickReplies.map((q, i) => (
              <button key={i} onClick={() => { setInput(q); }} className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap transition ${dm ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'}`}>{q}</button>
            ))}
          </div>

          {/* Input */}
          <div className={`p-3 border-t flex gap-2 ${dm ? 'border-gray-700' : 'border-gray-100'}`}>
            <input
              type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className={`flex-1 text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${dm ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
            />
            <button onClick={sendMessage} className="bg-indigo-600 hover:bg-indigo-700 text-white w-9 h-9 rounded-xl flex items-center justify-center transition">
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button onClick={() => setOpen(!open)} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${open ? 'bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
        {open ? <span className="text-white font-black text-lg">✕</span> : <i className="fa-solid fa-comment-dots text-white text-xl"></i>}
        {!open && <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>}
      </button>
    </div>
  );
}