 // src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import authReducer from '../features/authSlice';
import profileReducer from '../features/profileSlice';
import departmentsReducer from '../features/departmentsSlice';
import usersReducer from '../features/usersSlice'; // Import the users reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    departments: departmentsReducer,
    users: usersReducer, // Add the users reducer to the store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
});

export default store;