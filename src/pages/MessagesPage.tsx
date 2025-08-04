import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchChats } from "../store/slices/chatsSlice";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  MessageCircle,
} from "lucide-react";
import Loader from "../components/Loader";

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { chats, isLoading, error, totalPages, totalChats } = useAppSelector(
    (state: any) => state.chats
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(
      fetchChats({
        page: localCurrentPage,
        limit: 20,
        search: searchTerm,
      })
    );
  }, [dispatch, searchTerm, localCurrentPage]);

  console.log("MessagesPage - chats:", chats);
  console.log("MessagesPage - isLoading:", isLoading);
  console.log("MessagesPage - error:", error);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(
      fetchChats({
        page: localCurrentPage,
        limit: 20,
        search: searchTerm,
      })
    );
    setIsRefreshing(false);
  };

  const handlePageChange = (page: number) => {
    setLocalCurrentPage(page);
  };

  const handleChatClick = (chat: any) => {
    navigate(`/chat-history/${chat._id}`);
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
        <div className="text-red-600">Error loading chats: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              Messages
            </h1>
            <p className="text-gray-600">
              Click on any chat to view the complete conversation
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh Chats"
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
            <h2 className="text-lg font-semibold text-white">All Chats</h2>
            <div className="flex items-center space-x-4">
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search in chat names..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
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
                  Participants
                </th>
                <th className="hidden sm:table-cell px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chat Type
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Message
                </th>
                <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-1 sm:px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chats.map((chat: any, index: number) => (
                <tr
                  key={chat._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors cursor-pointer`}
                  onClick={() => handleChatClick(chat)}
                >
                  <td className="px-1 sm:px-2 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-1 sm:px-2 lg:px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full bg-gray-300 flex items-center justify-center mr-2 sm:mr-3">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          {chat.participants[0]?.fullName
                            .charAt(0)
                            .toUpperCase() || "C"}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {chat.participants
                            .map((p: any) => p.fullName)
                            .join(", ")}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate">
                          {chat.participants
                            .map((p: any) => p.email)
                            .join(", ")}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          {chat.isGroupChat ? "Group Chat" : "Direct Chat"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-2 lg:px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {chat.isGroupChat ? "Group Chat" : "Direct Chat"}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-500 max-w-[150px] truncate">
                    <div className="truncate">
                      {chat.lastMessage
                        ? chat.lastMessage.content
                        : "No messages yet"}
                    </div>
                  </td>
                  <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(chat.lastActiveAt).toLocaleString()}
                  </td>
                  <td className="px-1 sm:px-2 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChatClick(chat);
                      }}
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-2 sm:px-4 lg:px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-700">
                Showing {(localCurrentPage - 1) * 20 + 1} to{" "}
                {Math.min(localCurrentPage * 20, totalChats)} of {totalChats}{" "}
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
                            : "text-gray-700 hover:bg-gray-100"
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
    </div>
  );
};

export default MessagesPage;
