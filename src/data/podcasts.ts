export interface Podcast {
  id: string;
  title: string;
  description: string;
  url: string;
  duration?: string;
  featured?: boolean;
  type?: string;
}

export const PODCASTS: Podcast[] = [
  {
    id: "ai-fluent-humans",
    title: "Why Robots Need AI Fluent Humans",
    description: "Exploring the critical intersection of human intuition and artificial intelligence in modern operational ecosystems. A deep dive into why technical automation alone is a trap without human-centric strategy.",
    url: "https://storage.googleapis.com/thetransformationroomassets/Why_Robots_Need_AI_Fluent_Humans.m4a",
    featured: true,
    type: "Latest Episode"
  },
  {
    id: "growth-without-structure",
    title: "Trap of Growth Without Structure",
    description: "The hidden dangers of scaling without a robust operational foundation. We discuss how middle-market companies can bridge the gap between ambition and infrastructure.",
    url: "https://storage.googleapis.com/thetransformationroomassets/Trap_of_Growth_Without_Structure.m4a",
    type: "Operational Strategy"
  },
  {
    id: "legacy-heroics",
    title: "Scaling Beyond Legacy Heroics",
    description: "Moving from individual acts of bravery to systematic operational excellence. Learn how to transform daily firefighting into scalable, resilient processes.",
    url: "https://storage.googleapis.com/thetransformationroomassets/Scaling_Beyond_Legacy_Heroics.m4a",
    type: "Leadership & Systems"
  }
];
