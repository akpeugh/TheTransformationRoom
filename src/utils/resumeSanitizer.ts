/**
 * Resume Sanitizer Utility
 * Cleans raw text by removing non-printable ASCII characters, normalizing whitespace,
 * fixing common encoding artifacts (mojibake, smart punctuation, ligatures),
 * and stripping illegal control sequences before passing text to the AI parser.
 */

// Common mojibake / broken encoding sequence mappings
const MOJIBAKE_MAP: [RegExp, string][] = [
  [/â€TM/g, "'"],
  [/â€™/g, "'"],
  [/â€˜/g, "'"],
  [/â€œ/g, '"'],
  [/â€/g, '"'],
  [/â€¢/g, "•"],
  [/â€“/g, "-"],
  [/â€”/g, "-"],
  [/â€¦/g, "..."],
  [/Â·/g, "•"],
  [/Â©/g, "©"],
  [/Â®/g, "®"],
  [/Â°/g, "°"],
  [/Â/g, ""],
  [/Ã©/g, "é"],
  [/Ã¨/g, "è"],
  [/Ãª/g, "ê"],
  [/Ã±/g, "ñ"],
  [/Ã¼/g, "ü"],
  [/Ã¶/g, "ö"],
  [/Ã¤/g, "ä"]
];

/**
 * Normalizes common typographic ligatures to ASCII equivalents
 */
const LIGATURES: Record<string, string> = {
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

/**
 * Removes non-printable ASCII and control characters, strips mojibake,
 * standardizes punctuation, and normalizes vertical and horizontal whitespace.
 *
 * @param input - The raw unstructured resume text
 * @returns Cleaned, sanitized, and normalized text ready for parsing
 */
export function sanitizeResumeText(input: string | null | undefined): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  let text = input;

  // 1. Repair common mojibake encoding artifacts
  for (const [pattern, replacement] of MOJIBAKE_MAP) {
    text = text.replace(pattern, replacement);
  }

  // 2. Expand unicode ligatures
  for (const [ligature, replacement] of Object.entries(LIGATURES)) {
    text = text.replace(new RegExp(ligature, "g"), replacement);
  }

  // 3. Remove non-printable ASCII characters (0x00-0x08, 0x0B-0x0C, 0x0E-0x1F, 0x7F)
  // Preserves \t (0x09), \n (0x0A), and \r (0x0D) for structure
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 4. Remove unicode replacement chars, zero-width chars, soft hyphens, and byte order marks (BOM)
  text = text.replace(/[\uFFFD\uFEFF\u200B\u200C\u200D\u2060\u00AD\u200E\u200F]/g, "");

  // 5. Standardize unicode quotation marks and apostrophes
  text = text.replace(/[\u2018\u2019\u201A\u201B\u2032\u0060\u00B4\u02BC]/g, "'");
  text = text.replace(/[\u201C\u201D\u201E\u201F\u2033\u00AB\u00BB]/g, '"');

  // 6. Standardize dashes, hyphens, and minus signs
  text = text.replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-");

  // 7. Standardize bullets and list markers to standard bullet
  text = text.replace(/[\u2022\u2023\u25E6\u2043\u2219\u25AA\u25AB\u25CF\u25CB\u25D8\u25A0\u25A1\u25C6\u25C7\u25B8\u25B9\u27A2\u27A4\u2713\u2714\u25BA\u25B6\u2705]/g, "• ");

  // 8. Normalize all newline types to standard \n
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 9. Normalize unicode whitespace spaces (non-breaking space, em space, en space, thin space, etc.)
  text = text.replace(/[\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/g, " ");

  // 10. Normalize spaces before punctuation
  text = text.replace(/[ \t]+([,.:;?!])/g, "$1");

  // 11. Normalize horizontal whitespace (tabs and multiple spaces -> single space) per line
  const lines = text.split("\n").map(line => {
    // Strip trailing and multiple consecutive horizontal spaces
    return line.replace(/[ \t]+/g, " ").trim();
  });

  // 12. Collapse more than 2 consecutive blank lines into a single blank line
  const resultLines: string[] = [];
  let consecutiveBlankCount = 0;

  for (const line of lines) {
    if (line.length === 0) {
      consecutiveBlankCount++;
      if (consecutiveBlankCount <= 1) {
        resultLines.push("");
      }
    } else {
      consecutiveBlankCount = 0;
      resultLines.push(line);
    }
  }

  return resultLines.join("\n").trim();
}

export * from "./resumeSectionLimits";
