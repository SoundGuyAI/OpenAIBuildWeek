"""Prepare the small, audited Kaiju QA model subset for the browser.

Run with Blender, for example:

    blender --background --python scripts/prepare-kaiju-qa-assets.py -- \
      --quaternius-source-root source-assets/kaiju-qa/quaternius \
      --kenney-source-root source-assets/kaiju-qa/kenney/factory-kit-extracted \
      --output-root public/assets/kaiju-qa/models

Quaternius FBX/glTF sources are normalized and exported with Blender. Kenney's
browser-ready Factory Kit GLBs are copied byte-for-byte. The exact downloaded
source cache is committed under source-assets/kaiju-qa for reproducibility.
"""

from __future__ import annotations

import argparse
import json
import shutil
import struct
import sys
from dataclasses import dataclass
from pathlib import Path

import bpy


@dataclass(frozen=True)
class Asset:
    source: str
    output: str
    animated: bool = False


QUATERNIUS_ASSETS = (
    Asset("ultimate-monsters/Dino.gltf", "characters/kaiju.glb", animated=True),
    Asset("simple-buildings/Hospital.fbx", "city/hospital.glb"),
    Asset("simple-buildings/Flat.fbx", "city/flat.glb"),
    Asset("simple-buildings/House.fbx", "city/house.glb"),
    Asset("simple-buildings/Shop.fbx", "city/shop.glb"),
    Asset("cars/NormalCar1.fbx", "vehicles/car.glb"),
    Asset("cars/SUV.fbx", "vehicles/suv.glb"),
    Asset("cars/Cop.fbx", "vehicles/emergency.glb"),
)

KENNEY_GLB_ASSETS = (
    Asset("Models/GLB format/arrow-rounded.glb", "lab/arrow-rounded.glb"),
    Asset("Models/GLB format/button-floor-round.glb", "lab/button-floor-round.glb"),
    Asset("Models/GLB format/cog-c.glb", "lab/cog-c.glb"),
    Asset("Models/GLB format/conveyor-stripe.glb", "lab/conveyor-stripe.glb"),
    Asset("Models/GLB format/crane-magnet.glb", "lab/crane-magnet.glb"),
    Asset("Models/GLB format/crane.glb", "lab/crane.glb"),
    Asset(
        "Models/GLB format/indicator-special-arrow.glb",
        "lab/indicator-special-arrow.glb",
    ),
    Asset(
        "Models/GLB format/indicator-special-cross.glb",
        "lab/indicator-special-cross.glb",
    ),
    Asset("Models/GLB format/lever-single.glb", "lab/lever-single.glb"),
    Asset("Models/GLB format/machine-window.glb", "lab/machine-window.glb"),
    Asset("Models/GLB format/robot-arm-a.glb", "lab/robot-arm-a.glb"),
    Asset("Models/GLB format/robot-arm-b.glb", "lab/robot-arm-b.glb"),
    Asset("Models/GLB format/scanner-low.glb", "lab/scanner-low.glb"),
    Asset("Models/GLB format/screen-panel-wide.glb", "lab/screen-panel-wide.glb"),
    Asset("Models/GLB format/warning-traffic.glb", "lab/warning-traffic.glb"),
)

KENNEY_AUXILIARY_ASSETS = (
    Asset(
        "Models/GLB format/Textures/colormap.png",
        "lab/Textures/colormap.png",
    ),
)


def parse_args() -> argparse.Namespace:
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--quaternius-source-root",
        "--source-root",
        dest="quaternius_source_root",
        type=Path,
        required=True,
        help="Selective Quaternius cache root; --source-root remains an alias.",
    )
    parser.add_argument(
        "--kenney-source-root",
        type=Path,
        help=(
            "Extracted Factory Kit root. Defaults to the sibling "
            "kenney/factory-kit-extracted directory next to the Quaternius cache."
        ),
    )
    parser.add_argument("--output-root", type=Path, required=True)
    return parser.parse_args(argv)


def validate_glb(path: Path) -> None:
    size = path.stat().st_size
    if size < 20:
        raise ValueError(f"GLB is empty or truncated: {path}")
    with path.open("rb") as stream:
        magic, version, declared_size = struct.unpack("<4sII", stream.read(12))
        json_size, json_type = struct.unpack("<I4s", stream.read(8))
        json_bytes = stream.read(json_size)
    if magic != b"glTF" or version != 2 or declared_size != size:
        raise ValueError(
            f"Invalid GLB header: {path} "
            f"(magic={magic!r}, version={version}, declared={declared_size}, actual={size})"
        )
    if json_type != b"JSON":
        raise ValueError(f"GLB JSON chunk is missing: {path}")
    document = json.loads(json_bytes.rstrip(b" \t\r\n\0").decode("utf-8"))
    for collection_name in ("buffers", "images"):
        for item in document.get(collection_name, []):
            uri = item.get("uri")
            if uri and not uri.startswith("data:"):
                dependency = path.parent / uri
                if not dependency.is_file() or dependency.stat().st_size == 0:
                    raise FileNotFoundError(
                        f"Missing GLB dependency for {path}: {dependency}"
                    )


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.images,
        bpy.data.armatures,
        bpy.data.actions,
    ):
        for block in list(collection):
            if block.users == 0:
                collection.remove(block)


def import_asset(path: Path) -> None:
    suffix = path.suffix.lower()
    if suffix in {".gltf", ".glb"}:
        bpy.ops.import_scene.gltf(filepath=str(path))
        return
    if suffix == ".fbx":
        bpy.ops.import_scene.fbx(filepath=str(path), use_anim=False)
        return
    raise ValueError(f"Unsupported source format: {path}")


def prepare_scene(animated: bool) -> None:
    for obj in list(bpy.context.scene.objects):
        if obj.type in {"CAMERA", "LIGHT"}:
            bpy.data.objects.remove(obj, do_unlink=True)
            continue
        if obj.type == "MESH":
            for polygon in obj.data.polygons:
                polygon.use_smooth = True
            obj.data.name = f"{obj.name}_Mesh"

    if not animated:
        for obj in bpy.context.scene.objects:
            obj.select_set(obj.type in {"MESH", "EMPTY"})
        bpy.context.view_layer.objects.active = next(
            (obj for obj in bpy.context.scene.objects if obj.type == "MESH"),
            None,
        )
        if bpy.context.view_layer.objects.active is not None:
            bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)


def export_asset(path: Path, animated: bool) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(path),
        export_format="GLB",
        export_yup=True,
        export_apply=not animated,
        export_animations=animated,
        export_skins=animated,
        export_morph=animated,
        export_materials="EXPORT",
        export_image_format="AUTO",
        export_cameras=False,
        export_lights=False,
    )
    validate_glb(path)


def copy_glb(source: Path, output: Path) -> None:
    validate_glb(source)
    output.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, output)
    validate_glb(output)


def copy_file(source: Path, output: Path) -> None:
    if source.stat().st_size == 0:
        raise ValueError(f"Source file is empty: {source}")
    output.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, output)
    if output.stat().st_size == 0:
        raise ValueError(f"Copied file is empty: {output}")


def main() -> None:
    args = parse_args()
    quaternius_source_root = args.quaternius_source_root.resolve()
    kenney_source_root = (
        args.kenney_source_root
        or quaternius_source_root.parent / "kenney" / "factory-kit-extracted"
    ).resolve()
    output_root = args.output_root.resolve()

    for asset in QUATERNIUS_ASSETS:
        source = quaternius_source_root / asset.source
        output = output_root / asset.output
        if not source.exists():
            raise FileNotFoundError(source)
        clear_scene()
        import_asset(source)
        prepare_scene(asset.animated)
        export_asset(output, asset.animated)
        print(f"Prepared {output}")

    for asset in KENNEY_AUXILIARY_ASSETS:
        source = kenney_source_root / asset.source
        output = output_root / asset.output
        if not source.exists():
            raise FileNotFoundError(source)
        copy_file(source, output)
        print(f"Copied {output}")

    for asset in KENNEY_GLB_ASSETS:
        source = kenney_source_root / asset.source
        output = output_root / asset.output
        if not source.exists():
            raise FileNotFoundError(source)
        copy_glb(source, output)
        print(f"Copied {output}")


if __name__ == "__main__":
    main()
