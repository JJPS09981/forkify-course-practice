## 🍴 Forkify — 食譜管理工具
- 專案類型： 食譜搜尋 / 替換份量 / 書籤收藏
- 描述： 使用 MVC 架構打造的動態食譜應用程式，可搜尋食譜、查看詳細內容、儲存書籤，並支援上傳使用者自訂食譜。

## ⭐ 功能 Features
-  食譜搜尋（使用 Forkify API）
-  食譜詳細資訊（時間、份量、食材清單）
-  自動換算份量（Servings Update）
-  書籤收藏（含 localStorage）
-  上傳自製食譜
-  Loading Spinner、錯誤訊息 UI
-  使用 Parcel 打包專案

## 🧪 技術使用 Technologies
- JavaScript ES6+
- MVC 架構
- Sass / SCSS
- Parcel
- Forkify API
- localStorage（儲存書籤）

## 🛠️ 個人優化 Custom Improvements
- SCSS 模組化、變數管理
- 統一 UI 動畫、轉場效果
- 明確事件委派 + handler 拆分
- API 設定抽離為 config 模組
- 安全防呆：API 請求錯誤處理、回傳資料格式驗證

## 🚀 待新增功能
- 食材換算器：可自行輸入份量需求，自動重新計算所有食材克數
- 深色模式：提供深淺兩種風格切換
- 高級搜尋：依照烹飪時間、卡路里、難度等條件篩選
- Lazy Loading：優化食譜圖片載入速度
- API 緩存機制：重複搜尋時優先使用快取，減少 API 請求
