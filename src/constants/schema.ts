export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "The Transformation Room",
  "legalName": "The Transformation Room, LLC",
  "url": "https://thetransformationroom.com",
  "logo": "https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png",
  "image": "https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png",
  "description": "Premier consulting firm specializing in supply chain consulting, warehouse consulting, technology consulting, and AI consulting for enterprise operations and workforce readiness.",
  "knowsAbout": [
    "Supply Chain Consulting",
    "Warehouse Consulting",
    "Technology Consulting",
    "AI Consulting",
    "Supply Chain Optimization",
    "Warehouse Automation",
    "Robotics & Cobots Integration",
    "Automated Storage and Retrieval Systems (AS/RS)",
    "Autonomous Mobile Robots (AMR / AGV)",
    "Enterprise Systems Integration",
    "Artificial Intelligence Strategy",
    "Operations Diagnostics & Audits",
    "Workforce Transformation"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Consulting Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Supply Chain Consulting",
          "description": "End-to-end supply chain optimization, network logistics, and resilient operational architecture."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Warehouse Consulting",
          "description": "Warehouse layout optimization, AS/RS automation, AMR/AGV deployment, and throughput acceleration."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Technology Consulting",
          "description": "Enterprise systems integration, digital visibility, data telemetry, and scalable operations software."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI Consulting",
          "description": "Industrial AI agent orchestration, predictive operations modeling, and computer vision integration."
        }
      }
    ]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://www.linkedin.com/company/the-transformation-room",
    "https://twitter.com/thetransroom"
  ]
};

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "The Transformation Room",
  "alternateName": "The Transformation Room, LLC",
  "url": "https://thetransformationroom.com",
  "description": "Supply chain consulting, warehouse consulting, technology consulting, and AI consulting services.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://thetransformationroom.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

