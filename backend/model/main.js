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

// 添加 Gemini 模型引用 (可選)
// db.GeminiModel = require('./gemini')

module.exports = db;
