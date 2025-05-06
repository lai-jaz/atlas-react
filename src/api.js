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
