const {
  createQuestion,
  getQuestionById,
  updateQuestion,
  approveQuestion,
  getAllQuestions,
  incrementThumbsUp,
  deleteQuestion,
  restoreQuestion,
} = require("../controller/questionbank");

const express = require("express");
// 如果有身分驗證需求，可以引入中間件
// const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

module.exports = (app) => {
  // 1. 上傳新故事
  router.post("/create", createQuestion);

  // 2. 用id獲取故事
  router.get("/:id", getQuestionById);

  // 3. 修改故事 (未來可加入權限驗證)
  router.put("/:id", updateQuestion);

  // 4. 審核通過故事
  router.post("/:id/approve", approveQuestion);

  // 5. 獲取所有故事 (可選)
  router.get("/", getAllQuestions);

  // 6. 增加故事的 thumbsUp 計數 (+1)
  router.put("/:id/thumbsup", incrementThumbsUp);

  // 7. 標記故事為刪除
  router.delete("/:id", deleteQuestion);

  // 8. 恢復被刪除的故事
  router.post("/:id/restore", restoreQuestion);

  // 將路由應用到主應用
  app.use("/api/questionbank", router);
};
