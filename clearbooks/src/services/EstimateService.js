import axios from 'axios';
import API_BASE_URL from '../config';

const API_URL = '/api/estimates';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

const getAllEstimates = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const getEstimate = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const createEstimate = (estimateData) => {
  return axios.post(API_URL, estimateData, { headers: getAuthHeader() });
};

const updateEstimate = (id, estimateData) => {
  return axios.put(`${API_URL}/${id}`, estimateData, { headers: getAuthHeader() });
};

const deleteEstimate = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const downloadPdf = (id) => {
  return axios.get(`${API_URL}/${id}/pdf`, {
    headers: getAuthHeader(),
    responseType: 'blob'
  });
};

const convertToInvoice = (id) => {
  console.log('Converting estimate to invoice, ID:', id);
  const headers = getAuthHeader();
  console.log('Auth headers:', headers);
  return axios.post(`${API_URL}/${id}/convert-to-invoice`, {}, { headers });
};

const estimateService = {
  getAllEstimates,
  getEstimate,
  createEstimate,
  updateEstimate,
  deleteEstimate,
  downloadPdf,
  convertToInvoice
};

export default estimateService;