import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from '@/api';

const tokenKey = 'token';

//-------------------THUNKS-------------------//

export const fetchLocations = createAsyncThunk(
  'map/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        console.error("No authentication token found for fetchLocations");
        return rejectWithValue("Authentication required");
      }
      const locations = await getLocations(token);
      console.log("Fetched locations:", locations);
      return locations;
    } catch (err) {
      console.error("Error fetching locations:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addLocation = createAsyncThunk(
  'map/addLocation',
  async (location, { rejectWithValue }) => {
    try {
      console.log("Adding location in thunk:", location);
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        console.error("No authentication token found for addLocation");
        return rejectWithValue("Authentication required");
      }
      
      const response = await createLocation(location, token);
      console.log("Location added successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to add location:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const editLocation = createAsyncThunk(
  'map/editLocation',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        console.error("No authentication token found for editLocation");
        return rejectWithValue("Authentication required");
      }
      return await updateLocation(id, updatedData, token);
    } catch (err) {
      console.error("Error updating location:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeLocation = createAsyncThunk(
  'map/removeLocation',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        console.error("No authentication token found for removeLocation");
        return rejectWithValue("Authentication required");
      }
      await deleteLocation(id, token);
      return id; // return the deleted ID
    } catch (err) {
      console.error("Error deleting location:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//-------------------SLICE-------------------//

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    locations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Failed to fetch locations:", action.payload);
      })

      // Add
      .addCase(addLocation.pending, (state) => {
        // Optionally add loading state for add operation
        state.error = null;
      })
      .addCase(addLocation.fulfilled, (state, action) => {
        state.locations.push(action.payload);
        console.log("Location added to state:", action.payload);
      })
      .addCase(addLocation.rejected, (state, action) => {
        state.error = action.payload;
        console.error("Failed to add location:", action.payload);
      })

      // Edit
      .addCase(editLocation.fulfilled, (state, action) => {
        const index = state.locations.findIndex((loc) => loc._id === action.payload._id);
        if (index !== -1) {
          state.locations[index] = action.payload;
        }
      })

      // Delete
      .addCase(removeLocation.fulfilled, (state, action) => {
        state.locations = state.locations.filter((loc) => loc._id !== action.payload);
      });
  },
});

export default mapSlice.reducer;