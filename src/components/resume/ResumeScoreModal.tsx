import React, { useState, useEffect, useMemo } from "react";
import {
  ResumeData,
  IndustryDomain,
  ScoreSuggestion,
  ResumeScoreAnalysis
} from "../../types/resume";
import {
  calculateResumeScore,
  INDUSTRY_BENCHMARKS,
  applyAddKeywordToResume,
  applyReplaceWeakVerb
} from "../../utils/resumeScoreEngine";
import {
  X,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Key,
  Plus,
  Check,
  Search,
  RotateCcw,
  ArrowRight,
  Filter,
  Flame,
  Award,
  Layers,
  ChevronRight,
  Loader2,
  FileText,
  Building,
  Target,
  Sliders
} from "lucide-react";

interface ResumeScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  onUpdateResume: (updated: ResumeData) => void;
  onOpenBulletEnhancer?: (bulletText: string) => void;
  onOpenAiSuggestions?: () => void;
}

export const ResumeScoreModal: React.FC<ResumeScoreModalProps> = ({
  isOpen,
  onClose,
  resumeData,
  onUpdateResume,
  onOpenBulletEnhancer,
  onOpenAiSuggestions
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryDomain>("operations-supply-chain");
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "suggestions" | "verbs" | "ai-scan">("overview");
  const [suggestionFilter, setSuggestionFilter] = useState<"all" | "critical" | "high" | "quick-win">("all");
  const [keywordCategoryFilter, setKeywordCategoryFilter] = useState<"all" | "hard-skills" | "leadership" | "tools-systems" | "certifications">("all");
  const [keywordSearchQuery, setKeywordSearchQuery] = useState("");
  const [appliedSuggestionIds, setAppliedSuggestionIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Deep AI Scan state
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiScanResult, setAiScanResult] = useState<any | null>(null);
  const [customJobDesc, setCustomJobDesc] = useState("");

  // Calculate real-time score based on current resumeData and selectedIndustry
  const scoreAnalysis: ResumeScoreAnalysis = useMemo(() => {
    return calculateResumeScore(resumeData, selectedIndustry);
  }, [resumeData, selectedIndustry]);

  // Set default industry on mount if not changed
  useEffect(() => {
    if (isOpen) {
      const autoDetected = scoreAnalysis.industry;
      setSelectedIndustry(autoDetected);
    }
  }, [isOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!isOpen) return null;

  // Handlers for 1-Click Fixes
  const handleAddKeyword = (kw: string) => {
    const updated = applyAddKeywordToResume(resumeData, [kw]);
    onUpdateResume(updated);
    showToast(`Added "${kw}" to Skills section!`);
  };

  const handleAddMultipleKeywords = (keywords: string[]) => {
    const updated = applyAddKeywordToResume(resumeData, keywords);
    onUpdateResume(updated);
    showToast(`Added ${keywords.length} industry keywords to Skills!`);
  };

  const handleReplaceWeakVerb = (expIdx: number, hlIdx: number, newVerb: string, suggestionId?: string) => {
    const updated = applyReplaceWeakVerb(resumeData, expIdx, hlIdx, newVerb);
    onUpdateResume(updated);
    if (suggestionId) {
      setAppliedSuggestionIds(prev => new Set(prev).add(suggestionId));
    }
    showToast(`Replaced with executive verb "${newVerb}"!`);
  };

  const handleApplySuggestion = (suggestion: ScoreSuggestion) => {
    if (suggestion.actionType === "add-keyword" && suggestion.actionPayload?.keywords) {
      handleAddMultipleKeywords(suggestion.actionPayload.keywords);
      setAppliedSuggestionIds(prev => new Set(prev).add(suggestion.id));
    } else if (suggestion.actionType === "replace-verb" && suggestion.actionPayload) {
      const { experienceIndex, highlightIndex, replacement } = suggestion.actionPayload;
      handleReplaceWeakVerb(experienceIndex, highlightIndex, replacement, suggestion.id);
    } else if (suggestion.actionType === "enhance-bullet" && onOpenBulletEnhancer) {
      const sampleBullet = suggestion.targetText || resumeData.experiences[0]?.highlights[0] || "";
      onClose();
      onOpenBulletEnhancer(sampleBullet);
    } else if (suggestion.actionType === "expand-summary" && onOpenAiSuggestions) {
      onClose();
      onOpenAiSuggestions();
    } else if (suggestion.actionType === "add-metric") {
      const updated = {
        ...resumeData,
        metrics: [
          ...(resumeData.metrics || []),
          { label: "Throughput Velocity", value: "+38%" },
          { label: "CapEx Optimization", value: "$2.4M" }
        ]
      };
      onUpdateResume(updated);
      setAppliedSuggestionIds(prev => new Set(prev).add(suggestion.id));
      showToast("Added standout executive metrics callouts!");
    }
  };

  // Run Deep AI Scan
  const handleRunAiScan = async () => {
    setIsAiScanning(true);
    try {
      const res = await fetch("/api/resume/score-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          targetIndustry: INDUSTRY_BENCHMARKS[selectedIndustry]?.name || selectedIndustry,
          customJobDescription: customJobDesc
        })
      });

      if (!res.ok) throw new Error("Failed to run deep AI score analysis");
      const result = await res.json();
      setAiScanResult(result);
      setActiveTab("ai-scan");
      showToast("AI Deep Industry Scan complete!");
    } catch (err: any) {
      console.error("AI scan error:", err);
      showToast("AI scan failed. Please verify network/API.");
    } finally {
      setIsAiScanning(false);
    }
  };

  // Filtered lists
  const filteredSuggestions = scoreAnalysis.suggestions.filter(s => {
    if (suggestionFilter === "all") return true;
    return s.priority === suggestionFilter;
  });

  const filteredKeywords = scoreAnalysis.keywordsList.filter(k => {
    if (keywordCategoryFilter !== "all" && k.category !== keywordCategoryFilter) return false;
    if (keywordSearchQuery.trim()) {
      const q = keywordSearchQuery.toLowerCase();
      return k.keyword.toLowerCase().includes(q);
    }
    return true;
  });

  // Score color helper
  const getScoreColorTheme = (score: number) => {
    if (score >= 88) return { text: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30", bar: "bg-emerald-500", ring: "#10b981" };
    if (score >= 74) return { text: "text-teal-400", bg: "bg-teal-500/15", border: "border-teal-500/30", bar: "bg-teal-500", ring: "#14b8a6" };
    if (score >= 55) return { text: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30", bar: "bg-amber-500", ring: "#f59e0b" };
    return { text: "text-rose-400", bg: "bg-rose-500/15", border: "border-rose-500/30", bar: "bg-rose-500", ring: "#f43f5e" };
  };

  const scoreTheme = getScoreColorTheme(scoreAnalysis.overallScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Top Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-slate-950 flex items-center justify-center shadow-lg shadow-teal-500/20 font-black">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">Resume Score & Keyword Diagnostic</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${scoreTheme.bg} ${scoreTheme.text} ${scoreTheme.border}`}>
                  {scoreAnalysis.grade} Grade
                </span>
              </div>
              <p className="text-xs text-slate-400">Industry Keyword Benchmarking, ATS Alignment & Actionable Optimization</p>
            </div>
          </div>

          {/* Industry Domain Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs">
              <Building className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Domain:</span>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value as IndustryDomain)}
                className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
              >
                {Object.values(INDUSTRY_BENCHMARKS).map(ind => (
                  <option key={ind.id} value={ind.id} className="bg-slate-900 text-white">
                    {ind.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Toast inside modal */}
        {toastMessage && (
          <div className="bg-teal-500 text-slate-950 text-xs font-black px-4 py-2 text-center shadow-md flex items-center justify-center gap-2 animate-in fade-in duration-150">
            <Sparkles className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-6 flex overflow-x-auto gap-2 text-xs font-bold scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === "overview" ? "border-teal-400 text-teal-300" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Executive Scorecard</span>
          </button>

          <button
            onClick={() => setActiveTab("suggestions")}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === "suggestions" ? "border-teal-400 text-teal-300" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-4 h-4 text-brand-secondary" />
            <span>Actionable Suggestions</span>
            <span className="px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded-full text-[10px] font-mono">
              {scoreAnalysis.suggestions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("keywords")}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === "keywords" ? "border-teal-400 text-teal-300" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Industry Keywords</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-mono">
              {scoreAnalysis.keywordMetrics.matchedCount}/{scoreAnalysis.keywordMetrics.totalBenchmarked}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("verbs")}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === "verbs" ? "border-teal-400 text-teal-300" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Action Verbs & Impact</span>
            {scoreAnalysis.weakVerbsFound.length > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 rounded-full text-[10px] font-mono">
                {scoreAnalysis.weakVerbsFound.length} to fix
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("ai-scan")}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === "ai-scan" ? "border-brand-secondary text-brand-secondary" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-brand-secondary" />
            <span>Deep Audit</span>
            {isAiScanning && <Loader2 className="w-3 h-3 animate-spin text-brand-secondary" />}
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: OVERVIEW SCORECARD */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Scorecard Hero Banner */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-6 rounded-3xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* Left: Big Score Meter */}
                <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-800">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.2"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="transition-all duration-1000 ease-out"
                        strokeDasharray={`${scoreAnalysis.overallScore}, 100`}
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        stroke={scoreTheme.ring}
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className={`text-4xl font-black ${scoreTheme.text}`}>
                        {scoreAnalysis.overallScore}%
                      </span>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Resume Score
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-xs font-extrabold text-white block">
                      {scoreAnalysis.tierLabel}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Benchmarked vs {INDUSTRY_BENCHMARKS[selectedIndustry]?.name}
                    </span>
                  </div>
                </div>

                {/* Right: Sub-Score Breakdown Bars */}
                <div className="md:col-span-8 flex flex-col justify-center space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-teal-400" /> Industry Keyword Match & Density
                      </span>
                      <span className="font-mono text-teal-300">{scoreAnalysis.subScores.keywordMatch}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${scoreAnalysis.subScores.keywordMatch}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Quantifiable Impact & Metrics ($, %, ROI)
                      </span>
                      <span className="font-mono text-emerald-300">{scoreAnalysis.subScores.quantifiableImpact}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${scoreAnalysis.subScores.quantifiableImpact}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" /> Executive Action Verbs & Power Phrasing
                      </span>
                      <span className="font-mono text-amber-300">{scoreAnalysis.subScores.executiveVerbs}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${scoreAnalysis.subScores.executiveVerbs}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-400" /> ATS Structural Completeness
                      </span>
                      <span className="font-mono text-blue-300">{scoreAnalysis.subScores.structureAts}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${scoreAnalysis.subScores.structureAts}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Health Checklist + Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                <div className={`p-3 rounded-2xl border ${scoreAnalysis.sectionHealth.personalInfo ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-rose-500/10 border-rose-500/20 text-rose-300"} flex flex-col items-center text-center`}>
                  {scoreAnalysis.sectionHealth.personalInfo ? <CheckCircle2 className="w-4 h-4 mb-1" /> : <AlertTriangle className="w-4 h-4 mb-1" />}
                  <span className="text-[11px] font-bold">Contact Info</span>
                  <span className="text-[9px] opacity-75">{scoreAnalysis.sectionHealth.personalInfo ? "Verified" : "Missing Details"}</span>
                </div>

                <div className={`p-3 rounded-2xl border ${scoreAnalysis.sectionHealth.summary ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-rose-500/10 border-rose-500/20 text-rose-300"} flex flex-col items-center text-center`}>
                  {scoreAnalysis.sectionHealth.summary ? <CheckCircle2 className="w-4 h-4 mb-1" /> : <AlertTriangle className="w-4 h-4 mb-1" />}
                  <span className="text-[11px] font-bold">Summary</span>
                  <span className="text-[9px] opacity-75">{scoreAnalysis.sectionHealth.summary ? "Optimal Length" : "Needs Expansion"}</span>
                </div>

                <div className={`p-3 rounded-2xl border ${scoreAnalysis.sectionHealth.experiences ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-rose-500/10 border-rose-500/20 text-rose-300"} flex flex-col items-center text-center`}>
                  {scoreAnalysis.sectionHealth.experiences ? <CheckCircle2 className="w-4 h-4 mb-1" /> : <AlertTriangle className="w-4 h-4 mb-1" />}
                  <span className="text-[11px] font-bold">Experience</span>
                  <span className="text-[9px] opacity-75">{resumeData.experiences.length} Positions</span>
                </div>

                <div className={`p-3 rounded-2xl border ${scoreAnalysis.sectionHealth.skills ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-rose-500/10 border-rose-500/20 text-rose-300"} flex flex-col items-center text-center`}>
                  {scoreAnalysis.sectionHealth.skills ? <CheckCircle2 className="w-4 h-4 mb-1" /> : <AlertTriangle className="w-4 h-4 mb-1" />}
                  <span className="text-[11px] font-bold">Skills Taxonomy</span>
                  <span className="text-[9px] opacity-75">{resumeData.skills.length} Categories</span>
                </div>

                <div className={`p-3 rounded-2xl border ${scoreAnalysis.sectionHealth.education ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-amber-500/10 border-amber-500/20 text-amber-300"} flex flex-col items-center text-center`}>
                  {scoreAnalysis.sectionHealth.education ? <CheckCircle2 className="w-4 h-4 mb-1" /> : <AlertTriangle className="w-4 h-4 mb-1" />}
                  <span className="text-[11px] font-bold">Education</span>
                  <span className="text-[9px] opacity-75">{resumeData.education.length} Degrees</span>
                </div>

                <div className={`p-3 rounded-2xl border ${scoreAnalysis.sectionHealth.metrics ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-amber-500/10 border-amber-500/20 text-amber-300"} flex flex-col items-center text-center`}>
                  {scoreAnalysis.sectionHealth.metrics ? <CheckCircle2 className="w-4 h-4 mb-1" /> : <AlertTriangle className="w-4 h-4 mb-1" />}
                  <span className="text-[11px] font-bold">Metric Badges</span>
                  <span className="text-[9px] opacity-75">{(resumeData.metrics || []).length} Standout Wins</span>
                </div>
              </div>

              {/* Strengths & Priority Fixes Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-5 bg-slate-950/60 rounded-3xl border border-emerald-500/20 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Core Executive Strengths
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {scoreAnalysis.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-400 font-bold mt-0.5">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Top Quick Actions */}
                <div className="p-5 bg-slate-950/60 rounded-3xl border border-teal-500/20 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-brand-secondary" /> Priority Optimizations
                    </h3>
                    <button
                      onClick={() => setActiveTab("suggestions")}
                      className="text-[11px] font-bold text-teal-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All ({scoreAnalysis.suggestions.length})</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {scoreAnalysis.suggestions.slice(0, 2).map((sug) => (
                      <div key={sug.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${sug.priority === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
                            {sug.priority}
                          </span>
                          <p className="text-xs font-bold text-white mt-1 truncate">{sug.title}</p>
                        </div>
                        <button
                          onClick={() => handleApplySuggestion(sug)}
                          className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-[11px] font-black shrink-0 transition-all cursor-pointer shadow-sm"
                        >
                          Fix
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Callouts */}
              <div className="p-4 bg-gradient-to-r from-teal-950/50 to-indigo-950/50 rounded-2xl border border-teal-500/30 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-brand-secondary shrink-0" />
                  <div>
                    <p className="font-bold text-white">Targeting a specific Executive job posting?</p>
                    <p className="text-slate-400 text-[11px]">Run a Deep Industry Scan with job description keywords to maximize recruiter alignment.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("ai-scan")}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 rounded-xl font-black text-xs transition-all cursor-pointer shadow-lg shadow-teal-500/20"
                >
                  Run Deep Industry Scan
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIONABLE SUGGESTIONS & 1-CLICK FIXES */}
          {activeTab === "suggestions" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Filter Ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Priority:</span>
                  <div className="flex gap-1">
                    {(["all", "critical", "high", "quick-win"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setSuggestionFilter(p)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          suggestionFilter === p
                            ? "bg-teal-500 text-slate-950 shadow-sm"
                            : "bg-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        {p === "all" ? "All" : p}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-[11px] text-slate-400">
                  Showing {filteredSuggestions.length} actionable optimization items
                </span>
              </div>

              {/* Suggestions List */}
              <div className="space-y-3">
                {filteredSuggestions.map((sug) => {
                  const isApplied = appliedSuggestionIds.has(sug.id);
                  return (
                    <div
                      key={sug.id}
                      className={`p-5 rounded-3xl border transition-all ${
                        isApplied
                          ? "bg-slate-950/40 border-slate-800 opacity-60"
                          : sug.priority === "critical"
                          ? "bg-rose-950/20 border-rose-500/30"
                          : sug.priority === "high"
                          ? "bg-amber-950/20 border-amber-500/30"
                          : "bg-teal-950/20 border-teal-500/30"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                sug.priority === "critical"
                                  ? "bg-rose-500 text-slate-950"
                                  : sug.priority === "high"
                                  ? "bg-amber-500 text-slate-950"
                                  : "bg-teal-500 text-slate-950"
                              }`}
                            >
                              {sug.priority} Priority
                            </span>
                            {sug.section && (
                              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md text-[10px] font-bold">
                                Section: {sug.section}
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-white">{sug.title}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">{sug.description}</p>

                          {sug.suggestedFix && (
                            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-mono text-teal-300">
                              <span className="text-[10px] font-bold text-slate-400 block font-sans mb-0.5">Recommended Adjustment:</span>
                              {sug.suggestedFix}
                            </div>
                          )}
                        </div>

                        {/* Action Trigger */}
                        <div className="shrink-0 flex items-center">
                          {isApplied ? (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                              <Check className="w-4 h-4" /> Applied
                            </div>
                          ) : (
                            <button
                              onClick={() => handleApplySuggestion(sug)}
                              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-teal-500/20 cursor-pointer transition-all hover:scale-105"
                            >
                              <Zap className="w-3.5 h-3.5 fill-slate-950" />
                              <span>
                                {sug.actionType === "add-keyword"
                                  ? "Add to Skills"
                                  : sug.actionType === "replace-verb"
                                  ? "Replace Verb"
                                  : sug.actionType === "enhance-bullet"
                                  ? "Enhance Bullet"
                                  : sug.actionType === "add-metric"
                                  ? "Add Metrics"
                                  : "Apply Fix"}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: INDUSTRY KEYWORDS EXPLORER */}
          {activeTab === "keywords" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Keyword Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                    {scoreAnalysis.keywordMetrics.matchRate}%
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Industry Match Rate</span>
                    <span className="text-xs font-bold text-white">{scoreAnalysis.keywordMetrics.matchedCount} of {scoreAnalysis.keywordMetrics.totalBenchmarked} Keywords</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Matched in Resume</span>
                    <span className="text-xs font-bold text-emerald-400">{scoreAnalysis.keywordMetrics.matchedCount} Found</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Missing High-Impact</span>
                    <span className="text-xs font-bold text-amber-400">{scoreAnalysis.keywordMetrics.missingCount} Missing</span>
                  </div>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-1 overflow-x-auto scrollbar-none">
                  {(["all", "hard-skills", "leadership", "tools-systems", "certifications"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setKeywordCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        keywordCategoryFilter === cat
                          ? "bg-teal-500 text-slate-950 shadow-sm"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat === "all" ? "All Categories" : cat.replace("-", " ")}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={keywordSearchQuery}
                    onChange={(e) => setKeywordSearchQuery(e.target.value)}
                    placeholder="Search keywords..."
                    className="pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-teal-500 w-48"
                  />
                </div>
              </div>

              {/* Interactive Keywords Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredKeywords.map((item, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
                      item.matched
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                        : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {item.matched ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold truncate" title={item.keyword}>
                          {item.keyword}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span className="capitalize">{item.category.replace("-", " ")}</span>
                        {item.matched && item.occurrences > 0 && (
                          <span className="text-emerald-400 font-mono font-bold">
                            ({item.occurrences}x in {item.locations?.[0] || 'Resume'})
                          </span>
                        )}
                      </div>
                    </div>

                    {!item.matched && (
                      <button
                        onClick={() => handleAddKeyword(item.keyword)}
                        className="p-1.5 bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0"
                        title={`Add "${item.keyword}" to your Skills section`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ACTION VERBS & POWER PHRASING */}
          {activeTab === "verbs" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" /> Executive Action Verb Diagnostic
                  </h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Lead with active power verbs. Eliminate passive phrasing (e.g. "Responsible for", "Helped", "Worked on").
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-amber-400 font-mono">
                    {scoreAnalysis.subScores.executiveVerbs}%
                  </span>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Verb Score</span>
                </div>
              </div>

              {/* Weak Verbs Detected */}
              {scoreAnalysis.weakVerbsFound.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Passive Phrases to Replace ({scoreAnalysis.weakVerbsFound.length})
                  </h4>
                  {scoreAnalysis.weakVerbsFound.map((item, idx) => (
                    <div key={idx} className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-rose-500/30 text-rose-300 rounded text-[10px] font-mono font-bold line-through">
                            "{item.verb}"
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-300 rounded text-[10px] font-mono font-bold">
                            "{item.replacement}"
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 italic font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                          "{item.bulletText}"
                        </p>
                      </div>
                      <button
                        onClick={() => handleReplaceWeakVerb(item.experienceIndex, item.highlightIndex, item.replacement)}
                        className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer shadow-sm"
                      >
                        Replace with "{item.replacement}"
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-emerald-950/20 border border-emerald-500/30 rounded-3xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">No Passive Verbs Detected!</h4>
                  <p className="text-xs text-slate-300">All experience bullet points start with strong executive action verbs.</p>
                </div>
              )}

              {/* Recommended Action Verbs Bank */}
              <div className="p-5 bg-slate-950/60 rounded-3xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Top Power Verbs for {INDUSTRY_BENCHMARKS[selectedIndustry]?.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRY_BENCHMARKS[selectedIndustry]?.keywords.actionVerbs.map((v, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-800 border border-slate-700 text-teal-300 rounded-xl text-xs font-bold">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI DEEP INDUSTRY SCAN (GEMINI) */}
          {activeTab === "ai-scan" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Scan Trigger / Configuration */}
              <div className="p-5 bg-slate-950/80 rounded-3xl border border-teal-500/30 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-secondary" /> Deep Industry Audit
                    </h3>
                    <p className="text-xs text-slate-400">
                      Evaluates semantic tone, hiring manager expectations, and generates tailored sentence-level rewrites.
                    </p>
                  </div>
                  <button
                    onClick={handleRunAiScan}
                    disabled={isAiScanning}
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-teal-500/20"
                  >
                    {isAiScanning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Auditing Resume...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-slate-950" />
                        {aiScanResult ? "Re-Run Audit" : "Run Deep Audit"}
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Target Job Description (Optional - paste to match exact vacancy requirements):
                  </label>
                  <textarea
                    value={customJobDesc}
                    onChange={(e) => setCustomJobDesc(e.target.value)}
                    rows={2}
                    placeholder="Paste job posting snippet or specific requirements..."
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-teal-500 resize-none font-mono"
                  />
                </div>
              </div>

              {/* AI Scan Results */}
              {aiScanResult && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Executive Summary Assessment */}
                  <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-teal-400 tracking-wider">
                        Executive Market Positioning
                      </span>
                      {aiScanResult.industryComparison?.percentile && (
                        <span className="px-2.5 py-0.5 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold font-mono">
                          {aiScanResult.industryComparison.percentile}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {aiScanResult.aiSummary}
                    </p>
                  </div>

                  {/* Priority Roadmap */}
                  {aiScanResult.priorityActions && aiScanResult.priorityActions.length > 0 && (
                    <div className="p-5 bg-slate-950/60 rounded-3xl border border-slate-800 space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-brand-secondary flex items-center gap-2">
                        <Target className="w-4 h-4" /> Strategic Optimization Roadmap
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {aiScanResult.priorityActions.map((act: any, i: number) => (
                          <div key={i} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-teal-400">Step {act.step || i + 1}</span>
                              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded font-bold">
                                {act.estimatedScoreBoost || "+5% Score"}
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-white">{act.title}</h5>
                            <p className="text-[11px] text-slate-400">{act.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actionable Bullet Rewrites */}
                  {aiScanResult.actionableRewrites && aiScanResult.actionableRewrites.length > 0 && (
                    <div className="p-5 bg-slate-950/60 rounded-3xl border border-slate-800 space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> High-Impact Bullet Transformations
                      </h4>
                      <div className="space-y-3">
                        {aiScanResult.actionableRewrites.map((rw: any, i: number) => (
                          <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                            <div className="text-[11px] text-slate-400 line-through">
                              {rw.originalBullet}
                            </div>
                            <div className="text-xs font-bold text-emerald-300 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20 font-mono">
                              "{rw.enhancedBullet}"
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                              <span>{rw.rationale}</span>
                              <span className="text-teal-400 font-bold">{rw.impactIncrease}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Real-time score updates automatically as you edit.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              Done & Return to Studio
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
