import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Sparkles, Bot, FileText, Zap, Headphones, Video, BarChart3, Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translate } from "../utils/translations";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const t = (key: string) => translate(key, language);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navBg = "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-3";

  const toolGroups = [
    {
      label: t("nav.knowledge"),
      items: [
        {
          name: t("footer.podcast"),
          desc: t("nav.poddesc"),
          icon: <Headphones className="w-4 h-4" />,
          path: "/podcasts",
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
          path: "/career-hub?path=resume" 
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
          action: () => window.dispatchEvent(new CustomEvent('ais:open-chat'))
        },
        {
          name: t("nav.novaVideo"),
          desc: t("nav.videodesc"),
          icon: <Video className="w-4 h-4" />,
          action: () => window.dispatchEvent(new CustomEvent('ais:open-video-call'))
        }
      ]
    }
  ];

  const textColor = "text-slate-900";
  const activeColor = "text-brand-secondary";

  return (
    <nav className={`sticky top-0 z-[100] w-full transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-2 transition-transform group-hover:scale-105">
                  <img 
                    src="https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png" 
                    alt="TTR" 
                    className="h-8 md:h-10 w-auto transition-all duration-300" 
                    width="160" height="40" 
                    loading="eager"
                    fetchPriority="high"
                    referrerPolicy="no-referrer"
                  />
            </div>
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            {[
              { name: t('nav.organizations'), path: '/organizations' },
              { name: t('nav.individuals'), path: '/individuals' },
              { name: t('nav.about'), path: '/about' },
              { name: t('nav.contact'), path: '/contact' }
            ].map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 relative group py-2 ${
                  pathname === item.path 
                    ? activeColor 
                    : `${textColor} hover:text-brand-secondary`
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-brand-secondary transition-all duration-300 group-hover:w-full ${pathname === item.path ? 'w-full' : 'w-0'}`} />
              </Link>
            ))}

            {/* Tools Dropdown */}
            <div className="relative group/tools">
              <button 
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
                className={`flex items-center gap-1 text-sm font-bold uppercase tracking-widest transition-all duration-300 py-2 ${toolsOpen ? activeColor : `${textColor} group-hover/tools:text-brand-secondary`}`}
              >
                {t('nav.tools')} <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div 
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
                className={`absolute top-full right-0 pt-4 w-[500px] transition-all duration-300 origin-top-right ${toolsOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
              >
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 overflow-hidden">
                  <div className="grid grid-cols-2 gap-8">
                    {toolGroups.map((group) => (
                      <div key={group.label} className={group.label === "Knowledge" || group.label === "NOVA Strategic AI" ? "col-span-2" : "col-span-1"}>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 px-3 flex items-center gap-2">
                          {group.label}
                          <div className="h-px bg-slate-100 flex-1" />
                        </h4>
                        <div className="grid grid-cols-1 gap-1">
                          {group.items.map((tool: any) => {
                            const content = (
                              <div className={`flex items-center gap-4 p-3 rounded-2xl transition-all group/item ${
                                tool.highlight 
                                  ? "bg-brand-secondary/5 hover:bg-brand-secondary/10 border border-brand-secondary/10 shadow-sm" 
                                  : "hover:bg-slate-50 border border-transparent"
                              }`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                                  tool.highlight
                                    ? "bg-brand-secondary/20 border-brand-secondary/30 text-brand-secondary shadow-lg shadow-brand-secondary/10"
                                    : "bg-slate-100 border-slate-200 text-slate-600 group-hover/item:border-brand-secondary/30 group-hover/item:text-brand-secondary group-hover/item:bg-white"
                                }`}>
                                  {tool.icon}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900 leading-none mb-1 group-hover/item:text-brand-secondary transition-colors">{tool.name}</p>
                                  <p className="text-[10px] text-slate-600 font-medium">{tool.desc}</p>
                                </div>
                              </div>
                            );

                            if (tool.action) {
                              return (
                                <button key={tool.name} onClick={() => { tool.action?.(); setToolsOpen(false); }} className="text-left block w-full focus:outline-none">
                                  {content}
                                </button>
                              );
                            }

                            return (
                              <Link key={tool.name} to={tool.path!} onClick={() => setToolsOpen(false)} className="block focus:outline-none">
                                {content}
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

            <Link 
              to="/contact" 
              className="bg-brand-primary text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg active:scale-95 hover:shadow-brand-primary/20"
            >
              {t('nav.getStarted')}
            </Link>

            <button 
              onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
              className={`flex items-center gap-1 text-sm font-bold uppercase tracking-widest transition-all duration-300 py-2 ${textColor} hover:text-brand-secondary ml-4`}
              aria-label="Toggle Language"
            >
              <Globe className="w-4 h-4" />
              <span>{language}</span>
            </button>
          </div>

          <button 
            className="md:hidden p-2 text-slate-900"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-4 pb-8 space-y-4">
            <div className="border-b border-slate-100 pb-4 mb-4">
              <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-4">{t("footer.systems")}</p>
              <div className="space-y-3">
                {(toolGroups as any).flatMap((g: any) => g.items).map((tool: any) => (
                  <button 
                    key={tool.name}
                    onClick={() => {
                      if (tool.action) tool.action();
                      else navigate(tool.path!);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 w-full text-left group/mtool"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-secondary/5 flex items-center justify-center text-brand-secondary group-hover/mtool:bg-brand-secondary group-hover/mtool:text-white transition-all">{tool.icon}</div>
                    <span className="text-sm font-bold text-slate-900 group-hover/mtool:text-brand-secondary transition-colors">{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>
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
                className="block text-lg font-bold text-slate-900 hover:text-brand-secondary"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-lg font-bold text-slate-900">{t('nav.language')}</span>
              <button 
                onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold uppercase tracking-widest text-slate-900"
              >
                <Globe className="w-4 h-4" />
                {language === "EN" ? "English" : "Español"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
