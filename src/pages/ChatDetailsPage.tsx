import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMessages } from "../store/slices/messagesSlice";
import { Send, ArrowLeft } from "lucide-react";
import Loader from "../components/Loader";
import { usePageTitle } from "../hooks/usePageTitle";

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    profilePicture: string;
  };
  chat: {
    _id: string;
    name: string;
    isGroupChat: boolean;
    participants: string[];
  };
  createdAt: string;
  lastMessage: string;
}

const ChatDetailsPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { messages, isLoading, error } = useAppSelector(
    (state: any) => state.messages
  );
  const [newMessage, setNewMessage] = useState("");

  usePageTitle("Chat Details");

  useEffect(() => {
    if (chatId) {
      dispatch(
        fetchMessages({
          page: 1,
          limit: 50,
          chatId: chatId,
        })
      );
    }
  }, [dispatch, chatId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // TODO: Implement send message functionality
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
        <div className="text-red-600">Error loading chat: {error}</div>
      </div>
    );
  }

  const chatName = messages.length > 0 ? messages[0].chat.name : "Chat";
  const chatParticipant = messages.length > 0 ? messages[0].sender : null;

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/chats")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {chatName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {chatName}
              </h2>
              <p className="text-sm text-gray-500">
                {chatParticipant ? chatParticipant.fullName : "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message: Message) => (
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
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender._id === "admin"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
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
      </div>
    </div>
  );
};

export default ChatDetailsPage;
