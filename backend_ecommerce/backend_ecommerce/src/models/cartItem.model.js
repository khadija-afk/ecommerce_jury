export default (connection, DataTypes) => {
    const CartItem = connection.define(
        'CartItem',
        {
            cart_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Carts', // Assurez-vous que cela fait référence au modèle Cart
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            product_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Articles', // Fait référence au modèle Article
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        { timestamps: false }
    );

    return CartItem;
};
