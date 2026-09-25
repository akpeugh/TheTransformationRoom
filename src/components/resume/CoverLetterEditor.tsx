import React, { useState } from "react";
import { CoverLetterData, ResumeData, CoverLetterHighlight } from "../../types/resume";
import { VoiceInputButton } from "../VoiceInputButton";
import { 
  Sparkles, 
  Loader2, 
  RefreshCcw, 
  Building2, 
  User, 
  FileText, 
  CheckCircle2, 
  MessageSquare,
  Plus,
  Trash2,
  Sliders,
  AlignLeft,
  AlignCenter,
  PenTool,
  Wand2
} from "lucide-react";

interface CoverLetterEditorProps {
  data: CoverLetterData;
  resumeData: ResumeData;
  onChange: (data: CoverLetterData) => void;
  onGenerateAI: (options: { companyName: string; hiringManager: string; targetRole: string; tone: string; jobDescription: string }) => void;
  isGeneratingAI?: boolean;
  alternativeOpenings?: string[];
  talkingPoints?: string[];
}

export const CoverLetterEditor: React.FC<CoverLetterEditorProps> = ({
  data,
  resumeData,
  onChange,
  onGenerateAI,
  isGeneratingAI = false,
  alternativeOpenings = [],
  talkingPoints = []
}) => {
  const [companyName, setCompanyName] = useState(data.recipient.companyName || "Horizon Advanced Logistics");
  const [hiringManager, setHiringManager] = useState(data.recipient.hiringManagerName || "Hiring Manager");
  const [targetRole, setTargetRole] = useState(data.targetRole || resumeData.personalInfo.targetTitle || "Operations Transformation Director");
  const [tone, setTone] = useState("Executive & Strategic");
  const [jobDescription, setJobDescription] = useState("");

  const updateField = (field: keyof CoverLetterData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateSender = (field: keyof CoverLetterData["sender"], value: string) => {
    onChange({
      ...data,
      sender: {
        ...data.sender,
        [field]: value
      }
    });
  };

  const updateRecipient = (field: keyof CoverLetterData["recipient"], value: string) => {
    onChange({
      ...data,
      recipient: {
        ...data.recipient,
        [field]: value
      }
    });
  };

  // Automated generator from current resume data matching the executive attachment format
  const handleAutomateFromResume = () => {
    const candidateName = resumeData.personalInfo.fullName || "Candidate Name";
    const currentExp = resumeData.experiences[0];
    const latestCompany = currentExp?.company || "Current Company";
    const latestRole = currentExp?.role || "Director of Operations & Strategy";
    const topRole = targetRole || resumeData.personalInfo.targetTitle || "Operations Strategy Leader";
    const compName = companyName || "Target Company";
    
    // Extract top domains/skills from resume
    const extractedSkills = resumeData.skills.flatMap(s => s.skills).slice(0, 4);
    const domain1 = extractedSkills[0] || "operational transformation";
    const domain2 = extractedSkills[1] || "analytics & telemetry";
    const domain3 = extractedSkills[2] || "distribution strategy";
    const domain4 = extractedSkills[3] || "process optimization";

    // Auto-generate highlights from actual experience highlights
    const highlights: CoverLetterHighlight[] = [
      {
        label: extractedSkills[0] || "Operations & Strategy",
        text: currentExp?.highlights[0] || "Partnered with Executive Leadership on modernization initiatives, driving double-digit efficiency gains and throughput acceleration."
      },
      {
        label: extractedSkills[1] || "Financial & Process Analytics",
        text: currentExp?.highlights[1] || "Delivered variance analysis, cost projections, and KPI insights to eliminate operating friction and identify key growth opportunities."
      },
      {
        label: extractedSkills[2] || "Labor & Workforce Planning",
        text: currentExp?.highlights[2] || "Supported labor modeling, flexible scheduling, and technology adoption initiatives to align frontline staffing with customer demand."
      },
      {
        label: extractedSkills[3] || "Strategic Business Partnership",
        text: resumeData.experiences[1]?.highlights[0] || "Developed cross-functional analytics supporting network optimization, CapEx planning, and executive steering committee decision-making."
      }
    ];

    const automatedData: CoverLetterData = {
      ...data,
      sender: {
        fullName: candidateName,
        title: topRole,
        email: resumeData.personalInfo.email,
        phone: resumeData.personalInfo.phone,
        location: resumeData.personalInfo.location,
        linkedin: resumeData.personalInfo.linkedin
      },
      recipient: {
        hiringManagerName: hiringManager || "Hiring Manager",
        hiringManagerTitle: "Executive Talent Acquisition",
        companyName: compName,
        companyAddress: ""
      },
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      targetRole: topRole,
      salutation: "Dear Hiring Manager,",
      openingParagraph: `I am excited to apply for the ${topRole} role at ${compName}. With more than a decade of experience across ${domain1}, ${domain2}, ${domain3}, and ${domain4}, I believe my background would allow me to contribute quickly in this role.`,
      currentPositionParagraph: `In my current position as ${latestRole} at ${latestCompany}, I partner with operations and finance leaders to turn operational data into actionable business decisions. My experience includes P&L analysis, budgeting and forecasting, labor planning, expense management, network optimization, and executive decision support.`,
      scopeAlignmentParagraph: `While my current scope is broader than a traditional ${topRole} role, this opportunity aligns closely with the work I have built my career around and where I can add immediate value.`,
      highlightsHeader: "Highlights of my experience include:",
      highlights: highlights,
      bodyParagraphs: [],
      companyInterestParagraph: `I am particularly interested in ${compName} because of the opportunity to stay close to operational excellence while bringing a broader understanding of analytics and systems strategy. I would welcome the opportunity to discuss how my experience could support the team.`,
      thankYouLine: "Thank you for your consideration.",
      closingParagraph: "",
      signoff: "Kind regards,",
      enclosureNotice: "Enclosure: Résumé",
      headerLayout: "centered-letterhead",
      signatureStyle: "script-signature"
    };

    onChange(automatedData);
  };

  const updateHighlight = (index: number, field: "label" | "text", value: string) => {
    const list = [...(data.highlights || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      onChange({ ...data, highlights: list });
    }
  };

  const addHighlight = () => {
    const list = [...(data.highlights || [])];
    list.push({
      label: "Core Competency",
      text: "Partnered with cross-functional leadership to drive measurable performance gains..."
    });
    onChange({ ...data, highlights: list });
  };

  const removeHighlight = (index: number) => {
    const list = (data.highlights || []).filter((_, i) => i !== index);
    onChange({ ...data, highlights: list });
  };

  const handleGenerate = () => {
    onGenerateAI({
      companyName,
      hiringManager,
      targetRole,
      tone,
      jobDescription
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Quick Action Bar: 1-Click Automate & Layout Selector */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={handleAutomateFromResume}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02]"
            title="Automatically generates executive intro, current scope, highlight bullets, and company alignment matching the reference format"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Auto-Fill Executive Format
          </button>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Matches structured reference format with editable fields
          </span>
        </div>

        {/* Layout Style Switcher */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => updateField("headerLayout", "centered-letterhead")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              (data.headerLayout || "centered-letterhead") === "centered-letterhead"
                ? "bg-teal-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Executive Centered Letterhead with Tracked Name & Signature"
          >
            <AlignCenter className="w-3 h-3" /> Centered Letterhead
          </button>
          <button
            onClick={() => updateField("headerLayout", "modern-split")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              data.headerLayout === "modern-split"
                ? "bg-teal-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Modern Split Left/Right Layout"
          >
            <AlignLeft className="w-3 h-3" /> Modern Split
          </button>
        </div>
      </div>

      {/* AI Tailoring Control Card */}
      <div className="bg-gradient-to-br from-brand-primary to-slate-900 text-white p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-secondary/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Cover Letter Generator & Job Tailoring</h3>
              <p className="text-[11px] text-slate-300">Generates custom paragraphs and key highlights tailored to the target role.</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-black tracking-widest text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded-full">
            Copilot
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block mb-1">Target Company</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                updateRecipient("companyName", e.target.value);
              }}
              placeholder="e.g. UNFI or Horizon Logistics"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-400 outline-none focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block mb-1">Target Position</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => {
                setTargetRole(e.target.value);
                updateField("targetRole", e.target.value);
              }}
              placeholder="e.g. Operations Finance Manager"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-400 outline-none focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block mb-1">Hiring Manager / Team</label>
            <input
              type="text"
              value={hiringManager}
              onChange={(e) => {
                setHiringManager(e.target.value);
                updateRecipient("hiringManagerName", e.target.value);
              }}
              placeholder="e.g. Hiring Manager"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-400 outline-none focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block mb-1">Voice & Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-xl text-xs text-white outline-none focus:border-brand-secondary"
            >
              <option>Executive & Strategic</option>
              <option>High-Impact & Metrics-Driven</option>
              <option>Finance & Operations Specialist</option>
              <option>Visionary Transformation</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-300">Target Job Description / Key Requirements (Optional)</label>
            <VoiceInputButton
              onTranscript={(spoken) => {
                const current = jobDescription || "";
                const sep = current.trim() ? " " : "";
                setJobDescription(current + sep + spoken);
              }}
              label="Talk to Text"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            />
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={2}
            placeholder="Paste or speak keywords from job description (e.g. P&L analysis, forecasting, labor planning, distribution strategy)..."
            className="w-full p-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-400 outline-none focus:border-brand-secondary resize-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGeneratingAI}
          className="w-full py-3 bg-brand-secondary text-brand-primary rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.01] transition-all shadow-lg cursor-pointer disabled:opacity-50"
        >
          {isGeneratingAI ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Crafting Tailored Cover Letter...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate & Tailor Cover Letter
            </>
          )}
        </button>
      </div>

      {/* Alternative Opening Hooks (if generated) */}
      {alternativeOpenings && alternativeOpenings.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-secondary" /> Choose Alternate Opening Hook
          </h4>
          <div className="space-y-2">
            {alternativeOpenings.map((opening, idx) => (
              <button
                key={idx}
                onClick={() => updateField("openingParagraph", opening)}
                className={`text-left p-3 rounded-xl border text-xs leading-relaxed transition-all w-full cursor-pointer ${
                  data.openingParagraph === opening
                    ? "bg-teal-50/70 border-teal-600 text-slate-900 font-medium"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {opening}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interview Talking Points (if generated) */}
      {talkingPoints && talkingPoints.length > 0 && (
        <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" /> Recommended Interview Talking Points
          </h4>
          <ul className="space-y-1 text-xs text-amber-900 list-disc list-inside">
            {talkingPoints.map((tp, idx) => (
              <li key={idx} className="leading-relaxed">{tp}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Structured Executive Cover Letter Editor Sections */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" /> Executive Letter Structure & Content
          </h3>
          <span className="text-[11px] font-semibold text-slate-600">
            Edit text or customize format
          </span>
        </div>

        {/* Salutation */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mb-1">
            1. Salutation
          </label>
          <input
            type="text"
            value={data.salutation || "Dear Hiring Manager,"}
            onChange={(e) => updateField("salutation", e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
          />
        </div>

        {/* 2. Opening Paragraph */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-700">
              2. Opening Intro (Role, Company & Core Domains)
            </label>
            <span className="text-[10px] text-teal-700 font-bold">
              Format: Target Role + Company + Experience Background
            </span>
          </div>
          <textarea
            value={data.openingParagraph}
            onChange={(e) => updateField("openingParagraph", e.target.value)}
            rows={3}
            className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 leading-relaxed focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all resize-y placeholder:text-slate-400"
          />
        </div>

        {/* 3. Current Position & Scope */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mb-1">
            3. Current Position & Scope (Leadership & Stakeholder Partnership)
          </label>
          <textarea
            value={data.currentPositionParagraph || ""}
            onChange={(e) => updateField("currentPositionParagraph", e.target.value)}
            rows={3}
            placeholder="In my current position as [Role] at [Company], I partner with leaders to turn data into actionable decisions. My experience includes..."
            className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 leading-relaxed focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all resize-y placeholder:text-slate-400"
          />
        </div>

        {/* 4. Scope Alignment & Bridge */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mb-1">
            4. Scope Alignment & Value Proposition
          </label>
          <textarea
            value={data.scopeAlignmentParagraph || ""}
            onChange={(e) => updateField("scopeAlignmentParagraph", e.target.value)}
            rows={2}
            placeholder="While my current scope is broader than a traditional role, this opportunity aligns closely with where I can add immediate value..."
            className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 leading-relaxed focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all resize-y placeholder:text-slate-400"
          />
        </div>

        {/* 5. Highlights Section */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                5. Highlights of Experience (Key Achievements with Category Labels)
              </label>
              <input
                type="text"
                value={data.highlightsHeader || "Highlights of my experience include:"}
                onChange={(e) => updateField("highlightsHeader", e.target.value)}
                className="text-xs font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-400 focus:border-teal-600 outline-none mt-1 pb-0.5"
              />
            </div>
            <button
              onClick={addHighlight}
              className="flex items-center gap-1 text-[11px] font-bold text-teal-800 hover:text-teal-950 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-300 cursor-pointer shadow-xs"
            >
              <Plus className="w-3 h-3" /> Add Highlight
            </button>
          </div>

          <div className="space-y-3">
            {(data.highlights || []).map((highlight, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-700">Category / Skill Tag</label>
                    <input
                      type="text"
                      value={highlight.label}
                      onChange={(e) => updateHighlight(idx, "label", e.target.value)}
                      placeholder="e.g. Operations Finance or Labor & Workforce Planning"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:border-teal-600 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    onClick={() => removeHighlight(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer mt-4"
                    title="Remove bullet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-700">Accomplishment & Impact</label>
                  <textarea
                    value={highlight.text}
                    onChange={(e) => updateHighlight(idx, "text", e.target.value)}
                    rows={2}
                    placeholder="Action + context + quantifiable result..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed font-medium text-slate-900 focus:border-teal-600 outline-none resize-y placeholder:text-slate-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Company Interest Paragraph */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mb-1">
            6. Target Company Interest & Strategic Alignment
          </label>
          <textarea
            value={data.companyInterestParagraph || ""}
            onChange={(e) => updateField("companyInterestParagraph", e.target.value)}
            rows={3}
            placeholder="I am particularly interested in [Company] because of the opportunity to... I would welcome the opportunity to discuss how my experience could support the team."
            className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 leading-relaxed focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all resize-y placeholder:text-slate-400"
          />
        </div>

        {/* 7. Thank You line */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mb-1">
            7. Consideration Note
          </label>
          <input
            type="text"
            value={data.thankYouLine || "Thank you for your consideration."}
            onChange={(e) => updateField("thankYouLine", e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 outline-none"
          />
        </div>

        {/* 8. Sign-off Line & Enclosure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mb-1">
              Sign-off Closing
            </label>
            <input
              type="text"
              value={data.signoff || "Kind regards,"}
              onChange={(e) => updateField("signoff", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mb-1">
              Enclosure Notice
            </label>
            <input
              type="text"
              value={data.enclosureNotice || "Enclosure: Résumé"}
              onChange={(e) => updateField("enclosureNotice", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
