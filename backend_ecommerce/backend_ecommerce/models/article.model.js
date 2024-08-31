export default (connection, DataTypes) => {
    connection.define(
        'Article',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false
            },
            brand: {
                type: DataTypes.STRING,
                allowNull: false
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            photo: {
                type: DataTypes.JSON,
                allowNull: true, // Les photos peuvent être optionnelles
            },
            user_fk: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            categorie_fk: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        { timestamps: true }
    );
}
