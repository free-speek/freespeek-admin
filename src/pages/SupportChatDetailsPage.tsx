import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchSupportChatById,
  sendSupportChatReply,
  sendSupportChatEmailReply,
} from "../store/slices/supportChatsSlice";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import Loader from "../components/Loader";
import { usePageTitle } from "../hooks/usePageTitle";

interface SupportMessage {
  _id: string;
  content: string;
  sender: "user" | "support";
  createdAt: string;
  status?: string;
}

const SupportChatDetailsPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentChat, isLoading, error } = useAppSelector(
    (state: any) => state.supportChats
  );
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  usePageTitle("Support Chat Details");

  useEffect(() => {
    if (chatId) {
      dispatch(fetchSupportChatById(chatId));
    }
  }, [dispatch, chatId]);

  // Debug logging
  useEffect(() => {
    if (currentChat) {
      console.log("Current chat data:", currentChat);
    }
  }, [currentChat]);

  const handleSendMessage = async (type: "in-app" | "email") => {
    if (!newMessage.trim() || !chatId) return;

    const messageToSend = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    // Optimistic update - immediately show the message being sent
    if (currentChat) {
      const optimisticMessage = {
        _id: `temp-${Date.now()}`,
        content: messageToSend,
        sender: "support" as const,
        createdAt: new Date().toISOString(),
      };

      // Temporarily add the message to show it immediately
      const updatedChat = {
        ...currentChat,
        messages: [...(currentChat.messages || []), optimisticMessage],
      };

      // Update the Redux state optimistically
      dispatch({ type: "supportChats/setCurrentChat", payload: updatedChat });
    }

    try {
      if (type === "in-app") {
        await dispatch(
          sendSupportChatReply({ chatId, message: messageToSend })
        );
      } else {
        await dispatch(
          sendSupportChatEmailReply({
            chatId,
            message: messageToSend,
          })
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // If there's an error, we could revert the optimistic update here
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage("in-app");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "Invalid Date";
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
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

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chat not found</div>
      </div>
    );
  }

  // Handle the actual API response structure
  const userData = currentChat.user || currentChat;
  const messages = currentChat.messages || [];
  const status = currentChat.status || "pending";

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/support-chats")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {userData.fullName?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {userData.fullName || "Unknown User"}
              </h2>
              <p className="text-sm text-gray-500">
                {userData.email || "No email"}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                    status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : status === "active"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {status}
                </span>
                <span className="text-xs text-gray-500">
                  {messages.length} messages
                </span>
              </div>
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
          messages.map((message: SupportMessage) => (
            <div
              key={message._id}
              className={`flex ${
                message.sender === "support" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "support"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "support"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTimestamp(message.createdAt)}
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
            placeholder="Type your reply..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={() => handleSendMessage("in-app")}
            disabled={!newMessage.trim() || isSending}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send in-app message"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleSendMessage("email")}
            disabled={!newMessage.trim() || isSending}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send email reply"
          >
            <Mail className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportChatDetailsPage;
