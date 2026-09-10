import {
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  type Material,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { WORLD_LOCATIONS } from "./world-locations";

export function createIslandEnvironment() {
  const root = new Group();
  const textures: CanvasTexture[] = [];
  const box = new BoxGeometry(1, 1, 1);
  const stone = new MeshStandardMaterial({ color: "#dfd3b9", roughness: 0.88 });
  const pathMaterial = new MeshStandardMaterial({
    color: "#e9d9b9",
    roughness: 0.92,
  });
  const ivory = new MeshStandardMaterial({ color: "#f3e7cf", roughness: 0.72 });
  const dark = new MeshStandardMaterial({ color: "#344b43", roughness: 0.65 });
  const terra = new MeshStandardMaterial({ color: "#b96143", roughness: 0.65 });
  const grass = new MeshStandardMaterial({ color: "#a6b58b", roughness: 1 });

  function mesh(
    geometry: Mesh["geometry"],
    material: Material,
    position: [number, number, number],
    parent = root,
  ) {
    const object = new Mesh(geometry, material);
    object.position.set(...position);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  function block(
    size: [number, number, number],
    position: [number, number, number],
    material = ivory,
    parent = root,
  ) {
    const object = mesh(box, material, position, parent);
    object.scale.set(...size);
    return object;
  }
  function label(
    parent: Group,
    text: string,
    position: [number, number, number],
    width = 3.8,
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#344b43";
      ctx.fillRect(0, 0, 768, 128);
      ctx.fillStyle = "#fff2d8";
      ctx.font = "500 43px monospace";
      ctx.textAlign = "center";
      ctx.fillText(text, 384, 80);
    }
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    textures.push(map);
    const sign = mesh(
      new PlaneGeometry(width, width / 6),
      new MeshBasicMaterial({ map }),
      position,
      parent,
    );
    sign.castShadow = false;
  }
  function building(index: number) {
    const group = new Group();
    group.position.set(...WORLD_LOCATIONS[index].position);
    group.userData.worldLocation = index;
    group.userData.destination = WORLD_LOCATIONS[index].destination;
    root.add(group);
    return group;
  }
  function path(from: [number, number], to: [number, number], width = 1.35) {
    const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
    const segment = block(
      [width, 0.035, length],
      [(from[0] + to[0]) / 2, -0.23, (from[1] + to[1]) / 2],
      pathMaterial,
    );
    segment.rotation.y = Math.atan2(to[0] - from[0], to[1] - from[1]);
  }

  // A single connected place, built entirely from reusable low-poly geometry.
  mesh(new RoundedBoxGeometry(27, 1.55, 26, 2, 0.7), stone, [0, -1.1, -3]);
  mesh(new RoundedBoxGeometry(26.7, 0.22, 25.7, 2, 0.1), grass, [0, -0.38, -3]);
  path([0, -12], [0, 6]);
  path([-9, -5], [9, -5]);
  path([-8, -5], [-8, 6]);
  path([-8, 6], [9, 6]);
  path([9, -5], [9, 6]);
  // A broad entrance stair and a brass arrival marker.
  block([4.2, 0.2, 1.0], [0, -0.3, 9.1], stone);
  block([3.8, 0.2, 1.0], [0, -0.5, 9.8], stone);
  block([3.4, 0.2, 1.0], [0, -0.7, 10.5], stone);

  const studio = building(0);
  block([8.1, 0.22, 6.3], [0, -0.07, 0], ivory, studio);
  block([8.1, 3.6, 0.2], [0, 1.7, -3.05], terra, studio);
  block([0.18, 3.6, 6.2], [-3.95, 1.7, 0], terra, studio);
  // A cutaway roof lets visitors see the workspace inside the building.
  block([8.3, 0.18, 2.3], [0, 3.62, -2.02], ivory, studio);
  for (const x of [-3.8, 3.8])
    for (const z of [-2.8, 2.8])
      block([0.17, 3.7, 0.17], [x, 1.7, z], dark, studio);
  block([8.0, 0.17, 0.17], [0, 3.45, 2.8], dark, studio);
  block([0.17, 0.17, 5.7], [3.8, 3.45, 0], dark, studio);
  for (const x of [-2.5, 0, 2.5])
    block([1.7, 1.55, 0.07], [x, 2.0, -2.92], dark, studio);
  label(studio, "01 / BIPUL'S STUDIO", [0, 3.5, 2.9], 4.7);

  const gallery = building(1);
  block([7.4, 0.25, 6.4], [0, -0.05, 0], ivory, gallery);
  block([7.4, 4.5, 0.22], [0, 2.1, -2.5], ivory, gallery);
  block([7.8, 0.2, 2.0], [0, 4.5, -1.65], terra, gallery);
  for (const x of [-3.6, 3.6])
    block([0.2, 4.5, 0.2], [x, 2.1, 2.7], dark, gallery);
  block([7.4, 0.2, 0.2], [0, 4.25, 2.7], dark, gallery);
  label(gallery, "02 / PROJECT GALLERY", [0, 4.27, 2.84], 5.0);
  for (let i = 0; i < 5; i++)
    block([0.08, 0.12, 5.1], [-2.8 + i * 1.4, 4.36, 0.1], dark, gallery);

  const garden = building(2);
  mesh(
    new CylinderGeometry(3.3, 3.4, 0.22, 40),
    pathMaterial,
    [0, -0.03, 0],
    garden,
  );
  const border = mesh(
    new TorusGeometry(3.28, 0.09, 8, 64),
    ivory,
    [0, 0.14, 0],
    garden,
  );
  border.rotation.x = Math.PI / 2;
  block([2.1, 0.18, 0.55], [0, 0.38, 2.65], dark, garden);
  for (const x of [-0.75, 0.75])
    block([0.12, 0.55, 0.4], [x, 0.15, 2.65], dark, garden);
  label(garden, "03 / CURIOSITY GARDEN", [0, 0.75, 3.35], 3.1);

  const court = building(3);
  block([6.9, 0.2, 4.4], [0, -0.03, 0], ivory, court);
  block([7.2, 0.18, 1.0], [0, -0.13, 2.4], stone, court);
  label(court, "04 / THE COURTYARD", [0, 0.42, 2.3], 4.1);

  const reading = building(4);
  block([6.0, 0.2, 6.2], [0, -0.04, 0], ivory, reading);
  block([6.0, 3.4, 0.2], [0, 1.6, -2.75], dark, reading);
  block([6.3, 0.2, 2.0], [0, 3.45, -2.0], terra, reading);
  block([4.4, 0.16, 4.4], [0, 0.55, 0.5], dark, reading);
  for (const x of [-1.85, 1.85])
    for (const z of [-1.3, 2.3])
      block([0.13, 0.7, 0.13], [x, 0.2, z], dark, reading);
  for (const y of [0.45, 1.4, 2.35])
    block([5.3, 0.1, 0.65], [0, y, -2.4], ivory, reading);
  const books = new InstancedMesh(
    box,
    new MeshStandardMaterial({ color: "#ffffff", roughness: 0.8 }),
    36,
  );
  const dummy = new Object3D();
  const bookColors = [terra.color, grass.color, ivory.color];
  for (let i = 0; i < 36; i++) {
    dummy.position.set(
      -2.4 + (i % 12) * 0.42,
      0.8 + Math.floor(i / 12) * 0.95,
      -2.4,
    );
    dummy.scale.set(0.24 + (i % 3) * 0.025, 0.58 + (i % 4) * 0.08, 0.46);
    dummy.rotation.z = i % 5 === 0 ? -0.1 : 0;
    dummy.updateMatrix();
    books.setMatrixAt(i, dummy.matrix);
    books.setColorAt(i, bookColors[i % 3]);
  }
  books.castShadow = true;
  reading.add(books);
  for (const x of [-2.8, 2.8])
    block([0.15, 3.4, 0.15], [x, 1.6, 2.7], dark, reading);
  block([5.8, 0.15, 0.15], [0, 3.28, 2.7], dark, reading);
  label(reading, "05 / THE READING ROOM", [0, 3.3, 2.81], 4.2);

  const post = building(5);
  block([6.2, 0.2, 4.9], [0, -0.05, 0], ivory, post);
  block([6.2, 4.0, 0.2], [0, 1.85, -2.2], terra, post);
  for (const x of [-2.9, 2.9])
    block([0.2, 4.1, 0.2], [x, 1.85, 1.9], dark, post);
  block([6.5, 0.2, 3.0], [0, 4.02, -0.85], ivory, post);
  label(post, "06 / SAY HELLO", [0, 3.85, 2.05], 4.2);

  // Instanced trees add a landscape with only two draw calls.
  const trees: [number, number][] = [
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
  const trunks = new InstancedMesh(
    new CylinderGeometry(0.1, 0.14, 1.2, 7),
    dark,
    trees.length,
  );
  const leaves = new InstancedMesh(
    new SphereGeometry(1, 10, 8),
    new MeshStandardMaterial({ color: "#6f936b", roughness: 0.9 }),
    trees.length * 2,
  );
  trees.forEach(([x, z], index) => {
    const size = 0.8 + (index % 3) * 0.16;
    dummy.position.set(x, 0.32, z);
    dummy.scale.set(1, 1, 1);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    trunks.setMatrixAt(index, dummy.matrix);
    for (let layer = 0; layer < 2; layer++) {
      dummy.position.set(x + layer * 0.22, 1.25 + layer * 0.63, z);
      dummy.scale.set(
        size * (1 - layer * 0.2),
        size * 0.95,
        size * (1 - layer * 0.2),
      );
      dummy.updateMatrix();
      leaves.setMatrixAt(index * 2 + layer, dummy.matrix);
    }
  });
  trunks.castShadow = true;
  leaves.castShadow = true;
  root.add(trunks, leaves);

  // Lamps mark the paths without adding expensive point lights.
  const lampGlow = new MeshBasicMaterial({ color: "#fff0be" });
  for (const [x, z] of [
    [2, -6],
    [-4, -5],
    [5, -4],
    [4, 6],
    [-4, 6],
    [1.5, -10],
  ]) {
    block([0.09, 1.2, 0.09], [x, 0.35, z], dark);
    mesh(new SphereGeometry(0.2, 10, 8), lampGlow, [x, 1.02, z]);
  }
  return { root, textures };
}
