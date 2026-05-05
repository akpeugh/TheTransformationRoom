/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  ArrowRight, 
  Settings, 
  Cpu, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Calendar, 
  Heart,
  Globe,
  Briefcase,
  User,
  Quote,
  ShieldCheck,
  Zap,
  Info,
  ChevronDown,
  ChevronsDown,
  Truck,
  Factory,
  Database,
  Bot,
  Layers,
  Handshake,
  Plus,
  FileText,
  RefreshCcw,
  Sparkles,
  ShoppingBag,
  Network,
  TrendingDown,
  Building2,
  Search,
  Map,
  Rocket,
  ArrowDown
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { ChatBot } from "./components/ChatBot";
import { ResumeOptimizer } from "./components/ResumeOptimizer";
import { ScorecardTool } from "./components/ScorecardTool";


// Constants
const BRAND_PRIMARY = "#00564d";
const SCHEDULING_30MIN = "https://calendar.app.google/V9y46Cj4VQfiizHq7";
const DISCOVERY_CALL_1HR = "https://calendar.app.google/nCiGLhG5QGHb2SqL6";
const INFO_FORM = "https://forms.gle/eVuPpQwxRzH7iUpU9";

// Components
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navBg = scrolled 
    ? "bg-white/90 backdrop-blur-2xl shadow-lg border-b border-slate-200/50 py-3" 
    : "bg-white/60 backdrop-blur-xl border-b border-white/20 py-5";
  const logoClasses = scrolled ? "scale-95" : "scale-100";
  const textClasses = "text-slate-900";
  const btnClasses = "bg-brand-primary text-white hover:bg-brand-dark";

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png" alt="The Transformation Room" referrerPolicy="no-referrer" className={`h-14 w-auto transition-all duration-300 ${logoClasses}`} />
          </Link>
          
          <div className={`hidden md:flex items-center gap-8 ${textClasses}`}>
            {['Home', 'Organizations', 'Individuals', 'About', 'Contact'].map((item) => (
              <Link 
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                className="text-sm font-bold tracking-wide hover:text-brand-secondary transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-secondary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <div className="relative group h-full flex items-center">
              <button className="text-sm font-bold tracking-wide focus:outline-none outline-none group-hover:text-brand-secondary transition-colors relative flex items-center gap-1.5 py-6 cursor-pointer">
                <Sparkles className="w-4 h-4 text-brand-secondary" />
                Tools
                <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-brand-secondary transition-transform duration-300 group-hover:-rotate-180" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-2 transform origin-top scale-95 group-hover:scale-100 transition-all duration-300">
                  <div className="flex flex-col gap-1">
                    <Link to="/organizations?tool=scorecard" className="group/item px-4 py-3 rounded-xl hover:bg-brand-primary/5 text-slate-700 text-sm font-medium flex items-center gap-3 transition-colors">
                      <div className="bg-brand-primary/10 p-2 rounded-lg group-hover/item:bg-brand-primary group-hover/item:text-white transition-colors duration-300">
                        <CheckCircle2 className="w-4 h-4 text-brand-primary group-hover/item:text-white" />
                      </div>
                      Strategic Scorecard
                    </Link>
                    <Link to="/individuals?tool=resume" className="group/item px-4 py-3 rounded-xl hover:bg-brand-primary/5 text-slate-700 text-sm font-medium flex items-center gap-3 transition-colors">
                      <div className="bg-brand-primary/10 p-2 rounded-lg group-hover/item:bg-brand-primary group-hover/item:text-white transition-colors duration-300">
                        <FileText className="w-4 h-4 text-brand-primary group-hover/item:text-white" />
                      </div>
                      Career Assessment Tool
                    </Link>
                    <button onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat'))} className="group/item text-left px-4 py-3 rounded-xl hover:bg-brand-secondary/10 text-slate-700 text-sm font-medium flex items-center gap-3 transition-colors cursor-pointer w-full">
                      <div className="bg-brand-secondary/20 p-2 rounded-lg group-hover/item:bg-brand-secondary group-hover/item:text-slate-900 transition-colors duration-300">
                        <Sparkles className="w-4 h-4 text-brand-secondary group-hover/item:text-slate-900" />
                      </div>
                      AI Guide
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Link to="/contact" className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-brand-secondary/40 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 ml-2 cursor-pointer ${btnClasses} relative overflow-hidden group/btn`}>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
              Book Assessment
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden p-2 rounded-lg transition-colors cursor-pointer ${textClasses}`}>
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden shadow-xl"
          >
            <div className="p-6 space-y-4">
              <Link to="/" className="block text-xl font-bold text-slate-900 hover:text-brand-secondary transition-colors hover:translate-x-2 duration-300" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/organizations" className="block text-xl font-bold text-slate-900 hover:text-brand-secondary transition-colors hover:translate-x-2 duration-300" onClick={() => setIsOpen(false)}>For Organizations</Link>
              <Link to="/individuals" className="block text-xl font-bold text-slate-900 hover:text-brand-secondary transition-colors hover:translate-x-2 duration-300" onClick={() => setIsOpen(false)}>For Individuals</Link>
              <Link to="/about" className="block text-xl font-bold text-slate-900 hover:text-brand-secondary transition-colors hover:translate-x-2 duration-300" onClick={() => setIsOpen(false)}>About</Link>
              <Link to="/contact" className="block text-xl font-bold text-slate-900 hover:text-brand-secondary transition-colors hover:translate-x-2 duration-300" onClick={() => setIsOpen(false)}>Contact</Link>
              <div className="h-px w-full bg-slate-100 my-4" />
              <Link to="/organizations?tool=scorecard" className="block text-lg font-medium text-slate-600 hover:text-brand-primary flex items-center gap-3 transition-colors hover:translate-x-2 duration-300" onClick={() => setIsOpen(false)}>
                <div className="bg-brand-primary/10 p-2 rounded-lg"><CheckCircle2 className="w-4 h-4 text-brand-primary"/></div> Strategic Scorecard
              </Link>
              <Link to="/individuals?tool=resume" className="block text-lg font-medium text-slate-600 hover:text-brand-primary flex items-center gap-3 transition-colors hover:translate-x-2 duration-300" onClick={() => setIsOpen(false)}>
                <div className="bg-brand-primary/10 p-2 rounded-lg"><FileText className="w-4 h-4 text-brand-primary"/></div> Career Assessment Tool
              </Link>
              <Link to="/contact" className="block bg-brand-primary text-white px-6 py-4 rounded-xl mt-4 text-center font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark hover:-translate-y-1 transition-all" onClick={() => setIsOpen(false)}>Book a Call</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="space-y-4">
        <img src="https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png" alt="The Transformation Room" referrerPolicy="no-referrer" className="h-16 w-auto brightness-0 invert" />
        <p className="text-slate-400 text-sm">Operations. Technology. People. Built to Work Together.</p>
        <div className="flex items-center gap-4 text-slate-400">
          {/* Social icons placeholder */}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-6">Services</h4>
        <ul className="space-y-4 text-sm text-slate-400">
          <li><Link to="/organizations" className="hover:text-white transition-colors">Operations Optimization</Link></li>
          <li><Link to="/organizations" className="hover:text-white transition-colors">Technology Strategy</Link></li>
          <li><Link to="/organizations" className="hover:text-white transition-colors">Workforce Alignment</Link></li>
          <li><Link to="/individuals" className="hover:text-white transition-colors">Career Coaching</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-6">Company</h4>
        <ul className="space-y-4 text-sm text-slate-400">
          <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
          <li><Link to="/testimonials" className="hover:text-white transition-colors">Success Stories</Link></li>
          <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          <li><a href="#" className="hover:text-white transition-colors">Donation Center</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-6">Contact</h4>
        <p className="text-sm text-slate-400 mb-2">(717) 461-5402</p>
        <p className="text-sm text-slate-400">Transformation Room</p>
        <div className="mt-6 flex flex-col gap-3">
          <a href={DISCOVERY_CALL_1HR} className="text-xs bg-brand-primary/20 text-brand-secondary border border-brand-secondary/30 px-3 py-2 rounded-md text-center hover:bg-brand-primary/30 transition-all">Free Discovery Call</a>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} The Transformation Room. All rights reserved.
    </div>
  </footer>
);

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
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const location = useLocation();

  const { scrollY, scrollYProgress } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity1 = useTransform(scrollY, [0, 500], [1, 0]);
  const scale1 = useTransform(scrollY, [0, 1000], [1.05, 1.2]);
  
  const yBg1 = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const yBg2 = useTransform(scrollYProgress, [0, 1], [0, -500]);

  const solutionRef1 = useRef(null);
  const { scrollYProgress: scrollYProgress1 } = useScroll({ target: solutionRef1, offset: ["start end", "end start"] });
  const yImage1 = useTransform(scrollYProgress1, [0, 1], [150, -150]);

  const solutionRef2 = useRef(null);
  const { scrollYProgress: scrollYProgress2 } = useScroll({ target: solutionRef2, offset: ["start end", "end start"] });
  const yImage2 = useTransform(scrollYProgress2, [0, 1], [150, -150]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tool') === 'scorecard') {
      setTimeout(() => {
        document.getElementById('strategic-scorecard-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [location.search]);

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
          <motion.video 
            key={videoMap["Hero/Header"]}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 30, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
            src={videoMap["Hero/Header"]} 
            autoPlay 
            muted 
            loop 
            playsInline 
            preload="metadata"
            className="w-full h-full object-cover [mask-image:linear-gradient(to_bottom,white_60%,transparent_100%)]"
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
                className="text-5xl md:text-8xl lg:text-9xl font-bold text-white leading-[1.1] mb-6 tracking-tighter cursor-default drop-shadow-2xl z-20 relative"
                whileHover={{ scale: 1.02, rotateX: -5, rotateY: 2, textShadow: "0px 10px 30px rgba(255,255,255,0.2)" }}
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
                <a href={DISCOVERY_CALL_1HR} className="bg-brand-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-brand-dark hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/40 relative overflow-hidden group cursor-pointer">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  Start Your Transformation <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat', { detail: { prompt: "How can The Transformation Room help modernize my supply chain operations?" } }))}
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 hover:border-white/40 shadow-lg shadow-black/20 hover:shadow-black/40 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  Ask the Guide <Sparkles className="w-5 h-5 text-brand-secondary group-hover:rotate-12 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            style={{ opacity: opacity1 }}
            onClick={() => document.getElementById('tech-engine')?.scrollIntoView({ behavior: 'smooth' })}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 animate-bounce cursor-pointer hover:text-white transition-colors duration-300 z-30"
          >
            <ChevronsDown className="w-8 h-8 text-brand-secondary/80 drop-shadow-lg" />
          </motion.div>

          {/* Tech Grid Transition */}
          <div className="absolute bottom-0 left-0 w-full h-64 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_top,black,transparent)] z-10 pointer-events-none opacity-40"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-brand-secondary/10 blur-[50px] z-20 pointer-events-none"></div>

        </section>

        {/* WHO WE WORK WITH */}
        <section className="pt-24 pb-32 relative overflow-hidden perspective-1000 bg-transparent">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,black_40%,transparent)] -z-10 pointer-events-none opacity-40"></div>
          
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
                  title: "Skill & Tech Transition",
                  issue: "Individuals Expanding Scope",
                  desc: "Professionals looking to leverage AI in their lives, expand their operational scope, or transition industries and careers.",
                  icon: <User className="w-6 h-6" />
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
      <section className="py-24 bg-white border-b border-slate-200 relative pt-32" id="tech-engine">
        {/* Seamless transition from the dark section above using an SVG wave */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none -translate-y-full z-10">
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
                  {/* Stylized background frame */}
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
                      className="w-full h-auto object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000"
                      onError={() => console.error("Error loading video: Connecting People & AI", videoMap["Connecting People & AI"])}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-brand-secondary/5 to-transparent pointer-events-none mix-blend-overlay" />
                  </div>

                  {/* Floating Data Badge */}
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

            {/* Phase 2: Industrial Systems & Advanced Categories */}
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

              {/* New Detailed Categories Accordion */}
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
                            
                            {/* Inner Collapsible for Value/Use Cases */}
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

      {/* Core Pillar Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The Four Pillars of Transformation</h2>
            <div className="w-20 h-1.5 bg-brand-secondary mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-1000">
            {[
              { 
                title: "Optimized Process", 
                icon: <Settings className="w-8 h-8" />, 
                desc: "We identify inefficiencies and build practical ways to improve how work actually gets done."
              },
              { 
                title: "Tech Strategy", 
                icon: <Cpu className="w-8 h-8" />, 
                desc: "Evaluate, integrate, and optimize systems across warehouse, workforce, and business functions."
              },
              { 
                title: "Real-Time Insights", 
                icon: <BarChart3 className="w-8 h-8" />, 
                desc: "Design dashboards and frameworks that give leaders the visibility they need to decide faster."
              },
              { 
                title: "Workforce Alignment", 
                icon: <Users className="w-8 h-8" />, 
                desc: "Connect labor planning, scheduling, and change management so strategy turns into action."
              }
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20, rotateX: 5 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.05, rotateX: 5, rotateY: 5, boxShadow: "0px 20px 40px rgba(0,0,0,0.1)" }}
                style={{ transformStyle: "preserve-3d" }}
                className="p-8 bg-white rounded-3xl border border-slate-200 hover:border-brand-secondary/50 transition-colors duration-500 z-10 relative cursor-default"
              >
                <div className="w-14 h-14 bg-brand-primary text-white rounded-xl flex items-center justify-center mb-6 shadow-lg" style={{ transform: "translateZ(20px)" }}>
                  {pillar.icon}
                </div>
                <div style={{ transform: "translateZ(10px)" }}>
                  <h3 className="text-xl font-bold mb-4">{pillar.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scorecard moved to Organizations */}
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

const Organizations = () => {
  const [activeChallenge, setActiveChallenge] = useState<number | null>(0);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tool') === 'scorecard') {
      setTimeout(() => {
        document.getElementById('strategic-scorecard-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [location.search]);

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 800], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0]);

  const challenges = [
    {
      title: "Capacity & Throughput",
      issue: "Operations hitting physical limits or seasonal bottlenecks.",
      solution: "Space optimization through AS/RS and intelligent slotting strategies.",
      outcome: "2.5x increase in vertical cube use."
    },
    {
      title: "Labor Instability",
      issue: "High turnover and skill gaps in critical facility roles.",
      solution: "Workforce enablement via AR/VR training and ergonomic robotics.",
      outcome: "40% reduction in training ramp-up time."
    },
    {
      title: "Hidden Inefficiency",
      issue: "Fragmented systems creating 'dark data' and blind spots.",
      solution: "Unified digital visibility and predictive ROI dashboarding.",
      outcome: "15% reduction in OpEx through data-driven decisions."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      <header className="relative py-40 bg-brand-primary overflow-hidden perspective-1000">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 bg-brand-dark/40 z-10" />
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000" 
            alt="Logistics Facility" 
            className="w-full h-full object-cover opacity-60 scale-105"
          />
        </motion.div>
        
        {/* Floating Corporate Tech Nodes */}
        <motion.div style={{ y: yHero }} className="absolute inset-0 pointer-events-none z-20">
          {[
            { icon: <Briefcase className="w-6 h-6" />, pos: "top-[15%] left-[10%]", label: "Strategy" },
            { icon: <Database className="w-6 h-6" />, pos: "bottom-[20%] right-[15%]", label: "Data Architecture" },
            { icon: <Settings className="w-6 h-6" />, pos: "top-[65%] left-[5%]", label: "Industrial Ops" },
            { icon: <Sparkles className="w-6 h-6" />, pos: "top-[25%] right-[10%]", label: "AI Integration" }
          ].map((node, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -30, 0],
                rotateX: [0, 10, 0],
                rotateY: [0, -10, 0],
                opacity: [0.4, 0.9, 0.4]
              }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute ${node.pos} hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl z-30`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="text-brand-secondary" style={{ transform: "translateZ(20px)" }}>{node.icon}</div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest" style={{ transform: "translateZ(10px)" }}>{node.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 relative z-30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20, rotateY: 5 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-brand-secondary font-bold tracking-widest text-xs uppercase mb-6 block border-l-2 border-brand-secondary pl-4 drop-shadow-md">FOR CORPORATE ENTITIES</span>
              <motion.h1 
                className="text-6xl md:text-8xl font-bold text-white mb-8 leading-[0.9] tracking-tighter drop-shadow-2xl"
                whileHover={{ rotateX: 5, rotateY: -5, textShadow: "0px 10px 30px rgba(255,255,255,0.2)" }}
              >
                Operational <br /><span className="text-brand-secondary">Excellence.</span>
              </motion.h1>
              <p className="text-xl text-slate-300 max-w-xl leading-relaxed font-light drop-shadow-lg">
                We empower middle-market to enterprise leaders to outgrow operational complexity. Our approach merges industrial systems with cognitive strategy.
              </p>
              
              <div className="mt-12 flex flex-wrap gap-10">
                {[
                  { val: "22%+", label: "Efficiency Lift" },
                  { val: "3.5x", label: "Throughput ROI" },
                  { val: "15%", label: "Retention Bonus" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.1, originX: 0 }}
                  >
                    <p className="text-4xl font-bold text-white mb-1 drop-shadow-md text-shine">{stat.val}</p>
                    <p className="text-[10px] text-brand-secondary uppercase font-black tracking-widest">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.9, rotateX: -5 }}
               animate={{ opacity: 1, scale: 1, rotateX: 0 }}
               whileHover={{ rotateY: -3, rotateX: 3, scale: 1.02 }}
               transition={{ duration: 0.8 }}
               className="bg-white/10 backdrop-blur-3xl border border-white/20 p-10 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] transform-gpu hover:shadow-[0_60px_100px_rgba(0,0,0,0.6)]"
               style={{ transformStyle: "preserve-3d" }}
            >
                <h3 className="text-2xl font-bold text-white mb-8" style={{ transform: "translateZ(30px)" }}>Identify Your Biggest Bottleneck</h3>
                <div className="space-y-4" style={{ transform: "translateZ(20px)" }}>
                  {challenges.map((challenge, i) => (
                    <button
                      key={i}
                      onMouseEnter={() => setActiveChallenge(i)}
                      className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 transform-gpu ${
                        activeChallenge === i 
                          ? 'bg-brand-secondary border-brand-secondary text-slate-900 shadow-[0_20px_40px_rgba(20,184,166,0.3)] scale-105 z-10 relative' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">{challenge.title}</span>
                        {activeChallenge === i && <ArrowRight className="w-5 h-5" />}
                      </div>
                      <AnimatePresence mode="popLayout">
                        {activeChallenge === i && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="text-sm font-medium mb-1 opacity-90">{challenge.issue}</p>
                            <p className="text-xs font-bold uppercase tracking-widest mt-3 opacity-60">Success Metric: {challenge.outcome}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                   ))}
                </div>
                <div className="mt-8 border-t border-white/10 pt-8" style={{ transform: "translateZ(30px)" }}>
                   <p className="text-slate-300 text-sm mb-4 font-medium text-center">Ready to see where your operation stands?</p>
                   <button 
                     onClick={() => document.getElementById('strategic-scorecard-section')?.scrollIntoView({ behavior: 'smooth' })}
                     className="w-full bg-brand-secondary text-slate-900 hover:bg-white hover:text-brand-dark px-8 py-5 rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.6)] hover:-translate-y-1 flex items-center justify-center gap-3 text-lg leading-none group cursor-pointer"
                   >
                     Take our assessment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Tiered Offerings Section */}
      <section className="py-32 relative bg-slate-900 border-t border-slate-800 overflow-hidden">
        {/* Deep graphical background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/40 via-slate-900 to-slate-900 z-0" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-secondary/10 blur-[150px] -translate-y-1/2 z-0" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-brand-primary/20 blur-[150px] translate-y-1/2 z-0" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0" />

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Service Integration Models</h2>
            <div className="w-24 h-1.5 bg-brand-secondary mx-auto mb-8 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.6)]" />
            <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
              Scalable transformation paths designed to meet you where your operation is today, while preparing you for where it will be tomorrow.
            </p>
          </div>

          {/* New 3 Ways / Flow Section */}
          <div className="mb-32 relative z-10 bg-slate-800/80 border border-slate-700/50 rounded-[3rem] p-12 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 blur-[100px] pointer-events-none" />
            <h3 className="text-4xl font-bold text-white mb-6 text-center tracking-tight">3 Ways We Work With You</h3>
            <p className="text-slate-300 text-center mb-16 max-w-2xl mx-auto text-lg font-light">Our engagement models are designed to flex with your current organizational maturity.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative perspective-1000">
               {[
                 { title: "Clarity", desc: "Identify gaps and opportunities before investing cap-ex.", detail: "Deep-dive assessments of current processes and bottlenecks.", icon: <Search className="w-6 h-6" /> },
                 { title: "Strategy", desc: "Build a structured roadmap for technological integration.", detail: "A detailed blueprint mapping workforce, software, and hardware.", icon: <Map className="w-6 h-6" /> },
                 { title: "Execution", desc: "Drive implementation, adoption, and sustained results.", detail: "Hands-on project management to ensure successful go-live.", icon: <Rocket className="w-6 h-6" /> }
               ].map((way, idx) => (
                 <motion.div 
                    key={idx} 
                    initial={{ rotateX: 0, rotateY: 0 }}
                    whileHover={{ y: -10, rotateX: 5, rotateY: -5, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="bg-slate-900/60 rounded-3xl p-8 border border-white/10 hover:border-brand-secondary/50 hover:bg-slate-900/80 transition-all duration-300 group relative z-10"
                 >
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                    <div className="w-14 h-14 bg-brand-primary/20 border border-brand-primary/30 rounded-2xl flex items-center justify-center mb-6 text-brand-secondary group-hover:scale-110 group-hover:bg-brand-primary group-hover:border-brand-secondary group-hover:text-white transition-all duration-500 shadow-lg">
                      {way.icon}
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm font-mono text-brand-secondary font-bold tracking-widest block group-hover:text-white transition-colors">0{idx + 1}</span>
                      <h4 className="text-2xl font-bold text-white tracking-tight">{way.title}</h4>
                    </div>
                    <p className="text-slate-300 mb-4 font-medium text-lg">{way.desc}</p>
                    <p className="text-slate-500 text-sm leading-relaxed">{way.detail}</p>
                 </motion.div>
               ))}
            </div>

            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">The Transformation Flow</h3>
              <p className="text-lg text-slate-400 font-light max-w-xl mx-auto">Our proven five-step methodology for driving lasting change.</p>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative">
              <div className="absolute top-1/2 left-[10%] w-[80%] h-1 bg-slate-800 -translate-y-1/2 rounded-full hidden lg:block" />
              {[
                { step: "Assess", icon: <Database className="w-6 h-6" /> },
                { step: "Align", icon: <Users className="w-6 h-6" /> },
                { step: "Build", icon: <Settings className="w-6 h-6" /> },
                { step: "Execute", icon: <Zap className="w-6 h-6" /> },
                { step: "Sustain", icon: <RefreshCcw className="w-6 h-6" /> }
              ].map((flow, idx, arr) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="flex flex-col items-center gap-5 w-full flex-1 relative z-10"
                >
                  <div className="bg-slate-900 border-2 border-brand-primary text-white w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.1)] hover:shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:border-brand-secondary hover:scale-110 transition-all duration-300 group cursor-default">
                    <div className="text-brand-secondary group-hover:scale-125 transition-transform duration-300">
                      {flow.icon}
                    </div>
                  </div>
                  <span className="font-bold text-white tracking-widest uppercase text-sm mt-2">{flow.step}</span>
                  {idx < arr.length - 1 && (
                     <div className="lg:hidden flex items-center justify-center mt-4">
                       <ChevronDown className="w-6 h-6 text-brand-secondary animate-bounce" />
                     </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 perspective-1000">
          {[
            {
              tier: "Tier 1: Foundation",
              subtitle: "The Maturity Baseline",
              price: "Assessment Focused",
              icon: <Factory className="w-10 h-10" />,
              includes: [
                "Technical Debt & Systems Audit",
                "Workflow & Bottleneck Analysis",
                "Data Visibility & KPI Health Check",
                "Manual Work Identification Report"
              ],
              outcome: "Strategic Blueprint & Priority Roadmap",
              cta: "Start Your Audit"
            },
            {
              tier: "Tier 2: Strategy",
              subtitle: "The Operational Blueprint",
              price: "Design & Roadmap",
              icon: <Layers className="w-10 h-10" />,
              includes: [
                "Full Solution Architecture Design",
                "Technology Selection & RFP Support",
                "Labor Optimization Strategy",
                "Financial Projection & ROI Modeling"
              ],
              outcome: "Validated Strategy with Defined ROI Metrics",
              cta: "Build Your Roadmap"
            },
            {
              tier: "Tier 3: Premium",
              subtitle: "Active Implementation",
              price: "Execution Advisory",
              icon: <Briefcase className="w-10 h-10" />,
              includes: [
                "Program & Project Management",
                "Vendor Management & Deployment",
                "Change Management & Training",
                "Continuous Optimization Advisory"
              ],
              outcome: "Lighthouse Facility with Scaling Model",
              cta: "Execute at Scale"
            }
          ].map((pkg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30, rotateX: 5 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -20, rotateX: 5, rotateY: 5, scale: 1.02 }}
              style={{ transformStyle: "preserve-3d" }}
              className="group relative bg-slate-800/50 backdrop-blur-md rounded-[3rem] p-10 border border-slate-700 hover:border-brand-secondary shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(20,184,166,0.2)] transition-all duration-500 overflow-hidden flex flex-col h-full cursor-default"
            >
              <div className="absolute top-0 right-0 p-8 w-48 h-48 bg-brand-secondary/5 rounded-full blur-3xl group-hover:bg-brand-secondary/20 transition-all duration-500" />
              
              <div className="relative z-10 mb-8 flex items-center justify-between">
                <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center text-brand-secondary border border-slate-600 shadow-inner group-hover:scale-110 group-hover:bg-brand-primary transition-all duration-500 shrink-0">
                  {pkg.icon}
                </div>
                <div className="text-right">
                  <p className="text-brand-secondary font-bold text-xs uppercase tracking-[0.2em]">{pkg.price}</p>
                </div>
              </div>
              
              <div className="relative z-10 mb-8 flex-grow-0">
                <h3 className="text-3xl font-bold mb-2 text-white group-hover:text-brand-secondary transition-colors">{pkg.tier}</h3>
                <p className="text-slate-400 font-medium text-xs font-bold uppercase tracking-[0.2em]">{pkg.subtitle}</p>
              </div>
              
              <div className="w-12 h-1 bg-brand-secondary mb-8 relative z-10" />

              <div className="mb-10 flex-grow relative z-10">
                <p className="text-[10px] font-bold text-white mb-6 uppercase tracking-widest opacity-80">Scope Included</p>
                <ul className="space-y-4">
                  {pkg.includes.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-slate-300 group-hover:text-slate-200 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-brand-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" />
                      </div>
                      <span className="leading-snug text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto relative z-10">
                <div className="p-5 bg-black/40 rounded-2xl border border-white/5 mb-8 group-hover:border-brand-primary/20 transition-colors">
                  <p className="text-[10px] uppercase tracking-widest text-brand-primary font-black mb-1">The Deliverable</p>
                  <p className="font-semibold text-brand-secondary leading-tight text-sm">{pkg.outcome}</p>
                </div>
                <a href={DISCOVERY_CALL_1HR} className="text-center w-full block bg-brand-primary text-white hover:bg-brand-secondary hover:text-brand-dark py-4 rounded-xl font-bold transition-all shadow-lg border border-transparent group-hover:border-transparent active:scale-95">
                  {pkg.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        
          {/* Interactive ROI / Transformation Scorecard */}
          <ScorecardTool />

        </div>
      </section>
    </div>
  );
};

const Individuals = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const location = useLocation();

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 800], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tool') === 'resume') {
      setShowOptimizer(true);
      // scroll to tool section
      setTimeout(() => {
        document.getElementById('resume-optimizer-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [location.search]);

  const stages = [
    {
      title: "Resume & Positioning",
      focus: "Narrative Architecture",
      desc: "Turn your experience into a clear, compelling story that aligns with how companies actually evaluate candidates.",
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: "Job Search Strategy",
      focus: "Direction & Focus",
      desc: "Define your direction and approach your job search with focus, intention, and agentic search tools.",
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: "Interview & Offer Support",
      focus: "Authority & Value",
      desc: "Communicate your value clearly, perform with confidence, and navigate offers strategically with AI-driven prep.",
      icon: <Briefcase className="w-6 h-6" />
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      <header className="relative py-40 bg-slate-900 overflow-hidden perspective-1000">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 bg-brand-dark/50 mix-blend-overlay z-10" />
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 opacity-40 scale-105">
          <img 
            src="https://images.unsplash.com/photo-1552581230-c01374138763?auto=format&fit=crop&q=80&w=2000" 
            alt="Career Transformation" 
            className="w-full h-full object-cover mix-blend-luminosity"
          />
        </motion.div>
        
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-brand-secondary/20 to-transparent z-10 skew-x-12 translate-x-1/2 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 relative z-30 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
               initial={{ opacity: 0, x: -20, rotateY: 5 }}
               animate={{ opacity: 1, x: 0, rotateY: 0 }}
               transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-secondary/10 border border-brand-secondary/30 rounded-full text-brand-secondary text-[10px] uppercase font-bold tracking-[0.2em] mb-10 backdrop-blur-sm self-start drop-shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                TECH-ENABLED CAREER COACHING
              </div>
              <motion.h1 
                className="text-6xl md:text-8xl font-bold mb-8 leading-[0.9] tracking-tighter drop-shadow-2xl"
                whileHover={{ rotateX: 5, rotateY: -5, textShadow: "0px 10px 30px rgba(255,255,255,0.2)" }}
              >
                Engineer Your <br />
                <span className="text-brand-secondary font-mono tracking-tighter text-shine">Authority.</span>
              </motion.h1>
              <motion.div 
                whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
                className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-[2rem] backdrop-blur-xl mb-12 relative overflow-hidden group shadow-2xl transform-gpu"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 rounded-full blur-3xl group-hover:bg-brand-secondary/30 transition-all duration-700" />
                <div className="flex gap-4 items-start relative z-10" style={{ transform: "translateZ(20px)" }}>
                  <div className="w-1 absolute left-0 top-0 bottom-0 bg-gradient-to-b from-brand-secondary to-transparent rounded-full" />
                  <div className="pl-6">
                    <p className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
                      <span className="text-brand-secondary">Positioning</span> is your competitive edge.
                    </p>
                    <p className="text-lg opacity-90 leading-relaxed text-slate-300 font-light">
                      We synchronize elite executive coaching with <span className="text-white font-semibold px-2 py-0.5 bg-brand-secondary/20 rounded-md">practical tech education</span> to teach you how to leverage AI tools (like personal branding, process automation) to master the modern room.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                 <a href={INFO_FORM} className="bg-brand-secondary text-brand-dark px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-xl shadow-brand-secondary/20 flex items-center justify-center gap-2">
                    Start Your Path <ArrowRight className="w-5 h-5" />
                 </a>
                 <button 
                  onClick={() => {
                    setShowOptimizer(true);
                    setTimeout(() => {
                      document.getElementById('resume-optimizer-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-10 py-5 rounded-full font-bold text-lg border border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2 group cursor-pointer"
                 >
                    Try our Interactive Tool <Bot className="w-5 h-5 text-brand-secondary group-hover:rotate-12 transition-transform" />
                 </button>
              </div>
            </motion.div>

            <div className="relative hidden lg:block">
               <div className="absolute inset-0 bg-brand-secondary/10 blur-[100px] rounded-full" />
               <div className="relative grid grid-cols-1 gap-6">
                 {stages.map((stage, i) => (
                    <motion.div
                      key={i}
                      onMouseEnter={() => setActiveStage(i)}
                      animate={{ 
                        opacity: activeStage === i ? 1 : 0.6,
                        x: activeStage === i ? 20 : 0,
                        scale: activeStage === i ? 1.05 : 1
                      }}
                      className={`p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border transition-all cursor-default ${
                        activeStage === i ? 'border-brand-secondary shadow-2xl' : 'border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-brand-secondary bg-brand-secondary/10 transition-all ${activeStage === i ? 'scale-110 rotate-3' : ''}`}>
                          {stage.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{stage.title}</h3>
                          <p className="text-[10px] text-brand-secondary font-black uppercase tracking-widest">{stage.focus}</p>
                        </div>
                      </div>
                      <AnimatePresence>
                        {activeStage === i && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 text-sm text-slate-300 font-light leading-relaxed pr-8"
                          >
                            <p>{stage.desc}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                 ))}
               </div>
            </div>
          </div>
        </div>
        {/* Seamless transition curve/gradient */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-40" />
      </header>

      {/* Package Section */}
      <section className="py-32 max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Packages Offered</h2>
          <div className="w-24 h-1.5 bg-brand-secondary mx-auto mb-8 rounded-full" />
          <p className="text-slate-500 text-lg">Tailored to you at a price you can afford.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {[
            {
              tier: "Foundation",
              subtitle: "Resume & Positioning",
              price: "Package 1",
              bestFor: "Professionals who need their resume and LinkedIn to sound stronger and more strategic.",
              includes: [
                "Review of current resume & LinkedIn",
                "Identification of experience gaps",
                "Reframing accomplishments into impact",
                "Keyword & AI role-alignment review",
                "Positioning strategy documentation"
              ],
              outcome: "Clear summary of what is/isn't working and prioritized updates for clarity.",
              cta: "Launch Foundation"
            },
            {
              tier: "Strategy",
              subtitle: "Job Search Orchestration",
              price: "Package 2",
              bestFor: "Career changers or anyone feeling stuck in the current job market.",
              includes: [
                "All Foundation Services plus:",
                "Review of target roles & industries",
                "Evaluation of current application approach",
                "Networking & AI outreach logic",
                "Transferable skills mapping"
              ],
              outcome: "A focused plan with prioritized targets instead of applying randomly.",
              cta: "Build Strategy"
            },
            {
              tier: "Premium",
              subtitle: "Authority & Negotiation",
              price: "Package 3",
              bestFor: "Candidates preparing for major opportunities or evaluating complex offers.",
              includes: [
                "All of the Above plus:",
                "Practical AI Interview Tools",
                "Support translating background to ROI",
                "Compensation & Offer evaluation",
                "Executive confidence & communication coaching"
              ],
              outcome: "Increased confidence and support evaluating offers, pay, and next steps.",
              cta: "Master Premium"
            },
            {
              tier: "AI 101 Labs",
              subtitle: "Tech Literacy Journey",
              price: "On-Demand",
              bestFor: "Professionals wanting to better understand tech and how to get started easily.",
              includes: [
                "Intro to modern AI tools (ChatGPT, etc.)",
                "Automating daily tasks & productivity",
                "Personal branding tech stack",
                "Building simple generative workflows",
                "Overcoming technology anxiety"
              ],
              outcome: "Confidence integrating tech into your daily life and career to save time.",
              cta: "Start AI Journey"
            }
          ].map((pkg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30, rotateX: 5 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -15, scale: 1.05, rotateX: 5, rotateY: 3, boxShadow: "0px 20px 40px rgba(0,0,0,0.15)" }}
              style={{ transformStyle: "preserve-3d" }}
              className="group bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-200 flex flex-col hover:border-brand-secondary/50 shadow-sm transition-all duration-500 relative z-10"
            >
              <div className="relative mb-10">
                <p className="text-brand-secondary font-bold text-xs uppercase tracking-[0.2em] mb-2">{pkg.price}</p>
                <h3 className="text-3xl font-black mb-1 uppercase tracking-tighter">{pkg.tier}</h3>
                <p className="text-slate-500 text-sm mb-6 font-medium border-l-2 border-brand-secondary/30 pl-4">{pkg.subtitle}</p>
              </div>
              
              <div className="flex-grow">
                <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black mb-2 uppercase tracking-widest text-slate-400">Best For</p>
                   <p className="text-xs text-slate-600 italic font-medium leading-relaxed">{pkg.bestFor}</p>
                </div>

                <p className="text-[10px] font-black mb-4 uppercase tracking-widest text-brand-primary">Inclusions</p>
                <ul className="space-y-4 mb-10">
                  {pkg.includes.map((item, j) => (
                    <li key={j} className="flex gap-4 text-sm font-medium text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-brand-secondary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="p-6 bg-brand-primary/5 rounded-[2rem] border border-brand-primary/10 mb-10">
                  <p className="text-[10px] font-black mb-1 uppercase tracking-widest text-brand-primary">Outcome</p>
                  <p className="text-sm font-bold text-slate-900">{pkg.outcome}</p>
                </div>
              </div>
              
              <a href={INFO_FORM} className="block text-center w-full bg-brand-primary text-white py-5 rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-lg active:scale-95">
                Apply for {pkg.tier}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Specialized Support Section */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent z-10" />
        <div className="max-w-7xl mx-auto px-4 relative z-20">
           <div className="text-center mb-20 text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Specialized Support</h2>
              <div className="w-24 h-1.5 bg-brand-secondary mx-auto mb-8 rounded-full" />
              <p className="text-slate-400 max-w-2xl mx-auto">Where we thrive: Navigating complex and non-linear paths.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Career Transitions", desc: "Industry or role changes with zero friction.", icon: <RefreshCcw className="w-5 h-5" /> },
                { title: "Exec Promotions", desc: "Positioning for senior leadership & board roles.", icon: <ShieldCheck className="w-5 h-5" /> },
                { title: "Breaking In", desc: "Entering high-tech industries for the first time.", icon: <Sparkles className="w-5 h-5" /> },
                { title: "Re-entry", desc: "Re-entering the workforce after a gap with authority.", icon: <ShieldCheck className="w-5 h-5" /> },
                { title: "Visibility", desc: "Personal branding for LinkedIn and industry forums.", icon: <User className="w-5 h-5" /> },
                { title: "Negotiation", desc: "Offer evaluation and total compensation strategy.", icon: <ArrowRight className="w-5 h-5" /> },
                { title: "Communication", desc: "Strengthening confidence and interview presence.", icon: <Layers className="w-5 h-5" /> },
                { title: "Non-Linear Paths", desc: "Narratives for professionals with diverse backgrounds.", icon: <Bot className="w-5 h-5" /> }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                   <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mb-6 group-hover:scale-110 transition-transform">
                      {item.icon}
                   </div>
                   <h4 className="text-white font-bold mb-2">{item.title}</h4>
                   <p className="text-xs text-slate-400 leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent z-10" />
      </section>

      {/* AI Resume Feature Section */}
      <section className="py-32 max-w-7xl mx-auto px-4" id="resume-optimizer-section">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-primary rounded-[4rem] -rotate-1 scale-105 opacity-5" />
          <div className="relative bg-white border border-slate-200 rounded-[3rem] p-8 md:p-16 overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -skew-x-12 translate-x-1/4 z-0" />
             
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                <div className="lg:col-span-5">
                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-secondary/10 text-brand-secondary rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                     <Sparkles className="w-4 h-4" /> Free Community Tool
                   </div>
                   <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight tracking-tighter">Discover Your Next <br /><span className="text-brand-primary">Career Move.</span></h2>
                   <p className="text-lg text-slate-500 mb-10 leading-relaxed font-light">
                     Transitioning to high-tech operations requires the right direction and presentation. Our AI-driven tool acts as your career copilot—helping you discover the best roles based on your behavioral traits, or optimizing your current resume for the next generation of logistics.
                   </p>
                   <div className="flex flex-col sm:flex-row gap-6">
                      <button 
                        onClick={() => setShowOptimizer(true)}
                        className="bg-brand-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-95 cursor-pointer"
                      >
                         Launch Tool <Sparkles className="w-5 h-5 text-brand-secondary group-hover:rotate-12 transition-transform" />
                      </button>
                      <div className="flex -space-x-3 items-center">
                         {[1,2,3,4].map(i => (
                           <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200 shrink-0">
                              <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                           </div>
                         ))}
                         <span className="pl-6 text-xs text-slate-400 font-medium">Joined by 1,200+ professionals</span>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-7 relative group">
                   <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary/20 to-brand-primary/20 blur-[50px] rounded-full scale-90 z-0" />
                   
                   <div className="bg-slate-900 rounded-[2rem] border border-slate-700/50 overflow-hidden shadow-2xl relative z-10">
                     {/* Window Header */}
                     <div className="h-10 border-b border-white/5 bg-slate-800/80 flex items-center px-4 gap-2 backdrop-blur-md">
                       <div className="flex gap-1.5">
                         <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                         <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                         <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                       </div>
                       <div className="mx-auto flex bg-black/30 px-12 py-1 rounded-md border border-white/5 items-center gap-2">
                         <ShieldCheck className="w-3 h-3 text-emerald-500" />
                         <span className="text-[10px] text-slate-400 font-mono">career-tool.transformationroom.com</span>
                       </div>
                     </div>

                     <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                       {/* Scanner overlay */}
                       <motion.div 
                         initial={{ left: "-20%" }}
                         animate={{ left: "120%" }}
                         transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                         className="absolute top-0 bottom-0 w-[2px] bg-brand-secondary shadow-[0_0_25px_4px_rgba(20,184,166,0.8)] z-30 pointer-events-none hidden sm:block"
                       />

                       {/* Input Side */}
                       <div className="space-y-3 relative z-10">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Original Input</span>
                          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 opacity-80 h-full">
                             <p className="text-[13px] text-slate-400 font-mono leading-relaxed line-through decoration-red-500/50 decoration-2">
                               "Managed warehouse operations and team of 50. Supervised inbound/outbound shipments and ensured safety compliance. Used Excel for reporting."
                             </p>
                          </div>
                          
                          <div className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 text-brand-secondary shadow-lg group-hover:scale-110 group-hover:bg-brand-secondary group-hover:text-slate-900 transition-all">
                             <ArrowRight className="w-4 h-4" />
                          </div>
                          
                          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20 flex sm:hidden items-center justify-center w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 text-brand-secondary shadow-lg">
                             <ArrowRight className="w-4 h-4 rotate-90" />
                          </div>
                       </div>

                       {/* Output Side */}
                       <div className="space-y-3 relative z-10 pt-4 sm:pt-0">
                          <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest flex items-center gap-1.5 pl-1">
                            <Sparkles className="w-3 h-3" /> AI Optimized Narrative
                          </span>
                          <div className="p-5 rounded-2xl bg-brand-primary/10 border border-brand-secondary/30 relative overflow-hidden h-full shadow-[0_0_20px_rgba(20,184,166,0.05)] group-hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-shadow duration-500">
                             <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                             <p className="text-[13px] text-white leading-relaxed font-medium relative z-10">
                               "Directed high-volume fulfillment operations across an automated 500k sqft facility. Implemented data-driven labor management tracking, <span className="text-brand-secondary bg-brand-secondary/10 px-1 py-0.5 rounded font-bold">achieving a 15% increase in throughput</span> and driving full-cycle safety protocols."
                             </p>
                             
                             <div className="mt-4 flex gap-2">
                                <div className="text-[9px] px-2 py-1 rounded bg-brand-primary/20 text-brand-secondary font-bold uppercase tracking-wider border border-brand-secondary/20">Data-Driven</div>
                                <div className="text-[9px] px-2 py-1 rounded bg-brand-primary/20 text-brand-secondary font-bold uppercase tracking-wider border border-brand-secondary/20">Scale</div>
                             </div>
                          </div>
                       </div>
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <AnimatePresence>
          {showOptimizer && (
            <ResumeOptimizer onClose={() => setShowOptimizer(false)} />
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

const About = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const team = [
    {
      name: "Katie Peugh",
      role: "Operations & Talent Strategy",
      image: "https://storage.googleapis.com/thetransformationroomassets/Katie.jpg",
      desc: "10+ years across supply chain and warehouse environments. Focuses on aligning people, processes, and strategy."
    },
    {
      name: "Fawn Cook",
      role: "Business Insights & Organizational Design",
      image: "https://storage.googleapis.com/thetransformationroomassets/Fawn.JPG",
      desc: "Proven track record of building high-performing teams and driving transformation at scale."
    },
    {
      name: "Emily Zraunig",
      role: "Solution Design & Leadership",
      image: "https://storage.googleapis.com/thetransformationroomassets/Emily%20Z.jpg",
      desc: "Worked closely with leaders to assess challenges, design practical solutions, and create clarity."
    },
    {
      name: "Valeria Mazo",
      role: "Finance & ROI Strategy",
      image: "https://storage.googleapis.com/thetransformationroomassets/Valeria%20Mazo.jpg",
      desc: "Expertise in finance, technology solutions, and marketing alignment with a focus on measurable outcomes."
    }
  ];

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
      <section className="bg-slate-50 pt-40 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="h-80 bg-slate-200 rounded-3xl overflow-hidden shadow-2xl"
                >
                   <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="h-64 bg-slate-200 rounded-3xl overflow-hidden shadow-xl mt-12"
                >
                   <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" />
                </motion.div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-secondary rounded-full blur-3xl opacity-20" />
            </div>
            <div>
              <span className="text-brand-secondary font-bold tracking-widest text-xs uppercase mb-4 block underline decoration-brand-primary underline-offset-4">OUR PHILOSOPHY</span>
              <h1 className="text-5xl font-bold mb-8 leading-tight text-slate-900">Inside Operations, <br /><span className="text-brand-primary">Not Outside.</span></h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                The Transformation Room was built from years of working inside high-volume operations, helping teams bridge the gap between complex strategy and practical execution. We aren't traditional consultants—we're <span className="text-slate-900 font-bold">practitioners</span> who have lived through the transformations we lead.
              </p>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {team.map((member, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="aspect-[4/5] bg-slate-100 rounded-[2.5rem] mb-8 overflow-hidden transition-all duration-700 relative shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                     <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center text-slate-900 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <ArrowRight className="w-5 h-5" />
                     </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{member.name}</h3>
                  <p className="text-brand-primary text-xs font-bold uppercase tracking-widest mb-4 inline-block bg-brand-primary/5 px-2 py-1 rounded">{member.role}</p>
                  <p className="text-slate-500 leading-relaxed text-sm">{member.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="bg-slate-50 py-24 relative overflow-hidden border-t border-slate-200">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-row-reverse">
            <div className="relative lg:order-2">
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="h-80 bg-slate-200 rounded-3xl overflow-hidden shadow-2xl"
                >
                   <img src="https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="h-64 bg-slate-200 rounded-3xl overflow-hidden shadow-xl mt-12"
                >
                   <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" />
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
              <motion.div 
                whileHover={{ x: -10 }}
                className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden group cursor-default"
              >
                <div className="absolute top-0 right-0 w-2 h-full bg-brand-secondary" />
                <h3 className="text-xl font-bold mb-2 text-brand-primary">Support Our Initiatives</h3>
                <p className="text-slate-700 relative z-10 font-medium mb-6">Join us in extending transformation far beyond our boardroom. Together, we can make a difference in our communities.</p>
                <a href="https://buy.stripe.com/14k7swbAh3ludRS5kl" target="_blank" rel="noopener noreferrer" className="inline-flex px-8 py-3 rounded-full text-base font-bold transition-all border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/40 relative z-10">
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

const Testimonials = () => (
  <div className="pt-32 pb-24 bg-slate-50">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-20">
        <span className="text-brand-secondary font-bold tracking-widest text-xs uppercase mb-4 block underline">IMPACT & EVIDENCE</span>
        <h1 className="text-5xl font-bold mb-6">Proven Transformation.</h1>
        <p className="text-slate-500 text-lg">Real results from the front lines of operations and technology integration.</p>
      </div>

      <div className="mb-32">
        <h2 className="text-2xl font-bold mb-12 flex items-center gap-4">
          <Briefcase className="text-brand-secondary w-8 h-8" />
          Selected Case Studies
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
                <h3 className="text-xl font-bold mb-4">{caseStudy.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{caseStudy.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-12 flex items-center gap-4">
        <Quote className="text-brand-secondary w-8 h-8" />
        Client Testimonials
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

const Contact = () => {
  return (
    <div>
      <section className="bg-slate-900 pt-40 pb-24 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h1 className="text-5xl font-bold mb-8">Let's Build Something Better.</h1>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed">
              You don’t need a perfect plan to reach out, just a starting point. Choose the option that fits your needs best.
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                   <Calendar className="w-6 h-6 text-brand-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Office Hours</h4>
                  <p className="text-slate-400 text-sm">Mon-Wed: 8AM–6PM</p>
                  <p className="text-slate-400 text-sm">Thu-Sat: 9AM–6PM</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                   <Globe className="w-6 h-6 text-brand-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Location</h4>
                  <p className="text-slate-400 text-sm">Remote First & On-Site Deployments</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white text-slate-900 rounded-3xl p-10 shadow-2xl">
            <h3 className="text-2xl font-bold mb-8">Get Started</h3>
            <div className="space-y-4">
              <a href={SCHEDULING_30MIN} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-brand-secondary hover:bg-slate-100 transition-all group">
                <div>
                  <h5 className="font-bold">Initial Consultation</h5>
                  <p className="text-sm text-slate-500">Quick 30-minute sync</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-secondary group-hover:translate-x-1" />
              </a>
              <a href={DISCOVERY_CALL_1HR} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/20 hover:border-brand-secondary hover:bg-brand-primary/10 transition-all group">
                <div>
                  <h5 className="font-bold text-brand-primary">Full Discovery Call</h5>
                  <p className="text-sm text-brand-primary/60">Comprehensive 1-hour session</p>
                </div>
                <ArrowRight className="w-5 h-5 text-brand-primary/30 group-hover:text-brand-secondary group-hover:translate-x-1" />
              </a>
              <a href={INFO_FORM} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-brand-secondary hover:bg-slate-100 transition-all group">
                <div>
                  <h5 className="font-bold">Tell Us About Your Project</h5>
                  <p className="text-sm text-slate-500">Fill out our intake form</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-secondary group-hover:translate-x-1" />
              </a>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">Direct Contact</p>
              <p className="text-xl font-bold text-brand-primary">(717) 461-5402</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/individuals" element={<Individuals />} />
            <Route path="/about" element={<About />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <ChatBot />
      </div>
    </Router>
  );
}
