
export const destroy = async (Model, userId) => {
    let res;

    if ( userId && Model.user_fk !== userId) {

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

export const findAll = async(Model) => {

    let models;
    try {
    
        models = await Model.findAll();

    } catch (error) {

        throw Object.assign(
            { error: 'Server error while findAll', status: error.status || 500, details: error.message }
        );
    }

    return models;
}

export const get = async (Model, id, options = {}) => {
    // Rechercher l'article par ID
    let model
    try {
    
        model = await Model.findByPk(id, options);

    } catch (error) {

        throw Object.assign(
            { error: 'Server error while findByPk', status: error.status || 500, details: error.message }
        );
    }
    // Si l'article n'existe pas, lancer une exception
    if (!model) {
        throw Object.assign(
            { error: 'Not found', status: 404 }
        );
    }

    return model; // Retourner l'article si trouvé
};