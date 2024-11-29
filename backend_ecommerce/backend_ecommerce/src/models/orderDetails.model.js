export default (connection, DataTypes) => {
    connection.define(
        'OrderDetails',
        {
            user_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },

                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            
            status: {
                type: DataTypes.STRING,
                allowNull: false, // Par exemple : 'en attent', 'valide'
                defaultValue: 'en attent'

            }
            
        },
        { timestamps: true }
    );
};
