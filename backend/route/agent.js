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
  router.post("/npc-question", npcQuestion);  // 確保這行存在

  app.use("/api/agent", router);
  
  console.log("Agent API 路由已註冊: /api/agent/host, /api/agent/ai-player, /api/agent/npc-question");
};
