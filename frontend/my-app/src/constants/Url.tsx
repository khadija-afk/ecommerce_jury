// src/utils/constants/URL.ts

// Définir l'URL de base de votre API
const BASE_URL = 'api/api';

// Exporter les URLs pour différentes ressources de votre application
const URL = {
    // URL pour les articles
    ARTICLES: `${BASE_URL}/article`,
    GET_ONE_ARTICLE: (id: string | number) => `${BASE_URL}/article/${id}`,
    
    // URL pour l'authentification
    LOGIN: `${BASE_URL}/user/sign`,
    REGISTER: `${BASE_URL}/user/add`,

    // URL pour les utilisateurs
    USERS: `${BASE_URL}/user`,
    GET_ONE_USER: (id: string | number) => `${BASE_URL}/user/get/${id}`,

    // URL pour les commandes
    ORDERS: `${BASE_URL}/orders`,
    GET_ONE_ORDER: (id: string | number) => `${BASE_URL}/orders/${id}`,

    // URL pour les catégories
    CATEGORIES: `${BASE_URL}/categories`,
    GET_ONE_CATEGORY: (id: string | number) => `${BASE_URL}/categories/${id}`,

    // URL pour CartItem
    CART_ITEMS: `${BASE_URL}/cartItem`,
    POST_CART_ITEMS: `${BASE_URL}/cartItem/cart-items`,

    // Ajoutez ici d'autres URLs pour vos autres ressources si nécessaire
};

export default URL;
