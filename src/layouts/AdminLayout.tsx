import React from "react";
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
} from "lucide-react";
import { NavigationItem } from "../types";
import logoText from "../assets/logoText.png";
import { useAuth } from "../contexts/AuthContext";

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "General Dashboard",
    icon: "LayoutDashboard",
    path: "/dashboard",
  },
  // {
  //   id: "statistics",
  //   label: "Statistics",
  //   icon: "BarChart3",
  //   path: "/statistics",
  // },
  // {
  //   id: "interactions-dashboard",
  //   label: "Interactions Dashboard",
  //   icon: "LayoutDashboard",
  //   path: "/interactions-dashboard",
  // },
  // { id: "dau-mau", label: "DAU/MAU", icon: "Users", path: "/dau-mau" },
  {
    id: "freespeek-users",
    label: "Freespeek Users",
    icon: "Users",
    path: "/freespeek-users",
  },
  // {
  //   id: "create-test-user",
  //   label: "Create Test User",
  //   icon: "UserPlus",
  //   path: "/create-test-user",
  // },
  // {
  //   id: "interactions",
  //   label: "Interactions",
  //   icon: "MessageCircle",
  //   path: "/interactions",
  // },
  { id: "chats", label: "Chats", icon: "MessageCircle", path: "/chats" },
  // { id: "campaign", label: "Campaign", icon: "FileText", path: "/campaign" },
  // {
  //   id: "create-campaign",
  //   label: "Create Campaign",
  //   icon: "FileText",
  //   path: "/create-campaign",
  // },
  {
    id: "support-chats",
    label: "Support Chats",
    icon: "MessageCircle",
    path: "/support-chats",
  },
  // { id: "language", label: "Language", icon: "Globe", path: "/language" },
  // { id: "hotspots", label: "Hotspots", icon: "MapPin", path: "/hotspots" },
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
  };
  return iconMap[iconName] || LayoutDashboard;
};

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-40 bg-gray-800 text-white">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <img src={logoText} alt="Freespeek Admin" className="h-18 w-52" />
          </div>
        </div>

        <nav className="mt-6">
          {navigationItems.map((item) => {
            const IconComponent = getIconComponent(item.icon);
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`sidebar-item ${isActive ? "active" : ""}`}
              >
                <IconComponent className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <span>Home</span>
                <span>/</span>
                <span>
                  {location.pathname === "/dashboard" && "General Dashboard"}
                  {location.pathname === "/freespeek-users" &&
                    "Freespeek Users"}
                  {location.pathname === "/chats" && "Chats"}
                  {location.pathname === "/support-chats" && "Support Chats"}
                  {location.pathname.startsWith("/chat-details") &&
                    "Chat Details"}
                  {location.pathname.startsWith("/user-profile") &&
                    "User Profile"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search here"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
