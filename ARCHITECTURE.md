# 0xff Technical Architecture

## Philosophy

The architecture of 0xff is built around a singular philosophy: **Modularity over Coupling.**
Because the landscape of AI models, IDEs, and local tooling shifts constantly, 0xff must be resilient to external changes. It achieves this by decoupling the core engineering constraints (the rules) from the specific model providers (the engines) and the project environments (the contexts). The architecture ensures that whether you are using GPT-4 in a Node.js project today, or a local Llama 3 in a Rust project tomorrow, the 0xff execution flow remains identical.

## High-Level Architecture

```text
       User
        │
        ▼
   CLI Interface (Command Router)
        │
        ▼
   Core Engine (Orchestrator)
        │
        ├── Context Engine     (Builds AST/Directory graphs, strips boilerplate)
        ├── Rules Engine       (Loads and enforces .0xff/rules)
        ├── Prompt Engine      (Compiles context + rules + user intent into payloads)
        ├── Analyzer           (Parses AI output against rules)
        ├── Formatter          (Cleans and diffs output)
        └── Providers          (LLM Interface Layer)
               ├── OpenAI
               ├── Anthropic
               ├── Gemini
               └── Local Models (Ollama/llama.cpp)
```

## Modules

### CLI Interface
- **Responsibility:** Parses user arguments, handles terminal UI (spinners, colors), and routes commands to the Core Engine.
- **Inputs:** Terminal arguments (e.g., `0xff think "Add auth"`), flags.
- **Outputs:** Formatted terminal stdout, exit codes.
- **Dependencies:** Standard CLI parsing library (e.g., Commander, Clap).

### Core Engine
- **Responsibility:** The orchestrator. It receives the command, coordinates between engines, and manages the execution lifecycle.
- **Inputs:** Parsed commands and options.
- **Outputs:** Final executed actions (writing files, terminal output).
- **Dependencies:** All internal engines.

### Context Engine
- **Responsibility:** Analyzes the target codebase. It generates a token-efficient snapshot of the project structure, recent git diffs, and relevant file contents while ignoring boilerplate (e.g., `node_modules`, lockfiles).
- **Inputs:** Path to project, `.gitignore`.
- **Outputs:** A structured JSON object representing the working context.
- **Dependencies:** File system IO, Git CLI interface.

### Rules Engine
- **Responsibility:** Loads, validates, and merges 0xff principles with any project-specific rules defined in `.0xff/config.json`.
- **Inputs:** Global 0xff rules, local project rules.
- **Outputs:** An array of enforced constraints.
- **Dependencies:** None.

### Prompt Engine
- **Responsibility:** Takes the output from the Context Engine and Rules Engine, and compiles them into a provider-agnostic, token-optimized meta-prompt.
- **Inputs:** Context JSON, Rules Array, User Prompt.
- **Outputs:** Standardized prompt payload.
- **Dependencies:** Tokenizer (for estimating payload size).

### Analyzer
- **Responsibility:** Inspects AI-generated code or existing project code for "AI Smells" and violations of the Rules Engine.
- **Inputs:** Code strings, git diffs.
- **Outputs:** Violation reports (warnings, errors).
- **Dependencies:** Tree-sitter (for syntax/AST analysis).

### Providers
- **Responsibility:** An abstraction layer that translates standard 0xff payloads into API-specific requests for various LLMs.
- **Inputs:** Standardized prompt payload.
- **Outputs:** Raw LLM text response.
- **Dependencies:** Provider SDKs (OpenAI, Anthropic, etc.) or HTTP client.

## Plugin System

0xff is designed to be highly extensible without bloating the core binary.

- **How Commands Are Extended:** Commands are registered via a standard plugin interface. A plugin simply exports an `execute()` function that the CLI router can mount dynamically.
- **How Providers Are Added:** Providers must implement a standard `IProvider` interface (`send(payload)`, `stream(payload)`). To add a new AI model, a developer writes a small wrapper class that adheres to `IProvider` and registers it in the config.
- **How Rules Are Loaded:** Rules are essentially small validator functions or text schemas. The Rules Engine dynamically imports `.js` or `.json` rules from the `.0xff/rules/` directory at runtime.

## Configuration

The configuration lives at `.0xff/config.json` at the root of the user's project.

```json
{
  "version": "1.0",
  "provider": {
    "default": "anthropic",
    "fallback": "openai",
    "model": "claude-3-5-sonnet"
  },
  "context": {
    "ignore": ["*.lock", "dist/", "coverage/"],
    "maxTokens": 32000
  },
  "rules": {
    "strictMode": true,
    "custom": [
      "always use typescript",
      "never use relative imports"
    ]
  },
  "plugins": [
    "0xff-plugin-react"
  ]
}
```

- **version:** The config schema version.
- **provider:** Defines which LLM handles execution. `default` is the primary, `fallback` is used if the primary is rate-limited.
- **context.ignore:** Files/patterns the Context Engine should never send to the AI.
- **context.maxTokens:** The hard limit for the Context Engine payload size.
- **rules.strictMode:** If true, the Analyzer will block execution/commits if rules are violated.
- **rules.custom:** Project-specific directives injected on top of global 0xff principles.
- **plugins:** Array of community plugins to load on startup.

## Repository Structure

This is the ideal repository tree for the 0xff toolkit source code:

```text
0xff/
├── bin/
│   └── 0xff               # CLI entrypoint executable
├── packages/
│   ├── cli/               # Command routing and terminal UI
│   ├── core/              # Core Engine orchestrator
│   ├── context/           # Context Engine logic
│   ├── rules/             # Global rules definitions
│   ├── prompt/            # Prompt compiler and templates
│   ├── analyzer/          # Code inspection and AST parsing
│   └── providers/         # API wrappers for OpenAI, Claude, etc.
├── plugins/
│   └── (official plugins)
├── docs/                  # Architecture, API, and Usage docs
├── tests/                 # Unit and E2E testing
├── package.json           # Workspace root
└── PRODUCT.md             # Vision and goals
```

## Data Flow

### `0xff think`
1. CLI receives `0xff think [prompt]`.
2. Context Engine bundles project state.
3. Rules Engine loads principles.
4. Prompt Engine constructs a "Planning Phase" prompt payload.
5. Provider sends payload to LLM.
6. Core Engine captures LLM response (markdown plan).
7. Formatter outputs the plan to terminal.

### `0xff doctor`
1. CLI receives `0xff doctor`.
2. Core Engine verifies the presence of `.0xff/config.json`.
3. Rules Engine runs a self-test on local rules.
4. Analyzer scans the `.cursorrules` or `.windsurfrules` files in the project to ensure they aren't conflicting.
5. Formatter prints a health report.

### `0xff review`
1. CLI receives `0xff review`.
2. Context Engine grabs the current uncommitted git diff.
3. Rules Engine loads strict principles.
4. Analyzer parses the diff.
5. Prompt Engine (optionally) asks the Provider to evaluate complex architectural violations.
6. Formatter highlights "AI Smells" or rules broken by the diff.

### `0xff build`
1. CLI receives `0xff build`.
2. Core Engine runs `Context Engine` -> `Rules Engine` -> `Prompt Engine`.
3. Provider executes the prompt.
4. Core Engine receives a unified diff or code blocks.
5. Core Engine applies file changes directly to the local filesystem.

### `0xff context`
1. CLI receives `0xff context`.
2. Context Engine generates the optimized file/tree snapshot.
3. Core Engine bypasses the Provider entirely.
4. Formatter pipes the output directly to the user's OS clipboard.

## Design Decisions

- **Monorepo Structure (`packages/`):** We use a monorepo so that `context` or `analyzer` can be published as standalone NPM packages. Other devs might want to use the 0xff Context Engine in their own tools.
- **Provider Abstraction:** LLM APIs change monthly. Hardcoding OpenAI SDK calls throughout the codebase would cause extreme technical debt. The Provider layer isolates SDK breaking changes.
- **AST Parsing over Regex:** The Analyzer uses Tree-sitter rather than simple Regex to detect AI smells. Regex cannot accurately understand scope or context in a codebase, leading to false positives.
- **Clipboard Output for `context`:** `0xff context` doesn't make API calls because developers often want to manually paste context into a web UI (like ChatGPT) to avoid API costs.

## Future Compatibility

This architecture guarantees forward compatibility with future AI models without requiring core rewrites. 
Because the system is defined by an `IProvider` interface, when a new model (e.g., GPT-5 or Claude 4) is released, the community only needs to write a single new Provider class mapped to the new API endpoint. The Context Engine, Rules Engine, and CLI remain completely untouched. Furthermore, the Prompt Engine uses generic templating so it doesn't rely on model-specific prompt quirks, ensuring 0xff outlives any single LLM generation.
