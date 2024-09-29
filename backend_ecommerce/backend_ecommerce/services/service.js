
export const get = async (Model, id) => {
    // Rechercher l'article par ID
    let model
    try {
    
        model = await Model.findByPk(id);

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