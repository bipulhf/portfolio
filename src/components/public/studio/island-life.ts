import {
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  SphereGeometry,
  TorusGeometry,
  type Material,
} from "three";
import type { IslandMaterials } from "./island-materials";
import type { createDetailBatches } from "./detail-batches";

type Point = readonly [number, number, number];
export function addIslandLife(
  batch: ReturnType<typeof createDetailBatches>,
  m: IslandMaterials,
) {
  const box = new BoxGeometry(1, 1, 1);
  const cylinder = new CylinderGeometry(1, 1, 1, 10);
  const pot = new CylinderGeometry(1, 0.73, 1, 12);
  const sphere = new SphereGeometry(1, 8, 6);
  const ring = new TorusGeometry(1, 0.075, 6, 28);
  function block(position: Point, scale: Point, material: Material = m.wood) {
    batch.add(box, material, position, scale);
  }
  function bench(x: number, z: number) {
    for (let slat = 0; slat < 4; slat++)
      block([x, 0.43, z - 0.24 + slat * 0.16], [1.85, 0.08, 0.12]);
    for (const side of [-1, 1]) {
      block([x + side * 0.67, 0.15, z], [0.09, 0.65, 0.48], m.metal);
      block([x + side * 0.67, 0.66, z - 0.29], [0.065, 0.75, 0.07], m.metal);
    }
    for (const y of [0.75, 0.95]) block([x, y, z - 0.31], [1.85, 0.14, 0.06]);
  }
  bench(4.4, -9.2);
  bench(-3.5, 7.9);
  bench(10.4, -1.5);
  // A shallow reflecting pool sits between the garden and the rear planting.
  batch.add(cylinder, m.stone, [7.5, -0.2, -10], [1.7, 0.16, 1.05]);
  batch.add(cylinder, m.glass, [7.5, -0.108, -10], [1.55, 0.015, 0.9]);
  batch.add(
    ring,
    m.stone,
    [7.5, -0.11, -10],
    [1.62, 0.98, 0.55],
    [Math.PI / 2, 0, 0],
  );
  for (const [dx, dz] of [
    [0.45, 0.25],
    [0.72, 0.05],
    [-0.65, -0.32],
  ]) {
    batch.add(
      sphere,
      m.foliage,
      [7.5 + dx, -0.093, -10 + dz],
      [0.17, 0.009, 0.13],
      [0, 0.3, 0],
      "#809569",
      false,
    );
  }
  // An outdoor table, two chairs and a canvas parasol beside the courtyard.
  const tableX = 7.4,
    tableZ = 7.65;
  batch.add(cylinder, m.wood, [tableX, 0.76, tableZ], [0.6, 0.08, 0.6]);
  batch.add(cylinder, m.metal, [tableX, 0.3, tableZ], [0.055, 0.9, 0.055]);
  batch.add(cylinder, m.metal, [tableX, -0.23, tableZ], [0.3, 0.05, 0.3]);
  for (const side of [-1, 1]) {
    const x = tableX + side * 1.0;
    block([x, 0.35, tableZ], [0.55, 0.08, 0.6]);
    block([x + side * 0.26, 0.67, tableZ], [0.06, 0.55, 0.6]);
    for (const dx of [-0.22, 0.22])
      for (const dz of [-0.24, 0.24])
        block([x + dx, 0.04, tableZ + dz], [0.055, 0.65, 0.055], m.metal);
  }
  batch.beam(
    cylinder,
    m.wood,
    [tableX, -0.2, tableZ],
    [tableX, 2.5, tableZ],
    0.038,
  );
  batch.add(
    new ConeGeometry(1, 1, 12, 1, true),
    m.cream,
    [tableX, 2.22, tableZ],
    [1.43, 0.62, 1.43],
  );
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    batch.beam(
      cylinder,
      m.wood,
      [tableX, 2.52, tableZ],
      [tableX + Math.cos(angle) * 1.42, 1.9, tableZ + Math.sin(angle) * 1.42],
      0.012,
    );
  }
  // A bicycle gives the buildings an immediately familiar scale.
  const wheels: Point[] = [
    [4.55, 0.18, 1.5],
    [5.95, 0.18, 1.5],
  ];
  const wheelGeometry = new TorusGeometry(0.39, 0.037, 6, 32);
  for (const wheel of wheels) {
    batch.add(wheelGeometry, m.metal, wheel, [1, 1, 1]);
    batch.add(ring, m.cream, wheel, [0.35, 0.35, 0.35]);
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5;
      batch.beam(
        cylinder,
        m.metal,
        wheel,
        [
          wheel[0] + Math.cos(angle) * 0.35,
          wheel[1] + Math.sin(angle) * 0.35,
          wheel[2],
        ],
        0.007,
      );
    }
  }
  const crank: Point = [5.19, 0.18, 1.5],
    seat: Point = [4.95, 0.78, 1.5],
    head: Point = [5.7, 0.82, 1.5];
  for (const [from, to] of [
    [wheels[0], seat],
    [seat, crank],
    [crank, wheels[0]],
    [seat, head],
    [head, crank],
    [head, wheels[1]],
  ] as [Point, Point][])
    batch.beam(cylinder, m.terra, from, to, 0.03);
  batch.beam(cylinder, m.metal, seat, [4.91, 0.96, 1.5], 0.025);
  block([4.92, 0.98, 1.5], [0.32, 0.065, 0.17], m.metal);
  batch.beam(cylinder, m.metal, head, [5.73, 1.04, 1.5], 0.025);
  batch.beam(cylinder, m.metal, [5.73, 1.04, 1.25], [5.73, 1.04, 1.75], 0.022);
  batch.beam(cylinder, m.metal, crank, [5.19, -0.05, 1.65], 0.015);
  block([5.19, -0.04, 1.68], [0.15, 0.05, 0.1], m.metal);
  batch.beam(cylinder, m.metal, [5.2, 0.22, 1.5], [5.34, -0.23, 1.8], 0.018);
  // Pots, soil, individual succulent leaves and a couple of café cups.
  for (const [x, z, size] of [
    [-3.45, 3.3, 0.32],
    [3.4, 3.3, 0.32],
    [-10.8, -3.1, 0.4],
    [-5, 7.5, 0.3],
    [-2.8, -9.4, 0.35],
    [2.8, -9.4, 0.35],
  ]) {
    batch.add(pot, m.terra, [x, 0.05, z], [size, 0.58, size]);
    batch.add(
      ring,
      m.terra,
      [x, 0.34, z],
      [size, size, size],
      [Math.PI / 2, 0, 0],
    );
    batch.add(
      cylinder,
      m.soil,
      [x, 0.33, z],
      [size * 0.86, 0.025, size * 0.86],
    );
    for (let leaf = 0; leaf < 9; leaf++) {
      const angle = leaf * 2.4;
      batch.add(
        sphere,
        m.foliage,
        [
          x + Math.cos(angle) * size * 0.45,
          0.55 + (leaf % 3) * 0.08,
          z + Math.sin(angle) * size * 0.45,
        ],
        [0.075, 0.3, 0.075],
        [Math.sin(angle) * 0.5, 0, Math.cos(angle) * 0.5],
        leaf % 2 ? "#637b50" : "#8a9b69",
      );
    }
  }
  for (const x of [tableX - 0.3, tableX + 0.3]) {
    batch.add(cylinder, m.cream, [x, 0.87, tableZ], [0.08, 0.13, 0.08]);
    batch.add(cylinder, m.soil, [x, 0.94, tableZ], [0.065, 0.006, 0.065]);
  }
  // A red post box stands beside the service counter.
  block([2.5, 0.47, -10], [0.13, 1.35, 0.13], m.metal);
  block([2.5, 1.25, -10], [0.55, 0.65, 0.47], m.terra);
  block([2.5, 1.38, -9.755], [0.35, 0.06, 0.015], m.metal);
  block([2.5, 1.1, -9.755], [0.23, 0.12, 0.015], m.cream);
}
