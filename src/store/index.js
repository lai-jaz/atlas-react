import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import mapReducer from './mapSlice';
import roammateReducer from './roammateSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    map: mapReducer,
    roammates: roammateReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
