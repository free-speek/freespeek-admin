/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  UserPlus,
  MessageCircle,
  FileText,
  Plus,
  Globe,
  MapPin,
  Search,
  Settings,
  LogOut,
  MessageSquare,
  Menu,
  X,
  FileText as FileTextIcon,
  Mail,
  Activity,
  Save,
  FolderPlus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { NavigationItem } from "../types/navigation";
import logoText from "../assets/logoText.png";
import { useAuth } from "../contexts/AuthContext";

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "General Dashboard",
    icon: "LayoutDashboard",
    path: "/dashboard",
  },
  {
    id: "freespeek-users",
    label: "Freespeek Users",
    icon: "Users",
    path: "/freespeek-users",
  },
  {
    id: "live-users",
    label: "Live Users",
    icon: "UserPlus",
    path: "/live-users",
  },
  {
    id: "messages",
    label: "Messages",
    icon: "MessageSquare",
    path: "/messages",
  },
  {
    id: "support-chats",
    label: "Support Chats",
    icon: "MessageCircle",
    path: "/support-chats",
  },
  {
    id: "bulk-email",
    label: "Bulk Email",
    icon: "Mail",
    path: "/bulk-email",
    isCollapsible: true,
    children: [
      {
        id: "compose-email",
        label: "Compose Email",
        icon: "Mail",
        path: "/bulk-email#compose",
      },
      {
        id: "templates",
        label: "Templates",
        icon: "Save",
        path: "/bulk-email#templates",
      },
      {
        id: "recipients",
        label: "Recipients",
        icon: "Users",
        path: "/bulk-email#recipients",
      },
      {
        id: "groups",
        label: "Groups",
        icon: "FolderPlus",
        path: "/bulk-email#groups",
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: "BarChart3",
        path: "/bulk-email#analytics",
      },
    ],
  },
  {
    id: "user-tracking",
    label: "User Tracking",
    icon: "Activity",
    path: "/user-tracking",
  },
];

const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    LayoutDashboard,
    BarChart3,
    Users,
    UserPlus,
    MessageCircle,
    FileText,
    Plus,
    Globe,
    MapPin,
    MessageSquare,
    FileTextIcon,
    Mail,
    Activity,
    Save,
    FolderPlus,
    ChevronDown,
    ChevronRight,
  };
  return iconMap[iconName] || LayoutDashboard;
};

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<{
    [key: string]: boolean;
  }>({
    "bulk-email": false, // Default to expanded
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getCurrentPageTitle = () => {
    if (location.pathname === "/dashboard") return "General Dashboard";
    if (location.pathname === "/freespeek-users") return "Freespeek Users";
    if (location.pathname === "/live-users") return "Live Users";
    if (location.pathname === "/messages") return "Messages";
    if (location.pathname === "/support-chats") return "Support Chats";
    if (location.pathname.startsWith("/bulk-email")) return "Bulk Email";
    if (location.pathname === "/user-tracking") return "User Tracking";
    if (location.pathname.startsWith("/chat-details")) return "Chat Details";
    if (location.pathname.startsWith("/chat-history")) return "Chat History";
    if (location.pathname.startsWith("/user-profile")) return "User Profile";
    return "Dashboard";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 lg:p-6">
          <div className="flex items-center space-x-3">
            <img
              src={logoText}
              alt="Freespeek Admin"
              className="h-8 w-32 lg:h-18 lg:w-52"
            />
          </div>
          <button
            onClick={closeMobileMenu}
            className="lg:hidden p-2 hover:bg-gray-700 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6">
          {navigationItems.map((item) => {
            const IconComponent = getIconComponent(item.icon);
            const isActive =
              location.pathname === item.path ||
              (item.children &&
                item.children.some(
                  (child) => location.pathname + location.hash === child.path
                ));
            const isCollapsed = collapsedSections[item.id];

            if (item.isCollapsible && item.children) {
              return (
                <div key={item.id} className="mb-2">
                  <button
                    onClick={() => toggleSection(item.id)}
                    className={`w-full flex items-center justify-between p-3 text-left hover:bg-gray-700 rounded-lg transition-colors ${
                      isActive ? "bg-gray-700" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <IconComponent className="w-5 h-5 mr-3" />
                      <span className="text-sm lg:text-base">{item.label}</span>
                    </div>
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {!isCollapsed && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const ChildIconComponent = getIconComponent(child.icon);
                        const isChildActive =
                          location.pathname + location.hash === child.path;

                        return (
                          <Link
                            key={child.id}
                            to={child.path || ""}
                            onClick={() => {
                              console.log(
                                "🔗 [AdminLayout] Clicking on:",
                                child.label,
                                "Path:",
                                child.path
                              );
                              closeMobileMenu();
                            }}
                            className={`flex items-center p-2 text-sm hover:bg-gray-700 rounded-lg transition-colors ${
                              isChildActive
                                ? "bg-gray-700 text-blue-400"
                                : "text-gray-300"
                            }`}
                          >
                            <ChildIconComponent className="w-4 h-4 mr-3" />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path || ""}
                onClick={closeMobileMenu}
                className={`sidebar-item ${isActive ? "active" : ""}`}
              >
                <IconComponent className="w-5 h-5 mr-3" />
                <span className="text-sm lg:text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Home
                </span>
                <span className="text-sm text-gray-600 hidden sm:inline">
                  /
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {getCurrentPageTitle()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search here"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 lg:w-64"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
