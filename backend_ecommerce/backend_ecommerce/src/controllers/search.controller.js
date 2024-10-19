import { Article } from '../models/index.js';
import { Op } from 'sequelize';

// API pour les suggestions
export const searchSuggestions = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Terme de recherche manquant' });
  }

  try {
    // Requête pour rechercher des articles dont le nom correspond partiellement au terme de recherche
    const suggestions = await Article.findAll({
      where: {
        name: { [Op.like]: `%${query}%` }, // Recherche partielle dans le nom des articles
      },
      attributes: ['id', 'name', 'content', 'price', 'photo'] // Inclure tous les attributs pertinents
    });

    if (suggestions.length === 0) {
      return res.status(404).json({ message: 'Aucun résultat trouvé' });
    }

    res.json(suggestions);
  } catch (error) {
    console.error('Erreur lors de la recherche de suggestions :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
