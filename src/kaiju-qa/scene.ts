import {
  AnimationAction,
  AnimationMixer,
  AssetManager,
  Box3,
  BoxGeometry,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LoopOnce,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Plane,
  PlaneGeometry,
  PokeInteractable,
  Points,
  PointsMaterial,
  Quaternion,
  Ray,
  RayInteractable,
  SRGBColorSpace,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  Vector2,
  World,
  XRAnchor,
  createSystem,
  type Entity,
} from "@iwsdk/core";

import {
  createCanvasPanel,
  roundedRect,
  setFittedFont,
  wrapText,
  type CanvasPanel,
} from "./canvas-panel.js";
import {
  createDraggableCallout,
  setLocalQuaternionFromWorld,
  type DraggableCallout,
} from "./draggable-callout.js";
import {
  createRuleRack,
  createRunTestsLever,
} from "./control-fixtures.js";
import { forceOpaqueImportedMaterial } from "./imported-materials.js";

export type SceneLevelId =
  | "training-yard"
  | "school-crossing"
  | "harbor-load"
  | "storm-shift";

export type ScenePropId =
  | "car"
  | "tower"
  | "crosswalk"
  | "heavy-cargo"
  | "rain-module";

export type SceneRuleId = "broad" | "alternate" | "targeted";

export type SceneEvidenceStatus =
  | "untested"
  | "ready"
  | "pass"
  | "fail"
  | "regression"
  | "stale";

export type SceneCue =
  | "idle"
  | "placed"
  | "baseline"
  | "failure"
  | "regression"
  | "verified"
  | "release"
  | "level-change"
  | "blocked";

export type SceneInteractionTarget =
  | { readonly kind: "prop"; readonly id: ScenePropId }
  | { readonly kind: "rule"; readonly id?: SceneRuleId }
  | { readonly kind: "lever" }
  | { readonly kind: "stamp" }
  | null;

export interface SceneEvidenceItem {
  readonly id: string;
  readonly label: string;
  readonly status: SceneEvidenceStatus;
}

export interface SceneRuleOption {
  readonly id: SceneRuleId;
  readonly label: string;
  readonly scope: string;
}

export interface KaijuQaSceneView {
  readonly level: SceneLevelId;
  readonly levelIndex: number;
  readonly levelCount: number;
  readonly levelTitle: string;
  readonly levelSubtitle: string;
  readonly placedProps: readonly ScenePropId[];
  readonly selectedRule: SceneRuleId | null;
  readonly ruleOptions: readonly SceneRuleOption[];
  readonly evidence: readonly SceneEvidenceItem[];
  readonly expected: SceneInteractionTarget;
  readonly instructionTitle: string;
  readonly instructionBody: string;
  readonly progressLabel: string;
  readonly releaseReady: boolean;
  readonly levelReleased: boolean;
  readonly campaignComplete: boolean;
  readonly cue: SceneCue;
  readonly cueId: number;
}

export type KaijuQaSceneIntent =
  | { readonly type: "PLACE_PROP"; readonly prop: ScenePropId }
  | { readonly type: "INSTALL_RULE"; readonly rule: SceneRuleId }
  | { readonly type: "PULL_LEVER" }
  | { readonly type: "PRESS_RELEASE" };

export interface KaijuQaSceneDebugPoint {
  readonly x: number;
  readonly y: number;
  readonly visible: boolean;
}

export interface KaijuQaScene {
  present(view: KaijuQaSceneView): void;
  setSuspended(suspended: boolean): void;
  setReducedMotion(reducedMotion: boolean): void;
  setMixedReality(active: boolean, passthroughAvailable?: boolean): void;
  setWorkbenchPlacement(
    phase: "aiming" | "adjusting" | "confirmed" | "inactive",
    pose?: {
      readonly position: Vector3;
      readonly quaternion: Quaternion;
      readonly scale: number;
    },
  ): void;
  resetView(): void;
  getDebugTargets(): Record<string, KaijuQaSceneDebugPoint>;
  dispose(): void;
}

export interface CreateKaijuQaSceneOptions {
  readonly onIntent: (intent: KaijuQaSceneIntent) => void;
  readonly onInvalidDrop: (message: string) => void;
  readonly reducedMotion: boolean;
}

type ManipulationKind = "prop" | "rule" | "lever" | "stamp";

interface ManipulationMeta {
  readonly kind: ManipulationKind;
  readonly id: ScenePropId | SceneRuleId | "lever" | "stamp";
  readonly entity: Entity;
  readonly object: Group;
  readonly halo: Group;
  readonly eventTarget: Object3D;
  readonly home: Vector3;
  readonly target: Vector3;
  readonly baseScale: Vector3;
  readonly dragOffset: Vector3;
  readonly dragPlane: Plane;
  readonly pointerDown: (event: unknown) => void;
  readonly pointerMove: (event: unknown) => void;
  readonly pointerUp: (event: unknown) => void;
  readonly pointerCancel: (event: unknown) => void;
  readonly pointerOver: () => void;
  readonly pointerOut: () => void;
  enabled: boolean;
  dragging: boolean;
  activePointerId: number | null;
  snapped: boolean;
  triggered: boolean;
  returnStartedAt: number | null;
  returnFrom: Vector3;
  lastSettledAt: number;
  leverVisualPivot?: Group;
  leverVisualRoot?: Group;
}

interface InteractionController {
  onIntent(intent: KaijuQaSceneIntent): void;
  onInvalidDrop(message: string): void;
  tick(delta: number, time: number): void;
}

const INTERACTIONS = new Map<object, ManipulationMeta>();
const CONTROLLERS = new WeakMap<World, InteractionController>();
const INSTALLED_WORLDS = new WeakSet<World>();

const tmpWorld = new Vector3();
const tmpLocal = new Vector3();
const tmpPlanePoint = new Vector3();
const tabletopNormal = new Vector3(0, 1, 0);
const verticalNormal = new Vector3(0, 0, 1);
const tmpPointer = new Vector2();
const tmpScreenRay = new Ray();
const tmpScreenOrigin = new Vector3();
const tmpScreenDirection = new Vector3();
const tmpDragPlaneNormal = new Vector3();
const tmpRootQuaternion = new Quaternion();
const tmpCameraWorldQuaternion = new Quaternion();

interface ScenePointerEvent {
  readonly pointerId: number;
  readonly pointerType: string;
  readonly button?: number;
  readonly pointer?: Vector2;
  readonly ray: Ray;
  readonly point: Vector3;
  stopPropagation(): void;
}

type CapturableObject = Object3D & {
  setPointerCapture(pointerId: number): void;
  releasePointerCapture(pointerId: number): void;
  hasPointerCapture(pointerId: number): boolean;
};

function pointerEvents(object: Object3D, enabled: boolean): void {
  object.traverse((child) => {
    (child as Object3D & { pointerEvents?: string }).pointerEvents = enabled
      ? "auto"
      : "none";
    (child as Object3D & { pointerEventsOrder?: number }).pointerEventsOrder = 20;
  });
}

function asScenePointerEvent(event: unknown): ScenePointerEvent | null {
  if (!event || typeof event !== "object") return null;
  const candidate = event as Partial<ScenePointerEvent>;
  return typeof candidate.pointerId === "number" &&
    candidate.ray instanceof Ray &&
    candidate.point instanceof Vector3
    ? (candidate as ScenePointerEvent)
    : null;
}

function easeOutBack(value: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2);
}

function beginReturn(meta: ManipulationMeta): void {
  meta.returnStartedAt = performance.now();
  meta.returnFrom.copy(meta.object.position);
  meta.snapped = false;
}

function cancelActiveManipulation(meta: ManipulationMeta): void {
  const pointerId = meta.activePointerId;
  if (pointerId !== null) {
    const capturable = meta.eventTarget as CapturableObject;
    if (capturable.hasPointerCapture(pointerId)) {
      capturable.releasePointerCapture(pointerId);
    }
  }
  meta.activePointerId = null;
  meta.dragging = false;
  beginReturn(meta);
}

function settleInteraction(world: World, meta: ManipulationMeta): void {
  const now = performance.now();
  if (now - meta.lastSettledAt < 80) return;
  meta.lastSettledAt = now;

  if (meta.kind === "lever") {
    if (meta.object.position.z - meta.home.z > 0.14 && !meta.triggered) {
      meta.triggered = true;
      CONTROLLERS.get(world)?.onIntent({ type: "PULL_LEVER" });
    }
    beginReturn(meta);
    return;
  }

  if (meta.kind === "stamp") {
    if (meta.home.y - meta.object.position.y > 0.09 && !meta.triggered) {
      meta.triggered = true;
      CONTROLLERS.get(world)?.onIntent({ type: "PRESS_RELEASE" });
    }
    beginReturn(meta);
    return;
  }

  if (!meta.enabled) {
    beginReturn(meta);
    return;
  }

  if (meta.object.position.distanceTo(meta.target) <= 0.34) {
    meta.object.position.copy(meta.target);
    meta.snapped = true;
    meta.returnStartedAt = null;
    meta.halo.visible = false;
    if (meta.kind === "prop") {
      CONTROLLERS.get(world)?.onIntent({
        type: "PLACE_PROP",
        prop: meta.id as ScenePropId,
      });
    } else {
      CONTROLLERS.get(world)?.onIntent({
        type: "INSTALL_RULE",
        rule: meta.id as SceneRuleId,
      });
    }
    return;
  }

  beginReturn(meta);
  CONTROLLERS.get(world)?.onInvalidDrop(
    meta.kind === "rule"
      ? "Drop the rule cartridge into the glowing rule dock."
      : "Drop the test prop into its glowing city socket.",
  );
}

class KaijuQaInteractionSystem extends createSystem({
  movable: { required: [RayInteractable] },
}) {
  update(delta: number, time: number) {
    const now = performance.now();
    for (const entity of this.queries.movable.entities) {
      const meta = INTERACTIONS.get(entity as object);
      if (!meta) continue;

      if (meta.kind === "lever") {
        meta.object.position.x = meta.home.x;
        meta.object.position.y = meta.home.y;
        meta.object.position.z = MathUtils.clamp(
          meta.object.position.z,
          meta.home.z,
          meta.home.z + 0.27,
        );
      } else if (meta.kind === "stamp") {
        meta.object.position.x = meta.home.x;
        meta.object.position.z = meta.home.z;
        meta.object.position.y = MathUtils.clamp(
          meta.object.position.y,
          meta.home.y - 0.15,
          meta.home.y,
        );
      } else {
        meta.object.position.y = meta.home.y;
        meta.object.position.x = MathUtils.clamp(meta.object.position.x, -1.45, 1.45);
        meta.object.position.z = MathUtils.clamp(meta.object.position.z, -0.72, 0.92);
      }

      if (meta.returnStartedAt !== null && !meta.dragging) {
        const raw = Math.min(1, (now - meta.returnStartedAt) / 300);
        const eased = easeOutBack(raw);
        meta.object.position.lerpVectors(meta.returnFrom, meta.home, eased);
        if (raw >= 1) {
          meta.object.position.copy(meta.home);
          meta.returnStartedAt = null;
          meta.triggered = false;
        }
      }
      if (meta.kind === "lever" && meta.leverVisualPivot) {
        const pullOffset = meta.object.position.z - meta.home.z;
        const progress = MathUtils.clamp(
          pullOffset / 0.27,
          0,
          1,
        );
        if (meta.leverVisualRoot) meta.leverVisualRoot.position.z = -pullOffset;
        meta.leverVisualPivot.rotation.x = MathUtils.degToRad(56) * progress;
      }
    }
    CONTROLLERS.get(this.world)?.tick(delta, time);
  }
}

function installInteractionSystem(world: World, controller: InteractionController): void {
  CONTROLLERS.set(world, controller);
  if (INSTALLED_WORLDS.has(world)) return;
  world.registerSystem(KaijuQaInteractionSystem);
  INSTALLED_WORLDS.add(world);
}

const palette = {
  ink: 0x101a22,
  bench: 0xeee3ce,
  benchEdge: 0x4a4d4b,
  road: 0x39464d,
  teal: 0x48b7a9,
  cyan: 0x62e2ef,
  yellow: 0xffc84a,
  lime: 0xa9dc52,
  coral: 0xff6f61,
  slate: 0x7f929b,
  blue: 0x4d9de0,
  purple: 0x9d7bff,
  white: 0xfff8e8,
} as const;

const DESKTOP_ROOT_HOME = new Vector3(0, 0.48, -1.58);
const TABLE_WIDTH = 4.7;
const TABLE_DEPTH = 2.72;

const statusColors: Record<SceneEvidenceStatus, string> = {
  untested: "#80939b",
  ready: "#62e2ef",
  pass: "#a9dc52",
  fail: "#ff6f61",
  regression: "#ff6f61",
  stale: "#ffc84a",
};

function standardMaterial(
  color: number,
  options: Partial<{
    roughness: number;
    metalness: number;
    emissive: number;
    emissiveIntensity: number;
    transparent: boolean;
    opacity: number;
  }> = {},
): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.68,
    metalness: options.metalness ?? 0.04,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
  });
}

function mesh(
  geometry: BufferGeometry,
  material: MeshStandardMaterial | MeshPhysicalMaterial | MeshBasicMaterial,
): Mesh {
  const result = new Mesh(geometry, material);
  result.castShadow = true;
  result.receiveShadow = true;
  return result;
}

function cloneAsset(key: string): Group {
  const gltf = AssetManager.getGLTF(key);
  if (!gltf) throw new Error(`Kaiju QA asset was not preloaded: ${key}`);
  return gltf.scene.clone(true);
}

function prepareImportedModel(
  object: Object3D,
  ownedMaterials: MeshStandardMaterial[],
  roughness = 0.64,
  forceOpaque = false,
): void {
  object.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    child.castShadow = true;
    child.receiveShadow = true;
    const source = Array.isArray(child.material)
      ? child.material
      : [child.material];
    const cloned = source.map((entry) => {
      const material = entry.clone() as MeshStandardMaterial;
      if ("roughness" in material) material.roughness = roughness;
      if ("metalness" in material) material.metalness = Math.min(material.metalness, 0.12);
      if (forceOpaque) forceOpaqueImportedMaterial(material);
      material.needsUpdate = true;
      ownedMaterials.push(material);
      return material;
    });
    child.material = Array.isArray(child.material) ? cloned : cloned[0];
  });
}

function fitObject(object: Object3D, targetSize: number): void {
  object.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(object);
  const size = bounds.getSize(new Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z, 0.0001);
  object.scale.multiplyScalar(targetSize / maxDimension);
  object.updateMatrixWorld(true);
  const fitted = new Box3().setFromObject(object);
  const center = fitted.getCenter(new Vector3());
  const rootWorld = object.getWorldPosition(new Vector3());
  const worldShift = new Vector3(
    rootWorld.x - center.x,
    rootWorld.y - fitted.min.y,
    rootWorld.z - center.z,
  );
  const localOrigin = object.worldToLocal(rootWorld.clone());
  const localShift = object
    .worldToLocal(rootWorld.clone().add(worldShift))
    .sub(localOrigin);
  for (const child of object.children) child.position.add(localShift);
  object.updateMatrixWorld(true);
}

function makeHalo(material: MeshStandardMaterial, radius = 0.24): Group {
  const halo = new Group();
  const ring = mesh(new TorusGeometry(radius, 0.016, 8, 40), material);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.012;
  halo.add(ring);
  halo.visible = false;
  return halo;
}

function addWindowGlow(object: Object3D, color: number): void {
  object.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    const material = child.material as MeshStandardMaterial;
    if (!material.color) return;
    const brightness = material.color.r + material.color.g + material.color.b;
    if (brightness > 2.25) {
      material.emissive = new Color(color);
      material.emissiveIntensity = 0.08;
    }
  });
}

function tintModel(object: Object3D, color: number): void {
  object.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    for (const material of materials) {
      if (!(material instanceof MeshStandardMaterial)) continue;
      material.color.setHex(color);
      material.emissive.setHex(color);
      material.emissiveIntensity = 0.018;
      material.needsUpdate = true;
    }
  });
}

function drawSpeechBubble(
  panel: CanvasPanel,
  view: KaijuQaSceneView,
): void {
  const regressionHandoff =
    view.expected?.kind === "rule" &&
    view.evidence.some((item) => item.status === "regression");
  const title = regressionHandoff ? "Compare the scopes" : view.instructionTitle;
  const body = regressionHandoff
    ? "The hazard is protected, but an established route regressed. Compare every cartridge scope before choosing the next candidate."
    : view.instructionBody
      .replace(/\bred\s+(?=broad-rule)/gi, "")
      .replace(/\bgreen\s+(?=targeted-rule)/gi, "");

  panel.render((context) => {
    const { width, height } = panel.canvas;
    context.shadowColor = "rgba(0, 0, 0, 0.35)";
    context.shadowBlur = 24;
    context.fillStyle = "rgba(14, 25, 33, 0.96)";
    roundedRect(context, 20, 20, width - 40, height - 40, 42);
    context.fill();
    context.shadowBlur = 0;
    context.strokeStyle = "#62e2ef";
    context.lineWidth = 8;
    context.stroke();
    context.fillStyle = "#ffc84a";
    context.font = "800 42px system-ui, sans-serif";
    context.fillText(view.progressLabel.toUpperCase(), 70, 78);
    context.fillStyle = "#fff8e8";
    context.font = "900 62px system-ui, sans-serif";
    context.fillText(title, 70, 152);
    context.fillStyle = "#d9e4df";
    context.font = "500 38px system-ui, sans-serif";
    wrapText(context, body, 70, 210, width - 140, 50, 3);
  });
}

function drawPlacementBubble(
  panel: CanvasPanel,
  phase: "aiming" | "adjusting" | "confirmed",
): void {
  const copy =
    phase === "aiming"
      ? {
          kicker: "MIXED REALITY SETUP",
          title: "Place the workbench",
          body: "Point at a clear horizontal table, then squeeze the trigger once to hold the preview.",
        }
      : phase === "adjusting"
        ? {
            kicker: "POSITION LOCKED",
            title: "Rotate, then confirm",
            body: "Use the right thumbstick to face the lab toward you. Squeeze the trigger again when it feels comfortable.",
          }
        : {
            kicker: "WORKBENCH READY",
            title: "Start testing",
            body: "Point, hold, move, and release objects. The same physical actions work on desktop, touch, and XR.",
          };

  panel.render((context) => {
    const { width, height } = panel.canvas;
    context.shadowColor = "rgba(0, 0, 0, 0.45)";
    context.shadowBlur = 28;
    context.fillStyle = "rgba(9, 23, 30, 0.96)";
    roundedRect(context, 20, 20, width - 40, height - 40, 42);
    context.fill();
    context.shadowBlur = 0;
    context.strokeStyle = phase === "confirmed" ? "#a9dc52" : "#62e2ef";
    context.lineWidth = 9;
    context.stroke();
    context.fillStyle = "#ffc84a";
    context.font = "800 42px system-ui, sans-serif";
    context.fillText(copy.kicker, 70, 82);
    context.fillStyle = "#fff8e8";
    context.font = "900 61px system-ui, sans-serif";
    context.fillText(copy.title, 70, 158);
    context.fillStyle = "#d9e4df";
    context.font = "500 36px system-ui, sans-serif";
    wrapText(context, copy.body, 70, 218, width - 140, 49, 3);
  });
}

function drawEvidenceBoard(panel: CanvasPanel, view: KaijuQaSceneView): void {
  panel.render((context) => {
    const { width, height } = panel.canvas;
    context.fillStyle = "rgba(12, 23, 31, 0.97)";
    roundedRect(context, 8, 8, width - 16, height - 16, 28);
    context.fill();
    context.strokeStyle = "#596970";
    context.lineWidth = 5;
    context.stroke();
    context.fillStyle = "#ffc84a";
    context.font = "800 30px system-ui, sans-serif";
    context.fillText(`DISTRICT ${view.levelIndex + 1} / ${view.levelCount}`, 44, 54);
    context.fillStyle = "#fff8e8";
    context.font = "900 46px system-ui, sans-serif";
    context.fillText(view.levelTitle, 44, 108);
    context.fillStyle = "#b9c6c9";
    context.font = "500 25px system-ui, sans-serif";
    context.fillText(view.levelSubtitle, 44, 142);

    const rowY = 190;
    const rowHeight = 70;
    view.evidence.slice(0, 3).forEach((item, index) => {
      const y = rowY + index * rowHeight;
      const color = statusColors[item.status];
      context.fillStyle = "rgba(255,255,255,0.045)";
      roundedRect(context, 38, y - 34, width - 76, 56, 18);
      context.fill();
      context.fillStyle = color;
      if (item.status === "pass") {
        context.fillRect(58, y - 18, 22, 22);
      } else if (item.status === "fail" || item.status === "regression") {
        context.save();
        context.translate(69, y - 7);
        context.rotate(Math.PI / 4);
        context.fillRect(-11, -11, 22, 22);
        context.restore();
      } else {
        context.beginPath();
        context.arc(69, y - 7, 12, 0, Math.PI * 2);
        context.strokeStyle = color;
        context.lineWidth = 6;
        context.stroke();
      }
      context.fillStyle = "#fff8e8";
      context.font = "700 29px system-ui, sans-serif";
      context.fillText(item.label, 100, y + 2);
      context.textAlign = "right";
      context.fillStyle = color;
      context.font = "900 27px system-ui, sans-serif";
      context.fillText(item.status.toUpperCase(), width - 54, y + 2);
      context.textAlign = "left";
    });
  });
}

function drawRuleLabel(panel: CanvasPanel, option: SceneRuleOption): void {
  panel.render((context) => {
    const { width, height } = panel.canvas;
    context.fillStyle = "#182630";
    roundedRect(context, 6, 6, width - 12, height - 12, 30);
    context.fill();
    context.strokeStyle = "#d8e2e4";
    context.lineWidth = 7;
    context.stroke();

    context.strokeStyle = "#76a9bb";
    context.fillStyle = "#76a9bb";
    context.lineWidth = 9;
    const top = 42;
    if (option.id === "broad") {
      for (const offset of [-42, 0, 42]) {
        context.beginPath();
        context.moveTo(width / 2 + offset - 18, top);
        context.lineTo(width / 2 + offset + 18, top);
        context.stroke();
      }
    } else if (option.id === "alternate") {
      for (const offset of [-42, 0, 42]) {
        context.beginPath();
        context.arc(width / 2 + offset, top, 8, 0, Math.PI * 2);
        context.fill();
      }
    } else {
      context.beginPath();
      context.moveTo(width / 2 - 55, top + 16);
      context.lineTo(width / 2 - 55, top - 14);
      context.lineTo(width / 2 - 24, top - 14);
      context.moveTo(width / 2 + 55, top + 16);
      context.lineTo(width / 2 + 55, top - 14);
      context.lineTo(width / 2 + 24, top - 14);
      context.stroke();
    }

    context.fillStyle = "#9fb3ba";
    context.font = "800 25px system-ui, sans-serif";
    context.textAlign = "center";
    context.fillText(
      option.id === "broad" ? "SCOPE A" : option.id === "alternate" ? "SCOPE B" : "SCOPE C",
      width / 2,
      84,
    );
    context.fillStyle = "#fff8e8";
    setFittedFont(context, option.label.toUpperCase(), width - 72, 43, 31, 900);
    wrapText(context, option.label.toUpperCase(), width / 2, 130, width - 72, 47, 2);
    context.fillStyle = "#b9c6c9";
    context.font = "650 27px system-ui, sans-serif";
    wrapText(context, option.scope, width / 2, height - 88, width - 74, 34, 2);
    context.textAlign = "left";
  });
}

function compactRouteLabel(label: string): string {
  return label
    .replace(/\b(service|school|fragile|heavy|active)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function drawRouteBadge(
  panel: CanvasPanel,
  label: string,
  status: SceneEvidenceStatus,
  result: string,
): void {
  panel.render((context) => {
    const { width, height } = panel.canvas;
    const color = statusColors[status];
    context.fillStyle = "rgba(12, 23, 31, 0.95)";
    roundedRect(context, 8, 8, width - 16, height - 16, 24);
    context.fill();
    context.strokeStyle = color;
    context.lineWidth = status === "regression" ? 10 : 7;
    if (status === "untested" || status === "stale") context.setLineDash([18, 12]);
    context.stroke();
    context.setLineDash([]);

    context.fillStyle = "#d5e0e2";
    setFittedFont(context, compactRouteLabel(label), width - 54, 27, 19, 750);
    context.textAlign = "center";
    context.fillText(compactRouteLabel(label), width / 2, 46);
    context.fillStyle = color;
    setFittedFont(context, result, width - 52, 46, 30, 950);
    context.fillText(result, width / 2, height - 26);
    context.textAlign = "left";
  });
}

function drawPriorPassBadge(panel: CanvasPanel): void {
  panel.render((context) => {
    const { width, height } = panel.canvas;
    context.fillStyle = "rgba(19, 36, 46, 0.92)";
    roundedRect(context, 8, 8, width - 16, height - 16, 20);
    context.fill();
    context.strokeStyle = "#76a9bb";
    context.lineWidth = 6;
    context.setLineDash([14, 9]);
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = "#d8e2e4";
    context.font = "900 34px system-ui, sans-serif";
    context.textAlign = "center";
    context.fillText("PRIOR PASS", width / 2, height / 2 + 12);
    context.textAlign = "left";
  });
}

function drawReleaseBadge(panel: CanvasPanel, campaignComplete: boolean): void {
  panel.render((context) => {
    const { width, height } = panel.canvas;
    context.shadowColor = "rgba(169, 220, 82, 0.5)";
    context.shadowBlur = 26;
    context.fillStyle = "rgba(13, 29, 31, 0.96)";
    roundedRect(context, 12, 12, width - 24, height - 24, 34);
    context.fill();
    context.shadowBlur = 0;
    context.strokeStyle = "#a9dc52";
    context.lineWidth = 9;
    context.stroke();
    context.fillStyle = "#a9dc52";
    context.font = "950 54px system-ui, sans-serif";
    context.textAlign = "center";
    context.fillText(campaignComplete ? "4 DISTRICTS VERIFIED" : "DISTRICT VERIFIED", width / 2, 82);
    context.fillStyle = "#fff8e8";
    context.font = "800 32px system-ui, sans-serif";
    context.fillText(
      campaignComplete ? "NO REGRESSIONS • RELEASE EARNED" : "3 / 3 CURRENT TESTS • RELEASE EARNED",
      width / 2,
      132,
    );
    context.textAlign = "left";
  });
}

function createParticles(
  count: number,
  color: number,
  size: number,
  range: readonly [number, number, number],
): Points {
  const positions = new Float32Array(count * 3);
  let seed = (count * 2654435761 + Math.round(range[0] * 97)) >>> 0;
  const random = (): number => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (random() - 0.5) * range[0];
    positions[index * 3 + 1] = random() * range[1];
    positions[index * 3 + 2] = (random() - 0.5) * range[2];
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  const material = new PointsMaterial({
    color,
    size,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const points = new Points(geometry, material);
  points.frustumCulled = false;
  return points;
}

export function createKaijuQaScene(
  world: World,
  { onIntent, onInvalidDrop, reducedMotion: initialReducedMotion }: CreateKaijuQaSceneOptions,
): KaijuQaScene {
  const ownedEntities: Entity[] = [];
  const ownedGeometries: BufferGeometry[] = [];
  const ownedMaterials: Array<MeshStandardMaterial | MeshPhysicalMaterial | MeshBasicMaterial | PointsMaterial> = [];
  const importedMaterials: MeshStandardMaterial[] = [];
  const panels: CanvasPanel[] = [];
  const metas: ManipulationMeta[] = [];
  const callouts: DraggableCallout<ScenePointerEvent>[] = [];

  const ownGeometry = <T extends BufferGeometry>(geometry: T): T => {
    ownedGeometries.push(geometry);
    return geometry;
  };
  const ownMaterial = <T extends MeshStandardMaterial | MeshPhysicalMaterial | MeshBasicMaterial | PointsMaterial>(material: T): T => {
    ownedMaterials.push(material);
    return material;
  };

  const materials = {
    bench: ownMaterial(standardMaterial(palette.bench, { roughness: 0.82 })),
    edge: ownMaterial(standardMaterial(palette.benchEdge, { roughness: 0.5, metalness: 0.18 })),
    road: ownMaterial(standardMaterial(palette.road, { roughness: 0.78 })),
    teal: ownMaterial(standardMaterial(palette.teal)),
    cyan: ownMaterial(standardMaterial(palette.cyan, { emissive: palette.cyan, emissiveIntensity: 0.32 })),
    yellow: ownMaterial(standardMaterial(palette.yellow, { roughness: 0.5 })),
    lime: ownMaterial(standardMaterial(palette.lime, { emissive: palette.lime, emissiveIntensity: 0.2 })),
    coral: ownMaterial(standardMaterial(palette.coral, { emissive: palette.coral, emissiveIntensity: 0.2 })),
    slate: ownMaterial(standardMaterial(palette.slate)),
    blue: ownMaterial(standardMaterial(palette.blue, { roughness: 0.42 })),
    purple: ownMaterial(standardMaterial(palette.purple, { roughness: 0.42 })),
    white: ownMaterial(standardMaterial(palette.white, { roughness: 0.74 })),
    cartridge: ownMaterial(standardMaterial(0x60717a, { roughness: 0.5, metalness: 0.12 })),
    cartridgeMark: ownMaterial(standardMaterial(0xc8d5d8, { roughness: 0.44 })),
    trainingGround: ownMaterial(standardMaterial(0xe7d5ae, { roughness: 0.86 })),
    schoolGround: ownMaterial(standardMaterial(0xc7ddd2, { roughness: 0.86 })),
    stormGround: ownMaterial(standardMaterial(0x536675, { roughness: 0.72 })),
    water: ownMaterial(new MeshPhysicalMaterial({
      color: 0x3a8db8,
      roughness: 0.25,
      metalness: 0,
      transmission: 0.08,
      transparent: true,
      opacity: 0.88,
    })),
    ghost: ownMaterial(standardMaterial(palette.cyan, {
      emissive: palette.cyan,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.24,
    })),
  };

  const traceMaterials = {
    pass: ownMaterial(new MeshBasicMaterial({
      color: palette.lime,
      depthTest: true,
      depthWrite: false,
      toneMapped: false,
    })),
    fail: ownMaterial(new MeshBasicMaterial({
      color: palette.coral,
      depthTest: true,
      depthWrite: false,
      toneMapped: false,
    })),
    active: ownMaterial(new MeshBasicMaterial({
      color: palette.cyan,
      depthTest: true,
      depthWrite: false,
      toneMapped: false,
    })),
    stale: ownMaterial(new MeshBasicMaterial({
      color: palette.yellow,
      depthTest: true,
      depthWrite: false,
      toneMapped: false,
    })),
    neutral: ownMaterial(new MeshBasicMaterial({
      color: 0x71848d,
      depthTest: true,
      depthWrite: false,
      toneMapped: false,
    })),
    prior: ownMaterial(new MeshBasicMaterial({
      color: 0x76a9bb,
      transparent: true,
      opacity: 0.72,
      depthTest: true,
      depthWrite: false,
      toneMapped: false,
    })),
  };

  const root = new Group();
  root.name = "KaijuQaToyLab";
  root.position.copy(DESKTOP_ROOT_HOME);
  const rootEntity = world.createTransformEntity(root);
  let rootHomeParent: Object3D | null = null;
  ownedEntities.push(rootEntity);

  const detachRootFromAnchor = (): void => {
    const anchored = rootEntity.hasComponent(XRAnchor);
    if (!anchored && !rootHomeParent && root.parent) rootHomeParent = root.parent;
    if (anchored) rootEntity.removeComponent(XRAnchor);
    const destination = rootHomeParent ?? world.scene;
    if (root.parent !== destination) destination.attach(root);
  };

  const table = new Group();
  const edge = mesh(
    ownGeometry(new BoxGeometry(TABLE_WIDTH, 0.18, TABLE_DEPTH)),
    materials.edge,
  );
  edge.position.y = -0.12;
  const surface = mesh(
    ownGeometry(new BoxGeometry(TABLE_WIDTH - 0.16, 0.12, TABLE_DEPTH - 0.16)),
    materials.bench,
  );
  surface.position.y = -0.02;
  table.add(edge, surface);
  root.add(table);

  const backdropTexture = AssetManager.getTexture("labBackdrop");
  if (!backdropTexture) throw new Error("Kaiju QA lab backdrop was not preloaded");
  backdropTexture.colorSpace = SRGBColorSpace;
  backdropTexture.repeat.set(1, 0.78);
  backdropTexture.offset.set(0, 0.11);
  backdropTexture.needsUpdate = true;
  const backdropMaterial = ownMaterial(new MeshBasicMaterial({
    map: backdropTexture,
    side: DoubleSide,
    toneMapped: false,
  }));
  const backdrop = mesh(ownGeometry(new PlaneGeometry(8.28, 4.3)), backdropMaterial);
  backdrop.position.set(0, 1.82, -1.76);
  backdrop.renderOrder = -20;
  root.add(backdrop);

  const labDressing = new Group();
  const leftCrane = cloneAsset("labRobotArmA");
  prepareImportedModel(leftCrane, importedMaterials, 0.54);
  fitObject(leftCrane, 0.8);
  leftCrane.position.set(-2.04, 0.02, -0.38);
  leftCrane.rotation.y = 0.52;
  const rightCrane = cloneAsset("labRobotArmB");
  prepareImportedModel(rightCrane, importedMaterials, 0.54);
  fitObject(rightCrane, 0.78);
  rightCrane.position.set(2.04, 0.02, -0.4);
  rightCrane.rotation.y = -0.58;
  const scanner = cloneAsset("labScanner");
  prepareImportedModel(scanner, importedMaterials, 0.5);
  fitObject(scanner, 0.42);
  scanner.position.set(-2.03, 0.02, 0.68);
  scanner.rotation.y = 0.28;
  const screen = cloneAsset("labScreen");
  prepareImportedModel(screen, importedMaterials, 0.46);
  fitObject(screen, 0.38);
  screen.position.set(2.03, 0.02, 0.62);
  screen.rotation.y = -0.25;
  labDressing.add(leftCrane, rightCrane, scanner, screen);
  root.add(labDressing);

  const districts: Record<SceneLevelId, Group> = {
    "training-yard": new Group(),
    "school-crossing": new Group(),
    "harbor-load": new Group(),
    "storm-shift": new Group(),
  };

  const buildingColors: Readonly<Record<string, number>> = {
    cityHospital: 0x65bdb0,
    cityFlat: 0xd98263,
    cityHouse: 0xe2b84f,
    cityShop: 0x4e9db2,
  };

  const makeBuilding = (key: string, size: number, x: number, z: number, rotation = 0): Group => {
    const model = cloneAsset(key);
    prepareImportedModel(model, importedMaterials);
    fitObject(model, size);
    model.position.set(x, 0.02, z);
    model.rotation.y = rotation;
    // The city pack shares a pale texture atlas. Multiplying its cloned
    // materials by a semantic building color keeps the authored texture/window
    // detail while restoring the district's readable color coding.
    tintModel(model, buildingColors[key] ?? palette.white);
    addWindowGlow(model, palette.yellow);
    return model;
  };

  const makeVehicle = (
    key: "vehicleCar" | "vehicleSuv" | "vehicleEmergency",
    size: number,
    x: number,
    z: number,
    rotation = Math.PI / 2,
  ): Group => {
    const model = cloneAsset(key);
    // The Quaternius vehicle export marks every otherwise-opaque material as
    // alpha-masked with opacity zero. Repair only these vehicle clones so real
    // transparent materials elsewhere retain their authored behavior.
    prepareImportedModel(model, importedMaterials, 0.5, true);
    fitObject(model, size);
    model.position.set(x, 0.035, z);
    model.rotation.y = rotation;
    model.userData.role = "district-scenery";
    return model;
  };

  const makeRoad = (width: number, depth: number, rotation = 0): Mesh => {
    const road = mesh(ownGeometry(new BoxGeometry(width, 0.035, depth)), materials.road);
    road.position.y = 0.02;
    road.rotation.y = rotation;
    return road;
  };

  const training = districts["training-yard"];
  const trainingFloor = mesh(
    ownGeometry(new BoxGeometry(3.08, 0.024, 1.55)),
    materials.trainingGround,
  );
  trainingFloor.position.y = 0.004;
  training.add(trainingFloor);
  training.add(makeRoad(2.45, 0.42, -0.18));
  training.add(makeBuilding("cityHospital", 0.56, -1.05, -0.54, 0.12));
  training.add(makeBuilding("cityFlat", 0.46, 1.02, -0.54, -0.08));
  training.add(makeBuilding("cityHouse", 0.4, 1.23, 0.32, -0.2));
  training.add(makeBuilding("cityShop", 0.36, -1.18, 0.24, 0.16));
  training.add(makeVehicle("vehicleSuv", 0.5, 0.7, -0.18));
  for (const x of [-1.34, 1.34]) {
    const warning = cloneAsset("labWarning");
    prepareImportedModel(warning, importedMaterials, 0.58);
    fitObject(warning, 0.2);
    warning.position.set(x, 0.02, 0.55);
    warning.rotation.y = x < 0 ? 0.2 : -0.2;
    training.add(warning);
  }

  const school = districts["school-crossing"];
  const schoolFloor = mesh(
    ownGeometry(new BoxGeometry(3.08, 0.024, 1.55)),
    materials.schoolGround,
  );
  schoolFloor.position.y = 0.004;
  school.add(schoolFloor);
  school.add(makeRoad(2.5, 0.48, 0));
  school.add(makeBuilding("cityFlat", 0.5, -1.1, -0.5, 0.1));
  school.add(makeBuilding("cityHouse", 0.42, 1.05, -0.48, -0.08));
  school.add(makeBuilding("cityShop", 0.37, -1.16, 0.35, 0.14));
  school.add(makeVehicle("vehicleEmergency", 0.48, 0.78, -0.18));
  const schoolTree = new Group();
  const schoolTreeTrunk = mesh(
    ownGeometry(new CylinderGeometry(0.035, 0.048, 0.24, 8)),
    materials.edge,
  );
  schoolTreeTrunk.position.y = 0.12;
  schoolTree.add(schoolTreeTrunk);
  for (const [x, y, z, scale] of [
    [0, 0.3, 0, 1],
    [-0.08, 0.28, 0.01, 0.72],
    [0.07, 0.29, -0.025, 0.78],
  ] as const) {
    const crown = mesh(ownGeometry(new SphereGeometry(0.13, 10, 8)), materials.teal);
    crown.position.set(x, y, z);
    crown.scale.setScalar(scale);
    schoolTree.add(crown);
  }
  schoolTree.position.set(1.15, 0.02, 0.36);
  school.add(schoolTree);
  const schoolYard = mesh(ownGeometry(new BoxGeometry(0.82, 0.025, 0.48)), materials.blue);
  schoolYard.position.set(0.82, 0.02, 0.38);
  school.add(schoolYard);
  for (let index = 0; index < 4; index += 1) {
    const fencePost = mesh(ownGeometry(new BoxGeometry(0.035, 0.18, 0.035)), materials.white);
    fencePost.position.set(0.51 + index * 0.2, 0.11, 0.62);
    school.add(fencePost);
  }

  const harbor = districts["harbor-load"];
  const water = mesh(ownGeometry(new BoxGeometry(3.2, 0.025, 1.72)), materials.water);
  water.position.y = 0.012;
  const dock = mesh(ownGeometry(new BoxGeometry(2.25, 0.09, 0.64)), materials.edge);
  dock.position.set(-0.35, 0.06, 0.25);
  const harborCrane = cloneAsset("labCraneMagnet");
  prepareImportedModel(harborCrane, importedMaterials, 0.54);
  fitObject(harborCrane, 0.78);
  harborCrane.position.set(1.1, 0.08, -0.35);
  harborCrane.rotation.y = -0.4;
  harbor.add(water, dock, harborCrane);

  const storm = districts["storm-shift"];
  const stormFloor = mesh(
    ownGeometry(new BoxGeometry(3.08, 0.024, 1.55)),
    materials.stormGround,
  );
  stormFloor.position.y = 0.004;
  storm.add(stormFloor);
  storm.add(makeRoad(2.5, 0.5, -0.12));
  storm.add(makeBuilding("cityHospital", 0.54, -1.08, -0.52, 0.1));
  storm.add(makeBuilding("cityFlat", 0.45, 1.08, -0.5, -0.12));
  storm.add(makeBuilding("cityHouse", 0.39, 1.2, 0.36, -0.18));
  storm.add(makeBuilding("cityShop", 0.35, -1.15, 0.34, 0.16));
  storm.add(makeVehicle("vehicleEmergency", 0.46, -0.72, -0.18));
  for (const [x, z, scale] of [
    [-0.78, 0.34, 1],
    [0.63, -0.1, 0.78],
    [0.95, 0.4, 0.64],
  ] as const) {
    const puddle = mesh(ownGeometry(new CylinderGeometry(0.18, 0.21, 0.012, 24)), materials.water);
    puddle.position.set(x, 0.025, z);
    puddle.scale.set(scale, 1, scale * 0.62);
    storm.add(puddle);
  }
  const stormBeacon = cloneAsset("labIndicatorArrow");
  prepareImportedModel(stormBeacon, importedMaterials, 0.52);
  fitObject(stormBeacon, 0.48);
  stormBeacon.position.set(1.3, 0.02, 0.42);
  stormBeacon.rotation.y = -0.45;
  storm.add(stormBeacon);

  Object.values(districts).forEach((group) => {
    group.visible = false;
    root.add(group);
  });

  const socketMaterial = materials.cyan;
  const propSocket = new Group();
  const propSocketRing = mesh(ownGeometry(new TorusGeometry(0.27, 0.025, 10, 48)), socketMaterial);
  propSocketRing.rotation.x = Math.PI / 2;
  propSocketRing.position.y = 0.035;
  const propGhost = mesh(ownGeometry(new CylinderGeometry(0.19, 0.22, 0.022, 18)), materials.ghost);
  propGhost.position.y = 0.03;
  propSocket.add(propSocketRing, propGhost);
  root.add(propSocket);

  const ruleFixture = createRuleRack({
    ownGeometry,
    ownMaterial,
    colors: {
      frame: palette.benchEdge,
      slot: 0x60717a,
      marker: 0xc8d5d8,
      dock: palette.benchEdge,
      dockAccent: palette.cyan,
    },
  });
  const ruleSocket = ruleFixture.installationDock;
  const ruleSocketGlow = ruleSocket.getObjectByName(
    "rule-installation-dock-pad",
  ) as Mesh;
  root.add(ruleFixture.root);

  const evidenceDesktopHome = new Vector3(1.18, 0.92, -0.94);
  const evidenceMobileHome = new Vector3(0.68, 0.72, -0.94);
  const evidencePanel = createCanvasPanel(1.56, 0.78, 1024);
  evidencePanel.mesh.name = "evidence-card";
  panels.push(evidencePanel);
  evidencePanel.mesh.position.copy(evidenceDesktopHome);
  evidencePanel.mesh.rotation.x = -0.08;
  root.add(evidencePanel.mesh);

  const speechDesktopHome = new Vector3(-1.18, 0.96, -0.2);
  const speechMobileHome = new Vector3(-0.68, 1.02, -0.2);
  const speechPanel = createCanvasPanel(1.62, 0.64, 1024);
  speechPanel.mesh.name = "instruction-card";
  panels.push(speechPanel);
  speechPanel.mesh.position.copy(speechDesktopHome);
  root.add(speechPanel.mesh);

  const tutorialArrow = new Group();
  const tutorialArrowModel = cloneAsset("labArrow");
  prepareImportedModel(tutorialArrowModel, importedMaterials, 0.46);
  fitObject(tutorialArrowModel, 0.32);
  tintModel(tutorialArrowModel, palette.yellow);
  tutorialArrowModel.rotation.z = Math.PI / 2;
  tutorialArrow.add(tutorialArrowModel);
  tutorialArrow.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    child.renderOrder = 30;
    const arrowMaterials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    for (const material of arrowMaterials) {
      material.depthTest = false;
      if (material instanceof MeshStandardMaterial) {
        material.emissive.setHex(palette.yellow);
        material.emissiveIntensity = 0.48;
      }
    }
  });
  tutorialArrow.visible = false;
  root.add(tutorialArrow);

  const destinationArrow = new Group();
  // The cyan socket/rack already provides a strong destination cue. Retain an
  // empty compatibility group for the existing placement/update lifecycle, but
  // render only the authored source arrow so nearby source/destination points
  // cannot project as a doubled arrow from the player's camera.
  destinationArrow.visible = false;
  root.add(destinationArrow);

  const kaijuAsset = AssetManager.getGLTF("kaiju");
  if (!kaijuAsset) throw new Error("Kaiju character asset was not preloaded");
  const kaijuModel = kaijuAsset.scene;
  prepareImportedModel(kaijuModel, importedMaterials, 0.62);
  fitObject(kaijuModel, 0.93);
  // Preserve the authored Quaternius Dino materials and face. Earlier custom
  // recoloring plus separate procedural eyes and a helmet created a visibly
  // detached mask whenever the animated head bone moved.
  const kaiju = new Group();
  kaiju.add(kaijuModel);
  kaiju.position.set(0.03, 0.035, 0.04);
  kaiju.rotation.y = 0;
  root.add(kaiju);

  const mixer = new AnimationMixer(kaijuModel);
  const actions = new Map<string, AnimationAction>();
  for (const clip of kaijuAsset.animations) {
    actions.set(clip.name.toLowerCase(), mixer.clipAction(clip));
  }
  let activeAction: AnimationAction | null = null;
  let activeActionName = "";
  const oneShotActions = new Set(["hitreact", "no", "yes", "wave", "jump_land"]);
  const playAction = (name: string, fade = 0.22) => {
    const normalizedName = actions.has(name.toLowerCase()) ? name.toLowerCase() : "idle";
    const action = actions.get(normalizedName);
    if (!action || action === activeAction) return;
    action.reset();
    action.clampWhenFinished = oneShotActions.has(normalizedName);
    if (action.clampWhenFinished) action.setLoop(LoopOnce, 1);
    action.play();
    if (activeAction) activeAction.crossFadeTo(action, fade, false);
    activeAction = action;
    activeActionName = normalizedName;
  };
  mixer.addEventListener("finished", (event) => {
    if (event.action !== activeAction || !oneShotActions.has(activeActionName)) return;
    // Keep the finished action as the cross-fade source. Clearing it first
    // leaves a clamped weight behind and lets reaction poses accumulate.
    playAction("idle", 0.18);
  });
  playAction("idle", 0);

  const dust = createParticles(90, 0xffd589, 0.012, [3.4, 1.5, 1.8]);
  dust.position.y = 0.1;
  root.add(dust);
  const rain = createParticles(180, 0x79c8ff, 0.014, [3.1, 1.5, 1.8]);
  rain.position.y = 0.04;
  rain.visible = false;
  root.add(rain);
  const celebration = createParticles(120, palette.yellow, 0.022, [1.8, 1.0, 1.1]);
  celebration.position.y = 0.15;
  celebration.visible = false;
  root.add(celebration);
  const contact = createParticles(28, palette.coral, 0.032, [0.42, 0.38, 0.42]);
  contact.position.set(0.62, 0.22, -0.05);
  contact.visible = false;
  root.add(contact);
  [dust, rain, celebration, contact].forEach((points) => {
    ownedGeometries.push(points.geometry);
    ownedMaterials.push(points.material as PointsMaterial);
  });

  const releaseCelebration = new Group();
  const releaseRing = mesh(
    ownGeometry(new TorusGeometry(0.48, 0.025, 10, 64)),
    traceMaterials.pass,
  );
  releaseRing.rotation.x = Math.PI / 2;
  releaseRing.position.y = 0.055;
  releaseRing.castShadow = false;
  releaseRing.receiveShadow = false;
  releaseRing.renderOrder = 18;
  releaseCelebration.add(releaseRing);
  for (let index = 0; index < 12; index += 1) {
    const angle = (index / 12) * Math.PI * 2;
    const ray = mesh(
      ownGeometry(new BoxGeometry(0.14, 0.025, 0.035)),
      index % 2 === 0 ? traceMaterials.pass : traceMaterials.active,
    );
    ray.position.set(Math.cos(angle) * 0.62, 0.075, Math.sin(angle) * 0.62);
    ray.rotation.y = -angle;
    ray.castShadow = false;
    ray.receiveShadow = false;
    ray.renderOrder = 18;
    releaseCelebration.add(ray);
  }
  for (const x of [-1.24, -0.42, 0.42, 1.24]) {
    const beacon = new Group();
    const post = mesh(ownGeometry(new CylinderGeometry(0.026, 0.034, 0.24, 10)), materials.edge);
    post.position.y = 0.12;
    const lamp = mesh(ownGeometry(new SphereGeometry(0.065, 14, 10)), materials.lime);
    lamp.position.y = 0.28;
    beacon.position.set(x, 0.02, -0.67);
    beacon.add(post, lamp);
    releaseCelebration.add(beacon);
  }
  releaseCelebration.visible = false;
  root.add(releaseCelebration);

  const releaseBadge = createCanvasPanel(1.08, 0.28, 1024);
  releaseBadge.mesh.name = "release-card";
  panels.push(releaseBadge);
  releaseBadge.mesh.position.set(0, 0.82, 0.44);
  releaseBadge.mesh.rotation.x = -0.08;
  releaseBadge.mesh.material.depthTest = false;
  releaseBadge.mesh.renderOrder = 35;
  releaseBadge.mesh.visible = false;
  root.add(releaseBadge.mesh);

  const releaseConnectorTarget = new Group();
  releaseConnectorTarget.position.set(2.02, 0.36, 0.12);
  root.add(releaseConnectorTarget);
  const evidenceConnectorTarget = new Group();
  evidenceConnectorTarget.position.set(0.45, 0.3, -0.05);
  root.add(evidenceConnectorTarget);

  const createPanelCallout = (
    panel: CanvasPanel,
    target: Object3D,
    home: Vector3,
    localSpace: Object3D = root,
    entityParent: Entity = rootEntity,
    bounds: {
      readonly min: { readonly x: number; readonly y: number; readonly z: number };
      readonly max: { readonly x: number; readonly y: number; readonly z: number };
    } = {
      min: { x: -2.12, y: 0.54, z: -1.18 },
      max: { x: 2.12, y: 1.78, z: 1.16 },
    },
  ): DraggableCallout<ScenePointerEvent> => {
    panel.mesh.intersectChildren = true;
    const panelEntity = world.createTransformEntity(panel.mesh, { parent: entityParent });
    panelEntity.addComponent(RayInteractable);
    ownedEntities.push(panelEntity);
    pointerEvents(panel.mesh, true);
    const currentRay = (pointerEvent: ScenePointerEvent): Ray => {
      if (pointerEvent.pointerType.startsWith("screen") && pointerEvent.pointer) {
        tmpPointer.copy(pointerEvent.pointer);
        world.camera.updateMatrixWorld(true);
        tmpScreenOrigin.setFromMatrixPosition(world.camera.matrixWorld);
        tmpScreenDirection
          .set(tmpPointer.x, tmpPointer.y, 0.5)
          .unproject(world.camera)
          .sub(tmpScreenOrigin)
          .normalize();
        return tmpScreenRay.set(tmpScreenOrigin, tmpScreenDirection);
      }
      return pointerEvent.ray;
    };
    const controller = createDraggableCallout<ScenePointerEvent>({
      card: panel.mesh,
      camera: world.camera,
      localSpace,
      home: { x: home.x, y: home.y, z: home.z },
      bounds,
      target,
      getRay: (event) => currentRay(event),
      reducedMotion: initialReducedMotion,
      connector: {
        parent: localSpace,
        color: 0x62e2ef,
        opacity: 0.68,
        depthTest: true,
        renderOrder: 18,
      },
      capturePointer: (pointerId) => {
        (panel.mesh as CapturableObject).setPointerCapture(pointerId);
      },
      releasePointer: (pointerId) => {
        const capturable = panel.mesh as CapturableObject;
        if (capturable.hasPointerCapture(pointerId)) {
          capturable.releasePointerCapture(pointerId);
        }
      },
    });
    panel.mesh.addEventListener("pointerdown", controller.pointerDown);
    panel.mesh.addEventListener("pointermove", controller.pointerMove);
    panel.mesh.addEventListener("pointerup", controller.pointerUp);
    panel.mesh.addEventListener("pointercancel", controller.pointerCancel);
    callouts.push(controller);
    return controller;
  };

  const speechCallout = createPanelCallout(
    speechPanel,
    tutorialArrow,
    speechDesktopHome,
  );
  const evidenceCallout = createPanelCallout(
    evidencePanel,
    evidenceConnectorTarget,
    evidenceDesktopHome,
  );
  const releaseCallout = createPanelCallout(
    releaseBadge,
    releaseConnectorTarget,
    releaseBadge.mesh.position.clone(),
  );
  let compactPanelLayout = false;
  const updateResponsiveCallouts = (force = false): void => {
    const nextCompact = world.camera.aspect < 0.82;
    if (!force && nextCompact === compactPanelLayout) return;
    compactPanelLayout = nextCompact;
    const speechHome = nextCompact ? speechMobileHome : speechDesktopHome;
    const evidenceHome = nextCompact ? evidenceMobileHome : evidenceDesktopHome;
    speechPanel.mesh.scale.setScalar(nextCompact ? 0.76 : 1);
    evidencePanel.mesh.scale.setScalar(nextCompact ? 0.76 : 1);
    speechCallout.setHome(speechHome, true);
    evidenceCallout.setHome(evidenceHome, true);
  };
  updateResponsiveCallouts(true);

  const contactStar = new Group();
  for (const rotation of [0, Math.PI / 4, Math.PI / 2, -Math.PI / 4]) {
    const ray = mesh(
      ownGeometry(new BoxGeometry(0.24, 0.035, 0.032)),
      traceMaterials.fail,
    );
    ray.rotation.z = rotation;
    ray.castShadow = false;
    ray.receiveShadow = false;
    contactStar.add(ray);
  }
  contactStar.position.y = 0.28;
  contactStar.visible = false;
  root.add(contactStar);

  const serviceCar = new Group();
  const serviceCarModel = cloneAsset("vehicleCar");
  prepareImportedModel(serviceCarModel, importedMaterials, 0.58, true);
  // This is the player's first prop and must read clearly against the pale
  // tabletop from both its home ring and the street socket.
  fitObject(serviceCarModel, 0.64);
  serviceCarModel.rotation.y = Math.PI / 2;
  serviceCar.add(serviceCarModel);

  const makeAuthoredProp = (
    key: "cityFlat" | "labConveyor" | "labMachine" | "labIndicatorCross",
    size: number,
    rotation = 0,
  ): Group => {
    const prop = new Group();
    const model = cloneAsset(key);
    prepareImportedModel(model, importedMaterials, 0.54);
    fitObject(model, size);
    model.rotation.y = rotation;
    prop.add(model);
    return prop;
  };

  const fragileTower = makeAuthoredProp("cityFlat", 0.62, 0.08);
  tintModel(fragileTower, buildingColors.cityFlat);
  for (const x of [-0.22, 0.22]) {
    const warning = cloneAsset("labWarning");
    prepareImportedModel(warning, importedMaterials, 0.55);
    fitObject(warning, 0.17);
    warning.position.set(x, 0, 0.1);
    fragileTower.add(warning);
  }

  const propObjects: Record<ScenePropId, Group> = {
    car: serviceCar,
    tower: fragileTower,
    crosswalk: makeAuthoredProp("labConveyor", 0.46, Math.PI / 2),
    "heavy-cargo": makeAuthoredProp("labMachine", 0.58, -0.18),
    "rain-module": makeAuthoredProp("labIndicatorCross", 0.54, 0.12),
  };

  const rulePanels = new Map<SceneRuleId, CanvasPanel>();
  const ruleObjects = new Map<SceneRuleId, Group>();

  for (const id of ["broad", "alternate", "targeted"] as const) {
    const cartridge = new Group();
    const body = mesh(ownGeometry(new BoxGeometry(0.5, 0.17, 0.31)), materials.cartridge);
    body.position.y = 0.08;
    const handle = mesh(ownGeometry(new CylinderGeometry(0.055, 0.055, 0.34, 16)), materials.edge);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0, 0.19, -0.1);

    if (id === "broad") {
      for (const x of [-0.14, 0, 0.14]) {
        const band = mesh(ownGeometry(new BoxGeometry(0.045, 0.03, 0.29)), materials.cartridgeMark);
        band.position.set(x, 0.175, -0.005);
        cartridge.add(band);
      }
    } else if (id === "alternate") {
      for (const x of [-0.14, 0, 0.14]) {
        const stud = mesh(ownGeometry(new CylinderGeometry(0.035, 0.035, 0.028, 14)), materials.cartridgeMark);
        stud.position.set(x, 0.18, 0);
        cartridge.add(stud);
      }
    } else {
      for (const x of [-0.19, 0.19]) {
        const rail = mesh(ownGeometry(new BoxGeometry(0.035, 0.035, 0.27)), materials.cartridgeMark);
        rail.position.set(x, 0.18, 0);
        cartridge.add(rail);
      }
    }

    const panel = createCanvasPanel(0.5, 0.25, 720);
    panels.push(panel);
    panel.mesh.rotation.x = -0.72;
    panel.mesh.position.set(0, 0.245, 0.13);
    panel.mesh.material.depthTest = false;
    panel.mesh.renderOrder = 28;
    cartridge.add(body, handle, panel.mesh);
    rulePanels.set(id, panel);
    ruleObjects.set(id, cartridge);
  }

  const propHome = new Vector3(-0.72, 0.055, 0.87);
  const propTargets: Record<ScenePropId, Vector3> = {
    car: new Vector3(-0.82, 0.055, 0.28),
    tower: new Vector3(0.68, 0.055, -0.08),
    crosswalk: new Vector3(0.02, 0.055, 0.02),
    "heavy-cargo": new Vector3(0.22, 0.055, 0.22),
    "rain-module": new Vector3(-0.02, 0.055, 0.02),
  };
  const ruleHomes: Record<SceneRuleId, Vector3> = {
    broad: ruleFixture.cartridgeHomes.broad.clone(),
    alternate: ruleFixture.cartridgeHomes.alternate.clone(),
    targeted: ruleFixture.cartridgeHomes.targeted.clone(),
  };
  const ruleTarget = ruleFixture.installationDockLocation.clone();

  type RouteKey = "established-a" | "established-b" | "hazard";
  interface RouteVisual {
    readonly key: RouteKey;
    readonly group: Group;
    readonly currentSegments: Mesh[];
    readonly priorSegments: Mesh[];
    readonly marker: Group;
    readonly markerStates: Readonly<{
      pass: Group;
      fail: Group;
      blocked: Group;
      late: Group;
      neutral: Group;
      stale: Group;
    }>;
    readonly badge: CanvasPanel;
    readonly priorBadge: CanvasPanel;
    readonly actor: Group | null;
  }

  const routeLayouts: Readonly<Record<SceneLevelId, Readonly<Record<RouteKey, readonly Vector3[]>>>> = {
    "training-yard": {
      "established-a": [
        new Vector3(-1.28, 0, 0.42),
        new Vector3(-0.72, 0, 0.34),
        new Vector3(-0.08, 0, 0.31),
        new Vector3(0.9, 0, 0.34),
      ],
      "established-b": [
        new Vector3(-1.28, 0, -0.3),
        new Vector3(-0.62, 0, -0.32),
        new Vector3(0.12, 0, -0.42),
        new Vector3(1.02, 0, -0.38),
      ],
      hazard: [
        new Vector3(-0.02, 0, 0.16),
        new Vector3(0.28, 0, 0.08),
        new Vector3(0.68, 0, -0.08),
      ],
    },
    "school-crossing": {
      "established-a": [
        new Vector3(-1.3, 0, 0.4),
        new Vector3(-0.6, 0, 0.3),
        new Vector3(0.08, 0, 0.25),
        new Vector3(0.96, 0, 0.28),
      ],
      "established-b": [
        new Vector3(-1.28, 0, -0.33),
        new Vector3(-0.5, 0, -0.35),
        new Vector3(0.2, 0, -0.38),
        new Vector3(1.04, 0, -0.32),
      ],
      hazard: [
        new Vector3(-0.48, 0, 0.06),
        new Vector3(-0.16, 0, 0.02),
        new Vector3(0.02, 0, 0.02),
      ],
    },
    "harbor-load": {
      "established-a": [
        new Vector3(-1.28, 0, -0.4),
        new Vector3(-0.68, 0, -0.24),
        new Vector3(-0.12, 0, 0.08),
        new Vector3(0.92, 0, 0.3),
      ],
      "established-b": [
        new Vector3(-1.24, 0, 0.48),
        new Vector3(-0.48, 0, 0.42),
        new Vector3(0.08, 0, 0.2),
        new Vector3(0.92, 0, -0.22),
      ],
      hazard: [
        new Vector3(0.96, 0, -0.34),
        new Vector3(0.56, 0, -0.08),
        new Vector3(0.22, 0, 0.22),
      ],
    },
    "storm-shift": {
      "established-a": [
        new Vector3(-1.28, 0, 0.4),
        new Vector3(-0.66, 0, 0.32),
        new Vector3(-0.08, 0, 0.24),
        new Vector3(0.92, 0, 0.3),
      ],
      "established-b": [
        new Vector3(-1.28, 0, -0.34),
        new Vector3(-0.54, 0, -0.37),
        new Vector3(0.12, 0, -0.43),
        new Vector3(1.02, 0, -0.36),
      ],
      hazard: [
        new Vector3(-0.46, 0, 0.08),
        new Vector3(-0.2, 0, 0.04),
        new Vector3(-0.02, 0, 0.02),
      ],
    },
  };

  const pathPoint = (
    points: readonly Vector3[],
    fraction: number,
    target: Vector3,
    tangent?: Vector3,
  ): Vector3 => {
    const clamped = MathUtils.clamp(fraction, 0, 1);
    let total = 0;
    const lengths: number[] = [];
    for (let index = 0; index < points.length - 1; index += 1) {
      const length = points[index].distanceTo(points[index + 1]);
      lengths.push(length);
      total += length;
    }
    let remaining = total * clamped;
    for (let index = 0; index < lengths.length; index += 1) {
      const length = lengths[index];
      if (remaining <= length || index === lengths.length - 1) {
        const amount = length > 0 ? MathUtils.clamp(remaining / length, 0, 1) : 0;
        target.lerpVectors(points[index], points[index + 1], amount);
        tangent?.copy(points[index + 1]).sub(points[index]).normalize();
        return target;
      }
      remaining -= length;
    }
    target.copy(points[points.length - 1]);
    tangent?.copy(points[points.length - 1]).sub(points[points.length - 2]).normalize();
    return target;
  };

  const routeSegmentGeometry = ownGeometry(new BoxGeometry(1, 0.02, 0.06));
  const priorSegmentGeometry = ownGeometry(new BoxGeometry(1, 0.014, 0.034));
  const routeSegmentCount = 11;
  const segmentStart = new Vector3();
  const segmentEnd = new Vector3();
  const routeTangent = new Vector3();

  const createResultMarker = () => {
    const marker = new Group();
    const pass = new Group();
    const passShort = mesh(ownGeometry(new BoxGeometry(0.13, 0.04, 0.032)), traceMaterials.pass);
    passShort.position.set(-0.045, -0.025, 0);
    passShort.rotation.z = -0.68;
    const passLong = mesh(ownGeometry(new BoxGeometry(0.23, 0.04, 0.032)), traceMaterials.pass);
    passLong.position.set(0.055, 0.018, 0);
    passLong.rotation.z = 0.55;
    pass.add(passShort, passLong);

    const fail = new Group();
    for (const rotation of [-Math.PI / 4, Math.PI / 4]) {
      const bar = mesh(ownGeometry(new BoxGeometry(0.25, 0.045, 0.034)), traceMaterials.fail);
      bar.rotation.z = rotation;
      fail.add(bar);
    }

    const blocked = new Group();
    const barrier = mesh(ownGeometry(new BoxGeometry(0.32, 0.055, 0.05)), traceMaterials.fail);
    barrier.position.y = 0.035;
    blocked.add(barrier);
    for (const x of [-0.13, 0.13]) {
      const post = mesh(ownGeometry(new BoxGeometry(0.045, 0.25, 0.045)), traceMaterials.fail);
      post.position.set(x, 0.12, 0);
      blocked.add(post);
    }

    const late = new Group();
    const clock = mesh(ownGeometry(new TorusGeometry(0.12, 0.018, 8, 28)), traceMaterials.fail);
    const minute = mesh(ownGeometry(new BoxGeometry(0.018, 0.1, 0.028)), traceMaterials.fail);
    minute.position.y = 0.04;
    const hour = mesh(ownGeometry(new BoxGeometry(0.075, 0.018, 0.028)), traceMaterials.fail);
    hour.position.set(0.032, 0.01, 0);
    hour.rotation.z = 0.55;
    late.add(clock, minute, hour);

    const neutral = new Group();
    neutral.add(mesh(ownGeometry(new TorusGeometry(0.11, 0.018, 8, 24)), traceMaterials.neutral));

    const stale = new Group();
    for (const x of [-0.055, 0.055]) {
      const pause = mesh(ownGeometry(new BoxGeometry(0.045, 0.22, 0.035)), traceMaterials.stale);
      pause.position.x = x;
      stale.add(pause);
    }

    const states = { pass, fail, blocked, late, neutral, stale } as const;
    Object.values(states).forEach((state) => {
      state.visible = false;
      state.traverse((child) => {
        if (!(child instanceof Mesh)) return;
        child.castShadow = false;
        child.receiveShadow = false;
        child.renderOrder = 22;
      });
      marker.add(state);
    });
    return { marker, states };
  };

  const createRouteVisual = (key: RouteKey): RouteVisual => {
    const group = new Group();
    const currentSegments: Mesh[] = [];
    const priorSegments: Mesh[] = [];
    for (let index = 0; index < routeSegmentCount; index += 1) {
      const current = mesh(routeSegmentGeometry, traceMaterials.neutral);
      const prior = mesh(priorSegmentGeometry, traceMaterials.prior);
      for (const segment of [current, prior]) {
        segment.castShadow = false;
        segment.receiveShadow = false;
        segment.renderOrder = segment === current ? 20 : 19;
        group.add(segment);
      }
      currentSegments.push(current);
      priorSegments.push(prior);
    }

    const { marker, states } = createResultMarker();
    marker.position.y = 0.22;
    group.add(marker);

    const badge = createCanvasPanel(0.44, 0.17, 640);
    badge.mesh.name = `route-card-${key}`;
    panels.push(badge);
    const badgeOffset =
      key === "established-a"
        ? new Vector3(-0.23, 0.34, 0.04)
        : key === "established-b"
          ? new Vector3(0.2, 0.4, -0.04)
          : new Vector3(0.24, 0.31, 0.05);
    badge.mesh.position.copy(badgeOffset);
    badge.mesh.rotation.x = -0.1;
    badge.mesh.material.depthTest = false;
    badge.mesh.renderOrder = 32;
    marker.add(badge.mesh);

    const priorBadge = createCanvasPanel(0.34, 0.115, 512);
    panels.push(priorBadge);
    drawPriorPassBadge(priorBadge);
    priorBadge.mesh.rotation.x = -0.1;
    priorBadge.mesh.material.depthTest = false;
    priorBadge.mesh.renderOrder = 31;
    priorBadge.mesh.visible = false;
    group.add(priorBadge.mesh);

    let actor: Group | null = null;
    if (key !== "hazard") {
      actor = serviceCar.clone(true);
      actor.scale.setScalar(key === "established-a" ? 0.58 : 0.54);
      const beacon = mesh(
        ownGeometry(new SphereGeometry(0.045, 12, 8)),
        key === "established-a" ? materials.yellow : materials.cyan,
      );
      beacon.position.set(0, 0.31, 0);
      actor.add(beacon);
      actor.visible = false;
      group.add(actor);
    }

    root.add(group);
    return {
      key,
      group,
      currentSegments,
      priorSegments,
      marker,
      markerStates: states,
      badge,
      priorBadge,
      actor,
    };
  };

  const routeVisuals: Record<RouteKey, RouteVisual> = {
    "established-a": createRouteVisual("established-a"),
    "established-b": createRouteVisual("established-b"),
    hazard: createRouteVisual("hazard"),
  };

  for (const route of Object.values(routeVisuals)) {
    const markerEntity = world.createTransformEntity(route.marker, { parent: rootEntity });
    ownedEntities.push(markerEntity);
    createPanelCallout(
      route.badge,
      route.marker,
      route.badge.mesh.position.clone(),
      route.marker,
      markerEntity,
      {
        min: { x: -0.92, y: 0.22, z: -0.36 },
        max: { x: 0.92, y: 1.08, z: 0.36 },
      },
    );
  }

  const configureSegments = (
    segments: readonly Mesh[],
    points: readonly Vector3[],
    fraction: number,
    material: MeshBasicMaterial,
    dashed: boolean,
    y: number,
  ): void => {
    for (let index = 0; index < segments.length; index += 1) {
      const startFraction = index / segments.length;
      const endFraction = Math.min(fraction, (index + 1) / segments.length);
      const segment = segments[index];
      const inRange = startFraction < fraction && endFraction > startFraction;
      segment.visible = inRange && (!dashed || index % 2 === 0);
      if (!segment.visible) continue;
      pathPoint(points, startFraction, segmentStart);
      pathPoint(points, endFraction, segmentEnd);
      const dx = segmentEnd.x - segmentStart.x;
      const dz = segmentEnd.z - segmentStart.z;
      const length = Math.hypot(dx, dz);
      segment.position.set(
        (segmentStart.x + segmentEnd.x) / 2,
        y,
        (segmentStart.z + segmentEnd.z) / 2,
      );
      segment.rotation.set(0, -Math.atan2(dz, dx), 0);
      segment.scale.set(length, 1, 1);
      segment.material = material;
    }
  };

  const resultWord = (
    key: RouteKey,
    status: SceneEvidenceStatus,
    view: KaijuQaSceneView,
  ): string => {
    if (status === "regression") {
      return key === "established-a" ? "PRIOR PASS LATE" : "PRIOR PASS BLOCKED";
    }
    if (status === "pass") {
      if (key === "hazard" && view.selectedRule) return "PROTECTED";
      if (key === "established-a") return "ON TIME";
      if (key === "established-b") return "CLEAR";
      return "PASS";
    }
    if (status === "fail") return key === "hazard" ? "CONTACT" : "FAILED";
    if (status === "ready") return "READY";
    if (status === "stale") return "NEEDS RUN";
    return "UNTESTED";
  };

  const updateRouteVisual = (
    route: RouteVisual,
    item: SceneEvidenceItem | undefined,
    view: KaijuQaSceneView,
  ): void => {
    const status = item?.status ?? "untested";
    const points = routeLayouts[view.level][route.key];
    const regression = status === "regression";
    const endFraction = regression ? 0.62 : status === "fail" ? 0.8 : 1;
    const material =
      status === "pass"
        ? traceMaterials.pass
        : status === "fail" || regression
          ? traceMaterials.fail
          : status === "ready"
            ? traceMaterials.active
            : status === "stale"
              ? traceMaterials.stale
              : traceMaterials.neutral;
    const dashed = status === "untested" || status === "stale" || status === "fail" || regression;
    configureSegments(route.currentSegments, points, endFraction, material, dashed, 0.105);
    configureSegments(route.priorSegments, points, 1, traceMaterials.prior, false, 0.08);
    route.priorSegments.forEach((segment) => {
      segment.visible = regression;
    });

    Object.values(route.markerStates).forEach((state) => {
      state.visible = false;
    });
    route.marker.visible = status !== "untested" && status !== "ready";
    const markerState =
      status === "pass"
        ? route.markerStates.pass
        : status === "fail"
          ? route.markerStates.fail
          : status === "regression"
            ? route.key === "established-a"
              ? route.markerStates.late
              : route.markerStates.blocked
            : status === "stale"
              ? route.markerStates.stale
              : route.markerStates.neutral;
    markerState.visible = true;
    pathPoint(points, endFraction, route.marker.position);
    route.marker.position.y = 0.24;
    drawRouteBadge(route.badge, item?.label ?? "Scenario", status, resultWord(route.key, status, view));
    route.badge.mesh.visible =
      status === "fail" || status === "regression" || status === "stale";

    pathPoint(points, 1, route.priorBadge.mesh.position);
    route.priorBadge.mesh.position.y = 0.22;
    route.priorBadge.mesh.position.z += route.key === "established-a" ? 0.08 : -0.08;
    // The prior-pass state is folded into the draggable route result card so
    // regression evidence never creates a second, non-draggable popup.
    route.priorBadge.mesh.visible = false;

    if (route.actor) {
      const showActor = status === "pass" || regression;
      route.actor.visible = showActor;
      if (showActor) {
        pathPoint(points, endFraction, route.actor.position, routeTangent);
        route.actor.position.y = 0.065;
        route.actor.rotation.set(0, -Math.atan2(routeTangent.z, routeTangent.x), 0);
        if (regression && route.key === "established-a") route.actor.rotation.z = -0.09;
      }
    }
  };

  const broadBoundary = new Group();
  const broadRing = mesh(
    ownGeometry(new TorusGeometry(0.86, 0.025, 8, 64)),
    traceMaterials.active,
  );
  broadRing.rotation.x = Math.PI / 2;
  broadBoundary.add(broadRing);
  for (let index = 0; index < 12; index += 1) {
    const angle = (index / 12) * Math.PI * 2;
    const post = mesh(ownGeometry(new BoxGeometry(0.045, 0.18, 0.045)), materials.cartridgeMark);
    post.position.set(Math.cos(angle) * 0.86, 0.1, Math.sin(angle) * 0.86);
    broadBoundary.add(post);
  }
  broadBoundary.position.set(0.12, 0.035, 0);
  broadBoundary.scale.z = 0.68;
  broadBoundary.visible = false;
  root.add(broadBoundary);

  const alternateBoundary = new Group();
  for (let index = -3; index <= 3; index += 1) {
    const bar = mesh(ownGeometry(new BoxGeometry(0.12, 0.025, 0.58)), materials.purple);
    bar.position.set(index * 0.18, 0.035, 0);
    alternateBoundary.add(bar);
  }
  alternateBoundary.visible = false;
  root.add(alternateBoundary);

  const targetedZone = new Group();
  for (let index = -3; index <= 3; index += 1) {
    const stripe = mesh(
      ownGeometry(new BoxGeometry(0.055, 0.025, 0.34)),
      index % 2 === 0 ? materials.yellow : materials.white,
    );
    stripe.position.set(index * 0.065, 0.035, 0);
    stripe.rotation.y = 0.35;
    targetedZone.add(stripe);
  }
  targetedZone.visible = false;
  root.add(targetedZone);

  const hazardShield = new Group();
  const shieldRing = mesh(
    ownGeometry(new TorusGeometry(0.29, 0.025, 8, 42)),
    traceMaterials.pass,
  );
  shieldRing.rotation.x = Math.PI / 2;
  const shieldCheckShort = mesh(
    ownGeometry(new BoxGeometry(0.11, 0.035, 0.03)),
    traceMaterials.pass,
  );
  shieldCheckShort.position.set(-0.035, 0.24, 0.01);
  shieldCheckShort.rotation.z = -0.68;
  const shieldCheckLong = mesh(
    ownGeometry(new BoxGeometry(0.2, 0.035, 0.03)),
    traceMaterials.pass,
  );
  shieldCheckLong.position.set(0.055, 0.28, 0.01);
  shieldCheckLong.rotation.z = 0.55;
  hazardShield.add(shieldRing, shieldCheckShort, shieldCheckLong);
  hazardShield.visible = false;
  root.add(hazardShield);

  const fixtureForLevel: Readonly<Record<SceneLevelId, ScenePropId>> = {
    "training-yard": "tower",
    "school-crossing": "crosswalk",
    "harbor-load": "heavy-cargo",
    "storm-shift": "rain-module",
  };

  const updateCausalVisuals = (view: KaijuQaSceneView): void => {
    updateRouteVisual(routeVisuals["established-a"], view.evidence[0], view);
    updateRouteVisual(routeVisuals["established-b"], view.evidence[1], view);
    updateRouteVisual(routeVisuals.hazard, view.evidence[2], view);
    evidenceConnectorTarget.position.copy(routeVisuals.hazard.marker.position);
    evidenceConnectorTarget.position.y = 0.38;
    evidenceCallout.setConnectorVisible(
      view.evidence.some((item) => item.status !== "untested"),
    );

    broadBoundary.visible = view.selectedRule === "broad";
    alternateBoundary.visible = view.selectedRule === "alternate";
    targetedZone.visible = view.selectedRule === "targeted";
    const alternatePath = routeLayouts[view.level]["established-b"];
    pathPoint(alternatePath, 0.58, alternateBoundary.position, routeTangent);
    alternateBoundary.position.y = 0.035;
    alternateBoundary.rotation.y = -Math.atan2(routeTangent.z, routeTangent.x);

    const fixture = fixtureForLevel[view.level];
    const fixtureTarget = propTargets[fixture];
    targetedZone.position.copy(fixtureTarget).setY(0.035);
    targetedZone.rotation.y = view.level === "harbor-load" ? -0.55 : -0.12;
    hazardShield.position.copy(fixtureTarget).setY(0.08);
    const hazardStatus = view.evidence[2]?.status;
    hazardShield.visible = hazardStatus === "pass" && view.selectedRule !== null;
    contactStar.position.copy(fixtureTarget).setY(0.35);
    contactStar.visible = hazardStatus === "fail";

    for (const [id, meta] of propMetas) {
      if (!meta.dragging) meta.object.rotation.set(0, 0, 0);
      if (id !== fixture || hazardStatus !== "fail" || !meta.snapped) continue;
      const tilt = id === "tower" ? -0.24 : id === "heavy-cargo" ? -0.14 : 0.1;
      if (reducedMotion) meta.object.rotation.z = tilt;
    }

    const released = view.cue === "release" || view.levelReleased || view.campaignComplete;
    releaseCelebration.visible = released;
    releaseBadge.mesh.visible = released;
    if (released) drawReleaseBadge(releaseBadge, view.campaignComplete);
  };

  const registerManipulation = (
    kind: ManipulationKind,
    id: ManipulationMeta["id"],
    object: Group,
    home: Vector3,
    target: Vector3,
    haloRadius = 0.25,
  ): ManipulationMeta => {
    object.position.copy(home);
    const halo = makeHalo(materials.cyan, haloRadius);
    object.add(halo);
    object.intersectChildren = true;
    const entity = world.createTransformEntity(object, { parent: rootEntity });
    entity.addComponent(RayInteractable);
    entity.addComponent(PokeInteractable);
    const dragOffset = new Vector3();
    const dragPlane = new Plane();
    const eventTarget = object.getObjectByName(`${id}-drag-target`) ?? object;
    const currentRay = (pointerEvent: ScenePointerEvent): Ray => {
      if (pointerEvent.pointerType.startsWith("screen") && pointerEvent.pointer) {
        tmpPointer.copy(pointerEvent.pointer);
        world.camera.updateMatrixWorld(true);
        tmpScreenOrigin.setFromMatrixPosition(world.camera.matrixWorld);
        tmpScreenDirection
          .set(tmpPointer.x, tmpPointer.y, 0.5)
          .unproject(world.camera)
          .sub(tmpScreenOrigin)
          .normalize();
        return tmpScreenRay.set(tmpScreenOrigin, tmpScreenDirection);
      }
      return pointerEvent.ray;
    };
    const currentWorldSample = (pointerEvent: ScenePointerEvent): boolean => {
      if (!pointerEvent.pointerType.startsWith("screen")) {
        tmpWorld.copy(pointerEvent.point);
        return true;
      }
      return Boolean(currentRay(pointerEvent).intersectPlane(meta.dragPlane, tmpWorld));
    };
    const pointerDown = (event: unknown): void => {
      const pointerEvent = asScenePointerEvent(event);
      if (
        !pointerEvent ||
        !meta.enabled ||
        meta.activePointerId !== null ||
        (pointerEvent.pointerType.startsWith("screen") &&
          typeof pointerEvent.button === "number" &&
          pointerEvent.button !== 0)
      ) return;
      pointerEvent.stopPropagation();
      meta.activePointerId = pointerEvent.pointerId;
      meta.dragging = true;
      if (meta.kind === "lever" || meta.kind === "stamp") {
        // A fresh grab starts a fresh physical action even if the spring-back
        // animation has not quite reached its final frame yet.
        meta.triggered = false;
      }
      meta.returnStartedAt = null;
      meta.halo.visible = true;

      tmpPlanePoint.set(
        0,
        meta.home.y,
        meta.kind === "stamp" ? meta.home.z : 0,
      );
      root.localToWorld(tmpPlanePoint);
      root.getWorldQuaternion(tmpRootQuaternion);
      tmpDragPlaneNormal
        .copy(meta.kind === "stamp" ? verticalNormal : tabletopNormal)
        .applyQuaternion(tmpRootQuaternion)
        .normalize();
      meta.dragPlane.setFromNormalAndCoplanarPoint(tmpDragPlaneNormal, tmpPlanePoint);
      if (currentWorldSample(pointerEvent)) {
        tmpLocal.copy(tmpWorld);
        root.worldToLocal(tmpLocal);
        meta.dragOffset.copy(meta.object.position).sub(tmpLocal);
      } else {
        meta.dragOffset.set(0, 0, 0);
      }
      (meta.eventTarget as CapturableObject).setPointerCapture(pointerEvent.pointerId);
    };
    const pointerMove = (event: unknown): void => {
      const pointerEvent = asScenePointerEvent(event);
      if (
        !pointerEvent ||
        !meta.dragging ||
        meta.activePointerId !== pointerEvent.pointerId
      ) return;
      pointerEvent.stopPropagation();
      if (!currentWorldSample(pointerEvent)) return;
      tmpLocal.copy(tmpWorld);
      root.worldToLocal(tmpLocal);
      meta.object.position.copy(tmpLocal).add(meta.dragOffset);
    };
    const releasePointer = (event: unknown, cancelled: boolean): void => {
      const pointerEvent = asScenePointerEvent(event);
      if (
        !pointerEvent ||
        !meta.dragging ||
        meta.activePointerId !== pointerEvent.pointerId
      ) return;
      pointerEvent.stopPropagation();
      const capturable = meta.eventTarget as CapturableObject;
      if (capturable.hasPointerCapture(pointerEvent.pointerId)) {
        capturable.releasePointerCapture(pointerEvent.pointerId);
      }
      meta.activePointerId = null;
      meta.dragging = false;
      if (cancelled) beginReturn(meta);
      else settleInteraction(world, meta);
    };
    const meta: ManipulationMeta = {
      kind,
      id,
      entity,
      object,
      halo,
      eventTarget,
      home: home.clone(),
      target: target.clone(),
      baseScale: object.scale.clone(),
      dragOffset,
      dragPlane,
      enabled: false,
      dragging: false,
      activePointerId: null,
      snapped: false,
      triggered: false,
      returnStartedAt: null,
      returnFrom: home.clone(),
      lastSettledAt: 0,
      pointerDown,
      pointerMove,
      pointerUp: (event) => releasePointer(event, false),
      pointerCancel: (event) => releasePointer(event, true),
      pointerOver: () => {
        if (meta.enabled) meta.halo.visible = true;
      },
      pointerOut: () => {
        if (!meta.dragging) meta.halo.visible = meta.enabled;
      },
    };
    eventTarget.addEventListener("pointerdown", meta.pointerDown);
    eventTarget.addEventListener("pointermove", meta.pointerMove);
    eventTarget.addEventListener("pointerup", meta.pointerUp);
    eventTarget.addEventListener("pointercancel", meta.pointerCancel);
    eventTarget.addEventListener("pointerover", meta.pointerOver);
    eventTarget.addEventListener("pointerout", meta.pointerOut);
    if (eventTarget !== object) {
      object.addEventListener("pointermove", meta.pointerMove);
      object.addEventListener("pointerup", meta.pointerUp);
      object.addEventListener("pointercancel", meta.pointerCancel);
    }
    INTERACTIONS.set(entity as object, meta);
    metas.push(meta);
    ownedEntities.push(entity);
    return meta;
  };

  const propMetas = new Map<ScenePropId, ManipulationMeta>();
  for (const [id, object] of Object.entries(propObjects) as Array<[ScenePropId, Group]>) {
    object.name = `prop-${id}`;
    const hitTarget = mesh(
      ownGeometry(new BoxGeometry(0.72, 0.5, 0.72)),
      ownMaterial(new MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        colorWrite: false,
      })),
    );
    hitTarget.name = `${id}-drag-target`;
    const inverseScale = new Vector3(
      1 / Math.max(Math.abs(object.scale.x), 0.0001),
      1 / Math.max(Math.abs(object.scale.y), 0.0001),
      1 / Math.max(Math.abs(object.scale.z), 0.0001),
    );
    hitTarget.scale.copy(inverseScale);
    hitTarget.position.y = 0.16 * inverseScale.y;
    hitTarget.castShadow = false;
    hitTarget.receiveShadow = false;
    object.add(hitTarget);
    propMetas.set(id, registerManipulation("prop", id, object, propHome, propTargets[id], 0.28));
  }

  const ruleMetas = new Map<SceneRuleId, ManipulationMeta>();
  for (const [id, object] of ruleObjects) {
    object.name = `rule-${id}`;
    const hitTarget = mesh(
      ownGeometry(new BoxGeometry(0.54, 0.34, 0.38)),
      ownMaterial(new MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        colorWrite: false,
      })),
    );
    hitTarget.name = `${id}-drag-target`;
    hitTarget.position.y = 0.12;
    hitTarget.castShadow = false;
    hitTarget.receiveShadow = false;
    object.add(hitTarget);
    ruleMetas.set(id, registerManipulation("rule", id, object, ruleHomes[id], ruleTarget, 0.29));
  }

  const leverLabel = createCanvasPanel(0.42, 0.12, 720);
  panels.push(leverLabel);
  leverLabel.render((context) => {
    const { width, height } = leverLabel.canvas;
    context.fillStyle = "#101a22";
    roundedRect(context, 8, 8, width - 16, height - 16, 30);
    context.fill();
    context.strokeStyle = "#62e2ef";
    context.lineWidth = 8;
    context.stroke();
    context.fillStyle = "#fff8e8";
    context.font = "900 76px system-ui, sans-serif";
    context.textAlign = "center";
    context.fillText("RUN TESTS", width / 2, height / 2 + 27);
    context.textAlign = "left";
  });
  leverLabel.mesh.material.depthTest = false;
  leverLabel.mesh.renderOrder = 34;
  const leverFixture = createRunTestsLever({
    ownGeometry,
    ownMaterial,
    createLabelMesh: () => leverLabel.mesh,
    colors: {
      base: palette.benchEdge,
      metal: 0xc8d5d8,
      handle: palette.ink,
      accent: palette.cyan,
      labelPlate: palette.ink,
    },
    pulledAngle: MathUtils.degToRad(56),
  });
  leverFixture.hitTarget.name = "lever-drag-target";
  const leverHandle = new Group();
  leverHandle.name = "run-tests-lever-interaction";
  leverHandle.add(leverFixture.root);
  const leverMeta = registerManipulation(
    "lever",
    "lever",
    leverHandle,
    new Vector3(1.68, 0.02, 0.78),
    new Vector3(1.68, 0.02, 1.05),
    0.25,
  );
  leverMeta.leverVisualPivot = leverFixture.pivot;
  leverMeta.leverVisualRoot = leverFixture.root;
  const leverBase = leverFixture.root;

  const stampBase = cloneAsset("labButton");
  prepareImportedModel(stampBase, importedMaterials, 0.48);
  fitObject(stampBase, 0.34);
  stampBase.position.set(2.02, 0.02, 0.12);
  root.add(stampBase);
  const stampHandle = new Group();
  stampHandle.name = "release-stamp-interaction";
  const stampStem = mesh(ownGeometry(new CylinderGeometry(0.055, 0.065, 0.24, 16)), materials.edge);
  stampStem.position.y = -0.1;
  const stampKnob = mesh(ownGeometry(new SphereGeometry(0.105, 20, 14)), materials.yellow);
  stampHandle.add(stampStem, stampKnob);
  const stampHitTarget = mesh(
    ownGeometry(new BoxGeometry(0.32, 0.38, 0.32)),
    ownMaterial(new MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      colorWrite: false,
    })),
  );
  stampHitTarget.name = "stamp-drag-target";
  stampHitTarget.castShadow = false;
  stampHitTarget.receiveShadow = false;
  stampHandle.add(stampHitTarget);
  const stampMeta = registerManipulation(
    "stamp",
    "stamp",
    stampHandle,
    new Vector3(2.02, 0.34, 0.12),
    new Vector3(2.02, 0.2, 0.12),
    0.2,
  );

  let currentView: KaijuQaSceneView | null = null;
  let reducedMotion = initialReducedMotion;
  let suspended = false;
  let mixedReality = false;
  let placementPhase: "aiming" | "adjusting" | "confirmed" | "inactive" = "inactive";
  let disposed = false;
  let cueStartedAt = performance.now();
  let lastCueId = -1;
  let previousLevel: SceneLevelId | null = null;
  let tutorialArrowBaseY = 0.72;
  let destinationArrowBaseY = 0.58;
  let baselineArrivalCelebrated = false;

  const setMetaEnabled = (meta: ManipulationMeta, enabled: boolean): void => {
    meta.enabled = enabled;
    meta.halo.visible = enabled;
    // Imported meshes can be wider than the authored grab collider. Keep
    // decorative/model children from winning the raycast and route every input
    // mode through the one dedicated event target instead.
    pointerEvents(meta.object, false);
    pointerEvents(meta.eventTarget, enabled);
  };

  const applyExpectedInteractivity = (view: KaijuQaSceneView): void => {
    for (const meta of metas) setMetaEnabled(meta, false);
    if (placementPhase === "aiming" || placementPhase === "adjusting") return;
    if (view.expected?.kind === "prop") {
      const meta = propMetas.get(view.expected.id);
      if (meta && !view.placedProps.includes(view.expected.id)) setMetaEnabled(meta, true);
    } else if (view.expected?.kind === "rule") {
      for (const meta of ruleMetas.values()) setMetaEnabled(meta, true);
    } else if (view.expected?.kind === "lever") {
      setMetaEnabled(leverMeta, true);
    } else if (view.expected?.kind === "stamp") {
      setMetaEnabled(stampMeta, view.releaseReady || view.levelReleased);
    }
  };

  const resetKaiju = (): void => {
    kaiju.position.set(0.03, 0.035, 0.04);
    kaiju.rotation.set(0, 0, 0);
    kaiju.scale.setScalar(1);
  };

  const updateExpectedVisuals = (view: KaijuQaSceneView): void => {
    propSocket.visible = view.expected?.kind === "prop";
    if (view.expected?.kind === "prop") {
      const meta = propMetas.get(view.expected.id);
      if (meta) propSocket.position.copy(meta.target).setY(0);
    }
    ruleSocketGlow.material = view.releaseReady ? materials.lime : materials.cyan;
    tutorialArrow.visible = Boolean(view.expected) && !suspended;
    destinationArrow.visible =
      !suspended && (view.expected?.kind === "prop" || view.expected?.kind === "rule");

    if (view.expected?.kind === "prop") {
      const meta = propMetas.get(view.expected.id);
      if (meta) {
        speechCallout.setTarget(meta.eventTarget);
        tutorialArrow.position.copy(meta.object.position).setY(0.82);
        tutorialArrowBaseY = tutorialArrow.position.y;
        destinationArrow.position.copy(meta.target).setY(0.62);
        destinationArrowBaseY = destinationArrow.position.y;
      }
    } else if (view.expected?.kind === "rule") {
      speechCallout.setTarget(ruleSocket);
      tutorialArrow.position.set(0, 0.74, 0.78);
      tutorialArrowBaseY = tutorialArrow.position.y;
      destinationArrow.position.set(ruleTarget.x, 0.62, ruleTarget.z);
      destinationArrowBaseY = destinationArrow.position.y;
    } else if (view.expected?.kind === "lever") {
      speechCallout.setTarget(leverMeta.eventTarget);
      tutorialArrow.position.set(1.68, 1.04, 0.8);
      tutorialArrowBaseY = tutorialArrow.position.y;
    } else if (view.expected?.kind === "stamp") {
      speechCallout.setTarget(stampMeta.eventTarget);
      tutorialArrow.position.set(2.02, 0.78, 0.12);
      tutorialArrowBaseY = tutorialArrow.position.y;
    }
  };

  const setCue = (view: KaijuQaSceneView): void => {
    if (view.cueId === lastCueId) return;
    lastCueId = view.cueId;
    cueStartedAt = performance.now();
    baselineArrivalCelebrated = false;
    celebration.visible = false;
    contact.visible = false;
    resetKaiju();
    switch (view.cue) {
      case "baseline":
        playAction("walk");
        break;
      case "failure":
        playAction("hitreact");
        contact.visible = true;
        break;
      case "regression":
        playAction("no");
        break;
      case "verified":
        playAction("yes");
        break;
      case "release":
        playAction("wave");
        celebration.visible = true;
        break;
      case "level-change":
        playAction("jump_land");
        break;
      default:
        playAction("idle");
        break;
    }
  };

  const tick = (delta: number, time: number): void => {
    if (disposed || suspended || !currentView) return;
    updateResponsiveCallouts();
    mixer.update(delta);
    for (const callout of callouts) callout.update(delta);
    const now = performance.now();
    const elapsed = (now - cueStartedAt) / 1000;
    const pulse = reducedMotion ? 1 : 1 + Math.sin(time * 3.4) * 0.06;
    propSocketRing.scale.setScalar(pulse);
    ruleSocketGlow.scale.setScalar(reducedMotion ? 1 : 1 + Math.sin(time * 3.1) * 0.04);
    tutorialArrow.position.y = tutorialArrowBaseY + (reducedMotion ? 0 : Math.sin(time * 4) * 0.028);
    destinationArrow.position.y = destinationArrowBaseY + (reducedMotion ? 0 : Math.sin(time * 4 + 1.2) * 0.022);
    tutorialArrow.rotation.y = Math.sin(time * 1.7) * 0.12;
    destinationArrow.rotation.y = -Math.sin(time * 1.7) * 0.12;
    if (!speechCallout.dragging) {
      world.camera.getWorldQuaternion(tmpCameraWorldQuaternion);
      setLocalQuaternionFromWorld(speechPanel.mesh, tmpCameraWorldQuaternion);
    }
    dust.rotation.y += delta * 0.025;

    const dustPositions = dust.geometry.getAttribute("position") as Float32BufferAttribute;
    for (let index = 0; index < dustPositions.count; index += 1) {
      const y = dustPositions.getY(index) + delta * 0.008;
      dustPositions.setY(index, y > 1.5 ? 0 : y);
    }
    dustPositions.needsUpdate = true;

    if (rain.visible) {
      const positions = rain.geometry.getAttribute("position") as Float32BufferAttribute;
      for (let index = 0; index < positions.count; index += 1) {
        const y = positions.getY(index) - delta * 0.9;
        positions.setY(index, y < 0 ? 1.5 : y);
      }
      positions.needsUpdate = true;
    }

    if (celebration.visible && !reducedMotion) {
      celebration.rotation.y += delta * 0.6;
      celebration.position.y = 0.15 + Math.min(0.45, elapsed * 0.18);
    }
    if (contact.visible && elapsed > 1.1) contact.visible = false;

    const activeProp = currentView.expected?.kind === "prop"
      ? propMetas.get(currentView.expected.id)
      : null;
    if (activeProp && !activeProp.dragging && !activeProp.snapped && !reducedMotion) {
      activeProp.object.rotation.y = Math.sin(time * 2.1) * 0.055;
    }

    if (currentView.cue === "baseline") {
      const t = Math.min(1, elapsed / 1.8);
      kaiju.position.x = MathUtils.lerp(0.02, -0.48, t);
      kaiju.position.z = MathUtils.lerp(0.08, -0.02, t);
      if (t >= 1 && !baselineArrivalCelebrated) {
        baselineArrivalCelebrated = true;
        playAction("yes");
      }
    } else if (currentView.cue === "failure") {
      const towerMeta = propMetas.get("tower");
      if (towerMeta && (towerMeta.snapped || currentView.placedProps.includes("tower"))) {
        towerMeta.object.rotation.z = reducedMotion
          ? -0.18
          : -0.18 * Math.min(1, elapsed / 0.45);
      }
    } else if (currentView.cue === "regression") {
      const t = Math.min(1, elapsed / 0.7);
      kaiju.position.x = MathUtils.lerp(0.03, 0.24, t);
    } else if (currentView.cue === "verified") {
      const t = Math.min(1, elapsed / 0.75);
      kaiju.scale.setScalar(reducedMotion ? 1.05 : MathUtils.lerp(1, 1.07, t));
    } else if (currentView.cue === "release") {
      const t = Math.min(1, elapsed / 0.9);
      kaiju.scale.setScalar(reducedMotion ? 1.08 : MathUtils.lerp(1, 1.12, t));
    }
  };

  installInteractionSystem(world, { onIntent, onInvalidDrop, tick });

  return {
    present(view) {
      if (disposed) return;
      currentView = view;
      if (previousLevel !== view.level) {
        previousLevel = view.level;
        for (const [id, group] of Object.entries(districts) as Array<[SceneLevelId, Group]>) {
          group.visible = id === view.level;
        }
        rain.visible = view.level === "storm-shift";
        celebration.position.set(0, 0.15, 0);
        resetKaiju();
      }

      const expectedProp = view.expected?.kind === "prop" ? view.expected.id : null;
      for (const [id, meta] of propMetas) {
        const relevant =
          (view.level === "training-yard" && (id === "car" || id === "tower")) ||
          (view.level === "school-crossing" && id === "crosswalk") ||
          (view.level === "harbor-load" && id === "heavy-cargo") ||
          (view.level === "storm-shift" && id === "rain-module");
        const placed = view.placedProps.includes(id);
        meta.object.visible = relevant && (placed || expectedProp === id);
        meta.target.copy(propTargets[id]);
        if (placed && !meta.dragging) {
          meta.object.position.copy(meta.target);
          meta.snapped = true;
        } else if (!placed && !meta.dragging && meta.returnStartedAt === null) {
          meta.object.position.copy(meta.home);
          meta.object.rotation.set(0, 0, 0);
          meta.snapped = false;
        }
        setMetaEnabled(meta, relevant && expectedProp === id && !placed);
      }

      const showRules = view.expected?.kind === "rule" || view.selectedRule !== null;
      ruleFixture.root.visible = showRules;
      for (const option of view.ruleOptions) {
        rulePanels.get(option.id) && drawRuleLabel(rulePanels.get(option.id)!, option);
      }
      for (const [id, meta] of ruleMetas) {
        meta.object.visible = showRules;
        const selected = view.selectedRule === id;
        if (selected && !meta.dragging) {
          meta.object.position.copy(meta.target);
          meta.snapped = true;
        } else if (!selected && !meta.dragging && meta.returnStartedAt === null) {
          meta.object.position.copy(meta.home);
          meta.snapped = false;
        }
        setMetaEnabled(meta, view.expected?.kind === "rule");
      }

      setMetaEnabled(leverMeta, view.expected?.kind === "lever");
      setMetaEnabled(
        stampMeta,
        view.expected?.kind === "stamp" && (view.releaseReady || view.levelReleased),
      );
      leverBase.visible = true;
      leverHandle.visible = true;
      stampBase.visible = view.releaseReady || view.levelReleased;
      stampHandle.visible = view.releaseReady || view.levelReleased;
      ruleSocket.visible = showRules;

      drawSpeechBubble(speechPanel, view);
      drawEvidenceBoard(evidencePanel, view);
      updateExpectedVisuals(view);
      setCue(view);
      updateCausalVisuals(view);
      applyExpectedInteractivity(view);
      if (placementPhase === "aiming" || placementPhase === "adjusting") {
        drawPlacementBubble(speechPanel, placementPhase);
        evidencePanel.mesh.visible = false;
        tutorialArrow.visible = false;
        destinationArrow.visible = false;
      } else {
        evidencePanel.mesh.visible = true;
      }
    },
    setSuspended(nextSuspended) {
      suspended = nextSuspended;
      for (const callout of callouts) {
        callout.setEnabled(
          !nextSuspended && placementPhase !== "aiming" && placementPhase !== "adjusting",
        );
      }
      tutorialArrow.visible = !nextSuspended && Boolean(currentView?.expected);
      destinationArrow.visible =
        !nextSuspended &&
        (currentView?.expected?.kind === "prop" || currentView?.expected?.kind === "rule");
      if (nextSuspended) {
        for (const meta of metas) {
          if (!meta.dragging) continue;
          cancelActiveManipulation(meta);
        }
        celebration.visible = false;
        contact.visible = false;
      }
    },
    setReducedMotion(nextReducedMotion) {
      reducedMotion = nextReducedMotion;
      for (const callout of callouts) callout.setReducedMotion(nextReducedMotion);
      if (currentView) updateCausalVisuals(currentView);
    },
    setMixedReality(active, passthroughAvailable = true) {
      mixedReality = active;
      backdrop.visible = !active || !passthroughAvailable;
      if (!active) {
        detachRootFromAnchor();
        placementPhase = "inactive";
        root.visible = true;
        root.position.copy(DESKTOP_ROOT_HOME);
        root.quaternion.identity();
        root.scale.setScalar(1);
        evidencePanel.mesh.visible = true;
        for (const callout of callouts) callout.setEnabled(true);
        if (currentView) {
          drawSpeechBubble(speechPanel, currentView);
          drawEvidenceBoard(evidencePanel, currentView);
          updateExpectedVisuals(currentView);
          applyExpectedInteractivity(currentView);
        }
      }
    },
    setWorkbenchPlacement(phase, pose) {
      placementPhase = phase;
      if (phase === "aiming") detachRootFromAnchor();
      if (pose) {
        root.position.copy(pose.position);
        root.quaternion.copy(pose.quaternion);
        root.scale.setScalar(pose.scale);
        root.visible = true;
      } else if (mixedReality && phase === "aiming") {
        root.position.set(0, 0.72, -1.1);
        root.quaternion.identity();
        root.scale.setScalar(0.3);
        root.visible = true;
      }
      if (phase === "confirmed" && !rootEntity.hasComponent(XRAnchor)) {
        rootEntity.addComponent(XRAnchor);
      }
      speechCallout.setTarget(table);

      const placing = phase === "aiming" || phase === "adjusting";
      for (const callout of callouts) callout.setEnabled(!placing && !suspended);
      evidencePanel.mesh.visible = !placing;
      tutorialArrow.visible = !placing && !suspended && Boolean(currentView?.expected);
      destinationArrow.visible =
        !placing &&
        !suspended &&
        (currentView?.expected?.kind === "prop" || currentView?.expected?.kind === "rule");
      if (phase !== "inactive") drawPlacementBubble(speechPanel, phase);
      if (placing) {
        for (const meta of metas) {
          if (meta.dragging) cancelActiveManipulation(meta);
          setMetaEnabled(meta, false);
        }
      } else if (currentView) {
        if (phase === "confirmed") {
          drawPlacementBubble(speechPanel, "confirmed");
        } else {
          drawSpeechBubble(speechPanel, currentView);
          updateExpectedVisuals(currentView);
        }
        drawEvidenceBoard(evidencePanel, currentView);
        applyExpectedInteractivity(currentView);
      }
    },
    resetView() {
      if (!mixedReality) {
        root.position.copy(DESKTOP_ROOT_HOME);
        root.rotation.set(0, 0, 0);
      }
      for (const callout of callouts) callout.reset(true);
    },
    getDebugTargets() {
      const result: Record<string, KaijuQaSceneDebugPoint> = {};
      const canvas = world.renderer.domElement;
      const bounds = canvas.getBoundingClientRect();
      const project = (key: string, local: Vector3) => {
        tmpWorld.copy(local);
        root.localToWorld(tmpWorld);
        tmpWorld.project(world.camera);
        result[key] = {
          x: bounds.left + ((tmpWorld.x + 1) / 2) * bounds.width,
          y: bounds.top + ((1 - tmpWorld.y) / 2) * bounds.height,
          visible: tmpWorld.z >= -1 && tmpWorld.z <= 1,
        };
      };
      const projectObject = (key: string, object: Object3D) => {
        object.getWorldPosition(tmpWorld);
        tmpWorld.project(world.camera);
        result[key] = {
          x: bounds.left + ((tmpWorld.x + 1) / 2) * bounds.width,
          y: bounds.top + ((1 - tmpWorld.y) / 2) * bounds.height,
          visible: tmpWorld.z >= -1 && tmpWorld.z <= 1,
        };
      };
      const projectGrabTarget = (key: string, meta: ManipulationMeta) => {
        meta.eventTarget.getWorldPosition(tmpWorld);
        tmpLocal.copy(tmpWorld);
        root.worldToLocal(tmpLocal);
        tmpLocal.sub(meta.object.position).add(meta.target);
        project(key, tmpLocal);
      };
      for (const [id, meta] of propMetas) {
        projectObject(`prop-${id}`, meta.eventTarget);
        project(`socket-${id}`, meta.target);
        projectGrabTarget(`drop-prop-${id}`, meta);
      }
      for (const [id, meta] of ruleMetas) {
        projectObject(`rule-${id}`, meta.eventTarget);
        projectGrabTarget(`drop-rule-${id}`, meta);
      }
      project("rule-socket", ruleTarget);
      projectObject("lever", leverMeta.eventTarget);
      projectGrabTarget("lever-pull", leverMeta);
      projectObject("stamp", stampMeta.eventTarget);
      projectGrabTarget("stamp-press", stampMeta);
      projectObject("card-instruction", speechPanel.mesh);
      projectObject("card-evidence", evidencePanel.mesh);
      projectObject("card-release", releaseBadge.mesh);
      for (const [key, route] of Object.entries(routeVisuals)) {
        projectObject(`card-route-${key}`, route.badge.mesh);
      }
      return result;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      CONTROLLERS.delete(world);
      for (const meta of metas) {
        if (meta.dragging) cancelActiveManipulation(meta);
        meta.eventTarget.removeEventListener("pointerdown", meta.pointerDown);
        meta.eventTarget.removeEventListener("pointermove", meta.pointerMove);
        meta.eventTarget.removeEventListener("pointerup", meta.pointerUp);
        meta.eventTarget.removeEventListener("pointercancel", meta.pointerCancel);
        meta.eventTarget.removeEventListener("pointerover", meta.pointerOver);
        meta.eventTarget.removeEventListener("pointerout", meta.pointerOut);
        if (meta.eventTarget !== meta.object) {
          meta.object.removeEventListener("pointermove", meta.pointerMove);
          meta.object.removeEventListener("pointerup", meta.pointerUp);
          meta.object.removeEventListener("pointercancel", meta.pointerCancel);
        }
        INTERACTIONS.delete(meta.entity as object);
      }
      for (const callout of callouts) callout.dispose();
      for (const entity of ownedEntities.slice().reverse()) entity.destroy();
      mixer.stopAllAction();
      for (const panel of panels) panel.dispose();
      for (const geometry of ownedGeometries) geometry.dispose();
      for (const material of [...ownedMaterials, ...importedMaterials]) material.dispose();
    },
  };
}
