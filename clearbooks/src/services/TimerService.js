import axios from 'axios';
import API_BASE_URL from '../config';

const API_URL = '/api/timer';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

const getAllTimeEntries = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const getRunningTimer = () => {
  return axios.get(`${API_URL}/running`, { headers: getAuthHeader() });
};

const startTimer = (description) => {
  return axios.post(`${API_URL}/start`, { description }, { headers: getAuthHeader() });
};

const stopTimer = () => {
  return axios.post(`${API_URL}/stop`, {}, { headers: getAuthHeader() });
};

const deleteTimeEntry = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const getTotalTime = () => {
  return axios.get(`${API_URL}/total`, { headers: getAuthHeader() });
};

const timerService = {
  getAllTimeEntries,
  getRunningTimer,
  startTimer,
  stopTimer,
  deleteTimeEntry,
  getTotalTime
};

export default timerService;