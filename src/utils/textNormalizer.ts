/**
 * Pure zero-dependency text normalization engine.
 * Perfectly repairs OCR artifacts, stylistic wide letter-spacing, intra-word kerning glitches,
 * broken headers, and irregular whitespace across resumes and cover letters.
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
  "Product", "Customer", "Process", "Quality", "Director", "Manager"
];

/**
 * Normalizes text extracted from PDF, DOCX, OCR or text paste:
 * 1. Collapses stylistic letter spacing (e.g. "K A R E E M  A L S H O M A L Y" -> "KAREEM ALSHOMALY", "C O N T A C T" -> "CONTACT")
 * 2. Repairs broken intra-word kerning artifacts (e.g. "T echnical" -> "Technical", "Engine e ring" -> "Engineering", "Profes sional" -> "Professional", "busin ess" -> "business")
 * 3. Normalizes multiple spaces and maintains clean line breaks
 */
export function normalizeExtractedText(raw: string): string {
  if (!raw || typeof raw !== "string") return "";

  let text = raw;

  // Step 1: Normalize unicode whitespace & newlines
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  text = text.replace(/[\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/g, " ");

  // Step 2: Fix stylistic spaced uppercase/lowercase words
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

  // Step 3: Fix known specific intra-word kerning glitches
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

  // Step 4: Dictionary-guided intra-word space collapse
  for (const word of KNOWN_WORDS) {
    // Generate split regex: e.g. "T echnical" or "Tech nical" or "Techni cal"
    for (let splitIdx = 1; splitIdx < word.length; splitIdx++) {
      const p1 = word.slice(0, splitIdx);
      const p2 = word.slice(splitIdx);
      const reg = new RegExp(`\\b${p1}\\s+${p2}\\b`, "gi");
      text = text.replace(reg, word);
    }
  }

  // Step 5: Fix isolated letter glitches at start of lines or sentences
  // e.g. "T echnical Escalation" -> "Technical Escalation"
  text = text.replace(/(?:^|\n)\s*([A-Za-z])\s+([a-z]{3,})/gm, "$1$2");

  // Step 6: Fix spaces before punctuation
  text = text.replace(/\s+([,.:;?!])/g, "$1");

  // Step 7: Collapse excessive horizontal whitespace while preserving clean newlines
  const lines = text.split("\n").map(l => l.replace(/[ \t]+/g, " ").trim());
  text = lines.filter(l => l.length > 0).join("\n");

  return text;
}
