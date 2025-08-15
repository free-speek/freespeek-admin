import React, { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.js";

interface AnimeLoaderProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

const AnimeLoader: React.FC<AnimeLoaderProps> = ({
  size = "md",
  color = "#3B82F6",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<HTMLDivElement[]>([]);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const circles = circlesRef.current;

    anime({
      targets: circles,
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      duration: 1500,
      delay: anime.stagger(200),
      loop: true,
      easing: "easeInOutQuad",
    });
  }, []);

  const addCircleRef = (el: HTMLDivElement | null) => {
    if (el && !circlesRef.current.includes(el)) {
      circlesRef.current.push(el);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center ${sizeClasses[size]}`}
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          ref={addCircleRef}
          className="absolute rounded-full"
          style={{
            width: size === "sm" ? "8px" : size === "md" ? "12px" : "16px",
            height: size === "sm" ? "8px" : size === "md" ? "12px" : "16px",
            backgroundColor: color,
            transform: `rotate(${index * 120}deg) translateY(-${
              size === "sm" ? "12px" : size === "md" ? "18px" : "24px"
            })`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimeLoader;
