
import axios from 'axios';

// Créer une instance Axios avec une URL de base
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_CORS_URL, // Remplace par ton URL de base
  withCredentials: true, // Ajoutez cette ligne si vous utilisez des cookies

});

// apiClient.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       // Gérer les erreurs globales ici (par exemple, redirection en cas d'erreur 401)
//       if (error.response && error.response.status === 401) {
//         // Rediriger vers la page de connexion si non autorisé
//         window.location.href = '/';
//       }
//       return Promise.reject(error);
//     }
//   );

export default apiClient;