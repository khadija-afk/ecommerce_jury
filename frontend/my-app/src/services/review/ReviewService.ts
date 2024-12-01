import apiClient from '../../utils/axiosConfig';

export interface Review {
    id: number;
    product_fk: number;
    rating: number;
    comment: string;
}

export const getReviewsByProductId = async (productId: number): Promise<Review[]> => {
    try {
        const response = await apiClient.get(`/api/review/${productId}`);
        return response.data; // Axios gère automatiquement le JSON
    } catch (error) {
        console.error(`Error fetching reviews for product ${productId}:`, error);
        throw error;
    }
};

// Pour le retour de getAverageRating, assure-toi que la structure de l'API correspond bien
interface AverageRatingResponse {
    averageRating: string;
}

export const getAverageRating = async (productId: number): Promise<number> => {
    try {
        const response = await apiClient.get<AverageRatingResponse>(`/api/review/${productId}/average`);
        return parseFloat(response.data.averageRating); // Convertir la note moyenne en nombre
    } catch (error) {
        console.error(`Error fetching average rating for product ${productId}:`, error);
        throw error;
    }
};
