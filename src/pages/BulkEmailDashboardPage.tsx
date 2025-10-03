import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchStats } from "../store/slices/bulkEmailSlice";
import { usePageTitle } from "../hooks/usePageTitle";
import {
  Mail,
  Users,
  FileText,
  BarChart3,
  Clock,
  Send,
  Plus,
  History,
} from "lucide-react";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const BulkEmailDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, statsLoading } = useAppSelector(
    (state: any) => state.bulkEmail
  );

  usePageTitle("Bulk Email Dashboard");

  useEffect(() => {
    dispatch(fetchStats({})).catch(() => {
      console.log("Stats API not available");
    });
  }, [dispatch]);

  const dashboardCards = [
    {
      title: "Compose Email",
      description: "Create and send bulk emails to your recipients",
      icon: Send,
      color: "bg-blue-500",
      link: "/bulk-email/compose",
      stats: stats?.totalEmailsSent || 0,
      statsLabel: "Total Sent",
    },
    {
      title: "Manage Recipients",
      description: "Add, edit, and organize your email recipients",
      icon: Users,
      color: "bg-green-500",
      link: "/bulk-email/recipients",
      stats: stats?.totalRecipients || 0,
      statsLabel: "Total Recipients",
    },
    {
      title: "Email Templates",
      description: "Create and manage reusable email templates",
      icon: FileText,
      color: "bg-purple-500",
      link: "/bulk-email/templates",
      stats: stats?.totalTemplates || 0,
      statsLabel: "Templates",
    },
    {
      title: "Email History",
      description: "View sent emails and campaign history",
      icon: History,
      color: "bg-orange-500",
      link: "/bulk-email/history",
      stats: stats?.emailsSentToday || 0,
      statsLabel: "Sent Today",
    },
    {
      title: "Statistics",
      description: "View detailed analytics and performance metrics",
      icon: BarChart3,
      color: "bg-indigo-500",
      link: "/bulk-email/statistics",
      stats: stats?.averageOpenRate || 0,
      statsLabel: "Open Rate %",
    },
  ];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bulk Email Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your bulk email campaigns and recipients
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/bulk-email/compose"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Quick Compose
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Emails Sent
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalEmailsSent || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Recipients
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalRecipients || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Templates</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalTemplates || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sent Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.emailsSentToday || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Link
              key={index}
              to={card.link}
              className="group bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 ${card.color} rounded-lg group-hover:scale-110 transition-transform duration-200`}
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {card.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {card.statsLabel}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {card.stats}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/bulk-email/compose"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Send className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Send New Email</p>
                <p className="text-sm text-gray-600">
                  Compose and send bulk email
                </p>
              </div>
            </Link>
            <Link
              to="/bulk-email/recipients"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Manage Recipients</p>
                <p className="text-sm text-gray-600">
                  Add or import recipients
                </p>
              </div>
            </Link>
            <Link
              to="/bulk-email/templates"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-5 w-5 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Create Template</p>
                <p className="text-sm text-gray-600">
                  Build reusable email templates
                </p>
              </div>
            </Link>
            <Link
              to="/bulk-email/statistics"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="h-5 w-5 text-indigo-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-600">
                  Check performance metrics
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkEmailDashboardPage;
