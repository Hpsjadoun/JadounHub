import React, { useState } from 'react';

export default function ChatWidget({ brandName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: `Hello! Welcome to ${brandName}. How can we help you today?`, isBot: true }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    const currentInput = input;
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: `Our team is reviewing your query regarding "${currentInput}". We'll update you shortly!`, 
        isBot: true 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button onClick={() => setIsOpen(!isOpen)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-xl flex items-center justify-center transition-transform transform hover:scale-105">
        <i className="fa-solid fa-comments text-2xl"></i>
        <span className="ml-2 font-medium hidden sm:inline">Chat Now</span>
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
            <span className="font-semibold text-sm">{brandName} Support</span>
            <button onClick={() => setIsOpen(false)}><i className="fa-solid fa-xmark"></i></button>
          </div>
          <div className="p-4 h-64 overflow-y-auto text-sm space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`p-3 rounded-lg max-w-[85%] ${msg.isBot ? 'bg-white border text-gray-800' : 'bg-indigo-600 text-white ml-auto'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t bg-white flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 px-3 py-1.5 border rounded-lg text-sm outline-none" />
            <button onClick={sendMessage} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg"><i className="fa-solid fa-paper-plane"></i></button>
          </div>
        </div>
      )}
    </div>
  );
}