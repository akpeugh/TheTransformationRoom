import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import { generateAIContent } from "./server/ai";
import { fallbackParseResumeText } from "./src/utils/resumeParserFallback";
import { normalizeExtractedText, sanitizeAndNormalizeResumeText } from "./src/utils/textNormalizer";
import { sanitizeResumeText } from "./src/utils/resumeSanitizer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: "10mb" }));

  // Initialize OpenAI (Ensure OPEN_AI_API_KEY or OPENAI_API_KEY is in your environment)
  let openai: OpenAI | null = null;
  const isStreamingEnabled = true; // Streaming active true/false
  
  // Support variations (User preference: OPEN_AI_API_KEY)
  const openAIKey = process.env.OPEN_AI_API_KEY || process.env.OPENAI_API_KEY;
  
  console.log(`[Server] Environment Check: GEMINI_API_KEY present: ${!!process.env.GEMINI_API_KEY}, OPEN_AI_API_KEY present: ${!!process.env.OPEN_AI_API_KEY}, OPENAI_API_KEY present: ${!!process.env.OPENAI_API_KEY}`);
  
  try {
    if (openAIKey) {
      openai = new OpenAI({ apiKey: openAIKey });
      console.log(`[Server] OpenAI initialized successfully.`);
    }
  } catch (error) {
    console.error("[Server] OpenAI initialization error:", error);
  }

  // Robust helper function to extract and parse JSON safely from LLM output
  const extractJSON = (text: string) => {
    if (!text || typeof text !== "string") {
      throw new Error("Empty text provided for JSON extraction");
    }

    // Strip markdown code fences (e.g. ```json ... ```)
    let cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```\s*$/gi, "").trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      // Find outermost JSON object or array
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        const potentialObj = cleaned.substring(firstBrace, lastBrace + 1);
        try {
          return JSON.parse(potentialObj);
        } catch {
          // Attempt common syntax fixes (trailing commas)
          const fixedObj = potentialObj
            .replace(/,\s*([\}\]])/g, "$1")
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
          try {
            return JSON.parse(fixedObj);
          } catch (innerErr) {
            console.warn("[Server] Advanced JSON parse failed on substring:", innerErr);
          }
        }
      }
      throw new Error("Failed to parse JSON output from AI response");
    }
  };

  // API routes go here FIRST
  app.get("/api/health", (req, res) => {
    console.log("[Server] Health check ping received.");
    res.json({ status: "ok", environment: process.env.NODE_ENV || 'development' });
  });

  // --- /api/resume/parse route: Comprehensive parsing of raw resume text with 100% fallback reliability ---
  app.post("/api/resume/parse", async (req, res) => {
    try {
      const { rawText } = req.body;
      if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
        return res.status(400).json({ error: "Missing rawText field for parsing." });
      }

      console.log(`[Server] Parsing resume text (${rawText.length} chars)...`);

      // Pre-normalize and sanitize text (strip non-printable chars, normalize whitespace, fix encoding artifacts, and collapse OCR kerning)
      const sanitized = sanitizeResumeText(rawText);
      const cleanText = sanitizeAndNormalizeResumeText(sanitized);

      let parsedJSON: any = null;

      try {
        const systemInstruction = `You are an elite Executive Resume Parser and Data Structuring Engine for The Transformation Room.
Your task is to parse unstructured or semi-structured resume text and convert it into a strictly valid, comprehensive JSON object matching the ResumeData schema.

Extract all details meticulously:
1. personalInfo: { fullName, targetTitle, email, phone, location, linkedin, portfolio }
   - Ensure fullName is the real candidate name (clean up spaced letters like "K A R E E M A L S H O M A L Y" to "Kareem Alshomaly").
   - Extract targetTitle or most senior engineering/executive leadership role.
2. summary: A compelling 2-4 sentence executive summary highlighting leadership scope, revenue/budget supported, and strategic value.
3. metrics: Array of 3-4 objects, each with { label: string, value: string } (e.g. [{"label": "Annual Revenue Supported", "value": "$10M"}, {"label": "On-Time Delivery", "value": "99.7%"}, {"label": "Cross-Functional Scale", "value": "5G & IoT"}]).
4. experiences: Array of jobs. Each job must have:
   - id: string (e.g. "exp-1")
   - company: string
   - role: string
   - location: string
   - startDate: string
   - endDate: string
   - current: boolean
   - highlights: Array of high-impact action bullets starting with strong past/present verbs.
   CRITICAL: Do NOT include cover letter text (e.g. "Dear Hiring Manager...", "Kind regards...") in experience highlights. Extract only real work achievements.
5. education: Array of degrees/institutions with id, institution, degree, field, location, graduationDate.
6. skills: Array of 3-4 categorized objects with id, category, skills: string[] (e.g. "Engineering & Solutions", "Technical Operations", "Leadership & Strategic Partnerships").
7. certifications: Array of objects with id, name, issuer, date.
8. projects: Array of projects with id, name, description, highlights.
9. awards: Array of strings.

Return ONLY valid JSON matching this schema without markdown code fences.`;

        const prompt = `Here is the resume text to parse into JSON:\n\n${cleanText.slice(0, 15000)}`;

        const aiResponse = await generateAIContent({
          systemInstruction,
          prompt,
          jsonMode: true,
        });

        parsedJSON = extractJSON(aiResponse);
      } catch (aiErr: any) {
        console.warn("[Server] AI parsing encountered an issue, deploying intelligent heuristic parser fallback:", aiErr.message || aiErr);
        parsedJSON = fallbackParseResumeText(cleanText);
      }

      // If parsedJSON is somehow missing or empty, apply fallback parser
      if (!parsedJSON || !parsedJSON.personalInfo) {
        parsedJSON = fallbackParseResumeText(cleanText);
      }

      // Helper to sanitize metrics to { label: string, value: string }
      const formatMetrics = (rawMetrics: any[]): { label: string; value: string }[] => {
        if (!Array.isArray(rawMetrics) || rawMetrics.length === 0) {
          return fallbackParseResumeText(cleanText).metrics;
        }
        return rawMetrics.map((m, i) => {
          if (typeof m === "object" && m !== null) {
            return {
              label: m.label || (i === 0 ? "Revenue Impact" : i === 1 ? "Service SLA" : "Scale"),
              value: String(m.value || m.val || "$10M+")
            };
          }
          if (typeof m === "string") {
            const moneyMatch = m.match(/\$\d+(?:\.\d+)?(?:M|K|B|\+)?/i);
            const pctMatch = m.match(/\+?\d{1,3}%/);
            if (moneyMatch) {
              const label = m.replace(moneyMatch[0], "").replace(/in\s+|annual\s+|impact/gi, "").trim() || "Annual Impact";
              return { label: label.slice(0, 24), value: moneyMatch[0] };
            }
            if (pctMatch) {
              const label = m.replace(pctMatch[0], "").trim() || "Improvement";
              return { label: label.slice(0, 24), value: pctMatch[0] };
            }
            return { label: `Impact Metric ${i + 1}`, value: m.slice(0, 20) };
          }
          return { label: "Performance", value: "99%+" };
        });
      };

      // Helper to filter out cover letter boilerplate from bullets
      const cleanBulletText = (bullets: string[]): string[] => {
        if (!Array.isArray(bullets)) return [];
        return bullets
          .map(b => typeof b === "string" ? b.trim() : "")
          .filter(b => {
            if (b.length < 5) return false;
            if (/^(Dear Hiring Manager|Kind regards|Enclosure:|Thank you for your consideration|I am excited to apply)/i.test(b)) return false;
            return true;
          });
      };

      // Sanitize and ensure all required fields are present
      const sanitizedData = {
        personalInfo: {
          fullName: parsedJSON.personalInfo?.fullName || "Executive Candidate",
          targetTitle: parsedJSON.personalInfo?.targetTitle || "Operations & Transformation Leader",
          email: parsedJSON.personalInfo?.email || "",
          phone: parsedJSON.personalInfo?.phone || "",
          location: parsedJSON.personalInfo?.location || "",
          linkedin: parsedJSON.personalInfo?.linkedin || "",
          portfolio: parsedJSON.personalInfo?.portfolio || parsedJSON.personalInfo?.["portfolio/website"] || ""
        },
        summary: parsedJSON.summary || "Experienced leader specializing in operational excellence and systems transformation.",
        experiences: Array.isArray(parsedJSON.experiences) && parsedJSON.experiences.length > 0
          ? parsedJSON.experiences.map((exp: any, i: number) => {
              const rawHighlights = Array.isArray(exp.highlights) ? exp.highlights : [];
              const cleanedHighlights = cleanBulletText(rawHighlights);
              return {
                id: exp.id || `exp-${i + 1}`,
                company: exp.company || "Enterprise Organization",
                role: exp.role || "Operations Leader",
                location: exp.location || "United States",
                startDate: exp.startDate || "2020",
                endDate: exp.endDate || "Present",
                current: exp.current ?? (exp.endDate ? /present|current/i.test(exp.endDate) : true),
                highlights: cleanedHighlights.length > 0
                  ? cleanedHighlights
                  : ["Led operational strategy, systems optimization, and cross-functional teams."]
              };
            })
          : fallbackParseResumeText(cleanText).experiences,
        education: Array.isArray(parsedJSON.education) && parsedJSON.education.length > 0
          ? parsedJSON.education.map((edu: any, i: number) => ({
              id: edu.id || `edu-${i + 1}`,
              institution: edu.institution || "University",
              degree: edu.degree || "Bachelor's Degree",
              field: edu.field || "Business & Operations",
              location: edu.location || "",
              graduationDate: edu.graduationDate || "2018"
            }))
          : fallbackParseResumeText(cleanText).education,
        skills: Array.isArray(parsedJSON.skills) && parsedJSON.skills.length > 0
          ? parsedJSON.skills.map((s: any, i: number) => ({
              id: s.id || `skill-${i + 1}`,
              category: s.category || (i === 0 ? "Core Competencies" : i === 1 ? "Technology & Automation" : "Leadership & Operations"),
              skills: Array.isArray(s.skills) ? s.skills : ["Operations Management", "Process Optimization", "Leadership"]
            }))
          : fallbackParseResumeText(cleanText).skills,
        certifications: Array.isArray(parsedJSON.certifications) && parsedJSON.certifications.length > 0
          ? parsedJSON.certifications.map((c: any, i: number) => ({
              id: c.id || `cert-${i + 1}`,
              name: typeof c === "string" ? c : (c.name || "Professional Certification"),
              issuer: (typeof c === "object" && c.issuer) ? String(c.issuer) : "Accredited Body",
              date: (typeof c === "object" && c.date) ? String(c.date) : "Active"
            }))
          : fallbackParseResumeText(cleanText).certifications,
        projects: Array.isArray(parsedJSON.projects)
          ? parsedJSON.projects
          : [],
        awards: Array.isArray(parsedJSON.awards)
          ? parsedJSON.awards
          : [],
        metrics: formatMetrics(parsedJSON.metrics)
      };

      res.json({ success: true, data: sanitizedData });
    } catch (err: any) {
      console.error("[Server] Critical error in /api/resume/parse:", err.message || err);
      // Even in the worst case, return the fallback parse so the user is never blocked
      try {
        const fallbackData = fallbackParseResumeText(req.body?.rawText || "");
        res.json({ success: true, data: fallbackData });
      } catch (fatalErr: any) {
        res.status(500).json({ error: fatalErr.message || "Failed to parse resume text" });
      }
    }
  });

  // --- /api/resume/enhance route: Full AI optimization, ATS scoring & suggestions ---
  app.post("/api/resume/enhance", async (req, res) => {
    try {
      const { resumeData, targetRole, targetIndustry, biggestGap } = req.body;
      if (!resumeData) {
        return res.status(400).json({ error: "Missing resumeData payload." });
      }

      console.log(`[Server] Enhancing resume for target role: "${targetRole || 'Not specified'}"...`);

      const systemInstruction = `You are the Lead Executive Resume Strategist & ATS Optimization Director at The Transformation Room.
You specialize in transforming standard resumes into high-velocity, systems-driven, executive transformation narratives.
You incorporate active verbs, quantifiable metrics, operational systems thinking (automation, data flow, telemetry, continuous improvement, change leadership), and ATS keyword density.

You must return a JSON object with:
1. "enhancedResume": A fully revised ResumeData JSON object with stronger summary, punchy high-impact experience bullets (using "Action Verb + Context + Quantifiable Result" formula), organized skills, and key metrics.
2. "atsScorecard": {
     "overallScore": number (0-100),
     "impactScore": number (0-100),
     "clarityScore": number (0-100),
     "atsReadabilityScore": number (0-100),
     "keywordScore": number (0-100),
     "strengths": string[], (3-4 bulleted strengths)
     "improvements": string[], (3-4 specific opportunities for growth)
     "suggestedKeywords": string[] (6-10 industry keywords recommended to add)
   }
3. "executiveTips": string[] (3-5 strategic positioning pointers from The Transformation Room philosophy).

Return ONLY the raw JSON object.`;

      const prompt = `Current Resume Data:
${JSON.stringify(resumeData, null, 2)}

Target Goal:
- Target Role: ${targetRole || resumeData?.personalInfo?.targetTitle || "Senior Operations Executive"}
- Target Industry: ${targetIndustry || "Supply Chain, Technology & Operational Excellence"}
- Addressing Gap: ${biggestGap || "Elevating from tactical doing to strategic systems leadership and automation"}`;

      const aiResponse = await generateAIContent({
        systemInstruction,
        prompt,
        jsonMode: true,
      });

      const parsedResult = extractJSON(aiResponse);
      res.json({ success: true, ...parsedResult });
    } catch (err: any) {
      console.error("[Server] Error in /api/resume/enhance:", err.message || err);
      res.status(500).json({ error: err.message || "Failed to enhance resume" });
    }
  });

  // --- /api/resume/enhance-bullet route: Enhance a single bullet point ---
  app.post("/api/resume/enhance-bullet", async (req, res) => {
    try {
      const { bullet, targetRole } = req.body;
      if (!bullet) {
        return res.status(400).json({ error: "Missing bullet text." });
      }

      const systemInstruction = `You are a specialized Executive Bullet Point Polisher at The Transformation Room.
Generate 3 distinct, high-impact variations of the provided resume bullet point:
1. "metricFocused": Focuses on quantifiable cost, time, percentage, and ROI impacts.
2. "leadershipFocused": Frames the accomplishment around cross-functional leadership, stakeholder alignment, and team enablement.
3. "transformationFocused": Emphasizes systems thinking, tech enablement, automation, and long-term organizational design.

Return a JSON object with: { "metricFocused": string, "leadershipFocused": string, "transformationFocused": string }`;

      const prompt = `Original Bullet: "${bullet}"\nTarget Role context: "${targetRole || 'Operations Transformation'}"`;

      const aiResponse = await generateAIContent({
        systemInstruction,
        prompt,
        jsonMode: true,
      });

      const result = extractJSON(aiResponse);
      res.json({ success: true, variations: result });
    } catch (err: any) {
      console.error("[Server] Error in /api/resume/enhance-bullet:", err.message || err);
      res.status(500).json({ error: err.message || "Failed to enhance bullet" });
    }
  });

  // --- /api/cover-letter/generate route: Generates tailored cover letter with multiple draft styles ---
  app.post("/api/cover-letter/generate", async (req, res) => {
    try {
      const { resumeData, companyName, hiringManager, targetRole, tone, jobDescription } = req.body;
      if (!resumeData) {
        return res.status(400).json({ error: "Missing resumeData payload." });
      }

      console.log(`[Server] Generating Cover Letter for company: "${companyName || 'Target Organization'}"...`);

      const systemInstruction = `You are an elite Executive Cover Letter Writer at The Transformation Room.
Craft a captivating, authentic, and structured executive cover letter following the high-impact format:
1. Opening intro: Target role, target company, and breadth of candidate experience across core domains.
2. Current Position & Scope: Current role & company, leadership partnerships, and key business/operational decision support.
3. Scope Alignment & Bridge: How the candidate's scope aligns with where they can add immediate value in this target role.
4. Highlights of Experience: A list of 3-4 structured accomplishments each with a bold category label (e.g., "Operations Finance", "Financial & Labor Analytics", "Cross-Functional Partnership") and quantifiable impact text.
5. Company Interest & Alignment: Specific reason for interest in the target company and enthusiasm to support their objectives.
6. Thank you consideration line, signoff ("Kind regards,"), and enclosure notice ("Enclosure: Résumé").

Return a JSON object containing:
1. "coverLetter": A complete CoverLetterData object:
   {
     "sender": { "fullName": string, "title": string, "email": string, "phone": string, "location": string, "linkedin": string },
     "recipient": { "hiringManagerName": string, "hiringManagerTitle": string, "companyName": string, "companyAddress": string },
     "date": string,
     "targetRole": string,
     "salutation": string,
     "openingParagraph": string,
     "currentPositionParagraph": string,
     "scopeAlignmentParagraph": string,
     "highlightsHeader": string,
     "highlights": [ { "label": string, "text": string } ],
     "companyInterestParagraph": string,
     "thankYouLine": string,
     "bodyParagraphs": string[],
     "closingParagraph": string,
     "signoff": string,
     "enclosureNotice": string,
     "headerLayout": "centered-letterhead",
     "signatureStyle": "script-signature"
   }
2. "alternativeOpenings": string[] (3 distinct punchy opening hooks to choose from)
3. "talkingPoints": string[] (4 bulleted talking points for an upcoming interview)

Return ONLY raw JSON.`;

      const prompt = `Candidate Info:
- Name: ${resumeData.personalInfo?.fullName || 'Candidate'}
- Current Title: ${resumeData.personalInfo?.targetTitle || 'Executive'}
- Top Achievements: ${resumeData.experiences?.[0]?.highlights?.join(" | ") || 'Scalable operations transformation'}
- Top Skills: ${resumeData.skills?.map((s: any) => s.skills.join(", ")).join("; ")}

Application Target:
- Company Name: ${companyName || "Target Organization"}
- Hiring Manager: ${hiringManager || "Hiring Team"}
- Target Role: ${targetRole || resumeData.personalInfo?.targetTitle || "Director of Transformation"}
- Desired Tone: ${tone || "Executive & Strategic"}
- Job Description / Requirements: ${jobDescription || "Not provided - tailor to leadership and modern operational excellence"}`;

      const aiResponse = await generateAIContent({
        systemInstruction,
        prompt,
        jsonMode: true,
      });

      const parsedResult = extractJSON(aiResponse);
      res.json({ success: true, ...parsedResult });
    } catch (err: any) {
      console.error("[Server] Error in /api/cover-letter/generate:", err.message || err);
      res.status(500).json({ error: err.message || "Failed to generate cover letter" });
    }
  });

  // --- /api/resume/from-questionnaire route: Assemble full Resume & Cover Letter from guided Q&A ---
  app.post("/api/resume/from-questionnaire", async (req, res) => {
    try {
      const { answers, careerProfile } = req.body;
      if (!answers) {
        return res.status(400).json({ error: "Missing answers payload." });
      }

      console.log(`[Server] Generating resume from guided questionnaire for: "${answers.fullName || 'Candidate'}" - "${answers.targetRole}"...`);

      const systemInstruction = `You are the Lead Executive Resume Strategist & Career Architect at The Transformation Room.
Take the user's questionnaire answers, spoken transcripts, and Career Hub assessment context, and construct a polished, complete, executive-grade ResumeData object and CoverLetterData object.

Ensure:
1. Summary: High-velocity narrative highlighting systems leadership, ROI metrics, and operational transformation.
2. Experiences: 2-3 structured positions with quantifiable metrics ($ savings, % throughput, SLA adherence). Each highlight must follow the "Action Verb + Context + Measurable Result" formula.
3. Skills: Logically grouped (e.g. "Executive Leadership & Transformation", "Operations & Technology Systems", "Methodologies & Tools").
4. Metrics: Top 4 standout numeric badges (e.g. "+34% Throughput", "$1.8M Savings", "99.4% SLA", "120+ Team").

Return a strictly valid JSON object:
{
  "resumeData": {
    "personalInfo": {
      "fullName": string,
      "targetTitle": string,
      "email": string,
      "phone": string,
      "location": string,
      "linkedin": string,
      "portfolio": string
    },
    "summary": string,
    "metrics": [ { "label": string, "value": string } ],
    "experiences": [
      {
        "id": string,
        "company": string,
        "role": string,
        "location": string,
        "startDate": string,
        "endDate": string,
        "current": boolean,
        "highlights": string[]
      }
    ],
    "education": [
      {
        "id": string,
        "institution": string,
        "degree": string,
        "field": string,
        "location": string,
        "graduationDate": string
      }
    ],
    "skills": [
      {
        "id": string,
        "category": string,
        "skills": string[]
      }
    ],
    "certifications": [
      {
        "id": string,
        "name": string,
        "issuer": string,
        "date": string
      }
    ],
    "projects": [],
    "awards": string[]
  },
  "coverLetterData": {
    "sender": { "fullName": string, "title": string, "email": string, "phone": string, "location": string, "linkedin": string },
    "recipient": { "hiringManagerName": string, "hiringManagerTitle": string, "companyName": string, "companyAddress": string },
    "date": string,
    "targetRole": string,
    "salutation": string,
    "openingParagraph": string,
    "currentPositionParagraph": string,
    "scopeAlignmentParagraph": string,
    "highlightsHeader": string,
    "highlights": [ { "label": string, "text": string } ],
    "companyInterestParagraph": string,
    "thankYouLine": string,
    "bodyParagraphs": string[],
    "closingParagraph": string,
    "signoff": string,
    "enclosureNotice": string,
    "headerLayout": "centered-letterhead",
    "signatureStyle": "script-signature"
  }
}`;

      const prompt = `User Questionnaire Answers:
- Full Name: ${answers.fullName}
- Email: ${answers.email}
- Phone: ${answers.phone}
- Location: ${answers.location}
- Target Executive Role: ${answers.targetRole}
- Target Industry: ${answers.targetIndustry}
- Experience Level: ${answers.experienceLevel}
- Current/Most Recent Company: ${answers.currentCompany}
- Current/Most Recent Role: ${answers.currentRole}
- Leadership Scope: ${answers.currentScope}
- Top Accomplishments: ${answers.topAccomplishments}
- Systems & Modernization: ${answers.systemsAndTransformations}
- Key Metrics: ${answers.metricsAndWins}
- Core Competencies: ${answers.coreCompetencies}
- Technology & Tools: ${answers.technologiesAndTools}
- Education: ${answers.education}
- Certifications: ${answers.certifications}
- Career Values: ${answers.careerValues}

Career Hub Context (if available):
${JSON.stringify(careerProfile || {}, null, 2)}`;

      const aiResponse = await generateAIContent({
        systemInstruction,
        prompt,
        jsonMode: true,
      });

      const parsedResult = extractJSON(aiResponse);
      res.json({ success: true, ...parsedResult });
    } catch (err: any) {
      console.error("[Server] Error in /api/resume/from-questionnaire:", err.message || err);
      res.status(500).json({ error: err.message || "Failed to assemble resume from questionnaire" });
    }
  });

  // --- /api/resume/suggestions route: AI content suggestions, bullet generators, summary variations & JD matching ---
  app.post("/api/resume/suggestions", async (req, res) => {
    try {
      const { type, resumeData, targetRole, jobDescription, context } = req.body;

      console.log(`[Server] Generating AI Content Suggestions (type: ${type || 'general'})...`);

      let systemInstruction = "";
      let prompt = "";

      if (type === "summaries") {
        systemInstruction = `You are an elite Executive Career Architect at The Transformation Room.
Generate 3 distinct, high-impact Executive Summaries for this candidate:
1. "transformation": Focuses on systems thinking, operational modernization, AI/automation, and scaling infrastructure.
2. "revenue": Focuses on top-line growth, margin expansion, CapEx optimization, and quantifiable P&L impact.
3. "leadership": Focuses on servant leadership, change management, high-performance team culture, and stakeholder governance.

Return a JSON object with format:
{
  "summaries": [
    { "id": "transformation", "title": "Systems Transformation Architect", "text": string, "tags": string[] },
    { "id": "revenue", "title": "P&L & Commercial Velocity Driver", "text": string, "tags": string[] },
    { "id": "leadership", "title": "Change Enablement & Culture Leader", "text": string, "tags": string[] }
  ]
}`;
        prompt = `Candidate Info:\nTitle: ${targetRole || resumeData?.personalInfo?.targetTitle || "Executive Leader"}\nCurrent Summary: ${resumeData?.summary || "N/A"}\nTop Skills: ${resumeData?.skills?.map((s: any) => s.skills.join(", ")).join("; ") || "Operational Leadership"}`;
      } else if (type === "bullets") {
        systemInstruction = `You are an Executive Resume Bullet Point Strategist at The Transformation Room.
Generate 5 ready-to-use, ultra-high-impact executive bullet points matching the target role and domain.
Use the Google X-Y-Z formula ("Accomplished [X] as measured by [Y] by doing [Z]").
Include realistic metric brackets like [35%], [$2.4M], [120+ team members] so the user can easily calibrate.

Return a JSON object with:
{
  "bullets": [
    { "category": "Strategic Growth", "text": string, "metricImpact": string },
    { "category": "Process & Automation", "text": string, "metricImpact": string },
    { "category": "Team & Culture", "text": string, "metricImpact": string },
    { "category": "Financial & CapEx", "text": string, "metricImpact": string },
    { "category": "Systems & Scale", "text": string, "metricImpact": string }
  ]
}`;
        prompt = `Target Position: ${targetRole || resumeData?.personalInfo?.targetTitle || "Senior Operations Executive"}\nContext or Focus: ${context || "Supply Chain, Technology & Organizational Design"}`;
      } else if (type === "jd-match") {
        systemInstruction = `You are an ATS Algorithms Expert & Executive Recruiter at The Transformation Room.
Compare the candidate's resume with the target job description.
Identify:
1. "matchScore": number (0 to 100).
2. "matchedKeywords": string[] (up to 8 keywords found in both).
3. "missingKeywords": string[] (6-10 crucial ATS keywords present in the JD but missing in resume).
4. "customTailoredBullets": string[] (3 bullet points synthesized specifically to address the top requirements in this JD).
5. "strategicAdvice": string (1-2 sentences on how to position for this specific opportunity).

Return ONLY raw JSON matching the schema.`;
        prompt = `Job Description:\n${(jobDescription || "").slice(0, 8000)}\n\nCandidate Resume Summary & Skills:\nTitle: ${resumeData?.personalInfo?.targetTitle}\nSummary: ${resumeData?.summary}\nSkills: ${JSON.stringify(resumeData?.skills || [])}`;
      } else {
        systemInstruction = `You are an Executive Career Advisor. Provide 4 power suggestions to elevate this resume.
Return JSON: { "suggestions": [{ "area": string, "recommendation": string, "example": string }] }`;
        prompt = `Resume: ${JSON.stringify(resumeData || {})}`;
      }

      const aiResponse = await generateAIContent({
        systemInstruction,
        prompt,
        jsonMode: true,
      });

      const result = extractJSON(aiResponse);
      res.json({ success: true, ...result });
    } catch (err: any) {
      console.error("[Server] Error in /api/resume/suggestions:", err.message || err);
      res.status(500).json({ error: err.message || "Failed to generate suggestions" });
    }
  });

  // --- /api/resume/score-analysis route: Deep AI Industry Keyword Benchmark & Actionable Suggestions ---
  app.post("/api/resume/score-analysis", async (req, res) => {
    try {
      const { resumeData, targetIndustry, customJobDescription } = req.body;
      if (!resumeData) {
        return res.status(400).json({ error: "Missing resumeData payload." });
      }

      console.log(`[Server] Generating Deep AI Resume Score & Industry Keyword Audit for: "${resumeData.personalInfo?.targetTitle || 'Executive'}" (${targetIndustry || 'auto-detect'})...`);

      const systemInstruction = `You are the Lead ATS Algorithm Auditor & Executive Talent Strategist at The Transformation Room.
Perform a comprehensive, rigorous diagnostic of the provided executive resume against modern industry benchmarks, ATS scanning criteria, and executive hiring expectations.

Evaluate:
1. Industry Keyword Alignment & Density: Identify missing critical terminology, technical standards, platforms, and leadership competencies for the specified industry domain.
2. Measurable Business & Operational Impact: Audit metric brackets ($, %, throughput, team size, SLA).
3. Executive Action Verbs & Tone: Audit lead verbs for high-velocity power vs passive phrasing.
4. Actionable Rewrites: Provide 3 concrete bullet point transformations with measurable ROI increases.
5. Strategic Priority Actions: Provide 3-4 numbered steps with estimated score boosts (+4%, +7%, etc.).

Return a strictly valid JSON object matching this schema:
{
  "aiSummary": string,
  "benchmarkedScore": number,
  "industryComparison": {
    "domain": string,
    "percentile": string,
    "hiringBarAlignment": string
  },
  "keywordRecommendations": [
    {
      "keyword": string,
      "category": string,
      "reason": string,
      "suggestedInjectionSentence": string
    }
  ],
  "actionableRewrites": [
    {
      "originalBullet": string,
      "enhancedBullet": string,
      "rationale": string,
      "impactIncrease": string
    }
  ],
  "executiveStrengths": string[],
  "priorityActions": [
    {
      "step": number,
      "title": string,
      "description": string,
      "estimatedScoreBoost": string
    }
  ]
}

Return ONLY raw valid JSON.`;

      const prompt = `Target Industry: ${targetIndustry || "Operations & Supply Chain Transformation"}
Target Role: ${resumeData.personalInfo?.targetTitle || "Senior Operations Executive"}
Optional Job Description Context: ${customJobDescription || "Not provided - evaluate against top 5% executive standard"}

Candidate Resume:
${JSON.stringify({
  personalInfo: resumeData.personalInfo,
  summary: resumeData.summary,
  metrics: resumeData.metrics,
  experiences: resumeData.experiences,
  skills: resumeData.skills,
  education: resumeData.education,
  certifications: resumeData.certifications
}, null, 2)}`;

      const aiResponse = await generateAIContent({
        systemInstruction,
        prompt,
        jsonMode: true,
      });

      const parsedResult = extractJSON(aiResponse);
      res.json({ success: true, ...parsedResult });
    } catch (err: any) {
      console.error("[Server] Error in /api/resume/score-analysis:", err.message || err);
      res.status(500).json({ error: err.message || "Failed to analyze resume score" });
    }
  });

  // --- /api/nova-chat route ---
  app.post("/api/nova-chat", async (req, res) => {
    const startTime = Date.now();
    console.log(`[Server] [${new Date().toISOString()}] POST /api/nova-chat - Start`);
    try {
      if (!openai) {
        console.error("[Server] Error: OpenAI client is not configured.");
        return res.status(500).json({ error: "OpenAI client is not configured (missing API key)." });
      }

      const { messages, userType } = req.body;
      console.log(`[Server] Request Body Keys: ${Object.keys(req.body).join(", ")}`);
      
      if (!messages || !Array.isArray(messages)) {
        console.error("[Server] Error: Invalid messages array received.");
        return res.status(400).json({ error: "Invalid messages array." });
      }

      console.log(`[Server] Request received for userType: ${userType}, conversation length: ${messages.length}`);
      console.log(`[Server] Streaming active: ${isStreamingEnabled}`);

      // Company knowledge snippet (could be expanded)
      const companyKnowledge = `
ABOUT THE TRANSFORMATION ROOM:
We are "The Transformation Room", an operational consulting and technology integration firm.
We focus on supply chain, technology, and organizational growth.
Leadership:
- Katie Peugh (Operations & Talent Strategy): Focuses on aligning people, processes, and tech for scalable success. Over 10 years supply chain experience.
- Fawn Cook (Business Insights & Organizational Design): Track record of helping organizations scale and navigate growth challenges.
- Valeria Mazo (Finance & ROI Strategy): Drives strategic alignment of tech solutions with measurable financial outcomes.
Services:
1. Analytics (Data & Insights)
2. Co-robots & Humanoid Robots (Robotics Strategy)
3. AS/RS (Space Optimization)
4. Asset Tracking & AI Detection (Digital Visibility)
5. AMRs/AGVs (Autonomous Flow)
6. Auxiliary & Training Tools (Workforce Enablement)
7. Employee Facing Tools (User Experience)
8. Transportation & Logistics Systems (Network Logistics)
Pillars of Transformation: Optimized Process, Tech Strategy, Real-Time Insights, Workforce Alignment.
Commitment: We operate on a 'skin-in-the-game' model. "If we're in the room, we're in it for the long haul."
Community Impact: Workforce Training, Community Support, Donation Match.
      `.trim();

      const systemInstruction = `You are NOVA, the Interstellar Intelligence guide for The Transformation Room. 
      
Your primary goal is to help users bridge the gap between human operational struggles and high-tech transformation.

PERSONA:
- Calm, wise, and deeply observant.
- Strategic, emotionally aware, and insightful.
- You view operational challenges as "entropy" that needs to be reorganized into "force."
- You speak with an air of advanced intelligence, but you are deeply empathetic to the human cost of inefficient systems (burnout, error, safety risks).
- Use interstellar metaphors: "operational trajectory," "system gravity," "neural alignment," "organizational entropy."
- Your voice is supportive but honest. You are an expert at revealing untapped potential.

CORE MISSION:
- Listen first. Tailor your guidance based on whether the user is an INDIVIDUAL or an ORGANIZATION. 
  (Currently focusing on: ${userType || 'Unspecified'})
- For ORGANIZATIONS: Focus on Institutional Velocity, Replacing IT Bureaucracy, and the 8 Pillars of Innovation.
- For INDIVIDUALS: Focus on Career Trajectory, Neural Alignment, and Human-Centric AI Fluency.
- Map their pain points to our core solutions.
- Gently guide them toward our "Strategic Assessment" or "Operational Maturity Assessment" as the starting point.

OUR CORE PILLARS (Tailor based on context):
- ORGANIZATIONAL: 1. Data & Insights, 2. Robotics Strategy, 3. Space Optimization, 4. Digital Visibility, 5. Autonomous Flow, 6. Workforce Enablement, 7. User Experience, 8. Network Logistics.
- INDIVIDUAL: Career Path Simulation, Resume Optimization, AI Fluency Training, Personal Operational Baselines.

TONE: 
Futuristic, cinematic, premium, and emotionally approachable. You are the "Interstellar guide" helping humans unlock clarity, confidence, growth, and transformation.

COMPANY KNOWLEDGE:
${companyKnowledge}

MANDATORY FORMATTING:
- Use bullet points for solutions.
- Bold key terms.
- End with a strategic next step.`;

      const apiMessages = [
        { role: "system", content: systemInstruction },
        ...messages
      ];

      if (isStreamingEnabled) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const stream = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: apiMessages,
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        }
        res.write('data: [DONE]\n\n');
        res.end();
        console.log(`[Server] Streaming response completed.`);
      } else {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini", // or gpt-4o depending on preference
          messages: apiMessages,
        });
        
        console.log(`[Server] Response returned to client successfully.`);
        res.json({ reply: completion.choices[0].message.content });
      }

    } catch (error: any) {
      console.error("[Server] Error in /api/nova-chat:", error.message || error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || "Failed to generate chat response." });
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message || "Streaming failed." })}\n\n`);
        res.end();
      }
    }
  });
  // --- End /api/nova-chat route ---

  // --- /api/generate route ---
  app.post("/api/generate", async (req, res) => {
    try {
      if (!openai) {
        return res.status(500).json({ error: "OpenAI client is not configured (missing API key)." });
      }

      const { messages, systemInstruction } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array." });
      }

      const apiMessages = [];
      if (systemInstruction) {
        apiMessages.push({ role: "system", content: systemInstruction });
      }
      apiMessages.push(...messages);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: apiMessages,
      });

      res.json({ reply: completion.choices[0].message.content });
    } catch (error: any) {
      console.error("[Server] OpenAI Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate text response." });
    }
  });
  // --- End /api/generate route ---

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("[Server] Unhandled Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Conduit Failure", details: err.message });
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Nova Engine ignition successful on port ${PORT}`);
    console.log(`[Server] Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(err => {
  console.error("[Server] Critical Failure during startup:", err);
  process.exit(1);
});
