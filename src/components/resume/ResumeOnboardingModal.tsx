import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
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
  GraduationCap
} from "lucide-react";
import { ResumeData, CoverLetterData } from "../../types/resume";
import { defaultResumeData, defaultCoverLetterData, sampleExecutiveProfiles } from "../../data/sampleResume";
import { extractTextFromFile } from "../../utils/documentParser";
import { fallbackParseResumeText } from "../../utils/resumeParserFallback";
import { 
  getSharedCareerProfile, 
  updateSharedCareerProfile, 
  hasCareerHubData, 
  QuestionnaireAnswers 
} from "../../utils/careerStore";

interface ResumeOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { resumeData: ResumeData; coverLetterData?: CoverLetterData; source: string }) => void;
}

export const ResumeOnboardingModal: React.FC<ResumeOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  // Main view mode: "choice" | "upload-import" | "questionnaire" | "generating"
  const [viewMode, setViewMode] = useState<"choice" | "upload-import" | "questionnaire" | "generating">("choice");
  
  // Shared career hub profile
  const [careerProfile, setCareerProfile] = useState(getSharedCareerProfile());
  const hasCareerData = hasCareerHubData(careerProfile);

  // Upload/Import State
  const [importTab, setImportTab] = useState<"file" | "paste" | "career-hub" | "samples">("file");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [rawPastedText, setRawPastedText] = useState("");
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

  // Refresh career profile on mount or when modal opens
  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  // Handler: Parse raw text or file
  const handleParseRawText = async (text: string, sourceName = "Pasted text") => {
    if (!text || !text.trim()) {
      alert("Please provide resume text to import.");
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
          body: JSON.stringify({ rawText: text })
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.personalInfo) {
            structuredResume = json.data;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          console.warn("Server parse returned non-ok status:", errData);
        }
      } catch (networkErr) {
        console.warn("Network request to /api/resume/parse failed, using client-side structural parser:", networkErr);
      }

      // If server returned no data or failed, execute deterministic client-side parser
      if (!structuredResume) {
        structuredResume = fallbackParseResumeText(text);
      }

      if (structuredResume) {
        onComplete({
          resumeData: structuredResume,
          source: sourceName
        });
        onClose();
      } else {
        throw new Error("Could not construct structured resume data");
      }
    } catch (err: any) {
      console.error("Parse error:", err);
      // Final safety net: extract via fallback and complete
      const fallbackData = fallbackParseResumeText(text);
      onComplete({
        resumeData: fallbackData,
        source: sourceName
      });
      onClose();
    } finally {
      setIsProcessingFile(false);
      setStatusMessage(null);
    }
  };

  // Handler: File Upload Process
  const handleFileProcess = async (file: File) => {
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
          onClose();
          return;
        }
      } else {
        extractedText = await extractTextFromFile(file);
      }

      if (!extractedText.trim()) {
        throw new Error("No readable text could be extracted from this document.");
      }

      await handleParseRawText(extractedText, file.name);
    } catch (err: any) {
      console.error("File processing error:", err);
      alert(`Could not process file: ${err.message || "Please try pasting text instead."}`);
      setViewMode("upload-import");
    } finally {
      setIsProcessingFile(false);
      setStatusMessage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handler: 1-Click Import from Career Hub & Chat History
  const handleImportFromCareerHub = () => {
    setViewMode("generating");
    setStatusMessage("Synthesizing Career Hub assessment results, simulation roadmap & chat insights...");

    // Build synthesized resume data from Career Hub profile
    const targetTitle = careerProfile.targetRole || careerProfile.simulatorData?.targetRole || "Director of Operational Transformation";
    const currentRole = careerProfile.currentTitle || "Senior Operations Manager";
    const topTrait = careerProfile.behavioralAssessment?.topTraits?.[0]?.title || "Strategic Systems Leader";
    
    const skillsList = careerProfile.simulatorData?.skills 
      ? careerProfile.simulatorData.skills.split(",").map(s => s.trim())
      : ["Operational Transformation", "Systems Thinking", "P&L Management", "Predictive Telemetry", "Change Management", "Continuous Improvement"];

    const behavioralScores = careerProfile.behavioralAssessment?.scores?.map(s => s.subject) || [];
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
      onClose();
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
          onClose();
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
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white">
                  {viewMode === "choice" && "How would you like to start your resume?"}
                  {viewMode === "upload-import" && "Upload Document or Import Data"}
                  {viewMode === "questionnaire" && "Guided Experience Questionnaire with Voice Dictation"}
                  {viewMode === "generating" && "Synthesizing Your Executive Narrative"}
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                  NOVA Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {viewMode === "choice" && "Select your preferred method to build or optimize your executive resume."}
                {viewMode === "upload-import" && "Upload files, paste text, or sync with your Career Hub profile."}
                {viewMode === "questionnaire" && `Step ${questionnaireStep} of 4 • Speak or type your answers`}
                {viewMode === "generating" && (statusMessage || "Please wait while AI constructs your resume...")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {viewMode !== "choice" && viewMode !== "generating" && (
              <button
                onClick={() => setViewMode("choice")}
                className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to choices
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {/* VIEW 1: TWO PRIMARY CHOICES */}
          {viewMode === "choice" && (
            <div className="space-y-6">
              {/* Linked Career Hub Banner if data exists */}
              {hasCareerData && (
                <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-indigo-950/60 border border-teal-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30 mt-0.5">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-teal-300">Career Hub Profile Active</span>
                        <span className="text-[10px] bg-teal-500/20 text-teal-300 font-semibold px-2 py-0.2 rounded">Synchronized</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Found saved profile data from Career Hub & NOVA Chat 
                        {careerProfile.targetRole ? ` for target role: "${careerProfile.targetRole}"` : ""}.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleImportFromCareerHub}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    1-Click Load from Career Hub
                  </button>
                </div>
              )}

              {/* 2 Primary Choice Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* OPTION 1: Upload Documents / Import */}
                <button
                  onClick={() => setViewMode("upload-import")}
                  className="group text-left p-6 sm:p-8 bg-slate-850 hover:bg-slate-800/80 border-2 border-slate-750 hover:border-teal-500/50 rounded-3xl transition-all duration-300 flex flex-col justify-between shadow-xl cursor-pointer hover:shadow-teal-500/10"
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-500/20 transition-all">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black uppercase tracking-wider text-teal-400">Option 1</span>
                        <span className="text-[10px] text-slate-400 font-normal">Fastest</span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                        Upload Document(s) / Import
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mt-2">
                        Upload your existing résumé (PDF, Word DOCX, TXT), paste raw text, or import saved data from your Career Hub & Chat conversations.
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Supports PDF, DOCX, TXT, JSON</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Instant extraction of roles, metrics & skills</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Syncs with Career Hub behavioral data</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between text-xs font-bold text-teal-400 group-hover:text-teal-300">
                    <span>Choose Upload / Import</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* OPTION 2: Start From Scratch with Guided Questionnaire (Talk to Text) */}
                <button
                  onClick={() => setViewMode("questionnaire")}
                  className="group text-left p-6 sm:p-8 bg-slate-850 hover:bg-slate-800/80 border-2 border-slate-750 hover:border-indigo-500/50 rounded-3xl transition-all duration-300 flex flex-col justify-between shadow-xl cursor-pointer hover:shadow-indigo-500/10"
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                      <Mic className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black uppercase tracking-wider text-indigo-400">Option 2</span>
                        <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded font-semibold">Talk-to-Text Enabled</span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                        Start From Scratch (Guided Voice Q&A)
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mt-2">
                        Answer simple guided questions about your experience, achievements, and target role. Speak naturally with built-in voice dictation or type your answers.
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Interactive Talk-to-Text microphone dictation</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Guided prompts for systems transformations</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Synthesizes answers into executive resume</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                    <span>Start Guided Experience</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>

              {/* Sample Profiles Quick Bar */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <FileCheck className="w-4 h-4 text-teal-400" />
                  <span>Or start from pre-configured executive profiles:</span>
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
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                    >
                      {profile.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: UPLOAD / IMPORT TABBED VIEW */}
          {viewMode === "upload-import" && (
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-slate-800 gap-2 pb-2">
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
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

              {/* Sub-tab: File Upload */}
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
                    className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      dragOver
                        ? "border-teal-400 bg-teal-500/10"
                        : "border-slate-750 hover:border-teal-500/50 bg-slate-850/50 hover:bg-slate-850"
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 border border-teal-500/20">
                      <Upload className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">
                      Drag and drop your résumé file here
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mb-4">
                      Supports PDF, Microsoft Word (.docx), Plain Text (.txt), or JSON formats.
                    </p>
                    <button
                      type="button"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold transition-colors"
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

              {/* Sub-tab: Paste Text */}
              {importTab === "paste" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">
                      Paste full résumé or portfolio text:
                    </label>
                    <textarea
                      value={rawPastedText}
                      onChange={(e) => setRawPastedText(e.target.value)}
                      rows={10}
                      placeholder="Paste your existing resume summary, experience bullets, education, and skills here..."
                      className="w-full p-4 bg-slate-850 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-teal-500 outline-none resize-y leading-relaxed font-mono"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      disabled={!rawPastedText.trim()}
                      onClick={() => handleParseRawText(rawPastedText, "Pasted text")}
                      className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      Parse & Import
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-tab: Career Hub & Chat Sync */}
              {importTab === "career-hub" && (
                <div className="space-y-4">
                  <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-750 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Bot className="w-4 h-4 text-teal-400" /> Career Hub & Chat Synchronizer
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Automatically constructs an executive resume from your latest career assessments and interactions.
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                        Live Data Link
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Target Executive Role</span>
                        <span className="font-semibold text-slate-200">
                          {careerProfile.targetRole || careerProfile.simulatorData?.targetRole || "Not yet set in Career Hub"}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Current Title</span>
                        <span className="font-semibold text-slate-200">
                          {careerProfile.currentTitle || "Not yet set in Career Hub"}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Behavioral Signature</span>
                        <span className="font-semibold text-teal-300">
                          {careerProfile.behavioralAssessment?.topTraits?.[0]?.title 
                            ? `${careerProfile.behavioralAssessment.topTraits[0].title} (${careerProfile.behavioralAssessment.topTraits[0].percentage}% Match)`
                            : "Assessment not yet taken"}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Path Simulation Status</span>
                        <span className="font-semibold text-indigo-300">
                          {careerProfile.simulatorData?.roadmap?.length 
                            ? `${careerProfile.simulatorData.roadmap.length} Milestones Available`
                            : "Simulation not yet run"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleImportFromCareerHub}
                      className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Assemble Resume from Career Hub Data
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-tab: Sample Profiles */}
              {importTab === "samples" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sampleExecutiveProfiles.map((sample, idx) => (
                    <div key={idx} className="p-4 bg-slate-850 border border-slate-750 rounded-2xl flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-sm text-white">{sample.name}</h4>
                        <p className="text-xs text-teal-400">{sample.data.personalInfo.targetTitle}</p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{sample.data.summary}</p>
                      </div>
                      <button
                        onClick={() => {
                          onComplete({
                            resumeData: sample.data,
                            source: sample.name
                          });
                          onClose();
                        }}
                        className="w-full py-2 bg-slate-800 hover:bg-teal-600 hover:text-white text-teal-300 font-bold text-xs rounded-xl border border-teal-500/20 transition-all cursor-pointer"
                      >
                        Load This Profile
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: GUIDED QUESTIONNAIRE WITH TALK TO TEXT */}
          {viewMode === "questionnaire" && (
            <div className="space-y-6">
              {/* Stepper Header */}
              <div className="flex items-center justify-between bg-slate-850 p-4 rounded-2xl border border-slate-750">
                {[
                  { step: 1, label: "Identity & Target Role", icon: User },
                  { step: 2, label: "Current Scope & Leadership", icon: Building2 },
                  { step: 3, label: "Transformations & Metrics", icon: TrendingUp },
                  { step: 4, label: "Skills, Tools & Education", icon: Layers }
                ].map((s) => {
                  const Icon = s.icon;
                  const isCurrent = questionnaireStep === s.step;
                  const isDone = questionnaireStep > s.step;
                  return (
                    <button
                      key={s.step}
                      onClick={() => setQuestionnaireStep(s.step)}
                      className={`flex items-center gap-2 cursor-pointer ${
                        isCurrent
                          ? "text-indigo-400 font-bold"
                          : isDone
                          ? "text-teal-400"
                          : "text-slate-500"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300"
                          : isDone
                          ? "bg-teal-500/20 border border-teal-500/40 text-teal-300"
                          : "bg-slate-800 text-slate-500"
                      }`}>
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.step}
                      </div>
                      <span className="text-xs hidden md:inline">{s.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Questionnaire Step 1 */}
              {questionnaireStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-2xl flex items-center justify-between text-xs text-indigo-300">
                    <span className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-indigo-400" />
                      Tip: Click the microphone icon next to any box to dictate your answers via voice!
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-300">Full Name</label>
                        <button
                          type="button"
                          onClick={() => toggleSpeechRecognition("fullName")}
                          className={`p-1 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                            activeRecordingField === "fullName" ? "bg-rose-500 text-white animate-pulse" : "text-slate-400 hover:text-white"
                          }`}
                          title="Talk to text for name"
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{activeRecordingField === "fullName" ? "Listening..." : "Dictate"}</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={answers.fullName}
                        onChange={(e) => setAnswers({ ...answers, fullName: e.target.value })}
                        placeholder="e.g. Alex Mercer"
                        className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-300">Target Executive Title</label>
                        <button
                          type="button"
                          onClick={() => toggleSpeechRecognition("targetRole")}
                          className={`p-1 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                            activeRecordingField === "targetRole" ? "bg-rose-500 text-white animate-pulse" : "text-slate-400 hover:text-white"
                          }`}
                          title="Talk to text for target role"
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{activeRecordingField === "targetRole" ? "Listening..." : "Dictate"}</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={answers.targetRole}
                        onChange={(e) => setAnswers({ ...answers, targetRole: e.target.value })}
                        placeholder="e.g. VP of Operational Transformation"
                        className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none font-semibold text-indigo-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={answers.email}
                        onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                        placeholder="e.g. alex.mercer@executive.com"
                        className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Location (City, State / Remote)</label>
                      <input
                        type="text"
                        value={answers.location}
                        onChange={(e) => setAnswers({ ...answers, location: e.target.value })}
                        placeholder="e.g. Chicago, IL or Remote"
                        className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-300">Target Industry / Domain Focus</label>
                        <button
                          type="button"
                          onClick={() => toggleSpeechRecognition("targetIndustry")}
                          className={`p-1 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                            activeRecordingField === "targetIndustry" ? "bg-rose-500 text-white animate-pulse" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{activeRecordingField === "targetIndustry" ? "Listening..." : "Dictate"}</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={answers.targetIndustry}
                        onChange={(e) => setAnswers({ ...answers, targetIndustry: e.target.value })}
                        placeholder="e.g. Supply Chain, Advanced Manufacturing, SaaS & Robotics"
                        className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Questionnaire Step 2 */}
              {questionnaireStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-300">Current or Most Recent Company</label>
                        <button
                          type="button"
                          onClick={() => toggleSpeechRecognition("currentCompany")}
                          className={`p-1 rounded-lg text-xs flex items-center gap-1 cursor-pointer ${
                            activeRecordingField === "currentCompany" ? "bg-rose-500 text-white animate-pulse" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{activeRecordingField === "currentCompany" ? "Listening..." : "Dictate"}</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={answers.currentCompany}
                        onChange={(e) => setAnswers({ ...answers, currentCompany: e.target.value })}
                        placeholder="e.g. Horizon Logistics Network"
                        className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-300">Current or Latest Role Title</label>
                        <button
                          type="button"
                          onClick={() => toggleSpeechRecognition("currentRole")}
                          className={`p-1 rounded-lg text-xs flex items-center gap-1 cursor-pointer ${
                            activeRecordingField === "currentRole" ? "bg-rose-500 text-white animate-pulse" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{activeRecordingField === "currentRole" ? "Listening..." : "Dictate"}</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={answers.currentRole}
                        onChange={(e) => setAnswers({ ...answers, currentRole: e.target.value })}
                        placeholder="e.g. Senior Director of Operations & Strategy"
                        className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-300">
                        Scope of Leadership (Team size, budget, operational reach):
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleSpeechRecognition("currentScope")}
                        className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                          activeRecordingField === "currentScope" ? "bg-rose-500 text-white animate-pulse" : "bg-slate-800 text-indigo-300 hover:bg-slate-700"
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>{activeRecordingField === "currentScope" ? "Recording Voice (Click to stop)" : "Voice Dictate"}</span>
                      </button>
                    </div>
                    <textarea
                      value={answers.currentScope}
                      onChange={(e) => setAnswers({ ...answers, currentScope: e.target.value })}
                      rows={4}
                      placeholder="Describe your current management scope, multi-site responsibilities, P&L or budget oversight, and leadership direct reports..."
                      className="w-full p-3.5 bg-slate-850 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none resize-y leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Questionnaire Step 3 */}
              {questionnaireStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-300">
                        Top Operational Breakthroughs & Accomplishments (Action + Result):
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleSpeechRecognition("topAccomplishments")}
                        className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                          activeRecordingField === "topAccomplishments" ? "bg-rose-500 text-white animate-pulse" : "bg-slate-800 text-indigo-300 hover:bg-slate-700"
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>{activeRecordingField === "topAccomplishments" ? "Recording Voice..." : "Voice Dictate"}</span>
                      </button>
                    </div>
                    <textarea
                      value={answers.topAccomplishments}
                      onChange={(e) => setAnswers({ ...answers, topAccomplishments: e.target.value })}
                      rows={3}
                      placeholder="e.g. Accelerated throughput by 34% through automated telemetry and lean workflow SOPs. Reduced overtime labor costs by $1.8M..."
                      className="w-full p-3.5 bg-slate-850 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none resize-y leading-relaxed"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-300">
                        Systems, Technology & Modernization Initiatives:
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleSpeechRecognition("systemsAndTransformations")}
                        className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                          activeRecordingField === "systemsAndTransformations" ? "bg-rose-500 text-white animate-pulse" : "bg-slate-800 text-indigo-300 hover:bg-slate-700"
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>{activeRecordingField === "systemsAndTransformations" ? "Recording Voice..." : "Voice Dictate"}</span>
                      </button>
                    </div>
                    <textarea
                      value={answers.systemsAndTransformations}
                      onChange={(e) => setAnswers({ ...answers, systemsAndTransformations: e.target.value })}
                      rows={3}
                      placeholder="e.g. Led enterprise WMS/ERP modernization, automated dispatching algorithms, telemetry dashboards, change management cohorts..."
                      className="w-full p-3.5 bg-slate-850 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none resize-y leading-relaxed"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-300">
                        Standout Metrics (ROI, % improvements, throughput numbers):
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleSpeechRecognition("metricsAndWins")}
                        className={`p-1 rounded-lg text-xs flex items-center gap-1 cursor-pointer ${
                          activeRecordingField === "metricsAndWins" ? "bg-rose-500 text-white animate-pulse" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{activeRecordingField === "metricsAndWins" ? "Listening..." : "Dictate"}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={answers.metricsAndWins}
                      onChange={(e) => setAnswers({ ...answers, metricsAndWins: e.target.value })}
                      placeholder="e.g. $1.8M savings; +34% throughput; 99.4% SLA adherence; 120+ team members"
                      className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Questionnaire Step 4 */}
              {questionnaireStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-300">
                        Core Competencies & Strategic Skills:
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleSpeechRecognition("coreCompetencies")}
                        className={`p-1 rounded-lg text-xs flex items-center gap-1 cursor-pointer ${
                          activeRecordingField === "coreCompetencies" ? "bg-rose-500 text-white animate-pulse" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{activeRecordingField === "coreCompetencies" ? "Listening..." : "Dictate"}</span>
                      </button>
                    </div>
                    <textarea
                      value={answers.coreCompetencies}
                      onChange={(e) => setAnswers({ ...answers, coreCompetencies: e.target.value })}
                      rows={2}
                      placeholder="e.g. Operational Transformation, Systems Orchestration, P&L Management, Labor Modeling, Process Automation, Cross-Functional Leadership"
                      className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-300">
                        Technology, Systems & Analytical Tools:
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleSpeechRecognition("technologiesAndTools")}
                        className={`p-1 rounded-lg text-xs flex items-center gap-1 cursor-pointer ${
                          activeRecordingField === "technologiesAndTools" ? "bg-rose-500 text-white animate-pulse" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{activeRecordingField === "technologiesAndTools" ? "Listening..." : "Dictate"}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={answers.technologiesAndTools}
                      onChange={(e) => setAnswers({ ...answers, technologiesAndTools: e.target.value })}
                      placeholder="e.g. SAP, Tableau, Power BI, Python, Lean Six Sigma Black Belt, ASRS robotics"
                      className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Education & Degrees</label>
                      <input
                        type="text"
                        value={answers.education}
                        onChange={(e) => setAnswers({ ...answers, education: e.target.value })}
                        placeholder="e.g. MBA in Operations Strategy; B.S. in Engineering"
                        className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Certifications & Credentials</label>
                      <input
                        type="text"
                        value={answers.certifications}
                        onChange={(e) => setAnswers({ ...answers, certifications: e.target.value })}
                        placeholder="e.g. Lean Six Sigma Black Belt; CSCP"
                        className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Stepper Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {questionnaireStep > 1 ? (
                  <button
                    onClick={() => setQuestionnaireStep(questionnaireStep - 1)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Previous Step
                  </button>
                ) : (
                  <div />
                )}

                {questionnaireStep < 4 ? (
                  <button
                    onClick={() => setQuestionnaireStep(questionnaireStep + 1)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    Next Step <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateFromQuestionnaire}
                    className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-lg shadow-teal-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4" />
                    Assemble Executive Resume
                  </button>
                )}
              </div>
            </div>
          )}

          {/* VIEW 4: GENERATING SPINNER */}
          {viewMode === "generating" && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 animate-spin">
                <Loader2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">
                {statusMessage || "NOVA Cognitive Engine Active..."}
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                Structuring executive summary, action-driven experience bullets, metric highlights, and ATS keyword densities.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
