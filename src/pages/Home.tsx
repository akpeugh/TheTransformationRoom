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

import { DISCOVERY_CALL_1HR } from "../constants";

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
  "Connecting People & AI": "https://storage.googleapis.com/thetransformationroomassets/Avatar_Video.mp4",
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
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const location = useLocation();

  const { scrollY, scrollYProgress } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  
  const yBg1 = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const yBg2 = useTransform(scrollYProgress, [0, 1], [0, -500]);

  const solutionRef1 = useRef(null);
  const { scrollYProgress: scrollYProgress1 } = useScroll({ target: solutionRef1, offset: ["start end", "end start"] });
  const yImage1 = useTransform(scrollYProgress1, [0, 1], [150, -150]);

  const solutionRef2 = useRef(null);
  const { scrollYProgress: scrollYProgress2 } = useScroll({ target: solutionRef2, offset: ["start end", "end start"] });
  const yImage2 = useTransform(scrollYProgress2, [0, 1], [150, -150]);



  const categories = [
    {
      title: "Analytics",
      label: "Data & Insights",
      icon: <BarChart3 className="w-6 h-6" />,
      videoKey: "Analytics",
      desc: "Transforming raw operational data into actionable intelligence through real-time dashboards and predictive modeling.",
      details: "Implementation of edge computing data capture, custom AI-driven anomaly detection, and cross-functional reporting suites that provide a single source of truth for leadership."
    },
    {
      title: "Co-robots & Humanoid Robots",
      label: "Robotics Strategy",
      icon: <Bot className="w-6 h-6" />,
      videoKey: "Robots / Cobots",
      desc: "Deploying intelligent robotics to handle repetitive, ergonomic-straining, or hazardous tasks, allowing your human workforce to focus on high-value operations.",
      details: "Evaluation of cobot integration for assembly, deployment of humanoid robots for warehouse movement, and safety-first workspace redesign for human-machine collaboration."
    },
    {
      title: "AS/RS (Automated Storage & Retrieval)",
      label: "Space Optimization",
      icon: <Layers className="w-6 h-6" />,
      videoKey: "AS/RS",
      desc: "Maximizing vertical cube utilization and picking speed for high-density environments, specifically optimized for e-commerce and wholesale throughput.",
      details: "Selection and implementation of shuttle systems, vertical lift modules (VLMs), and mini-load systems to drive density and eliminate manual travel time."
    },
    {
      title: "Asset Tracking & AI Detection",
      label: "Digital Visibility",
      icon: <Cpu className="w-6 h-6" />,
      videoKey: "Asset Tracking",
      desc: "Total visibility across the four walls and beyond using Drones, Computer Vision, RFID, and BLE tag technology.",
      details: "Autonomous drone inventory counts, AI camera detection for safety/compliance, smart locker integrations, and real-time asset localization for high-value equipment."
    },
    {
      title: "AMRs/AGVs",
      label: "Autonomous Flow",
      icon: <Truck className="w-6 h-6" />,
      videoKey: "AMR / AGV",
      desc: "Automating horizontal movement through autonomous mobile robots for lifting, tugging, and facility maintenance.",
      details: "Fleet management for autonomous fork lifts, scrubbers, and tuggers. Path-planning optimization and integration with existing WMS for seamless task interleaving."
    },
    {
      title: "Auxiliary & Training Tools",
      label: "Workforce Enablement",
      icon: <Cpu className="w-6 h-6" />,
      videoKey: "Auxiliary / AR / VR",
      desc: "Bridging the skill gap through immersive technologies like AR/VR for training and physical exoskeletons for performance safety.",
      details: "AR-guided picking and assembly instructions, VR safety simulators, and passive/active exoskeleton rollouts to reduce work-related injury and accelerate onboarding."
    },
    {
      title: "Employee Facing Tools",
      label: "User Experience",
      icon: <Users className="w-6 h-6" />,
      videoKey: "Employee Facing Tools",
      desc: "Modernizing the workforce experience through digital tools that drive engagement, flexibility, and performance rewards.",
      details: "Development of gamification engines for productivity, mobile-first shift bidding/scheduling, and real-time performance feedback portals that boost retention."
    },
    {
      title: "Transportation & Logistics Systems",
      label: "Network Logistics",
      icon: <Truck className="w-6 h-6" />,
      videoKey: "Transportation & Logistics",
      desc: "Connecting the facility to the outside world through intelligent dispatch, driver tech, and yard management systems.",
      details: "TMS implementation, driver mobile application deployments, Yard Management System (YMS) automation and real-time bank scheduling for inbound/outbound flow."
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
      {/* Hero Content */}
      <section className="relative min-h-screen flex items-center perspective-1000 pb-20">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900 z-10" />
          <video 
            key={videoMap["Hero/Header"]}
            src={videoMap["Hero/Header"]} 
            autoPlay 
            muted 
            loop 
            playsInline 
            preload="auto"
            className="w-full h-full object-cover [mask-image:linear-gradient(to_bottom,white_60%,transparent_100%)] object-center transform scale-105"
            onError={() => console.error("Error loading video: Hero/Header", videoMap["Hero/Header"])}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-20 w-full flex flex-col items-center text-center px-4 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ y: y1 }}
            className="max-w-4xl"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-[1.1] mb-6 tracking-tighter cursor-default drop-shadow-2xl z-20 relative break-words"
              whileHover={{ scale: 1.01, rotateX: -2, rotateY: 1, textShadow: "0px 10px 30px rgba(255,255,255,0.2)" }}
            >
              The Transformation Room
            </motion.h1>
              <motion.span 
                whileHover={{ scale: 1.02, filter: "brightness(1.2)" }}
                className="text-brand-secondary font-bold tracking-widest text-lg md:text-2xl uppercase mb-8 block cursor-default transition-all duration-300 drop-shadow-md"
              >
                Turn Operational Complexity Into Scalable, High-Performing Systems
              </motion.span>
              <p className="text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed max-w-3xl mx-auto font-light drop-shadow-lg">
                We guide organizations to streamline broken processes for scale, and equip individuals with the operational acumen to thrive in a high-tech world.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/contact" className="bg-brand-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-brand-dark hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/40 relative overflow-hidden group cursor-pointer text-center">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  Start Transformation <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">We're right for you if you're dealing with:</h2>
            <div className="w-24 h-1.5 bg-brand-secondary mx-auto rounded-full" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
            {[
              {
                title: "Scale & Expansion",
                issue: "Multi-site Operations",
                desc: "Scaling warehouse or distribution networks hitting physical capacity limits.",
                icon: <Globe className="w-6 h-6" />
              },
              {
                title: "Omnichannel Fulfillment",
                issue: "Retail Stores & E-com",
                desc: "Complex inventory allocation and high-velocity order fulfillment.",
                icon: <ShoppingBag className="w-6 h-6" />
              },
              {
                title: "Data Silos",
                issue: "Disconnected Systems",
                desc: "Poor visibility across systems leading to reactive instead of proactive decisions.",
                icon: <Network className="w-6 h-6" />
              },
              {
                title: "Margin Pressure",
                issue: "Labor Inefficiencies",
                desc: "Rising operational costs and difficulty retaining skilled facility talent.",
                icon: <TrendingDown className="w-6 h-6" />
              },
              {
                title: "Outgrown Processes",
                issue: "Growth Without Structure",
                desc: "Relying on legacy 'heroics' instead of scalable, automated systems.",
                icon: <Building2 className="w-6 h-6" />
              },
              {
                title: "Individual Growth",
                issue: "Career Velocity & AI",
                desc: "Professionals looking to transition careers, master AI integration, or get a step ahead in the modern workforce.",
                icon: <Zap className="w-6 h-6" />
              }
            ].map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20, rotateX: -5 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -10, rotateX: 5, rotateY: 5, scale: 1.02 }}
                key={i} 
                className="group p-8 bg-slate-800/95 border border-white/5 rounded-3xl hover:border-brand-secondary/50 shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 relative overflow-hidden z-10 cursor-default"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/5 to-transparent pointer-events-none rounded-3xl" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 rounded-full blur-2xl group-hover:bg-brand-secondary/30 transition-all duration-500" />
                <div className="w-12 h-12 bg-white/10 text-brand-secondary border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-secondary group-hover:text-slate-900 transition-all duration-500 shadow-sm relative z-20" style={{ transform: "translateZ(20px)" }}>
                  {item.icon}
                </div>
                <div style={{ transform: "translateZ(10px)" }}>
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
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Bridging Operations & Intelligence</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Innovation is only effective when it connects. We integrate AI strategy, industrial hardware, and workforce experience into a single, high-output ecosystem.
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
                  Strategy & Intelligence
                </div>
                <h3 className="text-3xl font-bold mb-6 text-slate-900">Connecting People and AI</h3>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  We build the data frameworks and custom agents that turn raw operational data into boardroom visibility. Our approach ensures AI is a tool for your people, not a replacement for them.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "Custom Agents", desc: "Intelligent workflows for anomaly detection and scheduling.", icon: <Bot className="w-5 h-5" /> },
                    { title: "Data Pipelines", desc: "Clean, structured data for predictive analytics.", icon: <BarChart3 className="w-5 h-5" /> }
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
                    <video 
                      key={videoMap["Connecting People & AI"]}
                      src={videoMap["Connecting People & AI"]} 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      preload="metadata"
                      className="w-full h-auto object-cover transform scale-[2.2] object-center group-hover:scale-[2.4] transition-transform duration-1000"
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
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Impact</p>
                      <p className="text-sm font-bold text-slate-900 leading-none">+24% Productivity</p>
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
                    Industrial Implementation
                  </div>
                  <h3 className="text-3xl font-bold mb-6 text-slate-900">Modernizing Manufacturing & Warehousing</h3>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Working across complex supply chain networks, we help you evaluate and implement the hardware, from humanoid robotics to AS/RS, that turns bottlenecks into throughput.
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
                    <video 
                      key={videoMap["Modernizing Manufacturing / Warehousing"]}
                      src={videoMap["Modernizing Manufacturing / Warehousing"]} 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      preload="metadata"
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
                            <h4 className="text-sm font-bold text-brand-primary uppercase tracking-widest mt-6">Overview</h4>
                            <p className="text-lg text-slate-600 font-medium leading-relaxed">{cat.desc}</p>
                            
                            <div className="mt-8">
                                <details open className="group border border-slate-200 bg-white rounded-xl overflow-hidden">
                                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors list-none">
                                    <span className="font-bold text-slate-900 text-sm">Value Propositions & Use Cases</span>
                                    <Plus className="w-5 h-5 text-brand-secondary group-open:rotate-45 transition-transform" />
                                  </summary>
                                  <div className="p-4 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                                    <div className="py-4">
                                      {cat.details}
                                    </div>
                                    <div className="bg-brand-primary/5 p-4 rounded-lg">
                                       <p className="text-[10px] font-bold text-brand-primary uppercase mb-2">Key Impact</p>
                                       <p className="text-xs italic">Enhanced through-put, reduced operational drag, and measurable ROI within 12-18 months.</p>
                                    </div>
                                  </div>
                                </details>
                            </div>
                          </div>
                          <div className="relative h-64 lg:h-auto rounded-2xl overflow-hidden shadow-lg border border-slate-200 my-6 bg-slate-900">
                            <video 
                              key={videoMap[cat.videoKey]}
                              src={videoMap[cat.videoKey]} 
                              autoPlay 
                              muted 
                              loop 
                              playsInline 
                              preload="metadata"
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The Pillars of Transformation</h2>
            <div className="w-20 h-1.5 bg-brand-secondary mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: "Optimized Process", 
                icon: <Settings className="w-8 h-8" />, 
                desc: "Identifying operational inefficiencies and building practical solutions to improve how work actually gets done."
              },
              { 
                title: "Tech Strategy", 
                icon: <Cpu className="w-8 h-8" />, 
                desc: "Evaluating, integrating, and optimizing technology systems across your warehouse operations, workforce, and business functions."
              },
              {
                title: "Real-Time Insights",
                icon: <Activity className="w-8 h-8" />,
                desc: "Designing frameworks and dashboards that provide leaders with the necessary visibility to make faster decisions."
              },
              {
                title: "Workforce Alignment",
                icon: <Users className="w-8 h-8" />,
                desc: "Connecting change management, labor planning, and scheduling to ensure that high-level strategy successfully translates into action."
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
            Our Commitment
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <Quote className="w-16 h-16 text-white/10 absolute -top-8 -left-4 transform -rotate-12" />
            <p className="text-2xl md:text-3xl text-slate-200 leading-relaxed font-light">
              We operate on a <span className="text-brand-secondary font-bold">"skin-in-the-game"</span> model. Our success is measured by your satisfaction, your team's satisfaction, and your tangible ROI. <br/><br/>
              <span className="font-bold text-white flex justify-center items-center relative inline-block mt-4">
                <span className="relative">
                  If we're in the room, we're in it for the long haul.
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-brand-secondary/60 -z-10 transform -rotate-1 rounded-sm" />
                </span>
              </span>
            </p>
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default Home;
