import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  sendConnectionRequest, 
  respondToRequest, 
  getPendingRequests, 
  getConnectedRoammates, 
  getRoammateSuggestions,
  searchRoammates,
  getAllUsers,
  removeConnectionById
} from '../api';
import { fetchUser } from './authSlice';

const tokenKey = 'token';

// Async thunks
export const fetchAllUsers = createAsyncThunk(
  'roammates/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        console.error("No token found for fetchAllUsers");
        return rejectWithValue("Authentication required");
      }
      return await getAllUsers(token);
    } catch (err) {
      console.error("Error in fetchAllUsers thunk:", err);
      return rejectWithValue(err.message || "Failed to fetch users");
    }
  }
);

export const searchForRoammates = createAsyncThunk(
  'roammates/searchForRoammates',
  async ({ query, searchType = null }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        console.error("No token found for searchForRoammates");
        return rejectWithValue("Authentication required");
      }
      return await searchRoammates(query, searchType, token);
    } catch (err) {
      console.error("Error in searchForRoammates thunk:", err);
      return rejectWithValue(err.message || "Failed to search for roammates");
    }
  }
);

export const fetchConnectedRoammates = createAsyncThunk(
  'roammates/fetchConnectedRoammates',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        return rejectWithValue("Authentication required");
      }
      return await getConnectedRoammates(token);
    } catch (err) {
      console.error("Error in fetchConnectedRoammates thunk:", err);
      return rejectWithValue(err.message || "Failed to fetch connected roammates");
    }
  }
);

export const fetchPendingRequests = createAsyncThunk(
  'roammates/fetchPendingRequests',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        return rejectWithValue("Authentication required");
      }
      return await getPendingRequests(token);
    } catch (err) {
      console.error("Error in fetchPendingRequests thunk:", err);
      return rejectWithValue(err.message || "Failed to fetch pending requests");
    }
  }
);

export const fetchRoammateSuggestions = createAsyncThunk(
  'roammates/fetchRoammateSuggestions',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        return rejectWithValue("Authentication required");
      }
      return await getRoammateSuggestions(token);
    } catch (err) {
      console.error("Error in fetchRoammateSuggestions thunk:", err);
      return rejectWithValue(err.message || "Failed to fetch roammate suggestions");
    }
  }
);

export const sendRequest = createAsyncThunk(
  'roammates/sendRequest',
  async (recipientId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        return rejectWithValue("Authentication required");
      }
      const result = await sendConnectionRequest(recipientId, token);
      return { recipientId, result };
    } catch (err) {
      console.error("Error in sendRequest thunk:", err);
      return rejectWithValue(err.message || "Failed to send connection request");
    }
  }
);

export const respondToConnectionRequest = createAsyncThunk(
  'roammates/respondToConnectionRequest',
  async ({ requestId, action }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        return rejectWithValue("Authentication required");
      }
      const result = await respondToRequest(requestId, action, token);
      return { requestId, action, result };
    } catch (err) {
      console.error("Error in respondToConnectionRequest thunk:", err);
      return rejectWithValue(err.message || "Failed to respond to connection request");
    }
  }
);

export const removeConnection = createAsyncThunk(
  'roammates/removeConnection',
  async (connectionId, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        console.error("No token found for removeConnection");
        return rejectWithValue("Authentication required");
      }
      
      // Make API call to remove the connection
      await removeConnectionById(connectionId, token);
      
      // Refresh connected roammates after removing a connection
      dispatch(fetchConnectedRoammates());
      
      // Also refresh user data to update counts
      dispatch(fetchUser());
      
      return connectionId;
    } catch (err) {
      console.error("Error in removeConnection thunk:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const roammateSlice = createSlice({
  name: 'roammates',
  initialState: {
    connected: [],
    pending: [],
    suggestions: [],
    searchResults: [],
    allUsers: [],
    loading: false,
    error: null
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchAllUsers
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // searchForRoammates
      .addCase(searchForRoammates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchForRoammates.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchForRoammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchConnectedRoammates
      .addCase(fetchConnectedRoammates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConnectedRoammates.fulfilled, (state, action) => {
        state.loading = false;
        state.connected = action.payload;
      })
      .addCase(fetchConnectedRoammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchPendingRequests
      .addCase(fetchPendingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = action.payload;
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchRoammateSuggestions
      .addCase(fetchRoammateSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoammateSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchRoammateSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // sendRequest
      .addCase(sendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Update the user in search results to show pending status
        state.searchResults = state.searchResults.map(user => {
          if (user._id === action.payload.recipientId) {
            return { ...user, connectionStatus: 'pending' };
          }
          return user;
        });
        // Also update in allUsers
        state.allUsers = state.allUsers.map(user => {
          if (user._id === action.payload.recipientId) {
            return { ...user, connectionStatus: 'pending' };
          }
          return user;
        });
      })
      .addCase(sendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // respondToConnectionRequest
      .addCase(respondToConnectionRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(respondToConnectionRequest.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.action === 'accepted') {
          // Find the request that was accepted
          const acceptedRequest = state.pending.find(
            req => req._id === action.payload.requestId
          );
          if (acceptedRequest) {
            // Add the requester to connected users
            const requester = acceptedRequest.requester;
            requester.connectionStatus = 'accepted';
            state.connected.push(requester);
          }
        }
        // Remove the request from pending
        state.pending = state.pending.filter(
          req => req._id !== action.payload.requestId
        );
      })
      .addCase(respondToConnectionRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeConnection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeConnection.fulfilled, (state, action) => {
        state.loading = false;
        // The connection will be removed from the connected list when fetchConnectedRoammates completes
      })
      .addCase(removeConnection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSearchResults, clearError } = roammateSlice.actions;
export default roammateSlice.reducer;