import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/api";

export interface SupportChat {
  _id: string;
  userId: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    profilePicture?: string;
  };
  messages: Array<{
    _id: string;
    content: string;
    sender: "user" | "admin";
    timestamp: string;
  }>;
  status: "pending" | "active" | "resolved";
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
}

interface SupportChatsState {
  chats: SupportChat[];
  currentChat: SupportChat | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  totalChats: number;
  stats: {
    total: number;
    pending: number;
    active: number;
    resolved: number;
  } | null;
}

const initialState: SupportChatsState = {
  chats: [],
  currentChat: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  totalChats: 0,
  stats: null,
};

export const fetchSupportChats = createAsyncThunk(
  "supportChats/fetchSupportChats",
  async (params: {
    page: number;
    limit: number;
    status?: string;
    search?: string;
  }) => {
    const response = await apiService.getSupportChats(
      params.page,
      params.limit,
      params.status || "all",
      params.search || ""
    );
    return response;
  }
);

export const fetchSupportChatById = createAsyncThunk(
  "supportChats/fetchSupportChatById",
  async (chatId: string) => {
    const response = await apiService.getSupportChatById(chatId);
    return response;
  }
);

export const sendSupportChatReply = createAsyncThunk(
  "supportChats/sendSupportChatReply",
  async ({ chatId, message }: { chatId: string; message: string }) => {
    const response = await apiService.sendSupportChatReply(chatId, message);
    return response;
  }
);

export const sendSupportChatEmailReply = createAsyncThunk(
  "supportChats/sendSupportChatEmailReply",
  async ({ chatId, message }: { chatId: string; message: string }) => {
    const response = await apiService.sendSupportChatEmailReply(
      chatId,
      message
    );
    return response;
  }
);

export const updateSupportChatStatus = createAsyncThunk(
  "supportChats/updateSupportChatStatus",
  async ({ chatId, status }: { chatId: string; status: string }) => {
    const response = await apiService.updateSupportChatStatus(chatId, status);
    return response;
  }
);

export const fetchSupportChatsStats = createAsyncThunk(
  "supportChats/fetchSupportChatsStats",
  async () => {
    const response = await apiService.getSupportChatsStats();
    return response;
  }
);

const supportChatsSlice = createSlice({
  name: "supportChats",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    clearCurrentChat: (state) => {
      state.currentChat = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch support chats
      .addCase(fetchSupportChats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSupportChats.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as any;

        // Handle the actual API response structure
        if (payload.success && payload.data) {
          state.chats = payload.data.chats || [];
          state.totalPages = payload.data.pagination?.totalPages || 1;
          state.totalChats = payload.data.totalChats || 0;
        } else {
          // Fallback for different response structures
          state.chats = payload.chats || payload.data || [];
          state.totalPages =
            payload.totalPages || payload.pagination?.totalPages || 1;
          state.totalChats = payload.totalChats || payload.total || 0;
        }
      })
      .addCase(fetchSupportChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch support chats";
      })
      // Fetch support chat by ID
      .addCase(fetchSupportChatById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSupportChatById.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as any;

        // Handle the actual API response structure
        if (payload.success && payload.data) {
          state.currentChat = payload.data;
        } else {
          state.currentChat = payload;
        }
      })
      .addCase(fetchSupportChatById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch support chat";
      })
      // Send support chat reply
      .addCase(sendSupportChatReply.fulfilled, (state, action) => {
        // Update the current chat with the new message
        if (state.currentChat) {
          const payload = action.payload as any;
          if (payload.success && payload.data && payload.data.message) {
            // Remove the optimistic message and add the real server message
            const realMessage = payload.data.message;
            state.currentChat.messages = state.currentChat.messages.filter(
              (msg) => !msg._id.startsWith("temp-")
            );
            state.currentChat.messages.push(realMessage);
            state.currentChat.lastMessageAt = realMessage.createdAt;
          } else if (payload.message) {
            // Fallback for different response structure
            const realMessage = payload.message;
            state.currentChat.messages = state.currentChat.messages.filter(
              (msg) => !msg._id.startsWith("temp-")
            );
            state.currentChat.messages.push(realMessage);
            state.currentChat.lastMessageAt =
              realMessage.createdAt || new Date().toISOString();
          }
        }
      })
      .addCase(sendSupportChatReply.rejected, (state, action) => {
        // Remove optimistic message if the API call failed
        if (state.currentChat) {
          state.currentChat.messages = state.currentChat.messages.filter(
            (msg) => !msg._id.startsWith("temp-")
          );
        }
      })
      // Send support chat email reply
      .addCase(sendSupportChatEmailReply.fulfilled, (state, action) => {
        // Update the current chat with the new message
        if (state.currentChat) {
          const payload = action.payload as any;
          if (payload.success && payload.data && payload.data.message) {
            // Remove the optimistic message and add the real server message
            const realMessage = payload.data.message;
            state.currentChat.messages = state.currentChat.messages.filter(
              (msg) => !msg._id.startsWith("temp-")
            );
            state.currentChat.messages.push(realMessage);
            state.currentChat.lastMessageAt = realMessage.createdAt;
          } else if (payload.message) {
            // Fallback for different response structure
            const realMessage = payload.message;
            state.currentChat.messages = state.currentChat.messages.filter(
              (msg) => !msg._id.startsWith("temp-")
            );
            state.currentChat.messages.push(realMessage);
            state.currentChat.lastMessageAt =
              realMessage.createdAt || new Date().toISOString();
          }
        }
      })
      .addCase(sendSupportChatEmailReply.rejected, (state, action) => {
        // Remove optimistic message if the API call failed
        if (state.currentChat) {
          state.currentChat.messages = state.currentChat.messages.filter(
            (msg) => !msg._id.startsWith("temp-")
          );
        }
      })
      // Update support chat status
      .addCase(updateSupportChatStatus.fulfilled, (state, action) => {
        // Update the chat status in both current chat and chats list
        const payload = action.payload as any;
        if (state.currentChat) {
          state.currentChat.status = payload.status;
        }
        const chatIndex = state.chats.findIndex(
          (chat) => chat._id === payload._id
        );
        if (chatIndex !== -1) {
          state.chats[chatIndex].status = payload.status;
        }
      })
      // Fetch support chats stats
      .addCase(fetchSupportChatsStats.fulfilled, (state, action) => {
        state.stats = action.payload as any;
      });
  },
});

export const { clearError, setCurrentChat, clearCurrentChat } =
  supportChatsSlice.actions;
export default supportChatsSlice.reducer;
