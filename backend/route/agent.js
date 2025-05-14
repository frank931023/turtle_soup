const {
  chat,
  host,
  generateQuestion,
  aiPlayer,
  hello,
} = require("../controller/agent");
const express = require("express");

const router = express.Router();

module.exports = (app) => {
  // 基本API
  app.get("/api/hello", hello);

  // Agent API 路由
  // router.post("/chat", chat);
  router.post("/host", host);
  // router.post("/generate-question", generateQuestion);
  router.post("/ai-player", aiPlayer);

  app.use("/api/agent", router);
};
