const express = require("express");
const cors = require("cors");

const db = require("./model/main.js");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 前端path
const frontPath = "http://localhost:5173";

db.sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized!");
  })
  .catch((error) => {
    console.log(error);
  });

// cors
app.use(
  cors({
    origin: frontPath,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 新增明確的健康檢查端點
app.get("/api/hello", (req, res) => {
  res.json({ message: "你好，來自 Express 後端！" });
});

// routers
require("./route/user")(app);
require("./route/agent")(app);

app.listen(PORT, () => {
  console.log(`後端伺服器正在 http://localhost:${PORT} 上運行`);

});
