// models/Favorite.js

export default (connection, DataTypes) => {
    connection.define(
        'Favorite',
        {
            user_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Nom du modèle utilisateur
                    key: 'id',
                },
            },
            product_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Articles', // Nom du modèle article
                    key: 'id',
                },
            },
        },
        {
            timestamps: true, // Ajoute les colonnes createdAt et updatedAt
        }
    );

   
};
