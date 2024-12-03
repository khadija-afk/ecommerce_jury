
import axios from 'axios';

// Créer une instance Axios avec une URL de base
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_CORS_URL, // Remplace par ton URL de base
  withCredentials: true, // Ajoutez cette ligne si vous utilisez des cookies

});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default apiClient;