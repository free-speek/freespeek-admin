import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: string;
}

interface ChatUser {
  id: string;
  name: string;
  profilePicture: string;
  status: string;
}

const mockChatUsers: { [key: string]: ChatUser } = {
  "1": {
    id: "1",
    name: "Ying",
    profilePicture: "https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=Y",
    status: "Active",
  },
  "2": {
    id: "2",
    name: "Q",
    profilePicture: "https://via.placeholder.com/40x40/10B981/FFFFFF?text=Q",
    status: "Active",
  },
  "3": {
    id: "3",
    name: "Mehdi",
    profilePicture: "https://via.placeholder.com/40x40/F59E0B/FFFFFF?text=M",
    status: "Active",
  },
  "4": {
    id: "4",
    name: "Patrick",
    profilePicture: "https://via.placeholder.com/40x40/EF4444/FFFFFF?text=P",
    status: "Active",
  },
  "5": {
    id: "5",
    name: "Debra",
    profilePicture: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=D",
    status: "Active",
  },
  "6": {
    id: "6",
    name: "Ish",
    profilePicture: "https://via.placeholder.com/40x40/EC4899/FFFFFF?text=I",
    status: "Active",
  },
  "7": {
    id: "7",
    name: "Kat",
    profilePicture: "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=K",
    status: "Active",
  },
};

const mockMessages: { [key: string]: Message[] } = {
  "1": [
    {
      id: "1",
      text: "Helloo Andrea nice to meet you!",
      sender: "user",
      timestamp: "Apr 3, 2024 6:44 PM",
    },
    {
      id: "2",
      text: "Hello Ying! Nice to meet you too. How can I help you today?",
      sender: "admin",
      timestamp: "Apr 3, 2024 6:45 PM",
    },
  ],
  "2": [
    {
      id: "1",
      text: "How is it going?",
      sender: "user",
      timestamp: "Mar 25, 2024 8:49 AM",
    },
  ],
  "3": [
    {
      id: "1",
      text: "Hi Andrea, thanks for connecting Let's chat!",
      sender: "user",
      timestamp: "Mar 22, 2024 4:04 PM",
    },
  ],
  "4": [
    {
      id: "1",
      text: "Test",
      sender: "user",
      timestamp: "Apr 24, 2023 9:22 PM",
    },
  ],
  "5": [
    {
      id: "1",
      text: "Hello there!",
      sender: "user",
      timestamp: "Aug 1, 2025 5:16 PM",
    },
  ],
  "6": [
    {
      id: "1",
      text: "How are you doing?",
      sender: "user",
      timestamp: "Aug 1, 2025 5:16 PM",
    },
  ],
  "7": [
    {
      id: "1",
      text: "Nice to meet you!",
      sender: "user",
      timestamp: "Aug 1, 2025 5:16 PM",
    },
  ],
};

const ChatDetailsPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    mockMessages[chatId || "1"] || []
  );

  const chatUser = mockChatUsers[chatId || "1"];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: "admin",
        timestamp: new Date().toLocaleString(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!chatUser) {
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
            onClick={() => navigate("/chats")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <img
              className="h-10 w-10 rounded-full"
              src={chatUser.profilePicture}
              alt={chatUser.name}
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {chatUser.name}
              </h2>
              <p className="text-sm text-gray-500">{chatUser.status}</p>
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
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "admin"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "admin"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp}
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
