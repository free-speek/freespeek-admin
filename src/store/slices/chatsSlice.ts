import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/api";

interface ChatParticipant {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  profilePicture?: string;
}

interface ChatLastMessage {
  _id: string;
  content: string;
  createdAt: string;
}

interface Chat {
  _id: string;
  isGroupChat: boolean;
  participants: ChatParticipant[];
  lastMessage?: ChatLastMessage;
  lastActiveAt: string;
  createdAt: string;
}

interface ChatsResponse {
  success: boolean;
  data: {
    chats: Chat[];
    totalChats: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

interface ChatsState {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalChats: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const initialState: ChatsState = {
  chats: [],
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalChats: 0,
  hasNextPage: false,
  hasPrevPage: false,
};

export const fetchChats = createAsyncThunk(
  "chats/fetchChats",
  async (
    {
      page = 1,
      limit = 20,
      search = "",
    }: { page?: number; limit?: number; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.getChats(page, limit, search);
      return response as ChatsResponse;
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

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearChats: (state) => {
      state.chats = [];
      state.error = null;
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
        state.chats = action.payload.data.chats;
        state.totalChats = action.payload.data.totalChats;
        state.currentPage = action.payload.data.pagination.currentPage;
        state.totalPages = action.payload.data.pagination.totalPages;
        state.hasNextPage = action.payload.data.pagination.hasNextPage;
        state.hasPrevPage = action.payload.data.pagination.hasPrevPage;
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
        state.error = null;
      })
      .addCase(fetchChatById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearChats } = chatsSlice.actions;
export default chatsSlice.reducer;
