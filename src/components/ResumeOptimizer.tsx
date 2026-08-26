import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
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
  Lightbulb,
  ShieldAlert,
  ArrowRight,
  Globe,
  Users,
  Compass,
  Trophy,
  Coffee,
  Heart
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from "recharts";

import Markdown from "react-markdown";
import { extractTextFromFile, validateResumeFile, sanitizeAndNormalizeResumeText } from "../utils/documentParser";

interface ResumeOptimizerProps {
  onClose: () => void;
}

export const ResumeOptimizer = ({ onClose }: ResumeOptimizerProps) => {
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
    if (loading && ["behavioral-q", "behavioral-generating"].includes(step)) {
      setStep("behavioral-generating");
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
  }, [loading]);
  const [parsingFile, setParsingFile] = useState(false);
  const [formData, setFormData] = useState({
    careerGoal: "",
    pathSelection: "", // "behavioral" | "resume"
    behavioralQ1: "", // Strategy vs Execution
    behavioralQ2: "", // Data vs People
    behavioralQ3: "", // Environment Fit
    behavioralQ4: "", // Obstacle Reaction
    behavioralQ5: "", // Decision Speed/Logic
    behavioralQ6: "", // Motivational Driver
    behavioralQ7: "", // Stability vs Growth
    behavioralQ8: "", // Principled Action / Ethics
    targetIndustry: "",
    currentTitle: "",
    careerValue: "",
    salaryRange: "",
    companyCulture: [] as string[],
    rolePreference: "", // Individual Contributor vs Leadership
    riskAppetite: "", // Startups vs established
    currentRole: "",
    targetRole: "",
    biggestGap: "",
    experienceLevel: "Mid-Level",
    rawContent: ""
  });
  const [optimizedContent, setOptimizedContent] = useState("");
  const [parsedResult, setParsedResult] = useState<{
    scores: { subject: string; A: number; fullMark: number }[];
    topTraits: { title: string; percentage: number; description: string }[];
    overview: string;
    roles: string;
    nextSteps: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);



  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateResumeFile(file);
    if (!validation.isValid) {
      console.warn("[ResumeOptimizer] File validation failed:", validation.error);
      alert(validation.error || "Invalid file selected.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setParsingFile(true);
    try {
      let text = await extractTextFromFile(file);
      text = sanitizeAndNormalizeResumeText(text);

      if (text.trim()) {
        console.log(`[ResumeOptimizer] Successfully extracted ${text.length} characters`);
        setFormData(prev => ({ ...prev, rawContent: text.trim() }));
      } else if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".docx")) {
        console.warn("[ResumeOptimizer] No text extracted from file. Possible scan/image-based document.");
        alert("We couldn't extract text from this document. It might be a scanned image. Please try pasting the text manually.");
      }
    } catch (error) {
      console.error("[ResumeOptimizer] Error parsing file:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        error: error instanceof Error ? error.message : error
      });
      alert(`Error parsing file: ${error instanceof Error ? error.message : "Unknown error"}. Please try pasting the text instead.`);
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
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: "Please evaluate the user profile and behavioral traits." }],
          systemInstruction: `You are NOVA, an Elite Interstellar Intelligence and strategic guide at The Transformation Room.
        
        YOUR ROLES:
        - Assessment Engine
        - Coaching Assistant
        - Analytics Interpreter
        - Transformation Advisor
        
        YOUR PERSONA:
        - Wise and Observant: You view operational struggles as "entropy" that needs to be reorganized.
        - Deeply Empathetic: You understand the human cost of inefficient systems—burnout, manual workarounds, and "firefighting" mentality. 
        - Technological Visionary: You see the world through the lens of automation, robotics, and integrated data.
        - Brand Tone: Strategic, futuristic, and reassuring.
        
        USER PROFILE:
        - Main Goal: ${formData.careerGoal}
        - Current Title: ${formData.currentTitle}
        - Target Industry: ${formData.targetIndustry}
        - Important Career Value: ${formData.careerValue}
        - Role Preference: ${formData.rolePreference}
        - Risk Appetite: ${formData.riskAppetite}
        - Strategy vs Execution: ${formData.behavioralQ1}
        - Data vs People: ${formData.behavioralQ2}
        - Environment: ${formData.behavioralQ3}
        - Obstacles Reaction: ${formData.behavioralQ4}
        - Decision Logic: ${formData.behavioralQ5}
        - Motivational Driver: ${formData.behavioralQ6}
        - Growth Bias: ${formData.behavioralQ7}
        - Ethical/Principled Bias: ${formData.behavioralQ8}
        - Target Company Culture: ${formData.companyCulture.join(", ")}
        ${formData.salaryRange ? `- Target Salary Range: ${formData.salaryRange}` : ""}
        
        TASK:
        1. Evaluate the user's behavioral traits based on their answers, honoring their main goal of "${formData.careerGoal}". 
        2. Framework Alignment: Incorporate insights from SquarePeg (Level-headedness, Principled action, Proactivity), O*NET Interest Profiler (Holland Codes), and cognitive reasoning styles (Abstract vs Linear).
        3. Determine 3 "Top Traits" (e.g., 95% Level Headed, 90% Principled, 90% Proactive) with descriptions.
        4. Suggest 3-5 high-fit job titles or career paths that align with their traits within their target industry.
        5. Provide 3 immediate, actionable tasks the user should take to start moving towards their goal.
        
        OUTPUT FORMAT: 
        You MUST return ONLY a valid JSON object matching the following structure (no markdown code blocks, just raw JSON).
        {
          "scores": [
            { "subject": "Proactivity", "A": <number 0-100>, "fullMark": 100 },
            { "subject": "Analytical", "A": <number 0-100>, "fullMark": 100 },
            { "subject": "Adaptability", "A": <number 0-100>, "fullMark": 100 },
            { "subject": "Collaboration", "A": <number 0-100>, "fullMark": 100 },
            { "subject": "Strategic", "A": <number 0-100>, "fullMark": 100 }
          ],
          "topTraits": [
            { "title": "Level Headed", "percentage": 95, "description": "..." },
            { "title": "Principled", "percentage": 90, "description": "..." },
            { "title": "Proactive", "percentage": 90, "description": "..." }
          ],
          "overview": "<markdown string of the behavior profile analysis>",
          "roles": "<markdown string of recommended roles with bullet points>",
          "nextSteps": "<markdown string of actionable tasks>"
        }`
        })
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      let text = data.reply || "{}";
      // Robust JSON extraction
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         text = jsonMatch[0];
      }
      
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
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: "Optimize the resume based on the given parameters." }],
          systemInstruction: `You are an expert Executive Resume Writer at "The Transformation Room", specializing in Supply Chain, Logistics, and High-Tech Operations. 
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
        `
        })
      });

      if (!res.ok) throw new Error("API completely rejected request");
      const data = await res.json();
      setOptimizedContent(data.reply || "Optimization complete. Please review.");
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

  const downloadPdf = async (filename: string, elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      return;
    }
    
    setLoading(true);
    try {
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin:       [0.5, 0.5] as [number, number],
        filename:     `${filename}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          logging: false
        },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
      };
      
      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again or use the Email option.");
    } finally {
      setLoading(false);
    }
  };

  const emailResults = () => {
    const subject = encodeURIComponent("My Career Assessment Results | The Transformation Room");
    const body = encodeURIComponent(
      "Here are my results:\n\n" + 
      optimizedContent + "\n\n" +
      "Personal Notes / Reflections:\n" +
      "[Add your personal message here]\n\n" +
      "---\n" +
      "Discover your own career transformation blueprint at The Transformation Room."
    );
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
      <div className="md:w-1/4 bg-brand-primary p-8 md:p-12 text-white flex flex-col justify-between overflow-y-auto relative z-10 shadow-2xl shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-secondary/20 flex items-center justify-center shadow-inner shadow-white/10">
              <Sparkles className="w-5 h-5 text-brand-secondary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary">Assessment Engine</span>
          </div>
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
              {["behavioral-q", "behavioral-out"].includes(step) || formData.pathSelection === "behavioral" 
                ? "Career Assessment" 
                : "Resume Optimization"}
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed mb-8 opacity-80">
              {["behavioral-q", "behavioral-out"].includes(step) || formData.pathSelection === "behavioral"
                ? "Discover your ideal roles and actionable next steps based on your professional traits and goals."
                : "Bridge the technical gap in your career narrative. We help transition your experience from traditional logistics to automated operational excellence."}
            </p>
            
            <div className="space-y-6">
              {(["goal", "path"].includes(step) || formData.pathSelection === "behavioral" ? [
                { label: "Objective", active: step === "goal" },
                { label: "Path", active: step === "path" },
                { label: "Assessment", active: step === "behavioral-q" },
                { label: "Insights", active: step === "behavioral-out" },
              ] : [
                { label: "Objective", active: step === "goal" },
                { label: "Target", active: ["r-title", "r-gap"].includes(step) },
                { label: "Gap Analysis", active: ["r-gap", "r-upload"].includes(step) },
                { label: "Optimization", active: step === "r-review" },
              ]).map((s, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${s.active ? 'bg-brand-secondary scale-150 shadow-[0_0_12px_rgba(20,184,166,0.8)]' : 'bg-white/10 group-hover:bg-white/30'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${s.active ? 'text-white' : 'text-white/30'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-secondary" />
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Secure & Confidential</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-white relative flex flex-col">
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
                         <p className="text-sm text-slate-500 font-normal">Answer a few brief questions to discover the best fit roles for your personality and get actionable tasks to pursue them.</p>
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
                className="space-y-6 flex flex-col h-full overflow-hidden"
              >
                <div className="shrink-0">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 leading-tight">Career Assessment</h3>
                      <p className="text-slate-500 text-sm">Building your Transformation Blueprint</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step {activeSubStep} of 3</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className={`h-full flex-1 transition-all duration-500 ${activeSubStep >= s ? 'bg-brand-secondary' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-2 pb-8 scrollbar-hide">
                  <AnimatePresence mode="wait">
                    {activeSubStep === 1 && (
                      <motion.div 
                        key="sub1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Current Title</label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                              <input 
                                type="text"
                                className="w-full bg-slate-50 border border-slate-200 p-5 pl-14 rounded-2xl focus:border-brand-secondary focus:bg-white outline-none transition-all shadow-sm"
                                placeholder="e.g. Director of Operations"
                                value={formData.currentTitle}
                                onChange={(e) => setFormData({...formData, currentTitle: e.target.value})}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Target Industry</label>
                            <div className="relative">
                              <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                              <input 
                                type="text"
                                className="w-full bg-slate-50 border border-slate-200 p-5 pl-14 rounded-2xl focus:border-brand-secondary focus:bg-white outline-none transition-all shadow-sm"
                                placeholder="e.g. Clean Energy Tech"
                                value={formData.targetIndustry}
                                onChange={(e) => setFormData({...formData, targetIndustry: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Ideal Role Environment</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                              { id: "Startup / Fast Growth", sub: "Priority on Speed & Scale", icon: <Zap /> },
                              { id: "Mid-Market", sub: "Focus on Stability & Growth", icon: <TrendingUp /> },
                              { id: "Enterprise", sub: "Complexity, Process & Legacy", icon: <Globe /> }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, riskAppetite: opt.id})}
                                className={`p-6 rounded-[2.5rem] border text-center transition-all ${
                                  formData.riskAppetite === opt.id 
                                  ? 'bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20 scale-[1.02]' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-brand-secondary'
                                }`}
                              >
                                <div className={`mx-auto mb-4 w-12 h-12 rounded-2xl flex items-center justify-center ${formData.riskAppetite === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-400'}`}>
                                  {opt.icon}
                                </div>
                                <p className="text-sm font-bold">{opt.id}</p>
                                <p className="text-[10px] opacity-60 mt-1 font-bold uppercase tracking-widest">{opt.sub}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Path Preference</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                          { id: "Individual Contributor", sub: "Focusing on deep individual contributions and mastery.", icon: <User /> },
                          { id: "Team Leadership", sub: "Empowering teams and managing workflow orchestration.", icon: <Users /> }
                        ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, rolePreference: opt.id})}
                                className={`p-6 rounded-3xl border flex items-center gap-5 transition-all ${
                                  formData.rolePreference === opt.id 
                                  ? 'bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-brand-secondary'
                                }`}
                              >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${formData.rolePreference === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-400'}`}>
                                  {opt.icon}
                                </div>
                                <div className="text-left">
                                  <p className="text-sm font-bold">{opt.id}</p>
                                  <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">{opt.sub}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeSubStep === 2 && (
                      <motion.div 
                        key="sub2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                         <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Decision Lens: Where is your focus?</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { id: "Strategy", sub: "Systems design and long-term strategic planning.", icon: <Layers /> },
                              { id: "Execution", sub: "Momentum of direct execution and tactical delivery.", icon: <Zap /> }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, behavioralQ1: opt.id})}
                                className={`p-6 rounded-[2.5rem] border text-left transition-all flex gap-5 items-center ${
                                  formData.behavioralQ1 === opt.id 
                                  ? 'bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20 scale-[1.02]' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-brand-secondary'
                                }`}
                              >
                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 ${formData.behavioralQ1 === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-50 text-slate-400'}`}>
                                  {opt.icon}
                                </div>
                                <div>
                                  <p className="text-base font-bold">{opt.id}</p>
                                  <p className="text-xs opacity-60 font-medium">{opt.sub}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Cognitive Bias: Logic vs. Empathy</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                              { id: "Logician", sub: "I prioritize objective data and pure logic to drive decisions.", icon: <Binary /> },
                              { id: "Contextualist", sub: "I blend operational metrics with situational human context.", icon: <Compass /> },
                              { id: "Human-First", sub: "I prioritize relationship health and team consensus above all.", icon: <Users /> }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, behavioralQ2: opt.id})}
                                className={`p-6 rounded-3xl border text-center transition-all ${
                                  formData.behavioralQ2 === opt.id 
                                  ? 'bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-brand-secondary'
                                }`}
                              >
                                <div className={`mx-auto mb-4 w-12 h-12 rounded-2xl flex items-center justify-center ${formData.behavioralQ2 === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-400'}`}>
                                  {opt.icon}
                                </div>
                                <p className="text-sm font-bold">{opt.id}</p>
                                <p className="text-[10px] opacity-60 mt-1 font-bold uppercase tracking-widest">{opt.sub}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Problem Solving Style</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { id: "Systemic Visionary", sub: "Connecting dots across complex, abstract domains.", icon: <Lightbulb /> },
                              { id: "Process Optimizer", sub: "Step-by-step sequential logic and structure.", icon: <Clock /> }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, behavioralQ5: opt.id})}
                                className={`p-6 rounded-3xl border flex items-center gap-5 transition-all ${
                                  formData.behavioralQ5 === opt.id 
                                  ? 'bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-brand-secondary'
                                }`}
                              >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${formData.behavioralQ5 === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-400'}`}>
                                  {opt.icon}
                                </div>
                                <div className="text-left">
                                  <p className="text-sm font-bold">{opt.id}</p>
                                  <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">{opt.sub}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeSubStep === 3 && (
                      <motion.div 
                        key="sub3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-8"
                      >
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">What matters most?</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                              { id: "Work-Life Balance", label: "Balance", icon: <Coffee /> },
                              { id: "High Compensation", label: "Reward", icon: <Trophy /> },
                              { id: "Rapid Growth", label: "Velocity", icon: <Zap /> },
                              { id: "Social Impact", label: "Purpose", icon: <Heart /> },
                              { id: "Job Security", label: "Stability", icon: <ShieldCheck /> }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, careerValue: opt.id})}
                                className={`p-5 rounded-3xl border text-center transition-all ${
                                  formData.careerValue === opt.id 
                                  ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20' 
                                  : 'bg-white border-slate-100 text-slate-600 hover:border-brand-secondary'
                                }`}
                              >
                                <div className={`mx-auto mb-3 ${formData.careerValue === opt.id ? 'text-brand-secondary' : 'text-slate-300'}`}>
                                  {opt.icon}
                                </div>
                                <p className="text-xs font-bold">{opt.label}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Ideal Culture Alignment (Max 3)</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                             {[
                              "Innovative",
                              "Structured",
                              "Agile",
                              "Flat Org",
                              "Outcome-Based",
                              "Collaborative",
                              "Direct",
                              "Inclusive"
                            ].map((tag) => (
                              <button
                                key={tag}
                                onClick={() => {
                                  const exists = formData.companyCulture.includes(tag);
                                  if (exists) {
                                      setFormData({...formData, companyCulture: formData.companyCulture.filter(c => c !== tag)});
                                  } else if (formData.companyCulture.length < 3) {
                                      setFormData({...formData, companyCulture: [...formData.companyCulture, tag]});
                                  }
                                }}
                                className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                  formData.companyCulture.includes(tag)
                                  ? 'bg-brand-secondary/20 text-brand-secondary border-brand-secondary'
                                  : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Integrity Bias: Outcomes vs. Principles</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { id: "Principled Action", sub: "I choose the right path over the easiest outcome.", icon: <ShieldCheck /> },
                              { id: "Pragmatic Logic", sub: "I focus on the most efficient and level-headed result.", icon: <Zap /> }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, behavioralQ8: opt.id})}
                                className={`p-6 rounded-[2.5rem] border text-left transition-all flex gap-5 items-center ${
                                  formData.behavioralQ8 === opt.id 
                                  ? 'bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20 scale-[1.02]' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-brand-secondary'
                                }`}
                              >
                                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shrink-0 ${formData.behavioralQ8 === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-50 text-slate-400'}`}>
                                  {opt.icon}
                                </div>
                                <div>
                                  <p className="text-sm font-bold">{opt.id}</p>
                                  <p className="text-[10px] opacity-60 font-medium">{opt.sub}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-4 shrink-0 pt-4 bg-white border-t border-slate-100 mt-auto">
                  {activeSubStep > 1 ? (
                    <button 
                      onClick={() => setActiveSubStep(v => v - 1)} 
                      className="px-8 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      Back
                    </button>
                  ) : (
                    <button 
                      onClick={() => setStep("path")} 
                      className="px-8 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      Exit
                    </button>
                  )}
                  
                  {activeSubStep < 3 ? (
                    <button 
                      onClick={() => setActiveSubStep(v => v + 1)}
                      className="flex-1 bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20"
                    >
                      Next Step <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button 
                      disabled={!formData.currentTitle || !formData.targetIndustry || !formData.behavioralQ1 || !formData.behavioralQ2 || loading}
                      onClick={handleBehavioralAssessment}
                      className="flex-1 bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Generate Results</>}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {step === "behavioral-generating" && (
              <motion.div 
                key="behavioral-generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center p-8"
              >
                <div className="w-24 h-24 mb-8 relative">
                   <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-brand-secondary/20 border-t-brand-secondary rounded-full" 
                   />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-brand-secondary animate-pulse" />
                   </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">NOVA is at work...</h3>
                <p className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed h-12">
                  {loadingMessage}
                </p>

                <div className="w-full max-w-sm bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner mb-2">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${generationProgress}%` }}
                    className="h-full bg-brand-primary"
                   />
                </div>
                <div className="flex justify-between w-full max-w-sm text-[10px] font-black uppercase tracking-widest text-brand-primary/40">
                  <span>Input Received</span>
                  <span>Generating Report</span>
                </div>
              </motion.div>
            )}

            {step === "behavioral-out" && (
              <motion.div 
                key="behavioral-out"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full overflow-hidden"
              >
                <div className="flex justify-between items-center mb-8 shrink-0">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">Assessment Insights</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">Built for {formData.careerGoal}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setStep("behavioral-q")} 
                      className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-slate-900"
                      title="Edit Assessment"
                    >
                      <RefreshCcw className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => downloadPdf('TTR_Career_Report', 'behavioral-results')}
                      className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-4 h-4" />} Export Report
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-8" id="behavioral-results">
                  {parsedResult && (
                    <>
                      {/* STEP 1: OVERVIEW & CHART */}
                      <section className="scroll-mt-6">
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                           
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                              <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full mb-4">
                                  <TrendingUp className="w-3 h-3" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Cognitive Blueprint</span>
                                </div>
                                <h4 className="text-3xl font-bold text-slate-900 mb-6">Persona Analysis</h4>
                                
                                <div className="grid grid-cols-1 gap-4 mb-8">
                                  {parsedResult.topTraits?.map((trait, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                                      <div className="bg-brand-secondary/10 w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 border border-brand-secondary/20">
                                        <span className="text-lg font-black text-brand-primary leading-none">{trait.percentage}%</span>
                                        <span className="text-[8px] font-bold uppercase tracking-tighter text-brand-secondary">Match</span>
                                      </div>
                                      <div>
                                        <h5 className="font-bold text-slate-900 text-sm">{trait.title}</h5>
                                        <p className="text-[10px] text-slate-500 leading-relaxed mt-1 line-clamp-2">{trait.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="prose prose-slate prose-sm font-sans leading-relaxed text-slate-600 max-w-none">
                                  <Markdown>{parsedResult.overview}</Markdown>
                                </div>
                              </div>

                              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={parsedResult.scores}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                                    <Radar
                                      name="Trait"
                                      dataKey="A"
                                      stroke="#1e293b"
                                      fill="#14b8a6"
                                      fillOpacity={0.6}
                                    />
                                  </RadarChart>
                                </ResponsiveContainer>
                              </div>
                           </div>
                        </div>
                      </section>

                      {/* STEP 2: RECOMMENDED ROLES */}
                      <section className="scroll-mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                           <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-12 h-full bg-slate-50 group-hover:bg-brand-secondary/10 transition-colors" />
                              <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                  <Target className="w-6 h-6" />
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold text-slate-900">Recommended Career Paths</h4>
                                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">High-Fit Opportunities</p>
                                </div>
                              </div>
                              <div className="prose prose-slate prose-sm max-w-none prose-ul:list-none prose-ul:p-0">
                                <Markdown>{parsedResult.roles}</Markdown>
                              </div>
                           </div>
                        </div>
                      </section>

                      {/* STEP 3: NEXT STEPS */}
                      <section className="scroll-mt-6 pb-12">
                        <div className="bg-brand-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/20 to-transparent pointer-events-none" />
                           <div className="relative z-10">
                              <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                                  <ChevronRight className="w-6 h-6" />
                                </div>
                                <div>
                                  <h4 className="text-2xl font-bold">Actionable Plan</h4>
                                  <p className="text-xs text-brand-secondary font-bold uppercase tracking-widest mt-0.5">What to do right now</p>
                                </div>
                              </div>
                              <div className="prose prose-invert prose-sm max-w-none">
                                <Markdown>{parsedResult.nextSteps}</Markdown>
                              </div>

                              <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                  <div className="flex -space-x-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary shadow-lg relative z-10">
                                      <img src="https://storage.googleapis.com/thetransformationroomassets/Katie.jpg" alt="Katie Peugh" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary shadow-lg">
                                      <img src="https://storage.googleapis.com/thetransformationroomassets/Fawn.JPG" alt="Fawn Cook" className="w-full h-full object-cover" />
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold">Ready for a deeper dive with Katie & Fawn?</p>
                                    <p className="text-xs text-slate-400">Schedule a sync or submit your details.</p>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                  <a 
                                    href="https://calendar.app.google/nCiGLhG5QGHb2SqL6"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-brand-secondary text-brand-primary px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-secondary/20 text-center"
                                  >
                                    Book Consult
                                  </a>
                                  <button
                                    onClick={() => {
                                      onClose();
                                      navigate("/contact", { 
                                        state: { 
                                          assessmentResults: { 
                                            source: "individual",
                                            archetype: parsedResult?.topTraits?.[0]?.title || "Assessed Individual",
                                            traits: parsedResult?.topTraits?.map(t => t.title).join(", ")
                                          } 
                                        } 
                                      });
                                    }}
                                    className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all text-center"
                                  >
                                    Submit Inquiry
                                  </button>
                                </div>
                              </div>
                           </div>
                        </div>
                      </section>
                    </>
                  )}
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
                  <div id="resume-results" className="prose prose-slate prose-sm max-w-none font-sans leading-relaxed">
                    <Markdown>{optimizedContent}</Markdown>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                   <button 
                    disabled={loading}
                    onClick={() => downloadPdf('Optimized_Resume_Summary', 'resume-results')}
                    className="flex-grow bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50"
                   >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />} Save PDF
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

