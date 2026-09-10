import { BoxGeometry, CylinderGeometry, type Material } from "three";
import { WORLD_LOCATIONS } from "./world-locations";
import type { IslandMaterials } from "./island-materials";
import type { createDetailBatches } from "./detail-batches";

type Point = readonly [number, number, number];
export function addArchitecture(
  batch: ReturnType<typeof createDetailBatches>,
  m: IslandMaterials,
) {
  const box = new BoxGeometry(1, 1, 1);
  const cylinder = new CylinderGeometry(1, 1, 1, 8);
  function block(
    position: Point,
    size: Point,
    material: Material = m.wood,
    rotation: Point = [0, 0, 0],
  ) {
    batch.add(box, material, position, size, rotation);
  }
  function local(
    index: number,
    position: Point,
    size: Point,
    material: Material = m.wood,
  ) {
    const origin = WORLD_LOCATIONS[index].position;
    block(
      [origin[0] + position[0], position[1], origin[2] + position[2]],
      size,
      material,
    );
  }
  // Timber end grain, floor joints, fascias, rain gutters and roof battens.
  const roofs = [
    { index: 0, width: 8.3, height: 3.62, depth: 2.3, z: -2.02 },
    { index: 1, width: 7.8, height: 4.5, depth: 2, z: -1.65 },
    { index: 4, width: 6.3, height: 3.45, depth: 2, z: -2 },
    { index: 5, width: 6.5, height: 4.02, depth: 3, z: -0.85 },
  ];
  for (const roof of roofs) {
    for (const edge of [-1, 1]) {
      local(
        roof.index,
        [0, roof.height, roof.z + (edge * roof.depth) / 2],
        [roof.width, 0.24, 0.1],
      );
      local(
        roof.index,
        [(edge * roof.width) / 2, roof.height, roof.z],
        [0.1, 0.24, roof.depth],
      );
    }
    const origin = WORLD_LOCATIONS[roof.index].position;
    for (let x = -roof.width / 2 + 0.16; x < roof.width / 2; x += 0.25) {
      batch.add(
        cylinder,
        m.terra,
        [origin[0] + x, roof.height + 0.13, origin[2] + roof.z],
        [0.13, roof.depth, 0.13],
        [Math.PI / 2, 0, 0],
      );
    }
    const drainX = origin[0] + roof.width / 2 - 0.22;
    const drainZ = origin[2] + roof.z - roof.depth / 2 - 0.12;
    batch.beam(
      cylinder,
      m.metal,
      [origin[0] - roof.width / 2, roof.height, drainZ],
      [drainX, roof.height, drainZ],
      0.055,
    );
    batch.beam(
      cylinder,
      m.metal,
      [drainX, roof.height, drainZ],
      [drainX, 0, drainZ],
      0.045,
    );
  }
  // Glazed studio windows, projecting sills, mullions and timber shutters.
  for (const x of [-2.5, 0, 2.5]) {
    for (const side of [-1, 1]) {
      local(0, [x + side * 0.88, 2, -2.84], [0.09, 1.74, 0.15]);
      local(0, [x, 2 + side * 0.81, -2.82], [1.83, 0.08, 0.18]);
    }
    local(0, [x, 1.15, -2.75], [2, 0.1, 0.38], m.stone);
    local(0, [x, 2, -2.83], [0.065, 1.58, 0.1], m.cream);
    local(0, [x, 2.12, -2.81], [1.7, 0.055, 0.1], m.cream);
  }
  local(0, [-3.82, 0.22, 0], [0.08, 0.22, 5.7]);
  local(0, [0, 0.22, -2.87], [7.7, 0.22, 0.08]);
  for (let x = -2.1; x <= 2.1; x += 0.24)
    local(0, [x, 0.08, 3.55], [0.225, 0.12, 1.15]);
  for (let x = -3.8; x < 3.8; x += 0.48)
    local(0, [x, 0.056, 0], [0.014, 0.008, 5.8], m.wood);
  // The gallery is a gallery: picture mounts and slim track lights beneath the pergola.
  for (const x of [-2.6, 0, 2.6]) {
    local(1, [x, 4.05, 0], [0.04, 0.34, 0.04], m.metal);
    local(1, [x, 3.86, 0.06], [0.3, 0.16, 0.42], m.metal);
    local(1, [x, 3.78, 0.08], [0.22, 0.012, 0.32], m.cream);
  }
  local(1, [0, 4.17, 0], [6.2, 0.06, 0.08], m.metal);
  // Paving stones make paths read at human scale. Gaps expose the sand beneath.
  const paths: [Point, Point][] = [
    [
      [0, 0, 5],
      [0, 0, 8.8],
    ],
    [
      [-8, 0, 6],
      [8.7, 0, 6],
    ],
    [
      [-8, 0, -3],
      [-8, 0, 1.5],
    ],
    [
      [2, 0, -5],
      [4.1, 0, -5],
    ],
    [
      [0, 0, -9.2],
      [0, 0, -3.3],
    ],
    [
      [9, 0, -1.5],
      [9, 0, 1.5],
    ],
  ];
  for (const [from, to] of paths) {
    const length = Math.hypot(to[0] - from[0], to[2] - from[2]);
    const count = Math.ceil(length / 0.72);
    const rotation: Point = [
      0,
      Math.atan2(to[0] - from[0], to[2] - from[2]),
      0,
    ];
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      block(
        [
          from[0] + (to[0] - from[0]) * t,
          -0.192,
          from[2] + (to[2] - from[2]) * t,
        ],
        [1.18, 0.055, length / count - 0.045],
        m.stone,
        rotation,
      );
    }
  }
  // Low retaining stones follow the island perimeter, leaving the entrance open.
  for (let x = -12; x <= 12; x += 0.9) {
    block([x, -0.15, -15.25], [0.84, 0.32, 0.32], m.stone);
    if (Math.abs(x) > 2.4) block([x, -0.15, 9.25], [0.84, 0.32, 0.32], m.stone);
  }
  for (let z = -14.4; z < 9; z += 0.9)
    for (const x of [-12.7, 12.7])
      block([x, -0.15, z], [0.32, 0.32, 0.84], m.stone);
  // Postal cubbies, a service counter, handles and neatly stacked parcels.
  local(5, [0, 0.75, -1.4], [4.8, 0.15, 0.8]);
  for (const x of [-2.1, 2.1])
    local(5, [x, 0.34, -1.4], [0.12, 0.8, 0.6], m.metal);
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 5; col++) {
      const x = -1.9 + col * 0.92,
        y = 1.4 + row * 0.62;
      local(5, [x, y, -2.04], [0.85, 0.56, 0.13], m.metal);
      local(5, [x, y + 0.12, -1.96], [0.5, 0.028, 0.02], m.cream);
      local(5, [x + 0.25, y - 0.13, -1.94], [0.09, 0.04, 0.06], m.wood);
    }
  for (let i = 0; i < 3; i++) {
    local(5, [2.12, 0.15 + i * 0.32, 0.9], [0.7, 0.31, 0.65], m.wood);
    local(5, [2.12, 0.31 + i * 0.32, 0.9], [0.12, 0.012, 0.66], m.cream);
  }
  // A few rooftop solar panels with real frames and cell divisions.
  for (let i = 0; i < 3; i++) {
    local(4, [-1.6 + i * 1.35, 3.69, -2], [1.23, 0.07, 1.45], m.metal);
    local(4, [-1.6 + i * 1.35, 3.735, -2], [1.12, 0.02, 1.32], m.glass);
    for (let cell = 0; cell < 4; cell++)
      local(
        4,
        [-1.6 + i * 1.35, 3.75, -2.48 + cell * 0.32],
        [1.12, 0.008, 0.015],
        m.cream,
      );
  }
}
