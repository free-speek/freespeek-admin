import React from "react";

interface AppStoreLinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const AppStoreLink: React.FC<AppStoreLinkProps> = ({
  href = "#",
  children,
  className = "",
  onClick,
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium ${className}`}
    >
      {children}
    </a>
  );
};

export default AppStoreLink;
