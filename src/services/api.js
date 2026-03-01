import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const deviceId = localStorage.getItem('deviceId') || generateDeviceId();
  config.headers['x-device-id'] = deviceId;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

const generateDeviceId = () => {
  const id = 'DEV_' + Math.random().toString(36).substr(2, 16).toUpperCase();
  localStorage.setItem('deviceId', id);
  return id;
};

export const authAPI = {
  register: data => api.post('/auth/register', data),
  login: data => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: data => api.put('/auth/profile', data)
};

export const productAPI = {
  getAll: params => api.get('/products', { params }),
  getOne: id => api.get(`/products/${id}`),
  create: data => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: id => api.delete(`/products/${id}`),
  seed: () => api.post('/products/admin/seed')
};

export const cartAPI = {
  validate: items => api.post('/cart/validate', { items })
};

export const orderAPI = {
  create: data => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getOne: id => api.get(`/orders/${id}`)
};

export const paymentAPI = {
  initiate: data => api.post('/payment/initiate', data),
  verifyOTP: data => api.post('/payment/verify-otp', data),
  getTransaction: id => api.get(`/payment/transaction/${id}`)
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getFraudLogs: params => api.get('/admin/fraud-logs', { params }),
  reviewFraudLog: (id, notes) => api.put(`/admin/fraud-logs/${id}/review`, { notes })
};

export default api;
