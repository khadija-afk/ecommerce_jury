// controllers/favoriteController.js

import { Favorite, Article } from '../models/index.js';

// Ajouter un favori
export const addFavorite = async (req, res) => {
    try {
        const { product_fk } = req.body;
        const user_fk = req.user.id;

        const favorite = await Favorite.create({
            user_fk,
            product_fk,
        });

        res.status(201).json(favorite);
    } catch (error) {
        console.error("Erreur lors de l'ajout aux favoris :", error);
        res.status(500).json({ error: error.message });
    }
};

// Récupérer les favoris d'un utilisateur
export const getFavoritesByUser = async (req, res) => {
    try {
        const user_fk = req.user.id;

        const favorites = await Favorite.findAll({
            where: { user_fk },
            include: [
                {
                    model: Article,
                    attributes: ['id', 'name', 'content', 'price', 'photo'],
                },
            ],
        });

        res.status(200).json(favorites);
    } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des favoris." });
    }
};

// Supprimer un favori
export const removeFavorite = async (req, res) => {
    try {
        const { product_fk } = req.params; // Récupérer depuis les paramètres d'URL
        const user_fk = req.user.id;

        if (!product_fk) {
            return res.status(400).json({ error: "product_fk est requis." });
        }

        const favorite = await Favorite.findOne({
            where: { user_fk, product_fk },
        });

        if (!favorite) {
            return res.status(404).json({ error: "Le favori n'existe pas." });
        }

        await favorite.destroy();
        res.status(200).json({ message: "Favori supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression du favori :", error);
        res.status(500).json({ error: "Erreur serveur lors de la suppression du favori." });
    }
};


// Vérifier si un produit est dans les favoris
export const isFavorite = async (req, res) => {
    try {
        const { product_fk } = req.params;
        const user_fk = req.user.id;

        const favorite = await Favorite.findOne({
            where: { user_fk, product_fk },
        });

        res.status(200).json({ isFavorite: !!favorite });
    } catch (error) {
        console.error("Erreur lors de la vérification du favori :", error);
        res.status(500).json({ error: "Erreur serveur lors de la vérification du favori." });
    }
};
