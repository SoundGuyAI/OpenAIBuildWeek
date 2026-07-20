# OpenAI Build Week — IWSDK Game

Hackathon boilerplate for a browser-first, VR-capable game built with Meta's
[Immersive Web SDK](https://iwsdk.dev/).

The current milestone is an interactive 3D **Hello World** scene. The letters
float in an IWSDK world, support IWSDK grabbing, and the scene runs in desktop,
mobile, and immersive VR modes.

## Quick start

Requirements: Node.js 24 (IWSDK also supports the engine ranges in
`package.json`) and a modern browser.

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run typecheck
npm run build
npm run test:e2e
npm run check
npm run feature:new -- feature-slug
```

## Controls

- Desktop: `WASD` or arrow keys to move; mouse/touch can interact with letters.
- Mobile: use the on-screen movement pad.
- VR: select **Enter VR**, then point at and grab individual letters.

## Team workflow

- Product and game-design material lives in [`docs/design`](docs/design).
- Every feature starts from `main` on its own `feature/<slug>` branch.
- Every feature has a matching plan in `plans/<slug>/` and review evidence in
  `evidence/<slug>/`.
- The complete agent loop is documented in
  [`docs/agents/FEATURE_LOOP.md`](docs/agents/FEATURE_LOOP.md).
- User prompts and conversation decisions are appended to
  [`docs/conversation`](docs/conversation).

GitHub Actions validates pull requests and deploys `main` to GitHub Pages.
