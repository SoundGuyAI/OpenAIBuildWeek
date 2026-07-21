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

const { Vector3 } = await import("@iwsdk/core");
const {
  fallbackWorkbenchPosition,
  isHorizontalPlacementNormal,
} = await import("../../src/kaiju-qa/mr-placement-model.ts");
const { xrSessionUsesPassthrough } = await import("../../src/xr-capabilities.ts");

test("accepts horizontal placement normals and rejects steep surfaces", () => {
  assert.equal(isHorizontalPlacementNormal(new Vector3(0, 1, 0)), true);
  assert.equal(
    isHorizontalPlacementNormal(
      new Vector3(0, 1, 0).applyAxisAngle(
        new Vector3(1, 0, 0),
        (19 * Math.PI) / 180,
      ),
    ),
    true,
  );
  assert.equal(
    isHorizontalPlacementNormal(
      new Vector3(0, 1, 0).applyAxisAngle(
        new Vector3(1, 0, 0),
        (21 * Math.PI) / 180,
      ),
    ),
    false,
  );
  assert.equal(isHorizontalPlacementNormal(new Vector3(0, 0, 1)), false);
  assert.equal(isHorizontalPlacementNormal(new Vector3()), false);
});

test("manual fallback starts in front of the player at tabletop height", () => {
  const result = fallbackWorkbenchPosition(
    new Vector3(2, 1.65, 3),
    new Vector3(0, -0.4, -1),
  );
  assert.ok(Math.abs(result.x - 2) < 1e-9);
  assert.ok(Math.abs(result.y - 0.8) < 1e-9);
  assert.ok(Math.abs(result.z - 2.15) < 1e-9);

  const verticalLook = fallbackWorkbenchPosition(
    new Vector3(0, 4, 0),
    new Vector3(0, -1, 0),
  );
  assert.deepEqual(verticalLook.toArray(), [0, 1.15, -0.85]);
});

test("passthrough requires a non-opaque environment blend mode", () => {
  assert.equal(xrSessionUsesPassthrough({ environmentBlendMode: "alpha-blend" }), true);
  assert.equal(xrSessionUsesPassthrough({ environmentBlendMode: "additive" }), true);
  assert.equal(xrSessionUsesPassthrough({ environmentBlendMode: "opaque" }), false);
});
