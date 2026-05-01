import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getme,
  login as loginRequest,
  registration as registrationRequest,
} from "../Services/auth.api";

const getErrorMessage = (error, fallbackMessage) => {
  return error.response?.data?.message || error.message || fallbackMessage;
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      return await registrationRequest(credentials);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Registration failed"));
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginRequest(credentials);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  },
);

export const loadCurrentUser = createAsyncThunk(
  "auth/loadCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await getme();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to fetch user"));
    }
  },
);

const initialState = {
  user: null,
  registeredUser: null,
  isAuthenticated: false,
  sessionChecked: false,
  status: "idle",
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthMessage: (state) => {
      state.error = null;
      state.message = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionChecked = true;
      state.status = "idle";
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.registeredUser = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.sessionChecked = true;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      })
      .addCase(loadCurrentUser.pending, (state) => {
        state.status = "checking";
        state.error = null;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.sessionChecked = true;
        state.message = action.payload.message;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.status = "idle";
        state.error = null;
        state.user = null;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      });
  },
});

export const { clearAuthMessage, logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
