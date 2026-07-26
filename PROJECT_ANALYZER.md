# 0xff Project Analyzer

The Project Analyzer is the discovery engine of the 0xff toolkit. It is responsible for deeply understanding the architecture, relationships, and context of a software repository before any AI recommendations or code generation occur. It operates entirely offline, ensuring speed and privacy.

---

## Purpose

To give an AI an instruction without context is to ask for hallucination. AI models often generate redundant utilities or misaligned architectural patterns simply because they don't know what already exists in the project. 

The Project Analyzer exists to solve this context gap. By traversing the repository and building a comprehensive map of the project's state, it enforces the "Understand Before Emitting" principle. When the AI knows exactly what components, services, and databases exist, it can make highly precise, surgical recommendations instead of sprawling rewrites.

---

## Analysis Pipeline

The analyzer runs a highly optimized, multi-pass pipeline over the local filesystem.

```text
Repository
    ↓
File Discovery & Ignoring          (Respects .gitignore, identifies workspaces)
    ↓
Language Detection                 (Parses extensions, infers from config)
    ↓
Dependency Analysis                (Parses package.json, Cargo.toml, go.mod, etc.)
    ↓
Framework & Stack Detection        (Correlates dependencies with file structures)
    ↓
Folder Structure Analysis          (Maps domain boundaries, e.g., src, test, lib)
    ↓
AST Parsing                        (Tree-sitter builds syntax trees for key files)
    ↓
Import Graph Generation            (Maps file-to-file dependencies and circularity)
    ↓
Component & API Discovery          (Identifies React components, Express routes, etc.)
    ↓
Database & State Discovery         (Finds Prisma schema, Redux stores, ORM models)
    ↓
Configuration Discovery            (Finds Dockerfiles, TSConfig, ESLint, CI/CD)
    ↓
Architecture Detection             (Classifies as MVC, Hexagonal, Monolithic, etc.)
    ↓
Reuse Detection                    (Identifies highly imported shared utilities)
    ↓
Duplicate Logic Detection          (Finds structurally similar AST nodes)
    ↓
Project Knowledge Graph            (Final synthesized JSON context)
```

---

## Repository Discovery

Before parsing code, the analyzer must understand the shape of the repository.

- **Source Folders:** Uses heuristics to identify primary code locations (`src/`, `lib/`, `app/`, `cmd/`).
- **Configuration Files:** Scans the root for `.env.example`, `.eslintrc`, `tsconfig.json`, `docker-compose.yml`, etc.
- **Package Managers & Lock Files:** Detects the build system by searching for `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `Cargo.lock`, `go.sum`, `poetry.lock`.
- **Monorepos & Workspaces:** If `lerna.json`, `nx.json`, or a `pnpm-workspace.yaml` is found, the analyzer forks its pipeline to map each package independently while tracking inter-package dependencies.
- **Hidden & Ignored Files:** Strictly parses `.gitignore`, `.0xffignore`, and `.npmignore`. The analyzer will *never* scan `node_modules`, `dist/`, `.git/`, or hidden directories, ensuring maximum speed.

---

## Language Support

The analyzer uses an extensible plugin architecture to support multiple languages. Each language module provides a Tree-sitter grammar and an AST query mapping.

### Supported Languages
- **JavaScript & TypeScript**
- **Python**
- **Go**
- **Rust**
- **Java**
- **C#**
- **PHP**
- **Ruby**

### Extensibility
To add a new language, a developer implements an `ILanguageParser` interface that defines:
1. File extensions (e.g., `.rs`).
2. Tree-sitter queries for extracting function definitions and imports.
3. Common package manager filenames.

---

## Framework Detection

By cross-referencing `dependencies` in package files with folder structures (e.g., an `app/` folder vs a `pages/` folder), the analyzer detects the frameworks in use.

### Supported Frameworks
- **Frontend:** React, Next.js, Vue, Nuxt, Angular, Svelte, SvelteKit, SolidJS, Astro.
- **Backend (Node):** Express, NestJS, Fastify, Koa.
- **Backend (Python):** FastAPI, Django, Flask.
- **Backend (PHP):** Laravel, Symfony.
- **Backend (Go):** Gin, Fiber, Echo.
- **Backend (Rust):** Actix, Axum, Tauri.
- **Backend (Java/C#):** Spring Boot, ASP.NET Core.

---

## Project Knowledge Graph

Instead of feeding the AI a raw text dump of files, the analyzer synthesizes the discovered information into a lightweight JSON **Project Knowledge Graph**.

### Node Relationships
- **Component → Imports:** `<Header />` depends on `useAuth.ts` and `<Button />`.
- **API → Service:** `POST /users` routes to `UserService.createUser`.
- **Service → Database:** `UserService` invokes `Prisma.user.create()`.
- **Page → Components:** `/dashboard` renders `<Sidebar />` and `<MetricGrid />`.
- **Utility → References:** `formatDate` is referenced by 45 different files.

### Why this graph is useful
When a user asks the AI to "Add a new field to the user profile," the AI queries the graph. It instantly knows the route (`/profile`), the component (`ProfileForm.tsx`), the service (`updateUser`), and the database model (`User`). It can generate an execution plan touching exactly those four files without hallucinating a new architecture or reading the entire repository.

---

## Output

The final output of the Project Analyzer can be piped to standard out (for human readability) or serialized to JSON (for the Prompt Engine).

### Example Output

- **Project Summary:** "Next.js E-Commerce Platform."
- **Detected Technologies:** TypeScript, Next.js 14 (App Router), Tailwind CSS, Prisma, PostgreSQL, Jest.
- **Architecture:** Monolith, Serverless API Routes, Shared Component Library.
- **Folder Map:** A token-compressed tree showing the boundaries of `src/app`, `src/components`, `src/lib`.
- **Reusable Components:** A list of highly imported items (e.g., `ui/Button`, `lib/auth`, `utils/fetcher`) that the AI *must* prioritize for reuse.
- **Duplicate Logic:** Flags functions with high AST similarity (e.g., "Warning: Date formatting logic duplicated in `src/admin` and `src/client`").
- **Potential Improvements:** "Missing error boundaries in 3 routes," "Unused dependency: `moment`."
- **Risk Areas:** "Massive Component: `Checkout.tsx` is 1,200 lines."
- **Confidence Score:** 98% (High confidence in framework detection and import mapping).

---

## Design Principles

The analyzer must strictly adhere to the following principles:

- **Fast:** Must complete analysis of a mid-sized repository (1,000 files) in under 500 milliseconds.
- **Deterministic:** The same codebase must always yield the exact same Knowledge Graph.
- **Framework Agnostic:** Core traversal logic must not care if the project is Vue or Django; specific detections are handled by plugins.
- **Extensible:** The AST parsing and framework detection modules must allow community contributions.
- **Explainable:** The analyzer must be able to output exactly *why* it classified a project as a specific architecture.
- **Offline-first:** Absolutely no network requests. The analyzer relies purely on local file IO and static AST parsing.
