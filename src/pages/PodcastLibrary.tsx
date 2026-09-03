import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Headphones, Play, ArrowRight, Sparkles, Clock, Share2, Download, ExternalLink, Radio } from "lucide-react";
import { PODCASTS, Podcast } from "../data/podcasts";
import SEO from "../components/SEO";
import { ORGANIZATION_SCHEMA } from "../constants/schema";
import { useLanguage } from "../contexts/LanguageContext";
import { translate } from "../utils/translations";
import { SPOTIFY_PODCAST_URL } from "../constants";

const SpotifyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.306c-.216.353-.674.464-1.027.248-2.812-1.718-6.352-2.107-10.52-1.155-.403.092-.806-.16-.898-.563-.092-.403.16-.806.563-.898 4.567-1.043 8.49-.603 11.634 1.341.353.216.464.674.248 1.027zm1.467-3.26c-.272.443-.852.585-1.295.313-3.22-1.978-8.128-2.55-11.936-1.393-.497.151-1.027-.133-1.178-.63-.151-.497.133-1.027.63-1.178 4.356-1.321 9.774-.683 13.466 1.593.443.272.585.852.313 1.295zm.126-3.411c-3.86-2.292-10.228-2.504-13.916-1.384-.593.18-1.222-.16-1.402-.753-.18-.593.16-1.222.753-1.402 4.242-1.288 11.278-1.042 15.719 1.593.533.317.708 1.008.392 1.541-.316.533-1.008.708-1.546.405z" />
  </svg>
);

const PodcastLibrary = () => {
  const { language } = useLanguage();
  const t = (key: string) => translate(key, language);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      const element = document.getElementById(`podcast-${id}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-brand-secondary', 'ring-offset-8', 'ring-offset-slate-950');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-brand-secondary', 'ring-offset-8', 'ring-offset-slate-950');
          }, 3000);
        }, 500);
      }
    }
  }, [location]);

  const playPodcast = (podcast: Podcast) => {
    window.dispatchEvent(new CustomEvent('play-global-podcast', {
      detail: {
        title: podcast.title,
        url: podcast.url
      }
    }));
  };

  const handleShare = async (podcast: Podcast) => {
    // We use the direct public domain to ensure shared links work for everyone without side-effects
    const baseUrl = "https://thetransformationroom.com/podcasts";
    const shareUrl = `${baseUrl}?id=${podcast.id}`;
    const shareData = {
      title: podcast.title,
      text: podcast.description,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Error copying link:", err);
      }
    }
  };

  const handleDownload = (podcast: Podcast) => {
    // In a real app, this would use an actual download link.
    // For now, we open the audio URL in a new tab which often triggers a download or direct playback.
    window.open(podcast.url, '_blank');
  };

  const podcastSchema = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    "name": "The Transformation Room Podcast",
    "description": "Strategic insights at the intersection of industrial systems, cognitive strategy, and workforce transformation.",
    "url": "https://thetransformationroom.com/podcasts",
    "author": {
      "@type": "Organization",
      "name": "The Transformation Room"
    },
    "publisher": ORGANIZATION_SCHEMA
  };

  return (
    <div className="bg-slate-950 min-h-screen pb-24 font-sans selection:bg-brand-secondary selection:text-brand-dark">
      <SEO 
        title="Supply Chain, Warehouse & Technology Transformation Podcasts"
        description="Listen to executive discussions on supply chain consulting, warehouse operations, technology implementation, and enterprise AI leadership from The Transformation Room."
        keywords="Supply chain podcast, warehouse operations podcast, technology consulting audio, AI operations insights, industrial automation podcast, The Transformation Room"
        url="https://thetransformationroom.com/podcasts"
        schema={podcastSchema}
      />
      {/* Hero Section */}
      <header className="relative py-32 bg-brand-primary overflow-hidden">
        <div className="absolute inset-0 bg-brand-dark/60 z-10" />
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&q=80&w=2000" 
            alt="Podcast Studio" 
            className="w-full h-full object-cover opacity-40 scale-105 blur-sm"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-secondary/20 border border-brand-secondary/30 rounded-full mb-6">
              <Sparkles className="w-3 h-3 text-brand-secondary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">The Transformation Room Studio</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {t("pod.hero.title")}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light mb-8">
              {t("pod.hero.desc")}
            </p>

            {/* Hero Spotify Action Button */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={SPOTIFY_PODCAST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#1DB954] hover:bg-[#1ed760] text-slate-950 rounded-full font-bold text-sm shadow-xl shadow-[#1DB954]/20 hover:shadow-[#1DB954]/40 hover:scale-105 active:scale-95 transition-all"
                title="Follow The Transformation Room on Spotify"
              >
                <SpotifyIcon className="w-5 h-5 fill-slate-950" />
                <span>{t("pod.spotify.follow")}</span>
                <ExternalLink className="w-4 h-4 ml-0.5 opacity-75" />
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Featured Podcast */}
      <section className="relative -mt-16 z-30 mb-20">
        <div className="max-w-7xl mx-auto px-4">
          {PODCASTS.filter(p => p.featured).map((podcast) => (
            <motion.div 
              key={podcast.id}
              id={`podcast-${podcast.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-brand-secondary/10 transition-all duration-700" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
                  <img 
                    src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800" 
                    alt="Latest Episode" 
                    className="w-full h-full object-cover rounded-3xl shadow-2xl border border-white/5"
                    loading="lazy"
                  />
                  <button 
                    onClick={() => playPodcast(podcast)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 group/play transition-all duration-500 rounded-3xl"
                    aria-label="Play Podcast"
                  >
                    <div className="w-20 h-20 bg-brand-secondary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.3)] group-hover/play:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-brand-dark fill-current ml-1" />
                    </div>
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-brand-secondary text-brand-dark px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {t("pod.badge.featured")}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <Clock className="w-4 h-4" />
                      {t("pod.tag.digital")}
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {t(`pod.data.${podcast.id}.title`) || podcast.title}
                  </h2>
                  <p className="text-lg text-slate-300 mb-8 leading-relaxed font-light">
                    {t(`pod.data.${podcast.id}.desc`) || podcast.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="bg-brand-secondary text-brand-dark px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-brand-secondary/20"
                      onClick={() => playPodcast(podcast)}
                    >
                      <Play className="w-5 h-5 fill-current" />
                      {t("pod.listen")}
                    </button>
                    <a
                      href={SPOTIFY_PODCAST_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1DB954]/10 border border-[#1DB954]/40 hover:bg-[#1DB954] text-[#1DB954] hover:text-slate-950 px-6 py-4 rounded-xl font-bold flex items-center gap-2.5 transition-all shadow-lg hover:shadow-[#1DB954]/30"
                      title="Listen to this show on Spotify"
                    >
                      <SpotifyIcon className="w-5 h-5" />
                      <span>{t("pod.spotify.open")}</span>
                    </a>
                    <button 
                      onClick={() => handleShare(podcast)}
                      className="bg-white/5 border border-white/10 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                      title="Share Episode"
                    >
                      <Share2 className="w-5 h-5" />
                      {t("pod.share")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Spotify Dedicated Follow Banner */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-slate-900 via-[#1DB954]/10 to-slate-900 border border-[#1DB954]/30 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#1DB954]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-left w-full md:w-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#1DB954]/20 border border-[#1DB954]/40 flex items-center justify-center text-[#1DB954] shrink-0 shadow-lg shadow-[#1DB954]/20">
                <SpotifyIcon className="w-8 h-8 fill-[#1DB954]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#1DB954]/20 border border-[#1DB954]/40 text-[#1DB954]">
                    {t("pod.spotify.badge")}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {t("pod.spotify.banner.title")}
                </h3>
                <p className="text-sm text-slate-300 max-w-xl font-light leading-relaxed">
                  {t("pod.spotify.banner.desc")}
                </p>
              </div>
            </div>

            <a
              href={SPOTIFY_PODCAST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-7 py-4 bg-[#1DB954] hover:bg-[#1ed760] text-slate-950 font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-[#1DB954]/25 hover:shadow-[#1DB954]/40 hover:scale-105 active:scale-95 transition-all text-sm shrink-0"
            >
              <SpotifyIcon className="w-5 h-5 fill-slate-950" />
              <span>{t("pod.spotify.follow")}</span>
              <ExternalLink className="w-4 h-4 ml-1 opacity-75" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Library Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-3xl font-bold text-white tracking-tight">{t("pod.library.title")}</h3>
          <div className="w-1/2 h-px bg-slate-800 hidden md:block" />
          <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">
            {PODCASTS.length} {t("pod.episodes")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PODCASTS.map((podcast, i) => (
            <motion.div 
              key={podcast.id}
              id={`podcast-${podcast.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-brand-secondary/50 hover:bg-slate-900 transition-all group flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-secondary border border-brand-primary/30 group-hover:scale-110 transition-transform">
                  <Headphones className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleShare(podcast)}
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                    title="Share Episode"
                    aria-label="Share Episode"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDownload(podcast)}
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                    title="Download Episode"
                    aria-label="Download Episode"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary mb-3 block">
                {t(`pod.data.${podcast.id}.type`) || podcast.type || "Operational Intelligence"}
              </span>
              <h4 className="text-xl font-bold text-white mb-4 group-hover:text-brand-secondary transition-colors">
                {t(`pod.data.${podcast.id}.title`) || podcast.title}
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed font-light mb-8 flex-grow">
                {t(`pod.data.${podcast.id}.desc`) || podcast.description}
              </p>

              <button 
                onClick={() => playPodcast(podcast)}
                className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-brand-secondary group-hover:text-brand-dark group-hover:border-transparent transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                {t("pod.listenEpisode")}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 mt-32 text-center pb-24">
        <div className="bg-brand-primary/20 border border-brand-primary/30 rounded-[3rem] p-12 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/5 to-transparent pointer-events-none" />
          <h3 className="text-3xl font-bold text-white mb-6 relative z-10">{t("pod.cta.title")}</h3>
          <p className="text-slate-300 mb-10 text-lg font-light relative z-10">
            {t("pod.cta.desc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
            <a
              href={SPOTIFY_PODCAST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-5 bg-[#1DB954] hover:bg-[#1ed760] text-slate-950 rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-[#1DB954]/25 hover:shadow-[#1DB954]/40 hover:scale-105 active:scale-95 transition-all"
            >
              <SpotifyIcon className="w-5 h-5 fill-slate-950" />
              <span>{t("pod.spotify.follow")}</span>
              <ExternalLink className="w-4 h-4 ml-1 opacity-75" />
            </a>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat', { detail: { type: 'organization', prompt: "Tell me more about the transformation paths mentioned in the podcast." } }))}
              className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-8 py-5 rounded-2xl font-bold text-base hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              {t("pod.cta.ask")} <Sparkles className="w-5 h-5 text-brand-secondary" />
            </button>
          </div>
        </div>
      </section>


    </div>
  );
};

export default PodcastLibrary;
