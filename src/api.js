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
    console.error("Login error:", error);
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
export const getJournals = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/journals');
    return res.data;
  } catch (err) {
    console.error('Error fetching journals:', err);
    throw err;
  }
};


// POST a new journal
export const createJournal = async (journalData) => {
  try {
    const res = await axios.post("http://localhost:3000/api/journals", journalData, {
      headers: {
        "Content-Type": "application/json"
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error creating journal:", err);
    throw err;
  }
};




// // PUT (update) an existing journal
// export const updateJournal = async (id, updatedData, token) => {
//   if (!token) throw new Error("Authentication required");

//   try {
//     const res = await axios.put(`${API_URL}/journals/${id}`, updatedData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     return res.data;
//   } catch (err) {
//     console.error("Error updating journal:", err.response || err);
//     throw err;
//   }
// };

// // DELETE a journal
// export const deleteJournal = async (id, token) => {
//   if (!token) throw new Error("Authentication required");

//   try {
//     const res = await axios.delete(`${API_URL}/journals/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return res.data;
//   } catch (err) {
//     console.error("Error deleting journal:", err.response || err);
//     throw err;
//   }
// };
// GET a single journal by ID
export const getJournalById = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/journals/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching journal with ID ${id}:`, err);
    throw err;
  }
};


