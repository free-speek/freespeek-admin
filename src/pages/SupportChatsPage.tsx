import React, { useState } from "react";
import {
  Settings,
  Grid,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SupportChat } from "../types";

const mockSupportChats: SupportChat[] = [
  {
    id: "1",
    name: "Good",
    message: "You can send a direct message by cl...",
    lastMessageAt: "Aug 1, 2025 2:32 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=G",
  },
  {
    id: "2",
    name: "Carolina",
    message: "Do you need assistance with adding ...",
    lastMessageAt: "Aug 1, 2025 2:30 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/10B981/FFFFFF?text=C",
  },
  {
    id: "3",
    name: "Zainab Ali",
    message: "Just pick a city in Saudi and find you...",
    lastMessageAt: "Aug 1, 2025 2:28 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/F59E0B/FFFFFF?text=Z",
  },
  {
    id: "4",
    name: "New User",
    message: "Hello, Can you please provide us wit...",
    lastMessageAt: "Aug 1, 2025 2:25 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/EF4444/FFFFFF?text=N",
  },
  {
    id: "5",
    name: "raven",
    message: "Are you in your account, or can't acc...",
    lastMessageAt: "Aug 1, 2025 2:20 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=r",
  },
  {
    id: "6",
    name: "Ali112",
    message: "Sorry sir, you can only get Priority lik...",
    lastMessageAt: "Aug 1, 2025 2:15 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/EC4899/FFFFFF?text=A",
  },
  {
    id: "7",
    name: "Masim",
    message: "Hello Ali Sir how we can help you",
    lastMessageAt: "Aug 1, 2025 2:10 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=M",
  },
  {
    id: "8",
    name: "Haider",
    message: "How we can help you?",
    lastMessageAt: "Aug 1, 2025 2:05 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/059669/FFFFFF?text=H",
  },
  {
    id: "8",
    name: "Haider",
    message: "How we can help you?",
    lastMessageAt: "Aug 1, 2025 2:05 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/059669/FFFFFF?text=H",
  },
  {
    id: "8",
    name: "Haider",
    message: "How we can help you?",
    lastMessageAt: "Aug 1, 2025 2:05 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/059669/FFFFFF?text=H",
  },
  {
    id: "8",
    name: "Haider",
    message: "How we can help you?",
    lastMessageAt: "Aug 1, 2025 2:05 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/059669/FFFFFF?text=H",
  },
  {
    id: "8",
    name: "Haider",
    message: "How we can help you?",
    lastMessageAt: "Aug 1, 2025 2:05 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/059669/FFFFFF?text=H",
  },
  {
    id: "8",
    name: "Haider",
    message: "How we can help you?",
    lastMessageAt: "Aug 1, 2025 2:05 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/059669/FFFFFF?text=H",
  },
  {
    id: "8",
    name: "Haider",
    message: "How we can help you?",
    lastMessageAt: "Aug 1, 2025 2:05 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/059669/FFFFFF?text=H",
  },
  {
    id: "8",
    name: "Haider",
    message: "How we can help you?",
    lastMessageAt: "Aug 1, 2025 2:05 PM",
    status: "Seen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/059669/FFFFFF?text=H",
  },
];

const SupportChatsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chats, setChats] = useState<SupportChat[]>(mockSupportChats);

  // Simulate pagination with mock data
  const itemsPerPage = 10;
  const totalChats = mockSupportChats.length;
  const totalPages = Math.ceil(totalChats / itemsPerPage);
  const startIndex = (localCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentChats = mockSupportChats.slice(startIndex, endIndex);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handlePageChange = (page: number) => {
    setLocalCurrentPage(page);
  };

  const filteredChats = currentChats.filter((chat: SupportChat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatNow = (chatId: string) => {
    navigate(`/chat-details/${chatId}`);
  };

  const handleMarkAsRead = (chatId: string) => {
    console.log("Mark as read:", chatId);
  };

  const handleDeleteChat = (chatId: string) => {
    console.log("Delete chat:", chatId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Support Chats</h1>
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Support Chats
              </h2>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="unread"
                  className="h-4 w-4 text-blue-800 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="unread" className="text-sm text-gray-600">
                  Unread
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Settings className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Grid className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Plus className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Message At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action #1
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action #2
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action #3
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChats.map((chat: SupportChat, index: number) => (
                <tr
                  key={chat.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full mr-3"
                        src={chat.profilePicture}
                        alt={chat.name}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {chat.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {chat.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {chat.lastMessageAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {chat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="btn-success text-xs"
                      onClick={() => handleChatNow(chat.id)}
                    >
                      CHAT NOW
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="btn-warning text-xs"
                      onClick={() => handleMarkAsRead(chat.id)}
                    >
                      MARK AS READ
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="btn-danger text-xs"
                      onClick={() => handleDeleteChat(chat.id)}
                    >
                      DELETE CHAT
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(localCurrentPage - 1) * 10 + 1} to{" "}
                {Math.min(localCurrentPage * 10, totalChats)} of {totalChats}{" "}
                support chats
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(localCurrentPage - 1)}
                  disabled={localCurrentPage === 1}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm rounded ${
                        localCurrentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(localCurrentPage + 1)}
                  disabled={localCurrentPage === totalPages}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default SupportChatsPage;
