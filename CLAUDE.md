# CLAUDE.md

## Repository Overview

This is a **Claude Cowork Projects** repository — a container for storing and managing projects created with Claude Cowork. Projects are saved here for easy access and automatic version control.

## Structure

```
.
├── .github/workflows/
│   └── auto-save.yml    # Auto-commits changes on push to main or hourly
├── projects/            # Directory for all project files
│   └── .gitkeep
├── CLAUDE.md            # This file
└── README.md
```

## Key Concepts

- **projects/** is the primary directory where all Cowork-created projects should be placed.
- The repository uses a GitHub Actions workflow (`auto-save.yml`) that automatically commits and pushes any uncommitted changes hourly and on every push to main.

## Development Workflow

- **Default branch**: `master`
- **No build/test/lint pipeline** — this is a content/project storage repo, not an application.
- Changes pushed to `main` trigger the auto-save workflow. The workflow also runs on an hourly cron schedule.

## Git Conventions

- Feature branches use the `claude/` prefix (e.g., `claude/<description>-<session-id>`).
- The auto-save bot commits as `github-actions[bot]` with messages formatted as `Auto-save: YYYY-MM-DD HH:MM:SS UTC`.
- Manual commits should use clear, descriptive messages.

## CI/CD

The only workflow is `.github/workflows/auto-save.yml`:
- **Triggers**: push to main, hourly cron, manual dispatch
- **Action**: stages all changes (`git add -A`), commits with a timestamped message if changes exist, then pushes

## For AI Assistants

- New projects go in the `projects/` directory.
- There are no tests, linters, or build steps to run.
- Keep commits clean — the auto-save workflow handles routine saves, so manual commits should represent intentional, well-described changes.
