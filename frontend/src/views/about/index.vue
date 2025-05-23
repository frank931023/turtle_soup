<template>
  <header class="main-header">
    <div class="container m-top-20">
      <h1 class="logo">
        <RouterLink to="/">請喝湯</RouterLink>
      </h1>
      <div class="entry-group">
        <button class="enter-button" @click="goToHome">
          進入大廳
        </button>
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
          <div class="team-card">
            <div class="member-avatar"></div>
            <div class="member-info">
              <h3>魏仁祥</h3>
              <div class="student-id">112403026</div>
              <p>Backend Development</p>
            </div>
          </div>
          
          <div class="team-card">
            <div class="member-avatar"></div>
            <div class="member-info">
              <h3>傅聖祐</h3>
              <div class="student-id">112403523</div>
              <p>Visual Storytelling</p>
            </div>
          </div>

          <div class="team-card">
            <div class="member-avatar"></div>
            <div class="member-info">
              <h3>楊佩蓉</h3>
              <div class="student-id">112403509</div>
              <p>UI/UX Enhancement</p>
            </div>
          </div>
          
          <div class="team-card">
            <div class="member-avatar"></div>
            <div class="member-info">
              <h3>謝曉崴</h3>
              <div class="student-id">112403511</div>
              <p>Report Writing</p>
            </div>
          </div>
          
          <div class="team-card">
            <div class="member-avatar"></div>
            <div class="member-info">
              <h3>黃偉鴻</h3>
              <div class="student-id">112403524</div>
              <p>LLM APIs Integration</p>
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
          <div class="highlight-card" v-for="highlight in highlights" :key="highlight.id">
            <div class="highlight-icon">
              <svg viewBox="0 0 24 24" class="icon"><path :d="highlight.icon" /></svg>
            </div>
            <div class="highlight-content">
              <h3>{{ highlight.title }}</h3>
              <p>{{ highlight.description }}</p>
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
        
        <div class="architecture-container">
          <div class="arch-card">
            <h3>前端</h3>
            <div class="tech">Vue.js</div>
            <div class="arch-content">
              <h4>主要功能：</h4>
              <ul>
                <li>玩家登入、進入遊戲介面</li>
                <li>題目展示、對話框輸入與回應顯示</li>
                <li>根據遊戲狀態動態顯示提示、NPC 回應與進度</li>
              </ul>
              
              <h4>互動流程：</h4>
              <ul>
                <li>玩家輸入問題或選擇互動選項</li>
                <li>請求發送至後端 API</li>
                <li>取得 AI 回覆後渲染到畫面</li>
              </ul>
            </div>
          </div>
          
          <div class="arch-card">
            <h3>後端</h3>
            <div class="tech">Node.js + Express.js</div>
            <div class="arch-content">
              <h4>主要功能：</h4>
              <ul>
                <li>提供 RESTful API 給前端使用（送出問題、取得回應、載入遊戲資料等）</li>
                <li>整合 LangGraph 架構管理 AI 對話流程</li>
                <li>控制 NPC 的行為邏輯與對話記憶</li>
              </ul>
              
              <h4>AI 整合：</h4>
              <ul>
                <li>使用 LangGraph 建構多角色 AI 流程圖</li>
                <li>每個 NPC 對應一個具獨立邏輯的 AI Agent</li>
                <li>可視需求串接外部大型語言模型（如 OpenAI API）</li>
              </ul>
            </div>
          </div>
          
          <div class="arch-card">
            <h3>資料庫</h3>
            <div class="tech">SQLite</div>
            <div class="arch-content">
              <h4>儲存內容：</h4>
              <ul>
                <li>玩家帳號、遊玩紀錄</li>
                <li>題目資料（分類、難度、狀態、標籤等）</li>
                <li>玩家與 AI/NPC 的對話紀錄（供日後回顧或進度續玩）</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import highlightsData from './light-design.json';

const router = useRouter();
const highlights = highlightsData;

function goToHome() {
  router.push('/');
}
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  opacity: 0.5; /* 增加星星可見度 */
}

@keyframes animateStars {
  from { transform: translateY(0); }
  to { transform: translateY(-2000px); }
}

.stars, .stars2, .stars3 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5000px;
  background: transparent;
  z-index: 0;
}

.stars {
  background-image: radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
                    radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
                    radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0));
  background-repeat: repeat;
  background-size: 200px 200px;
  animation: animateStars 150s linear infinite;
}

.stars2, .stars3 {
  background-image: radial-gradient(1px 1px at 25px 5px, #fff, rgba(0,0,0,0)),
                    radial-gradient(1px 1px at 50px 80px, #eee, rgba(0,0,0,0)),
                    radial-gradient(1px 1px at 125px 20px, #ddd, rgba(0,0,0,0));
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
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
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
  margin: 0;
}

/* 系統架構區塊 - 白色卡片 */
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
  min-height: 220px; /* 確保最小高度一致 */
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

.arch-card ul {
  margin: 0;
  padding: 0 0 0 20px;
}

.arch-card li {
  margin-bottom: 8px;
  color: #444;
}
/* 系統架構區塊 - 增強樣式 */
.arch-card {
  min-height: 360px; /* 增加高度以容納更多內容 */
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
  margin-bottom: 20px;
}

.arch-content li {
  margin-bottom: 10px;
  color: #444;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* 響應式設計 */
@media (max-width: 992px) {
  .content-container {
    padding: 80px 20px 50px;
  }
  
  .floating-title h1 {
    font-size: 3.5rem;
  }
  
  .team-card {
    height: auto; /* 移動設備上允許高度自適應 */
    min-height: 240px; /* 但設置最小高度 */
  }
  
  .highlight-card {
    flex-direction: column;
    gap: 20px;
    min-height: auto;
  }
  
  .team-grid.single-row {
    grid-template-columns: repeat(3, 1fr); /* 中等屏幕顯示3列 */
    gap: 20px;
  }
}

@media (max-width: 576px) {
  .floating-title h1 {
    font-size: 2.8rem;
  }
  
  .section-number {
    font-size: 3.2rem;
  }
  
  .section-header h2 {
    font-size: 1.8rem;
  }
  
  .team-grid.single-row {
    grid-template-columns: repeat(2, 1fr); /* 小屏幕顯示2列 */
  }
}

/* 團隊單排顯示樣式 - 避免滾動 */
.team-grid.single-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5個成員，5列 */
  gap: 15px;
}

.team-grid.single-row .team-card {
  height: 220px;
  width: 100%; /* 讓卡片寬度自適應 */
}

.team-grid.single-row .member-info {
  padding: 15px;
}

.team-grid.single-row .member-info h3 {
  font-size: 1.2rem;
  margin-bottom: 3px;
}

.team-grid.single-row .student-id {
  margin-bottom: 8px;
}

.team-grid.single-row .member-info p {
  font-size: 0.85rem;
}

/* 確保在移動設備上可以良好顯示 */
@media (max-width: 992px) {
  .team-grid.single-row {
    padding-bottom: 15px;
  }
  
  .team-grid.single-row .team-card {
    flex: 0 0 190px;
    height: 220px;
    min-height: auto;
  }
}

@media (max-width: 576px) {
  .team-grid.single-row .team-card {
    flex: 0 0 170px;
  }
  
  .team-grid.single-row .member-info h3 {
    font-size: 1.2rem;
  }
}

.main-header {
  background: #e8e8e8;
  border-bottom: 1px solid #f3f3f3;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
      font-size: 24px;
      font-weight: bold;
      margin-left: 10px;

      a {
        color: var(--text-color);
        text-decoration: none;
      }
    }

    .entry-group {
      display: flex;
      gap: 20px;
      align-items: center;
      margin-left: auto;
    }

    .entry {
      font-size: 16px;
      color: var(--text-color);
      text-decoration: none;
      display: flex;
      align-items: center;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.6s ease;

      i {
        font-size: 14px;
        margin-left: 4px;
      }

      &.show {
        opacity: 1;
        transform: translateY(0);
      }

      &:hover {
        text-decoration: none;
        transform: scale(1.05) translateY(-2px); /* 放大 + 微微上移 */
        transition: all 0.3s ease;
      }
    }
  }
}
</style>
