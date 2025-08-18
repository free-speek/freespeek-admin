import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/api";

interface User {
  _id: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
  fullName: string;
  location: {
    type: string;
    coordinates: number[];
    address: string;
  };
  email: string;
  lastLogin: string;
  status: string;
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
  phoneNumber?: string;
  username?: string;
  bio?: string;
  gender?: string;
  dateOfBirth?: string;
  homeLocation?: string;
  address?: string;
}

interface UsersState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalUsers: 0,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      status = "all",
    }: { page?: number; limit?: number; search?: string; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.getUsers(page, limit, search, status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch users");
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateUser(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteUser(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete user");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = (action.payload as any).data.users || [];
        state.totalPages =
          (action.payload as any).data.pagination?.totalPages || 1;
        state.currentPage =
          (action.payload as any).data.pagination?.currentPage || 1;
        state.totalUsers =
          (action.payload as any).data.pagination?.totalUsers || 0;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        const userData = (action.payload as any)?.data || action.payload;
        state.currentUser = userData;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = action.payload as any;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
        if (state.currentUser?._id === updatedUser._id) {
          state.currentUser = updatedUser;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted user from the users array
        const deletedUser = action.payload as any;
        if (deletedUser && deletedUser._id) {
          state.users = state.users.filter(
            (user) => user._id !== deletedUser._id
          );
        }
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;
