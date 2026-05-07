import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Zap, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  RefreshCcw, 
  ShieldCheck, 
  User, 
  Layers,
  Map as LucideMap,
  Activity
} from "lucide-react";
import { ResumeOptimizer } from "../components/ResumeOptimizer";
import { CareerPathSimulator } from "../components/CareerPathSimulator";

import { DISCOVERY_CALL_1HR } from "../constants";

const Individuals = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 800], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tool = params.get('tool');
    if (tool === 'resume') {
      navigate('/display?path=resume');
    } else if (tool === 'career') {
      navigate('/display?path=simulator');
    }
  }, [location.search, navigate]);

const stageData = [
    {
      title: "Resume & Positioning",
      focus: "Narrative Architecture",
      desc: "Turn your experience into a clear, compelling story that aligns with how companies actually evaluate candidates.",
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: "Job Search Strategy",
      focus: "Direction & Focus",
      desc: "Define your direction and approach your job search with focus, intention, and agentic search tools.",
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: "Interview & Offer Support",
      focus: "Authority & Value",
      desc: "Communicate your value clearly, perform with confidence, and navigate offers strategically with AI-driven prep.",
      icon: <Briefcase className="w-6 h-6" />
    }
  ];

  const specializedServices = [
    { title: "Career Transitions", desc: "Industry or role changes with zero friction.", icon: <RefreshCcw className="w-5 h-5" /> },
    { title: "Exec Promotions", desc: "Positioning for senior leadership & board roles.", icon: <ShieldCheck className="w-5 h-5" /> },
    { title: "Breaking In", desc: "Entering high-tech industries for the first time.", icon: <Sparkles className="w-5 h-5" /> },
    { title: "Re-entry", desc: "Re-entering the workforce after a gap with authority.", icon: <ShieldCheck className="w-5 h-5" /> },
    { title: "Visibility", desc: "Personal branding for LinkedIn and industry forums.", icon: <User className="w-5 h-5" /> },
    { title: "Negotiation", desc: "Offer evaluation and total compensation strategy.", icon: <ArrowRight className="w-5 h-5" /> },
    { title: "Communication", desc: "Strengthening confidence and interview presence.", icon: <Layers className="w-5 h-5" /> },
    { title: "Non-Linear Paths", desc: "Narratives for professionals with diverse backgrounds.", icon: <Bot className="w-5 h-5" /> }
  ];

  const [isServicesExpanded, setIsServicesExpanded] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      <header className="relative py-40 bg-slate-900 overflow-hidden perspective-1000">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 bg-brand-dark/50 mix-blend-overlay z-10" />
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 opacity-40 scale-105">
          <img 
            src="https://images.unsplash.com/photo-1552581230-c01374138763?auto=format&fit=crop&q=80&w=2000" 
            alt="Career Transformation" 
            className="w-full h-full object-cover mix-blend-luminosity"
          />
        </motion.div>
        
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-brand-secondary/20 to-transparent z-10 skew-x-12 translate-x-1/2 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 relative z-30 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
               initial={{ opacity: 0, x: -20, rotateY: 5 }}
               animate={{ opacity: 1, x: 0, rotateY: 0 }}
               transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-secondary/10 border border-brand-secondary/30 rounded-full text-brand-secondary text-[10px] uppercase font-bold tracking-[0.2em] mb-10 backdrop-blur-sm self-start drop-shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                Explore your next transformation
              </div>
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-8xl font-bold mb-8 leading-[0.9] tracking-tighter drop-shadow-2xl"
                whileHover={{ rotateX: 5, rotateY: -5, textShadow: "0px 10px 30px rgba(255,255,255,0.2)" }}
              >
                Engineer Your <br />
                <span className="text-brand-secondary font-mono tracking-tighter text-shine">Authority.</span>
              </motion.h1>
              <motion.div 
                whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
                className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-[2rem] backdrop-blur-xl mb-12 relative overflow-hidden group shadow-2xl transform-gpu"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 rounded-full blur-3xl group-hover:bg-brand-secondary/30 transition-all duration-700" />
                <div className="flex gap-4 items-start relative z-10" style={{ transform: "translateZ(20px)" }}>
                  <div className="w-1 absolute left-0 top-0 bottom-0 bg-gradient-to-b from-brand-secondary to-transparent rounded-full" />
                  <div className="pl-6">
                    <p className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
                      <span className="text-brand-secondary">Positioning</span> is your competitive edge.
                    </p>
                    <p className="text-lg opacity-90 leading-relaxed text-slate-300 font-light">
                      We synchronize elite executive coaching with <span className="text-white font-semibold px-2 py-0.5 bg-brand-secondary/20 rounded-md">NOVA Intelligence</span> to teach you how to leverage AI tools to master the modern room.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                 <Link to="/contact" className="bg-brand-secondary text-brand-dark px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-xl shadow-brand-secondary/20 flex items-center justify-center gap-2 cursor-pointer">
                    Start Transformation <ArrowRight className="w-5 h-5" />
                 </Link>

              </div>
            </motion.div>

            <div className="relative hidden lg:block">
               <div className="absolute inset-0 bg-brand-secondary/10 blur-[100px] rounded-full" />
               <div className="relative grid grid-cols-1 gap-6">
                 {stageData.map((stage, i) => (
                    <motion.div
                      key={i}
                      onMouseEnter={() => setActiveStage(i)}
                      animate={{ 
                        opacity: activeStage === i ? 1 : 0.6,
                        x: activeStage === i ? 20 : 0,
                        scale: activeStage === i ? 1.05 : 1
                      }}
                      className={`p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border transition-all cursor-default ${
                        activeStage === i ? 'border-brand-secondary shadow-2xl' : 'border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-brand-secondary bg-brand-secondary/10 transition-all ${activeStage === i ? 'scale-110 rotate-3' : ''}`}>
                          {stage.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{stage.title}</h3>
                          <p className="text-[10px] text-brand-secondary font-black uppercase tracking-widest">{stage.focus}</p>
                        </div>
                      </div>
                      <AnimatePresence>
                        {activeStage === i && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 text-sm text-slate-300 font-light leading-relaxed pr-8"
                          >
                            <p>{stage.desc}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                 ))}
               </div>
            </div>
          </div>
        </div>
        {/* Seamless transition curve/gradient */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-40" />
        <div className="absolute -bottom-1 left-0 w-full h-2 bg-slate-50 z-50" />
      </header>

      {/* Package Section */}
      <section className="py-32 max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Packages Offered</h2>
          <div className="w-24 h-1.5 bg-brand-secondary mx-auto mb-8 rounded-full" />
          <p className="text-slate-500 text-lg">Tailored to you at a price you can afford.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {[
            {
              tier: "Foundation",
              subtitle: "Resume & Positioning",
              price: "Package 1",
              bestFor: "Professionals who need their resume and LinkedIn to sound stronger and more strategic.",
              includes: [
                "Review of current resume & LinkedIn",
                "Identification of experience gaps",
                "Reframing accomplishments into impact",
                "Keyword & AI role-alignment review",
                "Positioning strategy documentation"
              ],
              outcome: "Clear summary of what is/isn't working and prioritized updates for clarity.",
              cta: "Launch Foundation"
            },
            {
              tier: "Strategy",
              subtitle: "Job Search Orchestration",
              price: "Package 2",
              bestFor: "Career changers or anyone feeling stuck in the current job market.",
              includes: [
                "All Foundation Services plus:",
                "Review of target roles & industries",
                "Evaluation of current application approach",
                "Networking & AI outreach logic",
                "Transferable skills mapping"
              ],
              outcome: "A focused plan with prioritized targets instead of applying randomly.",
              cta: "Build Strategy"
            },
            {
              tier: "Premium",
              subtitle: "Authority & Negotiation",
              price: "Package 3",
              bestFor: "Candidates preparing for major opportunities or evaluating complex offers.",
              includes: [
                "All of the Above plus:",
                "Practical AI Interview Tools",
                "Support translating background to ROI",
                "Compensation & Offer evaluation",
                "Executive confidence & communication coaching"
              ],
              outcome: "Increased confidence and support evaluating offers, pay, and next steps.",
              cta: "Master Premium"
            },
            {
              tier: "AI 101 Labs",
              subtitle: "Tech Literacy Journey",
              price: "On-Demand",
              bestFor: "Professionals wanting to better understand tech and how to get started easily.",
              includes: [
                "Intro to modern AI tools (ChatGPT, etc.)",
                "Automating daily tasks & productivity",
                "Personal branding tech stack",
                "Building simple generative workflows",
                "Overcoming technology anxiety"
              ],
              outcome: "Confidence integrating tech into your daily life and career to save time.",
              cta: "Start AI Journey"
            }
          ].map((pkg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30, rotateX: 5 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -15, scale: 1.05, rotateX: 5, rotateY: 3, boxShadow: "0px 20px 40px rgba(0,0,0,0.15)" }}
              style={{ transformStyle: "preserve-3d" }}
              className="group bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-200 flex flex-col hover:border-brand-secondary/50 shadow-sm transition-all duration-500 relative z-10"
            >
              <div className="relative mb-10">
                <p className="text-brand-secondary font-bold text-xs uppercase tracking-[0.2em] mb-2">{pkg.price}</p>
                <h3 className="text-3xl font-black mb-1 uppercase tracking-tighter">{pkg.tier}</h3>
                <p className="text-slate-500 text-sm mb-6 font-medium border-l-2 border-brand-secondary/30 pl-4">{pkg.subtitle}</p>
              </div>
              
              <div className="flex-grow">
                <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black mb-2 uppercase tracking-widest text-slate-400">Best For</p>
                   <p className="text-xs text-slate-600 italic font-medium leading-relaxed">{pkg.bestFor}</p>
                </div>

                <p className="text-[10px] font-black mb-4 uppercase tracking-widest text-brand-primary">Inclusions</p>
                <ul className="space-y-4 mb-10">
                  {pkg.includes.map((item, j) => (
                    <li key={j} className="flex gap-4 text-sm font-medium text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-brand-secondary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="p-6 bg-brand-primary/5 rounded-[2rem] border border-brand-primary/10 mb-10">
                  <p className="text-[10px] font-black mb-1 uppercase tracking-widest text-brand-primary">Outcome</p>
                  <p className="text-sm font-bold text-slate-900">{pkg.outcome}</p>
                </div>
              </div>
              
              <Link to="/contact" state={{ assessmentResults: { source: 'individual', archetype: pkg.tier } }} className="block text-center w-full bg-brand-primary text-white py-5 rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-lg active:scale-95 cursor-pointer">
                Apply for {pkg.tier}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Specialized Support Section - Moved & Redesigned for Compactness */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Subtle Background Graphic */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none z-0">
          <svg viewBox="0 0 400 400" className="w-full h-full text-slate-900 fill-current">
            <path d="M100,100 L300,100 L300,300 L100,300 Z M200,50 L200,350 M50,200 L350,200" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <path d="M150,150 L250,250 M250,150 L150,250" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-20">
           <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12">
              <div className="max-w-xl">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                   <Activity className="w-3 h-3" /> Specialized Expertise
                 </div>
                 <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tighter">Navigating Complexity.</h2>
                 <p className="text-slate-500 font-light leading-relaxed">Where we thrive: engineered narratives for non-linear careers and high-velocity transitions.</p>
              </div>
              <button 
                onClick={() => setIsServicesExpanded(!isServicesExpanded)}
                className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-brand-primary transition-all shadow-xl active:scale-95"
              >
                {isServicesExpanded ? 'Collapse Solutions' : 'View Specialized Solutions'}
                <motion.div
                  animate={{ rotate: isServicesExpanded ? 180 : 0 }}
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </button>
           </div>

           <motion.div 
             initial={false}
             animate={{ height: isServicesExpanded ? 'auto' : '120px' }}
             className="overflow-hidden relative"
           >
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                 {specializedServices.map((item, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: i * 0.05 }}
                     className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-brand-secondary/50 hover:shadow-lg transition-all group flex items-start gap-4"
                   >
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-brand-secondary group-hover:bg-brand-secondary/10 transition-all shrink-0">
                         {item.icon}
                      </div>
                      <div>
                         <h4 className="text-slate-900 font-bold text-sm mb-1">{item.title}</h4>
                         <AnimatePresence>
                           {isServicesExpanded && (
                             <motion.p 
                               initial={{ opacity: 0, height: 0 }}
                               animate={{ opacity: 1, height: 'auto' }}
                               exit={{ opacity: 0, height: 0 }}
                               className="text-[11px] text-slate-400 leading-tight font-light"
                             >
                                {item.desc}
                             </motion.p>
                           )}
                         </AnimatePresence>
                      </div>
                   </motion.div>
                 ))}
              </div>
              
              {!isServicesExpanded && (
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
              )}
           </motion.div>
        </div>
      </section>

      {/* Career Transformation Hub */}
      <section className="py-32 max-w-7xl mx-auto px-4" id="transformation-hub-section">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-primary rounded-[4rem] rotate-1 scale-105 opacity-5" />
          <div className="relative bg-white border border-slate-200 rounded-[3rem] p-8 md:p-20 overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-1/2 h-full bg-slate-50 skew-x-12 -translate-x-1/4 z-0" />
             
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                <div className="lg:col-span-6">
                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-secondary/10 text-brand-secondary rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                     <Sparkles className="w-4 h-4" /> Integrated Career Intelligence
                   </div>
                   <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 leading-[0.95] tracking-tighter">
                     NOVA Career <br />
                     <span className="text-brand-primary font-mono tracking-tighter">Transformation Hub.</span>
                   </h2>
                   <p className="text-xl text-slate-500 mb-12 leading-relaxed font-light max-w-xl">
                      Unify your trajectory. From simulate growth paths to optimizing your professional narrative—our integrated suite of tools uses NOVA Intelligence to ensure you are positioned for high-velocity career moves.
                   </p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                            <LucideMap className="w-5 h-5 text-brand-secondary" />
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900 text-sm">Path Simulation</h4>
                            <p className="text-xs text-slate-500">Map your next transition.</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-brand-secondary" />
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900 text-sm">Resume Optimization</h4>
                            <p className="text-xs text-slate-500">Reframing legacy experience.</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-6">
                      <Link 
                        to="/display"
                        className="bg-brand-primary text-white px-10 py-6 rounded-2xl font-bold text-xl hover:bg-brand-dark transition-all shadow-2xl shadow-brand-primary/30 flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-95 cursor-pointer"
                      >
                         Launch Hub <Zap className="w-6 h-6 text-brand-secondary group-hover:rotate-12 transition-transform" />
                      </Link>
                      <div className="flex -space-x-3 items-center">
                         {[1,2,3,4].map(i => (
                           <div key={i} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-slate-200 shrink-0">
                              <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" />
                           </div>
                         ))}
                         <span className="pl-6 text-xs text-slate-400 font-bold uppercase tracking-widest">1,200+ professionals onboarded</span>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-6 relative group">
                   <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary/20 to-brand-primary/20 blur-[60px] rounded-full scale-90 z-0 animate-pulse" />
                   
                   <div className="bg-slate-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative z-10 p-1">
                      <div className="bg-slate-800/80 p-8 rounded-[2.8rem]">
                         <div className="flex items-center gap-6 mb-12">
                            <div className="w-16 h-16 rounded-2xl bg-brand-secondary/10 flex items-center justify-center border border-brand-secondary/30">
                               <Bot className="w-8 h-8 text-brand-secondary" />
                            </div>
                            <div>
                               <p className="text-white font-bold text-xl tracking-tight">NOVA Intelligence Active</p>
                               <span className="text-[10px] text-brand-secondary font-black uppercase tracking-[0.2em]">Synchronizing data layers...</span>
                            </div>
                         </div>
                         
                         <div className="space-y-4">
                            {[
                              { label: "Simulator", val: "Operational Flow Mapping", color: "bg-brand-secondary/20 text-brand-secondary" },
                              { label: "Optimizer", val: "Narrative Authority Shift", color: "bg-brand-primary/20 text-brand-primary" }
                            ].map((item, i) => (
                              <div key={i} className="flex justify-between items-center bg-white/5 border border-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                                 <div>
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 inline-block ${item.color}`}>{item.label}</span>
                                    <p className="text-white font-bold">{item.val}</p>
                                 </div>
                                 <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full bg-brand-secondary" />
                              </div>
                            ))}
                         </div>

                         <div className="mt-12 text-center">
                            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest italic">"Transformation requires both vision and velocity."</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showOptimizer && (
          <ResumeOptimizer onClose={() => setShowOptimizer(false)} />
        )}
        {showSimulator && (
          <CareerPathSimulator onClose={() => setShowSimulator(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Individuals;
