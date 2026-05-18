import { Link } from "react-router-dom";
import { Mail, Globe, Briefcase, User, Info, Phone, MapPin, Heart } from "lucide-react";
import { PHONE_NUMBER, ADDRESS, LEGAL_NAME, CORPORATE_PAYMENT, DONATION_LINK, DISCOVERY_CALL_1HR } from "../constants";
import { useLanguage } from "../contexts/LanguageContext";
import { translate } from "../utils/translations";

export const Footer = () => {
  const { language } = useLanguage();
  const t = (key: string) => translate(key, language);

  return (
  <footer className="bg-slate-900 pt-24 pb-12 text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 blur-3xl rounded-full" />
    
    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <img 
              src="https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png" 
              alt="TTR" 
              className="h-10 w-auto brightness-0 invert"  
              width="160" height="40" 
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <span className="text-xl font-black tracking-tighter uppercase">Transformation Room</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed font-light">
            {t("footer.desc")}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-brand-secondary mb-8">{t("footer.nav")}</h4>
          <ul className="space-y-4">
            {['Home', 'Organizations', 'Individuals', 'About', 'Testimonials', 'Contact'].map((item) => (
              <li key={item}>
                <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                  <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                  {t(item === 'Home' ? 'nav.home' : `nav.${item.toLowerCase()}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-brand-secondary mb-8">{t("footer.systems")}</h4>
          <ul className="space-y-4">
            <li>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat'))}
                className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group text-left"
              >
                <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                {t("footer.consult")}
              </button>
            </li>

            <li>
              <Link to="/career-hub" className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                {t("footer.career")}
              </Link>
            </li>
            <li>
              <Link to="/career-hub?path=resume" className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                {t("footer.resume")}
              </Link>
            </li>
            <li>
              <Link to="/podcasts" className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                {t("footer.podcast")}
              </Link>
            </li>
            <li>
              <Link to="/impact-simulator" className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                {t("footer.impact")}
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-12">
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-brand-secondary mb-8">{t("footer.payments")}</h4>
            <ul className="space-y-4">
              <li>
                <a href={CORPORATE_PAYMENT} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                  <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                  {t("footer.corporate")}
                </a>
              </li>
              <li>
                <a href={DONATION_LINK} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                  <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                  {t("footer.support")}
                </a>
              </li>
              <li>
                <a href={DISCOVERY_CALL_1HR} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-secondary transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group">
                  <div className="w-0 h-px bg-brand-secondary group-hover:w-4 transition-all" />
                  {t("footer.discovery")}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 underline underline-offset-4">{t("footer.office")}</h4>
            <div className="space-y-4 opacity-70">
              <p className="text-slate-400 text-xs font-medium">{PHONE_NUMBER}</p>
              <p className="text-slate-400 text-xs font-medium">katie@thetransformationroom.com</p>
            </div>
          </div>
        </div>


      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          © {new Date().getFullYear()} {LEGAL_NAME} | {t("footer.rights")}
        </p>
        <div className="flex gap-8">
          <Link to="/privacy-policy" className="text-[10px] text-slate-500 uppercase tracking-widest font-bold hover:text-white transition-colors">Privacy Policy</Link>
          {['Terms of Service', 'Cookie Policy'].map((item) => (
            <a key={item} href="#" className="text-[10px] text-slate-500 uppercase tracking-widest font-bold hover:text-white transition-colors">{item}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
  );
};
