import { Link } from "react-router-dom";
import { Mail, Globe, Briefcase, User, Info, Phone, MapPin, Heart } from "lucide-react";
import { PHONE_NUMBER, ADDRESS, LEGAL_NAME, CORPORATE_PAYMENT, DONATION_LINK, DISCOVERY_CALL_1HR } from "../constants";

export const Footer = () => (
  <footer className="bg-slate-900 pt-24 pb-12 text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 blur-3xl rounded-full" />
    
    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <img src="https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png" alt="TTR" className="h-10 w-auto brightness-0 invert" />
            <span className="text-xl font-black tracking-tighter uppercase">Transformation Room</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed font-light">
            Bringing elite operational transformation, strategic leadership coaching, and high-velocity systems integration to the front lines of supply chain and technology.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-brand-secondary mb-8">Navigation</h4>
          <ul className="space-y-4">
            {['Home', 'Organizations', 'Individuals', 'About', 'Testimonials', 'Contact'].map((item) => (
              <li key={item}>
                <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                  <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-brand-secondary mb-8">Systems & Tools</h4>
          <ul className="space-y-4">
            <li>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat'))}
                className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group text-left"
              >
                <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                Consult NOVA AI
              </button>
            </li>
            <li>
              <Link to="/organizations#strategic-scorecard-section" className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                Operational Assessment
              </Link>
            </li>
            <li>
              <Link to="/display" className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                Career Transformation
              </Link>
            </li>
            <li>
              <Link to="/display?path=resume" className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                Resume Optimizer
              </Link>
            </li>
            <li>
              <Link to="/podcasts" className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                Podcast Library
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-12">
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-brand-secondary mb-8">Payments & Support</h4>
            <ul className="space-y-4">
              <li>
                <a href={CORPORATE_PAYMENT} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                  <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                  Corporate Payment
                </a>
              </li>
              <li>
                <a href={DONATION_LINK} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                  <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                  Support Our Mission
                </a>
              </li>
              <li>
                <a href={DISCOVERY_CALL_1HR} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                  <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                  Discovery Call Link
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 underline underline-offset-4">Office Contact</h4>
            <div className="space-y-4 opacity-70">
              <p className="text-slate-400 text-xs font-medium">{PHONE_NUMBER}</p>
              <p className="text-slate-400 text-xs font-medium">katie@thetransformationroom.com</p>
            </div>
          </div>
        </div>


      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          © {new Date().getFullYear()} {LEGAL_NAME}
        </p>
        <div className="flex gap-8">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
            <a key={item} href="#" className="text-[10px] text-slate-500 uppercase tracking-widest font-bold hover:text-white transition-colors">{item}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
