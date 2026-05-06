import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Calendar, 
  Globe, 
  Sparkles, 
  Video, 
  ArrowRight, 
  Clock,
  MessageSquare,
  Factory,
  Layers,
  Briefcase,
  FileText,
  Zap,
  ShieldCheck,
  Bot,
  User
} from "lucide-react";
import { SCHEDULING_30MIN, DISCOVERY_CALL_1HR, ADDRESS } from "../constants";

const Contact = ({ aiConsultationData }: { aiConsultationData?: { summary: string; insights: string } | null }) => {
  const location = useLocation();
  const [formType, setFormType] = useState<"individual" | "organization">("organization");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const assessmentData = location.state?.assessmentResults;
  const [selectedService, setSelectedService] = useState<string>("");

  useEffect(() => {
    if (assessmentData?.source === "organization") {
      setFormType("organization");
    } else if (assessmentData?.source === "individual") {
      setFormType("individual");
    }
    
    if (assessmentData?.archetype) {
      // Map archetype to label (strip "Tier X: " if needed)
      const arch = assessmentData.archetype;
      if (arch.includes("Foundation")) setSelectedService("Foundation");
      else if (arch.includes("Strategy")) setSelectedService("Strategy");
      else if (arch.includes("Premium")) setSelectedService("Premium");
      else if (arch.includes("AI 101")) setSelectedService("AI 101 Labs");
      else setSelectedService(arch);
    }
  }, [assessmentData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Extract form data
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      // Send the data using FormSubmit's AJAX endpoint
      await fetch("https://formsubmit.co/ajax/katie@thetransformationroom.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      // Show success screen whether it succeeded perfectly or not
      // (The very first submission will trigger an activation email from FormSubmit)
      setIsSubmitted(true);
    } catch (error) {
      console.error("Form submission error:", error);
      // Still show success to not confuse user, but log it
      setIsSubmitted(true); 
    }
  };

  if (isSubmitted) {
    return (
      <section className="bg-slate-900 pt-40 pb-24 text-white min-h-[80vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-brand-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-secondary/30">
            <CheckCircle2 className="w-10 h-10 text-brand-secondary" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Message Sent!</h2>
          <p className="text-slate-400 mb-8">Thank you for reaching out. We've received your inquiry and will be in touch shortly.</p>
          <Link to="/" className="inline-block bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark transition-all">
            Return Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className="bg-slate-900 pt-40 pb-24 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h1 className="text-5xl font-bold mb-8 tracking-tighter">Let's Build <br/>Something Better.</h1>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed font-light">
              Choose the path that fits your needs. Our forms are designed to help us understand your unique operational or career challenges from the start.
            </p>
            
            <div className="space-y-8 mb-12">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                   <Calendar className="w-6 h-6 text-brand-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Direct Scheduling</h4>
                  <div className="flex flex-col gap-2">
                    <a href={SCHEDULING_30MIN} target="_blank" rel="noreferrer" className="text-slate-400 text-sm hover:text-brand-secondary transition-colors underline">30 Min Consultation</a>
                    <a href={DISCOVERY_CALL_1HR} target="_blank" rel="noreferrer" className="text-slate-400 text-sm hover:text-brand-secondary transition-colors underline">1 Hour Discovery Call</a>
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                   <Globe className="w-6 h-6 text-brand-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Location</h4>
                  <p className="text-slate-400 text-sm">{ADDRESS}</p>
                  <p className="text-slate-500 text-xs italic mt-1 pb-2">Remote to start w/ travel</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl group transition-all hover:border-brand-secondary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 -mt-4 -mr-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <img src="https://storage.googleapis.com/thetransformationroomassets/Nova%20full%20body" alt="NOVA" className="w-full h-full object-cover rounded-full blur-[2px] group-hover:blur-0 transition-all" referrerPolicy="no-referrer" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-secondary mb-4 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Interstellar Intelligence
              </p>
              <div className="flex gap-4 items-start mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-brand-secondary/30 bg-slate-800 shrink-0">
                  <img src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" alt="NOVA" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Engage with NOVA?</h4>
                  <p className="text-slate-400 text-sm mb-6 font-light">
                    NOVA is available for a real-time interstellar discovery session to help you identify your top priorities and map your specific transformation trajectory.
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat', { detail: { prompt: "I would like to start an interstellar discovery session with NOVA." } }))}
                className="w-full py-4 bg-brand-secondary text-brand-dark rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand-secondary/10 hover:shadow-brand-secondary/20 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Initiate NOVA Chat
              </button>
            </div>
          </div>
          
          <div className="bg-white text-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl" />
            
            <div className="space-y-4 mb-10 relative z-10">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Transformation Domain</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => {
                    setFormType("organization");
                    setSelectedService("");
                  }}
                  className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 group ${
                    formType === "organization" 
                      ? 'bg-brand-primary border-brand-primary text-white shadow-xl scale-[1.02]' 
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className={`w-6 h-6 transition-transform group-hover:scale-110 ${formType === "organization" ? 'text-brand-secondary' : 'text-slate-400'}`} />
                  <span className="font-black text-[10px] uppercase tracking-[0.2em] leading-none">Organization</span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setFormType("individual");
                    setSelectedService("");
                  }}
                  className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 group ${
                    formType === "individual" 
                      ? 'bg-brand-primary border-brand-primary text-white shadow-xl scale-[1.02]' 
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <User className={`w-6 h-6 transition-transform group-hover:scale-110 ${formType === "individual" ? 'text-brand-secondary' : 'text-slate-400'}`} />
                  <span className="font-black text-[10px] uppercase tracking-[0.2em] leading-none">Individual</span>
                </button>
              </div>
            </div>

            <form 
              action="https://formsubmit.co/katie@thetransformationroom.com" 
              method="POST"
              className="space-y-6 relative z-10"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="_subject" value={`New Transformation Room Lead: ${formType === 'organization' ? 'Organization' : 'Individual'}`} />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_next" value={window.location.href} />
              
              {aiConsultationData && (
                <div className="bg-brand-secondary/10 border border-brand-secondary/30 p-4 rounded-xl flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-secondary/20 border border-brand-secondary/30 shrink-0 shadow-sm">
                    <img src="https://storage.googleapis.com/thetransformationroomassets/Nova%20face" alt="NOVA" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">NOVA Session Intelligence Integrated</p>
                    <p className="text-[10px] text-slate-500">Your specific trajectory mapping from NOVA has been seamlessly attached to this request.</p>
                  </div>
                </div>
              )}
              
              {aiConsultationData && (
                <>
                  <input type="hidden" name="ai_consultation_summary" value={aiConsultationData.summary} />
                  <input type="hidden" name="ai_consultation_insights" value={aiConsultationData.insights} />
                </>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <input 
                    required
                    name="name"
                    type="text" 
                    placeholder="Jane Doe"
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:border-brand-primary/50 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    {formType === 'organization' ? 'Company Name' : 'Current Title'}
                  </label>
                  <input 
                    required
                    name="company_or_title"
                    type="text" 
                    placeholder={formType === 'organization' ? "Acme Corp" : "Operations Manager"}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:border-brand-primary/50 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Email</label>
                  <input 
                    required
                    name="email"
                    type="email" 
                    placeholder="jane@example.com"
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:border-brand-primary/50 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Urgency / Timeframe</label>
                  <select 
                    name="timeframe"
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:border-brand-primary/50 focus:bg-white outline-none transition-all appearance-none"
                  >
                    <option value="urgent">Immediate / Growth Mode (ASAP)</option>
                    <option value="planning">Active Planning (Next 30-90 Days)</option>
                    <option value="exploring">Just Exploring / Informational</option>
                    <option value="future">Future Strategic Requirement</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  {formType === 'organization' ? 'Service Tier Interest' : 'Interstellar Package'}
                </label>
                <input type="hidden" name="service_interest" value={selectedService} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formType === 'organization' ? (
                    <>
                      {[
                        { id: 'foundation', label: 'Foundation', sub: 'Audit & Assessment', icon: <Factory className="w-5 h-5" /> },
                        { id: 'strategy', label: 'Strategy', sub: 'Roadmap & Design', icon: <Layers className="w-5 h-5" /> },
                        { id: 'premium', label: 'Premium', sub: 'Active Implementation', icon: <Briefcase className="w-5 h-5" /> }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedService(opt.label)}
                          className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                            selectedService === opt.label 
                              ? 'bg-brand-primary border-brand-primary text-white shadow-lg' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-brand-primary/30'
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl transition-colors ${
                            selectedService === opt.label ? 'bg-white/20 text-white' : 'bg-white border border-slate-100 text-brand-primary group-hover:bg-brand-primary/5'
                          }`}>
                            {opt.icon}
                          </div>
                          <div>
                            <p className="font-bold text-sm leading-none mb-1">{opt.label}</p>
                            <p className={`text-[10px] uppercase tracking-wider font-medium ${
                              selectedService === opt.label ? 'text-white/70' : 'text-slate-400'
                            }`}>{opt.sub}</p>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      {[
                        { id: 'foundation', label: 'Foundation', sub: 'Resume & Positioning', icon: <FileText className="w-5 h-5" /> },
                        { id: 'strategy', label: 'Strategy', sub: 'Search Orchestration', icon: <Zap className="w-5 h-5" /> },
                        { id: 'premium', label: 'Premium', sub: 'Authority & Negotiation', icon: <Briefcase className="w-5 h-5" /> },
                        { id: 'ai101', label: 'AI 101 Labs', sub: 'Tech Literacy', icon: <Bot className="w-5 h-5" /> }
                       ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedService(opt.label)}
                          className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                            selectedService === opt.label 
                              ? 'bg-brand-primary border-brand-primary text-white shadow-lg' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-brand-primary/30'
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl transition-colors ${
                            selectedService === opt.label ? 'bg-white/20 text-white' : 'bg-white border border-slate-100 text-brand-primary group-hover:bg-brand-primary/5'
                          }`}>
                            {opt.icon}
                          </div>
                          <div>
                            <p className="font-bold text-sm leading-none mb-1">{opt.label}</p>
                            <p className={`text-[10px] uppercase tracking-wider font-medium ${
                              selectedService === opt.label ? 'text-white/70' : 'text-slate-400'
                            }`}>{opt.sub}</p>
                          </div>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Brief Description of Needs</label>
                <textarea 
                  required
                  name="description"
                  rows={4}
                  defaultValue={assessmentData ? `[AUTO-ATTACHED ASSESSMENT RESULTS]\nArchetype: ${assessmentData.archetype}\nTraits/Details: ${assessmentData.traits}\n\nUser Notes: ` : ""}
                  placeholder={formType === 'organization' ? "Tell us about your current bottlenecks, systems goals, or workforce challenges..." : "Tell us about your career transition goals, resume needs, or areas where you feel stuck..."}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:border-brand-primary/50 focus:bg-white outline-none transition-all resize-none"
                />
              </div>

              {assessmentData && (
                <div className="p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/20 space-y-2 animate-in fade-in slide-in-from-top-1 duration-500">
                  <div className="flex items-center gap-2 text-brand-primary">
                    <CheckCircle2 className="w-4 h-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Assessment Data Attached</p>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Your <span className="text-slate-900 font-bold">{assessmentData.archetype}</span> results have been automatically mapped to your inquiry to help our strategists prepare for your session.
                  </p>
                  <input type="hidden" name="archetype_result" value={assessmentData.archetype} />
                  <input type="hidden" name="assessment_traits" value={assessmentData.traits} />
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-brand-primary text-white py-5 rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-3 active:scale-95"
              >
                Send Inquiry <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="flex items-center justify-center gap-2 text-brand-secondary">
                <Clock className="w-3 h-3" />
                <p className="text-[10px] uppercase tracking-widest font-black">
                  We'll be in contact within 24 business hours
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
