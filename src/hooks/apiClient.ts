import axios from 'axios';
import { apiUrl } from '../utils/api';

const apiClient = axios.create({
    baseURL: apiUrl,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;