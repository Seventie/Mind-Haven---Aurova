
import React, { useState, useRef, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { Message } from '../types';

interface ChatProps {
  history: Message[];
  setHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  onBack: () => void;
  // Added missing props to fix App.tsx errors
  isLoggedIn: boolean;
  onAuthRequired: () => void;
}

// Added missing props to component arguments
const Chat: React.FC<ChatProps> = ({ history, setHistory, onBack, isLoggedIn, onAuthRequired }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isLoggedIn) {
      const loadHistory = async () => {
        try {
          const data = await chatService.getHistory(sessionId);
          if (data && data.length > 0) {
            const formatted = data.map((m: any) => ({
              id: m._id,
              role: m.role,
              text: m.content,
              timestamp: new Date(m.createdAt)
            }));
            setHistory(formatted);
          }
        } catch (err) {
          console.error("Failed to load history:", err);
        }
      };
      loadHistory();
    }
  }, [isLoggedIn, sessionId, setHistory]);

  useEffect(scrollToBottom, [history]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    console.log("🔐 Is Logged In:", isLoggedIn);

    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await chatService.sendMessage(userMsg.text, sessionId);

      const botMsg: Message = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: data.response,
        timestamp: new Date()
      };

      setHistory(prev => [...prev, botMsg]);

      if (data.isCrisis) {
        setShowCrisisAlert(true);
      }
    } catch (err: any) {
      console.error("❌ FULL ERROR:", err);

      const errorMsg = err.response?.data?.error
        || err.response?.data?.message
        || err.message
        || "Failed to send message";

      const errorBotMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'model',
        text: `⚠️ ${errorMsg}. Please try again or check your connection.`,
        timestamp: new Date()
      };
      setHistory(prev => [...prev, errorBotMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="pt-24 pb-32 h-screen max-w-5xl mx-auto px-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
          <span className="material-icons-outlined text-sm">arrow_back</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg border border-black flex items-center justify-center">
            <span className="material-icons-outlined text-white text-sm">support_agent</span>
          </div>
          <span className="font-display text-xl">TENA AI</span>
        </div>
        <div className="w-8" />
      </div>

      {showCrisisAlert && (
        <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-2xl p-6 shadow-brutalist animate-in fade-in zoom-in duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-brutalist-sm">
              <span className="material-icons-outlined text-2xl">emergency</span>
            </div>
            <div className="flex-grow">
              <h4 className="text-red-700 font-display text-xl mb-1">We are here with you.</h4>
              <p className="text-red-900/80 text-sm font-medium mb-4 italic leading-relaxed">
                "It takes immense courage to share these feelings. You don't have to carry this alone."
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <a href="tel:988" className="flex items-center gap-3 p-3 bg-white border-2 border-black rounded-xl hover:translate-y-0.5 transition-all text-black decoration-0">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="material-icons-outlined text-red-600 text-sm">phone</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Crisis Hotline</p>
                    <p className="font-bold">Call 988</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 p-3 bg-white border-2 border-black rounded-xl text-black">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="material-icons-outlined text-blue-600 text-sm">chat</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Crisis Text</p>
                    <p className="font-bold">Text HOME to 741741</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCrisisAlert(false)}
                className="mt-4 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 underline underline-offset-4"
              >
                Close notification
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow bg-white dark:bg-card-dark border-2 border-black rounded-3xl shadow-brutalist overflow-hidden flex flex-col relative">
        <div className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar">
          {history.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center border-2 border-black mx-auto mb-4 animate-bounce">
                <span className="material-icons-outlined text-3xl text-primary">waving_hand</span>
              </div>
              <h3 className="text-2xl font-display mb-2">Hello, I'm TENA.</h3>
              <p className="text-gray-500 max-w-xs mx-auto text-sm italic">"Your feelings are valid. I'm here to listen to anything you'd like to share today."</p>
            </div>
          )}
          {history.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl border-2 border-black shadow-brutalist-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary text-black'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl border-2 border-black flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t-2 border-black">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tell me what's on your mind..."
              className="flex-grow bg-white dark:bg-card-dark border-2 border-black p-4 pr-16 rounded-xl focus:ring-0 focus:border-primary shadow-brutalist-sm transition-all"
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="absolute right-2 p-3 bg-primary text-white rounded-lg border-2 border-black hover:scale-105 transition-transform disabled:opacity-50"
            >
              <span className="material-icons-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
