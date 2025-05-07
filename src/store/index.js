import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import mapReducer from './mapSlice'; 

const store = configureStore({
  reducer: {
    auth: authReducer,
    map: mapReducer, 
  },
});

export default store;
