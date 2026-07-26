# 0xff Rules Engine

The Rules Engine is the heart of the 0xff AI Engineering Toolkit. It acts as the immutable conscience of the AI, ensuring that every line of generated code aligns with strict, senior-level engineering standards.

---

## Purpose

### What problems does it solve?
Left to their own devices, AI coding assistants optimize for "completing the prompt" rather than "engineering the best solution." They hallucinate dependencies, duplicate logic instead of finding existing utilities, and apply enterprise architecture to simple scripts. 

### Why does it exist?
The Rules Engine exists to provide a deterministic, interceptive layer that guides engineering decisions *before* any AI generates code. It prevents AI-induced technical debt by validating AI-proposed plans against a strict set of principles.

---

## Rule Categories

To maintain comprehensive coverage over software architecture, rules are divided into the following categories:

- **Architecture:** Design patterns, boundaries, and system structure.
- **Reuse:** Leveraging existing code, utilities, and components.
- **Complexity:** Keeping abstractions and logic as simple as possible.
- **Dependencies:** Managing third-party packages and external bloat.
- **State Management:** How data flows and persists within the application.
- **Naming:** Consistency and clarity in variables, functions, and files.
- **Imports:** Managing module relationships and preventing circular dependencies.
- **Components:** UI/Business logic modularity.
- **APIs:** Interface design, endpoints, and data contracts.
- **Performance:** Resource utilization, memory, and speed.
- **Security:** Input validation, data exposure, and safe access.
- **Testing:** Testability, coverage, and mocking strategies.
- **Documentation:** Inline comments and architectural context.

---

## Rule Format

Rules are defined in a simple, human-readable JSON or YAML format that is easy for both the 0xff Core Engine and the LLM to parse.

```json
{
  "id": "ARCH-001",
  "category": "Architecture",
  "title": "Avoid Unnecessary Abstractions",
  "description": "Do not introduce a new design pattern or abstraction layer unless the immediate problem requires it.",
  "severity": "error",
  "rationale": "Premature abstraction makes code harder to read, harder to debug, and harder for future developers to maintain.",
  "suggestedFix": "Inline the logic directly into the calling function. Only extract it once it is used in three or more distinct places."
}
```

- **ID:** Unique identifier for telemetry and overrides.
- **Title:** Short, memorable name.
- **Description:** The exact constraint the AI must follow.
- **Severity:** `info` (guidance), `warning` (flagged in review), `error` (blocks generation/commits).
- **Rationale:** Explains *why* the rule exists to help the AI contextualize it.
- **Suggested Fix:** How the AI should correct its behavior if it violates the rule.

---

## Rule Execution

### How Rules Are Evaluated
1. **Plan Phase (`0xff think`):** The LLM is provided the rules as part of the meta-prompt. The LLM must output a JSON or Markdown plan explaining how its proposed solution adheres to the active rules.
2. **Review Phase (`0xff review`):** Uncommitted code (or AI diffs) are parsed via AST (Abstract Syntax Tree) and passed to the Analyzer, which cross-references the code structure against the active rules.

### How Conflicts Are Handled
Rules have a strict hierarchy:
1. **Local `.0xff/rules/` overrides:** Highest priority.
2. **Project `.0xff/config.json` rules:** Medium priority.
3. **Core 0xff Built-in rules:** Lowest priority.
If a local rule explicitly contradicts a built-in rule, the local rule wins.

### How Results Are Reported
When an AI generates code that violates a rule, the Rules Engine halts execution and outputs a strictly formatted terminal message (Red for errors, Yellow for warnings) citing the `Rule ID`, the exact line of the violation, and the `suggestedFix`. The AI is then prompted to auto-correct the violation before the developer sees the final output.

---

## Built-in Rules

The engine ships with these core rules enabled by default:

### Reuse & Complexity
1. **REUSE-001 (Do Not Duplicate):** Never duplicate business logic. Search the project for existing utilities before writing new ones.
2. **REUSE-002 (Prefer Existing Components):** If a UI component similar to the requested one exists, extend it with props instead of creating a new file.
3. **COMP-001 (Avoid Unnecessary Abstractions):** Do not create classes, factories, or services for logic that can be handled by a simple pure function.
4. **COMP-002 (Single Responsibility):** Keep files focused on a single responsibility.
5. **COMP-003 (Surgical Editing):** When modifying a file, change the absolute minimum number of lines required. Do not reformat unrelated code.

### Architecture & Dependencies
6. **DEP-001 (Justify Dependencies):** Do not introduce third-party packages without explicit user permission. Always prefer standard library solutions first.
7. **ARCH-001 (Flat Hierarchy):** Avoid deeply nested directory structures. Keep folders as flat as reasonably possible.
8. **ARCH-002 (Edit Before Rewrite):** Never rewrite a function from scratch if it can be fixed with a targeted edit.
9. **STATE-001 (Minimize Global State):** Keep state as close to where it is used as possible. Do not put local state into global stores.

### Code Quality & Naming
10. **NAME-001 (Descriptive Boolean):** Prefix boolean variables with `is`, `has`, or `should`.
11. **NAME-002 (No Ambiguous Abbreviations):** Do not use single-letter variables unless used as standard loop iterators (`i`, `j`).
12. **DOCS-001 (Explain the Why):** Comments must explain *why* something is done, not *what* is done (the code explains the what).
13. **DOCS-002 (No Hallucinated Comments):** Do not add `// TODO: AI generated` or verbose, apologetic conversational comments in source code.

### Security & Performance
14. **SEC-001 (No Hardcoded Secrets):** Never hardcode API keys, passwords, or tokens. Always use environment variables.
15. **SEC-002 (Validate Input):** Always validate external input at the system boundaries before processing it.
16. **PERF-001 (Measure Before Optimizing):** Do not implement complex caching or memoization unless a performance bottleneck is explicitly stated.
17. **PERF-002 (O(n) Consideration):** Avoid nested loops over large datasets where an O(1) lookup map could be used.

### Imports & Testing
18. **IMP-001 (No Circular Dependencies):** Do not import from a file that directly or indirectly imports the current file.
19. **TEST-001 (Test Behavior, Not Implementation):** Write tests that verify inputs and outputs, not the internal private methods of a class.
20. **TEST-002 (Avoid Brittle Mocks):** Mock external boundaries (network, file system) but avoid mocking internal application logic.

---

## Extensibility

0xff is designed to adapt to any team's specific engineering culture.

- **Disable Rules:** Users can disable any built-in rule by adding its ID to the `disabledRules` array in `.0xff/config.json`.
  ```json
  { "rules": { "disabledRules": ["PERF-001", "DOCS-001"] } }
  ```
- **Override Rules:** Users can change the severity of a rule (e.g., turning a `warning` into an `error`) in the config.
- **Custom Rules:** Users can define project-specific rules by dropping new JSON rule files into the `.0xff/rules/` directory. The Rules Engine automatically parses these on startup and merges them into the meta-prompt payload.

---

## Principles

To maintain trust with the developer, the Rules Engine operates under these non-negotiable principles:

- **Deterministic:** The same rule applied to the same code must always yield the same validation result.
- **Transparent:** The CLI must always cite exactly which rule was broken and why.
- **Fast:** Rule evaluation (via AST or Regex fallback) must execute in milliseconds, never blocking the developer's flow.
- **Explainable:** Every rule must have a rationale so developers (and AI) understand the "why" behind the constraint.
- **Framework Agnostic:** Core rules apply universally—whether you are writing Python, Go, or TypeScript. Framework-specific rules belong in plugins.
