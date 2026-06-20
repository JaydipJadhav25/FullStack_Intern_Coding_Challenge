import api from './api';

export const authApi = {
  signup: (data) => api.post('/auth/signup', data).then((res) => res.data),

  login: (data) => api.post('/auth/login', data).then((res) => res.data),

  changePassword: (data) => api.post('/auth/change-password', data).then((res) => res.data),

};
