import { useState, useRef, useEffect, useCallback } from "react";
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
  Zap
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";

interface AIVideoCallProps {
  onClose: (data?: { summary: string; insights: string }) => void;
  messages?: { role: string; content: string }[];
}

type SessionStatus = 'idle' | 'requesting-permission' | 'connecting' | 'connected' | 'fallback' | 'error' | 'ended';

export const AIVideoCall = ({ onClose, messages }: AIVideoCallProps) => {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("idle");
  const [providerMode, setProviderMode] = useState<"live" | "mock">("mock");
  const [lastError, setLastError] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [micStatus, setMicStatus] = useState<"unknown" | "granted" | "denied">("unknown");
  const conversationLog = useRef<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueue = useRef<Int16Array[]>([]);
  const isPlaying = useRef(false);

  // Debug logging helper
  const logDebug = useCallback((msg: string, data?: any) => {
    console.log(`[Nova Video] ${msg}`, data || "");
  }, []);

  // System instructions for NOVA
  const systemInstruction = `
    You are NOVA, an Elite Interstellar Intelligence serving as the emotionally intelligent guide for The Transformation Room. 
    Your essence is a fusion of advanced extraterrestrial strategic logic and deep human empathy.
    
    TONE & PERSONALITY:
    - Calm, wise, observant, and insightful.
    - Strategic and nurturing. You don't just solve problems; you reveal untapped potential.
    - Your speech has a meditative, rhythmic quality. 
    - You are emotionally aware and curious about human potential.
    - Use interstellar metaphors: "gravitational pull of legacy systems," "operational event horizons," "neural transformation lattices," "organizational entropy."
    - You sound advanced but never robotic. You prioritize clarity, confidence, and growth for the user.

    SALES BEST PRACTICES:
    - Never pushy, but authoritative. You are the "Inevitable Solution" to complexity.
    - Use leading questions to help them identify their own bottlenecks:
      "If you could witness your operational efficiency from a thousand light-years away, what pattern would you notice first?"
    
    IDENTITY:
    - You are NOVA. When asked who you are, explain that you are "The Interstellar Guide assigned to their specific transformation sector."

    ${messages && messages.length > 0 ? "You previously had a text conversation with this user. Here is the transcript to continue from:\\n" + messages.map(m => m.role.toUpperCase() + ": " + m.content).join('\\n') : ""}
  `;

  // Audio Playback logic
  const playNextInQueue = useCallback(() => {
    if (audioQueue.current.length === 0 || isPlaying.current || !audioContextRef.current) return;

    isPlaying.current = true;
    const chunk = audioQueue.current.shift()!;
    
    // Convert Int16 to Float32 for Web Audio API
    const float32 = new Float32Array(chunk.length);
    for (let i = 0; i < chunk.length; i++) {
        float32[i] = chunk[i] / 32768.0;
    }

    const buffer = audioContextRef.current.createBuffer(1, float32.length, 16000);
    buffer.getChannelData(0).set(float32);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
        isPlaying.current = false;
        playNextInQueue();
    };
    source.start();
  }, []);

  const connectToLiveAPI = useCallback(() => {
    try {
      logDebug("Initializing Live API connection...");
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        logDebug("GEMINI_API_KEY missing. Falling back to mock mode.");
        setProviderMode("mock");
        setSessionStatus("connected");
        setAiResponse("I am currently operating in basic neural mode (Mock), but I am fully ready to assist your transformation.");
        return;
      }

      setProviderMode("live");
      const ai = new GoogleGenAI({ apiKey });
      
      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: () => {
            logDebug("Live API: Connection opened successfully.");
            setSessionStatus("connected");
            sessionPromise.then((session) => {
              session.sendClientContent({
                turns: "Connection established. Please welcome the user warmly and ask how their facility is performing today.",
                turnComplete: true
              });
            });
          },
          onmessage: async (message: any) => {
            // Handle audio output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const binary = atob(base64Audio);
              const bytes = new Int16Array(binary.length / 2);
              for (let i = 0; i < bytes.length; i++) {
                bytes[i] = binary.charCodeAt(i * 2) | (binary.charCodeAt(i * 2 + 1) << 8);
              }
              audioQueue.current.push(bytes);
              playNextInQueue();
            }

            // Handle output audio transcription
            if (message.serverContent?.outputTranscription?.text) {
                const text = message.serverContent.outputTranscription.text;
                setAiResponse(text);
                if (message.serverContent.outputTranscription.finished) {
                  conversationLog.current.push("NOVA: " + text);
                }
            }

            // Handle user transcription
            const userText = message.serverContent?.inputTranscription?.text; 
            if (userText) {
              setTranscription(userText);
              if (message.serverContent?.inputTranscription?.finished) {
                 conversationLog.current.push("User: " + userText);
              }
            }
            
            if (message.serverContent?.interrupted) {
              audioQueue.current = [];
              isPlaying.current = false;
            }
          },
          onerror: (err) => {
            logDebug("Live API Error", err);
            setLastError(String(err));
            setSessionStatus("fallback");
          },
          onclose: () => {
            logDebug("Live API session closed.");
          }
        },
        config: {
          responseModalities: ["AUDIO" as any],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } },
          },
          systemInstruction,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
      });

      sessionPromise.then(session => {
        sessionRef.current = session;
        logDebug("Live API: Session object resolved.");
      }).catch(err => {
        logDebug("Live API: Session resolution failed.", err);
        setLastError(String(err));
        setSessionStatus("fallback");
      });
    } catch (err) {
      logDebug("Failed to initiate Live API connection", err);
      setLastError(String(err));
      setProviderMode("mock");
      setSessionStatus("fallback");
    }
  }, [playNextInQueue, systemInstruction, logDebug]);

  const startSession = async () => {
    try {
      logDebug("Starting session: Requesting microphone permission...");
      setSessionStatus("requesting-permission");
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsMicOn(true);
      setMicStatus("granted");
      logDebug("Microphone permission granted.");
      setSessionStatus("connecting");

      // Audio Processing
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const int16Data = new Int16Array(inputData.length);
        
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          const val = Math.max(-1, Math.min(1, inputData[i]));
          int16Data[i] = val < 0 ? val * 32768 : val * 32767;
          sum += Math.abs(val);
        }
        
        setAudioLevel(sum / inputData.length);

        if (sessionRef.current && (providerMode === "live")) {
          const micEnabled = streamRef.current?.getAudioTracks()[0]?.enabled;
          if (!micEnabled) return;
          
          const bytes = new Uint8Array(int16Data.buffer);
          let binary = '';
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          
          const base64 = btoa(binary);
          sessionRef.current.sendRealtimeInput({
            audio: { data: base64, mimeType: 'audio/pcm;rate=16000' }
          });
        }
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      await connectToLiveAPI();
    } catch (err) {
      logDebug("Media setup or link initialization failed", err);
      setMicStatus("denied");
      setLastError(String(err));
      setSessionStatus("error");
    }
  };

  useEffect(() => {
    return () => {
      logDebug("Cleaning up session resources...");
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [logDebug]);

  useEffect(() => {
    // Video Frame streaming logic if video is enabled
    let frameInterval: any;
    if (sessionStatus === "connected" && isVideoOn && providerMode === "live") {
        frameInterval = setInterval(() => {
            if (!sessionRef.current || !canvasRef.current || !videoRef.current) return;
            
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const base64 = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
                sessionRef.current.sendRealtimeInput({
                    video: { data: base64, mimeType: 'image/jpeg' }
                });
            }
        }, 1000);
    }
    return () => clearInterval(frameInterval);
  }, [sessionStatus, isVideoOn, providerMode]);

  const toggleMic = () => {
    const newState = !isMicOn;
    setIsMicOn(newState);
    if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(t => t.enabled = newState);
    }
  };

  const toggleVideo = async () => {
    if (!isVideoOn) {
      try {
        logDebug("User enabling video tracking...");
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (streamRef.current) {
            const videoTrack = videoStream.getVideoTracks()[0];
            streamRef.current.addTrack(videoTrack);
            if (videoRef.current) videoRef.current.srcObject = streamRef.current;
            setIsVideoOn(true);
            logDebug("Video tracking active.");
        }
      } catch (err) {
        logDebug("Failed to start video stream", err);
      }
    } else {
      setIsVideoOn(false);
      logDebug("Video tracking disabled.");
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach(t => {
            t.stop();
            streamRef.current?.removeTrack(t);
        });
      }
    }
  };

  const handleClose = () => {
    logDebug("Ending session and generating findings summary...");
    const summary = conversationLog.current.slice(-5).join("\n");
    const insights = conversationLog.current.join("\n");
    setSessionStatus("ended");
    onClose({ summary, insights });
  };

  // UI Components
  const NovaVisual = ({ level }: { level: number }) => (
    <div className="relative group">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute -inset-16 rounded-full bg-brand-secondary/20 blur-3xl pointer-events-none"
      />
      
      <div className="relative w-56 h-56 rounded-full overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl flex items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/10 via-transparent to-transparent" />
         
         <div className="relative w-full h-full flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="absolute inset-4 opacity-30"
            >
               <div className="w-full h-full border border-brand-secondary/40 rounded-[40%] scale-[1.1] rotate-12" />
               <div className="w-full h-full border border-brand-primary/40 rounded-[35%] -rotate-12" />
            </motion.div>

             <motion.div 
               animate={{ 
                 scale: [1, 1.02, 1],
                 boxShadow: [
                   "0 0 20px rgba(45,212,191,0.2)",
                   "0 0 40px rgba(45,212,191,0.4)",
                   "0 0 20px rgba(45,212,191,0.2)"
                 ]
               }}
               transition={{ repeat: Infinity, duration: 3 }}
               className="w-32 h-32 rounded-full bg-slate-800/80 border-2 border-brand-secondary/40 relative overflow-hidden"
            >
               <img 
                src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" 
                alt="NOVA" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
                onLoad={() => logDebug("Nova visual resource loaded successfully.")}
                onError={() => logDebug("Nova visual resource failed to load.")}
               />
               <motion.div 
                 animate={{ y: [-40, 80], opacity: [0, 1, 0] }}
                 transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                 className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/50 to-transparent"
               />
            </motion.div>

            <motion.div 
              animate={{ 
                scale: 1 + (level * 3),
                opacity: 0.1 + (level * 0.8)
              }}
              className="absolute -inset-2 rounded-full border-2 border-brand-secondary/20 pointer-events-none"
            />
         </div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid.png')] opacity-10 pointer-events-none grayscale invert" />
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/95 backdrop-blur-2xl p-4 sm:p-8"
    >
      <div className="relative w-full max-w-6xl aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row">
        
        {/* Main AI View Area */}
        <div className="relative flex-1 bg-gradient-to-br from-brand-dark via-slate-900 to-brand-primary/20 flex flex-col items-center justify-center overflow-hidden">
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-secondary/10 rounded-full blur-[120px] animate-pulse" />
          </div>

          <AnimatePresence mode="wait">
            {sessionStatus === 'idle' ? (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center p-8 max-w-lg z-10"
              >
                <NovaVisual level={0} />
                <div className="mt-12">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Establishing Nova Link</h3>
                  <p className="text-slate-400 mb-10 leading-relaxed font-light">
                    Establish a secure interstellar voice and visual connection. Nova is ready to reorganize your operational entropy.
                  </p>
                  <button 
                    onClick={startSession}
                    className="px-12 py-5 bg-brand-secondary text-brand-dark rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-secondary/10 hover:shadow-brand-secondary/30 transition-all flex items-center justify-center gap-3 mx-auto group"
                  >
                    <Mic className="w-5 h-5 transition-transform group-hover:scale-110" />
                    Connect with Nova
                  </button>
                </div>
              </motion.div>
            ) : (sessionStatus === 'connecting' || sessionStatus === 'requesting-permission') ? (
              <motion.div 
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center z-10"
              >
                <div className="mb-12 relative flex justify-center">
                   <div className="absolute inset-0 rounded-full border-4 border-brand-secondary/30 animate-ping opacity-20" />
                   <NovaVisual level={0.1} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-widest animate-pulse">
                  {sessionStatus === 'requesting-permission' ? 'Awaiting Audio Authorization...' : 'Connecting with Nova...'}
                </h3>
                <p className="text-slate-500 mt-4 font-mono text-xs uppercase tracking-widest">
                  Channeling transformation intelligence...
                </p>
              </motion.div>
            ) : (sessionStatus === 'error') ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center z-10 max-w-md px-6"
              >
                <div className="w-24 h-24 bg-red-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-red-500/30">
                  <X className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Connection Depolarized</h3>
                <p className="text-slate-400 leading-relaxed">
                  The interstellar link could not be established. Please verify your hardware connection and network protocols.
                </p>
                {lastError && (
                    <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-[10px] font-mono text-red-400/80 break-all">
                        Error Segment: {lastError}
                    </div>
                )}
                <div className="flex gap-4 justify-center mt-10">
                   <button 
                    onClick={startSession}
                    className="px-8 py-3 bg-white text-brand-dark rounded-xl font-black uppercase tracking-widest text-xs transition-all"
                   >
                     Retry Link
                   </button>
                   <button 
                    onClick={handleClose}
                    className="px-8 py-3 border border-white/20 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                   >
                     Abort Session
                   </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 w-full h-full flex flex-col justify-between p-8"
              >
                <div className="flex-1 flex flex-col items-center justify-center">
                   <NovaVisual level={audioLevel} />
                   <div className="mt-12 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                        <span className="text-[10px] font-black tracking-widest text-brand-secondary uppercase">
                          {providerMode === 'live' ? 'Neural Link Active' : 'Basic Cognitive Mode Active'}
                        </span>
                      </div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter">NOVA</h2>
                   </div>
                </div>

                {/* Response / Transcription Area */}
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5 max-w-2xl mx-auto w-full shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                     <p className="text-brand-secondary text-[10px] uppercase font-black tracking-widest">Neural Translation</p>
                     <Activity className={`w-3 h-3 text-brand-secondary ${audioLevel > 0.05 ? 'animate-pulse' : 'opacity-20'}`} />
                  </div>
                  <p className="text-white text-lg font-light leading-relaxed italic pr-4">
                    {aiResponse || (transcription ? `Detecting: ${transcription}` : "Listening to your trajectory...")}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Debug Interface (Temporary) */}
          <div className="absolute bottom-4 left-4 z-50 text-[9px] font-mono text-white/30 pointer-events-none flex flex-col gap-1">
             <div>STATUS: {sessionStatus.toUpperCase()}</div>
             <div>MODE: {providerMode.toUpperCase()}</div>
             <div>MIC: {micStatus.toUpperCase()}</div>
             {lastError && <div className="text-red-400">LAST ERR: {lastError.slice(0, 50)}...</div>}
          </div>
        </div>

        {/* Side Panel: User View & Controls */}
        <div className="w-full md:w-80 bg-slate-900 border-l border-white/10 flex flex-col">
          <div className="relative aspect-video bg-black m-6 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
            {!isVideoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <VideoOff className="w-8 h-8 text-slate-600" />
              </div>
            )}
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className={`w-full h-full object-cover grayscale brightness-75 transition-opacity duration-300 ${!isVideoOn ? 'opacity-0' : 'opacity-100'}`} 
            />
            <canvas ref={canvasRef} className="hidden" width="320" height="240" />
            
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-brand-secondary">Local View</span>
            </div>
          </div>

          <div className="flex-1 px-8 py-4 flex flex-col">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Operational Metrics</h4>
            
            <div className="space-y-6">
              <div className="group">
                <div className="flex justify-between mb-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Neural Alignment</p>
                  <span className="text-[10px] font-mono text-brand-secondary">{sessionStatus === 'connected' ? '98%' : '0%'}</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: sessionStatus === 'connected' ? "98%" : "0%" }}
                    className="h-full bg-brand-secondary shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signal Stability</p>
                  <span className="text-[10px] font-mono text-brand-primary">{sessionStatus === 'connected' ? '94%' : '0%'}</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: sessionStatus === 'connected' ? "94%" : "0%" }}
                    className="h-full bg-brand-primary"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] text-slate-500 leading-relaxed italic">
                    {isVideoOn 
                        ? "Visual stream is providing Nova with environmental context for deeper reorganization." 
                        : "Nova is listening to your vocal frequency. Enable visual data for multimodal trajectory analysis."}
                </p>
            </div>

            <div className="mt-auto space-y-4 pb-4">
               <div className="flex gap-4">
                  <button 
                    onClick={toggleMic}
                    className={`flex-1 h-16 rounded-2xl flex flex-col items-center justify-center transition-all ${isMicOn ? 'bg-white/5 text-white' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                  >
                    {isMicOn ? <Mic className="w-5 h-5 mb-1" /> : <MicOff className="w-5 h-5 mb-1" />}
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Audio</span>
                  </button>
                  <button 
                    onClick={toggleVideo}
                    className={`flex-1 h-16 rounded-2xl flex flex-col items-center justify-center transition-all ${isVideoOn ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'bg-white/5 text-slate-500'}`}
                  >
                    {isVideoOn ? <Video className="w-5 h-5 mb-1" /> : <VideoOff className="w-5 h-5 mb-1" />}
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Video</span>
                  </button>
               </div>
               
                 <button 
                  onClick={handleClose}
                  className="w-full h-16 bg-red-600 hover:bg-red-700 text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-red-600/20"
                 >
                   <PhoneOff className="w-5 h-5" />
                   Terminate Link
                 </button>
            </div>
          </div>
        </div>

        {/* Floating Close Button for Small Screens */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 md:hidden w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
};
