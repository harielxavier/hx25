import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
  onError?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  poster,
  autoPlay = false,
  className = '',
  onError
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Format time in MM:SS format
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Update progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / duration) * 100);
    }
  };

  // Set video duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = (seekTime / 100) * duration;
    }
  };

  // Handle video error
  const handleError = () => {
    console.error("Video error: Could not load video from source:", src);
    if (onError) {
      onError();
    }
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    const hideControls = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };

    const showControlsOnMove = () => {
      setShowControls(true);
      
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
      
      if (isPlaying) {
        controlsTimeout.current = setTimeout(hideControls, 3000);
      }
    };

    const playerElement = playerRef.current;
    if (playerElement) {
      playerElement.addEventListener('mousemove', showControlsOnMove);
      playerElement.addEventListener('mouseenter', showControlsOnMove);
    }

    return () => {
      if (playerElement) {
        playerElement.removeEventListener('mousemove', showControlsOnMove);
        playerElement.removeEventListener('mouseenter', showControlsOnMove);
      }
      
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [isPlaying]);

  return (
    <div 
      ref={playerRef}
      className={`relative overflow-hidden rounded-lg ${className}`}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {title && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent z-10 p-4">
          <h3 className="text-white font-medium">{title}</h3>
        </div>
      )}
      
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onError={handleError}
        playsInline
      />
      
      {/* Video Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="flex items-center mb-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
            }}
          />
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={togglePlay}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button 
              onClick={toggleMute}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          <button 
            onClick={toggleFullscreen}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
      
      {/* Play Button Overlay */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Play size={32} className="text-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
