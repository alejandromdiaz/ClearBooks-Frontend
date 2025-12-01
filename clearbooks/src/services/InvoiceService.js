import axios from 'axios';
import API_BASE_URL from '../config';

const API_URL = '/api/invoices';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

const getAllInvoices = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const getInvoice = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const createInvoice = (invoiceData) => {
  return axios.post(API_URL, invoiceData, { headers: getAuthHeader() });
};

const updateInvoice = (id, invoiceData) => {
  return axios.put(`${API_URL}/${id}`, invoiceData, { headers: getAuthHeader() });
};

const deleteInvoice = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const downloadPdf = (id) => {
  return axios.get(`${API_URL}/${id}/pdf`, {
    headers: getAuthHeader(),
    responseType: 'blob'
  });
};

const togglePaidStatus = (id) => {
  return axios.patch(`${API_URL}/${id}/paid`, {}, { headers: getAuthHeader() });
};

const invoiceService = {
  getAllInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  downloadPdf,
  togglePaidStatus
};

export default invoiceService;