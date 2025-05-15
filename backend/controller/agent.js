const { getAgents, askByNpc } = require("../agent/agentSetup.js");
const db = require("../model/main.js");
const QuestionBank = db.QuestionBank;

// 使用 Promise 儲存初始化後的 agents
let agentsPromise = getAgents();

// 謎題關主提供線索或回答問題
exports.host = async (req, res) => {
  const { input, storyId } = req.body;
  
  try {
    // 從資料庫獲取故事資料
    const story = await QuestionBank.findByPk(storyId);
    
    if (!story) {
      return res.status(404).json({ 
        reply: "找不到此故事，請確認故事ID是否正確。" 
      });
    }
    
    // 檢查玩家輸入是否接近謎底，讓 Gemini 來判斷
    const checkSoupPrompt = `
你是海龜湯謎題遊戲的裁判。你需要判斷玩家的猜測是否已經猜中了謎底。

故事題目：${story.questionName}
故事背景：${story.story}
正確謎底：${story.soup}

玩家猜測：${input}

請仔細比較玩家的猜測和正確謎底。
如果玩家的猜測已經非常接近或實質上猜中了謎底的核心內容（即使用詞不完全一樣），只回答"猜中"。
如果沒有猜中，請回答"未猜中"。
不要使用其他任何詞語，不要提供解釋或額外說明。
`;

    // 先用 Gemini 判斷是否猜中謎底
    const agents = await agentsPromise;
    const soupCheckResult = await agents.hostAgent.call({ input: checkSoupPrompt });
    const checkResult = soupCheckResult.output.trim().toLowerCase();
    
    console.log("檢查謎底猜測結果:", checkResult);
    
    // 如果猜中了謎底
    if (checkResult.includes("猜中") && !checkResult.includes("未猜中") && !checkResult.includes("部分")) {
      console.log("玩家猜中謎底!");
      return res.json({ 
        reply: "是的，恭喜你找到了正確答案！",
        isSolved: true,
        soup: story.soup
      });
    }
    
    // 沒猜中謎底，改由關主判斷問題，只能回答「是」、「不是」、「不相關」
    let prompt = `
你是海龜湯謎題遊戲的關主。必須嚴格遵守回答規則。
請基於以下故事背景回答玩家的問題：

故事標題：${story.questionName}
故事背景：${story.story}
故事答案/解析：${story.soup}

玩家問題：${input}

回答規則：
1. 你必須且只能回答「是」、「不是」或「不相關」三者之一
2. 絕對不要包含其他文字、標點符號或解釋
3. 如果問題與故事背景或解答相關且答案為肯定，回答「是」
4. 如果問題與故事背景或解答相關且答案為否定，回答「不是」
5. 如果問題無關、不適合用是非回答，或接近揭示答案本身，回答「不相關」

記住：無論如何，你的回答必須且只能是「是」、「不是」或「不相關」三者之一，不可有其他文字。
`;

    const result = await agents.hostAgent.call({ input: prompt });
    
    // 更嚴格的回應處理
    let answer = result.output.trim().toLowerCase();
    console.log("AI 原始回答:", answer);
    
    // 提取答案的更嚴格規則
    if (answer === "是" || answer === "yes" || answer === "對" || answer === "正確" ||
        /^(是|yes|對|正確)[.!。！,，]?$/.test(answer) || 
        /^只[能會]回答[\"「]?(是|yes)[\"」]?$/.test(answer)) {
      answer = "是";
    } else if (answer === "不是" || answer === "no" || answer === "否" || answer === "不對" || 
               /^(不是|no|否|不對)[.!。！,，]?$/.test(answer) ||
               /^只[能會]回答[\"「]?(不是|no)[\"」]?$/.test(answer)) {
      answer = "不是";
    } else {
      answer = "不相關";
    }
    
    console.log("處理後回答:", answer);
    res.json({ reply: answer, isSolved: false });
  } catch (error) {
    console.error("謎題關主錯誤:", error);
    res.status(500).json({ 
      reply: "抱歉，無法處理此問題。請稍後再試。",
      isSolved: false
    });
  }
};

// AI玩家提出問題
exports.aiPlayer = async (req, res) => {
  const { storyId, clueHistory } = req.body;

  try {
    // 從資料庫獲取故事資料
    const story = await QuestionBank.findByPk(storyId);

    if (!story) {
      return res.status(404).json({
        question: "找不到此故事，無法生成問題。",
      });
    }

    const prompt = `
你現在是海龜湯謎題遊戲中的一位 AI 玩家。
故事標題：${story.questionName}
故事背景：${story.story}

已知目前的對話與線索如下：
${clueHistory
  .map((c, i) => `Q${i + 1}: ${c.question} -> A: ${c.answer}`)
  .join("\n")}

請根據以上資訊提出一個新的問題，只要一個新的問題就好，不要與先前重複，並避免太過模糊的問題。此問題應該能幫助解開謎題。
只回傳問題本身，不需要任何解釋。
`;

    const agents = await agentsPromise;
    const result = await agents.aiPlayerAgent.call({ input: prompt });
    res.json({ question: result.output });
  } catch (error) {
    console.error("AI玩家錯誤:", error);
    res.status(500).json({
      question: "抱歉，無法生成問題。請稍後再試。",
    });
  }
};

// NPC 提問 API
exports.npcQuestion = async (req, res) => {
  const { storyId, npcIndex, clueHistory } = req.body;

  try {
    // 從資料庫獲取故事資料
    const story = await QuestionBank.findByPk(storyId);

    if (!story) {
      return res.status(404).json({
        question: "找不到此故事，無法生成 NPC 問題。",
      });
    }

    // 修改 NPC 提示詞，強調提出可以用是/不是回答的具體問題
    const npcPrompt = `
你是海龜湯謎題遊戲中的 NPC 玩家 ${npcIndex + 1}。你的目標是提出有針對性的問題，必須符合只能回答「是」、「不是」或「不相關」的格式。

故事標題：${story.questionName}
故事背景：${story.story}
故事謎底：${story.soup}

以下是當前已知的線索：
${clueHistory
  .map((c, i) => `Q${i + 1}: ${c.question} -> A: ${c.answer}`)
  .join("\n")}

請提出一個新的問題，遵守以下規則：
1. 問題必須是可以用「是」或「不是」回答的具體問題，例如「犯人是男性嗎？」而非「犯人是誰？」
2. 避免開放式問題，如「事件發生在什麼時間？」，應改為「事件是在晚上發生的嗎？」
3. 不要與先前問題重複
4. 問題應該幫助理解故事背景，但不直接揭示謎底
5. 絕對不要提問任何接近謎底或可能導致直接猜到答案的問題
6. 不要在問題中包含謎底的關鍵詞或核心概念

根據已有線索分析可能的情況，然後提出一個具體的、針對性的問題，讓關主只需回答「是」、「不是」或「不相關」。
只回傳問題本身，不需要任何解釋。
`;

    // 使用 Gemini 生成 NPC 問題
    const agents = await agentsPromise;
    const result = await agents.aiPlayerAgent.call({ input: npcPrompt });
    let question = result.output.trim();
    
    // 額外檢查：確保問題格式正確（是一個可用是/不是回答的問題）
    const formatCheckPrompt = `
請評估以下問題是否符合海龜湯遊戲的提問規則：

問題：${question}

評估標準：
1. 問題應該可以用「是」或「不是」回答
2. 不應該是開放式問題（如「為什麼」、「如何」、「是誰」等需要解釋的問題）
3. 應該是具體的、有針對性的問題

如果問題格式正確，回答「符合」。
如果問題是開放式的或不適合用是/不是回答，回答「不符合」並給出修改後的問題。
`;

    const formatCheck = await agents.hostAgent.call({ input: formatCheckPrompt });
    const formatResult = formatCheck.output.trim();
    
    console.log("問題格式檢查結果:", formatResult);
    
    // 如果問題格式不符合，使用AI提供的修改版本
    if (formatResult.toLowerCase().includes("不符合")) {
      const fixedQuestion = formatResult.match(/修改後[的為:](.+?)(?:\n|$)/i);
      if (fixedQuestion && fixedQuestion[1]) {
        question = fixedQuestion[1].trim();
        console.log("問題格式已修正為:", question);
      } else {
        // 如果無法提取修改後的問題，生成一個新的符合格式的問題
        const fixPrompt = `
請根據以下故事背景，生成一個符合格式的問題：
- 問題必須可以用「是」或「不是」回答
- 必須具體且有針對性
- 不要是開放式問題

故事背景：${story.story.substring(0, 150)}...

請直接提供修改後的問題，不要有任何前綴或解釋。
`;
        const fixResult = await agents.aiPlayerAgent.call({ input: fixPrompt });
        question = fixResult.output.trim();
        console.log("已生成新的格式正確問題:", question);
      }
    }
    
    // 額外檢查：確保生成的問題不會太接近謎底
    const checkPrompt = `
你是海龜湯謎題遊戲的安全檢查者。請判斷以下問題是否過於接近謎底，可能會破壞遊戲體驗。

故事標題：${story.questionName}
故事謎底：${story.soup}

NPC 提出的問題：${question}

請分析這個問題是否：
1. 直接包含謎底的關鍵元素
2. 過於明顯地暗示謎底
3. 讓玩家能夠輕易猜到謎底

如果問題有以上任意一點，請回答"不安全"。如果問題適當且不會過早揭示答案，請回答"安全"。
只回答"安全"或"不安全"，不要有其他文字。
`;

    const safetyCheck = await agents.hostAgent.call({ input: checkPrompt });
    const isSafe = safetyCheck.output.trim().toLowerCase().includes("安全") && 
                  !safetyCheck.output.trim().toLowerCase().includes("不安全");
    
    console.log("NPC 問題安全檢查結果:", safetyCheck.output.trim());
    
    // 如果問題不安全（太接近謎底），生成一個更通用的具體問題
    if (!isSafe) {
      console.log("NPC 問題過於接近謎底，重新生成更安全的問題");
      
      const fallbackPrompt = `
請為海龜湯謎題遊戲生成一個安全的問題，該問題應該:
1. 能夠用「是」或「不是」回答
2. 具體且有針對性
3. 關注故事細節，完全避開謎底相關的內容

故事背景：${story.story.substring(0, 100)}...

請從以下類別中選擇一個生成問題（但不要在問題中提及類別）：
- 時間相關：例如「事件是在週末發生的嗎？」
- 地點相關：例如「事件發生在室外嗎？」
- 人物相關：例如「有目擊證人嗎？」
- 環境相關：例如「當時天氣是晴朗的嗎？」

只提供問題本身，不需解釋。確保問題具體且有針對性。
`;
      
      const fallbackResult = await agents.aiPlayerAgent.call({ input: fallbackPrompt });
      question = fallbackResult.output.trim();
    }

    // 最後的保險：提供一組預設的具體問題
    const genericSpecificQuestions = [
      `事件是在夜晚發生的嗎？`,
      `主角是自願參與這個事件的嗎？`,
      `現場有超過三個人嗎？`,
      `這個事件是意外發生的嗎？`,
      `主角事先知道會發生這種情況嗎？`,
      `有人因此受傷嗎？`,
      `事件發生在室內嗎？`,
      `有人目睹了整個過程嗎？`,
      `這是一起犯罪事件嗎？`,
      `主角是一名成年人嗎？`
    ];
    
    // 作為保險：如果 NPC 的問題包含關鍵詞替換為具體問題
    const soupKeywords = story.soup.split(/\s+/).filter(word => word.length > 3);
    const containsKeyword = soupKeywords.some(keyword => 
      question.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (containsKeyword) {
      question = genericSpecificQuestions[Math.floor(Math.random() * genericSpecificQuestions.length)];
      console.log("NPC 問題包含謎底關鍵詞，已替換為安全具體問題");
    }
    
    // 最後檢查：確保問題以問號結尾
    if (!question.endsWith("?") && !question.endsWith("？")) {
      question = question + "？";
    }

    res.json({ question });
  } catch (error) {
    console.error("NPC 提問錯誤:", error);
    // 返回一個預設的具體問題
    const fallbackQuestions = [
      "事件是發生在一週之內的事嗎？",
      "主角是個男性嗎？",
      "事件中有人死亡嗎？",
      "主角是自願參與這個事件的嗎？",
      "這個事件與金錢有關嗎？"
    ];
    res.json({
      question: fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)]
    });
  }
};
