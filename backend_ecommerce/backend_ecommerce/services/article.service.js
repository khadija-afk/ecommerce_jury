import { Article } from '../models/index.js';




export const get = async (id) => {
    // Rechercher l'article par ID
    let article
    try {
    
        article = await Article.findByPk(id);

    } catch (error) {

        throw Object.assign(
            { error: 'Error lors de la récupération', status: error.status || 500, details: error.message }
        );
    }
    // Si l'article n'existe pas, lancer une exception
    if (!article) {
        throw Object.assign(
            { error: 'Article non trouvé', status: 404 }
        );
    }

    return article; // Retourner l'article si trouvé
};