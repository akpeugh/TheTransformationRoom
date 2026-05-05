import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Mail
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import Markdown from "react-markdown";

import { GlobalWorkerOptions } from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set PDF.js worker using Vite's URL import
GlobalWorkerOptions.workerSrc = pdfWorker;

interface ResumeOptimizerProps {
  onClose: () => void;
}

export const ResumeOptimizer = ({ onClose }: ResumeOptimizerProps) => {
  const [step, setStep] = useState<
    | "goal"
    | "path"
    | "behavioral-q"
    | "behavioral-out"
    | "r-title"
    | "r-gap"
    | "r-upload"
    | "r-review"
  >("goal");
  const [loading, setLoading] = useState(false);
  const [parsingFile, setParsingFile] = useState(false);
  const [formData, setFormData] = useState({
    careerGoal: "",
    pathSelection: "", // "behavioral" | "resume"
    behavioralQ1: "",
    behavioralQ2: "",
    behavioralQ3: "",
    behavioralQ4: "",
    targetIndustry: "",
    careerValue: "",
    salaryRange: "",
    companyCulture: [] as string[], // new multi-select
    currentRole: "",
    targetRole: "",
    biggestGap: "",
    experienceLevel: "Mid-Level",
    rawContent: ""
  });
  const [optimizedContent, setOptimizedContent] = useState("");
  const [parsedResult, setParsedResult] = useState<{
    scores: {
      proactiveVsCalculated: number;
      analyticalVsIntuitive: number;
      adaptabilityVsConsistency: number;
      independentVsCollaborative: number;
    };
    overview: string;
    roles: string;
    nextSteps: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" }), []);

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
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert Career Coach and Organizational Psychologist at "The Transformation Room". 
        Your persona: Deeply empathetic to the stress of modern careers, burnout, and operations, but always acting as a technological visionary. You help individuals align their human potential with the future of automated, tech-forward industries.
        
        USER PROFILE:
        - Main Goal: ${formData.careerGoal}
        - Target Industry: ${formData.targetIndustry}
        - Important Career Value: ${formData.careerValue}
        - Strategy vs Execution: ${formData.behavioralQ1}
        - Data vs People: ${formData.behavioralQ2}
        - Environment: ${formData.behavioralQ3}
        - Obstacles Reaction: ${formData.behavioralQ4}
        - Target Company Culture: ${formData.companyCulture.join(", ")}
        ${formData.salaryRange ? `- Target Salary Range: ${formData.salaryRange}` : ""}
        
        TASK:
        1. Evaluate the user's behavioral traits based on their answers, honoring their main goal of "${formData.careerGoal}". Connect their traits conceptually to established cognitive and behavioral aptitude frameworks (like logical reasoning, adaptability, proactivity, and level-headedness).
        2. Suggest 3-5 high-fit job titles or career paths that align with their traits within their target industry.
        3. Provide 3 immediate, actionable tasks the user should take to start moving towards their goal.
        
        OUTPUT FORMAT: 
        You MUST return ONLY a valid JSON object matching the following structure (no markdown code blocks, just raw JSON).
        {
          "scores": {
            "proactiveVsCalculated": <number 0-100 where 0 is Highly Proactive/Activator, 100 is Calculated/Deliberative>,
            "analyticalVsIntuitive": <number 0-100 where 0 is Purely Analytical/Logical, 100 is Highly Intuitive/People-Oriented>,
            "adaptabilityVsConsistency": <number 0-100 where 0 is Highly Adaptable/Flexible, 100 is Process-driven/Consistent>,
            "independentVsCollaborative": <number 0-100 where 0 is Fiercely Independent, 100 is Deeply Collaborative/Consensus-driven>
          },
          "overview": "<markdown string of the behavior profile analysis>",
          "roles": "<markdown string of recommended roles with bullet points>",
          "nextSteps": "<markdown string of actionable tasks>"
        }`,
      });

      let text = response.text || "{}";
      text = text.replace(/^```json/g, "").replace(/```$/g, "").trim();
      const result = JSON.parse(text);

      setParsedResult(result);
      // Construct a combined markdown for PDF/Email export purposes
      setOptimizedContent(`## 🧠 Your Behavioral Profile\n${result.overview}\n\n## 💼 Recommended Roles\n${result.roles}\n\n## 📝 Actionable Next Steps\n${result.nextSteps}`);
      setStep("behavioral-out");
    } catch (error) {
      console.error("Assessment failed:", error);
      alert("Assessment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert Executive Resume Writer at "The Transformation Room", specializing in Supply Chain, Logistics, and High-Tech Operations. 
        Your persona is deeply empathetic to operational stress and burnout, yet you are a technological visionary. You help professionals frame their experience not just as "doing the work", but as scaling systems, leading people, and driving tech-forward transformation.
        
        OPTIMIZATION TARGET:
        - Current Role: ${formData.currentRole}
        - Target Role: ${formData.targetRole}
        - Address Gap: ${formData.biggestGap}
        - Level: ${formData.experienceLevel}
        
        INPUT CONTENT (Resume Text):
        ${formData.rawContent}
        
        TASK:
        1. Analyze the input resume and provide quick tips and suggestions on changes needed.
        2. Rewrite the professional summary and key sections to focus on "Operational Transformation" and "Systems Thinking."
        3. Bridge the gap mentioned by highlighting transferable skills in automation, data, or leadership.
        4. Provide 2 different format options for the professional summary (Option A: Direct & Impact-focused, Option B: Visionary & Strategic).
        5. Integrate mentions of "The Transformation Room" philosophy implicitly (e.g., Data, Robotics, Optimization, Network Flow).
        
        OUTPUT FORMAT (Use Markdown formatting):
        ## 💡 Tips & Suggestions
        (Provide 3 actionable tips on formatting or content positioning)

        ## ✨ Proposed Rewrites

        ### Option A: Impact-Focused
        (A punchy, metric-driven summary and 3 key impact bullets)

        ### Option B: Visionary & Strategic
        (A broader strategic summary and 3 key impact bullets)
        `,
      });

      setOptimizedContent(response.text || "Optimization complete. Please review.");
      setStep("r-review");
    } catch (error) {
      console.error("Optimization failed:", error);
      alert("Optimization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([optimizedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "TTR_Optimized_Resume_Summary.md";
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  const downloadPdf = async (filename: string) => {
    const element = document.getElementById('results-content');
    if (!element) return;
    
    // @ts-ignore
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin:       0.5,
      filename:     `${filename}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };
    html2pdf().from(element).set(opt).save();
  };

  const emailResults = () => {
    const subject = encodeURIComponent("My Career Assessment Results from The Transformation Room");
    const body = encodeURIComponent("Here are my results:\n\n" + optimizedContent);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-slate-50 flex flex-col md:flex-row overflow-hidden"
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3 bg-white text-slate-500 rounded-full hover:bg-slate-100 hover:text-slate-900 shadow-sm transition-colors cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>
      
      {/* Left Side: context */}
      <div className="md:w-1/3 bg-brand-primary p-8 md:p-16 text-white flex flex-col justify-between overflow-y-auto relative z-10 shadow-2xl">
        <div>
          <div className="w-14 h-14 rounded-2xl bg-brand-secondary/20 flex items-center justify-center mb-8 shadow-inner shadow-white/10">
            <Sparkles className="w-7 h-7 text-brand-secondary" />
          </div>
          <h2 className="text-4xl font-bold mb-6 tracking-tight">
              {["behavioral-q", "behavioral-out"].includes(step) || formData.pathSelection === "behavioral" 
                ? "Career Assessment" 
                : "Resume Optimization"} Wizard
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              {["behavioral-q", "behavioral-out"].includes(step) || formData.pathSelection === "behavioral"
                ? "Discover your ideal roles and actionable next steps based on your professional traits and goals."
                : "Bridge the technical gap in your career narrative. We help transition your experience from traditional logistics to automated operational excellence."}
            </p>
            
            <div className="space-y-6">
              {(["goal", "path"].includes(step) || formData.pathSelection === "behavioral" ? [
                { label: "Career Goal", active: true },
                { label: "Path Selection", active: step !== "goal" },
                { label: "Behavioral Assessment", active: ["behavioral-q", "behavioral-out"].includes(step) },
                { label: "Results & Tasks", active: step === "behavioral-out" },
              ] : [
                { label: "Career Goal", active: true },
                { label: "Define Roles", active: ["r-title", "r-gap", "r-upload", "r-review"].includes(step) },
                { label: "Identify Gaps", active: ["r-gap", "r-upload", "r-review"].includes(step) },
                { label: "Upload Content", active: ["r-upload", "r-review"].includes(step) },
                { label: "Review Edits", active: step === "r-review" },
              ]).map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full transition-all ${s.active ? 'bg-brand-secondary scale-125 shadow-[0_0_8px_rgba(20,184,166,0.6)]' : 'bg-white/20'}`} />
                  <span className={`text-xs font-bold uppercase tracking-widest ${s.active ? 'text-white' : 'text-white/40'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hidden md:block mt-8">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-secondary" />
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Free Community Tool</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 md:p-16 overflow-y-auto bg-white relative flex flex-col">
          <AnimatePresence mode="wait">
            {step === "goal" && (
              <motion.div 
                key="goal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 my-auto"
              >
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">What is your main career objective?</h3>
                  <p className="text-slate-500">Pick the path that best describes your current goals.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    "Find a New Job",
                    "Transition Careers (Industry/Role)",
                    "Get Promoted (Level Up)",
                    "Build My Professional Brand"
                  ].map((goal, i) => (
                    <button 
                      key={i}
                      onClick={() => setFormData({...formData, careerGoal: goal})}
                      className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                        formData.careerGoal === goal 
                        ? 'border-brand-secondary bg-brand-secondary/10 text-brand-primary font-bold' 
                        : 'border-slate-200 bg-white hover:border-brand-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.careerGoal === goal ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {i + 1}
                        </div>
                        {goal}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button 
                    disabled={!formData.careerGoal}
                    onClick={() => setStep("path")}
                    className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all disabled:opacity-50"
                  >
                    Next Step <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === "path" && (
              <motion.div 
                key="path"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 my-auto"
              >
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">How would you like to proceed?</h3>
                  <p className="text-slate-500">Choose an assessment path below.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <button 
                    onClick={() => setFormData({...formData, pathSelection: "behavioral"})}
                    className={`text-left p-6 rounded-2xl border transition-all relative overflow-hidden group cursor-pointer ${
                      formData.pathSelection === "behavioral" 
                      ? 'border-brand-secondary bg-brand-secondary/5 font-bold' 
                      : 'border-slate-200 bg-white hover:border-brand-secondary'
                    }`}
                  >
                    <div className="flex gap-4 relative z-10">
                       <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                         <Sparkles className="w-6 h-6" />
                       </div>
                       <div>
                         <h4 className={`text-lg mb-1 ${formData.pathSelection === "behavioral" ? 'text-brand-primary font-bold' : 'text-slate-900 font-bold'}`}>Behavioral Traits Assessment</h4>
                         <p className="text-sm text-slate-500 font-normal">Answer 3 simple questions to discover the best fit roles for your personality and get actionable tasks to pursue them.</p>
                       </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setFormData({...formData, pathSelection: "resume"})}
                    className={`text-left p-6 rounded-2xl border transition-all relative overflow-hidden group cursor-pointer ${
                      formData.pathSelection === "resume" 
                      ? 'border-brand-secondary bg-brand-secondary/5 font-bold' 
                      : 'border-slate-200 bg-white hover:border-brand-secondary'
                    }`}
                  >
                     <div className="flex gap-4 relative z-10">
                       <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                         <FileText className="w-6 h-6" />
                       </div>
                       <div>
                         <h4 className={`text-lg mb-1 ${formData.pathSelection === "resume" ? 'text-brand-primary font-bold' : 'text-slate-900 font-bold'}`}>Direct Resume Optimization</h4>
                         <p className="text-sm text-slate-500 font-normal">Upload your existing resume and optimize your professional summary with our AI tools.</p>
                       </div>
                    </div>
                  </button>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep("goal")} className="flex-grow bg-slate-200 text-slate-700 py-4 rounded-xl font-bold">Back</button>
                  <button 
                    disabled={!formData.pathSelection}
                    onClick={() => setStep(formData.pathSelection === "behavioral" ? "behavioral-q" : "r-title")}
                    className="flex-[2] bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark disabled:opacity-50"
                  >
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === "behavioral-q" && (
              <motion.div 
                key="behavioral-q"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex flex-col h-full"
              >
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Behavioral Profile</h3>
                  <p className="text-slate-500">Answer a few brief questions so we can understand your professional style.</p>
                </div>
                
                <div className="space-y-8 flex-grow overflow-y-auto pr-2 pb-8">
                  {/* Q1 & Q3: Text Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">Current Title & Target Industry</label>
                      <input 
                        type="text"
                        className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:border-brand-secondary outline-none transition-all shadow-sm"
                        placeholder="e.g. Ops Manager in Tech..."
                        value={formData.targetIndustry}
                        onChange={(e) => setFormData({...formData, targetIndustry: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">Target Salary Range (Optional)</label>
                      <input 
                        type="text"
                        className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:border-brand-secondary outline-none transition-all shadow-sm"
                        placeholder="e.g. $100k - $120k"
                        value={formData.salaryRange}
                        onChange={(e) => setFormData({...formData, salaryRange: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Q2 / Career Values */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">What's most important to you in a career?</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Flexibility and Work-Life Balance",
                        "High Compensation and Wealth Building",
                        "Rapid Career Growth and Leadership",
                        "Meaningful Impact and Purpose",
                        "Job Security and Stability"
                      ].map((val) => (
                         <label key={val} className={`cursor-pointer border p-4 rounded-xl flex items-center gap-3 transition-all ${formData.careerValue === val ? 'bg-brand-secondary/10 border-brand-secondary' : 'bg-white border-slate-200 hover:border-brand-secondary/50'}`}>
                           <input type="radio" value={val} checked={formData.careerValue === val} onChange={(e) => setFormData({...formData, careerValue: e.target.value})} className="w-4 h-4 text-brand-secondary focus:ring-brand-secondary" />
                           <span className={formData.careerValue === val ? 'font-bold text-brand-primary' : 'text-slate-600'}>{val}</span>
                         </label>
                      ))}
                    </div>
                  </div>

                  {/* Company Culture - Multi Select Checkboxes */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Target Company Culture (Select up to 3)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Innovative & Disruptive",
                        "Structured & Organized",
                        "Collaborative & Team-focused",
                        "Autonomous & Independent",
                        "Fast-paced & High-pressure",
                        "Mentorship & Growth-focused"
                      ].map((culture) => (
                        <label key={culture} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded text-brand-secondary focus:ring-brand-secondary"
                            checked={formData.companyCulture.includes(culture)}
                            onChange={(e) => {
                              const newCulture = e.target.checked 
                                ? [...formData.companyCulture, culture].slice(0, 3) 
                                : formData.companyCulture.filter(c => c !== culture);
                              setFormData({...formData, companyCulture: newCulture});
                            }}
                          />
                          <span className="text-sm text-slate-700">{culture}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <hr className="border-slate-200" />

                  {/* Spectrum Questions */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Do you prefer high-level strategy or hands-on execution?</label>
                    <select 
                      value={formData.behavioralQ1} 
                      onChange={(e) => setFormData({...formData, behavioralQ1: e.target.value})}
                      className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:border-brand-secondary outline-none transition-all shadow-sm"
                    >
                      <option value="">Select an option...</option>
                      <option value="High-level strategy and planning">High-level strategy and planning</option>
                      <option value="A mix of both">A mix of both (Strategy & Execution)</option>
                      <option value="Hands-on execution and getting things done">Hands-on execution and getting things done</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">In decision making, are you more data-driven or people-driven?</label>
                    <select 
                      value={formData.behavioralQ2} 
                      onChange={(e) => setFormData({...formData, behavioralQ2: e.target.value})}
                      className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:border-brand-secondary outline-none transition-all shadow-sm"
                    >
                      <option value="">Select an option...</option>
                      <option value="Strictly data and metrics">Strictly data and metrics</option>
                      <option value="Balanced: Data informs, but team consensus matters">Balanced: Data informs, but team consensus matters</option>
                      <option value="People-driven: Relationship and alignment first">People-driven: Relationship and alignment first</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">What kind of work environment do you thrive in?</label>
                    <select 
                      value={formData.behavioralQ3} 
                      onChange={(e) => setFormData({...formData, behavioralQ3: e.target.value})}
                      className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:border-brand-secondary outline-none transition-all shadow-sm"
                    >
                      <option value="">Select an option...</option>
                      <option value="Fast-paced, high pressure, startup vibe">Fast-paced, high pressure, startup vibe</option>
                      <option value="Structured, predictable, corporate environment">Structured, predictable, corporate environment</option>
                      <option value="Highly collaborative, cross-functional teams">Highly collaborative, cross-functional teams</option>
                      <option value="Independent, autonomous, remote work">Independent, autonomous, remote-first</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">When faced with an unexpected obstacle, what is your immediate reaction?</label>
                    <select 
                      value={formData.behavioralQ4} 
                      onChange={(e) => setFormData({...formData, behavioralQ4: e.target.value})}
                      className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:border-brand-secondary outline-none transition-all shadow-sm"
                    >
                      <option value="">Select an option...</option>
                      <option value="Analyze the problem structurally and devise a logical solution">Analyze the problem structurally and devise a logical solution</option>
                      <option value="Rely on my experience and dive into action">Rely on my experience and dive into action</option>
                      <option value="Adapt to the situation and go with the flow">Adapt to the situation and go with the flow</option>
                      <option value="Think outside the box and try a completely new approach">Think outside the box and try a completely new approach</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 shrink-0 pt-4 bg-slate-50 border-t border-slate-200/50">
                  <button onClick={() => setStep("path")} className="flex-grow bg-slate-200 text-slate-700 py-4 rounded-xl font-bold cursor-pointer hover:bg-slate-300 transition-colors">Back</button>
                  <button 
                    disabled={!formData.targetIndustry || !formData.careerValue || !formData.behavioralQ1 || !formData.behavioralQ2 || !formData.behavioralQ3 || !formData.behavioralQ4 || loading}
                    onClick={handleBehavioralAssessment}
                    className="flex-[2] bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Generate Insights</>}
                  </button>
                </div>
              </motion.div>
            )}

            {step === "behavioral-out" && (
              <motion.div 
                key="behavioral-out"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 flex flex-col h-full"
              >
                <div className="flex justify-between items-end shrink-0 pt-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Profile & Next Steps</h3>
                    <p className="text-slate-500 text-sm">Review your suggested paths and tasks below.</p>
                  </div>
                  <button onClick={() => setStep("behavioral-q")} className="text-brand-primary p-2 hover:bg-brand-primary/5 rounded-lg transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer">
                    <RefreshCcw className="w-4 h-4" /> Edit / Regenerate
                  </button>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 text-slate-800 p-6 md:p-8 rounded-[2rem] shadow-inner relative group flex-grow overflow-y-auto" id="results-content">
                  {parsedResult ? (
                    <div className="space-y-10">
                      {/* Section 1: Overview and Chart */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Sparkles className="w-5 h-5 text-brand-secondary" /> Behavioral Profile Overview</h4>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                          <div className="prose prose-slate prose-sm font-sans">
                            <Markdown>{parsedResult.overview}</Markdown>
                          </div>
                          
                          {/* SCORE GRAPHIC */}
                          <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h5 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-4">Trait Insight Analysis</h5>
                            
                            <div className="space-y-5">
                              {[
                                { labelL: "Proactive / Activator", labelR: "Calculated / Deliberative", val: parsedResult.scores?.proactiveVsCalculated || 50 },
                                { labelL: "Analytical / Logical", labelR: "Intuitive / People-focused", val: parsedResult.scores?.analyticalVsIntuitive || 50 },
                                { labelL: "Adaptable / Flexible", labelR: "Consistent / Structured", val: parsedResult.scores?.adaptabilityVsConsistency || 50 },
                                { labelL: "Independent", labelR: "Deeply Collaborative", val: parsedResult.scores?.independentVsCollaborative || 50 }
                              ].map((score, i) => (
                                <div key={i}>
                                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                                    <span>{score.labelL}</span>
                                    <span>{score.labelR}</span>
                                  </div>
                                  <div className="relative h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${score.val}%` }}
                                      transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                                      className="absolute top-0 left-0 h-full bg-brand-secondary" 
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Roles */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg">Recommended Roles</h4>
                        <div className="prose prose-slate prose-sm font-sans max-w-none">
                          <Markdown>{parsedResult.roles}</Markdown>
                        </div>
                      </div>

                      {/* Section 3: Next Steps */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                          <h4 className="text-xl font-bold text-slate-900 mb-4 inline-block px-3 py-1 bg-brand-secondary/10 text-brand-secondary rounded-lg">Actionable Next Steps</h4>
                          <div className="prose prose-slate prose-sm font-sans max-w-none">
                            <Markdown>{parsedResult.nextSteps}</Markdown>
                          </div>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-slate prose-sm max-w-none font-sans leading-relaxed">
                      <Markdown>{optimizedContent}</Markdown>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                   <a 
                    href="https://buy.stripe.com/14k7swbAh3ludRS5kl"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-grow bg-brand-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-brand-primary/20"
                   >
                    Book a Consult <ChevronRight className="w-5 h-5" />
                   </a>
                   <button 
                    onClick={() => downloadPdf('Career_Assessment_Results')}
                    className="flex-[0.5] border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                   >
                    <Download className="w-4 h-4" /> PDF
                   </button>
                   <button 
                    onClick={emailResults}
                    className="flex-[0.5] border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                   >
                    <Mail className="w-4 h-4" /> Email
                   </button>
                </div>
              </motion.div>
            )}

            {step === "r-title" && (
              <motion.div 
                key="r-title"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 my-auto"
              >
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Identify Your Roles</h3>
                  <p className="text-slate-500">What is your current role and where are you headed?</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Current Title</label>
                    <input 
                      type="text" 
                      value={formData.currentRole}
                      onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                      placeholder="e.g. Warehouse Manager"
                      className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:border-brand-secondary outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Target Title</label>
                    <input 
                      type="text" 
                      value={formData.targetRole}
                      onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                      placeholder="e.g. Solutions Design Engineer"
                      className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:border-brand-secondary outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-4 shrink-0">
                  <button onClick={() => setStep("path")} className="flex-grow bg-slate-200 text-slate-700 py-4 rounded-xl font-bold">Back</button>
                  <button 
                    disabled={!formData.currentRole || !formData.targetRole}
                    onClick={() => setStep("r-gap")}
                    className="flex-[2] bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all disabled:opacity-50"
                  >
                    Next Step <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === "r-gap" && (
              <motion.div 
                key="r-gap"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 my-auto"
              >
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Bridge the Gap</h3>
                  <p className="text-slate-500">What is the biggest hurdle in your current narrative?</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    "Lack of formal automation experience",
                    "Transitioning from field to corporate",
                    "Technical jargon vs. operational reality",
                    "Highlighting data-driven achievements",
                    "Shifting from management to strategy"
                  ].map((gap, i) => (
                    <button 
                      key={i}
                      onClick={() => setFormData({...formData, biggestGap: gap})}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        formData.biggestGap === gap 
                        ? 'border-brand-secondary bg-brand-secondary/10 text-brand-primary font-bold' 
                        : 'border-slate-200 bg-white hover:border-brand-secondary'
                      }`}
                    >
                      {gap}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep("r-title")} className="flex-grow bg-slate-200 text-slate-700 py-4 rounded-xl font-bold">Back</button>
                  <button 
                    disabled={!formData.biggestGap}
                    onClick={() => setStep("r-upload")}
                    className="flex-[2] bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === "r-upload" && (
              <motion.div 
                key="r-upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex flex-col h-full"
              >
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Upload Resume Content</h3>
                  <p className="text-slate-500">Upload your PDF/Word document, or paste your text below.</p>
                </div>
                
                <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-brand-secondary transition-colors group relative">
                  <input 
                    type="file" 
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:text-brand-secondary group-hover:bg-brand-secondary/10 transition-colors">
                      {parsingFile ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">Click or drag file to upload</p>
                      <p className="text-xs text-slate-500 font-medium">Supports PDF, DOCX, TXT</p>
                    </div>
                  </div>
                </div>

                <textarea 
                  value={formData.rawContent}
                  onChange={(e) => setFormData({...formData, rawContent: e.target.value})}
                  className="w-full flex-grow min-h-[120px] bg-white border border-slate-200 p-6 rounded-2xl focus:border-brand-secondary outline-none transition-all shadow-inner font-sans text-sm leading-relaxed resize-none"
                  placeholder="Or paste your text here..."
                />

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-800 leading-tight">Our AI will analyze your resume, give feedback, and rewrite your summary with options.</p>
                </div>

                <div className="flex gap-4 shrink-0">
                  <button onClick={() => setStep("r-gap")} className="flex-grow bg-slate-200 text-slate-700 py-4 rounded-xl font-bold">Back</button>
                  <button 
                    disabled={!formData.rawContent || loading || parsingFile}
                    onClick={handleOptimize}
                    className="flex-[2] bg-brand-secondary text-brand-dark py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Analyze & Rewrite</>}
                  </button>
                </div>
              </motion.div>
            )}

            {step === "r-review" && (
              <motion.div 
                key="r-review"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 flex flex-col h-full"
              >
                <div className="flex justify-between items-end shrink-0 pt-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Review & Pick Edits</h3>
                    <p className="text-slate-500 text-sm">Review these suggestions and format options.</p>
                  </div>
                  <button onClick={() => setStep("r-upload")} className="text-brand-primary p-2 hover:bg-brand-primary/5 rounded-lg transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer">
                    <RefreshCcw className="w-4 h-4" /> Edit / Regenerate
                  </button>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 text-slate-800 p-6 md:p-8 rounded-[2rem] shadow-inner relative group flex-grow overflow-y-auto">
                  <div id="results-content" className="prose prose-slate prose-sm max-w-none font-sans leading-relaxed">
                    <Markdown>{optimizedContent}</Markdown>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                   <button 
                    onClick={() => downloadPdf('Optimized_Resume_Summary')}
                    className="flex-grow bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-brand-primary/20"
                   >
                    <Download className="w-5 h-5" /> Save PDF
                   </button>
                   <button 
                    onClick={emailResults}
                    className="flex-grow border-2 border-slate-200 text-slate-500 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-3"
                   >
                    <Mail className="w-5 h-5" /> Email
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </motion.div>
  );
};

