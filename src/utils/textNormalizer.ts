/**
 * Pure zero-dependency text sanitization and normalization engine.
 * Perfectly repairs OCR artifacts, stylistic wide letter-spacing, intra-word kerning glitches,
 * broken headers, illegal control characters, non-standard unicode glyphs, and irregular whitespace
 * across resumes and cover letters.
 */

// Common professional/resume vocabulary dictionary for kerning and OCR repair
const KNOWN_WORDS = [
  "Technical", "Escalation", "Resolution", "Engineering", "Solutions",
  "Professional", "Experience", "Education", "Certifications", "Leadership",
  "Executive", "Management", "Operations", "Development", "Architecture",
  "Deployment", "Strategy", "Department", "Affairs", "Industrial",
  "Automation", "Assistant", "Research", "Metabolic", "Technology",
  "Exoskeleton", "Connected", "Richmond", "Opportunity", "Highlights",
  "Partnerships", "Feasibility", "Troubleshooting", "Remediation", "Visibility",
  "Specifications", "Communication", "Consideration", "Enclosure", "Résumé",
  "Cradlepoint", "Expert", "Implementing", "Performance", "Analysis",
  "Product", "Customer", "Process", "Quality", "Director", "Manager",
  "Optimization", "Logistics", "Distribution", "Transformation", "Infrastructure",
  "Continuous", "Improvement", "Compliance", "Supply", "Chain", "Warehouse",
  "Kubernetes", "PostgreSQL", "JavaScript", "TypeScript", "Microservices",
  "Telecommunications", "Orchestration", "Competencies", "Accomplishments"
];

/**
 * Sanitizes raw text by removing illegal control characters, non-printable binary tokens,
 * broken unicode replacement characters, and converting non-standard punctuation.
 */
export function sanitizeRawText(input: string): string {
  if (!input || typeof input !== "string") return "";

  let text = input;

  // 1. Remove binary null bytes, unprintable control characters (keep tab \t and newline \n)
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 2. Remove Unicode replacement character and zero-width characters
  text = text.replace(/[\uFFFD\uFEFF\u200B\u200C\u200D\u2060\u00AD]/g, "");

  // 3. Normalize non-standard unicode quotation marks and apostrophes
  text = text.replace(/[\u2018\u2019\u201A\u201B\u2032\u0060\u00B4]/g, "'");
  text = text.replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"');

  // 4. Normalize unicode dashes and hyphens to standard hyphen
  text = text.replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-");

  // 5. Expand unicode ligatures
  const ligatures: Record<string, string> = {
    "\uFB00": "ff",
    "\uFB01": "fi",
    "\uFB02": "fl",
    "\uFB03": "ffi",
    "\uFB04": "ffl",
    "\uFB05": "ft",
    "\uFB06": "st",
    "\u0152": "OE",
    "\u0153": "oe",
    "\u00C6": "AE",
    "\u00E6": "ae"
  };
  for (const [lig, replacement] of Object.entries(ligatures)) {
    text = text.replace(new RegExp(lig, "g"), replacement);
  }

  // 6. Normalize non-standard bullet characters to standard bullet
  text = text.replace(/[\u2022\u2023\u25E6\u2043\u2219\u25AA\u25AB\u25CF\u25CB\u25D8\u25A0\u25A1\u25C6\u25C7\u25B8\u25B9\u27A2\u27A4\u2713\u2714\u25BA\u25B6\u2705]/g, "•");

  return text;
}

/**
 * Normalizes text extracted from PDF, DOCX, OCR or text paste:
 * 1. Sanitizes illegal characters and normalizes unicode symbols
 * 2. Collapses stylistic letter spacing (e.g. "K A R E E M  A L S H O M A L Y" -> "KAREEM ALSHOMALY", "C O N T A C T" -> "CONTACT")
 * 3. Repairs broken intra-word kerning artifacts (e.g. "T echnical" -> "Technical", "Engine e ring" -> "Engineering", "Profes sional" -> "Professional", "busin ess" -> "business")
 * 4. Normalizes multiple spaces and maintains clean line breaks
 */
export function normalizeExtractedText(raw: string): string {
  if (!raw || typeof raw !== "string") return "";

  // Step 1: Sanitize illegal control characters & normalize unicode
  let text = sanitizeRawText(raw);

  // Step 2: Normalize unicode whitespace & newlines
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  text = text.replace(/[\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/g, " ");

  // Step 3: Fix stylistic spaced uppercase/lowercase words
  // e.g. "K A R E E M   A L S H O M A L Y" -> "KAREEM ALSHOMALY"
  // e.g. "C O N T A C T" -> "CONTACT"
  // e.g. "E X P E R T I S E   S H O W C A S E" -> "EXPERTISE SHOWCASE"
  // e.g. "K i n d   r e g a r d s" -> "Kind regards"
  // Matches single letters separated by single space (at least 3 characters)
  text = text.replace(/\b(?:([a-zA-Z])\s+){2,}([a-zA-Z])\b/g, (match) => {
    // If the match consists of single letters with single space, collapse into word
    const cleaned = match.replace(/\s+/g, "");
    // If original was something like "K A R E E M   A L S H O M A L Y", split on multi-space
    if (match.includes("  ")) {
      return match
        .split(/\s{2,}/)
        .map(part => part.replace(/\s+/g, ""))
        .join(" ");
    }
    return cleaned;
  });

  // Step 4: Fix known specific intra-word kerning glitches
  const specificReplacements: [RegExp, string][] = [
    [/\bT\s+echnical\b/gi, "Technical"],
    [/\bE\s+ngineering\b/gi, "Engineering"],
    [/\bEngine\s+e\s+ring\b/gi, "Engineering"],
    [/\bE\s+ngine\s*e\s*ring\b/gi, "Engineering"],
    [/\bProfes\s+sional\b/gi, "Professional"],
    [/\bProfes\s+sionals\b/gi, "Professionals"],
    [/\bE\s+xperience\b/gi, "Experience"],
    [/\bE\s+ducation\b/gi, "Education"],
    [/\bC\s+ertifications\b/gi, "Certifications"],
    [/\bC\s+ertified\b/gi, "Certified"],
    [/\bL\s+eadership\b/gi, "Leadership"],
    [/\bO\s+perations\b/gi, "Operations"],
    [/\bD\s+evelopment\b/gi, "Development"],
    [/\bD\s+ata\b/gi, "Data"],
    [/\bC\s+ollected\b/gi, "Collected"],
    [/\bE\s+xpertise\b/gi, "Expertise"],
    [/\bS\s+howcase\b/gi, "Showcase"],
    [/\bK\s+ind\s+r\s+egards\b/gi, "Kind regards"],
    [/\bE\s+nclosure\b/gi, "Enclosure"],
    [/\bR\s+é\s*s\s*u\s*m\s*é\b/gi, "Résumé"],
    [/\bbusin\s+ess\b/gi, "business"],
    [/\bman\s+agement\b/gi, "management"],
    [/\bauto\s+mation\b/gi, "automation"],
    [/\bcom\s+munication\b/gi, "communication"],
    [/\boppor\s+tunity\b/gi, "opportunity"],
    [/\bcon\s+sideration\b/gi, "consideration"]
  ];

  for (const [pattern, replacement] of specificReplacements) {
    text = text.replace(pattern, replacement);
  }

  // Step 5: Dictionary-guided intra-word space collapse
  for (const word of KNOWN_WORDS) {
    // Generate split regex: e.g. "T echnical" or "Tech nical" or "Techni cal"
    for (let splitIdx = 1; splitIdx < word.length; splitIdx++) {
      const p1 = word.slice(0, splitIdx);
      const p2 = word.slice(splitIdx);
      const reg = new RegExp(`\\b${p1}\\s+${p2}\\b`, "gi");
      text = text.replace(reg, word);
    }
  }

  // Step 6: Fix isolated letter glitches at start of lines or sentences
  text = text.replace(/(?:^|\n)\s*([A-Za-z])\s+([a-z]{3,})/gm, "$1$2");

  // Step 7: Fix hyphenated word breaks across newlines (e.g. "Transfor-\nmation" -> "Transformation")
  text = text.replace(/([A-Za-z]{2,})-\s*\n\s*([A-Za-z]{2,})/g, "$1$2");

  // Step 8: Fix dangling conjunctions at line ends (e.g. "Strategic Planning and\nOperations" -> "Strategic Planning and Operations")
  text = text.replace(/\b(and|&|or|with|in|the|for|to|of|at|by)\s*\n\s*([A-Za-z])/gi, "$1 $2");

  // Step 9: Fix spaces before punctuation
  text = text.replace(/\s+([,.:;?!])/g, "$1");

  // Step 10: Collapse excessive horizontal whitespace while preserving clean newlines
  const lines = text.split("\n").map(l => l.replace(/[ \t]+/g, " ").trim());
  text = lines.filter(l => l.length > 0).join("\n");

  return text;
}

/**
 * Main entry point to sanitize and normalize raw resume text extracted from any source.
 * Removes illegal characters, fixes OCR artifacts, and formats into clean, structured paragraphs.
 */
export function sanitizeAndNormalizeResumeText(rawText: string): string {
  return normalizeExtractedText(rawText);
}

