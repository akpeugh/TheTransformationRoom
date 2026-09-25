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
  Heart,
  Brain,
  Settings,
  Scale,
  MessageSquare,
  BarChart3,
  GitBranch,
  RefreshCw,
  CheckCircle2,
  Check
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

const assessmentMarkdownComponents = {
  p: ({ children }: any) => <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-3 font-normal">{children}</p>,
  ul: ({ children }: any) => <ul className="space-y-3 my-3">{children}</ul>,
  ol: ({ children }: any) => <ol className="space-y-3 my-3 text-slate-200 text-sm md:text-base">{children}</ol>,
  li: ({ children }: any) => (
    <li className="flex items-start gap-3 text-slate-200 text-sm md:text-base leading-relaxed font-normal">
      <span className="w-2 h-2 rounded-full bg-teal-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(45,212,191,0.7)]" />
      <span className="flex-1">{children}</span>
    </li>
  ),
  strong: ({ children }: any) => <strong className="text-white font-bold tracking-tight">{children}</strong>,
  em: ({ children }: any) => <em className="text-teal-300 font-semibold not-italic">{children}</em>,
  h1: ({ children }: any) => <h1 className="text-xl font-bold text-white mb-2">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-lg font-bold text-teal-300 mb-2">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-base font-bold text-white mb-2">{children}</h3>,
};

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
    behavioralQ1: "Strategy", // Strategy vs Execution
    behavioralQ2: "Logician", // Data vs People
    behavioralQ3: "", // Environment Fit
    behavioralQ4: "", // Obstacle Reaction
    behavioralQ5: "Systemic Visionary", // Decision Speed/Logic
    behavioralQ6: "", // Motivational Driver
    behavioralQ7: "", // Stability vs Growth
    behavioralQ8: "Principled Action", // Principled Action / Ethics
    conflictDynamics: "Direct Candor", // Conflict & Feedback Dynamics
    riskThreshold: "Calculated Trailblazer", // Ambiguity & Risk Threshold
    transformationStyle: "Evolutionary Transition", // Transformation & Change Leadership
    targetIndustry: "",
    currentTitle: "",
    careerValue: "Rapid Growth & Modernization",
    salaryRange: "",
    companyCulture: ["Innovative", "Outcome-Based"] as string[],
    rolePreference: "Team Leadership", // Individual Contributor vs Leadership
    riskAppetite: "Enterprise", // Startups vs established
    currentRole: "",
    targetRole: "",
    biggestGap: "",
    experienceLevel: "Director / Head of",
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
        - Seniority & Scope: ${formData.experienceLevel}
        - Target Industry: ${formData.targetIndustry}
        - Strategy vs Execution: ${formData.behavioralQ1}
        - Cognitive Lens: ${formData.behavioralQ2}
        - Conflict & Feedback Dynamics: ${formData.conflictDynamics}
        - Ambiguity & Risk Threshold: ${formData.riskThreshold}
        - Transformation & Change Leadership: ${formData.transformationStyle}
        - Problem Solving Architecture: ${formData.behavioralQ5}
        - Ethical/Principled Bias: ${formData.behavioralQ8}
        - Primary Career North-Star Value: ${formData.careerValue}
        - Target Company Culture: ${formData.companyCulture.join(", ")}
        - Role Preference: ${formData.rolePreference}
        - Operating Environment: ${formData.riskAppetite}
        ${formData.salaryRange ? `- Target Salary Range: ${formData.salaryRange}` : ""}
        
        TASK:
        1. Evaluate the user's behavioral traits based on their answers across all 6 diagnostic dimensions, honoring their main goal of "${formData.careerGoal}". 
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

      let parsedResult: any = null;
      if (res.ok) {
        const data = await res.json();
        let text = data.reply || "{}";
        // Robust JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
           text = jsonMatch[0];
        }
        try {
          parsedResult = JSON.parse(text);
        } catch (parseErr) {
          console.warn("[ResumeOptimizer] JSON parse warning, using fallback:", parseErr);
        }
      }

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
        overview: parsedResult?.overview || "Your leadership profile demonstrates a strong orientation toward high-impact systems architecture and strategic operations. You excel at synthesizing complex workflows into repeatable, high-output engines.",
        roles: parsedResult?.roles || "• **Director of Operational Excellence / Transformation**\n• **Head of Technical Operations & Programs**\n• **VP of Supply Chain Systems & Automation**\n• **Principal Strategy & Operations Partner**",
        nextSteps: parsedResult?.nextSteps || "1. **Refine Leadership Positioning**: Elevate your resume narrative from tactical task management to enterprise transformation metrics ($ savings, velocity improvements, uptime).\n2. **Target High-Growth Ecosystems**: Map out target companies currently scaling operations or integrating automation.\n3. **Engage Key Stakeholders**: Position your background around end-to-end efficiency, team enablement, and technology-driven ROI."
      };

      setParsedResult(result);
      // Construct a combined markdown for PDF/Email export purposes
      setOptimizedContent(`## 🧠 Your Behavioral Profile\n${result.overview}\n\n## 💼 Recommended Roles\n${result.roles}\n\n## 📝 Actionable Next Steps\n${result.nextSteps}`);
      setStep("behavioral-out");
    } catch (error) {
      console.error("Assessment handling issue:", error);
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
                        ? 'border-brand-secondary bg-brand-secondary/10 text-black font-bold shadow-sm' 
                        : 'border-slate-200 bg-white hover:border-brand-secondary text-black'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${formData.careerGoal === goal ? 'bg-brand-primary text-white' : 'bg-slate-100 text-black border border-slate-200'}`}>
                          {i + 1}
                        </div>
                        <span className="text-black font-bold text-base leading-snug">{goal}</span>
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
                      <h3 className="text-2xl font-bold text-slate-900 leading-tight">Executive Diagnostic</h3>
                      <p className="text-slate-500 text-sm">6-Axis Strategic DNA & Operational Profile</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Step {activeSubStep} of 6</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4, 5, 6].map((s) => (
                      <div key={s} className={`h-full flex-1 transition-all duration-500 ${activeSubStep >= s ? 'bg-brand-secondary' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-2 pb-8 scrollbar-hide">
                  <AnimatePresence mode="wait">
                    {/* STAGE 1: Current Leadership Level & Target Scope */}
                    {activeSubStep === 1 && (
                      <motion.div 
                        key="sub1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 ml-1">Current Executive Title</label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input 
                                type="text"
                                className="w-full bg-white border-2 border-slate-200 text-slate-900 font-semibold p-4 pl-14 rounded-2xl focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all shadow-sm placeholder:text-slate-400 text-base"
                                placeholder="e.g. Director of Operations"
                                value={formData.currentTitle}
                                onChange={(e) => setFormData({...formData, currentTitle: e.target.value})}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 ml-1">Target Industry / Domain</label>
                            <div className="relative">
                              <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input 
                                type="text"
                                className="w-full bg-white border-2 border-slate-200 text-slate-900 font-semibold p-4 pl-14 rounded-2xl focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all shadow-sm placeholder:text-slate-400 text-base"
                                placeholder="e.g. Clean Energy Tech, Warehouse Automation"
                                value={formData.targetIndustry}
                                onChange={(e) => setFormData({...formData, targetIndustry: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Seniority Scope</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {["Manager / Lead", "Director / Head of", "VP / General Manager", "C-Suite / Founder"].map((lvl) => (
                              <button
                                key={lvl}
                                onClick={() => setFormData({...formData, experienceLevel: lvl})}
                                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                                  formData.experienceLevel === lvl
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg font-bold'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-brand-secondary font-medium'
                                }`}
                              >
                                <p className="text-xs">{lvl}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Target Operating Environment</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { id: "Startup / Fast Growth", sub: "Priority on Velocity & Agility", icon: <Zap className="w-5 h-5" /> },
                              { id: "Mid-Market", sub: "Focus on Scaling & Rigor", icon: <TrendingUp className="w-5 h-5" /> },
                              { id: "Enterprise", sub: "Global Reach & Complexity", icon: <Globe className="w-5 h-5" /> }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, riskAppetite: opt.id})}
                                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                                  formData.riskAppetite === opt.id 
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold' 
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-brand-secondary'
                                }`}
                              >
                                <div className={`mx-auto mb-2 w-10 h-10 rounded-xl flex items-center justify-center ${formData.riskAppetite === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-500'}`}>
                                  {opt.icon}
                                </div>
                                <p className="text-xs font-bold">{opt.id}</p>
                                <p className="text-[9px] opacity-70 mt-0.5">{opt.sub}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STAGE 2: Strategic Lens & Cognitive Bias */}
                    {activeSubStep === 2 && (
                      <motion.div 
                        key="sub2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">1. Strategic Horizon: Where do you add peak value?</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { id: "Strategy", title: "Architectural Visionary", sub: "Systems design, 3-year roadmaps, organizational restructuring, and high-level portfolio strategy.", icon: <Layers className="w-6 h-6" /> },
                              { id: "Execution", title: "Operational Orchestrator", sub: "Tactical delivery, immediate bottleneck resolution, metrics cadence, and precision implementation.", icon: <Zap className="w-6 h-6" /> }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, behavioralQ1: opt.id})}
                                className={`p-5 rounded-2xl border text-left transition-all flex gap-4 items-start cursor-pointer ${
                                  formData.behavioralQ1 === opt.id 
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-brand-secondary'
                                }`}
                              >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mt-1 ${formData.behavioralQ1 === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-500'}`}>
                                  {opt.icon}
                                </div>
                                <div>
                                  <p className="text-sm font-bold">{opt.title}</p>
                                  <p className="text-xs opacity-75 mt-1 leading-relaxed">{opt.sub}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">2. Decision Lens: Logic, Context, or Consensus?</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { id: "Logician", title: "Objective Logician", sub: "Decisions dictated strictly by empirical telemetry, root-cause data, and financial ROI.", icon: <Binary className="w-5 h-5" /> },
                              { id: "Contextualist", title: "Pragmatic Contextualist", sub: "Synthesizes quantitative metrics with team capacity, change readiness, and morale.", icon: <Compass className="w-5 h-5" /> },
                              { id: "Human-First", title: "Relational Catalyst", sub: "Fosters psychological safety, coalition consensus, and human-centric buy-in before shifts.", icon: <Users className="w-5 h-5" /> }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, behavioralQ2: opt.id})}
                                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                                  formData.behavioralQ2 === opt.id 
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold' 
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-brand-secondary'
                                }`}
                              >
                                <div className={`mx-auto mb-2 w-10 h-10 rounded-xl flex items-center justify-center ${formData.behavioralQ2 === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-500'}`}>
                                  {opt.icon}
                                </div>
                                <p className="text-xs font-bold">{opt.title}</p>
                                <p className="text-[10px] opacity-75 mt-1 leading-normal">{opt.sub}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STAGE 3: Conflict & Feedback Dynamics */}
                    {activeSubStep === 3 && (
                      <motion.div 
                        key="sub3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">3. Conflict & Feedback Dynamics: How do you address friction?</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                              { 
                                id: "Direct Candor", 
                                title: "Radical Direct Candor", 
                                desc: "Transparent, immediate confrontation of systemic bottlenecks and underperformance. Zero ambiguity; focus on rapid issue resolution.",
                                icon: <MessageSquare className="w-5 h-5" />
                              },
                              { 
                                id: "Diplomatic Mediation", 
                                title: "Diplomatic Mediation", 
                                desc: "Navigates multi-stakeholder friction through cross-functional bridges, active listening, and face-saving alignment.",
                                icon: <Users className="w-5 h-5" />
                              },
                              { 
                                id: "Evidence-Led Resolution", 
                                title: "Evidence-Led Resolution", 
                                desc: "Depersonalizes contention by establishing verifiable benchmarks, controlled pilots, and transparent A/B audit trails.",
                                icon: <Scale className="w-5 h-5" />
                              }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, conflictDynamics: opt.id})}
                                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                  formData.conflictDynamics === opt.id 
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-brand-secondary'
                                }`}
                              >
                                <div>
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${formData.conflictDynamics === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-500'}`}>
                                    {opt.icon}
                                  </div>
                                  <p className="text-sm font-bold">{opt.title}</p>
                                  <p className="text-xs opacity-75 mt-2 leading-relaxed">{opt.desc}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STAGE 4: Ambiguity & Risk Threshold */}
                    {activeSubStep === 4 && (
                      <motion.div 
                        key="sub4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">4. Ambiguity & Risk Threshold: How do you handle uncertainty?</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                              { 
                                id: "Calculated Trailblazer", 
                                title: "Calculated Trailblazer", 
                                desc: "High tolerance for 70% data confidence. Prefers rapid prototyping, aggressive pilot testing, and early-mover advantages in automation.",
                                icon: <Zap className="w-5 h-5" />
                              },
                              { 
                                id: "Systemic De-Risker", 
                                title: "Systemic De-Risker", 
                                desc: "Conducts exhaustive failure-mode audits, stress testing, and safety redundancies before unlocking capital deployment.",
                                icon: <ShieldAlert className="w-5 h-5" />
                              },
                              { 
                                id: "Disciplined Scaler", 
                                title: "Disciplined Scaler", 
                                desc: "Avoids unproven hype. Takes proven enterprise solutions and scales them methodically with bulletproof SLAs and controls.",
                                icon: <TrendingUp className="w-5 h-5" />
                              }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, riskThreshold: opt.id})}
                                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                  formData.riskThreshold === opt.id 
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-brand-secondary'
                                }`}
                              >
                                <div>
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${formData.riskThreshold === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-500'}`}>
                                    {opt.icon}
                                  </div>
                                  <p className="text-sm font-bold">{opt.title}</p>
                                  <p className="text-xs opacity-75 mt-2 leading-relaxed">{opt.desc}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STAGE 5: Transformation & Change Leadership */}
                    {activeSubStep === 5 && (
                      <motion.div 
                        key="sub5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">5. Transformation Philosophy: How do you enact organizational change?</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { 
                                id: "Evolutionary Transition", 
                                title: "Evolutionary Kaizen Transition", 
                                desc: "Continuous, iterative enhancement. Refines existing legacy stacks, respects operational muscle memory, and builds incremental stability.",
                                icon: <RefreshCw className="w-6 h-6" />
                              },
                              { 
                                id: "Clean-Slate Modernization", 
                                title: "Clean-Slate Paradigm Shift", 
                                desc: "Greenfield overhaul. Sunsets technical debt, re-architects core infrastructure from first principles, and deploys next-gen systems.",
                                icon: <GitBranch className="w-6 h-6" />
                              }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, transformationStyle: opt.id})}
                                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex gap-4 items-start ${
                                  formData.transformationStyle === opt.id 
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-brand-secondary'
                                }`}
                              >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mt-1 ${formData.transformationStyle === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-500'}`}>
                                  {opt.icon}
                                </div>
                                <div>
                                  <p className="text-sm font-bold">{opt.title}</p>
                                  <p className="text-xs opacity-75 mt-1 leading-relaxed">{opt.desc}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Problem-Solving Architecture</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { id: "Systemic Visionary", title: "Abstract Systems Synthesis", sub: "Identifies systemic loops, root constraints, and macro dependencies across operations.", icon: <Lightbulb className="w-5 h-5" /> },
                              { id: "Process Optimizer", title: "Deterministic Process Logic", sub: "Standard operating procedures, rigorous checklist audits, and algorithmic precision.", icon: <Clock className="w-5 h-5" /> }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, behavioralQ5: opt.id})}
                                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex gap-3 items-center ${
                                  formData.behavioralQ5 === opt.id 
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold' 
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-brand-secondary'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${formData.behavioralQ5 === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-500'}`}>
                                  {opt.icon}
                                </div>
                                <div>
                                  <p className="text-xs font-bold">{opt.title}</p>
                                  <p className="text-[10px] opacity-75">{opt.sub}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STAGE 6: North-Star Values & Target Culture */}
                    {activeSubStep === 6 && (
                      <motion.div 
                        key="sub6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">6. Primary North-Star Value</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                              { id: "Rapid Growth & Modernization", label: "Modernization Velocity", icon: <Zap className="w-4 h-4" /> },
                              { id: "Operational Autonomy", label: "Executive Autonomy", icon: <Target className="w-4 h-4" /> },
                              { id: "Top-Tier Compensation", label: "Equity & Compensation", icon: <Trophy className="w-4 h-4" /> },
                              { id: "Social & Environmental Impact", label: "ESG / Resilient Purpose", icon: <Heart className="w-4 h-4" /> },
                              { id: "Systemic Stability", label: "Infrastructure Security", icon: <ShieldCheck className="w-4 h-4" /> },
                              { id: "Work-Life Integration", label: "Sustainable Cadence", icon: <Coffee className="w-4 h-4" /> }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, careerValue: opt.id})}
                                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                                  formData.careerValue === opt.id 
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold' 
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-brand-secondary'
                                }`}
                              >
                                <div className={`mx-auto mb-2 ${formData.careerValue === opt.id ? 'text-brand-secondary' : 'text-slate-400'}`}>
                                  {opt.icon}
                                </div>
                                <p className="text-xs font-bold">{opt.label}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Organizational Cultural Norms (Select up to 3)</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                             {[
                              "Data-Driven",
                              "Direct Candor",
                              "Agile & Iterative",
                              "Autonomous",
                              "Structured Governance",
                              "Collaborative Pods",
                              "High Urgency",
                              "Psychologically Safe"
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
                                className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                  formData.companyCulture.includes(tag)
                                  ? 'bg-brand-secondary/20 text-brand-secondary border-brand-secondary'
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Ethical Bias: Principled Integrity vs Pragmatic Outcomes</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              { id: "Principled Action", sub: "Upholds ethical governance and long-term compliance regardless of short-term velocity.", icon: <ShieldCheck className="w-5 h-5" /> },
                              { id: "Pragmatic Logic", sub: "Prioritizes immediate mission success, practical compromises, and high-tempo throughput.", icon: <Zap className="w-5 h-5" /> }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({...formData, behavioralQ8: opt.id})}
                                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex gap-3 items-center ${
                                  formData.behavioralQ8 === opt.id 
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold' 
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-brand-secondary'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${formData.behavioralQ8 === opt.id ? 'bg-brand-secondary text-brand-primary' : 'bg-slate-100 text-slate-500'}`}>
                                  {opt.icon}
                                </div>
                                <div>
                                  <p className="text-xs font-bold">{opt.id}</p>
                                  <p className="text-[10px] opacity-75">{opt.sub}</p>
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
                      className="px-8 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                  ) : (
                    <button 
                      onClick={() => setStep("path")} 
                      className="px-8 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Exit
                    </button>
                  )}
                  
                  {activeSubStep < 6 ? (
                    <button 
                      onClick={() => setActiveSubStep(v => v + 1)}
                      className="flex-1 bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
                    >
                      Next Step <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button 
                      disabled={!formData.currentTitle || !formData.targetIndustry || loading}
                      onClick={handleBehavioralAssessment}
                      className="flex-1 bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50 cursor-pointer"
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
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">Assessment Insights</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                      Calibrated for {formData.currentTitle || "Executive Leadership"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setActiveSubStep(1);
                        setStep("behavioral-q");
                      }} 
                      className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-slate-900 border border-slate-200 cursor-pointer"
                      title="Edit Assessment"
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => downloadPdf('TTR_Executive_Report', 'behavioral-results')}
                      className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md cursor-pointer disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} Export Report
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-6" id="behavioral-results">
                  {parsedResult && (
                    <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 text-slate-100 shadow-2xl relative overflow-hidden space-y-8">
                       {/* Top Diagnostic Badges Banner */}
                       <div className="relative z-10 pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <div>
                           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 font-black text-xs uppercase tracking-wider mb-2">
                             <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                             Executive Diagnostic Complete
                           </div>
                           <h4 className="text-2xl font-black text-white">
                             {formData.currentTitle || "Executive"} Diagnostic Matrix
                           </h4>
                           <p className="text-slate-400 text-xs mt-0.5">
                             Targeting: <span className="text-teal-300 font-semibold">{formData.targetIndustry || "Supply Chain & Technology"}</span>
                           </p>
                         </div>

                         <div className="flex flex-wrap gap-2">
                           <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                             <User className="w-3.5 h-3.5 text-teal-400" /> {formData.experienceLevel || "Director / Head of"}
                           </span>
                           <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                             <MessageSquare className="w-3.5 h-3.5 text-teal-400" /> {formData.conflictDynamics || "Direct Candor"}
                           </span>
                           <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                             <ShieldAlert className="w-3.5 h-3.5 text-teal-400" /> {formData.riskThreshold || "Calculated Trailblazer"}
                           </span>
                           <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                             <RefreshCw className="w-3.5 h-3.5 text-teal-400" /> {formData.transformationStyle || "Evolutionary Transition"}
                           </span>
                         </div>
                       </div>

                       {/* STEP 1: VISUAL RADAR & CORE PILLARS */}
                       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                         <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-black uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
                                <BarChart3 className="w-4 h-4" /> 6-Axis Capability Matrix
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">100 pt Scale</span>
                            </div>
                            <div className="h-[260px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={parsedResult.scores}>
                                  <PolarGrid stroke="#334155" />
                                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#e2e8f0', fontSize: 10, fontWeight: 700 }} />
                                  <Radar
                                    name="Trait"
                                    dataKey="A"
                                    stroke="#2dd4bf"
                                    fill="#0d9488"
                                    fillOpacity={0.65}
                                    strokeWidth={2}
                                  />
                                </RadarChart>
                              </ResponsiveContainer>
                            </div>
                         </div>

                         <div className="lg:col-span-6 space-y-3">
                           <h5 className="text-xs font-black uppercase tracking-widest text-slate-400">Core Transformation Pillars</h5>
                           {parsedResult.topTraits?.map((trait, i) => (
                             <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-md">
                               <div className="flex justify-between items-center mb-1">
                                 <h6 className="font-bold text-white text-sm">{trait.title}</h6>
                                 <span className="text-xs font-black text-teal-400 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30">
                                   {trait.percentage}% Alignment
                                 </span>
                               </div>
                               <p className="text-xs text-slate-300 leading-relaxed font-normal">{trait.description}</p>
                             </div>
                           ))}
                         </div>
                       </div>

                       {/* STEP 2: PERSONA OVERVIEW */}
                       <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
                             <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                               <Brain className="w-4 h-4" />
                             </div>
                             <div>
                               <h5 className="text-base font-bold text-white">Persona Overview</h5>
                               <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Executive Trait Synthesis</p>
                             </div>
                          </div>
                          <div className="text-slate-200">
                            <Markdown components={assessmentMarkdownComponents}>{parsedResult.overview}</Markdown>
                          </div>
                       </div>

                       {/* STEP 3: RECOMMENDED ROLES */}
                       <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
                            <div className="w-8 h-8 bg-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center border border-teal-500/30">
                              <Target className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-base font-bold text-white">Recommended Career Paths</h5>
                              <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">High-Fit Modernization Trajectories</p>
                            </div>
                          </div>
                          <div className="text-slate-200">
                            <Markdown components={assessmentMarkdownComponents}>{parsedResult.roles}</Markdown>
                          </div>
                       </div>

                       {/* STEP 4: NEXT STEPS */}
                       <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
                          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
                            <div className="w-8 h-8 bg-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center border border-teal-500/30">
                              <TrendingUp className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-base font-bold text-white">NOVA Strategic Action Plan</h5>
                              <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Immediate High-Leverage Priorities</p>
                            </div>
                          </div>
                          <div className="text-slate-200">
                            <Markdown components={assessmentMarkdownComponents}>{parsedResult.nextSteps}</Markdown>
                          </div>

                          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-400 shadow-md">
                                  <img src="https://storage.googleapis.com/thetransformationroomassets/Katie.jpg" alt="Katie Peugh" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-400 shadow-md">
                                  <img src="https://storage.googleapis.com/thetransformationroomassets/Fawn.JPG" alt="Fawn Cook" className="w-full h-full object-cover" />
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-white">Direct Executive Consultation</p>
                                <p className="text-[10px] text-slate-400">Review your profile with Katie & Fawn</p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                              <a 
                                href="https://calendar.app.google/nCiGLhG5QGHb2SqL6"
                                target="_blank"
                                rel="noreferrer"
                                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg text-center"
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
                                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-slate-700 text-center cursor-pointer"
                              >
                                Submit Inquiry
                              </button>
                            </div>
                          </div>
                       </div>
                    </div>
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
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-700 mb-3">Current Title</label>
                    <input 
                      type="text" 
                      value={formData.currentRole}
                      onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                      placeholder="e.g. Warehouse Manager"
                      className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 p-4 rounded-xl focus:border-brand-secondary outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-700 mb-3">Target Title</label>
                    <input 
                      type="text" 
                      value={formData.targetRole}
                      onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                      placeholder="e.g. Solutions Design Engineer"
                      className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 p-4 rounded-xl focus:border-brand-secondary outline-none transition-all shadow-sm"
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
                  className="w-full flex-grow min-h-[120px] bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 p-6 rounded-2xl focus:border-brand-secondary outline-none transition-all shadow-inner font-sans text-sm leading-relaxed resize-none"
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

