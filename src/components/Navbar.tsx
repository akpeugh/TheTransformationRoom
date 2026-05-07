import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Sparkles, Bot, FileText, Zap, Headphones } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navBg = scrolled 
    ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-3" 
    : "bg-white/0 border-b border-transparent py-5";

  const tools = [
    { 
      name: "NOVA AI Chat", 
      desc: "Instant operational guidance", 
      icon: <Bot className="w-4 h-4" />,
      action: () => window.dispatchEvent(new CustomEvent('ais:open-chat'))
    },
    { 
      name: "Career Transformation", 
      desc: "Simulate your growth path", 
      icon: <Zap className="w-4 h-4" />,
      path: "/display" 
    },
    { 
      name: "Resume Optimizer", 
      desc: "Reframing legacy experience", 
      icon: <FileText className="w-4 h-4" />,
      path: "/display?path=resume" 
    },
    {
      name: "Podcast Library",
      desc: "Studio sessions & strategy",
      icon: <Headphones className="w-4 h-4" />,
      path: "/podcasts"
    }
  ];

  return (
    <nav className={`sticky top-0 z-[100] w-full transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-2 transition-transform group-hover:scale-105">
                 <img src="https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png" alt="TTR" className="h-8 md:h-10 w-auto" />
            </div>
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            {['Organizations', 'Individuals', 'About', 'Contact'].map((item) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase()}`} 
                className={`text-sm font-bold uppercase tracking-widest hover:text-brand-secondary transition-colors ${pathname === `/${item.toLowerCase()}` ? 'text-brand-secondary' : 'text-slate-900'}`}
              >
                {item}
              </Link>
            ))}

            {/* Tools Dropdown */}
            <div className="relative group/tools">
              <button 
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
                className={`flex items-center gap-1 text-sm font-bold uppercase tracking-widest transition-colors py-2 ${toolsOpen ? 'text-brand-secondary' : 'text-slate-900 group-hover/tools:text-brand-secondary'}`}
              >
                Tools <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div 
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 w-72 transition-all duration-300 origin-top ${toolsOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 overflow-hidden">
                  <div className="grid grid-cols-1 gap-1">
                    {tools.map((tool) => {
                      const content = (
                        <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-brand-secondary/10 flex items-center justify-center shrink-0 border border-brand-secondary/20">
                            {tool.icon}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-none mb-1">{tool.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{tool.desc}</p>
                          </div>
                        </div>
                      );

                      if (tool.action) {
                        return (
                          <button key={tool.name} onClick={() => { tool.action?.(); setToolsOpen(false); }} className="text-left block w-full">
                            {content}
                          </button>
                        );
                      }

                      return (
                        <Link key={tool.name} to={tool.path!} onClick={() => setToolsOpen(false)} className="block">
                          {content}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <Link 
              to="/contact" 
              className="bg-brand-primary text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg active:scale-95"
            >
              Get Started
            </Link>
          </div>

          <button 
            className="md:hidden p-2 text-slate-900"
            onClick={() => setIsOpen(!isOpen)}
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
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Systems & Tools</p>
              <div className="space-y-3">
                {tools.map((tool) => (
                  <button 
                    key={tool.name}
                    onClick={() => {
                      if (tool.action) tool.action();
                      else navigate(tool.path!);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 w-full text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-secondary/5 flex items-center justify-center text-brand-secondary">{tool.icon}</div>
                    <span className="text-sm font-bold text-slate-900">{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>
            {['Home', 'Organizations', 'Individuals', 'About', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="block text-lg font-bold text-slate-900 hover:text-brand-secondary"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
