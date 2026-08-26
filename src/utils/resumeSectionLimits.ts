import { ResumeData, ExperienceItem, EducationItem, SkillCategory, CertificationItem, ResumeMetric, ProjectItem } from "../types/resume";

/**
 * Standard Executive Section Maximums & ATS Density Rules
 */
export const RESUME_SECTION_LIMITS = {
  personalInfo: {
    fullNameMaxChars: 60,
    targetTitleMaxChars: 75,
    emailMaxChars: 50,
    phoneMaxChars: 30,
    locationMaxChars: 60,
    linkedinMaxChars: 80,
    portfolioMaxChars: 80,
  },
  summary: {
    maxWords: 120,
    maxChars: 750,
  },
  skills: {
    maxCategories: 4,
    maxSkillsPerCategory: 8,
    maxTotalSkills: 24,
    maxSkillNameChars: 35,
  },
  experiences: {
    maxRoles: 6,
    maxBulletsPerRole: 5,
    maxBulletsForCurrentRole: 6,
    maxBulletChars: 260,
    maxBulletWords: 40,
  },
  education: {
    maxItems: 4,
    degreeMaxChars: 50,
    fieldMaxChars: 50,
    institutionMaxChars: 60,
  },
  certifications: {
    maxItems: 6,
    nameMaxChars: 60,
    issuerMaxChars: 45,
  },
  metrics: {
    maxItems: 4,
    valueMaxChars: 16,
    labelMaxChars: 28,
  },
  projects: {
    maxItems: 3,
    nameMaxChars: 50,
    descriptionMaxChars: 200,
    maxHighlights: 2,
  },
  awards: {
    maxItems: 4,
    itemMaxChars: 60,
  }
} as const;

/**
 * Normalizes string for deduplication comparison (lowercase, trimmed, stripped punctuation)
 */
function normalizeForComparison(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Deduplicates an array of strings case-insensitively while preserving original casing
 */
export function deduplicateStrings(items: string[]): string[] {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of items) {
    if (!item || typeof item !== "string") continue;
    const clean = item.trim();
    if (!clean) continue;
    const normalized = normalizeForComparison(clean);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(clean);
  }

  return result;
}

/**
 * Truncates text gracefully to maximum word count and character limit at a sentence or word boundary
 */
export function truncateToWordLimit(text: string, maxWords: number, maxChars: number = 750): string {
  if (!text || typeof text !== "string") return "";
  let clean = text.replace(/\s+/g, " ").trim();

  // Deduplicate identical repetitive sentences (common in OCR / repetitive extract loops)
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
  const uniqueSentences = deduplicateStrings(sentences);
  if (uniqueSentences.length < sentences.length) {
    clean = uniqueSentences.join(" ");
  }

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords && clean.length <= maxChars) {
    return clean;
  }

  // Truncate by word count first
  let truncated = words.slice(0, maxWords).join(" ");
  if (truncated.length > maxChars) {
    truncated = truncated.slice(0, maxChars);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 30) {
      truncated = truncated.slice(0, lastSpace);
    }
  }

  // Ensure it ends with proper punctuation
  if (!/[.!?]$/.test(truncated)) {
    truncated += ".";
  }

  return truncated;
}

/**
 * Filters out cover letter boilerplate, greetings, and signoffs
 */
function isBoilerplateBullet(bullet: string): boolean {
  if (!bullet || bullet.length < 6) return true;
  return /^(dear\s+hiring|kind\s+regards|sincerely|to\s+whom\s+it\s+may\s+concern|enclosure|thank\s+you\s+for\s+your\s+time|i\s+am\s+writing\s+to\s+apply|please\s+find\s+attached)/i.test(
    bullet.trim()
  );
}

/**
 * Cleans, bounds, and truncates a single bullet point
 */
function cleanBullet(bullet: string, maxChars: number = RESUME_SECTION_LIMITS.experiences.maxBulletChars): string {
  if (!bullet || typeof bullet !== "string") return "";
  let text = bullet
    .replace(/^[•\-\*\u2022\u2023\u25E6\d\.\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxChars) {
    return text;
  }

  let truncated = text.slice(0, maxChars);
  const lastPeriod = truncated.lastIndexOf(".");
  if (lastPeriod > maxChars * 0.7) {
    return truncated.slice(0, lastPeriod + 1);
  }
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > maxChars * 0.6) {
    return truncated.slice(0, lastSpace) + ".";
  }
  return truncated.trim() + ".";
}

/**
 * Deeply enforces all section maximums, deduplicates repetitive entries,
 * strips bloated text, and caps skill lists and word counts.
 */
export function enforceResumeSectionLimits(data: ResumeData): ResumeData {
  if (!data || typeof data !== "object") {
    return data;
  }

  // 1. Personal Info Limits
  const rawInfo = data.personalInfo || ({} as any);
  const personalInfo = {
    fullName: (rawInfo.fullName || "Candidate Name").slice(0, RESUME_SECTION_LIMITS.personalInfo.fullNameMaxChars).trim(),
    targetTitle: (rawInfo.targetTitle || "Executive Leader").slice(0, RESUME_SECTION_LIMITS.personalInfo.targetTitleMaxChars).trim(),
    email: (rawInfo.email || "").slice(0, RESUME_SECTION_LIMITS.personalInfo.emailMaxChars).trim(),
    phone: (rawInfo.phone || "").slice(0, RESUME_SECTION_LIMITS.personalInfo.phoneMaxChars).trim(),
    location: (rawInfo.location || "").slice(0, RESUME_SECTION_LIMITS.personalInfo.locationMaxChars).trim(),
    linkedin: (rawInfo.linkedin || "").slice(0, RESUME_SECTION_LIMITS.personalInfo.linkedinMaxChars).trim(),
    portfolio: (rawInfo.portfolio || "").slice(0, RESUME_SECTION_LIMITS.personalInfo.portfolioMaxChars).trim(),
  };

  // 2. Executive Summary Limits
  const summary = truncateToWordLimit(
    data.summary || "",
    RESUME_SECTION_LIMITS.summary.maxWords,
    RESUME_SECTION_LIMITS.summary.maxChars
  );

  // 3. Technical & Core Skills Limits & Deduplication
  const globalSeenSkills = new Set<string>();
  const rawSkills = Array.isArray(data.skills) ? data.skills : [];
  const skills: SkillCategory[] = [];

  for (let i = 0; i < Math.min(rawSkills.length, RESUME_SECTION_LIMITS.skills.maxCategories); i++) {
    const cat = rawSkills[i];
    if (!cat) continue;

    const rawCategoryName = (cat.category || `Category ${i + 1}`).slice(0, 40).trim();
    const rawCategorySkills = Array.isArray(cat.skills) ? cat.skills : [];

    const categorySkills: string[] = [];
    for (const rawSkill of rawCategorySkills) {
      if (!rawSkill || typeof rawSkill !== "string") continue;
      // Strip bullet characters and whitespace
      const cleanSkill = rawSkill.replace(/^[•\-\*\s]+|[•\-\*\s]+$/g, "").trim();

      // Filter out empty items, entire paragraphs mistakenly ingested as skills, or bloated strings
      if (!cleanSkill || cleanSkill.length > RESUME_SECTION_LIMITS.skills.maxSkillNameChars || cleanSkill.length < 2) {
        continue;
      }
      // If it looks like a full sentence with verbs and periods, skip
      if (cleanSkill.includes(".") && cleanSkill.split(" ").length > 4) {
        continue;
      }

      const normalized = normalizeForComparison(cleanSkill);
      if (globalSeenSkills.has(normalized)) continue;
      if (globalSeenSkills.size >= RESUME_SECTION_LIMITS.skills.maxTotalSkills) break;
      if (categorySkills.length >= RESUME_SECTION_LIMITS.skills.maxSkillsPerCategory) break;

      globalSeenSkills.add(normalized);
      categorySkills.push(cleanSkill);
    }

    if (categorySkills.length > 0) {
      skills.push({
        id: cat.id || `skill-cat-${i + 1}`,
        category: rawCategoryName,
        skills: categorySkills,
      });
    }
  }

  // 4. Professional Experience Limits & Deduplication
  const rawExperiences = Array.isArray(data.experiences) ? data.experiences : [];
  const experiences: ExperienceItem[] = [];
  const globalSeenBullets = new Set<string>();

  for (let i = 0; i < Math.min(rawExperiences.length, RESUME_SECTION_LIMITS.experiences.maxRoles); i++) {
    const exp = rawExperiences[i];
    if (!exp) continue;

    const isCurrentRole = i === 0 || exp.current;
    const maxBullets = isCurrentRole
      ? RESUME_SECTION_LIMITS.experiences.maxBulletsForCurrentRole
      : RESUME_SECTION_LIMITS.experiences.maxBulletsPerRole;

    const rawHighlights = Array.isArray(exp.highlights) ? exp.highlights : [];
    const validHighlights: string[] = [];

    for (const h of rawHighlights) {
      if (!h || typeof h !== "string") continue;
      if (isBoilerplateBullet(h)) continue;

      const cleaned = cleanBullet(h);
      if (cleaned.length < 8) continue;

      const normalized = normalizeForComparison(cleaned);
      if (globalSeenBullets.has(normalized)) continue;
      if (validHighlights.length >= maxBullets) break;

      globalSeenBullets.add(normalized);
      validHighlights.push(cleaned);
    }

    // Ensure at least one highlight exists if highlights were empty
    const finalHighlights = validHighlights.length > 0
      ? validHighlights
      : ["Led operational strategy, systems delivery, and team execution."];

    experiences.push({
      id: exp.id || `exp-${i + 1}`,
      company: (exp.company || "Enterprise Organization").slice(0, 60).trim(),
      role: (exp.role || "Operations Leader").slice(0, 60).trim(),
      location: (exp.location || "").slice(0, 50).trim(),
      startDate: (exp.startDate || "2021").slice(0, 20).trim(),
      endDate: (exp.endDate || "Present").slice(0, 20).trim(),
      current: exp.current ?? (exp.endDate ? /present|current/i.test(exp.endDate) : i === 0),
      highlights: finalHighlights,
    });
  }

  // 5. Education Limits & Deduplication
  const rawEducation = Array.isArray(data.education) ? data.education : [];
  const education: EducationItem[] = [];
  const seenEdu = new Set<string>();

  for (let i = 0; i < Math.min(rawEducation.length, RESUME_SECTION_LIMITS.education.maxItems); i++) {
    const edu = rawEducation[i];
    if (!edu) continue;

    const degree = (edu.degree || "Degree").slice(0, RESUME_SECTION_LIMITS.education.degreeMaxChars).trim();
    const field = (edu.field || "Field of Study").slice(0, RESUME_SECTION_LIMITS.education.fieldMaxChars).trim();
    const institution = (edu.institution || "University").slice(0, RESUME_SECTION_LIMITS.education.institutionMaxChars).trim();
    const key = `${normalizeForComparison(degree)}_${normalizeForComparison(institution)}`;

    if (seenEdu.has(key)) continue;
    seenEdu.add(key);

    education.push({
      id: edu.id || `edu-${i + 1}`,
      institution,
      degree,
      field,
      location: (edu.location || "").slice(0, 40).trim(),
      graduationDate: (edu.graduationDate || "2020").slice(0, 15).trim(),
      honors: edu.honors ? String(edu.honors).slice(0, 40).trim() : undefined,
    });
  }

  // 6. Certifications Limits & Deduplication
  const rawCerts = Array.isArray(data.certifications) ? data.certifications : [];
  const certifications: CertificationItem[] = [];
  const seenCerts = new Set<string>();

  for (let i = 0; i < Math.min(rawCerts.length, RESUME_SECTION_LIMITS.certifications.maxItems); i++) {
    const cert = rawCerts[i];
    if (!cert) continue;

    const name = (typeof cert === "string" ? cert : cert.name || "Certification")
      .slice(0, RESUME_SECTION_LIMITS.certifications.nameMaxChars)
      .trim();
    const issuer = (typeof cert === "object" && cert.issuer ? cert.issuer : "Accredited Body")
      .slice(0, RESUME_SECTION_LIMITS.certifications.issuerMaxChars)
      .trim();
    const date = (typeof cert === "object" && cert.date ? cert.date : "Active").slice(0, 15).trim();

    const normalizedName = normalizeForComparison(name);
    if (!normalizedName || seenCerts.has(normalizedName)) continue;
    seenCerts.add(normalizedName);

    certifications.push({
      id: (typeof cert === "object" && cert.id) ? cert.id : `cert-${i + 1}`,
      name,
      issuer,
      date,
    });
  }

  // 7. Metrics Limits & Deduplication
  const rawMetrics = Array.isArray(data.metrics) ? data.metrics : [];
  const metrics: ResumeMetric[] = [];
  const seenMetrics = new Set<string>();

  for (let i = 0; i < Math.min(rawMetrics.length, RESUME_SECTION_LIMITS.metrics.maxItems); i++) {
    const m = rawMetrics[i];
    if (!m) continue;

    const label = (typeof m === "object" ? m.label || "Impact Metric" : `Metric ${i + 1}`)
      .slice(0, RESUME_SECTION_LIMITS.metrics.labelMaxChars)
      .trim();
    const value = (typeof m === "object" ? m.value || "+25%" : String(m))
      .slice(0, RESUME_SECTION_LIMITS.metrics.valueMaxChars)
      .trim();

    const key = normalizeForComparison(label);
    if (seenMetrics.has(key)) continue;
    seenMetrics.add(key);

    metrics.push({ label, value });
  }

  // 8. Projects Limits (if any)
  const rawProjects = Array.isArray(data.projects) ? data.projects : [];
  const projects: ProjectItem[] = [];

  for (let i = 0; i < Math.min(rawProjects.length, RESUME_SECTION_LIMITS.projects.maxItems); i++) {
    const p = rawProjects[i];
    if (!p) continue;
    const highlights = deduplicateStrings(Array.isArray(p.highlights) ? p.highlights : [])
      .slice(0, RESUME_SECTION_LIMITS.projects.maxHighlights)
      .map(h => cleanBullet(h, 150));

    projects.push({
      id: p.id || `proj-${i + 1}`,
      name: (p.name || "Initiative").slice(0, RESUME_SECTION_LIMITS.projects.nameMaxChars).trim(),
      role: p.role ? p.role.slice(0, 40).trim() : undefined,
      description: (p.description || "").slice(0, RESUME_SECTION_LIMITS.projects.descriptionMaxChars).trim(),
      highlights,
    });
  }

  // 9. Awards Limits
  const rawAwards = Array.isArray(data.awards) ? data.awards : [];
  const awards = deduplicateStrings(rawAwards)
    .slice(0, RESUME_SECTION_LIMITS.awards.maxItems)
    .map(a => a.slice(0, RESUME_SECTION_LIMITS.awards.itemMaxChars).trim())
    .filter(Boolean);

  return {
    personalInfo,
    summary,
    experiences,
    education,
    skills,
    certifications,
    metrics,
    projects,
    awards,
  };
}

/**
 * Returns section density analytics and checks if any section exceeded standard bounds
 */
export function getResumeSectionStats(data: ResumeData) {
  const summaryWordCount = data.summary ? data.summary.trim().split(/\s+/).filter(Boolean).length : 0;
  const totalSkillsCount = (data.skills || []).reduce((acc, cat) => acc + (cat.skills?.length || 0), 0);
  const totalBulletsCount = (data.experiences || []).reduce((acc, exp) => acc + (exp.highlights?.length || 0), 0);

  return {
    summaryWords: summaryWordCount,
    isSummaryExceeded: summaryWordCount > RESUME_SECTION_LIMITS.summary.maxWords,
    skillsCategoriesCount: data.skills?.length || 0,
    isSkillsCategoriesExceeded: (data.skills?.length || 0) > RESUME_SECTION_LIMITS.skills.maxCategories,
    totalSkillsCount,
    isTotalSkillsExceeded: totalSkillsCount > RESUME_SECTION_LIMITS.skills.maxTotalSkills,
    rolesCount: data.experiences?.length || 0,
    isRolesExceeded: (data.experiences?.length || 0) > RESUME_SECTION_LIMITS.experiences.maxRoles,
    totalBulletsCount,
    educationCount: data.education?.length || 0,
    certificationsCount: data.certifications?.length || 0,
    metricsCount: data.metrics?.length || 0,
  };
}
