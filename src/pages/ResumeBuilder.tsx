import React from "react";
import { ResumeStudio } from "../components/resume/ResumeStudio";
import SEO from "../components/SEO";

export const ResumeBuilder: React.FC = () => {
  return (
    <>
      <SEO
        title="Executive Resume Studio | Supply Chain & Tech Leadership"
        description="Comprehensive AI-powered resume builder, ATS keyword optimization, cover letter generator, and executive design templates for supply chain and technology leaders."
        keywords="Executive resume builder, supply chain resume template, warehouse manager resume, technology executive CV, AI cover letter generator, The Transformation Room"
      />
      <ResumeStudio />
    </>
  );
};

export default ResumeBuilder;
