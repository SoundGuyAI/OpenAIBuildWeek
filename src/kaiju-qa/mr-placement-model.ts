import { MathUtils, Vector3 } from "@iwsdk/core";

const UP = new Vector3(0, 1, 0);
const HORIZONTAL_FORWARD = new Vector3();
const MIN_HORIZONTAL_DOT = Math.cos((20 * Math.PI) / 180);

export function isHorizontalPlacementNormal(normal: Vector3): boolean {
  const length = normal.length();
  // Plane providers are allowed to return either winding for the same surface.
  // Treat an upward or downward vertical normal as horizontal so a valid table
  // does not become an unplaceable red target in IWER or on-device meshes.
  return length > 1e-6 && Math.abs(normal.dot(UP) / length) >= MIN_HORIZONTAL_DOT;
}

export function fallbackWorkbenchPosition(
  origin: Vector3,
  forward: Vector3,
  result = new Vector3(),
): Vector3 {
  HORIZONTAL_FORWARD.copy(forward).setY(0);
  if (HORIZONTAL_FORWARD.lengthSq() < 1e-6) HORIZONTAL_FORWARD.set(0, 0, -1);
  HORIZONTAL_FORWARD.normalize();
  result.copy(origin).addScaledVector(HORIZONTAL_FORWARD, 0.85);
  result.y = MathUtils.clamp(origin.y - 0.85, 0.55, 1.15);
  return result;
}
