import React from "react";
import { ResumeData, ResumeTemplateId, ColorTheme, TypographyChoice } from "../../types/resume";
import { Mail, Phone, MapPin, Globe, Linkedin, Award, Briefcase, GraduationCap, CheckCircle2, Zap } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
  template: ResumeTemplateId;
  colorTheme: ColorTheme;
  typography: TypographyChoice;
  isCompact?: boolean;
  onEditSection?: (section: string) => void;
}

const themeColorMap: Record<ColorTheme, { primary: string; primaryHex: string; secondary: string; lightBg: string; border: string; badgeBg: string; text: string }> = {
  teal: {
    primary: "text-teal-600",
    primaryHex: "#0d9488",
    secondary: "bg-teal-600 text-white",
    lightBg: "bg-teal-50/70",
    border: "border-teal-600",
    badgeBg: "bg-teal-100/70 text-teal-800",
    text: "text-teal-700"
  },
  slate: {
    primary: "text-slate-900",
    primaryHex: "#0f172a",
    secondary: "bg-slate-900 text-white",
    lightBg: "bg-slate-50",
    border: "border-slate-900",
    badgeBg: "bg-slate-200/80 text-slate-900",
    text: "text-slate-900"
  },
  navy: {
    primary: "text-blue-900",
    primaryHex: "#1e3a8a",
    secondary: "bg-blue-900 text-white",
    lightBg: "bg-blue-50/60",
    border: "border-blue-900",
    badgeBg: "bg-blue-100 text-blue-900",
    text: "text-blue-900"
  },
  emerald: {
    primary: "text-emerald-700",
    primaryHex: "#047857",
    secondary: "bg-emerald-700 text-white",
    lightBg: "bg-emerald-50/60",
    border: "border-emerald-700",
    badgeBg: "bg-emerald-100 text-emerald-800",
    text: "text-emerald-800"
  },
  plum: {
    primary: "text-purple-900",
    primaryHex: "#581c87",
    secondary: "bg-purple-900 text-white",
    lightBg: "bg-purple-50/60",
    border: "border-purple-900",
    badgeBg: "bg-purple-100 text-purple-900",
    text: "text-purple-900"
  },
  bronze: {
    primary: "text-amber-800",
    primaryHex: "#92400e",
    secondary: "bg-amber-800 text-white",
    lightBg: "bg-amber-50/60",
    border: "border-amber-800",
    badgeBg: "bg-amber-100 text-amber-900",
    text: "text-amber-900"
  },
  cobalt: {
    primary: "text-blue-600",
    primaryHex: "#2563eb",
    secondary: "bg-blue-600 text-white",
    lightBg: "bg-blue-50/70",
    border: "border-blue-600",
    badgeBg: "bg-blue-100 text-blue-800",
    text: "text-blue-700"
  },
  burgundy: {
    primary: "text-rose-900",
    primaryHex: "#881337",
    secondary: "bg-rose-900 text-white",
    lightBg: "bg-rose-50/60",
    border: "border-rose-900",
    badgeBg: "bg-rose-100 text-rose-900",
    text: "text-rose-950"
  },
  copper: {
    primary: "text-orange-700",
    primaryHex: "#c2410c",
    secondary: "bg-orange-700 text-white",
    lightBg: "bg-orange-50/60",
    border: "border-orange-700",
    badgeBg: "bg-orange-100 text-orange-900",
    text: "text-orange-900"
  },
  indigo: {
    primary: "text-indigo-700",
    primaryHex: "#4338ca",
    secondary: "bg-indigo-700 text-white",
    lightBg: "bg-indigo-50/60",
    border: "border-indigo-700",
    badgeBg: "bg-indigo-100 text-indigo-900",
    text: "text-indigo-900"
  },
  forest: {
    primary: "text-emerald-900",
    primaryHex: "#14532d",
    secondary: "bg-emerald-900 text-white",
    lightBg: "bg-emerald-50/60",
    border: "border-emerald-900",
    badgeBg: "bg-emerald-100 text-emerald-950",
    text: "text-emerald-950"
  },
  rose: {
    primary: "text-rose-700",
    primaryHex: "#be123c",
    secondary: "bg-rose-700 text-white",
    lightBg: "bg-rose-50/60",
    border: "border-rose-700",
    badgeBg: "bg-rose-100 text-rose-800",
    text: "text-rose-800"
  }
};

const fontClassMap: Record<TypographyChoice, { font: string; headingFont: string }> = {
  modern: {
    font: "font-sans",
    headingFont: "font-sans font-bold tracking-tight"
  },
  executive: {
    font: "font-sans",
    headingFont: "font-serif font-bold tracking-normal"
  },
  editorial: {
    font: "font-serif",
    headingFont: "font-serif font-bold"
  },
  tech: {
    font: "font-mono text-xs",
    headingFont: "font-mono font-bold tracking-wider uppercase"
  }
};

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  data,
  template,
  colorTheme,
  typography,
  isCompact = false,
}) => {
  const theme = themeColorMap[colorTheme] || themeColorMap.teal;
  const fonts = fontClassMap[typography] || fontClassMap.modern;
  const spacingClass = isCompact ? "space-y-4" : "space-y-6";
  const itemSpacingClass = isCompact ? "space-y-2.5" : "space-y-4";
  const paddingClass = isCompact ? "p-8" : "p-10 md:p-12";

  // Template 1: Transformation Teal (Signature Modern Brand)
  if (template === "transformation-teal") {
    return (
      <div 
        id="resume-printable-area" 
        className={`bg-white text-slate-800 ${fonts.font} ${paddingClass} shadow-xl rounded-sm w-full max-w-[850px] mx-auto min-h-[1100px] border border-slate-200/80 print:shadow-none print:border-none print:p-8 print:m-0`}
      >
        {/* Header Bar */}
        <div className="border-b-2 border-slate-100 pb-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className={`text-[11px] font-black uppercase tracking-[0.25em] ${theme.primary} mb-1 block`}>
                Transformation Profile
              </span>
              <h1 className={`text-3xl md:text-4xl text-slate-900 ${fonts.headingFont}`}>
                {data.personalInfo.fullName || "Candidate Name"}
              </h1>
              <p className="text-base font-semibold text-slate-600 mt-1">
                {data.personalInfo.targetTitle || "Target Role / Specialization"}
              </p>
            </div>
            {/* Contact details */}
            <div className="flex flex-wrap md:flex-col md:items-end gap-2 md:gap-1 text-xs text-slate-500">
              {data.personalInfo.email && (
                <span className="flex items-center gap-1.5 hover:text-slate-900">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {data.personalInfo.email}
                </span>
              )}
              {data.personalInfo.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {data.personalInfo.phone}
                </span>
              )}
              {data.personalInfo.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {data.personalInfo.location}
                </span>
              )}
              {data.personalInfo.linkedin && (
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Linkedin className="w-3.5 h-3.5 text-slate-400" /> {data.personalInfo.linkedin}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Top Key Metrics Banner (if present) */}
        {data.metrics && data.metrics.length > 0 && (
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${theme.lightBg} p-4 rounded-xl border border-slate-100 mb-6 print:border-slate-200`}>
            {data.metrics.map((metric, i) => {
              const val = typeof metric === "object" && metric ? (metric.value || "") : String(metric || "");
              const lbl = typeof metric === "object" && metric ? (metric.label || "Metric") : `Metric ${i + 1}`;
              if (!val) return null;
              return (
                <div key={i} className="text-center">
                  <div className={`text-xl font-extrabold ${theme.primary}`}>{val}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mt-0.5">{lbl}</div>
                </div>
              );
            })}
          </div>
        )}

        <div className={spacingClass}>
          {/* Executive Summary */}
          {data.summary && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${theme.primary} flex items-center gap-2 mb-2 pb-1 border-b border-slate-100`}>
                <Zap className="w-3.5 h-3.5" /> Executive Summary & Value Proposition
              </h2>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal text-justify">
                {data.summary}
              </p>
            </div>
          )}

          {/* Core Skills & Systems Grid */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${theme.primary} flex items-center gap-2 mb-2 pb-1 border-b border-slate-100`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Core Competencies & Technical Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {data.skills.map((skillCat) => (
                  <div key={skillCat.id || skillCat.category} className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-800 block text-[11px] mb-1">{skillCat.category}:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {skillCat.skills.map((skill, idx) => (
                        <span key={idx} className={`px-2 py-0.5 rounded text-[10px] font-medium ${theme.badgeBg}`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professional Experience */}
          {data.experiences && data.experiences.length > 0 && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${theme.primary} flex items-center gap-2 mb-3 pb-1 border-b border-slate-100`}>
                <Briefcase className="w-3.5 h-3.5" /> Professional Experience & Transformation Leadership
              </h2>
              <div className={itemSpacingClass}>
                {data.experiences.map((exp) => (
                  <div key={exp.id || exp.company} className="relative pl-4 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[2px] before:bg-slate-200">
                    <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${theme.secondary} ring-4 ring-white`} />
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{exp.role}</h3>
                        <span className="text-xs font-semibold text-slate-700">{exp.company}</span>
                        {exp.location && <span className="text-xs text-slate-400"> • {exp.location}</span>}
                      </div>
                      <span className="text-xs font-medium text-slate-500 shrink-0">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                      {exp.highlights.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className={`w-1.5 h-1.5 rounded-full ${theme.primaryHex ? '' : 'bg-slate-400'} mt-1.5 shrink-0`} style={{ backgroundColor: theme.primaryHex }} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Certifications Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {data.education && data.education.length > 0 && (
              <div>
                <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${theme.primary} flex items-center gap-2 mb-2 pb-1 border-b border-slate-100`}>
                  <GraduationCap className="w-3.5 h-3.5" /> Education
                </h2>
                <div className="space-y-2 text-xs">
                  {data.education.map((edu) => (
                    <div key={edu.id || edu.institution}>
                      <div className="font-bold text-slate-800">{edu.degree} in {edu.field}</div>
                      <div className="text-slate-600 flex justify-between">
                        <span>{edu.institution}</span>
                        <span className="text-slate-400">{edu.graduationDate}</span>
                      </div>
                      {edu.honors && <div className="text-[11px] text-teal-700 font-medium">{edu.honors}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.certifications && data.certifications.length > 0 && (
              <div>
                <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${theme.primary} flex items-center gap-2 mb-2 pb-1 border-b border-slate-100`}>
                  <Award className="w-3.5 h-3.5" /> Certifications & Credentials
                </h2>
                <div className="space-y-2 text-xs">
                  {data.certifications.map((cert) => (
                    <div key={cert.id || cert.name} className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-800">{cert.name}</div>
                        <div className="text-[11px] text-slate-500">{cert.issuer}</div>
                      </div>
                      <span className="text-slate-400 text-[11px] font-medium">{cert.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Template 2: Executive Onyx (Modern Corporate Executive with Top Header Block)
  if (template === "executive-onyx") {
    return (
      <div 
        id="resume-printable-area" 
        className={`bg-white text-slate-800 ${fonts.font} shadow-xl rounded-sm w-full max-w-[850px] mx-auto min-h-[1100px] border border-slate-200/80 overflow-hidden print:shadow-none print:border-none print:m-0`}
      >
        {/* Deep Executive Header */}
        <div className={`${theme.secondary} p-8 md:p-10 text-white`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold tracking-tight text-white ${fonts.headingFont}`}>
                {data.personalInfo.fullName || "Candidate Name"}
              </h1>
              <p className="text-sm md:text-base font-light text-slate-200 tracking-wide mt-1">
                {data.personalInfo.targetTitle}
              </p>
            </div>
            <div className="flex flex-wrap md:flex-col md:items-end gap-2 text-xs text-slate-300">
              {data.personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 opacity-70" /> {data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 opacity-70" /> {data.personalInfo.phone}</span>}
              {data.personalInfo.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 opacity-70" /> {data.personalInfo.location}</span>}
              {data.personalInfo.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5 opacity-70" /> {data.personalInfo.linkedin}</span>}
            </div>
          </div>
        </div>

        <div className={`${paddingClass} ${spacingClass}`}>
          {/* Summary */}
          {data.summary && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
                Executive Profile
              </h2>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-light">
                {data.summary}
              </p>
            </div>
          )}

          {/* Professional Experience */}
          {data.experiences && data.experiences.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">
                Career History & Milestones
              </h2>
              <div className={itemSpacingClass}>
                {data.experiences.map((exp) => (
                  <div key={exp.id || exp.company}>
                    <div className="flex justify-between items-baseline mb-1">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{exp.role}</h3>
                        <span className="text-xs font-bold text-slate-600">{exp.company}</span>
                        {exp.location && <span className="text-xs text-slate-400 font-light"> | {exp.location}</span>}
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <ul className="mt-1.5 space-y-1 text-xs text-slate-600 list-disc list-outside pl-4">
                      {exp.highlights.map((bullet, idx) => (
                        <li key={idx} className="leading-relaxed pl-1">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills & Expertise */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
                Executive Competencies & Frameworks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {data.skills.map((skillCat) => (
                  <div key={skillCat.id || skillCat.category}>
                    <span className="font-bold text-slate-900 block mb-1">{skillCat.category}:</span>
                    <p className="text-slate-600 leading-normal">{skillCat.skills.join(" • ")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
            {data.education && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-2">Education</h2>
                {data.education.map((edu) => (
                  <div key={edu.id || edu.institution} className="text-xs mb-2">
                    <div className="font-bold text-slate-900">{edu.degree} - {edu.field}</div>
                    <div className="text-slate-600">{edu.institution}, {edu.graduationDate}</div>
                  </div>
                ))}
              </div>
            )}
            {data.certifications && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-2">Certifications</h2>
                {data.certifications.map((cert) => (
                  <div key={cert.id || cert.name} className="text-xs mb-1.5 flex justify-between">
                    <span className="font-bold text-slate-800">{cert.name}</span>
                    <span className="text-slate-500">{cert.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Template 3: Minimalist Studio (Swiss-inspired ATS Standard)
  if (template === "minimalist-studio") {
    return (
      <div 
        id="resume-printable-area" 
        className={`bg-white text-slate-900 ${fonts.font} ${paddingClass} shadow-xl rounded-sm w-full max-w-[850px] mx-auto min-h-[1100px] border border-slate-200 print:shadow-none print:border-none print:p-8 print:m-0`}
      >
        <div className="text-center pb-6 border-b border-slate-300 mb-6">
          <h1 className={`text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-slate-900 ${fonts.headingFont}`}>
            {data.personalInfo.fullName || "Candidate Name"}
          </h1>
          <p className="text-sm uppercase tracking-widest text-slate-600 font-semibold mt-1">
            {data.personalInfo.targetTitle}
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500 mt-3 font-medium">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>|  {data.personalInfo.phone}</span>}
            {data.personalInfo.location && <span>|  {data.personalInfo.location}</span>}
            {data.personalInfo.linkedin && <span>|  {data.personalInfo.linkedin}</span>}
          </div>
        </div>

        <div className={spacingClass}>
          {data.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Professional Summary
              </h2>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                {data.summary}
              </p>
            </div>
          )}

          {data.experiences && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3">
                Experience
              </h2>
              <div className={itemSpacingClass}>
                {data.experiences.map((exp) => (
                  <div key={exp.id || exp.company}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-sm text-slate-900">{exp.role}, <span className="font-semibold text-slate-700">{exp.company}</span></span>
                      <span className="text-xs text-slate-500 font-medium">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                    </div>
                    <ul className="mt-1.5 space-y-1 text-xs text-slate-700 list-disc list-inside">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="leading-relaxed">{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.skills && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Skills & Technical Expertise
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {data.skills.map((s) => (
                  <div key={s.id || s.category}>
                    <strong className="text-slate-900">{s.category}:</strong> {s.skills.join(", ")}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 pt-2">
            {data.education && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Education
                </h2>
                {data.education.map((edu) => (
                  <div key={edu.id || edu.institution} className="text-xs">
                    <div className="font-bold text-slate-900">{edu.degree} in {edu.field}</div>
                    <div className="text-slate-500">{edu.institution} ({edu.graduationDate})</div>
                  </div>
                ))}
              </div>
            )}
            {data.certifications && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Certifications
                </h2>
                {data.certifications.map((c) => (
                  <div key={c.id || c.name} className="text-xs text-slate-700">
                    <strong className="text-slate-900">{c.name}</strong> – {c.issuer} ({c.date})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Template 4: Technical Velocity (Two Column High-Density Layout)
  if (template === "technical-velocity") {
    return (
      <div 
        id="resume-printable-area" 
        className={`bg-white text-slate-800 ${fonts.font} shadow-xl rounded-sm w-full max-w-[850px] mx-auto min-h-[1100px] border border-slate-200 flex flex-col md:flex-row print:shadow-none print:border-none print:m-0`}
      >
        {/* Left Column Sidebar */}
        <div className={`w-full md:w-1/3 ${theme.lightBg} p-6 md:p-8 border-r border-slate-200 shrink-0 space-y-6`}>
          <div>
            <h1 className={`text-2xl font-bold text-slate-900 ${fonts.headingFont}`}>
              {data.personalInfo.fullName}
            </h1>
            <p className={`text-xs font-bold ${theme.primary} mt-1`}>
              {data.personalInfo.targetTitle}
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Contact Info</span>
            {data.personalInfo.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> <span className="break-all">{data.personalInfo.email}</span></div>}
            {data.personalInfo.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> <span>{data.personalInfo.phone}</span></div>}
            {data.personalInfo.location && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> <span>{data.personalInfo.location}</span></div>}
            {data.personalInfo.linkedin && <div className="flex items-center gap-2"><Linkedin className="w-3.5 h-3.5 text-slate-400" /> <span className="break-all">{data.personalInfo.linkedin}</span></div>}
          </div>

          {/* Technical Skills Stack */}
          {data.skills && (
            <div className="space-y-4 border-t border-slate-200 pt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Technical Skills</span>
              {data.skills.map((cat) => (
                <div key={cat.id || cat.category} className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-800 block">{cat.category}</span>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills.map((s, i) => (
                      <span key={i} className="bg-white text-slate-700 px-1.5 py-0.5 rounded text-[10px] border border-slate-200 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div className="space-y-2 border-t border-slate-200 pt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Certifications</span>
              {data.certifications.map((c) => (
                <div key={c.id || c.name} className="text-xs">
                  <div className="font-bold text-slate-900 text-[11px]">{c.name}</div>
                  <div className="text-[10px] text-slate-500">{c.issuer} • {c.date}</div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {data.education && (
            <div className="space-y-2 border-t border-slate-200 pt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Education</span>
              {data.education.map((e) => (
                <div key={e.id || e.institution} className="text-xs">
                  <div className="font-bold text-slate-900 text-[11px]">{e.degree}</div>
                  <div className="text-[11px] text-slate-700">{e.field}</div>
                  <div className="text-[10px] text-slate-500">{e.institution} ({e.graduationDate})</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Main Body */}
        <div className="w-full md:w-2/3 p-6 md:p-8 space-y-6">
          {data.summary && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${theme.primary} mb-2`}>
                Transformation Narrative
              </h2>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                {data.summary}
              </p>
            </div>
          )}

          {data.experiences && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${theme.primary} mb-3`}>
                Experience & Impact
              </h2>
              <div className="space-y-4">
                {data.experiences.map((exp) => (
                  <div key={exp.id || exp.company} className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-sm">{exp.role}</h3>
                      <span className="text-xs text-slate-500">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-600">{exp.company} {exp.location && `• ${exp.location}`}</div>
                    <ul className="space-y-1 text-xs text-slate-600 list-disc list-outside pl-4">
                      {exp.highlights.map((h, idx) => (
                        <li key={idx} className="leading-relaxed">{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${theme.primary} mb-2`}>
                Featured Projects
              </h2>
              {data.projects.map((proj) => (
                <div key={proj.id || proj.name} className="text-xs space-y-1">
                  <div className="font-bold text-slate-900">{proj.name} {proj.role && <span className="font-normal text-slate-500">({proj.role})</span>}</div>
                  <p className="text-slate-600">{proj.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Template 5: Modern Split (Default fallback)
  return (
    <div 
      id="resume-printable-area" 
      className={`bg-white text-slate-800 ${fonts.font} ${paddingClass} shadow-xl rounded-sm w-full max-w-[850px] mx-auto min-h-[1100px] border border-slate-200 print:shadow-none print:border-none print:p-8 print:m-0`}
    >
      <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
        <div>
          <h1 className={`text-3xl md:text-4xl text-slate-900 ${fonts.headingFont}`}>
            {data.personalInfo.fullName}
          </h1>
          <p className={`text-base font-semibold ${theme.primary} mt-1`}>
            {data.personalInfo.targetTitle}
          </p>
        </div>
        <div className="text-right text-xs text-slate-500 space-y-0.5">
          {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
          {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
        </div>
      </div>

      <div className={spacingClass}>
        {data.summary && (
          <div>
            <h2 className={`text-xs font-black uppercase tracking-widest ${theme.primary} mb-2`}>Executive Profile</h2>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">{data.summary}</p>
          </div>
        )}

        {data.experiences && (
          <div>
            <h2 className={`text-xs font-black uppercase tracking-widest ${theme.primary} mb-3`}>Professional Experience</h2>
            <div className={itemSpacingClass}>
              {data.experiences.map((exp) => (
                <div key={exp.id || exp.company}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-sm text-slate-900">{exp.role} — <span className="text-slate-600 font-semibold">{exp.company}</span></span>
                    <span className="text-xs text-slate-500">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="leading-relaxed">{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.skills && (
          <div>
            <h2 className={`text-xs font-black uppercase tracking-widest ${theme.primary} mb-2`}>Skills & Tools</h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {data.skills.map((s) => (
                <div key={s.id || s.category}>
                  <span className="font-bold text-slate-900">{s.category}: </span>
                  <span className="text-slate-600">{s.skills.join(", ")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
          {data.education && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-widest ${theme.primary} mb-2`}>Education</h2>
              {data.education.map((e) => (
                <div key={e.id || e.institution} className="text-xs">
                  <div className="font-bold text-slate-900">{e.degree} - {e.field}</div>
                  <div className="text-slate-500">{e.institution} ({e.graduationDate})</div>
                </div>
              ))}
            </div>
          )}
          {data.certifications && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-widest ${theme.primary} mb-2`}>Certifications</h2>
              {data.certifications.map((c) => (
                <div key={c.id || c.name} className="text-xs text-slate-700">
                  <strong className="text-slate-900">{c.name}</strong> ({c.date})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
