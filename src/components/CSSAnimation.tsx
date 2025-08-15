import React, { useEffect, useRef, useState } from "react";

interface CSSAnimationProps {
  children: React.ReactNode;
  animationType: "fadeIn" | "slideIn" | "bounce" | "pulse" | "rotate" | "scale";
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

const CSSAnimation: React.FC<CSSAnimationProps> = ({
  children,
  animationType,
  duration = 1000,
  delay = 0,
  className,
  style,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationStyles = () => {
    const baseStyle = {
      transition: `all ${duration}ms ease-out`,
      ...style,
    };

    const animations = {
      fadeIn: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
      },
      slideIn: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(-50px)",
      },
      bounce: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.8)",
        animation: isVisible ? "bounce 0.6s ease-out" : "none",
      },
      pulse: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.9)",
        animation: isVisible ? "pulse 2s infinite" : "none",
      },
      rotate: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "rotate(0deg)" : "rotate(360deg)",
      },
      scale: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0)",
      },
    };

    return { ...baseStyle, ...animations[animationType] };
  };

  return (
    <div ref={elementRef} className={className} style={getAnimationStyles()}>
      {children}
    </div>
  );
};

export default CSSAnimation;
