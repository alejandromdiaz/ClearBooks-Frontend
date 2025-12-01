import axios from 'axios';
import API_BASE_URL from '../config';

const API_URL = '/api/expenses';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

const getAllExpenses = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const getExpense = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const createExpense = (expenseData) => {
  return axios.post(API_URL, expenseData, { headers: getAuthHeader() });
};

const updateExpense = (id, expenseData) => {
  return axios.put(`${API_URL}/${id}`, expenseData, { headers: getAuthHeader() });
};

const deleteExpense = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const getTotalExpenses = () => {
  return axios.get(`${API_URL}/total`, { headers: getAuthHeader() });
};

const getExpensesByDateRange = (startDate, endDate) => {
  return axios.get(`${API_URL}/range`, {
    params: { startDate, endDate },
    headers: getAuthHeader()
  });
};

const getTotalExpensesByDateRange = (startDate, endDate) => {
  return axios.get(`${API_URL}/range/total`, {
    params: { startDate, endDate },
    headers: getAuthHeader()
  });
};

const expenseService = {
  getAllExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getTotalExpenses,
  getExpensesByDateRange,
  getTotalExpensesByDateRange
};

export default expenseService;