import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number; // duration in seconds
  formatter?: (v: number) => string;
}

export default function AnimatedCounter({
  value,
  duration = 1.5,
  formatter = (v: number) => v.toLocaleString(),
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasTriggered]);

  useEffect(() => {
    if (!hasTriggered) return;

    let startTimestamp: number | null = null;
    const startValue = 0;
    const endValue = value;
    setIsComplete(false);

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easedProgress);
      
      setCount(currentValue);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
        setIsComplete(true);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration, hasTriggered]);

  return (
    <span 
      ref={elementRef} 
      className="mono-num inline-block transition-all duration-300"
      style={{
        filter: hasTriggered && !isComplete ? `blur(${Math.max(0, 2 - (count / value) * 2)}px)` : 'blur(0px)',
        transform: isComplete ? 'scale(1)' : 'scale(0.98)',
      }}
    >
      {formatter(count)}
    </span>
  );
}
