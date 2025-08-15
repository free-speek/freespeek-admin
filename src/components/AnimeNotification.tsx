import React, { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.js";

interface AnimeNotificationProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  isVisible: boolean;
  onClose?: () => void;
}

const AnimeNotification: React.FC<AnimeNotificationProps> = ({
  message,
  type = "success",
  isVisible,
  onClose,
}) => {
  const notificationRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const typeStyles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: "text-green-600",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: "text-red-600",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: "text-yellow-600",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: "text-blue-600",
    },
  };

  const styles = typeStyles[type];

  useEffect(() => {
    if (!notificationRef.current || !isVisible) return;

    const notification = notificationRef.current;
    const icon = iconRef.current;

    anime({
      targets: notification,
      translateX: [-100, 0],
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 600,
      easing: "easeOutElastic",
    });

    if (icon) {
      anime({
        targets: icon,
        rotate: [0, 360],
        scale: [0, 1],
        duration: 800,
        delay: 200,
        easing: "easeOutBack",
      });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={notificationRef}
      className={`flex items-center space-x-2 ${styles.bg} ${styles.border} rounded-lg px-4 py-2 shadow-lg`}
    >
      <div
        ref={iconRef}
        className={`w-6 h-6 ${styles.icon} flex items-center justify-center`}
      >
        {type === "success" && (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {type === "error" && (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {type === "warning" && (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {type === "info" && (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <span className={`text-sm font-medium ${styles.text}`}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className={`ml-auto ${styles.icon} hover:opacity-75 transition-opacity`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AnimeNotification;
