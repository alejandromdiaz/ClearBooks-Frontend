// src/services/AuthService.js
import axios from 'axios';
import API_BASE_URL from '../config'; // Expecting: "http://158.158.52.211:8080"

// FIX: Combine the Base URL (with port) and the specific path
const API_URL = `${API_BASE_URL}/api/auth`; 

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data; 
  } catch (error) {
    if (error.response && error.response.data) {
      // Backend returned a specific error message (e.g., "VAT number already exists")
      throw error.response.data;
    } else {
      // Network error or server unreachable
      throw { status: 500, error: 'Network or server error' };
    }
  }
};

// Login user
const login = async (vatNumber, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { vatNumber, password }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Store token/user data if login is successful
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { status: 500, error: 'Network or server error' };
    }
  }
};

// Logout
const logout = () => {
  localStorage.removeItem('user');
};

// Get currently logged-in user
const getCurrentUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export default { register, login, logout, getCurrentUser };