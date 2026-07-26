# 0xff Product Vision

## Vision

### What is 0xff?
0xff is the definitive open-source AI Engineering Toolkit. It is a lightweight, universal standard and CLI tool designed to enforce rigorous software engineering principles on AI coding assistants. It acts as an abstraction layer between your project and your AI tools, ensuring that LLMs behave like disciplined senior engineers rather than eager, over-engineering junior developers.

### What problem does it solve?
Modern AI coding assistants (Cursor, Copilot, Antigravity, Claude, ChatGPT) are incredibly powerful but fundamentally flawed in their default behavior. They tend to:
- Rewrite entire files when a one-line change is needed.
- Introduce unnecessary abstractions, boilerplate, and new dependencies.
- Plunge into writing code before fully understanding the existing architecture.
- Abstract the developer away from the project, reducing ownership and understanding.

0xff solves this by injecting a strict, universally applicable operating philosophy into any project, constraining the AI to act with precision, minimalism, and intent.

### Who is it for?
0xff is for developers, technical leads, and engineering teams who use AI tools but refuse to sacrifice code quality, maintainability, or architectural integrity. It is for those who want AI as a collaborator, not a dictator.

### Why should someone install it?
You install 0xff to instantly standardize AI behavior across your entire project or organization. With a single command, you guarantee that any AI tool interacting with your repository will respect your architecture, prioritize editing over rewriting, and stop generating bloated, unmaintainable code.

---

## Principles

0xff is governed by a strict set of engineering tenets. These are the rules the toolkit enforces on every AI interaction:

- **Understand Before Emitting:** The AI must read, parse, and comprehend the execution flow before proposing a single line of code.
- **Complexity Must Be Earned:** Never introduce new frameworks, abstractions, or design patterns unless the immediate problem demands it.
- **Surgical Precision:** Edit over rewrite. Modify the absolute minimum number of lines required to solve the problem.
- **Zero Duplication:** Never duplicate logic. If a utility exists, find it and reuse it.
- **Agnostic & Universal:** 0xff does not care if you use React, Rust, or Ruby. It does not care if you use OpenAI, Anthropic, or Gemini. The engineering standard remains absolute.
- **Transparent Execution:** The AI must state its assumptions and clarify its planned changes before executing them.
- **Developer Ownership:** The human remains the architect; the AI is the executor. The AI must never assume architectural authority.
- **Production First:** Generated code must be production-ready, readable, and maintainable by humans six months from now.

---

## Core Features (V1)

V1 focuses entirely on establishing the standard, injecting the rules, and providing basic diagnostic tools.

- **Universal Rule Injection:** Automatically generates `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, and generic system prompts tailored to the project's stack.
- **AI Behavior Linter:** Scans the codebase for common "AI Smells" (e.g., redundant wrapper classes, overly verbose comments, hallucinated imports).
- **Context Bundling:** Intelligently packs the most relevant files (excluding boilerplate) into an optimized text payload to send to web-based LLMs.
- **Zero-Config Setup:** Instantly detects the project's language and framework to tailor the injected AI constraints.

---

## Commands

The 0xff CLI is designed to be fast, minimal, and intuitive.

### `0xff init`
Initializes 0xff in the current repository. It scans the project, detects the stack, and generates the appropriate rule files (e.g., `.cursorrules`) that lock down the AI's behavior to the 0xff standard.

### `0xff context`
Generates an optimized, token-efficient clipboard copy of your current working state. It bundles the relevant files, tree structure, and recent git diffs so you can paste them into ChatGPT or Claude with the 0xff rules attached.

### `0xff think`
Prepares an execution plan. You pass a prompt (e.g., `0xff think "Add email validation"`), and the CLI outputs a strict markdown checklist of what the AI *should* do, forcing the AI to agree on a plan before you let it write code in your IDE.

### `0xff review`
Analyzes a git diff or recent AI-generated code against the 0xff principles. It flags violations like "Unnecessary abstraction added," "Logic duplicated from utils.js," or "Excessive file modifications."

### `0xff doctor`
Runs a diagnostic on your project's AI setup. It checks if your rule files are up to date, if they conflict with other settings, and ensures the 0xff constraints are properly enforced in your environment.

### `0xff clean`
Scans for and removes common AI-generated detritus: orphan files, unused AI-hallucinated imports, and overly verbose AI-generated block comments.

### `0xff upgrade`
Updates the local 0xff rule definitions to the latest version, ensuring your AI constraints evolve as LLMs get smarter (or more erratic).

---

## Non-Goals

To maintain focus, 0xff will **NEVER** become:

- **Not another chatbot:** We will never build a chat interface. We constrain the ones you already use.
- **Not an IDE or code editor:** We integrate with your existing tools; we do not replace them.
- **Not an AI model provider:** We do not host models, wrap APIs, or charge for inference. 
- **Not a development framework:** We will never dictate how you structure your Next.js app or Go server. We only dictate how the *AI* interacts with it.
- **Not an autonomous agent:** 0xff will not run loops in the background to build your app for you. It requires human direction.

---

## Future (V2 & V3)

### V2: Continuous Integration & Telemetry
- **CI/CD Integration:** Run `0xff review` in GitHub Actions to block PRs that contain AI-generated bloat or violate the core principles.
- **Custom Rule Engine:** Allow teams to define their own sub-principles (e.g., `0xff rules add "Always use CSS modules"`) that the AI must follow on top of the 0xff baseline.

### V3: The AI Defense Layer
- **Live IDE Interception (LSP):** A background language server that intercepts AI code generation in real-time within the IDE, squashing bad code before it even renders on the screen.
- **Contextual Memory:** 0xff learns the project architecture over time, automatically correcting the AI when it hallucinates a design pattern that the team rejected months ago.
