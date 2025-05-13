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

  // Agent API 路由
  router.post("/host", host);
  router.post("/ai-player", aiPlayer);
  // router.post("/chat", chat);
  // router.post("/generate-question", generateQuestion);

  app.use("/api/agent", router);
};
