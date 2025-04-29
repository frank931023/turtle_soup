import express from "express";
import cors from "cors";
import { hostAgent, aiPlayerAgent } from "./agentSetup.js";
import db from "./db.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World! Express後端伺服器運行中！");
});

// API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "你好，來自 Express 後端！" });
});

// 用戶 API
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  db.run(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, email });
    }
  );
});

// Agent API - 新增
app.post("/api/agents", async (req, res) => {
  const { input } = req.body;
  try {
    const result = await hostAgent.call({ input });
    res.json({ reply: result.output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 新增問題生成 API
app.post("/api/generate-question", async (req, res) => {
  const { topic } = req.body;
  try {
    const result = await aiPlayerAgent.call({
      input: `請生成一個關於${topic || "烏龜湯"}的謎題`,
    });
    res.json({ question: result.output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 謎題關主提供謎題或回答問題
app.post("/api/host", async (req, res) => {
  const { input, isNewGame } = req.body;
  try {
    let prompt = input;
    if (isNewGame) {
      prompt =
        "請生成一個海龜湯謎題，並簡短描述初始場景。提供一個不尋常但有邏輯的情境。";
    }
    const result = await hostAgent.call({ input: prompt });
    res.json({ reply: result.output });
  } catch (error) {
    console.error("謎題關主錯誤:", error);
    res
      .status(500)
      .json({ reply: "抱歉，無法生成謎題。可能是 API 連接問題。" });
  }
});

// AI玩家提出問題
app.post("/api/ai-player", async (req, res) => {
  const { context } = req.body;
  try {
    const prompt = `基於以下對話，請提出一個有助於解開謎題的問題：${context}`;
    const result = await aiPlayerAgent.call({ input: prompt });
    res.json({ question: result.output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`後端伺服器正在 http://localhost:${port} 上運行`);
});
