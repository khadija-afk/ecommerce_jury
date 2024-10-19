import { Article } from '../models/index.js'; // Adapter selon tes modèles
import { Op } from 'sequelize'; // Sequelize pour les opérateurs

// Fonction de recherche d'articles
export const searchArticles = async (req, res) => {
  const { query } = req.query; // Récupérer le terme de recherche depuis l'URL

  if (!query) {
    return res.status(400).json({ message: 'Terme de recherche manquant' });
  }

  try {
    // Requête pour rechercher des articles dont le nom ou le contenu correspond au terme de recherche
    const results = await Article.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },  // Rechercher une correspondance dans le nom
          { content: { [Op.like]: `%${query}%` } } // Rechercher une correspondance dans le contenu
        ]
      }
    });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Aucun résultat trouvé' });
    }

    // Retourner les résultats sous forme de JSON
    res.json(results);
  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
