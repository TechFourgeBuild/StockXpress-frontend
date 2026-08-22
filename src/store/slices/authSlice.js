import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from "../../api/authApi";

const initialState = {
  user: null,
  token: localStorage.getItem("accessToken") || null,
  role: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
};

// ✅ Async Thunk: Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginApi(credentials);
      return data;
    } catch (error) {
      // ✅ Extract error message properly
      const message = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      "Login failed. Please try again.";
      return rejectWithValue(message); // ✅ Always string!
    }
  }
);

// ✅ Async Thunk: Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerApi(userData);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      "Registration failed. Please try again.";
      return rejectWithValue(message);
    }
  }
);

// ✅ Async Thunk: Logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const data = await logoutApi();
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      "Logout failed.";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Sync logout (for manual logout)
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.loading = false; // ✅ IMPORTANT
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("accessToken");
    },
    // ✅ Set token from localStorage (on app load)
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.role = action.payload.role; // ✅ ROLE SET
        state.user = {
          email: action.payload.email,
          name: action.payload.name,
        };
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      // ✅ Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        localStorage.removeItem("accessToken");
      })
      .addCase(logoutUser.rejected, (state) => {
        // ✅ Even if logout fails, clear local state
        state.user = null;
        state.token = null;
        state.role = null;
        state.isAuthenticated = false;
        localStorage.removeItem("accessToken");
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
