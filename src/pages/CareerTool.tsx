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

import Markdown from "react-markdown";
import SEO from "../components/SEO";
import { useLanguage } from "../contexts/LanguageContext";
import { translate } from "../utils/translations";
import { updateSharedCareerProfile } from "../utils/careerStore";
import { extractTextFromFile } from "../utils/documentParser";

const CareerTool = () => {
  const { language } = useLanguage();
  const t = (key: string) => translate(key, language);
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
  >("path");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activeSubStep, setActiveSubStep] = useState(1);
  
  const [isNovaVisible, setIsNovaVisible] = useState(false);
  const [isNovaMuted, setIsNovaMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play Nova on enter - only once per user
    if (localStorage.getItem('nova_career_intro_seen')) return;

    const timer = setTimeout(() => {
      setIsNovaVisible(true);
      setIsNovaMuted(false);
      localStorage.setItem('nova_career_intro_seen', 'true');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const triggerNovaCareer = () => {
    if (localStorage.getItem('nova_career_intro_seen')) return;
    setIsNovaVisible(true);
    setIsNovaMuted(false);
    localStorage.setItem('nova_career_intro_seen', 'true');
  };

  // Handle Nova Volume
  useEffect(() => {
    if (videoRef.current && !isNovaMuted) {
      videoRef.current.volume = 0.15; // Lower professional background volume
    }
  }, [isNovaMuted, isNovaVisible]);

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
      navigate('/resume-builder', { replace: true });
    } else if (path === 'simulator') {
      setStep('goal');
      setFormData(prev => ({ ...prev, pathSelection: 'simulator' }));
    }
  }, [navigate]);

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



  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setParsingFile(true);
    try {
      const text = await extractTextFromFile(file);

      if (text.trim()) {
        console.log(`[CareerTool] Successfully extracted ${text.length} characters`);
        setFormData(prev => ({ ...prev, rawContent: text.trim() }));
      } else if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".docx")) {
        console.warn("[CareerTool] No text extracted from file. Possible scan/image-based document.");
        alert("We couldn't extract text from this document. It might be a scanned image. Please try pasting the text manually.");
      }
    } catch (error) {
      console.error("[CareerTool] Error parsing file:", error);
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
    setStep("behavioral-generating");
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: "Evaluate behavioral traits based on instructions." }],
          systemInstruction: `You are NOVA, an Elite Strategic Intelligence at The Transformation Room.
        
        USER PROFILE:
        - Main Goal: ${formData.careerGoal || "Career Progression"}
        - Current Title: ${formData.currentTitle || "Operations Professional"}
        - Target Industry: ${formData.targetIndustry || "Technology & Operations"}
        - Strategy vs Execution: ${formData.behavioralQ1 || "Strategy"}
        - Data vs People: ${formData.behavioralQ2 || "Logic"}
        - Problem Solving Style: ${formData.behavioralQ5 || "Systemic Visionary"}
        - Main Value: ${formData.careerValue || "Rapid Growth"}
        
        TASK:
        1. Evaluate the user's behavioral traits.
        2. Determine 3 "Top Traits" (percentage and description).
        3. Suggest 3-5 high-fit job titles.
        4. Provide 3 immediate actionable tasks.
        
        OUTPUT FORMAT: 
        You MUST return ONLY a valid JSON object matching the following structure:
        {
          "scores": [
            { "subject": "Proactivity", "A": 90, "fullMark": 100 },
            { "subject": "Analytical", "A": 85, "fullMark": 100 },
            { "subject": "Adaptability", "A": 80, "fullMark": 100 },
            { "subject": "Collaboration", "A": 75, "fullMark": 100 },
            { "subject": "Strategic", "A": 95, "fullMark": 100 }
          ],
          "topTraits": [
            { "title": "Level Headed", "percentage": 95, "description": "Remains calm and analytical during high-pressure scenarios." },
            { "title": "Principled Leader", "percentage": 92, "description": "Prioritizes long-term systemic excellence and transparency." },
            { "title": "Proactive Systems Builder", "percentage": 90, "description": "Anticipates operational bottlenecks before they surface." }
          ],
          "overview": "Analysis text",
          "roles": "Roles markdown list",
          "nextSteps": "Tasks markdown list"
        }`
        })
      });

      let parsedResult: any = null;

      if (res.ok) {
        const data = await res.json();
        let text = data.reply || "{}";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) text = jsonMatch[0];
        try {
          parsedResult = JSON.parse(text);
        } catch (e) {
          console.warn("[CareerTool] JSON parse warning, using fallback:", e);
        }
      }

      // Safe structured result with defaults
      const result = {
        scores: parsedResult?.scores || [
          { subject: "Strategic", A: 95, fullMark: 100 },
          { subject: "Proactivity", A: 92, fullMark: 100 },
          { subject: "Analytical", A: 88, fullMark: 100 },
          { subject: "Adaptability", A: 85, fullMark: 100 },
          { subject: "Collaboration", A: 80, fullMark: 100 }
        ],
        topTraits: parsedResult?.topTraits || [
          { title: "Level Headed", percentage: 95, description: "Remains calm, logical, and composed under high-stress operating environments." },
          { title: "Principled Leader", percentage: 92, description: "Guides decisions with uncompromising operational integrity and long-term organizational value." },
          { title: "Proactive Systems Builder", percentage: 90, description: "Anticipates systemic bottlenecks and builds resilient automation before failures occur." }
        ],
        overview: parsedResult?.overview || `Your leadership profile demonstrates a high-leverage balance between strategic systems thinking and operational execution. In your current trajectory from ${formData.currentTitle || "your current role"} toward ${formData.targetIndustry || "target industry"}, your strongest asset is converting complex workflows into predictable, scalable performance.`,
        roles: parsedResult?.roles || "• **Director of Operational Excellence / Transformation**\n• **Head of Technical Program Management & Operations**\n• **VP of Supply Chain Systems & Automation**\n• **Principal Strategy & Operations Partner**",
        nextSteps: parsedResult?.nextSteps || "1. **Elevate Strategic Narrative**: Reframe accomplishments on your resume to emphasize systemic scale, technology integration, and direct ROI metrics ($ savings, uptime, velocity).\n2. **Identify Target Orgs**: Shortlist 10-15 growth companies currently scaling operations in your target domain.\n3. **Engage Leadership Stakeholders**: Initiate strategic peer conversations focused on high-level operational solutions rather than tactical task management."
      };

      setParsedResult(result);
      setOptimizedContent(`## 🧠 Your Behavioral Profile\n${result.overview}\n\n## 💼 Recommended Roles\n${result.roles}\n\n## 📝 Actionable Next Steps\n${result.nextSteps}`);
      
      // Save to shared career profile
      updateSharedCareerProfile({
        careerGoal: formData.careerGoal,
        currentTitle: formData.currentTitle,
        targetIndustry: formData.targetIndustry,
        behavioralAssessment: {
          ...result,
          date: new Date().toISOString()
        }
      });

      setStep("behavioral-out");
    } catch (error) {
      console.error("Assessment handling error:", error);
      // Fallback display so user is never blocked
      const fallbackResult = {
        scores: [
          { subject: "Strategic", A: 95, fullMark: 100 },
          { subject: "Proactivity", A: 92, fullMark: 100 },
          { subject: "Analytical", A: 88, fullMark: 100 },
          { subject: "Adaptability", A: 85, fullMark: 100 },
          { subject: "Collaboration", A: 80, fullMark: 100 }
        ],
        topTraits: [
          { title: "Level Headed", percentage: 95, description: "Remains calm, logical, and composed under high-stress operating environments." },
          { title: "Principled Leader", percentage: 92, description: "Guides decisions with uncompromising operational integrity and long-term organizational value." },
          { title: "Proactive Systems Builder", percentage: 90, description: "Anticipates systemic bottlenecks and builds resilient automation before failures occur." }
        ],
        overview: "Your leadership profile demonstrates a strong orientation toward high-impact systems architecture and strategic operations.",
        roles: "• **Director of Operational Excellence**\n• **Head of Technical Operations**\n• **VP of Systems & Automation Strategy**",
        nextSteps: "1. **Refine Executive Narrative**: Highlight quantifiable transformations on your resume.\n2. **Target High-Growth Companies**: Align with organizations scaling infrastructure.\n3. **Network with Key Decision Makers**: Position your background around organizational scalability."
      };
      setParsedResult(fallbackResult);
      setOptimizedContent(`## 🧠 Your Behavioral Profile\n${fallbackResult.overview}\n\n## 💼 Recommended Roles\n${fallbackResult.roles}\n\n## 📝 Actionable Next Steps\n${fallbackResult.nextSteps}`);
      setStep("behavioral-out");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    setLoading(true);
    setGenerationProgress(0);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: "Generate a transformation roadmap and skill gap analysis." }],
          systemInstruction: `You are NOVA, providing a Career Path Simulation.
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
        }`
        })
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      let text = data.reply || "{}";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) text = jsonMatch[0];
      const result = JSON.parse(text);
      setParsedResult(result);

      // Save to shared career profile
      updateSharedCareerProfile({
        currentTitle: formData.currentRole,
        targetRole: formData.targetRole,
        simulatorData: {
          roadmap: result.roadmap || [],
          gaps: result.gaps || [],
          overview: result.overview || "",
          currentRole: formData.currentRole,
          targetRole: formData.targetRole,
          strengths: formData.strengths,
          skills: formData.skills,
          date: new Date().toISOString()
        }
      });

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
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: "Optimize the resume according to instructions." }],
          systemInstruction: `You are an expert Executive Resume Writer.
        Current Role: ${formData.currentRole}
        Target Role: ${formData.targetRole}
        Gap: ${formData.biggestGap}
        Content: ${formData.rawContent}
        
        TASK: Optimize the professional summary for "Operational Transformation" and "Systems Thinking". 
        Provide 2 format options (A: Impact-Focused, B: Visionary & Strategic).
        Include 3 specific rewrite recommendations.`
        })
      });

      if (!res.ok) throw new Error("Optimization failed");
      const data = await res.json();
      setOptimizedContent(data.reply || "Optimization complete.");
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
        title="Supply Chain & Tech Career Hub | NOVA AI Intelligence"
        description="AI-driven career path simulation, executive resume optimization, and behavioral traits assessment for supply chain, warehouse, and technology leaders."
        keywords="Supply chain career hub, warehouse operations career simulator, technology leadership assessment, AI resume optimizer, operations talent development"
      />

      {/* Nova Strategic Companion Overlay */}
      <AnimatePresence>
        {isNovaVisible && (
          <motion.div 
            drag
            dragMomentum={false}
            initial={{ opacity: 0, y: 50, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-8 right-8 z-[100] cursor-grab active:cursor-grabbing group"
          >
            <div className="relative w-48 h-48 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-4 border-white/10 bubble-glow hover:border-white/30 transition-all duration-700 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <video aria-label="Video presentation"  
                ref={videoRef}
                src="https://storage.googleapis.com/thetransformationroomassets/Nova%20Career%20Intro.mp4"
                autoPlay
                muted={isNovaMuted}
                playsInline
                onEnded={() => {
                  // After finishing her message, she fades away
                  setTimeout(() => setIsNovaVisible(false), 800);
                }}
                className="w-full h-full object-contain aspect-video transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-brand-secondary/5 pointer-events-none" />
              
              {/* Close Button */}
              <button 
                onClick={() => setIsNovaVisible(false)}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white/50 hover:text-white transition-all z-20 pointer-events-auto"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Mute/Unmute Toggle */}
              <button 
                onClick={() => setIsNovaMuted(!isNovaMuted)}
                className="absolute bottom-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white/50 hover:text-white transition-all z-20 pointer-events-auto"
              >
                {isNovaMuted ? <Bot className="w-4 h-4 opacity-50" /> : <Sparkles className="w-4 h-4 text-brand-secondary" />}
              </button>

              {/* Internal Label */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary/50 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-secondary">
                    Nova Career Mentor
                  </span>
                </div>
              </div>
            </div>
            
            {/* Status Tag */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <div className="px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 bg-slate-900/60 text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                  Strategic Onboarding Active
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Left Sidebar */}
      <div className="md:w-1/4 bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between overflow-y-auto relative z-10 shadow-2xl shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-secondary/20 flex items-center justify-center border border-white/10">
              <Sparkles className="w-5 h-5 text-brand-secondary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary">{t("career.engine")}</span>
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
              { label: "Select Tool", active: step === "path" },
              { label: "Assessment", active: step === "behavioral-q" || step === "behavioral-generating" },
              { label: "Results", active: step === "behavioral-out" },
            ] : formData.pathSelection === "simulator" ? [
              { label: "Career Objective", active: step === "path" },
              { label: "Role & Skills", active: step === "simulator-q" },
              { label: "Transformation Roadmap", active: step === "simulator-out" },
            ] : [
              { label: "Select Tool & Goal", active: step === "path" },
              { label: "Assessment", active: false },
              { label: "Roadmap / Profile", active: false },
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
             <span className="text-xs font-bold text-white">{t("career.novaAdvice")}</span>
          </div>
          <p className="text-[11px] text-slate-400 italic">{t("career.novaQuote")}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-white flex flex-col relative">
        <AnimatePresence mode="wait">
          {step === "path" && (
            <motion.div key="path" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto my-auto py-8 md:py-0 w-full">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-slate-900 mb-2">{t('career.path.q')}</h3>
                <p className="text-slate-500 text-sm md:text-base">{t('career.path.desc')}</p>
              </div>
              
              <div className="space-y-5 mb-8">
                {/* 1. Career Path Simulator Card with First Question Directly Underneath */}
                <div 
                  onClick={() => {
                    if (formData.pathSelection !== "simulator") {
                      setFormData(prev => ({ ...prev, pathSelection: "simulator" }));
                    }
                  }} 
                  className={`text-left p-6 md:p-8 rounded-[2rem] border-2 transition-all relative overflow-hidden group cursor-pointer ${
                    formData.pathSelection === "simulator" 
                      ? 'border-brand-secondary bg-brand-secondary/5 shadow-md' 
                      : 'border-slate-200 bg-white hover:border-brand-secondary/60 shadow-sm'
                  }`}
                >
                  <div className="flex gap-5 relative z-10 items-start">
                    <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                      <LucideMap className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xl mb-1.5 ${formData.pathSelection === "simulator" ? 'text-brand-primary font-bold' : 'text-slate-900 font-bold'}`}>
                          {t('career.path.simTitle')}
                        </h4>
                        {formData.pathSelection === "simulator" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-secondary text-brand-primary">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 font-normal leading-relaxed mb-1">{t('career.path.simDesc')}</p>
                    </div>
                  </div>

                  {/* The First Question Directly Under Career Path Simulator */}
                  <div className="mt-6 pt-6 border-t border-slate-200/80">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-brand-secondary" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">Question 1: Primary Objective</span>
                      </div>
                      <h5 className="text-base md:text-lg font-bold text-slate-900">{t('career.goals.q')}</h5>
                      <p className="text-xs text-slate-500 mt-0.5">{t('career.goals.desc')}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {[
                        { val: "Find a New Job", label: t('career.goals.1') },
                        { val: "Transition Careers (Industry/Role)", label: t('career.goals.2') },
                        { val: "Get Promoted (Level Up)", label: t('career.goals.3') },
                        { val: "Build My Professional Brand", label: t('career.goals.4') }
                      ].map((goal, i) => (
                        <div
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({ ...prev, careerGoal: goal.val, pathSelection: "simulator" }));
                          }}
                          className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                            formData.careerGoal === goal.val && formData.pathSelection === "simulator"
                              ? 'border-brand-primary bg-brand-primary text-white font-bold shadow-md' 
                              : 'border-slate-200 bg-white hover:border-brand-secondary/70 text-slate-800'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            formData.careerGoal === goal.val && formData.pathSelection === "simulator" 
                              ? 'bg-brand-secondary text-brand-primary font-black' 
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {i + 1}
                          </div>
                          <span className="text-xs md:text-sm font-semibold leading-snug">{goal.label}</span>
                        </div>
                      ))}
                    </div>

                    {formData.pathSelection === "simulator" && (
                      <button
                        type="button"
                        disabled={!formData.careerGoal}
                        onClick={(e) => {
                          e.stopPropagation();
                          setStep("simulator-q");
                          triggerNovaCareer();
                        }}
                        className="w-full mt-2 py-4 bg-brand-primary hover:bg-brand-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md cursor-pointer text-sm"
                      >
                        {formData.careerGoal ? "Continue Path Simulation" : "Select an Objective Above"} <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Executive Resume Studio Card */}
                <div 
                  onClick={() => navigate("/resume-builder")} 
                  className="text-left p-6 md:p-8 rounded-[2rem] border-2 border-slate-200 bg-white hover:border-emerald-500 transition-all relative overflow-hidden group cursor-pointer shadow-sm"
                >
                  <div className="flex gap-5 relative z-10 items-start">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xl font-bold text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                          {t('career.path.resTitle')}
                        </h4>
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Open Studio <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-normal leading-relaxed">{t('career.path.resDesc')}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Behavioral Traits Assessment Card */}
                <div 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, pathSelection: "behavioral" }));
                    setStep("behavioral-q");
                    triggerNovaCareer();
                  }} 
                  className={`text-left p-6 md:p-8 rounded-[2rem] border-2 transition-all relative overflow-hidden group cursor-pointer shadow-sm ${
                    formData.pathSelection === "behavioral" 
                      ? 'border-indigo-500 bg-indigo-50/20' 
                      : 'border-slate-200 bg-white hover:border-indigo-400'
                  }`}
                >
                  <div className="flex gap-5 relative z-10 items-start">
                    <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xl font-bold text-slate-900 mb-1.5 group-hover:text-indigo-700 transition-colors">
                          {t('career.path.behTitle')}
                        </h4>
                        <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Start Assessment <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-normal leading-relaxed">{t('career.path.behDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

           {step === "behavioral-q" && (
            <motion.div key="behavioral-q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto w-full">
               <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Career Personality Assessment</h3>
                    <p className="text-slate-600 text-sm font-medium">Discover leadership traits, high-fit job titles, and actionable next steps.</p>
                  </div>
                  <div className="flex gap-1.5">
                    {[1,2,3].map(i => (
                      <div key={i} className={`w-8 h-2.5 rounded-full transition-all duration-300 ${activeSubStep >= i ? 'bg-brand-primary' : 'bg-slate-200'}`} />
                    ))}
                  </div>
               </div>

               {activeSubStep === 1 && (
                 <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 pl-1 block">Current Professional Title</label>
                          <input 
                            type="text" 
                            className="w-full p-5 rounded-2xl bg-white border-2 border-slate-200 text-black font-semibold placeholder:text-slate-400 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all shadow-sm text-base" 
                            value={formData.currentTitle} 
                            onChange={(e) => setFormData({...formData, currentTitle: e.target.value})} 
                            placeholder="e.g. Operations Director" 
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 pl-1 block">Target Sector</label>
                          <input 
                            type="text" 
                            className="w-full p-5 rounded-2xl bg-white border-2 border-slate-200 text-black font-semibold placeholder:text-slate-400 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all shadow-sm text-base" 
                            value={formData.targetIndustry} 
                            onChange={(e) => setFormData({...formData, targetIndustry: e.target.value})} 
                            placeholder="e.g. High-Tech Fulfillment" 
                          />
                       </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 pl-1 mb-4 block">Where do you provide the most leverage?</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {[{id: "Strategy", desc: "Long-term systems architecture & planning", icon: <Layers className="w-6 h-6" />}, {id: "Execution", desc: "High-speed tactical orchestration & delivery", icon: <Zap className="w-6 h-6" />}].map(opt => (
                             <button 
                               key={opt.id} 
                               onClick={() => setFormData({...formData, behavioralQ1: opt.id})} 
                               className={`p-6 rounded-2xl border-2 flex items-center gap-4 transition-all cursor-pointer text-left ${formData.behavioralQ1 === opt.id ? 'bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20' : 'bg-white border-slate-200 hover:border-brand-secondary text-black shadow-sm'}`}
                             >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${formData.behavioralQ1 === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-800 border border-slate-200'}`}>
                                  {opt.icon}
                                </div>
                                <div>
                                  <span className={`font-bold text-base md:text-lg block ${formData.behavioralQ1 === opt.id ? 'text-white' : 'text-black'}`}>{opt.id}</span>
                                  <span className={`text-xs block mt-0.5 ${formData.behavioralQ1 === opt.id ? 'text-slate-200' : 'text-slate-600'}`}>{opt.desc}</span>
                                </div>
                             </button>
                           ))}
                        </div>
                    </div>
                 </div>
               )}

               {activeSubStep === 2 && (
                 <div className="space-y-8">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800 pl-1 mb-4 block">Your primary problem-solving style:</label>
                    <div className="grid grid-cols-1 gap-4">
                       {[
                         {id: "Systemic Visionary", sub: "Abstract, non-linear pattern recognition and connected workflows.", icon: <Brain className="w-6 h-6" />},
                         {id: "Process Optimizer", sub: "Sequential, structured logic and repeatable frameworks.", icon: <Settings className="w-6 h-6" />},
                         {id: "Crisis Orchestrator", sub: "High-speed tactical adaptation and real-time triage.", icon: <Zap className="w-6 h-6" /> }
                       ].map(opt => (
                         <button 
                           key={opt.id} 
                           onClick={() => setFormData({...formData, behavioralQ5: opt.id})} 
                           className={`p-6 md:p-8 rounded-3xl border-2 flex items-center gap-6 transition-all cursor-pointer ${formData.behavioralQ5 === opt.id ? 'bg-brand-primary text-white border-brand-primary shadow-xl' : 'bg-white border-slate-200 hover:border-brand-secondary text-black shadow-sm'}`}
                         >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${formData.behavioralQ5 === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-800 border border-slate-200'}`}>
                              {opt.icon}
                            </div>
                            <div className="text-left">
                               <p className={`font-bold text-lg leading-tight mb-1.5 ${formData.behavioralQ5 === opt.id ? 'text-white' : 'text-black'}`}>{opt.id}</p>
                               <p className={`text-sm ${formData.behavioralQ5 === opt.id ? 'text-slate-200' : 'text-slate-600'} font-medium`}>{opt.sub}</p>
                            </div>
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               {activeSubStep === 3 && (
                 <div className="space-y-8">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800 pl-1 mb-4 block">What value is non-negotiable for your next role?</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {[
                         {id: "Rapid Growth", icon: <Zap className="w-6 h-6" />},
                         {id: "Stability", icon: <ShieldCheck className="w-6 h-6" />},
                         {id: "Compensation", icon: <Trophy className="w-6 h-6" />},
                         {id: "Balance", icon: <Coffee className="w-6 h-6" />},
                         {id: "Purpose", icon: <Heart className="w-6 h-6" />}
                       ].map(opt => (
                         <button 
                           key={opt.id} 
                           onClick={() => setFormData({...formData, careerValue: opt.id})} 
                           className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-3 transition-all cursor-pointer ${formData.careerValue === opt.id ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20' : 'bg-white border-slate-200 hover:border-brand-secondary text-black shadow-sm'}`}
                         >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.careerValue === opt.id ? 'text-brand-secondary' : 'text-brand-primary'}`}>
                              {opt.icon}
                            </div>
                            <span className={`font-bold text-base ${formData.careerValue === opt.id ? 'text-white' : 'text-black'}`}>{opt.id}</span>
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               <div className="mt-12 flex gap-4">
                  <button 
                    onClick={() => {
                      if (activeSubStep > 1) {
                        setActiveSubStep(s => s - 1);
                      } else {
                        setStep("path");
                      }
                    }} 
                    className="flex-1 py-5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-2xl font-bold transition-colors"
                  >
                    Back
                  </button>
                  {activeSubStep < 3 ? (
                    <button onClick={() => setActiveSubStep(s => s + 1)} className="flex-[2] py-5 bg-brand-primary hover:bg-brand-dark text-white rounded-2xl font-bold transition-all shadow-md">Next Insight</button>
                  ) : (
                    <button onClick={handleBehavioralAssessment} className="flex-[2] py-5 bg-brand-primary hover:bg-brand-dark text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer">
                       Generate Profile <Sparkles className="w-5 h-5 text-brand-secondary" />
                    </button>
                  )}
               </div>
            </motion.div>
          )}

          {step === "simulator-q" && (
            <motion.div key="simulator-q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto w-full my-auto py-8">
               <div className="mb-6">
                 {formData.careerGoal && (
                   <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-secondary/15 border border-brand-secondary/30 text-brand-primary font-bold text-xs mb-3">
                     <span className="w-2 h-2 rounded-full bg-brand-secondary" />
                     <span>Objective: {formData.careerGoal}</span>
                   </div>
                 )}
                 <h3 className="text-3xl font-bold text-slate-900 mb-2">Initialize Path Simulation</h3>
                 <p className="text-slate-500 text-sm md:text-base">Map your transformation trajectory from current state to desired outcome.</p>
               </div>
               
               <div className="space-y-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Current Role</label>
                       <input type="text" className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-brand-secondary text-slate-900 font-semibold" placeholder="e.g. Warehouse Manager" value={formData.currentRole} onChange={(e) => setFormData({...formData, currentRole: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Target Transformation</label>
                       <input type="text" className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-brand-secondary text-slate-900 font-semibold" placeholder="e.g. Director of Operations" value={formData.targetRole} onChange={(e) => setFormData({...formData, targetRole: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Top Strengths</label>
                     <textarea className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-brand-secondary h-28 text-slate-900" placeholder="Describe where you excel..." value={formData.strengths} onChange={(e) => setFormData({...formData, strengths: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Transferable Skills</label>
                     <input type="text" className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-brand-secondary text-slate-900" placeholder="e.g. SQL, Lean Six Sigma, Automation" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
                  </div>
               </div>

               <div className="flex gap-4">
                  <button onClick={() => setStep("path")} className="flex-1 py-5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-2xl font-bold transition-colors">
                     Back to Tools
                  </button>
                  <button onClick={handleSimulate} disabled={!formData.currentRole || !formData.targetRole} className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-brand-primary transition-all disabled:opacity-50 shadow-md">
                     Simulate Transformation <Zap className="w-5 h-5 text-brand-secondary" />
                  </button>
               </div>
            </motion.div>
          )}

          {/* Result Steps (Behavioral Out, Simulator Out, Resume Review) would go here similarly to ResumeOptimizer.tsx but integrated */}
          {step === "behavioral-generating" && (
             <motion.div key="gen" className="text-center my-auto flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center mb-10 border border-slate-200">
                   <Loader2 className="w-12 h-12 text-brand-secondary animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{loadingMessage}</h3>
                <div className="max-w-md w-full h-2 bg-slate-100 rounded-full overflow-hidden">
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

               <div className="mt-16 flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setStep("path")} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold transition-all hover:bg-slate-200">New Assessment</button>
                  <Link 
                    to="/resume-builder" 
                    className="flex-1 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 transition-all cursor-pointer text-center"
                  >
                    <FileText className="w-5 h-5 text-emerald-200" />
                    Apply Traits to Executive Resume Studio
                  </Link>
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat', { 
                      detail: { 
                        type: 'individual', 
                        prompt: "Let's discuss my behavioral traits assessment results with NOVA. I'm interested in how these match the recommended high-growth roles." 
                      } 
                    }))} 
                    className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-brand-primary transition-all group"
                  >
                    <Bot className="w-5 h-5 text-brand-secondary group-hover:animate-pulse" /> 
                    Discuss Traits with NOVA
                  </button>
               </div>
            </motion.div>
          )}

          {step === "simulator-out" && parsedResult && (
            <motion.div key="sim-out" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto py-12">
               <div className="flex items-center gap-8 mb-16">
                  <div className="w-24 h-24 rounded-3xl bg-slate-900 overflow-hidden shrink-0 border border-brand-secondary/30 shadow-2xl">
                    <img src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" alt="NOVA" className="w-full h-full object-cover"  width="400" height="400" loading="lazy" />
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

               <div className="mt-20 flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setStep("path")} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold transition-all hover:bg-slate-200">New Simulation</button>
                  <Link 
                    to="/resume-builder" 
                    className="flex-1 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 transition-all cursor-pointer text-center"
                  >
                    <FileText className="w-5 h-5 text-emerald-200" />
                    Apply Roadmap & Skills to Resume Studio
                  </Link>
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat', { 
                      detail: { 
                        type: 'individual', 
                        prompt: `Let's discuss my career path simulation results with NOVA. I just simulated a path to ${formData.targetRole} and want to deconstruct the roadmap.` 
                      } 
                    }))} 
                    className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-brand-primary transition-all group"
                  >
                    <Bot className="w-5 h-5 text-brand-secondary group-hover:animate-pulse" /> 
                    Deconstruct with NOVA
                  </button>
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
