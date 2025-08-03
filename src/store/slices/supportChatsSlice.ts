import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../services/api";

interface SupportChat {
  id: string;
  name: string;
  message: string;
  lastMessageAt: string;
  status: string;
  profilePicture: string;
}

interface SupportChatsState {
  chats: SupportChat[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalChats: number;
}

const initialState: SupportChatsState = {
  chats: [],
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalChats: 0,
};

export const fetchSupportChats = createAsyncThunk(
  "supportChats/fetchSupportChats",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.getSupportChats(page, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch support chats");
    }
  }
);

const supportChatsSlice = createSlice({
  name: "supportChats",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupportChats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSupportChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = (action.payload as any).data.chats || [];
        state.totalPages =
          (action.payload as any).data.pagination?.totalPages || 1;
        state.currentPage =
          (action.payload as any).data.pagination?.currentPage || 1;
        state.totalChats =
          (action.payload as any).data.pagination?.totalChats || 0;
        state.error = null;
      })
      .addCase(fetchSupportChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = supportChatsSlice.actions;
export default supportChatsSlice.reducer;
