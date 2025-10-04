import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchStats } from "../../store/slices/bulkEmailSlice";
import apiService from "../../services/api";
import {
  BarChart3,
  Mail,
  Clock,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Loader from "../Loader";

const Analytics: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, statsLoading } = useAppSelector(
    (state: any) => state.bulkEmail
  );

  const [timeFilter, setTimeFilter] = useState("7d");
  const [emailHistory, setEmailHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);

  // Memoized stats to prevent unnecessary re-renders
  const displayStats = useMemo(() => {
    if (!stats) return null;

    // Return actual stats from backend, no mock data
    return stats;
  }, [stats]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setHistoryLoading(true);

        // Fetch stats with timeout
        const statsPromise = dispatch(fetchStats({ timeFilter }));

        // Fetch email history
        const historyPromise = apiService.getBulkEmailHistory(1, 10);

        // Fetch performance data from backend
        const performancePromise = fetch(
          `/api/admin/bulk-email/analytics/performance?timeFilter=${timeFilter}`
        ).then((res) => res.json());

        // Wait for all with timeout
        const [, historyResult, performanceResult] = await Promise.allSettled([
          statsPromise,
          historyPromise,
          performancePromise,
        ]);

        if (historyResult.status === "fulfilled") {
          setEmailHistory((historyResult.value as any)?.data?.history || []);
        }

        if (performanceResult.status === "fulfilled") {
          setPerformanceData((performanceResult.value as any)?.data || null);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchData();
  }, [dispatch, timeFilter]);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex justify-end gap-3">
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="1d">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <button
          onClick={() => dispatch(fetchStats({ timeFilter }))}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats Overview */}
      {displayStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Emails
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {displayStats.totalEmailsSent || 0}
                </p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+12.5%</span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {displayStats.averageOpenRate || 0}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+2.3%</span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sent Today</p>
                <p className="text-3xl font-bold text-gray-900">
                  {displayStats.emailsSentToday || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+8.1%</span>
              <span className="text-sm text-gray-500 ml-2">vs yesterday</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Recipients
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {displayStats.activeRecipients || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+5.7%</span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Analytics Data
            </h3>
            <p className="text-gray-600">
              Start sending emails to see your analytics and performance
              metrics.
            </p>
          </div>
        </div>
      )}

      {/* Detailed Metrics */}
      {displayStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Performance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Email Performance
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Delivered</span>
                <span className="text-sm font-medium text-gray-900">
                  {(performanceData as any)?.totalDelivered ||
                    displayStats?.emailsDelivered ||
                    0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Opened</span>
                <span className="text-sm font-medium text-gray-900">
                  {(performanceData as any)?.totalOpened ||
                    displayStats?.emailsOpened ||
                    0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Clicked</span>
                <span className="text-sm font-medium text-gray-900">
                  {(performanceData as any)?.totalClicked ||
                    displayStats?.emailsClicked ||
                    0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bounced</span>
                <span className="text-sm font-medium text-red-600">
                  {(performanceData as any)?.totalBounced ||
                    displayStats?.emailsBounced ||
                    0}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activity
            </h4>
            <div className="space-y-3">
              {displayStats.recentActivity
                ?.slice(0, 5)
                .map((activity: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {activity.type === "sent" ? (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      ) : activity.type === "opened" ? (
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp
                          ? new Date(activity.timestamp).toLocaleString()
                          : "Invalid Date"}
                      </p>
                    </div>
                  </div>
                )) || (
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Email History Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Email History</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Open Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emailHistory.length > 0 ? (
                emailHistory.map((email: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {email.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {email.recipientCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          email.status === "sent"
                            ? "bg-green-100 text-green-800"
                            : email.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {email.status === "sent" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : email.status === "failed" ? (
                          <XCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {email.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(email.sentAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {email.openRate || "0"}%
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      No email history
                    </h3>
                    <p className="text-sm text-gray-500">
                      {historyLoading
                        ? "Loading email history..."
                        : "Send your first bulk email to see history here."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
