import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Sliders, 
  Loader2, 
  ShieldCheck, 
  Palette, 
  FileType, 
  Settings,
  Sparkles
} from "lucide-react";
import { ResumeData, CoverLetterData } from "../../types/resume";

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  coverLetterData: CoverLetterData;
  activeDoc: "resume" | "cover-letter";
  onTriggerDownload: (options: ExportOptions) => Promise<void>;
  isDownloading: boolean;
}

export interface ExportOptions {
  paperSize: "letter" | "a4";
  colorMode: "full-color" | "monochrome";
  margins: "compact" | "standard" | "relaxed";
  includeAtsMetadata: boolean;
  scaleFactor: number;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  resumeData,
  coverLetterData,
  activeDoc,
  onTriggerDownload,
  isDownloading
}) => {
  const [paperSize, setPaperSize] = useState<"letter" | "a4">("letter");
  const [colorMode, setColorMode] = useState<"full-color" | "monochrome">("full-color");
  const [margins, setMargins] = useState<"compact" | "standard" | "relaxed">("standard");
  const [includeAtsMetadata, setIncludeAtsMetadata] = useState<boolean>(true);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    await onTriggerDownload({
      paperSize,
      colorMode,
      margins,
      includeAtsMetadata,
      scaleFactor: 2.5
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPlainText = () => {
    let content = "";
    if (activeDoc === "cover-letter") {
      content = `${coverLetterData.sender.fullName}\n${coverLetterData.sender.email} | ${coverLetterData.sender.phone} | ${coverLetterData.sender.location}\n\n${coverLetterData.date}\n\n${coverLetterData.recipient.hiringManagerName}\n${coverLetterData.recipient.companyName}\n${coverLetterData.recipient.companyAddress}\n\n${coverLetterData.salutation}\n\n${coverLetterData.openingParagraph}\n\n${coverLetterData.bodyParagraphs.join("\n\n")}\n\n${coverLetterData.closingParagraph}\n\n${coverLetterData.signoff}\n${coverLetterData.sender.fullName}`;
    } else {
      content = `${resumeData.personalInfo.fullName.toUpperCase()}\n${resumeData.personalInfo.targetTitle}\n${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location} | ${resumeData.personalInfo.linkedin}\n\nEXECUTIVE SUMMARY\n${resumeData.summary}\n\nKEY METRICS & IMPACT\n${resumeData.metrics?.map(m => `• ${m.label}: ${m.value}`).join('\n') || ''}\n\nPROFESSIONAL EXPERIENCE\n${resumeData.experiences.map(e => `${e.role.toUpperCase()} | ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate})\n${e.highlights.map(h => `• ${h}`).join('\n')}`).join('\n\n')}\n\nEDUCATION\n${resumeData.education.map(e => `• ${e.degree} in ${e.field} - ${e.institution} (${e.graduationDate})`).join('\n')}\n\nCORE COMPETENCIES & SKILLS\n${resumeData.skills.map(s => `${s.category}: ${s.skills.join(', ')}`).join('\n')}\n\nCERTIFICATIONS\n${resumeData.certifications?.map(c => `• ${c.name} - ${c.issuer} (${c.date})`).join('\n') || 'N/A'}`;
    }

    navigator.clipboard.writeText(content);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const documentName = activeDoc === "cover-letter" 
    ? `${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Cover_Letter.pdf`
    : `${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Executive_Resume.pdf`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Download className="w-5 h-5 text-brand-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Export & Print Studio
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-bold uppercase">
                  PDF • Print • Plaintext
                </span>
              </h2>
              <p className="text-xs text-slate-400">Configure page geometry, color profile, and ATS export specifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* File Target Banner */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-teal-400" />
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block">Export Target</span>
                <span className="text-sm font-bold text-white font-mono">{documentName}</span>
              </div>
            </div>
            <span className="text-[11px] bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300 font-bold capitalize">
              {activeDoc.replace("-", " ")}
            </span>
          </div>

          {/* Paper Size & Color Profile Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Paper Size */}
            <div className="space-y-2">
              <label className="font-black uppercase tracking-wider text-slate-400 text-[10px] block">
                Paper Standard & Dimensions:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaperSize("letter")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paperSize === "letter"
                      ? "bg-slate-800 border-teal-500 text-white font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="block font-bold text-xs">US Letter</span>
                  <span className="text-[10px] text-slate-500">8.5 x 11.0 in (North America)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize("a4")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paperSize === "a4"
                      ? "bg-slate-800 border-teal-500 text-white font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="block font-bold text-xs">A4 International</span>
                  <span className="text-[10px] text-slate-500">210 x 297 mm (Global)</span>
                </button>
              </div>
            </div>

            {/* Color Mode */}
            <div className="space-y-2">
              <label className="font-black uppercase tracking-wider text-slate-400 text-[10px] block">
                Color Profile & Contrast:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setColorMode("full-color")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    colorMode === "full-color"
                      ? "bg-slate-800 border-teal-500 text-white font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="block font-bold text-xs flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-teal-400" /> Full Executive Color
                  </span>
                  <span className="text-[10px] text-slate-500">Accent badges & ribbons</span>
                </button>
                <button
                  type="button"
                  onClick={() => setColorMode("monochrome")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    colorMode === "monochrome"
                      ? "bg-slate-800 border-teal-500 text-white font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="block font-bold text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ATS Monochrome
                  </span>
                  <span className="text-[10px] text-slate-500">Strict black & gray print</span>
                </button>
              </div>
            </div>
          </div>

          {/* Margins */}
          <div className="space-y-2">
            <label className="font-black uppercase tracking-wider text-slate-400 text-[10px] block">
              Page Margins & Density:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "compact", label: "Compact (0.25 in)", sub: "Best for 1-page fit" },
                { id: "standard", label: "Standard (0.35 in)", sub: "Balanced executive" },
                { id: "relaxed", label: "Relaxed (0.50 in)", sub: "Spacious multi-page" }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMargins(m.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    margins === m.id
                      ? "bg-slate-800 border-teal-500 text-white font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="block text-xs font-bold">{m.label}</span>
                  <span className="text-[10px] text-slate-500">{m.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Options Checklist */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAtsMetadata}
                onChange={(e) => setIncludeAtsMetadata(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
              />
              <span className="text-slate-300 font-semibold">
                Generate high-resolution vector PDF (2.5x rendering scale for crisp printing)
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPlainText}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Copy plain text formatted for job applications"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedText ? "Copied to Clipboard!" : "Copy Plain Text"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Open System Print Dialog"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print Dialog</span>
            </button>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Rendering High-Res PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 fill-slate-950" />
                Download PDF Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
