import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../services/api";
import {
  UserTrackingData,
  UserTrackingStats,
  UserTrackingAnalytics,
} from "../../types";

interface UserTrackingState {
  // Stats data
  stats: UserTrackingStats | null;
  statsLoading: boolean;
  statsError: string | null;

  // Analytics data
  analytics: UserTrackingAnalytics | null;
  analyticsLoading: boolean;
  analyticsError: string | null;

  // Users list data
  users: UserTrackingData[];
  usersLoading: boolean;
  usersError: string | null;
  usersPagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };

  // Selected user details
  selectedUser: UserTrackingData | null;
  selectedUserLoading: boolean;
  selectedUserError: string | null;

  // Version-specific users
  versionUsers: UserTrackingData[];
  versionUsersLoading: boolean;
  versionUsersError: string | null;

  // Last updated timestamp
  lastUpdated: string | null;
}

const initialState: UserTrackingState = {
  stats: null,
  statsLoading: false,
  statsError: null,

  analytics: null,
  analyticsLoading: false,
  analyticsError: null,

  users: [],
  usersLoading: false,
  usersError: null,
  usersPagination: {
    current: 1,
    pages: 0,
    total: 0,
    limit: 50,
  },

  selectedUser: null,
  selectedUserLoading: false,
  selectedUserError: null,

  versionUsers: [],
  versionUsersLoading: false,
  versionUsersError: null,

  lastUpdated: null,
};

// Async thunks
export const fetchUserTrackingStats = createAsyncThunk<
  UserTrackingStats,
  void,
  { rejectValue: string }
>("userTracking/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const response = (await apiService.getUserTrackingStats()) as {
      data: UserTrackingStats;
    };
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch user tracking stats"
    );
  }
});

export const fetchUserTrackingAnalytics = createAsyncThunk<
  UserTrackingAnalytics,
  number,
  { rejectValue: string }
>("userTracking/fetchAnalytics", async (days = 30, { rejectWithValue }) => {
  try {
    const response = (await apiService.getUserTrackingAnalytics(days)) as {
      data: UserTrackingAnalytics;
    };
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch user tracking analytics"
    );
  }
});

export const fetchAllUserTracking = createAsyncThunk<
  { users: UserTrackingData[]; pagination: any },
  { page?: number; limit?: number; sortBy?: string; sortOrder?: string },
  { rejectValue: string }
>(
  "userTracking/fetchAll",
  async (
    { page = 1, limit = 50, sortBy = "lastLoginDate", sortOrder = "desc" },
    { rejectWithValue }
  ) => {
    try {
      const response = (await apiService.getAllUserTracking(
        page,
        limit,
        sortBy,
        sortOrder
      )) as { data: UserTrackingData[]; pagination: any };
      return {
        users: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch user tracking data"
      );
    }
  }
);

export const fetchUserTrackingSummary = createAsyncThunk<
  UserTrackingData,
  string,
  { rejectValue: string }
>("userTracking/fetchSummary", async (userId, { rejectWithValue }) => {
  try {
    const response = (await apiService.getUserTrackingSummary(userId)) as {
      data: UserTrackingData;
    };
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch user tracking summary"
    );
  }
});

export const fetchUsersByVersion = createAsyncThunk<
  UserTrackingData[],
  { version: string; platform?: string },
  { rejectValue: string }
>(
  "userTracking/fetchUsersByVersion",
  async ({ version, platform }, { rejectWithValue }) => {
    try {
      const response = (await apiService.getUsersByVersionFromTracking(
        version,
        platform
      )) as { data: UserTrackingData[] };
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch users by version"
      );
    }
  }
);

export const updateUserSession = createAsyncThunk<
  any,
  {
    userId: string;
    sessionData: {
      sessionStart?: string;
      sessionEnd?: string;
      duration?: number;
    };
  },
  { rejectValue: string }
>(
  "userTracking/updateSession",
  async ({ userId, sessionData }, { rejectWithValue }) => {
    try {
      const response = (await apiService.updateUserSession(
        userId,
        sessionData
      )) as { data: any };
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update user session");
    }
  }
);

export const deleteUserTracking = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("userTracking/delete", async (userId, { rejectWithValue }) => {
  try {
    await apiService.deleteUserTracking(userId);
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete user tracking");
  }
});

export const cleanupUserTrackingRecords = createAsyncThunk<
  { deletedCount: number },
  void,
  { rejectValue: string }
>("userTracking/cleanup", async (_, { rejectWithValue }) => {
  try {
    const response = (await apiService.cleanupUserTrackingRecords()) as {
      data: { deletedCount: number };
    };
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to cleanup user tracking records"
    );
  }
});

const userTrackingSlice = createSlice({
  name: "userTracking",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.statsError = null;
      state.analyticsError = null;
      state.usersError = null;
      state.selectedUserError = null;
      state.versionUsersError = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.selectedUserError = null;
    },
    clearVersionUsers: (state) => {
      state.versionUsers = [];
      state.versionUsersError = null;
    },
    setUsersPagination: (
      state,
      action: PayloadAction<{ page: number; limit: number }>
    ) => {
      state.usersPagination.current = action.payload.page;
      state.usersPagination.limit = action.payload.limit;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stats
      .addCase(fetchUserTrackingStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchUserTrackingStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUserTrackingStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload || "Failed to fetch stats";
      })

      // Fetch analytics
      .addCase(fetchUserTrackingAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.analyticsError = null;
      })
      .addCase(fetchUserTrackingAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUserTrackingAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.analyticsError = action.payload || "Failed to fetch analytics";
      })

      // Fetch all users
      .addCase(fetchAllUserTracking.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAllUserTracking.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.users;
        state.usersPagination = action.payload.pagination;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAllUserTracking.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload || "Failed to fetch users";
      })

      // Fetch user summary
      .addCase(fetchUserTrackingSummary.pending, (state) => {
        state.selectedUserLoading = true;
        state.selectedUserError = null;
      })
      .addCase(fetchUserTrackingSummary.fulfilled, (state, action) => {
        state.selectedUserLoading = false;
        state.selectedUser = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUserTrackingSummary.rejected, (state, action) => {
        state.selectedUserLoading = false;
        state.selectedUserError =
          action.payload || "Failed to fetch user summary";
      })

      // Fetch users by version
      .addCase(fetchUsersByVersion.pending, (state) => {
        state.versionUsersLoading = true;
        state.versionUsersError = null;
      })
      .addCase(fetchUsersByVersion.fulfilled, (state, action) => {
        state.versionUsersLoading = false;
        state.versionUsers = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUsersByVersion.rejected, (state, action) => {
        state.versionUsersLoading = false;
        state.versionUsersError =
          action.payload || "Failed to fetch users by version";
      })

      // Update user session
      .addCase(updateUserSession.pending, (state) => {
        state.usersLoading = true;
      })
      .addCase(updateUserSession.fulfilled, (state) => {
        state.usersLoading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateUserSession.rejected, (state) => {
        state.usersLoading = false;
      })

      // Delete user tracking
      .addCase(deleteUserTracking.pending, (state) => {
        state.usersLoading = true;
      })
      .addCase(deleteUserTracking.fulfilled, (state) => {
        state.usersLoading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteUserTracking.rejected, (state) => {
        state.usersLoading = false;
      })

      // Cleanup records
      .addCase(cleanupUserTrackingRecords.pending, (state) => {
        state.usersLoading = true;
      })
      .addCase(cleanupUserTrackingRecords.fulfilled, (state) => {
        state.usersLoading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(cleanupUserTrackingRecords.rejected, (state) => {
        state.usersLoading = false;
      });
  },
});

export const {
  clearErrors,
  clearSelectedUser,
  clearVersionUsers,
  setUsersPagination,
} = userTrackingSlice.actions;

export default userTrackingSlice.reducer;
