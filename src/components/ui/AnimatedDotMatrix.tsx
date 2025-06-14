import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

interface AnimatedDotMatrixProps {
  className?: string;
  dotSize?: number;
  dotColor?: string;
  animationSpeed?: number;
}

export const AnimatedDotMatrix: React.FC<AnimatedDotMatrixProps> = ({
  className,
  dotSize = 2,
  dotColor = 'rgba(255, 255, 255, 0.3)',
  animationSpeed = 2000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const gridSize = 20;
    const dots: Array<{
      x: number;
      y: number;
      opacity: number;
      targetOpacity: number;
      delay: number;
    }> = [];

    // Create dot grid
    const cols = Math.ceil(canvas.width / (gridSize * window.devicePixelRatio));
    const rows = Math.ceil(canvas.height / (gridSize * window.devicePixelRatio));

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        dots.push({
          x: i * gridSize,
          y: j * gridSize,
          opacity: 0,
          targetOpacity: Math.random() * 0.8 + 0.2,
          delay: Math.random() * animationSpeed,
        });
      }
    }

    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      dots.forEach((dot) => {
        // Calculate animation progress
        const progress = Math.max(0, (elapsed - dot.delay) / 1000);
        
        // Animate from center outward
        const centerX = (canvas.width / window.devicePixelRatio) / 2;
        const centerY = (canvas.height / window.devicePixelRatio) / 2;
        const distance = Math.sqrt(Math.pow(dot.x - centerX, 2) + Math.pow(dot.y - centerY, 2));
        const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
        const normalizedDistance = distance / maxDistance;
        
        // Staggered animation based on distance from center
        const animationDelay = normalizedDistance * 2000;
        const dotProgress = Math.max(0, (elapsed - animationDelay) / 1000);
        
        if (dotProgress > 0) {
          dot.opacity = Math.min(dot.targetOpacity, dotProgress * dot.targetOpacity);
        }

        // Draw dot
        if (dot.opacity > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Continue animation
      if (elapsed < animationSpeed + 3000) {
        requestAnimationFrame(animate);
      } else {
        // Restart animation
        startTime = Date.now();
        dots.forEach(dot => {
          dot.opacity = 0;
          dot.delay = Math.random() * animationSpeed;
        });
        requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [dotSize, dotColor, animationSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full", className)}
      style={{ pointerEvents: 'none' }}
    />
  );
};