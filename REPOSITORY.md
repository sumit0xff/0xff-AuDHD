# 0xff Repository Structure

This document outlines the final directory structure and architectural boundaries for the **0xff** project. It is designed to be a scalable, maintainable TypeScript repository published as an npm package.

---

## Directory Tree

```text
/
├── bin/
│   └── 0xff.js
├── src/
│   ├── commands/
│   ├── core/
│   ├── providers/
│   ├── rules/
│   ├── plugins/
│   ├── utils/
│   ├── types/
│   └── index.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
├── examples/
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── jest.config.js
├── package.json
├── tsconfig.json
├── PRODUCT.md
├── ARCHITECTURE.md
├── CLI.md
└── REPOSITORY.md
```

---

## Folder Explanations

### `bin/`
- **Purpose:** Houses the executable entry point for the npm package.
- **What belongs there:** Only a tiny wrapper script (`0xff.js`) containing the Unix shebang `#!/usr/bin/env node` that imports the main CLI logic from `src/index.ts` (or the compiled output).
- **What should NEVER be placed there:** Business logic, command implementations, or configuration parsing.

### `src/commands/`
- **Purpose:** Implements the terminal interfaces for the CLI commands.
- **What belongs there:** One file per command (e.g., `init.ts`, `think.ts`). These files parse options, handle UI output (spinners, colors), and delegate the heavy lifting to `src/core/`.
- **What should NEVER be placed there:** Direct API calls to LLMs, raw file system writing logic, or complex AST parsing.

### `src/core/`
- **Purpose:** The brain of the toolkit. Contains the Context Engine, Rules Engine, and Prompt Engine.
- **What belongs there:** The agnostic business logic that coordinates loading rules, parsing the project structure, generating meta-prompts, and running the Analyzer.
- **What should NEVER be placed there:** Terminal UI code, `console.log` statements, or model-specific logic (e.g., no OpenAI-specific headers).

### `src/providers/`
- **Purpose:** Contains the adapters for external AI LLMs.
- **What belongs there:** The base `IProvider` interface and implementations like `OpenAIProvider.ts`, `AnthropicProvider.ts`, and `LocalProvider.ts`.
- **What should NEVER be placed there:** Any knowledge of the CLI, prompt compilation logic, or terminal output styling.

### `src/rules/`
- **Purpose:** The canonical collection of default 0xff principles.
- **What belongs there:** Static `.json` schemas or `.ts` definitions representing the core constraints (e.g., "Surgical Precision", "Understand Before Emitting").
- **What should NEVER be placed there:** Dynamic execution logic or engine orchestration.

### `src/plugins/`
- **Purpose:** Native extensions to the 0xff ecosystem.
- **What belongs there:** Base classes for creating custom plugins, and any officially bundled plugins (e.g., a React-specific contextualizer).
- **What should NEVER be placed there:** Core routing logic or generic file utilities.

### `src/utils/`
- **Purpose:** Pure, reusable, stateless functions.
- **What belongs there:** Generic helpers like file I/O wrappers, string formatters, and environment variable loaders.
- **What should NEVER be placed there:** State, side-effects that mutate global config, or imports from `core/` or `commands/`.

### `src/types/`
- **Purpose:** TypeScript interface and type definitions.
- **What belongs there:** Global types (e.g., `ICommand`, `IProvider`, `0xffConfig`).
- **What should NEVER be placed there:** Implementation code (e.g., classes or functions).

### `tests/`
- **Purpose:** Quality assurance.
- **What belongs there:** Unit tests (mocking everything), integration tests (testing modules together), and E2E tests (testing the compiled CLI against dummy projects).
- **What should NEVER be placed there:** Source code intended for production.

### `docs/` & `examples/`
- **Purpose:** Documentation and usage examples for users and contributors.
- **What belongs there:** Markdown files, API references, and sample `.0xff/config.json` configurations.
- **What should NEVER be placed there:** Source code or build artifacts.

---

## Major File Explanations

### `src/index.ts`
- **Why it exists:** It is the primary router for the CLI application. It wires up the command-line arguments to the specific files in `src/commands/`.
- **When it should change:** Only when a brand new top-level command is added to the CLI.
- **Who depends on it:** The `bin/0xff.js` executable script.

### `package.json`
- **Why it exists:** Defines the npm package, dependencies, and build scripts.
- **When it should change:** When dependencies are added/updated, or when scripts/version numbers change.
- **Who depends on it:** npm, the TypeScript compiler, and end users installing the tool.

### `tsconfig.json`
- **Why it exists:** Configures how TypeScript compiles the source code.
- **When it should change:** Rarely. Only if upgrading TypeScript versions requires new strictness flags or module resolutions.
- **Who depends on it:** The TypeScript compiler (`tsc`) and the IDE language server.

---

## Architectural Boundaries

To ensure 0xff remains stable and modular as it grows, the following strict dependency graph must be adhered to:

- **`commands/`** 
  - **May call:** `core/`, `utils/`, `types/`
  - **May NOT call:** `providers/` (commands shouldn't care how an API request is made).
  
- **`providers/`** 
  - **May call:** `utils/`, `types/`
  - **May NOT call:** `commands/`, `core/`, or `rules/`. Providers must remain blind "dumb pipes" that only know how to send text and receive text.
  
- **`core/`** 
  - **May call:** `providers/` (via abstract interfaces), `rules/`, `utils/`, `types/`.
  - **May NOT call:** `commands/`. Core logic must remain completely independent of the CLI so it can theoretically be used in a web server or desktop app.

- **`rules/`**
  - **May call:** `types/`.
  - **May NOT call:** Anything else. Rules are static data definitions.

- **`utils/`**
  - **May call:** Built-in Node modules (`fs`, `path`).
  - **May NOT call:** Any 0xff domain logic (`core/`, `commands/`, `providers/`).

---

## Repository Rules

1. **Never duplicate business logic.** If two commands need to bundle a project context, that logic must live in the Context Engine within `core/`, never in the command files.
2. **Every command lives in its own file.** Do not pile multiple CLI commands into a massive switch statement inside `index.ts`.
3. **Providers are replaceable.** Any provider (OpenAI, Anthropic) must implement exactly the same `IProvider` interface. The `core/` must never check if a provider is "openai" to run specific logic.
4. **Utilities must not import from higher modules.** A utility is a pure function. It must not depend on commands or core orchestrators.
5. **Circular dependencies are forbidden.** Code must flow downward. `commands` -> `core` -> `providers` -> `utils`. If module A imports module B, module B cannot import module A.
6. **No stateful singletons.** Avoid global state. Pass configurations and options dynamically to ensure testability and prevent race conditions.
