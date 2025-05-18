const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const dotenv = require("dotenv");
dotenv.config();

// 創建 Gemini 模型實例
const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash",
  temperature: 0.7,
  apiKey: "AIzaSyARPgKRTvC4nqOukiwERuHHKwrXwGe5iws",
});

// 導出模型實例
module.exports = model;
