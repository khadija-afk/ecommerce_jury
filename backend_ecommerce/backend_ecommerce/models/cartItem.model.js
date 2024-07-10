export default (connection, DataTypes) => {
    const CartItem = connection.define(
        'CartItem',
        {
            cart_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'carts', // Name of the target model
                    key: 'id' // Key in the target model that this refers to
                }
            },
            product_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'articles', // Name of the target model
                    key: 'id' // Key in the target model that this refers to
                }
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        { timestamps: false }
    );

    return CartItem;
};
