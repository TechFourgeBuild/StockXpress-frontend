import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getDashboardStats,
  getTotalRevenue,
  getTotalUsers,
  getTotalProducts,
  getPendingOrders,
  getLowStockProductsCount,
  getRecentOrders,
  adminRegisterUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../../api/adminApi';

// ============================================================
// ✅ ASYNC THUNKS
// ============================================================

// ✅ Fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDashboardStats();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch dashboard stats');
    }
  }
);

// ✅ Fetch total revenue
export const fetchTotalRevenue = createAsyncThunk(
  'admin/fetchTotalRevenue',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getTotalRevenue();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch revenue');
    }
  }
);

// ✅ Fetch recent orders
export const fetchRecentOrders = createAsyncThunk(
  'admin/fetchRecentOrders',
  async (days = 7, { rejectWithValue }) => {
    try {
      const data = await getRecentOrders(days);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch recent orders');
    }
  }
);

// ✅ Fetch all users
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllUsers();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch users');
    }
  }
);

// ✅ Register user with role
export const registerUserWithRole = createAsyncThunk(
  'admin/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await adminRegisterUser(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to register user');
    }
  }
);

// ✅ Update user role
export const updateUserRoleById = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const data = await updateUserRole(userId, role);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update user role');
    }
  }
);

// ✅ Delete user
export const deleteUserById = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete user');
    }
  }
);

// ============================================================
// ✅ SLICE
// ============================================================

const initialState = {
  stats: null,
  revenue: 0,
  recentOrders: [],
  users: [],
  totalUsers: 0,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAdminData: (state) => {
      state.stats = null;
      state.recentOrders = [];
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch Total Revenue
      .addCase(fetchTotalRevenue.fulfilled, (state, action) => {
        state.revenue = action.payload;
      })

      // ✅ Fetch Recent Orders
      .addCase(fetchRecentOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.totalUsers = action.payload.length;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Register User with Role
      .addCase(registerUserWithRole.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(registerUserWithRole.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ✅ Update User Role
      .addCase(updateUserRoleById.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })

      // ✅ Delete User
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.totalUsers -= 1;
      });
  },
});

export const { clearError, clearAdminData } = adminSlice.actions;
export default adminSlice.reducer;