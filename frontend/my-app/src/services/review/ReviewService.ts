// src/services/reviewService.ts

export interface Review {
    id: number;
    product_fk: number;
    rating: number;
    comment: string;
}

export const getReviewsByProductId = async (productId: number): Promise<Review[]> => {
    try {
        const response = await fetch(`api/api/review/${productId}`);
        if (!response.ok) {
            throw new Error(`Error fetching reviews for product ${productId}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

export const getAverageRating = async (productId: number): Promise<number> => {
    try {
        const response = await fetch(`api/api/review/${productId}/average`);
        if (!response.ok) {
            throw new Error(`Error fetching average rating for product ${productId}`);
        }
        const data = await response.json();
        return parseFloat(data.averageRating);
    } catch (error) {
        console.error("Error fetching average rating:", error);
        throw error;
    }
};
