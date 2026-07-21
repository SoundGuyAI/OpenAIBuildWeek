import {
  CanvasTexture,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace,
} from "@iwsdk/core";

export interface CanvasPanel {
  readonly mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
  readonly canvas: HTMLCanvasElement;
  render(draw: (context: CanvasRenderingContext2D) => void): void;
  dispose(): void;
}

export function createCanvasPanel(
  worldWidth: number,
  worldHeight: number,
  pixelWidth = 1024,
): CanvasPanel {
  const canvas = document.createElement("canvas");
  canvas.width = pixelWidth;
  canvas.height = Math.max(1, Math.round(pixelWidth * (worldHeight / worldWidth)));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas is unavailable");

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;

  const geometry = new PlaneGeometry(worldWidth, worldHeight);
  const material = new MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  const mesh = new Mesh(geometry, material);
  mesh.renderOrder = 30;

  return {
    mesh,
    canvas,
    render(draw) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      draw(context);
      texture.needsUpdate = true;
    },
    dispose() {
      texture.dispose();
      material.dispose();
      geometry.dispose();
    },
  };
}

export function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

export function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3,
): number {
  const words = text.trim().split(/\s+/);
  let line = "";
  let lineIndex = 0;

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
      continue;
    }
    context.fillText(line, x, y + lineIndex * lineHeight);
    lineIndex += 1;
    if (lineIndex >= maxLines) return y + lineIndex * lineHeight;
    line = word;
  }
  if (line && lineIndex < maxLines) {
    context.fillText(line, x, y + lineIndex * lineHeight);
    lineIndex += 1;
  }
  return y + lineIndex * lineHeight;
}

export function setFittedFont(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxSize: number,
  minSize: number,
  weight = 800,
  family = "system-ui, sans-serif",
): number {
  let size = maxSize;
  while (size > minSize) {
    context.font = `${weight} ${size}px ${family}`;
    if (context.measureText(text).width <= maxWidth) return size;
    size -= 2;
  }
  context.font = `${weight} ${minSize}px ${family}`;
  return minSize;
}
