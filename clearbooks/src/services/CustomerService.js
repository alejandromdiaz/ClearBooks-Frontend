import axios from 'axios';
import API_BASE_URL from '../config';

const API_URL = '/api/customers';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

const getAllCustomers = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const getCustomer = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const createCustomer = (customerData) => {
  return axios.post(API_URL, customerData, { headers: getAuthHeader() });
};

const updateCustomer = (id, customerData) => {
  return axios.put(`${API_URL}/${id}`, customerData, { headers: getAuthHeader() });
};

const deleteCustomer = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const customerService = {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
};

export default customerService;