const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const dotenv = require("dotenv");
dotenv.config();

// 創建 Gemini 模型實例
const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash",
  temperature: 0.7,
  apiKey: process.env.GOOGLE_API_KEY,
});

// 導出模型實例
module.exports = model;