import {
  BufferGeometry,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  MathUtils,
  Object3D,
  Plane,
  Ray,
  Vector3,
  type ColorRepresentation,
} from "three";

export interface DraggableCalloutPoint {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface DraggableCalloutLocalBounds {
  readonly min?: Partial<DraggableCalloutPoint>;
  readonly max?: Partial<DraggableCalloutPoint>;
}

export interface DraggableCalloutConnectorOptions {
  readonly parent?: Object3D;
  readonly cardAnchor?: DraggableCalloutPoint;
  readonly targetAnchor?: DraggableCalloutPoint;
  readonly color?: ColorRepresentation;
  readonly opacity?: number;
  readonly depthTest?: boolean;
  readonly renderOrder?: number;
  readonly visible?: boolean;
  readonly name?: string;
}

export interface CreateDraggableCalloutOptions<TEvent = unknown> {
  readonly card: Object3D;
  readonly camera: Object3D;
  readonly getRay: (event: TEvent) => Ray | null | undefined;
  readonly getPointerId?: (event: TEvent) => number | null | undefined;
  readonly localSpace?: Object3D;
  readonly home?: DraggableCalloutPoint;
  readonly bounds?: DraggableCalloutLocalBounds;
  readonly target?: Object3D | null;
  readonly connector?: DraggableCalloutConnectorOptions | false;
  readonly enabled?: boolean;
  readonly reducedMotion?: boolean;
  readonly resetDuration?: number;
  readonly resetOnCancel?: boolean;
  readonly stopPropagation?: (event: TEvent) => void;
  readonly capturePointer?: (pointerId: number, event: TEvent) => void;
  readonly releasePointer?: (pointerId: number, event: TEvent | null) => void;
  readonly onDragStart?: (event: TEvent, pointerId: number) => void;
  readonly onDragEnd?: (
    event: TEvent | null,
    pointerId: number,
    cancelled: boolean,
  ) => void;
}

export interface DraggableCallout<TEvent = unknown> {
  readonly connector: Line<BufferGeometry, LineBasicMaterial> | null;
  readonly dragging: boolean;
  readonly enabled: boolean;
  readonly reducedMotion: boolean;
  readonly pointerDown: (event: TEvent) => void;
  readonly pointerMove: (event: TEvent) => void;
  readonly pointerUp: (event: TEvent) => void;
  readonly pointerCancel: (event: TEvent) => void;
  update(deltaSeconds?: number): void;
  reset(immediate?: boolean): void;
  setEnabled(enabled: boolean): void;
  setReducedMotion(reducedMotion: boolean): void;
  setHome(home: DraggableCalloutPoint, moveImmediately?: boolean): void;
  setTarget(target: Object3D | null): void;
  setConnectorVisible(visible: boolean): void;
  dispose(): void;
}

type Axis = "x" | "y" | "z";

const AXES: readonly Axis[] = ["x", "y", "z"];
const EPSILON = 1e-10;

function defaultPointerId(event: unknown): number | null {
  if (!event || typeof event !== "object") return null;
  const pointerId = (event as { pointerId?: unknown }).pointerId;
  return typeof pointerId === "number" && Number.isFinite(pointerId)
    ? pointerId
    : null;
}

function defaultStopPropagation(event: unknown): void {
  if (!event || typeof event !== "object") return;
  const stopPropagation = (event as { stopPropagation?: unknown }).stopPropagation;
  if (typeof stopPropagation === "function") {
    stopPropagation.call(event);
  }
}

function isNonPrimaryScreenAction(event: unknown): boolean {
  if (!event || typeof event !== "object") return false;
  const candidate = event as { pointerType?: unknown; button?: unknown };
  return (
    typeof candidate.pointerType === "string" &&
    candidate.pointerType.startsWith("screen") &&
    typeof candidate.button === "number" &&
    candidate.button !== 0
  );
}

function copyPoint(point: DraggableCalloutPoint, result: Vector3): Vector3 {
  return result.set(point.x, point.y, point.z);
}

function readBound(
  value: number | undefined,
  fallback: number,
  label: string,
): number {
  if (value === undefined) return fallback;
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError(`${label} must be a number`);
  }
  return value;
}

function visibleInHierarchy(object: Object3D): boolean {
  let current: Object3D | null = object;
  while (current) {
    if (!current.visible) return false;
    current = current.parent;
  }
  return true;
}

export function createDraggableCallout<TEvent = unknown>(
  options: CreateDraggableCalloutOptions<TEvent>,
): DraggableCallout<TEvent> {
  const { card, camera } = options;
  const localSpace = options.localSpace ?? card.parent ?? null;
  const getPointerId = options.getPointerId ?? defaultPointerId;
  const stopPropagation = options.stopPropagation ?? defaultStopPropagation;
  const resetDuration = Math.max(0, options.resetDuration ?? 0.2);
  const resetOnCancel = options.resetOnCancel ?? true;

  const minimum = new Vector3();
  const maximum = new Vector3();
  for (const axis of AXES) {
    minimum[axis] = readBound(
      options.bounds?.min?.[axis],
      Number.NEGATIVE_INFINITY,
      `bounds.min.${axis}`,
    );
    maximum[axis] = readBound(
      options.bounds?.max?.[axis],
      Number.POSITIVE_INFINITY,
      `bounds.max.${axis}`,
    );
    if (minimum[axis] > maximum[axis]) {
      throw new RangeError(`bounds.min.${axis} cannot exceed bounds.max.${axis}`);
    }
  }

  const worldPoint = new Vector3();
  const planePoint = new Vector3();
  const planeNormal = new Vector3();
  const localPoint = new Vector3();
  const dragOffset = new Vector3();
  const resetFrom = new Vector3();
  const resetPosition = new Vector3();
  const connectorStart = new Vector3();
  const connectorEnd = new Vector3();
  const dragPlane = new Plane();

  const worldToSpace = (point: Vector3, result: Vector3): Vector3 => {
    result.copy(point);
    if (localSpace) localSpace.worldToLocal(result);
    return result;
  };

  const spaceToWorld = (point: Vector3, result: Vector3): Vector3 => {
    result.copy(point);
    if (localSpace) localSpace.localToWorld(result);
    return result;
  };

  const getCardLocalPosition = (result: Vector3): Vector3 => {
    card.getWorldPosition(worldPoint);
    return worldToSpace(worldPoint, result);
  };

  const clampToBounds = (point: Vector3): Vector3 => {
    point.x = MathUtils.clamp(point.x, minimum.x, maximum.x);
    point.y = MathUtils.clamp(point.y, minimum.y, maximum.y);
    point.z = MathUtils.clamp(point.z, minimum.z, maximum.z);
    return point;
  };

  const setCardLocalPosition = (position: Vector3): void => {
    spaceToWorld(position, worldPoint);
    if (card.parent) card.parent.worldToLocal(worldPoint);
    card.position.copy(worldPoint);
    card.updateMatrixWorld(true);
  };

  const home = options.home
    ? copyPoint(options.home, new Vector3())
    : getCardLocalPosition(new Vector3());
  clampToBounds(home);

  let target = options.target ?? null;
  let enabled = options.enabled ?? true;
  let reducedMotion = options.reducedMotion ?? false;
  let connectorVisible = options.connector === false
    ? false
    : options.connector?.visible ?? true;
  let activePointerId: number | null = null;
  let activeEvent: TEvent | null = null;
  let dragging = false;
  let resetting = false;
  let resetElapsed = 0;
  let disposed = false;

  const connectorOptions = options.connector === false ? null : options.connector ?? {};
  let connector: Line<BufferGeometry, LineBasicMaterial> | null = null;
  let connectorAttribute: Float32BufferAttribute | null = null;
  let connectorParent: Object3D | null = null;
  const cardAnchor = new Vector3();
  const targetAnchor = new Vector3();

  if (connectorOptions) {
    if (connectorOptions.cardAnchor) copyPoint(connectorOptions.cardAnchor, cardAnchor);
    if (connectorOptions.targetAnchor) copyPoint(connectorOptions.targetAnchor, targetAnchor);

    const geometry = new BufferGeometry();
    connectorAttribute = new Float32BufferAttribute(6, 3);
    geometry.setAttribute("position", connectorAttribute);
    const opacity = MathUtils.clamp(connectorOptions.opacity ?? 0.72, 0, 1);
    const material = new LineBasicMaterial({
      color: connectorOptions.color ?? 0x62e2ef,
      transparent: opacity < 1,
      opacity,
      depthTest: connectorOptions.depthTest ?? false,
      depthWrite: false,
      toneMapped: false,
    });
    connector = new Line(geometry, material);
    connector.name = connectorOptions.name ?? `${card.name || "callout"}-connector`;
    connector.renderOrder = connectorOptions.renderOrder ?? 29;
    connector.frustumCulled = false;
    connector.raycast = () => {};
    (connector as Object3D & { pointerEvents?: string }).pointerEvents = "none";
    connectorParent = connectorOptions.parent ?? localSpace ?? card.parent ?? card;
    connectorParent.add(connector);
  }

  const updateConnector = (): void => {
    if (!connector || !connectorAttribute) return;
    const shouldShow =
      connectorVisible &&
      target !== null &&
      visibleInHierarchy(card) &&
      visibleInHierarchy(target);
    connector.visible = shouldShow;
    if (!shouldShow || !target) return;

    card.localToWorld(connectorStart.copy(cardAnchor));
    target.localToWorld(connectorEnd.copy(targetAnchor));
    if (connectorParent) {
      connectorParent.worldToLocal(connectorStart);
      connectorParent.worldToLocal(connectorEnd);
    }
    connectorAttribute.setXYZ(
      0,
      connectorStart.x,
      connectorStart.y,
      connectorStart.z,
    );
    connectorAttribute.setXYZ(
      1,
      connectorEnd.x,
      connectorEnd.y,
      connectorEnd.z,
    );
    connectorAttribute.needsUpdate = true;
  };

  const finishDrag = (
    event: TEvent | null,
    cancelled: boolean,
  ): number | null => {
    if (!dragging || activePointerId === null) return null;
    const pointerId = activePointerId;
    options.releasePointer?.(pointerId, event);
    activePointerId = null;
    activeEvent = null;
    dragging = false;
    options.onDragEnd?.(event, pointerId, cancelled);
    return pointerId;
  };

  const reset = (immediate = false): void => {
    if (disposed) return;
    finishDrag(activeEvent, true);
    getCardLocalPosition(resetFrom);
    resetElapsed = 0;
    resetting = true;
    if (
      immediate ||
      reducedMotion ||
      resetDuration === 0 ||
      resetFrom.distanceToSquared(home) <= EPSILON
    ) {
      setCardLocalPosition(home);
      resetting = false;
    }
    updateConnector();
  };

  const pointerDown = (event: TEvent): void => {
    if (disposed || !enabled || dragging || isNonPrimaryScreenAction(event)) return;
    const pointerId = getPointerId(event);
    const ray = options.getRay(event);
    if (pointerId === null || pointerId === undefined || !ray) return;

    camera.updateWorldMatrix(true, false);
    card.updateWorldMatrix(true, false);
    camera.getWorldDirection(planeNormal);
    if (planeNormal.lengthSq() <= EPSILON) return;
    planeNormal.normalize();
    card.getWorldPosition(planePoint);
    dragPlane.setFromNormalAndCoplanarPoint(planeNormal, planePoint);
    if (!ray.intersectPlane(dragPlane, worldPoint)) return;

    worldToSpace(worldPoint, resetPosition);
    getCardLocalPosition(localPoint);
    dragOffset.copy(localPoint).sub(resetPosition);
    resetting = false;
    activePointerId = pointerId;
    activeEvent = event;
    dragging = true;
    stopPropagation(event);
    options.capturePointer?.(pointerId, event);
    options.onDragStart?.(event, pointerId);
  };

  const pointerMove = (event: TEvent): void => {
    if (disposed || !dragging || activePointerId === null) return;
    const pointerId = getPointerId(event);
    if (pointerId !== activePointerId) return;
    const ray = options.getRay(event);
    if (!ray || !ray.intersectPlane(dragPlane, worldPoint)) return;

    activeEvent = event;
    worldToSpace(worldPoint, localPoint);
    localPoint.add(dragOffset);
    clampToBounds(localPoint);
    setCardLocalPosition(localPoint);
    stopPropagation(event);
    updateConnector();
  };

  const release = (event: TEvent, cancelled: boolean): void => {
    if (disposed || !dragging || activePointerId === null) return;
    const pointerId = getPointerId(event);
    if (pointerId !== activePointerId) return;
    stopPropagation(event);
    finishDrag(event, cancelled);
    if (cancelled && resetOnCancel) reset();
  };

  const controller: DraggableCallout<TEvent> = {
    get connector() {
      return connector;
    },
    get dragging() {
      return dragging;
    },
    get enabled() {
      return enabled;
    },
    get reducedMotion() {
      return reducedMotion;
    },
    pointerDown,
    pointerMove,
    pointerUp(event) {
      release(event, false);
    },
    pointerCancel(event) {
      release(event, true);
    },
    update(deltaSeconds = 0) {
      if (disposed) return;
      if (resetting) {
        const delta = Number.isFinite(deltaSeconds)
          ? Math.max(0, deltaSeconds)
          : 0;
        resetElapsed += delta;
        const progress = MathUtils.clamp(resetElapsed / resetDuration, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        resetPosition.lerpVectors(resetFrom, home, eased);
        setCardLocalPosition(resetPosition);
        if (progress >= 1) resetting = false;
      }
      updateConnector();
    },
    reset,
    setEnabled(nextEnabled) {
      if (disposed || enabled === nextEnabled) return;
      enabled = nextEnabled;
      if (!enabled) finishDrag(activeEvent, true);
    },
    setReducedMotion(nextReducedMotion) {
      if (disposed || reducedMotion === nextReducedMotion) return;
      reducedMotion = nextReducedMotion;
      if (reducedMotion && resetting) {
        setCardLocalPosition(home);
        resetting = false;
        updateConnector();
      }
    },
    setHome(nextHome, moveImmediately = false) {
      if (disposed) return;
      copyPoint(nextHome, home);
      clampToBounds(home);
      if (moveImmediately && !dragging) {
        resetting = false;
        setCardLocalPosition(home);
        updateConnector();
      }
    },
    setTarget(nextTarget) {
      if (disposed) return;
      target = nextTarget;
      updateConnector();
    },
    setConnectorVisible(visible) {
      if (disposed) return;
      connectorVisible = visible;
      updateConnector();
    },
    dispose() {
      if (disposed) return;
      finishDrag(activeEvent, true);
      disposed = true;
      resetting = false;
      if (connector) {
        connector.removeFromParent();
        connector.geometry.dispose();
        connector.material.dispose();
      }
      connector = null;
      connectorAttribute = null;
      connectorParent = null;
      target = null;
    },
  };

  updateConnector();
  return controller;
}
