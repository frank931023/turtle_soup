const model = require("../models/gemini.js"); // 引入 Gemini 模型

const { DynamicTool } = require("@langchain/core/tools");
const { BufferMemory } = require("langchain/memory");
const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const dotenv = require("dotenv");
dotenv.config();

// 只保留必要的記憶實例
const hostMemory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history",
});

const aiPlayerMemory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history",
});

// 只保留必要的工具
// 謎題關主 - 提供謎題並回答問題
const gameHost = new DynamicTool({
  name: "GameHost",
  description: "海龜湯謎題關主，提供謎題和回答線索",
  func: async (input) => `海龜湯謎題關主回答：${input}`,
});

// AI玩家工具 - 生成問題
const aiPlayerGenerator = new DynamicTool({
  name: "AIPlayerGenerator",
  description: "產生AI玩家的提問",
  func: async (input) => {
    return `基於目前的線索，我想問：${input}`;
  },
});

// 簡化初始化代理函數
const initAgents = async () => {
  // 初始化謎題關主Agent
  const hostAgent = await initializeAgentExecutorWithOptions(
    [gameHost],
    model,
    {
      agentType: "chat-conversational-react-description",
      verbose: true,
      memory: hostMemory,
    }
  );

  // 初始化AI玩家Agent
  const aiPlayerAgent = await initializeAgentExecutorWithOptions(
    [aiPlayerGenerator],
    model,
    {
      agentType: "chat-conversational-react-description",
      verbose: true,
      memory: aiPlayerMemory,
    }
  );

  return { hostAgent, aiPlayerAgent };
};

let agents = null;

// 外部 API 獲取初始化好的代理
const getAgents = async () => {
  if (!agents) {
    agents = await initAgents();
  }
  return agents;
};

// 生成 NPC 提問的函數
async function askByNpc(npcIndex, storyInfo, clueHistory) {
  try {
    // 設定不同 NPC 的人格特性
    const npcPersonas = [
      "你是一個邏輯嚴謹的推理者，喜歡從基本事實和細節著手",
      "你是一個直覺型玩家，常常關注故事中不尋常的元素和違和感",
      "你是一個仔細的觀察者，擅長找出故事中被忽略的細節",
      "你是一個系統性思考者，喜歡建立事件的時間線和關聯性",
    ];

    // 獲取當前 NPC 的人格 (如果超出範圍則使用默認)
    const npcPersona =
      npcPersonas[npcIndex % npcPersonas.length] || "你是一個好奇的玩家";

    const prompt = `
${npcPersona}。你正在玩海龜湯謎題遊戲。

故事信息：${storyInfo}

你已經看到以下線索：
${clueHistory.map((c) => `問: ${c.question} -> 答: ${c.answer}`).join("\n")}

規則：
1. 提出一個有助於理解故事的問題
2. 不要重複已經問過的問題
3. 問題必須可以用"是"、"不是"或"不相關"回答
4. 絕對不要提出可能直接猜到謎底的問題
5. 避免在問題中包含任何可能是謎底的推測

請直接給出你的問題，不要加入任何前綴或解釋。
`;

    const result = await model.generateContent(prompt); // 使用已引入的 model 變數

    // 確保問題不包含多餘的引號或格式
    const question = result.response
      .text()
      .trim()
      .replace(/^["']|["']$/g, "");

    return question;
  } catch (error) {
    console.error("NPC 提問生成錯誤:", error);

    // 提供一些預設問題，以防 API 調用失敗
    const fallbackQuestions = [
      "這個事件發生在什麼時間？",
      "有多少人參與了這個事件？",
      "事件發生的地點是室內還是室外？",
      "故事中提到的物品有特殊意義嗎？",
      "這是一個意外事件還是有人蓄意為之？",
    ];

    return fallbackQuestions[
      Math.floor(Math.random() * fallbackQuestions.length)
    ];
  }
}

module.exports = { getAgents, askByNpc };
