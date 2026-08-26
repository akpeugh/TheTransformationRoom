import React from "react";
import { AtsScorecard } from "../../types/resume";
import { X, CheckCircle2, AlertCircle, Sparkles, TrendingUp, Key, ShieldCheck } from "lucide-react";

interface AtsScorecardModalProps {
  scorecard: AtsScorecard | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyKeywords?: (keywords: string[]) => void;
}

export const AtsScorecardModal: React.FC<AtsScorecardModalProps> = ({
  scorecard,
  isOpen,
  onClose,
  onApplyKeywords
}) => {
  if (!isOpen || !scorecard) return null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 70) return "text-teal-600 bg-teal-50 border-teal-200";
    if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 70) return "bg-teal-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-md shadow-brand-primary/20">
              <ShieldCheck className="w-5 h-5 text-brand-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">ATS & Impact Diagnostic Scorecard</h2>
              <p className="text-xs text-slate-600 font-medium">The Transformation Room Executive Audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Main Overall Score Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center sm:col-span-1 ${getScoreColor(scorecard.overallScore)}`}>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">ATS Match Index</span>
              <span className="text-4xl font-extrabold my-1">{scorecard.overallScore}%</span>
              <span className="text-[11px] font-bold">
                {scorecard.overallScore >= 85 ? "Excellent Tier" : scorecard.overallScore >= 70 ? "Competitive" : "Needs Optimization"}
              </span>
            </div>

            {/* Sub-Score Bars */}
            <div className="sm:col-span-2 space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 justify-center flex flex-col">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Leadership & Transformation Impact</span>
                  <span>{scorecard.impactScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${getProgressBarColor(scorecard.impactScore)} rounded-full`} style={{ width: `${scorecard.impactScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>ATS Keyword Density & Nomenclature</span>
                  <span>{scorecard.keywordScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${getProgressBarColor(scorecard.keywordScore)} rounded-full`} style={{ width: `${scorecard.keywordScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Clarity & Narrative Flow</span>
                  <span>{scorecard.clarityScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${getProgressBarColor(scorecard.clarityScore)} rounded-full`} style={{ width: `${scorecard.clarityScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Strengths
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {scorecard.strengths?.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-600" /> Strategic Opportunities
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {scorecard.improvements?.map((imp, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended ATS Keywords */}
          {scorecard.suggestedKeywords && scorecard.suggestedKeywords.length > 0 && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-brand-secondary" /> High-Value Keywords Recommended to Inject
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {scorecard.suggestedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 shadow-sm"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-dark transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
