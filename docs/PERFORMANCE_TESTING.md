# ⚡ 效能測試指南
## Performance Testing Guide

完整的效能測試流程，確保網站達到最佳載入速度和使用者體驗。

---

## 🎯 測試目標

### Core Web Vitals 目標
- **LCP** (Largest Contentful Paint): < 2.5 秒
- **FID** (First Input Delay): < 100 毫秒
- **CLS** (Cumulative Layout Shift): < 0.1

### Lighthouse 評分目標
- **Performance**: ≥ 95
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 95
- **SEO**: ≥ 95
- **PWA**: ✅ 可安裝

---

## 📊 測試工具

### 1. Chrome Lighthouse (必備)

#### 執行步驟
1. 開啟 Chrome DevTools (`Cmd + Option + I`)
2. 點擊 **Lighthouse** 標籤
3. 配置:
   - Mode: **Navigation**
   - Device: **Desktop** 或 **Mobile**
   - Categories: 全選
4. 點擊 **Analyze page load**

#### 評分標準
```
100-90: 優秀 ⭐⭐⭐⭐⭐
89-75:  良好 ⭐⭐⭐⭐
74-50:  需改進 ⭐⭐⭐
49-0:   差 ⭐⭐
```

#### 報告解讀
- **Metrics**: 檢查 6 個核心指標
- **Opportunities**: 優化建議 (可節省時間)
- **Diagnostics**: 診斷資訊
- **Passed Audits**: 已通過的測試

---

### 2. Chrome DevTools Performance

#### 記錄效能
1. 開啟 DevTools → **Performance** 標籤
2. 點擊 **Record** 🔴
3. 重新整理頁面
4. 載入完成後停止記錄
5. 分析時間軸

#### 重點檢查
- **FCP** (First Contentful Paint)
- **LCP** (Largest Contentful Paint)
- **TTI** (Time to Interactive)
- **TBT** (Total Blocking Time)
- **長任務** (Long Tasks > 50ms)

---

### 3. Chrome DevTools Network

#### 測試載入速度
1. 開啟 DevTools → **Network** 標籤
2. 勾選 **Disable cache**
3. 選擇網路速度:
   - Fast 3G
   - Slow 3G
   - Offline (測試 PWA)
4. 重新整理頁面

#### 分析重點
```
總請求數: < 30 個
總大小: < 1 MB
DOMContentLoaded: < 1.5s
Load: < 3.0s
```

---

### 4. WebPageTest

#### 線上測試
**網址:** https://www.webpagetest.org

#### 配置
- **Test Location:** Hong Kong (最接近用戶)
- **Browser:** Chrome
- **Connection:** 4G LTE
- **Number of Tests:** 3 (取中位數)
- **Repeat View:** 勾選 (測試快取效果)

#### 關鍵指標
- **TTFB** (Time to First Byte): < 0.5s
- **Start Render**: < 1.5s
- **Speed Index**: < 2.0s
- **Fully Loaded**: < 3.0s

---

### 5. Google PageSpeed Insights

#### 線上測試
**網址:** https://pagespeed.web.dev

#### 測試流程
1. 輸入網站 URL
2. 點擊 **Analyze**
3. 等待測試完成 (~30 秒)

#### 報告內容
- **Field Data**: 真實用戶數據 (需要流量)
- **Lab Data**: 實驗室數據
- **Opportunities**: 優化建議
- **Diagnostics**: 診斷資訊

---

## 🧪 測試清單

### ✅ 首次載入測試

#### Desktop 測試
- [ ] 開啟 Lighthouse (Desktop 模式)
- [ ] Performance ≥ 95
- [ ] FCP < 1.0s
- [ ] LCP < 2.0s
- [ ] TTI < 2.5s
- [ ] TBT < 200ms
- [ ] CLS < 0.1

#### Mobile 測試
- [ ] 開啟 Lighthouse (Mobile 模式)
- [ ] Performance ≥ 90
- [ ] FCP < 1.8s
- [ ] LCP < 2.5s
- [ ] TTI < 3.5s
- [ ] TBT < 300ms
- [ ] CLS < 0.1

---

### ✅ 重複訪問測試

#### 快取驗證
- [ ] 首次訪問 (清除快取)
- [ ] 重新整理頁面
- [ ] 檢查 Network 標籤:
  - 大部分資源來自 **(ServiceWorker)**
  - 或 **(disk cache)**
- [ ] 載入時間 < 0.5s

#### Service Worker 檢查
1. 開啟 DevTools → **Application** 標籤
2. 點擊 **Service Workers**
3. 確認:
   - [x] Status: **activated and is running**
   - [x] Source: `/sw.js`

4. 點擊 **Cache Storage**
5. 確認快取:
   - [x] `taipei-travel-v1.0.0`
   - [x] `taipei-runtime-v1.0.0`

---

### ✅ 離線測試

#### PWA 離線功能
1. 首次載入網站 (確保 Service Worker 已註冊)
2. 開啟 DevTools → **Network** 標籤
3. 選擇 **Offline**
4. 重新整理頁面
5. 確認:
   - [ ] 頁面正常載入
   - [ ] 所有樣式正確
   - [ ] 圖片顯示 (已快取)
   - [ ] 地圖功能可用 (已快取)

---

### ✅ 網路速度測試

#### 慢速網路 (3G)
1. DevTools → **Network** → **Slow 3G**
2. 清除快取
3. 重新整理頁面
4. 確認:
   - [ ] 載入畫面即時顯示
   - [ ] 關鍵內容優先載入
   - [ ] 圖片延遲載入
   - [ ] 總載入時間 < 10s

#### 快速網路 (4G/WiFi)
1. 使用 **Fast 3G** 或 **No throttling**
2. 確認:
   - [ ] FCP < 1.0s
   - [ ] LCP < 2.0s
   - [ ] 互動即時響應

---

### ✅ JavaScript 效能測試

#### 長任務檢測
1. DevTools → **Performance**
2. 記錄頁面載入
3. 檢查 **Main** 軌道
4. 確認:
   - [ ] 無長任務 > 100ms
   - [ ] 無阻塞主線程
   - [ ] 平滑的 60fps

#### 記憶體使用
1. DevTools → **Memory**
2. 選擇 **Heap snapshot**
3. 執行互動 (開關選單、切換日期等)
4. 再次拍攝快照
5. 確認:
   - [ ] 無記憶體洩漏
   - [ ] 使用量合理 (< 50 MB)

---

### ✅ 資源載入優化測試

#### 關鍵資源
1. DevTools → **Network** → **All**
2. 按 **Time** 排序
3. 確認載入順序:
   1. HTML
   2. 關鍵 CSS (內聯)
   3. 字體
   4. 圖片 (延遲)
   5. JavaScript (defer)

#### Resource Timing
```javascript
// 控制台執行
performance.getEntriesByType('resource').forEach(resource => {
    console.log(resource.name, resource.duration);
});
```

確認:
- [ ] DNS 查詢 < 50ms
- [ ] 連接時間 < 100ms
- [ ] TLS 握手 < 100ms
- [ ] 下載時間合理

---

### ✅ PWA 功能測試

#### 安裝測試 (Desktop Chrome)
1. 訪問網站
2. 檢查地址欄右側 **安裝** 圖標 ➕
3. 點擊安裝
4. 確認:
   - [ ] 彈出安裝提示
   - [ ] 應用程式名稱正確
   - [ ] 圖標顯示

#### iOS 測試 (Safari)
1. 訪問網站
2. 點擊 **分享** 按鈕
3. 選擇 **加入主畫面**
4. 確認:
   - [ ] 圖標添加到主畫面
   - [ ] 名稱正確
   - [ ] 全屏顯示

#### Manifest 驗證
1. DevTools → **Application** → **Manifest**
2. 確認:
   - [ ] Name: "台北聖誕之旅 2025"
   - [ ] Short name: "台北聖誕遊"
   - [ ] Start URL: "/"
   - [ ] Display: "standalone"
   - [ ] Icons: 顯示

---

## 📈 效能優化檢查清單

### HTML 優化
- [x] 語義化標籤
- [x] Meta 標籤完整
- [x] Viewport 設定
- [x] 資源提示 (preconnect, dns-prefetch)
- [x] 關鍵 CSS 內聯

### CSS 優化
- [x] 關鍵 CSS 內聯
- [x] 非關鍵 CSS 外部載入
- [x] Print CSS 分離
- [x] 無未使用的 CSS
- [x] CSS 變數使用

### JavaScript 優化
- [x] Defer 屬性
- [x] Async 屬性 (適用)
- [x] 模組化
- [x] 事件委託
- [x] 防抖/節流

### 圖片優化
- [x] 延遲載入
- [x] 適當尺寸
- [x] Placeholder
- [x] Alt 文字

### 快取優化
- [x] Service Worker
- [x] Cache-First 策略
- [x] Network-First 策略
- [x] Stale-While-Revalidate
- [x] 版本控制

### 網路優化
- [x] CDN 使用
- [x] DNS Prefetch
- [x] Preconnect
- [x] HTTP/2
- [x] Gzip/Brotli

---

## 🔧 故障排除

### 問題 1: Lighthouse 評分低

#### 可能原因
- JavaScript 阻塞渲染
- 未使用的 CSS/JS
- 圖片未優化
- 無快取策略

#### 解決方案
1. 檢查 **Opportunities** 部分
2. 實施建議的優化
3. 重新測試

### 問題 2: Service Worker 未運作

#### 檢查步驟
```javascript
// 控制台執行
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('已註冊的 Service Workers:', registrations);
    });
}
```

#### 解決方案
- 確保使用 HTTPS 或 localhost
- 檢查 sw.js 路徑
- 查看控制台錯誤
- 取消註冊並重新註冊

### 問題 3: 快取未生效

#### 檢查快取
1. DevTools → **Application** → **Cache Storage**
2. 確認快取存在
3. 檢查快取內容

#### 清除快取
```javascript
// 控制台執行
caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
    console.log('快取已清除');
});
```

---

## 📊 效能報告範本

### 測試日期: ____________
### 測試人員: ____________

#### Lighthouse 評分

| 類別 | Desktop | Mobile | 目標 | 狀態 |
|------|---------|--------|------|------|
| Performance | __ | __ | ≥ 95 | ☐ |
| Accessibility | __ | __ | ≥ 95 | ☐ |
| Best Practices | __ | __ | ≥ 95 | ☐ |
| SEO | __ | __ | ≥ 95 | ☐ |
| PWA | ☐ | ☐ | ✅ | ☐ |

#### Core Web Vitals

| 指標 | Desktop | Mobile | 目標 | 狀態 |
|------|---------|--------|------|------|
| LCP | __s | __s | < 2.5s | ☐ |
| FID | __ms | __ms | < 100ms | ☐ |
| CLS | __ | __ | < 0.1 | ☐ |
| FCP | __s | __s | < 1.8s | ☐ |
| TTI | __s | __s | < 3.8s | ☐ |

#### 載入時間

| 測試 | 時間 | 目標 | 狀態 |
|------|------|------|------|
| 首次載入 | __s | < 3s | ☐ |
| 重複訪問 | __s | < 0.5s | ☐ |
| DOMContentLoaded | __s | < 1.5s | ☐ |
| Load Event | __s | < 3s | ☐ |

#### 資源大小

| 資源 | 大小 | 請求數 |
|------|------|--------|
| HTML | __ KB | __ |
| CSS | __ KB | __ |
| JavaScript | __ KB | __ |
| 圖片 | __ KB | __ |
| 字體 | __ KB | __ |
| **總計** | __ KB | __ |

#### 發現的問題
1. _________________________________
2. _________________________________
3. _________________________________

#### 優化建議
1. _________________________________
2. _________________________________
3. _________________________________

---

## ✨ 最佳實踐

### 定期測試
- 每次更新後測試
- 至少每月一次完整測試
- 使用真實設備測試

### 監控指標
- 設定效能預算
- 追蹤趨勢
- 及時優化

### 持續改進
- 關注新技術
- 實施漸進式優化
- 收集用戶反饋

---

## 🔗 相關資源

- [Chrome Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Web.dev](https://web.dev/measure/)
- [WebPageTest](https://www.webpagetest.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Core Web Vitals](https://web.dev/vitals/)

---

**完成所有測試後，確保所有目標都達成 ✅**
