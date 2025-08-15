import React, { useEffect, useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import AnimatedText from "../components/AnimatedText";
import CSSLoader from "../components/CSSLoader";
import apiService from "../services/api";

interface LiveUser {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  device?: "iOS" | "Android";
  liveTimeFrom: string;
  profilePicture?: string;
  lastLogin: string;
  status: string;
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
}

const LiveUsersPage: React.FC = () => {
  usePageTitle("Live Users");
  const [users, setUsers] = useState<LiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [onlineCount, setOnlineCount] = useState<number>(0);

  useEffect(() => {
    const fetchLiveUsers = async () => {
      try {
        setLoading(true);
        // Try to get live users, fallback to getting all users and filtering
        try {
          const response = await apiService.getLiveUsers();
          const liveUsers = (response as any).data || response;
          setUsers(liveUsers as LiveUser[]);
        } catch (error) {
          // If live-users endpoint doesn't exist, get all users and filter for online ones
          const onlineCountResponse = await apiService.getOnlineUsersCount();
          const count =
            (onlineCountResponse as any).count || onlineCountResponse;
          setOnlineCount(count);
          console.log("Online users count:", count);

          // Get all users and try to identify online ones
          try {
            const allUsersResponse = await apiService.getUsers(
              1,
              50,
              "",
              "all"
            );
            const allUsers =
              (allUsersResponse as any).data?.users ||
              (allUsersResponse as any).users ||
              [];
            console.log("All users:", allUsers);

            // Filter users who might be online (recent activity)
            const now = new Date();
            const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

            const onlineUsers = allUsers.filter((user: any) => {
              const lastLogin = new Date(user.lastLogin);
              return lastLogin > thirtyMinutesAgo;
            });

            setUsers(onlineUsers as LiveUser[]);
          } catch (userError) {
            console.error("Error fetching users:", userError);
            setUsers([]);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching live users:", error);
        setLoading(false);
      }
    };

    fetchLiveUsers();

    const interval = setInterval(() => {
      fetchLiveUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatLiveTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Try to get live users, fallback to getting all users and filtering
      try {
        const response = await apiService.getLiveUsers();
        const liveUsers = (response as any).data || response;
        setUsers(liveUsers as LiveUser[]);
      } catch (error) {
        // If live-users endpoint doesn't exist, get all users and filter for online ones
        const onlineCountResponse = await apiService.getOnlineUsersCount();
        const count = (onlineCountResponse as any).count || onlineCountResponse;
        setOnlineCount(count);
        console.log("Online users count:", count);

        // Get all users and try to identify online ones
        try {
          const allUsersResponse = await apiService.getUsers(1, 50, "", "all");
          const allUsers =
            (allUsersResponse as any).data?.users ||
            (allUsersResponse as any).users ||
            [];
          console.log("All users:", allUsers);

          // Filter users who might be online (recent activity)
          const now = new Date();
          const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

          const onlineUsers = allUsers.filter((user: any) => {
            const lastLogin = new Date(user.lastLogin);
            return lastLogin > thirtyMinutesAgo;
          });

          setUsers(onlineUsers as LiveUser[]);
        } catch (userError) {
          console.error("Error fetching users:", userError);
          setUsers([]);
        }
      }
      setRefreshing(false);
    } catch (error) {
      console.error("Error refreshing live users:", error);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CSSLoader size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <AnimatedText
            animationType="typewriter"
            delay={0}
            className="text-xl lg:text-2xl font-bold text-gray-900"
          >
            Live Users
          </AnimatedText>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">
              {onlineCount || users.length} Active
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh live users"
          >
            {refreshing ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Live Time From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {user.fullName
                            .split(" ")
                            .map((name) => name.charAt(0))
                            .join("")}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.device === "iOS" ? (
                        <svg
                          className="h-5 w-5 text-gray-600 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-green-600 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.523 15.3414c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9999.9999-.9999c.5511 0 .9999.4488.9999.9999s-.4488.9997-.9999.9997zm-5.01 0c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9999.9999-.9999c.5511 0 .9999.4488.9999.9999s-.4488.9997-.9999.9997zm-5.01 0c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9999.9999-.9999c.5511 0 .9999.4488.9999.9999s-.4488.9997-.9999.9997zm10.02-4.5c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9999.9999-.9999c.5511 0 .9999.4488.9999.9999s-.4488.9997-.9999.9997zm-5.01 0c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9999.9999-.9999c.5511 0 .9999.4488.9999.9999s-.4488.9997-.9999.9997zm-5.01 0c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9999.9999-.9999c.5511 0 .9999.4488.9999.9999s-.4488.9997-.9999.9997zm10.02-4.5c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9999.9999-.9999c.5511 0 .9999.4488.9999.9999s-.4488.9997-.9999.9997zm-5.01 0c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9999.9999-.9999c.5511 0 .9999.4488.9999.9999s-.4488.9997-.9999.9997zm-5.01 0c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9999.9999-.9999c.5511 0 .9999.4488.9999.9999s-.4488.9997-.9999.9997z" />
                        </svg>
                      )}
                      <span
                        className={`text-sm font-medium ${
                          user.device === "iOS"
                            ? "text-gray-600"
                            : "text-green-600"
                        }`}
                      >
                        {user.device}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLiveTime(user.liveTimeFrom)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">
                        Live
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {onlineCount > 0 ? `${onlineCount} users online` : "No live users"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {onlineCount > 0
              ? "Showing users with recent activity. Backend live users endpoint needs to be implemented for real-time data."
              : "No users are currently online."}
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveUsersPage;
