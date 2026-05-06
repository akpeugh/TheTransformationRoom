import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Factory, Database, Users, Sparkles, Bot, ArrowRight, ChevronRight, CheckCircle2, RotateCcw, ArrowLeft } from "lucide-react";

type Question = {
  id: string;
  category: "Hardware & Automation" | "Data & AI Readiness" | "Workforce Digital Experience";
  text: string;
  options: { label: string; score: number }[];
};

const QUESTIONS: Question[] = [
  {
    id: "q1",
    category: "Hardware & Automation",
    text: "How much of your core operational process is currently automated?",
    options: [
      { label: "Almost entirely manual workflows", score: 10 },
      { label: "Basic digital tools (spreadsheets, disconnected software)", score: 40 },
      { label: "Specific automated tasks but lacking end-to-end integration", score: 70 },
      { label: "Fully integrated automation with real-time tracking", score: 100 },
    ]
  },
  {
    id: "q2",
    category: "Hardware & Automation",
    text: "How frequently do hardware or system bottlenecks cause significant operational delays?",
    options: [
      { label: "Weekly or constantly", score: 10 },
      { label: "Monthly, mostly manageable", score: 50 },
      { label: "Rarely, we have fallbacks", score: 80 },
      { label: "Never, our systems are highly resilient", score: 100 },
    ]
  },
  {
    id: "q3",
    category: "Data & AI Readiness",
    text: "Is your operational data centralized and easily accessible?",
    options: [
      { label: "No, siloed in different departments", score: 10 },
      { label: "Somewhat, but it requires manual exporting/reporting", score: 40 },
      { label: "Mostly centralized with dashboards", score: 75 },
      { label: "Single source of truth with predictive capabilities", score: 100 },
    ]
  },
  {
    id: "q4",
    category: "Data & AI Readiness",
    text: "How are decisions primarily made regarding production or supply chain?",
    options: [
      { label: "Gut feeling and reactive problem solving", score: 10 },
      { label: "Historical reports and past performance", score: 50 },
      { label: "Real-time dashboards", score: 80 },
      { label: "AI/ML driven forecasting and predictive modeling", score: 100 },
    ]
  },
  {
    id: "q5",
    category: "Workforce Digital Experience",
    text: "How is new operational technology adopted by your front-line employees?",
    options: [
      { label: "Strong resistance, tools go unused", score: 10 },
      { label: "Slowly, requires extensive training", score: 40 },
      { label: "Generally well, though some friction remains", score: 75 },
      { label: "Seamlessly, our culture expects continuous innovation", score: 100 },
    ]
  },
  {
    id: "q6",
    category: "Workforce Digital Experience",
    text: "Do you have a clear roadmap for upskilling your teams as processes become more tech-enabled?",
    options: [
      { label: "No formal plan yet", score: 10 },
      { label: "Ad-hoc training when new tools roll out", score: 40 },
      { label: "Regular training intervals", score: 75 },
      { label: "Comprehensive, proactive, continuous learning architecture", score: 100 },
    ]
  }
];

export const ScorecardTool = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"intro" | "questions" | "calculating" | "results">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scores, setScores] = useState({ hardware: 0, data: 0, workforce: 0, total: 0 });

  const handleAnswer = (score: number) => {
    const nextAnswers = { ...answers, [QUESTIONS[currentQ].id]: score };
    setAnswers(nextAnswers);
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      calculateScores(nextAnswers);
    }
  };

  const calculateScores = (finalAnswers: Record<string, number>) => {
    setStep("calculating");
    
    setTimeout(() => {
      let hw = 0, dt = 0, wf = 0;
      let hwMax = 0, dtMax = 0, wfMax = 0;

      QUESTIONS.forEach((q) => {
        const score = finalAnswers[q.id] || 0;
        if (q.category === "Hardware & Automation") { hw += score; hwMax += 100; }
        if (q.category === "Data & AI Readiness") { dt += score; dtMax += 100; }
        if (q.category === "Workforce Digital Experience") { wf += score; wfMax += 100; }
      });

      const finalScores = {
        hardware: Math.round((hw / hwMax) * 100),
        data: Math.round((dt / dtMax) * 100),
        workforce: Math.round((wf / wfMax) * 100),
        total: Math.round(((hw + dt + wf) / (hwMax + dtMax + wfMax)) * 100)
      };

      setScores(finalScores);
      setStep("results");
    }, 2000); // Fake calculation delay for effect
  };

  const reset = () => {
    setStep("intro");
    setCurrentQ(0);
    setAnswers({});
  };

  return (
    <div id="strategic-scorecard-section" className="mt-20 lg:mt-32 bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-[0_0_50px_rgba(20,184,166,0.15)] border border-slate-800 perspective-1000 min-h-[600px] flex items-center">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-brand-secondary/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          
          {step === "intro" && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full mb-6">
                  <Sparkles className="w-3 h-3 text-brand-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Powered by NOVA Intelligence</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Your Transformation Scorecard</h3>
                <p className="text-xl text-slate-400 mb-10 leading-relaxed font-light">
                  NOVA will analyze your operational architecture across three core pillars to reveal your specific maturity baseline and identify hidden gaps.
                </p>
                <div className="space-y-8">
                  {[
                    { label: "Hardware & Automation", icon: <Factory className="w-5 h-5" />, score: 65 },
                    { label: "Data & AI Readiness", icon: <Database className="w-5 h-5" />, score: 42 },
                    { label: "Workforce Digital Experience", icon: <Users className="w-5 h-5" />, score: 28 },
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="group p-4 rounded-2xl transition-all duration-300 hover:bg-slate-800/60 border border-transparent hover:border-brand-secondary/30 hover:shadow-[0_0_30px_rgba(20,184,166,0.1)] relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary/0 via-brand-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-full group-hover:translate-x-0 duration-700" />
                      <div className="flex justify-between mb-3 items-end relative z-10">
                        <span className="text-white font-bold flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary group-hover:text-brand-dark group-hover:border-brand-secondary group-hover:shadow-[0_0_15px_rgba(20,184,166,0.4)] transition-all duration-300">
                            {item.icon}
                          </div>
                          <span className="group-hover:text-brand-secondary transition-colors">{item.label}</span>
                        </span>
                        <span className="text-slate-400 group-hover:text-brand-secondary font-mono text-xl font-bold transition-colors">{item.score}%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden relative z-10 shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: i * 0.2 }}
                          className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full relative group-hover:shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                        >
                          <div className="absolute inset-0 bg-white/20 w-full h-full [mask-image:linear-gradient(90deg,transparent,rgba(0,0,0,1),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-12 text-center group hover:border-brand-secondary/50 transition-colors duration-500">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <Sparkles className="w-4 h-4" /> Personalized Benchmark
                </div>
                <h4 className="text-2xl font-bold text-white mb-6">Want a complete technical audit?</h4>
                <p className="text-slate-400 mb-10">Use our interactive diagnostic to locate your fastest path to ROI and see how you stack up.</p>
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep("questions")}
                  className="group relative w-full bg-gradient-to-r from-brand-secondary via-emerald-400 to-brand-secondary bg-[length:200%_auto] hover:bg-[center_right_1rem] text-brand-dark px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_40px_rgba(20,184,166,0.6)] flex items-center justify-center gap-3 mx-auto overflow-hidden outline outline-2 outline-offset-2 outline-transparent hover:outline-brand-secondary/50 hover:animate-pulse"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <span className="relative z-10 transition-transform duration-300 group-hover:scale-105 inline-block">Take Interactive Diagnostic</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <div className="mt-8 pt-8 border-t border-slate-700/50">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat', { 
                      detail: { prompt: "I've reviewed the example Transformation Scorecard. Can you explain how to bridge the gaps in our hardware and AI readiness?" } 
                    }))}
                    className="w-full relative group bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 text-white px-8 py-4 rounded-2xl font-bold text-md transition-all flex items-center justify-center gap-3 overflow-hidden shadow-lg hover:shadow-brand-secondary/20 hover:border-brand-secondary/50 cursor-pointer hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-brand-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Bot className="w-5 h-5 text-brand-secondary relative z-10" /> 
                    <span className="relative z-10">Open Our Guide</span>
                  </motion.button>
                  <p className="mt-6 text-xs text-slate-500 italic">"Technology is the bridge, but strategy is the blueprint."</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === "questions" && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="mb-6 flex justify-between items-center text-slate-400 text-sm font-mono uppercase tracking-widest">
                <div className="flex items-center gap-4">
                  <AnimatePresence>
                    {currentQ > 0 && (
                      <motion.button 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setCurrentQ(prev => prev - 1)}
                        className="group flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:border-brand-secondary transition-all shadow-sm hover:shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                        title="Back to previous question"
                      >
                        <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-brand-secondary group-hover:-translate-x-1 transition-transform" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
                </div>
                <span className="hidden md:inline-block">{QUESTIONS[currentQ].category}</span>
              </div>
              
              <div className="flex gap-2 w-full mb-12">
                {QUESTIONS.map((_, i) => (
                  <div key={i} className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-brand-secondary"
                      initial={{ width: i < currentQ ? '100%' : '0%' }}
                      animate={{ width: i < currentQ ? '100%' : i === currentQ ? '50%' : '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                ))}
              </div>

              <h4 className="text-3xl md:text-4xl font-bold text-white mb-10 leading-snug">
                {QUESTIONS[currentQ].text}
              </h4>

              <div className="space-y-4">
                {QUESTIONS[currentQ].options.map((option, idx) => {
                  const isSelected = answers[QUESTIONS[currentQ].id] === option.score;
                  return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.score)}
                    className={`w-full text-left p-6 md:p-8 bg-white/5 border rounded-2xl text-slate-200 transition-all duration-300 font-medium text-lg flex justify-between items-center group cursor-pointer shadow-sm hover:shadow-brand-secondary/20 hover:bg-brand-secondary/10 hover:border-brand-secondary/50 hover:text-white ${
                      isSelected ? "border-brand-secondary bg-brand-secondary/20 shadow-md shadow-brand-secondary/30" : "border-white/10"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-brand-secondary" : "border-slate-600 group-hover:border-brand-secondary"}`}>
                        {isSelected && <div className="w-3 h-3 rounded-full bg-brand-secondary" />}
                      </div>
                      {option.label}
                    </span>
                    <ChevronRight className="w-5 h-5 text-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                )})}
              </div>

              <div className="mt-8 text-center">
                <p className="text-slate-500 text-xs mt-4 italic font-medium">Select an option to automatically continue</p>
              </div>
            </motion.div>
          )}

          {step === "calculating" && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="relative w-32 h-32 mb-8">
                 <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-brand-secondary animate-spin" />
                 <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-l-brand-primary animate-[spin_1.5s_linear_infinite_reverse]" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Database className="w-8 h-8 text-brand-secondary animate-pulse" />
                 </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Reorganizing Entropy...</h3>
              <p className="text-slate-400 font-light">NOVA is synthesizing your operational data points and mapping your transformation trajectory.</p>
            </motion.div>
          )}

          {step === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              <div className="lg:col-span-7 space-y-10">
                <div>
                  <h3 className="text-4xl font-bold text-white mb-4 tracking-tight">Your Diagnosis</h3>
                  <p className="text-lg text-slate-400 font-light">Based on your responses, here is where your organization is leaving efficiency and ROI on the table.</p>
                </div>

                <div className="space-y-8">
                  {[
                    { label: "Hardware & Automation", icon: <Factory className="w-5 h-5" />, score: scores.hardware },
                    { label: "Data & AI Readiness", icon: <Database className="w-5 h-5" />, score: scores.data },
                    { label: "Workforce Digital Experience", icon: <Users className="w-5 h-5" />, score: scores.workforce },
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02, x: 5 }}
                      className={`group p-6 rounded-2xl transition-all duration-300 bg-white/5 border border-white/10 relative overflow-hidden ${
                         item.score > 70 ? 'hover:bg-emerald-900/20 hover:border-emerald-500/30' :
                         item.score > 40 ? 'hover:bg-brand-primary/10 hover:border-brand-secondary/30' :
                         'hover:bg-red-900/20 hover:border-red-500/30'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-full group-hover:translate-x-full duration-1000" />
                      <div className="flex justify-between mb-4 items-end relative z-10">
                        <span className="text-white font-bold text-lg flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                            item.score > 70 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-emerald-950 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]' :
                            item.score > 40 ? 'bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/30 group-hover:bg-brand-secondary group-hover:text-brand-dark group-hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]' :
                            'bg-red-500/20 text-red-400 border border-red-500/30 group-hover:bg-red-500 group-hover:text-red-950 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                          }`}>
                            {item.icon}
                          </div>
                          {item.label}
                        </span>
                        <span className={`font-mono text-2xl font-bold transition-colors ${
                             item.score > 70 ? 'text-emerald-400' :
                             item.score > 40 ? 'text-brand-secondary' :
                             'text-red-400'
                        }`}>{item.score}%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden relative z-10 shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1.5, delay: 0.2 + (i * 0.2), ease: "easeOut" }}
                          className={`h-full rounded-full relative transition-shadow duration-500 ${
                            item.score > 70 ? 'bg-emerald-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                            item.score > 40 ? 'bg-gradient-to-r from-brand-primary to-brand-secondary group-hover:shadow-[0_0_15px_rgba(20,184,166,0.5)]' :
                            'bg-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                          }`}
                        >
                          <div className="absolute inset-0 bg-white/30 w-full h-full [mask-image:linear-gradient(90deg,transparent,rgba(0,0,0,1),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
                        </motion.div>
                      </div>
                      <p className={`mt-4 text-sm font-medium relative z-10 ${
                             item.score > 70 ? 'text-emerald-500/80 group-hover:text-emerald-400' :
                             item.score > 40 ? 'text-brand-secondary/80 group-hover:text-brand-secondary' :
                             'text-red-500/80 group-hover:text-red-400'
                      }`}>
                        {item.score > 70 ? "Healthy: Optimized for scale." : item.score > 40 ? "Warning: Approaching bottlenecks." : "Critical: Immediate intervention needed."}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="lg:col-span-5 bg-slate-800/50 backdrop-blur-xl border border-brand-secondary/30 rounded-3xl p-8 hover:border-brand-secondary/60 transition-colors shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 w-48 h-48 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" />
                
                <h4 className="text-2xl font-bold text-white mb-6 pr-8">Suggested Next Steps</h4>
                <div className="mb-8 space-y-6 text-slate-300 font-light text-sm leading-relaxed">
                   <p className="border-b border-slate-700/50 pb-4">
                     Based on your profile, your most critical area to address is <strong className="text-white">
                       {scores.hardware <= scores.data && scores.hardware <= scores.workforce ? "Hardware & Automation" : 
                        scores.data <= scores.workforce ? "Data & AI Readiness" : "Workforce Digital Experience"}
                     </strong>.
                   </p>
                   
                   <div className="space-y-4">
                     <h5 className="font-bold text-brand-secondary uppercase tracking-wider text-xs">How We Can Help</h5>
                     
                     {scores.hardware <= scores.data && scores.hardware <= scores.workforce ? (
                        <div className="space-y-3">
                          <p>When physical processes are bottlenecked, adding software isn't enough. We help you:</p>
                          <ul className="list-disc pl-4 space-y-2 text-slate-400">
                            <li>Identify quick-win material handling improvements before full automation.</li>
                            <li>Design AS/RS or robotics integrations that fit your exact footprint and throughput needs.</li>
                            <li>Develop a CapEx roadmap that proves ROI before you spend a dime.</li>
                          </ul>
                        </div>
                     ) : scores.data <= scores.workforce ? (
                        <div className="space-y-3">
                          <p>Without clean data, AI is just a buzzword. We help you:</p>
                          <ul className="list-disc pl-4 space-y-2 text-slate-400">
                            <li>Audit your current WMS/ERP tech stack to find data silos.</li>
                            <li>Establish a central Operational Data Lake for real-time visibility.</li>
                            <li>Implement practical AI/ML models for demand forecasting and slotting optimization.</li>
                          </ul>
                        </div>
                     ) : (
                        <div className="space-y-3">
                          <p>Technology fails if your team rejects it. We help you:</p>
                          <ul className="list-disc pl-4 space-y-2 text-slate-400">
                            <li>Redesign SOPs and front-line interfaces mapped fully to user needs.</li>
                            <li>Develop training programs that turn resistors into super-users.</li>
                            <li>Build a culture of continuous digital adoption.</li>
                          </ul>
                        </div>
                     )}
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2 px-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-brand-secondary/30 bg-slate-800">
                      <img src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" alt="NOVA" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">NOVA Strategy Analysis Ready</span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat', { 
                      detail: { prompt: `I scored a ${scores.total}% on the Readiness Assessment (${scores.hardware}% Hardware, ${scores.data}% Data, ${scores.workforce}% Workforce). Tell me exactly how NOVA and The Transformation Room can fix my specific gaps.` } 
                    }))}
                    className="group relative w-full overflow-hidden bg-gradient-to-r from-brand-secondary via-emerald-400 to-brand-secondary bg-[length:200%_auto] hover:bg-[center_right_1rem] text-brand-dark font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-500 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.6)] cursor-pointer outline outline-2 outline-offset-2 outline-transparent hover:outline-brand-secondary/50 hover:animate-pulse z-10"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <Bot className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" /> 
                    <span className="relative z-10 transition-transform duration-300 group-hover:scale-105 inline-block">Consult with NOVA</span>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate("/contact", {
                        state: {
                          assessmentResults: {
                            source: "organization",
                            archetype: scores.total > 70 ? "Transformation Ready" : scores.total > 40 ? "Steady Growth" : "Critical Gap Area",
                            traits: `Total Score: ${scores.total}%, Hardware: ${scores.hardware}%, Data: ${scores.data}%, Workforce: ${scores.workforce}%`
                          }
                        }
                      });
                    }}
                    className="w-full group relative overflow-hidden bg-white/10 hover:bg-white/20 border border-slate-600 hover:border-white/50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 group-hover:tracking-wide transition-all">Submit Inquiry</span>
                  </motion.button>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={reset} 
                    className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 rounded-xl transition-all cursor-pointer font-medium group shadow-sm hover:shadow-md"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-500 text-slate-500 group-hover:text-white" /> Retake Assessment
                  </motion.button>
                </div>
              </motion.div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
