# 0xff CLI Specification

This document defines the command-line interface for the 0xff AI Engineering Toolkit.

---

## Commands

### `0xff init`
- **Purpose:** Initializes a project for 0xff by generating baseline configuration and rule files.
- **Syntax:** `0xff init [path]`
- **Arguments:** 
  - `path` (Optional): The directory to initialize. Defaults to current directory (`.`).
- **Options:** 
  - `--force`: Overwrite existing configuration files.
  - `--stack <name>`: Specify project stack (e.g., `react`, `rust`) to skip auto-detection.
- **Examples:** 
  - `0xff init`
  - `0xff init ./my-project --stack nextjs`
- **Output:** A success message outlining which files were created.
- **Exit codes:** `0` (Success), `1` (Directory not found), `2` (Config already exists without `--force`).
- **What problem does it solve?** It instantly injects AI guardrails into an unconfigured project so developers don't have to manually write prompt rules.
- **What should it NEVER do?** It should NEVER modify existing source code or application logic.
- **Requires AI?** No.
- **Works offline?** Yes.
- **Files read:** `package.json`, `Cargo.toml`, `go.mod` (to detect stack).
- **Files created:** `.0xff/config.json`, `.0xff/rules/`, `.cursorrules` (or similar IDE rules).

---

### `0xff think`
- **Purpose:** Forces the AI to generate a structured implementation plan without writing the actual code.
- **Syntax:** `0xff think <prompt>`
- **Arguments:** 
  - `prompt` (Required): The natural language instruction (e.g., "Add user authentication").
- **Options:** 
  - `--file <path>`: Focus the thought process on a specific file.
- **Examples:** 
  - `0xff think "Refactor the database connection"`
- **Output:** A markdown-formatted execution plan and checklist.
- **Exit codes:** `0` (Success), `1` (Network error/API failure).
- **What problem does it solve?** Prevents AI from prematurely writing bloated code by enforcing a planning phase that the developer must approve.
- **What should it NEVER do?** It should NEVER write or modify application source code files.
- **Requires AI?** Yes.
- **Works offline?** No (unless using a local LLM provider).
- **Files read:** `.0xff/config.json`, relevant project source files (via Context Engine).
- **Files created:** None (outputs to `stdout`).

---

### `0xff doctor`
- **Purpose:** Diagnoses the health of the 0xff installation and project configuration.
- **Syntax:** `0xff doctor`
- **Arguments:** None.
- **Options:** None.
- **Examples:** 
  - `0xff doctor`
- **Output:** A checklist of system checks (API keys, config validity, IDE rule presence) marked with Pass/Fail.
- **Exit codes:** `0` (All checks passed), `1` (One or more critical checks failed).
- **What problem does it solve?** Helps debug why the AI isn't following rules by verifying that the setup isn't broken or missing environment variables.
- **What should it NEVER do?** It should NEVER auto-fix destructive issues without asking, or leak API keys in the console output.
- **Requires AI?** No.
- **Works offline?** Yes (except for checking external API connectivity).
- **Files read:** `.0xff/config.json`, environment variables, `.cursorrules`.
- **Files created:** None.

---

### `0xff context`
- **Purpose:** Bundles the relevant project structure and files into a token-optimized string for the clipboard.
- **Syntax:** `0xff context`
- **Arguments:** None.
- **Options:** 
  - `--copy`: Automatically copy output to OS clipboard (default behavior).
  - `--out <file>`: Save context payload to a file instead of clipboard.
- **Examples:** 
  - `0xff context`
  - `0xff context --out bundle.txt`
- **Output:** A massive string containing the directory tree and file contents (stripping boilerplate).
- **Exit codes:** `0` (Success), `1` (Failed to access clipboard).
- **What problem does it solve?** Gives developers using web UIs (ChatGPT, Claude) a perfectly formatted, token-efficient dump of their project without manually copying and pasting multiple files.
- **What should it NEVER do?** It should NEVER include secrets, `.env` files, or ignored files like `node_modules`.
- **Requires AI?** No.
- **Works offline?** Yes.
- **Files read:** Project source files, `.gitignore`.
- **Files created:** None (unless `--out` is specified).

---

### `0xff review`
- **Purpose:** Audits uncommitted changes or specific files against 0xff engineering principles.
- **Syntax:** `0xff review [path]`
- **Arguments:** 
  - `path` (Optional): specific file or directory to review. Defaults to the uncommitted git diff.
- **Options:** 
  - `--strict`: Fail the command (exit 1) on any minor rule violation.
- **Examples:** 
  - `0xff review`
  - `0xff review src/utils.js`
- **Output:** A list of "AI Smells" (e.g., duplicated logic, unnecessary abstractions).
- **Exit codes:** `0` (Passed), `1` (Violations found).
- **What problem does it solve?** Acts as a highly opinionated linter that catches bad AI-generated code before it gets committed.
- **What should it NEVER do?** It should NEVER format or rewrite the code automatically.
- **Requires AI?** Yes (for complex heuristic evaluation via Provider), though some AST checks are local.
- **Works offline?** Partially (AST parsing works offline; semantic AI review requires network).
- **Files read:** Local source files, `.git` diffs, `.0xff/rules/`.
- **Files created:** None.

---

### `0xff clean`
- **Purpose:** Scans for and optionally removes common AI-generated detritus.
- **Syntax:** `0xff clean`
- **Arguments:** None.
- **Options:** 
  - `--dry-run`: List files to be cleaned without deleting them.
- **Examples:** 
  - `0xff clean --dry-run`
- **Output:** A list of deleted or cleaned items.
- **Exit codes:** `0` (Success).
- **What problem does it solve?** Cleans up unused hallucinated imports, leftover `// TODO: AI generated` comments, and orphaned temporary files.
- **What should it NEVER do?** It should NEVER delete developer-written logic or unversioned files without explicit confirmation.
- **Requires AI?** No (uses AST parsing).
- **Works offline?** Yes.
- **Files read:** Project source files.
- **Files created:** None (only modifies/deletes).

---

### `0xff version`
- **Purpose:** Displays the installed version of the 0xff CLI.
- **Syntax:** `0xff version` (or `0xff -v`)
- **Arguments:** None.
- **Options:** None.
- **Examples:** 
  - `0xff version`
- **Output:** The semantic version string (e.g., `0xff v1.0.4`).
- **Exit codes:** `0` (Success).
- **What problem does it solve?** Verifies installation and checks for debugging purposes.
- **What should it NEVER do?** Make network requests.
- **Requires AI?** No.
- **Works offline?** Yes.
- **Files read:** None.
- **Files created:** None.

---

### `0xff help`
- **Purpose:** Displays usage information and documentation for commands.
- **Syntax:** `0xff help [command]`
- **Arguments:** 
  - `command` (Optional): The command to get help for.
- **Options:** None.
- **Examples:** 
  - `0xff help`
  - `0xff help think`
- **Output:** Formatted terminal help text.
- **Exit codes:** `0` (Success).
- **What problem does it solve?** Provides immediate, localized documentation.
- **What should it NEVER do?** Open an external browser by default.
- **Requires AI?** No.
- **Works offline?** Yes.
- **Files read:** None.
- **Files created:** None.

---

## Global Flags

- `--help`, `-h`: Shows the help menu for the current command.
- `--version`, `-v`: Shows the CLI version.
- `--verbose`: Enables debug-level logging (useful for tracing API requests or file reads).
- `--json`: Formats all stdout output as parseable JSON (ideal for CI/CD integration).
- `--yes`, `-y`: Bypasses all interactive confirmation prompts (e.g., assuming "yes" when `0xff clean` asks to delete files).

---

## Error Handling

0xff uses strict formatting for terminal messaging to ensure clarity.

- **Errors:** 
  - Formatted in **Red**.
  - Must display a clear reason and an actionable next step.
  - Example: `[ERROR] Missing API Key. Run 'export 0XFF_API_KEY=...' or edit .0xff/config.json.`
- **Warnings:**
  - Formatted in **Yellow**.
  - Highlights non-fatal issues (e.g., skipping a file because it's too large).
  - Example: `[WARN] Context limit reached. Skipping 3 files in 'vendor/'.`
- **Success Messages:**
  - Formatted in **Green**.
  - Brief and to the point.
  - Example: `[OK] Initialization complete. AI behavior is now locked down.`

---

## CLI Design Principles

- **Fast startup:** The CLI must boot and respond in under 50ms for local commands (like `help` or `version`).
- **Zero configuration by default:** Running `0xff init` must work flawlessly without requiring the user to manually answer 10 questions about their stack.
- **Human-readable output:** Default terminal output should use colors, spacing, and tables to be easily readable by developers.
- **Machine-readable JSON when requested:** Adding the `--json` flag suppresses all human-readable fluff and strictly outputs JSON for programmatic consumption.
- **Never modify files without explicit user intent:** Commands that alter the codebase (like `build` or `clean`) must run safely, offer `--dry-run` modes, and require explicit approval.
