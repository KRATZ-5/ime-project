// frontend/src/api/client.ts
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const api = axios.create({ baseURL: '/api/' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});