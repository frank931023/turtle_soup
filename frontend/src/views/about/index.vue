<template>
  <div>
    <header class="main-header">
      <div class="container m-top-20">
        <h1 class="logo">
          <RouterLink to="/">請喝湯</RouterLink>
        </h1>
        <div class="entry-group">
          <button class="enter-button" @click="router.push('/home')">進入大廳</button>
        </div>
      </div>
    </header>
    <div class="about-page">
      <!-- 保留星空背景，調整透明度 -->
      <div class="stars-container">
        <div class="stars"></div>
        <div class="stars2"></div>
        <div class="stars3"></div>
      </div>

      <div class="content-container">
        <!-- 頂部標題 -->
        <div class="floating-title">
          <div class="title-inner">
            <h1>海龜湯</h1>
            <div class="subtitle">TURTLE SOUP</div>
          </div>
        </div>

        <!-- 團隊區塊 - 單排顯示 -->
        <section class="team-section reveal-section">
          <div class="section-header">
            <span class="section-number">01</span>
            <h2>團隊成員</h2>
            <div class="header-line"></div>
          </div>

          <div class="team-grid single-row">
            <div class="team-card" v-for="member in teamMembers" :key="member.id">
              <div
                class="member-avatar"
                :style="
                  member.avatarUrl
                    ? `background-image: url(${member.avatarUrl}); background-size: cover; background-position: center;`
                    : ''
                "
              ></div>
              <div class="member-info">
                <h3>{{ member.name }}</h3>
                <div class="student-id">{{ member.studentId }}</div>
                <p>{{ member.role }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 亮點設計區塊 -->
        <section class="highlights-section reveal-section">
          <div class="section-header right-aligned">
            <span class="section-number">02</span>
            <h2>亮點設計</h2>
            <div class="header-line"></div>
          </div>

          <div class="highlights-container">
            <div class="highlight-card" v-for="highlight in highlightsEnhanced" :key="highlight.id">
              <div class="highlight-icon">
                <svg viewBox="0 0 24 24" class="icon"><path :d="highlight.icon" /></svg>
              </div>
              <div class="highlight-content">
                <h3>{{ highlight.title }}</h3>
                <p>{{ highlight.description }}</p>
                <div class="highlight-details" v-if="highlight.details">
                  <h4>實現細節：</h4>
                  <ul>
                    <li v-for="(detail, idx) in highlight.details" :key="idx">{{ detail }}</li>
                  </ul>
                </div>
                <div class="highlight-benefits" v-if="highlight.benefits">
                  <h4>玩家體驗：</h4>
                  <ul>
                    <li v-for="(benefit, idx) in highlight.benefits" :key="idx">{{ benefit }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 系統架構區塊 - 更完整內容 -->
        <section class="architecture-section reveal-section">
          <div class="section-header">
            <span class="section-number">03</span>
            <h2>系統架構</h2>
            <div class="header-line"></div>
          </div>

          <div class="architecture-overview">
            <p class="arch-intro">
              本系統採用現代化的三層架構設計，整合前後端與 AI 技術打造沉浸式海龜湯體驗。
              各組件之間透過標準化 API 交互，確保功能擴展性與可維護性。
            </p>
          </div>

          <div class="architecture-container">
            <div class="arch-card">
              <h3>前端</h3>
              <div class="tech">Vue.js + Vite</div>
              <div class="arch-content">
                <h4>主要功能：</h4>
                <ul>
                  <li>玩家登入、進入遊戲介面</li>
                  <li>題目展示、對話框輸入與回應顯示</li>
                  <li>根據遊戲狀態動態顯示提示、NPC 回應與進度</li>
                  <li>響應式設計，適配不同裝置螢幕</li>
                  <li>音效與視覺效果處理，提升使用者體驗</li>
                </ul>

                <h4>互動流程：</h4>
                <ul>
                  <li>玩家輸入問題或選擇互動選項</li>
                  <li>請求發送至後端 API</li>
                  <li>取得 AI 回覆後渲染到畫面</li>
                  <li>狀態管理使用 Pinia，處理全局遊戲狀態</li>
                  <li>整合 Vue Router 實現無刷新頁面轉換</li>
                </ul>

                <h4>技術細節：</h4>
                <ul>
                  <li>採用 Vue 3 Composition API，提高代碼可讀性</li>
                  <li>使用 Tailwind CSS 與自定義 SCSS 樣式</li>
                  <li>WebSocket 實時更新玩家互動狀態</li>
                </ul>
              </div>
            </div>

            <div class="arch-card">
              <h3>後端</h3>
              <div class="tech">Node.js + Express.js + LangGraph</div>
              <div class="arch-content">
                <h4>主要功能：</h4>
                <ul>
                  <li>提供 RESTful API 給前端使用（送出問題、取得回應、載入遊戲資料等）</li>
                  <li>整合 LangGraph 架構管理 AI 對話流程</li>
                  <li>控制 NPC 的行為邏輯與對話記憶</li>
                  <li>實現用戶認證與授權管理</li>
                  <li>處理遊戲進度保存與讀取邏輯</li>
                </ul>

                <h4>AI 整合框架：</h4>
                <ul>
                  <li>使用 LangGraph 建構多角色 AI 流程圖</li>
                  <li>每個 NPC 對應一個具獨立邏輯的 AI Agent</li>
                  <li>實現 AI 的長期記憶與上下文管理</li>
                  <li>可視需求串接外部大型語言模型（如 OpenAI API）</li>
                  <li>自定義提示詞工程，確保 AI 回應符合遊戲設計</li>
                </ul>

                <h4>架構特點：</h4>
                <ul>
                  <li>模組化設計，各功能組件高內聚低耦合</li>
                  <li>中間件處理跨域、身份驗證等通用邏輯</li>
                  <li>錯誤處理機制，確保系統穩定性</li>
                </ul>
              </div>
            </div>

            <div class="arch-card">
              <h3>資料庫</h3>
              <div class="tech">SQLite + Sequelize ORM</div>
              <div class="arch-content">
                <h4>儲存內容：</h4>
                <ul>
                  <li>玩家帳號、遊玩紀錄</li>
                  <li>題目資料（分類、難度、狀態、標籤等）</li>
                  <li>玩家與 AI/NPC 的對話紀錄（供日後回顧或進度續玩）</li>
                  <li>系統配置與遊戲參數設定</li>
                </ul>

                <h4>資料模型：</h4>
                <ul>
                  <li>User: 使用者資訊與權限管理</li>
                  <li>QuestionBank: 海龜湯題庫管理</li>
                  <li>GameRecord: 玩家遊戲進度與歷史</li>
                  <li>Conversation: AI 對話內容與上下文</li>
                </ul>

                <h4>技術特點：</h4>
                <ul>
                  <li>使用 Sequelize ORM 簡化資料庫操作</li>
                  <li>遷移與種子腳本管理資料結構與初始數據</li>
                  <li>資料一致性與安全性控制</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- 未來展望部分 -->
        <section class="future-section reveal-section">
          <div class="section-header right-aligned">
            <span class="section-number">04</span>
            <h2>未來展望</h2>
            <div class="header-line"></div>
          </div>

          <div class="future-container">
            <div class="future-intro">
              <p>「請喝湯」專案將持續進化，探索 AI 互動敘事的更多可能性。以下是我們的發展願景：</p>
            </div>

            <div class="future-grid">
              <div class="future-card" v-for="vision in futureVision" :key="vision.id">
                <div class="future-icon">
                  <svg viewBox="0 0 24 24" class="icon">
                    <path :d="vision.icon" />
                  </svg>
                </div>
                <div class="future-content">
                  <h3>{{ vision.title }}</h3>
                  <ul>
                    <li v-for="(feature, idx) in vision.features" :key="idx">{{ feature }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- <div class="future-quote">
              <blockquote>
                我們相信，AI 不僅能輔助創作，更能創造全新的互動敘事形式。
                「請喝湯」將持續結合傳統文字遊戲的魅力與最新 AI 技術的可能性，
                為玩家打造獨一無二的推理解謎體驗。
              </blockquote>
            </div> -->
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import teamMembersData from './team-members.json'
import futureVisionData from './future-vision.json'

const router = useRouter()
const teamMembers = teamMembersData
const futureVision = futureVisionData

// 註釋掉未使用的變量，但保留以備將來可能使用
// const highlights = highlightsData

// 增強版亮點設計資料
const highlightsEnhanced = [
  {
    id: 1,
    title: '沉浸式 AI 劇情互動',
    description:
      '融合 LangGraph 多代理 AI 系統，模擬具個性與記憶的 NPC，玩家可進行開放式提問並從 AI 獲得「是」、「不是」或「不相關」回覆，營造類似文字冒險小說的體驗。',
    icon: 'M21,9H15V7h6Zm0,2H15v2h6Zm0,4H3v2H21Zm0,4H3v2H21ZM13,9H7V7h6Zm0,2H7v2H6ZM3,7H5V5H3Zm0,2H5v2H3Z',
    details: [
      '使用 LangGraph 建構多層次 AI 代理網絡，實現角色行為邏輯',
      '每個 NPC 具備獨立的性格特徵、目標動機與知識背景',
      '對話歷史記憶系統，讓 AI 能記住先前互動並據此調整回應',
      '上下文管理器確保長對話中 AI 反應一致性',
    ],
    benefits: [
      '玩家體驗開放世界般的自由提問，不受預設選項限制',
      '每次遊戲體驗獨特，根據提問路徑產生不同結局可能',
      '沉浸式互動讓玩家真正「融入」故事情境中',
      'AI 角色表現出人性化的思考與情感反應',
    ],
  },
  {
    id: 2,
    title: 'AI 輔助偵探解謎體驗',
    description:
      '玩家扮演偵探角色，藉由詢問 AI 串出完整事件脈絡。還可以選擇NPC一起遊戲，強化推理難度與真實感。',
    icon: 'M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM9.4,16.6,4.8,12l1.4-1.4,3.2,3.2,8.4-8.4,1.4,1.4Z',
    details: [
      '精心設計的推理題庫，包含懸疑、犯罪、超自然等多種類型',
      'AI 引導系統在玩家遇到瓶頸時提供適度提示',
      '多角色互動模式，每個 NPC 掌握部分線索與資訊',
      '遊戲進度追蹤，玩家可隨時中斷並繼續之前的解謎過程',
    ],
    benefits: [
      '鍛煉玩家邏輯推理與批判性思考能力',
      '通過 AI 的智能回應，產生「啊哈」頓悟時刻',
      '故事情節隨玩家探索角度變化，提供高重玩價值',
      '模擬真實偵探工作流程，包含線索收集、假設提出與驗證',
    ],
  },
  // {
  //   id: 3,
  //   title: '智能故事生成系統',
  //   description:
  //     '整合大型語言模型創造原創海龜湯劇本，每個故事都有精心設計的謎題、虛假線索與解謎邏輯，確保邏輯一致性與娛樂價值。',
  //   icon: 'M14,2L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2H14M18,20V9H13V4H6V20H18M12,12L16,16H13.5V19H10.5V16H8L12,12Z',
  //   details: [
  //     'AI 輔助創作系統，協助編劇構建合理且引人入勝的謎題',
  //     '自動一致性檢查，避免故事邏輯漏洞',
  //     '主題標籤系統，助玩家依喜好選擇故事類型',
  //     '難度動態調整，根據玩家解謎表現提供相應挑戰',
  //   ],
  //   benefits: [
  //     '內容持續更新，玩家總能找到全新謎題挑戰',
  //     '跨領域知識融合，拓展玩家學習興趣',
  //     '多元文化視角的故事背景，增加遊戲豐富性',
  //     '謎題設計由淺入深，適合不同解謎經驗的玩家',
  //   ],
  // },
]

// 保留此函數，已由模板中的 router.push('/home') 取代
// function goToHome() {
//   router.push('/')
// }
</script>

<style scoped>
/* 基本設置與背景 */
.about-page {
  position: relative;
  min-height: 100vh;
  background: #0f1424;
  color: #fff;
  overflow: hidden;
  font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
}

/* 星空背景 - 保持星星背景 */
.stars-container {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  opacity: 0.5; /* 增加星星可見度 */
}

@keyframes animateStars {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-2000px);
  }
}

.stars,
.stars2,
.stars3 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5000px;
  background: transparent;
  z-index: 0;
}

.stars {
  background-image:
    radial-gradient(2px 2px at 20px 30px, #eee, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 40px 70px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 90px 40px, #fff, rgba(0, 0, 0, 0));
  background-repeat: repeat;
  background-size: 200px 200px;
  animation: animateStars 150s linear infinite;
}

.stars2,
.stars3 {
  background-image:
    radial-gradient(1px 1px at 25px 5px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 50px 80px, #eee, rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 125px 20px, #ddd, rgba(0, 0, 0, 0));
  background-repeat: repeat;
  background-size: 200px 200px;
  animation: animateStars 100s linear infinite;
}

/* 內容容器 */
.content-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 30px 80px;
  z-index: 1;
}

/* 標題 */
.floating-title {
  position: relative;
  text-align: center;
  margin-bottom: 100px;
  padding-top: 40px;
}

.title-inner {
  display: inline-block;
  position: relative;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
}

.floating-title h1 {
  font-size: 4.5rem;
  font-weight: 800;
  margin: 0;
  color: #fff;
  text-shadow: 0 0 15px rgba(76, 201, 240, 0.5);
}

.floating-title .subtitle {
  font-size: 1.5rem;
  letter-spacing: 8px;
  color: rgba(255, 255, 255, 0.6);
  transform: translateY(-10px);
}

/* 區段共通樣式 */
.reveal-section {
  opacity: 0;
  transform: translateY(50px);
  animation: reveal 1s ease-out forwards;
  margin-bottom: 120px;
}

@keyframes reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 50px;
  position: relative;
}

.section-header.right-aligned {
  flex-direction: row-reverse;
  text-align: right;
}

.section-number {
  font-size: 4.5rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.386);
  line-height: 1;
  margin-right: 20px;
}

.right-aligned .section-number {
  margin-right: 0;
  margin-left: 20px;
}

.section-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  color: #fff;
  position: relative;
  z-index: 2;
}

.header-line {
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.5), transparent);
  flex-grow: 1;
  margin-left: 30px;
}

.right-aligned .header-line {
  margin-left: 0;
  margin-right: 30px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5));
}

/* 團隊區塊 - 白色卡片 */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.team-grid.single-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5個成員，5列 */
  gap: 15px;
}

.team-card {
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 250px; /* 固定高度確保一致性 */
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.team-grid.single-row .team-card {
  height: 220px;
  width: 100%; /* 讓卡片寬度自適應 */
}

.team-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.member-avatar {
  height: 100px;
  background: #f5f5f5;
  border-bottom: 1px solid #eaeaea;
}

.member-info {
  padding: 25px 20px;
  background: #fff;
  color: #222;
}

.team-grid.single-row .member-info {
  padding: 15px;
}

.member-info h3 {
  margin: 0 0 5px;
  font-size: 1.4rem;
  font-weight: 600;
  color: #222;
}

.team-grid.single-row .member-info h3 {
  font-size: 1.2rem;
  margin-bottom: 3px;
}

.student-id {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 12px;
  font-family: monospace;
}

.team-grid.single-row .student-id {
  margin-bottom: 8px;
}

.member-info p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #555;
}

.team-grid.single-row .member-info p {
  font-size: 0.85rem;
}

/* 亮點設計區塊 - 白色卡片 */
.highlights-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.highlight-card {
  display: flex;
  gap: 30px;
  position: relative;
  background: #ffffff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  min-height: 180px; /* 確保最小高度一致 */
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #222;
}

.highlight-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.highlight-icon {
  flex: 0 0 80px;
  height: 80px;
  background: #f5f5f5;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eaeaea;
}

.highlight-icon .icon {
  width: 40px;
  height: 40px;
  fill: #444;
}

.highlight-content {
  flex: 1;
}

.highlight-content h3 {
  font-size: 1.6rem;
  margin: 0 0 15px;
  color: #222;
  position: relative;
  display: inline-block;
}

.highlight-content h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  height: 2px;
  width: 50%;
  background: #e0e0e0;
}

.highlight-content p {
  font-size: 1rem;
  line-height: 1.7;
  color: #444;
  margin: 0 0 20px 0;
}

/* 亮點詳細內容樣式 */
.highlight-details,
.highlight-benefits {
  margin-top: 20px;
}

.highlight-content h4 {
  font-size: 1.1rem;
  margin: 0 0 10px;
  color: #333;
  font-weight: 600;
}

.highlight-content ul {
  margin: 0;
  padding: 0 0 0 20px;
}

.highlight-content ul li {
  margin-bottom: 8px;
  color: #444;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* 系統架構區塊 - 白色卡片 */
.architecture-overview {
  margin-bottom: 40px;
}

.arch-intro {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  max-width: 900px;
  margin: 0 auto 30px;
  text-align: center;
  font-weight: 300;
}

/* 系統架構卡片樣式 */
.architecture-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.arch-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  min-height: 360px; /* 確保最小高度一致 */
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #222;
}

.arch-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.arch-card h3 {
  font-size: 1.6rem;
  margin: 0 0 10px;
  color: #222;
}

.tech {
  display: inline-block;
  background: #f5f5f5;
  color: #444;
  padding: 5px 12px;
  border-radius: 50px;
  font-size: 0.9rem;
  margin-bottom: 20px;
  border: 1px solid #eaeaea;
}

.arch-content h4 {
  font-size: 1.2rem;
  margin: 20px 0 10px;
  color: #333;
  font-weight: 600;
  border-left: 3px solid #ddd;
  padding-left: 10px;
}

.arch-content h4:first-child {
  margin-top: 0;
}

.arch-content ul {
  margin: 0 0 20px 0;
  padding: 0 0 0 20px;
}

.arch-content li {
  margin-bottom: 10px;
  color: #444;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* 未來展望區塊 */
.future-container {
  color: #fff;
}

.future-intro {
  text-align: center;
  margin-bottom: 40px;
}

.future-intro p {
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 800px;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.9);
}

.future-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.future-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.future-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.future-icon {
  margin-bottom: 20px;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.future-icon .icon {
  width: 24px;
  height: 24px;
  fill: rgba(255, 255, 255, 0.9);
}

.future-content h3 {
  font-size: 1.4rem;
  margin: 0 0 15px;
  color: #fff;
}

.future-content ul {
  padding-left: 20px;
  margin: 0;
}

.future-content li {
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
}

.future-quote {
  margin: 40px 0;
  text-align: center;
}

.future-quote blockquote {
  font-size: 1.2rem;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto;
  font-style: italic;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
  padding: 0 40px;
}

.future-quote blockquote::before,
.future-quote blockquote::after {
  content: '"';
  font-size: 3rem;
  position: absolute;
  color: rgba(255, 255, 255, 0.2);
}

.future-quote blockquote::before {
  top: -20px;
  left: 0;
}

.future-quote blockquote::after {
  bottom: -50px;
  right: 0;
}

/* 響應式調整 */
@media (max-width: 992px) {
  .highlight-card {
    flex-direction: column;
    gap: 20px;
  }

  .future-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .future-grid {
    grid-template-columns: 1fr;
  }

  .future-quote blockquote {
    padding: 0 20px;
    font-size: 1.1rem;
  }
}

.main-header {
  background: #e8e8e8;
  border-bottom: 1px solid #f3f3f3;
}

.main-header .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-header .logo {
  font-size: 24px;
  font-weight: bold;
  margin-left: 10px;
}

.main-header .logo a {
  color: var(--text-color);
  text-decoration: none;
}

.main-header .entry-group {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-left: auto;
}

.main-header .entry {
  font-size: 16px;
  color: var(--text-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.6s ease;
}

.main-header .entry i {
  font-size: 14px;
  margin-left: 4px;
}

.main-header .entry.show {
  opacity: 1;
  transform: translateY(0);
}

.main-header .entry:hover {
  text-decoration: none;
  transform: scale(1.05) translateY(-2px); /* 放大 + 微微上移 */
  transition: all 0.3s ease;
}
</style>
