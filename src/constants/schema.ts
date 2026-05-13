export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "The Transformation Room",
  "url": "https://thetransformationroom.com",
  "logo": "https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png",
  "description": "Aligning people, connecting systems, and driving results through professional operations and technology consulting.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "USA",
    "addressRegion": "Global"
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
  "url": "https://thetransformationroom.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://thetransformationroom.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};
