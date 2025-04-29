const express = require("express");
const cors = require("cors");
const db = require("./model/main.js"); // database model
const bodyParser = require('body-parser');

const app = express();
const PORT = 3030;

app.use(bodyParser.json());  // 解析 JSON 格式
app.use(bodyParser.urlencoded({ extended: true }));

// 前端path
const frontPath = "http://localhost:5173/";


// sequelize 更新資料庫
db.sequelize.sync().then(() => {
    console.log('Database synchronized!');
}).catch(error => {
    console.log(error)
})

// cors
app.use(cors({
    origin: frontPath, // 允許特定前端請求
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // 允許 cookie
}));

// routers
require('./route/user')(app);


app.listen(PORT, () => {
  console.log(`後端伺服器正在 http://localhost:${PORT} 上運行`);
});
