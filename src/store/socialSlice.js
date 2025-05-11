import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const toggleLike = createAsyncThunk(
  'social/toggleLike',
  async (journalId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/social/journals/${journalId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { journalId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addComment = createAsyncThunk(
  'social/addComment',
  async ({ journalId, content }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/social/journals/${journalId}/comment`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { journalId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const socialSlice = createSlice({
  name: 'social',
  initialState: {
    likes: {},
    comments: {},
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { journalId, liked } = action.payload;
        state.likes[journalId] = liked;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { journalId, comment } = action.payload;
        if (!state.comments[journalId]) {
          state.comments[journalId] = [];
        }
        state.comments[journalId].unshift(comment);
      });
  }
});

export default socialSlice.reducer;