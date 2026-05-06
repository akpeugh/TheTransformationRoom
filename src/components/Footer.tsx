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
            <span className="text-xl font-black tracking-tighter">THE TRANSFORMATION ROOM</span>
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
                <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
           <h4 className="text-sm font-black uppercase tracking-widest text-brand-secondary mb-8">Core Pillars</h4>
           <ul className="space-y-4">
             {['Hardware & Robotics', 'Data & AI Strategy', 'Space Optimization', 'Digital Visibility', 'Workforce Enablement'].map((item) => (
               <li key={item} className="text-slate-400 text-sm font-medium hover:text-brand-secondary transition-colors cursor-default">
                 {item}
               </li>
             ))}
           </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-sm font-black uppercase tracking-widest text-brand-secondary mb-8">Contact Our Office</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Phone className="w-4 h-4 text-brand-secondary shrink-0 mt-1" />
              <p className="text-slate-400 text-sm">{PHONE_NUMBER}</p>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-4 h-4 text-brand-secondary shrink-0 mt-1" />
              <p className="text-slate-400 text-sm">{ADDRESS}</p>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-4 h-4 text-brand-secondary shrink-0 mt-1" />
              <p className="text-slate-400 text-sm">katie@thetransformationroom.com</p>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/10">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center gap-2">
              <Heart className="w-3 h-3 text-brand-secondary" />
              Proudly Based in the USA
            </p>
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
