import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
  type Object3D,
} from "three";

export const CONTROL_TABLETOP_WIDTH = 4.7;
export const CONTROL_TABLETOP_DEPTH = 2.72;

export const RUN_TESTS_LABEL = "RUN TESTS";
export const RUN_TESTS_LEVER_UPRIGHT_ANGLE = 0;
export const RUN_TESTS_LEVER_PULLED_ANGLE = Math.PI / 3;

export const RULE_RACK_CARTRIDGE_IDS = [
  "broad",
  "alternate",
  "targeted",
] as const;

export type RuleRackCartridgeId = (typeof RULE_RACK_CARTRIDGE_IDS)[number];

export type FixtureMaterial = MeshStandardMaterial | MeshBasicMaterial;

export type OwnFixtureGeometry = <T extends BufferGeometry>(geometry: T) => T;
export type OwnFixtureMaterial = <T extends FixtureMaterial>(material: T) => T;
export type CreateFixtureLabelMesh = (label: string) => Object3D;

export interface FixtureOwnershipCallbacks {
  readonly ownGeometry: OwnFixtureGeometry;
  readonly ownMaterial: OwnFixtureMaterial;
}

export interface RunTestsLeverColors {
  readonly base: number;
  readonly metal: number;
  readonly handle: number;
  readonly accent: number;
  readonly labelPlate: number;
}

export interface CreateRunTestsLeverOptions extends FixtureOwnershipCallbacks {
  readonly createLabelMesh?: CreateFixtureLabelMesh;
  readonly colors?: Partial<RunTestsLeverColors>;
  readonly uprightAngle?: number;
  readonly pulledAngle?: number;
}

export interface RunTestsLeverFixture {
  readonly root: Group;
  readonly base: Group;
  readonly pivot: Group;
  readonly handle: Group;
  readonly hitTarget: Mesh;
  readonly labelAnchor: Group;
  readonly labelMesh: Object3D | null;
  readonly uprightAngle: number;
  readonly pulledAngle: number;
  readonly angleFromProgress: (progress: number) => number;
  readonly progressFromAngle: (angle: number) => number;
  readonly setProgress: (progress: number) => number;
  readonly getProgress: () => number;
}

export interface RuleRackColors {
  readonly frame: number;
  readonly slot: number;
  readonly marker: number;
  readonly dock: number;
  readonly dockAccent: number;
}

export interface CreateRuleRackOptions extends FixtureOwnershipCallbacks {
  readonly colors?: Partial<RuleRackColors>;
}

export interface RuleRackFixture {
  readonly root: Group;
  readonly rack: Group;
  readonly slots: Readonly<Record<RuleRackCartridgeId, Group>>;
  readonly cartridgeHomes: Readonly<Record<RuleRackCartridgeId, Vector3>>;
  readonly installationDock: Group;
  readonly installationDockLocation: Vector3;
  readonly tabletopSize: Readonly<{
    width: number;
    depth: number;
  }>;
}

const DEFAULT_LEVER_COLORS: RunTestsLeverColors = {
  base: 0x253940,
  metal: 0x94a8ad,
  handle: 0x314f58,
  accent: 0x62e2ef,
  labelPlate: 0x17272d,
};

const DEFAULT_RACK_COLORS: RuleRackColors = {
  frame: 0x263a42,
  slot: 0x536970,
  marker: 0xc8d5d8,
  dock: 0x314b54,
  dockAccent: 0x62e2ef,
};

// Keep the left-most cartridge comfortably inside the portrait camera while
// preserving clear separation from the installation dock.
const RULE_RACK_CENTER_X = -0.68;
const RULE_RACK_CENTER_Z = 0.98;
const RULE_RACK_SLOT_SPACING = 0.62;
const RULE_CARTRIDGE_HOME_Y = 0.085;
const INSTALLATION_DOCK_X = 1.05;
const INSTALLATION_DOCK_Z = 0.98;

function clampUnit(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function assertAngleRange(uprightAngle: number, pulledAngle: number): void {
  if (!Number.isFinite(uprightAngle) || !Number.isFinite(pulledAngle)) {
    throw new RangeError("Lever angles must be finite numbers.");
  }
  if (uprightAngle === pulledAngle) {
    throw new RangeError("Lever upright and pulled angles must be distinct.");
  }
}

export function leverAngleFromProgress(
  progress: number,
  uprightAngle = RUN_TESTS_LEVER_UPRIGHT_ANGLE,
  pulledAngle = RUN_TESTS_LEVER_PULLED_ANGLE,
): number {
  assertAngleRange(uprightAngle, pulledAngle);
  return uprightAngle + (pulledAngle - uprightAngle) * clampUnit(progress);
}

export function leverProgressFromAngle(
  angle: number,
  uprightAngle = RUN_TESTS_LEVER_UPRIGHT_ANGLE,
  pulledAngle = RUN_TESTS_LEVER_PULLED_ANGLE,
): number {
  assertAngleRange(uprightAngle, pulledAngle);
  if (Number.isNaN(angle)) return 0;
  return clampUnit((angle - uprightAngle) / (pulledAngle - uprightAngle));
}

function standardMaterial(
  ownMaterial: OwnFixtureMaterial,
  color: number,
  options: Partial<{
    roughness: number;
    metalness: number;
    emissive: number;
    emissiveIntensity: number;
  }> = {},
): MeshStandardMaterial {
  return ownMaterial(
    new MeshStandardMaterial({
      color,
      roughness: options.roughness ?? 0.62,
      metalness: options.metalness ?? 0.08,
      emissive: options.emissive ?? 0x000000,
      emissiveIntensity: options.emissiveIntensity ?? 0,
    }),
  );
}

function fixtureMesh(
  geometry: BufferGeometry,
  material: FixtureMaterial,
): Mesh {
  const result = new Mesh(geometry, material);
  result.castShadow = true;
  result.receiveShadow = true;
  return result;
}

export function createRunTestsLever({
  ownGeometry,
  ownMaterial,
  createLabelMesh,
  colors: colorOverrides,
  uprightAngle = RUN_TESTS_LEVER_UPRIGHT_ANGLE,
  pulledAngle = RUN_TESTS_LEVER_PULLED_ANGLE,
}: CreateRunTestsLeverOptions): RunTestsLeverFixture {
  assertAngleRange(uprightAngle, pulledAngle);

  const colors = { ...DEFAULT_LEVER_COLORS, ...colorOverrides };
  const materials = {
    base: standardMaterial(ownMaterial, colors.base, { roughness: 0.72 }),
    metal: standardMaterial(ownMaterial, colors.metal, {
      roughness: 0.34,
      metalness: 0.42,
    }),
    handle: standardMaterial(ownMaterial, colors.handle, { roughness: 0.5 }),
    accent: standardMaterial(ownMaterial, colors.accent, {
      roughness: 0.38,
      emissive: colors.accent,
      emissiveIntensity: 0.22,
    }),
    labelPlate: standardMaterial(ownMaterial, colors.labelPlate, {
      roughness: 0.76,
    }),
    hitTarget: ownMaterial(
      new MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        colorWrite: false,
      }),
    ),
  };

  const root = new Group();
  root.name = "run-tests-lever";
  root.userData.fixture = "run-tests-lever";

  const base = new Group();
  base.name = "run-tests-lever-base";

  const pedestal = fixtureMesh(
    ownGeometry(new BoxGeometry(0.44, 0.12, 0.34)),
    materials.base,
  );
  pedestal.name = "run-tests-lever-pedestal";
  pedestal.position.y = 0.06;

  const labelPlate = fixtureMesh(
    ownGeometry(new BoxGeometry(0.36, 0.105, 0.035)),
    materials.labelPlate,
  );
  labelPlate.name = "run-tests-label-plate";
  labelPlate.position.set(0, 0.105, 0.1775);

  const axle = fixtureMesh(
    ownGeometry(new CylinderGeometry(0.07, 0.07, 0.34, 18)),
    materials.metal,
  );
  axle.name = "run-tests-lever-axle";
  axle.position.y = 0.22;
  axle.rotation.z = Math.PI / 2;

  for (const x of [-0.14, 0.14]) {
    const support = fixtureMesh(
      ownGeometry(new BoxGeometry(0.065, 0.17, 0.09)),
      materials.base,
    );
    support.name = "run-tests-lever-hinge-support";
    support.position.set(x, 0.165, 0);
    base.add(support);
  }
  base.add(pedestal, labelPlate, axle);

  const pivot = new Group();
  pivot.name = "run-tests-lever-pivot";
  pivot.position.set(0, 0.22, 0);
  pivot.rotation.x = uprightAngle;
  pivot.userData.role = "lever-pivot";

  const handle = new Group();
  handle.name = "run-tests-lever-handle";

  const collar = fixtureMesh(
    ownGeometry(new CylinderGeometry(0.058, 0.058, 0.09, 16)),
    materials.metal,
  );
  collar.name = "run-tests-lever-collar";
  collar.position.y = 0.045;

  const stem = fixtureMesh(
    ownGeometry(new CylinderGeometry(0.035, 0.045, 0.42, 16)),
    materials.handle,
  );
  stem.name = "run-tests-lever-stem";
  stem.position.y = 0.25;

  const knob = fixtureMesh(
    ownGeometry(new SphereGeometry(0.09, 20, 14)),
    materials.accent,
  );
  knob.name = "run-tests-lever-knob";
  knob.position.y = 0.5;

  const hitTarget = fixtureMesh(
    ownGeometry(new BoxGeometry(0.26, 0.62, 0.26)),
    materials.hitTarget,
  );
  hitTarget.name = "run-tests-lever-hit-target";
  hitTarget.position.y = 0.29;
  hitTarget.castShadow = false;
  hitTarget.receiveShadow = false;
  hitTarget.userData.role = "handle-hit-target";

  handle.add(collar, stem, knob, hitTarget);
  pivot.add(handle);

  const labelAnchor = new Group();
  labelAnchor.name = "run-tests-lever-label";
  labelAnchor.position.set(0, 0.105, 0.198);
  labelAnchor.userData.text = RUN_TESTS_LABEL;
  const labelMesh = createLabelMesh?.(RUN_TESTS_LABEL) ?? null;
  if (labelMesh) labelAnchor.add(labelMesh);

  root.add(base, pivot, labelAnchor);

  const angleFromProgress = (progress: number): number =>
    leverAngleFromProgress(progress, uprightAngle, pulledAngle);
  const progressFromAngle = (angle: number): number =>
    leverProgressFromAngle(angle, uprightAngle, pulledAngle);
  const setProgress = (progress: number): number => {
    const angle = angleFromProgress(progress);
    pivot.rotation.x = angle;
    pivot.userData.progress = progressFromAngle(angle);
    return angle;
  };
  const getProgress = (): number => progressFromAngle(pivot.rotation.x);

  setProgress(0);

  return {
    root,
    base,
    pivot,
    handle,
    hitTarget,
    labelAnchor,
    labelMesh,
    uprightAngle,
    pulledAngle,
    angleFromProgress,
    progressFromAngle,
    setProgress,
    getProgress,
  };
}

function addSlotIdentity(
  slot: Group,
  id: RuleRackCartridgeId,
  ownGeometry: OwnFixtureGeometry,
  markerMaterial: MeshStandardMaterial,
): void {
  if (id === "broad") {
    for (const x of [-0.12, 0, 0.12]) {
      const bar = fixtureMesh(
        ownGeometry(new BoxGeometry(0.035, 0.025, 0.16)),
        markerMaterial,
      );
      bar.position.set(x, 0.105, -0.075);
      slot.add(bar);
    }
    return;
  }

  if (id === "alternate") {
    for (const x of [-0.12, 0, 0.12]) {
      const stud = fixtureMesh(
        ownGeometry(new CylinderGeometry(0.027, 0.027, 0.026, 12)),
        markerMaterial,
      );
      stud.position.set(x, 0.105, -0.075);
      slot.add(stud);
    }
    return;
  }

  for (const x of [-0.16, 0.16]) {
    const rail = fixtureMesh(
      ownGeometry(new BoxGeometry(0.03, 0.026, 0.18)),
      markerMaterial,
    );
    rail.position.set(x, 0.105, -0.075);
    slot.add(rail);
  }
}

export function createRuleRack({
  ownGeometry,
  ownMaterial,
  colors: colorOverrides,
}: CreateRuleRackOptions): RuleRackFixture {
  const colors = { ...DEFAULT_RACK_COLORS, ...colorOverrides };
  const materials = {
    frame: standardMaterial(ownMaterial, colors.frame, {
      roughness: 0.52,
      metalness: 0.16,
    }),
    slot: standardMaterial(ownMaterial, colors.slot, { roughness: 0.7 }),
    marker: standardMaterial(ownMaterial, colors.marker, { roughness: 0.46 }),
    dock: standardMaterial(ownMaterial, colors.dock, { roughness: 0.58 }),
    dockAccent: standardMaterial(ownMaterial, colors.dockAccent, {
      roughness: 0.4,
      emissive: colors.dockAccent,
      emissiveIntensity: 0.18,
    }),
  };

  const root = new Group();
  root.name = "rule-control-fixtures";
  root.userData.tabletopWidth = CONTROL_TABLETOP_WIDTH;
  root.userData.tabletopDepth = CONTROL_TABLETOP_DEPTH;

  const rack = new Group();
  rack.name = "rule-cartridge-rack";
  rack.position.set(RULE_RACK_CENTER_X, 0, RULE_RACK_CENTER_Z);

  const rackBase = fixtureMesh(
    ownGeometry(new BoxGeometry(1.9, 0.07, 0.48)),
    materials.frame,
  );
  rackBase.name = "rule-rack-base";
  rackBase.position.y = 0.035;

  const backRail = fixtureMesh(
    ownGeometry(new BoxGeometry(1.9, 0.16, 0.045)),
    materials.frame,
  );
  backRail.name = "rule-rack-back-rail";
  backRail.position.set(0, 0.12, -0.2175);
  rack.add(rackBase, backRail);

  const slots = {} as Record<RuleRackCartridgeId, Group>;
  const cartridgeHomes = {} as Record<RuleRackCartridgeId, Vector3>;

  RULE_RACK_CARTRIDGE_IDS.forEach((id, index) => {
    const slotX = (index - 1) * RULE_RACK_SLOT_SPACING;
    const slot = new Group();
    slot.name = `rule-rack-slot-${id}`;
    slot.position.x = slotX;
    slot.userData.ruleId = id;

    const pad = fixtureMesh(
      ownGeometry(new BoxGeometry(0.54, 0.025, 0.36)),
      materials.slot,
    );
    pad.name = `rule-rack-slot-${id}-pad`;
    pad.position.y = 0.0825;
    slot.add(pad);

    for (const guideX of [-0.275, 0.275]) {
      const guide = fixtureMesh(
        ownGeometry(new BoxGeometry(0.035, 0.08, 0.38)),
        materials.frame,
      );
      guide.position.set(guideX, 0.11, 0);
      slot.add(guide);
    }

    addSlotIdentity(slot, id, ownGeometry, materials.marker);
    rack.add(slot);
    slots[id] = slot;
    cartridgeHomes[id] = new Vector3(
      RULE_RACK_CENTER_X + slotX,
      RULE_CARTRIDGE_HOME_Y,
      RULE_RACK_CENTER_Z,
    );
  });

  const installationDock = new Group();
  installationDock.name = "rule-installation-dock";
  installationDock.position.set(INSTALLATION_DOCK_X, 0, INSTALLATION_DOCK_Z);
  installationDock.userData.role = "installation-dock";

  const dockBase = fixtureMesh(
    ownGeometry(new BoxGeometry(0.68, 0.07, 0.5)),
    materials.dock,
  );
  dockBase.name = "rule-installation-dock-base";
  dockBase.position.y = 0.035;

  const dockPad = fixtureMesh(
    ownGeometry(new BoxGeometry(0.54, 0.025, 0.36)),
    materials.dockAccent,
  );
  dockPad.name = "rule-installation-dock-pad";
  dockPad.position.y = 0.0825;
  installationDock.add(dockBase, dockPad);

  for (const x of [-0.31, 0.31]) {
    for (const z of [-0.22, 0.22]) {
      const corner = fixtureMesh(
        ownGeometry(new BoxGeometry(0.04, 0.11, 0.04)),
        materials.frame,
      );
      corner.position.set(x, 0.095, z);
      installationDock.add(corner);
    }
  }

  root.add(rack, installationDock);

  return {
    root,
    rack,
    slots,
    cartridgeHomes,
    installationDock,
    installationDockLocation: new Vector3(
      INSTALLATION_DOCK_X,
      RULE_CARTRIDGE_HOME_Y,
      INSTALLATION_DOCK_Z,
    ),
    tabletopSize: {
      width: CONTROL_TABLETOP_WIDTH,
      depth: CONTROL_TABLETOP_DEPTH,
    },
  };
}
