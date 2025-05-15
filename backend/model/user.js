module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING,
      },
      score: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      sex: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      avatarUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true, // 自動加 createdAt 和 updatedAt
    }
  );
  return User;
};
