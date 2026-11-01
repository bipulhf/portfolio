import {
  Color,
  CylinderGeometry,
  Group,
  InstancedMesh,
  Mesh,
  Object3D,
  SphereGeometry,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { DioramaMaterials } from "./diorama-materials";
import { createFlutedPineTierGeometry } from "./diorama-pine-geometry";

export function buildDioramaNature(materials: DioramaMaterials) {
  const root = new Group();
  const dummy = new Object3D();
  const color = new Color();

  // 1. Segmented terracotta-brown earth blocks forming a chunky visible base rim
  const earthBlockGeo = new RoundedBoxGeometry(2.54, 0.96, 2.54, 4, 0.18);
  const earthPalette = ["#7d3f1d", "#8d4923", "#733919", "#854420", "#7a3d1c"];
  const earthCoords: [number, number, string][] = [];
  const step = 2.56;
  for (let gx = -2; gx <= 2; gx++) {
    for (let gz = -2; gz <= 2; gz++) {
      // Only perimeter blocks are visible from outside, keeping draw count lean
      if (Math.abs(gx) === 2 || Math.abs(gz) === 2) {
        const shade = earthPalette[(Math.abs(gx * 3 + gz * 7)) % earthPalette.length];
        earthCoords.push([gx * step, gz * step, shade]);
      }
    }
  }
  const earthMesh = new InstancedMesh(
    earthBlockGeo,
    materials.tintedClay,
    earthCoords.length,
  );
  earthCoords.forEach(([x, z, hex], index) => {
    dummy.position.set(x, -0.84, z);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    earthMesh.setMatrixAt(index, dummy.matrix);
    earthMesh.setColorAt(index, color.set(hex));
  });
  earthMesh.castShadow = true;
  earthMesh.receiveShadow = true;
  earthMesh.raycast = () => {};
  root.add(earthMesh);

  // 2. Plump rounded lush-green turf cushion sitting snugly atop the earth blocks
  const turfGeo = new RoundedBoxGeometry(13.45, 0.84, 13.45, 6, 0.38);
  const turf = new Mesh(turfGeo, materials.grass);
  turf.position.set(0, -0.34, 0);
  turf.castShadow = true;
  turf.receiveShadow = true;
  turf.raycast = () => {};
  root.add(turf);

  // Gentle mossy terrain mounds under the back pine grove for organic depth
  const moundGeo = new SphereGeometry(1, 18, 12);
  for (const [mx, mz, sx, sy, sz] of [
    [-4.3, -4.3, 2.3, 0.32, 2.3],
    [-1.4, -4.7, 2.4, 0.25, 1.6],
    [-4.7, -1.4, 1.6, 0.25, 2.4],
    [2.6, -4.5, 2.1, 0.22, 1.5],
  ] as const) {
    const mound = new Mesh(moundGeo, materials.grass);
    mound.position.set(mx, 0.01, mz);
    mound.scale.set(sx, sy, sz);
    mound.receiveShadow = true;
    mound.raycast = () => {};
    root.add(mound);
  }

  // 3. Sculpted pleated/fluted multi-tier pine forest cradling the back two edges
  const pineTrees: readonly [number, number, number, number][] = [
    // [x, z, scale, tiers]
    [-5.05, -5.05, 1.32, 7],
    [-3.45, -5.15, 1.18, 6],
    [-5.15, -3.45, 1.16, 6],
    [-1.75, -5.15, 1.12, 6],
    [-5.15, -1.75, 1.08, 6],
    [0.05, -5.05, 1.2, 7],
    [-3.75, -3.65, 1.02, 6],
    [1.85, -5.05, 1.1, 6],
    [-3.7, -1.95, 0.92, 5],
    [3.55, -4.95, 1.05, 6],
    [-2.05, -3.75, 0.96, 5],
    [5.05, -4.75, 0.98, 6],
    [0.95, -3.75, 0.88, 5],
    [4.95, -3.05, 0.9, 5],
    [3.25, -3.35, 0.84, 5],
    [5.15, -1.35, 0.74, 5],
    [-5.15, -0.15, 0.86, 5],
    [-5.05, 2.35, 0.72, 5],
  ];

  const totalTiers = pineTrees.reduce((sum, [, , , tiers]) => sum + tiers, 0);
  const pineTierGeo = createFlutedPineTierGeometry(11);
  const pineTierMesh = new InstancedMesh(
    pineTierGeo,
    materials.tintedClay,
    totalTiers,
  );
  const trunkGeo = new CylinderGeometry(0.15, 0.24, 1, 10);
  const trunkMesh = new InstancedMesh(
    trunkGeo,
    materials.woodDark,
    pineTrees.length,
  );

  // Lower boughs deep emerald-pine -> upper crown warm sunny olive-lime
  const pineGradient = [
    "#2c6525",
    "#367429",
    "#43852d",
    "#529731",
    "#63a935",
    "#76b939",
    "#86c63e",
  ];

  let tierCursor = 0;
  pineTrees.forEach(([tx, tz, scale, tiers], treeIdx) => {
    const trunkHeight = 1.15 * scale;
    dummy.position.set(tx, trunkHeight * 0.5, tz);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(scale, trunkHeight, scale);
    dummy.updateMatrix();
    trunkMesh.setMatrixAt(treeIdx, dummy.matrix);

    let y = 0.98 * scale;
    for (let t = 0; t < tiers; t++) {
      const progress = t / Math.max(1, tiers - 1);
      const radius = scale * (1.18 - progress * 0.66);
      const tierHeight = scale * (1.02 - progress * 0.26);
      dummy.position.set(tx, y, tz);
      dummy.rotation.set(
        (treeIdx % 3 - 1) * 0.02,
        treeIdx * 0.7 + t * 0.31,
        ((treeIdx + 1) % 3 - 1) * 0.02,
      );
      dummy.scale.set(radius, tierHeight, radius);
      dummy.updateMatrix();
      pineTierMesh.setMatrixAt(tierCursor, dummy.matrix);

      const paletteIdx = Math.min(
        pineGradient.length - 1,
        Math.round(progress * (pineGradient.length - 1)),
      );
      pineTierMesh.setColorAt(tierCursor, color.set(pineGradient[paletteIdx]));
      tierCursor++;
      y += tierHeight * 0.56;
    }
  });

  trunkMesh.castShadow = true;
  trunkMesh.receiveShadow = true;
  trunkMesh.raycast = () => {};
  pineTierMesh.castShadow = true;
  pineTierMesh.receiveShadow = true;
  pineTierMesh.raycast = () => {};
  root.add(trunkMesh, pineTierMesh);

  // 4. Smooth rounded river stepping pebbles curving across the meadow
  const pebbles: readonly [number, number, number, number, string][] = [
    [-0.1, 1.95, 0.34, 0.2, "#8f9aa6"],
    [-0.55, 2.45, 0.26, 0.8, "#9da8b4"],
    [0.35, 2.55, 0.3, -0.4, "#838e9b"],
    [0.95, 3.15, 0.33, 0.5, "#949fab"],
    [1.45, 3.75, 0.28, -0.3, "#8b96a3"],
    [2.15, 4.15, 0.35, 0.4, "#9aa5b1"],
    [2.55, 3.45, 0.25, 1.1, "#848f9c"],
    [1.65, 1.85, 0.32, 0.3, "#919ca8"],
    [2.35, 1.45, 0.28, -0.6, "#9ba6b3"],
    [1.95, 0.45, 0.24, 0.7, "#86919e"],
    [-2.15, 1.35, 0.3, 0.4, "#929da9"],
    [-2.85, 1.05, 0.25, -0.5, "#87929f"],
    [-1.85, 4.25, 0.32, 0.9, "#96a1ad"],
    [-0.35, 4.85, 0.28, 0.2, "#8994a1"],
    [0.55, 5.35, 0.34, -0.5, "#98a3af"],
    [4.45, 2.65, 0.31, 0.6, "#8d98a5"],
    [4.95, 2.15, 0.23, -0.2, "#9ca7b3"],
    [-4.35, 2.95, 0.29, 0.3, "#8c97a4"],
  ];

  const pebbleGeo = new SphereGeometry(1, 12, 8);
  const pebbleMesh = new InstancedMesh(
    pebbleGeo,
    materials.tintedClay,
    pebbles.length,
  );
  pebbles.forEach(([px, pz, size, rot, hex], idx) => {
    dummy.position.set(px, 0.07, pz);
    dummy.rotation.set(0, rot, 0);
    dummy.scale.set(size, size * 0.26, size * 0.78);
    dummy.updateMatrix();
    pebbleMesh.setMatrixAt(idx, dummy.matrix);
    pebbleMesh.setColorAt(idx, color.set(hex));
  });
  pebbleMesh.receiveShadow = true;
  pebbleMesh.raycast = () => {};
  root.add(pebbleMesh);

  // 5. Wildflower daisies & lush leaf rosettes (matching the white daisies in the reference!)
  const flowerSpots: readonly [number, number, number][] = [
    [1.15, 2.15, 1.0],
    [-3.15, 1.85, 0.95],
    [0.25, 5.1, 0.9],
    [4.55, 2.95, 0.92],
    [-2.45, 4.95, 0.88],
    [2.15, -1.95, 0.86],
    [-4.45, 3.35, 0.9],
  ];

  const leafGeo = new SphereGeometry(1, 8, 6);
  const leafMesh = new InstancedMesh(
    leafGeo,
    materials.leafGreen,
    flowerSpots.length * 5,
  );
  const petalMesh = new InstancedMesh(
    leafGeo,
    materials.flowerWhite,
    flowerSpots.length * 5,
  );
  const centerMesh = new InstancedMesh(
    leafGeo,
    materials.flowerCenter,
    flowerSpots.length,
  );

  let leafIdx = 0;
  let petalIdx = 0;
  flowerSpots.forEach(([fx, fz, s], spotIdx) => {
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2 + spotIdx * 0.4;
      dummy.position.set(
        fx + Math.cos(a) * 0.16 * s,
        0.13 * s,
        fz + Math.sin(a) * 0.16 * s,
      );
      dummy.rotation.set(Math.sin(a) * 0.55, -a, Math.cos(a) * 0.55);
      dummy.scale.set(0.065 * s, 0.21 * s, 0.095 * s);
      dummy.updateMatrix();
      leafMesh.setMatrixAt(leafIdx++, dummy.matrix);

      dummy.position.set(
        fx + Math.cos(a) * 0.085 * s,
        0.31 * s,
        fz + Math.sin(a) * 0.085 * s,
      );
      dummy.rotation.set(0, -a, 0);
      dummy.scale.set(0.058 * s, 0.028 * s, 0.092 * s);
      dummy.updateMatrix();
      petalMesh.setMatrixAt(petalIdx++, dummy.matrix);
    }

    dummy.position.set(fx, 0.32 * s, fz);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(0.055 * s, 0.042 * s, 0.055 * s);
    dummy.updateMatrix();
    centerMesh.setMatrixAt(spotIdx, dummy.matrix);
  });

  leafMesh.castShadow = true;
  leafMesh.raycast = () => {};
  petalMesh.raycast = () => {};
  centerMesh.raycast = () => {};
  root.add(leafMesh, petalMesh, centerMesh);

  return root;
}
