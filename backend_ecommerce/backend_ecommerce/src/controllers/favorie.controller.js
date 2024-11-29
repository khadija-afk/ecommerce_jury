// controllers/favoriteController.js

import { Favorite, Article } from '../models/index.js';

// Ajouter un favori
// Ajouter un favori
export const addFavorite = async (req, res) => {
    try {
        const { product_fk } = req.body;
        const user_fk = req.user.id;

        // Vérifier si l'article est déjà dans les favoris
        const existingFavorite = await Favorite.findOne({
            where: {
                user_fk,
                product_fk,
            },
        });

        if (existingFavorite) {
            return res.status(400).json({ message: "L'article est déjà dans vos favoris." });
        }

        // Si non existant, créer un nouveau favori
        const favorite = await Favorite.create({
            user_fk,
            product_fk,
        });

        res.status(201).json(favorite);
    } catch (error) {
        console.error("Erreur lors de l'ajout aux favoris :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
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

export const clearFavorites = async (req, res) => {
    try {
        const user_fk = req.user.id;
        console.log(`Utilisateur authentifié : ${user_fk}`);

        // Vérifiez les favoris existants
        const favorites = await Favorite.findAll({ where: { user_fk } });
        console.log(`Favoris trouvés : ${favorites.length}`);

        if (favorites.length === 0) {
            return res.status(404).json({ error: "Aucun favori à supprimer pour cet utilisateur." });
        }

        await Favorite.destroy({ where: { user_fk } });
        res.status(200).json({ message: "Tous les favoris ont été supprimés avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression des favoris :", error);
        res.status(500).json({ error: "Erreur serveur lors de la suppression des favoris." });
    }
};

