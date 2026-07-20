import { createComponent, createSystem, Types } from "@iwsdk/core";

export const FloatingWord = createComponent("FloatingWord", {
  baseY: { type: Types.Float32, default: 1.8 },
  amplitude: { type: Types.Float32, default: 0.08 },
  speed: { type: Types.Float32, default: 0.8 },
  enabled: { type: Types.Boolean, default: true },
});

export class FloatingWordSystem extends createSystem({
  words: { required: [FloatingWord] },
}) {
  private elapsed = 0;

  update(delta: number) {
    this.elapsed += Math.min(delta, 0.1);

    for (const entity of this.queries.words.entities) {
      const object = entity.object3D;
      if (!object) continue;

      const index = entity.index;
      const baseY = FloatingWord.data.baseY[index];
      const enabled = Boolean(FloatingWord.data.enabled[index]);

      if (!enabled) {
        object.position.y = baseY;
        object.rotation.y = 0;
        continue;
      }

      const speed = FloatingWord.data.speed[index];
      object.position.y =
        baseY + Math.sin(this.elapsed * speed) * FloatingWord.data.amplitude[index];
      object.rotation.y = Math.sin(this.elapsed * speed * 0.45) * 0.08;
    }
  }
}

