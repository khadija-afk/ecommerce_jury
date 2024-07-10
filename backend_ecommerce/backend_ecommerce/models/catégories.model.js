export default (connection, DataTypes) => {
    connection.define(
        'Categorie',
        {
            // Model attributes are defined here
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        { timestamps: true }
    );
}