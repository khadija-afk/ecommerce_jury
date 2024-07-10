export default (connection, DataTypes) => {
    const Cart = connection.define(
        'Cart',
        {
            user_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Nom du modèle cible
                    key: 'id' // Clé dans le modèle cible
                }
            },
            total_amount: {
                type: DataTypes.FLOAT,
                allowNull: false,
            }
        },
        { timestamps: false }
    );

    return Cart;
};
