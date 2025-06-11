import React, { useEffect, useRef, useState } from 'react';

interface SlowMotionVideoProps {
  src: string;
  className?: string;
  playbackRate?: number;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  [key: string]: any; // For any additional props
}

const SlowMotionVideo: React.FC<SlowMotionVideoProps> = ({
  src,
  className = '',
  playbackRate = 0.5, // Default to 50% speed
  autoPlay = true,
  muted = false, // Default to unmuted
  loop = true,
  playsInline = true,
  ...rest
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
        // Force play attempt
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Autoplay prevented, need user interaction:', error);
          });
        }
      };
      
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('error', handleError);
      videoElement.addEventListener('canplay', handleCanPlay);
      
      // Force video to load
      videoElement.load();
      
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('error', handleError);
        videoElement.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [src, playbackRate]);

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
        loop={loop}
        playsInline={playsInline}
        controls
        {...rest}
      />
    </div>
  );
};

export default SlowMotionVideo;
