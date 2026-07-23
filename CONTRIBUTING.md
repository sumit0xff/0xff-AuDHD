# Contributing

## Philosophy-First Development

- Start with [docs/philosophy.md](docs/philosophy.md).
- Read [SKILL.md](SKILL.md) before changing behavior rules.
- Ensure every proposed rule traces back to the philosophy.
- Respect the developer as the project owner and preserve existing project intent.

## No Overengineering

- Prefer simple solutions with clear value.
- Add complexity only when the project requires it.
- Do not introduce architecture for problems that do not exist.

## Small Pull Requests

- Keep pull requests focused on one requested change.
- Do not include unrelated refactoring.
- Keep changes easy to review.

## Coding Standards

- Prefer readable, maintainable, production-quality code.
- Avoid unnecessary files, abstractions, and dependencies.
- Do not change existing code without explicit permission.

## Documentation Standards

- Keep documentation direct, structured, and easy to scan.
- Keep documentation synchronized with behavior changes.
- Update documentation only when it is relevant to the change.

## Commit Messages

Use Conventional Commits.

- `docs: add usage guidance`
- `feat: add a supported integration`
- `fix: correct a behavior rule`

## Pull Request Checklist

- [ ] The change traces back to `docs/philosophy.md`.
- [ ] The change solves the requested problem.
- [ ] The change does not add unnecessary complexity.
- [ ] The change does not include unrelated work.
- [ ] Documentation is synchronized when needed.
- [ ] The pull request is small and focused.
