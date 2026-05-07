import { motion } from "motion/react";
import { Headphones, Play, ArrowRight, Sparkles, Clock, Share2, Download } from "lucide-react";
import { PODCASTS, Podcast } from "../data/podcasts";
import { ScorecardTool } from "../components/ScorecardTool";

const PodcastLibrary = () => {
  const playPodcast = (podcast: Podcast) => {
    window.dispatchEvent(new CustomEvent('play-global-podcast', {
      detail: {
        title: podcast.title,
        url: podcast.url
      }
    }));
  };

  return (
    <div className="bg-slate-950 min-h-screen pb-24 font-sans selection:bg-brand-secondary selection:text-brand-dark">
      {/* Hero Section */}
      <header className="relative py-32 bg-brand-primary overflow-hidden">
        <div className="absolute inset-0 bg-brand-dark/60 z-10" />
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&q=80&w=2000" 
            alt="Podcast Studio" 
            className="w-full h-full object-cover opacity-40 scale-105 blur-sm"
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
              Podcast <span className="text-brand-secondary">Library.</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
              Conversations at the intersection of industrial systems, cognitive strategy, and workforce transformation.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Featured Podcast */}
      <section className="relative -mt-16 z-30 mb-24">
        <div className="max-w-7xl mx-auto px-4">
          {PODCASTS.filter(p => p.featured).map((podcast) => (
            <motion.div 
              key={podcast.id}
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
                  />
                  <button 
                    onClick={() => playPodcast(podcast)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 group/play transition-all duration-500 rounded-3xl"
                  >
                    <div className="w-20 h-20 bg-brand-secondary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.3)] group-hover/play:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-brand-dark fill-current ml-1" />
                    </div>
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-brand-secondary text-brand-dark px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Featured Episode
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <Clock className="w-4 h-4" />
                      Digital Strategy
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {podcast.title}
                  </h2>
                  <p className="text-lg text-slate-300 mb-8 leading-relaxed font-light">
                    {podcast.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="bg-brand-secondary text-brand-dark px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-brand-secondary/20"
                      onClick={() => playPodcast(podcast)}
                    >
                      <Play className="w-5 h-5 fill-current" />
                      Listen Now
                    </button>
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat', { detail: { type: 'organization', prompt: `Could you provide a detailed summary or transcript for the podcast episode "${podcast.title}"?` } }))}
                      className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                    >
                      Episode Transcript
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Library Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-3xl font-bold text-white tracking-tight">Full Library</h3>
          <div className="w-1/2 h-px bg-slate-800 hidden md:block" />
          <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">
            {PODCASTS.length} Episodes
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PODCASTS.map((podcast, i) => (
            <motion.div 
              key={podcast.id}
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
                  <button className="p-2 text-slate-500 hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary mb-3 block">
                {podcast.type || "Operational Intelligence"}
              </span>
              <h4 className="text-xl font-bold text-white mb-4 group-hover:text-brand-secondary transition-colors">
                {podcast.title}
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed font-light mb-8 flex-grow">
                {podcast.description}
              </p>

              <button 
                onClick={() => playPodcast(podcast)}
                className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-brand-secondary group-hover:text-brand-dark group-hover:border-transparent transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                Listen Episode
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 mt-32 text-center pb-24">
        <div className="bg-brand-primary/20 border border-brand-primary/30 rounded-[3rem] p-12 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/5 to-transparent pointer-events-none" />
          <h3 className="text-3xl font-bold text-white mb-6 relative z-10">Reclaim Your Institutional Velocity.</h3>
          <p className="text-slate-300 mb-10 text-lg font-light relative z-10">
            Don't let operational bureaucracy stifle your growth. Our strategy sessions dive deep into your unique bottlenecks to build high-output systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button 
              onClick={() => document.getElementById('strategic-scorecard-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-brand-secondary text-brand-dark px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white transition-all shadow-xl shadow-brand-secondary/20 flex items-center justify-center gap-2 group"
            >
              Start Strategic Assessment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('ais:open-chat', { detail: { type: 'organization', prompt: "Tell me more about the transformation paths mentioned in the podcast." } }))}
              className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              Ask NOVA <Sparkles className="w-5 h-5 text-brand-secondary" />
            </button>
          </div>
        </div>
      </section>

      {/* Scorecard Tool */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-4">Establish Your Baseline</h3>
          <p className="text-slate-400 font-light max-w-xl mx-auto">Take 2 minutes to reveal your operational maturity and get a custom transformation roadmap.</p>
        </div>
        <ScorecardTool />
      </section>
    </div>
  );
};

export default PodcastLibrary;
