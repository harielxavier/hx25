import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom' | 'left' | 'right';
  onAnimationComplete?: () => void;
  className?: string;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 0,
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getInitialPosition = () => {
    switch (direction) {
      case 'top':
        return { y: -20, opacity: 0, filter: 'blur(10px)' };
      case 'bottom':
        return { y: 20, opacity: 0, filter: 'blur(10px)' };
      case 'left':
        return { x: -20, opacity: 0, filter: 'blur(10px)' };
      case 'right':
        return { x: 20, opacity: 0, filter: 'blur(10px)' };
      default:
        return { y: -20, opacity: 0, filter: 'blur(10px)' };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case 'top':
      case 'bottom':
        return { y: 0, opacity: 1, filter: 'blur(0px)' };
      case 'left':
      case 'right':
        return { x: 0, opacity: 1, filter: 'blur(0px)' };
      default:
        return { y: 0, opacity: 1, filter: 'blur(0px)' };
    }
  };

  const splitText = () => {
    if (animateBy === 'words') {
      return text.split(' ');
    } else {
      return text.split('');
    }
  };

  const textElements = splitText();

  return (
    <div className={className}>
      {textElements.map((element, index) => (
        <motion.span
          key={index}
          initial={getInitialPosition()}
          animate={isVisible ? getAnimatePosition() : getInitialPosition()}
          transition={{
            duration: 0.8,
            delay: index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          onAnimationComplete={() => {
            if (index === textElements.length - 1 && onAnimationComplete) {
              onAnimationComplete();
            }
          }}
          style={{ display: 'inline-block', marginRight: animateBy === 'words' ? '0.25em' : '0' }}
        >
          {element}
        </motion.span>
      ))}
    </div>
  );
};

export default BlurText;
