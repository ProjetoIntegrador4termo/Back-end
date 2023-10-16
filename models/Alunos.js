module.exports = (sequelize, DataTypes) => {
    const Alunos = sequelize.define("Alunos", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        restriction: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        series: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Alunos;
}