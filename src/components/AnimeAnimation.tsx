import React, { useEffect, useRef } from "react";

// Dynamic import for anime.js
let anime: any = null;
import("animejs").then((module) => {
  anime = module.default;
});

interface AnimeAnimationProps {
  children: React.ReactNode;
  animationType: "fadeIn" | "slideIn" | "bounce" | "pulse" | "rotate" | "scale";
  duration?: number;
  delay?: number;
  easing?: string;
  className?: string;
  style?: React.CSSProperties;
}

const AnimeAnimation: React.FC<AnimeAnimationProps> = ({
  children,
  animationType,
  duration = 1000,
  delay = 0,
  easing = "easeOutElastic",
  className,
  style,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const animations = {
      fadeIn: {
        opacity: [0, 1],
        translateY: [20, 0],
      },
      slideIn: {
        translateX: [-50, 0],
        opacity: [0, 1],
      },
      bounce: {
        translateY: [0, -20, 0],
        scale: [1, 1.1, 1],
      },
      pulse: {
        scale: [1, 1.2, 1],
        opacity: [1, 0.8, 1],
      },
      rotate: {
        rotate: [0, 360],
      },
      scale: {
        scale: [0, 1],
        opacity: [0, 1],
      },
    };

    const animation = animations[animationType];

    anime({
      targets: element,
      ...animation,
      duration,
      delay,
      easing,
    });
  }, [animationType, duration, delay, easing]);

  return (
    <div ref={elementRef} className={className} style={style}>
      {children}
    </div>
  );
};

export default AnimeAnimation;
