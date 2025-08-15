import React, { useEffect, useRef, useState } from "react";

interface AnimatedTextProps {
  children: React.ReactNode;
  animationType?:
    | "typewriter"
    | "fadeIn"
    | "slideIn"
    | "bounce"
    | "glow"
    | "pulse";
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  animationType = "fadeIn",
  duration = 1000,
  delay = 0,
  className,
  style,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (animationType === "typewriter" && isVisible) {
      const text = children?.toString() || "";
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        } else {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [animationType, isVisible, currentIndex, children]);

  const getAnimationStyles = () => {
    const baseStyle = {
      transition: `all ${duration}ms ease-out`,
      ...style,
    };

    const animations = {
      typewriter: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(-10px)",
      },
      fadeIn: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(10px)",
      },
      slideIn: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(-30px)",
      },
      bounce: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.8)",
        animation: isVisible ? "textBounce 0.6s ease-out" : "none",
      },
      glow: {
        opacity: isVisible ? 1 : 0,
        textShadow: isVisible ? "0 0 10px rgba(59, 130, 246, 0.5)" : "none",
        animation: isVisible ? "textGlow 2s infinite" : "none",
      },
      pulse: {
        opacity: isVisible ? 1 : 0,
        animation: isVisible ? "textPulse 2s infinite" : "none",
      },
    };

    return { ...baseStyle, ...animations[animationType] };
  };

  const renderContent = () => {
    if (animationType === "typewriter") {
      return displayText;
    }
    return children;
  };

  return (
    <div ref={elementRef} className={className} style={getAnimationStyles()}>
      {renderContent()}
    </div>
  );
};

export default AnimatedText;
