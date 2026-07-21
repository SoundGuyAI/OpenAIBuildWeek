import { AssetType, type AssetManifest } from "@iwsdk/core";

const root = "./assets/kaiju-qa";

export const KAIJU_QA_ASSETS = {
  kaiju: {
    url: `${root}/models/characters/kaiju.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  cityHospital: {
    url: `${root}/models/city/hospital.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  cityFlat: {
    url: `${root}/models/city/flat.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  cityHouse: {
    url: `${root}/models/city/house.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  cityShop: {
    url: `${root}/models/city/shop.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  vehicleCar: {
    url: `${root}/models/vehicles/car.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  vehicleSuv: {
    url: `${root}/models/vehicles/suv.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  vehicleEmergency: {
    url: `${root}/models/vehicles/emergency.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labArrow: {
    url: `${root}/models/lab/arrow-rounded.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labLever: {
    url: `${root}/models/lab/lever-single.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labCrane: {
    url: `${root}/models/lab/crane.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labCraneMagnet: {
    url: `${root}/models/lab/crane-magnet.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labRobotArmA: {
    url: `${root}/models/lab/robot-arm-a.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labRobotArmB: {
    url: `${root}/models/lab/robot-arm-b.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labScanner: {
    url: `${root}/models/lab/scanner-low.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labScreen: {
    url: `${root}/models/lab/screen-panel-wide.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labWarning: {
    url: `${root}/models/lab/warning-traffic.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labIndicatorArrow: {
    url: `${root}/models/lab/indicator-special-arrow.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labIndicatorCross: {
    url: `${root}/models/lab/indicator-special-cross.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labButton: {
    url: `${root}/models/lab/button-floor-round.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labMachine: {
    url: `${root}/models/lab/machine-window.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labCog: {
    url: `${root}/models/lab/cog-c.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labConveyor: {
    url: `${root}/models/lab/conveyor-stripe.glb`,
    type: AssetType.GLTF,
    priority: "critical",
  },
  labBackdrop: {
    url: `${root}/textures/lab-backdrop.png`,
    type: AssetType.Texture,
    priority: "critical",
  },
} satisfies AssetManifest;

export type KaijuQaAssetId = keyof typeof KAIJU_QA_ASSETS;
