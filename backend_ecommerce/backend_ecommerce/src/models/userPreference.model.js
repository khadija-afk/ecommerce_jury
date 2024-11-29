// models/UserPreferences.js

export default (connection, DataTypes) => {
    return connection.define(
        'UserPreferences',
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            consent: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            }
        },
        { timestamps: true } // Pour ajouter automatiquement les colonnes createdAt et updatedAt
    );
};
