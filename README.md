```text
 ██████╗ ██╗  ██╗███████╗███████╗
██╔═████╗╚██╗██╔╝██╔════╝██╔════╝
██║██╔██║ ╚███╔╝ █████╗  █████╗
████╔╝██║ ██╔██╗ ██╔══╝  ██╔══╝
╚██████╔╝██╔╝ ██╗██║     ██║
 ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝
```

# 0xff-AuDHD

**AI Engineering Operating System**

Engineering principles, decision frameworks, and behavioral rules that teach AI assistants to collaborate like experienced software engineers.

- Status: Active Development
- Version: v0.1.0
- License: MIT

[![Release](https://img.shields.io/github/v/tag/sumit0xff/0xff-AuDHD?label=release)](https://github.com/sumit0xff/0xff-AuDHD/tags)
[![License](https://img.shields.io/github/license/sumit0xff/0xff-AuDHD)](LICENSE)
[![Stars](https://img.shields.io/github/stars/sumit0xff/0xff-AuDHD?style=flat)](https://github.com/sumit0xff/0xff-AuDHD/stargazers)
[![Forks](https://img.shields.io/github/forks/sumit0xff/0xff-AuDHD?style=flat)](https://github.com/sumit0xff/0xff-AuDHD/forks)
[![Issues](https://img.shields.io/github/issues/sumit0xff/0xff-AuDHD)](https://github.com/sumit0xff/0xff-AuDHD/issues)
[![Last Commit](https://img.shields.io/github/last-commit/sumit0xff/0xff-AuDHD)](https://github.com/sumit0xff/0xff-AuDHD/commits/main)

---

## Why This Project Exists

AI assistants often overengineer simple work, change code before understanding it, or take control away from the developer. 0xff-AuDHD gives them a practical engineering standard: understand first, keep changes focused, and prefer simple solutions with clear value.

## Who Is This For?

- Developers
- Students
- Open source contributors
- Freelancers
- Anyone tired of AI overengineering simple problems

---

## What Is 0xff-AuDHD?

0xff-AuDHD helps you give an AI assistant a consistent way to approach engineering work.

An **AI Engineering Operating System** is a shared set of rules for how an AI should plan, change, explain, and review software. It keeps the developer as the project owner and the AI as a collaborator.

---

## Quick Start (5 Minutes)

### 1. Clone the repository

**Why:** This downloads 0xff-AuDHD to your computer.

```bash
git clone https://github.com/sumit0xff/0xff-AuDHD.git
cd 0xff-AuDHD
```

### 2. Read the skill

**Why:** `SKILL.md` defines the engineering behavior for your AI assistant.

```bash
cat SKILL.md
```

### 3. Use the skill with your AI assistant

**Why:** Provide the skill and relevant project context before requesting work.

See the platform-neutral [Usage Guide](docs/usage.md).

---

## Supported AI Platforms

| Platform | Status |
| --- | --- |
| ChatGPT | Supported |
| Claude | Supported |
| Codex | Supported |
| Cursor | Supported |
| Gemini | Supported |
| Antigravity | Supported |

Platform integrations may differ, but the engineering philosophy remains the same.

---

## Repository Structure

| Path | Responsibility |
| --- | --- |
| `SKILL.md` | Executable behavior specification for AI assistants. |
| `docs/` | Philosophy, usage, installation, and roadmap documentation. |
| `rules/` | Rules that support the philosophy and skill. |
| `examples/` | Focused examples of applying 0xff-AuDHD. |
| `tests/` | Validation artifacts for documented behavior. |
| `integrations/` | Materials for supported AI platforms. |
| `.github/` | GitHub-specific repository configuration. |
| `CONTRIBUTING.md` | Contribution requirements and standards. |
| `CHANGELOG.md` | Version history. |

---

## Core Philosophy

The philosophy is the foundation of every behavior in this repository. Read the complete [Philosophy](docs/philosophy.md).

<details>
<summary>View the four laws</summary>

1. **Understand Before Changing** — Understand the existing implementation before changing it.
2. **Minimize Unnecessary Complexity** — Prefer simple solutions with clear value.
3. **Complexity Must Be Earned** — Add complexity only when the software truly requires it.
4. **Teach Through Building** — Teach while solving the current problem.

</details>

---

## Before / After

**Task:** Add email validation to an existing signup form.

### Typical AI response

> “I’ll add a validation service, shared schema layer, reusable form hooks, and several new files.”

### 0xff-AuDHD response

> “I’ll inspect the existing signup validation first. If a suitable function exists, I’ll add the smallest email check there, test the form, and only extract shared code if it is needed.”

---

## Roadmap

| Version | Focus | Status |
| --- | --- | --- |
| v0.1 | Foundation: philosophy, SKILL, and documentation | Complete |
| v0.2 | Decision Engine, AI Smells, Context Detection, and Framework Rules | Planned |
| v0.3 | Integrations, benchmarks, validation, and community contributions | Planned |

---

## FAQ

<details>
<summary>Is this a prompt?</summary>

No. It is a set of engineering principles, decision frameworks, and behavioral rules.

</details>

<details>
<summary>Is this only for AuDHD?</summary>

No. It is designed for developers using the supported AI platforms.

</details>

<details>
<summary>Can I use it with ChatGPT?</summary>

Yes. Follow the shared workflow in the [Usage Guide](docs/usage.md).

</details>

<details>
<summary>Can I contribute?</summary>

Yes. Read [CONTRIBUTING.md](CONTRIBUTING.md) before contributing.

</details>

<details>
<summary>Why is it open source?</summary>

The project is public so its philosophy, rules, and direction can be inspected and improved through contributions.

</details>

---

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before contributing.

## License

This project is licensed under the [MIT License](LICENSE).

---

Built for developers who value clarity over complexity.
