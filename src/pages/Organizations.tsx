import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  Briefcase, 
  Database, 
  Settings, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Map as LucideMap, 
  Rocket, 
  Users, 
  Zap, 
  RefreshCcw, 
  ChevronDown, 
  Factory, 
  Layers, 
  CheckCircle2,
  Bot,
  Play
} from "lucide-react";
import { ScorecardTool } from "../components/ScorecardTool";
import { CORPORATE_PAYMENT, DISCOVERY_CALL_1HR } from "../constants";

const Organizations = () => {
  const [activeChallenge, setActiveChallenge] = useState<number | null>(0);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tool') === 'scorecard') {
      setTimeout(() => {
        document.getElementById('strategic-scorecard-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [location.search]);

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 800], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0]);

  const challenges = [
    {
      title: "Capacity & Throughput",
      issue: "Operations hitting physical limits or seasonal bottlenecks.",
      solution: "Space optimization through AS/RS and intelligent slotting strategies.",
      outcome: "2.5x increase in vertical cube use."
    },
    {
      title: "Labor Instability",
      issue: "High turnover and skill gaps in critical facility roles.",
      solution: "Workforce enablement via AR/VR training and ergonomic robotics.",
      outcome: "40% reduction in training ramp-up time."
    },
    {
      title: "Hidden Inefficiency",
      issue: "Fragmented systems creating 'dark data' and blind spots.",
      solution: "Unified digital visibility and predictive ROI dashboarding.",
      outcome: "15% reduction in OpEx through data-driven decisions."
    }
  ];

  return (
    <div className="bg-slate-900 min-h-screen pb-24 font-sans selection:bg-brand-secondary selection:text-brand-dark">
      <header className="relative py-40 bg-brand-primary overflow-hidden perspective-1000">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 bg-brand-dark/40 z-10" />
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000" 
            alt="Logistics Facility" 
            className="w-full h-full object-cover opacity-60 scale-105"
          />
        </motion.div>
        
        {/* Floating Corporate Tech Nodes */}
        <motion.div style={{ y: yHero }} className="absolute inset-0 pointer-events-none z-20">
          {[
            { icon: <Briefcase className="w-6 h-6" />, pos: "top-[15%] left-[10%]", label: "Strategy" },
            { icon: <Database className="w-6 h-6" />, pos: "bottom-[20%] right-[15%]", label: "Data Architecture" },
            { icon: <Settings className="w-6 h-6" />, pos: "top-[65%] left-[5%]", label: "Industrial Ops" },
            { icon: <Sparkles className="w-6 h-6" />, pos: "top-[25%] right-[10%]", label: "AI Integration" }
          ].map((node, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -30, 0],
                rotateX: [0, 10, 0],
                rotateY: [0, -10, 0],
                opacity: [0.4, 0.9, 0.4]
              }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute ${node.pos} hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl z-30`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="text-brand-secondary" style={{ transform: "translateZ(20px)" }}>{node.icon}</div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest" style={{ transform: "translateZ(10px)" }}>{node.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 relative z-30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20, rotateY: 5 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-secondary/10 border border-brand-secondary/30 rounded-full mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">Operational Intelligence Mode Active</span>
              </div>
              <motion.h1 
                className="text-6xl md:text-8xl font-bold text-white mb-8 leading-[0.9] tracking-tighter drop-shadow-2xl"
                whileHover={{ rotateX: 5, rotateY: -5, textShadow: "0px 10px 30px rgba(255,255,255,0.2)" }}
              >
                Operational <br /><span className="text-brand-secondary">Excellence.</span>
              </motion.h1>
              <p className="text-xl text-slate-300 max-w-xl leading-relaxed font-light drop-shadow-lg">
                We empower middle-market to enterprise leaders to outgrow operational complexity. Our approach merges industrial systems with cognitive strategy.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                 <Link to="/contact" className="bg-white text-brand-dark px-10 py-5 rounded-full font-bold text-lg hover:bg-brand-secondary hover:scale-105 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 cursor-pointer">
                    Start Transformation <ArrowRight className="w-5 h-5" />
                 </Link>
                 <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat', { detail: { prompt: "Are you looking to explore personal transformation services for yourself, or are you seeking strategic solutions for an organization? I can help you find the right path relative to your unique goals." } }))}
                  className="px-8 py-5 rounded-full font-bold text-lg border border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2 group cursor-pointer text-white"
                 >
                    Consult NOVA <Sparkles className="w-5 h-5 text-brand-secondary group-hover:rotate-12 transition-transform" />
                 </button>
              </div>

              <div className="mt-12 flex flex-wrap gap-10">
                {[
                  { val: "22%+", label: "Efficiency Lift" },
                  { val: "3.5x", label: "Throughput ROI" },
                  { val: "15%", label: "Retention Bonus" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.1, originX: 0 }}
                  >
                    <p className="text-4xl font-bold text-white mb-1 drop-shadow-md text-shine">{stat.val}</p>
                    <p className="text-[10px] text-brand-secondary uppercase font-black tracking-widest">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.9, rotateX: -5 }}
               animate={{ opacity: 1, scale: 1, rotateX: 0 }}
               whileHover={{ rotateY: -3, rotateX: 3, scale: 1.02 }}
               transition={{ duration: 0.8 }}
               className="bg-white/10 backdrop-blur-3xl border border-white/20 p-10 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] transform-gpu hover:shadow-[0_60px_100px_rgba(0,0,0,0.6)]"
               style={{ transformStyle: "preserve-3d" }}
            >
                <h3 className="text-2xl font-bold text-white mb-8" style={{ transform: "translateZ(30px)" }}>Identify Your Biggest Bottleneck</h3>
                <div className="space-y-4" style={{ transform: "translateZ(20px)" }}>
                  {challenges.map((challenge, i) => (
                    <button
                      key={i}
                      onMouseEnter={() => setActiveChallenge(i)}
                      className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 transform-gpu ${
                        activeChallenge === i 
                          ? 'bg-brand-secondary border-brand-secondary text-slate-900 shadow-[0_20px_40px_rgba(20,184,166,0.3)] scale-105 z-10 relative' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">{challenge.title}</span>
                        {activeChallenge === i && <ArrowRight className="w-5 h-5" />}
                      </div>
                      <AnimatePresence mode="popLayout">
                        {activeChallenge === i && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="text-sm font-medium mb-1 opacity-90">{challenge.issue}</p>
                            <p className="text-xs font-bold uppercase tracking-widest mt-3 opacity-60">Success Metric: {challenge.outcome}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                   ))}
                </div>
                <div className="mt-8 border-t border-white/10 pt-8" style={{ transform: "translateZ(30px)" }}>
                   <p className="text-slate-300 text-sm mb-4 font-medium text-center">Ready to see where your operation stands?</p>
                   <button 
                     onClick={() => document.getElementById('strategic-scorecard-section')?.scrollIntoView({ behavior: 'smooth' })}
                     className="w-full bg-brand-secondary text-slate-900 hover:bg-white hover:text-brand-dark px-8 py-5 rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.6)] hover:-translate-y-1 flex items-center justify-center gap-3 text-lg leading-none group cursor-pointer"
                   >
                     Consult with NOVA <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
            </motion.div>
          </div>
        </div>

        {/* Curved bottom transition to podcast section */}
        <div className="absolute bottom-0 inset-x-0 overflow-hidden w-full" style={{ transform: "translateY(1px)", lineHeight: 0 }}>
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 100V40C0 40 360 0 720 0C1080 0 1440 40 1440 40V100H0Z" fill="#0f172a" />
          </svg>
        </div>
      </header>

      {/* Audio Overview Section */}
      <section className="py-24 bg-slate-900 relative">
        {/* Background blend from hero to this section */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-brand-primary/20 to-transparent z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full mb-8 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">Featured Podcast Episode</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                  Escape the Trap of <br className="hidden md:block"/>
                  <span className="text-brand-secondary">Manual Heroics.</span>
                </h2>
                <div className="w-20 h-1.5 bg-brand-secondary mb-8 rounded-full" />
                <p className="text-lg text-slate-300 mb-6 leading-relaxed font-light">
                  Listen to the latest episode of The Transformation Room Podcast. A dynamic discussion between two industry experts on how we build scalable, automated operational ecosystems. We explore moving past daily firefighting into a state of structural resilience.
                </p>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed font-light">
                  Discover how we integrate <span className="font-bold text-white">AI strategy, industrial hardware, and workforce experience</span> into a single, high-output engine powered by our Four Pillars of Transformation:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {[
                    "Optimized Process",
                    "Tech Strategy",
                    "Real-Time Insights",
                    "Workforce Alignment"
                  ].map((pillar, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-secondary/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-brand-secondary" />
                      </div>
                      <span className="text-slate-200 font-bold text-sm tracking-wide">{pillar}</span>
                    </div>
                  ))}
                </div>

                <Link to="/contact" className="inline-flex items-center gap-3 bg-brand-secondary text-brand-dark px-8 py-4 rounded-xl font-bold hover:bg-white transition-all shadow-xl hover:shadow-brand-secondary/30 active:scale-95 group">
                  Book a Discovery Call
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative border border-slate-800"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Audio Player UI */}
                <div className="absolute -top-5 -right-5 md:-top-8 md:-right-8 bg-brand-secondary text-brand-dark px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl transform rotate-3 flex items-center gap-2 border border-white/20">
                  <Sparkles className="w-4 h-4" />
                  <span>Our Podcast</span>
                </div>
                
                <div className="mb-10 text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">The Transformation Room</h3>
                  <p className="text-brand-secondary font-bold text-xs uppercase tracking-[0.2em]">Scaling Beyond Legacy Heroics</p>
                </div>

                <div className="bg-slate-800 p-6 md:p-8 rounded-3xl border border-white/5 shadow-inner">
                  <div className="flex flex-col gap-6">
                    <div className="w-full flex items-center justify-center py-4 opacity-50 relative h-16">
                       {/* Mock waveform */}
                       <div className="absolute inset-x-0 flex items-end justify-center h-full gap-2 px-4">
                         {[...Array(24)].map((_, i) => (
                           <motion.div 
                             key={i}
                             animate={{ height: ['30%', `${Math.random() * 70 + 30}%`, '30%'] }}
                             transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() }}
                             className="w-1.5 bg-brand-secondary rounded-t-sm"
                           />
                         ))}
                       </div>
                    </div>
                    <button 
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('play-global-podcast', {
                           detail: {
                             title: "Scaling Beyond Legacy Heroics",
                             url: "https://storage.googleapis.com/thetransformationroomassets/Scaling_Beyond_Legacy_Heroics.m4a"
                           }
                        }));
                      }}
                      className="w-full bg-brand-secondary text-brand-dark py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      Listen to Podcast
                    </button>
                  </div>
                </div>
                
                <div className="mt-10 grid grid-cols-2 gap-4 text-center">
                   <div className="bg-slate-800/50 rounded-2xl p-5 border border-white/5 hover:bg-slate-800 transition-colors">
                      <span className="block text-white font-bold text-xl md:text-2xl mb-1">Expert</span>
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Discussion</span>
                   </div>
                   <div className="bg-slate-800/50 rounded-2xl p-5 border border-white/5 hover:bg-slate-800 transition-colors">
                      <span className="block text-white font-bold text-xl md:text-2xl mb-1">Systems</span>
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Focus</span>
                   </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll connector to next section */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-20 translate-y-1/2">
          <div className="w-0.5 h-16 bg-gradient-to-b from-brand-secondary/0 to-brand-secondary" />
          <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.5)]">
            <ChevronDown className="w-6 h-6 text-brand-dark animate-bounce" />
          </div>
        </div>
      </section>

      {/* Tiered Offerings Section */}
      <section className="py-32 pt-24 relative bg-slate-900 overflow-hidden">
        {/* Deep graphical background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/40 via-slate-900 to-slate-900 z-0" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-secondary/10 blur-[150px] -translate-y-1/2 z-0" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-brand-primary/20 blur-[150px] translate-y-1/2 z-0" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0" />

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Service Integration Models</h2>
            <div className="w-24 h-1.5 bg-brand-secondary mx-auto mb-12 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.6)]" />
            <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
              Scalable transformation paths designed to meet you where your operation is today, while preparing you for where it will be tomorrow.
            </p>
          </div>

          {/* New 3 Ways / Flow Section */}
          <div className="mb-32 relative z-10 bg-slate-800/80 border border-slate-700/50 rounded-[3rem] p-12 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 blur-[100px] pointer-events-none" />
            <h3 className="text-4xl font-bold text-white mb-6 text-center tracking-tight">3 Ways We Work With You</h3>
            <p className="text-slate-300 text-center mb-16 max-w-2xl mx-auto text-lg font-light">Our engagement models are designed to flex with your current organizational maturity.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative perspective-1000">
               {[
                 { title: "Clarity", desc: "Identify gaps and opportunities before investing cap-ex.", detail: "Deep-dive assessments of current processes and bottlenecks.", icon: <Search className="w-6 h-6" /> },
                 { title: "Strategy", desc: "Build a structured roadmap for technological integration.", detail: "A detailed blueprint mapping workforce, software, and hardware.", icon: <LucideMap className="w-6 h-6" /> },
                 { title: "Execution", desc: "Drive implementation, adoption, and sustained results.", detail: "Hands-on project management to ensure successful go-live.", icon: <Rocket className="w-6 h-6" /> }
               ].map((way, idx) => (
                 <motion.div 
                    key={idx} 
                    initial={{ rotateX: 0, rotateY: 0 }}
                    whileHover={{ y: -10, rotateX: 5, rotateY: -5, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="bg-slate-900/60 rounded-3xl p-8 border border-white/10 hover:border-brand-secondary/50 hover:bg-slate-900/80 transition-all duration-300 group relative z-10"
                 >
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                    <div className="w-14 h-14 bg-brand-primary/20 border border-brand-primary/30 rounded-2xl flex items-center justify-center mb-6 text-brand-secondary group-hover:scale-110 group-hover:bg-brand-primary group-hover:border-brand-secondary group-hover:text-white transition-all duration-500 shadow-lg">
                      {way.icon}
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm font-mono text-brand-secondary font-bold tracking-widest block group-hover:text-white transition-colors">0{idx + 1}</span>
                      <h4 className="text-2xl font-bold text-white tracking-tight">{way.title}</h4>
                    </div>
                    <p className="text-slate-300 mb-4 font-medium text-lg">{way.desc}</p>
                    <p className="text-slate-500 text-sm leading-relaxed">{way.detail}</p>
                 </motion.div>
               ))}
            </div>

            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">The Transformation Flow</h3>
              <p className="text-lg text-slate-400 font-light max-w-xl mx-auto">Our proven five-step methodology for driving lasting change.</p>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative">
              <div className="absolute top-1/2 left-[10%] w-[80%] h-1 bg-slate-800 -translate-y-1/2 rounded-full hidden lg:block" />
              {[
                { step: "Assess", icon: <Database className="w-6 h-6" /> },
                { step: "Align", icon: <Users className="w-6 h-6" /> },
                { step: "Build", icon: <Settings className="w-6 h-6" /> },
                { step: "Execute", icon: <Zap className="w-6 h-6" /> },
                { step: "Sustain", icon: <RefreshCcw className="w-6 h-6" /> }
              ].map((flow, idx, arr) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="flex flex-col items-center gap-5 w-full flex-1 relative z-10"
                >
                  <div className="bg-slate-900 border-2 border-brand-primary text-white w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.1)] hover:shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:border-brand-secondary hover:scale-110 transition-all duration-300 group cursor-default">
                    <div className="text-brand-secondary group-hover:scale-125 transition-transform duration-300">
                      {flow.icon}
                    </div>
                  </div>
                  <span className="font-bold text-white tracking-widest uppercase text-sm mt-2">{flow.step}</span>
                  {idx < arr.length - 1 && (
                     <>
                       <div className="lg:hidden flex items-center justify-center mt-4">
                         <ChevronDown className="w-6 h-6 text-brand-secondary animate-bounce" />
                       </div>
                       <div className="hidden lg:flex absolute top-1/2 -right-8 -translate-y-1/2 items-center justify-center z-0">
                         <ArrowRight className="w-6 h-6 text-brand-secondary animate-pulse opacity-50" />
                       </div>
                     </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 perspective-1000">
          {[
            {
              tier: "Tier 1: Foundation",
              subtitle: "The Maturity Baseline",
              price: "Assessment Focused",
              icon: <Factory className="w-10 h-10" />,
              includes: [
                "Technical Debt & Systems Audit",
                "Workflow & Bottleneck Analysis",
                "Data Visibility & KPI Health Check",
                "Manual Work Identification Report"
              ],
              outcome: "Strategic Blueprint & Priority Roadmap",
              cta: "Consult with NOVA"
            },
            {
              tier: "Tier 2: Strategy",
              subtitle: "The Operational Blueprint",
              price: "Design & Roadmap",
              icon: <Layers className="w-10 h-10" />,
              includes: [
                "Full Solution Architecture Design",
                "Technology Selection & RFP Support",
                "Labor Optimization Strategy",
                "Financial Projection & ROI Modeling"
              ],
              outcome: "Validated Strategy with Defined ROI Metrics",
              cta: "Build Your Roadmap"
            },
            {
              tier: "Tier 3: Premium",
              subtitle: "Active Implementation",
              price: "Execution Advisory",
              icon: <Briefcase className="w-10 h-10" />,
              includes: [
                "Program & Project Management",
                "Vendor Management & Deployment",
                "Change Management & Training",
                "Continuous Optimization Advisory"
              ],
              outcome: "Lighthouse Facility with Scaling Model",
              cta: "Execute at Scale"
            }
          ].map((pkg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30, rotateX: 5 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -20, rotateX: 5, rotateY: 5, scale: 1.02 }}
              style={{ transformStyle: "preserve-3d" }}
              className="group relative bg-slate-800/50 backdrop-blur-md rounded-[3rem] p-10 border border-slate-700 hover:border-brand-secondary shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(20,184,166,0.2)] transition-all duration-500 overflow-hidden flex flex-col h-full cursor-default"
            >
              <div className="absolute top-0 right-0 p-8 w-48 h-48 bg-brand-secondary/5 rounded-full blur-3xl group-hover:bg-brand-secondary/20 transition-all duration-500" />
              
              <div className="relative z-10 mb-8 flex items-center justify-between">
                <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center text-brand-secondary border border-slate-600 shadow-inner group-hover:scale-110 group-hover:bg-brand-primary transition-all duration-500 shrink-0">
                  {pkg.icon}
                </div>
                <div className="text-right">
                  <p className="text-brand-secondary font-bold text-xs uppercase tracking-[0.2em]">{pkg.price}</p>
                </div>
              </div>
              
              <div className="relative z-10 mb-8 flex-grow-0">
                <h3 className="text-3xl font-bold mb-2 text-white group-hover:text-brand-secondary transition-colors">{pkg.tier}</h3>
                <p className="text-slate-400 font-medium text-xs font-bold uppercase tracking-[0.2em]">{pkg.subtitle}</p>
              </div>
              
              <div className="w-12 h-1 bg-brand-secondary mb-8 relative z-10" />

              <div className="mb-10 flex-grow relative z-10">
                <p className="text-[10px] font-bold text-white mb-6 uppercase tracking-widest opacity-80">Scope Included</p>
                <ul className="space-y-4">
                  {pkg.includes.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-slate-300 group-hover:text-slate-200 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-brand-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" />
                      </div>
                      <span className="leading-snug text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto relative z-10">
                <div className="p-5 bg-black/40 rounded-2xl border border-white/5 mb-8 group-hover:border-brand-primary/20 transition-colors">
                  <p className="text-[10px] uppercase tracking-widest text-brand-primary font-black mb-1">The Deliverable</p>
                  <p className="font-semibold text-brand-secondary leading-tight text-sm">{pkg.outcome}</p>
                </div>
                <Link to="/contact" state={{ assessmentResults: { source: 'organization', archetype: pkg.tier } }} className="text-center w-full block bg-brand-primary text-white hover:bg-brand-secondary hover:text-brand-dark py-4 rounded-xl font-bold transition-all shadow-lg border border-transparent group-hover:border-transparent active:scale-95">
                  {pkg.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
          {/* Interactive ROI / Transformation Scorecard */}
          <ScorecardTool />

        </div>
      </section>
    </div>
  );
};

export default Organizations;
