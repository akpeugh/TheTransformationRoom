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

export const AIVideoCall = ({ onClose, messages }: AIVideoCallProps) => {
  const [status, setStatus] = useState<"connecting" | "active" | "error">("connecting");
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const conversationLog = useRef<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueue = useRef<Int16Array[]>([]);
  const isPlaying = useRef(false);

  // System instructions for NOVA: The Interstellar Guide
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

  const connectToLiveAPI = useCallback(async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: () => {
            setStatus("active");
            console.log("Connected to NOVA");
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

            // Handle transcription
            if (message.serverContent?.modelTurn?.parts[0]?.text) {
                const text = message.serverContent.modelTurn.parts[0].text;
                setAiResponse(prev => prev + " " + text);
                conversationLog.current.push("AI: " + text);
            }

            // Handle user transcription
            const userText = message.serverContent?.turnComplete ? "" : ""; 
            if (userText) setTranscription(userText);
            
            // Handle interruption
            if (message.serverContent?.interrupted) {
              audioQueue.current = [];
              isPlaying.current = false;
            }
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setStatus("error");
          },
          onclose: () => {
            console.log("Session closed");
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

      sessionRef.current = session;
    } catch (err) {
      console.error("Failed to connect:", err);
      setStatus("error");
    }
  }, [playNextInQueue, systemInstruction]);

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsMicOn(true);
      setIsSessionStarted(true);

      // Audio Processing
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      processor.onaudioprocess = (e) => {
        if (!sessionRef.current || status !== "active" || !isMicOn) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        const int16Data = new Int16Array(inputData.length);
        
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          const val = Math.max(-1, Math.min(1, inputData[i]));
          int16Data[i] = val < 0 ? val * 32768 : val * 32767;
          sum += Math.abs(val);
        }
        setAudioLevel(sum / inputData.length);

        const base64 = btoa(String.fromCharCode(...new Uint8Array(int16Data.buffer)));
        sessionRef.current.sendRealtimeInput({
          audio: { data: base64, mimeType: 'audio/pcm;rate=16000' }
        });
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      await connectToLiveAPI();
    } catch (err) {
      console.error("Media setup failed:", err);
      setStatus("error");
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  useEffect(() => {
    // Video Frame streaming logic if video is enabled
    let frameInterval: any;
    if (isSessionStarted && isVideoOn && status === "active") {
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
  }, [isSessionStarted, isVideoOn, status]);

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
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (streamRef.current) {
            const videoTrack = videoStream.getVideoTracks()[0];
            streamRef.current.addTrack(videoTrack);
            if (videoRef.current) videoRef.current.srcObject = streamRef.current;
            setIsVideoOn(true);
        }
      } catch (err) {
        console.error("Failed to start video:", err);
      }
    } else {
      setIsVideoOn(false);
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach(t => {
            t.stop();
            streamRef.current?.removeTrack(t);
        });
      }
    }
  };

  const handleClose = () => {
    const summary = conversationLog.current.slice(-5).join("\n");
    const insights = conversationLog.current.join("\n");
    onClose({ summary, insights });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/95 backdrop-blur-2xl p-4 sm:p-8"
    >
      <div className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row">
        
        {/* Main AI View Area */}
        <div className="relative flex-1 bg-gradient-to-br from-brand-dark via-slate-900 to-brand-primary/20 flex flex-col items-center justify-center overflow-hidden">
          
          {/* Holographic Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-150 transform rotate-12" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-secondary/10 rounded-full blur-[120px] animate-pulse" />
          </div>

          <AnimatePresence mode="wait">
            {!isSessionStarted ? (
              <motion.div 
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center p-8 max-w-lg"
              >
                <div className="w-24 h-24 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-secondary/20 relative">
                   <div className="absolute inset-0 rounded-full border border-brand-secondary/30 animate-pulse" />
                   <Sparkles className="w-10 h-10 text-brand-secondary" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Initialize NOVA Session</h3>
                <p className="text-slate-400 mb-10 leading-relaxed font-light">
                  Establish a secure interstellar link. You will be connected via a high-fidelity audio stream. Visual data transmission is disabled by default.
                </p>
                <button 
                  onClick={startSession}
                  className="px-12 py-5 bg-brand-secondary text-brand-dark rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-secondary/10 hover:shadow-brand-secondary/30 transition-all flex items-center justify-center gap-3 mx-auto group"
                >
                  <Mic className="w-5 h-5 transition-transform group-hover:scale-110" />
                  Grant Audio Link & Begin Session
                </button>
                <p className="text-[10px] text-slate-500 mt-6 uppercase font-bold tracking-widest">Powered by NOVA Intelligence</p>
              </motion.div>
            ) : status === "connecting" ? (
              <motion.div 
                key="connecting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-secondary/30 animate-ping" />
                  <div className="absolute inset-0 rounded-full border-4 border-brand-secondary/50 animate-pulse" />
                  <div className="absolute inset-4 rounded-full bg-brand-secondary/20 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-brand-secondary animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-widest">Initialization Packet</h3>
                <p className="text-slate-400 mt-2 font-mono text-sm">Aligning cognitive lattices with NOVA...</p>
              </motion.div>
            ) : status === "error" ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <X className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Signal Depolarized</h3>
                <p className="text-slate-400 mt-2">The neural link failed. Check your hardware or network.</p>
                <button 
                  onClick={handleClose}
                  className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black uppercase tracking-widest text-sm transition-all"
                >
                  Terminate Session
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 w-full h-full flex flex-col justify-between p-8"
              >
                {/* AI Persona Representation */}
                <div className="flex-1 flex flex-col items-center justify-center">
                   <div className="relative group">
                      {/* Outer Glow Halo */}
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute -inset-16 rounded-full bg-brand-secondary/20 blur-3xl pointer-events-none"
                      />
                      
                      <div className="relative w-56 h-56 rounded-full overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl flex items-center justify-center">
                         {/* Inner Atmosphere */}
                         <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/10 via-transparent to-transparent" />
                         
                         {/* The Consciousness Pattern - Suggestive of intelligence */}
                         <div className="relative w-full h-full flex items-center justify-center">
                            {/* Rotating Intelligence Lattice */}
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                              className="absolute inset-4 opacity-30"
                            >
                               <div className="w-full h-full border border-brand-secondary/40 rounded-[40%] scale-[1.1] rotate-12" />
                               <div className="w-full h-full border border-brand-primary/40 rounded-[35%] -rotate-12" />
                            </motion.div>

                            {/* Cognitive Core */}
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
                               <img src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" alt="NOVA" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                               
                               {/* Neural Activity Scanline */}
                               <motion.div 
                                 animate={{ y: [-40, 80], opacity: [0, 1, 0] }}
                                 transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                                 className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/50 to-transparent"
                               />
                            </motion.div>

                            {/* Reactive Audio Orbit */}
                            <motion.div 
                              animate={{ 
                                scale: 1 + (audioLevel * 3),
                                opacity: 0.1 + (audioLevel * 0.8)
                              }}
                              className="absolute -inset-2 rounded-full border-2 border-brand-secondary/20 pointer-events-none"
                            />
                         </div>
                         
                         {/* Scanning grid overlay */}
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid.png')] opacity-10 pointer-events-none grayscale invert" />
                      </div>
                   </div>

                      <div className="mt-12 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                        <span className="text-[10px] font-black tracking-widest text-brand-secondary uppercase">NOVA is Interacting</span>
                      </div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter">NOVA</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Interstellar Intelligence Guide</p>
                      
                      {/* Audio Level Visualizer */}
                      <div className="h-1 flex gap-1 justify-center mt-6 w-32 mx-auto">
                        {[...Array(8)].map((_, i) => (
                           <motion.div 
                             key={i}
                             animate={{ 
                               height: Math.random() * 20 + 2,
                               backgroundColor: audioLevel > 0.1 ? "#2DD4BF" : "#334155" 
                             }}
                             className="w-1 rounded-full bg-slate-700"
                           />
                        ))}
                      </div>
                   </div>
                </div>

                {/* Captions area */}
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 max-w-2xl mx-auto w-full">
                  <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Neural Translation</p>
                  <p className="text-white text-sm font-medium leading-relaxed italic">
                    {aiResponse || "Waiting for initialization packet..."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Side Panel: User View & Controls */}
        <div className="w-full md:w-80 bg-slate-900 border-l border-white/10 flex flex-col">
          {/* User Preview */}
          <div className="relative aspect-video bg-black m-4 rounded-xl overflow-hidden shadow-xl border border-white/5">
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
              className={`w-full h-full object-cover grayscale brightness-75 ${!isVideoOn ? 'invisible' : ''}`} 
            />
            <canvas ref={canvasRef} className="hidden" width="320" height="240" />
            
            {/* Overlay Info */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">You</span>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Discovery Metrics</h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Cognitive Load</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: status === "active" ? "64%" : "0%" }}
                      className="h-full bg-brand-secondary"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-brand-secondary">64%</span>
                </div>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Signal Fidelity</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: status === "active" ? "92%" : "0%" }}
                      className="h-full bg-brand-primary"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-brand-primary">92%</span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-4 pt-12">
               <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <button 
                      onClick={toggleMic}
                      className={`h-14 rounded-2xl flex items-center justify-center transition-all ${isMicOn ? 'bg-white/5 text-white active:bg-white/10' : 'bg-red-500/20 text-red-500'}`}
                    >
                      {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                    </button>
                    <span className="text-[8px] text-center font-black uppercase tracking-widest text-slate-500">Audio Stream</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <button 
                      onClick={toggleVideo}
                      className={`h-14 rounded-2xl flex items-center justify-center transition-all ${isVideoOn ? 'bg-brand-primary/10 text-brand-primary active:bg-brand-primary/20' : 'bg-white/5 text-slate-500'}`}
                    >
                      {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                    </button>
                    <span className="text-[8px] text-center font-black uppercase tracking-widest text-slate-500">Visual Data</span>
                  </div>
               </div>
               
                 <p className="text-[9px] text-slate-500 text-center italic mb-2">Voice stream active. Enable Visual Data to allow NOVA to scan physical environments or documents.</p>
                 
                 <button 
                  onClick={handleClose}
                  className="w-full h-16 bg-red-600 hover:bg-red-700 text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-red-600/20"
                 >
                   <PhoneOff className="w-6 h-6" />
                   End NOVA Session
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
