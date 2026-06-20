import api from './api';

export const userApi = {
  getStores: (params) => api.get('/stores', { params }).then((r) => r.data),
  submitRating: (data) => api.post('/ratings', data).then((r) => r.data),
  updateRating: (storeId, rating) =>
    api.put(`/ratings/${storeId}`, { rating }).then((r) => r.data),
};

export const ownerApi = {
  getDashboard: () => api.get('/owner/dashboard').then((r) => r.data),
  getRatings: () => api.get('/owner/ratings').then((r) => r.data),
};
