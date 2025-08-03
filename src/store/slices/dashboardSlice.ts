import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../services/api";

interface DashboardStats {
  userCount: number;
  deletedUserCount: number;
  activeUserCount: number;
  activePostCount: number;
  deletedPostCount: number;
  buyListingsCount: number;
  sellListingsCount: number;
  restaurantRatingCount: number;
  businessRatingCount: number;
  safetyAlertsCount: number;
  urgentAlertCount: number;
  lostPostsCount: number;
  foundPostsCount: number;
  pollPostCount: number;
  completedPollPostCount: number;
  participantsInPollCount: number;
  eventsCount: number;
  onlineUsersCount?: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  isLoading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const [statsResponse, onlineUsersResponse] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getOnlineUsersCount(),
      ]);

      console.log("Dashboard stats response:", statsResponse);
      console.log("Online users response:", onlineUsersResponse);

      return {
        ...(statsResponse as any),
        data: {
          ...(statsResponse as any).data,
          onlineUsersCount: (onlineUsersResponse as any).count,
        },
      };
    } catch (error: any) {
      console.error("Dashboard fetch error:", error);
      return rejectWithValue(
        error.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = (action.payload as any).data;
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
