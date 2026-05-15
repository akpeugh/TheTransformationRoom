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

const About = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      client: "National Logistics Provider",
      quote: "The Transformation Room didn't just give us a strategy. They got into the trenches with our floor managers and helped us integrate a new WMS that boosted our throughput by 22% in the first quarter.",
      author: "Director of Operations"
    },
    {
      client: "E-Commerce Fulfillment Center",
      quote: "We were struggling with retention and burnout. They completely redesigned our incentive models and shift structures, reducing our turnover rate by an incredible 40%.",
      author: "VP of HR"
    },
    {
      client: "Hardware Distribution Network",
      quote: "Their 'skin-in-the-game' approach is real. When our go-live faced unexpected hardware delays, they stayed on-site for almost a week straight to ensure we hit our launch date.",
      author: "Chief Supply Chain Officer"
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
                   <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt="Technology Integration" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
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
                   <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600" alt="People & Collaboration" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
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
              <span className="text-brand-secondary font-bold tracking-widest text-xs uppercase mb-4 block underline decoration-brand-primary underline-offset-4">OUR PHILOSOPHY</span>
              <h1 className="text-5xl font-bold mb-8 leading-tight text-slate-900">Inside Operations, <br /><span className="text-brand-primary">Not Outside.</span></h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                The Transformation Room was built from years of working inside high-volume operations, helping teams bridge the gap between complex strategy and practical execution. We aren't traditional consultants. We're <span className="text-slate-900 font-bold">practitioners</span> who have lived through the transformations we lead.
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                  { icon: <Settings className="w-6 h-6" />, label: "Operations" },
                  { icon: <Cpu className="w-6 h-6" />, label: "Technology" },
                  { icon: <Users className="w-6 h-6" />, label: "People" }
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
                <p className="italic text-lg text-slate-700 relative z-10 font-medium">"Our success is measured by your satisfaction, your team's satisfaction, and your tangible ROI. If we're in the room, we're in it for the long haul."</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-primary/20 via-slate-900 to-slate-900" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <span className="text-brand-secondary font-bold tracking-widest text-xs uppercase mb-4 block underline decoration-brand-primary underline-offset-4">IMPACT & EVIDENCE</span>
          <h2 className="text-4xl font-bold mb-16">Proven Transformation</h2>
          
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

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
             <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">The Leadership Behind the Room</h2>
             <div className="w-24 h-1.5 bg-brand-secondary mx-auto mb-8" />
             <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                Bringing together decades of experience in supply chain, technology, and organizational growth.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Katie Peugh */}
            <div className="flex flex-col items-center md:items-start gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="aspect-[4/5] bg-slate-100 rounded-[2.5rem] overflow-hidden relative shadow-xl max-w-sm mx-auto md:mx-0">
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
                className="space-y-6 text-center md:text-left"
              >
                <h3 className="text-3xl font-bold text-slate-900">Katie Peugh</h3>
                <p className="text-brand-primary text-sm font-bold uppercase tracking-widest inline-block bg-brand-primary/5 px-3 py-1.5 rounded">Operations & Talent Strategy</p>
                <p className="text-slate-600 text-lg leading-relaxed italic">
                  "I focus on aligning people, processes, and technology for scalable success."
                </p>
                <p className="text-slate-600 leading-relaxed">
                  With over 10 years across supply chain and warehouse environments, Katie has supported over 100 retail stores and distribution centers through complex operational shifts. Her expertise centers on driving HR transformation and managing end-to-end automation projects.
                </p>
              </motion.div>
            </div>

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
                <p className="text-brand-primary text-sm font-bold uppercase tracking-widest inline-block bg-brand-primary/5 px-3 py-1.5 rounded">Business Insights & Organizational Design</p>
                <p className="text-slate-600 text-lg leading-relaxed italic">
                  "Building high-performing teams and driving transformation at scale."
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Fawn brings a proven track record of helping organizations scale and navigate growth challenges. Her focus on business insights ensures that every transformation is backed by data and designed for long-term health.
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
                <p className="text-brand-primary text-sm font-bold uppercase tracking-widest inline-block bg-brand-primary/5 px-3 py-1.5 rounded">Finance & ROI Strategy</p>
                <p className="text-slate-600 text-lg leading-relaxed italic">
                  "Strategic alignment of technology solutions with measurable financial outcomes."
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Valeria drives the strategic alignment of technology solutions, ensuring that every project delivers clear, measurable return on investment and financial health for our clients.
                </p>
              </motion.div>
            </div>
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
                   <img src="https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=800" alt="Giving Back" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                   <div className="absolute inset-0 bg-brand-primary/20 group-hover:bg-brand-primary/10 transition-colors" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="h-64 bg-slate-200 rounded-3xl overflow-hidden shadow-xl mt-12 relative group"
                >
                   <img src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=600" alt="Team Synergy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                   <div className="absolute top-4 left-4">
                      <Heart className="w-10 h-10 text-brand-secondary fill-brand-secondary shadow-lg" />
                   </div>
                </motion.div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-secondary rounded-full blur-3xl opacity-20" />
            </div>
            <div className="lg:order-1">
              <span className="text-brand-secondary font-bold tracking-widest text-xs uppercase mb-4 block underline decoration-brand-primary underline-offset-4">COMMUNITY IMPACT</span>
              <h1 className="text-5xl font-bold mb-8 leading-tight text-slate-900">Built to <br /><span className="text-brand-primary">Give Back.</span></h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                At The Transformation Room, we believe that true transformation extends beyond business operations. We dedicate a portion of our time and resources to community upliftment and workforce development.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                {[
                  { icon: <Heart className="w-4 h-4" />, text: "Workforce Training" },
                  { icon: <Globe className="w-4 h-4" />, text: "Community Support" },
                  { icon: <BarChart3 className="w-4 h-4" />, text: "Donation Match" }
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
                <h3 className="text-xl font-bold mb-2 text-brand-primary">Support Our Initiatives</h3>
                <p className="text-slate-700 relative z-10 font-medium mb-6">Join us in extending transformation far beyond our boardroom. Together, we can make a difference in our communities.</p>
                <a href={DONATION_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex px-8 py-3 rounded-full text-base font-bold transition-all border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/40 relative z-10">
                  Donate Now
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
