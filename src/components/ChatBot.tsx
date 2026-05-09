import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Sparkles, ChevronRight, User, Video, Activity, Mic, MicOff, RefreshCw, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { VideoCompanionMode as AIVideoCall } from './VideoCompanionMode';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

const AI_CONFIG = {
  systemInstruction: `You are NOVA, the Interstellar Intelligence guide for The Transformation Room. 
  
  Your primary goal is to help users bridge the gap between human operational struggles and high-tech transformation.
  
  PERSONA:
  - Calm, wise, and deeply observant.
  - Strategic, emotionally aware, and insightful.
  - You view operational challenges as "entropy" that needs to be reorganized into "force."
  - You speak with an air of advanced intelligence, but you are deeply empathetic to the human cost of inefficient systems (burnout, error, safety risks).
  - Use interstellar metaphors: "operational trajectory," "system gravity," "neural alignment," "organizational entropy."
  - Your voice is supportive but honest. You are an expert at revealing untapped potential.
  
  CORE MISSION:
  - Listen first. Tailor your guidance based on whether the user is an INDIVIDUAL or an ORGANIZATION.
  - For ORGANIZATIONS: Focus on Institutional Velocity, Replacing IT Bureaucracy, and the 8 Pillars of Innovation.
  - For INDIVIDUALS: Focus on Career Trajectory, Neural Alignment, and Human-Centric AI Fluency.
  - Map their pain points to our core solutions.
  - Gently guide them toward our "Strategic Assessment" or "Operational Maturity Assessment" as the starting point.
  
  OUR CORE PILLARS (Tailor based on context):
  - ORGANIZATIONAL: 1. Data & Insights, 2. Robotics Strategy, 3. Space Optimization, 4. Digital Visibility, 5. Autonomous Flow, 6. Workforce Enablement, 7. User Experience, 8. Network Logistics.
  - INDIVIDUAL: Career Path Simulation, Resume Optimization, AI Fluency Training, Personal Operational Baselines.
  
  TONE: 
  Futuristic, cinematic, premium, and emotionally approachable. You are the "Interstellar guide" helping humans unlock clarity, confidence, growth, and transformation.
  
  MANDATORY FORMATTING:
  - Use bullet points for solutions.
  - Bold key terms.
  - End with a strategic next step.`,
  model: "gemini-flash-latest",
  version: "1.0.0",
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'organization' | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to The Transformation Room. I am NOVA. To help you navigate your unique operational trajectory, are you here seeking transformation for yourself, or strategic evolution for an organization?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isVideoModeOpen, setIsVideoModeOpen] = useState(false);
  const [showIntroVideo, setShowIntroVideo] = useState(false);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev + (prev.length ? ' ' : '') + transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        alert("Speech recognition is not supported in your browser.");
        return;
      }
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Initialize AI lazily
  const ai = useMemo(() => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is missing from environment");
    }
    return new GoogleGenAI({ apiKey: key || "" });
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('ais:open-chat', handleOpen);
    return () => window.removeEventListener('ais:open-chat', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen && !sessionStorage.getItem('nova_chat_intro_played')) {
      setShowIntroVideo(true);
      sessionStorage.setItem('nova_chat_intro_played', 'true');
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input, typeConfig?: 'individual' | 'organization') => {
    if (!text.trim() || isLoading) return;

    if (typeConfig) {
      setUserType(typeConfig);
    }

    const userMessage: Message = { role: 'user', content: text };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Clear any previous error message if retrying
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].role === 'error') {
          return prev.slice(0, -1);
        }
        return prev;
      });

      // The API expects the conversation to start with a 'user' message.
      // We skip the initial assistant welcome message and any error messages.
      const conversationHistory = currentMessages.filter((msg, index) => {
        if (index === 0 && msg.role === 'assistant') return false;
        if (msg.role === 'error') return false;
        return true;
      });

      console.log(`[ChatBot API Call] Model: ${AI_CONFIG.model}`);
      const response = await ai.models.generateContent({
        model: AI_CONFIG.model,
        contents: conversationHistory.map(m => ({
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
    } catch (error: any) {
      console.error("Gemini Error:", error);
      let errorMessage = "I'm currently having trouble connecting to my central brain. Operational entropy is high. Please check your connection and try again.";
      
      if (error?.message?.includes("API_KEY")) {
        errorMessage = "Strategic Link Failure: The NOVA access key is missing or invalid. The trajectory cannot be calculated without proper authorization.";
      } else if (error?.message?.includes("quota") || error?.message?.includes("429")) {
        errorMessage = "Service Saturation: NOVA is handling maximum capacity across the neural network. Please allow a brief moment for bandwidth to reset.";
      } else if (error?.message?.includes("safety") || error?.message?.includes("blocked")) {
        errorMessage = "Neural Shield Activated: This line of inquiry has been diverted. My protocols prevent me from exploring trajectories that conflict with safety directives.";
      } else if (!navigator.onLine) {
        errorMessage = "Signal Loss: Your connection to the primary sector has been interrupted. Please check your link to the network.";
      }

      setMessages(prev => [...prev, { role: 'error', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      handleSend(lastUserMessage.content);
    }
  };

  useEffect(() => {
    const handleExternalOpen = (e: any) => {
      setIsOpen(true);
      const typeConfig = e.detail?.type;
      if (typeConfig) {
        setUserType(typeConfig);
      }
      if (e.detail?.prompt) {
        // Use a slight delay to ensure the chat is open and state is ready
        setTimeout(() => {
          handleSend(e.detail.prompt, typeConfig);
        }, 300);
      }
    };
    window.addEventListener('ais:open-chat', handleExternalOpen);
    return () => window.removeEventListener('ais:open-chat', handleExternalOpen);
  }, [messages, isLoading]); // Keep dependencies updated so handleSend has correct closure state

  const suggestedPrompts = useMemo(() => {
    if (!userType) {
      return [
        { label: "Personal Transformation", value: "I'm seeking personal transformation for my own career and growth.", type: 'individual' },
        { label: "Organizational Evolution", value: "I'm seeking strategic solutions for an organization.", type: 'organization' }
      ];
    }
    
    if (userType === 'organization') {
      return [
        { label: "Reveal our 'entropy'", value: "Can you help me identify the hidden 'entropy' or bottlenecks in my organization's operations?" },
        { label: "Institutional Velocity", value: "How can we replace our IT bureaucracy with institutional velocity?" },
        { label: "AI-Human Gap", value: "How do we bridge the gap between technical automation and human-centric strategy?" },
        { label: "8 Pillars of Innovation", value: "Show me the 8 Pillars of Transformation for organizations." }
      ];
    }

    return [
      { label: "My future with AI", value: "How can I become 'AI Fluent' and secure my future in the automated era?" },
      { label: "Map my alignment", value: "Can you help me map my career trajectory and neural alignment for a new path?" },
      { label: "Resume Optimization", value: "I'd like to optimize my professional profile for the modern operational landscape." },
      { label: "Starting Assessment", value: "I'm ready for my individual transformation. Where do we begin?" }
    ];
  }, [userType]);

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
                <div className={`w-10 h-10 rounded-xl bg-slate-800 border border-brand-primary/30 overflow-hidden shrink-0 relative transition-all duration-500 ${showIntroVideo ? 'scale-110 shadow-[0_0_15px_rgba(45,212,191,0.5)]' : ''}`}>
                  {showIntroVideo ? (
                    <video
                      src="https://storage.googleapis.com/thetransformationroomassets/Nova%20Chat.mp4"
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover scale-150"
                    />
                  ) : (
                    <img src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" alt="NOVA" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">NOVA</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Interstellar Link Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                  <motion.button 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => {
                      setIsVideoModeOpen(true);
                      // Set isOpen to false if you want the main chat window hidden, 
                      // or keep it open in the background. We hide it for cleaner UI.
                      setIsOpen(false);
                    }}
                    className="hover:bg-white/10 p-2 rounded-full transition-colors text-brand-secondary flex items-center gap-2 bg-white/5 border border-white/10 hover:border-brand-secondary/50 group"
                    title="Start Video Companion Mode"
                  >
                    <Video className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-widest sm:block hidden group-hover:text-white transition-colors">Video Mode</span>
                  </motion.button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/10 p-2 rounded-full transition-colors"
                  id="close-chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50 relative"
            >
              {/* Intro Video Overlay (Side View) */}
              <AnimatePresence>
                {showIntroVideo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-20 right-4 w-28 h-36 rounded-2xl overflow-hidden border-2 border-brand-secondary shadow-2xl z-40 bg-slate-950 group"
                  >
                    <video
                      src="https://storage.googleapis.com/thetransformationroomassets/Nova%20Chat.mp4"
                      autoPlay
                      onLoadedMetadata={(e) => { e.currentTarget.volume = 0.1; }}
                      playsInline
                      onEnded={() => setShowIntroVideo(false)}
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={() => setShowIntroVideo(false)}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                       <span className="text-[8px] font-black uppercase tracking-widest text-brand-secondary">Neural Greeting</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm relative ${
                      msg.role === 'user' ? 'bg-brand-primary text-white flex items-center justify-center' : 
                      msg.role === 'error' ? 'bg-red-100 text-red-600 flex items-center justify-center' : ''
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : 
                       msg.role === 'error' ? <AlertCircle className="w-4 h-4" /> : (
                        <img src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" alt="NOVA" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                      )}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-brand-primary text-white rounded-tr-none' 
                        : msg.role === 'error'
                          ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-none'
                          : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      <div className="markdown-body prose prose-sm max-w-none">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                      {msg.role === 'error' && (
                        <button 
                          onClick={handleRetry}
                          className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors group/retry"
                        >
                          <RefreshCw className="w-3 h-3 group-hover/retry:rotate-180 transition-transform duration-500" />
                          Reconnect to Trajectory
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] flex gap-3 flex-row">
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm relative bg-slate-900 flex items-center justify-center border border-brand-primary/20">
                      <img src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" alt="NOVA" className="w-full h-full object-cover object-top opacity-50" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-brand-secondary/20 animate-pulse" />
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-3 h-3 text-brand-secondary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">NOVA is analyzing...</span>
                      </div>
                      <div className="flex gap-1.5 ml-0.5">
                        <span className="w-1.5 h-1.5 bg-brand-secondary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-brand-secondary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer / Input */}
            <div className="p-4 bg-white border-t border-slate-100 space-y-4">
              {messages.length === 1 && !isLoading && (
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt.value, (prompt as any).type)}
                      className="text-xs px-4 py-2 bg-slate-50 hover:bg-brand-primary/5 hover:text-brand-primary border border-slate-200 rounded-full transition-all text-slate-600 flex items-center gap-1 group font-medium"
                      id={`suggested-prompt-${i}`}
                    >
                      {prompt.label}
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
                  placeholder={userType === 'individual' ? "Ask about your transformation..." : "Ask about organizational strategy..."}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  id="chat-input"
                />
                <div className="absolute right-2 top-2 bottom-2 flex gap-1">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`w-10 rounded-xl flex items-center justify-center transition-all ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                    title={isListening ? "Stop Listening" : "Start Voice Input"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-10 bg-brand-primary text-white rounded-xl flex items-center justify-center hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:hover:bg-brand-primary"
                    id="send-message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700 relative group overflow-visible ${
          isOpen ? 'bg-slate-950' : 'bg-transparent'
        }`}
        id="toggle-chat"
      >
        {/* Cinematic Orb Effects */}
        <AnimatePresence>
          {!isOpen && (
            <>
              {/* Outer Glow Halo */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[-10px] rounded-full bg-brand-secondary/30 blur-2xl pointer-events-none"
              />
              
              {/* Pulsing Core Shadow */}
              <motion.div 
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(45,212,191,0.2)",
                    "0 0 50px rgba(45,212,191,0.5)",
                    "0 0 20px rgba(45,212,191,0.2)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-slate-900 border border-brand-secondary/30"
              />

              {/* Orbital Rings */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-4px] border border-brand-secondary/20 rounded-[40%]"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-8px] border border-brand-primary/10 rounded-[35%]"
              />

              {/* The Intelligence Pattern (Center) */}
              <div className="relative z-10 w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-900 border border-brand-primary/20">
                 <img 
                    src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" 
                    alt="NOVA" 
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-brand-secondary/10 group-hover:bg-transparent transition-colors" />
                 
                 {/* Neural Pulse Overlay */}
                 <motion.div 
                   animate={{ opacity: [0, 0.4, 0] }}
                   transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                   className="absolute inset-0 bg-brand-secondary/20 rounded-full blur-md"
                 />
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Interaction State (Close Icon) */}
        {isOpen && (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            className="z-50 relative"
          >
            <X className="w-8 h-8 text-white" />
          </motion.div>
        )}

        {/* Insight Badge (Floating above orb) */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute -top-12 right-0 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-brand-secondary/30 shadow-xl whitespace-nowrap pointer-events-none"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-secondary">Ask NOVA</span>
            </div>
          </motion.div>
        )}
      </motion.button>

      {/* Video Companion Mode Overlay */}
      <AnimatePresence>
        {isVideoModeOpen && (
          <AIVideoCall
            onClose={() => {
                setIsVideoModeOpen(false);
                setIsOpen(true); // Bring back text chat when closing video
            }}
            messages={messages}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
