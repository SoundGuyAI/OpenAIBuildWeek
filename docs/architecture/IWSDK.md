# IWSDK architecture notes

## Baseline

The project was generated from the official `@iwsdk/create` 0.4.2 defaults for:

- TypeScript
- Virtual reality / WebXR
- Locomotion with a worker
- Grabbing
- Quest 3 emulation
- Codex agent context and local IWSDK reference tooling
- No physics or Meta Spatial Editor in the initial baseline

The runtime uses IWSDK's ECS over its Three.js integration. `World.create` owns
the scene, player rig, camera, renderer, XR lifecycle, input, and feature systems.

## Scene rules

- Every gameplay object is represented by an entity created with
  `world.createTransformEntity`.
- Interactable objects use `Interactable` and an appropriate IWSDK interaction
  component such as `DistanceGrabbable`.
- Locomotion surfaces use `LocomotionEnvironment`.
- Shared geometry/materials are created once outside ECS update loops.
- `src/index.ts` composes the first scene; reusable behavior belongs in a
  component/system file.

## Development runtime

```bash
npm run dev
npm run dev:status
npm run dev:down
```

The Vite dev plugin supplies HTTPS, Quest 3 IWER emulation, scene/ECS inspection,
controller simulation, console capture, and AI agent integration. Local runtime
configuration is generated under `.codex/`, `.cursor/`, or `.mcp.json` and is
ignored because it contains machine-specific ports/process details.

The pinned local reference corpus is available through:

```bash
npm run reference:warmup
npm run reference:status
```

### Windows prerequisite for the reference tools

On Windows x64, `@iwsdk/reference` 0.4.2 loads
`onnxruntime-node` 1.21.0. Its native binding requires the Microsoft Visual C++
2015-2022 Redistributable (x64). `npm approve-scripts` permits the package's
postinstall step, but it does not install this operating-system runtime.

The confirmed failure signature is `ERR_DLOPEN_FAILED` for
`onnxruntime_binding.node` even though that file and its companion
`onnxruntime.dll` and `DirectML.dll` are present. On the affected machine,
Playwright's `PrintDeps.exe` reported `MSVCP140.dll`, `VCRUNTIME140.dll`, and
`VCRUNTIME140_1.dll` as `not found`, while `KERNEL32.dll` and the Universal CRT
resolved. The same failure occurred when requiring `onnxruntime-node` directly
under Node 24.18.0, so it is a missing Microsoft runtime, not an IWSDK wrapper,
Node 24 ABI, or npm-package-content failure.

Minimal setup:

1. Install Microsoft's current **Visual C++ Redistributable for Visual Studio
   2015-2022, x64** from the official Microsoft download page:
   <https://learn.microsoft.com/cpp/windows/latest-supported-vc-redist>.
2. Open a new terminal and run `npm run reference:status`.
3. If status succeeds, run `npm run reference:warmup` once.

If installing the system runtime is not possible, continue development using
the checked-in SDK notes and official IWSDK documentation. This limitation
disables only the optional local semantic reference/status/warmup tooling; it
does **not** block typechecking, the Vite production build, the IWSDK app in a
desktop/mobile browser, or the WebXR runtime. Do not copy individual runtime
DLLs into `node_modules`; install or repair the supported redistributable as a
unit.

## Production runtime

`npm run build` produces a static `dist/` folder with relative asset paths, so it
can be hosted under a GitHub Pages repository subpath. Development-only emulator
and agent plugins are not included in the production build.

## Upgrade policy

Upgrade IWSDK and all `@iwsdk/*` packages together in a dedicated branch. Re-run
typecheck, production build, desktop/mobile E2E, and the XR interaction suite.
Record migration notes and changed generated guidance.
