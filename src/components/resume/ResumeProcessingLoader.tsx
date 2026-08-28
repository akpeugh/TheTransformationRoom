import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Search,
  Cpu,
  TrendingUp,
  Award,
  CheckCircle2,
  FileText,
  Lightbulb,
  Zap,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

interface ResumeProcessingLoaderProps {
  statusMessage?: string | null;
  subTitle?: string;
  sourceName?: string;
}

const EXECUTIVE_TIPS = [
  {
    icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
    tag: "Metric Magic",
    title: "Quantify Everything",
    text: "Resumes with specific percentages ($X revenue, +Y% throughput, Z hours saved) experience a 140% higher interview request rate."
  },
  {
    icon: <Sparkles className="w-4 h-4 text-brand-secondary" />,
    tag: "Power Verbs",
    title: "Action-Driven Leadership",
    text: "Swapping passive verbs like 'Responsible for' with 'Spearheaded', 'Architected', or 'Pioneered' immediately establishes executive authority."
  },
  {
    icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
    tag: "ATS Optimization",
    title: "Zero Parse Friction",
    text: "Over 75% of executive resumes pass through parsing algorithms first. We're structuring clean section hierarchies so your credentials shine."
  },
  {
    icon: <Zap className="w-4 h-4 text-amber-400" />,
    tag: "The 6-Second Rule",
    title: "Prime Real Estate",
    text: "Recruiters spend initial focus on your top third. We place your Executive Summary and Standout KPI metrics right where eyes land first."
  },
  {
    icon: <Award className="w-4 h-4 text-teal-400" />,
    tag: "Transformation Wisdom",
    title: "Non-Linear Mastery",
    text: "Diverse background? Frame non-linear transitions around transferable operational frameworks, systems thinking, and leadership agility."
  }
];

const PROCESSING_STAGES = [
  { label: "Scanning document architecture & typography", icon: Search },
  { label: "Defragmenting multi-column text & career timeline", icon: FileText },
  { label: "Classifying technical systems vs. core competencies", icon: Cpu },
  { label: "Quantifying business impact & KPI metrics", icon: TrendingUp },
  { label: "Synthesizing executive narrative & ATS keyword density", icon: Sparkles },
];

export const ResumeProcessingLoader: React.FC<ResumeProcessingLoaderProps> = ({
  statusMessage,
  subTitle = "NOVA Cognitive Engine is actively shaping your executive narrative",
  sourceName
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(18);

  // Auto-rotate tips every 4 seconds
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % EXECUTIVE_TIPS.length);
    }, 4200);
    return () => clearInterval(tipInterval);
  }, []);

  // Step through stages and smoothly increase progress percentage
  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStageIndex(prev => {
        if (prev < PROCESSING_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1400);

    const progressInterval = setInterval(() => {
      setProgressPercent(prev => {
        if (prev < 94) {
          const inc = Math.floor(Math.random() * 5) + 3;
          return Math.min(prev + inc, 96);
        }
        return prev;
      });
    }, 450);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const activeTip = EXECUTIVE_TIPS[currentTipIndex];

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl space-y-6 text-left">
      {/* Top Header with Glowing Icon & Radar Pulse */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500/20 via-indigo-500/20 to-brand-secondary/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/20">
              <Sparkles className="w-6 h-6 animate-pulse text-teal-300" />
            </div>
            {/* Spinning Radar Ring */}
            <div className="absolute -inset-1 rounded-2xl border border-teal-400/40 animate-ping opacity-30 pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                NOVA Resume Synthesis
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[10px] font-black uppercase tracking-wider animate-pulse">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {sourceName ? `Analyzing ${sourceName}...` : subTitle}
            </p>
          </div>
        </div>

        {/* Live Progress Percentage Counter */}
        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-teal-400 via-cyan-300 to-brand-secondary bg-clip-text text-transparent">
            {progressPercent}%
          </span>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Progress
          </span>
        </div>
      </div>

      {/* Animated Glowing Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500 rounded-full relative"
            initial={{ width: "15%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: "easeOut", duration: 0.4 }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </motion.div>
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 px-1 font-medium">
          <span className="flex items-center gap-1.5 text-teal-300">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
            {statusMessage || PROCESSING_STAGES[currentStageIndex]?.label}
          </span>
          <span className="text-slate-500 font-mono text-[10px]">
            Step {currentStageIndex + 1} of {PROCESSING_STAGES.length}
          </span>
        </div>
      </div>

      {/* Live Pipeline Milestones */}
      <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-2.5">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Transformation Pipeline</span>
          <span className="text-teal-400 font-mono">Real-time Stream</span>
        </div>

        <div className="space-y-1.5">
          {PROCESSING_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const Icon = stage.icon;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all ${
                  isCurrent
                    ? "bg-teal-500/10 border border-teal-500/30 text-teal-200 shadow-sm"
                    : isCompleted
                    ? "text-slate-300 opacity-80"
                    : "text-slate-600"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Icon className="w-3.5 h-3.5 text-teal-400 animate-spin shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-700 flex items-center justify-center text-[9px] text-slate-600 shrink-0">
                      {idx + 1}
                    </span>
                  )}
                  <span className={`text-[11px] ${isCurrent ? "font-bold text-white" : ""}`}>
                    {stage.label}
                  </span>
                </div>

                {isCurrent && (
                  <span className="text-[10px] text-teal-400 font-mono uppercase tracking-wider font-semibold animate-pulse">
                    Processing...
                  </span>
                )}
                {isCompleted && (
                  <span className="text-[10px] text-emerald-400 font-mono font-medium">
                    Ready ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fun & Engaging Career Insight Card (Auto-Rotating with manual skip) */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-[11px]">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Executive Tip & Trivia</span>
            <span className="bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[9px] px-1.5 py-0.2 rounded-md uppercase font-black tracking-wider">
              {activeTip.tag}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCurrentTipIndex(prev => (prev + 1) % EXECUTIVE_TIPS.length)}
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-teal-300 transition-colors cursor-pointer"
            title="Next tip"
          >
            <span>Next insight</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTipIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="space-y-1"
          >
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              {activeTip.icon}
              {activeTip.title}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-light">
              {activeTip.text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Mini Keyword Tags */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
        {["P&L Leadership", "Systems Architecture", "Quantified Metrics", "ATS Calibrated", "Executive Letterhead"].map((badge, bIdx) => (
          <span
            key={bIdx}
            className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-400"
          >
            ✨ {badge}
          </span>
        ))}
      </div>
    </div>
  );
};
