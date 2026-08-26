import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  BarChart3, 
  Bot, 
  Layers, 
  Cpu, 
  Truck, 
  Users, 
  ChevronDown, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  Network, 
  TrendingDown, 
  Building2, 
  User, 
  Settings, 
  Handshake, 
  Quote, 
  Zap,
  Globe,
  Database,
  Video,
  Activity,
  Brain
} from "lucide-react";

import { useLanguage } from "../contexts/LanguageContext";
import { translate } from "../utils/translations";
import { DISCOVERY_CALL_1HR } from "../constants";
import SEO from "../components/SEO";
import { ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from "../constants/schema";
import { LazyVideo } from "../components/LazyVideo";
import Markdown from "react-markdown";

const NovaInsight = ({ text, className = "" }: { text: string; className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className={`p-6 bg-slate-900 shadow-2xl rounded-2xl border border-brand-secondary/30 relative overflow-hidden group ${className}`}
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Bot className="w-12 h-12 text-brand-secondary" />
    </div>
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 rounded-lg bg-brand-secondary/10 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-brand-secondary" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">NOVA Observation</span>
    </div>
    <p className="text-slate-200 text-sm italic font-light leading-relaxed">"{text}"</p>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-secondary/30 to-transparent" />
  </motion.div>
);
// ... categories and videoMap ...

const videoMap: Record<string, string> = {
  "Hero/Header": "https://storage.googleapis.com/thetransformationroomassets/Hands%20Touching.mp4",
  "Connecting People & AI": "https://storage.googleapis.com/thetransformationroomassets/People%20%20Data.mp4",
  "Modernizing Manufacturing / Warehousing": "https://storage.googleapis.com/thetransformationroomassets/Automated%20Warehouse.mp4",
  "Analytics": "https://storage.googleapis.com/thetransformationroomassets/Analytics.mp4",
  "Robots / Cobots": "https://storage.googleapis.com/thetransformationroomassets/Dancing%20Bot.mp4",
  "AS/RS": "https://storage.googleapis.com/thetransformationroomassets/ASRS.mp4",
  "Asset Tracking": "https://storage.googleapis.com/thetransformationroomassets/Drone.mp4",
  "AMR / AGV": "https://storage.googleapis.com/thetransformationroomassets/AMR.mp4",
  "Auxiliary / AR / VR": "https://storage.googleapis.com/thetransformationroomassets/AR%20Glasses.mp4",
  "Employee Facing Tools": "https://storage.googleapis.com/thetransformationroomassets/Employee%20Phone.mp4",
  "Transportation & Logistics": "https://storage.googleapis.com/thetransformationroomassets/ROute.mp4"
};

const Home = () => {
  const { language } = useLanguage();
  const t = (key: string) => translate(key, language);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const location = useLocation();

  const { scrollY, scrollYProgress } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 120]);
  
  const yBg1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const yBg2 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  const solutionRef1 = useRef(null);
  const { scrollYProgress: scrollYProgress1 } = useScroll({ target: solutionRef1, offset: ["start end", "end start"] });
  const yImage1 = useTransform(scrollYProgress1, [0, 1], [80, -80]);

  const solutionRef2 = useRef(null);
  const { scrollYProgress: scrollYProgress2 } = useScroll({ target: solutionRef2, offset: ["start end", "end start"] });
  const yImage2 = useTransform(scrollYProgress2, [0, 1], [80, -80]);

  useEffect(() => {
    // Attempt immediate eager playback of the critical header video
    if (heroVideoRef.current) {
      const playPromise = heroVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setHeroVideoReady(true))
          .catch(() => {
            // Autoplay policies handled; mark ready so gradient isn't stuck
            setHeroVideoReady(true);
          });
      }
    }
  }, []);



  const categories = [
    {
      title: t("home.cat.1.title"),
      label: t("home.cat.1.label"),
      icon: <BarChart3 className="w-6 h-6" />,
      videoKey: "Analytics",
      desc: t("home.cat.1.desc"),
      details: t("home.cat.1.details")
    },
    {
      title: t("home.cat.2.title"),
      label: t("home.cat.2.label"),
      icon: <Bot className="w-6 h-6" />,
      videoKey: "Robots / Cobots",
      desc: t("home.cat.2.desc"),
      details: t("home.cat.2.details")
    },
    {
      title: t("home.cat.3.title"),
      label: t("home.cat.3.label"),
      icon: <Layers className="w-6 h-6" />,
      videoKey: "AS/RS",
      desc: t("home.cat.3.desc"),
      details: t("home.cat.3.details")
    },
    {
      title: t("home.cat.4.title"),
      label: t("home.cat.4.label"),
      icon: <Cpu className="w-6 h-6" />,
      videoKey: "Asset Tracking",
      desc: t("home.cat.4.desc"),
      details: t("home.cat.4.details")
    },
    {
      title: t("home.cat.5.title"),
      label: t("home.cat.5.label"),
      icon: <Truck className="w-6 h-6" />,
      videoKey: "AMR / AGV",
      desc: t("home.cat.5.desc"),
      details: t("home.cat.5.details")
    },
    {
      title: t("home.cat.6.title"),
      label: t("home.cat.6.label"),
      icon: <Cpu className="w-6 h-6" />,
      videoKey: "Auxiliary / AR / VR",
      desc: t("home.cat.6.desc"),
      details: t("home.cat.6.details")
    },
    {
      title: t("home.cat.7.title"),
      label: t("home.cat.7.label"),
      icon: <Users className="w-6 h-6" />,
      videoKey: "Employee Facing Tools",
      desc: t("home.cat.7.desc"),
      details: t("home.cat.7.details")
    },
    {
      title: t("home.cat.8.title"),
      label: t("home.cat.8.label"),
      icon: <Truck className="w-6 h-6" />,
      videoKey: "Transportation & Logistics",
      desc: t("home.cat.8.desc"),
      details: t("home.cat.8.details")
    }
  ];

  const handleCategoryHover = (i: number | null) => {
    if (!isLocked) {
      setActiveCategory(i);
    }
  };

  const handleCategoryClick = (i: number) => {
    if (activeCategory === i && isLocked) {
      setIsLocked(false);
      setActiveCategory(null);
    } else {
      setIsLocked(true);
      setActiveCategory(i);
    }
  };

  return (
    <div className="bg-slate-900">
      <SEO 
        title="Home"
        description="Professional operations and technology consulting specializing in warehouse automation, workforce strategy, and scalable systems."
        schema={{
          "@context": "https://schema.org",
          "@graph": [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA]
        }}
      />
      {/* Hero Content */}
      <section className="relative min-h-[92vh] flex items-center pb-20 overflow-hidden bg-slate-950">
        {/* Background Ambient Glow & Video Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-slate-950">
          {/* Subtle Ambient Teal Atmosphere behind video */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-secondary/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none" />
          
          {/* Dark Overlay Gradients for Optimal Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950 z-10" />
          
          {/* Header Video - Prioritized and Smoothly Faded In */}
          <video 
            ref={heroVideoRef}
            aria-label="The Transformation Room Hero Video"  
            autoPlay 
            muted 
            loop 
            playsInline 
            preload="auto"
            onPlaying={() => setHeroVideoReady(true)}
            onLoadedData={() => setHeroVideoReady(true)}
            onCanPlay={() => setHeroVideoReady(true)}
            className={`w-full h-full object-cover [mask-image:linear-gradient(to_bottom,white_65%,transparent_100%)] object-center transform scale-105 transition-opacity duration-1000 ease-out ${
              heroVideoReady ? "opacity-100" : "opacity-0"
            }`}
            onError={(e) => {
              console.error("Hero video error:", e);
              setHeroVideoReady(true);
            }}
          >
            <source src={videoMap["Hero/Header"]} type="video/mp4" />
          </video>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-20 w-full flex flex-col items-center text-center px-4 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: y1 }}
            className="max-w-4xl"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-[1.1] mb-6 tracking-tighter cursor-default drop-shadow-2xl z-20 relative break-words"
              whileHover={{ scale: 1.01, textShadow: "0px 10px 30px rgba(255,255,255,0.2)" }}
            >
              {t("home.title")}
            </motion.h1>
            <motion.span 
              whileHover={{ scale: 1.02, filter: "brightness(1.2)" }}
              className="text-brand-secondary font-bold tracking-widest text-lg md:text-2xl uppercase mb-8 block cursor-default transition-all duration-300 drop-shadow-md"
            >
              {t("home.subtitle")}
            </motion.span>
            <p className="text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed max-w-3xl mx-auto font-light drop-shadow-lg">
              {t("home.desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/contact" className="bg-brand-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-brand-dark hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/40 relative overflow-hidden group cursor-pointer text-center">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                {t("home.start")} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-brand-secondary/10 blur-[50px] z-20 pointer-events-none"></div>
      </section>

        {/* WHO WE WORK WITH */}
      <section className="pt-24 pb-32 relative overflow-hidden perspective-1000 bg-transparent">
        <motion.div style={{ y: yBg1 }} className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <motion.div style={{ y: yBg2 }} className="absolute bottom-0 left-0 w-1/2 h-full bg-brand-secondary/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{t("home.whoWeWorkWith.title")}</h2>
            <div className="w-24 h-1.5 bg-brand-secondary mx-auto rounded-full" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
            {[
              {
                title: t("home.www.1.title"),
                issue: t("home.www.1.issue"),
                desc: t("home.www.1.desc"),
                icon: <Globe className="w-6 h-6" />
              },
              {
                title: t("home.www.2.title"),
                issue: t("home.www.2.issue"),
                desc: t("home.www.2.desc"),
                icon: <ShoppingBag className="w-6 h-6" />
              },
              {
                title: t("home.www.3.title"),
                issue: t("home.www.3.issue"),
                desc: t("home.www.3.desc"),
                icon: <Network className="w-6 h-6" />
              },
              {
                title: t("home.www.4.title"),
                issue: t("home.www.4.issue"),
                desc: t("home.www.4.desc"),
                icon: <TrendingDown className="w-6 h-6" />
              },
              {
                title: t("home.www.5.title"),
                issue: t("home.www.5.issue"),
                desc: t("home.www.5.desc"),
                icon: <Building2 className="w-6 h-6" />
              },
              {
                title: t("home.www.6.title"),
                issue: t("home.www.6.issue"),
                desc: t("home.www.6.desc"),
                icon: <Zap className="w-6 h-6" />
              }
            ].map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -5 }}
                key={i} 
                className="group p-8 bg-slate-800/95 border border-white/5 rounded-3xl hover:border-brand-secondary/50 shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_60px_rgba(45,212,191,0.1)] transition-all duration-500 relative overflow-hidden z-10 cursor-default"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/5 to-transparent pointer-events-none rounded-3xl" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 rounded-full blur-2xl group-hover:bg-brand-secondary/30 transition-all duration-500" />
                <div className="w-12 h-12 bg-white/10 text-brand-secondary border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-secondary group-hover:text-slate-900 transition-all duration-500 flex-shrink-0 relative z-20">
                  {item.icon}
                </div>
                <div className="relative z-20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/80 mb-2">{item.title}</p>
                  <h3 className="text-xl font-bold text-white mb-3">{item.issue}</h3>
                  <p className="text-slate-300 font-light text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Transformation Engine - Consolidated Innovation Section */}
      <section className="py-24 bg-white relative pt-32" id="tech-engine">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none -translate-y-[calc(100%-2px)] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[100px] transform rotate-180" style={{ fill: '#ffffff' }}>
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" />
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" />
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{t("home.engine.title")}</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              {t("home.engine.desc")}
            </p>
          </motion.div>

          <div className="space-y-32">
            {/* Phase 1: AI & Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest mb-6">
                  <Database className="w-5 h-5" />
                  {t("home.engine.phase1.label")}
                </div>
                <h3 className="text-3xl font-bold mb-6 text-slate-900">{t("home.engine.phase1.title")}</h3>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  {t("home.engine.phase1.desc")}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: t("home.engine.phase1.1.title"), desc: t("home.engine.phase1.1.desc"), icon: <Bot className="w-5 h-5" /> },
                    { title: t("home.engine.phase1.2.title"), desc: t("home.engine.phase1.2.desc"), icon: <BarChart3 className="w-5 h-5" /> }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div 
                ref={solutionRef1}
                style={{ y: yImage1 }}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative group pr-8 h-full perspective-1000"
              >
                <div className="absolute -inset-16 bg-brand-secondary/20 rounded-full blur-[100px] opacity-60 animate-pulse pointer-events-none" />
                
                <motion.div 
                  initial={{ rotateX: 0, rotateY: 0 }}
                  whileHover={{ y: -10, scale: 1.05, rotateX: 5, rotateY: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative z-10"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute -inset-4 bg-slate-900 rounded-3xl -rotate-2 border border-white/10 opacity-70 shadow-2xl" style={{ transform: "translateZ(-20px)" }} />
                  <div className="absolute -inset-4 bg-brand-primary/20 rounded-3xl rotate-1 blur-2xl" style={{ transform: "translateZ(-30px)" }} />
                  
                  <div className="relative rounded-2xl overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,86,77,0.5)] border border-white/30" style={{ transform: "translateZ(20px)" }}>
                    <LazyVideo aria-label="Video presentation"  
                      key={videoMap["Connecting People & AI"]}
                      src={videoMap["Connecting People & AI"]} 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      preload="none"
                      className="w-full h-auto object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000"
                      onError={() => console.error("Error loading video: Connecting People & AI", videoMap["Connecting People & AI"])}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-brand-secondary/5 to-transparent pointer-events-none mix-blend-overlay" />
                  </div>

                  <motion.div 
                    initial={{ z: 80 }}
                    animate={{ x: [0, 5, 0], y: [0, -5, 0], z: 80 }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute -bottom-10 -right-4 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-brand-secondary/30 z-[100] flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-brand-secondary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t("home.engine.impact")}</p>
                      <p className="text-sm font-bold text-slate-900 leading-none">{t("home.engine.impact.stat")}</p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            <div className="space-y-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="inline-flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest mb-6">
                    <Cpu className="w-5 h-5" />
                    {t("home.engine.phase2.label")}
                  </div>
                  <h3 className="text-3xl font-bold mb-6 text-slate-900">{t("home.engine.phase2.title")}</h3>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    {t("home.engine.phase2.desc")}
                  </p>
                </motion.div>
                <motion.div 
                  ref={solutionRef2}
                  style={{ y: yImage2 }}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative group pr-8 perspective-1000"
                >
                  <div className="absolute -inset-8 bg-gradient-to-l from-brand-secondary/30 to-brand-primary/20 rounded-full blur-3xl opacity-60 pulse pointer-events-none" />
                  <motion.div 
                    initial={{ rotateX: 0, rotateY: 0 }}
                    whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-[0_32px_64px_-16px_rgba(0,86,77,0.5)] border border-white/20 aspect-video z-10"
                  >
                    <LazyVideo aria-label="Video presentation"  
                      key={videoMap["Modernizing Manufacturing / Warehousing"]}
                      src={videoMap["Modernizing Manufacturing / Warehousing"]} 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      preload="none"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-105"
                      onError={() => console.error("Error loading video: Modernizing Manufacturing / Warehousing", videoMap["Modernizing Manufacturing / Warehousing"])}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-brand-secondary/10 pointer-events-none mix-blend-overlay" />
                  </motion.div>
                </motion.div>
              </div>

              <div 
                className="space-y-4"
                onMouseLeave={() => !isLocked && setActiveCategory(null)}
              >
                {categories.map((cat, i) => (
                  <motion.div 
                    key={i} 
                    initial={false}
                    animate={{ 
                      scale: activeCategory === i ? 1.02 : 1,
                    }}
                    onMouseEnter={() => handleCategoryHover(i)}
                    whileHover={{ scale: activeCategory === i ? 1.02 : 1.01, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`border border-slate-200 rounded-2xl overflow-hidden bg-white transition-all duration-500 ${activeCategory === i ? 'ring-2 ring-brand-primary shadow-2xl border-transparent z-10' : 'hover:border-brand-primary/30 shadow-sm'}`}
                  >
                    <button 
                      onClick={() => handleCategoryClick(i)}
                      className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors text-left group relative outline-none"
                    >
                      <div className="flex items-center gap-8">
                        <motion.div 
                          animate={activeCategory === i ? { 
                            rotate: [0, -10, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{ duration: 0.5 }}
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeCategory === i ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/40' : 'bg-slate-100 text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary'}`}
                        >
                          {cat.icon}
                        </motion.div>
                        <div>
                          <span className={`${activeCategory === i ? 'text-brand-primary' : 'text-slate-900'} text-2xl font-bold block transition-colors group-hover:text-brand-primary tracking-tight`}>{cat.title}</span>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 block">{cat.label}</span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${activeCategory === i ? 'bg-brand-secondary border-transparent text-white rotate-180 shadow-lg' : 'bg-white border-slate-200 text-slate-400 group-hover:border-brand-secondary group-hover:text-brand-secondary'}`}>
                        <ChevronDown className="w-6 h-6" />
                      </div>
                    </button>
                    
                    {activeCategory === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="overflow-hidden bg-slate-50/50"
                      >
                        <div className="p-8 pt-0 grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-slate-100">
                          <div className="space-y-6">
                            <h4 className="text-sm font-bold text-brand-primary uppercase tracking-widest mt-6">{t("home.cat.overview")}</h4>
                            <p className="text-lg text-slate-600 font-medium leading-relaxed">{cat.desc}</p>
                            
                            <div className="mt-8">
                                <details open className="group border border-slate-200 bg-white rounded-xl overflow-hidden">
                                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors list-none">
                                    <span className="font-bold text-slate-900 text-sm">{t("home.cat.values")}</span>
                                    <Plus className="w-5 h-5 text-brand-secondary group-open:rotate-45 transition-transform" />
                                  </summary>
                                  <div className="p-4 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                                    <div className="py-4">
                                      {cat.details}
                                    </div>
                                    <div className="bg-brand-primary/5 p-4 rounded-lg">
                                       <p className="text-[10px] font-bold text-brand-primary uppercase mb-2">{t("home.cat.keyImpact")}</p>
                                       <p className="text-xs italic">{t("home.cat.keyImpactDesc")}</p>
                                    </div>
                                  </div>
                                </details>
                            </div>
                          </div>
                          <div className="relative h-64 lg:h-auto rounded-2xl overflow-hidden shadow-lg border border-slate-200 my-6 bg-slate-900">
                            <LazyVideo aria-label="Video presentation"  
                              key={videoMap[cat.videoKey]}
                              src={videoMap[cat.videoKey]} 
                              autoPlay 
                              muted 
                              loop 
                              playsInline 
                              preload="none"
                              className="w-full h-full object-cover"
                              onError={() => console.error(`Error loading video: ${cat.videoKey}`, videoMap[cat.videoKey])}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Core Pillar Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t("home.pillars.title")}</h2>
            <div className="w-20 h-1.5 bg-brand-secondary mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: t("home.pillars.1.title"), 
                icon: <Settings className="w-8 h-8" />, 
                desc: t("home.pillars.1.desc")
              },
              { 
                title: t("home.pillars.2.title"), 
                icon: <Cpu className="w-8 h-8" />, 
                desc: t("home.pillars.2.desc")
              },
              {
                title: t("home.pillars.3.title"),
                icon: <Activity className="w-8 h-8" />,
                desc: t("home.pillars.3.desc")
              },
              {
                title: t("home.pillars.4.title"),
                icon: <Users className="w-8 h-8" />,
                desc: t("home.pillars.4.desc")
              }
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="p-8 bg-slate-50 rounded-3xl border border-slate-200 hover:border-brand-secondary/50 transition-all duration-300 relative cursor-default"
              >
                <div className="w-14 h-14 bg-brand-primary text-white rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{pillar.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-32 relative overflow-hidden bg-brand-primary text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-primary/50 via-brand-primary to-slate-900 opacity-90 z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay z-0" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-24 h-24 mx-auto bg-brand-secondary/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-10 border border-brand-secondary/30 shadow-[0_0_40px_rgba(20,184,166,0.3)]"
          >
            <Handshake className="w-12 h-12 text-brand-secondary" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-8 tracking-tight"
          >
            {t("home.commit.title")}
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <Quote className="w-16 h-16 text-white/10 absolute -top-8 -left-4 transform -rotate-12" />
            <div className="text-2xl md:text-3xl text-slate-200 leading-relaxed font-light">
              <Markdown 
                components={{
                  strong({children}) {
                    return <span className="text-brand-secondary font-bold">{children}</span>;
                  }
                }}
              >
                {t("home.commit.desc1")}
              </Markdown> <br/><br/>
              <span className="font-bold text-white flex justify-center items-center relative inline-block mt-4">
                <span className="relative">
                  {t("home.commit.desc2")}
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-brand-secondary/60 -z-10 transform -rotate-1 rounded-sm" />
                </span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
