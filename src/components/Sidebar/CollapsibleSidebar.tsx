import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CollapsibleNavigationItem } from "../../types/navigation";

interface CollapsibleSidebarProps {
  items: CollapsibleNavigationItem[];
  onItemClick?: (item: CollapsibleNavigationItem) => void;
}

const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    Mail: require("lucide-react").Mail,
    Save: require("lucide-react").Save,
    Plus: require("lucide-react").Plus,
    Users: require("lucide-react").Users,
    FileText: require("lucide-react").FileText,
    BarChart3: require("lucide-react").BarChart3,
    Clock: require("lucide-react").Clock,
    Settings: require("lucide-react").Settings,
    LayoutDashboard: require("lucide-react").LayoutDashboard,
    UserPlus: require("lucide-react").UserPlus,
    MessageCircle: require("lucide-react").MessageCircle,
    MessageSquare: require("lucide-react").MessageSquare,
    Activity: require("lucide-react").Activity,
    Sparkles: require("lucide-react").Sparkles,
    UserCheck: require("lucide-react").UserCheck,
    Upload: require("lucide-react").Upload,
    TrendingUp: require("lucide-react").TrendingUp,
    FileBarChart: require("lucide-react").FileBarChart,
    Cog: require("lucide-react").Cog,
  };
  return iconMap[iconName] || require("lucide-react").Mail;
};

const CollapsibleSidebarItem: React.FC<{
  item: CollapsibleNavigationItem;
  level: number;
  onToggle?: (item: CollapsibleNavigationItem) => void;
  onItemClick?: (item: CollapsibleNavigationItem) => void;
}> = ({ item, level, onToggle, onItemClick }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(item.isOpen || false);
  const IconComponent = getIconComponent(item.icon);

  const hasChildren = item.children && item.children.length > 0;
  const isActive = location.pathname === item.path;
  const hasActiveChild = item.children?.some(
    (child) =>
      child.path === location.pathname ||
      location.pathname.startsWith(child.path || "")
  );

  const handleToggle = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
      onToggle?.(item);
    }
  };

  const handleItemClick = () => {
    if (item.path) {
      onItemClick?.(item);
    } else if (hasChildren) {
      handleToggle();
    }
  };

  const paddingLeft = level * 20 + 16; // 16px base + 20px per level

  return (
    <div>
      <div
        className={`flex items-center px-4 py-2 text-sm cursor-pointer transition-colors ${
          isActive || hasActiveChild
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`}
        style={{ paddingLeft }}
        onClick={handleItemClick}
      >
        {hasChildren && (
          <div className="mr-2">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
        {!hasChildren && level > 0 && <div className="mr-2 w-4" />}
        <IconComponent className="h-4 w-4 mr-3 flex-shrink-0" />
        <span className="truncate">{item.label}</span>
      </div>

      {hasChildren && isOpen && (
        <div>
          {item.children!.map((child) => (
            <CollapsibleSidebarItem
              key={child.id}
              item={child as CollapsibleNavigationItem}
              level={level + 1}
              onToggle={onToggle}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  items,
  onItemClick,
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const handleToggle = (item: CollapsibleNavigationItem) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(item.id)) {
      newOpenItems.delete(item.id);
    } else {
      newOpenItems.add(item.id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <nav className="mt-6">
      {items.map((item) => (
        <CollapsibleSidebarItem
          key={item.id}
          item={item}
          level={0}
          onToggle={handleToggle}
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  );
};

export default CollapsibleSidebar;
