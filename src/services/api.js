import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getMenuItems = (category) => {
  const params = category ? { category } : {};
  return api.get('/menu', { params });
};

export const getMenuItemById = (id) => api.get(`/menu/${id}`);

export const createOrder = (orderData) => api.post('/orders', orderData);

export const getOrderById = (id) => api.get(`/orders/${id}`);

export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status });

export default api;
