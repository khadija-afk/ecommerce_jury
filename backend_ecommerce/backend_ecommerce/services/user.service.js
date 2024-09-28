import { User } from '../models/index.js';

export const get = async (id) => {
    // Rechercher l'article par ID
    let user
    try {
    
        user = await User.findByPk(id);

    } catch (error) {

        throw Object.assign(
            { error: 'Error lors de la récupération', status: error.status || 500, details: error.message }
        );
    }
    // Si l'article n'existe pas, lancer une exception
    if (!user) {
        throw Object.assign(
            { error: 'User not found!', status: 404 }
        );
    }

    return user; // Retourner l'article si trouvé
};