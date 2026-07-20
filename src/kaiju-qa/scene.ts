import {
  BoxGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Interactable,
  Mesh,
  MeshStandardMaterial,
  Pressed,
  SphereGeometry,
  World,
  createSystem,
} from "@iwsdk/core";

export type SceneScenarioStatus =
  | "UNTESTED"
  | "READY"
  | "PASS"
  | "FAIL"
  | "REGRESSION"
  | "STALE";

export type SceneGuardrail =
  | "none"
  | "freeze-near-buildings"
  | "slow-while-carrying"
  | "slow-striped-zones";

export type SceneCue =
  | "idle"
  | "baseline"
  | "tower-failure"
  | "ambulance-regression"
  | "car-regression"
  | "targeted-pass"
  | "release";

export interface KaijuQaSceneView {
  readonly cue: SceneCue;
  readonly guardrail: SceneGuardrail;
  readonly towerStaged: boolean;
  readonly scenarios: Readonly<{
    car: SceneScenarioStatus;
    emergency: SceneScenarioStatus;
    tower: SceneScenarioStatus;
  }>;
  readonly tutorialTarget?: "tower" | "run" | "guardrail" | "release" | "reset" | null;
  readonly released?: boolean;
}

/** Semantic bridge for DOM controls and optional world-space proxies. */
export type KaijuQaSceneIntent =
  | { readonly type: "STAGE_TOWER" }
  | { readonly type: "SELECT_GUARDRAIL"; readonly guardrail: Exclude<SceneGuardrail, "none"> }
  | { readonly type: "RUN_FULL_SUITE" }
  | { readonly type: "RELEASE" }
  | { readonly type: "RESET" };

export interface KaijuQaScene {
  present(view: KaijuQaSceneView): void;
  setSuspended(suspended: boolean): void;
  setReducedMotion(reducedMotion: boolean): void;
  resetView(): void;
  dispose(): void;
}

export interface CreateKaijuQaSceneOptions {
  readonly onIntent: (intent: KaijuQaSceneIntent) => void;
  readonly reducedMotion: boolean;
}

const CONTROL_INTENTS = new Map<object, KaijuQaSceneIntent>();
const CONTROL_CALLBACKS = new WeakMap<World, (intent: KaijuQaSceneIntent) => void>();
const CONTROL_SYSTEMS = new WeakSet<World>();

class KaijuQaControlSystem extends createSystem({
  pressedControls: { required: [Interactable, Pressed] },
}) {
  init() {
    this.cleanupFuncs.push(
      this.queries.pressedControls.subscribe("qualify", (entity) => {
        const intent = CONTROL_INTENTS.get(entity as object);
        if (intent) CONTROL_CALLBACKS.get(this.world)?.(intent);
      }),
    );
  }
}

function installControlSystem(world: World, onIntent: (intent: KaijuQaSceneIntent) => void) {
  CONTROL_CALLBACKS.set(world, onIntent);
  if (!CONTROL_SYSTEMS.has(world)) {
    world.registerSystem(KaijuQaControlSystem);
    CONTROL_SYSTEMS.add(world);
  }
}

const palette = {
  ink: 0x0b1620,
  road: 0x26363d,
  paper: 0xf6eedc,
  neutral: 0xd8d0be,
  teal: 0x35a99b,
  tealShadow: 0x1e6a66,
  cyan: 0x55d6e2,
  yellow: 0xf2c14e,
  pass: 0xa6cf55,
  fail: 0xf06a5d,
  slate: 0x7d8e95,
} as const;

type StatusMaterialKey = "pass" | "fail" | "slate" | "cyan" | "yellow";

function material(color: number, emissive = 0): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color,
    emissive: new Color(color).multiplyScalar(emissive),
    flatShading: true,
    metalness: 0,
    roughness: 0.8,
  });
}

function mesh(geometry: BoxGeometry | CylinderGeometry | ConeGeometry | SphereGeometry, materialRef: MeshStandardMaterial) {
  const result = new Mesh(geometry, materialRef);
  result.castShadow = true;
  result.receiveShadow = true;
  return result;
}

function setMaterial(group: Group, materialRef: MeshStandardMaterial) {
  group.traverse((object) => {
    if (object instanceof Mesh) object.material = materialRef;
  });
}

function setVisible(group: Group, visible: boolean) {
  group.visible = visible;
}

function statusMaterial(status: SceneScenarioStatus): StatusMaterialKey {
  if (status === "PASS") return "pass";
  if (status === "FAIL" || status === "REGRESSION") return "fail";
  if (status === "READY") return "cyan";
  if (status === "STALE") return "yellow";
  return "slate";
}

/**
 * A state-driven, primitive-only scene. The game model owns all rule outcomes;
 * this adapter only selects authored poses, visibility, and material states.
 */
export function createKaijuQaScene(
  world: World,
  { onIntent, reducedMotion: initialReducedMotion }: CreateKaijuQaSceneOptions,
): KaijuQaScene {
  installControlSystem(world, onIntent);

  const geometries = [
    new BoxGeometry(1, 1, 1),
    new CylinderGeometry(0.5, 0.5, 1, 10),
    new ConeGeometry(0.5, 1, 4),
    new SphereGeometry(0.5, 10, 7),
  ] as const;
  const [box, cylinder, cone, sphere] = geometries;
  const materials = {
    ink: material(palette.ink), road: material(palette.road), paper: material(palette.paper),
    neutral: material(palette.neutral), teal: material(palette.teal), shadow: material(palette.tealShadow),
    cyan: material(palette.cyan, 0.16), yellow: material(palette.yellow, 0.12),
    pass: material(palette.pass, 0.16), fail: material(palette.fail, 0.16), slate: material(palette.slate),
  };

  const root = new Group();
  root.name = "KaijuQaRoot";
  root.position.set(0, 0.78, -1.3);
  const rootEntity = world.createTransformEntity(root);
  const ownedEntities = [rootEntity];
  const addRoot = (object: Group) => {
    const entity = world.createTransformEntity(object, { parent: rootEntity });
    ownedEntities.push(entity);
    return entity;
  };

  const tabletop = new Group();
  tabletop.name = "MatteTabletop";
  const tableTop = mesh(box, materials.paper);
  tableTop.scale.set(2.8, 0.1, 1.8);
  tableTop.position.y = -0.05;
  const tableEdge = mesh(box, materials.road);
  tableEdge.scale.set(2.88, 0.12, 1.88);
  tableEdge.position.y = -0.13;
  tabletop.add(tableEdge, tableTop);
  addRoot(tabletop);

  const road = new Group();
  road.name = "RoadAndStripedZone";
  const roadStrip = mesh(box, materials.road);
  roadStrip.scale.set(2.45, 0.018, 0.34);
  roadStrip.position.set(0, 0.012, 0.04);
  roadStrip.rotation.y = -0.34;
  road.add(roadStrip);
  const stripeZone = new Group();
  stripeZone.name = "TargetedStripedZone";
  stripeZone.position.set(0.43, 0.024, -0.1);
  stripeZone.rotation.y = -0.34;
  for (let index = -2; index <= 2; index += 1) {
    const stripe = mesh(box, index % 2 === 0 ? materials.yellow : materials.paper);
    stripe.scale.set(0.07, 0.008, 0.3);
    stripe.position.x = index * 0.09;
    stripe.rotation.y = 0.42;
    stripeZone.add(stripe);
  }
  road.add(stripeZone);
  addRoot(road);

  const buildings = new Group();
  buildings.name = "CityBuildings";
  const buildingData: ReadonlyArray<readonly [number, number, number, number]> = [
    [0.78, -0.45, 0.18, 0.24], [1.05, -0.4, 0.16, 0.31], [0.95, 0.36, 0.2, 0.38],
  ];
  for (const [x, z, width, height] of buildingData) {
    const building = mesh(box, materials.neutral);
    building.scale.set(width, height, width);
    building.position.set(x, height / 2, z);
    buildings.add(building);
  }
  addRoot(buildings);

  const tower = new Group();
  tower.name = "FragileTower";
  tower.position.set(0.72, 0, -0.12);
  const towerBase = mesh(box, materials.neutral); towerBase.scale.set(0.18, 0.2, 0.18); towerBase.position.y = 0.1;
  const towerMid = mesh(box, materials.paper); towerMid.scale.set(0.14, 0.19, 0.14); towerMid.position.set(0.025, 0.29, 0);
  const towerTop = mesh(box, materials.yellow); towerTop.scale.set(0.21, 0.17, 0.17); towerTop.position.set(-0.02, 0.47, 0);
  tower.add(towerBase, towerMid, towerTop);
  const towerEntity = addRoot(tower);

  const kaiju = new Group();
  kaiju.name = "FriendlyHelmetedKaiju";
  kaiju.position.set(0, 0, 0.3);
  const torso = mesh(sphere, materials.teal); torso.scale.set(0.18, 0.19, 0.13); torso.position.y = 0.19;
  const head = mesh(sphere, materials.teal); head.scale.set(0.16, 0.13, 0.14); head.position.set(0, 0.37, -0.015);
  const helmet = mesh(sphere, materials.yellow); helmet.scale.set(0.18, 0.08, 0.155); helmet.position.set(0, 0.445, -0.01);
  const brim = mesh(box, materials.yellow); brim.scale.set(0.2, 0.018, 0.07); brim.position.set(0, 0.408, -0.13);
  const belly = mesh(sphere, materials.paper); belly.scale.set(0.105, 0.12, 0.02); belly.position.set(0, 0.19, -0.125);
  const leftFoot = mesh(box, materials.shadow); leftFoot.scale.set(0.08, 0.05, 0.12); leftFoot.position.set(-0.07, 0.03, -0.025);
  const rightFoot = mesh(box, materials.shadow); rightFoot.scale.set(0.08, 0.05, 0.12); rightFoot.position.set(0.07, 0.03, -0.025);
  const tail = mesh(cone, materials.shadow); tail.scale.set(0.08, 0.25, 0.08); tail.position.set(0.02, 0.15, 0.18); tail.rotation.x = Math.PI / 2.5;
  kaiju.add(torso, head, helmet, brim, belly, leftFoot, rightFoot, tail);
  for (let index = 0; index < 3; index += 1) {
    const plate = mesh(cone, materials.shadow);
    plate.scale.set(0.05, 0.09, 0.04);
    plate.position.set((index - 1) * 0.05, 0.26 + index * 0.04, 0.12);
    plate.rotation.x = Math.PI / 2;
    kaiju.add(plate);
  }
  addRoot(kaiju);

  const car = new Group();
  car.name = "StalledCar";
  car.position.set(-0.72, 0.04, 0.4);
  const carBody = mesh(box, materials.yellow); carBody.scale.set(0.19, 0.07, 0.1); carBody.position.y = 0.045;
  const carRoof = mesh(box, materials.paper); carRoof.scale.set(0.1, 0.06, 0.085); carRoof.position.set(-0.015, 0.11, 0);
  car.add(carBody, carRoof);
  addRoot(car);

  const ambulance = new Group();
  ambulance.name = "Ambulance";
  ambulance.position.set(-0.78, 0.04, -0.38);
  const ambulanceBody = mesh(box, materials.paper); ambulanceBody.scale.set(0.25, 0.1, 0.11); ambulanceBody.position.y = 0.06;
  const ambulanceCab = mesh(box, materials.teal); ambulanceCab.scale.set(0.08, 0.07, 0.11); ambulanceCab.position.set(-0.08, 0.135, 0);
  const beacon = mesh(cylinder, materials.fail); beacon.scale.set(0.035, 0.035, 0.03); beacon.position.set(0.04, 0.18, 0);
  ambulance.add(ambulanceBody, ambulanceCab, beacon);
  addRoot(ambulance);

  const freezeRing = new Group();
  freezeRing.name = "FreezeNearBuildingsRing";
  freezeRing.position.set(0.82, 0.018, -0.16);
  for (let index = 0; index < 12; index += 1) {
    const post = mesh(box, materials.cyan);
    const angle = (index / 12) * Math.PI * 2;
    post.scale.set(0.035, 0.12, 0.035);
    post.position.set(Math.cos(angle) * 0.43, 0.06, Math.sin(angle) * 0.43);
    freezeRing.add(post);
  }
  freezeRing.visible = false;
  addRoot(freezeRing);

  const traceRoot = new Group();
  traceRoot.name = "EvidenceTraces";
  const traces = {
    car: new Group(), tower: new Group(), ambulance: new Group(),
  };
  const makeTrace = (trace: Group, x: number, z: number) => {
    for (let index = 0; index < 6; index += 1) {
      const segment = mesh(box, materials.slate);
      segment.scale.set(0.18, 0.012, 0.035);
      segment.position.set(x + index * 0.18, 0.034, z - index * 0.045);
      segment.rotation.y = -0.25;
      trace.add(segment);
    }
    traceRoot.add(trace);
  };
  makeTrace(traces.car, -0.82, 0.35);
  makeTrace(traces.tower, 0.02, 0.18);
  makeTrace(traces.ambulance, -0.82, -0.36);
  addRoot(traceRoot);

  const marker = new Group();
  marker.name = "TutorialMarker";
  const markerRing = mesh(cylinder, materials.cyan); markerRing.scale.set(0.34, 0.024, 0.34); markerRing.position.y = 0.026;
  const pointer = mesh(cone, materials.cyan); pointer.scale.set(0.07, 0.13, 0.07); pointer.position.y = 0.18; pointer.rotation.x = Math.PI;
  marker.add(markerRing, pointer);
  marker.visible = false;
  addRoot(marker);

  const releaseRing = new Group();
  releaseRing.name = "VerifiedReleaseRing";
  const releaseDisc = mesh(cylinder, materials.pass); releaseDisc.scale.set(0.3, 0.025, 0.3); releaseDisc.position.y = 0.026;
  releaseRing.add(releaseDisc);
  releaseRing.visible = false;
  addRoot(releaseRing);

  const controls = new Group();
  controls.name = "WorldSpaceControlProxies";
  const controlSpecs: ReadonlyArray<readonly [string, number, KaijuQaSceneIntent]> = [
    ["TowerControl", -0.9, { type: "STAGE_TOWER" }],
    ["FreezeControl", -0.45, { type: "SELECT_GUARDRAIL", guardrail: "freeze-near-buildings" }],
    ["CarryControl", 0, { type: "SELECT_GUARDRAIL", guardrail: "slow-while-carrying" }],
    ["StripedControl", 0.45, { type: "SELECT_GUARDRAIL", guardrail: "slow-striped-zones" }],
    ["RunControl", 0.9, { type: "RUN_FULL_SUITE" }],
    ["ReleaseControl", 1.15, { type: "RELEASE" }],
    ["ResetControl", -1.15, { type: "RESET" }],
  ];
  for (const [name, x, intent] of controlSpecs) {
    const proxy = new Group();
    proxy.name = name;
    proxy.position.set(x, 0.055, 0.69);
    const plate = mesh(box, materials.road);
    plate.scale.set(name === "TowerControl" ? 0.25 : 0.18, 0.07, 0.14);
    proxy.add(plate);
    controls.add(proxy);
    const entity = world.createTransformEntity(proxy, { parent: rootEntity });
    entity.addComponent(Interactable);
    CONTROL_INTENTS.set(entity as object, intent);
    ownedEntities.push(entity);
  }

  let suspended = false;
  let reducedMotion = initialReducedMotion;
  let disposed = false;
  const setTrace = (trace: Group, state: SceneScenarioStatus) => setMaterial(trace, materials[statusMaterial(state)]);
  const placeMarker = (target: KaijuQaSceneView["tutorialTarget"]) => {
    if (!target) { marker.visible = false; return; }
    marker.visible = true;
    if (target === "tower") marker.position.set(0.72, 0, -0.12);
    else if (target === "release") marker.position.set(1.15, 0, 0.69);
    else if (target === "reset") marker.position.set(-1.15, 0, 0.69);
    else if (target === "guardrail") marker.position.set(0, 0, 0.69);
    else marker.position.set(0.9, 0, 0.69);
  };

  const canonicalPose = () => {
    kaiju.position.set(0, 0, 0.3); kaiju.rotation.set(0, 0.07, 0);
    kaiju.scale.setScalar(1);
    torso.material = materials.teal;
    head.material = materials.teal;
    helmet.material = materials.yellow;
    brim.material = materials.yellow;
    belly.material = materials.paper;
    leftFoot.material = materials.shadow;
    rightFoot.material = materials.shadow;
    tail.material = materials.shadow;
    tower.position.set(-0.9, 0, 0.62);
    tower.rotation.set(0, 0, 0);
    ambulance.position.set(-0.78, 0.04, -0.38); ambulance.rotation.set(0, 0, 0);
    car.position.set(-0.72, 0.04, 0.4);
    setVisible(freezeRing, false); setVisible(stripeZone, false); setVisible(releaseRing, false);
    setMaterial(traces.car, materials.slate); setMaterial(traces.tower, materials.slate); setMaterial(traces.ambulance, materials.slate);
  };

  canonicalPose();
  return {
    present(view) {
      if (disposed) return;
      canonicalPose();
      setTrace(traces.car, view.scenarios.car);
      setTrace(traces.tower, view.scenarios.tower);
      setTrace(traces.ambulance, view.scenarios.emergency);
      if (view.towerStaged) tower.position.set(0.72, 0, -0.12);
      switch (view.cue) {
        case "baseline":
          car.position.set(0.15, 0.04, 0.16);
          kaiju.position.set(-0.12, 0, 0.24);
          break;
        case "tower-failure":
          kaiju.position.set(0.42, 0, 0.04);
          kaiju.rotation.y = -0.55;
          tower.rotation.z = -0.245;
          break;
        case "ambulance-regression":
          setVisible(freezeRing, true);
          kaiju.position.set(0.3, 0, 0.02);
          ambulance.position.set(-0.08, 0.04, -0.2);
          ambulance.rotation.z = -0.07;
          break;
        case "car-regression":
          kaiju.position.set(-0.32, 0, 0.21);
          car.position.set(-0.28, 0.04, 0.27);
          break;
        case "targeted-pass":
          setVisible(stripeZone, true);
          kaiju.position.set(0.5, 0, -0.02);
          car.position.set(0.32, 0.04, 0.09);
          ambulance.position.set(0.55, 0.04, -0.48);
          break;
        case "release":
          setVisible(stripeZone, true);
          setVisible(releaseRing, true);
          kaiju.position.set(0, 0, 0.18);
          kaiju.rotation.y = 0;
          kaiju.scale.setScalar(reducedMotion ? 1 : 1.16);
          torso.material = materials.pass;
          head.material = materials.pass;
          break;
      }
      placeMarker(view.tutorialTarget ?? null);
      if (suspended) marker.visible = false;
    },
    setSuspended(nextSuspended) {
      suspended = nextSuspended;
      if (suspended) marker.visible = false;
    },
    setReducedMotion(nextReducedMotion) {
      reducedMotion = nextReducedMotion;
    },
    resetView() {
      if (disposed) return;
      root.position.set(0, 0.78, -1.3);
      root.rotation.set(0, 0, 0);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      CONTROL_CALLBACKS.delete(world);
      for (const entity of ownedEntities.slice().reverse()) {
        CONTROL_INTENTS.delete(entity as object);
        entity.destroy();
      }
      for (const geometry of geometries) geometry.dispose();
      for (const materialRef of Object.values(materials)) materialRef.dispose();
    },
  };
}
