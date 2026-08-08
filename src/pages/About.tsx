import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Settings, 
  Cpu, 
  Quote, 
  Heart, 
  Globe, 
  BarChart3 
} from "lucide-react";
import { DONATION_LINK } from "../constants";
import SEO from "../components/SEO";
import { useLanguage } from "../contexts/LanguageContext";
import { translate } from "../utils/translations";

const SHOW_FAWN_AND_VALERIA = false;
const SHOW_IMPACT_AND_EVIDENCE = false;

const About = () => {
  const { language } = useLanguage();
  const t = (key: string) => translate(key, language);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      client: t("about.test1.client"),
      quote: t("about.test1.quote"),
      author: t("about.test1.author")
    },
    {
      client: t("about.test2.client"),
      quote: t("about.test2.quote"),
      author: t("about.test2.author")
    },
    {
      client: t("about.test3.client"),
      quote: t("about.test3.quote"),
      author: t("about.test3.author")
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div>
      <SEO 
        title="About Us"
        description="Meet the practitioners behind The Transformation Room. We specialize in industrial systems, cognitive strategy, and workforce transformation."
      />
      <section className="bg-slate-50 pt-40 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="h-80 bg-slate-200 rounded-3xl overflow-hidden shadow-2xl relative group"
                >
                   <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt={t("about.img.tech")} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-6">
                      <div className="text-white">
                        <Cpu className="w-8 h-8 mb-2 text-brand-secondary" />
                        <p className="font-bold text-sm uppercase tracking-tighter">Advanced Systems</p>
                      </div>
                   </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="h-64 bg-slate-200 rounded-3xl overflow-hidden shadow-xl mt-12 relative group"
                >
                   <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600" alt={t("about.img.people")} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-6">
                      <div className="text-white">
                        <Users className="w-8 h-8 mb-2 text-brand-secondary" />
                        <p className="font-bold text-sm uppercase tracking-tighter">Human Potential</p>
                      </div>
                   </div>
                </motion.div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-secondary rounded-full blur-3xl opacity-20" />
            </div>
            <div>
              <span className="text-brand-secondary font-bold tracking-widest text-xs uppercase mb-4 block underline decoration-brand-primary underline-offset-4">{t("about.subtitle")}</span>
              <h1 className="text-5xl font-bold mb-8 leading-tight text-slate-900">{t("about.title.part1")} <br /><span className="text-brand-primary">{t("about.title.part2")}</span></h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                {t("about.desc")}
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                   { icon: <Settings className="w-6 h-6" />, label: t("about.pillar.ops") },
                   { icon: <Cpu className="w-6 h-6" />, label: t("about.pillar.tech") },
                   { icon: <Users className="w-6 h-6" />, label: t("about.pillar.people") }
                ].map((pillar, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <div className="bg-brand-primary/5 p-3 rounded-xl mb-3 text-brand-primary">
                      {pillar.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{pillar.label}</span>
                  </div>
                ))}
              </div>

              <motion.div 
                whileHover={{ x: 10 }}
                className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden group cursor-default"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-brand-secondary" />
                <Quote className="w-12 h-12 text-slate-50 absolute -top-2 -right-2 transform rotate-12" />
                <p className="italic text-lg text-slate-700 relative z-10 font-medium">{t("about.quote")}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {SHOW_IMPACT_AND_EVIDENCE && (
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-primary/20 via-slate-900 to-slate-900" />
          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <span className="text-brand-secondary font-bold tracking-widest text-xs uppercase mb-4 block underline decoration-brand-primary underline-offset-4">{t("about.impact")}</span>
            <h2 className="text-4xl font-bold mb-16">{t("about.proven")}</h2>
            
            <div className="relative h-64 md:h-56">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <Quote className="w-12 h-12 text-brand-secondary/40 mb-6" />
                  <p className="text-xl md:text-2xl font-light text-slate-200 mb-8 italic leading-relaxed">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                  <div>
                    <p className="font-bold text-brand-secondary tracking-wide uppercase text-sm mb-1">{testimonials[activeTestimonial].author}</p>
                    <p className="text-slate-400 text-xs font-semibold">{testimonials[activeTestimonial].client}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex justify-center gap-3 mt-12">
              {testimonials.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`transition-all duration-300 rounded-full ${i === activeTestimonial ? 'w-8 h-2 bg-brand-secondary' : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
             <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{t("about.leadership")}</h2>
             <div className="w-24 h-1.5 bg-brand-secondary mx-auto mb-8" />
             <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                {t("about.leadership.desc")}
             </p>
          </div>
          
          <div className={SHOW_FAWN_AND_VALERIA ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16" : "max-w-2xl mx-auto"}>
            {/* Katie Peugh */}
            <div className={`flex flex-col gap-8 ${SHOW_FAWN_AND_VALERIA ? "items-center md:items-start" : "items-center text-center"}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className={`aspect-[4/5] bg-slate-100 rounded-[2.5rem] overflow-hidden relative shadow-xl max-w-sm ${SHOW_FAWN_AND_VALERIA ? "mx-auto md:mx-0" : "mx-auto"}`}>
                  <img 
                    src="https://storage.googleapis.com/thetransformationroomassets/Katie.jpg" 
                    alt="Katie Peugh" 
                    className="w-full h-full object-cover" 
                    width="400" height="500" loading="lazy"
                    referrerPolicy="no-referrer" 
                  />
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`space-y-6 ${SHOW_FAWN_AND_VALERIA ? "text-center md:text-left" : "text-center"}`}
              >
                <h3 className="text-3xl font-bold text-slate-900">Katie Peugh</h3>
                <p className="text-brand-primary text-sm font-bold uppercase tracking-widest inline-block bg-brand-primary/5 px-3 py-1.5 rounded">{t("about.katie.role")}</p>
                <p className="text-slate-600 text-lg leading-relaxed italic">
                  {t("about.katie.quote")}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {t("about.katie.bio")}
                </p>
              </motion.div>
            </div>

            {SHOW_FAWN_AND_VALERIA && (
              <>
                {/* Fawn Cook */}
                <div className="flex flex-col items-center md:items-start gap-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full"
                  >
                    <div className="aspect-[4/5] bg-slate-100 rounded-[2.5rem] overflow-hidden relative shadow-xl max-w-sm mx-auto md:mx-0">
                      <img 
                        src="https://storage.googleapis.com/thetransformationroomassets/Fawn.JPG" 
                        alt="Fawn Cook" 
                        className="w-full h-full object-cover" 
                        width="400" height="500" loading="lazy"
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6 text-center md:text-left"
                  >
                    <h3 className="text-3xl font-bold text-slate-900">Fawn Cook</h3>
                    <p className="text-brand-primary text-sm font-bold uppercase tracking-widest inline-block bg-brand-primary/5 px-3 py-1.5 rounded">{t("about.fawn.role")}</p>
                    <p className="text-slate-600 text-lg leading-relaxed italic">
                      {t("about.fawn.quote")}
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      {t("about.fawn.bio")}
                    </p>
                  </motion.div>
                </div>

                {/* Valeria Mazo */}
                <div className="flex flex-col items-center md:items-start gap-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full"
                  >
                    <div className="aspect-[4/5] bg-slate-100 rounded-[2.5rem] overflow-hidden relative shadow-xl max-w-sm mx-auto md:mx-0">
                      <img 
                        src="https://storage.googleapis.com/thetransformationroomassets/Valeria%20Mazo.jpg" 
                        alt="Valeria Mazo" 
                        className="w-full h-full object-cover" 
                        width="400" height="500" loading="lazy"
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-6 text-center md:text-left"
                  >
                    <h3 className="text-3xl font-bold text-slate-900">Valeria Mazo</h3>
                    <p className="text-brand-primary text-sm font-bold uppercase tracking-widest inline-block bg-brand-primary/5 px-3 py-1.5 rounded">{t("about.valeria.role")}</p>
                    <p className="text-slate-600 text-lg leading-relaxed italic">
                      {t("about.valeria.quote")}
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      {t("about.valeria.bio")}
                    </p>
                  </motion.div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="bg-slate-50 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-row-reverse">
            <div className="relative lg:order-2">
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="h-80 bg-slate-200 rounded-3xl overflow-hidden shadow-2xl relative group"
                >
                   <img src="https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=800" alt={t("about.img.giving")} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                   <div className="absolute inset-0 bg-brand-primary/20 group-hover:bg-brand-primary/10 transition-colors" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="h-64 bg-slate-200 rounded-3xl overflow-hidden shadow-xl mt-12 relative group"
                >
                   <img src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=600" alt={t("about.img.synergy")} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                   <div className="absolute top-4 left-4">
                      <Heart className="w-10 h-10 text-brand-secondary fill-brand-secondary shadow-lg" />
                   </div>
                </motion.div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-secondary rounded-full blur-3xl opacity-20" />
            </div>
            <div className="lg:order-1">
              <span className="text-brand-secondary font-bold tracking-widest text-xs uppercase mb-4 block underline decoration-brand-primary underline-offset-4">{t("about.community.impact")}</span>
              <h1 className="text-5xl font-bold mb-8 leading-tight text-slate-900">{t("about.community.title1")} <br /><span className="text-brand-primary">{t("about.community.title2")}</span></h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                {t("about.community.desc")}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                {[
                  { icon: <Heart className="w-4 h-4" />, text: t("about.community.item1") },
                  { icon: <Globe className="w-4 h-4" />, text: t("about.community.item2") },
                  { icon: <BarChart3 className="w-4 h-4" />, text: t("about.community.item3") }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm text-sm font-medium text-slate-700">
                    <span className="text-brand-primary">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              <motion.div 
                whileHover={{ x: -10 }}
                className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden group cursor-default"
              >
                <div className="absolute top-0 right-0 w-2 h-full bg-brand-secondary" />
                <h3 className="text-xl font-bold mb-2 text-brand-primary">{t("about.community.support.title")}</h3>
                <p className="text-slate-700 relative z-10 font-medium mb-6">{t("about.community.support.desc")}</p>
                <a href={DONATION_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex px-8 py-3 rounded-full text-base font-bold transition-all border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/40 relative z-10">
                  {t("about.community.support.btn")}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
