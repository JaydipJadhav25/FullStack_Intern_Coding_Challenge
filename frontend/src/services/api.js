import axios from 'axios';


//set base url
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE_URL });
// send token each requrest


api.interceptors.request.use((config) => {

  // get exixting token
  const token = localStorage.getItem('token');

  //check token otherwise return !
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});




export default api;
