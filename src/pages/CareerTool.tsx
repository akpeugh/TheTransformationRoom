import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FileText, 
  Sparkles, 
  ChevronRight, 
  Download, 
  RefreshCcw, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  X,
  Upload,
  Mail,
  User,
  Zap,
  TrendingUp,
  Target,
  Clock,
  Dna,
  Binary,
  Layers,
  Settings,
  Briefcase,
  Lightbulb,
  ShieldAlert,
  ArrowRight,
  Globe,
  Users,
  Compass,
  Trophy,
  Coffee,
  Heart,
  Map as LucideMap,
  Bot,
  Brain
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from "recharts";
import { GoogleGenAI } from "@google/genai";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import Markdown from "react-markdown";
import SEO from "../components/SEO";

import { GlobalWorkerOptions } from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set PDF.js worker using Vite's URL import
GlobalWorkerOptions.workerSrc = pdfWorker;

const CareerTool = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<
    | "goal"
    | "path"
    | "behavioral-q"
    | "behavioral-generating"
    | "behavioral-out"
    | "r-title"
    | "r-gap"
    | "r-upload"
    | "r-review"
    | "simulator-q"
    | "simulator-out"
  >("goal");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activeSubStep, setActiveSubStep] = useState(1);

  const loadingMessages = [
    "NOVA is analyzing your professional DNA...",
    "Scanning for operational breakthroughs...",
    "Mapping your level-headedness metrics...",
    "Calibrating industry-fit trajectories...",
    "Finalizing your Transformation Blueprint...",
    "Gathering insights from NOVA Intelligence..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading && ["behavioral-q", "behavioral-generating", "simulator-q"].includes(step)) {
      let currentProgress = 0;
      let msgIndex = 0;
      setLoadingMessage(loadingMessages[0]);

      interval = setInterval(() => {
        currentProgress += Math.random() * 5;
        if (currentProgress > 100) currentProgress = 100;
        setGenerationProgress(currentProgress);

        if (Math.floor(currentProgress / 20) > msgIndex && msgIndex < loadingMessages.length - 1) {
          msgIndex++;
          setLoadingMessage(loadingMessages[msgIndex]);
        }
      }, 300);
    }
    return () => clearInterval(interval);
  }, [loading, step]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = params.get('path');
    if (path === 'resume') {
      setStep('goal');
      setFormData(prev => ({ ...prev, pathSelection: 'resume' }));
    } else if (path === 'simulator') {
      setStep('goal');
      setFormData(prev => ({ ...prev, pathSelection: 'simulator' }));
    }
  }, []);

  const [parsingFile, setParsingFile] = useState(false);
  const [formData, setFormData] = useState({
    careerGoal: "",
    pathSelection: "", // "behavioral" | "resume" | "simulator"
    behavioralQ1: "", 
    behavioralQ2: "", 
    behavioralQ3: "", 
    behavioralQ4: "", 
    behavioralQ5: "", 
    behavioralQ6: "", 
    behavioralQ7: "", 
    behavioralQ8: "", 
    targetIndustry: "",
    currentTitle: "",
    careerValue: "",
    salaryRange: "",
    companyCulture: [] as string[],
    rolePreference: "", 
    riskAppetite: "", 
    currentRole: "",
    targetRole: "",
    biggestGap: "",
    experienceLevel: "Mid-Level",
    rawContent: "",
    strengths: "",
    skills: ""
  });

  const [optimizedContent, setOptimizedContent] = useState("");
  const [parsedResult, setParsedResult] = useState<{
    scores: { subject: string; A: number; fullMark: number }[];
    topTraits: { title: string; percentage: number; description: string }[];
    overview: string;
    roles: string;
    nextSteps: string;
    roadmap?: { step: string; desc: string }[];
    gaps?: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ai = useMemo(() => {
    const key = process.env.GEMINI_API_KEY;
    return new GoogleGenAI({ apiKey: key || "" });
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setParsingFile(true);
    try {
      let text = "";
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          text += pageText + "\n";
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.type === "text/plain") {
        text = await file.text();
      } else {
        alert("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
      }

      if (text) {
        setFormData(prev => ({ ...prev, rawContent: text }));
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Error parsing file. Please try pasting the text instead.");
    } finally {
      setParsingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleBehavioralAssessment = async () => {
    setLoading(true);
    setStep("behavioral-generating");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `You are NOVA, an Elite Interstellar Intelligence and strategic guide at The Transformation Room.
        
        USER PROFILE:
        - Main Goal: ${formData.careerGoal}
        - Current Title: ${formData.currentTitle}
        - Target Industry: ${formData.targetIndustry}
        - Strategy vs Execution: ${formData.behavioralQ1}
        - Data vs People: ${formData.behavioralQ2}
        - Problem Solving Style: ${formData.behavioralQ5}
        - Main Value: ${formData.careerValue}
        
        TASK:
        1. Evaluate the user's behavioral traits.
        2. Determine 3 "Top Traits" (percentage and description).
        3. Suggest 3-5 high-fit job titles.
        4. Provide 3 immediate actionable tasks.
        
        OUTPUT FORMAT: 
        You MUST return ONLY a valid JSON object matching the following structure.
        {
          "scores": [
            { "subject": "Proactivity", "A": 90, "fullMark": 100 },
            { "subject": "Analytical", "A": 85, "fullMark": 100 },
            { "subject": "Adaptability", "A": 80, "fullMark": 100 },
            { "subject": "Collaboration", "A": 75, "fullMark": 100 },
            { "subject": "Strategic", "A": 95, "fullMark": 100 }
          ],
          "topTraits": [
            { "title": "Level Headed", "percentage": 95, "description": "..." }
          ],
          "overview": "Analysis text",
          "roles": "Roles markdown list",
          "nextSteps": "Tasks markdown list"
        }`,
      });

      let text = response.text || "{}";
      text = text.replace(/^```json/g, "").replace(/```$/g, "").trim();
      const result = JSON.parse(text);
      setParsedResult(result);
      setOptimizedContent(`## 🧠 Your Behavioral Profile\n${result.overview}\n\n## 💼 Recommended Roles\n${result.roles}\n\n## 📝 Actionable Next Steps\n${result.nextSteps}`);
      setStep("behavioral-out");
    } catch (error) {
      console.error("Assessment failed:", error);
      alert("Assessment failed. Please try again.");
      setStep("behavioral-q");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    setLoading(true);
    setGenerationProgress(0);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `You are NOVA, providing a Career Path Simulation.
        Current Role: ${formData.currentRole}
        Desired Role: ${formData.targetRole}
        Strengths: ${formData.strengths}
        Skills: ${formData.skills}
        
        TASK: Generate a transformation roadmap and skill gap analysis.
        
        OUTPUT FORMAT: JSON ONLY
        {
          "roadmap": [
            { "step": "01. Title", "desc": "description" }
          ],
          "gaps": ["gap 1", "gap 2"],
          "overview": "Brief visionary overview of the path"
        }`,
      });

      let text = response.text || "{}";
      text = text.replace(/^```json/g, "").replace(/```$/g, "").trim();
      const result = JSON.parse(text);
      setParsedResult(result);
      setStep("simulator-out");
    } catch (error) {
      console.error("Simulation failed:", error);
      alert("Simulation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `You are an expert Executive Resume Writer.
        Current Role: ${formData.currentRole}
        Target Role: ${formData.targetRole}
        Gap: ${formData.biggestGap}
        Content: ${formData.rawContent}
        
        TASK: Optimize the professional summary for "Operational Transformation".
        Provide 2 format options (A and B).`,
      });

      setOptimizedContent(response.text || "Optimization complete.");
      setStep("r-review");
    } catch (error) {
      console.error("Optimization failed:", error);
      alert("Optimization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row overflow-hidden pt-16">
      <SEO 
        title="Career Hub"
        description="Explore your professional DNA with NOVA Intelligence. Use our Career Path Simulator, Resume Optimizer, and Behavioral Traits Assessment."
      />
      {/* Left Sidebar */}
      <div className="md:w-1/4 bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between overflow-y-auto relative z-10 shadow-2xl shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-secondary/20 flex items-center justify-center border border-white/10">
              <Sparkles className="w-5 h-5 text-brand-secondary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary">Transformation Engine</span>
          </div>
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            {formData.pathSelection === "behavioral" ? "Behavioral Insights" : 
             formData.pathSelection === "resume" ? "Resume Optimization" :
             formData.pathSelection === "simulator" ? "Path Simulation" : "NOVA Intelligence"}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-12 font-light">
            {formData.pathSelection === "behavioral" ? "Uncover your strategic traits and match with high-velocity roles." : 
             formData.pathSelection === "resume" ? "Reframing your experience for the next generation of operations." :
             formData.pathSelection === "simulator" ? "Mapping the trajectory from where you are to where you want to be." : 
             "Select a specialized carrier tool to begin your transformation journey."}
          </p>

          <div className="space-y-6">
            {(formData.pathSelection === "behavioral" ? [
              { label: "Objective", active: step === "goal" },
              { label: "Assessment", active: step === "behavioral-q" },
              { label: "Results", active: step === "behavioral-out" },
            ] : formData.pathSelection === "simulator" ? [
              { label: "Objective", active: step === "goal" },
              { label: "Constraints", active: step === "simulator-q" },
              { label: "Roadmap", active: step === "simulator-out" },
            ] : [
              { label: "Objective", active: step === "goal" },
              { label: "Optimization", active: ["r-title", "r-gap", "r-upload", "r-review"].includes(step) },
            ]).map((s, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${s.active ? 'bg-brand-secondary scale-150 shadow-[0_0_12px_rgba(20,184,166,0.8)]' : 'bg-white/10 group-hover:bg-white/30'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${s.active ? 'text-white' : 'text-white/30'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
             <Bot className="w-5 h-5 text-brand-secondary" />
             <span className="text-xs font-bold text-white">NOVA Advice</span>
          </div>
          <p className="text-[11px] text-slate-400 italic">"Technology is the bridge, but strategy is the blueprint. Let's build yours."</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-white flex flex-col relative">
        <AnimatePresence mode="wait">
          {step === "goal" && (
            <motion.div key="goal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-xl mx-auto my-auto py-12 md:py-0">
               <h3 className="text-3xl font-bold text-slate-900 mb-4">What is your main career objective?</h3>
               <p className="text-slate-500 mb-10">Select the primary outcome you're looking for today.</p>
               <div className="grid grid-cols-1 gap-4 mb-10">
                  {[
                    "Find a New Job",
                    "Transition Careers (Industry/Role)",
                    "Get Promoted (Level Up)",
                    "Build My Professional Brand"
                  ].map((goal, i) => (
                    <button key={i} onClick={() => setFormData({...formData, careerGoal: goal})} className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${formData.careerGoal === goal ? 'border-brand-secondary bg-brand-secondary/10 text-brand-primary font-bold shadow-sm' : 'border-slate-200 bg-white hover:border-brand-secondary'}`}>
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.careerGoal === goal ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {i + 1}
                          </div>
                          {goal}
                       </div>
                    </button>
                  ))}
               </div>
               <button disabled={!formData.careerGoal} onClick={() => setStep("path")} className="w-full bg-brand-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all disabled:opacity-50">
                  Select Tool Path <ChevronRight className="w-5 h-5" />
               </button>
            </motion.div>
          )}

          {step === "path" && (
            <motion.div key="path" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto my-auto py-12 md:py-0">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Transformation Tool</h3>
              <p className="text-slate-500 mb-10">Mix and match intelligence layers according to your needs.</p>
              
              <div className="grid grid-cols-1 gap-6 mb-10">
                <button onClick={() => setFormData({...formData, pathSelection: "simulator"})} className={`text-left p-8 rounded-[2rem] border transition-all relative overflow-hidden group cursor-pointer ${formData.pathSelection === "simulator" ? 'border-brand-secondary bg-brand-secondary/5 font-bold' : 'border-slate-200 bg-white hover:border-brand-secondary shadow-sm'}`}>
                   <div className="flex gap-6 relative z-10">
                      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                        <LucideMap className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className={`text-xl mb-2 ${formData.pathSelection === "simulator" ? 'text-brand-primary font-bold' : 'text-slate-900 font-bold'}`}>Career Path Simulator</h4>
                        <p className="text-sm text-slate-500 font-normal leading-relaxed">Map your trajectory, identify skill gaps, and get strategic positioning advice for your next high-velocity move.</p>
                      </div>
                   </div>
                </button>

                <button onClick={() => setFormData({...formData, pathSelection: "resume"})} className={`text-left p-8 rounded-[2rem] border transition-all relative overflow-hidden group cursor-pointer ${formData.pathSelection === "resume" ? 'border-brand-secondary bg-brand-secondary/5 font-bold' : 'border-slate-200 bg-white hover:border-brand-secondary shadow-sm'}`}>
                   <div className="flex gap-6 relative z-10">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className={`text-xl mb-2 ${formData.pathSelection === "resume" ? 'text-brand-primary font-bold' : 'text-slate-900 font-bold'}`}>Resume Optimization</h4>
                        <p className="text-sm text-slate-500 font-normal leading-relaxed">Reframing traditional logistics into transformation-focused narratives. Optimized for both AI scanners and executive decision-makers.</p>
                      </div>
                   </div>
                </button>

                <button onClick={() => setFormData({...formData, pathSelection: "behavioral"})} className={`text-left p-8 rounded-[2rem] border transition-all relative overflow-hidden group cursor-pointer ${formData.pathSelection === "behavioral" ? 'border-brand-secondary bg-brand-secondary/5 font-bold' : 'border-slate-200 bg-white hover:border-brand-secondary shadow-sm'}`}>
                   <div className="flex gap-6 relative z-10">
                      <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className={`text-xl mb-2 ${formData.pathSelection === "behavioral" ? 'text-brand-primary font-bold' : 'text-slate-900 font-bold'}`}>Behavioral Traits Assessment</h4>
                        <p className="text-sm text-slate-500 font-normal leading-relaxed">Discover your cognitive landscape and identify high-fit roles based on how you naturally think and solve operational entropy.</p>
                      </div>
                   </div>
                </button>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep("goal")} className="flex-grow bg-slate-100 text-slate-600 py-5 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Project Objective</button>
                <button disabled={!formData.pathSelection} onClick={() => setStep(formData.pathSelection === "behavioral" ? "behavioral-q" : formData.pathSelection === "simulator" ? "simulator-q" : "r-title")} className="flex-[2] bg-brand-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all disabled:opacity-50">
                  Initialize Layer <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === "behavioral-q" && (
            <motion.div key="behavioral-q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto w-full">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-bold text-slate-900">Career Personality Assessment</h3>
                  <div className="flex gap-1.5">
                    {[1,2,3].map(i => (
                      <div key={i} className={`w-8 h-2 rounded-full ${activeSubStep >= i ? 'bg-brand-secondary' : 'bg-slate-100'}`} />
                    ))}
                  </div>
               </div>

               {activeSubStep === 1 && (
                 <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Current Professional Title</label>
                          <input type="text" className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-secondary outline-none transition-all" value={formData.currentTitle} onChange={(e) => setFormData({...formData, currentTitle: e.target.value})} placeholder="e.g. Operations Director" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Target Sector</label>
                          <input type="text" className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-secondary outline-none transition-all" value={formData.targetIndustry} onChange={(e) => setFormData({...formData, targetIndustry: e.target.value})} placeholder="e.g. High-Tech Fulfillment" />
                       </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 mb-4 block">Where do you provide the most leverage?</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {[{id: "Strategy", icon: <Layers />}, {id: "Execution", icon: <Zap />}].map(opt => (
                             <button key={opt.id} onClick={() => setFormData({...formData, behavioralQ1: opt.id})} className={`p-6 rounded-2xl border flex items-center gap-4 transition-all ${formData.behavioralQ1 === opt.id ? 'bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20' : 'bg-white border-slate-200 hover:border-brand-secondary'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${formData.behavioralQ1 === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-400'}`}>
                                  {opt.icon}
                                </div>
                                <span className="font-bold">{opt.id}</span>
                             </button>
                           ))}
                        </div>
                    </div>
                 </div>
               )}

               {activeSubStep === 2 && (
                 <div className="space-y-8">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 mb-4 block">Your primary problem-solving style:</label>
                    <div className="grid grid-cols-1 gap-4">
                       {[
                         {id: "Systemic Visionary", sub: "Abstract, non-linear pattern recognition.", icon: <Brain />},
                         {id: "Process Optimizer", sub: "Sequential, structured logic.", icon: <Settings className="w-5 h-5" />},
                         {id: "Crisis Orchestrator", sub: "High-speed tactical adaptation.", icon: <Zap /> }
                       ].map(opt => (
                         <button key={opt.id} onClick={() => setFormData({...formData, behavioralQ5: opt.id})} className={`p-8 rounded-3xl border flex items-center gap-6 transition-all ${formData.behavioralQ5 === opt.id ? 'bg-brand-primary text-white border-brand-primary shadow-xl' : 'bg-white border-slate-100 hover:border-brand-secondary'}`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${formData.behavioralQ5 === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-50 text-slate-400'}`}>
                              {opt.icon}
                            </div>
                            <div className="text-left">
                               <p className="font-bold text-lg leading-none mb-1">{opt.id}</p>
                               <p className="text-sm opacity-60 font-light">{opt.sub}</p>
                            </div>
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               {activeSubStep === 3 && (
                 <div className="space-y-8">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 mb-4 block">What value is non-negotiable for your next role?</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {[
                         {id: "Rapid Growth", icon: <Zap />},
                         {id: "Stability", icon: <ShieldCheck />},
                         {id: "Compensation", icon: <Trophy />},
                         {id: "Balance", icon: <Coffee />},
                         {id: "Purpose", icon: <Heart />}
                       ].map(opt => (
                         <button key={opt.id} onClick={() => setFormData({...formData, careerValue: opt.id})} className={`p-6 rounded-[2.5rem] border flex flex-col items-center gap-3 transition-all ${formData.careerValue === opt.id ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white border-slate-100 hover:border-brand-secondary'}`}>
                            {opt.icon}
                            <span className="font-bold text-sm">{opt.id}</span>
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               <div className="mt-12 flex gap-4">
                  {activeSubStep > 1 && (
                    <button onClick={() => setActiveSubStep(s => s - 1)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold">Back</button>
                  )}
                  {activeSubStep < 3 ? (
                    <button onClick={() => setActiveSubStep(s => s + 1)} className="flex-[2] py-5 bg-brand-primary text-white rounded-2xl font-bold">Next Insight</button>
                  ) : (
                    <button onClick={handleBehavioralAssessment} className="flex-[2] py-5 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3">
                       Generate Profile <Sparkles className="w-5 h-5" />
                    </button>
                  )}
               </div>
            </motion.div>
          )}

          {step === "simulator-q" && (
            <motion.div key="simulator-q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto w-full my-auto py-12">
               <h3 className="text-3xl font-bold text-slate-900 mb-4">Initialize Path Simulation</h3>
               <p className="text-slate-500 mb-10">Map your transformation trajectory from current state to desired outcome.</p>
               
               <div className="space-y-6 mb-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Current Role</label>
                       <input type="text" className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-brand-secondary" placeholder="e.g. Warehouse Manager" value={formData.currentRole} onChange={(e) => setFormData({...formData, currentRole: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Target Transformation</label>
                       <input type="text" className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-brand-secondary" placeholder="e.g. Director of Operations" value={formData.targetRole} onChange={(e) => setFormData({...formData, targetRole: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Top Strengths</label>
                     <textarea className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-brand-secondary h-32" placeholder="Describe where you excel..." value={formData.strengths} onChange={(e) => setFormData({...formData, strengths: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Transferable Skills</label>
                     <input type="text" className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-brand-secondary" placeholder="e.g. SQL, Lean Six Sigma, Automation" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
                  </div>
               </div>

               <button onClick={handleSimulate} disabled={!formData.currentRole || !formData.targetRole} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-bold text-xl flex items-center justify-center gap-3 hover:bg-brand-primary transition-all disabled:opacity-50">
                  Simulate Transformation <Zap className="w-6 h-6 text-brand-secondary" />
               </button>
            </motion.div>
          )}

          {/* Result Steps (Behavioral Out, Simulator Out, Resume Review) would go here similarly to ResumeOptimizer.tsx but integrated */}
          {step === "behavioral-generating" && (
             <motion.div key="gen" className="text-center my-auto">
                <Loader2 className="w-20 h-20 text-brand-secondary animate-spin mx-auto mb-8" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{loadingMessage}</h3>
                <div className="max-w-md mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                   <motion.div className="h-full bg-brand-secondary" animate={{ width: `${generationProgress}%` }} />
                </div>
             </motion.div>
          )}

          {step === "behavioral-out" && parsedResult && (
            <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto py-12">
               <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
                  <div className="w-full md:w-1/2">
                     <h3 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Professional Traits Profile</h3>
                     <div className="p-8 bg-slate-900 rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 rounded-full blur-3xl" />
                        <div className="h-[300px]">
                           <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={parsedResult.scores}>
                                 <PolarGrid stroke="#ffffff10" />
                                 <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                 <Radar name="Traits" dataKey="A" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.6} />
                              </RadarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                  </div>
                  <div className="w-full md:w-1/2 space-y-6">
                     <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Core Transformation Pillars</h4>
                     {parsedResult.topTraits.map((trait, i) => (
                        <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                           <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-slate-900">{trait.title}</span>
                              <span className="text-brand-primary font-black">{trait.percentage}% Match</span>
                           </div>
                           <p className="text-xs text-slate-500 leading-relaxed italic">"{trait.description}"</p>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
                  <div className="prose prose-slate prose-sm max-w-none">
                     <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-brand-secondary" /> Ideal Growth Roles
                     </h4>
                     <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                        <Markdown>{parsedResult.roles}</Markdown>
                     </div>
                  </div>
                  <div className="prose prose-slate prose-sm max-w-none">
                     <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-brand-secondary" /> NOVA Action Plan
                     </h4>
                     <div className="bg-brand-primary/5 p-6 rounded-[2rem] border border-brand-primary/10">
                        <Markdown>{parsedResult.nextSteps}</Markdown>
                     </div>
                  </div>
               </div>

               <div className="mt-16 flex gap-6">
                  <button onClick={() => setStep("path")} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold">New Assessment</button>
                  <Link to="/contact" className="flex-1 px-8 py-4 bg-brand-primary text-white rounded-xl font-bold text-center shadow-xl shadow-brand-primary/20">Apply for High-Velocity Coaching</Link>
               </div>
            </motion.div>
          )}

          {step === "simulator-out" && parsedResult && (
            <motion.div key="sim-out" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto py-12">
               <div className="flex items-center gap-8 mb-16">
                  <div className="w-24 h-24 rounded-3xl bg-slate-900 overflow-hidden shrink-0 border border-brand-secondary/30 shadow-2xl">
                    <img src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" alt="NOVA" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">Path Simulation Success</span>
                    <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Your Transformation Roadmap</h2>
                    <p className="text-slate-500 italic mt-2">"The pattern is clear. This transition is not about skill acquisition alone—it's about narrative authority."</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Step-by-Step Trajectory</h4>
                     <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-100">
                        {parsedResult.roadmap?.map((item, i) => (
                           <div key={i} className="relative pl-12">
                              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-brand-secondary flex items-center justify-center text-[10px] font-black text-brand-secondary z-10">{i + 1}</div>
                              <h5 className="font-bold text-slate-900 text-lg mb-1">{item.step}</h5>
                              <p className="text-sm text-slate-500 font-light leading-relaxed">{item.desc}</p>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Identified Skill Gaps</h4>
                        <div className="grid grid-cols-1 gap-3">
                           {parsedResult.gaps?.map((gap, i) => (
                              <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                                 <AlertCircle className="w-4 h-4 text-brand-primary" />
                                 <span className="text-sm font-semibold text-slate-700">{gap}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="p-8 bg-brand-primary rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/20 rounded-full blur-2xl" />
                        <h5 className="text-xs font-black uppercase tracking-widest text-brand-secondary mb-4">NOVA Positioning Strategy</h5>
                        <p className="text-lg font-light leading-relaxed italic">"Stop framing your background as operations. Start framing it as systems orchestrations. Your value is in the flow, not just the facility."</p>
                     </div>
                  </div>
               </div>

               <div className="mt-20 flex flex-col sm:flex-row gap-6">
                  <button onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat', { 
                    detail: { type: 'individual', prompt: `I just simulated a career path with NOVA to ${formData.targetRole}. Let's discuss how to close Step 1: ${parsedResult.roadmap?.[0]?.step}` }
                  }))} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-primary transition-all">
                    <Bot className="w-5 h-5 text-brand-secondary" /> Deconstruct Roadmap with NOVA
                  </button>
                  <Link to="/contact" className="flex-1 py-5 bg-brand-secondary text-brand-dark rounded-2xl font-bold flex items-center justify-center gap-3 text-center">
                    <ShieldCheck className="w-5 h-5" /> Ready for Strategic Transition
                  </Link>
               </div>
            </motion.div>
          )}

          {/* Add basic Resume Review steps... */}
          {(step === "r-title" || step === "r-gap" || step === "r-upload" || step === "r-review") && (
             <motion.div key="res" className="max-w-xl mx-auto w-full my-auto py-12">
                {step === "r-title" && (
                  <div className="space-y-8">
                     <h3 className="text-3xl font-bold text-slate-900">Resume Target Logic</h3>
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Target Role</label>
                           <input type="text" className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 outline-none" placeholder="e.g. Senior Logistics Analyst" value={formData.targetRole} onChange={(e) => setFormData({...formData, targetRole: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Experience Level</label>
                           <select className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 outline-none" value={formData.experienceLevel} onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})}>
                              <option>Entry Level</option>
                              <option>Mid-Level</option>
                              <option>Senior/Executive</option>
                           </select>
                        </div>
                     </div>
                     <button onClick={() => setStep("r-gap")} className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold">Define Narrative Gaps</button>
                  </div>
                )}

                {step === "r-gap" && (
                   <div className="space-y-8">
                      <h3 className="text-3xl font-bold text-slate-900">Identify Your Biggest Gap</h3>
                      <div className="grid grid-cols-1 gap-3">
                         {[
                           "I lack industry-specific technical results.",
                           "My resume sounds like 'doing' not 'leading'.",
                           "I'm transitioning from a different domain.",
                           "I grew from within and have outgrown my bio."
                         ].map((gap, i) => (
                           <button key={i} onClick={() => setFormData({...formData, biggestGap: gap})} className={`text-left p-5 rounded-xl border ${formData.biggestGap === gap ? 'border-brand-secondary bg-brand-secondary/5' : 'border-slate-100'}`}>{gap}</button>
                         ))}
                      </div>
                      <button onClick={() => setStep("r-upload")} className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold">Source Content Identification</button>
                   </div>
                )}

                {step === "r-upload" && (
                   <div className="space-y-8">
                      <h3 className="text-3xl font-bold text-slate-900 text-center">Analyze Your DNA</h3>
                      <div className="border-4 border-dashed border-slate-100 rounded-[3rem] p-12 text-center hover:border-brand-secondary/30 transition-colors group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                         <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <Upload className="w-10 h-10 text-brand-secondary" />
                         </div>
                         <p className="text-xl font-bold text-slate-900 mb-2">Upload Your Profile</p>
                         <p className="text-sm text-slate-400">PDF, DOCX, or TXT Files</p>
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                      {formData.rawContent && (
                        <div className="flex gap-3 items-center justify-center p-3 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                           <ShieldCheck className="w-5 h-5" />
                           <span className="text-xs font-bold uppercase tracking-widest">DNA Successfully Scanned</span>
                        </div>
                      )}
                      <button disabled={!formData.rawContent} onClick={handleOptimize} className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold shadow-xl shadow-brand-primary/20">Optimize Narrative</button>
                   </div>
                )}

                {step === "r-review" && (
                   <div className="max-w-3xl mx-auto w-full">
                      <h3 className="text-3xl font-bold text-slate-900 mb-8">Optimized Narrative</h3>
                      <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-xl relative prose prose-slate max-w-none">
                         <div className="absolute top-6 right-8 flex gap-2">
                            <button onClick={() => setStep("r-upload")} className="p-2 text-slate-400 hover:text-brand-secondary"><RefreshCcw className="w-5 h-5" /></button>
                         </div>
                         <Markdown>{optimizedContent}</Markdown>
                      </div>
                      <div className="mt-12 flex gap-4">
                        <button onClick={() => setStep("path")} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold">New Path</button>
                        <Link to="/contact" className="flex-[2] py-5 bg-brand-primary text-white rounded-2xl font-bold text-center">Secure Transformation Session</Link>
                      </div>
                   </div>
                )}
             </motion.div>
          )}

        </AnimatePresence>

        {/* Global Action Bar */}
        {step !== "goal" && step !== "path" && (
          <div className="absolute top-12 left-12 flex items-center gap-6 z-20">
             <button onClick={() => setStep("path")} className="text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-colors">
                <ChevronRight className="w-5 h-5 rotate-180" /> <span className="text-xs font-black uppercase tracking-widest">Tool Selection</span>
             </button>
          </div>
        )}

        <div className="mt-content-spacer mt-auto pt-12 md:pt-24 text-center">
           <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-full">
             <Bot className="w-4 h-4 text-slate-400" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">NOVA Cognitive Layer Active</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CareerTool;
