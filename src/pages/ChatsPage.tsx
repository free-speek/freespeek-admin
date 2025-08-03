import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Chat {
  id: string;
  name: string;
  message: string;
  lastMessageAt: string;
  status: string;
  profilePicture: string;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Ying",
    message: "Helloo Andrea nice to meet you...",
    lastMessageAt: "Apr 3, 2024 6:44 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=Y",
  },
  {
    id: "2",
    name: "Q",
    message: "How is it going?",
    lastMessageAt: "Mar 25, 2024 8:49 AM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/10B981/FFFFFF?text=Q",
  },
  {
    id: "3",
    name: "Mehdi",
    message: "Hi Andrea, thanks for connecting Let'...",
    lastMessageAt: "Mar 22, 2024 4:04 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/F59E0B/FFFFFF?text=M",
  },
  {
    id: "4",
    name: "Patrick",
    message: "Test",
    lastMessageAt: "Apr 24, 2023 9:22 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/EF4444/FFFFFF?text=P",
  },
  {
    id: "5",
    name: "Debra",
    message: "Hello there!",
    lastMessageAt: "Aug 1, 2025 5:16 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=D",
  },
  {
    id: "6",
    name: "Ish",
    message: "How are you doing?",
    lastMessageAt: "Aug 1, 2025 5:16 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/EC4899/FFFFFF?text=I",
  },
  {
    id: "7",
    name: "Kat",
    message: "Nice to meet you!",
    lastMessageAt: "Aug 1, 2025 5:16 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=K",
  },
  {
    id: "7",
    name: "Kat",
    message: "Nice to meet you!",
    lastMessageAt: "Aug 1, 2025 5:16 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=K",
  },
  {
    id: "7",
    name: "Kat",
    message: "Nice to meet you!",
    lastMessageAt: "Aug 1, 2025 5:16 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=K",
  },
  {
    id: "7",
    name: "Kat",
    message: "Nice to meet you!",
    lastMessageAt: "Aug 1, 2025 5:16 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=K",
  },
  {
    id: "7",
    name: "Kat",
    message: "Nice to meet you!",
    lastMessageAt: "Aug 1, 2025 5:16 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=K",
  },
  {
    id: "7",
    name: "Kat",
    message: "Nice to meet you!",
    lastMessageAt: "Aug 1, 2025 5:16 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=K",
  },
  {
    id: "7",
    name: "Kat",
    message: "Nice to meet you!",
    lastMessageAt: "Aug 1, 2025 5:16 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=K",
  },
  {
    id: "7",
    name: "Kat",
    message: "Nice to meet you!",
    lastMessageAt: "Aug 1, 2025 5:16 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=K",
  },
  {
    id: "7",
    name: "Kat",
    message: "Nice to meet you!",
    lastMessageAt: "Aug 1, 2025 5:16 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=K",
  },
  {
    id: "7",
    name: "Kat",
    message: "Nice to meet you!",
    lastMessageAt: "Aug 1, 2025 5:16 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=K",
  },
  {
    id: "7",
    name: "Kat",
    message: "Nice to meet you!",
    lastMessageAt: "Aug 1, 2025 5:16 PM",
    status: "Unseen (Active)",
    profilePicture: "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=K",
  },
];

const ChatsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chats, setChats] = useState<Chat[]>(mockChats);

  // Simulate pagination with mock data
  const itemsPerPage = 10;
  const totalChats = mockChats.length;
  const totalPages = Math.ceil(totalChats / itemsPerPage);
  const startIndex = (localCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentChats = mockChats.slice(startIndex, endIndex);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handlePageChange = (page: number) => {
    setLocalCurrentPage(page);
  };

  const filteredChats = currentChats.filter((chat: Chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (chatId: string) => {
    navigate(`/chat-details/${chatId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
            <p className="text-gray-600">Manage all chat conversations</p>
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Chats List</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MessageCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChats.map((chat: Chat, index: number) => (
                <tr
                  key={chat.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 cursor-pointer transition-colors`}
                  onClick={() => handleChatClick(chat.id)}
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
                      className="btn-primary text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChatClick(chat.id);
                      }}
                    >
                      CHAT
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
                chats
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

export default ChatsPage;
