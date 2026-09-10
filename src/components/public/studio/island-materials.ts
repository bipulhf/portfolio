import {
  CanvasTexture,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";

/** Small, deterministic surface maps. Generated once, with no texture downloads. */
export function createIslandMaterials() {
  const textures: CanvasTexture[] = [];
  let seed = 704;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  function surface(kind: "wood" | "plaster" | "stone" | "lawn", base: string) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3400; i++) {
      ctx.fillStyle =
        random() > 0.5
          ? `rgba(255,249,225,${random() * 0.13})`
          : `rgba(39,43,24,${random() * 0.12})`;
      const x = random() * 256,
        y = random() * 256;
      if (kind === "wood")
        ctx.fillRect(x, y, 10 + random() * 65, 0.4 + random());
      else
        ctx.fillRect(
          x,
          y,
          0.7 + random() * 2,
          kind === "lawn" ? 2 + random() * 6 : 0.7 + random() * 2,
        );
    }
    if (kind === "wood") {
      ctx.strokeStyle = "#5a3e2424";
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.ellipse(
          random() * 256,
          random() * 256,
          12 + random() * 18,
          1.5 + random() * 2,
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
    }
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    map.wrapS = map.wrapT = RepeatWrapping;
    map.anisotropy = 2;
    textures.push(map);
    return map;
  }
  const plasterMap = surface("plaster", "#ddd0b8");
  const woodMap = surface("wood", "#99704a");
  const stoneMap = surface("stone", "#c8c3af");
  const lawnMap = surface("lawn", "#8d9d73");
  return {
    textures,
    plaster: new MeshStandardMaterial({
      map: plasterMap,
      bumpMap: plasterMap,
      bumpScale: 0.018,
      roughness: 0.92,
    }),
    wood: new MeshStandardMaterial({
      map: woodMap,
      bumpMap: woodMap,
      bumpScale: 0.025,
      roughness: 0.72,
    }),
    stone: new MeshStandardMaterial({
      map: stoneMap,
      bumpMap: stoneMap,
      bumpScale: 0.025,
      roughness: 0.93,
    }),
    lawn: new MeshStandardMaterial({ map: lawnMap, roughness: 1 }),
    metal: new MeshStandardMaterial({
      color: "#31493f",
      roughness: 0.46,
      metalness: 0.55,
    }),
    glass: new MeshStandardMaterial({
      color: "#648e91",
      roughness: 0.18,
      metalness: 0.45,
    }),
    terra: new MeshStandardMaterial({ color: "#a35438", roughness: 0.85 }),
    foliage: new MeshStandardMaterial({ color: "#ffffff", roughness: 1 }),
    soil: new MeshStandardMaterial({ color: "#514936", roughness: 1 }),
    cream: new MeshStandardMaterial({ color: "#e6dabc", roughness: 0.85 }),
  };
}
export type IslandMaterials = ReturnType<typeof createIslandMaterials>;
