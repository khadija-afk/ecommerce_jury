import { Sequelize } from "sequelize";

export default (connection, DataTypes) => {
    const Review = connection.define(
        "Review",
        {
            user_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Users", // Nom du modèle cible (optionnel, à activer si vous utilisez les associations Sequelize)
                    key: "id", // Clé de référence dans le modèle cible
                },
            },
            product_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Articles", // Nom du modèle cible (optionnel, à activer si vous utilisez les associations Sequelize)
                    key: "id", // Clé de référence dans le modèle cible
                },
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1, // Note minimale
                    max: 5, // Note maximale
                    isInt: true, // Valide uniquement les entiers
                },
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("pending", "approved", "rejected"),
                defaultValue: "pending", // Valeur par défaut
                allowNull: false,
            },
        },
        {
            tableName: "reviews",
            timestamps: true,
        }
    );

    return Review;
};
