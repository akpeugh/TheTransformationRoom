import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Building2, 
  Layers, 
  BarChart3, 
  PieChart as PieChartIcon, 
  ArrowRight, 
  Target, 
  Activity, 
  ShieldCheck, 
  Sparkles,
  Info,
  ChevronRight,
  Zap,
  MousePointer2,
  Settings,
  LayoutDashboard,
  RefreshCcw,
  AlertCircle,
  Bot,
  X
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import SEO from "../components/SEO";

// Types
interface Inputs {
  facilities: number;
  headcount: number;
  avgWage: number;
  otRate: number; // Changed from avgOT
  absenteeism: number;
  turnover: number;
  adminHours: number;
  currentUptime: number; // Renamed from uptimeOpp
  errorRate: number;
  investment: number;
  avgVolume: number; // Units per week
  unitMargin: number; // Margin per unit
}

interface Solutions {
  aiVideoAnalytics: boolean;
  autonomousDrones: boolean;
  flexScheduling: boolean;
  realTimeDashboards: boolean;
  intelligentPicking: boolean;
  leadershipAdoption: boolean;
  amrCobots: boolean;
}

const SOLUTION_SPECS = {
  aiVideoAnalytics: { 
    label: "AI Video Analytics", 
    icon: Bot, 
    baseCost: 35000, 
    perFacilityCost: 5000,
    annualOpExRate: 0.15,
    description: "Automated inventory tracking & productivity heatmaps."
  },
  autonomousDrones: { 
    label: "Autonomous Drones", 
    icon: Sparkles, 
    baseCost: 75000, 
    perFacilityCost: 10000,
    annualOpExRate: 0.20,
    description: "High-speed cycle counting & warehouse mapping."
  },
  flexScheduling: { 
    label: "Flex Scheduling", 
    icon: Clock, 
    baseCost: 15000, 
    perFacilityCost: 2000,
    annualOpExRate: 0.10,
    description: "Dynamic labor allocation & shift optimization."
  },
  realTimeDashboards: { 
    label: "Live Dashboards", 
    icon: BarChart3, 
    baseCost: 25000, 
    perFacilityCost: 1500,
    annualOpExRate: 0.12,
    description: "Real-time KPI visibility & command center."
  },
  intelligentPicking: { 
    label: "Intelligent Picking", 
    icon: Target, 
    baseCost: 120000, 
    perFacilityCost: 15000,
    annualOpExRate: 0.15,
    description: "AI-driven route optimization & batch logic."
  },
  leadershipAdoption: { 
    label: "Leadership Model", 
    icon: ShieldCheck, 
    baseCost: 10000, 
    perFacilityCost: 8000,
    annualOpExRate: 0.05,
    description: "Standardized management tech & coaching."
  },
  amrCobots: { 
    label: "AMR / Cobots", 
    icon: Bot, 
    baseCost: 250000, 
    perFacilityCost: 45000,
    annualOpExRate: 0.18,
    description: "Autonomous cart retrieval & collaborative picking."
  },
};

type Scenario = "conservative" | "realistic" | "aggressive";

// Component for animated numbers
const CountingNumber = ({ value, prefix = "", suffix = "", duration = 1500, decimals = 0 }: { value: number, prefix?: string, suffix?: string, duration?: number, decimals?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startValue = displayValue;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function (outQuart)
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      const nextValue = startValue + (value - startValue) * easedProgress;
      
      setDisplayValue(nextValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  const format = (val: number) => {
    if (prefix === "$" && val >= 1000000) {
      return (val / 1000000).toFixed(2) + "M";
    }
    return val.toLocaleString(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  return <span>{prefix}{format(displayValue)}{suffix}</span>;
};

export default function ImpactSimulator() {
  const [inputs, setInputs] = useState<Inputs>({
    facilities: 2,
    headcount: 150,
    avgWage: 28,
    otRate: 12, // 12% baseline OT
    absenteeism: 6,
    turnover: 45,
    adminHours: 20,
    currentUptime: 75,
    errorRate: 4,
    investment: 250000,
    avgVolume: 125000,
    unitMargin: 0.15,
  });

  const [solutions, setSolutions] = useState<Solutions>({
    aiVideoAnalytics: true,
    autonomousDrones: false,
    flexScheduling: false,
    realTimeDashboards: true,
    intelligentPicking: false,
    leadershipAdoption: true,
    amrCobots: false,
  });

  const [scenario, setScenario] = useState<Scenario>("realistic");
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isNovaVisible, setIsNovaVisible] = useState(false);
  const [isNovaMuted, setIsNovaMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (lastUpdateTime > 0) {
      setIsSimulating(true);
      const timer = setTimeout(() => setIsSimulating(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [lastUpdateTime]);

  // Handle Nova Volume
  useEffect(() => {
    if (videoRef.current && !isNovaMuted) {
      videoRef.current.volume = 0.12; // Optimized for clarity but not overwhelming
    }
  }, [isNovaMuted, isNovaVisible]);

  useEffect(() => {
    // Pop up Nova shortly after launch - only once per session
    if (sessionStorage.getItem('nova_sim_intro_played')) return;

    const timer = setTimeout(() => {
      setIsNovaVisible(true);
      setIsNovaMuted(false); // Start unmuted
      sessionStorage.setItem('nova_sim_intro_played', 'true');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const triggerNovaMessage = () => {
    // Only play once per visit to the simulator (session)
    if (sessionStorage.getItem('nova_sim_intro_played')) return;
    
    setIsNovaVisible(true);
    setIsNovaMuted(false);
    sessionStorage.setItem('nova_sim_intro_played', 'true');
  };

  const handleScenarioChange = (s: Scenario) => {
    setScenario(s);
    setLastUpdateTime(Date.now());
    triggerNovaMessage();
  };

  // Factors based on scenario and solutions
  const factors = useMemo(() => {
    const baseFactors = {
      conservative: 0.15, 
      realistic: 0.35,   
      aggressive: 0.55
    };

    const multiplier = baseFactors[scenario];
    
    // Strategic Impact Mapping (Refined for realism)
    const solutionImpact = {
      // OT impacted by flex scheduling and dashboards
      otFactor: (solutions.flexScheduling ? 0.25 : 0) + (solutions.realTimeDashboards ? 0.15 : 0),
      
      // Admin hours strictly driven by dashboards and autonomous drones (cycle counting)
      adminFactor: (solutions.realTimeDashboards ? 0.3 : 0) + (solutions.autonomousDrones ? 0.25 : 0) + (solutions.aiVideoAnalytics ? 0.2 : 0),
      
      // Uptime driven by AMRs, Intelligent Picking and leadership
      uptimeFactor: (solutions.amrCobots ? 0.2 : 0) + (solutions.intelligentPicking ? 0.15 : 0) + (solutions.leadershipAdoption ? 0.15 : 0),
      
      // Errors driven by AI Analytics and Intelligent Picking
      errorFactor: (solutions.aiVideoAnalytics ? 0.3 : 0) + (solutions.intelligentPicking ? 0.2 : 0) + (solutions.amrCobots ? 0.15 : 0),
      
      // Turnover/Retention impacted by flex scheduling and leadership
      turnoverFactor: (solutions.flexScheduling ? 0.25 : 0) + (solutions.leadershipAdoption ? 0.2 : 0),
      
      // Absenteeism driven by flex schedules and leadership culture
      absenteeismFactor: (solutions.flexScheduling ? 0.2 : 0) + (solutions.leadershipAdoption ? 0.15 : 0),
      
      // Volume gain via modern automation
      volumeFactor: (solutions.amrCobots ? 0.25 : 0) + (solutions.intelligentPicking ? 0.15 : 0) + (solutions.aiVideoAnalytics ? 0.1 : 0)
    };

    return {
      ot: solutionImpact.otFactor * multiplier,
      admin: solutionImpact.adminFactor * multiplier,
      uptime: solutionImpact.uptimeFactor * multiplier,
      error: solutionImpact.errorFactor * multiplier,
      turnover: solutionImpact.turnoverFactor * multiplier,
      absenteeism: solutionImpact.absenteeismFactor * multiplier,
      volume: solutionImpact.volumeFactor * multiplier
    };
  }, [scenario, solutions]);

  // Calculations
  const results = useMemo(() => {
    const totalHeadcount = inputs.headcount * inputs.facilities;
    const weeklyWageBill = totalHeadcount * inputs.avgWage * 40;
    const annualWageBill = weeklyWageBill * 52;

    // Unit Margin Value
    const unitMargin = inputs.unitMargin;

    // Calculate Dynamic CAPEX and OpEx based on selected solutions
    let baseInvestment = 0;
    let annualOpEx = 0;
    Object.keys(solutions).forEach((key) => {
      if (solutions[key as keyof Solutions]) {
        const spec = SOLUTION_SPECS[key as keyof Solutions];
        const solutionCapex = spec.baseCost + (spec.perFacilityCost * inputs.facilities);
        baseInvestment += solutionCapex;
        annualOpEx += solutionCapex * spec.annualOpExRate;
      }
    });

    // Add 20% Contingency Buffer for Implementation
    const calculatedInvestment = baseInvestment * 1.2;

    // OT Savings (Based on % of total straight-time wage bill)
    const otSavings = annualWageBill * (inputs.otRate / 100) * 1.5 * factors.ot;

    // Admin Savings
    const adminSavings = inputs.adminHours * inputs.avgWage * 52 * inputs.facilities * factors.admin;

    // Uptime/Productivity Savings (Calculated from Opportunity Gap to 95% ceiling)
    const uptimeOpportunityGap = Math.max(0, 95 - inputs.currentUptime);
    const uptimeSavings = totalHeadcount * inputs.avgWage * 2080 * (uptimeOpportunityGap / 100) * factors.uptime;

    // Rework/Error Savings
    const errorSavings = annualWageBill * (inputs.errorRate / 100) * factors.error;

    // Turnover Savings (Used $12k more conservative cost)
    const turnoverSavings = totalHeadcount * (inputs.turnover / 100) * 12000 * factors.turnover;

    // Absenteeism Savings (Headcount & Hours specific)
    const absenteeismSavings = totalHeadcount * (inputs.absenteeism / 100) * 40 * 52 * inputs.avgWage * factors.absenteeism;

    // Volume Gain Value
    const weeklyVolumeGain = inputs.avgVolume * (uptimeOpportunityGap / 100) * factors.volume;
    const annualVolumeValue = weeklyVolumeGain * unitMargin * 52 * inputs.facilities;

    // Total ROI Calculation (Total Annual Recaptured Value at Maturity)
    const totalAnnualValue = otSavings + adminSavings + uptimeSavings + errorSavings + turnoverSavings + absenteeismSavings + (annualVolumeValue * 0.35); // 0.35 conservative recapture buffer
    
    // 5-Year Financial Model
    const year1Value = totalAnnualValue * 0.40;
    const year2Value = totalAnnualValue * 0.75;
    const year3Value = totalAnnualValue;
    const year4Value = totalAnnualValue * 1.05; // Elasticity tailwind
    const year5Value = totalAnnualValue * 1.10; // Elasticity tailwind
    
    const fiveYearTotalValue = year1Value + year2Value + year3Value + year4Value + year5Value;
    const fiveYearTotalOpEx = annualOpEx * 5;
    
    // Use inputs.investment as an "Additional Manual CAPEX" or Override if greater than 0
    const finalInvestment = calculatedInvestment + (inputs.investment || 0);
    
    const fiveYearNetValue = fiveYearTotalValue - fiveYearTotalOpEx - finalInvestment;
    const fiveYearRoi = (fiveYearNetValue / (finalInvestment || 1)) * 100;
    const monthlySavings = totalAnnualValue / 12;
    const payback = (finalInvestment || 1) / (monthlySavings || 1);

    // Maturity Score (0-100)
    const solutionCount = Object.values(solutions).filter(Boolean).length;
    const maturityScore = Math.min(100, Math.round((solutionCount / 7) * 40 + (scenario === "aggressive" ? 30 : scenario === "realistic" ? 20 : 10) + 30));

    // Top Opportunity Areas
    const opportunities = [
      { name: "Operational Uptime", value: uptimeSavings + absenteeismSavings },
      { name: "Volume Velocity", value: annualVolumeValue * 0.35 },
      { name: "Quality & Precision", value: errorSavings + otSavings },
      { name: "Workforce Stability", value: turnoverSavings }
    ].sort((a, b) => b.value - a.value);

    // Recommended Package
    let recommendation = "Clarity";
    if (fiveYearRoi > 400 || totalAnnualValue > 1500000) recommendation = "Execution";
    else if (fiveYearRoi > 200) recommendation = "Direction";

    return {
      otSavings,
      adminSavings,
      uptimeSavings,
      absenteeismSavings,
      errorSavings,
      turnoverSavings,
      annualVolumeValue,
      weeklyVolumeGain,
      totalAnnualValue,
      fiveYearTotalValue,
      fiveYearRoi,
      monthlySavings,
      payback,
      maturityScore,
      opportunities,
      recommendation,
      totalHeadcount,
      calculatedInvestment: finalInvestment,
      annualOpEx
    };
  }, [inputs, factors, solutions, scenario]);

  // Maturity Ring Data
  const maturityData = [
    { name: "Score", value: results.maturityScore, fill: "url(#colorMaturity)" }
  ];

  const handleInputChange = (key: keyof Inputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
    setLastUpdateTime(Date.now());
    triggerNovaMessage();
  };

  const toggleSolution = (key: keyof Solutions) => {
    setSolutions(prev => ({ ...prev, [key]: !prev[key] }));
    setLastUpdateTime(Date.now());
    triggerNovaMessage();
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${Math.round(val).toLocaleString()}`;
  };

  const waterfallData = [
    { name: "Uptime", value: results.uptimeSavings + results.absenteeismSavings },
    { name: "Volume", value: results.annualVolumeValue * 0.35 },
    { name: "Overtime", value: results.otSavings },
    { name: "Admin", value: results.adminSavings },
    { name: "Retention", value: results.turnoverSavings },
  ].sort((a, b) => b.value - a.value);

  const cumulativeData = useMemo(() => {
    const months = [];
    for (let i = 1; i <= 60; i++) {
      months.push(i % 12 === 0 ? `Y${i/12}` : `M${i}`);
    }
    
    let accumulated = 0;
    return months.map((month, i) => {
      // Determine yearly phase
      const year = Math.floor(i / 12) + 1;
      let yearlyCapture = 1.0;
      if (year === 1) yearlyCapture = 0.40;
      else if (year === 2) yearlyCapture = 0.75;
      else if (year === 3) yearlyCapture = 1.0;
      else if (year === 4) yearlyCapture = 1.05;
      else yearlyCapture = 1.10;

      // Linear ramp up within Year 1 (6 months)
      const internalRamp = year === 1 ? Math.min(1, (i + 1) / 6) : 1;
      
      const monthlyPotential = (results.totalAnnualValue / 12);
      const monthlyGain = monthlyPotential * yearlyCapture * internalRamp;
      const monthlyOpEx = (results.annualOpEx / 12);
      
      accumulated += (monthlyGain - monthlyOpEx);
      
      return {
        name: month,
        cumulative: Math.round(accumulated),
        monthly: Math.round(monthlyGain),
        displayMonth: i + 1,
        year
      };
    });
  }, [results.totalAnnualValue, results.annualOpEx]);

  return (
    <div className="min-h-screen bg-[#05070a] text-white pt-24 pb-20 selection:bg-brand-secondary/30">
      <SEO 
        title="Impact Simulator"
        description="Calculate your estimated 5-year value potential and net ROI with our high-fidelity operational foresight engine."
      />
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-secondary/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      {/* Nova Floating Overlay */}
      <AnimatePresence>
        {isNovaVisible && (
          <motion.div 
            drag
            dragMomentum={false}
            initial={{ opacity: 0, y: 50, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-10 right-10 z-[100] cursor-grab active:cursor-grabbing group"
          >
            <div className={`relative w-48 h-48 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-4 transition-all duration-700 shadow-[0_0_50px_rgba(0,0,0,0.8)] ${isSimulating ? 'border-brand-secondary scale-105 shadow-[0_0_30px_rgba(0,242,255,0.4)]' : 'border-white/10 bubble-glow hover:border-white/30'}`}>
              <video 
                ref={videoRef}
                src="https://storage.googleapis.com/thetransformationroomassets/Nova%20Simulation%20Intro.mp4"
                autoPlay
                muted={isNovaMuted}
                playsInline
                onEnded={() => {
                  // After finishing her message, she fades away
                  setTimeout(() => setIsNovaVisible(false), 1000);
                }}
                className={`w-full h-full object-cover transition-all duration-1000 ${isSimulating ? 'saturate-150 brightness-110' : 'saturate-100 brightness-100'}`}
              />
              <div className={`absolute inset-0 transition-opacity duration-1000 ${isSimulating ? 'bg-brand-secondary/5' : 'bg-transparent'}`} />
              
              {/* Close Button */}
              <button 
                onClick={() => setIsNovaVisible(false)}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white/50 hover:text-white transition-all z-20 pointer-events-auto"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Mute/Unmute Toggle */}
              <button 
                onClick={() => setIsNovaMuted(!isNovaMuted)}
                className="absolute bottom-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white/50 hover:text-white transition-all z-20 pointer-events-auto"
              >
                {isNovaMuted ? <Bot className="w-4 h-4 opacity-50" /> : <Activity className="w-4 h-4 text-brand-secondary" />}
              </button>

              {/* Internal Label */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isSimulating ? 'bg-brand-secondary animate-ping' : 'bg-brand-secondary/50'}`} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-secondary">
                    Nova Strategic Lens
                  </span>
                </div>
              </div>
            </div>
            
            {/* External Status Tag */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <div className={`px-4 py-1.5 rounded-full backdrop-blur-md border flex items-center gap-2 transition-all duration-500 ${isSimulating ? 'bg-brand-secondary/20 border-brand-secondary/50 text-brand-secondary ring-4 ring-brand-secondary/10' : 'bg-slate-900/60 border-white/10 text-slate-500'}`}>
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                  {isSimulating ? "Recalibrating Strategy..." : "Operational Companion Active"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global SVG Gradients */}
      <svg className="absolute w-0 h-0">
        <defs>
          <linearGradient id="colorMaturity" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4255ff" />
            <stop offset="100%" stopColor="#00f2ff" />
          </linearGradient>
          <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4255ff" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#4255ff" stopOpacity={0}/>
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-secondary/20 rounded-full mb-6 border border-brand-secondary/30">
              <Sparkles className="w-3 h-3 text-brand-secondary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary">Executive Command Center</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">
              Transformation Impact Simulator
            </h1>
            <p className="text-xl text-slate-400 font-light leading-relaxed max-w-3xl mx-auto">
              A high-fidelity foresight engine designed to reveal the ROI of operational velocity. Map your legacy baseline and simulate the impact of strategic modernization.
            </p>
          </motion.div>
        </div>

        {/* STEP 1: FACILITY PROFILE */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
              <Building2 className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Phase 01</span>
              <h3 className="text-2xl font-bold tracking-tight">Establish Legacy Baseline</h3>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
              {[
                { label: "Number of Facilities", key: "facilities", min: 1, max: 50, step: 1, unit: "", icon: Building2 },
                { label: "Headcount per Facility", key: "headcount", min: 1, max: 2000, step: 5, unit: "", icon: Users },
                { label: "Average Hourly Wage", key: "avgWage", min: 10, max: 75, step: 0.5, unit: "$", icon: DollarSign },
                { label: "Overtime Rate", key: "otRate", min: 0, max: 50, step: 0.5, unit: "%", icon: Clock },
                { label: "Weekly Volume", key: "avgVolume", min: 100, max: 1000000, step: 500, unit: "u", icon: Layers },
                { label: "Unit Margin", key: "unitMargin", min: 0.01, max: 5, step: 0.01, unit: "$", icon: TrendingUp },
                { label: "Annual Turnover", key: "turnover", min: 0, max: 200, step: 1, unit: "%", icon: RefreshCcw },
                { label: "Weekly Admin/Reporting", key: "adminHours", min: 0, max: 160, step: 1, unit: "h", icon: MousePointer2 },
                { label: "Current Uptime %", key: "currentUptime", min: 50, max: 95, step: 1, unit: "%", icon: Zap },
                { label: "Admin Surcharge / Extra CAPEX", key: "investment", min: 0, max: 2000000, step: 10000, unit: "$", icon: Target },
              ].map((input) => (
                <div key={input.key} className="space-y-4 group">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <input.icon className="w-3 h-3 text-slate-600 group-hover:text-brand-secondary transition-colors" />
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors line-clamp-1">{input.label}</label>
                    </div>
                    <div className="relative flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-brand-secondary/50 transition-all">
                      <div className="pl-3 py-1.5 flex items-center gap-1.5">
                        {input.unit === "$" && <span className="text-[10px] font-mono font-bold text-slate-500">$</span>}
                        <input 
                          type="number"
                          value={inputs[input.key as keyof Inputs]}
                          onChange={(e) => handleInputChange(input.key as keyof Inputs, parseFloat(e.target.value) || 0)}
                          className="bg-transparent border-none text-[12px] font-mono font-bold text-brand-secondary w-20 focus:ring-0 focus:outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        {input.unit !== "$" && input.unit !== "" && <span className="text-[10px] font-mono font-bold text-slate-500 pr-3">{input.unit}</span>}
                      </div>
                    </div>
                  </div>
                  <input 
                    type="range"
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    value={inputs[input.key as keyof Inputs]}
                    onChange={(e) => handleInputChange(input.key as keyof Inputs, parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-secondary hover:accent-brand-primary transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* STEP 2: STRATEGIC CONFIGURATION */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-secondary/5 to-transparent pointer-events-none rounded-[4rem]" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 relative z-10 px-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-secondary/20 flex items-center justify-center border border-brand-secondary/30 shadow-[0_0_20px_rgba(0,242,255,0.1)]">
                <Target className="w-7 h-7 text-brand-secondary" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-secondary mb-1 block">Phase 02</span>
                <h3 className="text-3xl font-bold tracking-tight text-white">Deploy Strategic Levers</h3>
              </div>
            </div>

            <div className="flex bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-2.5 rounded-[2rem] shadow-2xl gap-3 w-full md:w-auto min-h-[90px]">
              {(["conservative", "realistic", "aggressive"] as Scenario[]).map((s) => {
                const isActive = scenario === s;
                const variants = {
                  conservative: {
                    active: "bg-slate-300 text-slate-900 shadow-[0_10px_20px_rgba(255,255,255,0.1)]",
                    label: "Low Impact",
                    indicator: "bg-slate-400"
                  },
                  realistic: {
                    active: "bg-brand-secondary text-brand-dark shadow-[0_10px_20px_rgba(0,242,255,0.2)]",
                    label: "Mid Impact",
                    indicator: "bg-brand-secondary"
                  },
                  aggressive: {
                    active: "bg-brand-primary text-white shadow-[0_10px_20px_rgba(66,85,255,0.2)]",
                    label: "Max Impact",
                    indicator: "bg-brand-primary"
                  }
                };

                return (
                  <button
                    key={s}
                    onClick={() => handleScenarioChange(s)}
                    className={`flex-1 md:w-40 flex flex-col items-center justify-center py-3 px-6 rounded-2xl transition-all duration-500 border ${
                      isActive 
                        ? `${variants[s].active} border-transparent scale-[1.05]` 
                        : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300"
                    }`}
                  >
                    <span className="text-[11px] font-black uppercase tracking-[0.25em] mb-1">{s}</span>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-current animate-pulse" : variants[s].indicator} opacity-50`} />
                      <span className={`text-[9px] font-bold uppercase tracking-widest opacity-60 ${isActive ? "text-inherit" : "text-slate-500"}`}>
                        {variants[s].label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {[
              { key: "aiVideoAnalytics", icon: Bot },
              { key: "autonomousDrones", icon: Sparkles },
              { key: "flexScheduling", icon: Clock },
              { key: "realTimeDashboards", icon: BarChart3 },
              { key: "intelligentPicking", icon: Target },
              { key: "leadershipAdoption", icon: ShieldCheck },
              { key: "amrCobots", icon: Bot },
            ].map((sol) => {
              const spec = SOLUTION_SPECS[sol.key as keyof Solutions];
              const isSelected = solutions[sol.key as keyof Solutions];
              
              return (
                <motion.button
                  key={sol.key}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSolution(sol.key as keyof Solutions)}
                  className={`group flex flex-col p-8 rounded-[2.5rem] border transition-all text-left gap-6 relative min-h-[220px] ${
                    isSelected
                      ? "bg-brand-secondary/10 border-brand-secondary/40 text-white shadow-[0_20px_40px_rgba(0,242,255,0.05)]"
                      : "bg-slate-900/40 border-white/5 text-slate-500 hover:border-white/10 hover:bg-slate-900/60"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                    isSelected
                      ? "bg-brand-secondary/20 border-brand-secondary/30 text-brand-secondary"
                      : "bg-white/5 border-white/5 text-slate-600 group-hover:text-slate-400"
                  }`}>
                    <sol.icon className="w-7 h-7" />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.15em] leading-tight block text-white/90">{spec.label}</span>
                    <p className={`text-[11px] leading-relaxed transition-colors ${isSelected ? "text-slate-300" : "text-slate-600 group-hover:text-slate-500"}`}>
                      {spec.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                    <span className={`text-[10px] font-mono font-bold ${isSelected ? "text-brand-secondary" : "text-slate-700"}`}>
                      Est. ${((spec.baseCost + (spec.perFacilityCost * inputs.facilities)) / 1000).toFixed(0)}k
                    </span>
                    <div className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center ${
                      isSelected 
                        ? "bg-brand-secondary border-brand-secondary text-brand-dark" 
                        : "border-white/10"
                    }`}>
                      {isSelected && <ArrowRight className="w-3 h-3 rotate-[-45deg]" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute inset-0 rounded-[2.5rem] border-2 border-brand-secondary/20 pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* STEP 3: IMPACT DASHBOARD */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
              <LayoutDashboard className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Phase 03</span>
              <h3 className="text-2xl font-bold tracking-tight">Projected Operational Impact</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12">
               {/* Primary KPI Hero Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <motion.div 
                    key={`kpi-1-${lastUpdateTime}`}
                    initial={{ scale: 0.98, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="group bg-gradient-to-br from-slate-900 to-brand-primary/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                      <TrendingUp className="w-48 h-48" />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[.25em] text-brand-primary mb-4">5-Year Value Potential</div>
                    <div className="text-5xl font-black tracking-tighter text-white mb-6">
                      <CountingNumber value={results.fiveYearTotalValue} prefix="$" />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-brand-primary font-bold">
                      <div className="w-8 h-px bg-brand-primary/30" />
                      <span><CountingNumber value={results.fiveYearRoi} suffix="%" /> 5-Year Net ROI</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    key={`kpi-2-${lastUpdateTime}`}
                    initial={{ scale: 0.98, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="group bg-gradient-to-br from-slate-900 to-brand-secondary/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                      <Zap className="w-48 h-48 text-brand-secondary" />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[.25em] text-brand-secondary mb-4">Baseline Volume Gain</div>
                    <div className="text-5xl font-black tracking-tighter text-white mb-6">
                      +<CountingNumber value={Math.round(results.weeklyVolumeGain)} /> 
                      <span className="text-sm font-bold text-slate-500 ml-2">Units/Week</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-brand-secondary font-bold">
                      <div className="w-8 h-px bg-brand-secondary/30" />
                      <span>Value: <CountingNumber value={results.fiveYearTotalValue} prefix="$" /> (5-Year)</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    key={`kpi-3-${lastUpdateTime}`}
                    initial={{ scale: 0.98, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="group bg-gradient-to-br from-slate-900 to-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                      <RadialBarChart 
                        width={300} 
                        height={300} 
                        innerRadius="80%" 
                        outerRadius="100%" 
                        data={[{ value: results.maturityScore }]} 
                        startAngle={180} 
                        endAngle={0}
                      >
                        <RadialBar background dataKey="value" />
                      </RadialBarChart>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[.25em] text-slate-400 mb-4">Total Implementation CAPEX</div>
                    <div className="flex flex-col gap-4">
                      <div className="text-5xl font-black tracking-tighter text-white">
                        <CountingNumber value={results.calculatedInvestment} prefix="$" />
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Incl. 20% Contingency Buffer
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest mt-4">Calculated from Strategic Selection</div>
                  </motion.div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 h-[500px] flex flex-col group">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                      <PieChartIcon className="w-4 h-4 text-brand-primary" />
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">Opportunity Composition</h4>
                  </div>
                </div>
                <div className="flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={waterfallData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {waterfallData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 0 ? '#4255ff' : index === 1 ? '#00f2ff' : index === 2 ? '#1e293b' : '#334155'} 
                            stroke="rgba(255,255,255,0.05)"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                        formatter={(value: number) => [formatCurrency(value), 'Impact']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {waterfallData.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#4255ff]' : i === 1 ? 'bg-[#00f2ff]' : 'bg-[#1e293b]'}`} />
                       <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 h-[500px] flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <TrendingUp className="w-32 h-32 text-brand-secondary" />
                </div>
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-secondary/10 flex items-center justify-center border border-brand-secondary/20">
                      <Activity className="w-4 h-4 text-brand-secondary" />
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">Cumulative Value Projection</h4>
                  </div>
                </div>
                <div className="flex-grow relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cumulativeData}>
                      <defs>
                        <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.2} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        axisLine={false} 
                        tickLine={false} 
                        dx={-10} 
                        tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                        formatter={(value: number) => [formatCurrency(value), 'Net Cumulative Value']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="cumulative" 
                        stroke="#00f2ff" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorCumulative)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center mt-6 relative z-10">36-Month Strategic Value Realization</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Executive Summary */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-slate-900 via-brand-primary/10 to-brand-secondary/10 border border-white/10 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/20 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
                  <ShieldCheck className="w-5 h-5 text-brand-secondary" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Advisory Recommendation</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Your Strategic Roadmap: <br className="hidden md:block" /> {results.recommendation} Level Integration
                </h3>
                
                <div className="space-y-6 max-w-2xl">
                  <p className="text-xl text-slate-300 leading-relaxed font-light">
                    Your assessment reveals a high-leverage opportunity in <span className="text-brand-secondary font-bold">{results.opportunities[0].name}</span>. By consolidating fragmented workflows and manual reporting, you can unlock <span className="text-white font-bold">{formatCurrency(results.totalAnnualValue)}</span> in latent organizational value.
                  </p>
                  
                  <div className="p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 relative group-hover:border-brand-secondary/30 transition-colors">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center">
                        <Zap className="w-5 h-5 text-brand-dark" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest text-brand-secondary">Performance Insight</span>
                    </div>
                    <p className="text-lg text-slate-400 leading-relaxed italic font-light">
                      "By recapturing operational uptime, your volume gain alone supports a {results.payback.toFixed(0)}-month ROI, effectively rendering your modernization self-funding."
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Annual Value", val: formatCurrency(results.totalAnnualValue), icon: DollarSign, color: "text-brand-secondary" },
                  { label: "Payback Period", val: `${results.payback.toFixed(1)} Months`, icon: Clock, color: "text-brand-primary" },
                  { label: "OpEx Reduction", val: `${Math.round(results.totalAnnualValue / (inputs.headcount * inputs.facilities * inputs.avgWage * 20.8))}%`, icon: TrendingUp, color: "text-emerald-500" },
                  { label: "Admin Recovery", val: `${Math.round(results.adminSavings / inputs.avgWage).toLocaleString()} Hours`, icon: MousePointer2, color: "text-amber-500" },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="p-8 bg-slate-900/60 rounded-3xl border border-white/10 hover:border-brand-secondary/30 transition-all"
                  >
                    <item.icon className={`w-6 h-6 ${item.color} mb-6`} />
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{item.label}</div>
                    <div className="text-2xl font-bold text-white tracking-tight">{item.val}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="max-w-4xl mx-auto text-center pb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
            Ready to Validate These Estimates?
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => window.open('https://thetransformationroom.com/contact', '_blank')}
              className="bg-white text-brand-dark px-10 py-6 rounded-2xl font-bold hover:bg-brand-secondary transition-all flex items-center justify-center gap-3 shadow-2xl group"
            >
              Start Full Operational Assessment
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat', { detail: { prompt: `I just used the impact simulator. My estimated 5-year value potential is ${formatCurrency(results.fiveYearTotalValue)} with a net ROI of ${results.fiveYearRoi.toFixed(0)}%. I want to discuss the ${results.recommendation} package.` } }))}
              className="bg-white/5 text-white border border-white/10 px-10 py-6 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              Discuss Outcomes with NOVA
              <Bot className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-4 opacity-50">
            <div className="w-12 h-px bg-slate-800" />
            <Info className="w-4 h-4 text-slate-600" />
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
               Consulting Assumptions Based on Industry Standard Performance Baselines
            </p>
            <div className="w-12 h-px bg-slate-800" />
          </div>
        </section>
      </div>

      {/* Conversion Section */}
      <section className="max-w-7xl mx-auto px-4 mt-32">
        <div className="bg-brand-primary rounded-[3rem] p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 pointer-events-none opacity-20 scale-150 rotate-12">
            <LayoutDashboard className="w-96 h-96 text-white" />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-8">
              Want to validate this with your real operational data?
            </h2>
            <p className="text-xl text-brand-secondary font-medium mb-12 leading-relaxed">
              We help you move from simulation to reality. Our assessments reveal the hidden friction in your systems and provide a surgically precise roadmap for modernization.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <a 
                href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0o3U7M-uV6c6z6p6uV6z666V6z..." // Example placeholder
                target="_blank"
                rel="noreferrer"
                className="bg-brand-dark text-white px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-brand-secondary transition-all text-center flex items-center justify-center gap-3 group"
              >
                Book a 30-Minute Consultation
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>
              <button 
                 onClick={() => window.location.href = '/contact'}
                 className="bg-brand-secondary text-brand-dark px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-white transition-all text-center"
              >
                Start Operational Assessment
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
