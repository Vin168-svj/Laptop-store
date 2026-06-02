import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Bot, Sparkles, Laptop } from 'lucide-react';

interface Msg {
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    {
      sender: 'agent',
      text: 'Hello there! 👋 Welcome to TechLaptop Support. Looking for a powerful gaming rig, a slim student laptop, or looking to track an existing order? Tell me what you need!',
      time: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const quickOptions = [
    { label: '🎮 Best Gaming Laptop?', query: 'Can you recommend the best laptop for heavy gaming and 3D work?' },
    { label: '💼 Slim Professional picks?', query: 'What ultra-portable laptop do you suggest for business travel?' },
    { label: '📦 How to Track Orders', query: 'Help me track my recent order status.' },
    { label: '🎫 Promo code questions?', query: 'Do you have any active discount coupons or seasonal promo codes?' }
  ];

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Msg = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate smart support reply
    setTimeout(() => {
      let replyText = "I see! Let me check that with the TechLaptop database. We recommend looking closely at our specialized categories. Let me know if you would like me to assist in finding an alternative specs configuration!";
      const lower = textToSend.toLowerCase();

      if (lower.includes('gaming') || lower.includes('heavy')) {
        replyText = "For supreme gaming power, check out the Razer Blade 16 Extreme. It is powered by the flagship Nvidia RTX 4080 (12GB) paired with a gorgeous 240Hz Mini-LED display! Or see our HP Victus 16 for a stellar midrange setup.";
      } else if (lower.includes('business') || lower.includes('travel') || lower.includes('slim') || lower.includes('professional')) {
        replyText = "The absolute business gold standard is the Lenovo ThinkPad X1 Carbon. It weighs only 1.1kg, has military-standard build test results, and exceptional battery endurance! Alternatively, the ASUS ZenBook Duo provides outstanding secondary dual-screen room.";
      } else if (lower.includes('track') || lower.includes('status') || lower.includes('order')) {
        replyText = "You can easily verify active states! Just log into your portal, navigate to the 'User Dashboard', and reference the 'Order History' tab. It displays current processing statuses, and tracking numbers once shipped!";
      } else if (lower.includes('promo') || lower.includes('discount') || lower.includes('coupon') || lower.includes('code')) {
        replyText = "Yes, we do! You can try applying the promo coupon code 'WELCOME10' at checkout to receive 10% OFF on purchases over $500! We also have 'SUPERLAP50' for a $50 flat discount.";
      }

      setMessages(prev => [...prev, {
        sender: 'agent',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div id="live-chat-support-widget" className="fixed bottom-6 right-6 z-50">
      
      {/* FLOATING CHAT BALLOON LAUNCHER */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-xl hover:bg-orange-700 transition-all duration-300 hover:scale-110 active:scale-95"
          title="Open Live Chat Support"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
        </button>
      )}

      {/* CHAT WINDOW BOX */}
      {isOpen && (
        <div className="flex h-[450px] w-[330px] sm:w-[380px] flex-col overflow-hidden rounded-2xl border border-neutral-150 bg-white shadow-2xl transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-950">
          
          {/* HEADER ROW */}
          <div className="flex items-center justify-between bg-orange-600 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Laptop className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">Laptop Concierge Support</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                  <span className="text-[10px] text-orange-100 font-medium">Agent online • Instant reply</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* MESSAGE LOG SCROLLER */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto bg-neutral-50 p-4 dark:bg-neutral-950/60 flex flex-col gap-3"
          >
            {messages.map((m, idx) => (
              <div 
                key={idx}
                className={`flex gap-2.5 max-w-[85%] ${m.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  m.sender === 'user' ? 'bg-orange-100 text-orange-950 dark:bg-orange-950 dark:text-orange-200' : 'bg-neutral-800 text-white'
                }`}>
                  {m.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>
                <div className="flex flex-col">
                  <div className={`rounded-2xl px-3.5 py-2.5 text-xs font-normal leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-orange-600 text-white rounded-tr-none' 
                      : 'bg-white text-neutral-800 border border-neutral-150 dark:bg-neutral-900 dark:border-neutral-850 dark:text-neutral-200 rounded-tl-none shadow-xs'
                  }`}>
                    {m.text}
                  </div>
                  <span className={`text-[9px] mt-1 text-neutral-400 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {/* TYPING DOTS */}
            {isTyping && (
              <div className="flex gap-2.5 items-center max-w-[85%] self-start">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-white text-xs">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl px-4 py-2 bg-white border border-neutral-150 dark:bg-neutral-900 dark:border-neutral-850 text-neutral-400 text-xs flex gap-1">
                  <span className="dot animate-bounce">.</span>
                  <span className="dot animate-bounce [animation-delay:0.2s]">.</span>
                  <span className="dot animate-bounce [animation-delay:0.4s]">.</span>
                </div>
              </div>
            )}
          </div>

          {/* QUICK CHIPS SUGGESTIONS */}
          <div className="px-3 py-2 bg-neutral-100/50 dark:bg-neutral-900/50 border-t border-neutral-150 dark:border-neutral-800 overflow-x-auto flex gap-1.5 scrollbar-none shrink-0">
            {quickOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSend(opt.query)}
                className="whitespace-nowrap rounded-full bg-white dark:bg-neutral-800 px-3 py-1 text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* FOOTER MESSAGE WRITING BOX */}
          <div className="p-3 border-t border-neutral-150 bg-white dark:border-neutral-900 dark:bg-neutral-950 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask support anything..."
              className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
            />
            <button
              onClick={() => handleSend(input)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
