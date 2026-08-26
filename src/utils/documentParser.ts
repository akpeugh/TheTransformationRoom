import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { GlobalWorkerOptions } from "pdfjs-dist";
// @ts-ignore
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { normalizeExtractedText, sanitizeRawText, sanitizeAndNormalizeResumeText } from "./textNormalizer";
import { sanitizeResumeText } from "./resumeSanitizer";
export { normalizeExtractedText, sanitizeRawText, sanitizeAndNormalizeResumeText, sanitizeResumeText };

// Set PDF.js worker safely
try {
  if (typeof window !== "undefined" && pdfWorker) {
    GlobalWorkerOptions.workerSrc = pdfWorker;
  }
} catch (e) {
  console.warn("Failed to set PDF.js workerSrc with Vite URL:", e);
}

/**
 * Validates a file object before extraction
 */
export function validateResumeFile(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: "No file provided." };
  }

  // Maximum file size: 15MB
  const MAX_FILE_SIZE = 15 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: `File size exceeds the 15MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).` };
  }

  if (file.size === 0) {
    return { isValid: false, error: "The selected file is empty (0 bytes)." };
  }

  const validExtensions = ["pdf", "docx", "doc", "txt", "rtf", "json", "md"];
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || !validExtensions.includes(extension)) {
    return { 
      isValid: false, 
      error: `Unsupported file format (.${extension || "unknown"}). Please upload a PDF, Word (.docx/.doc), Text (.txt), or JSON file.` 
    };
  }

  return { isValid: true };
}

/**
 * Extracts plain text from a PDF file with precise layout, line break ordering, and text normalization
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      useSystemFonts: true
    });
    
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Group and sort text items by vertical position (Y-coordinate descending) and horizontal (X-coordinate ascending)
      const items = textContent.items.filter((item: any) => typeof item.str === "string" && item.str.length > 0) as any[];
      
      if (items.length === 0) continue;

      // Group items into visual lines based on vertical baseline (y coordinate with a small tolerance)
      const lineTolerance = 4; // pixels tolerance for same line
      const lines: { y: number; items: any[] }[] = [];

      for (const item of items) {
        const itemY = item.transform ? item.transform[5] : 0;
        let foundLine = lines.find(l => Math.abs(l.y - itemY) <= lineTolerance);
        if (!foundLine) {
          foundLine = { y: itemY, items: [] };
          lines.push(foundLine);
        }
        foundLine.items.push(item);
      }

      // Sort lines top-to-bottom (PDF y-coordinates are bottom-to-top, so higher Y means higher on page)
      lines.sort((a, b) => b.y - a.y);

      // In each line, sort items left-to-right (X coordinate ascending)
      let pageLines: string[] = [];
      for (const line of lines) {
        line.items.sort((a, b) => (a.transform ? a.transform[4] : 0) - (b.transform ? b.transform[4] : 0));
        const lineText = line.items.map(item => item.str).join(" ").trim();
        if (lineText) {
          pageLines.push(lineText);
        }
      }

      fullText += pageLines.join("\n") + "\n\n--- PAGE BREAK ---\n\n";
    }

    return sanitizeAndNormalizeResumeText(fullText);
  } catch (error: any) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(error.message || "Failed to parse PDF document. It may be password-protected or contain scanned images without text.");
  }
}

/**
 * Extracts plain text from a DOCX file using mammoth with text normalization
 */
export async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return sanitizeAndNormalizeResumeText(result.value);
  } catch (error: any) {
    console.error("Error extracting text from DOCX:", error);
    throw new Error(error.message || "Failed to parse DOCX document. Please ensure the file is not corrupted.");
  }
}

/**
 * Extracts plain text from a File (.pdf, .docx, .doc, .txt, .json, .md) with validation and automatic normalization
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const validation = validateResumeFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid file.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  
  let raw = "";
  if (extension === "pdf") {
    raw = await extractTextFromPdf(file);
  } else if (extension === "docx" || extension === "doc") {
    raw = await extractTextFromDocx(file);
  } else {
    // Standard text, markdown, json, or rtf file
    raw = await file.text();
  }
  return sanitizeAndNormalizeResumeText(raw);
}


