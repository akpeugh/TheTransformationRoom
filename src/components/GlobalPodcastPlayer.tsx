import { useState, useRef, useEffect } from 'react';
import { X, Headphones, Podcast } from 'lucide-react';

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
                <div className="mb-4">
                    <h4 className="text-white font-bold text-base line-clamp-2">{podcastTitle}</h4>
                    <p className="text-slate-400 text-xs">The Transformation Room</p>
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
