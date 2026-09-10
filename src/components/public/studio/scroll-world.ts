import {
  CanvasTexture,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  TorusGeometry,
  TorusKnotGeometry,
  type Material,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { createIslandEnvironment } from "./island-environment";
import { WORLD_LOCATIONS } from "./world-locations";
import { createWorkspace } from "./workspace-model";
import type { Stage } from "./schedule";
import type { SerializedProjectCard } from "~/lib/content/types";

// Each chapter is built between stage boundaries so no single frame carries the
// whole island.
export async function createScrollWorld(
  projects: SerializedProjectCard[],
  stage: Stage,
) {
  const workspace = createWorkspace();
  const textures = workspace.textures;
  const chapters = [workspace.root];
  const floating: Group[] = [];
  const geometry = new RoundedBoxGeometry(1, 1, 1, 2, 0.06);
  const dark = new MeshStandardMaterial({
    color: "#253b3b",
    roughness: 0.48,
    metalness: 0.15,
  });
  const orange = new MeshPhysicalMaterial({
    color: "#ce5934",
    roughness: 0.27,
    metalness: 0.15,
    clearcoat: 0.45,
    clearcoatRoughness: 0.28,
  });
  const paper = new MeshStandardMaterial({ color: "#fff7e5", roughness: 0.8 });
  const blue = new MeshStandardMaterial({ color: "#9ebdc5", roughness: 0.48 });
  const gold = new MeshStandardMaterial({
    color: "#d6ac61",
    metalness: 0.65,
    roughness: 0.26,
  });

  function block(
    parent: Group,
    size: [number, number, number],
    position: [number, number, number],
    material: Material,
  ) {
    const object = new Mesh(geometry, material);
    object.scale.set(...size);
    object.position.set(...position);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }

  function addChapter(destination: string) {
    const group = new Group();
    group.userData.destination = destination;
    chapters.push(group);
    return group;
  }

  function texture(draw: (context: CanvasRenderingContext2D) => void) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const context = canvas.getContext("2d");
    if (context) draw(context);
    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    textures.push(result);
    return result;
  }

  await stage();
  const gallery = addChapter("projects");
  const cards = projects.length
    ? projects.slice(0, 3)
    : [{ title: "The next idea", techStack: ["Made by Bipul"], slug: "" }];
  cards.forEach((project, i) => {
    const panel = new Group();
    panel.position.set((i - 1) * 1.9, 0.9 + (i % 2) * 1.3, -i * 0.7);
    panel.rotation.set(-0.07, (i - 1) * -0.23, (i - 1) * -0.1);
    panel.userData.destination = "projects";
    panel.userData.slug = project.slug;
    gallery.add(panel);
    floating.push(panel);
    block(panel, [3.8, 2.65, 0.16], [0, 0, 0], i === 1 ? orange : dark);
    const artwork = texture((context) => {
      const background = ["#dce5da", "#f1ddc9", "#dce9ed"][i];
      context.fillStyle = background;
      context.fillRect(0, 0, 1024, 640);
      context.fillStyle = "#293e3b";
      context.font = "20px monospace";
      context.fillText(`BIPUL / SELECTED WORK / 0${i + 1}`, 46, 56);
      context.strokeStyle = "#293e3b33";
      context.beginPath();
      context.moveTo(46, 80);
      context.lineTo(978, 80);
      context.stroke();
      context.font = "bold 58px sans-serif";
      const words = project.title.split(" ");
      let line = "";
      let y = 165;
      for (const word of words) {
        if (context.measureText(`${line} ${word}`).width > 800) {
          context.fillText(line, 46, y);
          y += 66;
          line = word;
        } else line = line ? `${line} ${word}` : word;
      }
      context.fillText(line, 46, y);
      for (let j = 0; j < 3; j++) {
        const x = 100 + j * 290;
        context.fillStyle = j === 1 ? "#e67e51" : "#2c4542";
        context.fillRect(x, 350 + (j % 2) * 30, 200, 110);
        context.fillStyle = "#f6efdf";
        context.font = "22px monospace";
        context.fillText(
          ["interface", "logic", "system"][j],
          x + 28,
          410 + (j % 2) * 30,
        );
        if (j < 2) {
          context.fillStyle = "#293e3b";
          context.fillText("→", x + 225, 420);
        }
      }
      context.font = "21px monospace";
      context.fillStyle = "#293e3b";
      context.fillText(
        project.techStack.slice(0, 3).join(" / ").slice(0, 65),
        46,
        588,
      );
      context.fillText("↗", 935, 588);
    });
    const face = new Mesh(
      new PlaneGeometry(3.63, 2.43),
      new MeshBasicMaterial({ map: artwork }),
    );
    face.position.z = 0.09;
    panel.add(face);
  });

  await stage();
  const mind = addChapter("about");
  const knot = new Mesh(new TorusKnotGeometry(1.3, 0.38, 128, 20), orange);
  knot.castShadow = true;
  knot.receiveShadow = true;
  knot.position.y = 1.6;
  mind.add(knot);
  const orbit = new Mesh(new TorusGeometry(2.5, 0.028, 8, 100), gold);
  orbit.rotation.set(0.8, 0.2, -0.5);
  orbit.position.y = 1.5;
  mind.add(orbit);
  const orbit2 = orbit.clone();
  orbit2.rotation.set(-0.7, 1.1, 0.2);
  mind.add(orbit2);
  const plinth = new Mesh(new CylinderGeometry(1.4, 1.5, 0.25, 48), dark);
  plinth.position.y = -0.65;
  plinth.receiveShadow = true;
  mind.add(plinth);

  await stage();
  const wins = addChapter("achievements");
  for (let i = 0; i < 3; i++) {
    const height = [1.15, 2.2, 0.7][i];
    block(
      wins,
      [1.6, height, 1.65],
      [(i - 1) * 1.7, height / 2 - 0.4, 0],
      i === 1 ? orange : blue,
    );
    const medal = new Mesh(new TorusGeometry(0.57, 0.19, 12, 40), gold);
    medal.position.set((i - 1) * 1.7, height + 0.5, 0);
    medal.castShadow = true;
    wins.add(medal);
  }

  await stage();
  const notes = addChapter("blog");
  block(notes, [3.4, 0.17, 4.1], [0, 0, 0], orange);
  for (let i = 0; i < 7; i++) {
    const page = block(
      notes,
      [3.16, 0.035, 3.9],
      [0.04, 0.12 + i * 0.1, 0],
      paper,
    );
    page.rotation.y = i * -0.025;
    const line = block(
      notes,
      [1.7, 0.016, 0.04],
      [-0.25, 0.15 + i * 0.1, -0.9],
      dark,
    );
    line.rotation.y = i * -0.025;
  }
  const cover = block(notes, [3.4, 0.12, 4.1], [0, 0.95, 0], orange);
  cover.rotation.z = -0.14;
  block(notes, [1.5, 0.035, 0.09], [-0.35, 1.17, -0.7], paper);
  block(notes, [0.9, 0.035, 0.09], [-0.65, 1.19, -0.4], paper);
  notes.rotation.y = -0.25;

  await stage();
  const contact = addChapter("contact");
  block(contact, [4.4, 2.9, 0.3], [0, 1.2, 0], blue);
  const flapLeft = block(
    contact,
    [2.6, 0.08, 0.035],
    [-0.94, 1.67, 0.18],
    paper,
  );
  flapLeft.rotation.z = -0.5;
  const flapRight = block(
    contact,
    [2.6, 0.08, 0.035],
    [0.94, 1.67, 0.18],
    paper,
  );
  flapRight.rotation.z = 0.5;
  const seal = new Mesh(new CylinderGeometry(0.43, 0.43, 0.14, 32), orange);
  seal.rotation.x = Math.PI / 2;
  seal.position.set(0, 1.12, 0.26);
  contact.add(seal);
  contact.rotation.set(-0.15, -0.25, -0.14);
  const ring = new Mesh(new TorusGeometry(2.65, 0.035, 8, 80), orange);
  ring.position.y = 1.2;
  ring.rotation.set(0.7, 0.1, 0.4);
  contact.add(ring);

  await stage();
  const island = createIslandEnvironment();
  textures.push(...island.textures);
  const heights = [0, 0, 0.8, 0.45, 0.65, 0.45];
  chapters.forEach((group, index) => {
    const [x, , z] = WORLD_LOCATIONS[index].position;
    group.position.set(x, heights[index], z + (index === 4 ? 0.5 : 0));
    group.userData.worldLocation = index;
  });

  // Keep initial transforms for reversible scroll-driven motion.
  chapters.forEach((group) => {
    group.userData.baseRotation = group.rotation.clone();
  });
  floating.forEach((group) => {
    group.userData.basePosition = group.position.clone();
    group.userData.baseRotation = group.rotation.clone();
  });
  return {
    chapters,
    island: island.root,
    textures,
    floating,
    knot,
    notes,
    contact,
    workspace: workspace.root,
  };
}
