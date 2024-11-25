export default (connection, DataTypes) => {
    connection.define(
        'User',
        {
            // Model attributes are defined here
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            
            role: {
                type:   DataTypes.ENUM,
                values: ['admin', 'user'],
                default: ['user'],
                allowNull: false
            },
            resetPasswordToken: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              resetPasswordExpires: {
                type: DataTypes.DATE,
                allowNull: true,
              },
                // Colonnes pour l'A2F
            is2FAEnabled: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            twoFASecret: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        { timestamps: true }
    );
}