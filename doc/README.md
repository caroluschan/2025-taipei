# 台北聖誕之旅 2025 🎄

> 8人團契聖誕四日遊完整旅遊指南網站

## 📋 專案概述

這是一個專為2025年12月25-28日台北聖誕之旅設計的靜態旅遊指南網站。網站提供完整的行程規劃、景點資訊、預算計算、地圖導覽等功能。

### 旅程資訊
- **日期：** 2025年12月25日（三）至12月28日（六）
- **天數：** 4天3夜
- **人數：** 8人（4對情侶）
- **團體性質：** 基督徒團契
- **年齡層：** 28-32歲香港人

## 🎯 專案特色

- ✨ 乾淨現代的設計風格，融入聖誕主題
- 📱 完全響應式設計，支援手機、平板、桌面設備
- 🗺️ 互動式地圖整合（Google Maps）
- 💰 即時預算計算器
- 🖨️ 友善列印樣式
- ♿ 無障礙設計（ARIA標籤、鍵盤導航）
- 🎨 使用CSS變數實現主題化設計

## 🛠️ 技術架構

### 前端技術
- **HTML5** - 語義化標籤
- **CSS3** - 現代CSS特性（Grid、Flexbox、CSS Variables）
- **Vanilla JavaScript** - 無框架依賴
- **Google Fonts** - Noto Sans TC + Inter

### 部署平台
- **GitHub Pages** - 靜態網站託管

## 📁 專案結構

```
web/
├── index.html              # 主要HTML文件
├── css/
│   ├── main.css           # 主要樣式表
│   ├── responsive.css     # 響應式設計
│   └── print.css          # 列印樣式
├── js/
│   ├── main.js            # 主要JavaScript（導航、UI互動）
│   ├── map.js             # 地圖整合
│   └── calculator.js      # 預算計算器
├── images/
│   ├── hero/              # 首頁橫幅圖片
│   ├── attractions/       # 景點圖片
│   ├── food/              # 美食圖片
│   └── icons/             # 圖標資源
├── data/
│   └── itinerary.json     # 行程數據
├── .gitignore
└── README.md
```

## 🚀 快速開始

### 本地開發

1. **克隆專案**
   ```bash
   git clone [repository-url]
   cd 2025-taipei/web
   ```

2. **使用本地伺服器**
   
   使用Python：
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   或使用Node.js：
   ```bash
   npx http-server
   ```

3. **開啟瀏覽器**
   ```
   http://localhost:8000
   ```

### 部署到GitHub Pages

1. **推送到GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **啟用GitHub Pages**
   - 前往Repository Settings
   - 找到Pages設定
   - Source選擇`main`分支的`/web`資料夾
   - 儲存設定

3. **訪問網站**
   ```
   https://[username].github.io/2025-taipei/
   ```

## 📊 功能模組

### 1. 導航系統 (main.js)
- 固定式頂部導航
- 移動端漢堡選單
- 平滑滾動到各區塊
- 滾動時高亮當前區塊

### 2. 地圖整合 (map.js)
- Google Maps API整合
- 景點標記與資訊窗口
- 按日期篩選景點
- 距離計算功能

### 3. 預算計算器 (calculator.js)
- 每日預算分析
- 分類支出統計
- 港幣/台幣換算
- 即時預算總覽

### 4. 行程數據 (itinerary.json)
- 結構化的行程資訊
- 景點座標數據
- 預算明細
- 成員資訊

## 🎨 設計系統

### 色彩方案
- **主色（聖誕紅）：** `#c41e3a`
- **次色（聖誕綠）：** `#165b33`
- **強調色（金色）：** `#f4c430`

### 字體系統
- **中文：** Noto Sans TC
- **英文/數字：** Inter
- **基礎大小：** 16px

### 間距系統
使用CSS變數實現一致的間距：
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

## 📱 響應式設計

網站支援以下斷點：
- **手機：** < 768px
- **平板：** 768px - 991px
- **小桌面：** 992px - 1199px
- **桌面：** 1200px+
- **大桌面：** 1400px+

## 🖨️ 列印支援

網站包含專門的列印樣式表，優化印刷輸出：
- A4直式排版
- 黑白友善
- 隱藏非必要元素
- 優化分頁符號

## ♿ 無障礙功能

- ARIA標籤
- 語義化HTML
- 鍵盤導航支援
- 高對比度文字
- 減少動畫選項（尊重系統設定）

## 📝 數據來源

行程規劃基於以下資料來源：
- 台北旅遊網
- 台灣觀光局
- 各景點官方網站
- Google Maps
- 天氣預報資料

## 🔜 開發藍圖

依照開發計劃（dev_plan.md），開發進度：

- ✅ **Step 1:** 專案設定與基礎結構
- ✅ **Step 2:** HTML結構 - 導航與標題
  - 固定式響應式導航欄
  - 聖誕主題裝飾元素（浮動樹與雪花）
  - 平滑滾動與活躍狀態高亮
  - 移動端漢堡選單
  - 返回頂部按鈕
  - Hero section 滾動指示器
- ✅ **Step 3:** HTML結構 - Hero Section（英雄區塊）
  - 多層次漸層背景（聖誕紅綠配色）
  - 8個浮動聖誕裝飾動畫（樹、雪花、星星、禮物等）
  - 大型標題與副標題，帶文字陰影特效
  - 旅程日期與資訊顯示
  - 4個資訊徽章（聖誕版、8人團體、台北、團契旅行）
  - 向下捲動指示器帶彈跳動畫
  - 完整響應式設計（手機隱藏部分裝飾以保持清晰）
  - 動態shimmer光澤效果
  - 脈動emoji圖示
- **Step 4:** 數據準備 - 將plan.md轉換為JSON
- **Step 5:** HTML結構 - 概覽區塊
- **Step 6-9:** 持續開發中...

## 👥 團隊成員

- Couple 1: Charles & Annie
- Couple 2: Lapmei & Kristal
- Couple 3: Fat & Maggie
- Couple 4: Kris & Tiffany

## 📄 授權

本專案為私人旅遊規劃用途。

## 📞 聯絡資訊

如有任何問題或建議，請聯絡團隊成員。

---

**Created with ❤️ for our fellowship group**

🎄 祝大家旅途愉快！Merry Christmas! 🎄
