module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, 
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    Users.associate = (models) => {
        Users.hasMany(models.Alunos, {
            onDelete: "Cascade",
        });
    }

    return Users;
}
