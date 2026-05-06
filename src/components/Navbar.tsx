import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
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

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-2 transition-transform group-hover:scale-105">
                 <img src="https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png" alt="TTR" className="h-8 md:h-10 w-auto" />
                 <span className="text-xl md:text-2xl font-black text-brand-primary tracking-tighter">THE TRANSFORMATION ROOM</span>
            </div>
          </Link>
          
          <div className="hidden md:flex space-x-10 items-center">
            {['Organizations', 'Individuals', 'About', 'Contact'].map((item) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase()}`} 
                className={`text-sm font-bold uppercase tracking-widest hover:text-brand-secondary transition-colors ${pathname === `/${item.toLowerCase()}` ? 'text-brand-secondary' : 'text-slate-900'}`}
              >
                {item}
              </Link>
            ))}
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
