export default (connection, DataTypes) => {
    const Review = connection.define(
        'Review',
        {
            user_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Name of the target model
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
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: true
            },

        },
        {
            timestamps: false,
            tableName: 'reviews'
        }
    );

    return Review;
};
