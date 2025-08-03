import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../services/api";

interface Chat {
  id: string;
  name: string;
  message: string;
  lastMessageAt: string;
  status: string;
  profilePicture: string;
}

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

interface ChatsState {
  chats: Chat[];
  currentChat: {
    user: ChatUser | null;
    messages: Message[];
  };
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: ChatsState = {
  chats: [],
  currentChat: {
    user: null,
    messages: [],
  },
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

export const fetchChats = createAsyncThunk(
  "chats/fetchChats",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
    }: { page?: number; limit?: number; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.getChats(page, limit, search);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch chats");
    }
  }
);

export const fetchChatById = createAsyncThunk(
  "chats/fetchChatById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getChatById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch chat");
    }
  }
);

export const fetchChatMessages = createAsyncThunk(
  "chats/fetchChatMessages",
  async (chatId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getChatMessages(chatId);
      return { chatId, messages: response };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch messages");
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chats/sendMessage",
  async (
    { chatId, message }: { chatId: string; message: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.sendMessage(chatId, message);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to send message");
    }
  }
);

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentChat: (state) => {
      state.currentChat = {
        user: null,
        messages: [],
      };
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.currentChat.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chats
      .addCase(fetchChats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = (action.payload as any).chats || [];
        state.totalPages = (action.payload as any).totalPages || 1;
        state.currentPage = (action.payload as any).currentPage || 1;
        state.error = null;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch chat by ID
      .addCase(fetchChatById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentChat.user = action.payload as any;
        state.error = null;
      })
      .addCase(fetchChatById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch chat messages
      .addCase(fetchChatMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        const { chatId, messages } = action.payload as any;
        if (state.currentChat.user?.id === chatId) {
          state.currentChat.messages = messages;
        }
        state.error = null;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const newMessage = action.payload as any;
        state.currentChat.messages.push(newMessage);
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentChat, addMessage } = chatsSlice.actions;
export default chatsSlice.reducer;
