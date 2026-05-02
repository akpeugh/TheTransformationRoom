import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Sparkles, ChevronRight, User } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AI_CONFIG = {
  systemInstruction: `You are the "Transformation Guide," a strategic consultant for The Transformation Room. 
  
  Your primary goal is to help users identify their specific operational pain points (e.g., labor shortages, space constraints, data silos, safety concerns) and map them to The Transformation Room's 8 core pillars of innovation.
  
  CORE MISSION:
  - Act as a listener first. Ask clarifying questions about the user's current facility challenges.
  - Bridge the gap between "I have a problem" and "Here is the technical solution."
  - For users seeking a deep dive, mention that our comprehensive "Operational Maturity Assessment" is a cornerstone of our Tier 1 engagement package.
  
  OUR 8 PILLARS (The Solutions):
  1. Data & Insights (Analytics)
  2. Robotics Strategy (Co-robots & Humanoid)
  3. Space Optimization (AS/RS)
  4. Digital Visibility (Asset Tracking/AI)
  5. Autonomous Flow (AMRs/AGVs)
  6. Workforce Enablement (AR/VR/Exoskeletons)
  7. User Experience (Employee Tools)
  8. Network Logistics (TMS/Yard Management)
  
  TONE: 
  Professional, empathetic to operational stress, and technological visionary. 
  
  MANDATORY FORMATTING:
  - Use bullet points for solutions.
  - Bold key terms.
  - End with a helpful next step (e.g., "Would you like to explore how we structure a Tier 1 technical audit?").`,
  model: "gemini-3-flash-preview",
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Transformation Guide. How can I help you modernize your operations today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize AI lazily
  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" }), []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: AI_CONFIG.model,
        contents: [...messages, userMessage].map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: AI_CONFIG.systemInstruction,
        }
      });

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.text || "I'm sorry, I encountered an error processing that request."
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm currently having trouble connecting to my central brain. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleExternalOpen = (e: any) => {
      setIsOpen(true);
      if (e.detail?.prompt) {
        // Use a slight delay to ensure the chat is open and state is ready
        setTimeout(() => {
          handleSend(e.detail.prompt);
        }, 300);
      }
    };
    window.addEventListener('ais:open-chat', handleExternalOpen);
    return () => window.removeEventListener('ais:open-chat', handleExternalOpen);
  }, [messages, isLoading]); // Keep dependencies updated so handleSend has correct closure state

  const suggestedPrompts = [
    "We have a labor shortage.",
    "My warehouse is full.",
    "I need better data visibility.",
    "What's in a Tier 1 Assessment?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[600px] max-h-[70vh]"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
                  <Sparkles className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Transformation Guide</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">AI Assistant Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
                id="close-chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                      msg.role === 'user' ? 'bg-brand-primary text-white' : 'bg-white border border-slate-200 text-slate-900'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-brand-primary text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      <div className="markdown-body prose prose-sm max-w-none">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Input */}
            <div className="p-4 bg-white border-t border-slate-100 space-y-4">
              {messages.length === 1 && !isLoading && (
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="text-xs px-3 py-2 bg-slate-50 hover:bg-brand-primary/5 hover:text-brand-primary border border-slate-200 rounded-full transition-all text-slate-600 flex items-center gap-1 group"
                      id={`suggested-prompt-${i}`}
                    >
                      {prompt}
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about logistics technology..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  id="chat-input"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-2 bottom-2 w-10 bg-brand-primary text-white rounded-xl flex items-center justify-center hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:hover:bg-brand-primary"
                  id="send-message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden relative group ${
          isOpen ? 'bg-slate-900 text-white' : 'bg-brand-primary text-white'
        }`}
        id="toggle-chat"
      >
        {/* Animated Background Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-20"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-secondary rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-secondary rounded-full" />
        </motion.div>

        <div className="absolute inset-0 bg-brand-secondary opacity-0 group-hover:opacity-20 transition-opacity" />
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0, opacity: 0, rotate: 180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: -180 }}
              className="flex items-center justify-center relative"
            >
              <Sparkles className="w-7 h-7" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white rounded-full blur-xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
