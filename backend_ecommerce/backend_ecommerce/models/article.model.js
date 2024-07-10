// Je recup ma connexion dans la variable sequilize

// et mes types de champs SQL dans DataTypes
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
            user_fk:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            categorie_fk:{
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        { timestamps: true }
    );
}