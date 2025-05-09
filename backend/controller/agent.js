const { getAgents } = require("../agentSetup.js");

// 使用 Promise 儲存初始化後的 agents
let agentsPromise = getAgents();

// Agent API - 一般問答
exports.chat = async (req, res) => {
  const { input } = req.body;
  try {
    const agents = await agentsPromise;
    const result = await agents.modelAgent.call({ input });
    res.json({ reply: result.output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 謎題關主提供謎題或回答問題
exports.host = async (req, res) => {
  const { input, isNewGame } = req.body;
  try {
    let prompt = input;
    if (isNewGame) {
      prompt =
        "請生成一個海龜湯謎題，並簡短描述初始場景。提供一個不尋常但有邏輯的情境。";
    }
    const agents = await agentsPromise;
    const result = await agents.hostAgent.call({ input: prompt });
    res.json({ reply: result.output });
  } catch (error) {
    console.error("謎題關主錯誤:", error);
    res
      .status(500)
      .json({ reply: "抱歉，無法生成謎題。可能是 API 連接問題。" });
  }
};

// 新增問題生成 API
exports.generateQuestion = async (req, res) => {
  const { topic } = req.body;
  try {
    const agents = await agentsPromise;
    const result = await agents.questionAgent.call({
      input: `請生成一個關於${topic || "烏龜湯"}的謎題`,
    });
    res.json({ question: result.output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// AI玩家提出問題
exports.aiPlayer = async (req, res) => {
  const { context } = req.body;
  try {
    const agents = await agentsPromise;
    const prompt = `基於以下對話，請提出一個有助於解開謎題的問題：${context}`;
    const result = await agents.aiPlayerAgent.call({ input: prompt });
    res.json({ question: result.output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 測試 API
exports.hello = (req, res) => {
  res.json({ message: "你好，來自 Express 後端！" });
};
