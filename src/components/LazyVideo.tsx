import React, { useRef, useEffect, useState } from 'react';

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

export const LazyVideo: React.FC<LazyVideoProps> = ({ src, className = '', onCanPlay, ...props }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoad && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented; ignore or handled gracefully
        });
      }
    }
  }, [shouldLoad]);

  return (
    <video
      aria-label="Video presentation" 
      ref={videoRef}
      muted
      playsInline
      loop
      autoPlay
      className={`transition-opacity duration-700 ease-out ${isPlaying ? 'opacity-100' : 'opacity-0'} ${className}`}
      onPlaying={(e) => {
        setIsPlaying(true);
        if (props.onPlaying) props.onPlaying(e);
      }}
      onCanPlay={(e) => {
        setIsPlaying(true);
        if (onCanPlay) onCanPlay(e);
      }}
      {...props}
      src={shouldLoad ? src : undefined}
    />
  );
};
