import React, { useState, useRef, useMemo } from 'react';
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
  Mail,
  Upload,
  FileText,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';

interface CareerPathSimulatorProps {
  onClose: () => void;
}

const COMMON_ROLES = [
  "Warehouse Supervisor",
  "Operations Manager",
  "Logistics Coordinator",
  "Supply Chain Analyst",
  "IT Manager",
  "Automation Engineer",
  "General Manager",
  "Data Scientist",
  "Chief Operating Officer",
  "Inventory Specialist",
  "Project Manager",
  "Continuous Improvement Lead"
];

const GOAL_ROLES = [
  "Director of Operations",
  "VP of Supply Chain",
  "Automation Architect",
  "Chief Operating Officer",
  "Sustainability Lead",
  "Digital Transformation Officer",
  "Enterprise Solutions Architect"
];

export const CareerPathSimulator: React.FC<CareerPathSimulatorProps> = ({ onClose }) => {
  const [step, setStep] = useState<'selection' | 'info' | 'result'>('selection');
  const [formData, setFormData] = useState({
    currentRole: '',
    desiredRole: '',
    strengths: '',
    interests: '',
    skills: ''
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeResume, setActiveResume] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setStep('result');
    }, 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setActiveResume(file.name);
    
    // Simulate NOVA scanning the resume
    setTimeout(() => {
      setFormData({
        ...formData,
        currentRole: "Warehouse Operations Lead",
        skills: "WMS Optimization, Labor Management, Six Sigma, Tableau, Team Leadership",
        strengths: "Strategic problem solving, system optimization, high-pressure decision making"
      });
      setIsScanning(false);
      setStep('info');
    }, 2000);
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
            {step === 'selection' ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="max-w-2xl mx-auto h-full flex flex-col justify-center"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Begin Your Simulation</h2>
                  <p className="text-slate-500 font-light max-w-md mx-auto">Choose how you'd like to provide your current background to NOVA for analysis.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                    className="p-8 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-center group relative overflow-hidden"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                    {isScanning ? (
                      <div className="py-4">
                        <div className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin mx-auto mb-4" />
                        <span className="text-sm font-bold text-brand-primary">NOVA is scanning...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-brand-primary" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Upload Profile</h4>
                        <p className="text-sm text-slate-500 font-light">PDF or Word. Let NOVA extract your trajectory automatically.</p>
                      </>
                    )}
                  </button>

                  <button 
                    onClick={() => setStep('info')}
                    className="p-8 rounded-[2rem] border-2 border-slate-100 bg-slate-50 hover:border-brand-secondary hover:bg-brand-secondary/5 transition-all text-center group"
                  >
                    <div className="w-16 h-16 bg-brand-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <FileText className="w-8 h-8 text-brand-secondary" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Manual Entry</h4>
                    <p className="text-sm text-slate-500 font-light">Define your background manually for a targeted simulation.</p>
                  </button>
                </div>
              </motion.div>
            ) : step === 'info' ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                 <div className="text-center mb-12">
                   {activeResume && (
                     <div className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-brand-primary/20">
                       <CheckCircle2 className="w-3 h-3" /> Profile Extracted: {activeResume}
                     </div>
                   )}
                   <h2 className="text-3xl font-bold text-slate-900 mb-4">Refine Your Trajectory</h2>
                   <p className="text-slate-500 font-light italic">"Growth is not a straight line, it's a trajectory we navigate together." — NOVA</p>
                 </div>

                 <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2 relative">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Current Role</label>
                         <div className="relative group">
                          <select 
                             className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all appearance-none bg-white cursor-pointer"
                             value={formData.currentRole}
                             onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                          >
                            <option value="">Select Role...</option>
                            {COMMON_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                            <option value="Other">Other (Custom Entry)</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                         </div>
                         {formData.currentRole === 'Other' && (
                           <input 
                              type="text" 
                              placeholder="Enter your custom role"
                              className="mt-2 w-full px-5 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 outline-none text-sm"
                              onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                           />
                         )}
                       </div>
                       <div className="space-y-2 relative">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Target Transformation</label>
                         <div className="relative group">
                          <select 
                             className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all appearance-none bg-white cursor-pointer"
                             value={formData.desiredRole}
                             onChange={(e) => setFormData({...formData, desiredRole: e.target.value})}
                          >
                            <option value="">Select Goal...</option>
                            {GOAL_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                            <option value="Other">Other (Custom Goal)</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                         </div>
                         {formData.desiredRole === 'Other' && (
                           <input 
                              type="text" 
                              placeholder="Enter your target goal"
                              className="mt-2 w-full px-5 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 outline-none text-sm"
                              onChange={(e) => setFormData({...formData, desiredRole: e.target.value})}
                           />
                         )}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Key Competencies</label>
                       <textarea 
                          placeholder="What strengths should NOVA leverage in this roadmap?"
                          className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all h-24 text-sm"
                          value={formData.strengths}
                          onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Technical/Transferable Skills</label>
                       <textarea 
                          placeholder="e.g. SQL, WMS, Robotics, Labor Planning..."
                          className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all h-24 text-sm"
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
                    
                    <button 
                      onClick={() => setStep('selection')}
                      className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
                    >
                      Go Back
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
                            { step: "01. Narrative Shift", desc: `Reframing your experience in "${formData.currentRole}" into "Strategic Resource Management".` },
                            { step: "02. Technical Layer", desc: "Mastering the AI tools used for labor planning and network visibility." },
                            { step: "03. Authority Play", desc: `Securing a "${formData.desiredRole}" perspective by leading a pilot project with measurable ROI.` }
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
                          detail: { type: 'individual', prompt: `I want to transition from ${formData.currentRole} to ${formData.desiredRole}. NOVA just generated a roadmap for me. Let's discuss step 1: Narrative Shift.` } 
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
