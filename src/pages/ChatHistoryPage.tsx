import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchChatHistory,
  ChatHistoryMessage,
} from "../store/slices/chatHistorySlice";
import { ArrowLeft } from "lucide-react";
import Loader from "../components/Loader";
import { usePageTitle } from "../hooks/usePageTitle";

const ChatHistoryPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    chat,
    messages,
    isLoading,
    error,
    currentPage,
    hasNextPage,
    hasPrevPage,
  } = useAppSelector((state: any) => state.chatHistory);
  //   const [newMessage, setNewMessage] = useState("");

  usePageTitle("Chat History");

  useEffect(() => {
    if (chatId) {
      dispatch(
        fetchChatHistory({
          chatId,
          page: 1,
          limit: 50,
        })
      );
    }
  }, [dispatch, chatId]);

  //   const handleSendMessage = () => {
  //     if (newMessage.trim()) {
  //       // TODO: Implement send message functionality
  //       setNewMessage("");
  //     }
  //   };

  //   const handleKeyPress = (e: React.KeyboardEvent) => {
  //     if (e.key === "Enter" && !e.shiftKey) {
  //       e.preventDefault();
  //       handleSendMessage();
  //     }
  //   };

  const handleLoadMore = () => {
    if (hasNextPage && chatId) {
      dispatch(
        fetchChatHistory({
          chatId,
          page: currentPage + 1,
          limit: 50,
        })
      );
    }
  };

  if (isLoading && !chat) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error loading chat history: {error}</div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Chat not found</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/messages")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {chat.participants[0]?.fullName.charAt(0).toUpperCase() || "C"}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {chat.isGroupChat ? "Group Chat" : "Direct Chat"}
              </h2>
              <p className="text-sm text-gray-500">
                {chat.participants.map((p: any) => p.fullName).join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Load More Button */}
      {hasPrevPage && (
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader size="sm" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              "Load More Messages"
            )}
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message: ChatHistoryMessage) => (
            <div
              key={message._id}
              className={`flex ${
                message.sender._id === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender._id === "admin"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium">
                    {message.sender.fullName}
                  </span>
                  <span
                    className={`text-xs ${
                      message.sender._id === "admin"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      {/* <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Start typing..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default ChatHistoryPage;
