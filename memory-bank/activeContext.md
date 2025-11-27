# Active Context 活動環境

## 當前工作重點

目前的工作重點已從基礎建設轉向 **Demo 環境的自動化與優化**：
1.  建立 `edge-facility` 應用程式及其自動化發布流程。
2  實現從 Git Tag 到 Glasskube 套件更新的完整 CI/CD 流水線。
3.  優化應用程式 UI 以展示版本更新效果。

### 最近完成的變更

1.  **Edge Facility 應用程式** - 基於 `sample-web-app` 創建了 `edge-facility`：
    -   實作了 "Premium" Dashboard UI (Light Mode)。
    -   支援動態顯示應用程式版本 (`APP_VERSION`)。
    -   新增自訂 Icon 和 Footer。

2.  **CI/CD 自動化 (GitHub Actions)** - 建立了 `.github/workflows/ci.yml`：
    -   **Docker Build**: 自動建置 Image 並推送到 GitHub Container Registry (GHCR)。
    -   **Helm Packaging**: 自動打包 Helm Chart 並生成 `index.yaml` (建立標準 Helm Repo)。
    -   **Glasskube Package**: 自動更新 `versions.yaml` 和 `package.yaml`。
    -   **GitOps**: 自動將所有變更 Commit 回 `main` 分支。

3.  **Demo 自動化腳本** - 創建了 `scripts/demo-release.sh`：
    -   一鍵完成 `git pull`, `commit`, `push`, `tag` 流程。
    -   解決了本地與遠端分支的衝突問題。

4.  **基礎設施修復**：
    -   修正 Helm Repository 結構，確保 `repositoryUrl` 指向包含 `index.yaml` 的有效位置。
    -   將 Container Registry 從本地遷移至 GHCR 公開存取。

## 當前決策和考量

1.  **CI/CD 策略**:
    -   使用 **Git Tags** (e.g., `v1.0.x`) 作為觸發點。
    -   CI 流程負責所有構建產物 (Docker Image, Helm Chart) 的生成和發布。
    -   CI 流程負責更新 Glasskube 套件定義，保持 Git 作為 Single Source of Truth。

2.  **Helm Repository 託管**:
    -   利用 GitHub Raw (`raw.githubusercontent.com`) 託管 Helm Chart (`.tgz`) 和 `index.yaml`。
    -   這要求 CI 流程必須在每次發布時重新生成 `index.yaml`。

3.  **Container Registry**:
    -   使用 **GitHub Container Registry (GHCR)** 替代本地 Registry。
    -   優點：與 GitHub Actions 整合無縫，且公開可存取，方便 Demo。

4.  **Demo 流程優化**:
    -   由於 GitHub Raw 和 Glasskube 之間存在快取延遲 (Cache Delay)，Demo 時需預留等待時間。
    -   使用 `demo-release.sh` 腳本來標準化發布操作，減少人為錯誤。

## 學習和洞察

1. Glasskube 套件庫可以靈活地使用不同的檔案源，包括:
   - 本地伺服器 (之前實作)
   - GitHub raw URLs (目前實作)
   - 其他公開可存取的 Web 伺服器

2. 直接引用原始位置的檔案(而非複製)可以:
   - 減少同步問題
   - 確保使用最新版本
   - 簡化維護流程

3. C4 模型提供了有效的方式來:
   - 可視化系統組件及其關係
   - 明確定義系統範圍和邊界
   - 識別不同使用者角色與系統的互動方式

## 下一步

1. 進行整合測試以確保更新後的 URL 可正常運作
2. 考慮為新增套件建立自動化工作流程
3. 探索使用版本標籤而非固定分支，提高版本管理彈性
4. 進一步完善架構文檔，可能添加其他 C4 模型圖表（如容器圖、組件圖）

## Active Decisions

### Direct File References
We decided to use direct references to original application files (/apps/* directory) in the package.yaml definitions instead of duplicating files. This approach:
- Eliminates redundancy and maintenance overhead
- Creates a single source of truth for application manifests
- Simplifies updates when application files change

### Package Configuration Strategy
For both packages, we implemented valueDefinitions that allow end-users to customize:
- For Shiori: hostname, replicas, and storage size
- For Sample Web App: replica count, ingress enablement, and ingress hostname

### Architecture Visualization
We chose to use the C4 model for architecture documentation because it:
- Provides a clear way to communicate system structure to both technical and non-technical stakeholders
- Effectively captures different levels of abstraction (from high-level context to details)
- Uses a format (Mermaid) that can be directly rendered in GitHub

## Key Insights
1. **Single Source of Truth**: The direct file reference approach creates a clean separation between application sources and package definitions.
2. **URL Correctness**: With GitHub raw URLs, the key to making direct references work is ensuring correct URL formatting and public repository access.
3. **Value Targeting**: The valueDefinitions targeting system in Glasskube is powerful for patching specific parts of manifests or charts.
4. **System Boundaries**: Clearly defining system boundaries in the architecture diagram helps identify responsibilities and interfaces.

## Current Patterns and Preferences
1. Keep application files in their original location.
2. Favor clear documentation over implicit understanding.
3. Design for single source of truth.
4. Provide customization options via valueDefinitions.
5. Utilize GitHub raw URLs for package file hosting to simplify access and eliminate server maintenance.
6. Use C4 model and Mermaid for architecture documentation.
7. Clearly distinguish between system components and their relationships.

## 狀態更新：開發階段完成與暫停

本階段（基礎 Glasskube 套件庫建置與 GitHub raw URL 整合）已圓滿完成，程式碼已穩定並標記為 1.0.1 版本。近期暫無新功能開發計畫，專案進度將暫停於此狀態。

### 未來開發指引
- 若需繼續開發，請先檢查 GitHub raw URLs 是否仍有效，並確認 repository 權限為公開。
- 建議以語意化版本標籤（如 1.0.2, 1.1.0）管理後續變更。
- 所有套件定義與原始應用程式檔案應維持單一來源原則，避免重複。
- 重要架構與設計決策已記錄於 memory-bank/ 與 documents/ 目錄，請優先參考。
- 若有新需求，請於 progress.md 補充規劃與分階段目標。
