import React, { useState, useEffect } from "react";
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
import CSSStatCard from "../components/CSSStatCard";
import CSSLoader from "../components/CSSLoader";
import AnimatedText from "../components/AnimatedText";
import { usePageTitle } from "../hooks/usePageTitle";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { stats, isLoading, error } = useAppSelector(
    (state: any) => state.dashboard
  );
  const { totalMessages } = useAppSelector((state: any) => state.messages);
  const [liveUsersCount, setLiveUsersCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefreshSuccess, setShowRefreshSuccess] = useState(false);

  usePageTitle("Dashboard");

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
        // Handle error silently
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
    setShowRefreshSuccess(true);
    setTimeout(() => setShowRefreshSuccess(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CSSLoader size="lg" />
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
          <AnimatedText
            animationType="typewriter"
            delay={0}
            className="text-xl lg:text-2xl font-bold text-gray-900"
          >
            General Dashboard
          </AnimatedText>
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

        {showRefreshSuccess && (
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <div className="w-6 h-6 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-800">
              Dashboard refreshed successfully!
            </span>
          </div>
        )}
      </div>

      {/* Users Section */}
      <div className="space-y-4">
        <AnimatedText
          animationType="slideIn"
          delay={100}
          className="text-lg lg:text-xl font-semibold text-gray-900"
        >
          Users
        </AnimatedText>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          <CSSStatCard
            title="Live Users"
            value={liveUsersCount}
            icon={Users}
            iconColor="bg-purple-500"
            subtitle="Users currently online via mobile app"
            animationType="pulse"
            delay={0}
          />
          <CSSStatCard
            title="Total Users"
            value={
              (stats?.activeUserCount || 0) + (stats?.deletedUserCount || 0)
            }
            icon={Users}
            iconColor="bg-blue-500"
            onClick={handleTotalUsersClick}
            animationType="fadeIn"
            delay={100}
          />

          <CSSStatCard
            title="Active Users"
            value={stats?.activeUserCount || 0}
            icon={UserCheck}
            iconColor="bg-green-500"
            animationType="bounce"
            delay={200}
          />

          <CSSStatCard
            title="Deleted Users"
            value={stats?.deletedUserCount || 0}
            icon={Archive}
            iconColor="bg-red-500"
            animationType="slideIn"
            delay={300}
          />
        </div>
      </div>

      {/* Messages Section */}
      <div className="space-y-4">
        <AnimatedText
          animationType="slideIn"
          delay={200}
          className="text-lg lg:text-xl font-semibold text-gray-900"
        >
          Messages
        </AnimatedText>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          <CSSStatCard
            title="Total Messages"
            value={totalMessages}
            icon={MessageCircle}
            iconColor="bg-indigo-500"
            animationType="scale"
            delay={0}
          />
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-4">
        <AnimatedText
          animationType="slideIn"
          delay={300}
          className="text-lg lg:text-xl font-semibold text-gray-900"
        >
          Posts
        </AnimatedText>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          <CSSStatCard
            title="Total Posts"
            value={
              (stats?.activePostCount || 0) + (stats?.deletedPostCount || 0)
            }
            icon={FileText}
            iconColor="bg-orange-500"
            animationType="fadeIn"
            delay={0}
          />

          <CSSStatCard
            title="Active Posts"
            value={stats?.activePostCount || 0}
            icon={FileText}
            iconColor="bg-green-500"
            animationType="bounce"
            delay={100}
          />

          <CSSStatCard
            title="Deleted Posts"
            value={stats?.deletedPostCount || 0}
            icon={Archive}
            iconColor="bg-red-500"
            animationType="slideIn"
            delay={200}
          />
        </div>
      </div>

      {/* Listings Section */}
      <div className="space-y-4">
        <AnimatedText
          animationType="slideIn"
          delay={400}
          className="text-xl font-semibold text-gray-900"
        >
          Listings
        </AnimatedText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CSSStatCard
            title="Buy Listings"
            value={stats?.buyListingsCount || 0}
            icon={ShoppingCart}
            iconColor="bg-blue-500"
            animationType="fadeIn"
            delay={0}
          />

          <CSSStatCard
            title="Sell Listings"
            value={stats?.sellListingsCount || 0}
            icon={Store}
            iconColor="bg-green-500"
            animationType="bounce"
            delay={100}
          />
        </div>
      </div>

      {/* Ratings Section */}
      <div className="space-y-4">
        <AnimatedText
          animationType="slideIn"
          delay={500}
          className="text-xl font-semibold text-gray-900"
        >
          Ratings
        </AnimatedText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CSSStatCard
            title="Restaurant Ratings"
            value={stats?.restaurantRatingCount || 0}
            icon={Star}
            iconColor="bg-yellow-500"
            animationType="rotate"
            delay={0}
          />

          <CSSStatCard
            title="Business Ratings"
            value={stats?.businessRatingCount || 0}
            icon={Building}
            iconColor="bg-purple-500"
            animationType="rotate"
            delay={100}
          />
        </div>
      </div>

      {/* Alerts Section */}
      <div className="space-y-4">
        <AnimatedText
          animationType="slideIn"
          delay={600}
          className="text-xl font-semibold text-gray-900"
        >
          Alerts
        </AnimatedText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CSSStatCard
            title="Safety Alerts"
            value={stats?.safetyAlertsCount || 0}
            icon={AlertTriangle}
            iconColor="bg-orange-500"
            animationType="pulse"
            delay={0}
          />

          <CSSStatCard
            title="Urgent Alerts"
            value={stats?.urgentAlertCount || 0}
            icon={AlertCircle}
            iconColor="bg-red-500"
            animationType="pulse"
            delay={100}
          />
        </div>
      </div>

      {/* Lost & Found Section */}
      <div className="space-y-4">
        <AnimatedText
          animationType="slideIn"
          delay={700}
          className="text-xl font-semibold text-gray-900"
        >
          Lost & Found
        </AnimatedText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CSSStatCard
            title="Lost Posts"
            value={stats?.lostPostsCount || 0}
            icon={Search}
            iconColor="bg-blue-500"
            animationType="slideIn"
            delay={0}
          />

          <CSSStatCard
            title="Found Posts"
            value={stats?.foundPostsCount || 0}
            icon={Eye}
            iconColor="bg-green-500"
            animationType="bounce"
            delay={100}
          />
        </div>
      </div>

      {/* Polls Section */}
      <div className="space-y-4">
        <AnimatedText
          animationType="slideIn"
          delay={800}
          className="text-xl font-semibold text-gray-900"
        >
          Polls
        </AnimatedText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CSSStatCard
            title="Poll Posts"
            value={stats?.pollPostCount || 0}
            icon={Vote}
            iconColor="bg-purple-500"
            animationType="fadeIn"
            delay={0}
          />

          <CSSStatCard
            title="Completed Polls"
            value={stats?.completedPollPostCount || 0}
            icon={Vote}
            iconColor="bg-green-500"
            animationType="bounce"
            delay={100}
          />

          <CSSStatCard
            title="Poll Participants"
            value={stats?.participantsInPollCount || 0}
            icon={Users}
            iconColor="bg-blue-500"
            animationType="pulse"
            delay={200}
          />
        </div>
      </div>

      {/* Events Section */}
      <div className="space-y-4">
        <AnimatedText
          animationType="slideIn"
          delay={900}
          className="text-xl font-semibold text-gray-900"
        >
          Events
        </AnimatedText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CSSStatCard
            title="Total Events"
            value={stats?.eventsCount || 0}
            icon={Calendar}
            iconColor="bg-indigo-500"
            animationType="scale"
            delay={0}
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
