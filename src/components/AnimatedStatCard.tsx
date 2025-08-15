import React, { useEffect, useRef, useState } from "react";
import anime from "animejs/lib/anime.js";

interface AnimatedStatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  iconColor: string;
  subtitle?: string;
  onClick?: () => void;
  animationType?:
    | "fadeIn"
    | "slideIn"
    | "bounce"
    | "pulse"
    | "rotate"
    | "scale";
  delay?: number;
}

const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
  subtitle,
  onClick,
  animationType = "fadeIn",
  delay = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const icon = iconRef.current;

    const animations = {
      fadeIn: {
        opacity: [0, 1],
        translateY: [30, 0],
      },
      slideIn: {
        translateX: [-100, 0],
        opacity: [0, 1],
      },
      bounce: {
        translateY: [0, -10, 0],
        scale: [0.9, 1.05, 1],
      },
      pulse: {
        scale: [0.8, 1.1, 1],
        opacity: [0, 1],
      },
      rotate: {
        rotate: [0, 360],
        scale: [0, 1],
      },
      scale: {
        scale: [0, 1],
        opacity: [0, 1],
      },
    };

    const animation = animations[animationType];

    anime({
      targets: card,
      ...animation,
      duration: 800,
      delay,
      easing: "easeOutElastic",
    });

    if (icon) {
      anime({
        targets: icon,
        rotate: [0, 360],
        scale: [0, 1],
        duration: 600,
        delay: delay + 200,
        easing: "easeOutBack",
      });
    }
  }, [animationType, delay]);

  useEffect(() => {
    if (!iconRef.current || !isHovered) return;

    anime({
      targets: iconRef.current,
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      duration: 600,
      easing: "easeInOutQuad",
    });
  }, [isHovered]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      ref={cardRef}
      className={`card h-auto min-h-[8rem] ${
        onClick
          ? "cursor-pointer hover:shadow-lg transition-shadow duration-200"
          : ""
      }`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs lg:text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <div
          ref={iconRef}
          className={`p-3 lg:p-4 rounded-lg ${iconColor} ml-4`}
        >
          <Icon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default AnimatedStatCard;
