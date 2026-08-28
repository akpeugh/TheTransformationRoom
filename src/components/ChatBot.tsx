import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Sparkles, ChevronRight, User, Video, Activity, Mic, MicOff, RefreshCw, AlertCircle } from 'lucide-react';
import Markdown from 'react-markdown';
import { VideoCompanionMode as AIVideoCall } from './VideoCompanionMode';
import { updateSharedCareerProfile } from '../utils/careerStore';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'organization' | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to The Transformation Room. I am NOVA. Are you exploring career transformation for yourself, or strategic operational evolution for an organization?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreamingActive, setIsStreamingActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = (smooth = true) => {
    if (scrollRef.current) {
      if (smooth) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [messages.length]);

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
    setIsStreamingActive(false);

    let finalErrorMessage = '';

    try {
      // Clear any previous error message if retrying
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].role === 'error') {
          return prev.slice(0, -1);
        }
        return prev;
      });

      // The API expects the conversation to start with a 'user' message.
      const conversationHistory = currentMessages.filter((msg, index) => {
        if (index === 0 && msg.role === 'assistant') return false;
        if (msg.role === 'error') return false;
        return true;
      });

      console.log(`[ChatBot API] Initializing request. Model: OpenAI`);
      console.log(`[ChatBot API] Route: /api/nova-chat`);
      console.log(`[ChatBot API] Messages count: ${conversationHistory.length}`);
      console.log(`[ChatBot API] User Type: ${userType}`);
      
      let res;
      try {
        res = await fetch('/api/nova-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: conversationHistory.map(m => ({
              role: m.role,
              content: m.content
            })),
            userType: userType
          })
        });
      } catch (fetchError: any) {
        console.error("[ChatBot API] Network/Fetch Error:", fetchError);
        throw new Error(`Network failure: ${fetchError.message || "Could not reach the server conduit."}`);
      }

      console.log(`[ChatBot API] Response received. Status: ${res.status}`);

      if (!res.ok) {
        let errorMsg = 'Failed to fetch from API';
        try {
            const data = await res.json();
            errorMsg = data.error || errorMsg;
        } catch(e) {}
        throw new Error(errorMsg);
      }

      // Handle server-sent events for streaming
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error("No response body to read.");
      }

      // Add a placeholder message for the assistant stream
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      setIsStreamingActive(true);

      let assistantContext = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        
        if (value) {
          buffer += decoder.decode(value, { stream: true });
        }
        
        const lines = buffer.split('\n');
        // The last element of lines might be an incomplete line (without a trailing newline).
        if (!done) {
          buffer = lines.pop() || '';
        } else {
          buffer = '';
        }

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6).trim();
            if (dataStr === '[DONE]') {
              console.log("[ChatBot API] Streaming [DONE] received");
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                console.error("[ChatBot API] Error from stream:", parsed.error);
                finalErrorMessage = parsed.error;
                throw new Error(parsed.error);
              }
              if (parsed.content) {
                assistantContext += parsed.content;
                // Update the last message smoothly
                setMessages(prev => {
                  if (prev.length === 0) return prev;
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1] = { role: 'assistant', content: assistantContext };
                  return newMsgs;
                });
                scrollToBottom(false);
              }
            } catch (e) {
              console.warn("Could not parse chunk", e, dataStr);
            }
          }
        }

        if (done) {
          if (assistantContext) {
            updateSharedCareerProfile({
              chatInsights: {
                summary: assistantContext.slice(0, 300),
                date: new Date().toISOString()
              }
            });
          }
          break;
        }
      }

    } catch (error: any) {
      console.error("[ChatBot API] Error:", error);
      let errorMessage = "I'm currently recalibrating my strategic connection. Please try again.";
      
      const errorStr = (error?.message || finalErrorMessage || "");
      
      if (errorStr.includes("API_KEY") || errorStr.includes("not configured") || errorStr.includes("api_key")) {
        errorMessage = "Strategic Link Failure: The NOVA access key is missing or invalid. Please check your API settings.";
      } else if (errorStr.includes("quota") || errorStr.includes("429")) {
        errorMessage = `NOVA is currently operating at maximum capacity. Please verify your platform quota or billing dashboard.`;
      } else if (!navigator.onLine) {
        errorMessage = "Connection Offline: Please check your internet connection.";
      } else if (errorStr) {
        errorMessage = `Operational response issue: ${errorStr}`;
      }

      console.error("[ChatBot API] Fallback error message generated:", errorMessage);

      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === 'assistant' && !newMsgs[newMsgs.length - 1].content) {
          newMsgs[newMsgs.length - 1] = { role: 'error', content: errorMessage };
          return newMsgs;
        }
        return [...newMsgs, { role: 'error', content: errorMessage }];
      });
    } finally {
      setIsLoading(false);
      setIsStreamingActive(false);
      setTimeout(() => scrollToBottom(true), 50);
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
        setTimeout(() => {
          handleSend(e.detail.prompt, typeConfig);
        }, 250);
      }
    };
    window.addEventListener('ais:open-chat', handleExternalOpen);
    return () => window.removeEventListener('ais:open-chat', handleExternalOpen);
  }, [messages, isLoading]);

  const suggestedPrompts = useMemo(() => {
    if (!userType) {
      return [
        { label: "Career Transformation", value: "How can I map my career transformation trajectory?", type: 'individual' },
        { label: "Enterprise Automation", value: "What are the first steps to automate our operations?", type: 'organization' }
      ];
    }
    
    if (userType === 'organization') {
      return [
        { label: "Identify Bottlenecks", value: "How do we pinpoint our primary operational bottlenecks?" },
        { label: "Robotics Strategy", value: "How should we evaluate AMRs vs AS/RS systems?" },
        { label: "Institutional Velocity", value: "How can we replace IT bureaucracy with institutional velocity?" },
        { label: "8 Pillars of Transformation", value: "Summarize the 8 Pillars of Transformation for organizations." }
      ];
    }

    return [
      { label: "Career Path Trajectory", value: "Help me map my career trajectory to an executive role." },
      { label: "AI Fluency Training", value: "How can I build practical AI fluency for my role?" },
      { label: "Resume Executive Impact", value: "How do I optimize my resume for high-impact leadership?" },
      { label: "Behavioral Assessment", value: "Where should I start my behavioral and leadership assessment?" }
    ];
  }, [userType]);

  const isWaitingInitialTokens = isLoading && (
    messages.length === 0 || 
    messages[messages.length - 1].role !== 'assistant' || 
    !messages[messages.length - 1].content
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-20 right-0 w-[410px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[580px] max-h-[75vh]"
          >
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-slate-800 border border-brand-primary/30 overflow-hidden shrink-0 relative transition-all duration-300 ${showIntroVideo ? 'scale-105 shadow-[0_0_12px_rgba(45,212,191,0.5)]' : ''}`}>
                  {showIntroVideo ? (
                    <video aria-label="Video presentation" 
                      src="https://storage.googleapis.com/thetransformationroomassets/Nova%20Chat.mp4"
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover scale-150"
                    />
                  ) : (
                    <img src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" alt="NOVA" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" width="400" height="400" loading="lazy" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                    NOVA <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-secondary/20 text-brand-secondary font-semibold">Strategic AI</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-slate-300 font-medium">Direct Response Mode Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => {
                    setIsVideoModeOpen(true);
                    setIsOpen(false);
                  }}
                  className="hover:bg-white/10 p-2 rounded-xl transition-colors text-brand-secondary flex items-center gap-1.5 bg-white/5 border border-white/10 hover:border-brand-secondary/50 group text-xs font-semibold px-2.5"
                  title="Start Video Companion Mode"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Video</span>
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/10 p-2 rounded-xl text-slate-300 hover:text-white transition-colors"
                  id="close-chat"
                  aria-label="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-5 space-y-4 bg-slate-50 relative overscroll-contain"
            >
              {/* Intro Video Overlay (Side View) */}
              <AnimatePresence>
                {showIntroVideo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-4 right-4 w-28 h-36 rounded-2xl overflow-hidden border-2 border-brand-secondary shadow-2xl z-40 bg-slate-950 group"
                  >
                    <video aria-label="Video presentation" 
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
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                       <span className="text-[8px] font-black uppercase tracking-widest text-brand-secondary">Greeting</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message Feed - Clean, stable rendering */}
              <div className="space-y-4">
                {messages.map((msg, i) => {
                  const isLatestAssistant = i === messages.length - 1 && msg.role === 'assistant';
                  const isCurrentlyStreaming = isLatestAssistant && isStreamingActive;

                  // Hide completely empty initial placeholder assistant bubble until tokens arrive
                  if (msg.role === 'assistant' && !msg.content && isWaitingInitialTokens) {
                    return null;
                  }

                  return (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} transition-opacity duration-200`}
                    >
                      <div className={`max-w-[88%] flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-7 h-7 rounded-lg overflow-hidden shrink-0 shadow-sm relative ${
                          msg.role === 'user' ? 'bg-brand-primary text-white flex items-center justify-center' : 
                          msg.role === 'error' ? 'bg-red-100 text-red-600 flex items-center justify-center' : 'bg-slate-900 border border-brand-primary/20'
                        }`}>
                          {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : 
                           msg.role === 'error' ? <AlertCircle className="w-3.5 h-3.5" /> : (
                            <img src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" alt="NOVA" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" width="400" height="400" loading="lazy" />
                          )}
                        </div>
                        <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm transition-all ${
                          msg.role === 'user' 
                            ? 'bg-brand-primary text-white rounded-tr-none font-medium' 
                            : msg.role === 'error'
                              ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-none'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none font-normal'
                        }`}>
                          <div className="markdown-body prose prose-sm max-w-none text-slate-800 leading-snug [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:my-1.5 [&>ul]:pl-4 [&>li]:mb-1 font-sans">
                            <Markdown>{msg.content}</Markdown>
                          </div>
                          {isCurrentlyStreaming && (
                            <span className="inline-block w-1.5 h-3.5 bg-brand-secondary ml-1 animate-pulse align-middle rounded-sm" />
                          )}
                          {msg.role === 'error' && (
                            <button 
                              onClick={handleRetry}
                              className="mt-2.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors group/retry"
                            >
                              <RefreshCw className="w-3 h-3 group-hover/retry:rotate-180 transition-transform duration-500" />
                              Retry
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Compact Initial Loading State (Before first token) */}
              {isWaitingInitialTokens && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] flex gap-2.5 flex-row items-center">
                    <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 shadow-sm relative bg-slate-900 flex items-center justify-center border border-brand-primary/20">
                      <img src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" alt="NOVA" className="w-full h-full object-cover object-top opacity-60" referrerPolicy="no-referrer" width="400" height="400" loading="lazy" />
                      <div className="absolute inset-0 bg-brand-secondary/20 animate-pulse" />
                    </div>
                    <div className="bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">NOVA is thinking</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer / Input */}
            <div className="p-3.5 bg-white border-t border-slate-100 space-y-3">
              {messages.length === 1 && !isLoading && (
                <div className="flex flex-wrap gap-1.5">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt.value, (prompt as any).type)}
                      className="text-[11px] px-3 py-1.5 bg-slate-100/80 hover:bg-brand-primary/10 hover:text-brand-primary border border-slate-200 rounded-full transition-all text-slate-700 flex items-center gap-1 group font-semibold cursor-pointer"
                      id={`suggested-prompt-${i}`}
                    >
                      {prompt.label}
                      <ChevronRight className="w-3 h-3 text-brand-secondary group-hover:translate-x-0.5 transition-transform" />
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
                  placeholder={userType === 'individual' ? "Ask about your career trajectory..." : "Ask about operational transformation..."}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-slate-900 font-medium"
                  id="chat-input"
                />
                <div className="absolute right-1.5 top-1.5 bottom-1.5 flex gap-1 items-center">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                    title={isListening ? "Stop Listening" : "Start Voice Input"}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-8 h-8 bg-brand-primary text-white rounded-xl flex items-center justify-center hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:hover:bg-brand-primary cursor-pointer"
                    id="send-message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-500 relative group overflow-visible ${
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
                  scale: [1, 1.15, 1],
                  opacity: [0.15, 0.35, 0.15],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[-8px] rounded-full bg-brand-secondary/30 blur-xl pointer-events-none"
              />
              
              {/* Pulsing Core Shadow */}
              <motion.div 
                animate={{ 
                  boxShadow: [
                    "0 0 15px rgba(45,212,191,0.2)",
                    "0 0 35px rgba(45,212,191,0.4)",
                    "0 0 15px rgba(45,212,191,0.2)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-slate-900 border border-brand-secondary/30"
              />

              {/* Orbital Rings */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-3px] border border-brand-secondary/20 rounded-[40%]"
              />

              {/* The Intelligence Pattern (Center) */}
              <div className="relative z-10 w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-900 border border-brand-primary/20">
                 <img 
                    src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" 
                    alt="NOVA" 
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
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
            <X className="w-7 h-7 text-white" />
          </motion.div>
        )}

        {/* Insight Badge (Floating above orb) */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-10 right-0 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-brand-secondary/30 shadow-xl whitespace-nowrap pointer-events-none"
          >
            <div className="flex items-center gap-1.5">
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
                setIsOpen(true);
            }}
            messages={messages}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
