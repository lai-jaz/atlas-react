import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, register, getUserData } from '@/api';

const tokenKey = 'token';

export const initAuth = createAsyncThunk('auth/init', async (_, { dispatch }) => {
  const token = localStorage.getItem('token');
  if (token) {
    await dispatch(fetchUser());
  }
});

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem(tokenKey);
  if (!token) return rejectWithValue('No token');
  try {
    return await getUserData(token);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await login(email, password);
    localStorage.setItem(tokenKey, data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async ({ email, password, name }, { rejectWithValue }) => {
  try {
    const data = await register(email, password, name);
    localStorage.setItem(tokenKey, data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem(tokenKey);
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;