import { ConeGeometry, CylinderGeometry, SphereGeometry } from "three";
import type { IslandMaterials } from "./island-materials";
import type { createDetailBatches } from "./detail-batches";

export function addPlanting(
  batch: ReturnType<typeof createDetailBatches>,
  m: IslandMaterials,
) {
  let seed = 93;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const trunk = new CylinderGeometry(0.65, 1, 1, 7);
  const leaf = new SphereGeometry(1, 8, 6);
  const blade = new ConeGeometry(1, 1, 3);
  const foliage = ["#536f45", "#627f4e", "#748956", "#859661", "#96a06c"];
  const trees = [
    [-11, 8],
    [-11, 4],
    [-11.5, -1],
    [-11, -10],
    [-9, -12],
    [-6, -13.5],
    [-3.5, -14],
    [4, -14],
    [7, -13],
    [10, -12],
    [11, -8.5],
    [11.3, -2],
    [11.5, 1],
    [11, 8],
    [5, 8],
    [3, 6.5],
    [-4, 8.5],
    [-4, -7.5],
  ];
  for (const [x, z] of trees) {
    const size = 0.8 + random() * 0.45;
    const height = 1.7 * size;
    batch.add(
      trunk,
      m.wood,
      [x, height / 2 - 0.27, z],
      [0.13 * size, height, 0.13 * size],
    );
    for (let branch = 0; branch < 5; branch++) {
      const angle = branch * 2.4 + random();
      const bx = x + Math.cos(angle) * 0.6 * size;
      const bz = z + Math.sin(angle) * 0.6 * size;
      const by = height + 0.15 + random() * 0.6;
      batch.beam(
        trunk,
        m.wood,
        [x, height * 0.56, z],
        [bx, by, bz],
        0.05 * size,
      );
      for (let cluster = 0; cluster < 2; cluster++) {
        batch.add(
          leaf,
          m.foliage,
          [
            bx + (random() - 0.5) * 0.4,
            by + cluster * 0.35,
            bz + (random() - 0.5) * 0.4,
          ],
          [
            size * (0.53 + random() * 0.2),
            size * (0.5 + random() * 0.18),
            size * (0.5 + random() * 0.2),
          ],
          [random(), random(), random()],
          foliage[Math.floor(random() * foliage.length)],
        );
      }
    }
  }
  // Deliberate beds leave the paths and building entrances clear.
  const beds = [
    [-11.9, -6.5, 0.5, 2.1],
    [10.6, -13.3, 1.2, 0.6],
    [5.7, -11.4, 1.6, 0.65],
    [5.2, -8.1, 1.7, 0.5],
    [-3.1, -6.4, 0.6, 1.7],
    [10.9, 8.3, 1.2, 0.4],
    [-7.4, 8.6, 2.0, 0.35],
  ];
  for (const [x, z, width, depth] of beds) {
    batch.add(
      leaf,
      m.soil,
      [x, -0.26, z],
      [width, 0.09, depth],
      [0, 0, 0],
      "#ffffff",
      false,
    );
    for (let i = 0; i < 22; i++) {
      const angle = random() * Math.PI * 2,
        distance = Math.sqrt(random());
      const px = x + Math.cos(angle) * distance * width * 0.9,
        pz = z + Math.sin(angle) * distance * depth * 0.9;
      for (let sprig = 0; sprig < 3; sprig++)
        batch.add(
          blade,
          m.foliage,
          [px + (random() - 0.5) * 0.15, -0.11, pz + (random() - 0.5) * 0.15],
          [0.055, 0.28 + random() * 0.2, 0.055],
          [0, random() * Math.PI, (random() - 0.5) * 0.4],
          foliage[i % foliage.length],
          false,
        );
      if (i % 3 === 0)
        batch.add(
          leaf,
          m.foliage,
          [px, 0.14 + random() * 0.14, pz],
          [0.1, 0.065, 0.1],
          [0, 0, 0],
          i % 2 ? "#d9c390" : "#b88575",
          false,
        );
    }
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      batch.add(
        leaf,
        m.stone,
        [x + Math.cos(angle) * width, -0.19, z + Math.sin(angle) * depth],
        [0.15 + random() * 0.1, 0.09, 0.15],
        [random(), random(), random()],
        "#ffffff",
        false,
      );
    }
  }
}
