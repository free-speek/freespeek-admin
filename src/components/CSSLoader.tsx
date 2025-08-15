import React from "react";

interface CSSLoaderProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

const CSSLoader: React.FC<CSSLoaderProps> = ({
  size = "md",
  color = "#3B82F6",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]}`}>
      <div
        className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"
        style={{
          width: size === "sm" ? "32px" : size === "md" ? "48px" : "64px",
          height: size === "sm" ? "32px" : size === "md" ? "48px" : "64px",
          borderTopColor: color,
        }}
      />
    </div>
  );
};

export default CSSLoader;
