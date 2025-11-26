# 系統模式

> **狀態說明**：本專案已完成基礎建置，程式碼穩定（1.0.1）。未來開發請參考 memory-bank/activeContext.md。

## 架構概述

```
glasskube-package-test/
├── apps/                       # 原始應用程式定義
│   ├── shiori/                 # Shiori Kubernetes 清單檔
│   └── sample-web-app/         # Sample Web App 與 Helm chart
├── documents/                  # 專案文檔
│   └── glasskube_architecture_diagram.md  # 系統架構圖 (C4 模型)
└── glasskube-packages/         # Glasskube 套件庫
    └── packages/               # 套件定義目錄
        ├── index.yaml          # 套件庫索引
        ├── shiori/             # Shiori 套件
        └── sample-web-app/     # Sample Web App 套件
```

## 系統架構 (C4 模型)

專案使用 C4 模型建立了完整的系統上下文圖 (System Context Diagram)，這個圖表包含在 `documents/glasskube_architecture_diagram.md` 中。架構圖使用 Mermaid 格式繪製，可直接在 GitHub 上檢視。

### 主要系統範圍

架構圖定義了兩個主要範圍：
1. **System Scope** - 包含 Glasskube 套件庫和 Glasskube 應用程式
2. **APM Scope** - 包含用於監控已部署應用程式的監控系統

### 主要角色 (Personas)

架構中識別了四個主要角色：
- **Package Author** - 創建和維護套件庫中的套件
- **Package Client (SI Engineer)** - 使用 Glasskube 工具安裝/解除安裝套件的系統整合工程師
- **DevOps Engineer** - 管理 Kubernetes 叢集的工程師
- **Application User** - 使用已部署應用程式的最終用戶

### 核心系統

架構圖中定義了兩個核心系統：
1. **Glasskube Package Repository** - 包含套件定義、K8s 清單和 Helm 圖表的中央系統
2. **Glasskube Application** - 運行在 Kubernetes 上的應用程式，包含 CLI 和 GUI 組件

### 外部系統

架構中包含以下外部系統：
- **GitHub** - 託管套件庫原始檔案
- **Kubernetes Cluster** - 套件部署的目標環境，也託管 Glasskube 應用程式
- **Container Registry** - 存儲套件引用的容器映像
- **Monitoring System** - 監控已部署的應用程式 (APM 範圍內)
- **Deployed Applications** - 部署到 Kubernetes 叢集的應用程式

## 關鍵元件

### 1. 應用程式 (最原始資源)
`apps/` 目錄包含做為單一資料來源的原始應用程式定義：
- **Shiori**: 使用 Kubernetes YAML 清單定義部署、服務等
- **Sample Web App**: 使用 Helm chart 進行部署

### 2. Glasskube 套件庫
`glasskube-packages/` 目錄包含 Glasskube 套件定義：
- **index.yaml**: 列出所有可用的套件
- **套件目錄**: 每個應用程式都有自己的目錄和版本

### 3. 套件定義
每個套件都有標準化的結構：
- **versions.yaml**: 列出所有可用版本，並標記最新版本
- **v{version}+{build}/package.yaml**: 特定版本的完整套件定義

## 實作模式

### GitHub 直接引用模式
套件定義使用 GitHub raw URL 直接引用原始檔案，避免重複：
```yaml
# 對於基於清單的套件 (Shiori)
manifests:
  - url: https://raw.githubusercontent.com/pkhsu/glasskube-package-test/main/apps/shiori/namespace.yaml
  - url: https://raw.githubusercontent.com/pkhsu/glasskube-package-test/main/apps/shiori/deployment.yaml
  # ...

# 對於基於 Helm 的套件 (Sample Web App)
helm:
  chartName: eap-distr-simulator
  chartVersion: 0.1.0
  repositoryUrl: https://raw.githubusercontent.com/pkhsu/glasskube-package-test/main/apps/sample-web-app/chart/
```

### 值定義模式
配置參數使用目標定義，對清單或圖表的特定部分進行修補：
```yaml
valueDefinitions:
  hostname:
    metadata:
      description: "用於訪問應用的主機名..."
    type: text
    defaultValue: "example.com"
    targets:
      - manifests:
          - selector: "kind=Ingress,name=shiori"
            patch:
              op: replace
              path: /spec/rules/0/host
```

### 套件庫訪問模式
套件庫直接通過 GitHub raw URLs 訪問，無需本地伺服器：
```bash
# 添加基於 GitHub 的套件庫
glasskube repo add github-repo https://raw.githubusercontent.com/pkhsu/glasskube-package-test/main/glasskube-packages/packages
```

## 關鍵實作路徑

1. **套件定義 → GitHub 原始檔案**: 套件定義必須正確引用 GitHub 上 `apps/` 目錄中的檔案
2. **GitHub URLs → 套件檔案**: GitHub raw URLs 必須是公開可訪問的，並指向正確的分支
3. **Glasskube CLI → 套件庫**: Glasskube CLI 必須能夠通過 HTTPS 訪問 GitHub 上的套件庫
4. **Glasskube CLI/GUI → K8s**: Glasskube 工具部署應用程式到 Kubernetes 叢集

# System Patterns

> **Status Note**: This project has completed its initial setup, and the codebase is stable (1.0.1). For future development, please refer to memory-bank/activeContext.md.

## Architecture Overview

```
glasskube-package-test/
├── apps/                       # Original application definitions
│   ├── shiori/                 # Shiori Kubernetes manifests
│   └── sample-web-app/         # Sample Web App with Helm chart
├── documents/                  # Project documentation
│   └── glasskube_architecture_diagram.md  # System architecture diagram (C4 Model)
└── glasskube-packages/         # Glasskube package repository
    └── packages/               # Package definition directory
        ├── index.yaml          # Package repository index
        ├── shiori/             # Shiori package
        └── sample-web-app/     # Sample Web App package
```

## System Architecture (C4 Model)

The project uses the C4 model to create a comprehensive System Context Diagram, which is included in `documents/glasskube_architecture_diagram.md`. The architecture diagram is drawn using Mermaid format and can be viewed directly on GitHub.

### Original Main System Scopes (Legacy)

The architecture diagram initially defined two main scopes:
1. **System Scope** - Contains the Glasskube package repository and the Glasskube application
2. **APM Scope** - Contains the monitoring system used to monitor deployed applications

### Original Main Personas (Legacy)

The architecture initially identified four main personas:
- **Package Author** - Creates and maintains packages in the package repository
- **Package Client (SI Engineer)** - System integration engineer who uses Glasskube tools to install/uninstall packages
- **DevOps Engineer** - Engineer who manages Kubernetes clusters
- **Application User** - End user who uses deployed applications

### Original Core Systems (Legacy)

The architecture diagram initially defined two core systems:
1. **Glasskube Package Repository** - Central system containing package definitions, K8s manifests, and Helm charts
2. **Glasskube Application** - Application running on Kubernetes, including CLI and GUI components

### Original External Systems (Legacy)

The architecture initially included the following external systems:
- **GitHub** - Hosts package repository source files
- **Kubernetes Cluster** - Target environment for package deployment, also hosts the Glasskube application
- **Container Registry** - Stores container images referenced by packages
- **Monitoring System** - Monitors deployed applications (within APM scope)
- **Deployed Applications** - Applications deployed to Kubernetes clusters

## Expanded System Context: Unified Application Delivery & Observability Platform (UADOP)

As the system evolves to support multi-cluster application distribution and comprehensive observability, a new, broader system context is defined.

### System in Scope: Unified Application Delivery & Observability Platform (UADOP)

*   **Description**: A platform that enables a vendor to manage and deploy applications to multiple customer Kubernetes clusters and provides centralized observability (logs, traces, metrics) for these applications.
*   **Key Responsibilities**:
    *   Application package management and versioning (via `Glasskube Distr Hub`).
    *   Deployment orchestration to designated customer clusters (via `Glasskube Distr Hub`).
    *   Centralized collection, storage, and visualization of telemetry data from all managed clusters (via an Enterprise Observability Platform - EAP, likely comprising Grafana, Loki, Tempo, Mimir/Prometheus).
    *   Facilitation of application instrumentation in customer clusters for observability (by deploying and configuring eBPF tools like Odigos or Grafana Beyla).

### Actors:

1.  **`Platform Operator (Vendor)`**
    *   **Description:** The primary user responsible for managing the UADOP, the application lifecycle (packaging, versioning, deployment), and monitoring the health and performance of applications across all clusters.
    *   **Interactions with UADOP:**
        *   Manages application definitions, versions, and deployment targets [Uses `UADOP`'s Distribution Service (Glasskube Distr Hub) GUI/API].
        *   Initiates and monitors application deployments to Customer K8s Clusters [Uses `UADOP`'s Distribution Service (Glasskube Distr Hub) GUI/API].
        *   Views and analyzes application logs, traces, and metrics from all managed clusters [Uses `UADOP`'s Observability GUI (Grafana)].
        *   Configures observability agents (e.g., Odigos, Grafana Beyla/Alloy) and data collection strategies [Uses `UADOP`'s configuration interfaces or by packaging configurations with applications].

### External Systems & Interactions with UADOP:

1.  **`Customer Kubernetes Cluster`**
    *   **Description:** Kubernetes clusters managed by customers where vendor applications are deployed and run. These are the "edge" clusters in a multi-cluster architecture.
    *   **Interactions with UADOP:**
        *   `UADOP` -> `Customer K8s Cluster`: Deploys application manifests and configurations (via `Glasskube Distr Hub` mechanisms, potentially involving an agent on the customer cluster or direct K8s API interaction) [Data: Application manifests/images, Configuration; Protocol: K8s API, Distr Hub protocol].
        *   `UADOP` -> `Customer K8s Cluster`: Deploys/configures `eBPF-based Collectors` (e.g., Odigos, Grafana Beyla) and associated telemetry pipelines (e.g., Grafana Alloy, OpenTelemetry Collector) [Data: Collector configuration, Agent manifests; Protocol: K8s API / Agent updates].
        *   `Customer K8s Cluster` -> `UADOP`: `eBPF-based Collectors` and telemetry pipeline components running in the Customer Cluster send telemetry data (logs, traces, metrics) to the EAP (Logs, Traces, Metrics components) within `UADOP`. This transport may involve direct connections, or intermediaries like `Grafana Alloy/OpenTelemetry Collector` and potentially `Apache Kafka` [Data: Logs, Traces (OTLP), Metrics (Prometheus Exposition/OTLP); Protocol: HTTP/gRPC (OTLP), Kafka messages, Prometheus remote_write].

2.  **`Vendor Kubernetes Cluster`**
    *   **Description:** The "central" Kubernetes cluster where the `Unified Application Delivery & Observability Platform (UADOP)` control plane (including `Glasskube Distr Hub` and the `EAP`) is hosted and managed.
    *   **Interactions with UADOP:**
        *   Primarily hosts the `UADOP`.
        *   May also run vendor-managed applications that are monitored by the EAP, sending telemetry data to `UADOP`'s EAP components in a similar fashion to `Customer Kubernetes Clusters`.

3.  **`eBPF-based Collectors (e.g., Odigos, Grafana Beyla)`**
    *   **Description:** Software agents running within `Customer Kubernetes Clusters` (and potentially the `Vendor Kubernetes Cluster`). They use eBPF to automatically instrument applications at the kernel level, collecting telemetry data (logs, traces, metrics) without requiring application code modifications.
    *   **Interactions with UADOP (EAP Components):**
        *   Send collected telemetry data to `UADOP`'s EAP components. This flow might be direct or, more likely, via an intermediary like `Grafana Alloy / OpenTelemetry Collector` which can handle aggregation, processing, and routing (e.g., to Kafka or directly to EAP backends). [Data: Logs, Traces (OTLP), Metrics; Protocol: HTTP/gRPC (OTLP), Prometheus remote_write].
    *   **Note on Odigos & Mimir:** Odigos might require Grafana Alloy or an OTel Collector to forward metrics to Grafana Mimir if direct support is not available. Grafana Beyla often pairs with Grafana Alloy.

4.  **`Grafana Alloy / OpenTelemetry Collector` (Telemetry Pipeline Intermediary)**
    *   **Description:** A versatile telemetry pipeline component for collecting, processing, and exporting observability data. It can act as an agent on edge clusters or as a central gateway. Essential for features like routing telemetry through Kafka, as indicated in user diagrams ("若要走 kafka 傳輸，需要透過 Grafana Alloy / OTEL Collector 來做代理").
    *   **Interactions with `eBPF-based Collectors`:**
        *   Receives raw or semi-processed telemetry data from `eBPF-based Collectors` deployed in the clusters [Data: Logs, Traces (OTLP), Metrics; Protocol: HTTP/gRPC (OTLP)].
    *   **Interactions with UADOP (EAP components) or Kafka:**
        *   Forwards processed, aggregated, and/or routed telemetry data to `UADOP`'s EAP backends (Loki, Tempo, Mimir) or to an `Apache Kafka` instance for buffering and transport [Data: Logs, Traces (OTLP), Metrics; Protocol: HTTP/gRPC (OTLP), Kafka messages, Prometheus remote_write].

5.  **`Apache Kafka` (Optional Telemetry Transport Bus)**
    *   **Description:** A distributed event streaming platform that can be used for durable, scalable, and decoupled transport of high-volume telemetry data from multiple clusters to the central EAP.
    *   **Interactions with `Grafana Alloy / OpenTelemetry Collector`:**
        *   Receives telemetry data streams from `Grafana Alloy / OpenTelemetry Collector` instances [Data: Serialized telemetry events (e.g., JSON, Protobuf); Protocol: Kafka client protocol].
    *   **Interactions with UADOP (EAP components):**
        *   Provides telemetry data streams that are consumed by the EAP's Log (Loki), Trace (Tempo), and Metric (Mimir/Prometheus) storage and processing components [Data: Serialized telemetry events; Protocol: Kafka client protocol].


## Key Components (Original)

### 1. Applications (Original Source of Truth)
The `apps/` directory contains the original application definitions as the single source of truth:
- **Shiori**: Uses Kubernetes YAML manifests to define deployments, services, etc.
- **Sample Web App**: Uses a Helm chart for deployment.

### 2. Glasskube Package Repository (Original)
The `glasskube-packages/` directory contains the Glasskube package definitions:
- **index.yaml**: Lists all available packages.
- **Package Directories**: Each application has its own directory and versions.

### 3. Package Definitions (Original)
Each package has a standardized structure:
- **versions.yaml**: Lists all available versions and marks the latest.
- **v{version}+{build}/package.yaml**: Full package definition for a specific version.

## Implementation Patterns (Original)

### GitHub Direct Reference Pattern (Original)
Package definitions use GitHub raw URLs to directly reference original files, avoiding duplication:
```yaml
# For manifest-based packages (Shiori)
manifests:
  - url: https://raw.githubusercontent.com/pkhsu/glasskube-package-test/main/apps/shiori/namespace.yaml
  - url: https://raw.githubusercontent.com/pkhsu/glasskube-package-test/main/apps/shiori/deployment.yaml
  # ...

# For Helm-based packages (Sample Web App)
helm:
  chartName: eap-distr-simulator
  chartVersion: 0.1.0
  repositoryUrl: https://raw.githubusercontent.com/pkhsu/glasskube-package-test/main/apps/sample-web-app/chart/
```

### Value Definition Pattern (Original)
Configuration parameters use target definitions to patch specific parts of manifests or charts:
```yaml
valueDefinitions:
  hostname:
    metadata:
      description: "Hostname for accessing the application..."
    type: text
    defaultValue: "example.com"
    targets:
      - manifests:
          - selector: "kind=Ingress,name=shiori"
            patch:
              op: replace
              path: /spec/rules/0/host
```

### Package Repository Access Pattern (Original)
The package repository is accessed directly via GitHub raw URLs, requiring no local server:
```bash
# Add GitHub-based package repository
glasskube repo add github-repo https://raw.githubusercontent.com/pkhsu/glasskube-package-test/main/glasskube-packages/packages
```

## Critical Implementation Paths (Original)

1.  **Package Definition → GitHub Raw Files**: Package definitions must correctly reference files in the `apps/` directory on GitHub.
2.  **GitHub URLs → Package Files**: GitHub raw URLs must be publicly accessible and point to the correct branch.
3.  **Glasskube CLI → Package Repository**: Glasskube CLI must be able to access the package repository on GitHub via HTTPS.
4.  **Glasskube CLI/GUI → K8s**: Glasskube tools deploy applications to the Kubernetes cluster.

## Critical Implementation Paths (Expanded for UADOP)

1.  **Platform Operator -> UADOP (Distr Hub)**: Secure and reliable API/UI for application and deployment management.
2.  **UADOP (Distr Hub) -> Customer K8s Clusters**: Robust and secure mechanism for distributing and applying application packages and configurations. This includes managing credentials or service accounts for customer cluster access.
3.  **eBPF Collectors (in Customer/Vendor K8s) -> UADOP (EAP via Telemetry Pipeline)**: Efficient and reliable telemetry data pipeline. This includes:
    *   Deployment and configuration of collectors (Odigos, Beyla).
    *   Deployment and configuration of telemetry pipeline components (Grafana Alloy/OTel Collector).
    *   Optional Kafka integration: Setup and management of Kafka topics and consumer groups by EAP components.
    *   Network connectivity and security (mTLS, authentication) for data transmission from edge clusters to the central EAP.
4.  **UADOP (EAP Data Stores) -> UADOP (Grafana GUI)**: Performant query and visualization of potentially large volumes of multi-cluster observability data.
5.  **Scalability of UADOP Components**: Both Distr Hub and the EAP (Loki, Tempo, Mimir, Grafana, Kafka) must be designed to scale to handle a growing number of customer clusters, applications, and telemetry data volume.
6.  **Multi-Tenancy (Consideration)**: If `Customer K8s Clusters` belong to different tenants, UADOP needs to ensure data isolation and access control within the EAP and potentially within the Distr Hub.
