const {
  host,
  aiPlayer,
  npcQuestion
} = require("../controller/agent");
const express = require("express");

const router = express.Router();

module.exports = (app) => {
  // 基本 API 路由
  router.post("/host", host);
  router.post("/ai-player", aiPlayer);
  router.post("/npc-question", npcQuestion);

  app.use("/api/agent", router);
};
