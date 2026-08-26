import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { GlobalWorkerOptions } from "pdfjs-dist";
// @ts-ignore
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { normalizeExtractedText } from "./textNormalizer";
export { normalizeExtractedText };

// Set PDF.js worker safely
try {
  if (typeof window !== "undefined" && pdfWorker) {
    GlobalWorkerOptions.workerSrc = pdfWorker;
  }
} catch (e) {
  console.warn("Failed to set PDF.js workerSrc with Vite URL:", e);
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

    return normalizeExtractedText(fullText);
  } catch (error: any) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(error.message || "Failed to parse PDF document");
  }
}

/**
 * Extracts plain text from a DOCX file using mammoth with text normalization
 */
export async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return normalizeExtractedText(result.value);
  } catch (error: any) {
    console.error("Error extracting text from DOCX:", error);
    throw new Error(error.message || "Failed to parse DOCX document");
  }
}

/**
 * Extracts plain text from a File (.pdf, .docx, .doc, .txt) with automatic normalization
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  
  let raw = "";
  if (extension === "pdf") {
    raw = await extractTextFromPdf(file);
  } else if (extension === "docx" || extension === "doc") {
    raw = await extractTextFromDocx(file);
  } else {
    // Standard text or markdown file
    raw = await file.text();
  }
  return normalizeExtractedText(raw);
}

