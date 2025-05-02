import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();

const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash", // 使用較穩定的模型
  temperature: 0.7,
  apiKey: process.env.GOOGLE_API_KEY,
});

export { model };