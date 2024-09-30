import { Article, User, Categorie } from '../models/index.js';
import * as Service from '../services/service.js';


export const add = async (req, res) => {
    const { categorie_fk, name, content, brand, price, stock, photo } = req.body;

    const user_fk = req.user.id;
    let user;
    try {
        user = await Service.get(User, user_fk);
    } catch (error) {
        return res.status(error.status).json({ error: error.error });
    }

    let categorie;
    try {
        categorie = await Service.get(Categorie, categorie_fk);
    } catch (error) {
        return res.status(error.status).json({ error: error.error });
    }

    try {

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
        articles = await Service.findAll(Article);
        return res.status(200).json(articles);
    } catch (error) {
        return res.status(error.status).json({ error: error.error });
    }
        
};

export const getById = async (req, res) => {

    const id = req.params.id;
    let article;
    try {
        article = await Service.get(Article, id);
        return res.status(200).json(article);
    } catch (error) {
        return res.status(error.status).json({ error: error.error });
    }

};

export const updateById = async (req, res) => {
    const id = req.params.id;
    let article;
    
    try {
        article = await Service.get(Article, id);
    } catch (error) {
        return res.status(error.status).json({ error: error.error });
    }

    if (article.user_fk != req.user.id) return res.status(403).json({ error: "Seul le créateur peut modifier !" });

    try {
        await article.update(req.body);
    } catch (err) {
        return res.status(500).json({ error: "Error lors de la récupération" });
    }
    
    return res.status(200).json(article);

};

export const deleteById = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;
    let article;
    try {
        article = await Service.get(Article, id);
        await Service.destroy(article, userId);

        return res.status(200).json("Article deleted !");
    } catch (error) {
        return res.status(error.status).json({ error: error.error });
    }
};

// export const getByAsc = async (req, res) => {
//     try {
//         const articles = await Article.findAll({
//             order: [["price", 'ASC']]
//         });
//         res.status(200).json(articles);
//     } catch (err) {
//         res.status(500).json({ error: "Erreur lors du tri des articles par prix" });
//     }
// };

// export const getByDesc = async (req, res) => {
//     try {
//         const articles = await Article.findAll({
//             order: [["price", 'DESC']]
//         });
//         res.status(200).json(articles);
//     } catch (err) {
//         res.status(500).json({ error: "Erreur lors du tri des articles par prix" });
//     }
// };

export const getByUser = async (req, res) => {

    let user;
    try {
        user = await Service.get(User, id, { include: Article });

        return res.status(200).json(user.Articles);

    } catch (error) {
        return res.status(error.status).json({ error: error.error });
    }

};

export const getReview = async (req, res) => {

    let article;
    try {
        article = await Service.get(Article, req.params.id, { include: "reviews" });

        return res.status(200).json(article.reviews);
    } catch (error) {
        return res.status(error.status).json({ error: error.error });
    }
};
