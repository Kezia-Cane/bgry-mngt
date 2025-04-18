import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api'; // Import our configured Axios instance

// Helper function to get initial state from localStorage
const getInitialState = () => {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('userInfo')); // Assuming user info is stored as JSON string
  return {
    user: user || null,
    token: token || null,
    isAuthenticated: !!token, // Determine based on token existence
    isLoading: false,
    error: null,
  };
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Store token and user info in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      return response.data; // Contains { token, user }
    } catch (error) {
      // Return custom error payload from backend if available
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async thunk for registration (optional, if needed)
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data; // Contains { message }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Async thunk for logout (optional backend call)
export const logoutUserBackend = createAsyncThunk(
  'auth/logoutUserBackend',
  async (_, { rejectWithValue }) => {
    try {
      // No need to pass token explicitly, interceptor handles it
      const response = await api.post('/auth/logout');
      return response.data; // Contains { message }
    } catch (error) {
       // Even if backend logout fails, we proceed with client-side logout
       console.error('Backend logout failed, proceeding with client logout:', error.response?.data);
       return rejectWithValue(error.response?.data?.message || 'Logout failed on server');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    // Standard reducer for immediate logout action
    logout: (state) => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null; // Clear errors on logout
      console.log('Logged out (cleared state and localStorage)');
    },
    clearError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload; // Error message from rejectWithValue
      })
      // Registration cases (if using registerUser thunk)
      .addCase(registerUser.pending, (state) => {
          state.isLoading = true;
          state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
          state.isLoading = false;
          // Optionally update state, e.g., set a success message
          state.error = null; // Clear error on success
      })
      .addCase(registerUser.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
      })
       // Backend Logout cases (optional - client logout happens regardless in the `logout` reducer)
      .addCase(logoutUserBackend.fulfilled, (state) => {
        // Backend call succeeded, state is already cleared by the sync `logout` action
        console.log('Backend logout successful');
      })
      .addCase(logoutUserBackend.rejected, (state, action) => {
         // Backend call failed, state is already cleared by the sync `logout` action
         console.warn('Backend logout failed:', action.payload);
      });
  },
});

// Export actions and reducer
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
