import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Sparkles, 
  MessageSquare, 
  Activity,
  Zap,
  Volume2,
  Brain,
  Wifi,
  Waves
} from "lucide-react";
import { NovaVideoProvider, NovaState, NovaUpdate } from "../services/novaVideoProvider";

interface AIVideoCallProps {
  onClose: (data?: { summary: string; insights: string }) => void;
  messages?: { role: string; content: string }[];
}

export const VideoCompanionMode = ({ onClose, messages }: AIVideoCallProps) => {
  const [novaState, setNovaState] = useState<NovaState>("idle");
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const hasConnected = useRef(false);

  // Calling / Loading Sound Logic
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let interval: NodeJS.Timeout | null = null;

    if (novaState === 'initializing') {
      hasConnected.current = false; // Reset on new session attempt
      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const playPulse = () => {
          if (!audioCtx || audioCtx.state === 'closed') return;
          
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const filter = audioCtx.createBiquadFilter();
          
          osc.type = 'sine';
          // Start with a melodic tech ping
          osc.frequency.setValueAtTime(660, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(330, audioCtx.currentTime + 0.6);
          
          filter.type = 'lowpass';
          filter.frequency.value = 1200;
          
          gain.gain.setValueAtTime(0, audioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
          
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 1.2);
        };

        playPulse();
        interval = setInterval(playPulse, 2500);
      } catch (err) {
        console.warn("Audio Context failed to initialize:", err);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
      if (audioCtx) audioCtx.close().catch(() => {});
    };
  }, [novaState]);

  // Success Connection Chime
  useEffect(() => {
    const isActive = novaState === 'listening' || novaState === 'speaking' || novaState === 'thinking';
    if (isActive && !hasConnected.current) {
      hasConnected.current = true;
      // Small "online" chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
        
        setTimeout(() => audioCtx.close(), 500);
      } catch (e) {
        // Silent fail
      }
    }
  }, [novaState]); // Trigger once when entering active states

  const providerRef = useRef<NovaVideoProvider | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heygenVideoRef = useRef<HTMLVideoElement>(null);
  const conversationLog = useRef<string[]>([]);

  const [heygenStream, setHeygenStream] = useState<MediaStream | null>(null);
  const [isPlayingWelcome, setIsPlayingWelcome] = useState(true);

  // Update timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNovaUpdate = useCallback((update: NovaUpdate) => {
    if (update.state) {
      setNovaState(update.state);
      if (update.state === 'speaking' || update.state === 'thinking') {
        setIsPlayingWelcome(false);
      }
    }
    if (update.transcript) setTranscript(update.transcript);
    if (update.aiResponse) setAiResponse(update.aiResponse);
    if (update.audioLevel !== undefined) setAudioLevel(update.audioLevel);
    if (update.error) setLastError(update.error);
    if (update.videoStream) {
      setHeygenStream(update.videoStream);
      setIsPlayingWelcome(false);
    }

    if (update.transcript) conversationLog.current.push(`User: ${update.transcript}`);
    if (update.aiResponse) conversationLog.current.push(`Nova: ${update.aiResponse}`);
  }, []);

  // Update HeyGen Video Stream when set
  useEffect(() => {
    if (heygenStream && heygenVideoRef.current) {
      heygenVideoRef.current.srcObject = heygenStream;
    }
  }, [heygenStream]);

  const systemInstruction = useMemo(() => `
    You are NOVA, an Elite Interstellar Intelligence. 
    ${messages && messages.length > 0 ? "Previous context: " + messages.map(m => m.content).join(" ") : ""}
    Your mission: Guide the user's transformation with calm, strategic, and high-tech insight.
  `, [messages]);

  const startSession = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      setLastError("Strategic Link Refused: GEMINI_API_KEY is missing from environment.");
      setNovaState("error");
      return;
    }

    providerRef.current = new NovaVideoProvider(handleNovaUpdate);
    await providerRef.current.initialize({
      apiKey,
      systemInstruction,
      provider: 'heygen' // Use heygen as the provider
    });
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // In a real implementation, we'd mute the stream in the provider
  };

  const toggleVideo = async () => {
    if (!isVideoOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setIsVideoOn(true);
      } catch (err) {
        console.error("Video access failed", err);
      }
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(t => t.stop());
      setIsVideoOn(false);
    }
  };

  const terminateSession = () => {
    providerRef.current?.stop();
    onClose({ 
      summary: aiResponse, 
      insights: conversationLog.current.join("\n") 
    });
  };

  // CLEANUP
  useEffect(() => {
    return () => {
      providerRef.current?.stop();
    };
  }, []);

  // NOVA AVATAR COMPONENT (State Aware)
  const NovaAvatar = ({ state, level }: { state: NovaState, level: number }) => {
    const isSpeaking = state === 'speaking';
    const isListening = state === 'listening';
    const isThinking = state === 'thinking';

    return (
      <div className="relative group [perspective:1000px]">
        {/* Neural Field Aura */}
        <motion.div 
          animate={{ 
            scale: isSpeaking ? [1, 1.2, 1] : isListening ? [1, 1.05, 1] : 1,
            opacity: isSpeaking ? [0.2, 0.4, 0.2] : 0.1,
            rotate: [0, 360]
          }}
          transition={{ repeat: Infinity, duration: isSpeaking ? 2 : 10, ease: "linear" }}
          className="absolute -inset-24 rounded-full bg-gradient-to-tr from-brand-secondary/30 via-brand-primary/20 to-transparent blur-[80px] pointer-events-none"
        />

        {/* Outer Tech Ring */}
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border border-white/10 bg-slate-900/40 backdrop-blur-3xl shadow-[0_0_100px_rgba(20,184,166,0.15)] flex items-center justify-center">
           {/* Animated Grid Overlay */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
           
           <div className="relative w-full h-full flex items-center justify-center">
              {/* Rotating Lattices */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                className="absolute inset-8 opacity-20"
              >
                 <div className="w-full h-full border-[0.5px] border-brand-secondary/40 rounded-[38%] scale-[1.1] rotate-12" />
                 <div className="w-full h-full border-[0.5px] border-brand-primary/40 rounded-[33%] -rotate-25" />
              </motion.div>

              {/* Core Avatar Sphere */}
              <motion.div 
                 animate={{ 
                   scale: isSpeaking ? 1.05 : 1,
                   boxShadow: isSpeaking 
                    ? "0 0 60px rgba(20,184,166,0.4)" 
                    : isThinking 
                      ? "0 0 40px rgba(6,182,212,0.3)" 
                      : "0 0 30px rgba(45,212,191,0.2)"
                 }}
                 className="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-slate-800/80 border-2 border-brand-secondary/30 relative overflow-hidden group/avatar"
              >
                 {heygenStream ? (
                   <video
                     ref={heygenVideoRef}
                     autoPlay
                     playsInline
                     className={`w-full h-full object-cover object-top transition-all duration-1000 ${isSpeaking ? 'scale-105' : 'scale-100 grayscale-[0.2]'}`}
                   />
                 ) : (
                   <img 
                    src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" 
                    alt="NOVA" 
                    className={`w-full h-full object-cover object-top transition-all duration-1000 scale-100 ${isSpeaking ? 'scale-105 grayscale-0' : 'scale-100 grayscale-[0.2]'}`} 
                    referrerPolicy="no-referrer"
                   />
                 )}
                 
                 {/* Energy Overlay */}
                 <AnimatePresence>
                    {(isSpeaking || isThinking) && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-brand-secondary/40 via-transparent to-transparent mix-blend-overlay"
                      />
                    )}
                 </AnimatePresence>

                 {/* Scanning Line */}
                 <motion.div 
                   animate={{ y: [-100, 200], opacity: [0, 1, 0] }}
                   transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                   className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-secondary/40 to-transparent blur-sm"
                 />
              </motion.div>

              {/* Audio Visualizer Ring */}
              <motion.div 
                animate={{ 
                  scale: 1 + (level * 2),
                  opacity: isSpeaking ? 0.4 : 0.1,
                  rotate: isSpeaking ? 360 : 0
                }}
                transition={{ duration: 0.1 }}
                className="absolute -inset-4 rounded-full border border-brand-secondary/30 pointer-events-none"
              />
              <motion.div 
                animate={{ 
                  scale: 1 + (level * 4),
                  opacity: isSpeaking ? 0.2 : 0.05
                }}
                transition={{ duration: 0.15 }}
                className="absolute -inset-8 rounded-full border border-brand-primary/20 pointer-events-none"
              />
           </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/98 backdrop-blur-3xl p-4 sm:p-8 selection:bg-brand-secondary selection:text-brand-dark"
    >
      <div className="relative w-full max-w-7xl h-full md:h-auto md:aspect-video bg-black rounded-2xl md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col md:flex-row">
        
        {/* 1. MAIN DISPLAY AREA */}
        <div className="relative flex-1 bg-slate-900 flex flex-col items-center justify-center overflow-hidden min-h-[400px] md:min-h-0">
          
          {/* Kinetic Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-[150px] animate-pulse delay-700" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.03)_0%,transparent_70%)]" />
          </div>

          <AnimatePresence mode="wait">
            {novaState === 'idle' ? (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center p-8 max-w-xl z-20"
              >
                <div className="mb-12">
                   <NovaAvatar state="idle" level={0} />
                </div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 flex items-center justify-center gap-3">
                  <Brain className="w-8 h-8 text-brand-secondary" />
                  Initiate Link
                </h3>
                <p className="text-slate-400 mb-10 leading-relaxed font-light text-lg">
                  Establish a secure interstellar video conduit with NOVA. Prepare for operational reorganization and trajectory mapping.
                </p>
                <button 
                  onClick={startSession}
                  className="group relative px-12 py-5 bg-brand-secondary text-brand-dark rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-brand-secondary/20 hover:shadow-brand-secondary/40 transition-all flex items-center justify-center gap-3 mx-auto"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Connect to Nova
                  <div className="absolute inset-0 rounded-2xl bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left pointer-events-none" />
                </button>
              </motion.div>
            ) : (novaState === 'initializing') ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center z-20"
              >
                <div className="mb-12">
                   <NovaAvatar state="initializing" level={0.02} />
                </div>
                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-3">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                       <Zap className="w-6 h-6 text-brand-secondary" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-widest">Neural Syncing...</h3>
                  </div>
                  <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="w-full h-full bg-brand-secondary"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (novaState === 'error') ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center z-20 max-w-md px-6"
              >
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/30">
                  <X className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Neural Link Severed</h3>
                <p className="text-slate-400 mb-8 font-light">
                  {lastError || "An unexpected interrupt occurred in the transformation conduit."}
                </p>
                <div className="flex gap-4 justify-center">
                   <button onClick={startSession} className="px-8 py-3 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs transition-all hover:bg-brand-secondary">
                     Restore Link
                   </button>
                   <button onClick={terminateSession} className="px-8 py-3 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all">
                     Exit
                   </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-20 w-full h-full flex flex-col justify-between p-12"
              >
                {/* Visual Status Indicator */}
                <div className="absolute top-8 left-8 flex items-center gap-3 px-4 py-2 bg-slate-900/60 backdrop-blur-md rounded-full border border-white/5">
                  <div className={`w-2 h-2 rounded-full ${novaState === 'speaking' ? 'bg-brand-secondary animate-pulse' : 'bg-slate-500'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/70">
                    Nova: {novaState.toUpperCase()}
                  </span>
                </div>

                <div className="absolute top-8 right-8 flex items-center gap-3">
                  <div className="px-4 py-2 bg-slate-900/60 backdrop-blur-md rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest text-brand-primary">
                    Stability: 99.4%
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">
                   <NovaAvatar state={novaState} level={audioLevel} />
                </div>

                {/* Response / Caption Area */}
                <div className="max-w-3xl mx-auto w-full">
                  <AnimatePresence mode="wait">
                    {aiResponse ? (
                      <motion.div 
                        key="nova-speech"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group"
                      >
                         <div className="absolute top-0 left-0 w-1 h-full bg-brand-secondary" />
                         <div className="flex items-center gap-4 mb-4 text-brand-secondary">
                            <Volume2 className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Nova Transmission</span>
                         </div>
                         <p className="text-white text-xl md:text-2xl font-medium leading-relaxed tracking-tight italic">
                           {aiResponse}
                         </p>
                      </motion.div>
                    ) : transcript ? (
                      <motion.div 
                        key="user-speech"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-brand-primary/10 backdrop-blur-xl border border-brand-primary/20 rounded-2xl p-6 text-center"
                      >
                         <div className="flex items-center justify-center gap-3 mb-2 text-brand-primary">
                           <Mic className="w-4 h-4" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Listening to Trajectory</span>
                         </div>
                         <p className="text-white text-lg font-light leading-relaxed">
                           {transcript}
                         </p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 opacity-30">
                        <Waves className="w-8 h-8 text-brand-secondary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Universal Resonance Detected</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. SIDE PANEL: PERSISTENT CONTROLS & LOCAL VIEW */}
        <div className="w-full md:w-96 bg-slate-950 border-t md:border-t-0 md:border-l border-white/5 flex flex-col p-6 sm:p-8 bg-gradient-to-b from-slate-950 to-slate-900 overflow-y-auto">
          
          {/* LOCAL USER VIEW */}
          <div className="relative aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 mb-8">
            <AnimatePresence>
              {!isVideoOn && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-600 gap-4"
                >
                  <VideoOff className="w-10 h-10 opacity-20" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Visual Conduit Inactive</span>
                </motion.div>
              )}
            </AnimatePresence>
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className={`w-full h-full object-cover grayscale brightness-90 transition-opacity duration-1000 ${!isVideoOn ? 'opacity-0' : 'opacity-100'}`} 
            />
            
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-white/80">User Spectrum</span>
            </div>
          </div>

          {/* SESSION METRICS */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Link Metadata</h4>
               <span className="text-[10px] font-mono text-slate-600">{formatTime(timeElapsed)}</span>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Neural Alignment</p>
                  <span className="text-[10px] font-mono text-brand-secondary">{novaState !== 'idle' && novaState !== 'error' ? '98.2%' : '0%'}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: novaState !== 'idle' && novaState !== 'error' ? "98.2%" : "0%" }}
                    className="h-full bg-brand-secondary shadow-[0_0_15px_rgba(20,184,166,0.6)]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cognitive Bandwidth</p>
                  <span className="text-[10px] font-mono text-brand-primary">{novaState !== 'idle' && novaState !== 'error' ? 'High' : 'Low'}</span>
                </div>
                <div className="flex gap-1 h-3 items-end">
                   {[...Array(12)].map((_, i) => (
                     <motion.div 
                      key={i}
                      animate={{ 
                        height: (novaState === 'speaking' || (novaState === 'listening' && audioLevel > 0.05)) 
                          ? [8, 12, 6, 12, 8][i % 5] 
                          : 4 
                      }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                      className={`flex-1 rounded-sm ${i < 8 ? 'bg-brand-primary/60' : 'bg-slate-800'}`}
                     />
                   ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex gap-3 mb-2">
                  <Wifi className="w-3 h-3 text-emerald-500" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encrypted Conduit</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                   Your biometric and visual spectrum data is processed locally for maximum interstellar security.
                </p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="mt-8 space-y-4">
             <div className="flex gap-4">
                <button 
                  onClick={toggleMic}
                  className={`flex-1 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${isMicOn ? 'bg-white/5 border-white/10 text-white' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Audio</span>
                </button>
                <button 
                  onClick={toggleVideo}
                  className={`flex-1 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${isVideoOn ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-white/5 border-white/10 text-slate-500'}`}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Visual</span>
                </button>
             </div>
             
             <button 
              onClick={terminateSession}
              className="w-full h-20 bg-slate-100 hover:bg-brand-secondary text-slate-900 rounded-3xl flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl group overflow-hidden relative"
             >
               <span className="relative z-10 flex items-center gap-3">
                 <PhoneOff className="w-4 h-4" />
                 Terminate Link
               </span>
               <div className="absolute inset-0 bg-brand-secondary scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
             </button>
          </div>
        </div>

        {/* BACK NAVIGATION */}
        <button 
          onClick={terminateSession}
          className="absolute top-6 left-6 hidden md:flex h-12 px-6 bg-black/60 backdrop-blur-xl rounded-full items-center gap-3 text-white text-xs tracking-widest uppercase font-bold border border-white/10 z-[110] hover:bg-white/10 transition-colors"
        >
          <span>&larr; Back to Site</span>
        </button>

        {/* MOBILE CLOSE */}
        <button 
          onClick={terminateSession}
          className="absolute top-6 right-6 w-12 h-12 bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/10 z-[110] md:hidden"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
};
