# 唐師父直播主題索引 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一個以設計稿為視覺基準、使用本地 JSON 資料的 React 影片索引頁，支援搜尋、主題／狀態篩選與排序。

**Architecture:** 使用 Vite + React 建立單頁應用。`App` 管理篩選狀態，`video-utils` 負責純資料運算，展示元件只接收標準化的影片資料。靜態 JSON 會保留與設計稿相同的資料欄位，未來可用 Notion adapter 取代資料來源而不改動 UI。

**Tech Stack:** Vite, React, JavaScript, CSS, Vitest, Testing Library, jsdom

---

## 檔案結構

將建立以下檔案：

- `package.json`: npm scripts 與依賴
- `index.html`: Vite 入口 HTML 與字體預載設定
- `src/main.jsx`: React 掛載點
- `src/App.jsx`: 頁面組合與篩選狀態
- `src/App.test.jsx`: 主要使用者互動測試
- `src/styles.css`: 全域 token、星象視覺與響應式樣式
- `src/data/videos.json`: 從設計稿 `DATA` 陣列轉出的靜態影片資料
- `src/lib/video-utils.js`: 影片欄位整理、衍生篩選選項、搜尋、篩選、排序
- `src/lib/video-utils.test.js`: 資料運算單元測試
- `src/components/Hero.jsx`: 頁首與主題環形導覽
- `src/components/TopicOrbit.jsx`: 可點擊的熱門主題與影片數量環形導覽
- `src/components/VideoExplorer.jsx`: 篩選狀態、衍生結果與控制／清單的組合層
- `src/components/SearchField.jsx`: 搜尋輸入控制
- `src/components/StatusFilters.jsx`: 會員狀態篩選控制
- `src/components/TopicFilters.jsx`: 主題篩選控制
- `src/components/SortControl.jsx`: 排序選擇控制
- `src/components/FilterBar.jsx`: 搜尋、狀態、主題與排序控制
- `src/components/VideoList.jsx`: 影片結果清單與空狀態
- `src/components/VideoItem.jsx`: 單筆影片項目
- `src/components/Footer.jsx`: 頁尾資料資訊
- `src/test/setup.js`: Testing Library matcher 與 DOM 測試環境設定

## Task 1: 建立 Vite React 專案與測試環境

**Files:**
- Create: `package.json`, `index.html`, `src/main.jsx`
- Create: `src/test/setup.js`
- Modify: `vite.config.js`

- [ ] **Step 1: 初始化 Vite React 專案**

Run `npm create vite@latest . -- --template react` and accept the current directory. Remove starter demo assets and replace the default entry with the project title `唐師父直播主題索引`.

- [ ] **Step 2: 安裝測試依賴**

Run `npm install` followed by `npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`.

- [ ] **Step 3: 設定測試 script 與 jsdom**

Add `test: "vitest run"`, `test:watch: "vitest"`, and `build: "vite build"` scripts. Configure Vitest with `environment: "jsdom"` and `setupFiles: "./src/test/setup.js"`.

- [ ] **Step 4: 確認空專案可建置與測試**

Run `npm run build` and `npm test -- --passWithNoTests`. Expected: Vite build succeeds and Vitest exits successfully with no test files.

## Task 2: 匯入並驗證靜態影片資料

**Files:**
- Create: `src/data/videos.json`
- Create: `src/lib/video-utils.test.js`

- [ ] **Step 1: 從設計稿 `DATA` 陣列產生 JSON**

Extract the array from `/Users/mujingtsai/Downloads/唐師父直播主題索引.html` into `src/data/videos.json`. Normalize each record to `id`, `title`, `date`, `url`, `topics`, and `status`; preserve null dates. Use a stable ID derived from the YouTube URL when present and a deterministic fallback for records without one.

- [ ] **Step 2: 寫資料格式的 failing test**

In `src/lib/video-utils.test.js`, import the JSON and assert that the dataset is non-empty and every record has a non-empty string `id`, `title`, `status`, and `topics` array; `date` must be either `null` or an ISO date string; `url` must be a string.

- [ ] **Step 3: 執行資料測試確認失敗原因正確**

Run `npm test -- src/lib/video-utils.test.js`. Expected: the test fails only if extraction produced a malformed record; correct the data shape before continuing.

- [ ] **Step 4: 執行資料測試確認通過**

Run the same command and confirm the normalized static dataset passes.

## Task 3: 實作並測試影片資料運算

**Files:**
- Create: `src/lib/video-utils.js`
- Modify: `src/lib/video-utils.test.js`

- [ ] **Step 1: 寫搜尋、篩選與排序的 failing tests**

Add focused tests for:

1. `filterVideos` trims and case-folds the query, matching titles or topics.
2. Status and topic filters combine with search using AND semantics.
3. `sortVideos` handles date descending, date ascending, title ascending, and title descending.
4. Null dates remain after dated items in both date orders.
5. `formatVideoDate(null)` returns an empty display value and a valid ISO date returns `YYYY.MM.DD`.
6. `getFilterOptions` returns deterministic status and topic counts for the UI.

- [ ] **Step 2: 執行測試確認 RED**

Run `npm test -- src/lib/video-utils.test.js`. Expected: failures report missing utility exports or missing behavior.

- [ ] **Step 3: 實作最小資料工具**

Implement pure functions with no DOM or React dependencies:

```js
getFilterOptions(videos)
filterVideos(videos, { query, status, topic })
sortVideos(videos, sortBy)
formatVideoDate(date)
```

`getFilterOptions` calculates global counts from the full dataset, returns statuses in the fixed design order, and returns topics sorted by descending count then ascending label. Use null-safe comparisons and return new arrays so the imported JSON is never mutated.

- [ ] **Step 4: 執行測試確認 GREEN**

Run `npm test -- src/lib/video-utils.test.js`. Expected: all data utility tests pass.

- [ ] **Step 5: Commit the data layer**

Run `git add src/data/videos.json src/lib/video-utils.js src/lib/video-utils.test.js && git commit -m "feat: add static video data and filtering utilities"`.

## Task 4: 建立 React 元件與主要互動

**Files:**
- Create: `src/App.jsx`, `src/App.test.jsx`
- Create: `src/components/Hero.jsx`, `src/components/TopicOrbit.jsx`, `src/components/VideoExplorer.jsx`
- Create: `src/components/SearchField.jsx`, `src/components/StatusFilters.jsx`, `src/components/TopicFilters.jsx`, `src/components/SortControl.jsx`
- Create: `src/components/FilterBar.jsx`, `src/components/VideoList.jsx`, `src/components/VideoItem.jsx`, `src/components/Footer.jsx`
- Modify: `src/main.jsx`

- [ ] **Step 1: 寫主要使用者流程的 failing tests**

Render `App` with a small in-test video fixture and cover one behavior per test:

1. Initial render shows the title, result count, and dated video items.
2. Typing in search narrows results by title or topic.
3. Clicking a status or topic filter narrows results and clicking it again clears the filter.
4. Changing the sort control changes item order.
5. A query with no match shows the empty state.
6. Clicking a topic in the hero orbit applies that topic to the same result filter as the topic chips.
7. A video link uses the expected URL and opens in a new tab, including a readable fallback for a null date.

- [ ] **Step 2: 執行測試確認 RED**

Run `npm test -- src/App.test.jsx`. Expected: failures show that `App` and its UI behavior are not implemented.

- [ ] **Step 3: 實作頁面與元件**

Implement `App({ videos = importedVideos })` with state for `query`, `activeStatus`, `activeTopic`, and `sortBy`, so tests can render a deterministic fixture without module mocking. `Hero` receives `{ topics, activeTopic, onTopicSelect }`; `TopicOrbit` renders each topic as an accessible button and calls `onTopicSelect(topic)` or `onTopicSelect(null)` when the active topic is clicked. `VideoExplorer` receives the full `videos` array and owns the derived `filterOptions` and `visibleVideos`, passing control props to `SearchField`, `StatusFilters`, `TopicFilters`, `SortControl`, and `VideoList`. `StatusFilters` and `TopicFilters` call their handlers with `null` when the active value is clicked again. Keep controls accessible with labels, buttons, and a native select. `VideoItem` renders the external link with `target="_blank"` and `rel="noreferrer"`.

- [ ] **Step 4: 執行測試確認 GREEN**

Run `npm test -- src/App.test.jsx`. Expected: all interaction tests pass without browser warnings.

- [ ] **Step 5: Commit the React interaction layer**

Run `git add src/App.jsx src/App.test.jsx src/components src/main.jsx && git commit -m "feat: add React video index interactions"`.

## Task 5: 實作設計稿視覺與響應式樣式

**Files:**
- Create: `src/styles.css`
- Modify: `index.html`, `src/main.jsx`, `src/App.jsx`, and component markup only if needed for styling hooks

- [ ] **Step 1: 建立 CSS token 與全頁骨架**

Add the approved colors, font families, page background, content max-width, hero spacing, panel surfaces, divider lines, and focus states. Use CSS-generated star texture and orbit geometry rather than introducing image assets.

- [ ] **Step 2: 樣式化互動控制與影片項目**

Style search, filter chips, sort select, topic counts, video rows, status labels, hover states, empty state, and footer while keeping buttons and labels readable at all sizes.

- [ ] **Step 3: 加入手機版 breakpoint**

At narrow widths, switch to a single-column list, make filter groups horizontally scrollable without wrapping into an unstable layout, reduce the orbit scale, and prevent page-level horizontal overflow.

- [ ] **Step 4: 執行測試與建置**

Run `npm test` and `npm run build`. Expected: all tests pass and Vite creates a production build in `dist`.

- [ ] **Step 5: Commit the visual layer**

Run `git add index.html src/styles.css src/App.jsx src/components src/main.jsx && git commit -m "feat: apply astrology video index design"`.

## Task 6: 瀏覽器驗證與修正

**Files:**
- Modify: only files required by verification findings

- [ ] **Step 1: 啟動本機開發伺服器**

Run `npm run dev -- --host 127.0.0.1`. Use the printed local URL for browser inspection.

- [ ] **Step 2: 驗證桌面版首屏與清單**

Check the hero, topic orbit, search row, filters, and first video entries at desktop width. Confirm no clipped text, accidental wrapping, or visual overlap.

- [ ] **Step 3: 驗證手機版排版**

Inspect a narrow viewport. Confirm no page-level horizontal scrolling, filters remain usable, dates and titles fit their containers, and orbit controls remain accessible.

- [ ] **Step 4: 驗證互動流程**

Use the browser to search a known title, select a topic, select a status, change sorting, clear filters, trigger an empty state, and click a video link. Confirm the visible count and rows update after each action.

- [ ] **Step 5: Run final verification**

Run `npm test` and `npm run build` again after any fixes. Report the actual results and the local development URL when handing off.
