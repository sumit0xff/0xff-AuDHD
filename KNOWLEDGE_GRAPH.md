# 0xff Project Knowledge Graph

The Project Knowledge Graph is the central data model of the 0xff toolkit. It serves as the definitive structural map of a software project, enabling deep repository understanding, dependency tracking, context generation, and rule evaluation.

---

## Purpose

A traditional AI coding assistant simply scans text files. When an AI only sees text, it lacks structural awareness—it cannot tell the difference between an isolated utility script and the core database service that powers the entire application.

A graph-based representation maps *relationships*. By treating the codebase as an interconnected web of nodes (files, functions, components) and edges (imports, calls, uses), 0xff can reason about architectural boundaries. It understands that modifying a shared UI component will impact 40 different pages, whereas modifying a one-off helper function carries zero risk. This graph enables 0xff to provide the exact subset of context an AI needs without overwhelming its token window.

---

## Core Entities

The Knowledge Graph categorizes everything in a repository as an entity (node). 

- **Repository:** The root node representing the entire project workspace.
- **Folder / Directory:** A structural boundary containing files or other folders.
- **File:** The physical file containing code or configuration.
- **Module:** A logical grouping of code (e.g., a Rust crate or Node package).
- **Component:** A reusable UI element (e.g., React Component, Vue SFC).
- **Page / View:** A top-level routing component.
- **Hook / Composable:** Reusable state/lifecycle logic.
- **API Route:** An HTTP endpoint definition (e.g., Next.js Route Handler, Express route).
- **Controller:** Logic coordinating HTTP requests to services.
- **Service:** Core business logic and data orchestration.
- **Database Model:** ORM definitions (e.g., Prisma schema, TypeORM entity).
- **Function / Method:** An executable block of logic.
- **Class:** An object-oriented structure.
- **Interface / Protocol:** A contract definition.
- **Type / Struct:** A custom data structure or alias.
- **Enum:** A set of named constants.
- **Dependency:** An external third-party package (e.g., from npm or pip).
- **Configuration:** Build or tooling configs (e.g., `tsconfig.json`, `webpack.config.js`).
- **Environment Variable:** Required `.env` keys.
- **Test Suite:** A collection of unit, integration, or E2E tests.

---

## Relationships

Edges in the graph define how nodes interact. By traversing these edges, 0xff builds execution paths.

- **Repository → CONTAINS → Folder**
- **Folder → CONTAINS → File**
- **File → DEFINES → [Component, Function, Class]**
- **File → IMPORTS → File**
- **File → EXPORTS → [Component, Function, Class]**
- **Component → RENDERS → Component**
- **Page → RENDERS → Component**
- **Component → USES_STATE → Hook**
- **API Route → CALLS → Controller**
- **Controller → CALLS → Service**
- **Service → QUERIES → Database Model**
- **Function → CALLS → Function**
- **Class → IMPLEMENTS → Interface**
- **Class → EXTENDS → Class**
- **Module → DEPENDS_ON → Module (Internal)**
- **Package → DEPENDS_ON → Dependency (External)**
- **Test Suite → TESTS → [Function, Component, Service]**

---

## Metadata

To enable intelligent reasoning, every node stores specific metadata beyond its simple name.

- **Name:** The identifier (e.g., `UserService`).
- **Type:** The node category (e.g., `Service`).
- **Language:** JavaScript, Rust, Python, etc.
- **Framework:** React, Express, Django, etc.
- **Path:** Absolute and relative filepath.
- **Visibility:** Public (exported) vs. Private (internal to file).
- **Documentation:** Extracted JSDoc/docstrings.
- **References (In-Degree):** Number of times this node is imported/called (indicates importance/reuse).
- **Dependencies (Out-Degree):** Number of external things this node calls (indicates complexity).
- **Complexity Score:** Cyclomatic complexity calculated via AST.
- **Risk Score:** A dynamic calculation (High references + High complexity = High risk to modify).
- **Confidence Score:** How certain the analyzer is about this node's type and relationships.
- **Last Modified:** Timestamp from git history.

---

## Graph Queries

The power of the graph lies in traversing it to answer complex engineering questions instantly.

- **Find Duplicate Components:** Find all `Component` nodes that share highly similar AST structures or identical prop signatures.
- **Find Unused Files / Dead Code:** Find all `File`, `Function`, or `Component` nodes where `In-Degree == 0` (excluding entry points).
- **Find Circular Imports:** Detect cycles in the `File → IMPORTS → File` paths.
- **Find Reusable Implementations:** Query for `Function` nodes residing in `utils/` or `lib/` with high `In-Degree`.
- **Find Architecture Violations:** Query for paths where a `Component` node directly `QUERIES` a `Database Model` node (bypassing the `Service` layer).
- **Find Dependency Chains:** "If I modify this `Database Model`, which `API Routes` are indirectly affected?"
- **Find God Objects:** Query for `Class` or `File` nodes with extremely high `Out-Degree` and `Complexity`.
- **Find Missing Tests:** Query for `Service` nodes that do not have an incoming `Test Suite → TESTS` edge.

---

## Use Cases

The Knowledge Graph is the foundational engine for all 0xff features:

- **Project Analysis (`0xff doctor`):** Instantly surfaces architectural smells and circular dependencies.
- **Context Generation (`0xff context`):** Allows 0xff to grab a single file, traverse its immediate edges, and bundle *only* the relevant dependencies into the LLM prompt.
- **AI Prompt Construction:** Injects relational metadata ("Note: `UserService` is used by 14 controllers") into the AI's system prompt.
- **Engineering Rules (`0xff review`):** Powers the Rules Engine by providing the structural data needed to prove a rule was broken (e.g., detecting a UI component importing a backend ORM).
- **Code Review:** Highlights the cascading blast radius of a pull request by tracing the graph from the modified files outward.
- **Future Refactoring:** Automatically proposes splitting "God Modules" by detecting disjointed clusters within a single file.

---

## Extensibility

The graph is designed to be universally adaptable:

- **Adding New Languages:** The schema relies on abstract concepts (`Function`, `File`, `Calls`). A new Python AST parser simply maps Python `def` statements to `Function` nodes and `import` statements to `IMPORTS` edges.
- **Adding New Frameworks:** Framework plugins simply introduce new Node types (`GraphQL Resolver`, `Svelte Store`) and map existing code into them.
- **Custom Entity Types:** Teams can define custom nodes via the `.0xff/config.json` (e.g., adding an `Analytics Event` node type for tracking telemetry structures).

---

## Design Principles

The Knowledge Graph must adhere to these absolute principles:

- **Framework Agnostic:** Core traversal algorithms do not care if a node is an Angular Service or a Spring Boot Bean.
- **Language Agnostic:** Built on generic programming paradigms (Functions, Classes, Files).
- **Incrementally Updatable:** When one file changes, the engine only re-parses that file and updates its specific edges, rather than rebuilding the entire graph.
- **Explainable:** Every edge must map back to a specific line of code.
- **Fast:** Graph generation and querying must resolve in milliseconds using an in-memory graph database approach.
- **Offline-first:** All AST parsing and node generation happens locally.
- **Deterministic:** The exact same codebase state will always generate the exact same graph.
