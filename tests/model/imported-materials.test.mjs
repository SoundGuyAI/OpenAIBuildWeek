import assert from "node:assert/strict";
import test from "node:test";

const { forceOpaqueImportedMaterial } = await import(
  "../../src/kaiju-qa/imported-materials.ts"
);

test("repairs zero-alpha opaque vehicle materials", () => {
  const material = {
    opacity: 0,
    transparent: false,
    alphaTest: 0.5,
    needsUpdate: false,
  };

  forceOpaqueImportedMaterial(material);

  assert.deepEqual(material, {
    opacity: 1,
    transparent: false,
    alphaTest: 0,
    needsUpdate: true,
  });
});
