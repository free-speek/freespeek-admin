import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchUserTrackingStats,
  fetchUserTrackingAnalytics,
  fetchAllUserTracking,
  clearErrors,
} from "../store/slices/userTrackingSlice";
import {
  Users,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Download,
} from "lucide-react";

const UserTrackingPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    stats,
    statsLoading,
    statsError,
    analytics,
    analyticsLoading,
    analyticsError,
    users,
    usersLoading,
    usersError,
    usersPagination,
    lastUpdated,
  } = useSelector((state: RootState) => state.userTracking);

  const [activeTab, setActiveTab] = useState<"stats" | "analytics" | "users">(
    "stats"
  );
  const [analyticsDays, setAnalyticsDays] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [localLastUpdated, setLocalLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab, analyticsDays, currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh every 15 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 15000); // 15 seconds for real-time updates

    return () => clearInterval(interval);
  }, [activeTab, analyticsDays, currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    setRefreshing(true);
    try {
      if (activeTab === "stats") {
        await dispatch(fetchUserTrackingStats());
      } else if (activeTab === "analytics") {
        await dispatch(fetchUserTrackingAnalytics(analyticsDays));
      } else if (activeTab === "users") {
        await dispatch(fetchAllUserTracking({ page: currentPage }));
      }
      setLocalLastUpdated(new Date());
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    dispatch(clearErrors());
    loadData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const renderStatsTab = () => {
    if (statsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }

    if (statsError) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{statsError}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!stats) return null;

    return (
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">iOS Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.platformDistribution.find((p) => p.platform === "ios")
                    ?.userCount || 0}
                </p>
              </div>
              <Smartphone className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Android Users
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.platformDistribution.find(
                    (p) => p.platform === "android"
                  )?.userCount || 0}
                </p>
              </div>
              <Monitor className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Web Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.platformDistribution.find((p) => p.platform === "web")
                    ?.userCount || 0}
                </p>
              </div>
              <Tablet className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Version Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Version Distribution
          </h3>
          <div className="space-y-4">
            {stats.versionDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {item.version}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.platform}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {item.userCount}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatPercentage(item.percentage)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Platform Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.platformDistribution.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {item.userCount}
                </div>
                <div className="text-sm text-gray-600">
                  {item.platform?.toUpperCase() || "UNKNOWN"}
                </div>
                <div className="text-xs text-gray-500">
                  {formatPercentage(item.percentage)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {stats.recentActivity && stats.recentActivity.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity (Last 30 Days)
            </h3>
            <div className="space-y-2">
              {stats.recentActivity.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-sm text-gray-600">
                    {formatDateOnly(item.date)}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {item.dailyLogins} logins
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500">
          Last updated: {lastUpdated ? formatDate(lastUpdated) : "Never"}
        </div>
      </div>
    );
  };

  const renderAnalyticsTab = () => {
    if (analyticsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }

    if (analyticsError) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{analyticsError}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!analytics) return null;

    return (
      <div className="space-y-6">
        {/* Analytics Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Analytics Period
            </h3>
            <div className="flex items-center space-x-2">
              <select
                value={analyticsDays}
                onChange={(e) => setAnalyticsDays(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Daily Logins Chart */}
        {analytics.dailyLogins && analytics.dailyLogins.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Daily Login Trends
            </h3>
            <div className="space-y-2">
              {analytics.dailyLogins.slice(0, 15).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-sm text-gray-600">
                    {formatDateOnly(item.date)}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {item.uniqueUsers} unique users
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {item.totalLogins} total logins
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Version Adoption Trends */}
        {analytics.versionAdoption && analytics.versionAdoption.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Version Adoption Trends
            </h3>
            <div className="space-y-4">
              {analytics.versionAdoption.slice(0, 5).map((version, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {(version as any)._id?.version ||
                        version.version ||
                        "Unknown"}{" "}
                      (
                      {(version as any)._id?.platform ||
                        version.platform ||
                        "Unknown"}
                      )
                    </span>
                    <span className="text-sm text-gray-600">
                      {version.totalUsers || 0} total users
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {version.dates?.slice(-7).map((date, dateIndex) => (
                      <div key={dateIndex} className="text-center">
                        <div className="text-xs text-gray-500">
                          {date?.date || "N/A"}
                        </div>
                        <div className="text-sm font-medium">
                          {date?.count || 0}
                        </div>
                      </div>
                    )) || []}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Platform Trends */}
        {analytics.platformTrends && analytics.platformTrends.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Platform Usage Trends
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analytics.platformTrends.map((platform, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-900 mb-2">
                    {(
                      (platform as any)._id ||
                      platform.platform ||
                      "Unknown"
                    )?.toUpperCase() || "UNKNOWN"}
                  </h4>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {platform.totalUsers}
                  </div>
                  <div className="space-y-1">
                    {platform.dates?.slice(-5).map((date, dateIndex) => (
                      <div
                        key={dateIndex}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {date?.date || "N/A"}
                        </span>
                        <span className="text-gray-900">
                          {date?.count || 0}
                        </span>
                      </div>
                    )) || []}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderUsersTab = () => {
    if (usersLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }

    if (usersError) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{usersError}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                User Tracking Data
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  disabled={refreshing}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Logins
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {(user.userId as any)?.profilePicture ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={(user.userId as any).profilePicture}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {(user.userId as any)?.firstName?.[0] || "U"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {(user.userId as any)?.firstName || "Unknown"}{" "}
                            {(user.userId as any)?.lastName || "User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(user.userId as any)?.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(user.accountCreatedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(user.lastLoginDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.currentVersion.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.currentVersion.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.totalLogins}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {usersPagination.pages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * usersPagination.limit + 1} to{" "}
                  {Math.min(
                    currentPage * usersPagination.limit,
                    usersPagination.total
                  )}{" "}
                  of {usersPagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {currentPage} of {usersPagination.pages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(usersPagination.pages, currentPage + 1)
                      )
                    }
                    disabled={currentPage === usersPagination.pages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            User Tracking Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor user activity, version adoption, and platform usage
          </p>
          {localLastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {localLastUpdated.toLocaleTimeString()} •
              Auto-refresh: 15s
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "stats", label: "Statistics", icon: BarChart3 },
            { id: "analytics", label: "Analytics", icon: TrendingUp },
            { id: "users", label: "Users", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === "stats" && renderStatsTab()}
        {activeTab === "analytics" && renderAnalyticsTab()}
        {activeTab === "users" && renderUsersTab()}
      </div>
    </div>
  );
};

export default UserTrackingPage;
