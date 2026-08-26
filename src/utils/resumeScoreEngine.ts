import {
  ResumeData,
  IndustryDomain,
  KeywordMatchItem,
  ScoreSuggestion,
  ResumeScoreAnalysis,
  WeakVerbOccurrence
} from "../types/resume";

export interface IndustryDefinition {
  id: IndustryDomain;
  name: string;
  description: string;
  iconName: string;
  keywords: {
    hardSkills: string[];
    leadership: string[];
    toolsSystems: string[];
    certifications: string[];
    actionVerbs: string[];
  };
}

export const INDUSTRY_BENCHMARKS: Record<IndustryDomain, IndustryDefinition> = {
  "operations-supply-chain": {
    id: "operations-supply-chain",
    name: "Operations, Supply Chain & Logistics",
    description: "Operational throughput, warehouse systems, continuous improvement, and lean scaling",
    iconName: "Truck",
    keywords: {
      hardSkills: [
        "Supply Chain Optimization",
        "Warehouse Management Systems (WMS)",
        "Value Stream Mapping",
        "Continuous Improvement",
        "Inventory Optimization",
        "Logistics & Freight",
        "S&OP / Demand Planning",
        "Distribution Center Operations",
        "Procurement & Sourcing",
        "Lean Six Sigma",
        "Kaizen",
        "Root Cause Analysis (RCA)",
        "Throughput Velocity",
        "Safety & OSHA Compliance",
        "Cold Chain Logistics",
        "Capacity Planning",
        "Labor Modeling",
        "Last-Mile Delivery"
      ],
      leadership: [
        "Cross-Functional Leadership",
        "Change Management",
        "Executive Stakeholder Alignment",
        "Vendor & Supplier Governance",
        "Team Coaching & Mentorship",
        "Talent Development",
        "Workforce Scheduling",
        "Budget & CapEx Management",
        "Operational Risk Management",
        "SLA Governance"
      ],
      toolsSystems: [
        "SAP S/4HANA",
        "Oracle NetSuite",
        "Manhattan Associates",
        "Blue Yonder (JDA)",
        "Tableau",
        "Power BI",
        "SQL",
        "AutoCAD",
        "PLC / Automation Systems",
        "Autonomous Mobile Robots (AMR)",
        "Automated Storage & Retrieval (ASRS)",
        "RFID / Barcode Scanning"
      ],
      certifications: [
        "Lean Six Sigma Black Belt",
        "APICS CSCP",
        "APICS CPIM",
        "PMP",
        "Six Sigma Green Belt",
        "OSHA 30",
        "SCMP"
      ],
      actionVerbs: [
        "Orchestrated",
        "Spearheaded",
        "Optimized",
        "Streamlined",
        "Engineered",
        "Standardized",
        "Accelerated",
        "Renegotiated",
        "Delivered",
        "Championed",
        "Pioneered"
      ]
    }
  },
  "technology-engineering": {
    id: "technology-engineering",
    name: "Technology, Engineering & Cloud",
    description: "Distributed architectures, cloud infrastructure, microservices, and high-velocity engineering",
    iconName: "Code",
    keywords: {
      hardSkills: [
        "Cloud Architecture",
        "Distributed Systems",
        "Microservices",
        "CI/CD Pipelines",
        "System Resilience & Scalability",
        "API Design & Integration",
        "Data Modeling",
        "Full-Stack Development",
        "Cybersecurity & Zero Trust",
        "DevOps & Infrastructure-as-Code",
        "AI & Machine Learning Integration",
        "Database Optimization",
        "High Availability (99.99%)",
        "Test-Driven Development (TDD)",
        "Event-Driven Architecture",
        "Telemetry & Observability"
      ],
      leadership: [
        "Technical Roadmap Governance",
        "Engineering Management",
        "Agile & Scrum Coaching",
        "Cross-Functional Architecture",
        "Mentorship & Technical Hiring",
        "Sprint Planning & Velocity",
        "Technical Debt Reduction",
        "Vendor SLA Management",
        "Executive Tech Advisory"
      ],
      toolsSystems: [
        "AWS (Amazon Web Services)",
        "Google Cloud Platform (GCP)",
        "Microsoft Azure",
        "Kubernetes",
        "Docker",
        "Terraform",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Apache Kafka",
        "React",
        "TypeScript",
        "Node.js",
        "Python",
        "GitHub Actions",
        "Jira / Confluence"
      ],
      certifications: [
        "AWS Certified Solutions Architect",
        "Google Cloud Professional Cloud Architect",
        "Certified Kubernetes Administrator (CKA)",
        "CISSP",
        "PMP",
        "Scrum Master (CSM)"
      ],
      actionVerbs: [
        "Architected",
        "Engineered",
        "Deployed",
        "Refactored",
        "Automated",
        "Scaled",
        "Integrated",
        "Pioneered",
        "Implemented",
        "Secured",
        "Spearheaded"
      ]
    }
  },
  "executive-strategy": {
    id: "executive-strategy",
    name: "Executive Leadership & Strategy",
    description: "C-suite governance, P&L ownership, organizational restructuring, and high-stakes transformations",
    iconName: "Shield",
    keywords: {
      hardSkills: [
        "P&L Management",
        "Strategic Planning & Vision",
        "Corporate Governance",
        "Mergers & Acquisitions (M&A)",
        "Revenue Growth Strategy",
        "Organizational Design",
        "Enterprise Digital Transformation",
        "EBITDA Expansion",
        "Investor Relations",
        "Operational Excellence",
        "Market Expansion & GTM",
        "Board Advisory",
        "Post-Merger Integration",
        "Capital Allocation"
      ],
      leadership: [
        "Executive Influence",
        "C-Suite Advisory",
        "Culture Transformation",
        "Talent Succession Planning",
        "Global Cross-Functional Leadership",
        "Stakeholder Consensus",
        "Crisis Management & Resilience",
        "Public Speaking & Evangelism",
        "Steering Committee Governance"
      ],
      toolsSystems: [
        "Salesforce",
        "SAP S/4HANA",
        "Workday",
        "Power BI",
        "Anaplan",
        "Board Reporting Portals",
        "ERP Platforms"
      ],
      certifications: [
        "MBA",
        "NACD Directorship Certification",
        "Executive Leadership Certification",
        "PMP"
      ],
      actionVerbs: [
        "Championed",
        "Steered",
        "Transformed",
        "Maximized",
        "Mobilized",
        "Negotiated",
        "Established",
        "Directed",
        "Executed",
        "Cultivated",
        "Orchestrated"
      ]
    }
  },
  "product-design": {
    id: "product-design",
    name: "Product Management & UX",
    description: "Product roadmaps, user discovery, product-led growth, and metrics-driven design",
    iconName: "Layout",
    keywords: {
      hardSkills: [
        "Product Roadmap Strategy",
        "User Experience (UX) Research",
        "Customer Journey Mapping",
        "Product-Led Growth (PLG)",
        "A/B Testing & Experimentation",
        "Feature Prioritization",
        "Product Discovery",
        "Design Thinking",
        "Information Architecture",
        "Usability Testing",
        "Go-To-Market (GTM) Strategy",
        "KPI / OKR Tracking",
        "Retention & Churn Analysis"
      ],
      leadership: [
        "Cross-Functional Squad Leadership",
        "Stakeholder Alignment",
        "Product Vision Evangelism",
        "Design Mentorship",
        "Customer Empathy Coaching",
        "Agile Product Ownership"
      ],
      toolsSystems: [
        "Figma",
        "Jira",
        "Mixpanel",
        "Amplitude",
        "FullStory",
        "Linear",
        "Notion",
        "Miro",
        "Google Analytics 4"
      ],
      certifications: [
        "Certified Scrum Product Owner (CSPO)",
        "Pragmatic Institute Certified",
        "Nielsen Norman UX Master"
      ],
      actionVerbs: [
        "Pioneered",
        "Launched",
        "Conceived",
        "Iterated",
        "Validated",
        "Uncovered",
        "Redesigned",
        "Scaled",
        "Delivered"
      ]
    }
  },
  "finance-commercial": {
    id: "finance-commercial",
    name: "Finance, Commercial & Accounting",
    description: "Financial modeling, FP&A, cash flow optimization, risk mitigation, and commercial forecasting",
    iconName: "DollarSign",
    keywords: {
      hardSkills: [
        "Financial Modeling & Forecasting",
        "FP&A (Financial Planning & Analysis)",
        "P&L Governance",
        "Cash Flow Optimization",
        "Working Capital Management",
        "Variance Analysis",
        "Audit & GAAP / IFRS Compliance",
        "Tax Strategy & Structuring",
        "Cost Containment & Margin Expansion",
        "Valuation & Due Diligence",
        "Debt & Equity Structuring",
        "Internal Controls & SOX"
      ],
      leadership: [
        "Board Financial Presentations",
        "Commercial Business Partnering",
        "Audit Committee Reporting",
        "Finance Team Leadership",
        "Vendor Negotiation",
        "Strategic CapEx Evaluation"
      ],
      toolsSystems: [
        "Excel (Advanced Financial Modeling)",
        "Power BI",
        "SAP FICO",
        "Oracle Hyperion",
        "NetSuite",
        "Tableau",
        "QuickBooks Enterprise",
        "Bloomberg Terminal"
      ],
      certifications: [
        "CPA (Certified Public Accountant)",
        "CFA (Chartered Financial Analyst)",
        "CMA",
        "FP&A Certification",
        "MBA"
      ],
      actionVerbs: [
        "Forecasted",
        "Consolidated",
        "Quantified",
        "Renegotiated",
        "Recovered",
        "Streamlined",
        "Restructured",
        "Secured",
        "Reconciled"
      ]
    }
  },
  "healthcare-life-sciences": {
    id: "healthcare-life-sciences",
    name: "Healthcare, Biotech & Clinical",
    description: "Clinical quality, FDA compliance, healthcare operations, and patient outcomes",
    iconName: "HeartPulse",
    keywords: {
      hardSkills: [
        "Clinical Workflow Optimization",
        "Healthcare Operations",
        "Patient Safety & Outcomes",
        "FDA Regulatory Compliance",
        "HIPAA & Patient Privacy",
        "Quality Assurance & JCAHO",
        "Electronic Health Records (EHR)",
        "Clinical Trials & Protocols",
        "Medical Device Lifecycle",
        "Health Informatics & Analytics",
        "Value-Based Care"
      ],
      leadership: [
        "Physician & Clinician Alignment",
        "Interdisciplinary Team Leadership",
        "Hospital Committee Governance",
        "Change Enablement in Clinical Settings",
        "Patient Care Advocacy"
      ],
      toolsSystems: [
        "Epic Systems",
        "Cerner",
        "MEDITECH",
        "Veeva Systems",
        "SAS",
        "R / Bioconductor",
        "REDCap"
      ],
      certifications: [
        "RN / BSN / MSN",
        "FACHE (Fellow of ACHE)",
        "CPHQ (Certified Professional in Healthcare Quality)",
        "Lean Six Sigma Healthcare"
      ],
      actionVerbs: [
        "Administered",
        "Optimized",
        "Enhanced",
        "Complied",
        "Streamlined",
        "Directed",
        "Transformed",
        "Delivered"
      ]
    }
  },
  "sales-marketing": {
    id: "sales-marketing",
    name: "Sales, Growth & Marketing",
    description: "Revenue generation, enterprise deals, pipeline acceleration, and brand positioning",
    iconName: "TrendingUp",
    keywords: {
      hardSkills: [
        "Enterprise Sales & Prospecting",
        "Pipeline Velocity & Forecasting",
        "Quota Attainment (100%+)",
        "Demand Generation",
        "Account-Based Marketing (ABM)",
        "Customer Acquisition Cost (CAC)",
        "Customer Lifetime Value (LTV)",
        "Content Marketing Strategy",
        "SEO & Organic Growth",
        "Channel Partner Ecosystems",
        "Brand Strategy & Positioning"
      ],
      leadership: [
        "Sales Team Coaching & Enablement",
        "Quota Assignment & Territory Design",
        "Executive Client Relationship Management",
        "Cross-Functional Marketing Alignment",
        "High-Stakes Contract Negotiation"
      ],
      toolsSystems: [
        "Salesforce CRM",
        "HubSpot",
        "Marketo",
        "Gong.io",
        "Outreach",
        "Google Analytics",
        "LinkedIn Sales Navigator",
        "SEMrush"
      ],
      certifications: [
        "HubSpot Inbound Certification",
        "Salesforce Certified Administrator",
        "Google Ads & Analytics Certified"
      ],
      actionVerbs: [
        "Accelerated",
        "Closed",
        "Generated",
        "Expanded",
        "Negotiated",
        "Outperformed",
        "Spearheaded",
        "Captured"
      ]
    }
  },
  "consulting-transformation": {
    id: "consulting-transformation",
    name: "Consulting & Transformation",
    description: "Management consulting, change leadership, systems redesign, and client advisory",
    iconName: "Compass",
    keywords: {
      hardSkills: [
        "Operational Transformation",
        "Management Consulting",
        "Operating Model Design",
        "Change Management (Prosci)",
        "Business Process Reengineering (BPR)",
        "Capability Assessment",
        "Digital Strategy",
        "Cost Optimization & Rightsizing",
        "Benchmarking & Gap Analysis",
        "Executive Advisory & Deliverables",
        "Program Management Office (PMO)"
      ],
      leadership: [
        "Client C-Suite Engagement",
        "Workshop Facilitation",
        "Change Champion Enablement",
        "Consulting Engagement Management",
        "Multi-Workstream Governance"
      ],
      toolsSystems: [
        "Miro / Mural",
        "Power BI",
        "Lucidchart",
        "Jira Align",
        "Smartsheet",
        "Advanced Slide & Board Deck Creation"
      ],
      certifications: [
        "Prosci Certified Change Practitioner",
        "PMP",
        "Lean Six Sigma Master Black Belt",
        "Scaled Agile Framework (SAFe)"
      ],
      actionVerbs: [
        "Transformed",
        "Orchestrated",
        "Facilitated",
        "Advised",
        "Diagnosed",
        "Delivered",
        "Engineered",
        "Streamlined"
      ]
    }
  }
};

// Known weak/passive verbs to flag with recommended executive alternatives
export const WEAK_VERB_MAP: Record<string, string[]> = {
  "responsible for": ["Spearheaded", "Directed", "Orchestrated", "Governed", "Championed"],
  "assisted with": ["Co-led", "Partnered to deliver", "Enabled", "Facilitated"],
  "helped": ["Accelerated", "Strengthened", "Empowered", "Advanced"],
  "tasked to": ["Appointed to lead", "Mandated to execute", "Spearheaded"],
  "worked on": ["Engineered", "Architected", "Executed", "Constructed"],
  "handled": ["Administered", "Managed", "Resolved", "Executed"],
  "participated in": ["Collaborated with", "Contributed to", "Co-engineered"],
  "supported": ["Bolstered", "Fortified", "Enabled", "Championed"],
  "managed": ["Orchestrated", "Directed", "Steered", "Scaled", "Governed"],
  "tried to": ["Pioneered", "Implemented", "Executed"],
  "did": ["Executed", "Accomplished", "Delivered"]
};

/**
 * Automatically detects the most likely industry domain based on resume content.
 */
export function detectIndustry(resumeData: ResumeData): IndustryDomain {
  const combinedText = [
    resumeData.personalInfo?.targetTitle || "",
    resumeData.summary || "",
    ...resumeData.experiences.map(e => `${e.role} ${e.company} ${e.highlights.join(" ")}`),
    ...resumeData.skills.map(s => `${s.category} ${s.skills.join(" ")}`)
  ].join(" ").toLowerCase();

  const domainScores: Record<IndustryDomain, number> = {
    "operations-supply-chain": 0,
    "technology-engineering": 0,
    "executive-strategy": 0,
    "product-design": 0,
    "finance-commercial": 0,
    "healthcare-life-sciences": 0,
    "sales-marketing": 0,
    "consulting-transformation": 0
  };

  for (const [domainKey, config] of Object.entries(INDUSTRY_BENCHMARKS)) {
    const domain = domainKey as IndustryDomain;
    const allKeywords = [
      ...config.keywords.hardSkills,
      ...config.keywords.leadership,
      ...config.keywords.toolsSystems,
      ...config.keywords.certifications
    ];

    for (const kw of allKeywords) {
      const cleanKw = kw.toLowerCase().replace(/[^a-z0-9]/g, " ").trim();
      if (cleanKw.length > 3 && combinedText.includes(cleanKw)) {
        domainScores[domain] += 1;
      }
    }
  }

  // Bonus points for target title
  const title = (resumeData.personalInfo?.targetTitle || "").toLowerCase();
  if (title.includes("operations") || title.includes("supply chain") || title.includes("logistics") || title.includes("warehouse")) {
    domainScores["operations-supply-chain"] += 10;
  }
  if (title.includes("engineer") || title.includes("tech") || title.includes("developer") || title.includes("architect") || title.includes("cloud")) {
    domainScores["technology-engineering"] += 10;
  }
  if (title.includes("chief") || title.includes("c-level") || title.includes("vp") || title.includes("president") || title.includes("director of strategy")) {
    domainScores["executive-strategy"] += 10;
  }
  if (title.includes("product") || title.includes("ux") || title.includes("design")) {
    domainScores["product-design"] += 10;
  }
  if (title.includes("finance") || title.includes("cfo") || title.includes("controller") || title.includes("accounting") || title.includes("fp&a")) {
    domainScores["finance-commercial"] += 10;
  }
  if (title.includes("health") || title.includes("clinical") || title.includes("patient") || title.includes("nurse") || title.includes("medical")) {
    domainScores["healthcare-life-sciences"] += 10;
  }
  if (title.includes("sales") || title.includes("revenue") || title.includes("marketing") || title.includes("growth")) {
    domainScores["sales-marketing"] += 10;
  }
  if (title.includes("consult") || title.includes("transformation") || title.includes("agile coach") || title.includes("lean")) {
    domainScores["consulting-transformation"] += 10;
  }

  // Find max score
  let bestDomain: IndustryDomain = "operations-supply-chain";
  let maxScore = -1;
  for (const [domain, score] of Object.entries(domainScores)) {
    if (score > maxScore) {
      maxScore = score;
      bestDomain = domain as IndustryDomain;
    }
  }

  return bestDomain;
}

/**
 * Calculates a comprehensive Resume Score and keyword diagnostics.
 */
export function calculateResumeScore(
  resumeData: ResumeData,
  selectedIndustry?: IndustryDomain
): ResumeScoreAnalysis {
  const industry = selectedIndustry || detectIndustry(resumeData);
  const benchmark = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS["operations-supply-chain"];

  // 1. Text Aggregation & Mapping
  const summaryText = resumeData.summary || "";
  const experienceText = resumeData.experiences.map(e => `${e.role} ${e.company} ${e.highlights.join(" ")}`).join(" ");
  const skillsText = resumeData.skills.map(s => `${s.category} ${s.skills.join(" ")}`).join(" ");
  const certificationsText = resumeData.certifications.map(c => `${c.name} ${c.issuer}`).join(" ");
  const allResumeText = `${resumeData.personalInfo?.fullName || ""} ${resumeData.personalInfo?.targetTitle || ""} ${summaryText} ${experienceText} ${skillsText} ${certificationsText}`.toLowerCase();

  // Helper function to check keyword occurrence
  const checkKeywordInText = (kw: string) => {
    // Strip acronym brackets or clean string for matching
    const cleanKw = kw.toLowerCase().replace(/[\(\)\/\-]/g, " ").replace(/\s+/g, " ").trim();
    const acronymMatch = kw.match(/\(([A-Z0-9\+]+)\)/);
    const acronym = acronymMatch ? acronymMatch[1].toLowerCase() : null;

    let count = 0;
    const locations: string[] = [];

    // Check in Summary
    const summaryLower = summaryText.toLowerCase();
    if (summaryLower.includes(cleanKw) || (acronym && summaryLower.includes(acronym))) {
      count++;
      locations.push("Executive Summary");
    }

    // Check in Experiences
    resumeData.experiences.forEach((exp, idx) => {
      const expLower = `${exp.role} ${exp.company} ${exp.highlights.join(" ")}`.toLowerCase();
      if (expLower.includes(cleanKw) || (acronym && expLower.includes(acronym))) {
        count++;
        locations.push(`Experience (${exp.company || `#${idx + 1}`})`);
      }
    });

    // Check in Skills
    const skillsLower = skillsText.toLowerCase();
    if (skillsLower.includes(cleanKw) || (acronym && skillsLower.includes(acronym))) {
      count++;
      locations.push("Skills Section");
    }

    // Check in Certifications
    const certsLower = certificationsText.toLowerCase();
    if (certsLower.includes(cleanKw) || (acronym && certsLower.includes(acronym))) {
      count++;
      locations.push("Certifications");
    }

    return {
      matched: count > 0,
      occurrences: count,
      locations: Array.from(new Set(locations))
    };
  };

  // 2. Keyword Match Analysis
  const keywordsList: KeywordMatchItem[] = [];
  let matchedKeywordCount = 0;
  let totalBenchmarkKeywords = 0;

  // Process Hard Skills
  benchmark.keywords.hardSkills.forEach(kw => {
    totalBenchmarkKeywords++;
    const res = checkKeywordInText(kw);
    if (res.matched) matchedKeywordCount++;
    keywordsList.push({
      keyword: kw,
      category: "hard-skills",
      matched: res.matched,
      occurrences: res.occurrences,
      locations: res.locations
    });
  });

  // Process Leadership
  benchmark.keywords.leadership.forEach(kw => {
    totalBenchmarkKeywords++;
    const res = checkKeywordInText(kw);
    if (res.matched) matchedKeywordCount++;
    keywordsList.push({
      keyword: kw,
      category: "leadership",
      matched: res.matched,
      occurrences: res.occurrences,
      locations: res.locations
    });
  });

  // Process Tools & Systems
  benchmark.keywords.toolsSystems.forEach(kw => {
    totalBenchmarkKeywords++;
    const res = checkKeywordInText(kw);
    if (res.matched) matchedKeywordCount++;
    keywordsList.push({
      keyword: kw,
      category: "tools-systems",
      matched: res.matched,
      occurrences: res.occurrences,
      locations: res.locations
    });
  });

  // Process Certifications
  benchmark.keywords.certifications.forEach(kw => {
    totalBenchmarkKeywords++;
    const res = checkKeywordInText(kw);
    if (res.matched) matchedKeywordCount++;
    keywordsList.push({
      keyword: kw,
      category: "certifications",
      matched: res.matched,
      occurrences: res.occurrences,
      locations: res.locations
    });
  });

  const keywordMatchRate = totalBenchmarkKeywords > 0 ? (matchedKeywordCount / totalBenchmarkKeywords) * 100 : 0;
  // Scaled keyword score: 50% match rate yields ~85% score in ATS standards
  const keywordScore = Math.min(100, Math.round(Math.pow(keywordMatchRate / 60, 0.75) * 95));

  // 3. Quantifiable Impact & Metrics Analysis
  let totalBullets = 0;
  let bulletsWithMetrics = 0;
  const metricRegex = /(\$\s?\d+[\d,\.]*(\s?[kmb]|million|billion)?|\d+[\d,\.]*\s?%|\d+\+?\s?(team|members|facilities|sites|direct reports|skus|projects|clients|engineers|warehouses)|\b(roi|ebitda|sla|p&l|cap|opex|fte)\b|#\d+|\b\d+\s?(days|hours|minutes|seconds|weeks|months|years)\b)/i;

  resumeData.experiences.forEach(exp => {
    exp.highlights.forEach(h => {
      totalBullets++;
      if (metricRegex.test(h)) {
        bulletsWithMetrics++;
      }
    });
  });

  const dedicatedMetricsCount = (resumeData.metrics || []).length;
  const metricsFraction = totalBullets > 0 ? bulletsWithMetrics / totalBullets : 0;
  const baseImpactScore = Math.round(metricsFraction * 75) + Math.min(25, dedicatedMetricsCount * 6);
  const impactScore = Math.min(100, Math.max(20, baseImpactScore));

  // 4. Action Verbs & Power Phrasing Analysis
  const weakVerbsFound: WeakVerbOccurrence[] = [];
  let strongVerbBullets = 0;

  resumeData.experiences.forEach((exp, expIdx) => {
    exp.highlights.forEach((h, hlIdx) => {
      const lower = h.toLowerCase().trim();
      let hasWeak = false;

      for (const [weakPhrase, replacements] of Object.entries(WEAK_VERB_MAP)) {
        if (lower.startsWith(weakPhrase) || lower.includes(` ${weakPhrase} `)) {
          weakVerbsFound.push({
            verb: weakPhrase,
            replacement: replacements[0],
            bulletText: h,
            experienceIndex: expIdx,
            highlightIndex: hlIdx
          });
          hasWeak = true;
          break;
        }
      }

      if (!hasWeak) {
        // Check for strong executive verbs
        const firstWord = h.trim().split(/\s+/)[0]?.replace(/[^a-zA-Z]/g, "") || "";
        const isStrong = benchmark.keywords.actionVerbs.some(v => v.toLowerCase() === firstWord.toLowerCase())
          || ["led", "spearheaded", "orchestrated", "engineered", "scaled", "delivered", "built", "accelerated", "designed", "created", "championed", "negotiated"].includes(firstWord.toLowerCase());
        
        if (isStrong) {
          strongVerbBullets++;
        }
      }
    });
  });

  const verbRatio = totalBullets > 0 ? (strongVerbBullets - weakVerbsFound.length * 0.5) / totalBullets : 0;
  const verbScore = Math.min(100, Math.max(25, Math.round(Math.max(0, verbRatio) * 85 + (weakVerbsFound.length === 0 ? 15 : 0))));

  // 5. Structure & ATS Health
  const sectionHealth = {
    personalInfo: Boolean(resumeData.personalInfo?.fullName && resumeData.personalInfo?.email && resumeData.personalInfo?.targetTitle),
    summary: Boolean(resumeData.summary && resumeData.summary.split(/\s+/).length >= 25),
    experiences: Boolean(resumeData.experiences.length >= 2 && totalBullets >= 4),
    skills: Boolean(resumeData.skills.length >= 2 && resumeData.skills.reduce((acc, s) => acc + s.skills.length, 0) >= 6),
    education: Boolean(resumeData.education.length >= 1),
    metrics: Boolean((resumeData.metrics || []).length >= 2)
  };

  const completedSections = Object.values(sectionHealth).filter(Boolean).length;
  const structureScore = Math.round((completedSections / 6) * 100);

  // 6. Clarity & Brevity
  let averageBulletWords = 0;
  let wordCountSum = 0;
  resumeData.experiences.forEach(exp => {
    exp.highlights.forEach(h => {
      wordCountSum += h.split(/\s+/).filter(Boolean).length;
    });
  });
  averageBulletWords = totalBullets > 0 ? wordCountSum / totalBullets : 0;
  
  // Ideal bullet word count is 12 to 32 words
  let clarityScore = 90;
  if (averageBulletWords < 8) clarityScore -= 20;
  if (averageBulletWords > 38) clarityScore -= 25;
  if (totalBullets === 0) clarityScore = 30;

  // 7. Overall Weighted Score Calculation
  const overallScore = Math.round(
    keywordScore * 0.30 +
    impactScore * 0.25 +
    verbScore * 0.20 +
    structureScore * 0.15 +
    clarityScore * 0.10
  );

  let grade: "A+" | "A" | "B" | "C" | "Needs Attention" = "Needs Attention";
  let tierLabel = "Needs Immediate Calibration";
  if (overallScore >= 92) {
    grade = "A+";
    tierLabel = "Executive Elite (Top 5% ATS Match)";
  } else if (overallScore >= 84) {
    grade = "A";
    tierLabel = "Highly Competitive Candidate";
  } else if (overallScore >= 72) {
    grade = "B";
    tierLabel = "Solid Foundation (Optimization Recommended)";
  } else if (overallScore >= 60) {
    grade = "C";
    tierLabel = "Moderate ATS Gaps Identified";
  }

  // 8. Generate Actionable Suggestions
  const suggestions: ScoreSuggestion[] = [];

  // Keyword Suggestions
  const missingKeywords = keywordsList.filter(k => !k.matched);
  const missingHardSkills = missingKeywords.filter(k => k.category === "hard-skills").slice(0, 3);
  const missingTools = missingKeywords.filter(k => k.category === "tools-systems").slice(0, 2);

  if (missingHardSkills.length > 0) {
    suggestions.push({
      id: "missing-hard-skills",
      type: "missing-keyword",
      priority: "high",
      title: `Inject High-Value Domain Keywords (${benchmark.name})`,
      description: `Your target industry heavily weighs: ${missingHardSkills.map(k => `"${k.keyword}"`).join(", ")}. Adding these to your Skills or Highlights will elevate ATS relevance.`,
      section: "Skills",
      suggestedFix: missingHardSkills.map(k => k.keyword).join(", "),
      actionType: "add-keyword",
      actionPayload: { keywords: missingHardSkills.map(k => k.keyword) }
    });
  }

  if (missingTools.length > 0) {
    suggestions.push({
      id: "missing-tools",
      type: "missing-keyword",
      priority: "moderate",
      title: `Add Standard Tech & Platforms: ${missingTools.map(k => k.keyword).join(", ")}`,
      description: `Modern systems recruiters filter for platforms like ${missingTools.map(k => k.keyword).join(" and ")}.`,
      section: "Skills",
      suggestedFix: missingTools.map(k => k.keyword).join(", "),
      actionType: "add-keyword",
      actionPayload: { keywords: missingTools.map(k => k.keyword) }
    });
  }

  // Weak Verbs Suggestions
  if (weakVerbsFound.length > 0) {
    const firstWeak = weakVerbsFound[0];
    suggestions.push({
      id: `weak-verb-${firstWeak.experienceIndex}-${firstWeak.highlightIndex}`,
      type: "weak-verb",
      priority: "critical",
      title: `Replace Passive Phrasing: "${firstWeak.verb}"`,
      description: `Found in bullet: "${firstWeak.bulletText.slice(0, 70)}...". Replace with decisive executive action verbs like "${firstWeak.replacement}".`,
      section: "Experience",
      targetText: firstWeak.bulletText,
      suggestedFix: firstWeak.replacement,
      actionType: "replace-verb",
      actionPayload: firstWeak
    });
  }

  // Quantifiable Metric Suggestions
  if (metricsFraction < 0.6) {
    suggestions.push({
      id: "add-quantifiable-metrics",
      type: "missing-metric",
      priority: "high",
      title: "Boost Quantifiable Proof (ROI, $, %, Timelines)",
      description: `Only ${Math.round(metricsFraction * 100)}% of your bullet points contain numbers. Executive recruiters look for quantifiable dollar impact, percent improvements, or team scale in at least 70% of bullets.`,
      section: "Experience",
      suggestedFix: "Use the [X-Y-Z] formula: 'Accomplished [X] as measured by [Y%] by doing [Z]'.",
      actionType: "enhance-bullet"
    });
  }

  // Dedicated Metric Badges
  if (dedicatedMetricsCount < 3) {
    suggestions.push({
      id: "add-metric-badges",
      type: "missing-metric",
      priority: "quick-win",
      title: "Add Standout Metric Badges",
      description: "Highlight 3-4 top career wins (e.g. '+$4.2M Margin', '38% Throughput Boost') to appear in the header banner.",
      section: "Metrics",
      suggestedFix: "+25% Efficiency | $1.5M Savings",
      actionType: "add-metric"
    });
  }

  // Summary Length & Presence
  if (!sectionHealth.summary) {
    suggestions.push({
      id: "expand-summary",
      type: "section-length",
      priority: "critical",
      title: "Elevate Executive Summary",
      description: "Your summary is missing or brief (< 25 words). A compelling 3-4 sentence narrative framing your transformation leadership creates an immediate anchor for hiring executives.",
      section: "Summary",
      suggestedFix: "Generate a targeted summary with AI",
      actionType: "expand-summary"
    });
  }

  // Strengths compilation
  const strengths: string[] = [];
  if (keywordScore >= 80) strengths.push(`High industry keyword density for ${benchmark.name} (${matchedKeywordCount} keywords matched).`);
  if (impactScore >= 75) strengths.push("Strong quantifiable evidence with tangible numbers, percentages, or dollar achievements.");
  if (verbScore >= 80) strengths.push("Decisive executive action verbs commanding leadership authority across roles.");
  if (sectionHealth.skills && resumeData.skills.length >= 3) strengths.push("Well-categorized skills taxonomy ensuring high ATS parser legibility.");
  if (sectionHealth.metrics && (resumeData.metrics || []).length >= 3) strengths.push("Standout executive metrics callout section creating strong visual hierarchy.");
  if (strengths.length === 0) {
    strengths.push("Solid foundation ready for high-impact metric and industry keyword calibration.");
  }

  return {
    overallScore,
    grade,
    tierLabel,
    industry,
    subScores: {
      keywordMatch: keywordScore,
      quantifiableImpact: impactScore,
      executiveVerbs: verbScore,
      structureAts: structureScore,
      clarityBrevity: clarityScore
    },
    keywordMetrics: {
      totalBenchmarked: totalBenchmarkKeywords,
      matchedCount: matchedKeywordCount,
      missingCount: totalBenchmarkKeywords - matchedKeywordCount,
      matchRate: Math.round(keywordMatchRate)
    },
    keywordsList,
    suggestions,
    strengths,
    sectionHealth,
    metricsCount: bulletsWithMetrics + dedicatedMetricsCount,
    weakVerbsFound
  };
}

/**
 * Utility to inject missing keywords into the resume's skills or appropriate section.
 */
export function applyAddKeywordToResume(
  resumeData: ResumeData,
  keywords: string[],
  categoryName: string = "Core Competencies & Domain Expertise"
): ResumeData {
  const updated = { ...resumeData };
  const currentSkills = [...(updated.skills || [])];

  let targetCat = currentSkills.find(c => c.category.toLowerCase().includes("competenc") || c.category.toLowerCase().includes("domain") || c.category.toLowerCase().includes("technical"));
  
  if (targetCat) {
    const existing = new Set(targetCat.skills);
    keywords.forEach(kw => existing.add(kw));
    targetCat.skills = Array.from(existing);
  } else {
    currentSkills.push({
      id: `cat-${Date.now()}`,
      category: categoryName,
      skills: keywords
    });
  }

  updated.skills = currentSkills;
  return updated;
}

/**
 * Utility to replace a weak verb in a bullet point.
 */
export function applyReplaceWeakVerb(
  resumeData: ResumeData,
  expIdx: number,
  hlIdx: number,
  newVerb: string
): ResumeData {
  const updated = { ...resumeData };
  if (!updated.experiences[expIdx] || !updated.experiences[expIdx].highlights[hlIdx]) {
    return updated;
  }

  const currentHighlight = updated.experiences[expIdx].highlights[hlIdx];
  const words = currentHighlight.trim().split(/\s+/);
  
  // Replace first word or leading phrase
  let replaced = false;
  for (const weakPhrase of Object.keys(WEAK_VERB_MAP)) {
    if (currentHighlight.toLowerCase().startsWith(weakPhrase)) {
      const restOfSentence = currentHighlight.slice(weakPhrase.length).trim();
      updated.experiences[expIdx].highlights[hlIdx] = `${newVerb} ${restOfSentence}`;
      replaced = true;
      break;
    }
  }

  if (!replaced) {
    words[0] = newVerb;
    updated.experiences[expIdx].highlights[hlIdx] = words.join(" ");
  }

  return updated;
}
