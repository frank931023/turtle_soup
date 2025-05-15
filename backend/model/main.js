// ORM
const Sequelize = require("sequelize");
const dbConfig = require("../config/dbConfig.js");

//建立sequelize
const sequelize = new Sequelize(dbConfig);

// 關聯表models的ORM存在db物件裡面
const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ORM model的對方法回傳sequelize對象，接下來可以透過這個對象對表操作
db.User = require("./user")(sequelize, Sequelize);
db.QuestionBank = require("./questionbank")(sequelize, Sequelize);
db.GameRecord = require("./gamerecord")(sequelize, Sequelize);



// 關聯設定
// 一個玩家有多個遊戲
// 一個遊戲只有一個玩家
db.User.hasMany(db.GameRecord, { foreignKey: "userId" });
db.GameRecord.belongsTo(db.User, { foreignKey: "userId" });

// 一場遊戲只有一個題目 一個題目有多場遊戲
db.QuestionBank.hasMany(db.GameRecord, { foreignKey: "questionId" });
db.GameRecord.belongsTo(db.QuestionBank, { foreignKey: "questionId" });

module.exports = db;
