export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  link?: string;
  description: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface ResumeMetric {
  label: string;
  value: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    targetTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
  };
  summary: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  awards: string[];
  metrics: ResumeMetric[];
}

export interface CoverLetterHighlight {
  id?: string;
  label: string;
  text: string;
}

export interface CoverLetterData {
  sender: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
  };
  recipient: {
    hiringManagerName: string;
    hiringManagerTitle: string;
    companyName: string;
    companyAddress: string;
  };
  date: string;
  targetRole: string;
  salutation: string;
  openingParagraph: string;
  currentPositionParagraph?: string;
  scopeAlignmentParagraph?: string;
  highlightsHeader?: string;
  highlights?: CoverLetterHighlight[];
  bodyParagraphs: string[];
  companyInterestParagraph?: string;
  closingParagraph: string;
  thankYouLine?: string;
  signoff: string;
  enclosureNotice?: string;
  headerLayout?: "centered-letterhead" | "modern-split" | "minimalist-left";
  signatureStyle?: "script-signature" | "modern-clean" | "classic-serif";
}

export type ResumeTemplateId =
  | "transformation-teal"
  | "executive-onyx"
  | "minimalist-studio"
  | "technical-velocity"
  | "modern-split";

export type ColorTheme =
  | "teal"
  | "slate"
  | "navy"
  | "emerald"
  | "plum"
  | "bronze"
  | "cobalt"
  | "burgundy"
  | "copper"
  | "indigo"
  | "forest"
  | "rose";

export type TypographyChoice =
  | "modern"
  | "executive"
  | "editorial"
  | "tech";

export interface AtsScorecard {
  overallScore: number;
  impactScore: number;
  clarityScore: number;
  atsReadabilityScore: number;
  keywordScore: number;
  strengths: string[];
  improvements: string[];
  suggestedKeywords: string[];
}

export type IndustryDomain =
  | "operations-supply-chain"
  | "technology-engineering"
  | "executive-strategy"
  | "product-design"
  | "finance-commercial"
  | "healthcare-life-sciences"
  | "sales-marketing"
  | "consulting-transformation";

export interface KeywordMatchItem {
  keyword: string;
  category: "hard-skills" | "leadership" | "tools-systems" | "certifications" | "action-verbs";
  matched: boolean;
  occurrences: number;
  locations?: string[];
}

export interface ScoreSuggestion {
  id: string;
  type: "missing-keyword" | "weak-verb" | "missing-metric" | "section-length" | "ats-structure" | "executive-presence";
  priority: "critical" | "high" | "moderate" | "quick-win";
  title: string;
  description: string;
  section?: string;
  targetText?: string;
  suggestedFix?: string;
  actionType?: "add-keyword" | "replace-verb" | "enhance-bullet" | "add-metric" | "expand-summary" | "ai-fix";
  actionPayload?: any;
}

export interface WeakVerbOccurrence {
  verb: string;
  replacement: string;
  bulletText: string;
  experienceIndex: number;
  highlightIndex: number;
}

export interface ResumeScoreAnalysis {
  overallScore: number;
  grade: "A+" | "A" | "B" | "C" | "Needs Attention";
  tierLabel: string;
  industry: IndustryDomain;
  subScores: {
    keywordMatch: number;
    quantifiableImpact: number;
    executiveVerbs: number;
    structureAts: number;
    clarityBrevity: number;
  };
  keywordMetrics: {
    totalBenchmarked: number;
    matchedCount: number;
    missingCount: number;
    matchRate: number;
  };
  keywordsList: KeywordMatchItem[];
  suggestions: ScoreSuggestion[];
  strengths: string[];
  sectionHealth: {
    personalInfo: boolean;
    summary: boolean;
    experiences: boolean;
    skills: boolean;
    education: boolean;
    metrics: boolean;
  };
  metricsCount: number;
  weakVerbsFound: WeakVerbOccurrence[];
}
