import React, { useEffect, useRef, useState } from 'react';

interface ReversibleVideoProps {
  src: string;
  className?: string;
  playbackRate?: number;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  [key: string]: any; // For any additional props
}

const ReversibleVideo: React.FC<ReversibleVideoProps> = ({
  src,
  className = '',
  playbackRate = 0.5, // Default to 50% speed
  autoPlay = true,
  muted = true, // Default to muted for autoplay to work reliably
  controls = false, // Default to no controls for hero videos
  playsInline = true,
  ...rest
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  // Function to play video forward
  const playForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = playbackRate;
    setIsReversing(false);
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Autoplay prevented, need user interaction:', error);
      });
    }
  };

  // Function to play video in reverse
  const playReverse = () => {
    const video = videoRef.current;
    if (!video) return;
    
    setIsReversing(true);
    
    // Use requestAnimationFrame to manually control playback
    const reversePlayback = () => {
      if (!video || !isReversing) return;
      
      // Decrease current time to create reverse effect
      if (video.currentTime > 0.1) {
        video.currentTime -= 0.05 * playbackRate;
        animationFrameRef.current = requestAnimationFrame(reversePlayback);
      } else {
        // When we reach the beginning, play forward again
        setIsReversing(false);
        playForward();
      }
    };
    
    // Start reverse playback
    animationFrameRef.current = requestAnimationFrame(reversePlayback);
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.playbackRate = playbackRate;
      
      // Add event listeners to track video state
      const handleLoadedMetadata = () => {
        console.log('Video metadata loaded:', src);
        videoElement.playbackRate = playbackRate;
      };
      
      const handlePlay = () => {
        console.log('Video started playing:', src);
        setIsLoading(false);
      };
      
      const handleError = (e: any) => {
        console.error('Video error:', e);
        setHasError(true);
        setIsLoading(false);
      };
      
      const handleCanPlay = () => {
        console.log('Video can play:', src);
        if (autoPlay) {
          playForward();
        }
      };
      
      // When video ends, play it in reverse
      const handleEnded = () => {
        console.log('Video ended, playing in reverse');
        playReverse();
      };
      
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('error', handleError);
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('ended', handleEnded);
      
      // Force video to load
      videoElement.load();
      
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('error', handleError);
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('ended', handleEnded);
        
        // Clean up animation frame
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [src, playbackRate, autoPlay]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="text-red-500">Error loading video</div>
        </div>
      )}
      <video
        ref={videoRef}
        src={src}
        className={className}
        autoPlay={autoPlay}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
        {...rest}
      />
    </div>
  );
};

export default ReversibleVideo;
