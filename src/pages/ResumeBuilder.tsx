import React from "react";
import { ResumeStudio } from "../components/resume/ResumeStudio";
import SEO from "../components/SEO";

export const ResumeBuilder: React.FC = () => {
  return (
    <>
      <SEO
        title="Executive Resume & Cover Letter Studio"
        description="Comprehensive AI-powered resume builder, ATS keyword optimization, cover letter generator, and executive design templates from The Transformation Room."
      />
      <ResumeStudio />
    </>
  );
};

export default ResumeBuilder;
