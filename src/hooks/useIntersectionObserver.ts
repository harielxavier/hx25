import { useEffect, useRef, useState } from 'react';

type IntersectionObserverOptions = {
  rootMargin?: string;
  threshold?: number | number[];
};

export function useIntersectionObserver(options?: IntersectionObserverOptions) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<Element>(null);
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    observer.current = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.current.observe(currentRef);
    }

    return () => {
      if (currentRef && observer.current) {
        observer.current.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isIntersecting] as const;
}
