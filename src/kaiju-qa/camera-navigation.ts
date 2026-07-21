export type CameraPoint = readonly [x: number, y: number, z: number];

export interface DesktopCameraHome {
  /** The first home whose maxAspect exceeds the current aspect is selected. */
  readonly maxAspect?: number;
  readonly position: CameraPoint;
  readonly target: CameraPoint;
  readonly fov?: number;
}

export interface DesktopPerspectiveCamera {
  readonly position: {
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): unknown;
  };
  aspect?: number;
  fov?: number;
  lookAt(x: number, y: number, z: number): unknown;
  updateProjectionMatrix?(): unknown;
  updateMatrixWorld?(force?: boolean): unknown;
}

export interface DesktopCameraEventTarget {
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

export interface DesktopCameraNavigationOptions {
  readonly camera: DesktopPerspectiveCamera;
  readonly element: HTMLElement;
  readonly homes?: readonly DesktopCameraHome[];
  readonly moveSpeed?: number;
  readonly orbitSpeed?: number;
  readonly minPolarAngle?: number;
  readonly maxPolarAngle?: number;
  readonly enabled?: boolean;
  /** Disable when an external render loop calls update(deltaSeconds). */
  readonly autoUpdate?: boolean;
  readonly resetOnResize?: boolean;
  readonly keyboardTarget?: DesktopCameraEventTarget;
  readonly resizeTarget?: DesktopCameraEventTarget | null;
}

export interface DesktopCameraNavigation {
  readonly enabled: boolean;
  update(deltaSeconds: number): void;
  reset(): void;
  setEnabled(enabled: boolean): void;
  dispose(): void;
}

export const DEFAULT_DESKTOP_CAMERA_HOMES: readonly DesktopCameraHome[] = [
  {
    maxAspect: 0.82,
    position: [0.08, 3.78, 5.95],
    target: [0, 0.38, -1.58],
    fov: 70,
  },
  {
    maxAspect: 1.25,
    position: [0.1, 2.42, 4.8],
    target: [0, 0.92, -1.58],
    fov: 52,
  },
  {
    position: [0.1, 1.94, 3.12],
    target: [0, 0.72, -1.58],
    fov: 42,
  },
];

type Movement = "forward" | "backward" | "left" | "right";

const INTERACTIVE_TAGS = new Set([
  "A",
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
]);

function movementForEvent(event: KeyboardEvent): Movement | null {
  switch (event.code) {
    case "KeyW":
      return "forward";
    case "KeyS":
      return "backward";
    case "KeyA":
      return "left";
    case "KeyD":
      return "right";
  }

  switch (event.key.toLowerCase()) {
    case "w":
      return "forward";
    case "s":
      return "backward";
    case "a":
      return "left";
    case "d":
      return "right";
    default:
      return null;
  }
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  let current: unknown = target;

  for (let depth = 0; depth < 12 && current && typeof current === "object"; depth += 1) {
    const candidate = current as {
      tagName?: unknown;
      isContentEditable?: unknown;
      getAttribute?(name: string): string | null;
      parentElement?: unknown;
      parentNode?: unknown;
    };
    const tagName = typeof candidate.tagName === "string"
      ? candidate.tagName.toUpperCase()
      : "";

    if (INTERACTIVE_TAGS.has(tagName) || candidate.isContentEditable === true) {
      return true;
    }

    const contentEditable = candidate.getAttribute?.("contenteditable");
    if (contentEditable === "" || contentEditable === "true") return true;

    const parent = candidate.parentElement ?? candidate.parentNode;
    if (!parent || parent === current) break;
    current = parent;
  }

  return false;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function createDesktopCameraNavigation(
  options: DesktopCameraNavigationOptions,
): DesktopCameraNavigation {
  const { camera, element } = options;
  const homes = options.homes?.length
    ? options.homes
    : DEFAULT_DESKTOP_CAMERA_HOMES;
  const moveSpeed = options.moveSpeed ?? 2.35;
  const orbitSpeed = options.orbitSpeed ?? 0.0045;
  const minPolarAngle = options.minPolarAngle ?? 0.24;
  const maxPolarAngle = options.maxPolarAngle ?? Math.PI / 2 - 0.04;
  const resetOnResize = options.resetOnResize ?? true;
  const defaultWindow = typeof window === "undefined" ? null : window;
  const keyboardTarget = options.keyboardTarget ?? defaultWindow ?? element;
  const resizeTarget = options.resizeTarget === undefined
    ? defaultWindow
    : options.resizeTarget;
  const activeMovements = new Set<Movement>();
  const cleanup: Array<() => void> = [];
  const target = { x: 0, y: 0, z: 0 };

  let isEnabled = options.enabled ?? true;
  let disposed = false;
  let activePointerId: number | null = null;
  let pointerX = 0;
  let pointerY = 0;
  let frameHandle: number | null = null;
  let previousFrameTime: number | null = null;

  const requestFrame = typeof globalThis.requestAnimationFrame === "function"
    ? globalThis.requestAnimationFrame.bind(globalThis)
    : null;
  const cancelFrame = typeof globalThis.cancelAnimationFrame === "function"
    ? globalThis.cancelAnimationFrame.bind(globalThis)
    : null;

  function listen(
    eventTarget: DesktopCameraEventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions,
  ): void {
    eventTarget.addEventListener(type, listener, options);
    cleanup.push(() => eventTarget.removeEventListener(type, listener, options));
  }

  function currentAspect(): number {
    const width = Number(element.clientWidth);
    const height = Number(element.clientHeight);
    if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
      return width / height;
    }
    return Number.isFinite(camera.aspect) && (camera.aspect ?? 0) > 0
      ? camera.aspect as number
      : 1;
  }

  function applyAspect(): number {
    const aspect = currentAspect();
    camera.aspect = aspect;
    camera.updateProjectionMatrix?.();
    return aspect;
  }

  function homeForAspect(aspect: number): DesktopCameraHome {
    return homes.find((home) => home.maxAspect === undefined || aspect < home.maxAspect) ??
      homes[homes.length - 1];
  }

  function applyLookTarget(): void {
    camera.lookAt(target.x, target.y, target.z);
    camera.updateMatrixWorld?.(true);
  }

  function endPointerDrag(pointerId = activePointerId): void {
    if (activePointerId === null || pointerId !== activePointerId) return;
    const releasedPointerId = activePointerId;
    activePointerId = null;
    if (
      typeof element.releasePointerCapture === "function" &&
      (typeof element.hasPointerCapture !== "function" ||
        element.hasPointerCapture(releasedPointerId))
    ) {
      element.releasePointerCapture(releasedPointerId);
    }
  }

  function clearInteraction(): void {
    activeMovements.clear();
    endPointerDrag();
  }

  function reset(): void {
    if (disposed) return;
    clearInteraction();
    const home = homeForAspect(applyAspect());
    if (home.fov !== undefined) camera.fov = home.fov;
    camera.position.set(...home.position);
    [target.x, target.y, target.z] = home.target;
    camera.updateProjectionMatrix?.();
    applyLookTarget();
  }

  function update(deltaSeconds: number): void {
    if (!isEnabled || disposed || activeMovements.size === 0) return;
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return;

    let forwardAmount = 0;
    let rightAmount = 0;
    if (activeMovements.has("forward")) forwardAmount += 1;
    if (activeMovements.has("backward")) forwardAmount -= 1;
    if (activeMovements.has("right")) rightAmount += 1;
    if (activeMovements.has("left")) rightAmount -= 1;

    const forwardX = target.x - camera.position.x;
    const forwardZ = target.z - camera.position.z;
    const forwardLength = Math.hypot(forwardX, forwardZ);
    if (forwardLength < 1e-7) return;

    const normalizedForwardX = forwardX / forwardLength;
    const normalizedForwardZ = forwardZ / forwardLength;
    const normalizedRightX = -normalizedForwardZ;
    const normalizedRightZ = normalizedForwardX;
    const inputLength = Math.hypot(forwardAmount, rightAmount) || 1;
    const distance = moveSpeed * deltaSeconds;
    const moveX = (
      normalizedForwardX * forwardAmount + normalizedRightX * rightAmount
    ) / inputLength * distance;
    const moveZ = (
      normalizedForwardZ * forwardAmount + normalizedRightZ * rightAmount
    ) / inputLength * distance;

    camera.position.set(
      camera.position.x + moveX,
      camera.position.y,
      camera.position.z + moveZ,
    );
    target.x += moveX;
    target.z += moveZ;
    applyLookTarget();
  }

  function orbit(deltaX: number, deltaY: number): void {
    const offsetX = camera.position.x - target.x;
    const offsetY = camera.position.y - target.y;
    const offsetZ = camera.position.z - target.z;
    const radius = Math.hypot(offsetX, offsetY, offsetZ);
    if (radius < 1e-7) return;

    const theta = Math.atan2(offsetX, offsetZ) - deltaX * orbitSpeed;
    const phi = clamp(
      Math.acos(clamp(offsetY / radius, -1, 1)) - deltaY * orbitSpeed,
      minPolarAngle,
      maxPolarAngle,
    );
    const horizontalRadius = radius * Math.sin(phi);

    camera.position.set(
      target.x + horizontalRadius * Math.sin(theta),
      target.y + radius * Math.cos(phi),
      target.z + horizontalRadius * Math.cos(theta),
    );
    applyLookTarget();
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (
      !isEnabled ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      isInteractiveTarget(event.target)
    ) {
      return;
    }
    const movement = movementForEvent(event);
    if (!movement) return;
    activeMovements.add(movement);
    event.preventDefault();
  }

  function onKeyUp(event: KeyboardEvent): void {
    const movement = movementForEvent(event);
    if (movement && activeMovements.delete(movement)) event.preventDefault();
  }

  function onPointerDown(event: PointerEvent): void {
    if (
      !isEnabled ||
      event.button !== 2 ||
      activePointerId !== null ||
      isInteractiveTarget(event.target)
    ) {
      return;
    }
    activePointerId = event.pointerId;
    pointerX = event.clientX;
    pointerY = event.clientY;
    element.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function onPointerMove(event: PointerEvent): void {
    if (event.pointerId !== activePointerId) return;
    if ((event.buttons & 2) === 0) {
      endPointerDrag(event.pointerId);
      return;
    }

    const deltaX = event.clientX - pointerX;
    const deltaY = event.clientY - pointerY;
    pointerX = event.clientX;
    pointerY = event.clientY;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (deltaX !== 0 || deltaY !== 0) orbit(deltaX, deltaY);
  }

  function onPointerUp(event: PointerEvent): void {
    if (event.pointerId !== activePointerId) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    endPointerDrag(event.pointerId);
  }

  function onContextMenu(event: MouseEvent): void {
    if (isEnabled && !isInteractiveTarget(event.target)) event.preventDefault();
  }

  function onResize(): void {
    if (!isEnabled || disposed) return;
    if (resetOnResize) reset();
    else applyAspect();
  }

  function setEnabled(enabled: boolean): void {
    if (disposed || enabled === isEnabled) return;
    isEnabled = enabled;
    previousFrameTime = null;
    if (!enabled) clearInteraction();
  }

  function dispose(): void {
    if (disposed) return;
    clearInteraction();
    disposed = true;
    isEnabled = false;
    for (const removeListener of cleanup.splice(0)) removeListener();
    if (frameHandle !== null && cancelFrame) cancelFrame(frameHandle);
    frameHandle = null;
  }

  listen(keyboardTarget, "keydown", (event) => onKeyDown(event as KeyboardEvent));
  listen(keyboardTarget, "keyup", (event) => onKeyUp(event as KeyboardEvent));
  listen(keyboardTarget, "blur", clearInteraction as EventListener);
  // Capture right-button gestures before IWSDK's canvas pointer bridge can
  // interpret the same drag as object manipulation. Left/touch input continues
  // through the normal gameplay path.
  listen(element, "pointerdown", (event) => onPointerDown(event as PointerEvent), true);
  listen(element, "pointermove", (event) => onPointerMove(event as PointerEvent), true);
  listen(element, "pointerup", (event) => onPointerUp(event as PointerEvent), true);
  listen(element, "pointercancel", (event) => onPointerUp(event as PointerEvent), true);
  listen(element, "lostpointercapture", (event) => {
    const pointerEvent = event as PointerEvent;
    if (pointerEvent.pointerId === activePointerId) activePointerId = null;
  });
  listen(element, "contextmenu", (event) => onContextMenu(event as MouseEvent));

  if (typeof ResizeObserver === "function") {
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(element);
    cleanup.push(() => resizeObserver.disconnect());
  } else if (resizeTarget) {
    listen(resizeTarget, "resize", onResize as EventListener);
  }

  reset();

  if ((options.autoUpdate ?? true) && requestFrame) {
    const tick = (time: number) => {
      if (disposed) return;
      if (previousFrameTime !== null) {
        update(Math.min(0.1, Math.max(0, (time - previousFrameTime) / 1000)));
      }
      previousFrameTime = time;
      frameHandle = requestFrame(tick);
    };
    frameHandle = requestFrame(tick);
  }

  return {
    get enabled() {
      return isEnabled;
    },
    update,
    reset,
    setEnabled,
    dispose,
  };
}
