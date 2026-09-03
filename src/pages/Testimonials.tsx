import { Briefcase, Quote } from "lucide-react";
import SEO from "../components/SEO";
import { useLanguage } from "../contexts/LanguageContext";
import { translate } from "../utils/translations";

const Testimonials = () => {
  const { language } = useLanguage();
  const t = (key: string) => translate(key, language);

  return (
  <div className="pt-32 pb-24 bg-slate-50">
    <SEO 
      title="Client Results & Impact | Supply Chain & Technology Consulting"
      description="Proven transformation outcomes in supply chain consulting, warehouse automation, enterprise technology integration, and AI operational systems."
      keywords="Supply chain consulting reviews, warehouse consulting testimonials, technology consulting results, automation client outcomes, The Transformation Room impact"
    />
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-20">
        <span className="text-brand-secondary font-bold tracking-widest text-xs uppercase mb-4 block underline">{t("test.hero.label")}</span>
        <h1 className="text-5xl font-bold mb-6 text-slate-900">{t("test.hero.title")}</h1>
        <p className="text-slate-700 text-lg font-medium">{t("test.hero.desc")}</p>
      </div>

      <div className="mb-32">
        <h2 className="text-2xl font-bold mb-12 flex items-center gap-4 text-slate-900">
          <Briefcase className="text-brand-secondary w-8 h-8" />
          {t("test.case.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Network Optimization",
              client: "National Distributor",
              result: "22% efficiency gain in labor throughput via WMS re-alignment.",
              img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600"
            },
            {
              title: "Automation Implementation",
              client: "Multi-site Logistics",
              result: "Successful AS/RS integration reducing manual touchpoints by 40%.",
              img: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=80&w=600"
            },
            {
              title: "Workforce Strategy",
              client: "Regional Warehouse",
              result: "Redesigned scheduling & incentives improving retention by 15%.",
              img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600"
            }
          ].map((caseStudy, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200 group hover:shadow-xl transition-all">
              <div className="h-48 overflow-hidden">
                <img src={caseStudy.img} alt={caseStudy.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <p className="text-xs font-bold text-brand-secondary uppercase mb-2">{caseStudy.client}</p>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{caseStudy.title}</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{caseStudy.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-12 flex items-center gap-4 text-slate-900">
        <Quote className="text-brand-secondary w-8 h-8" />
        {t("test.client.title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { text: "They helped us simplify everything, align leadership, and build a roadmap that actually made sense. It completely changed how we approach execution.", author: "Director of Operations" },
          { text: "Within weeks, we had better visibility and a clearer direction than we had in months. Their approach is practical, not just theoretical ideas.", author: "Ops Leader (Warehousing)" },
          { text: "What stood out most was their ability to connect process, systems, and people. A lot of teams focus on one piece, they brought everything together.", author: "Continuous Improvement Leader" },
          { text: "The biggest impact was visibility. Decision-making became significantly faster and more confident across the board.", author: "Logistics Leader" }
        ].map((t, i) => (
          <div key={i} className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
            <Quote className="w-12 h-12 text-slate-100 absolute -top-2 -left-2 group-hover:text-brand-secondary/10" />
            <p className="text-lg text-slate-700 mb-8 relative z-10 leading-relaxed">"{t.text}"</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-px bg-brand-secondary" />
              <p className="font-bold text-brand-primary">{t.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default Testimonials;
