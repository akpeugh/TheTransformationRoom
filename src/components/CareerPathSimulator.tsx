import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Target, 
  Map as LucideMap, 
  Zap, 
  Lightbulb, 
  ShieldCheck, 
  ArrowRight, 
  Bot, 
  Sparkles,
  Search,
  Brain,
  History,
  Mail
} from 'lucide-react';

interface CareerPathSimulatorProps {
  onClose: () => void;
}

export const CareerPathSimulator: React.FC<CareerPathSimulatorProps> = ({ onClose }) => {
  const [step, setStep] = useState<'info' | 'result'>('info');
  const [formData, setFormData] = useState({
    currentRole: '',
    desiredRole: '',
    strengths: '',
    interests: '',
    skills: ''
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setStep('result');
    }, 2500);
  };

  const handleEmailResults = () => {
    const subject = encodeURIComponent("My Career Transformation Roadmap | The Transformation Room");
    const body = encodeURIComponent(
      "Here is my generated Career Transformation Roadmap from The Transformation Room:\n\n" +
      `Current Role: ${formData.currentRole}\n` +
      `Desired Role: ${formData.desiredRole}\n\n` +
      `[Growth Steps]\n` +
      `1. Narrative Shift: Reframe my current experience.\n` +
      `2. Technical Layer: Master new relevant tools.\n` +
      `3. Authority Play: Lead a pilot project with measurable ROI.\n\n` +
      "Personal Notes / Reflections:\n" +
      "[Add your personal message here]\n\n" +
      "---\n" +
      "Simulate your own career path jump at The Transformation Room."
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-4 sm:p-8"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center border border-brand-secondary/30">
               <LucideMap className="w-5 h-5 text-brand-secondary" />
             </div>
             <div>
               <h3 className="font-bold text-lg tracking-tight leading-none">NOVA Path Simulator</h3>
               <span className="text-[10px] text-brand-secondary uppercase tracking-[0.2em] font-black">Strategic Career Mapping</span>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 sm:p-12">
          <AnimatePresence mode="wait">
            {step === 'info' ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                 <div className="text-center mb-12">
                   <h2 className="text-3xl font-bold text-slate-900 mb-4">Where is your next transformation?</h2>
                   <p className="text-slate-500 font-light italic">"Growth is not a straight line, it's a trajectory we navigate together." — NOVA</p>
                 </div>

                 <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Current Role</label>
                         <input 
                            type="text" 
                            placeholder="e.g. Warehouse Supervisor"
                            className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                            value={formData.currentRole}
                            onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Desired Role</label>
                         <input 
                            type="text" 
                            placeholder="e.g. Operations Manager"
                            className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                            value={formData.desiredRole}
                            onChange={(e) => setFormData({...formData, desiredRole: e.target.value})}
                         />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Top Strengths</label>
                       <textarea 
                          placeholder="What are you exceptionally good at?"
                          className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all h-24"
                          value={formData.strengths}
                          onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Transferable Skills</label>
                       <textarea 
                          placeholder="e.g. Team leadership, SQL, process optimization..."
                          className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all h-24"
                          value={formData.skills}
                          onChange={(e) => setFormData({...formData, skills: e.target.value})}
                       />
                    </div>

                    <button 
                      onClick={handleSimulate}
                      disabled={isSimulating || !formData.currentRole || !formData.desiredRole}
                      className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-primary transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 group"
                    >
                      {isSimulating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Consulting NOVA Cognitive Data...
                        </>
                      ) : (
                        <>
                          Simulate Growth Path <Zap className="w-5 h-5 text-brand-secondary group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </button>
                 </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                 <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 rounded-2xl bg-slate-900 overflow-hidden shrink-0 border border-brand-secondary/30 shadow-2xl">
                       <img src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" alt="NOVA" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">Path Generated Successfully</span>
                       <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Transformation Roadmap</h2>
                       <p className="text-slate-500 font-light italic">"I see the pattern. Your next level requires a shift from execution to orchestration."</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Growth Roadmap */}
                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                       <div className="flex items-center gap-3 mb-6">
                         <LucideMap className="w-5 h-5 text-brand-secondary" />
                         <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Growth Roadmap</h4>
                       </div>
                       <div className="space-y-6">
                          {[
                            { step: "01. Narrative Shift", desc: "Reframing your 5 years as a supervisor into 'Strategic Resource Management'." },
                            { step: "02. Technical Layer", desc: "Mastering the AI tools used for labor planning and network visibility." },
                            { step: "03. Authority Play", desc: "Leading a pilot project that demonstrates measurable ROI in your current facility." }
                          ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                               <div className="w-8 h-8 rounded-full bg-white border border-brand-secondary/30 flex items-center justify-center text-[10px] font-black text-brand-secondary shrink-0 shadow-sm">
                                 {item.step.split('.')[0]}
                               </div>
                               <div>
                                  <h5 className="font-bold text-slate-900 text-sm mb-1">{item.step.split('. ')[1]}</h5>
                                  <p className="text-xs text-slate-500 leading-relaxed font-light">{item.desc}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* Skill Gaps & Dev */}
                    <div className="p-8 bg-brand-primary/5 rounded-3xl border border-brand-primary/10">
                       <div className="flex items-center gap-3 mb-6">
                         <Brain className="w-5 h-5 text-brand-primary" />
                         <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Skill Gaps & Development</h4>
                       </div>
                       <ul className="space-y-4">
                          {[
                            "Operational Financial Literacy (CapEx vs OpEx)",
                            "AI Agent Configuration for Scheduling",
                            "Executive Communication & Stakeholder Management"
                          ].map((skill, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                               <div className="w-2 h-2 rounded-full bg-brand-primary" />
                               {skill}
                            </li>
                          ))}
                       </ul>
                       <div className="mt-8 p-4 bg-white rounded-xl border border-brand-primary/10">
                          <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">Positioning Advice</p>
                          <p className="text-xs text-slate-600 italic">"Stop describing what you do. Start describing the problems you've solved for the business."</p>
                       </div>
                    </div>
                 </div>

                 {/* CTA */}
                 <div className="flex flex-col gap-4 pt-8">
                   <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat', { 
                          detail: { prompt: `I want to transition from ${formData.currentRole} to ${formData.desiredRole}. NOVA just generated a roadmap for me. Let's discuss step 1: Narrative Shift.` } 
                        }))}
                        className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary transition-all group shadow-xl"
                      >
                         <Bot className="w-5 h-5 text-brand-secondary group-hover:rotate-12 transition-transform" />
                         Deconstruct Step 1 with NOVA
                      </button>
                      <button 
                         onClick={() => window.location.href = '/contact'}
                         className="flex-1 py-5 bg-brand-secondary text-brand-dark rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white border border-transparent hover:border-brand-secondary transition-all shadow-xl shadow-brand-secondary/10"
                      >
                         <ShieldCheck className="w-5 h-5" />
                         Apply for Coaching Support
                      </button>
                   </div>
                   <button 
                     onClick={handleEmailResults}
                     className="w-full py-4 bg-brand-primary/10 text-brand-primary border border-brand-primary/30 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary hover:text-white transition-all shadow-sm group"
                   >
                     <Mail className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                     Email Career Roadmap Results
                   </button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-4">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Simulation Layer 4 Active</span>
           </div>
           <div className="h-3 w-px bg-slate-200" />
           <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest italic">Confidential Transformation Asset</p>
        </div>
      </div>
    </motion.div>
  );
};
