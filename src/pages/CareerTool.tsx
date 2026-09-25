import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  User,
  Zap,
  TrendingUp,
  Target,
  Layers,
  Briefcase,
  Lightbulb,
  ShieldAlert,
  ArrowRight,
  Bot,
  Brain,
  MessageSquare,
  BarChart3,
  RefreshCw,
  CheckCircle2,
  Check,
  Building,
  Compass,
  FileCheck,
  Cpu,
  Link as LinkIcon,
  ExternalLink,
  ClipboardPaste,
  Trash2,
  Globe,
  HelpCircle,
  FileCode,
  SlidersHorizontal,
  BookmarkPlus
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
import { 
  getSharedCareerProfile, 
  updateSharedCareerProfile, 
  syncResumeToWorkspace, 
  subscribeToCareerProfile 
} from "../utils/careerStore";
import { extractTextFromFile, sanitizeAndNormalizeResumeText } from "../utils/documentParser";
import { sanitizeResumeText } from "../utils/resumeSanitizer";
import { fallbackParseResumeText } from "../utils/resumeParserFallback";
import { VoiceInputButton } from "../components/VoiceInputButton";
import { ResumeStudio } from "../components/resume/ResumeStudio";

const assessmentMarkdownComponents = {
  p: ({ children }: any) => <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-3 font-normal">{children}</p>,
  ul: ({ children }: any) => <ul className="space-y-3 my-3">{children}</ul>,
  ol: ({ children }: any) => <ol className="space-y-3 my-3 text-slate-700 text-sm md:text-base">{children}</ol>,
  li: ({ children }: any) => (
    <li className="flex items-start gap-3 text-slate-700 text-sm md:text-base leading-relaxed font-normal">
      <span className="w-2 h-2 rounded-full bg-teal-600 mt-2 shrink-0 shadow-xs" />
      <span className="flex-1">{children}</span>
    </li>
  ),
  strong: ({ children }: any) => <strong className="text-slate-900 font-bold tracking-tight">{children}</strong>,
  em: ({ children }: any) => <em className="text-teal-700 font-semibold not-italic">{children}</em>,
  h1: ({ children }: any) => <h1 className="text-xl font-bold text-slate-900 mb-2">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-lg font-bold text-teal-800 mb-2">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-base font-bold text-slate-900 mb-2">{children}</h3>,
};

const SAMPLE_TARGET_JD = `Role: Vice President of Supply Chain Systems & Automation
Target Organization: Enterprise Global Fulfillment

Position Summary:
Lead enterprise-scale supply chain transformation across 14 high-throughput fulfillment and automated distribution centers ($380M operating budget, 2,400+ workforce). Spearhead the modernization roadmap, including Autonomous Mobile Robots (AMR), AS/RS storage, conveyor sortation, and next-generation WMS/WES integration.

Key Responsibilities:
• Deliver multi-facility operational excellence, optimizing fulfillment velocity, order cycle times, and SLA adherence (99.8%+ target).
• Architect and execute multi-year automation capital expenditure (CapEx) initiatives with proven ROI payback models under 18 months.
• Eliminate cross-functional operational bottlenecks by implementing real-time telemetry, predictive throughput dashboards, and root-cause Kaizen methodologies.
• Direct executive stakeholder communication, vendor contract negotiations, and change management across frontline shift leadership.

Qualifications & Requirements:
• 10+ years executive leadership in supply chain operations, logistics automation, or manufacturing transformation.
• Proven track record leading large-scale systems cutovers (SAP, Manhattan, Blue Yonder, HighJump) and robotic fleet deployments.
• Demonstrated mastery of Lean Six Sigma principles, quantitative capacity modeling, and executive board presentations.`;

type ActiveHubTab = "simulator" | "resume" | "behavioral";
type JobInputTab = "paste" | "link";

export const CareerTool = () => {
  const { language } = useLanguage();
  const t = (key: string) => translate(key, language);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tool in the Unified Career Center
  const [activeTab, setActiveTab] = useState<ActiveHubTab>(() => {
    const tabParam = searchParams.get("tab") || searchParams.get("tool") || searchParams.get("path");
    if (tabParam === "resume") return "resume";
    if (tabParam === "behavioral") return "behavioral";
    return "simulator";
  });

  // Simulator step
  const [simStep, setSimStep] = useState<"input" | "generating" | "results">("input");
  
  // Behavioral Assessment step & sub-step
  const [behStep, setBehStep] = useState<"intro" | "questions" | "generating" | "results">("intro");

  const [loading, setLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Resume upload state
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Job link extraction state
  const [jobInputMode, setJobInputMode] = useState<JobInputTab>("paste");
  const [jobUrlInput, setJobUrlInput] = useState("");
  const [isExtractingUrl, setIsExtractingUrl] = useState(false);
  const [urlExtractionError, setUrlExtractionError] = useState<string | null>(null);
  const [urlExtractionSuccess, setUrlExtractionSuccess] = useState<{
    targetRole?: string;
    targetCompany?: string;
    keySkills?: string[];
  } | null>(null);

  // Persistent session profile state
  const [profile, setProfile] = useState(() => getSharedCareerProfile());

  // Form State: "Where they're at" and "Where they're looking to go"
  const [formData, setFormData] = useState({
    // Where they're at
    candidateName: profile.candidateName || "",
    currentTitle: profile.currentTitle || "",
    currentCompany: profile.currentCompany || "",
    experienceLevel: profile.experienceLevel || "",
    currentAccomplishments: profile.currentAccomplishments || "",
    currentSkills: profile.currentSkills || "",
    
    // Where they're looking to go
    careerGoal: profile.careerGoal || "",
    targetRole: profile.targetRole || "",
    targetCompany: profile.targetCompany || "",
    targetIndustry: profile.targetIndustry || "",
    targetSalary: profile.targetSalary || "",
    targetJobDescription: profile.targetJobDescription || "",
    biggestGap: profile.biggestGap || "",

    // Behavioral dimensions
    behavioralQ1: profile.conflictDynamics || "",
    behavioralQ5: "",
    conflictDynamics: profile.conflictDynamics || "Direct Candor",
    riskThreshold: profile.riskThreshold || "Calculated Trailblazer",
    transformationStyle: profile.transformationStyle || "Evolutionary Transition",
    careerValue: profile.careerValue || "",
    companyCulture: profile.companyCulture || []
  });

  // Simulator results - only populated when user runs simulation
  const [simulatorResults, setSimulatorResults] = useState<{
    readinessScore: number;
    roadmap: { step: string; desc: string; timeline: string }[];
    gaps: { skill: string; impact: string; fix: string }[];
    overview: string;
    positioningStrategy: string;
    recommendedActions: string[];
  } | null>(() => {
    if (profile.simulatorData?.roadmap && profile.simulatorData.roadmap.length > 0) {
      return {
        readinessScore: 84,
        roadmap: profile.simulatorData.roadmap.map((r, i) => ({
          step: r.step,
          desc: r.desc,
          timeline: `Month ${i * 2 + 1}-${i * 2 + 2}`
        })),
        gaps: (profile.simulatorData.gaps || []).map(g => ({
          skill: g,
          impact: "Critical for executive screening",
          fix: `Incorporate proof-points in ${profile.targetRole || "target leadership"} narrative.`
        })),
        overview: profile.simulatorData.overview || "Your transition combines operational velocity with systems architecture.",
        positioningStrategy: "Position yourself not as a process maintainer, but as a transformational systems architect.",
        recommendedActions: [
          "Align Resume bullets around quantifiable throughput metrics.",
          "Target organizations actively scaling warehouse automation.",
          "Emphasize multi-facility change leadership."
        ]
      };
    }
    return null;
  });

  // Behavioral assessment results
  const [behavioralResults, setBehavioralResults] = useState<{
    scores: { subject: string; A: number; fullMark: number }[];
    topTraits: { title: string; percentage: number; description: string }[];
    overview: string;
    roles: string;
    nextSteps: string;
  } | null>(() => profile.behavioralAssessment || null);

  // Sync profile on changes from other tabs or components
  useEffect(() => {
    return subscribeToCareerProfile((newProfile) => {
      setProfile(newProfile);
      setFormData(prev => ({
        ...prev,
        candidateName: newProfile.candidateName || prev.candidateName,
        currentTitle: newProfile.currentTitle || prev.currentTitle,
        currentCompany: newProfile.currentCompany || prev.currentCompany,
        targetRole: newProfile.targetRole || prev.targetRole,
        targetCompany: newProfile.targetCompany || prev.targetCompany,
        targetIndustry: newProfile.targetIndustry || prev.targetIndustry,
        targetJobDescription: newProfile.targetJobDescription || prev.targetJobDescription,
        currentSkills: newProfile.currentSkills || prev.currentSkills,
        currentAccomplishments: newProfile.currentAccomplishments || prev.currentAccomplishments
      }));
    });
  }, []);

  // Update query params when active tab changes
  const switchTab = (tab: ActiveHubTab) => {
    setActiveTab(tab);
    setSearchParams({ tool: tab }, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sync form data changes back to shared session profile (debounced)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        updateSharedCareerProfile({
          candidateName: next.candidateName,
          currentTitle: next.currentTitle,
          currentCompany: next.currentCompany,
          experienceLevel: next.experienceLevel,
          currentAccomplishments: next.currentAccomplishments,
          currentSkills: next.currentSkills,
          careerGoal: next.careerGoal,
          targetRole: next.targetRole,
          targetCompany: next.targetCompany,
          targetIndustry: next.targetIndustry,
          targetSalary: next.targetSalary,
          targetJobDescription: next.targetJobDescription,
          biggestGap: next.biggestGap,
          conflictDynamics: next.conflictDynamics,
          riskThreshold: next.riskThreshold,
          transformationStyle: next.transformationStyle
        });
      }, 500);
      return next;
    });
  };

  // Handle direct resume file upload from Career Hub
  const handleCareerResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    try {
      const rawText = await extractTextFromFile(file);
      if (!rawText || !rawText.trim()) {
        alert("Could not extract readable text from this file. Please try a different PDF or DOCX, or paste your details.");
        return;
      }

      const cleanText = sanitizeAndNormalizeResumeText(sanitizeResumeText(rawText));
      
      // Attempt server parse with client fallback
      let parsedResume = null;
      try {
        const res = await fetch("/api/resume/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawText: cleanText })
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.personalInfo) {
            parsedResume = json.data;
          }
        }
      } catch (err) {
        console.warn("Server parse fallback:", err);
      }

      if (!parsedResume) {
        parsedResume = fallbackParseResumeText(cleanText);
      }

      // Sync directly to the user's active session workspace
      syncResumeToWorkspace(parsedResume, cleanText);

      // Auto-populate "Where they're at"
      const name = parsedResume.personalInfo?.fullName || "Candidate";
      const title = parsedResume.experiences?.[0]?.role || parsedResume.personalInfo?.targetTitle || "";
      const company = parsedResume.experiences?.[0]?.company || "";
      const skillsStr = (parsedResume.skills || []).flatMap((s: any) => s.skills || []).slice(0, 8).join(", ");
      const accomplishmentsStr = (parsedResume.experiences?.[0]?.highlights || []).slice(0, 3).join("\n");

      setFormData(prev => ({
        ...prev,
        candidateName: name,
        currentTitle: title || prev.currentTitle,
        currentCompany: company || prev.currentCompany,
        currentSkills: skillsStr || prev.currentSkills,
        currentAccomplishments: accomplishmentsStr || prev.currentAccomplishments
      }));

      setUploadSuccessToast(`Resume parsed & synced: ${name} (${title || "Operations Leader"}). Data is ready in all 3 tools!`);
      setTimeout(() => setUploadSuccessToast(null), 6000);

    } catch (err) {
      console.error("Resume upload error in Career Hub:", err);
      alert("Error parsing document. You can still manually enter your details.");
    } finally {
      setIsUploadingResume(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle URL Job Link Extraction
  const handleExtractJobFromUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!jobUrlInput || !jobUrlInput.trim()) return;

    setIsExtractingUrl(true);
    setUrlExtractionError(null);
    setUrlExtractionSuccess(null);

    try {
      const res = await fetch("/api/extract-job-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobUrlInput.trim() })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to extract job details from this link.");
      }

      // Populate form data with extracted fields
      setFormData(prev => ({
        ...prev,
        targetRole: data.targetRole || prev.targetRole,
        targetCompany: data.targetCompany || prev.targetCompany,
        targetIndustry: data.targetIndustry || prev.targetIndustry,
        targetSalary: data.targetSalary || prev.targetSalary,
        targetJobDescription: data.jobDescription || prev.targetJobDescription
      }));

      // Update shared career profile session
      updateSharedCareerProfile({
        targetRole: data.targetRole || formData.targetRole,
        targetCompany: data.targetCompany || formData.targetCompany,
        targetIndustry: data.targetIndustry || formData.targetIndustry,
        targetSalary: data.targetSalary || formData.targetSalary,
        targetJobDescription: data.jobDescription || formData.targetJobDescription
      });

      setUrlExtractionSuccess({
        targetRole: data.targetRole,
        targetCompany: data.targetCompany,
        keySkills: data.keySkills || []
      });

      setUploadSuccessToast(`Job posting extracted: ${data.targetRole || "Role"} at ${data.targetCompany || "Target Org"}`);
      setTimeout(() => setUploadSuccessToast(null), 5000);

    } catch (err: any) {
      console.error("Job URL extraction failed:", err);
      setUrlExtractionError(
        err.message || 
        "This website restricts automated link parsing. Switch to 'Paste Job Description' to copy-paste the text directly."
      );
    } finally {
      setIsExtractingUrl(false);
    }
  };

  // Clipboard Paste Helper
  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clipText = await navigator.clipboard.readText();
        if (clipText && clipText.trim()) {
          const cur = formData.targetJobDescription || "";
          const sep = cur.trim() ? "\n\n" : "";
          handleFormChange("targetJobDescription", cur + sep + clipText.trim());
          setUploadSuccessToast("Pasted job text from clipboard!");
          setTimeout(() => setUploadSuccessToast(null), 3000);
        } else {
          alert("Your clipboard is empty. Please copy a job description first.");
        }
      } else {
        alert("Please use Ctrl+V or Command+V to paste into the text box.");
      }
    } catch {
      alert("Please press Ctrl+V or Command+V to paste your job description directly.");
    }
  };

  // Load Sample Target Job Description
  const handleLoadSampleJD = () => {
    handleFormChange("targetJobDescription", SAMPLE_TARGET_JD);
    handleFormChange("targetRole", "Vice President of Supply Chain Systems & Automation");
    handleFormChange("targetCompany", "Enterprise Global Fulfillment");
    handleFormChange("targetIndustry", "Automated Logistics & High-Tech Warehousing");
    handleFormChange("targetSalary", "$220,000 - $280,000+");
    setUploadSuccessToast("Loaded executive sample job description!");
    setTimeout(() => setUploadSuccessToast(null), 3000);
  };

  // Run Career Leap Simulation
  const handleRunSimulation = async () => {
    setLoading(true);
    setSimStep("generating");
    setGenerationProgress(0);

    const timer = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 15;
      });
    }, 250);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Generate career transformation roadmap and gap analysis." }],
          systemInstruction: `You are NOVA, Elite Strategic Career Simulator at The Transformation Room.
          
          CANDIDATE CURRENT STATE:
          - Name: ${formData.candidateName || "Candidate"}
          - Current Role: ${formData.currentTitle || "Senior Operations Manager"}
          - Current Organization: ${formData.currentCompany || "Enterprise Logistics"}
          - Current Accomplishments: ${formData.currentAccomplishments || "Led fulfillment optimization"}
          - Current Skills: ${formData.currentSkills || "Lean Six Sigma, WMS, Automation"}
          
          WHERE THEY WANT TO GO:
          - Target Role: ${formData.targetRole || "Director of Supply Chain & Systems Transformation"}
          - Target Organization: ${formData.targetCompany || "Enterprise Transformation"}
          - Target Industry: ${formData.targetIndustry || "Automated Logistics & High-Tech Warehousing"}
          - Target Compensation: ${formData.targetSalary || "$185k - $240k+"}
          - Target Job Description Requirements: ${formData.targetJobDescription || "Lead multi-facility modernization, autonomous AMR/ASRS rollout, enterprise P&L"}
          - Anticipated Gap: ${formData.biggestGap || "Bridging regional execution to enterprise strategy"}
          
          Return strictly a valid JSON object matching:
          {
            "readinessScore": number, // 65-95
            "overview": string, // 2-3 sentences evaluating the trajectory leap
            "positioningStrategy": string, // 1 crisp executive strategy sentence
            "roadmap": [
              { "step": "Stage 1 Title", "timeline": "Months 1-3", "desc": "Detailed focus and metrics" },
              { "step": "Stage 2 Title", "timeline": "Months 4-6", "desc": "Automation scale & pilot execution" },
              { "step": "Stage 3 Title", "timeline": "Months 7-12", "desc": "Enterprise leadership & executive governance" }
            ],
            "gaps": [
              { "skill": "Competency Name", "impact": "Why it matters", "fix": "Concrete resume/interview narrative adjustment" }
            ],
            "recommendedActions": [ "Action 1", "Action 2", "Action 3" ]
          }`
        })
      });

      clearInterval(timer);
      setGenerationProgress(100);

      let parsed: any = null;
      if (res.ok) {
        const data = await res.json();
        let text = data.reply || "{}";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) text = jsonMatch[0];
        try {
          parsed = JSON.parse(text);
        } catch (_) {}
      }

      const results = {
        readinessScore: parsed?.readinessScore || 82,
        roadmap: parsed?.roadmap || [
          { step: "Phase 1: Baseline Telemetry & Quick Wins", timeline: "Months 1-3", desc: "Quantify current throughput gains, deploy telemetry dashboards, and frame accomplishments as enterprise metrics." },
          { step: "Phase 2: High-Velocity Pilot & Automation", timeline: "Months 4-6", desc: "Champion an automated robotics or WMS optimization pilot; document labor cost avoidance and SLA improvements." },
          { step: "Phase 3: Executive Scope & Board Governance", timeline: "Months 7-12", desc: "Position for multi-site leadership, articulate cross-functional transformation, and negotiate target executive package." }
        ],
        gaps: parsed?.gaps || [
          { skill: "Enterprise CapEx Modeling", impact: "Crucial for VP/Director screening", fix: "Reframe facility upgrades with explicit ROI percentages and dollar savings in Resume summary." },
          { skill: "Autonomous Systems Governance", impact: "High differentiator in modern supply chain", fix: "Highlight experience with automated material handling (AMR, AS/RS, sortation) across bullets." }
        ],
        overview: parsed?.overview || `Your leap from ${formData.currentTitle || "current role"} to ${formData.targetRole || "target position"} has an authentic pathway grounded in operational modernization.`,
        positioningStrategy: parsed?.positioningStrategy || "Position yourself as an architect of self-sustaining systems, not merely a maintainer of frontline shifts.",
        recommendedActions: parsed?.recommendedActions || [
          "Transfer validated keywords to Resume Studio to immediately elevate ATS score.",
          "Calibrate conflict candor and risk agility in the Behavioral Traits diagnostic.",
          "Prepare executive storytelling bullets addressing multi-facility scale."
        ]
      };

      setSimulatorResults(results);

      // Save to shared session profile
      updateSharedCareerProfile({
        simulatorData: {
          currentRole: formData.currentTitle,
          targetRole: formData.targetRole,
          overview: results.overview,
          strengths: formData.currentAccomplishments,
          skills: formData.currentSkills,
          gaps: results.gaps.map((g: any) => g.skill),
          roadmap: results.roadmap.map((r: any) => ({ step: r.step, desc: r.desc })),
          date: new Date().toISOString()
        }
      });

      setSimStep("results");
    } catch (err) {
      console.error("Simulation error:", err);
      setSimStep("results");
    } finally {
      setLoading(false);
    }
  };

  // Run Behavioral Assessment
  const handleRunBehavioral = async () => {
    setLoading(true);
    setBehStep("generating");
    setGenerationProgress(0);

    const timer = setInterval(() => {
      setGenerationProgress(prev => (prev < 90 ? prev + 15 : prev));
    }, 250);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Analyze behavioral leadership traits for executive operations." }],
          systemInstruction: `You are NOVA, Senior Strategic Intelligence.
          Analyze executive diagnostic profile for candidate:
          - Current Role: ${formData.currentTitle || "Operations Professional"}
          - Target Role: ${formData.targetRole || "Director of Systems Transformation"}
          - Operating Scope: ${formData.experienceLevel}
          - Conflict Style: ${formData.conflictDynamics}
          - Risk Agility: ${formData.riskThreshold}
          - Change Leadership: ${formData.transformationStyle}
          
          Return ONLY valid JSON matching:
          {
            "scores": [
              { "subject": "Strategic Architecture", "A": 96, "fullMark": 100 },
              { "subject": "Execution Velocity", "A": 92, "fullMark": 100 },
              { "subject": "Conflict Candor", "A": 90, "fullMark": 100 },
              { "subject": "Risk Agility", "A": 88, "fullMark": 100 },
              { "subject": "Change Leadership", "A": 94, "fullMark": 100 },
              { "subject": "Cultural Alignment", "A": 89, "fullMark": 100 }
            ],
            "topTraits": [
              { "title": "Evidence-Led Pragmatist", "percentage": 96, "description": "Grounds disagreements in objective data telemetry and SLA metrics, neutralizing interpersonal politics." },
              { "title": "Calculated Systems Pioneer", "percentage": 94, "description": "Balances bold technology experimentation with rigorous risk mitigation and structured cutovers." },
              { "title": "Transformation Catalyst", "percentage": 91, "description": "Engineers high-velocity change through disciplined Kaizen sprints and frontline buy-in." }
            ],
            "overview": "Your leadership diagnostic shows exceptional aptitude for complex operational transformation...",
            "roles": "• **Director of Operational Excellence & Modernization**\\n• **VP of Supply Chain Systems & Automation**\\n• **Head of Technical Program Management**",
            "nextSteps": "1. Align executive resume narrative around quantifiable ROI.\\n2. Target modern fulfillment networks.\\n3. Leverage telemetry authority in interviews."
          }`
        })
      });

      clearInterval(timer);
      setGenerationProgress(100);

      let parsed: any = null;
      if (res.ok) {
        const data = await res.json();
        let text = data.reply || "{}";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) text = jsonMatch[0];
        try {
          parsed = JSON.parse(text);
        } catch (_) {}
      }

      const finalBeh = {
        scores: parsed?.scores || [
          { subject: "Strategic Architecture", A: 96, fullMark: 100 },
          { subject: "Execution Velocity", A: 92, fullMark: 100 },
          { subject: "Conflict Candor", A: 90, fullMark: 100 },
          { subject: "Risk Agility", A: 88, fullMark: 100 },
          { subject: "Change Leadership", A: 94, fullMark: 100 },
          { subject: "Cultural Alignment", A: 89, fullMark: 100 }
        ],
        topTraits: parsed?.topTraits || [
          { title: "Evidence-Led Pragmatist", percentage: 96, description: "Grounds operational disagreements in objective data telemetry and SLA metrics, neutralizing interpersonal friction." },
          { title: "Calculated Systems Pioneer", percentage: 94, description: "Balances bold technology experimentation with rigorous risk mitigation and structured pilot cutovers." },
          { title: "Transformation Catalyst", percentage: 91, description: "Engineers high-velocity change through disciplined Kaizen sprints and frontline buy-in." }
        ],
        overview: parsed?.overview || `Your diagnostic profile demonstrates a strong orientation toward high-impact systems architecture and strategic operations. You excel at synthesizing complex workflows into repeatable, high-output engines.`,
        roles: parsed?.roles || "• **Director of Operational Excellence & Modernization**\n• **VP of Supply Chain Systems & Automation**\n• **Head of Technical Program Management**",
        nextSteps: parsed?.nextSteps || "1. Align executive resume narrative around quantifiable ROI.\n2. Target modern fulfillment networks.\n3. Leverage telemetry authority in interviews."
      };

      setBehavioralResults(finalBeh);

      // Save to shared career profile
      updateSharedCareerProfile({
        conflictDynamics: formData.conflictDynamics,
        riskThreshold: formData.riskThreshold,
        transformationStyle: formData.transformationStyle,
        behavioralAssessment: {
          ...finalBeh,
          date: new Date().toISOString()
        }
      });

      setBehStep("results");
    } catch (err) {
      console.error("Behavioral assessment error:", err);
      setBehStep("results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pt-16 selection:bg-teal-500 selection:text-white">
      <SEO 
        title="Executive Career Center | Career Simulator, Resume Optimizer & Behavioral DNA"
        description="Unified career acceleration command center for supply chain, logistics, and technology leaders. Real-time career path simulation, executive resume optimization, and behavioral traits assessment."
        keywords="Executive career center, supply chain career simulator, resume optimizer, behavioral traits assessment, career leap roadmap, operations transformation"
      />

      {/* Hidden file input for resume uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept=".pdf,.docx,.txt" 
        className="hidden" 
        onChange={handleCareerResumeUpload} 
      />

      {/* Top Notification Toast */}
      <AnimatePresence>
        {uploadSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-teal-700 text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-3 border border-teal-600"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-200" />
            <span>{uploadSuccessToast}</span>
            <button onClick={() => setUploadSuccessToast(null)} className="ml-2 p-1 hover:bg-white/20 rounded-lg">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Command Center Top Ribbon (Clean Light Style) */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Left: Section branding without fake data */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                <Compass className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block leading-tight">Career Center</span>
                <span className="text-[11px] text-slate-500 font-normal">Career Simulator, Resume Optimizer & Behavioral DNA</span>
              </div>
            </div>

            {/* Right: Three Tools Seamless Navigation Tabs (Clean Light Switcher) */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start lg:self-auto overflow-x-auto scrollbar-none w-full lg:w-auto">
              <button
                onClick={() => switchTab("simulator")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "simulator"
                    ? "bg-white text-teal-900 shadow-xs border border-slate-200/90 font-black"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-teal-600" />
                <span>1. Career Simulator</span>
              </button>

              <button
                onClick={() => switchTab("resume")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "resume"
                    ? "bg-white text-teal-900 shadow-xs border border-slate-200/90 font-black"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. Resume Optimizer</span>
              </button>

              <button
                onClick={() => switchTab("behavioral")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "behavioral"
                    ? "bg-white text-teal-900 shadow-xs border border-slate-200/90 font-black"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-indigo-600" />
                <span>3. Behavioral Traits</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

        {/* ========================================================================= */}
        {/* TAB 1: CAREER PATHWAY SIMULATOR ("Where You're At" & "Where You're Going") */}
        {/* ========================================================================= */}
        {activeTab === "simulator" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Hero Banner (Clean Light Styling) */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
              <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    Where You're At <span className="text-teal-600">→</span> Where You're Looking to Go
                  </h1>
                  <p className="text-slate-600 text-sm mt-1 max-w-2xl">
                    Define your current baseline, upload your resume, and map your trajectory to high-impact target roles. Paste in a full job description or link to extract requirements instantly.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-200 shadow-xs transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-teal-600" />
                    <span>Upload Resume to Auto-Fill</span>
                  </button>

                  <button
                    onClick={() => switchTab("resume")}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <FileText className="w-4 h-4 text-white" />
                    <span>Open in Resume Studio</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Split Dual-Column Interactive Engine: Where they're at vs Where they want to go */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

              {/* ------------------------------------------------------------- */}
              {/* LEFT PILLAR: WHERE YOU'RE AT (CURRENT STATE)                  */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs relative">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">1. Where You're At</h2>
                      <span className="text-[11px] font-semibold text-slate-500">Current baseline & operating scope</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                    Current Baseline
                  </span>
                </div>

                {/* Candidate Name & Current Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Full Name
                    </label>
                    <input 
                      type="text"
                      value={formData.candidateName}
                      onChange={(e) => handleFormChange("candidateName", e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Current Professional Title
                    </label>
                    <input 
                      type="text"
                      value={formData.currentTitle}
                      onChange={(e) => handleFormChange("currentTitle", e.target.value)}
                      placeholder="e.g. Senior Operations Manager"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Organization & Seniority Tier */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Current Organization / Company
                    </label>
                    <input 
                      type="text"
                      value={formData.currentCompany}
                      onChange={(e) => handleFormChange("currentCompany", e.target.value)}
                      placeholder="e.g. Apex Global Logistics"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Operating Scope / Seniority Tier
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) => handleFormChange("experienceLevel", e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 cursor-pointer transition-all"
                    >
                      <option value="">Select Seniority Level...</option>
                      <option value="Manager / Frontline Lead">Manager / Frontline Lead</option>
                      <option value="Director / Head of Department">Director / Head of Department</option>
                      <option value="VP / Executive Level">VP / Executive Level</option>
                      <option value="Strategic Principal / SME">Strategic Principal / SME</option>
                    </select>
                  </div>
                </div>

                {/* Current Key Accomplishments & Scope (With TALK TO TEXT) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Current Key Accomplishments & Scope
                    </label>
                    <VoiceInputButton 
                      onTranscript={(spoken) => {
                        const cur = formData.currentAccomplishments || "";
                        const sep = cur.trim() ? "\n" : "";
                        handleFormChange("currentAccomplishments", cur + sep + spoken);
                      }}
                      label="Talk to Text"
                    />
                  </div>
                  <textarea 
                    rows={4}
                    value={formData.currentAccomplishments}
                    onChange={(e) => handleFormChange("currentAccomplishments", e.target.value)}
                    placeholder="Describe scale of facilities managed, workforce size, throughput gains, automation rollouts (or click Talk to Text to speak)..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 leading-relaxed placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none resize-y transition-all"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Tip: Use voice to articulate your biggest career milestones and throughput metrics naturally.
                  </span>
                </div>

                {/* Core Competencies & Skills */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Current Core Competencies & Technologies
                  </label>
                  <input 
                    type="text"
                    value={formData.currentSkills}
                    onChange={(e) => handleFormChange("currentSkills", e.target.value)}
                    placeholder="e.g. Lean Six Sigma, WMS Systems, AMR Robotics, CapEx Modeling, Labor Optimization"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                  />
                </div>

                {/* Quick Upload Resume Banner */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-2xl border-2 border-dashed border-teal-200 hover:border-teal-500 bg-teal-50/30 hover:bg-teal-50/70 flex items-center justify-between gap-4 cursor-pointer transition-all group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Auto-populate from Resume</span>
                      <span className="text-[11px] text-slate-500">PDF, DOCX, TXT • Transfers live to Resume Studio</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Browse <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* RIGHT PILLAR: WHERE YOU'RE LOOKING TO GO (FUTURE TRAJECTORY)  */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-white border border-teal-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs relative">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">2. Where You're Looking to Go</h2>
                      <span className="text-[11px] font-semibold text-slate-500">Target role, desired industry & job requirements</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200 font-bold">
                    Future Vision
                  </span>
                </div>

                {/* Target Role & Target Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Target Role / Job Title
                    </label>
                    <input 
                      type="text"
                      value={formData.targetRole}
                      onChange={(e) => handleFormChange("targetRole", e.target.value)}
                      placeholder="e.g. VP of Supply Chain Systems & Automation"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Target Company / Organization
                    </label>
                    <input 
                      type="text"
                      value={formData.targetCompany}
                      onChange={(e) => handleFormChange("targetCompany", e.target.value)}
                      placeholder="e.g. Target Organization or Industry Leader"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Target Industry & Target Compensation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Target Sector / Industry
                    </label>
                    <input 
                      type="text"
                      value={formData.targetIndustry}
                      onChange={(e) => handleFormChange("targetIndustry", e.target.value)}
                      placeholder="e.g. Automated Logistics & Enterprise Robotics"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Target Compensation Bracket
                    </label>
                    <input 
                      type="text"
                      value={formData.targetSalary}
                      onChange={(e) => handleFormChange("targetSalary", e.target.value)}
                      placeholder="e.g. $190,000 - $250,000+"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Primary Career Objective */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Primary Career Objective
                  </label>
                  <select
                    value={formData.careerGoal}
                    onChange={(e) => handleFormChange("careerGoal", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 cursor-pointer transition-all"
                  >
                    <option value="">Select Primary Objective...</option>
                    <option value="Transition to Higher Executive Tier (Level Up)">Transition to Higher Executive Tier (Level Up)</option>
                    <option value="Pivot to Automation & Robotics Logistics">Pivot to Automation & Robotics Logistics</option>
                    <option value="Enterprise Transformation Leadership">Enterprise Transformation Leadership</option>
                    <option value="Expand Multi-Site & International Scope">Expand Multi-Site & International Scope</option>
                  </select>
                </div>

                {/* ============================================================= */}
                {/* NEW FEATURE: PASTE JOB DESCRIPTION OR LINK IN WHERE LOOKING TO GO */}
                {/* ============================================================= */}
                <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-teal-700" /> Target Job Requirements
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Paste the full description or provide a job URL to auto-extract requirements
                      </p>
                    </div>

                    {/* Mode Switcher Tabs */}
                    <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-xl self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setJobInputMode("paste");
                          setUrlExtractionError(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          jobInputMode === "paste"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <FileText className="w-3 h-3 text-teal-600" />
                        <span>Paste Description</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setJobInputMode("link");
                          setUrlExtractionError(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          jobInputMode === "link"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <LinkIcon className="w-3 h-3 text-teal-600" />
                        <span>Paste Job Link / URL</span>
                      </button>
                    </div>
                  </div>

                  {/* MODE A: PASTE JOB LINK / URL */}
                  {jobInputMode === "link" && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <form onSubmit={handleExtractJobFromUrl} className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Paste Job Posting URL (LinkedIn, Indeed, Greenhouse, Lever, Careers Page)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-1">
                            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                              type="url"
                              value={jobUrlInput}
                              onChange={(e) => setJobUrlInput(e.target.value)}
                              placeholder="https://www.linkedin.com/jobs/view/... or careers page URL"
                              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                            />
                            {jobUrlInput && (
                              <button
                                type="button"
                                onClick={() => setJobUrlInput("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <button
                            type="submit"
                            disabled={isExtractingUrl || !jobUrlInput.trim()}
                            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap"
                          >
                            {isExtractingUrl ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                <span>Extracting...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                                <span>Fetch & Extract</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>

                      {/* Error or Fallback Message */}
                      {urlExtractionError && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="font-bold block">Could not automatically fetch from this link</span>
                            <p className="mt-0.5 text-slate-700 leading-relaxed font-normal">
                              {urlExtractionError}
                            </p>
                            <button
                              type="button"
                              onClick={() => setJobInputMode("paste")}
                              className="mt-2 text-xs font-bold text-teal-700 hover:text-teal-900 underline flex items-center gap-1 cursor-pointer"
                            >
                              Switch to Paste Description tab <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Success Card from URL Extraction */}
                      {urlExtractionSuccess && (
                        <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" /> Extracted from Job Posting
                            </span>
                            <span className="text-[10px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                              Synced to Trajectory
                            </span>
                          </div>
                          <div className="text-xs text-slate-800 font-semibold">
                            {urlExtractionSuccess.targetRole}
                            {urlExtractionSuccess.targetCompany && ` • ${urlExtractionSuccess.targetCompany}`}
                          </div>
                          {urlExtractionSuccess.keySkills && urlExtractionSuccess.keySkills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {urlExtractionSuccess.keySkills.map((sk, idx) => (
                                <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white text-teal-900 border border-teal-200">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-[11px] text-slate-600 pt-1 border-t border-teal-200/60">
                            Full job description and requirements have been loaded into the description engine below.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODE B: PASTE JOB DESCRIPTION (WITH TOOLBAR & TALK TO TEXT) */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-700">
                          {jobInputMode === "link" ? "Extracted / Custom Job Description:" : "Paste Job Description or Requirements:"}
                        </span>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <VoiceInputButton 
                          onTranscript={(spoken) => {
                            const cur = formData.targetJobDescription || "";
                            const sep = cur.trim() ? " " : "";
                            handleFormChange("targetJobDescription", cur + sep + spoken);
                          }}
                          label="Talk to Text"
                          size="sm"
                        />

                        <button
                          type="button"
                          onClick={handlePasteFromClipboard}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="Paste text from your clipboard"
                        >
                          <ClipboardPaste className="w-3 h-3 text-slate-500" />
                          <span>Paste</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleLoadSampleJD}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-teal-800 rounded-lg text-xs font-semibold border border-teal-200 shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="Load a realistic executive VP/Director sample job description"
                        >
                          <Sparkles className="w-3 h-3 text-teal-600" />
                          <span>Sample JD</span>
                        </button>

                        {formData.targetJobDescription && (
                          <button
                            type="button"
                            onClick={() => handleFormChange("targetJobDescription", "")}
                            className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                            title="Clear description text"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea 
                      rows={5}
                      value={formData.targetJobDescription}
                      onChange={(e) => handleFormChange("targetJobDescription", e.target.value)}
                      placeholder="Paste or speak the actual job requirements, bullet points, or skills from roles you are targeting (e.g. Lead 5 distribution centers, deploy autonomous mobile robots, manage $40M budget)..."
                      className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 leading-relaxed placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none resize-y transition-all"
                    />

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Synchronizes live with ATS gap analysis in Resume Studio.</span>
                      <span>{formData.targetJobDescription ? `${formData.targetJobDescription.split(/\s+/).filter(Boolean).length} words` : "0 words"}</span>
                    </div>
                  </div>
                </div>

                {/* Biggest Anticipated Gap / Hurdle (WITH TALK TO TEXT) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Biggest Anticipated Transition Hurdle
                    </label>
                    <VoiceInputButton 
                      onTranscript={(spoken) => {
                        const cur = formData.biggestGap || "";
                        const sep = cur.trim() ? " " : "";
                        handleFormChange("biggestGap", cur + sep + spoken);
                      }}
                      label="Talk to Text"
                      size="sm"
                    />
                  </div>
                  <input 
                    type="text"
                    value={formData.biggestGap}
                    onChange={(e) => handleFormChange("biggestGap", e.target.value)}
                    placeholder="e.g. My experience is heavily tactical operations, need to frame as enterprise systems strategy"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                  />
                </div>

                {/* Simulation Action Button */}
                <button
                  type="button"
                  onClick={handleRunSimulation}
                  disabled={loading}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-teal-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Simulating Transformation Trajectory...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-white" />
                      <span>Simulate Career Transformation Leap</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Simulation Results Section (if generated) */}
            {simStep === "generating" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4 shadow-xs">
                <Loader2 className="w-10 h-10 animate-spin text-teal-600 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">NOVA Intelligence Calibrating Trajectory...</h3>
                <p className="text-slate-600 text-xs">Analyzing gap between current scope and target requirements</p>
                <div className="max-w-md mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 transition-all duration-300" style={{ width: `${generationProgress}%` }} />
                </div>
              </div>
            )}

            {simStep === "results" && simulatorResults && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 space-y-8 shadow-xs relative"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      Simulation Complete
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                      Roadmap: {formData.currentTitle || "Current State"} → {formData.targetRole || "Executive Target"}
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">{simulatorResults.overview}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-5 py-2.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-teal-700">Leap Match</span>
                      <span className="text-2xl font-black text-teal-800">{simulatorResults.readinessScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Milestone Roadmap */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-teal-600" /> Multi-Stage Milestone Trajectory
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {simulatorResults.roadmap.map((item, idx) => (
                      <div key={idx} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-teal-700">{item.timeline}</span>
                          <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-base">{item.step}</h5>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Identified Gaps & Fixes */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Key Competency Gaps & Narrative Fixes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {simulatorResults.gaps.map((gap, idx) => (
                      <div key={idx} className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{gap.skill}</span>
                          <span className="text-[10px] font-bold text-amber-800 px-2 py-0.5 rounded bg-amber-100 border border-amber-200">
                            {gap.impact}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-normal leading-relaxed">{gap.fix}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* NOVA Positioning Strategy */}
                <div className="p-6 bg-gradient-to-r from-teal-50 via-emerald-50/60 to-slate-50 border border-teal-200 rounded-2xl space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-teal-600" /> NOVA Executive Positioning Insight
                  </span>
                  <p className="text-base text-slate-900 font-medium italic">
                    "{simulatorResults.positioningStrategy}"
                  </p>
                </div>

                {/* Quick Action Transfer Footer */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => switchTab("resume")}
                    className="flex-1 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <FileText className="w-4 h-4 text-white" />
                    <span>Apply Roadmap to Resume Studio</span>
                  </button>

                  <button
                    onClick={() => switchTab("behavioral")}
                    className="flex-1 py-4 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-slate-200 shadow-xs transition-all cursor-pointer"
                  >
                    <Brain className="w-4 h-4 text-teal-600" />
                    <span>Calibrate Leadership Traits</span>
                  </button>

                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("ais:open-chat", {
                        detail: {
                          type: "individual",
                          prompt: `I just simulated my career leap from ${formData.currentTitle} to ${formData.targetRole}. Let's review the milestone roadmap and skill gaps.`
                        }
                      }));
                    }}
                    className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-slate-200 shadow-xs cursor-pointer transition-all"
                  >
                    <Bot className="w-4 h-4 text-teal-600" />
                    <span>Discuss with NOVA</span>
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: EXECUTIVE RESUME STUDIO & ATS OPTIMIZER (Clean Light Wrapper)     */}
        {/* ========================================================================= */}
        {activeTab === "resume" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Live Sync Information Banner (Light Theme) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Seamless Resume Studio Active</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-bold">
                      Session-Isolated
                    </span>
                  </div>
                  <span className="text-xs text-slate-600">
                    Synchronized with: <strong className="text-teal-800">{formData.targetRole || "Executive Role"}</strong>
                    {formData.targetCompany && ` @ ${formData.targetCompany}`}
                    {formData.targetJobDescription && " • Target Job Description Loaded for ATS matching"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => switchTab("simulator")}
                  className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-teal-600" />
                  <span>Back to Simulator</span>
                </button>
              </div>
            </div>

            {/* Embedded Resume Studio Container */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <ResumeStudio />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BEHAVIORAL TRAITS & LEADERSHIP DNA (Clean Light Theme)            */}
        {/* ========================================================================= */}
        {activeTab === "behavioral" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Hero */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold text-xs uppercase tracking-wider mb-2.5">
                    <Brain className="w-3.5 h-3.5 text-indigo-600" />
                    Leadership Behavioral Traits Assessment
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    Executive Operational DNA & Radar Matrix
                  </h2>
                  <p className="text-slate-600 text-sm mt-1 max-w-2xl">
                    Discover your 6-axis executive capabilities, conflict resolution dynamics, risk threshold, and leadership archetype. High-fit roles are matched to your signature traits.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRunBehavioral}
                    disabled={loading}
                    className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                    <span>Generate Executive Diagnostic</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Diagnostic Configuration Cards (Clean Light Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Conflict Dynamics */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                  <MessageSquare className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Conflict & Feedback Dynamics</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { id: "Direct Candor", label: "Direct Candor", desc: "Data-led and immediate SLA root-cause confrontation." },
                    { id: "Consensus Alignment", label: "Consensus Alignment", desc: "Cross-functional coalition building before cutovers." },
                    { id: "Analytical Mediation", label: "Analytical Mediation", desc: "Neutralizes tension with time studies and metrics." }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleFormChange("conflictDynamics", opt.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        formData.conflictDynamics === opt.id
                          ? "bg-teal-50 border-teal-500 text-teal-950 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xs font-bold block">{opt.label}</span>
                      <span className="text-[11px] text-slate-500 font-normal leading-snug">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk Agility */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                  <ShieldAlert className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Ambiguity & Risk Agility</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { id: "Calculated Trailblazer", label: "Calculated Trailblazer", desc: "Bold automation trials bounded by pilot de-risking." },
                    { id: "Resilient De-risker", label: "Resilient De-risker", desc: "Zero tolerance for floor downtime and inventory variance." },
                    { id: "Adaptive Experimenter", label: "Adaptive Experimenter", desc: "Rapid iterations, flexible shift pilots, Kaizen sprints." }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleFormChange("riskThreshold", opt.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        formData.riskThreshold === opt.id
                          ? "bg-teal-50 border-teal-500 text-teal-950 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xs font-bold block">{opt.label}</span>
                      <span className="text-[11px] text-slate-500 font-normal leading-snug">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transformation Style */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                  <RefreshCw className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Transformation & Change Style</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { id: "Evolutionary Transition", label: "Evolutionary Transition", desc: "Iterative stabilization without disrupting active operations." },
                    { id: "Clean-Slate Modernization", label: "Clean-Slate Modernization", desc: "Bold systems architectural cutovers and new tech stacks." },
                    { id: "Frontline-Led Kaizen", label: "Frontline-Led Kaizen", desc: "Drives shop-floor empowerment and collaborative buy-in." }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleFormChange("transformationStyle", opt.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        formData.transformationStyle === opt.id
                          ? "bg-teal-50 border-teal-500 text-teal-950 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xs font-bold block">{opt.label}</span>
                      <span className="text-[11px] text-slate-500 font-normal leading-snug">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Assessment Results Visualization (Radar Chart + Top Traits + Persona in Light Theme) */}
            {behavioralResults && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 space-y-8 shadow-xs relative">
                <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 block mb-1">
                      Diagnostic Output
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">
                      6-Axis Executive Capability Radar & Traits
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-teal-900 px-3 py-1 rounded-full bg-teal-50 border border-teal-200">
                    Calibrated to {formData.targetRole || "Executive Roles"}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Radar Chart */}
                  <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200 rounded-2xl p-6 relative">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                      Capability Radar (100 pt Scale)
                    </span>
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={behavioralResults.scores}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 10, fontWeight: 700 }} />
                          <Radar name="Traits" dataKey="A" stroke="#0d9488" fill="#14b8a6" fillOpacity={0.35} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Traits Cards */}
                  <div className="lg:col-span-6 space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                      Core Signature Traits
                    </span>
                    {behavioralResults.topTraits.map((trait, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{trait.title}</span>
                          <span className="text-teal-800 font-black text-xs px-2 py-0.5 rounded bg-teal-100 border border-teal-200">
                            {trait.percentage}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">{trait.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Persona Overview & Recommended Roles */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 block">
                      Executive Persona Overview
                    </span>
                    <div className="text-slate-700 text-xs leading-relaxed">
                      <Markdown components={assessmentMarkdownComponents}>{behavioralResults.overview}</Markdown>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 block">
                      Matched High-Fit Executive Roles
                    </span>
                    <div className="text-slate-700 text-xs leading-relaxed">
                      <Markdown components={assessmentMarkdownComponents}>{behavioralResults.roles}</Markdown>
                    </div>
                  </div>
                </div>

                {/* Transfer to Resume Button */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => switchTab("resume")}
                    className="flex-1 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <FileText className="w-4 h-4 text-white" />
                    <span>Incorporate Behavioral Archetype into Resume Studio</span>
                  </button>

                  <button
                    onClick={() => switchTab("simulator")}
                    className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl font-bold text-sm border border-slate-200 shadow-xs cursor-pointer transition-all"
                  >
                    <span>Back to Pathway Simulator</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
};

export default CareerTool;
