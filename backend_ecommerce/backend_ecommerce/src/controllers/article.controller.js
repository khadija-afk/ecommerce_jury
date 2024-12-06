import { Article, User, Categorie, OrderItems } from "../models/index.js";
import * as Service from "../services/service.js";
// import logger from "../../../logger.js";

// Ajouter un article avec upload d'image
export const add = async (req, res) => {
  const { categorie_fk, name, content, brand, price, stock } = req.body;

  const user_fk = req.user.id;

  try {
    const user = await Service.get(User, user_fk);
    const categorie = await Service.get(Categorie, categorie_fk);
    const newArticle = await Service.create(Article, {
      name,
      content,
      brand,
      price,
      stock,
      user_fk,
      categorie_fk,
      photo: req.file ? `/uploads/articles/${req.file.filename}` : null,
    });

    res.status(201).json(newArticle);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
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

  if (article.user_fk != req.user.id)
    return res.status(403).json({ error: "Seul le créateur peut modifier !" });

  try {
    await article.update(req.body);
  } catch (err) {
    return res.status(500).json({ error: "Error lors de la récupération" });
  }

  return res.status(200).json(article);
};

export const deleteById = async (req, res) => {
  const articleId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
      // Récupérer l'article
      const article = await Service.get(Article, articleId);

      if (!article) {
          return res.status(404).json({ error: "Article introuvable" });
      }

      // Vérifier si l'utilisateur est le créateur ou un admin
      if (article.user_fk !== userId && userRole !== 'admin') {
          return res.status(403).json({ error: "Accès interdit" });
      }

      // Supprimer les références dans OrderItems
      
      await OrderItems.destroy({ where: { product_fk: articleId } });

      // Supprimer l'article
      await Service.destroy(article);

      return res.status(200).json("Article deleted !");
  } catch (error) {
      if (error.status === 404) {
          console.warn(`Article introuvable, id: ${articleId}`);
          return res.status(404).json({ error: error.error });
      }

      console.error("Erreur lors de la suppression de l'article :", error);
      return res.status(500).json({
          error: "Erreur serveur lors de la suppression",
          details: error.message,
      });
  }
};



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

export const getArticlesByCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const articles = await Article.findAll({
      where: { categorie_fk: categoryId },
    });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message }); // Affiche l'erreur réelle
  }
};
