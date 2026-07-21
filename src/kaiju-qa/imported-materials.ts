export interface ImportedOpaqueMaterial {
  opacity: number;
  transparent: boolean;
  alphaTest: number;
  needsUpdate: boolean;
}

/**
 * Repair opaque authored assets whose exporter wrote an alpha factor of zero.
 * This is intentionally opt-in so real glass, decals, and cutout materials keep
 * their authored transparency behavior.
 */
export function forceOpaqueImportedMaterial(
  material: ImportedOpaqueMaterial,
): void {
  material.opacity = 1;
  material.transparent = false;
  material.alphaTest = 0;
  material.needsUpdate = true;
}
