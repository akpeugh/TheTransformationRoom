import { useState, useRef, useEffect } from 'react';
import { X, Headphones, Podcast, ExternalLink } from 'lucide-react';
import { SPOTIFY_PODCAST_URL } from '../constants';

const SpotifyIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.306c-.216.353-.674.464-1.027.248-2.812-1.718-6.352-2.107-10.52-1.155-.403.092-.806-.16-.898-.563-.092-.403.16-.806.563-.898 4.567-1.043 8.49-.603 11.634 1.341.353.216.464.674.248 1.027zm1.467-3.26c-.272.443-.852.585-1.295.313-3.22-1.978-8.128-2.55-11.936-1.393-.497.151-1.027-.133-1.178-.63-.151-.497.133-1.027.63-1.178 4.356-1.321 9.774-.683 13.466 1.593.443.272.585.852.313 1.295zm.126-3.411c-3.86-2.292-10.228-2.504-13.916-1.384-.593.18-1.222-.16-1.402-.753-.18-.593.16-1.222.753-1.402 4.242-1.288 11.278-1.042 15.719 1.593.533.317.708 1.008.392 1.541-.316.533-1.008.708-1.546.405z" />
    </svg>
);

export const GlobalPodcastPlayer = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [podcastUrl, setPodcastUrl] = useState("https://storage.googleapis.com/thetransformationroomassets/Scaling_Beyond_Legacy_Heroics.m4a");
    const [podcastTitle, setPodcastTitle] = useState("Scaling Beyond Legacy Heroics");
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const handlePlayPodcast = (e: any) => {
            if (e.detail?.url) {
                setPodcastUrl(e.detail.url);
            }
            if (e.detail?.title) {
                setPodcastTitle(e.detail.title);
            }
            setIsVisible(true);
            
            // Play immediately to circumvent Safari user-action blocking duration constraints
            if (audioRef.current) {
                audioRef.current.play().catch(err => console.warn('Autoplay prevented:', err));
            }
        };

        window.addEventListener('play-global-podcast', handlePlayPodcast);
        return () => window.removeEventListener('play-global-podcast', handlePlayPodcast);
    }, []);

    const handleClose = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsVisible(false);
    };

    return (
        <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:w-96 z-[99999] transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-[150%] opacity-0 pointer-events-none'}`}>
            <div className="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 text-brand-secondary">
                        <Headphones className="w-5 h-5" />
                        <span className="font-bold text-xs tracking-widest uppercase">Now Playing</span>
                    </div>
                    <button onClick={handleClose} aria-label="Close podcast player" className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                        <h4 className="text-white font-bold text-base line-clamp-2">{podcastTitle}</h4>
                        <p className="text-slate-400 text-xs">The Transformation Room</p>
                    </div>
                    <a
                        href={SPOTIFY_PODCAST_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1DB954]/15 hover:bg-[#1DB954] text-[#1DB954] hover:text-slate-950 border border-[#1DB954]/30 text-[11px] font-bold transition-all shrink-0"
                        title="Open on Spotify"
                    >
                        <SpotifyIcon className="w-3.5 h-3.5" />
                        <span>Spotify</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                </div>
                {/* The single audio element is always in the DOM but its container toggles visibility */}
                <audio
                    ref={audioRef}
                    src={podcastUrl}
                    className="w-full h-10"
                    controls
                />
            </div>
        </div>
    );
};
