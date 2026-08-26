import React from "react";
import { X, Sparkles, Check, ArrowRight, Loader2, BarChart2, Users, Cpu } from "lucide-react";

interface BulletEnhancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalBullet: string;
  targetRole?: string;
  variations: {
    metricFocused?: string;
    leadershipFocused?: string;
    transformationFocused?: string;
  } | null;
  isLoading: boolean;
  onSelectVariation: (text: string) => void;
}

export const BulletEnhancerModal: React.FC<BulletEnhancerModalProps> = ({
  isOpen,
  onClose,
  originalBullet,
  targetRole,
  variations,
  isLoading,
  onSelectVariation
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <Sparkles className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Bullet Point Polisher</h2>
              <p className="text-xs text-slate-500">Transform passive duties into executive transformation achievements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Original Bullet */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Original Bullet Point</span>
            <p className="text-xs text-slate-700 italic">"{originalBullet}"</p>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-brand-secondary animate-spin" />
              <p className="text-xs font-bold text-slate-700">Synthesizing 3 executive variations...</p>
              <p className="text-[11px] text-slate-400">Applying "Action Verb + Context + Quantifiable Metric" structure</p>
            </div>
          ) : variations ? (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Choose Your Preferred Angle:</span>

              {/* Option 1: Metric-Focused */}
              {variations.metricFocused && (
                <div
                  onClick={() => onSelectVariation(variations.metricFocused!)}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/40 transition-all cursor-pointer group space-y-1.5 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                      <BarChart2 className="w-3.5 h-3.5" /> High-Impact & Metrics Angle
                    </span>
                    <span className="text-[11px] font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Select <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {variations.metricFocused}
                  </p>
                </div>
              )}

              {/* Option 2: Leadership-Focused */}
              {variations.leadershipFocused && (
                <div
                  onClick={() => onSelectVariation(variations.leadershipFocused!)}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/40 transition-all cursor-pointer group space-y-1.5 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Leadership & Stakeholder Alignment Angle
                    </span>
                    <span className="text-[11px] font-bold text-indigo-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Select <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {variations.leadershipFocused}
                  </p>
                </div>
              )}

              {/* Option 3: Transformation-Focused */}
              {variations.transformationFocused && (
                <div
                  onClick={() => onSelectVariation(variations.transformationFocused!)}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-500 hover:bg-amber-50/40 transition-all cursor-pointer group space-y-1.5 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" /> Systems Thinking & Automation Angle
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Select <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {variations.transformationFocused}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">Click below to generate suggestions.</p>
          )}
        </div>
      </div>
    </div>
  );
};
