# GitHub Pages workflow review

Date: 2026-07-20

## Scope

Reviewed `.github/workflows/deploy-pages.yml` as the CI/CD and GitHub Pages
specialist. No repository settings, application files, tests, shared plans,
evidence, conversation logs, branches, or git history were changed.

## Repository setting required

GitHub Pages is not currently enabled for `SoundGuyAI/OpenAIBuildWeek`. A
read-only request to `GET /repos/SoundGuyAI/OpenAIBuildWeek/pages` returned HTTP
404 on 2026-07-20.

A repository administrator must open **Settings > Pages** and set **Build and
deployment > Source** to **GitHub Actions**. The workflow intentionally does not
attempt to mutate this setting. Until that is done, its configuration preflight
will stop immediately with an actionable error and settings URL.

## Review outcome

- Kept deployment limited to pushes to `main` plus manual dispatch. A manual
  run now fails clearly unless it was dispatched from `main`.
- Kept production deployment concurrency in the official Pages pattern:
  one `pages` group with `cancel-in-progress: false`, so an active production
  deployment is not interrupted.
- Scoped the build job token to `contents: read` and `pages: read`; scoped the
  deploy job token to `pages: write` and `id-token: write`. Unspecified token
  permissions are disabled at workflow level.
- Added a read-only Pages API preflight that distinguishes an unconfigured site,
  a non-Actions Pages source, and other API failures before dependency install.
- Preserved the required validation order: typecheck, production build, then
  desktop/mobile browser E2E. The Pages artifact is uploaded only after all
  validation succeeds, and deployment depends on the completed build job.
- Updated `actions/configure-pages` from v5 to v6 and
  `actions/upload-pages-artifact` from v3 to v5, the current official major
  releases as of this review. `actions/deploy-pages@v5` was already current.
- Made `configure-pages` enablement explicitly false so the workflow remains
  read-only with respect to repository Pages settings.
- Kept the standard `github-pages` artifact name, uploaded only `dist`, and set
  one-day retention. The deploy job targets the recommended `github-pages`
  environment and publishes the returned deployment URL.

## Validation

- Compared the workflow with GitHub's official custom Pages workflow guidance
  and the official action metadata/readmes for `configure-pages`,
  `upload-pages-artifact`, and `deploy-pages`.
- Queried official GitHub releases: `configure-pages@v6.0.0`,
  `upload-pages-artifact@v5.0.0`, and `deploy-pages@v5.0.0` are current as of
  2026-07-20.
- Confirmed the Vite build output is `dist` and the project uses `base: "./"`,
  which is compatible with repository Pages paths.
- Confirmed the deploy job has the minimum documented permissions and the
  recommended `github-pages` environment/output URL wiring.
- Parsed and linted the final workflow successfully with Prettier 3.6.2 and
  actionlint 1.7.12; actionlint also ran ShellCheck 0.11.0 against embedded Bash.

## Remaining human verification

After Pages is enabled with GitHub Actions as the source, merge or push to
`main` and confirm the first real deployment succeeds. Repository environment
protection rules, organization policy, and the published WebXR experience can
only be verified in that live run.
