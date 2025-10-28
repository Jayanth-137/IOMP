import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const recommendService = {
  getCropSuitability: (data) => api.post('/recommend/crop_suitability', data),
};

export const forecastService = {
  getPriceDistribution: (crop) => api.get(`/forecast/price_distribution?crop=${crop}`),
};

export const analysisService = {
  getProfitability: (data) => api.post('/analysis/profitability', data),
};

export const diagnoseService = {
  uploadImage: (formData) => api.post('/diagnose/image_upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default api;
