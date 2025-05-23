# 請喝湯 (Turtle Soup)

![Turtle Soup Logo](frontend/src/assets/turtle-soup.png)

## 項目介紹

「請喝湯」是一個基於 Vue.js 和 Express.js 的海龜湯解謎遊戲平台。玩家可以在平台上體驗各種海龜湯謎題，通過提問與 AI 互動來解開謎題。平台支持故事創建、管理、遊戲記錄追蹤以及多人對戰功能。

### 什麼是海龜湯？

海龜湯（Turtle Soup）是一種起源於日本的情境解謎遊戲。主持人給出一個奇怪或不完整的故事開頭，參與者只能通過是/否/不相關的問題逐漸解開謎題。

## 技術架構

### 前端 (Frontend)

- **框架**: Vue.js 3.5 (使用 Composition API)
- **狀態管理**: Pinia 3.0 (含持久化)
- **路由**: Vue Router 4.5
- **UI 庫**: Element Plus、Vuestic UI
- **HTTP 客戶端**: Axios
- **構建工具**: Vite
- **動畫**: Motion.js
- **樣式**: Tailwind CSS, SCSS

### 後端 (Backend)

- **框架**: Express.js
- **數據庫**: SQLite3 (通過 Sequelize ORM 操作)
- **AI 整合**: Langchain, Google Gemini API
- **認證**: JWT (JSON Web Tokens)
- **跨域**: CORS

## 目錄結構

### 前端 (Frontend)

```
frontend/
├── public/               # 靜態資源
│   └── music/            # 遊戲背景音樂
├── src/
│   ├── apis/             # API請求模組
│   ├── assets/           # 靜態資源 (圖片、CSS等)
│   ├── components/       # 可復用組件
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia狀態管理
│   ├── styles/           # 全局樣式
│   ├── util/             # 工具函數
│   └── views/            # 頁面視圖
│       ├── about/        # 關於頁面
│       ├── account/      # 帳戶管理
│       ├── admin/        # 管理員頁面
│       ├── game/         # 遊戲核心頁面
│       ├── history/      # 遊戲歷史紀錄
│       ├── home/         # 主頁
│       ├── landing/      # 著陸頁
│       ├── layout/       # 布局組件
│       ├── login/        # 登錄頁面
│       └── register/     # 註冊頁面
├── index.html            # 入口HTML文件
└── vite.config.js        # Vite配置
```

### 主要前端文件功能說明

- **App.vue**: 應用程序根組件，包含全局布局
- **main.js**: 應用程序入口點，配置全局插件
- **router/index.js**: 路由配置，定義所有頁面導航
- **stores/\*.js**: Pinia 狀態倉庫，存儲全局狀態
- **views/game/index.vue**: 遊戲主要界面，處理問答互動
- **views/StoryManage.vue**: 故事管理頁面，用於浏覽、編輯和刪除故事
- **views/StoryEditor.vue**: 故事編輯器，用於創建和編輯故事
- **apis/story.js**: 處理與故事相關的 API 請求
- **apis/agent.js**: 處理與 AI 代理相關的 API 請求

### 後端 (Backend)

```
backend/
├── agent/                # AI代理配置
├── config/               # 配置文件
├── controller/           # 控制器
├── database/             # 數據庫文件
├── middlewares/          # 中間件
├── model/                # 模型定義
├── models/               # Sequelize模型
├── route/                # 路由定義
├── seeders/              # 數據庫種子文件
└── app.js                # 應用程序入口點
```

### 主要後端文件功能說明

- **app.js**: Express 應用程序入口點，配置中間件和路由
- **agent/agentSetup.js**: 設置 AI 代理的邏輯和行為
- **controller/**: 控制器文件，處理業務邏輯
  - **agent.js**: AI 交互控制器
  - **questionbank.js**: 問題庫控制器
  - **user.js**: 用戶相關控制器
  - **gamerecord.js**: 遊戲記錄控制器
- **model/**: 數據庫模型定義
- **route/**: API 路由定義

## 功能模塊

### 用戶系統

- 用戶註冊、登錄
- 個人資料管理
- 權限控制 (普通用戶/管理員)

### 故事管理

- 創建新故事
- 編輯現有故事
- 分類管理 (標簽、難度等)
- 故事狀態控制 (待審核、已審核、已刪除)

### 遊戲系統

- 單人遊戲模式
- 多人游戲模式 (包括 NPC)
- 問答互動界面
- 線索收集與過濾
- 成功解謎提示

### AI 互動

- 基於 Langchain 的 AI 代理系統
- 使用 Google Gemini API 提供智能回答
- 遊戲主持人角色(湯神)
- NPC 參與者角色

### 數據追踪

- 遊戲歷史記錄
- 排行榜系統
- 用戶統計數據

## 項目運行

### 前端運行

```powershell
cd frontend
npm install
npm run dev
```

### 後端運行

```powershell
cd backend
npm install
npm run dev
```

## 團隊成員

- **魏仁祥** - 後端開發 (Backend Development)
- **傅聖祐** - 視覺講述 (Visual Storytelling)
- **楊佩蓉** - UI/UX 增強 (UI/UX Enhancement)
- **謝曉崴** - 報告撰寫 (Report Writing)
- **黃偉鴻** - LLM API 整合 (LLM APIs Integration)

## 系統架構

### 前端架構

- Vue.js 單頁應用程序
- 組件化 UI 設計
- 響應式數據流
- 路由基於 URI 參數和查詢字符串

### 後端架構

- RESTful API 設計
- MVC 架構 (Model-View-Controller)
- 數據持久化通過 Sequelize ORM
- AI 工作流基於 Langchain

### 數據庫架構

- SQLite 關係型數據庫
- 用戶、故事、遊戲記錄等主要表
- 使用 Sequelize 進行 ORM 映射

## 亮點功能

1. **AI 驅動的海龜湯解謎**: 使用先進的 LLM 引擎處理問答
2. **多角色 NPC 互動**: 支持多個 NPC 共同參與解謎
3. **故事創作與管理**: 完整的故事 CRUD 功能
4. **動態線索過濾**: 根據回答類型過濾和組織線索
5. **個人化遊戲設置**: 可自定義問題數量和 NPC 數量
6. **遊戲統計與記錄**: 詳細記錄遊戲數據和解謎進度

## 技術挑戰與解決方案

1. **AI 回應的準確性**
   - 挑戰: 確保 AI 能夠準確理解問題並給出合理的答复
   - 解決方案: 使用 Langchain 框架結合提示工程，為 AI 提供上下文和行為指南
2. **多角色 AI 協作**

   - 挑戰: 實現多個 AI 角色之間的協作
   - 解決方案: 開發 Agent 系統，每個 NPC 有獨立的記憶和目標

3. **遊戲狀態同步**
   - 挑戰: 保持前後端數據一致性
   - 解決方案: 使用 Pinia 的持久化存儲和清晰的 API 設計

## 未來計劃

1. 實現真實多人對戰功能
2. 增加更多故事類型和難度級別
3. 引入評分系統和社交分享
4. 開發移動應用版本
5. 擴展 AI 能力，支持更複雜的問答互動

## 授權信息

© 2025 請喝湯團隊。保留所有權利。
