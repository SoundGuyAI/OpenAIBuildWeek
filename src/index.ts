import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  DistanceGrabbable,
  DoubleSide,
  EnvironmentType,
  GridHelper,
  Group,
  Interactable,
  LocomotionEnvironment,
  Mesh,
  MeshStandardMaterial,
  MovementMode,
  PlaneGeometry,
  SessionMode,
  VisibilityState,
  World,
} from "@iwsdk/core";

import { FloatingWord, FloatingWordSystem } from "./floating-word.js";
import "./styles.css";

const PATTERNS: Record<string, string[]> = {
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
};

const COLORS = [
  0x72e5ff, 0x8affc1, 0xffe66d, 0xff8fab, 0xb8a1ff, 0x65d6ff, 0x7dffb2,
  0xffd166, 0xff7096, 0xa78bfa,
];

const CELL_SIZE = 0.12;
const CELL_PITCH = 0.145;
const LETTER_ADVANCE = 0.82;
const WORD_GAP = 0.5;
const WORD = "HELLO WORLD";

function requiredElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing required element: ${selector}`);
  return element;
}

function buildLetter(character: string, index: number, geometry: BoxGeometry) {
  const pattern = PATTERNS[character];
  if (!pattern) throw new Error(`No voxel pattern for ${character}`);

  const group = new Group();
  group.name = `Letter-${character}-${index}`;

  const material = new MeshStandardMaterial({
    color: COLORS[index % COLORS.length],
    emissive: new Color(COLORS[index % COLORS.length]).multiplyScalar(0.12),
    metalness: 0.18,
    roughness: 0.28,
  });

  pattern.forEach((row, rowIndex) => {
    [...row].forEach((cell, columnIndex) => {
      if (cell !== "1") return;

      const voxel = new Mesh(geometry, material);
      voxel.position.set(
        (columnIndex - 2) * CELL_PITCH,
        (3 - rowIndex) * CELL_PITCH,
        0,
      );
      voxel.castShadow = true;
      voxel.receiveShadow = true;
      group.add(voxel);
    });
  });

  return group;
}

function wireTouchControls() {
  const keyNames: Record<string, string> = {
    KeyW: "w",
    KeyA: "a",
    KeyS: "s",
    KeyD: "d",
  };

  document.querySelectorAll<HTMLButtonElement>("#touch-controls [data-key]").forEach(
    (button) => {
      const code = button.dataset.key!;
      const dispatch = (type: "keydown" | "keyup") => {
        window.dispatchEvent(
          new KeyboardEvent(type, {
            bubbles: true,
            code,
            key: keyNames[code],
          }),
        );
      };

      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        dispatch("keydown");
      });
      button.addEventListener("pointerup", () => dispatch("keyup"));
      button.addEventListener("pointercancel", () => dispatch("keyup"));
      button.addEventListener("lostpointercapture", () => dispatch("keyup"));
    },
  );
}

const container = requiredElement<HTMLDivElement>("#scene-container");
const status = requiredElement<HTMLParagraphElement>("#status");
const enterXrButton = requiredElement<HTMLButtonElement>("#enter-xr");
const resetButton = requiredElement<HTMLButtonElement>("#reset-view");
const motionButton = requiredElement<HTMLButtonElement>("#toggle-motion");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

let motionEnabled = !reducedMotionQuery.matches;
let motionPausedByUser = false;

function updateMotionButton() {
  motionButton.textContent = motionEnabled ? "Pause float" : "Resume float";
}

updateMotionButton();

wireTouchControls();

World.create(container, {
  xr: {
    sessionMode: SessionMode.ImmersiveVR,
    offer: "always",
    features: { handTracking: true, layers: true },
  },
  features: {
    locomotion: { useWorker: true, browserControls: true },
    grabbing: true,
    physics: false,
    sceneUnderstanding: false,
    environmentRaycast: false,
  },
}).then((world) => {
  const { camera } = world;
  camera.position.set(0, 1.6, 4.8);
  camera.rotation.set(0, 0, 0);

  world.scene.background = new Color(0x050713);

  const ambient = new AmbientLight(0x8ab8ff, 1.45);
  ambient.name = "AmbientLight";
  world.createTransformEntity(ambient);

  const keyLight = new DirectionalLight(0xffffff, 3.2);
  keyLight.name = "KeyLight";
  keyLight.position.set(3, 6, 4);
  keyLight.castShadow = true;
  world.createTransformEntity(keyLight);

  const rimLight = new DirectionalLight(0x4ac8ff, 2.2);
  rimLight.name = "RimLight";
  rimLight.position.set(-4, 3, -4);
  world.createTransformEntity(rimLight);

  const floor = new Mesh(
    new PlaneGeometry(24, 24),
    new MeshStandardMaterial({
      color: 0x09152b,
      metalness: 0.05,
      roughness: 0.88,
      side: DoubleSide,
    }),
  );
  floor.name = "LocomotionFloor";
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  world
    .createTransformEntity(floor)
    .addComponent(LocomotionEnvironment, { type: EnvironmentType.STATIC });

  const grid = new GridHelper(24, 24, 0x2d9cdb, 0x17365f);
  grid.name = "NavigationGrid";
  grid.position.y = 0.006;
  world.createTransformEntity(grid);

  const wordRoot = new Group();
  wordRoot.name = "HelloWorldRoot";
  wordRoot.position.set(0, 1.8, -2.2);
  wordRoot.scale.setScalar(0.72);
  motionEnabled = !reducedMotionQuery.matches;
  updateMotionButton();
  const wordEntity = world
    .createTransformEntity(wordRoot)
    .addComponent(FloatingWord, {
      baseY: 1.8,
      amplitude: 0.08,
      speed: 0.9,
      enabled: motionEnabled,
    });

  const visibleCharacters = [...WORD].filter((character) => character !== " ");
  const totalWidth =
    visibleCharacters.length * LETTER_ADVANCE + WORD_GAP - LETTER_ADVANCE;
  const voxelGeometry = new BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);
  let cursor = -totalWidth / 2;
  let visibleIndex = 0;

  for (const character of WORD) {
    if (character === " ") {
      cursor += WORD_GAP;
      continue;
    }

    const letter = buildLetter(character, visibleIndex, voxelGeometry);
    letter.position.x = cursor;
    world
      .createTransformEntity(letter, { parent: wordEntity })
      .addComponent(Interactable)
      .addComponent(DistanceGrabbable, {
        movementMode: MovementMode.MoveFromTarget,
      });
    cursor += LETTER_ADVANCE;
    visibleIndex += 1;
  }

  world.registerSystem(FloatingWordSystem);

  const setMotionEnabled = (enabled: boolean) => {
    motionEnabled = enabled;
    wordEntity.setValue(FloatingWord, "enabled", motionEnabled);
    updateMotionButton();
  };

  motionButton.addEventListener("click", () => {
    const nextMotionEnabled = !motionEnabled;
    motionPausedByUser = !nextMotionEnabled;
    setMotionEnabled(nextMotionEnabled);
  });

  reducedMotionQuery.addEventListener("change", (event) => {
    if (event.matches) {
      setMotionEnabled(false);
      return;
    }

    setMotionEnabled(!motionPausedByUser);
  });

  const resetView = () => {
    world.player.position.set(0, 0, 0);
    world.player.rotation.set(0, 0, 0);
    camera.position.set(0, 1.6, 4.8);
    camera.rotation.set(0, 0, 0);
  };

  resetButton.addEventListener("click", resetView);
  enterXrButton.addEventListener("click", () => {
    if (world.visibilityState.value === VisibilityState.NonImmersive) {
      void world.launchXR();
    } else {
      void world.exitXR();
    }
  });

  world.visibilityState.subscribe((visibilityState) => {
    enterXrButton.textContent =
      visibilityState === VisibilityState.NonImmersive ? "Enter VR" : "Exit VR";
  });

  enterXrButton.disabled = false;
  resetButton.disabled = false;
  status.textContent = "Ready — explore the scene and grab a letter.";
  document.body.dataset.iwsdkReady = "true";
}).catch((error: unknown) => {
  console.error("IWSDK failed to initialize", error);
  status.textContent = "The 3D world could not start. Check the browser console.";
  document.body.dataset.iwsdkReady = "error";
});
