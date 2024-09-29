
export const destroy = async (Model, userId) => {
    let res;

    if (Model.user_fk !== userId) {

        throw Object.assign(
            { error: 'Seul le créateur peut supprimer', status: 403 }
        );
    }

    try {
        res = await Model.destroy();
    } catch (error) {
        throw Object.assign(
            { error: 'Erreur serveur lors de la suppression', status: error.status || 500, details: error.message }
        );
    }

    return res;

}

export const get = async (Model, id, options = {}) => {
    // Rechercher l'article par ID
    let model
    try {
    
        model = await Model.findByPk(id, options);

    } catch (error) {

        throw Object.assign(
            { error: 'Error lors de la récupération', status: error.status || 500, details: error.message }
        );
    }
    // Si l'article n'existe pas, lancer une exception
    if (!model) {
        throw Object.assign(
            { error: Model.name + ' non trouvé', status: 404 }
        );
    }

    return model; // Retourner l'article si trouvé
};