import axios from 'axios';

const API_URL = "http://localhost:3000/api";

//-----------------REGISTER-----------------//
export const register = async (email, password, name) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password, name });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

//-----------------LOGIN-----------------//
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // return JWT token
  } catch (error) {
    throw error;
  }
};

//-----------------GET USER DATA-----------------//
export const getUserData = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data; // return user data
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

//-----------------UPDATE USER PROFILE-----------------//

export const updateProfile = async (profileData, file) => {
  const formData = new FormData();

  formData.append('name', profileData.name);
  formData.append('email', profileData.email);
  formData.append('bio', profileData.profile.bio);
  formData.append('location', profileData.profile.location);
  formData.append('interests', profileData.profile.interests);

  if (file) {
    formData.append('avatar', file);
  }

  try{
    const response = await axios.patch(`${API_URL}/profile/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;

  }catch (error) {
    throw error;
  }

};

//-----------------PINNED LOCATIONS-----------------//

// GET all pinned locations
export const getLocations = async (token) => {
  console.log("API call - fetching locations with token");
  if (!token) {
    console.error("No token provided for getLocations");
    throw new Error("Authentication required");
  }
  
  try {
    const res = await axios.get(`${API_URL}/locations`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("API response - locations:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching locations:", err.response || err);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    throw err;
  }
};

// POST new pinned location
export const createLocation = async (location, token) => {
  console.log("API call - creating location:", location);
  if (!token) {
    console.error("No token provided for createLocation");
    throw new Error("Authentication required");
  }
  
  try {
    const res = await axios.post(`${API_URL}/locations`, location, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log("API response - location created:", res.status, res.data);
    return res.data;
  } catch (err) {
    console.error("Error creating location:", err.response || err);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    throw err;
  }
};

// PUT (update) existing pinned location
export const updateLocation = async (id, updatedData, token) => {
  console.log("API call - updating location:", id, updatedData);
  if (!token) {
    console.error("No token provided for updateLocation");
    throw new Error("Authentication required");
  }
  
  try {
    const res = await axios.put(`${API_URL}/locations/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log("API response - location updated:", res.status, res.data);
    return res.data;
  } catch (err) {
    console.error("Error updating location:", err.response || err);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    throw err;
  }
};

// DELETE pinned location
export const deleteLocation = async (id, token) => {
  console.log("API call - deleting location:", id);
  if (!token) {
    console.error("No token provided for deleteLocation");
    throw new Error("Authentication required");
  }
  
  try {
    const res = await axios.delete(`${API_URL}/locations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("API response - location deleted:", res.status, res.data);
    return res.data;
  } catch (err) {
    console.error("Error deleting location:", err.response || err);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    throw err;
  }
  
};

//-----------------GET RANDOM DAILY TIP-----------------//
export const getRandomTip = async () => {
  try {
    const res = await axios.get(`${API_URL}/tips/random`);
    return res.data;
  } catch (err) {
    console.error("Error fetching random tip:", err);
    throw err;
  }
};
//-----------------JOURNALS-----------------//

// GET all journals for the logged-in user
export const getJournals = async (userId) => {
  try {
    const res = await fetch(`${API_URL}/journals?userId=${userId}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching journals:", error);
    throw error;
  }
};


// POST a new journal
export const createJournal = async (journalData, file) => {
  try {
    const formData = new FormData();

    formData.append('title', journalData.title);
    formData.append('content', journalData.content);
    formData.append('location', journalData.location);
    formData.append('tags', journalData.tags);
    formData.append('userId', journalData.userId);
    formData.append('date', journalData.date);

    if (file) {
      formData.append('imageUrl', file);
    }

    const res = await axios.post(`${API_URL}/journals`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  } catch (err) {
    console.error("Error creating journal:", err);
    throw err;
  }
};

// GET author of journal
export const getAuthorInfo = async (authorid) => {
  try{
      const res = await axios.get(`${API_URL}/users/${authorid}`);
      const author = res.data;

      return {
        name: author.name,
        avatar: author.profile?.avatar || '', // fallback to empty string if missing
      };
  }
  catch(err) {
    throw err;
  }
}

//update an existing journal
export const updateJournal = async (id, updatedData) => {
  try {
    const res = await axios.put(`${API_URL}/journals/${id}`, updatedData
    );
    return res.data;
  } catch (err) {
    console.error("Error updating journal:", err.response || err);
    throw err;
  }
};

//DELETE a journal
export const deleteJournal = async (id, userId) => {
  try {
    const res = await axios.delete(`${API_URL}/journals/${id}`, {
      data: { userId },
    });
    return res.data;
  } catch (err) {
    console.error("Error deleting journal:", err.response || err);
    throw err;
  }
};

// GET a single journal by ID
export const getJournalById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/journals/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching journal with ID ${id}:`, err);
    throw err;
  }
};

export const getMemories = async (userId, period) => {
  try {
    const res = await fetch(`${API_URL}/journals/memories?userId=${userId}&period=${period}`);
    if (!res.ok) throw new Error("Failed to fetch memories");
    return await res.json(); 
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};

//---------------------JOURNAL LIKES/COMMENTS-----------//
const checkConnection = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/social/check-connection/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.isConnected;
  } catch (error) {
    return false;
  }
};

export const toggleJournalLike = async (journalId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/social/journals/${journalId}/like`,
      {},
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('Must be connected to like this journal');
    }
    throw error;
  }
};

export const addJournalComment = async (journalId, content, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/social/journals/${journalId}/comment`,
      { content },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const getJournalComments = async (journalId, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/social/journals/${journalId}/comments`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const toggleTipLike = async (tipId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/social/tips/${tipId}/like`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling tip like:", error);
    throw error;
  }
};


//-----------------ROAMMATES (CONNECTIONS)-----------------//

// Get all users (for testing)
export const getAllUsers = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication required");
    }
    
    const res = await axios.get(`${API_URL}/roammates/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching all users:", err);
    throw err;
  }
};

// Search for users
export const searchRoammates = async (query, searchType = null, token) => {
  try {
    if (!token) {
      throw new Error("Authentication required");
    }
    
    const params = { query };
    if (searchType) {
      params.searchType = searchType;
    }
    
    const res = await axios.get(`${API_URL}/roammates/search`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (err) {
    console.error("Error searching for roammates:", err);
    throw err;
  }
};

// Get connected roammates
export const getConnectedRoammates = async (token) => {
  if (!token) {
    throw new Error("Authentication required");
  }
  
  try {
    const res = await axios.get(`${API_URL}/roammates/connected`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("API response - connected roammates:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching connected roammates:", err.response || err);
    if (err.response?.status === 401) {
      throw new Error("Authentication required");
    }
    throw err;
  }
};

// Get pending connection requests
export const getPendingRequests = async (token) => {
  if (!token) {
    throw new Error("Authentication required");
  }
  
  try {
    const res = await axios.get(`${API_URL}/roammates/pending`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("API response - pending requests:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching pending requests:", err.response || err);
    if (err.response?.status === 401) {
      throw new Error("Authentication required");
    }
    throw err;
  }
};

// Get roammate suggestions
export const getRoammateSuggestions = async (token) => {
  if (!token) {
    throw new Error("Authentication required");
  }
  
  try {
    const res = await axios.get(`${API_URL}/roammates/suggestions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("API response - roammate suggestions:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching roammate suggestions:", err.response || err);
    if (err.response?.status === 401) {
      throw new Error("Authentication required");
    }
    throw err;
  }
};

// Send connection request
export const sendConnectionRequest = async (recipientId, token) => {
  if (!token) {
    throw new Error("Authentication required");
  }
  
  try {
    const res = await axios.post(`${API_URL}/roammates/request`, 
      { recipientId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("API response - connection request sent:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error sending connection request:", err.response || err);
    if (err.response?.status === 401) {
      throw new Error("Authentication required");
    }
    throw err;
  }
};

// Respond to connection request
export const respondToRequest = async (requestId, action, token) => {
  if (!token) {
    throw new Error("Authentication required");
  }
  
  try {
    const res = await axios.put(`${API_URL}/roammates/respond`, 
      { requestId, action },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("API response - responded to request:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error responding to connection request:", err.response || err);
    if (err.response?.status === 401) {
      throw new Error("Authentication required");
    }
    throw err;
  }
};

export const removeConnectionById = async (connectionId, token) => {
  try {
    const res = await axios.delete(`${API_URL}/roammates/connection/${connectionId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (err) {
    console.error("Error removing connection:", err);
    throw err;
  }
};