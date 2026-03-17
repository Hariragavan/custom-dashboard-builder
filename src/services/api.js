import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Orders
export const getOrders = () => api.get('/orders').then(r => r.data);
export const createOrder = (data) => api.post('/orders', data).then(r => r.data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data).then(r => r.data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`).then(r => r.data);

// Dashboard Layout
export const getDashboardLayout = () => api.get('/dashboard/layout').then(r => r.data);
export const saveDashboardLayout = (layout_json) => api.post('/dashboard/layout', { layout_json }).then(r => r.data);

export default api;
