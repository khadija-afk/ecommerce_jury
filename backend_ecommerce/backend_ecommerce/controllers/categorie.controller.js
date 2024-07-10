import { Categorie } from '../models/index.js';

// Récupérer toutes les catégories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Categorie.findAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des catégories' });
    }
};

// Récupérer une catégorie par son ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Categorie.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Erreur lors de la récupération de la catégorie:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de la catégorie' });
    }
};

// Créer une nouvelle catégorie
export const createCategory = async (req, res) => {
    try {
        // Add validation here if necessary
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
        }
        const newCategory = await Categorie.create({ name, description });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Erreur lors de la création de la catégorie:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la création de la catégorie' });
    }
};

// Mettre à jour une catégorie
export const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Categorie.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }
        await category.update({ name, description });
        res.status(200).json(category);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la catégorie' });
    }
};

// Supprimer une catégorie
export const deleteCategory = async (req, res) => {
    try {
        const category = await Categorie.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }
        await category.destroy();
        res.status(200).json({ message: "Categorie deleted" });
    } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression de la catégorie' });
    }
};
