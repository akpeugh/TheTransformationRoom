import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Sparkles, Bot, FileText, Zap, Headphones, Video, BarChart3, Globe, ArrowRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translate } from "../utils/translations";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { language, setLanguage } = useLanguage();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const t = (key: string) => translate(key, language);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 15);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setToolsOpen(false);
    setIsOpen(false);
  }, [pathname]);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setToolsOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setToolsOpen(false);
    }, 150);
  };

  const toolGroups = [
    {
      label: t("nav.knowledge"),
      items: [
        {
          name: t("footer.podcast"),
          desc: t("nav.poddesc"),
          icon: <Headphones className="w-4 h-4" />,
          path: "/podcasts",
          badge: "New",
          highlight: true
        }
      ]
    },
    {
      label: t("nav.organizations"),
      items: [
        {
          name: t("nav.readiness"),
          desc: t("nav.readinessdesc"),
          icon: <Sparkles className="w-4 h-4" />,
          path: "/organizations?tool=scorecard"
        },
        {
          name: t("sim.hero.title"),
          desc: t("nav.simdesc"),
          icon: <BarChart3 className="w-4 h-4" />,
          path: "/impact-simulator"
        }
      ]
    },
    {
      label: t("nav.individuals"),
      items: [
        { 
          name: t("career.hero.title"), 
          desc: t("nav.careerdesc"), 
          icon: <Zap className="w-4 h-4" />,
          path: "/career-hub" 
        },
        { 
          name: t("footer.resume"), 
          desc: t("nav.resumedesc"), 
          icon: <FileText className="w-4 h-4" />,
          path: "/resume-builder" 
        }
      ]
    },
    {
      label: t("nav.nova"),
      items: [
        { 
          name: t("nav.novaChat"), 
          desc: t("nav.chatdesc"), 
          icon: <Bot className="w-4 h-4" />,
          action: () => window.dispatchEvent(new CustomEvent('ais:open-chat')),
          badge: "AI"
        },
        {
          name: t("nav.novaVideo"),
          desc: t("nav.videodesc"),
          icon: <Video className="w-4 h-4" />,
          action: () => window.dispatchEvent(new CustomEvent('ais:open-video-call')),
          badge: "Live"
        }
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-[100] w-full">
      {/* Translucent Glass Navbar Container */}
      <nav 
        className={`w-full transition-all duration-300 relative ${
          scrolled 
            ? "bg-white/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-b border-slate-200/80 py-2.5" 
            : "bg-white/75 backdrop-blur-xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border-b border-slate-900/5 py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 md:h-13">
            
            {/* Brand Logo with Interactive Glow & Scale */}
            <Link to="/" className="flex items-center gap-2 group py-1">
              <div className="relative flex items-center transition-all duration-300 group-hover:scale-105">
                <img 
                  src="https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png" 
                  alt="The Transformation Room" 
                  className="h-8 md:h-9 w-auto object-contain transition-all duration-300 drop-shadow-sm" 
                  width="160" 
                  height="36" 
                  loading="eager"
                  fetchPriority="high"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {[
                { name: t('nav.organizations'), path: '/organizations' },
                { name: t('nav.individuals'), path: '/individuals' },
                { name: t('nav.about'), path: '/about' },
                { name: t('nav.contact'), path: '/contact' }
              ].map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={item.name}
                    to={item.path} 
                    className={`relative px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                      isActive 
                        ? 'text-brand-primary bg-brand-primary/10 shadow-xs' 
                        : 'text-slate-800 hover:text-brand-primary hover:bg-slate-900/5'
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary shadow-[0_0_8px_rgba(20,184,166,0.8)] animate-pulse" />
                    )}
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Interactive Tools Dropdown Button */}
              <div 
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  onClick={() => setToolsOpen(!toolsOpen)}
                  aria-expanded={toolsOpen}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    toolsOpen || pathname === '/career-hub' || pathname === '/resume-builder' || pathname === '/podcasts' || pathname === '/impact-simulator'
                      ? 'text-brand-primary bg-brand-primary/10' 
                      : 'text-slate-800 hover:text-brand-primary hover:bg-slate-900/5'
                  }`}
                >
                  <span>{t('nav.tools')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 text-slate-500 ${toolsOpen ? 'rotate-180 text-brand-primary' : ''}`} />
                </button>
                
                {/* Mega Dropdown Menu */}
                <div 
                  className={`absolute top-full right-0 pt-3 w-[540px] transition-all duration-200 origin-top-right z-50 ${
                    toolsOpen 
                      ? 'opacity-100 scale-100 translate-y-0 visible pointer-events-auto' 
                      : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                  }`}
                >
                  <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/80 p-5 overflow-hidden ring-1 ring-black/5">
                    <div className="grid grid-cols-2 gap-4">
                      {toolGroups.map((group) => (
                        <div 
                          key={group.label} 
                          className={group.label === "Knowledge" || group.label === "NOVA Strategic AI" || group.label === "NOVA IA Estratégica" ? "col-span-2" : "col-span-1"}
                        >
                          <div className="flex items-center gap-2 mb-2 px-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                              {group.label}
                            </span>
                            <div className="h-px bg-slate-200/80 flex-1" />
                          </div>

                          <div className="space-y-1">
                            {group.items.map((tool: any) => {
                              const itemContent = (
                                <div className={`flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-200 group/item cursor-pointer ${
                                  tool.highlight 
                                    ? "bg-brand-secondary/10 hover:bg-brand-secondary/20 border border-brand-secondary/20 shadow-xs" 
                                    : "hover:bg-slate-100/80 border border-transparent hover:border-slate-200/60"
                                }`}>
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                                    tool.highlight
                                      ? "bg-brand-secondary text-brand-primary shadow-xs"
                                      : "bg-slate-100 text-slate-700 group-hover/item:bg-brand-primary group-hover/item:text-white"
                                  }`}>
                                    {tool.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-xs font-bold text-slate-900 leading-tight group-hover/item:text-brand-primary transition-colors truncate">
                                        {tool.name}
                                      </p>
                                      {tool.badge && (
                                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-brand-secondary/20 text-brand-primary">
                                          {tool.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{tool.desc}</p>
                                  </div>
                                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200 shrink-0 text-brand-primary" />
                                </div>
                              );

                              if (tool.action) {
                                return (
                                  <button 
                                    key={tool.name} 
                                    onClick={() => { 
                                      tool.action?.(); 
                                      setToolsOpen(false); 
                                    }} 
                                    className="text-left block w-full focus:outline-none"
                                  >
                                    {itemContent}
                                  </button>
                                );
                              }

                              return (
                                <Link 
                                  key={tool.name} 
                                  to={tool.path!} 
                                  onClick={() => setToolsOpen(false)} 
                                  className="block focus:outline-none"
                                >
                                  {itemContent}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Language Switcher Toggle */}
              <div className="pl-1 pr-1">
                <button 
                  onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 text-slate-800 hover:text-brand-primary border border-slate-200/80 transition-all duration-200 text-xs font-bold tracking-wider cursor-pointer"
                  aria-label="Toggle Language"
                  title="Switch Language (EN / ES)"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-600" />
                  <span>{language}</span>
                </button>
              </div>

              {/* Interactive "Get Started" Action Button */}
              <Link 
                to="/contact" 
                className="group relative inline-flex items-center gap-2 bg-brand-primary text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-dark transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-brand-primary/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 ml-2"
              >
                <span>{t('nav.getStarted')}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button 
              className="md:hidden p-2 rounded-xl text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Interactive Scroll Progress Indicator along Bottom Border */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-200/30 overflow-hidden pointer-events-none">
          <div 
            className="h-full bg-gradient-to-r from-brand-primary via-brand-secondary to-teal-400 transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </nav>

      {/* Mobile Drawer (Translucent Frosted Overlay) */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200/80 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="px-5 pt-4 pb-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="space-y-1">
              {[
                { name: 'Home', path: '/' },
                { name: t('nav.organizations'), path: '/organizations' },
                { name: t('nav.individuals'), path: '/individuals' },
                { name: t('nav.about'), path: '/about' },
                { name: t('nav.contact'), path: '/contact' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2.5 rounded-xl text-base font-bold transition-colors ${
                    pathname === item.path
                      ? 'text-brand-primary bg-brand-primary/10'
                      : 'text-slate-900 hover:text-brand-primary hover:bg-slate-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Tool Systems Quick Links */}
            <div className="border-t border-slate-200/80 pt-4 mt-2">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3 px-3">
                {t("footer.systems")}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {(toolGroups as any).flatMap((g: any) => g.items).map((tool: any) => (
                  <button 
                    key={tool.name}
                    onClick={() => {
                      if (tool.action) tool.action();
                      else navigate(tool.path!);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-slate-100 text-left group transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-secondary/10 text-brand-primary flex items-center justify-center shrink-0">
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-slate-900 block truncate">{tool.name}</span>
                      <span className="text-[11px] text-slate-500 block truncate">{tool.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language & CTA in Mobile Menu */}
            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
              <button 
                onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-900 transition-colors"
              >
                <Globe className="w-4 h-4 text-slate-600" />
                <span>{language === "EN" ? "English" : "Español"}</span>
              </button>

              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-brand-primary text-white text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-brand-dark transition-colors"
              >
                {t('nav.getStarted')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

