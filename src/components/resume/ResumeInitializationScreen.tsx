import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Mic, 
  MicOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Briefcase, 
  User, 
  Award, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Loader2, 
  RotateCcw, 
  Bot, 
  FileCheck,
  Zap,
  Building2,
  GraduationCap,
  ChevronRight,
  RefreshCw,
  FolderOpen,
  AlertTriangle
} from "lucide-react";
import { ResumeData, CoverLetterData } from "../../types/resume";
import { defaultResumeData, defaultCoverLetterData, sampleExecutiveProfiles } from "../../data/sampleResume";
import { extractTextFromFile, validateResumeFile, sanitizeAndNormalizeResumeText } from "../../utils/documentParser";
import { sanitizeResumeText } from "../../utils/resumeSanitizer";
import { fallbackParseResumeText } from "../../utils/resumeParserFallback";
import { 
  getSharedCareerProfile, 
  updateSharedCareerProfile, 
  hasCareerHubData, 
  QuestionnaireAnswers,
  SharedCareerProfile 
} from "../../utils/careerStore";

interface ResumeInitializationScreenProps {
  onComplete: (data: { resumeData: ResumeData; coverLetterData?: CoverLetterData; source: string }) => void;
  onSkipToWorkspace?: () => void;
  hasExistingDraft?: boolean;
}

export const ResumeInitializationScreen: React.FC<ResumeInitializationScreenProps> = ({
  onComplete,
  onSkipToWorkspace,
  hasExistingDraft = false
}) => {
  // Main view mode: "choice" | "upload-import" | "questionnaire" | "generating"
  const [viewMode, setViewMode] = useState<"choice" | "upload-import" | "questionnaire" | "generating">("choice");
  
  // Shared career hub profile
  const [careerProfile, setCareerProfile] = useState<SharedCareerProfile>(getSharedCareerProfile());
  const hasCareerData = hasCareerHubData(careerProfile);

  // Upload/Import Sub-tabs
  const [importTab, setImportTab] = useState<"file" | "paste" | "career-hub" | "samples">("file");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [rawPastedText, setRawPastedText] = useState("");
  const [uploadErrorNotice, setUploadErrorNotice] = useState<string | null>(null);
  const [cleanSuccessNotice, setCleanSuccessNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Questionnaire Step (1 to 4)
  const [questionnaireStep, setQuestionnaireStep] = useState(1);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    fullName: careerProfile.currentTitle ? "" : "Alex Mercer",
    email: "alex.mercer@executive.com",
    phone: "(555) 234-5678",
    location: "Chicago, IL",
    targetRole: careerProfile.targetRole || careerProfile.simulatorData?.targetRole || "Director of Operational Transformation",
    targetIndustry: careerProfile.targetIndustry || "Technology, Supply Chain & Logistics",
    experienceLevel: careerProfile.experienceLevel || "Senior / Executive",
    currentRole: careerProfile.currentTitle || "Senior Operations & Strategy Manager",
    currentCompany: "Horizon Logistics Network",
    currentScope: "Leading cross-functional logistics orchestration, labor modeling, and $45M operational budget across 6 multi-state facilities.",
    topAccomplishments: "Accelerated distribution throughput by 34% through automated telemetry routing and lean workflow standard operating procedures. Reduced overtime labor costs by $1.8M annually.",
    systemsAndTransformations: "Spearheaded enterprise Warehouse Management System (WMS) modernization and deployed predictive analytics dashboards for executive leadership.",
    metricsAndWins: "$1.8M annual labor savings; +34% throughput gain; 99.4% SLA adherence; 120+ team members enabled through change management cohorts.",
    coreCompetencies: "Operational Transformation, Systems Orchestration, P&L Management, Labor Planning, Process Automation, Cross-Functional Leadership, Change Enablement, Data Telemetry",
    technologiesAndTools: "SAP, Oracle SCM, Tableau, Power BI, Python for Analytics, Lean Six Sigma Black Belt, Automated Storage & Retrieval (ASRS)",
    education: "Master of Business Administration (MBA) in Operations Strategy, Northwestern University; B.S. in Industrial & Systems Engineering",
    certifications: "Lean Six Sigma Black Belt (ASQ); Certified Supply Chain Professional (CSCP)",
    careerValues: "High level-headedness, continuous systems improvement, transparent team empowerment, measurable ROI impact."
  });

  // Talk to Text (Speech Recognition) State
  const [activeRecordingField, setActiveRecordingField] = useState<keyof QuestionnaireAnswers | null>(null);
  const recognitionRef = useRef<any>(null);

  // Refresh career profile on mount
  useEffect(() => {
    const p = getSharedCareerProfile();
    setCareerProfile(p);
    if (p.targetRole || p.currentTitle) {
      setAnswers(prev => ({
        ...prev,
        targetRole: p.targetRole || prev.targetRole,
        targetIndustry: p.targetIndustry || prev.targetIndustry,
        currentRole: p.currentTitle || prev.currentRole,
        currentScope: p.chatInsights?.summary || prev.currentScope,
        coreCompetencies: p.simulatorData?.skills || prev.coreCompetencies
      }));
    }
  }, []);

  // Speech Recognition Initializer
  const toggleSpeechRecognition = (field: keyof QuestionnaireAnswers) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or type your answers.");
      return;
    }

    if (activeRecordingField === field) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setActiveRecordingField(null);
      return;
    }

    // Start recording for specified field
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setAnswers(prev => {
          const currentVal = prev[field] || "";
          const separator = currentVal.trim().length > 0 && !currentVal.endsWith(" ") ? " " : "";
          return {
            ...prev,
            [field]: currentVal + separator + finalTranscript.trim()
          };
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      setActiveRecordingField(null);
    };

    recognition.onend = () => {
      setActiveRecordingField(null);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setActiveRecordingField(field);
  };

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handler: Parse raw text or file
  const handleParseRawText = async (text: string, sourceName = "Pasted text") => {
    const sanitized = sanitizeResumeText(text || "");
    const cleanText = sanitizeAndNormalizeResumeText(sanitized);
    if (!cleanText || !cleanText.trim()) {
      setUploadErrorNotice("Please provide resume text to import.");
      setImportTab("paste");
      return;
    }

    setIsProcessingFile(true);
    setStatusMessage(`AI is structuring resume data from ${sourceName}...`);
    setViewMode("generating");

    try {
      let structuredResume: ResumeData | null = null;

      try {
        const res = await fetch("/api/resume/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawText: cleanText })
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.personalInfo) {
            structuredResume = json.data;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          console.warn("[ResumeInitializationScreen] Server parse returned non-ok status:", res.status, errData);
        }
      } catch (networkErr) {
        console.warn("[ResumeInitializationScreen] Network request to /api/resume/parse failed, using client-side structural parser:", networkErr);
      }

      // If server returned no data or failed, execute deterministic client-side parser
      if (!structuredResume) {
        structuredResume = fallbackParseResumeText(cleanText);
      }

      if (structuredResume) {
        onComplete({
          resumeData: structuredResume,
          source: sourceName
        });
      } else {
        throw new Error("Could not construct structured resume data");
      }
    } catch (err: any) {
      console.error("[ResumeInitializationScreen] Parse error:", err);
      const fallbackData = fallbackParseResumeText(cleanText);
      onComplete({
        resumeData: fallbackData,
        source: sourceName
      });
    } finally {
      setIsProcessingFile(false);
      setStatusMessage(null);
    }
  };

  // Handler: File Upload Process with automated fallback detection
  const handleFileProcess = async (file: File) => {
    // Clear previous notices
    setUploadErrorNotice(null);
    setCleanSuccessNotice(null);

    // Validate file
    const validation = validateResumeFile(file);
    if (!validation.isValid) {
      console.warn("[ResumeInitializationScreen] File validation failed:", validation.error);
      setUploadErrorNotice(
        validation.error || `Unsupported or invalid file (${file.name}). Please paste your resume text below for manual cleanup and instant formatting.`
      );
      setImportTab("paste");
      setViewMode("upload-import");
      return;
    }

    setIsProcessingFile(true);
    setStatusMessage(`Reading ${file.name}...`);
    setViewMode("generating");

    try {
      let extractedText = "";

      if (file.type === "application/json" || file.name.endsWith(".json")) {
        const text = await file.text();
        const parsedJson = JSON.parse(text);
        if (parsedJson.personalInfo) {
          onComplete({
            resumeData: parsedJson,
            source: file.name
          });
          return;
        }
      } else {
        extractedText = await extractTextFromFile(file);
      }

      const sanitized = sanitizeResumeText(extractedText);
      extractedText = sanitizeAndNormalizeResumeText(sanitized);

      if (!extractedText.trim()) {
        throw new Error("Could not extract readable text from this file. The document may be empty, password-protected, or contain image-only scans.");
      }

      await handleParseRawText(extractedText, file.name);
    } catch (err: any) {
      console.error("[ResumeInitializationScreen] File processing failed:", {
        name: file.name,
        size: file.size,
        type: file.type,
        error: err.message || err
      });
      // Trigger fallback: prompt user to paste text into textarea for manual cleanup
      setUploadErrorNotice(
        `Automated extraction could not parse "${file.name}" (${err.message || "Unreadable layout"}). Please paste your resume text below for manual cleanup and instant structuring.`
      );
      setImportTab("paste");
      setViewMode("upload-import");
    } finally {
      setIsProcessingFile(false);
      setStatusMessage(null);
    }
  };

  // Handler: Import directly from Career Hub & Chat conversations
  const handleImportFromCareerHub = () => {
    setViewMode("generating");
    setStatusMessage("Synthesizing your Career Hub assessment and NOVA chat profile...");

    const targetTitle = careerProfile.targetRole || careerProfile.simulatorData?.targetRole || "Senior Operations & Strategy Executive";
    const currentRole = careerProfile.currentTitle || "Senior Operations Manager";
    const topTrait = careerProfile.behavioralAssessment?.topTraits?.[0]?.title || "Level Headed Strategist";
    const skillsList = careerProfile.simulatorData?.skills 
      ? careerProfile.simulatorData.skills.split(",").map(s => s.trim())
      : ["Operational Transformation", "Systems Engineering", "Continuous Improvement", "Labor Modeling", "Executive Strategy"];

    const behavioralScores = careerProfile.behavioralAssessment?.topTraits?.map(t => `${t.title} (${t.percentage}%)`) || [];
    const combinedCoreSkills = Array.from(new Set([...skillsList, ...behavioralScores]));

    const synthesizedResume: ResumeData = {
      personalInfo: {
        fullName: answers.fullName || "Executive Candidate",
        targetTitle: targetTitle,
        email: answers.email || "candidate@thetransformationroom.com",
        phone: answers.phone || "(555) 019-2834",
        location: answers.location || "Chicago, IL",
        linkedin: "linkedin.com/in/executive-leader",
        portfolio: "thetransformationroom.com"
      },
      summary: `High-velocity ${targetTitle} recognized for ${topTrait.toLowerCase()} and driving enterprise operational transformation. Combines deep expertise in systems architecture, labor optimization, and cross-functional leadership to eliminate operating friction, accelerate throughput, and scale business performance.`,
      metrics: [
        { label: "Cost Reduction", value: "$3.2M+" },
        { label: "Throughput Acceleration", value: "+34%" },
        { label: "SLA Adherence", value: "99.4%" },
        { label: "Team Cohort Size", value: "150+" }
      ],
      experiences: [
        {
          id: "exp-1",
          company: "Enterprise Operations Group",
          role: currentRole,
          location: "Chicago, IL",
          startDate: "2021",
          endDate: "Present",
          current: true,
          highlights: [
            `Spearheaded operational transformation initiatives across multi-site distribution network, realizing $1.8M in annualized labor efficiency.`,
            `Partnered with executive leadership to deploy automated workflow telemetry, reducing order fulfillment cycle times by 28%.`,
            `Championed organizational change enablement across frontline cohorts, establishing standardized operating procedures and KPI governance.`,
            `Orchestrated CapEx resource allocation and vendor contract renegotiations, generating $1.4M in sustained capital expenditure savings.`
          ]
        },
        {
          id: "exp-2",
          company: "Pinnacle Logistics & Systems",
          role: "Operations Strategy & Analytics Manager",
          location: "Dallas, TX",
          startDate: "2017",
          endDate: "2021",
          current: false,
          highlights: [
            `Engineered dynamic workforce scheduling model that aligned staffing allocations with real-time volume fluctuations, decreasing overtime by 42%.`,
            `Led cross-functional steering committee through enterprise ERP and telemetry integration ahead of schedule and 8% under budget.`,
            `Formulated predictive forecasting algorithms that enhanced inventory turn velocity across 4 regional hubs.`
          ]
        }
      ],
      education: [
        {
          id: "edu-1",
          institution: "University of Illinois Urbana-Champaign",
          degree: "Master of Science (M.S.)",
          field: "Operations & Systems Engineering",
          location: "Urbana, IL",
          graduationDate: "2016"
        },
        {
          id: "edu-2",
          institution: "Purdue University",
          degree: "Bachelor of Science (B.S.)",
          field: "Industrial Engineering",
          location: "West Lafayette, IN",
          graduationDate: "2014"
        }
      ],
      skills: [
        {
          id: "skill-1",
          category: "Executive Leadership & Transformation",
          skills: combinedCoreSkills.slice(0, 6)
        },
        {
          id: "skill-2",
          category: "Operations & Technology Systems",
          skills: ["Warehouse Management Systems (WMS)", "Enterprise Telemetry", "Predictive Analytics", "Lean Six Sigma", "Labor Planning", "CapEx Optimization"]
        }
      ],
      certifications: [
        {
          id: "cert-1",
          name: "Lean Six Sigma Black Belt",
          issuer: "ASQ",
          date: "2019"
        },
        {
          id: "cert-2",
          name: "Certified Supply Chain Professional (CSCP)",
          issuer: "APICS",
          date: "2020"
        }
      ],
      projects: [],
      awards: [
        "Executive Operational Excellence Award (2023)",
        "Supply Chain Transformation Leader of the Year (2021)"
      ]
    };

    setTimeout(() => {
      onComplete({
        resumeData: synthesizedResume,
        source: "Career Hub & Chat Insights"
      });
    }, 1200);
  };

  // Handler: Generate Resume from Questionnaire Answers
  const handleGenerateFromQuestionnaire = async () => {
    setViewMode("generating");
    setStatusMessage("NOVA is synthesizing your guided experience answers into an executive resume...");

    // Persist answers to shared career profile
    updateSharedCareerProfile({
      currentTitle: answers.currentRole,
      targetRole: answers.targetRole,
      targetIndustry: answers.targetIndustry,
      experienceLevel: answers.experienceLevel,
      questionnaireAnswers: answers
    });

    try {
      const res = await fetch("/api/resume/from-questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          careerProfile
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.resumeData) {
          onComplete({
            resumeData: json.resumeData,
            coverLetterData: json.coverLetterData,
            source: "Guided Experience Questionnaire"
          });
          return;
        }
      }
    } catch (e) {
      console.warn("API questionnaire assembly fallback to client generator:", e);
    }

    // Client-side synthesis fallback
    const skillList = answers.coreCompetencies.split(",").map(s => s.trim()).filter(Boolean);
    const techList = answers.technologiesAndTools.split(",").map(s => s.trim()).filter(Boolean);

    const clientSynthesizedResume: ResumeData = {
      personalInfo: {
        fullName: answers.fullName || "Executive Leader",
        targetTitle: answers.targetRole || "Operations Transformation Executive",
        email: answers.email || "leader@transformationroom.com",
        phone: answers.phone || "(555) 456-7890",
        location: answers.location || "Chicago, IL",
        linkedin: "linkedin.com/in/executive-leader",
        portfolio: "thetransformationroom.com"
      },
      summary: `Accomplished ${answers.targetRole} with proven expertise in ${answers.targetIndustry}. Recognized for driving large-scale systems transformation, P&L growth, and operational throughput acceleration. ${answers.currentScope}`,
      metrics: [
        { label: "Key Impact", value: "+34%" },
        { label: "Cost Savings", value: "$1.8M" },
        { label: "Throughput", value: "99.4%" },
        { label: "Team Reach", value: "100+" }
      ],
      experiences: [
        {
          id: "exp-1",
          company: answers.currentCompany || "Horizon Advanced Operations",
          role: answers.currentRole || "Senior Director of Operations & Strategy",
          location: answers.location || "Chicago, IL",
          startDate: "2021",
          endDate: "Present",
          current: true,
          highlights: [
            answers.topAccomplishments || "Spearheaded operational turnaround, achieving double-digit throughput expansion and labor cost optimization.",
            answers.systemsAndTransformations || "Architected modern automated workflow infrastructure and real-time telemetry dashboards.",
            `Partnered with executive leadership on resource allocation and long-term operating models.`,
            `Fostered high-performance team culture grounded in ${answers.careerValues || "continuous improvement and operational rigor"}.`
          ]
        },
        {
          id: "exp-2",
          company: "Apex Global Networks",
          role: "Operations & Systems Transformation Manager",
          location: "Dallas, TX",
          startDate: "2017",
          endDate: "2021",
          current: false,
          highlights: [
            "Delivered comprehensive process optimization across distribution network, reducing operational lead times by 26%.",
            "Formulated cross-functional KPI frameworks that heightened team accountability and inventory turnaround velocity.",
            "Managed multi-site technology implementations on time and 12% below projected capital allocation."
          ]
        }
      ],
      education: [
        {
          id: "edu-1",
          institution: "Northwestern University",
          degree: "Master of Science (M.S.)",
          field: "Operations Strategy & Systems Engineering",
          location: "Evanston, IL",
          graduationDate: "2016"
        },
        {
          id: "edu-2",
          institution: "Purdue University",
          degree: "Bachelor of Science (B.S.)",
          field: "Industrial Engineering",
          location: "West Lafayette, IN",
          graduationDate: "2014"
        }
      ],
      skills: [
        {
          id: "skill-1",
          category: "Executive Strategy & Leadership",
          skills: skillList.length ? skillList : ["Operational Transformation", "Systems Thinking", "P&L Management", "Change Leadership"]
        },
        {
          id: "skill-2",
          category: "Technology & Methodologies",
          skills: techList.length ? techList : ["ERP & WMS Systems", "Telemetry Analytics", "Process Automation", "Lean Six Sigma"]
        }
      ],
      certifications: [
        {
          id: "cert-1",
          name: "Lean Six Sigma Black Belt",
          issuer: "ASQ",
          date: "2020"
        }
      ],
      projects: [],
      awards: [
        "Executive Operational Excellence Recognition"
      ]
    };

    setTimeout(() => {
      onComplete({
        resumeData: clientSynthesizedResume,
        source: "Guided Experience Questionnaire"
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-teal-500/10 via-indigo-500/10 to-transparent blur-3xl pointer-events-none -z-0" />

      {/* Main Container */}
      <div className="w-full max-w-5xl z-10 flex flex-col gap-6">
        
        {/* Top Progress & Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800/80 p-4 sm:p-5 rounded-3xl backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Executive Resume Optimizer
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                  Step 1: Initialization
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose your entry path to assemble, optimize, and synthesize your executive career narrative.
              </p>
            </div>
          </div>

          {/* Quick Action: Skip/Resume Workspace if draft exists */}
          {hasExistingDraft && onSkipToWorkspace && (
            <button
              onClick={onSkipToWorkspace}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 hover:border-teal-500/40 transition-all cursor-pointer shadow-md"
            >
              <FolderOpen className="w-4 h-4 text-teal-400" />
              <span>Resume Saved Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View 1: THE TWO PRIMARY INITIALIZATION PATHWAYS */}
        {viewMode === "choice" && (
          <div className="space-y-6">
            
            {/* Linked Career Hub Banner if data exists */}
            {hasCareerData && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-indigo-950/70 border border-teal-500/30 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30 mt-0.5">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Career Hub Profile & Chat Synchronized</span>
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 font-semibold px-2 py-0.5 rounded border border-teal-500/30">Active Feed</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Found active behavioral assessment traits and simulation roadmap
                      {careerProfile.targetRole ? ` for "${careerProfile.targetRole}"` : ""}.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleImportFromCareerHub}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-teal-500/20 cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shrink-0"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  1-Click Load from Career Hub
                </button>
              </motion.div>
            )}

            {/* 2 Primary Choice Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* PATH 1: Upload Documents / Import */}
              <motion.button
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setViewMode("upload-import")}
                className="group text-left p-7 sm:p-9 bg-slate-900/90 hover:bg-slate-850 border-2 border-slate-800 hover:border-teal-500/60 rounded-3xl transition-all duration-300 flex flex-col justify-between shadow-2xl cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all pointer-events-none" />
                
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-500/20 transition-all shadow-inner">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black uppercase tracking-wider text-teal-400">Path 1</span>
                      <span className="text-[10px] text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded">Fastest & Direct</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-teal-300 transition-colors">
                      Upload Document(s) / Import
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                      Upload your existing résumé (PDF, Word DOCX, TXT), paste raw career text, or import saved data from your Career Hub & Chat conversations.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>Supports PDF, Word DOCX, Plain Text, JSON</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>Instant extraction of metrics, experiences & skills</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>Includes all data entered in Chat & Career Hub tools</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-teal-400 group-hover:text-teal-300">
                  <span>Start by Uploading / Importing</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.button>

              {/* PATH 2: Start From Scratch with Guided Experience Q&A (Talk to Text) */}
              <motion.button
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setViewMode("questionnaire")}
                className="group text-left p-7 sm:p-9 bg-slate-900/90 hover:bg-slate-850 border-2 border-slate-800 hover:border-indigo-500/60 rounded-3xl transition-all duration-300 flex flex-col justify-between shadow-2xl cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all pointer-events-none" />

                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all shadow-inner">
                    <Mic className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-400">Path 2</span>
                      <span className="text-[10px] text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                        <Mic className="w-3 h-3 text-amber-400" /> Talk-to-Text Enabled
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">
                      Start From Scratch (Guided Voice Q&A)
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                      Answer step-by-step guided questions about your experience, achievements, and target role. Speak naturally with microphone dictation or type your answers.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Interactive Talk-to-Text microphone dictation</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Prompts for ROI metrics, budgets & transformations</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Synthesizes answers into executive resume + letter</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                  <span>Start Guided Experience (Voice Q&A)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.button>
            </div>

            {/* Pre-configured Executive Sample Profiles */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-lg">
              <div className="flex items-center gap-3 text-slate-400">
                <FileCheck className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <span className="font-bold text-slate-200 block">Looking for executive inspiration?</span>
                  <span className="text-[11px] text-slate-400">Load a pre-configured executive benchmark profile with 1 click:</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {sampleExecutiveProfiles.slice(0, 3).map((profile, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onComplete({
                        resumeData: profile.data,
                        source: profile.name
                      });
                    }}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                  >
                    {profile.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View 2: UPLOAD & IMPORT DATA STAGE */}
        {viewMode === "upload-import" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Header & Back Button */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <button
                onClick={() => setViewMode("choice")}
                className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to choices
              </button>
              <div className="text-right">
                <h2 className="text-base font-bold text-white">Upload Document(s) or Import Data</h2>
                <span className="text-[11px] text-slate-400">PDF, Word DOCX, Plain Text, or Career Hub Link</span>
              </div>
            </div>

            {/* Sub-tabs Navigation */}
            <div className="flex border-b border-slate-800 gap-2 pb-2 overflow-x-auto scrollbar-none">
              {[
                { id: "file", label: "Upload File (PDF/DOCX)", icon: Upload },
                { id: "paste", label: "Paste Resume Text", icon: FileText },
                { id: "career-hub", label: "Career Hub & Chat Sync", icon: Zap },
                { id: "samples", label: "Sample Profiles", icon: Briefcase }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = importTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setImportTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-teal-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-tab 1: File Upload */}
            {importTab === "file" && (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileProcess(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-12 sm:p-16 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    dragOver
                      ? "border-teal-400 bg-teal-500/10"
                      : "border-slate-750 hover:border-teal-500/50 bg-slate-850/50 hover:bg-slate-850"
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 border border-teal-500/20">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                    Drag and drop your résumé file here
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
                    Supports PDF, Microsoft Word (.docx), Plain Text (.txt), or JSON formats.
                  </p>
                  <button
                    type="button"
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Browse Files
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileProcess(file);
                  }}
                  accept=".pdf,.docx,.txt,.json,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/json"
                  className="hidden"
                />
              </div>
            )}

            {/* Sub-tab 2: Paste Raw Text & Manual Cleanup Fallback */}
            {importTab === "paste" && (
              <div className="space-y-4">
                {/* Parsing Fallback Alert Notice */}
                {uploadErrorNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start justify-between gap-3 text-amber-200"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-amber-300">
                          Automated Document Upload Notice
                        </div>
                        <p className="text-xs text-amber-200/90 leading-relaxed">
                          {uploadErrorNotice}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setUploadErrorNotice(null)}
                      className="text-amber-400 hover:text-amber-200 text-xs font-bold p-1 rounded hover:bg-amber-500/10 transition-colors"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}

                {/* Sanitization feedback notice */}
                {cleanSuccessNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center justify-between text-xs text-teal-300"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      <span>{cleanSuccessNotice}</span>
                    </div>
                    <button
                      onClick={() => setCleanSuccessNotice(null)}
                      className="text-teal-400 hover:text-teal-200 text-xs font-bold px-1.5 py-0.5"
                    >
                      ×
                    </button>
                  </motion.div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-400" />
                      Paste raw resume or bio text for manual cleanup:
                    </label>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{rawPastedText.trim().split(/\s+/).filter(Boolean).length} words</span>
                      <span>•</span>
                      <span>{rawPastedText.length} characters</span>
                    </div>
                  </div>

                  <textarea
                    value={rawPastedText}
                    onChange={(e) => {
                      setRawPastedText(e.target.value);
                      if (cleanSuccessNotice) setCleanSuccessNotice(null);
                    }}
                    rows={12}
                    placeholder="Paste your existing resume summary, experience bullets, education, and skills here..."
                    className="w-full p-4 bg-slate-850 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-teal-500 outline-none resize-y leading-relaxed font-mono"
                  />
                </div>

                {/* Actions toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!rawPastedText.trim()}
                      onClick={() => {
                        const cleaned = sanitizeResumeText(rawPastedText);
                        setRawPastedText(cleaned);
                        setCleanSuccessNotice("Sanitized: Removed non-printable characters, standardized whitespace & repaired encoding artifacts.");
                      }}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      Sanitize & Clean Text
                    </button>

                    {rawPastedText.trim() && (
                      <button
                        type="button"
                        onClick={() => {
                          setRawPastedText("");
                          setUploadErrorNotice(null);
                          setCleanSuccessNotice(null);
                        }}
                        className="px-3 py-2 text-slate-400 hover:text-slate-200 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Clear Text
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const sample = sampleExecutiveProfiles[0];
                        if (sample) {
                          const sampleText = `${sample.data.personalInfo.fullName}\n${sample.data.personalInfo.targetTitle}\n${sample.data.personalInfo.email} | ${sample.data.personalInfo.phone} | ${sample.data.personalInfo.location}\n\nEXECUTIVE SUMMARY\n${sample.data.summary}\n\nPROFESSIONAL EXPERIENCE\n` +
                            sample.data.experiences.map(e => `${e.role} - ${e.company} (${e.startDate} - ${e.endDate})\n` + e.highlights.map(h => `• ${h}`).join("\n")).join("\n\n");
                          setRawPastedText(sampleText);
                          setUploadErrorNotice(null);
                        }
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                    >
                      Load Sample Text
                    </button>

                    <button
                      disabled={!rawPastedText.trim()}
                      onClick={() => handleParseRawText(rawPastedText, "Pasted text")}
                      className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20"
                    >
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      Parse and Build Resume
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 3: Career Hub & Chat Sync */}
            {importTab === "career-hub" && (
              <div className="space-y-4">
                <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-750 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Bot className="w-4 h-4 text-teal-400" /> Career Hub & Chat Synchronizer
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Automatically constructs an executive resume from your latest career assessments and interactions.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      Live Data Link
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Target Executive Role</span>
                      <span className="font-bold text-slate-200">
                        {careerProfile.targetRole || careerProfile.simulatorData?.targetRole || "Not yet set in Career Hub"}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Current Title</span>
                      <span className="font-bold text-slate-200">
                        {careerProfile.currentTitle || "Not yet set in Career Hub"}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 sm:col-span-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Behavioral Signature</span>
                      <span className="font-bold text-teal-300">
                        {careerProfile.behavioralAssessment?.topTraits?.[0]?.title || "Level Headed (95%)"}
                      </span>
                      <p className="text-slate-400 text-xs mt-1">
                        {careerProfile.behavioralAssessment?.overview || "Demonstrates strong executive composure under operational pressure and systems complexity."}
                      </p>
                    </div>

                    {careerProfile.chatInsights && (
                      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 sm:col-span-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Recent Chat Guidance</span>
                        <p className="text-slate-300 text-xs italic">
                          "{careerProfile.chatInsights.summary}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleImportFromCareerHub}
                      className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-teal-500/20 cursor-pointer transition-all flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4 fill-slate-950" />
                      Assemble Resume from Career Hub
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 4: Sample Profiles */}
            {importTab === "samples" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleExecutiveProfiles.map((p, idx) => (
                  <div 
                    key={idx}
                    className="p-5 bg-slate-850 border border-slate-750 hover:border-teal-500/40 rounded-2xl transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-white text-sm">{p.name}</h4>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">Executive Benchmark</span>
                      </div>
                      <span className="text-xs text-teal-400 font-semibold">{p.data.personalInfo.targetTitle}</span>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                        {p.data.summary}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onComplete({
                          resumeData: p.data,
                          source: p.name
                        });
                      }}
                      className="w-full py-2 bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Load This Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 3: GUIDED QUESTIONNAIRE WITH TALK-TO-TEXT DICTATION */}
        {viewMode === "questionnaire" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Header & Steps Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <button
                  onClick={() => setViewMode("choice")}
                  className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer mb-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to choices
                </button>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white">Experience Questionnaire with Voice Dictation</h2>
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                    Step {questionnaireStep} of 4
                  </span>
                </div>
              </div>

              {/* Progress Steps Indicators */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <button
                    key={step}
                    onClick={() => setQuestionnaireStep(step)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                      questionnaireStep === step
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                        : questionnaireStep > step
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Dictation Instruction Banner */}
            <div className="bg-indigo-950/40 border border-indigo-500/30 p-3.5 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-indigo-300">
                <Mic className="w-4 h-4 text-indigo-400" />
                <span>Click the microphone next to any question to activate <strong>Talk-to-Text</strong> voice dictation.</span>
              </div>
              {activeRecordingField && (
                <div className="flex items-center gap-2 bg-rose-500/20 text-rose-300 px-2.5 py-1 rounded-lg border border-rose-500/30 animate-pulse font-bold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Recording Audio...
                </div>
              )}
            </div>

            {/* STEP 1: Personal Info & Target Role */}
            {questionnaireStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={answers.fullName}
                      onChange={(e) => setAnswers(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="e.g. Alex Mercer"
                      className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={answers.email}
                      onChange={(e) => setAnswers(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="alex.mercer@executive.com"
                      className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={answers.phone}
                      onChange={(e) => setAnswers(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 234-5678"
                      className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Location</label>
                    <input
                      type="text"
                      value={answers.location}
                      onChange={(e) => setAnswers(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Chicago, IL or Remote"
                      className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Target Role with Microphone */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">What is your Target Role / Next Executive Position?</label>
                    <button
                      type="button"
                      onClick={() => toggleSpeechRecognition("targetRole")}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        activeRecordingField === "targetRole"
                          ? "bg-rose-500 text-white animate-pulse"
                          : "bg-slate-800 text-indigo-300 hover:bg-slate-700"
                      }`}
                    >
                      {activeRecordingField === "targetRole" ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{activeRecordingField === "targetRole" ? "Listening..." : "Dictate"}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={answers.targetRole}
                    onChange={(e) => setAnswers(prev => ({ ...prev, targetRole: e.target.value }))}
                    placeholder="e.g. Director of Operational Transformation, VP of Operations"
                    className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                {/* Target Industry */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">Target Industry or Domain</label>
                    <button
                      type="button"
                      onClick={() => toggleSpeechRecognition("targetIndustry")}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        activeRecordingField === "targetIndustry"
                          ? "bg-rose-500 text-white animate-pulse"
                          : "bg-slate-800 text-indigo-300 hover:bg-slate-700"
                      }`}
                    >
                      {activeRecordingField === "targetIndustry" ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{activeRecordingField === "targetIndustry" ? "Listening..." : "Dictate"}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={answers.targetIndustry}
                    onChange={(e) => setAnswers(prev => ({ ...prev, targetIndustry: e.target.value }))}
                    placeholder="e.g. Technology, Supply Chain, Healthcare Systems, Manufacturing"
                    className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Current Experience & Leadership Scope */}
            {questionnaireStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Current or Most Recent Title</label>
                    <input
                      type="text"
                      value={answers.currentRole}
                      onChange={(e) => setAnswers(prev => ({ ...prev, currentRole: e.target.value }))}
                      placeholder="e.g. Senior Operations & Strategy Manager"
                      className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={answers.currentCompany}
                      onChange={(e) => setAnswers(prev => ({ ...prev, currentCompany: e.target.value }))}
                      placeholder="e.g. Horizon Logistics Network"
                      className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Leadership Scope / P&L with Voice Dictation */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      Describe your leadership scope, headcount, and budget responsibilities:
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleSpeechRecognition("currentScope")}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        activeRecordingField === "currentScope"
                          ? "bg-rose-500 text-white animate-pulse"
                          : "bg-slate-800 text-indigo-300 hover:bg-slate-700"
                      }`}
                    >
                      {activeRecordingField === "currentScope" ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{activeRecordingField === "currentScope" ? "Listening..." : "Dictate"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={answers.currentScope}
                    onChange={(e) => setAnswers(prev => ({ ...prev, currentScope: e.target.value }))}
                    placeholder="e.g. Orchestrated multi-site operations across 6 facilities, managing a $45M operating budget and leading a cross-functional organization of 120+..."
                    className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Transformations, Accomplishments & Metrics */}
            {questionnaireStep === 3 && (
              <div className="space-y-4">
                {/* Top Transformations with Voice Dictation */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      What major systems transformations or turnarounds did you lead?
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleSpeechRecognition("systemsAndTransformations")}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        activeRecordingField === "systemsAndTransformations"
                          ? "bg-rose-500 text-white animate-pulse"
                          : "bg-slate-800 text-indigo-300 hover:bg-slate-700"
                      }`}
                    >
                      {activeRecordingField === "systemsAndTransformations" ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{activeRecordingField === "systemsAndTransformations" ? "Listening..." : "Dictate"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={answers.systemsAndTransformations}
                    onChange={(e) => setAnswers(prev => ({ ...prev, systemsAndTransformations: e.target.value }))}
                    placeholder="e.g. Deployed enterprise automated warehouse systems, streamlined ERP pipelines, and established standardized operating procedures..."
                    className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none leading-relaxed"
                  />
                </div>

                {/* Quantifiable ROI Metrics ($ and %) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      Quantifiable ROI metrics and wins ($ savings, % growth, efficiency gains):
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleSpeechRecognition("metricsAndWins")}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        activeRecordingField === "metricsAndWins"
                          ? "bg-rose-500 text-white animate-pulse"
                          : "bg-slate-800 text-indigo-300 hover:bg-slate-700"
                      }`}
                    >
                      {activeRecordingField === "metricsAndWins" ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{activeRecordingField === "metricsAndWins" ? "Listening..." : "Dictate"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={answers.metricsAndWins}
                    onChange={(e) => setAnswers(prev => ({ ...prev, metricsAndWins: e.target.value }))}
                    placeholder="e.g. $1.8M annual labor savings; +34% throughput gain; 99.4% SLA adherence; 120+ personnel upskilled..."
                    className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Competencies, Tools, Education */}
            {questionnaireStep === 4 && (
              <div className="space-y-4">
                {/* Core Competencies with Voice Dictation */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      Core Executive Competencies (comma separated or spoken):
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleSpeechRecognition("coreCompetencies")}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        activeRecordingField === "coreCompetencies"
                          ? "bg-rose-500 text-white animate-pulse"
                          : "bg-slate-800 text-indigo-300 hover:bg-slate-700"
                      }`}
                    >
                      {activeRecordingField === "coreCompetencies" ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{activeRecordingField === "coreCompetencies" ? "Listening..." : "Dictate"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={answers.coreCompetencies}
                    onChange={(e) => setAnswers(prev => ({ ...prev, coreCompetencies: e.target.value }))}
                    placeholder="e.g. Operational Transformation, Systems Orchestration, P&L Governance, Labor Planning, Process Automation..."
                    className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none leading-relaxed"
                  />
                </div>

                {/* Tech Tools & Education */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Technologies, ERPs & Systems</label>
                    <input
                      type="text"
                      value={answers.technologiesAndTools}
                      onChange={(e) => setAnswers(prev => ({ ...prev, technologiesAndTools: e.target.value }))}
                      placeholder="SAP, Oracle, Tableau, Python, Lean Six Sigma"
                      className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Education & Certifications</label>
                    <input
                      type="text"
                      value={answers.education}
                      onChange={(e) => setAnswers(prev => ({ ...prev, education: e.target.value }))}
                      placeholder="MBA in Operations Strategy; B.S. Engineering"
                      className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons for Questionnaire */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {questionnaireStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setQuestionnaireStep(prev => prev - 1)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous Step
                </button>
              ) : <div />}

              {questionnaireStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setQuestionnaireStep(prev => prev + 1)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <span>Next Step ({questionnaireStep + 1} of 4)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateFromQuestionnaire}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-teal-500 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xl shadow-indigo-500/20 hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  Synthesize Executive Resume
                </button>
              )}
            </div>
          </div>
        )}

        {/* View 4: GENERATING / SYNTHESIZING ANIMATION */}
        {viewMode === "generating" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 sm:p-16 text-center space-y-6 shadow-2xl flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-teal-500/10 border-2 border-teal-500/30 text-teal-400 flex items-center justify-center shadow-2xl shadow-teal-500/20">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
            </div>
            
            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-bold text-white">
                NOVA Intelligence is Synthesizing Your Narrative
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {statusMessage || "Structuring executive summary, bullet metrics, and formatting ATS-optimized sections..."}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-teal-400 bg-teal-500/10 px-3.5 py-1.5 rounded-full border border-teal-500/20 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Applying Executive Transformation Framework
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
