import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../configs/api";

export const fetchUserCredentials = createAsyncThunk(
  "auth/fetchUserCredentials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/auth/me`);
      return response.data.user; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post(`/auth/logout`);
      return null; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchUserCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCredentials.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchUserCredentials.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;