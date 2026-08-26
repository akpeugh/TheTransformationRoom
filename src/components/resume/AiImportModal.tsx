import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Upload, 
  FileText, 
  Sparkles, 
  Clipboard, 
  Loader2, 
  CheckCircle2, 
  UserCheck, 
  Briefcase, 
  GraduationCap, 
  Award,
  Zap,
  ArrowRight,
  AlertCircle,
  FileCode
} from "lucide-react";
import { ResumeData } from "../../types/resume";
import { sampleExecutiveProfiles } from "../../data/sampleResume";
import { extractTextFromFile, validateResumeFile, sanitizeAndNormalizeResumeText } from "../../utils/documentParser";
import { sanitizeResumeText } from "../../utils/resumeSanitizer";
import { fallbackParseResumeText } from "../../utils/resumeParserFallback";

interface AiImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (data: ResumeData, message?: string) => void;
}

export const AiImportModal: React.FC<AiImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const [activeTab, setActiveTab] = useState<"file" | "paste" | "samples">("file");
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Paste text state
  const [rawText, setRawText] = useState("");
  
  // Preview parsed data before applying state
  const [extractedPreview, setExtractedPreview] = useState<ResumeData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const parseRawTextWithAI = async (text: string) => {
    const sanitized = sanitizeResumeText(text || "");
    const cleanText = sanitizeAndNormalizeResumeText(sanitized);
    if (!cleanText || !cleanText.trim()) {
      setErrorMsg("Please provide text or upload a document to import.");
      setActiveTab("paste");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setParsingProgress("Extracting executive roles, metrics, and technical competencies...");

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
          console.warn("[AiImportModal] Server parse returned status:", res.status);
        }
      } catch (netErr) {
        console.warn("[AiImportModal] Network parse error, utilizing deterministic fallback:", netErr);
      }

      if (!structuredResume) {
        structuredResume = fallbackParseResumeText(cleanText);
      }

      if (structuredResume) {
        setExtractedPreview(structuredResume);
        setParsingProgress(null);
      } else {
        throw new Error("Could not structure resume data.");
      }
    } catch (err: any) {
      console.error("[AiImportModal] AI Import parsing error:", err);
      const fallbackData = fallbackParseResumeText(cleanText);
      setExtractedPreview(fallbackData);
      setParsingProgress(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileProcess = async (file: File) => {
    // Validate file input
    const validation = validateResumeFile(file);
    if (!validation.isValid) {
      setErrorMsg(
        (validation.error || "Invalid file.") + " Please paste your resume text directly into the text editor below for manual cleanup."
      );
      setActiveTab("paste");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setParsingProgress(`Reading and sanitizing ${file.name}...`);

    try {
      let extractedText = "";

      if (file.type === "application/json" || file.name.endsWith(".json")) {
        const text = await file.text();
        const parsedJson = JSON.parse(text);
        if (parsedJson.personalInfo) {
          setExtractedPreview(parsedJson);
          setIsProcessing(false);
          setParsingProgress(null);
          return;
        }
      } else {
        extractedText = await extractTextFromFile(file);
      }

      const sanitized = sanitizeResumeText(extractedText);
      extractedText = sanitizeAndNormalizeResumeText(sanitized);

      if (!extractedText.trim()) {
        throw new Error("No readable text found in this file. The document may be empty, image-only, or encrypted.");
      }

      setRawText(extractedText);
      await parseRawTextWithAI(extractedText);
    } catch (err: any) {
      console.error("[AiImportModal] File extraction error:", {
        name: file.name,
        size: file.size,
        type: file.type,
        error: err.message || err
      });
      // Detect error and prompt user to paste content into simple textarea for manual cleanup
      setErrorMsg(
        `Automated extraction failed for "${file.name}" (${err.message || "Unreadable structure"}). Please paste your resume content into the textarea below for manual cleanup and instant formatting.`
      );
      setActiveTab("paste");
      setIsProcessing(false);
      setParsingProgress(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleApplyImport = () => {
    if (extractedPreview) {
      onImportSuccess(extractedPreview, "Resume successfully imported and structured with AI!");
      onClose();
    }
  };

  const handleLoadSample = (sample: typeof sampleExecutiveProfiles[0]) => {
    onImportSuccess(sample.data, `Loaded sample profile: ${sample.role}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Sparkles className="w-5 h-5 text-brand-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Resume Import & Ingestion
                <span className="text-[10px] bg-brand-secondary/20 text-brand-secondary px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  PDF / Word / Text / Samples
                </span>
              </h2>
              <p className="text-xs text-slate-400">Transform any existing resume or career bio into a structured executive schema</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-4 border-b border-slate-800 bg-slate-900 flex gap-2">
          <button
            onClick={() => { setActiveTab("file"); setExtractedPreview(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "file"
                ? "text-teal-400 border-teal-400 bg-slate-800/60"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload File (PDF / Word / TXT)
          </button>
          <button
            onClick={() => { setActiveTab("paste"); setExtractedPreview(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "paste"
                ? "text-teal-400 border-teal-400 bg-slate-800/60"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <Clipboard className="w-4 h-4" />
            Paste Text or LinkedIn Bio
          </button>
          <button
            onClick={() => { setActiveTab("samples"); setExtractedPreview(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "samples"
                ? "text-teal-400 border-teal-400 bg-slate-800/60"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Sample Executive Profiles
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              {errorMsg}
            </div>
          )}

          {/* Parsing Progress Loader Banner */}
          {isProcessing && (
            <div className="p-6 bg-slate-950 rounded-2xl border border-teal-500/30 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-brand-secondary animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-white">Parsing Engine Active</h3>
              <p className="text-xs text-slate-400">{parsingProgress || "Extracting structured data from your document..."}</p>
            </div>
          )}

          {/* Extracted Data Preview Verification Box */}
          {extractedPreview && !isProcessing && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Successfully Structured
                </div>
                <span className="text-[11px] text-slate-400">Ready to load into Studio</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Name</span>
                  <span className="text-xs font-bold text-white truncate block">{extractedPreview.personalInfo.fullName || "Detected"}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Target Title</span>
                  <span className="text-xs font-bold text-teal-300 truncate block">{extractedPreview.personalInfo.targetTitle || "Executive"}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Positions</span>
                  <span className="text-xs font-bold text-white">{extractedPreview.experiences?.length || 0} Roles Extracted</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Skill Categories</span>
                  <span className="text-xs font-bold text-white">{extractedPreview.skills?.length || 0} Groups</span>
                </div>
              </div>

              {extractedPreview.summary && (
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block mb-1 text-[11px] uppercase tracking-wider">Executive Summary Preview:</strong>
                  {extractedPreview.summary}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setExtractedPreview(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Clear & Re-upload
                </button>
                <button
                  onClick={handleApplyImport}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  Load Into Resume Studio
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: File Upload Mode */}
          {activeTab === "file" && !extractedPreview && !isProcessing && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
                accept=".pdf,.docx,.doc,.txt,.json"
                className="hidden"
              />

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                  dragOver
                    ? "border-teal-400 bg-teal-500/10 scale-[1.01]"
                    : "border-slate-700 hover:border-slate-500 bg-slate-950/40 hover:bg-slate-950/70"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Drag & drop your resume file here</h3>
                  <p className="text-xs text-slate-400 mt-1">Supports PDF, Microsoft Word (.docx), Plain Text (.txt), or JSON</p>
                </div>
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 pointer-events-none"
                >
                  Browse Files
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-400">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col items-center gap-1">
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span>PDF & Word (.docx)</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col items-center gap-1">
                  <Sparkles className="w-4 h-4 text-brand-secondary" />
                  <span>Auto-extracts metrics</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col items-center gap-1">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>ATS Keyword Mapping</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Raw Text / LinkedIn Paste Mode */}
          {activeTab === "paste" && !extractedPreview && !isProcessing && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-teal-400" />
                    Paste Resume Content for Manual Cleanup:
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="text-[11px] text-slate-400">
                      <span>{rawText.trim().split(/\s+/).filter(Boolean).length} words</span> • <span>{rawText.length} chars</span>
                    </div>
                    <button
                      onClick={() => {
                        setRawText(`Alex Rivera
Director of Operations & Systems Strategy
Richmond, VA | (555) 349-8201 | alex.rivera@example.com

SUMMARY
Operations transformation executive with 10+ years modernizing supply chains and deploying warehouse robotics (AMR/ASRS). Delivered over $14M in verified cost reductions.

EXPERIENCE
Apex Global Logistics - Senior Director of Operations (2022 - Present)
- Spearheaded 4-hub modernization deploying AMRs, boosting daily throughput by 38%.
- Led cross-functional realignment for 350+ team members, slashing fulfillment cycle times by 42%.
- Integrated real-time inventory telemetry, averting $3.4M in annual stockout losses.

Vanguard Distribution - Operations Manager (2018 - 2022)
- Implemented Lean Six Sigma error reductions, raising on-time deliveries from 89% to 99.2%.
- Expanded storage capacity by 22% via computational slotting algorithms.`);
                        setErrorMsg(null);
                      }}
                      className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
                    >
                      Paste Sample
                    </button>
                  </div>
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                  }}
                  rows={9}
                  placeholder="Paste your unformatted resume, raw bullet points, or LinkedIn 'About' and 'Experience' sections here for manual cleanup..."
                  className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-teal-500 resize-y font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!rawText.trim()}
                    onClick={() => {
                      const cleaned = sanitizeResumeText(rawText);
                      setRawText(cleaned);
                    }}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold transition-colors disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    Sanitize Text
                  </button>

                  {rawText.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        setRawText("");
                        setErrorMsg(null);
                      }}
                      className="px-3 py-2 text-slate-400 hover:text-slate-200 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => parseRawTextWithAI(rawText)}
                    disabled={!rawText.trim()}
                    className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-teal-500/20 cursor-pointer disabled:opacity-40"
                  >
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    Parse & Structure Document
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Curated Sample Executive Profiles */}
          {activeTab === "samples" && !isProcessing && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 mb-2">
                Want to explore templates or start with a battle-tested executive archetype? Choose one of our pre-built profiles below:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {sampleExecutiveProfiles.map((sample) => (
                  <div
                    key={sample.id}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{sample.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-bold">
                          {sample.industry}
                        </span>
                      </div>
                      <p className="text-xs text-teal-300 font-semibold">{sample.role}</p>
                      <p className="text-xs text-slate-400">{sample.description}</p>
                    </div>

                    <button
                      onClick={() => handleLoadSample(sample)}
                      className="px-4 py-2 bg-slate-800 group-hover:bg-teal-500 group-hover:text-slate-950 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <span>Load Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs text-slate-400">
          <span>Confidential client processing • Private & Secure</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
