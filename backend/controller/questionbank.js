const db = require("../model/main");
const QuestionBank = db.QuestionBank;

// 1. 上傳新故事 (自動產生id, pending設為true)
const createQuestion = async (req, res) => {
  try {
    // 從請求體中獲取故事的資料
    const {
      questionName,
      description,
      imageURL,
      story,
      soup,
      level,
      category,
      thumbsUp,
    } = req.body;

    // 確保必要欄位都有填寫
    if (!questionName || !description || !level) {
      return res.status(400).json({
        success: false,
        message: "缺少必要欄位 (questionName, description, level 為必填)",
      });
    }

    // 創建新的故事記錄 (isPending 預設為 true)
    const newQuestion = await QuestionBank.create({
      questionName,
      description,
      imageURL,
      story,
      soup,
      level,
      thumbsUp: thumbsUp || 0,
      category: category || [],
      isPending: true, // 預設為等待審核狀態
    });

    return res.status(201).json({
      success: true,
      message: "故事上傳成功，等待審核",
      data: newQuestion,
    });
  } catch (error) {
    console.error("創建故事錯誤:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤",
      error: error.message,
    });
  }
};

// 2. 用id獲取故事全部要素
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    // 查詢指定 id 的故事
    const question = await QuestionBank.findByPk(id);

    // 檢查故事是否存在
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "找不到此故事",
      });
    }

    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("獲取故事錯誤:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤",
      error: error.message,
    });
  }
};

// 3. 修改故事欄位 (後續可加入權限驗證)
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // 查找故事是否存在
    const question = await QuestionBank.findByPk(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "找不到此故事",
      });
    }

    // 更新故事資料
    await question.update(updateData);

    return res.status(200).json({
      success: true,
      message: "故事更新成功",
      data: await QuestionBank.findByPk(id),
    });
  } catch (error) {
    console.error("更新故事錯誤:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤",
      error: error.message,
    });
  }
};

// 4. 將 pending 從 true 改為 false (審核通過)
const approveQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // 查找故事是否存在
    const question = await QuestionBank.findByPk(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "找不到此故事",
      });
    }

    // 檢查是否已經審核通過
    if (!question.isPending) {
      return res.status(400).json({
        success: false,
        message: "此故事已經審核通過",
      });
    }

    // 將 isPending 設為 false (審核通過)
    await question.update({ isPending: false });

    return res.status(200).json({
      success: true,
      message: "故事審核通過",
      data: await QuestionBank.findByPk(id),
    });
  } catch (error) {
    console.error("審核故事錯誤:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤",
      error: error.message,
    });
  }
};

// 5. 獲取所有故事 (可選，用於管理頁面)
const getAllQuestions = async (req, res) => {
  try {
    // 可以從 query 參數中獲取分頁和篩選條件
    const { pending, deleted, limit = 10, offset = 0 } = req.query;

    // 構建查詢條件
    const condition = {
      isDeleted: deleted === "true", // 預設不顯示已刪除的故事
    };

    if (pending !== undefined) {
      condition.isPending = pending === "true";
    }

    const questions = await QuestionBank.findAndCountAll({
      where: condition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      total: questions.count,
      data: questions.rows,
    });
  } catch (error) {
    console.error("獲取故事列表錯誤:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤",
      error: error.message,
    });
  }
};

// 6. 增加故事的 thumbsUp 計數 (+1)
const incrementThumbsUp = async (req, res) => {
  try {
    const { id } = req.params;

    // 查找故事是否存在
    const question = await QuestionBank.findByPk(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "找不到此故事",
      });
    }

    // 增加 thumbsUp 計數 (+1)
    await question.increment("thumbsUp");

    // 重新獲取更新後的資料
    await question.reload();

    return res.status(200).json({
      success: true,
      message: "點讚成功",
      thumbsUp: question.thumbsUp,
      data: question,
    });
  } catch (error) {
    console.error("點讚操作錯誤:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤",
      error: error.message,
    });
  }
};

// 7. 軟刪除故事 (將 isDeleted 設為 true)
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // 查找故事是否存在
    const question = await QuestionBank.findByPk(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "找不到此故事",
      });
    }

    // 將 isDeleted 設為 true
    await question.update({ isDeleted: true });

    return res.status(200).json({
      success: true,
      message: "故事已標記為刪除",
    });
  } catch (error) {
    console.error("刪除故事錯誤:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤",
      error: error.message,
    });
  }
};

// 8. 恢復被刪除的故事 (將 isDeleted 設為 false)
const restoreQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // 查找故事是否存在
    const question = await QuestionBank.findByPk(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "找不到此故事",
      });
    }

    // 檢查是否已經被刪除
    if (!question.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "此故事未被刪除",
      });
    }

    // 將 isDeleted 設為 false
    await question.update({ isDeleted: false });

    return res.status(200).json({
      success: true,
      message: "故事已恢復",
      data: await QuestionBank.findByPk(id),
    });
  } catch (error) {
    console.error("恢復故事錯誤:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤",
      error: error.message,
    });
  }
};

module.exports = {
  createQuestion,
  getQuestionById,
  updateQuestion,
  approveQuestion,
  getAllQuestions,
  incrementThumbsUp,
  deleteQuestion,
  restoreQuestion,
};
