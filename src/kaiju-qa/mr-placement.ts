import {
  EnvironmentRaycastTarget,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  RaycastSpace,
  TorusGeometry,
  Vector3,
  World,
  createSystem,
  type Entity,
} from "@iwsdk/core";

import {
  fallbackWorkbenchPosition,
  isHorizontalPlacementNormal,
} from "./mr-placement-model.js";

export type WorkbenchPlacementPhase =
  | "aiming"
  | "adjusting"
  | "confirmed"
  | "inactive";

export interface WorkbenchPlacementPose {
  readonly position: Vector3;
  readonly quaternion: Quaternion;
  readonly scale: number;
}

export interface WorkbenchPlacementTarget {
  setWorkbenchPlacement(
    phase: WorkbenchPlacementPhase,
    pose?: WorkbenchPlacementPose,
  ): void;
}

export interface MixedRealityPlacementController {
  readonly phase: WorkbenchPlacementPhase;
  readonly hasConfirmedPose: boolean;
  start(session: XRSession, forcePlacement?: boolean): void;
  reposition(): void;
  stop(): void;
  dispose(): void;
}

interface InternalPlacementController {
  readonly world: World;
  readonly target: WorkbenchPlacementTarget;
  readonly entity: Entity;
  readonly reticle: Group;
  readonly onStatus: (message: string) => void;
  session: XRSession | null;
  phase: WorkbenchPlacementPhase;
  candidatePosition: Vector3;
  candidateQuaternion: Quaternion;
  confirmedPosition: Vector3;
  confirmedQuaternion: Quaternion;
  yaw: number;
  candidateHorizontal: boolean;
  manualFallback: boolean;
  fallbackAllowedAt: number;
  hasConfirmedPose: boolean;
  onSelect: () => void;
  onSessionEnd: () => void;
}

const CONTROLLERS = new WeakMap<World, InternalPlacementController>();
const INSTALLED_WORLDS = new WeakSet<World>();
const UP = new Vector3(0, 1, 0);
const yawQuaternion = new Quaternion();
const composedQuaternion = new Quaternion();
const surfaceNormal = new Vector3();
const cameraPosition = new Vector3();
const cameraForward = new Vector3();
const cameraRight = new Vector3();
const WORKBENCH_SCALE = 0.25;
const VALID_RETICLE_COLOR = 0x62e2ef;
const INVALID_RETICLE_COLOR = 0xf06a5d;

function currentPose(controller: InternalPlacementController): WorkbenchPlacementPose {
  yawQuaternion.setFromAxisAngle(UP, controller.yaw);
  composedQuaternion.copy(controller.candidateQuaternion).multiply(yawQuaternion);
  return {
    position: controller.candidatePosition.clone(),
    quaternion: composedQuaternion.clone(),
    scale: WORKBENCH_SCALE,
  };
}

class MixedRealityPlacementSystem extends createSystem({
  reticles: { required: [EnvironmentRaycastTarget] },
}) {
  update(delta: number) {
    const controller = CONTROLLERS.get(this.world);
    if (!controller || controller.phase === "inactive" || controller.phase === "confirmed") {
      return;
    }

    if (controller.phase === "aiming") {
      const hit = controller.entity.getValue(
        EnvironmentRaycastTarget,
        "xrHitTestResult",
      );
      if (!hit || !controller.reticle.visible) {
        controller.candidateHorizontal = false;
        return;
      }
      surfaceNormal.set(0, 1, 0).applyQuaternion(controller.reticle.quaternion);
      controller.candidateHorizontal = isHorizontalPlacementNormal(surfaceNormal);
      const ringMaterial = (controller.reticle.children[0] as Mesh).material as MeshBasicMaterial;
      ringMaterial.color.setHex(
        controller.candidateHorizontal ? VALID_RETICLE_COLOR : INVALID_RETICLE_COLOR,
      );
      if (!controller.candidateHorizontal) return;
      controller.candidatePosition.copy(controller.reticle.position);
      controller.candidateQuaternion.copy(controller.reticle.quaternion);
      controller.target.setWorkbenchPlacement("aiming", currentPose(controller));
      return;
    }

    const thumbstick = this.input.xr.gamepads.right?.getAxesValues(
      "xr-standard-thumbstick",
    );
    if (thumbstick && Math.abs(thumbstick.x) > 0.16) {
      controller.yaw -= thumbstick.x * delta * 1.85;
    }
    if (controller.manualFallback) {
      const moveStick = this.input.xr.gamepads.left?.getAxesValues(
        "xr-standard-thumbstick",
      );
      controller.world.camera.getWorldDirection(cameraForward);
      cameraForward.setY(0);
      if (cameraForward.lengthSq() < 1e-6) cameraForward.set(0, 0, -1);
      cameraForward.normalize();
      cameraRight.crossVectors(cameraForward, UP).normalize();
      if (moveStick) {
        controller.candidatePosition.addScaledVector(
          cameraRight,
          moveStick.x * delta * 0.55,
        );
        controller.candidatePosition.addScaledVector(
          cameraForward,
          -moveStick.y * delta * 0.55,
        );
      }
      if (thumbstick && Math.abs(thumbstick.y) > 0.16) {
        controller.candidatePosition.y = MathUtils.clamp(
          controller.candidatePosition.y - thumbstick.y * delta * 0.42,
          0.45,
          1.35,
        );
      }
    }
    controller.target.setWorkbenchPlacement("adjusting", currentPose(controller));
  }
}

function installSystem(world: World): void {
  if (INSTALLED_WORLDS.has(world)) return;
  world.registerSystem(MixedRealityPlacementSystem);
  INSTALLED_WORLDS.add(world);
}

function enableReticle(controller: InternalPlacementController): void {
  if (!controller.entity.hasComponent(EnvironmentRaycastTarget)) {
    controller.entity.addComponent(EnvironmentRaycastTarget, {
      space: RaycastSpace.Right,
      maxDistance: 5,
    });
  }
  controller.reticle.visible = false;
  ((controller.reticle.children[0] as Mesh).material as MeshBasicMaterial).color.setHex(
    VALID_RETICLE_COLOR,
  );
}

function disableReticle(controller: InternalPlacementController): void {
  if (controller.entity.hasComponent(EnvironmentRaycastTarget)) {
    controller.entity.removeComponent(EnvironmentRaycastTarget);
  }
  controller.reticle.visible = false;
}

export function createMixedRealityPlacement(
  world: World,
  target: WorkbenchPlacementTarget,
  onStatus: (message: string) => void,
): MixedRealityPlacementController {
  let publicApi: MixedRealityPlacementController | null = null;
  const reticle = new Group();
  reticle.name = "KaijuQaPlacementReticle";
  const ring = new Mesh(
    new TorusGeometry(0.17, 0.012, 10, 64),
    new MeshBasicMaterial({
      color: VALID_RETICLE_COLOR,
      depthTest: false,
      transparent: true,
      opacity: 0.94,
      toneMapped: false,
    }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.renderOrder = 100;
  reticle.add(ring);
  reticle.visible = false;
  const entity = world.createTransformEntity(reticle, { persistent: true });

  const controller: InternalPlacementController = {
    world,
    target,
    entity,
    reticle,
    onStatus,
    session: null,
    phase: "inactive",
    candidatePosition: new Vector3(0, 0.74, -0.8),
    candidateQuaternion: new Quaternion(),
    confirmedPosition: new Vector3(),
    confirmedQuaternion: new Quaternion(),
    yaw: 0,
    candidateHorizontal: false,
    manualFallback: false,
    fallbackAllowedAt: 0,
    hasConfirmedPose: false,
    onSelect: () => {
      if (controller.phase === "aiming") {
        const hit = controller.entity.hasComponent(EnvironmentRaycastTarget)
          ? controller.entity.getValue(EnvironmentRaycastTarget, "xrHitTestResult")
          : undefined;
        if (hit && controller.reticle.visible && !controller.candidateHorizontal) {
          controller.onStatus("That surface is too steep. Point at a horizontal table or floor until the ring turns cyan.");
          return;
        }
        if (!hit || !controller.reticle.visible) {
          if (performance.now() < controller.fallbackAllowedAt) {
            controller.onStatus("Keep pointing at a clear horizontal surface until the cyan placement ring appears.");
            return;
          }
          controller.world.camera.getWorldPosition(cameraPosition);
          controller.world.camera.getWorldDirection(cameraForward);
          fallbackWorkbenchPosition(
            cameraPosition,
            cameraForward,
            controller.candidatePosition,
          );
          controller.candidateQuaternion.identity();
          controller.manualFallback = true;
          controller.onStatus("Surface detection is unavailable. Left stick moves the preview; right stick turns it and adjusts height.");
        } else {
          controller.manualFallback = false;
        }
        controller.phase = "adjusting";
        disableReticle(controller);
        controller.target.setWorkbenchPlacement("adjusting", currentPose(controller));
        controller.onStatus(
          controller.manualFallback
            ? "Manual preview held. Left stick moves; right stick turns or raises it. Pull the trigger to confirm."
            : "Position held. Rotate with the right thumbstick, then pull the trigger again to confirm.",
        );
        return;
      }
      if (controller.phase !== "adjusting") return;
      const pose = currentPose(controller);
      controller.confirmedPosition.copy(pose.position);
      controller.confirmedQuaternion.copy(pose.quaternion);
      controller.hasConfirmedPose = true;
      controller.phase = "confirmed";
      controller.target.setWorkbenchPlacement("confirmed", pose);
      controller.onStatus("Workbench placed. Point, hold, move, and release to play.");
      globalThis.setTimeout(() => {
        if (controller.phase === "confirmed" && controller.session) {
          controller.target.setWorkbenchPlacement("inactive");
        }
      }, 1400);
    },
    onSessionEnd: () => {
      publicApi?.stop();
    },
  };

  CONTROLLERS.set(world, controller);
  installSystem(world);

  const attachSession = (session: XRSession): void => {
    if (controller.session === session) return;
    if (controller.session) {
      controller.session.removeEventListener("select", controller.onSelect);
      controller.session.removeEventListener("end", controller.onSessionEnd);
    }
    controller.session = session;
    session.addEventListener("select", controller.onSelect);
    session.addEventListener("end", controller.onSessionEnd);
  };

  const api: MixedRealityPlacementController = {
    get phase() {
      return controller.phase;
    },
    get hasConfirmedPose() {
      return controller.hasConfirmedPose;
    },
    start(session, forcePlacement = false) {
      attachSession(session);
      if (controller.hasConfirmedPose && !forcePlacement) {
        controller.phase = "confirmed";
        controller.candidatePosition.copy(controller.confirmedPosition);
        controller.candidateQuaternion.copy(controller.confirmedQuaternion);
        controller.yaw = 0;
        controller.manualFallback = false;
        target.setWorkbenchPlacement("confirmed", currentPose(controller));
        onStatus("Workbench restored. Point, hold, move, and release to play.");
        return;
      }
      controller.phase = "aiming";
      controller.yaw = 0;
      controller.candidateHorizontal = false;
      controller.manualFallback = false;
      controller.fallbackAllowedAt = performance.now() + 4000;
      enableReticle(controller);
      target.setWorkbenchPlacement("aiming");
      onStatus("Place Workbench: point at a clear horizontal table until the cyan ring appears.");
    },
    reposition() {
      if (!controller.session) return;
      controller.phase = "aiming";
      controller.yaw = 0;
      controller.candidateHorizontal = false;
      controller.manualFallback = false;
      controller.fallbackAllowedAt = performance.now() + 4000;
      enableReticle(controller);
      target.setWorkbenchPlacement("aiming");
      onStatus("Repositioning: point at a clear horizontal table and pull the trigger.");
    },
    stop() {
      disableReticle(controller);
      controller.phase = "inactive";
      controller.manualFallback = false;
      target.setWorkbenchPlacement("inactive");
      if (controller.session) {
        controller.session.removeEventListener("select", controller.onSelect);
        controller.session.removeEventListener("end", controller.onSessionEnd);
        controller.session = null;
      }
    },
    dispose() {
      api.stop();
      CONTROLLERS.delete(world);
      ring.geometry.dispose();
      (ring.material as MeshBasicMaterial).dispose();
      entity.destroy();
    },
  };

  publicApi = api;

  return api;
}
