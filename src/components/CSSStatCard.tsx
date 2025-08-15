import React, { useEffect, useRef, useState } from "react";
import AnimatedText from "./AnimatedText";
import AnimatedCounter from "./AnimatedCounter";

interface CSSStatCardProps {
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
  animateValue?: boolean;
}

const CSSStatCard: React.FC<CSSStatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
  subtitle,
  onClick,
  animationType = "fadeIn",
  delay = 0,
  animateValue = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getCardStyles = () => {
    const baseStyle = {
      transition: "all 0.8s ease-out",
    };

    const animations = {
      fadeIn: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
      },
      slideIn: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(-100px)",
      },
      bounce: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.9)",
        animation: isVisible ? "bounce 0.6s ease-out" : "none",
      },
      pulse: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.8)",
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

  const getIconStyles = () => {
    const baseStyle = {
      transition: "all 0.6s ease-out",
    };

    const hoverStyle = isHovered
      ? {
          transform: "scale(1.2) rotate(10deg)",
        }
      : {};

    return { ...baseStyle, ...hoverStyle };
  };

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
      style={getCardStyles()}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <AnimatedText
            animationType="fadeIn"
            delay={delay + 200}
            className="text-sm font-medium text-gray-600 mb-1"
          >
            {title}
          </AnimatedText>
          <AnimatedText
            animationType="slideIn"
            delay={delay + 400}
            className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1"
          >
            {typeof value === "number" && animateValue ? (
              <AnimatedCounter
                value={value}
                delay={delay + 600}
                duration={1500}
                className="text-2xl lg:text-3xl font-bold text-gray-900"
              />
            ) : (
              value
            )}
          </AnimatedText>
          {subtitle && (
            <AnimatedText
              animationType="fadeIn"
              delay={delay + 600}
              className="text-xs lg:text-sm text-gray-500"
            >
              {subtitle}
            </AnimatedText>
          )}
        </div>
        <div
          ref={iconRef}
          className={`p-3 lg:p-4 rounded-lg ${iconColor} ml-4`}
          style={getIconStyles()}
        >
          <Icon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default CSSStatCard;
