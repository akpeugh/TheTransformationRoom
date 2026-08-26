import { ResumeData, CoverLetterData } from "../types/resume";

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "Alex Rivera",
    targetTitle: "Director of Supply Chain & Operations Transformation",
    email: "alex.rivera@example.com",
    phone: "(555) 349-8201",
    location: "Richmond, VA",
    linkedin: "linkedin.com/in/alex-rivera-transformation",
    portfolio: "alexrivera.ops"
  },
  summary: "Results-driven Operations Transformation Executive with 10+ years architecting high-throughput logistics, autonomous warehouse automation (AMR/ASRS), and cross-functional team alignment. Proven history orchestrating multi-site transformations that reduced operating expenditures by 28% while boosting operational velocity and workforce retention.",
  metrics: [
    { label: "Cost Savings Delivered", value: "$14.2M" },
    { label: "Throughput Acceleration", value: "+38%" },
    { label: "Safety & Retention", value: "99.4%" },
    { label: "Automation Rollouts", value: "6 Facilities" }
  ],
  experiences: [
    {
      id: "exp-1",
      company: "Apex Global Logistics",
      role: "Senior Director of Operations & Systems Strategy",
      location: "Richmond, VA",
      startDate: "2022",
      endDate: "Present",
      current: true,
      highlights: [
        "Spearheaded multi-million dollar warehouse modernization initiative across 4 distribution hubs, deploying autonomous mobile robots (AMRs) and AI-driven sorting to boost daily throughput by 38%.",
        "Orchestrated cross-functional operational redesign for 350+ frontline personnel, cutting fulfillment cycle times by 42% and eliminating over 1,200 annual overtime hours.",
        "Collaborated with executive leadership to implement real-time inventory telemetry and predictive analytics, preventing an estimated $3.4M in stockout losses annually.",
        "Championed continuous improvement and human-in-the-loop AI adoption, achieving a 94% workforce satisfaction score during technical migrations."
      ]
    },
    {
      id: "exp-2",
      company: "Vanguard Distribution Networks",
      role: "Operations Transformation Manager",
      location: "Norfolk, VA",
      startDate: "2018",
      endDate: "2022",
      current: false,
      highlights: [
        "Led Lean Six Sigma initiatives that reduced order processing errors by 64% and improved on-time delivery metrics from 89% to 99.2%.",
        "Designed and implemented computerized slotting optimization algorithms, expanding warehouse storage capacity by 22% without structural expansions.",
        "Managed a $12M capital budget for automation conveyor retrofits and IoT sensor arrays, delivering complete ROI within 14 months."
      ]
    },
    {
      id: "exp-3",
      company: "Pinnacle Freight & Logistics",
      role: "Lead Logistics & Continuous Improvement Analyst",
      location: "Richmond, VA",
      startDate: "2015",
      endDate: "2018",
      current: false,
      highlights: [
        "Analyzed network logistics routing datasets across 18 regional carriers, renegotiating terms and capturing $1.8M in annualized freight savings.",
        "Standardized operational standard operating procedures (SOPs) and safety compliance frameworks, reducing lost-time incidents by 45%."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Virginia Tech - Pamplin College of Business",
      degree: "Master of Science (M.S.)",
      field: "Supply Chain & Industrial Engineering Management",
      location: "Blacksburg, VA",
      graduationDate: "2015",
      honors: "Summa Cum Laude"
    },
    {
      id: "edu-2",
      institution: "University of Virginia",
      degree: "Bachelor of Science (B.S.)",
      field: "Systems & Information Engineering",
      location: "Charlottesville, VA",
      graduationDate: "2013"
    }
  ],
  skills: [
    {
      id: "skill-1",
      category: "Operational Strategy & Transformation",
      skills: [
        "Warehouse Automation (AMR/AGV/ASRS)",
        "Lean Six Sigma Black Belt",
        "Systems Architecture",
        "Change Management",
        "Cross-Functional Team Leadership",
        "CapEx & Budget Management"
      ]
    },
    {
      id: "skill-2",
      category: "Data & Systems Telemetry",
      skills: [
        "Predictive Supply Chain Analytics",
        "WMS / ERP Integration (SAP, Manhattan)",
        "IoT & Asset Tracking",
        "SQL & Python Data Modeling",
        "Tableau / PowerBI Dashboards",
        "Process Flow Mapping"
      ]
    },
    {
      id: "skill-3",
      category: "Executive Governance",
      skills: [
        "C-Suite Stakeholder Reporting",
        "Vendor Negotiation & SLA Governance",
        "Workforce Development & Ergonomics",
        "Risk Mitigation & Business Continuity"
      ]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Lean Six Sigma Black Belt (LSSBB)",
      issuer: "ASQ - American Society for Quality",
      date: "2020"
    },
    {
      id: "cert-2",
      name: "Certified Supply Chain Professional (CSCP)",
      issuer: "APICS / ASCM",
      date: "2019"
    },
    {
      id: "cert-3",
      name: "Project Management Professional (PMP)",
      issuer: "Project Management Institute",
      date: "2017"
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "Autonomous High-Bay Facility Overhaul",
      role: "Executive Project Sponsor",
      description: "Complete brownfield conversion of a 450,000 sq ft logistics facility into a semi-autonomous micro-fulfillment center.",
      highlights: [
        "Delivered project 3 weeks ahead of scheduled go-live deadline with zero business interruption.",
        "Increased pick-and-pack velocity by 3.2x while improving worker ergonomics and safety metrics."
      ]
    }
  ],
  awards: [
    "Transformation Excellence Award - Apex Global (2024)",
    "Supply Chain Innovator of the Year Nominee (2023)"
  ]
};

export const defaultCoverLetterData: CoverLetterData = {
  sender: {
    fullName: "Alex Rivera",
    title: "Operations & Supply Chain Transformation Leader",
    email: "alex.rivera@example.com",
    phone: "(555) 349-8201",
    location: "Richmond, VA",
    linkedin: "linkedin.com/in/alex-rivera-transformation"
  },
  recipient: {
    hiringManagerName: "Hiring Manager",
    hiringManagerTitle: "Executive Talent Acquisition",
    companyName: "Horizon Advanced Logistics",
    companyAddress: "Boston, MA"
  },
  date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  targetRole: "Operations Transformation Director",
  salutation: "Dear Hiring Manager,",
  openingParagraph: "I am excited to apply for the Operations Transformation Director role at Horizon Advanced Logistics. With more than a decade of experience across operational transformation, logistics analytics, automation deployment, and distribution strategy, I believe my background would allow me to contribute quickly in this role.",
  currentPositionParagraph: "In my current position as Senior Director of Operations & Systems Strategy at Apex Global Logistics, I partner with operations and executive leaders to turn financial and operational data into actionable business decisions. My experience includes throughput optimization, CapEx planning and forecasting, labor modeling, inventory telemetry, network optimization, and executive decision support.",
  scopeAlignmentParagraph: "While my current scope is broader than a traditional Operations Transformation Director role, this opportunity aligns closely with the work I have built my career around and where I can add immediate value.",
  highlightsHeader: "Highlights of my experience include:",
  highlights: [
    {
      label: "Operational Systems Transformation",
      text: "Partnered with Executive Leadership and Operations on modernization across 4 distribution hubs, deploying autonomous robotics to boost daily throughput by 38%."
    },
    {
      label: "Financial & Systems Analytics",
      text: "Delivered predictive telemetry and slotting models, preventing $3.4M in inventory stockout losses and capturing $14.2M in cumulative efficiency savings."
    },
    {
      label: "Labor & Workforce Planning",
      text: "Supported labor planning, flexible scheduling, and automation adoption initiatives, achieving a 94% workforce satisfaction score during technical migrations."
    },
    {
      label: "Strategic Business Partnership",
      text: "Developed analytics supporting network optimization, volume movement, capacity planning, and executive steering committee decision-making."
    }
  ],
  bodyParagraphs: [],
  companyInterestParagraph: "I am particularly interested in Horizon Advanced Logistics because of the opportunity to stay close to high-impact operational execution while bringing a broader understanding of analytics and automation strategy. I would welcome the opportunity to discuss how my experience could support the team.",
  thankYouLine: "Thank you for your consideration.",
  closingParagraph: "",
  signoff: "Kind regards,",
  enclosureNotice: "Enclosure: Résumé",
  headerLayout: "centered-letterhead",
  signatureStyle: "script-signature"
};

export const sampleExecutiveProfiles: {
  id: string;
  name: string;
  role: string;
  industry: string;
  description: string;
  data: ResumeData;
}[] = [
  {
    id: "ops-exec",
    name: "Alex Rivera",
    role: "Director of Supply Chain & Operations Transformation",
    industry: "Logistics, Automation & Robotics",
    description: "Multi-site automation deployment, AMR/ASRS integration, and $14M+ cost reductions.",
    data: defaultResumeData
  },
  {
    id: "eng-leader",
    name: "Elena Rostova",
    role: "VP of Engineering & Cloud Infrastructure",
    industry: "Enterprise SaaS & Cloud Architecture",
    description: "Scaled engineering org from 40 to 180+ engineers, reduced cloud infrastructure spend by 34%, and achieved 99.99% uptime.",
    data: {
      personalInfo: {
        fullName: "Elena Rostova",
        targetTitle: "VP of Engineering & Cloud Infrastructure",
        email: "elena.rostova@cloudscale.io",
        phone: "(415) 892-3401",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/elena-rostova-tech",
        portfolio: "rostova.dev"
      },
      summary: "Executive Technology Leader with 14+ years scaling high-availability distributed systems, developer platforms, and enterprise cloud operations. Proven track record leading global engineering organizations of 180+ engineers across multi-region architectures, reducing cloud infrastructure spend by 34% ($8.2M/yr) while sustaining 99.99% core service availability.",
      metrics: [
        { label: "Cloud CapEx Savings", value: "$8.2M/yr" },
        { label: "Engineering Org Scale", value: "180+ Global" },
        { label: "System Availability", value: "99.99%" },
        { label: "Deployment Velocity", value: "14x Faster" }
      ],
      experiences: [
        {
          id: "exp-e1",
          company: "Nexus Cloud Systems",
          role: "VP of Engineering & Infrastructure",
          location: "San Francisco, CA",
          startDate: "2021",
          endDate: "Present",
          current: true,
          highlights: [
            "Architected enterprise Kubernetes & microservices migration for tier-1 platform processing 4.2B daily API requests with 99.99% SLA.",
            "Spearheaded cloud optimization initiative, renegotiating enterprise cloud commitments and refactoring workloads to yield $8.2M in annual recurring savings.",
            "Recruited and scaled a global engineering team from 45 to 180+ across 4 time zones with 94% annualized retention and top eNPS scores.",
            "Championed automated CI/CD pipeline modernization, slashing production deployment cycle times from 3 weeks to under 45 minutes."
          ]
        },
        {
          id: "exp-e2",
          company: "Aura Distributed Data",
          role: "Director of Platform Engineering",
          location: "San Jose, CA",
          startDate: "2017",
          endDate: "2021",
          current: false,
          highlights: [
            "Led 5 engineering squads overseeing database internals, observability telemetry, and core infrastructure services.",
            "Spearheaded SOC2 Type II, ISO 27001, and FedRAMP compliance certification processes across all cloud microservices."
          ]
        }
      ],
      education: [
        {
          id: "edu-e1",
          institution: "Stanford University",
          degree: "Master of Science (M.S.)",
          field: "Computer Science (Distributed Systems)",
          location: "Stanford, CA",
          graduationDate: "2015"
        }
      ],
      skills: [
        {
          id: "sk-e1",
          category: "Cloud & Distributed Architecture",
          skills: ["AWS / GCP / Azure", "Kubernetes & Docker", "Terraform & IaC", "Distributed Systems", "Kafka & Event Streams", "Microservices"]
        },
        {
          id: "sk-e2",
          category: "Executive & Tech Leadership",
          skills: ["Engineering Org Design", "Budget & Vendor Governance", "Agile at Scale", "Hiring & Talent Development", "Developer Productivity"]
        }
      ],
      certifications: [
        { id: "c-e1", name: "AWS Certified Solutions Architect - Professional", issuer: "Amazon Web Services", date: "2023" },
        { id: "c-e2", name: "Certified Kubernetes Administrator (CKA)", issuer: "Linux Foundation", date: "2022" }
      ],
      projects: [],
      awards: ["Tech Transformation Leader of the Year (2024)"]
    }
  },
  {
    id: "people-exec",
    name: "Marcus Vance",
    role: "Chief People Officer & Organizational Strategist",
    industry: "Enterprise Scale & Human Capital Transformation",
    description: "Orchestrated post-merger integration for 2,400 employees, reduced turnover by 29%, and engineered modern talent pipelines.",
    data: {
      personalInfo: {
        fullName: "Marcus Vance",
        targetTitle: "Chief People Officer & Organizational Strategist",
        email: "m.vance@transformationhr.com",
        phone: "(312) 555-0199",
        location: "Chicago, IL",
        linkedin: "linkedin.com/in/marcus-vance-cpo",
        portfolio: "marcusvance.exec"
      },
      summary: "Forward-thinking Chief People Officer with 15+ years architecting enterprise human capital transformations, executive succession planning, and post-merger cultural integrations. Champion of transparent, data-informed organizational design that drives measurable business performance, high employee retention, and continuous leadership development.",
      metrics: [
        { label: "Workforce Integration", value: "2,400 Staff" },
        { label: "Turnover Reduction", value: "-29%" },
        { label: "Employee NPS", value: "+46 pts" },
        { label: "Talent Acquisition Time", value: "-35%" }
      ],
      experiences: [
        {
          id: "exp-p1",
          company: "Crestview Holdings Global",
          role: "Chief People Officer",
          location: "Chicago, IL",
          startDate: "2020",
          endDate: "Present",
          current: true,
          highlights: [
            "Architected complete organizational harmonization following a $450M acquisition, unifying 2,400 personnel across 8 global entities with zero loss of key executive talent.",
            "Overhauled performance management and compensation frameworks, resulting in a 29% reduction in voluntary attrition and a 46-point surge in eNPS.",
            "Designed and launched the Leadership Acceleration Academy, preparing 60+ emerging managers for VP and Director appointments."
          ]
        },
        {
          id: "exp-p2",
          company: "Vanguard Life Sciences",
          role: "VP of Global Talent & Culture",
          location: "Chicago, IL",
          startDate: "2016",
          endDate: "2020",
          current: false,
          highlights: [
            "Introduced automated ATS workflows and AI-assisted candidate matching, cutting time-to-hire by 35% while expanding diversity candidate pipelines by 52%."
          ]
        }
      ],
      education: [
        {
          id: "edu-p1",
          institution: "Northwestern University - Kellogg School of Management",
          degree: "Master of Science (M.S.)",
          field: "Organizational Leadership & Behavior",
          location: "Evanston, IL",
          graduationDate: "2014"
        }
      ],
      skills: [
        {
          id: "sk-p1",
          category: "Strategic People Leadership",
          skills: ["Organizational Design & Restructuring", "Executive Succession Planning", "Post-Merger Integration (M&A)", "Total Rewards & Compensation", "DEI & Culture Strategy"]
        },
        {
          id: "sk-p2",
          category: "People Analytics & HR Tech",
          skills: ["Workday / SAP SuccessFactors", "People Analytics & Predictive Retention", "Performance Calibration", "Labor Relations & Compliance"]
        }
      ],
      certifications: [
        { id: "c-p1", name: "Senior Professional in Human Resources (SPHR)", issuer: "HRCI", date: "2021" },
        { id: "c-p2", name: "SHRM Senior Certified Professional (SHRM-SCP)", issuer: "SHRM", date: "2019" }
      ],
      projects: [],
      awards: ["Excellence in People Leadership Award (2023)"]
    }
  }
];

