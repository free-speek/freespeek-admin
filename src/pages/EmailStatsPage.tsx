import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchStats } from "../store/slices/bulkEmailSlice";
import { usePageTitle } from "../hooks/usePageTitle";
import {
  BarChart3,
  Mail,
  Users,
  FileText,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  RefreshCw,
  Filter,
  Calendar,
  CalendarDays,
} from "lucide-react";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const EmailStatsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, statsLoading } = useAppSelector(
    (state: any) => state.bulkEmail
  );

  // Filter states
  const [timeFilter, setTimeFilter] = useState("all");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  usePageTitle("Email Statistics");

  useEffect(() => {
    dispatch(fetchStats({})).catch(() => {
      console.log("Stats API not available");
    });
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchStats({})).catch(() => {
      console.log("Stats API not available");
    });
  };

  const handleFilterChange = (filterType: string) => {
    setTimeFilter(filterType);

    // Prepare filters for API call
    const filters: any = { timeFilter: filterType };

    if (
      filterType === "custom" &&
      customDateRange.startDate &&
      customDateRange.endDate
    ) {
      filters.startDate = customDateRange.startDate;
      filters.endDate = customDateRange.endDate;
    }

    // Call API with filters
    dispatch(fetchStats(filters)).catch(() => {
      console.log("Stats API not available");
    });
  };

  const handleCustomDateRange = () => {
    if (customDateRange.startDate && customDateRange.endDate) {
      const filters = {
        timeFilter: "custom",
        startDate: customDateRange.startDate,
        endDate: customDateRange.endDate,
      };

      dispatch(fetchStats(filters)).catch(() => {
        console.log("Stats API not available");
      });
    }
  };

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case "today":
        return "Today";
      case "yesterday":
        return "Yesterday";
      case "thisWeek":
        return "This Week";
      case "lastWeek":
        return "Last Week";
      case "thisMonth":
        return "This Month";
      case "lastMonth":
        return "Last Month";
      case "thisYear":
        return "This Year";
      case "custom":
        return "Custom Range";
      default:
        return "All Time";
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Emails Sent",
      value: stats?.totalEmailsSent || 0,
      icon: Mail,
      color: "bg-blue-500",
      change: stats?.emailsSentChange || "0%",
      changeType: (stats?.emailsSentChange || "0%").startsWith("+")
        ? ("positive" as const)
        : ("negative" as const),
    },
    {
      title: "Total Recipients",
      value: stats?.totalRecipients || 0,
      icon: Users,
      color: "bg-green-500",
      change: stats?.recipientsChange || "0%",
      changeType: (stats?.recipientsChange || "0%").startsWith("+")
        ? ("positive" as const)
        : ("negative" as const),
    },
    {
      title: "Templates",
      value: stats?.totalTemplates || 0,
      icon: FileText,
      color: "bg-purple-500",
      change: stats?.templatesChange || "0",
      changeType: (stats?.templatesChange || "0").startsWith("+")
        ? ("positive" as const)
        : ("negative" as const),
    },
    {
      title: "Emails Sent Today",
      value: stats?.emailsSentToday || 0,
      icon: Clock,
      color: "bg-orange-500",
      change: stats?.todayChange || "0%",
      changeType: (stats?.todayChange || "0%").startsWith("+")
        ? ("positive" as const)
        : ("negative" as const),
    },
    {
      title: "Average Open Rate",
      value: `${stats?.averageOpenRate || 0}%`,
      icon: TrendingUp,
      color: "bg-indigo-500",
      change: stats?.openRateChange || "0%",
      changeType: (stats?.openRateChange || "0%").startsWith("+")
        ? ("positive" as const)
        : ("negative" as const),
    },
    {
      title: "Average Click Rate",
      value: `${stats?.averageClickRate || 0}%`,
      icon: BarChart3,
      color: "bg-pink-500",
      change: stats?.clickRateChange || "0%",
      changeType: (stats?.clickRateChange || "0%").startsWith("+")
        ? ("positive" as const)
        : ("negative" as const),
    },
  ];

  const weeklyStats = stats?.weeklyStats || [
    { day: "Mon", emails: 0 },
    { day: "Tue", emails: 0 },
    { day: "Wed", emails: 0 },
    { day: "Thu", emails: 0 },
    { day: "Fri", emails: 0 },
    { day: "Sat", emails: 0 },
    { day: "Sun", emails: 0 },
  ];

  const monthlyStats = stats?.monthlyStats || [
    { month: "Jan", emails: 0 },
    { month: "Feb", emails: 0 },
    { month: "Mar", emails: 0 },
    { month: "Apr", emails: 0 },
    { month: "May", emails: 0 },
    { month: "Jun", emails: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/bulk-email"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Email Statistics
            </h1>
            <p className="text-gray-600">
              View detailed analytics and performance metrics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Filter Statistics
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Time Period Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period
              </label>
              <select
                value={timeFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="thisWeek">This Week</option>
                <option value="lastWeek">Last Week</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisYear">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Custom Date Range */}
            {timeFilter === "custom" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customDateRange.startDate}
                    onChange={(e) =>
                      setCustomDateRange({
                        ...customDateRange,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customDateRange.endDate}
                    onChange={(e) =>
                      setCustomDateRange({
                        ...customDateRange,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleCustomDateRange}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Range
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Quick Filters
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Time", icon: Calendar },
                { key: "today", label: "Today", icon: Calendar },
                { key: "yesterday", label: "Yesterday", icon: Calendar },
                { key: "thisWeek", label: "This Week", icon: CalendarDays },
                { key: "lastWeek", label: "Last Week", icon: CalendarDays },
                { key: "thisMonth", label: "This Month", icon: Calendar },
                { key: "lastMonth", label: "Last Month", icon: Calendar },
                { key: "thisYear", label: "This Year", icon: CalendarDays },
              ].map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <button
                    key={filter.key}
                    onClick={() => handleFilterChange(filter.key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timeFilter === filter.key
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Filter Display */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Currently showing: {getTimeFilterLabel()}
                </span>
              </div>
              {timeFilter === "custom" &&
                customDateRange.startDate &&
                customDateRange.endDate && (
                  <div className="text-xs text-blue-600">
                    {customDateRange.startDate} to {customDateRange.endDate}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Filter Summary */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Time Period: {getTimeFilterLabel()}
              </span>
            </div>
            {timeFilter === "custom" &&
              customDateRange.startDate &&
              customDateRange.endDate && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(customDateRange.startDate).toLocaleDateString()} -{" "}
                    {new Date(customDateRange.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 ${card.color} rounded-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {card.value}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`flex items-center text-sm font-medium ${
                      card.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {card.changeType === "positive" ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {card.change}
                  </div>
                  <p className="text-xs text-gray-500">vs last period</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Email Volume */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Email Volume
          </h3>
          <div className="space-y-4">
            {weeklyStats.map((stat: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  {stat.day}
                </span>
                <div className="flex items-center flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (stat.emails /
                            Math.max(
                              ...weeklyStats.map((s: any) => s.emails)
                            )) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {stat.emails}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Email Trends
          </h3>
          <div className="space-y-4">
            {monthlyStats.map((stat: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  {stat.month}
                </span>
                <div className="flex items-center flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (stat.emails /
                            Math.max(
                              ...monthlyStats.map((s: any) => s.emails)
                            )) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-16 text-right">
                  {stat.emails.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Open Rate Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Open Rate Performance
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              {stats?.averageOpenRate || 0}%
            </div>
            <p className="text-sm text-gray-600 mb-4">Average Open Rate</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full"
                style={{ width: `${stats?.averageOpenRate || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Industry average: 21.5%
            </p>
          </div>
        </div>

        {/* Click Rate Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Click Rate Performance
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-600 mb-2">
              {stats?.averageClickRate || 0}%
            </div>
            <p className="text-sm text-gray-600 mb-4">Average Click Rate</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-pink-600 h-3 rounded-full"
                style={{ width: `${stats?.averageClickRate || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Industry average: 2.6%</p>
          </div>
        </div>

        {/* Engagement Score */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Engagement Score
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {Math.round(
                ((stats?.averageOpenRate || 0) +
                  (stats?.averageClickRate || 0)) /
                  2
              )}
              %
            </div>
            <p className="text-sm text-gray-600 mb-4">Overall Engagement</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full"
                style={{
                  width: `${Math.round(
                    ((stats?.averageOpenRate || 0) +
                      (stats?.averageClickRate || 0)) /
                      2
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Based on open and click rates
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-lg mr-3 ${
                        activity.type === "email"
                          ? "bg-blue-100"
                          : activity.type === "template"
                          ? "bg-green-100"
                          : activity.type === "recipients"
                          ? "bg-purple-100"
                          : "bg-orange-100"
                      }`}
                    >
                      {activity.type === "email" ? (
                        <Mail className="h-4 w-4 text-blue-600" />
                      ) : activity.type === "template" ? (
                        <FileText className="h-4 w-4 text-green-600" />
                      ) : activity.type === "recipients" ? (
                        <Users className="h-4 w-4 text-purple-600" />
                      ) : (
                        <BarChart3 className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {activity.details}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No recent activity</p>
                <p className="text-sm text-gray-400 mt-1">
                  Activity will appear here as you use the bulk email features
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailStatsPage;
