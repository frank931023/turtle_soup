module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
      "gamerecord", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    questionId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    score: {
      type: Sequelize.INTEGER
    },
    userAnswer: {
      type: Sequelize.STRING
    },
    isCorrect: {
      type: Sequelize.BOOLEAN
    },
    timeSpent: {
      type: Sequelize.FLOAT
    },
    createdAt: {
      type: Sequelize.DATE
    }
  });
};
