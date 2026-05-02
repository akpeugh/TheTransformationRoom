import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Sparkles, 
  ChevronRight, 
  Download, 
  RefreshCcw, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  X,
  Upload
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface ResumeOptimizerProps {
  onClose: () => void;
}

export const ResumeOptimizer = ({ onClose }: ResumeOptimizerProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [parsingFile, setParsingFile] = useState(false);
  const [formData, setFormData] = useState({
    currentRole: "",
    targetRole: "",
    biggestGap: "",
    experienceLevel: "Mid-Level",
    rawContent: ""
  });
  const [optimizedContent, setOptimizedContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" }), []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setParsingFile(true);
    try {
      let text = "";
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          text += pageText + "\n";
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.type === "text/plain") {
        text = await file.text();
      } else {
        alert("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
      }

      if (text) {
        setFormData(prev => ({ ...prev, rawContent: text }));
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Error parsing file. Please try pasting the text instead.");
    } finally {
      setParsingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert Executive Resume Writer specializing in Supply Chain, Logistics, and High-Tech Operations. 
        
        OPTIMIZATION TARGET:
        - Current Role: ${formData.currentRole}
        - Target Role: ${formData.targetRole}
        - Address Gap: ${formData.biggestGap}
        - Level: ${formData.experienceLevel}
        
        INPUT CONTENT (Resume Text):
        ${formData.rawContent}
        
        TASK:
        1. Analyze the input resume and provide quick tips and suggestions on changes needed.
        2. Rewrite the professional summary and key sections to focus on "Operational Transformation" and "Systems Thinking."
        3. Bridge the gap mentioned by highlighting transferable skills in automation, data, or leadership.
        4. Provide 2 different format options for the professional summary (Option A: Direct & Impact-focused, Option B: Visionary & Strategic).
        5. Integrate mentions of "The Transformation Room" philosophy implicitly (e.g., Data, Robotics, Optimization, Network Flow).
        
        OUTPUT FORMAT (Use Markdown formatting):
        ## 💡 Tips & Suggestions
        (Provide 3 actionable tips on formatting or content positioning)

        ## ✨ Proposed Rewrites

        ### Option A: Impact-Focused
        (A punchy, metric-driven summary and 3 key impact bullets)

        ### Option B: Visionary & Strategic
        (A broader strategic summary and 3 key impact bullets)
        `,
      });

      setOptimizedContent(response.text || "Optimization complete. Please review.");
      setStep(4);
    } catch (error) {
      console.error("Optimization failed:", error);
      alert("Optimization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([optimizedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "TTR_Optimized_Resume_Summary.md";
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] h-[90vh] md:h-auto"
      >
        {/* Left Side: context */}
        <div className="md:w-1/3 bg-brand-primary p-8 md:p-12 text-white flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-brand-secondary/20 flex items-center justify-center mb-8">
              <Sparkles className="w-6 h-6 text-brand-secondary" />
            </div>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Resume Optimization Wizard</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Bridge the technical gap in your career narrative. We help transition your experience from traditional logistics to automated operational excellence.
            </p>
            
            <div className="space-y-6">
              {[
                { label: "Define Goal", active: step >= 1 },
                { label: "Identify Gaps", active: step >= 2 },
                { label: "Upload & Input", active: step >= 3 },
                { label: "Review Edits", active: step >= 4 },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full transition-all ${s.active ? 'bg-brand-secondary scale-125 shadow-[0_0_8px_rgba(20,184,166,0.6)]' : 'bg-white/20'}`} />
                  <span className={`text-xs font-bold uppercase tracking-widest ${s.active ? 'text-white' : 'text-white/40'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hidden md:block mt-8">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-secondary" />
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Free Community Tool</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-grow p-8 md:p-12 overflow-y-auto bg-slate-50 relative flex flex-col">
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors z-10">
            <X className="w-6 h-6" />
          </button>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 my-auto"
              >
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Identify Your Path</h3>
                  <p className="text-slate-500">What is your current role and where are you headed?</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Current Title</label>
                    <input 
                      type="text" 
                      value={formData.currentRole}
                      onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                      placeholder="e.g. Warehouse Manager"
                      className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:border-brand-secondary outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Target Title</label>
                    <input 
                      type="text" 
                      value={formData.targetRole}
                      onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                      placeholder="e.g. Solutions Design Engineer"
                      className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:border-brand-secondary outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <button 
                  disabled={!formData.currentRole || !formData.targetRole}
                  onClick={() => setStep(2)}
                  className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all disabled:opacity-50"
                >
                  Next Step <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 my-auto"
              >
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Bridge the Gap</h3>
                  <p className="text-slate-500">What is the biggest hurdle in your current narrative?</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    "Lack of formal automation experience",
                    "Transitioning from field to corporate",
                    "Technical jargon vs. operational reality",
                    "Highlighting data-driven achievements",
                    "Shifting from management to strategy"
                  ].map((gap, i) => (
                    <button 
                      key={i}
                      onClick={() => setFormData({...formData, biggestGap: gap})}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        formData.biggestGap === gap 
                        ? 'border-brand-secondary bg-brand-secondary/10 text-brand-primary font-bold' 
                        : 'border-slate-200 bg-white hover:border-brand-secondary'
                      }`}
                    >
                      {gap}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-grow bg-slate-200 text-slate-700 py-4 rounded-xl font-bold">Back</button>
                  <button 
                    disabled={!formData.biggestGap}
                    onClick={() => setStep(3)}
                    className="flex-[2] bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex flex-col h-full"
              >
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Upload Resume Content</h3>
                  <p className="text-slate-500">Upload your PDF/Word document, or paste your text below.</p>
                </div>
                
                <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-brand-secondary transition-colors group relative">
                  <input 
                    type="file" 
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:text-brand-secondary group-hover:bg-brand-secondary/10 transition-colors">
                      {parsingFile ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">Click or drag file to upload</p>
                      <p className="text-xs text-slate-500 font-medium">Supports PDF, DOCX, TXT</p>
                    </div>
                  </div>
                </div>

                <textarea 
                  value={formData.rawContent}
                  onChange={(e) => setFormData({...formData, rawContent: e.target.value})}
                  className="w-full flex-grow min-h-[120px] bg-white border border-slate-200 p-6 rounded-2xl focus:border-brand-secondary outline-none transition-all shadow-inner font-sans text-sm leading-relaxed resize-none"
                  placeholder="Or paste your text here..."
                />

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-800 leading-tight">Our AI will analyze your resume, give feedback, and rewrite your summary with options.</p>
                </div>

                <div className="flex gap-4 shrink-0">
                  <button onClick={() => setStep(2)} className="flex-grow bg-slate-200 text-slate-700 py-4 rounded-xl font-bold">Back</button>
                  <button 
                    disabled={!formData.rawContent || loading || parsingFile}
                    onClick={handleOptimize}
                    className="flex-[2] bg-brand-secondary text-brand-dark py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Analyze & Rewrite</>}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 flex flex-col h-full"
              >
                <div className="flex justify-between items-end shrink-0 pt-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Review & Pick Edits</h3>
                    <p className="text-slate-500 text-sm">Review these suggestions and format options.</p>
                  </div>
                  <button onClick={() => setStep(3)} className="text-brand-primary p-2 hover:bg-brand-primary/5 rounded-lg transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <RefreshCcw className="w-4 h-4" /> Edit / Regenerate
                  </button>
                </div>
                
                <div className="bg-slate-900 text-slate-100 p-6 md:p-8 rounded-[2rem] shadow-2xl relative group flex-grow overflow-y-auto">
                  <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap font-sans leading-relaxed">
                    {optimizedContent}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                   <button 
                    onClick={downloadText}
                    className="flex-grow bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-brand-primary/20"
                   >
                    <Download className="w-5 h-5" /> Save TXT
                   </button>
                   <button 
                    onClick={onClose}
                    className="flex-grow border-2 border-slate-200 text-slate-500 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all"
                   >
                    Close Wizard
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

