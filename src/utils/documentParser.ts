import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { GlobalWorkerOptions } from "pdfjs-dist";
// @ts-ignore
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

// Set PDF.js worker safely
try {
  if (typeof window !== "undefined" && pdfWorker) {
    GlobalWorkerOptions.workerSrc = pdfWorker;
  }
} catch (e) {
  console.warn("Failed to set PDF.js workerSrc with Vite URL:", e);
}

/**
 * Extracts plain text from a PDF file using PDF.js
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
      const pageText = textContent.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ");
      fullText += pageText + "\n\n";
    }

    return fullText.trim();
  } catch (error: any) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(error.message || "Failed to parse PDF document");
  }
}

/**
 * Extracts plain text from a DOCX file using mammoth
 */
export async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (error: any) {
    console.error("Error extracting text from DOCX:", error);
    throw new Error(error.message || "Failed to parse DOCX document");
  }
}

/**
 * Extracts plain text from a File (.pdf, .docx, .doc, .txt)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  
  if (extension === "pdf") {
    return extractTextFromPdf(file);
  } else if (extension === "docx" || extension === "doc") {
    return extractTextFromDocx(file);
  } else {
    // Standard text or markdown file
    return await file.text();
  }
}
