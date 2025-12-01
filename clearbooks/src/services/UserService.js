import axios from 'axios';
import API_BASE_URL from '../config';

const API_URL = '/api/user';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

const getUserProfile = () => {
  return axios.get(`${API_URL}/profile`, { headers: getAuthHeader() });
};

const updateUserProfile = (userData) => {
  return axios.put(`${API_URL}/profile`, userData, { headers: getAuthHeader() });
};

const changePassword = (passwordData) => {
  return axios.put(`${API_URL}/change-password`, passwordData, { headers: getAuthHeader() });
};

const userService = {
  getUserProfile,
  updateUserProfile,
  changePassword
};

export default userService;