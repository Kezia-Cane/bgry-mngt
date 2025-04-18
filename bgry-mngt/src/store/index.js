import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
// Import other reducers here if you create more slices

const store = configureStore({
  reducer: {
    auth: authReducer,
    // other reducers can be added here
  },
  // Middleware is automatically added by configureStore (includes thunk)
});

export default store;
