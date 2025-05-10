module.exports = (sequelize, Sequelize) => {
  const QuestionBank = sequelize.define(
    "questionbank",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      questionName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imageURL: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      story: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      soup: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      thumbsUp: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // category: {
      //   type: Sequelize.ARRAY(Sequelize.STRING),
      //   defaultValue: [],
      //   allowNull: false,
      // },
      category: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "[]",
        get() {
          const rawValue = this.getDataValue("category");
          return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
          this.setDataValue("category", JSON.stringify(value));
        },
      },
      isPending: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true, // 自動加 createdAt 和 updatedAt
    }
  );
  return QuestionBank;
};
