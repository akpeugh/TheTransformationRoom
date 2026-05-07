import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Sparkles, Zap } from "lucide-react";

export const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return p + 0.5;
      });
    }, 20);

    const stepTimer = setTimeout(() => setStep(1), 1500);
    const stepTimer2 = setTimeout(() => setStep(2), 3000);
    const completeTimer = setTimeout(onComplete, 5500);

    return () => {
      clearInterval(timer);
      clearTimeout(stepTimer);
      clearTimeout(stepTimer2);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0 opacity-40">
        <video 
          src="https://storage.googleapis.com/thetransformationroomassets/Avatar_Video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-[2.5]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/40 to-slate-950 z-10" />
      </div>

      <div className="relative z-20 flex flex-col items-center max-w-lg px-8 text-center">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-brand-secondary/20 rounded-full flex items-center justify-center mb-12 border border-brand-secondary/30 relative"
        >
          <Bot className="w-12 h-12 text-brand-secondary" />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-brand-secondary/20 rounded-full blur-xl"
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Initializing Link</h2>
              <p className="text-slate-400 font-light tracking-widest text-xs uppercase">Connecting to Interstellar Intelligence...</p>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Mapping Trajectories</h2>
              <p className="text-slate-400 font-light tracking-widest text-xs uppercase">Synchronizing Neural Alignment...</p>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Transformation Ready</h2>
              <p className="text-brand-secondary font-black tracking-[0.2em] text-xs uppercase animate-pulse">Link Established</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 w-64 h-1 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-brand-secondary"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-4 flex items-center gap-6 opacity-30">
          <Sparkles className="w-4 h-4 text-white" />
          <div className="w-1 h-1 rounded-full bg-white" />
          <Zap className="w-4 h-4 text-white" />
          <div className="w-1 h-1 rounded-full bg-white" />
          <Bot className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Decorative scan lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
    </motion.div>
  );
};
