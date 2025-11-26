# Agentic Coding Guidelines

This document serves as the comprehensive guide for the AI Agent's operating procedures, synthesizing the core rules, memory management strategies, and git conventions defined in this project.

## Core Operating Modes

The Agent operates in two distinct modes to ensure safety and alignment:

### 1. Plan Mode
- **Purpose**: Gather information, understand requirements, and design a solution.
- **Behavior**:
    - The Agent will **NOT** make changes to the codebase.
    - It will output `# Mode: PLAN` at the start of responses.
    - It will present a full updated plan in every response.
    - It stays in Plan Mode until the user explicitly approves the plan or types `ACT`.

### 2. Act Mode
- **Purpose**: Execute the approved plan and modify the codebase.
- **Behavior**:
    - The Agent will output `# Mode: ACT` at the start of responses.
    - It performs the necessary code edits, file creations, and command executions.
    - It returns to Plan Mode after every response or if the user types `PLAN`.

---

## Memory Bank

The Agent maintains a "Memory Bank" to preserve context across sessions. It **MUST** read all Memory Bank files at the start of every task.

### Structure
The Memory Bank is located in `.cursor/rules/` (or a dedicated `memory-bank/` directory if configured) and consists of:

1.  **`projectbrief.md`**: Core requirements and goals.
2.  **`productContext.md`**: Problem statement, user experience, and "why".
3.  **`activeContext.md`**: Current focus, recent changes, next steps, and active decisions.
4.  **`systemPatterns.md`**: Architecture, design patterns, and component relationships.
5.  **`techContext.md`**: Tech stack, dependencies, and constraints.
6.  **`progress.md`**: Status, known issues, and what's left to build.

### Workflows

#### Plan Mode Workflow
1.  **Read Memory Bank**: Establish context.
2.  **Check Files**: Are they complete?
    - *No*: Create a plan and document it.
    - *Yes*: Verify context, develop strategy, and present approach.

#### Act Mode Workflow
1.  **Check Memory Bank**: Refresh context.
2.  **Update Documentation**: Update Memory Bank files (especially `activeContext.md` and `progress.md`) before or during execution.
3.  **Execute Task**: Write code.
4.  **Document Changes**: Finalize documentation.

### Update Rules
- Updates occur when discovering new patterns, implementing changes, or upon user request ("update memory bank").
- **Critical**: `activeContext.md` and `progress.md` must be kept up-to-date to track the current state.

---

## Git Conventions

Commit messages must follow the Conventional Commits specification.

### Format
```
<type>(<optional scope>): <description>

<optional body>

<optional footer>
```

### Types
- **feat**: New feature.
- **fix**: Bug fix.
- **docs**: Documentation only.
- **style**: Formatting, white-space (no code change).
- **refactor**: Code change that is neither a fix nor a feature.
- **perf**: Performance improvement.
- **test**: Adding or correcting tests.
- **build**: Build system or dependencies.
- **ci**: CI configuration.
- **chore**: Other changes (no src/test modification).
- **revert**: Revert a commit.

### Guidelines
- **Description**: Imperative, present tense ("change" not "changed"), no period at end, max 50 chars.
- **Body**: Motivation, contrast with previous behavior.
- **Footer**: References (e.g., `Fixes #123`), Breaking Changes (`BREAKING CHANGE:`).
