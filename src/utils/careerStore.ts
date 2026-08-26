export interface BehavioralAssessmentData {
  scores: { subject: string; A: number; fullMark: number }[];
  topTraits: { title: string; percentage: number; description: string }[];
  overview: string;
  roles: string;
  nextSteps: string;
  date?: string;
}

export interface CareerSimulatorData {
  roadmap: { step: string; desc: string }[];
  gaps: string[];
  overview: string;
  currentRole: string;
  targetRole: string;
  strengths: string;
  skills: string;
  date?: string;
}

export interface ChatInsightData {
  summary: string;
  insights?: string;
  extractedGoals?: string[];
  targetRoles?: string[];
  mentionedSkills?: string[];
  date?: string;
}

export interface QuestionnaireAnswers {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  targetRole: string;
  targetIndustry: string;
  experienceLevel: string;
  currentRole: string;
  currentCompany: string;
  currentScope: string;
  topAccomplishments: string;
  systemsAndTransformations: string;
  metricsAndWins: string;
  coreCompetencies: string;
  technologiesAndTools: string;
  education: string;
  certifications: string;
  careerValues: string;
}

export interface SharedCareerProfile {
  lastUpdated: string;
  careerGoal?: string;
  currentTitle?: string;
  targetRole?: string;
  targetIndustry?: string;
  biggestGap?: string;
  experienceLevel?: string;
  behavioralAssessment?: BehavioralAssessmentData;
  simulatorData?: CareerSimulatorData;
  chatInsights?: ChatInsightData;
  questionnaireAnswers?: Partial<QuestionnaireAnswers>;
}

export type CareerProfile = SharedCareerProfile;

const STORAGE_KEY = "ttr_career_hub_shared_profile_v1";

// Subscribe to shared profile changes
export function subscribeToCareerProfile(callback: (profile: SharedCareerProfile) => void): () => void {
  const handler = (e: any) => {
    callback(e.detail || getSharedCareerProfile());
  };
  window.addEventListener("ttr:career-profile-updated", handler);
  return () => window.removeEventListener("ttr:career-profile-updated", handler);
}

// Retrieve current shared profile
export function getSharedCareerProfile(): SharedCareerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Failed to load shared career profile:", e);
  }

  return {
    lastUpdated: new Date().toISOString(),
    careerGoal: "",
    currentTitle: "",
    targetRole: "",
    targetIndustry: "",
    biggestGap: "",
    experienceLevel: "Mid-Level"
  };
}

// Save or merge updates into shared profile
export function updateSharedCareerProfile(updates: Partial<SharedCareerProfile>): SharedCareerProfile {
  const current = getSharedCareerProfile();
  const updated: SharedCareerProfile = {
    ...current,
    ...updates,
    lastUpdated: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch global event for reactive UI updates across all components
    window.dispatchEvent(new CustomEvent("ttr:career-profile-updated", { detail: updated }));
  } catch (e) {
    console.error("Failed to save shared career profile:", e);
  }

  return updated;
}

// Check if user has meaningful Career Hub or Chat data available
export function hasCareerHubData(profile?: SharedCareerProfile): boolean {
  const p = profile || getSharedCareerProfile();
  return Boolean(
    p.behavioralAssessment ||
    p.simulatorData ||
    p.chatInsights ||
    (p.questionnaireAnswers && Object.keys(p.questionnaireAnswers).length > 2) ||
    p.targetRole ||
    p.currentTitle
  );
}

// Generate actionable resume recommendations based on Career Hub results
export interface ResumeRecommendation {
  id: string;
  type: "trait" | "gap" | "keyword" | "framing" | "role";
  title: string;
  description: string;
  suggestedAction: string;
  actionPayload?: {
    type: "add_skill" | "update_summary" | "add_highlight" | "update_title";
    value: string;
    target?: string;
  };
}

export function generateResumeRecommendationsFromCareerHub(profile?: SharedCareerProfile): ResumeRecommendation[] {
  const p = profile || getSharedCareerProfile();
  const recs: ResumeRecommendation[] = [];

  // 1. Recommendations from Behavioral Assessment
  if (p.behavioralAssessment) {
    const topTrait = p.behavioralAssessment.topTraits?.[0];
    if (topTrait) {
      recs.push({
        id: "trait-top",
        type: "trait",
        title: `Emphasize ${topTrait.title} Trait (${topTrait.percentage}% Match)`,
        description: `Career Hub identified your signature strength as "${topTrait.title}".`,
        suggestedAction: `Incorporate narrative bullets demonstrating ${topTrait.title.toLowerCase()} in high-pressure operational scenarios.`,
        actionPayload: {
          type: "add_highlight",
          value: `Demonstrated ${topTrait.title} leadership in high-velocity operating environments, driving rapid resolution of systemic bottlenecks.`
        }
      });
    }

    const highScores = (p.behavioralAssessment.scores || []).filter(s => s.A >= 85);
    highScores.forEach(s => {
      recs.push({
        id: `trait-score-${s.subject.toLowerCase()}`,
        type: "keyword",
        title: `Target Competency: ${s.subject} (${s.A}/100)`,
        description: `High behavioral benchmark in ${s.subject}.`,
        suggestedAction: `Ensure "${s.subject}" is explicitly listed under Core Competencies.`,
        actionPayload: {
          type: "add_skill",
          value: s.subject,
          target: "Core Competencies"
        }
      });
    });
  }

  // 2. Recommendations from Career Simulator Gaps & Trajectory
  if (p.simulatorData) {
    if (p.simulatorData.targetRole) {
      recs.push({
        id: "sim-target-role",
        type: "role",
        title: `Target Title: ${p.simulatorData.targetRole}`,
        description: `Your Career Simulation was configured for "${p.simulatorData.targetRole}".`,
        suggestedAction: `Align your executive target headline to ${p.simulatorData.targetRole}.`,
        actionPayload: {
          type: "update_title",
          value: p.simulatorData.targetRole
        }
      });
    }

    (p.simulatorData.gaps || []).slice(0, 3).forEach((gap, idx) => {
      recs.push({
        id: `sim-gap-${idx}`,
        type: "gap",
        title: `Close Narrative Gap: ${gap}`,
        description: `Identified growth area during path simulation to ${p.simulatorData?.targetRole || "target executive role"}.`,
        suggestedAction: `Add proof-point achievements addressing this gap in recent positions.`,
        actionPayload: {
          type: "add_highlight",
          value: `Spearheaded cross-functional capability building to close ${gap.toLowerCase()} gaps across operational units.`
        }
      });
    });
  }

  // 3. Recommendations from Chat Insights
  if (p.chatInsights) {
    if (p.chatInsights.summary) {
      recs.push({
        id: "chat-insight-summary",
        type: "framing",
        title: "NOVA Strategic Framing Insight",
        description: p.chatInsights.summary.slice(0, 140) + "...",
        suggestedAction: "Frame career summary with systems orchestration rather than task management.",
        actionPayload: {
          type: "update_summary",
          value: p.chatInsights.summary
        }
      });
    }
  }

  return recs;
}
