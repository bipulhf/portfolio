import {
  CanvasTexture,
  Color,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SRGBColorSpace,
} from "three";

export function createDioramaMaterials() {
  const textures: CanvasTexture[] = [];

  function makeCanvasTexture(
    width: number,
    height: number,
    draw: (ctx: CanvasRenderingContext2D) => void,
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) draw(ctx);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;
    textures.push(texture);
    return texture;
  }

  return {
    textures,
    makeCanvasTexture,
    // Rich, saturated meadow-apple green matching the reference grass cushion
    grass: new MeshStandardMaterial({
      color: "#63a91f",
      roughness: 0.72,
      metalness: 0.01,
    }),
    // Base white clay material tinted per-instance for earth blocks & pine tiers
    tintedClay: new MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.7,
      metalness: 0.01,
    }),
    // Deep, rich marigold-amber A-frame tent canvas matching reference saturation
    tentYellow: new MeshPhysicalMaterial({
      color: "#eea608",
      roughness: 0.56,
      metalness: 0.01,
      clearcoat: 0.1,
      clearcoatRoughness: 0.52,
      sheen: 0.25,
      sheenRoughness: 0.65,
      sheenColor: new Color("#ffd966"),
    }),
    tentAmber: new MeshStandardMaterial({
      color: "#c97d06",
      roughness: 0.62,
      metalness: 0.02,
    }),
    tentInterior: new MeshStandardMaterial({
      color: "#22150c",
      roughness: 0.92,
    }),
    tentGlow: new MeshBasicMaterial({
      color: "#ffd175",
    }),
    woodDark: new MeshStandardMaterial({
      color: "#4e2d16",
      roughness: 0.76,
      metalness: 0.02,
    }),
    woodWarm: new MeshStandardMaterial({
      color: "#844b24",
      roughness: 0.68,
      metalness: 0.02,
    }),
    woodLight: new MeshStandardMaterial({
      color: "#c7945c",
      roughness: 0.68,
      metalness: 0.02,
    }),
    chairFabric: new MeshStandardMaterial({
      color: "#5f3b27",
      roughness: 0.74,
      metalness: 0.02,
    }),
    chromeFrame: new MeshStandardMaterial({
      color: "#e6ebf3",
      roughness: 0.26,
      metalness: 0.6,
    }),
    castIron: new MeshStandardMaterial({
      color: "#1c1f26",
      roughness: 0.48,
      metalness: 0.32,
    }),
    emberOrange: new MeshBasicMaterial({
      color: "#ff6a1a",
    }),
    flameGold: new MeshBasicMaterial({
      color: "#ffc233",
    }),
    steamWhite: new MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.92,
      transparent: true,
      opacity: 0.74,
    }),
    coralPost: new MeshPhysicalMaterial({
      color: "#db492c",
      roughness: 0.44,
      metalness: 0.04,
      clearcoat: 0.2,
      clearcoatRoughness: 0.38,
    }),
    goldTrophy: new MeshStandardMaterial({
      color: "#f2b71d",
      roughness: 0.25,
      metalness: 0.72,
    }),
    creamPaper: new MeshStandardMaterial({
      color: "#fcf3e0",
      roughness: 0.78,
    }),
    slateInk: new MeshStandardMaterial({
      color: "#222a3a",
      roughness: 0.52,
      metalness: 0.1,
    }),
    tealBadge: new MeshStandardMaterial({
      color: "#2d7d6c",
      roughness: 0.58,
    }),
    skyBadge: new MeshStandardMaterial({
      color: "#3b6bb0",
      roughness: 0.58,
    }),
    flowerWhite: new MeshStandardMaterial({
      color: "#f9f8ff",
      roughness: 0.62,
    }),
    flowerCenter: new MeshStandardMaterial({
      color: "#f2b818",
      roughness: 0.58,
    }),
    leafGreen: new MeshStandardMaterial({
      color: "#488c1e",
      roughness: 0.65,
    }),
  };
}

export type DioramaMaterials = ReturnType<typeof createDioramaMaterials>;
