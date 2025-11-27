# Edge Facility Demo Walkthrough

This document summarizes the work done to create a fully automated demo environment for the `edge-facility` Glasskube package.

## 🎯 Objective
Establish a fully automated CI/CD pipeline using GitHub Actions for the "edge-facility" package, ensuring the application's UI prominently displays its version, and resolving deployment issues to enable a smooth demo recording.

## 🏗️ Achievements

### 1. Automated CI/CD Pipeline
We implemented a robust GitHub Actions workflow (`.github/workflows/ci.yml`) that triggers on Git tags (e.g., `v1.0.x`).
-   **Docker Build**: Builds the Node.js application and pushes the image to **GitHub Container Registry (GHCR)**.
-   **Helm Packaging**: Packages the Helm chart (`.tgz`) and generates/updates the `index.yaml` to create a valid Helm repository hosted on GitHub Raw.
-   **Glasskube Package Management**: Automatically updates `versions.yaml`, `index.yaml`, and creates a new package version directory (e.g., `v1.0.x+1`) with the correct `chartVersion`.
-   **GitOps**: Commits all changes back to the `main` branch, keeping the repository as the single source of truth.

### 2. Enhanced Application UI
The `edge-facility` application (`apps/edge-facility/index.js`) was upgraded to a premium dashboard:
-   **Dynamic Versioning**: Displays the current version (`APP_VERSION`) passed from the Helm chart.
-   **Theming**: Switched from a dark theme to a **clean Light Mode** for better presentation.
-   **Custom Branding**: Added a custom icon and "Powered by Glasskube" footer.

### 3. Demo Automation
Created a helper script `scripts/demo-release.sh` to simplify the release process during the demo:
-   Handles `git pull --rebase` to avoid conflicts.
-   Commits changes.
-   Tags and pushes the release in one command.

### 4. Infrastructure Fixes
-   **Helm Repository**: Solved the "invalid chart reference" error by ensuring `package.yaml` points to a valid Helm repository structure (with `index.yaml` and `.tgz`) instead of raw source files.
-   **Docker Registry**: Migrated from a local registry to GHCR for public accessibility.

## 🔍 Verification Results

| Release | Feature / Change | Status |
| :--- | :--- | :--- |
| **v1.0.6** | Initial CI automation fix (Helm packaging) | ✅ Success |
| **v1.0.7** | Fix chart version mismatch in `package.yaml` | ✅ Success |
| **v1.0.8** | Implement Docker build & push to GHCR | ✅ Success |
| **v1.0.9** | UI Theme update (Light Mode) | ✅ Success |
| **v1.0.10** | Update Package Icon | ✅ Success |
| **v1.0.11** | Update Dashboard Title | ✅ Success |
| **v1.0.12** | Update Footer Text ("Powered by Glasskube") | ✅ Success |

## 🛠️ Key Files
-   [ci.yml](file:///Users/kevinhsu/project/side-project/glasskube-package-test/.github/workflows/ci.yml): The heart of the automation.
-   [demo-release.sh](file:///Users/kevinhsu/project/side-project/glasskube-package-test/scripts/demo-release.sh): The magic wand for the demo.
-   [index.js](file:///Users/kevinhsu/project/side-project/glasskube-package-test/apps/edge-facility/index.js): The application code.
-   [package.yaml](file:///Users/kevinhsu/project/side-project/glasskube-package-test/glasskube-packages/packages/edge-facility/v1.0.0+1/package.yaml): The Glasskube package template.

## 🚀 How to Run (for future reference)
To release a new version:
```bash
./scripts/demo-release.sh <version> "<commit message>"
# Example: ./scripts/demo-release.sh v1.0.13 "feat: new feature"
```
Then wait for the CI pipeline to complete and refresh the Glasskube GUI.
