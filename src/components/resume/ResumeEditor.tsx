import React, { useState, useMemo } from "react";
import { ResumeData, ExperienceItem, EducationItem, SkillCategory, CertificationItem } from "../../types/resume";
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp, User, Briefcase, GraduationCap, Award, Cpu, Zap, ShieldCheck } from "lucide-react";
import { calculateResumeScore } from "../../utils/resumeScoreEngine";

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onEnhanceBullet: (bullet: string, expId: string, bulletIdx: number) => void;
  isEnhancingBullet?: boolean;
  onOpenScoreModal?: () => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  data,
  onChange,
  onEnhanceBullet,
  isEnhancingBullet,
  onOpenScoreModal
}) => {
  const [activeSection, setActiveSection] = useState<string>("personal");

  const score = useMemo(() => calculateResumeScore(data), [data]);

  const updatePersonalInfo = (field: keyof ResumeData["personalInfo"], value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  const updateSummary = (summary: string) => {
    onChange({ ...data, summary });
  };

  // Experience handlers
  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: "New Organization",
      role: "Operations Role",
      location: "City, State",
      startDate: "2023",
      endDate: "Present",
      current: true,
      highlights: [
        "Led cross-functional operational initiative delivering measurable efficiency gains."
      ]
    };
    onChange({
      ...data,
      experiences: [newExp, ...data.experiences]
    });
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange({
      ...data,
      experiences: data.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experiences: data.experiences.filter((exp) => exp.id !== id)
    });
  };

  const addHighlight = (expId: string) => {
    onChange({
      ...data,
      experiences: data.experiences.map((exp) =>
        exp.id === expId
          ? { ...exp, highlights: [...exp.highlights, "Spearheaded workflow optimization that boosted throughput by 20%."] }
          : exp
      )
    });
  };

  const updateHighlight = (expId: string, idx: number, value: string) => {
    onChange({
      ...data,
      experiences: data.experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        const newHighlights = [...exp.highlights];
        newHighlights[idx] = value;
        return { ...exp, highlights: newHighlights };
      })
    });
  };

  const removeHighlight = (expId: string, idx: number) => {
    onChange({
      ...data,
      experiences: data.experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        return {
          ...exp,
          highlights: exp.highlights.filter((_, i) => i !== idx)
        };
      })
    });
  };

  // Skills handlers
  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      id: `cat-${Date.now()}`,
      category: "New Competency Group",
      skills: ["Skill 1", "Skill 2"]
    };
    onChange({ ...data, skills: [...data.skills, newCat] });
  };

  const updateSkillCategoryName = (id: string, name: string) => {
    onChange({
      ...data,
      skills: data.skills.map((s) => (s.id === id ? { ...s, category: name } : s))
    });
  };

  const updateSkillTags = (id: string, tagsString: string) => {
    const skills = tagsString.split(",").map((s) => s.trim()).filter(Boolean);
    onChange({
      ...data,
      skills: data.skills.map((s) => (s.id === id ? { ...s, skills } : s))
    });
  };

  const removeSkillCategory = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((s) => s.id !== id)
    });
  };

  // Metrics handlers
  const updateMetric = (idx: number, field: "label" | "value", val: string) => {
    const newMetrics = [...(data.metrics || [])];
    if (!newMetrics[idx]) {
      newMetrics[idx] = { label: "", value: "" };
    }
    newMetrics[idx][field] = val;
    onChange({ ...data, metrics: newMetrics });
  };

  const addMetric = () => {
    onChange({
      ...data,
      metrics: [...(data.metrics || []), { label: "New Metric", value: "+25%" }]
    });
  };

  const removeMetric = (idx: number) => {
    onChange({
      ...data,
      metrics: (data.metrics || []).filter((_, i) => i !== idx)
    });
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: "University / Institution",
      degree: "Degree",
      field: "Field of Study",
      location: "City, State",
      graduationDate: "2022"
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof EducationItem, val: string) => {
    onChange({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, [field]: val } : e))
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((e) => e.id !== id)
    });
  };

  // Certifications handlers
  const addCertification = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: "New Certification (e.g. PMP, CSCP)",
      issuer: "Issuing Body",
      date: "2023"
    };
    onChange({ ...data, certifications: [...data.certifications, newCert] });
  };

  const updateCertification = (id: string, field: keyof CertificationItem, val: string) => {
    onChange({
      ...data,
      certifications: data.certifications.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    });
  };

  const removeCertification = (id: string) => {
    onChange({
      ...data,
      certifications: data.certifications.filter((c) => c.id !== id)
    });
  };

  const sections = [
    { id: "personal", label: "Contact & Bio", icon: User },
    { id: "summary", label: "Executive Summary", icon: Zap },
    { id: "metrics", label: "Key Highlights & Stats", icon: Sparkles },
    { id: "experience", label: "Experience & Roles", icon: Briefcase },
    { id: "skills", label: "Skills & Systems", icon: Cpu },
    { id: "education", label: "Education & Certs", icon: GraduationCap }
  ];

  return (
    <div className="space-y-4">
      {/* Live Mini Resume Score Banner */}
      <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-black text-xs border border-teal-500/30">
            {score.overallScore}%
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white">Live Resume Score: {score.overallScore}%</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded font-bold">{score.grade}</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {score.keywordMetrics.matchedCount} of {score.keywordMetrics.totalBenchmarked} Industry Keywords Matched • {score.metricsCount} Quantifiable Metrics
            </span>
          </div>
        </div>

        {onOpenScoreModal && (
          <button
            onClick={onOpenScoreModal}
            className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-1 shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Diagnostics & Fixes</span>
          </button>
        )}
      </div>

      {/* Quick Section Navigator Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-primary text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* Personal Info Section */}
      {activeSection === "personal" && (
        <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-secondary" /> Contact Details & Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={data.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-brand-secondary outline-none transition-all"
                placeholder="e.g. Alex Rivera"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Target Title</label>
              <input
                type="text"
                value={data.personalInfo.targetTitle}
                onChange={(e) => updatePersonalInfo("targetTitle", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-brand-secondary outline-none transition-all"
                placeholder="e.g. Director of Operations & Automation"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Email</label>
              <input
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-brand-secondary outline-none transition-all"
                placeholder="alex@example.com"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Phone</label>
              <input
                type="text"
                value={data.personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-brand-secondary outline-none transition-all"
                placeholder="(555) 000-0000"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Location</label>
              <input
                type="text"
                value={data.personalInfo.location}
                onChange={(e) => updatePersonalInfo("location", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-brand-secondary outline-none transition-all"
                placeholder="Richmond, VA"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">LinkedIn Profile</label>
              <input
                type="text"
                value={data.personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-brand-secondary outline-none transition-all"
                placeholder="linkedin.com/in/username"
              />
            </div>
          </div>
        </div>
      )}

      {/* Summary Section */}
      {activeSection === "summary" && (
        <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-secondary" /> Executive Summary & Narrative
            </h3>
            <span className="text-[10px] text-slate-400">{data.summary?.length || 0} characters</span>
          </div>
          <p className="text-xs text-slate-500">
            Write a powerful 2–4 sentence synthesis framing your transformation philosophy, scale of impact, and core domain authority.
          </p>
          <textarea
            value={data.summary}
            onChange={(e) => updateSummary(e.target.value)}
            rows={5}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:bg-white focus:border-brand-secondary outline-none transition-all resize-y"
            placeholder="Executive summary describing your systems thinking and track record..."
          />
        </div>
      )}

      {/* Metrics Section */}
      {activeSection === "metrics" && (
        <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-secondary" /> Standout Impact Metrics Banner
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Top quantifiable stats displayed on select modern templates.</p>
            </div>
            <button
              onClick={addMetric}
              className="flex items-center gap-1 px-3 py-1 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-dark transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Metric
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(data.metrics || []).map((m, idx) => (
              <div key={idx} className="flex gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 items-center">
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={m.value}
                    onChange={(e) => updateMetric(idx, "value", e.target.value)}
                    placeholder="e.g. $14.2M or +38%"
                    className="w-full text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200 outline-none"
                  />
                  <input
                    type="text"
                    value={m.label}
                    onChange={(e) => updateMetric(idx, "label", e.target.value)}
                    placeholder="e.g. Cost Savings Delivered"
                    className="w-full text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 outline-none"
                  />
                </div>
                <button
                  onClick={() => removeMetric(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {activeSection === "experience" && (
        <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-secondary" /> Work History & Roles
              </h3>
              <p className="text-xs text-slate-500">Highlight achievements using action verbs and measurable metrics.</p>
            </div>
            <button
              onClick={addExperience}
              className="flex items-center gap-1 px-3 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-dark transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Job
            </button>
          </div>

          <div className="space-y-4">
            {data.experiences.map((exp, expIdx) => (
              <div key={exp.id || expIdx} className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-grow mr-2">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                      placeholder="Role Title (e.g. Senior Director of Operations)"
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-brand-secondary"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      placeholder="Company Name"
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-brand-secondary"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                        placeholder="Start (2022)"
                        className="w-1/2 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] outline-none"
                      />
                      <input
                        type="text"
                        value={exp.current ? "Present" : exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        disabled={exp.current}
                        placeholder="End (2024)"
                        className="w-1/2 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] outline-none disabled:bg-slate-100"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                        placeholder="Location (e.g. Richmond, VA)"
                        className="flex-grow px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] outline-none"
                      />
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                          className="rounded text-brand-secondary"
                        />
                        Current
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Highlights list */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Accomplishment Bullets</span>
                    <button
                      onClick={() => addHighlight(exp.id)}
                      className="text-[11px] font-bold text-brand-primary hover:text-brand-dark flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet
                    </button>
                  </div>
                  {exp.highlights.map((bullet, bulletIdx) => (
                    <div key={bulletIdx} className="flex items-start gap-2 group">
                      <span className="text-slate-400 text-xs mt-2">•</span>
                      <textarea
                        value={bullet}
                        onChange={(e) => updateHighlight(exp.id, bulletIdx, e.target.value)}
                        rows={2}
                        className="flex-grow p-2 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed outline-none focus:border-brand-secondary resize-none"
                        placeholder="Action verb + Context + Quantifiable Metric..."
                      />
                      <div className="flex flex-col gap-1 shrink-0 pt-1">
                        <button
                          onClick={() => onEnhanceBullet(bullet, exp.id, bulletIdx)}
                          className="p-1.5 bg-brand-secondary/15 hover:bg-brand-secondary text-brand-primary rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer font-bold"
                          title="Enhance Bullet Point"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                        </button>
                        <button
                          onClick={() => removeHighlight(exp.id, bulletIdx)}
                          className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                          title="Delete Bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {activeSection === "skills" && (
        <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-secondary" /> Core Competencies & Skills Groups
              </h3>
              <p className="text-xs text-slate-500">Group skills by category and separate items with commas.</p>
            </div>
            <button
              onClick={addSkillCategory}
              className="flex items-center gap-1 px-3 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-dark transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>

          <div className="space-y-3">
            {data.skills.map((cat) => (
              <div key={cat.id || cat.category} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <input
                    type="text"
                    value={cat.category}
                    onChange={(e) => updateSkillCategoryName(cat.id, e.target.value)}
                    placeholder="Category (e.g. Automation Systems)"
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none w-1/2"
                  />
                  <button
                    onClick={() => removeSkillCategory(cat.id)}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Comma-separated skills</label>
                  <input
                    type="text"
                    value={cat.skills.join(", ")}
                    onChange={(e) => updateSkillTags(cat.id, e.target.value)}
                    placeholder="AMR/AGV, WMS, Lean Six Sigma, Python"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certs Section */}
      {activeSection === "education" && (
        <div className="space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          {/* Education */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-brand-secondary" /> Education History
              </h3>
              <button
                onClick={addEducation}
                className="text-xs font-bold text-brand-primary flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Degree
              </button>
            </div>
            {data.education.map((edu) => (
              <div key={edu.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-grow">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      placeholder="Degree (e.g. Master of Science)"
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold outline-none"
                    />
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                      placeholder="Field (e.g. Industrial Engineering)"
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-xs outline-none"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      placeholder="Institution / University"
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-xs outline-none"
                    />
                    <input
                      type="text"
                      value={edu.graduationDate}
                      onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                      placeholder="Graduation Year (2020)"
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-xs outline-none"
                    />
                  </div>
                  <button onClick={() => removeEducation(edu.id)} className="p-1 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-secondary" /> Professional Certifications & Credentials
              </h3>
              <button
                onClick={addCertification}
                className="text-xs font-bold text-brand-primary flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certification
              </button>
            </div>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                  placeholder="Cert Name (e.g. Lean Six Sigma Black Belt)"
                  className="w-1/2 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold outline-none"
                />
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                  placeholder="Issuer (e.g. ASQ / APICS)"
                  className="w-1/3 px-2 py-1 bg-white border border-slate-200 rounded text-xs outline-none"
                />
                <input
                  type="text"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                  placeholder="Year"
                  className="w-1/6 px-2 py-1 bg-white border border-slate-200 rounded text-xs outline-none"
                />
                <button onClick={() => removeCertification(cert.id)} className="p-1 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
