import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object;
}

const DEFAULT_KEYWORDS = "Supply Chain Consulting, Warehouse Consulting, Technology Consulting, AI Consulting, Warehouse Automation, Supply Chain Optimization, Robotics Consulting, AI Integration, Operations Consulting, AS/RS Automation, AMR AGV Integration, Enterprise Systems Architecture, The Transformation Room";

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "The Transformation Room specializes in supply chain consulting, warehouse consulting, technology consulting, and AI consulting to align people, connect systems, and drive measurable operational results.", 
  keywords = DEFAULT_KEYWORDS,
  image = "https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png",
  url = "https://thetransformationroom.com",
  type = "website",
  schema
}) => {
  const siteTitle = "The Transformation Room";
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | Supply Chain, Warehouse, Technology & AI Consulting`;
  const canonicalUrl = url || "https://thetransformationroom.com";

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="author" content="The Transformation Room, LLC" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="The Transformation Room" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

