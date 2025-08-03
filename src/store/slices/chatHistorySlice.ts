import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/api";

export interface ChatHistoryMessage {
  _id: string;
  content: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
}

export interface ChatDetails {
  _id: string;
  isGroupChat: boolean;
  participants: {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
  }[];
  admins: string[];
  createdAt: string;
  lastActiveAt: string;
}

interface ChatHistoryResponse {
  success: boolean;
  data: {
    chat: ChatDetails;
    messages: ChatHistoryMessage[];
    totalMessages: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

interface ChatHistoryState {
  chat: ChatDetails | null;
  messages: ChatHistoryMessage[];
  isLoading: boolean;
  error: string | null;
  totalMessages: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const initialState: ChatHistoryState = {
  chat: null,
  messages: [],
  isLoading: false,
  error: null,
  totalMessages: 0,
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export const fetchChatHistory = createAsyncThunk(
  "chatHistory/fetchChatHistory",
  async ({
    chatId,
    page = 1,
    limit = 50,
  }: {
    chatId: string;
    page?: number;
    limit?: number;
  }): Promise<ChatHistoryResponse> => {
    const response = await apiService.getChatHistory(chatId, page, limit);
    return response as ChatHistoryResponse;
  }
);

const chatHistorySlice = createSlice({
  name: "chatHistory",
  initialState,
  reducers: {
    clearChatHistory: (state) => {
      state.chat = null;
      state.messages = [];
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chat = action.payload.data.chat;
        state.messages = action.payload.data.messages;
        state.totalMessages = action.payload.data.totalMessages;
        state.currentPage = action.payload.data.pagination.currentPage;
        state.totalPages = action.payload.data.pagination.totalPages;
        state.hasNextPage = action.payload.data.pagination.hasNextPage;
        state.hasPrevPage = action.payload.data.pagination.hasPrevPage;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch chat history";
      });
  },
});

export const { clearChatHistory, setCurrentPage } = chatHistorySlice.actions;
export default chatHistorySlice.reducer;
