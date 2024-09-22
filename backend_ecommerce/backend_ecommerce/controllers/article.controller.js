import { Article, User, Categorie } from '../models/index.js';

export const sum = (a, b) =>

    {
        return a+b;
    }

export const add = async (req, res) => {
    try {
        const { categorie_fk, name, content, brand, price, stock, photo } = req.body;
        const user_fk = req.user.id; // Utiliser l'ID de l'utilisateur connecté

        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(user_fk);
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        // Vérifier si la catégorie existe
        const categorie = await Categorie.findByPk(categorie_fk);
        if (!categorie) {
            return res.status(404).json({ error: "Catégorie non trouvée" });
        }

        // Créer un nouvel article avec les informations reçues dans le corps de la requête
        const newArticle = await Article.create({
            name,
            content,
            brand,
            price,
            stock,
            user_fk,
            categorie_fk,
            photo
        });

        // On renvoie le nouvel article avec un statut 201
        res.status(201).json(newArticle);
    } catch (error) {
        console.error(error); // Log l'erreur pour le débogage
        res.status(500).json({ error: 'Erreur lors de la création ! 😭', details: error.message });
    }
};
export const getAll = async (req, res) => {
    let articles;

    try {
        articles = await Article.findAll();
    } catch (err) {
        return res.status(500).json({ error: "Error lors de la récupération" });
    }
        
    return res.status(200).json(articles);
};

export const getById = async (req, res) => {
    const id = req.params.id;
    let article;

    try {
        article = await Article.findByPk(id);
    } catch (err) {
        return res.status(500).json({ error: "Error lors de la récupération" });
    }

    if (!article) {
        return res.status(404).json({ error: "Article non trouvé" });
    }
    return res.status(200).json(article);
};

export const updateById = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) {
            return res.status(404).json({ error: "Article non trouvé" });
        }
        if (article.user_fk === req.user.id) {
            await article.update(req.body);
            return res.status(200).json(article);
        } else {
            return res.status(403).json({ error: "Seul le créateur peut modifier !" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error lors de la récupération" });
    }
};

export const deleteById = async (req, res) => {
    let article;
    const id = req.params.id;
    try {
        article = await Article.findByPk(id);
    } catch (err) {
        return res.status(500).json({ error: "Error lors de la suppression" });
    }

    if (!article) {
        return res.status(404).json({ error: "Article non trouvé" });
    }
    if (article.user_fk === req.user.id) {
        await article.destroy();
        return res.status(200).json("Article deleted !");
    } else {
        return res.status(403).json({ error: "Seul le créateur peut supprimer !" });
    }
};

export const getByAsc = async (req, res) => {
    try {
        const articles = await Article.findAll({
            order: [["price", 'ASC']]
        });
        res.status(200).json(articles);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors du tri des articles par prix" });
    }
};

export const getByDesc = async (req, res) => {
    try {
        const articles = await Article.findAll({
            order: [["price", 'DESC']]
        });
        res.status(200).json(articles);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors du tri des articles par prix" });
    }
};

export const getByUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { include: Article });
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        res.status(200).json(user.Articles);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur." });
    }
};

export const getReview = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id, { include: "reviews" });
        if (!article) {
            return res.status(404).json({ error: "Article non trouvé" });
        }
        res.status(200).json(article.reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
