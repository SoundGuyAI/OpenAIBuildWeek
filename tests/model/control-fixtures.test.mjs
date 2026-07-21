import assert from "node:assert/strict";
import test from "node:test";

globalThis.document ??= {
  createElement() {
    return {
      getContext() {
        return {
          arc() {},
          beginPath() {},
          clearRect() {},
          fill() {},
          stroke() {},
        };
      },
    };
  },
};

const { Group, MeshBasicMaterial } = await import("@iwsdk/core");
const {
  CONTROL_TABLETOP_DEPTH,
  CONTROL_TABLETOP_WIDTH,
  RULE_RACK_CARTRIDGE_IDS,
  RUN_TESTS_LABEL,
  RUN_TESTS_LEVER_PULLED_ANGLE,
  RUN_TESTS_LEVER_UPRIGHT_ANGLE,
  createRuleRack,
  createRunTestsLever,
  leverAngleFromProgress,
  leverProgressFromAngle,
} = await import("../../src/kaiju-qa/control-fixtures.ts");

function createOwnershipHarness() {
  const geometries = [];
  const materials = [];
  return {
    geometries,
    materials,
    ownGeometry(geometry) {
      geometries.push(geometry);
      return geometry;
    },
    ownMaterial(material) {
      materials.push(material);
      return material;
    },
  };
}

function almostEqual(actual, expected, epsilon = 1e-10) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `Expected ${actual} to be within ${epsilon} of ${expected}`,
  );
}

test("run-tests lever is upright, labeled, hinged, and owns its resources", () => {
  const ownership = createOwnershipHarness();
  const labels = [];
  const fixture = createRunTestsLever({
    ...ownership,
    createLabelMesh(label) {
      labels.push(label);
      const mesh = new Group();
      mesh.name = "supplied-label-mesh";
      return mesh;
    },
  });

  assert.equal(fixture.root.name, "run-tests-lever");
  assert.equal(fixture.base.parent, fixture.root);
  assert.equal(fixture.pivot.parent, fixture.root);
  assert.equal(fixture.handle.parent, fixture.pivot);
  assert.equal(fixture.hitTarget.parent, fixture.handle);
  assert.equal(fixture.labelAnchor.parent, fixture.root);
  assert.equal(fixture.labelMesh?.parent, fixture.labelAnchor);
  assert.deepEqual(labels, [RUN_TESTS_LABEL]);

  almostEqual(fixture.pivot.rotation.x, RUN_TESTS_LEVER_UPRIGHT_ANGLE);
  assert.ok(fixture.pivot.position.y > 0);
  assert.ok(fixture.hitTarget.position.y > fixture.pivot.position.y);
  assert.ok(fixture.root.getObjectByName("run-tests-lever-knob").position.y > 0.45);

  const hitMaterial = fixture.hitTarget.material;
  assert.ok(hitMaterial instanceof MeshBasicMaterial);
  assert.equal(hitMaterial.opacity, 0);
  assert.equal(hitMaterial.depthWrite, false);
  assert.ok(ownership.geometries.length >= 9);
  assert.ok(ownership.materials.length >= 6);
});

test("lever angle and progress conversions are deterministic and clamped", () => {
  almostEqual(leverAngleFromProgress(0), RUN_TESTS_LEVER_UPRIGHT_ANGLE);
  almostEqual(leverAngleFromProgress(0.5), Math.PI / 6);
  almostEqual(leverAngleFromProgress(1), RUN_TESTS_LEVER_PULLED_ANGLE);
  almostEqual(leverAngleFromProgress(-4), RUN_TESTS_LEVER_UPRIGHT_ANGLE);
  almostEqual(leverAngleFromProgress(4), RUN_TESTS_LEVER_PULLED_ANGLE);

  almostEqual(leverProgressFromAngle(RUN_TESTS_LEVER_UPRIGHT_ANGLE), 0);
  almostEqual(leverProgressFromAngle(Math.PI / 6), 0.5);
  almostEqual(leverProgressFromAngle(RUN_TESTS_LEVER_PULLED_ANGLE), 1);
  almostEqual(leverProgressFromAngle(-1), 0);
  almostEqual(leverProgressFromAngle(Math.PI), 1);

  const ownership = createOwnershipHarness();
  const fixture = createRunTestsLever(ownership);
  almostEqual(fixture.setProgress(0.75), Math.PI / 4);
  almostEqual(fixture.pivot.rotation.x, Math.PI / 4);
  almostEqual(fixture.getProgress(), 0.75);
  almostEqual(fixture.progressFromAngle(fixture.angleFromProgress(0.37)), 0.37);
});

test("rule rack exposes three separated homes and a separate in-bounds dock", () => {
  const ownership = createOwnershipHarness();
  const fixture = createRuleRack(ownership);

  assert.equal(fixture.rack.parent, fixture.root);
  assert.equal(fixture.installationDock.parent, fixture.root);
  assert.notEqual(fixture.installationDock.parent, fixture.rack);
  assert.deepEqual(Object.keys(fixture.cartridgeHomes), [
    "broad",
    "alternate",
    "targeted",
  ]);
  assert.deepEqual(Object.keys(fixture.slots), [
    "broad",
    "alternate",
    "targeted",
  ]);
  assert.deepEqual(fixture.tabletopSize, {
    width: CONTROL_TABLETOP_WIDTH,
    depth: CONTROL_TABLETOP_DEPTH,
  });

  const homes = RULE_RACK_CARTRIDGE_IDS.map(
    (id) => fixture.cartridgeHomes[id],
  );
  for (let first = 0; first < homes.length; first += 1) {
    for (let second = first + 1; second < homes.length; second += 1) {
      assert.ok(homes[first].distanceTo(homes[second]) >= 0.6);
    }
  }

  for (const home of homes) {
    assert.ok(Math.abs(home.x) < CONTROL_TABLETOP_WIDTH / 2);
    assert.ok(Math.abs(home.z) < CONTROL_TABLETOP_DEPTH / 2);
    assert.ok(
      home.distanceTo(fixture.installationDockLocation) >= 1,
      "The installation dock must not read as a fourth rack slot.",
    );
  }

  assert.ok(
    Math.abs(fixture.installationDockLocation.x) <
      CONTROL_TABLETOP_WIDTH / 2,
  );
  assert.ok(
    Math.abs(fixture.installationDockLocation.z) <
      CONTROL_TABLETOP_DEPTH / 2,
  );
  assert.equal(
    fixture.installationDock.position.x,
    fixture.installationDockLocation.x,
  );
  assert.equal(
    fixture.installationDock.position.z,
    fixture.installationDockLocation.z,
  );
  assert.ok(ownership.geometries.length >= 20);
  assert.ok(ownership.materials.length >= 5);
});
