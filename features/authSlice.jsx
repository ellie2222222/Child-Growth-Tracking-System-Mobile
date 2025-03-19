// authSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Use axios directly instead of importing api

// Async Thunk for fetching user credentials
export const fetchUserCredentials = createAsyncThunk(
  "auth/fetchUserCredentials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_LOCAL_API_URL}/auth/me`,
        { withCredentials: true }
      );
      return response.data.user; // Return the user data
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle errors
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
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addCase(fetchUserCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state
      .addCase(fetchUserCredentials.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      // Handle rejected state
      .addCase(fetchUserCredentials.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
