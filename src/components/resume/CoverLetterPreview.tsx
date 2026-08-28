import React from "react";
import { CoverLetterData, ResumeTemplateId, ColorTheme, TypographyChoice } from "../../types/resume";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";

interface CoverLetterPreviewProps {
  data: CoverLetterData;
  template: ResumeTemplateId;
  colorTheme: ColorTheme;
  typography: TypographyChoice;
}

const themeColorMap: Record<ColorTheme, { primary: string; primaryHex: string; secondary: string; lightBg: string; border: string; text: string }> = {
  teal: {
    primary: "text-teal-600",
    primaryHex: "#0d9488",
    secondary: "bg-teal-600 text-white",
    lightBg: "bg-teal-50/70",
    border: "border-teal-600",
    text: "text-teal-700"
  },
  slate: {
    primary: "text-slate-900",
    primaryHex: "#0f172a",
    secondary: "bg-slate-900 text-white",
    lightBg: "bg-slate-50",
    border: "border-slate-900",
    text: "text-slate-900"
  },
  navy: {
    primary: "text-blue-900",
    primaryHex: "#1e3a8a",
    secondary: "bg-blue-900 text-white",
    lightBg: "bg-blue-50/60",
    border: "border-blue-900",
    text: "text-blue-900"
  },
  emerald: {
    primary: "text-emerald-700",
    primaryHex: "#047857",
    secondary: "bg-emerald-700 text-white",
    lightBg: "bg-emerald-50/60",
    border: "border-emerald-700",
    text: "text-emerald-800"
  },
  plum: {
    primary: "text-purple-900",
    primaryHex: "#581c87",
    secondary: "bg-purple-900 text-white",
    lightBg: "bg-purple-50/60",
    border: "border-purple-900",
    text: "text-purple-900"
  },
  bronze: {
    primary: "text-amber-800",
    primaryHex: "#92400e",
    secondary: "bg-amber-800 text-white",
    lightBg: "bg-amber-50/60",
    border: "border-amber-800",
    text: "text-amber-900"
  },
  cobalt: {
    primary: "text-blue-600",
    primaryHex: "#2563eb",
    secondary: "bg-blue-600 text-white",
    lightBg: "bg-blue-50/70",
    border: "border-blue-600",
    text: "text-blue-700"
  },
  burgundy: {
    primary: "text-rose-900",
    primaryHex: "#881337",
    secondary: "bg-rose-900 text-white",
    lightBg: "bg-rose-50/60",
    border: "border-rose-900",
    text: "text-rose-950"
  },
  copper: {
    primary: "text-orange-700",
    primaryHex: "#c2410c",
    secondary: "bg-orange-700 text-white",
    lightBg: "bg-orange-50/60",
    border: "border-orange-700",
    text: "text-orange-900"
  },
  indigo: {
    primary: "text-indigo-700",
    primaryHex: "#4338ca",
    secondary: "bg-indigo-700 text-white",
    lightBg: "bg-indigo-50/60",
    border: "border-indigo-700",
    text: "text-indigo-900"
  },
  forest: {
    primary: "text-emerald-900",
    primaryHex: "#14532d",
    secondary: "bg-emerald-900 text-white",
    lightBg: "bg-emerald-50/60",
    border: "border-emerald-900",
    text: "text-emerald-950"
  },
  rose: {
    primary: "text-rose-700",
    primaryHex: "#be123c",
    secondary: "bg-rose-700 text-white",
    lightBg: "bg-rose-50/60",
    border: "border-rose-700",
    text: "text-rose-800"
  }
};

const fontClassMap: Record<TypographyChoice, { font: string; headingFont: string; signatureFont: string }> = {
  modern: {
    font: "font-sans",
    headingFont: "font-sans font-bold tracking-tight",
    signatureFont: "font-serif italic font-light text-2xl tracking-wide"
  },
  executive: {
    font: "font-sans",
    headingFont: "font-serif font-bold tracking-normal",
    signatureFont: "font-serif italic font-normal text-2xl tracking-wider"
  },
  editorial: {
    font: "font-serif",
    headingFont: "font-serif font-bold",
    signatureFont: "font-serif italic font-light text-3xl tracking-wide"
  },
  tech: {
    font: "font-mono text-xs",
    headingFont: "font-mono font-bold tracking-wider uppercase",
    signatureFont: "font-sans italic font-semibold text-xl tracking-tight"
  }
};

export const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
  data,
  template,
  colorTheme,
  typography,
}) => {
  const theme = themeColorMap[colorTheme] || themeColorMap.teal;
  const fonts = fontClassMap[typography] || fontClassMap.modern;

  // Header layout preference (defaults to Centered Letterhead matching attached Fawn Cook PDF)
  const headerLayout = data.headerLayout || "centered-letterhead";

  return (
    <div 
      id="cover-letter-printable-area" 
      className={`bg-white text-slate-800 ${fonts.font} p-10 md:p-14 shadow-xl rounded-sm w-full max-w-[850px] mx-auto min-h-[1100px] border border-slate-200 flex flex-col justify-between print:shadow-none print:border-none print:p-8 print:m-0`}
    >
      <div>
        {/* Executive Letterhead */}
        {headerLayout === "centered-letterhead" ? (
          <div className="text-center pb-6 mb-8 border-b border-slate-300">
            <h1 className="text-2xl md:text-3xl font-normal tracking-[0.3em] uppercase text-slate-800">
              {data.sender.fullName || "EXECUTIVE CANDIDATE"}
            </h1>
            <p className="text-[11px] md:text-xs font-semibold tracking-[0.25em] uppercase text-slate-600 mt-2">
              {data.sender.title || "EXECUTIVE LEADER"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11px] font-medium tracking-[0.15em] uppercase text-slate-500 mt-2">
              {data.sender.phone && <span>{data.sender.phone}</span>}
              {data.sender.phone && data.sender.email && <span>|</span>}
              {data.sender.email && <span>{data.sender.email}</span>}
              {data.sender.email && data.sender.linkedin && <span>|</span>}
              {data.sender.linkedin && (
                <span>{data.sender.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
              )}
              {!data.sender.linkedin && data.sender.location && (
                <>
                  <span>|</span>
                  <span>{data.sender.location}</span>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="border-b-2 border-slate-100 pb-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className={`text-3xl md:text-4xl text-slate-900 ${fonts.headingFont}`}>
                  {data.sender.fullName || "Your Full Name"}
                </h1>
                <p className={`text-base font-semibold ${theme.primary} mt-1`}>
                  {data.sender.title || data.targetRole || "Executive Candidate"}
                </p>
              </div>
              <div className="flex flex-wrap md:flex-col md:items-end gap-1.5 text-xs text-slate-500">
                {data.sender.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {data.sender.email}
                  </span>
                )}
                {data.sender.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {data.sender.phone}
                  </span>
                )}
                {data.sender.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {data.sender.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Date & Recipient Details (Shown conditionally if provided) */}
        {(data.recipient.companyAddress || data.recipient.hiringManagerTitle) && (
          <div className="mb-6 space-y-1 text-xs text-slate-600">
            <div className="text-slate-500">{data.date || new Date().toLocaleDateString()}</div>
            {data.recipient.hiringManagerName && <div className="font-bold text-slate-900">{data.recipient.hiringManagerName}</div>}
            {data.recipient.companyName && <div className="font-semibold text-slate-800">{data.recipient.companyName}</div>}
            {data.recipient.companyAddress && <div>{data.recipient.companyAddress}</div>}
          </div>
        )}

        {/* Salutation */}
        <div className="mb-5 text-sm md:text-base font-medium text-slate-900">
          {data.salutation || "Dear Hiring Manager,"}
        </div>

        {/* Cover Letter Content Body */}
        <div className="space-y-4 text-xs md:text-[13px] text-slate-700 leading-relaxed">
          {/* 1. Opening Intro Paragraph */}
          {data.openingParagraph && (
            <p className="leading-relaxed">
              {data.openingParagraph}
            </p>
          )}

          {/* 2. Current Position & Scope Paragraph */}
          {data.currentPositionParagraph && (
            <p className="leading-relaxed">
              {data.currentPositionParagraph}
            </p>
          )}

          {/* 3. Scope Alignment / Bridge Paragraph */}
          {data.scopeAlignmentParagraph && (
            <p className="leading-relaxed">
              {data.scopeAlignmentParagraph}
            </p>
          )}

          {/* 4. Structured Highlights Bullets (Exact format from attachment) */}
          {data.highlights && data.highlights.length > 0 && (
            <div className="pt-1 pb-1 space-y-2">
              <p className="font-medium text-slate-900">
                {data.highlightsHeader || "Highlights of my experience include:"}
              </p>
              <ul className="space-y-2 pl-4">
                {data.highlights.map((item, idx) => (
                  <li key={idx} className="list-disc list-outside text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900">{item.label}: </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Standard body paragraphs (if any) */}
          {data.bodyParagraphs && data.bodyParagraphs.map((para, i) => (
            <p key={i} className="leading-relaxed">
              {para}
            </p>
          ))}

          {/* 5. Company Interest & Strategic Alignment */}
          {data.companyInterestParagraph && (
            <p className="leading-relaxed">
              {data.companyInterestParagraph}
            </p>
          )}

          {/* 6. Closing / Next Steps */}
          {data.closingParagraph && (
            <p className="leading-relaxed">
              {data.closingParagraph}
            </p>
          )}

          {/* 7. Thank You line */}
          {data.thankYouLine && (
            <p className="leading-relaxed font-normal text-slate-800 pt-1">
              {data.thankYouLine}
            </p>
          )}
        </div>
      </div>

      {/* Sign-off, Handwritten Signature, Printed Name, and Enclosure */}
      <div className="pt-6 mt-8">
        <p className="text-xs md:text-sm text-slate-700 mb-4 tracking-wide">
          {data.signoff || "Kind regards,"}
        </p>
        
        {/* Handwritten Script Signature rendering */}
        <div className="mb-2 pl-1 select-none">
          <span 
            className="italic text-2xl md:text-3xl text-slate-900 font-serif"
            style={{ fontFamily: "'Brush Script MT', 'Dancing Script', 'Playfair Display', Georgia, cursive" }}
          >
            {data.sender.fullName || "Candidate Signature"}
          </span>
        </div>

        {/* Typed Name in Tracked Uppercase */}
        <div className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-800">
          {data.sender.fullName || "CANDIDATE NAME"}
        </div>
        {data.sender.title && (
          <p className="text-[10px] tracking-[0.15em] uppercase text-slate-500 mt-0.5">
            {data.sender.title}
          </p>
        )}

        {/* Bottom Enclosure Notice */}
        {data.enclosureNotice !== "" && (
          <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] font-normal tracking-[0.15em] text-slate-500">
            {data.enclosureNotice || "Enclosure: Résumé"}
          </div>
        )}
      </div>
    </div>
  );
};
