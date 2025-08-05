import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchSupportChats,
  fetchSupportChatsStats,
  updateSupportChatStatus,
} from "../store/slices/supportChatsSlice";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import Loader from "../components/Loader";
import { usePageTitle } from "../hooks/usePageTitle";

const SupportChatsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { chats, isLoading, error, totalPages, totalChats, stats } =
    useAppSelector((state: any) => state.supportChats);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  usePageTitle("Support Chats");

  useEffect(() => {
    dispatch(
      fetchSupportChats({
        page: localCurrentPage,
        limit: 10,
        status: statusFilter,
        search: searchTerm,
      })
    );
  }, [dispatch, searchTerm, statusFilter, localCurrentPage]);

  useEffect(() => {
    dispatch(fetchSupportChatsStats());
  }, [dispatch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(
      fetchSupportChats({
        page: localCurrentPage,
        limit: 10,
        status: statusFilter,
        search: searchTerm,
      })
    );
    setIsRefreshing(false);
  };

  const handlePageChange = (page: number) => {
    setLocalCurrentPage(page);
  };

  const handleViewChat = async (chatId: string) => {
    try {
      navigate(`/support-chat-details/${chatId}`);
    } catch (error) {
      console.error("Failed to navigate to chat details:", error);
    }
  };

  const handleStatusChange = async (chatId: string, newStatus: string) => {
    try {
      await dispatch(updateSupportChatStatus({ chatId, status: newStatus }));
      dispatch(
        fetchSupportChats({
          page: localCurrentPage,
          limit: 10,
          status: statusFilter,
          search: searchTerm,
        })
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "active":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading && !chats.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error loading support chats: {error}</div>
      </div>
    );
  }

  // Handle case where chats is not an array (API not ready or error)
  if (!Array.isArray(chats)) {
    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Support Chats
              </h1>
              <p className="text-gray-600">Manage support conversations</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh Support Chats"
            >
              <RefreshCw
                className={`h-5 w-5 text-gray-600 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-blue-800 rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <h2 className="text-lg font-semibold text-white">
                  Support Chats
                </h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search by name or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="p-8 text-center text-white">
            <div className="text-lg font-semibold mb-2">
              Loading Support Chats...
            </div>
            <div className="text-sm opacity-75">
              Please wait while we fetch the data
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              Support Chats
            </h1>
            <p className="text-gray-600">Manage support conversations</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh Support Chats"
          >
            <RefreshCw
              className={`h-5 w-5 text-gray-600 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Chats</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.resolved}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-800 rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <h2 className="text-lg font-semibold text-white">
                Support Chats
              </h2>
              <div className="flex items-center space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-1 sm:px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-1 sm:px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="hidden sm:table-cell px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Message
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Message At
                </th>
                <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-1 sm:px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(chats) &&
                chats.map((chat: any, index: number) => (
                  <tr
                    key={chat._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-1 sm:px-2 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-1 sm:px-2 lg:px-6 py-4">
                      <div className="flex items-center">
                        <img
                          className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full mr-2 sm:mr-3"
                          src={
                            chat.user?.profilePicture ||
                            `https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=${
                              chat.user?.fullName?.charAt(0) || "U"
                            }`
                          }
                          alt={chat.user?.fullName}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {chat.user?.fullName || "Unknown User"}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 truncate">
                            {chat.user?.email || "No email"}
                          </div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            {chat.lastMessage?.content?.substring(0, 40) ||
                              "No messages"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-2 lg:px-6 py-4 text-sm text-gray-500 max-w-[120px] truncate">
                      {chat.lastMessage?.content || "No messages"}
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {chat.lastMessage?.createdAt
                        ? new Date(chat.lastMessage.createdAt).toLocaleString()
                        : "No messages"}
                    </td>
                    <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          chat.status
                        )}`}
                      >
                        {getStatusIcon(chat.status)}
                        <span className="ml-1">{chat.status}</span>
                      </span>
                    </td>
                    <td className="px-1 sm:px-2 lg:px-6 py-4 text-sm font-medium">
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => handleViewChat(chat._id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </button>
                        <select
                          value={chat.status}
                          onChange={(e) =>
                            handleStatusChange(chat._id, e.target.value)
                          }
                          className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              {(!Array.isArray(chats) || chats.length === 0) && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {isLoading
                      ? "Loading support chats..."
                      : "No support chats found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-2 sm:px-4 lg:px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-700">
                Showing {(localCurrentPage - 1) * 10 + 1} to{" "}
                {Math.min(localCurrentPage * 10, totalChats)} of {totalChats}{" "}
                chats
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => handlePageChange(localCurrentPage - 1)}
                  disabled={localCurrentPage === 1}
                  className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 py-1 text-xs sm:text-sm rounded ${
                          localCurrentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-white hover:bg-blue-900"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(localCurrentPage + 1)}
                  disabled={localCurrentPage === totalPages}
                  className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Details Modal */}
      {/* This section is removed as chat details are now on a separate page */}
    </div>
  );
};

export default SupportChatsPage;
