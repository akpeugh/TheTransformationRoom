import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Check, 
  Layers, 
  Palette, 
  Type, 
  Sparkles, 
  LayoutGrid, 
  Columns, 
  FileText,
  Sliders,
  ShieldCheck
} from "lucide-react";
import { ResumeTemplateId, ColorTheme, TypographyChoice } from "../../types/resume";

interface TemplateSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: ResumeTemplateId;
  currentColor: ColorTheme;
  currentTypography: TypographyChoice;
  isCompact: boolean;
  onSelectTemplate: (template: ResumeTemplateId) => void;
  onSelectColor: (color: ColorTheme) => void;
  onSelectTypography: (typography: TypographyChoice) => void;
  onToggleCompact: (compact: boolean) => void;
}

interface TemplateOption {
  id: ResumeTemplateId;
  name: string;
  badge: string;
  category: "Executive" | "Modern" | "Technical" | "ATS-Optimized";
  description: string;
  atsRating: number;
  columns: "Single Column" | "Two Column" | "Hybrid Header";
  keyFeatures: string[];
}

export const TemplateSwitcherModal: React.FC<TemplateSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentTemplate,
  currentColor,
  currentTypography,
  isCompact,
  onSelectTemplate,
  onSelectColor,
  onSelectTypography,
  onToggleCompact
}) => {
  const [filterCategory, setFilterCategory] = React.useState<string>("All");

  if (!isOpen) return null;

  const templates: TemplateOption[] = [
    {
      id: "transformation-teal",
      name: "Transformation Teal",
      badge: "Signature Brand",
      category: "Executive",
      description: "Our signature executive layout featuring top metric callout pills, bold transformation badge, and clear chronological achievements.",
      atsRating: 98,
      columns: "Single Column",
      keyFeatures: ["Metric highlight pills", "Executive title banner", "Spacious narrative structure"]
    },
    {
      id: "executive-onyx",
      name: "Executive Onyx",
      badge: "Boardroom Classic",
      category: "Executive",
      description: "High-contrast boardroom banner with rich serif typography, authoritative header, and executive governance alignment.",
      atsRating: 96,
      columns: "Single Column",
      keyFeatures: ["Boardroom dark banner", "Serif header pairing", "Clear strategic division"]
    },
    {
      id: "minimalist-studio",
      name: "Minimalist Studio",
      badge: "Pure ATS Standard",
      category: "ATS-Optimized",
      description: "Clean Swiss minimalist layout engineered specifically for maximum ATS parsing accuracy and conservative corporate screens.",
      atsRating: 100,
      columns: "Single Column",
      keyFeatures: ["100% ATS parser compliant", "Zero graphical clutter", "Standardized linear flow"]
    },
    {
      id: "technical-velocity",
      name: "Technical Velocity",
      badge: "Systems & Engineering",
      category: "Technical",
      description: "Two-column density architecture with a dedicated technical skills & telemetry sidebar and wide experience impact column.",
      atsRating: 94,
      columns: "Two Column",
      keyFeatures: ["Technical sidebar", "Skills stack badges", "Project showcase section"]
    },
    {
      id: "modern-split",
      name: "Modern Split",
      badge: "Contemporary",
      category: "Modern",
      description: "Contemporary split-header layout with right-aligned contact card and balanced negative space for directors and founders.",
      atsRating: 97,
      columns: "Hybrid Header",
      keyFeatures: ["Split header format", "Compact contact stack", "Category-tagged skills"]
    }
  ];

  const colorsList: { id: ColorTheme; label: string; bgClass: string; hex: string }[] = [
    { id: "teal", label: "Transformation Teal", bgClass: "bg-teal-600", hex: "#0d9488" },
    { id: "slate", label: "Boardroom Onyx", bgClass: "bg-slate-900", hex: "#0f172a" },
    { id: "navy", label: "Enterprise Navy", bgClass: "bg-blue-900", hex: "#1e3a8a" },
    { id: "emerald", label: "Growth Emerald", bgClass: "bg-emerald-700", hex: "#047857" },
    { id: "plum", label: "Royal Plum", bgClass: "bg-purple-900", hex: "#581c87" },
    { id: "bronze", label: "Executive Bronze", bgClass: "bg-amber-800", hex: "#92400e" },
    { id: "cobalt", label: "Modern Cobalt", bgClass: "bg-blue-600", hex: "#2563eb" },
    { id: "burgundy", label: "Classic Burgundy", bgClass: "bg-rose-900", hex: "#881337" },
    { id: "copper", label: "Warm Copper", bgClass: "bg-orange-700", hex: "#c2410c" },
    { id: "indigo", label: "Midnight Indigo", bgClass: "bg-indigo-700", hex: "#4338ca" },
    { id: "forest", label: "Alpine Forest", bgClass: "bg-emerald-900", hex: "#14532d" },
    { id: "rose", label: "Rosewood Executive", bgClass: "bg-rose-700", hex: "#be123c" }
  ];

  const typographyList: { id: TypographyChoice; label: string; desc: string; sample: string; fontClass: string }[] = [
    { id: "modern", label: "Modern Sans", desc: "Clean, high-velocity readability", sample: "Transformation & Systems", fontClass: "font-sans" },
    { id: "executive", label: "Executive Serif", desc: "Authoritative & boardroom-ready", sample: "Operational Governance", fontClass: "font-serif" },
    { id: "editorial", label: "Editorial Serif", desc: "Sophisticated, distinguished elegance", sample: "Strategic Leadership", fontClass: "font-serif" },
    { id: "tech", label: "Tech Mono", desc: "Data-driven systems & infrastructure", sample: "TELEMETRY & SCALE", fontClass: "font-mono text-xs" }
  ];

  const filteredTemplates = filterCategory === "All" 
    ? templates 
    : templates.filter(t => t.category === filterCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Executive Template & Style Studio
                <span className="text-[10px] bg-brand-secondary/20 text-brand-secondary px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  5 Layouts
                </span>
              </h2>
              <p className="text-xs text-slate-400">Select an executive architecture, customized accent palette, and typography pairing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
              {["All", "Executive", "ATS-Optimized", "Technical", "Modern"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    filterCategory === cat
                      ? "bg-teal-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Layout Density:</span>
              <button
                onClick={() => onToggleCompact(!isCompact)}
                className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isCompact
                    ? "bg-brand-primary text-white border-brand-primary/50"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                {isCompact ? "Compact / High Density (1 Page)" : "Standard Executive Spacing"}
              </button>
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((tpl) => {
              const isSelected = currentTemplate === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => onSelectTemplate(tpl.id)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between group ${
                    isSelected
                      ? "bg-slate-800/90 border-teal-500 ring-2 ring-teal-500/30 shadow-xl shadow-teal-500/10"
                      : "bg-slate-850 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60"
                  }`}
                >
                  {/* Top Badges */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        {tpl.badge}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> {tpl.atsRating}% ATS
                      </span>
                    </div>

                    {/* Mini Wireframe Preview Mockup */}
                    <div className="h-28 bg-white rounded-lg p-2.5 mb-3 border border-slate-200/40 shadow-inner overflow-hidden flex flex-col justify-between pointer-events-none">
                      {tpl.id === "transformation-teal" && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                            <div>
                              <div className="w-20 h-2 bg-slate-900 rounded-sm" />
                              <div className="w-12 h-1.5 bg-teal-600 rounded-sm mt-0.5" />
                            </div>
                            <div className="flex gap-1">
                              <div className="w-6 h-3 bg-teal-100 rounded-xs" />
                              <div className="w-6 h-3 bg-teal-100 rounded-xs" />
                            </div>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-xs" />
                          <div className="w-4/5 h-1.5 bg-slate-200 rounded-xs" />
                          <div className="w-16 h-1.5 bg-teal-600 rounded-xs mt-1" />
                          <div className="space-y-1 pl-2 border-l border-teal-500">
                            <div className="w-full h-1 bg-slate-300 rounded-xs" />
                            <div className="w-5/6 h-1 bg-slate-300 rounded-xs" />
                          </div>
                        </div>
                      )}

                      {tpl.id === "executive-onyx" && (
                        <div className="space-y-1.5">
                          <div className="bg-slate-900 -m-2.5 p-2 mb-1 flex justify-between items-center">
                            <div className="w-24 h-2 bg-white rounded-sm" />
                            <div className="w-10 h-1.5 bg-slate-300 rounded-sm" />
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-xs mt-2" />
                          <div className="w-3/4 h-1.5 bg-slate-200 rounded-xs" />
                          <div className="w-20 h-1.5 bg-slate-900 rounded-xs" />
                          <div className="w-full h-1 bg-slate-300 rounded-xs" />
                          <div className="w-4/5 h-1 bg-slate-300 rounded-xs" />
                        </div>
                      )}

                      {tpl.id === "minimalist-studio" && (
                        <div className="space-y-1.5 text-center flex flex-col items-center">
                          <div className="w-28 h-2 bg-slate-900 rounded-sm" />
                          <div className="w-16 h-1.5 bg-slate-500 rounded-sm" />
                          <div className="w-full border-t border-slate-300 my-1" />
                          <div className="w-full h-1.5 bg-slate-200 rounded-xs" />
                          <div className="w-5/6 h-1.5 bg-slate-200 rounded-xs" />
                          <div className="w-full flex justify-between pt-1">
                            <div className="w-20 h-1 bg-slate-400 rounded-xs" />
                            <div className="w-12 h-1 bg-slate-300 rounded-xs" />
                          </div>
                        </div>
                      )}

                      {tpl.id === "technical-velocity" && (
                        <div className="flex h-full gap-2">
                          <div className="w-1/3 bg-slate-100 -m-2.5 p-2 border-r border-slate-200 space-y-1">
                            <div className="w-12 h-2 bg-slate-900 rounded-xs" />
                            <div className="w-8 h-1 bg-teal-600 rounded-xs" />
                            <div className="w-full h-1 bg-slate-300 rounded-xs mt-2" />
                            <div className="w-full h-1 bg-slate-300 rounded-xs" />
                            <div className="w-full h-1 bg-slate-300 rounded-xs" />
                          </div>
                          <div className="w-2/3 space-y-1 pl-1">
                            <div className="w-16 h-1.5 bg-teal-600 rounded-xs" />
                            <div className="w-full h-1 bg-slate-200 rounded-xs" />
                            <div className="w-full h-1 bg-slate-200 rounded-xs" />
                            <div className="w-20 h-1.5 bg-teal-600 rounded-xs mt-2" />
                            <div className="w-full h-1 bg-slate-300 rounded-xs" />
                          </div>
                        </div>
                      )}

                      {tpl.id === "modern-split" && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start border-b border-slate-200 pb-1">
                            <div>
                              <div className="w-20 h-2 bg-slate-900 rounded-sm" />
                              <div className="w-14 h-1.5 bg-teal-600 rounded-sm mt-0.5" />
                            </div>
                            <div className="space-y-0.5 text-right">
                              <div className="w-10 h-1 bg-slate-400 rounded-xs ml-auto" />
                              <div className="w-8 h-1 bg-slate-400 rounded-xs ml-auto" />
                            </div>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-xs" />
                          <div className="w-16 h-1.5 bg-teal-600 rounded-xs" />
                          <div className="w-full h-1 bg-slate-300 rounded-xs" />
                          <div className="w-4/5 h-1 bg-slate-300 rounded-xs" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-white text-sm mb-1">{tpl.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{tpl.description}</p>
                  </div>

                  {/* Key feature pills */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">{tpl.columns}</span>
                    {isSelected ? (
                      <span className="text-xs font-bold text-teal-400 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Active
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 group-hover:text-teal-300 font-semibold transition-colors">
                        Select Template →
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Palette & Typography Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            {/* Color Palettes */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-brand-secondary" /> Accent Color Theme (12 Options):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {colorsList.map((col) => {
                  const isColorActive = currentColor === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => onSelectColor(col.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isColorActive
                          ? "bg-slate-800 border-teal-500 ring-1 ring-teal-500"
                          : "bg-slate-900 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full ${col.bgClass} shrink-0 shadow`} />
                      <div className="truncate">
                        <span className="text-xs font-bold text-white block truncate">{col.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography Selector */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                <Type className="w-4 h-4 text-brand-secondary" /> Typography Pairing:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {typographyList.map((typ) => {
                  const isTypeActive = currentTypography === typ.id;
                  return (
                    <button
                      key={typ.id}
                      onClick={() => onSelectTypography(typ.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isTypeActive
                          ? "bg-slate-800 border-teal-500 ring-1 ring-teal-500"
                          : "bg-slate-900 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">{typ.label}</span>
                        {isTypeActive && <Check className="w-3.5 h-3.5 text-teal-400" />}
                      </div>
                      <div className={`text-[11px] text-teal-300 mt-1 ${typ.fontClass}`}>
                        {typ.sample}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-teal-500/20"
          >
            Apply & View Resume
          </button>
        </div>
      </div>
    </div>
  );
};
