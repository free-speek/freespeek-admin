import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/api";

export interface Message {
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

interface MessagesResponse {
  success: boolean;
  data: {
    messages: Message[];
    totalMessages: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

interface MessagesCountResponse {
  success: boolean;
  count: number;
}

interface MessagesState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  totalMessages: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const initialState: MessagesState = {
  messages: [],
  isLoading: false,
  error: null,
  totalMessages: 0,
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export const fetchMessagesCount = createAsyncThunk(
  "messages/fetchMessagesCount",
  async (): Promise<MessagesCountResponse> => {
    const response = await apiService.getMessagesCount();
    return response as MessagesCountResponse;
  }
);

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({
    page = 1,
    limit = 20,
    search = "",
    chatId = "",
  }: {
    page?: number;
    limit?: number;
    search?: string;
    chatId?: string;
  }): Promise<MessagesResponse> => {
    const response = await apiService.getMessages(page, limit, search, chatId);
    return response as MessagesResponse;
  }
);

export const fetchMessageById = createAsyncThunk(
  "messages/fetchMessageById",
  async (messageId: string) => {
    const response = await apiService.getMessageById(messageId);
    return response;
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessagesCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalMessages = action.payload.count;
      })
      .addCase(fetchMessagesCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch messages count";
      })
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload.data.messages;
        state.totalMessages = action.payload.data.totalMessages;
        state.currentPage = action.payload.data.pagination.currentPage;
        state.totalPages = action.payload.data.pagination.totalPages;
        state.hasNextPage = action.payload.data.pagination.hasNextPage;
        state.hasPrevPage = action.payload.data.pagination.hasPrevPage;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch messages";
      })
      .addCase(fetchMessageById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessageById.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(fetchMessageById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch message";
      });
  },
});

export const { clearMessages, setCurrentPage } = messagesSlice.actions;
export default messagesSlice.reducer;
