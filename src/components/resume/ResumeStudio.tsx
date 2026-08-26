import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Sparkles, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Upload, 
  RefreshCcw, 
  Layers, 
  Palette, 
  Type, 
  Maximize2, 
  Sliders, 
  ShieldCheck, 
  MessageSquare, 
  ChevronRight, 
  Loader2, 
  ArrowLeft,
  X,
  FileCheck,
  Zap,
  Briefcase,
  Save,
  HardDrive,
  CheckCircle2,
  Cloud,
  RotateCcw
} from "lucide-react";
import { 
  ResumeData, 
  CoverLetterData, 
  ResumeTemplateId, 
  ColorTheme, 
  TypographyChoice, 
  AtsScorecard 
} from "../../types/resume";
import { defaultResumeData, defaultCoverLetterData } from "../../data/sampleResume";
import { extractTextFromFile, validateResumeFile, sanitizeAndNormalizeResumeText } from "../../utils/documentParser";
import { sanitizeResumeText } from "../../utils/resumeSanitizer";
import { fallbackParseResumeText } from "../../utils/resumeParserFallback";
import { ResumePreview } from "./ResumePreview";
import { CoverLetterPreview } from "./CoverLetterPreview";
import { ResumeEditor } from "./ResumeEditor";
import { CoverLetterEditor } from "./CoverLetterEditor";
import { AtsScorecardModal } from "./AtsScorecardModal";
import { ResumeScoreModal } from "./ResumeScoreModal";
import { BulletEnhancerModal } from "./BulletEnhancerModal";
import { TemplateSwitcherModal } from "./TemplateSwitcherModal";
import { AiImportModal } from "./AiImportModal";
import { PdfExportModal, ExportOptions } from "./PdfExportModal";
import { AiSuggestionsDrawer } from "./AiSuggestionsDrawer";
import { ResumeOnboardingModal } from "./ResumeOnboardingModal";
import { ResumeInitializationScreen } from "./ResumeInitializationScreen";
import { calculateResumeScore } from "../../utils/resumeScoreEngine";
import { 
  getSharedCareerProfile, 
  subscribeToCareerProfile, 
  hasCareerHubData, 
  CareerProfile 
} from "../../utils/careerStore";

interface ResumeStudioProps {
  onBackToAssessment?: () => void;
  initialResumeText?: string;
}

export const ResumeStudio: React.FC<ResumeStudioProps> = ({
  onBackToAssessment,
  initialResumeText
}) => {
  // State
  const [activeTab, setActiveTab] = useState<"resume" | "cover-letter" | "ats">("resume");
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(defaultCoverLetterData);
  
  // Studio Flow Mode: "init" (Step 1 Initialization & Choice) | "workspace" (Step 2 Studio Editor & Preview)
  const [studioMode, setStudioMode] = useState<"init" | "workspace">("init");
  
  // Customization styling state
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateId>("transformation-teal");
  const [selectedColor, setSelectedColor] = useState<ColorTheme>("teal");
  const [selectedTypography, setSelectedTypography] = useState<TypographyChoice>("modern");
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"split" | "editor-only" | "preview-only">("split");

  // AI & Parsing State
  const [isParsing, setIsParsing] = useState(false);
  const [isEnhancingResume, setIsEnhancingResume] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [isEnhancingBullet, setIsEnhancingBullet] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Feature Modals & Drawers State
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isAiImportModalOpen, setIsAiImportModalOpen] = useState(false);
  const [isPdfExportModalOpen, setIsPdfExportModalOpen] = useState(false);
  const [isAiSuggestionsDrawerOpen, setIsAiSuggestionsDrawerOpen] = useState(false);
  const [aiDrawerInitialTab, setAiDrawerInitialTab] = useState<"optimizer" | "career-hub" | "summaries" | "bullets" | "jd-match" | "verbs">("optimizer");

  // Shared Career Hub profile state
  const [careerProfile, setCareerProfile] = useState<CareerProfile>(getSharedCareerProfile());
  const hasCareerData = hasCareerHubData(careerProfile);

  // Dynamic Live Resume Score & Industry Keyword Diagnostics
  const liveScoreAnalysis = useMemo(() => {
    return calculateResumeScore(resumeData);
  }, [resumeData]);

  // Subscribe to live Career Hub updates
  useEffect(() => {
    const unsubscribe = subscribeToCareerProfile((newProfile) => {
      setCareerProfile(newProfile);
    });
    return () => unsubscribe();
  }, []);

  // ATS Scorecard state
  const [atsScorecard, setAtsScorecard] = useState<AtsScorecard | null>({
    overallScore: 88,
    impactScore: 92,
    clarityScore: 89,
    atsReadabilityScore: 95,
    keywordScore: 84,
    strengths: [
      "High concentration of active leadership verbs (Spearheaded, Orchestrated, Renegotiated)",
      "Strong quantifiable metrics in operational throughput and cost reductions",
      "Clear chronological progression with explicit systems engineering alignment"
    ],
    improvements: [
      "Incorporate additional enterprise cloud & automation telemetry keywords",
      "Explicitly mention change enablement percentages across team cohorts",
      "Highlight executive steering committee presentation experience"
    ],
    suggestedKeywords: [
      "Autonomous Mobile Robots (AMR)",
      "Automated Storage & Retrieval (ASRS)",
      "Predictive Telemetry",
      "SLA Governance",
      "CapEx Optimization",
      "Lean Six Sigma",
      "Human-in-the-Loop AI"
    ]
  });
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);

  // Storage key for auto-saving resume and cover letter drafts
  const AUTOSAVE_STORAGE_KEY = "ttr_resume_studio_autosave_v2";

  // Auto-save state
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [autoSaveToast, setAutoSaveToast] = useState<{
    show: boolean;
    message: string;
    timestamp?: string;
    type?: "save" | "restore" | "reset";
  } | null>(null);

  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger dedicated Auto-Save Toast
  const triggerAutoSaveToast = (message: string, timestamp?: string, type: "save" | "restore" | "reset" = "save") => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setAutoSaveToast({ show: true, message, timestamp, type });
    toastTimeoutRef.current = setTimeout(() => {
      setAutoSaveToast(null);
    }, 3800);
  };

  // Immediate Save Executor
  const executeSave = (isAuto = true) => {
    try {
      setSaveStatus("saving");
      const payload = {
        version: 2,
        updatedAt: new Date().toISOString(),
        resumeData,
        coverLetterData,
        selectedTemplate,
        selectedColor,
        selectedTypography,
        isCompact,
        atsScorecard
      };
      localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(payload));
      const now = new Date();
      setLastSaved(now);
      setSaveStatus("saved");

      const timeFormatted = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
      const msg = isAuto 
        ? "Progress auto-saved to browser storage"
        : "Changes saved to browser storage";

      triggerAutoSaveToast(msg, timeFormatted, "save");
    } catch (err) {
      console.error("Auto-save failed:", err);
      setSaveStatus("idle");
    }
  };

  // Restore saved draft from browser storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.resumeData) setResumeData(parsed.resumeData);
        if (parsed.coverLetterData) setCoverLetterData(parsed.coverLetterData);
        if (parsed.selectedTemplate) setSelectedTemplate(parsed.selectedTemplate);
        if (parsed.selectedColor) setSelectedColor(parsed.selectedColor);
        if (parsed.selectedTypography) setSelectedTypography(parsed.selectedTypography);
        if (typeof parsed.isCompact === "boolean") setIsCompact(parsed.isCompact);
        if (parsed.atsScorecard) setAtsScorecard(parsed.atsScorecard);
        if (parsed.updatedAt) {
          const savedDate = new Date(parsed.updatedAt);
          setLastSaved(savedDate);
          const timeFormatted = savedDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
          triggerAutoSaveToast("Restored saved draft from browser storage", timeFormatted, "restore");
        }
      }
    } catch (e) {
      console.warn("Failed to load saved draft from browser storage:", e);
    }
  }, []);

  // Debounced Auto-Save trigger on changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus("saving");
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      executeSave(true);
    }, 1600);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [resumeData, coverLetterData, selectedTemplate, selectedColor, selectedTypography, isCompact, atsScorecard]);

  // Keyboard shortcut: Ctrl+S / Cmd+S manual save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        executeSave(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resumeData, coverLetterData, selectedTemplate, selectedColor, selectedTypography, isCompact, atsScorecard]);

  // Reset draft to initial sample defaults
  const handleResetDraft = () => {
    if (window.confirm("Are you sure you want to reset the resume to default executive data? This will clear your saved draft in browser storage.")) {
      localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
      setResumeData(defaultResumeData);
      setCoverLetterData(defaultCoverLetterData);
      setSelectedTemplate("transformation-teal");
      setSelectedColor("teal");
      setSelectedTypography("modern");
      setIsCompact(false);
      setLastSaved(null);
      setSaveStatus("idle");
      triggerAutoSaveToast("Reset to default executive template", undefined, "reset");
    }
  };

  // Bullet Enhancer Modal State
  const [bulletModalOpen, setBulletModalOpen] = useState(false);
  const [activeBulletText, setActiveBulletText] = useState("");
  const [activeBulletTarget, setActiveBulletTarget] = useState<{ expId: string; bulletIdx: number } | null>(null);
  const [bulletVariations, setBulletVariations] = useState<{
    metricFocused?: string;
    leadershipFocused?: string;
    transformationFocused?: string;
  } | null>(null);

  // Cover Letter AI helpers
  const [coverLetterAltOpenings, setCoverLetterAltOpenings] = useState<string[]>([]);
  const [coverLetterTalkingPoints, setCoverLetterTalkingPoints] = useState<string[]>([]);

  // AI Optimize Drawer state
  const [isOptimizeModalOpen, setIsOptimizeModalOpen] = useState(false);
  const [targetRoleInput, setTargetRoleInput] = useState(resumeData.personalInfo.targetTitle || "Director of Supply Chain & Operations Transformation");
  const [targetIndustryInput, setTargetIndustryInput] = useState("Supply Chain, Technology & Robotics");
  const [targetGapInput, setTargetGapInput] = useState("Scaling from functional manager to enterprise systems transformation executive");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File parsing handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateResumeFile(file);
    if (!validation.isValid) {
      console.warn("[ResumeStudio] File validation failed:", validation.error);
      alert(validation.error || "Invalid file selected.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsParsing(true);
    setStatusMessage("Extracting and sanitizing document text...");

    let rawText = "";
    try {
      rawText = await extractTextFromFile(file);
      const sanitized = sanitizeResumeText(rawText);
      rawText = sanitizeAndNormalizeResumeText(sanitized);

      if (!rawText.trim()) {
        throw new Error("Could not extract readable text from the document. The file may be empty, image-only, or encrypted.");
      }

      setStatusMessage("AI is parsing and structuring your career data...");

      let parsedData: ResumeData | null = null;

      try {
        const res = await fetch("/api/resume/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawText })
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.personalInfo) {
            parsedData = json.data;
          }
        } else {
          console.warn("[ResumeStudio] Server parse endpoint returned non-OK status:", res.status);
        }
      } catch (networkErr: any) {
        console.warn("[ResumeStudio] Server AI parsing failed, activating deterministic fallback:", networkErr?.message || networkErr);
      }

      // If server AI parsing was unavailable or incomplete, use fallback parser
      if (!parsedData) {
        console.log("[ResumeStudio] Applying deterministic heuristic parser to sanitized resume text...");
        parsedData = fallbackParseResumeText(rawText);
      }

      if (parsedData) {
        setResumeData(parsedData);
        // Also update cover letter sender info
        if (parsedData.personalInfo) {
          setCoverLetterData((prev) => ({
            ...prev,
            sender: {
              fullName: parsedData!.personalInfo.fullName || prev.sender.fullName,
              title: parsedData!.personalInfo.targetTitle || prev.sender.title,
              email: parsedData!.personalInfo.email || prev.sender.email,
              phone: parsedData!.personalInfo.phone || prev.sender.phone,
              location: parsedData!.personalInfo.location || prev.sender.location,
            },
            targetRole: parsedData!.personalInfo.targetTitle || prev.targetRole
          }));
        }
        setStatusMessage("Resume successfully parsed and populated!");
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err: any) {
      console.error("[ResumeStudio] Resume file processing error:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        errorMessage: err.message || err
      });

      // Attempt emergency fallback with whatever raw text was extracted
      if (rawText && rawText.trim().length > 10) {
        try {
          console.log("[ResumeStudio] Attempting emergency text recovery...");
          const emergencyData = fallbackParseResumeText(rawText);
          setResumeData(emergencyData);
          setStatusMessage("Resume parsed using local intelligent extractor.");
          setTimeout(() => setStatusMessage(null), 4000);
          return;
        } catch (recoveryErr) {
          console.error("[ResumeStudio] Emergency recovery also failed:", recoveryErr);
        }
      }

      // Open the AI Import modal in text manual cleanup mode
      setIsAiImportModalOpen(true);
      setStatusMessage("Opening manual text cleaner...");
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Full AI Enhancement & Refresh
  const handleEnhanceResume = async () => {
    setIsEnhancingResume(true);
    setStatusMessage("Transforming resume with executive action metrics and ATS optimization...");

    try {
      const res = await fetch("/api/resume/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          targetRole: targetRoleInput,
          targetIndustry: targetIndustryInput,
          biggestGap: targetGapInput
        })
      });

      if (!res.ok) throw new Error("Resume enhancement request failed");

      const result = await res.json();
      if (result.enhancedResume) {
        setResumeData(result.enhancedResume);
      }
      if (result.atsScorecard) {
        setAtsScorecard(result.atsScorecard);
      }
      setIsOptimizeModalOpen(false);
      setStatusMessage("Resume successfully enhanced with high-impact metrics!");
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error("Enhancement error:", err);
      alert(`Enhancement error: ${err.message || "Failed to complete AI optimization"}`);
      setStatusMessage(null);
    } finally {
      setIsEnhancingResume(false);
    }
  };

  // Single Bullet point AI Polisher
  const handleTriggerEnhanceBullet = async (bullet: string, expId: string, bulletIdx: number) => {
    setActiveBulletText(bullet);
    setActiveBulletTarget({ expId, bulletIdx });
    setBulletVariations(null);
    setBulletModalOpen(true);
    setIsEnhancingBullet(true);

    try {
      const res = await fetch("/api/resume/enhance-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullet,
          targetRole: resumeData.personalInfo.targetTitle
        })
      });

      if (!res.ok) throw new Error("Bullet enhancement failed");
      const result = await res.json();
      setBulletVariations(result.variations);
    } catch (err: any) {
      console.error("Bullet polish error:", err);
      setBulletVariations({
        metricFocused: `Accelerated operational throughput by 32% while reducing annual operating expenditures by $1.2M through systematic process optimization.`,
        leadershipFocused: `Spearheaded cross-functional team alignment across frontline staff and leadership to successfully execute multi-site operational transformation.`,
        transformationFocused: `Architected and deployed modern automated workflow systems, establishing scalable standard operating procedures and real-time telemetry.`
      });
    } finally {
      setIsEnhancingBullet(false);
    }
  };

  const handleApplyBulletVariation = (text: string) => {
    if (!activeBulletTarget) return;
    const { expId, bulletIdx } = activeBulletTarget;
    
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        const newHighlights = [...exp.highlights];
        newHighlights[bulletIdx] = text;
        return { ...exp, highlights: newHighlights };
      })
    }));

    setBulletModalOpen(false);
    setActiveBulletTarget(null);
  };

  // Cover letter generation handler
  const handleGenerateCoverLetter = async (options: {
    companyName: string;
    hiringManager: string;
    targetRole: string;
    tone: string;
    jobDescription: string;
  }) => {
    setIsGeneratingCoverLetter(true);
    setStatusMessage("Synthesizing tailored executive cover letter...");

    try {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          ...options
        })
      });

      if (!res.ok) throw new Error("Failed to generate cover letter");
      const result = await res.json();

      if (result.coverLetter) {
        setCoverLetterData(result.coverLetter);
      }
      if (result.alternativeOpenings) {
        setCoverLetterAltOpenings(result.alternativeOpenings);
      }
      if (result.talkingPoints) {
        setCoverLetterTalkingPoints(result.talkingPoints);
      }

      setStatusMessage("Cover letter successfully generated!");
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error("Cover letter generation error:", err);
      alert(`Cover letter generation error: ${err.message || "Failed to generate"}`);
      setStatusMessage(null);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  // PDF Export with Full Options
  const handleDownloadPdf = async (options?: ExportOptions) => {
    const elementId = activeTab === "cover-letter" ? "cover-letter-printable-area" : "resume-printable-area";
    const element = document.getElementById(elementId);
    if (!element) {
      alert("Printable document element not found.");
      return;
    }

    setIsDownloadingPdf(true);
    setStatusMessage("Generating crisp, print-ready PDF...");

    try {
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;
      const fileName = activeTab === "cover-letter" 
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Cover_Letter.pdf`
        : `${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Executive_Resume.pdf`;

      const marginValue = options?.margins === "compact" ? 0.25 : options?.margins === "relaxed" ? 0.5 : 0.35;
      const formatValue = options?.paperSize === "a4" ? "a4" : "letter";
      const scaleValue = options?.scaleFactor || 2.5;

      const opt = {
        margin: [marginValue, marginValue] as [number, number],
        filename: fileName,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: scaleValue,
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: { unit: 'in', format: formatValue, orientation: 'portrait' as const }
      };

      await html2pdf().from(element).set(opt).save();
      setStatusMessage("PDF download initiated successfully!");
      setIsPdfExportModalOpen(false);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. You can also use the Print button to save as PDF.");
      setStatusMessage(null);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Handle successful AI Import
  const handleImportSuccess = (data: ResumeData, message?: string) => {
    setResumeData(data);
    if (data.personalInfo) {
      setCoverLetterData((prev) => ({
        ...prev,
        sender: {
          fullName: data.personalInfo.fullName || prev.sender.fullName,
          title: data.personalInfo.targetTitle || prev.sender.title,
          email: data.personalInfo.email || prev.sender.email,
          phone: data.personalInfo.phone || prev.sender.phone,
          location: data.personalInfo.location || prev.sender.location,
        },
        targetRole: data.personalInfo.targetTitle || prev.targetRole
      }));
    }
    setStatusMessage(message || "Resume data successfully imported!");
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Copy Plain Text / Markdown Handler
  const handleCopyText = () => {
    let content = "";
    if (activeTab === "cover-letter") {
      content = `${coverLetterData.sender.fullName}\n${coverLetterData.sender.email} | ${coverLetterData.sender.phone}\n\n${coverLetterData.date}\n\n${coverLetterData.recipient.hiringManagerName}\n${coverLetterData.recipient.companyName}\n\n${coverLetterData.salutation}\n\n${coverLetterData.openingParagraph}\n\n${coverLetterData.bodyParagraphs.join("\n\n")}\n\n${coverLetterData.closingParagraph}\n\n${coverLetterData.signoff}\n${coverLetterData.sender.fullName}`;
    } else {
      content = `# ${resumeData.personalInfo.fullName}\n${resumeData.personalInfo.targetTitle}\n${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}\n\n## EXECUTIVE SUMMARY\n${resumeData.summary}\n\n## EXPERIENCE\n${resumeData.experiences.map(e => `### ${e.role} - ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate})\n${e.highlights.map(h => `- ${h}`).join('\n')}`).join('\n\n')}\n\n## EDUCATION\n${resumeData.education.map(e => `- ${e.degree} in ${e.field}, ${e.institution} (${e.graduationDate})`).join('\n')}\n\n## SKILLS\n${resumeData.skills.map(s => `**${s.category}**: ${s.skills.join(', ')}`).join('\n')}`;
    }

    navigator.clipboard.writeText(content);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const templatesList: { id: ResumeTemplateId; name: string; desc: string }[] = [
    { id: "transformation-teal", name: "Transformation Teal", desc: "Signature executive layout with metric callouts" },
    { id: "executive-onyx", name: "Executive Onyx", desc: "High-contrast boardroom banner with classic serif" },
    { id: "minimalist-studio", name: "Minimalist Studio", desc: "Clean Swiss ATS-optimized standard" },
    { id: "technical-velocity", name: "Technical Velocity", desc: "Two-column density for engineering & systems" },
    { id: "modern-split", name: "Modern Split", desc: "Contemporary header with crisp lines" }
  ];

  const colorsList: { id: ColorTheme; label: string; bgClass: string }[] = [
    { id: "teal", label: "Transformation Teal", bgClass: "bg-teal-600" },
    { id: "slate", label: "Boardroom Onyx", bgClass: "bg-slate-900" },
    { id: "navy", label: "Enterprise Navy", bgClass: "bg-blue-900" },
    { id: "cobalt", label: "Modern Cobalt", bgClass: "bg-blue-600" },
    { id: "emerald", label: "Growth Emerald", bgClass: "bg-emerald-700" },
    { id: "forest", label: "Alpine Forest", bgClass: "bg-emerald-900" },
    { id: "plum", label: "Royal Plum", bgClass: "bg-purple-900" },
    { id: "burgundy", label: "Classic Burgundy", bgClass: "bg-rose-900" },
    { id: "rose", label: "Rosewood", bgClass: "bg-rose-700" },
    { id: "copper", label: "Warm Copper", bgClass: "bg-orange-700" },
    { id: "bronze", label: "Executive Bronze", bgClass: "bg-amber-800" },
    { id: "indigo", label: "Midnight Indigo", bgClass: "bg-indigo-700" }
  ];

  const typographyList: { id: TypographyChoice; label: string; sample: string }[] = [
    { id: "modern", label: "Modern Sans", sample: "Clean & High Velocity" },
    { id: "executive", label: "Executive Serif", sample: "Authoritative & Classic" },
    { id: "editorial", label: "Editorial Serif", sample: "Sophisticated & Polished" },
    { id: "tech", label: "Tech Mono", sample: "Systems & Data Driven" }
  ];

  // Refresh Template: Cycle through templates based on current style
  const handleRefreshTemplate = () => {
    const currentIndex = templatesList.findIndex(t => t.id === selectedTemplate);
    const nextIndex = (currentIndex + 1) % templatesList.length;
    const nextTemplate = templatesList[nextIndex];
    setSelectedTemplate(nextTemplate.id);
    setStatusMessage(`Refreshed template to "${nextTemplate.name}"`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // AI Change Style: Intelligently recommend & apply layout, colors, and typography
  const handleAiChangeStyle = () => {
    const title = (resumeData.personalInfo.targetTitle || "").toLowerCase();
    let suggestedTemplate: ResumeTemplateId = "executive-onyx";
    let suggestedColor: ColorTheme = "teal";
    let suggestedTypography: TypographyChoice = "executive";

    if (title.includes("tech") || title.includes("engineer") || title.includes("systems") || title.includes("developer")) {
      suggestedTemplate = "technical-velocity";
      suggestedColor = "cobalt";
      suggestedTypography = "tech";
    } else if (title.includes("operations") || title.includes("transform") || title.includes("director") || title.includes("vp")) {
      suggestedTemplate = "transformation-teal";
      suggestedColor = "teal";
      suggestedTypography = "modern";
    } else if (title.includes("chief") || title.includes("executive") || title.includes("c-suite") || title.includes("general manager")) {
      suggestedTemplate = "executive-onyx";
      suggestedColor = "slate";
      suggestedTypography = "executive";
    } else if (title.includes("creative") || title.includes("brand") || title.includes("marketing")) {
      suggestedTemplate = "modern-split";
      suggestedColor = "burgundy";
      suggestedTypography = "editorial";
    } else {
      const styles: { template: ResumeTemplateId; color: ColorTheme; typo: TypographyChoice }[] = [
        { template: "transformation-teal", color: "emerald", typo: "modern" },
        { template: "executive-onyx", color: "burgundy", typo: "executive" },
        { template: "modern-split", color: "copper", typo: "editorial" },
        { template: "technical-velocity", color: "navy", typo: "tech" },
        { template: "minimalist-studio", color: "forest", typo: "modern" }
      ];
      const currentMatchIndex = styles.findIndex(s => s.template === selectedTemplate);
      const next = styles[(currentMatchIndex + 1) % styles.length];
      suggestedTemplate = next.template;
      suggestedColor = next.color;
      suggestedTypography = next.typo;
    }

    setSelectedTemplate(suggestedTemplate);
    setSelectedColor(suggestedColor);
    setSelectedTypography(suggestedTypography);
    
    const tplName = templatesList.find(t => t.id === suggestedTemplate)?.name || suggestedTemplate;
    const colName = colorsList.find(c => c.id === suggestedColor)?.label || suggestedColor;
    setStatusMessage(`AI applied style: ${tplName} (${colName})`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleInitializationComplete = ({ 
    resumeData: newResume, 
    coverLetterData: newCoverLetter, 
    source 
  }: { 
    resumeData: ResumeData; 
    coverLetterData?: CoverLetterData; 
    source: string 
  }) => {
    setResumeData(newResume);
    if (newCoverLetter) {
      setCoverLetterData(newCoverLetter);
    } else if (newResume.personalInfo) {
      setCoverLetterData(prev => ({
        ...prev,
        sender: {
          fullName: newResume.personalInfo.fullName || prev.sender.fullName,
          title: newResume.personalInfo.targetTitle || prev.sender.title,
          email: newResume.personalInfo.email || prev.sender.email,
          phone: newResume.personalInfo.phone || prev.sender.phone,
          location: newResume.personalInfo.location || prev.sender.location,
        },
        targetRole: newResume.personalInfo.targetTitle || prev.targetRole
      }));
    }
    setStudioMode("workspace");
    setStatusMessage(`Resume successfully loaded from ${source}!`);
    triggerAutoSaveToast(`Loaded resume from ${source}`, undefined, "save");
  };

  // Dedicated Step 1: Initialization Flow (Upload/Import or Scratch Voice Q&A)
  if (studioMode === "init") {
    return (
      <ResumeInitializationScreen
        onComplete={handleInitializationComplete}
        onSkipToWorkspace={() => setStudioMode("workspace")}
        hasExistingDraft={Boolean(lastSaved || (typeof window !== "undefined" && localStorage.getItem(AUTOSAVE_STORAGE_KEY)))}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="bg-slate-950 border-b border-slate-800/80 sticky top-0 z-40 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Branding & Back Navigation */}
        <div className="flex items-center gap-4">
          {onBackToAssessment && (
            <button
              onClick={onBackToAssessment}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Career Assessment
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Sparkles className="w-4 h-4 text-brand-secondary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                Executive Resume & Cover Letter Studio
                <span className="text-[10px] bg-brand-secondary/20 text-brand-secondary px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  AI Powered
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">The Transformation Room Career Architect</p>
            </div>
          </div>
        </div>

        {/* Center: Document Tabs */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("resume")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "resume"
                ? "bg-brand-primary text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Resume Builder
          </button>
          <button
            onClick={() => setActiveTab("cover-letter")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "cover-letter"
                ? "bg-brand-primary text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Cover Letter
          </button>
          <button
            onClick={() => {
              setActiveTab("ats");
              setIsAtsModalOpen(true);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "ats"
                ? "bg-teal-600 text-white shadow"
                : "text-slate-400 hover:text-teal-400"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Resume Score ({liveScoreAnalysis.overallScore}%)</span>
            <span className="px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded text-[10px] font-mono font-bold">
              {liveScoreAnalysis.grade}
            </span>
          </button>
        </div>

        {/* Right: Actions (Resume Score, Auto-save, Step 1, Simplified AI Assistant, Dark Mode, Print/Copy, Export PDF on far right) */}
        <div className="flex items-center gap-2">
          {/* Quick Resume Score & Keyword Diagnostic Trigger */}
          <button
            onClick={() => setIsAtsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white rounded-xl text-xs font-bold border border-teal-500/40 transition-all cursor-pointer shadow-sm group"
            title="View Resume Score, Industry Keyword Benchmarks, and 1-Click Optimization Suggestions"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
            <span>Score: {liveScoreAnalysis.overallScore}%</span>
            {liveScoreAnalysis.weakVerbsFound.length > 0 ? (
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" title={`${liveScoreAnalysis.weakVerbsFound.length} passive phrases detected`} />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>

          {/* Auto-Save Status Pill & Manual Save Button */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-xl text-xs shadow-inner">
            <button
              onClick={() => executeSave(false)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer group px-1 py-0.5"
              title="Progress is automatically saved to browser storage. Click or press Ctrl+S / Cmd+S to save now."
            >
              {saveStatus === "saving" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
              ) : (
                <div className="relative flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
                </div>
              )}
              <span className="text-[11px] font-semibold text-slate-300 group-hover:text-teal-300">
                {saveStatus === "saving" ? "Saving..." : "Auto-saved"}
              </span>
              {lastSaved && (
                <span className="text-[10px] text-slate-500 font-mono hidden xl:inline">
                  {lastSaved.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </span>
              )}
            </button>

            <button
              onClick={handleResetDraft}
              className="p-1 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded transition-colors cursor-pointer"
              title="Reset draft to sample defaults and clear browser storage"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Primary Step 1: Start Guided Flow (Upload/Import or Scratch with Voice Dictation) */}
          <button
            onClick={() => setStudioMode("init")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-all cursor-pointer"
            title="Return to Step 1: Upload/Import documents or build from scratch with guided Talk-to-Text questions"
          >
            <FileCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Step 1 Flow</span>
          </button>

          {/* Career Hub Live Sync Badge / Trigger */}
          {hasCareerData && (
            <button
              onClick={() => {
                setAiDrawerInitialTab("career-hub");
                setIsAiSuggestionsDrawerOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 rounded-xl text-xs font-bold border border-teal-500/30 transition-all cursor-pointer"
              title="Career Hub data linked. Click to view aligned traits, simulation roadmap, and chat insights."
            >
              <Zap className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span className="hidden xl:inline">Hub Synced</span>
            </button>
          )}

          {/* Single Consolidated Suggestions & Optimizer Button */}
          <button
            onClick={() => {
              setAiDrawerInitialTab("optimizer");
              setIsAiSuggestionsDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-teal-500/20 transition-all cursor-pointer hover:scale-105"
            title="Unified Assistant: 1-Click Optimizer, Executive Summaries, Smart Bullets, and Job Keyword Matcher"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Suggestions & Optimizer</span>
          </button>

          {/* Print & Copy Utility Actions */}
          <button
            onClick={handlePrint}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
            title="Print Document"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyText}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer relative"
            title="Copy Text to Clipboard"
          >
            {copiedNotification ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Export PDF — Prominently at the top right of the view */}
          <button
            onClick={() => setIsPdfExportModalOpen(true)}
            disabled={isDownloadingPdf}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-primary hover:bg-brand-dark text-white rounded-xl text-xs font-black shadow-lg shadow-brand-primary/30 transition-all cursor-pointer disabled:opacity-50 hover:scale-105 border border-white/10 ml-1"
            title="Configure PDF format, paper size, and download"
          >
            {isDownloadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      {/* Floating Status Notification Toast */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-brand-secondary text-brand-primary px-4 py-2 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-brand-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            {statusMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secondary Customization Ribbon (Templates, Colors, Fonts, Density, Layout) */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Template Selector + Gallery Modal Trigger + Refresh Template & AI Style */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="text-slate-200 hover:text-white font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 px-2.5 py-1 rounded-lg border border-slate-700 transition-all cursor-pointer"
            title="Open Template Gallery with visual previews & details"
          >
            <Layers className="w-3.5 h-3.5 text-brand-secondary" />
            <span>Templates (5)</span>
          </button>

          {/* Refresh Template Button */}
          <button
            onClick={handleRefreshTemplate}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white rounded-lg text-xs font-semibold border border-teal-500/30 transition-all cursor-pointer"
            title="Cycle and refresh to next complementary template design"
          >
            <RefreshCcw className="w-3 h-3 text-teal-400" />
            <span>Refresh Template</span>
          </button>

          {/* Style Match Suggestion Button */}
          <button
            onClick={handleAiChangeStyle}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-brand-secondary hover:text-white rounded-lg text-xs font-semibold border border-brand-secondary/30 transition-all cursor-pointer"
            title="Automatically matches template, typography, and accent color to your target role"
          >
            <Sparkles className="w-3 h-3 text-brand-secondary" />
            <span>Match Style</span>
          </button>

          <div className="flex gap-1 overflow-x-auto scrollbar-none hidden md:flex">
            {templatesList.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTemplate === tpl.id
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent"
                }`}
                title={tpl.desc}
              >
                {tpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette Picker */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
            <Palette className="w-3 h-3 text-brand-secondary" /> Accent:
          </span>
          <div className="flex gap-1.5 items-center">
            {colorsList.map((col) => (
              <button
                key={col.id}
                onClick={() => setSelectedColor(col.id)}
                className={`w-5 h-5 rounded-full ${col.bgClass} transition-all cursor-pointer ${
                  selectedColor === col.id ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110" : "opacity-70 hover:opacity-100"
                }`}
                title={col.label}
              />
            ))}
          </div>
        </div>

        {/* Typography Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
            <Type className="w-3 h-3 text-brand-secondary" /> Font:
          </span>
          <select
            value={selectedTypography}
            onChange={(e) => setSelectedTypography(e.target.value as TypographyChoice)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none cursor-pointer"
          >
            {typographyList.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Density & Layout Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCompact(!isCompact)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isCompact ? "bg-brand-primary text-white" : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Toggle compact spacing to fit more on a single page"
          >
            {isCompact ? "Dense Mode (ON)" : "Dense Mode (OFF)"}
          </button>

          <div className="hidden lg:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode("split")}
              className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                viewMode === "split" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode("editor-only")}
              className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                viewMode === "editor-only" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setViewMode("preview-only")}
              className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                viewMode === "preview-only" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace: Split Screen Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Interactive Editor Workspace */}
        {(viewMode === "split" || viewMode === "editor-only") && (
          <div className={`w-full ${viewMode === "split" ? "lg:w-1/2 xl:w-5/12" : "w-full"} p-4 md:p-6 overflow-y-auto border-r border-slate-800 bg-slate-900/50 space-y-6 max-h-[calc(100vh-120px)]`}>
            {activeTab === "resume" ? (
              <ResumeEditor
                data={resumeData}
                onChange={setResumeData}
                onEnhanceBullet={handleTriggerEnhanceBullet}
                isEnhancingBullet={isEnhancingBullet}
                onOpenScoreModal={() => setIsAtsModalOpen(true)}
              />
            ) : activeTab === "cover-letter" ? (
              <CoverLetterEditor
                data={coverLetterData}
                resumeData={resumeData}
                onChange={setCoverLetterData}
                onGenerateAI={handleGenerateCoverLetter}
                isGeneratingAI={isGeneratingCoverLetter}
                alternativeOpenings={coverLetterAltOpenings}
                talkingPoints={coverLetterTalkingPoints}
              />
            ) : null}
          </div>
        )}

        {/* Right Side: Live Visual Document Preview */}
        {(viewMode === "split" || viewMode === "preview-only") && (
          <div className={`w-full ${viewMode === "split" ? "lg:w-1/2 xl:w-7/12" : "w-full"} p-4 md:p-8 bg-slate-950 overflow-y-auto max-h-[calc(100vh-120px)] flex justify-center items-start`}>
            <div className="w-full max-w-[850px] animate-in fade-in zoom-in-95 duration-300">
              {activeTab === "resume" ? (
                <ResumePreview
                  data={resumeData}
                  template={selectedTemplate}
                  colorTheme={selectedColor}
                  typography={selectedTypography}
                  isCompact={isCompact}
                />
              ) : activeTab === "cover-letter" ? (
                <CoverLetterPreview
                  data={coverLetterData}
                  template={selectedTemplate}
                  colorTheme={selectedColor}
                  typography={selectedTypography}
                />
              ) : null}
            </div>
          </div>
        )}
      </main>

      {/* AI Resume Optimize Modal / Drawer */}
      {isOptimizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold">One-Click Resume Optimization</h2>
                  <p className="text-xs text-slate-400">Tailors bullets with metrics, action verbs, and ATS alignment</p>
                </div>
              </div>
              <button
                onClick={() => setIsOptimizeModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Target Position / Title</label>
                <input
                  type="text"
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  placeholder="e.g. VP of Operations & Supply Chain Transformation"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Target Industry / Domain</label>
                <input
                  type="text"
                  value={targetIndustryInput}
                  onChange={(e) => setTargetIndustryInput(e.target.value)}
                  placeholder="e.g. Autonomous Logistics, Robotics & Tech Systems"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Specific Gap or Narrative to Bridge</label>
                <textarea
                  value={targetGapInput}
                  onChange={(e) => setTargetGapInput(e.target.value)}
                  rows={3}
                  placeholder="e.g. Elevating from hands-on execution to strategic C-suite systems leadership..."
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsOptimizeModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEnhanceResume}
                disabled={isEnhancingResume}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-teal-500/20 cursor-pointer disabled:opacity-50"
              >
                {isEnhancingResume ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Optimizing Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Run Optimization
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bullet Point Polisher Modal */}
      <BulletEnhancerModal
        isOpen={bulletModalOpen}
        onClose={() => setBulletModalOpen(false)}
        originalBullet={activeBulletText}
        targetRole={resumeData.personalInfo.targetTitle}
        variations={bulletVariations}
        isLoading={isEnhancingBullet}
        onSelectVariation={handleApplyBulletVariation}
      />

      {/* ATS & Industry Keyword Resume Score Diagnostic Modal */}
      <ResumeScoreModal
        isOpen={isAtsModalOpen}
        onClose={() => {
          setIsAtsModalOpen(false);
          if (activeTab === "ats") setActiveTab("resume");
        }}
        resumeData={resumeData}
        onUpdateResume={(updated) => {
          setResumeData(updated);
          triggerAutoSaveToast("Applied optimization to resume", undefined, "save");
        }}
        onOpenBulletEnhancer={(bullet) => handleTriggerEnhanceBullet(bullet, resumeData.experiences[0]?.id || "", 0)}
        onOpenAiSuggestions={() => setIsAiSuggestionsDrawerOpen(true)}
      />

      {/* Template & Style Switcher Studio Modal */}
      <TemplateSwitcherModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        currentTemplate={selectedTemplate}
        currentColor={selectedColor}
        currentTypography={selectedTypography}
        isCompact={isCompact}
        onSelectTemplate={setSelectedTemplate}
        onSelectColor={setSelectedColor}
        onSelectTypography={setSelectedTypography}
        onToggleCompact={setIsCompact}
      />

      {/* AI Resume & Data Ingestion Import Modal */}
      <AiImportModal
        isOpen={isAiImportModalOpen}
        onClose={() => setIsAiImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      {/* PDF Export Studio Modal */}
      <PdfExportModal
        isOpen={isPdfExportModalOpen}
        onClose={() => setIsPdfExportModalOpen(false)}
        resumeData={resumeData}
        coverLetterData={coverLetterData}
        activeDoc={activeTab === "cover-letter" ? "cover-letter" : "resume"}
        onTriggerDownload={handleDownloadPdf}
        isDownloading={isDownloadingPdf}
      />

      {/* Primary Onboarding Choice Modal: Upload/Import vs Start From Scratch with Talk-to-Text */}
      <ResumeOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onComplete={({ resumeData: newResume, coverLetterData: newCoverLetter, source }) => {
          setResumeData(newResume);
          if (newCoverLetter) {
            setCoverLetterData(newCoverLetter);
          } else if (newResume.personalInfo) {
            setCoverLetterData(prev => ({
              ...prev,
              sender: {
                fullName: newResume.personalInfo.fullName || prev.sender.fullName,
                title: newResume.personalInfo.targetTitle || prev.sender.title,
                email: newResume.personalInfo.email || prev.sender.email,
                phone: newResume.personalInfo.phone || prev.sender.phone,
                location: newResume.personalInfo.location || prev.sender.location,
              },
              targetRole: newResume.personalInfo.targetTitle || prev.targetRole
            }));
          }
          setStatusMessage(`Resume successfully assembled from ${source}!`);
          triggerAutoSaveToast(`Loaded resume from ${source}`, undefined, "save");
        }}
      />

      {/* AI Content Suggestions & JD Matcher Drawer */}
      <AiSuggestionsDrawer
        isOpen={isAiSuggestionsDrawerOpen}
        onClose={() => setIsAiSuggestionsDrawerOpen(false)}
        resumeData={resumeData}
        onUpdateResume={setResumeData}
        onOpenImportModal={() => setIsAiImportModalOpen(true)}
        initialTab={aiDrawerInitialTab}
        onShowToast={(msg) => {
          setStatusMessage(msg);
          setTimeout(() => setStatusMessage(null), 4000);
        }}
      />

      {/* Floating Auto-Save Toast Notification */}
      <AnimatePresence>
        {autoSaveToast?.show && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-6 left-6 z-50 max-w-sm bg-slate-900/95 backdrop-blur-md text-slate-100 p-3.5 rounded-2xl shadow-2xl border border-teal-500/40 shadow-teal-500/10 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 mt-0.5 border border-teal-500/30">
              {autoSaveToast.type === "reset" ? (
                <RotateCcw className="w-4 h-4 text-amber-400" />
              ) : autoSaveToast.type === "restore" ? (
                <Cloud className="w-4 h-4 text-teal-300" />
              ) : (
                <HardDrive className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white tracking-wide">
                  {autoSaveToast.type === "reset"
                    ? "Draft Reset"
                    : autoSaveToast.type === "restore"
                    ? "Draft Restored"
                    : "Progress Auto-Saved"}
                </h4>
                {autoSaveToast.timestamp && (
                  <span className="text-[10px] text-teal-400/90 font-mono bg-teal-950/70 px-1.5 py-0.5 rounded border border-teal-800/50">
                    {autoSaveToast.timestamp}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                {autoSaveToast.message}
              </p>
            </div>
            <button
              onClick={() => setAutoSaveToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
