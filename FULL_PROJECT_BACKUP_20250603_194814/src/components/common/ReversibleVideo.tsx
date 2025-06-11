import React, { useRef, useEffect, useState } from 'react';

interface ReversibleVideoProps {
  src: string;
  className?: string;
  playbackRate?: number;
  autoPlay?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  loop?: boolean;
}

const ReversibleVideo: React.FC<ReversibleVideoProps> = ({
  src,
  className = '',
  playbackRate = 1,
  autoPlay = true,
  muted = true,
  playsInline = true,
  controls = false,
  loop = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set playback rate
    video.playbackRate = playbackRate;

    // Handle autoplay
    if (autoPlay) {
      video.play().catch(error => {
        console.error('Error attempting to autoplay video:', error);
        setIsPlaying(false);
      });
    }
  }, [autoPlay, playbackRate]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
        loop={loop}
        onClick={togglePlayPause}
      />
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlayPause}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReversibleVideo;
