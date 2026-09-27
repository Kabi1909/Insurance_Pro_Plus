import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'support', text: 'Hi Albert! 👋 How can we help you today?', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate response
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "Thank you for your message. An agent will be with you shortly.";
      
      if (inputValue.toLowerCase().includes('claim')) {
        replyText = "Of course! Your claim CLM-2026-0045 is currently under review. Would you like more information about the review process?";
      } else if (inputValue.toLowerCase().includes('renew')) {
        replyText = "You can renew your policies easily from the 'My Policies' tab on your dashboard.";
      }

      const supportMessage = {
        id: Date.now() + 1,
        sender: 'support',
        text: replyText,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      setMessages(prev => [...prev, supportMessage]);
    }, 1500);
  };

  const handleQuickOption = (option) => {
    setInputValue(option);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-all transform hover:scale-105 z-40"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-borderMain flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Insurance Pro Plus Support</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="h-2 w-2 bg-success rounded-full"></div>
                <span className="text-xs opacity-90">Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-primary-dark p-1 rounded-md transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-blue-100 text-primary' : 'bg-gray-200 text-textSecondary'}`}>
                  {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-borderMain text-textMain rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-textSecondary mt-1">{msg.time}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 max-w-[85%]">
                <div className="h-8 w-8 rounded-full bg-gray-200 text-textSecondary flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white border border-borderMain p-3 rounded-lg rounded-tl-none flex gap-1 items-center h-10">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Options */}
          {messages.length === 1 && (
             <div className="p-3 bg-gray-50 border-t border-borderMain flex flex-wrap gap-2">
               {['Policy Renewal', 'Claim Status', 'Payment Help'].map(opt => (
                 <button 
                  key={opt}
                  onClick={() => handleQuickOption(opt)}
                  className="text-xs bg-white border border-borderMain text-textMain px-2.5 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                 >
                   {opt}
                 </button>
               ))}
             </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-borderMain bg-white flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 border border-borderMain rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="bg-primary text-white p-2 rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChat;
