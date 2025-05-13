const model = require("../models/gemini.js"); // 引入 Gemini 模型

// 嘗試以下導入方式
const { DynamicTool } = require("langchain/tools");

const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { BufferMemory } = require("langchain/memory");
const dotenv = require("dotenv");
dotenv.config();

// 創建各個 agent 的記憶實例
const modelMemory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history",
});

const questionMemory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history",
});

const hostMemory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history",
});

const aiPlayerMemory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history",
});

// 原有的回答工具
const turtleExpert = new DynamicTool({
  name: "TurtleExpert",
  description: "提供關於烏龜的建議",
  func: async (input) => `烏龜專家回答你的問題：${input}`,
});

const soupMaster = new DynamicTool({
  name: "SoupMaster",
  description: "提供湯品建議",
  func: async (input) => `湯品大師建議：${input}`,
});

const funAgent = new DynamicTool({
  name: "FunAgent",
  description: "增加幽默感",
  func: async (input) => `搞笑小子回覆：${input}`,
});

// 新增問題生成工具
const riddleGenerator = new DynamicTool({
  name: "RiddleGenerator",
  description: "生成海龜湯遊戲謎題",
  func: async (input) => {
    return `海龜湯謎題：${
      input || "一個人走進一家餐廳，點了烏龜湯，喝了一口後就自殺了。為什麼？"
    }`;
  },
});

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

// 初始化代理
const initAgents = async () => {
  // 原有的回答 agent
  const modelAgent = await initializeAgentExecutorWithOptions(
    [turtleExpert, soupMaster, funAgent],
    model,
    {
      agentType: "chat-conversational-react-description",
      verbose: true,
      memory: modelMemory,
    }
  );

  // 新增問題生成 agent
  const questionAgent = await initializeAgentExecutorWithOptions(
    [riddleGenerator],
    model,
    {
      agentType: "chat-conversational-react-description",
      verbose: true,
      memory: questionMemory,
    }
  );

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

  return { modelAgent, questionAgent, hostAgent, aiPlayerAgent };
};

let agents = null;

// 外部 API 獲取初始化好的代理
const getAgents = async () => {
  if (!agents) {
    agents = await initAgents();
  }
  return agents;
};

module.exports = { getAgents };

// 移除測試代碼或修改為
// const setup = require("./agentSetup.js");
// setup.getAgents().then(agents => {
//   console.log("可用的 agents:", Object.keys(agents));
// });
