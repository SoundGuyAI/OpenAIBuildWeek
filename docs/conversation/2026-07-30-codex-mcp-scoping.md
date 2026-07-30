# Codex MCP scoping conversation — 2026-07-30

## User prompt — move global MCP servers into relevant projects

Logged: 2026-07-30T04:50:14.2089428-07:00
Branch: `main`

> can you do 1. ? add them to the relevant projcts in c:\unityproj stage changes and let me know which projecsts i wanan review and manually commit.

## Orchestrator outcome — project-scoped MCP configuration

- Summary: Removed the Chrome DevTools and Firebase MCP definitions from the user-level Codex configuration and added only the required servers to relevant trusted projects under `C:\UnityProj`.
- Decisions/assumptions: Firebase was scoped only to repositories with Firebase configuration and dependencies. Chrome DevTools was scoped to browser/E2E projects, Symphony's local observability UI, and the nested Puppeteer PDF build subproject.
- Resulting files: Project `.codex/config.toml` files in `ImprovCALIL`, `ImprovDashboard`, `OpenAIBuildWeek`, `symphony`, and the nested `ProjectPlanningAndIdeas` PDF build folder; user-level `C:\Users\Oded\.codex\config.toml` was updated locally.
- Validation: Every TOML file parsed successfully. `codex mcp list --json` showed the intended project-specific servers and no Chrome/Firebase MCP servers in `AzureTMP` or the `ProjectPlanningAndIdeas` repository root.
- Remaining risks/questions: Existing Codex sessions keep their already-running MCP processes until those sessions or the desktop app are restarted.
