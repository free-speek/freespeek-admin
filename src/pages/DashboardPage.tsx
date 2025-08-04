import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDashboardStats } from "../store/slices/dashboardSlice";
import { fetchMessagesCount } from "../store/slices/messagesSlice";
import apiService from "../services/api";
import {
  Users,
  UserCheck,
  Archive,
  ShoppingCart,
  Store,
  Star,
  Building,
  AlertTriangle,
  AlertCircle,
  Search,
  Eye,
  Vote,
  Calendar,
  RefreshCw,
  MessageCircle,
  FileText,
} from "lucide-react";
import Loader from "../components/Loader";

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  iconColor: string;
  subtitle?: string;
  onClick?: () => void;
}> = ({ title, value, icon: Icon, iconColor, subtitle, onClick }) => (
  <div
    className={`card h-auto min-h-[8rem] ${
      onClick
        ? "cursor-pointer hover:shadow-lg transition-shadow duration-200"
        : ""
    }`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between h-full">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs lg:text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 lg:p-4 rounded-lg ${iconColor} ml-4`}>
        <Icon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
      </div>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { stats, isLoading, error } = useAppSelector(
    (state: any) => state.dashboard
  );
  const { totalMessages } = useAppSelector((state: any) => state.messages);
  const [liveUsersCount, setLiveUsersCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  console.log("Dashboard stats:", stats);
  console.log("Online users count:", stats?.onlineUsersCount);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchMessagesCount());
  }, [dispatch]);

  useEffect(() => {
    const fetchLiveUsers = async () => {
      try {
        const response = await apiService.getOnlineUsersCount();
        setLiveUsersCount((response as any).count);
      } catch (error) {
        console.error("Failed to fetch live users:", error);
      }
    };

    fetchLiveUsers();

    const interval = setInterval(fetchLiveUsers, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTotalUsersClick = () => {
    navigate("/freespeek-users");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      dispatch(fetchDashboardStats()),
      dispatch(fetchMessagesCount()),
    ]);
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error loading dashboard: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            General Dashboard
          </h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh Dashboard"
          >
            <RefreshCw
              className={`h-5 w-5 text-gray-600 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Users Section */}
      <div className="space-y-4">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
          Users
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          <StatCard
            title="Live Users"
            value={liveUsersCount}
            icon={Users}
            iconColor="bg-purple-500"
            subtitle="Users currently online via mobile app"
          />
          <StatCard
            title="Total Users"
            value={
              (stats?.activeUserCount || 0) + (stats?.deletedUserCount || 0)
            }
            icon={Users}
            iconColor="bg-blue-500"
            onClick={handleTotalUsersClick}
          />

          <StatCard
            title="Active Users"
            value={stats?.activeUserCount || 0}
            icon={UserCheck}
            iconColor="bg-green-500"
          />

          <StatCard
            title="Deleted Users"
            value={stats?.deletedUserCount || 0}
            icon={Archive}
            iconColor="bg-red-500"
          />
        </div>
      </div>

      {/* Messages Section */}
      <div className="space-y-4">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
          Messages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          <StatCard
            title="Total Messages"
            value={totalMessages}
            icon={MessageCircle}
            iconColor="bg-indigo-500"
          />
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-4">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
          Posts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          <StatCard
            title="Total Posts"
            value={
              (stats?.activePostCount || 0) + (stats?.deletedPostCount || 0)
            }
            icon={FileText}
            iconColor="bg-orange-500"
          />

          <StatCard
            title="Active Posts"
            value={stats?.activePostCount || 0}
            icon={FileText}
            iconColor="bg-green-500"
          />

          <StatCard
            title="Deleted Posts"
            value={stats?.deletedPostCount || 0}
            icon={Archive}
            iconColor="bg-red-500"
          />
        </div>
      </div>

      {/* Listings Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StatCard
            title="Buy Listings"
            value={stats?.buyListingsCount || 0}
            icon={ShoppingCart}
            iconColor="bg-blue-500"
          />

          <StatCard
            title="Sell Listings"
            value={stats?.sellListingsCount || 0}
            icon={Store}
            iconColor="bg-green-500"
          />
        </div>
      </div>

      {/* Ratings Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Ratings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StatCard
            title="Restaurant Ratings"
            value={stats?.restaurantRatingCount || 0}
            icon={Star}
            iconColor="bg-yellow-500"
          />

          <StatCard
            title="Business Ratings"
            value={stats?.businessRatingCount || 0}
            icon={Building}
            iconColor="bg-purple-500"
          />
        </div>
      </div>

      {/* Alerts Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StatCard
            title="Safety Alerts"
            value={stats?.safetyAlertsCount || 0}
            icon={AlertTriangle}
            iconColor="bg-orange-500"
          />

          <StatCard
            title="Urgent Alerts"
            value={stats?.urgentAlertCount || 0}
            icon={AlertCircle}
            iconColor="bg-red-500"
          />
        </div>
      </div>

      {/* Lost & Found Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Lost & Found</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StatCard
            title="Lost Posts"
            value={stats?.lostPostsCount || 0}
            icon={Search}
            iconColor="bg-blue-500"
          />

          <StatCard
            title="Found Posts"
            value={stats?.foundPostsCount || 0}
            icon={Eye}
            iconColor="bg-green-500"
          />
        </div>
      </div>

      {/* Polls Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Polls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StatCard
            title="Poll Posts"
            value={stats?.pollPostCount || 0}
            icon={Vote}
            iconColor="bg-purple-500"
          />

          <StatCard
            title="Completed Polls"
            value={stats?.completedPollPostCount || 0}
            icon={Vote}
            iconColor="bg-green-500"
          />

          <StatCard
            title="Poll Participants"
            value={stats?.participantsInPollCount || 0}
            icon={Users}
            iconColor="bg-blue-500"
          />
        </div>
      </div>

      {/* Events Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StatCard
            title="Total Events"
            value={stats?.eventsCount || 0}
            icon={Calendar}
            iconColor="bg-indigo-500"
          />
        </div>
      </div>

      {/* Online Status Info */}
      {liveUsersCount === 0 && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Live Users System
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Live Users shows users currently online via the mobile app.
                  Users are marked as online when they send heartbeats from the
                  mobile app.
                </p>
                <p className="mt-1">
                  <strong>Mobile App Integration Required:</strong> The mobile
                  app needs to send periodic heartbeats to track online status.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
