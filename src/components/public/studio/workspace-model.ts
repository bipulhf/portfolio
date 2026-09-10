import {
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  Object3D,
  PlaneGeometry,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  TorusKnotGeometry,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export type WorkspaceDestination =
  | "projects"
  | "blog"
  | "about"
  | "achievements"
  | "contact";

export function createWorkspace() {
  const root = new Group();
  const textures: CanvasTexture[] = [];
  const box = new RoundedBoxGeometry(1, 1, 1, 2, 0.055);
  const materials = {
    ivory: new MeshStandardMaterial({ color: "#eee5d6", roughness: 0.72 }),
    white: new MeshStandardMaterial({ color: "#fffaf1", roughness: 0.65 }),
    dark: new MeshStandardMaterial({ color: "#263a3b", roughness: 0.5 }),
    orange: new MeshPhysicalMaterial({
      color: "#ce5934",
      roughness: 0.28,
      metalness: 0.12,
      clearcoat: 0.4,
      clearcoatRoughness: 0.3,
    }),
    green: new MeshStandardMaterial({ color: "#577653", roughness: 0.85 }),
    blue: new MeshStandardMaterial({ color: "#9db8c2", roughness: 0.6 }),
  };

  function mesh(
    geometry: Mesh["geometry"],
    material: Mesh["material"],
    position: [number, number, number],
    parent = root,
  ) {
    const item = new Mesh(geometry, material);
    item.position.set(...position);
    item.castShadow = true;
    item.receiveShadow = true;
    parent.add(item);
    return item;
  }

  function block(
    size: [number, number, number],
    position: [number, number, number],
    material = materials.ivory,
    parent = root,
  ) {
    const item = mesh(box, material, position, parent);
    item.scale.set(...size);
    return item;
  }

  function destination(
    name: WorkspaceDestination,
    position: [number, number, number],
  ) {
    const group = new Group();
    group.position.set(...position);
    group.userData.destination = name;
    root.add(group);
    return group;
  }

  // A small, hand-built scene: shared geometry, no downloaded models or textures.
  block([6.4, 0.34, 4.3], [0, 0.24, 0]);
  block([5.9, 0.23, 3.8], [0, 0.04, 0], materials.dark);
  block([5.9, 0.035, 3.8], [0, 0.435, 0], materials.white);

  const monitor = destination("projects", [-0.45, 0.47, -0.75]);
  block([1.1, 0.09, 0.65], [0, 0.05, 0.07], materials.dark, monitor);
  block([0.22, 0.67, 0.18], [0, 0.36, -0.05], materials.dark, monitor);
  block([2.75, 1.8, 0.22], [0, 1.35, 0], materials.dark, monitor);
  block([2.62, 1.67, 0.025], [0, 1.35, 0.125], materials.white, monitor);

  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = 768;
  screenCanvas.height = 448;
  const context = screenCanvas.getContext("2d");
  if (context) {
    context.fillStyle = "#233638";
    context.fillRect(0, 0, 768, 448);
    context.fillStyle = "#30494b";
    context.fillRect(0, 0, 768, 48);
    ["#f18361", "#e9c888", "#afc4a2"].forEach((color, i) => {
      context.fillStyle = color;
      context.beginPath();
      context.arc(24 + i * 24, 24, 6, 0, Math.PI * 2);
      context.fill();
    });
    context.font = "18px monospace";
    context.fillStyle = "#b7cecc";
    context.fillText("bipul / studio", 120, 30);
    context.font = "bold 80px sans-serif";
    context.fillStyle = "#fff4df";
    context.fillText("Hello, world.", 48, 163);
    context.font = "24px monospace";
    context.fillStyle = "#f78c60";
    context.fillText("const idea = buildSomething();", 48, 230);
    context.fillStyle = "#a9c4b9";
    context.fillText("// thoughtful software, by Bipul", 48, 272);
    context.fillStyle = "#ef8056";
    context.fillRect(48, 327, 310, 64);
    context.fillStyle = "#203536";
    context.font = "bold 24px sans-serif";
    context.fillText("EXPLORE MY WORK  ↗", 67, 368);
  }
  const screenTexture = new CanvasTexture(screenCanvas);
  screenTexture.colorSpace = SRGBColorSpace;
  textures.push(screenTexture);
  const screen = mesh(
    new PlaneGeometry(2.49, 1.47),
    new MeshBasicMaterial({ map: screenTexture }),
    [0, 1.37, 0.145],
    monitor,
  );
  screen.castShadow = false;

  // All keyboard keys share one draw call.
  block([2.1, 0.12, 0.8], [-0.4, 0.53, 0.9], materials.dark);
  const keys = new InstancedMesh(
    new RoundedBoxGeometry(0.17, 0.055, 0.14, 1, 0.012),
    materials.ivory,
    34,
  );
  const dummy = new Object3D();
  for (let i = 0; i < 34; i++) {
    const x =
      i < 30 ? -1.28 + (i % 10) * 0.195 : [-1.28, -1.085, 0.28, 0.475][i - 30];
    dummy.position.set(
      x,
      0.615,
      i < 30 ? 0.61 + Math.floor(i / 10) * 0.19 : 1.18,
    );
    dummy.updateMatrix();
    keys.setMatrixAt(i, dummy.matrix);
  }
  root.add(keys);
  block([1.02, 0.055, 0.14], [-0.4, 0.615, 1.18], materials.ivory);
  block([0.34, 0.14, 0.51], [1.03, 0.54, 0.95], materials.orange);

  const notebook = destination("blog", [-2.25, 0.52, 0.1]);
  notebook.rotation.y = -0.2;
  block([0.95, 0.16, 1.35], [0, 0, 0], materials.orange, notebook);
  block([0.83, 0.09, 1.23], [0.025, -0.035, 0], materials.white, notebook);
  block([0.07, 0.035, 1.34], [0.27, 0.1, 0], materials.dark, notebook);
  block([0.49, 0.012, 0.025], [-0.09, 0.09, -0.26], materials.white, notebook);
  block([0.34, 0.012, 0.025], [-0.165, 0.09, -0.15], materials.white, notebook);

  const sculpture = destination("about", [2.05, 0.45, -0.4]);
  mesh(
    new CylinderGeometry(0.64, 0.69, 0.68, 32),
    materials.blue,
    [0, 0.34, 0],
    sculpture,
  );
  const knot = mesh(
    new TorusKnotGeometry(0.39, 0.125, 80, 12),
    materials.orange,
    [0, 1.14, 0],
    sculpture,
  );
  knot.rotation.set(0.2, 0.3, -0.2);

  const mug = new Group();
  mug.position.set(-1.95, 0.46, 1.33);
  root.add(mug);
  mesh(
    new CylinderGeometry(0.25, 0.22, 0.48, 24),
    materials.white,
    [0, 0.24, 0],
    mug,
  );
  const coffee = mesh(
    new CylinderGeometry(0.205, 0.205, 0.012, 24),
    materials.dark,
    [0, 0.486, 0],
    mug,
  );
  coffee.castShadow = false;
  mesh(
    new TorusGeometry(0.16, 0.055, 8, 20),
    materials.white,
    [-0.27, 0.27, 0],
    mug,
  );

  const plant = new Group();
  plant.position.set(-2.3, 0.46, -1.35);
  root.add(plant);
  mesh(
    new CylinderGeometry(0.28, 0.22, 0.44, 20),
    materials.orange,
    [0, 0.22, 0],
    plant,
  );
  const leafGeometry = new SphereGeometry(1, 12, 8);
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const leaf = mesh(
      leafGeometry,
      materials.green,
      [Math.cos(angle) * 0.14, 0.71 + (i % 2) * 0.13, Math.sin(angle) * 0.14],
      plant,
    );
    leaf.scale.set(0.1, 0.41, 0.12);
    leaf.rotation.set(Math.sin(angle) * 0.5, 0, Math.cos(angle) * 0.5);
  }

  const contact = destination("contact", [2.14, 0.52, 1.25]);
  contact.rotation.y = 0.18;
  block([1.05, 0.12, 0.7], [0, 0, 0], materials.blue, contact);
  const flap = block(
    [0.57, 0.012, 0.035],
    [-0.23, 0.067, -0.07],
    materials.white,
    contact,
  );
  flap.rotation.y = -0.54;
  const flap2 = block(
    [0.57, 0.012, 0.035],
    [0.23, 0.067, -0.07],
    materials.white,
    contact,
  );
  flap2.rotation.y = 0.54;

  return { root, textures };
}
