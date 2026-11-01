import {
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SphereGeometry,
  TorusGeometry,
  type Material,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { SerializedProjectCard } from "~/lib/content/types";
import type { DioramaMaterials } from "./diorama-materials";
import {
  createTentFrontFlapGeometry,
  createTentShellGeometry,
} from "./diorama-pine-geometry";
import type { Stage } from "./schedule";
import { DIORAMA_ZONES, type StudioSectionId } from "./world-locations";

export type DioramaAnimatedHandles = {
  flames: Mesh[];
  steamPuffs: Mesh[];
  fireflies: Mesh[];
  zoneGroups: Record<StudioSectionId, Group>;
};

export async function buildDioramaCamp(
  materials: DioramaMaterials,
  projects: SerializedProjectCard[],
  stage: Stage,
) {
  const root = new Group();
  const unitBox = new RoundedBoxGeometry(1, 1, 1, 3, 0.1);
  const cylinder = new CylinderGeometry(1, 1, 1, 16);
  const sphere = new SphereGeometry(1, 16, 12);

  const flames: Mesh[] = [];
  const steamPuffs: Mesh[] = [];
  const fireflies: Mesh[] = [];

  function createZoneGroup(id: StudioSectionId) {
    const zone = DIORAMA_ZONES.find((item) => item.id === id)!;
    const group = new Group();
    group.position.set(zone.position[0], 0.06, zone.position[2]);
    group.userData.section = id;
    root.add(group);
    return group;
  }

  function addBox(
    parent: Group,
    size: [number, number, number],
    pos: [number, number, number],
    material: Material,
    rot: [number, number, number] = [0, 0, 0],
    castShadow = true,
  ) {
    const mesh = new Mesh(unitBox, material);
    mesh.scale.set(...size);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  // ---------------------------------------------------------------------------
  // ZONE 1: ABOUT — Golden A-Frame Basecamp Tent (center hero matching reference)
  // ---------------------------------------------------------------------------
  const aboutGroup = createZoneGroup("about");
  const tent = new Group();
  aboutGroup.add(tent);

  const tentShell = new Mesh(
    createTentShellGeometry(1.9, 2.7, 3.65),
    materials.tentYellow,
  );
  tentShell.castShadow = true;
  tentShell.receiveShadow = true;
  tent.add(tentShell);

  // Back gable closure & cozy dark interior floor
  addBox(tent, [2.1, 1.6, 0.12], [0, 0.85, -1.78], materials.tentAmber);
  addBox(tent, [3.1, 0.08, 3.35], [0, 0.04, 0], materials.tentInterior, [0, 0, 0], false);

  // Warm interior lantern & sleeping roll peeking through the doorway
  const innerLantern = new Mesh(sphere, materials.tentGlow);
  innerLantern.scale.set(0.18, 0.22, 0.18);
  innerLantern.position.set(0.15, 0.36, 0.55);
  tent.add(innerLantern);
  addBox(tent, [0.85, 0.24, 1.4], [-0.45, 0.16, 0.15], materials.coralPost, [0, 0.08, 0], false);

  // Parted front doorway flaps (+Z face)
  const leftFlap = new Mesh(
    createTentFrontFlapGeometry(-1, 1.88, 2.64),
    materials.tentYellow,
  );
  leftFlap.position.set(0, 0, 1.77);
  leftFlap.castShadow = true;
  leftFlap.receiveShadow = true;
  tent.add(leftFlap);

  const rightFlap = new Mesh(
    createTentFrontFlapGeometry(1, 1.88, 2.64),
    materials.tentYellow,
  );
  rightFlap.position.set(0, 0, 1.77);
  rightFlap.castShadow = true;
  rightFlap.receiveShadow = true;
  tent.add(rightFlap);

  // Rolled top ridge dowels & dark leather straps (signature detail from reference)
  for (const zOffset of [-0.82, 0.68]) {
    const roll = new Mesh(cylinder, materials.tentYellow);
    roll.scale.set(0.14, 1.15, 0.14);
    roll.rotation.x = Math.PI / 2;
    roll.position.set(0, 2.75, zOffset);
    roll.castShadow = true;
    tent.add(roll);

    for (const strapZ of [-0.36, 0.36]) {
      const strap = new Mesh(
        new TorusGeometry(0.145, 0.026, 8, 18),
        materials.woodDark,
      );
      strap.position.set(0, 2.75, zOffset + strapZ);
      tent.add(strap);
    }
  }

  // Sunlit +X slope woven lattice window + rolled-up yellow window flap!
  const windowAssembly = new Group();
  // Position on the +X tent slope and tilt to match slope angle (~34 deg from vertical)
  windowAssembly.position.set(0.95, 1.44, 0.08);
  windowAssembly.rotation.z = 0.61;
  tent.add(windowAssembly);

  // Dark backing + wood frame
  addBox(windowAssembly, [0.06, 0.96, 1.18], [0, -0.06, 0], materials.tentInterior, [0, 0, 0], false);
  addBox(windowAssembly, [0.09, 1.02, 0.08], [0.02, -0.06, -0.58], materials.woodDark, [0, 0, 0], false);
  addBox(windowAssembly, [0.09, 1.02, 0.08], [0.02, -0.06, 0.58], materials.woodDark, [0, 0, 0], false);
  addBox(windowAssembly, [0.09, 0.08, 1.22], [0.02, -0.54, 0], materials.woodDark, [0, 0, 0], false);
  addBox(windowAssembly, [0.09, 0.08, 1.22], [0.02, 0.42, 0], materials.woodDark, [0, 0, 0], false);

  // Woven lattice mesh bars inside the tent window
  for (let r = -3; r <= 3; r++) {
    addBox(
      windowAssembly,
      [0.04, 0.028, 1.1],
      [0.035, -0.06 + r * 0.12, 0],
      materials.tentAmber,
      [0, 0, 0],
      false,
    );
  }
  for (let c = -4; c <= 4; c++) {
    addBox(
      windowAssembly,
      [0.04, 0.9, 0.026],
      [0.04, -0.06, c * 0.12],
      materials.woodWarm,
      [0, 0, 0],
      false,
    );
  }

  // Plump rolled-up yellow window flap cylinder & straps above the lattice
  const windowRoll = new Mesh(cylinder, materials.tentYellow);
  windowRoll.scale.set(0.16, 1.44, 0.16);
  windowRoll.rotation.x = Math.PI / 2;
  windowRoll.position.set(0.12, 0.52, 0);
  windowRoll.castShadow = true;
  windowAssembly.add(windowRoll);
  for (const sz of [-0.42, 0.42]) {
    const strap = new Mesh(
      new TorusGeometry(0.165, 0.028, 8, 18),
      materials.woodDark,
    );
    strap.position.set(0.12, 0.52, sz);
    windowAssembly.add(strap);
  }

  await stage();

  // ---------------------------------------------------------------------------
  // ZONE 2: ACHIEVEMENTS — Campfire, Cauldron, Two Folding Chairs & Trophy Stump
  // ---------------------------------------------------------------------------
  const achievementsGroup = createZoneGroup("achievements");

  // Campfire logs at local (0.25, 0, 0.05) -> world (-0.9, 0.06, 3.3)
  const fireSpot = new Group();
  fireSpot.position.set(0.25, 0, 0.05);
  achievementsGroup.add(fireSpot);

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI;
    const log = new Mesh(cylinder, materials.woodDark);
    log.scale.set(0.075, 0.78, 0.075);
    log.position.set(0, 0.08 + (i % 2) * 0.03, 0);
    log.rotation.set(Math.PI / 2, angle, 0.12);
    log.castShadow = true;
    fireSpot.add(log);
  }

  // Flickering fire flames
  for (let f = 0; f < 3; f++) {
    const flame = new Mesh(
      sphere,
      f === 1 ? materials.flameGold : materials.emberOrange,
    );
    const s = f === 1 ? 0.17 : 0.13;
    flame.scale.set(s, s * 1.65, s);
    flame.position.set((f - 1) * 0.11, 0.2 + (f === 1 ? 0.06 : 0), (f % 2) * 0.06);
    flame.userData.baseY = flame.position.y;
    flame.userData.baseScaleY = flame.scale.y;
    flame.userData.phase = f * 2.1;
    fireSpot.add(flame);
    flames.push(flame);
  }

  // Spit posts & crossbar holding the matte-black cast-iron cauldron
  for (const side of [-0.56, 0.56]) {
    const post = new Mesh(cylinder, materials.woodDark);
    post.scale.set(0.05, 1.05, 0.05);
    post.position.set(side, 0.52, 0);
    post.castShadow = true;
    fireSpot.add(post);
  }
  const crossbar = new Mesh(cylinder, materials.woodDark);
  crossbar.scale.set(0.04, 1.28, 0.04);
  crossbar.rotation.z = Math.PI / 2;
  crossbar.position.set(0, 1.0, 0);
  crossbar.castShadow = true;
  fireSpot.add(crossbar);

  const cauldron = new Group();
  cauldron.position.set(0, 0.56, 0);
  fireSpot.add(cauldron);

  const potBody = new Mesh(sphere, materials.castIron);
  potBody.scale.set(0.32, 0.29, 0.32);
  potBody.castShadow = true;
  cauldron.add(potBody);

  const potRim = new Mesh(
    new TorusGeometry(0.24, 0.045, 10, 22),
    materials.castIron,
  );
  potRim.rotation.x = Math.PI / 2;
  potRim.position.y = 0.22;
  cauldron.add(potRim);

  const bail = new Mesh(
    new TorusGeometry(0.25, 0.022, 8, 20, Math.PI),
    materials.castIron,
  );
  bail.position.y = 0.21;
  cauldron.add(bail);

  // Floating cauldron steam puffs
  for (let s = 0; s < 3; s++) {
    const puff = new Mesh(sphere, materials.steamWhite);
    const r = 0.09 - s * 0.015;
    puff.scale.set(r, r * 0.85, r);
    puff.position.set((s - 1) * 0.06, 0.98 + s * 0.24, 0);
    puff.userData.phase = s * 0.33;
    fireSpot.add(puff);
    steamPuffs.push(puff);
  }

  // Two cozy folding camp chairs (warm brown fabric + silver tubular frame)
  function addCampChair(pos: [number, number, number], rotY: number) {
    const chair = new Group();
    chair.position.set(...pos);
    chair.rotation.y = rotY;
    achievementsGroup.add(chair);

    // Silver folding frame runners & uprights
    for (const sx of [-0.36, 0.36]) {
      addBox(chair, [0.055, 0.055, 0.72], [sx, 0.04, 0], materials.chromeFrame);
      addBox(
        chair,
        [0.055, 0.56, 0.055],
        [sx, 0.29, 0.26],
        materials.chromeFrame,
        [-0.18, 0, 0],
      );
      addBox(
        chair,
        [0.055, 1.02, 0.055],
        [sx, 0.52, -0.22],
        materials.chromeFrame,
        [-0.18, 0, 0],
      );
      // Warm wood armrests
      addBox(chair, [0.09, 0.055, 0.58], [sx, 0.58, 0.04], materials.woodWarm);
    }
    addBox(chair, [0.76, 0.05, 0.05], [0, 0.04, 0.33], materials.chromeFrame);
    addBox(chair, [0.76, 0.05, 0.05], [0, 0.04, -0.33], materials.chromeFrame);

    // Cocoa-brown cushioned seat & backrest
    addBox(chair, [0.68, 0.11, 0.58], [0, 0.4, 0.05], materials.chairFabric);
    addBox(
      chair,
      [0.68, 0.56, 0.11],
      [0, 0.76, -0.25],
      materials.chairFabric,
      [-0.2, 0, 0],
    );
  }

  addCampChair([-1.35, 0, -0.82], 0.58);
  addCampChair([1.45, 0, 0.98], -2.18);

  // Hackathon Championship Trophy on cut-wood stump
  const trophyStump = new Group();
  trophyStump.position.set(-2.2, 0, 0.48);
  achievementsGroup.add(trophyStump);

  const stumpBase = new Mesh(cylinder, materials.woodDark);
  stumpBase.scale.set(0.46, 0.48, 0.46);
  stumpBase.position.y = 0.24;
  stumpBase.castShadow = true;
  trophyStump.add(stumpBase);

  const stumpRing = new Mesh(cylinder, materials.woodLight);
  stumpRing.scale.set(0.41, 0.04, 0.41);
  stumpRing.position.y = 0.49;
  trophyStump.add(stumpRing);

  // Golden 1st-place Trophy Cup
  addBox(trophyStump, [0.34, 0.12, 0.34], [0, 0.56, 0], materials.slateInk);
  const cupStem = new Mesh(cylinder, materials.goldTrophy);
  cupStem.scale.set(0.07, 0.24, 0.07);
  cupStem.position.y = 0.72;
  trophyStump.add(cupStem);

  const cupBowl = new Mesh(
    new CylinderGeometry(0.24, 0.12, 0.36, 18),
    materials.goldTrophy,
  );
  cupBowl.position.y = 0.98;
  cupBowl.castShadow = true;
  trophyStump.add(cupBowl);

  for (const side of [-1, 1]) {
    const handle = new Mesh(
      new TorusGeometry(0.11, 0.026, 8, 16, Math.PI),
      materials.goldTrophy,
    );
    handle.rotation.z = side * (-Math.PI / 2);
    handle.position.set(side * 0.2, 0.99, 0);
    trophyStump.add(handle);
  }

  await stage();

  // ---------------------------------------------------------------------------
  // ZONE 3: PROJECTS — Woodland Coding Workbench & Project Showcase Easels
  // ---------------------------------------------------------------------------
  const projectsGroup = createZoneGroup("projects");

  // Handcrafted wooden camp desk with glowing laptop/monitor
  const desk = new Group();
  desk.position.set(-0.65, 0, 0.78);
  desk.rotation.y = 0.65;
  projectsGroup.add(desk);

  addBox(desk, [1.65, 0.12, 0.95], [0, 0.74, 0], materials.woodWarm);
  for (const lx of [-0.68, 0.68]) {
    for (const lz of [-0.36, 0.36]) {
      addBox(desk, [0.11, 0.72, 0.11], [lx, 0.36, lz], materials.woodDark);
    }
  }
  // Clay Laptop
  addBox(desk, [0.76, 0.05, 0.52], [-0.15, 0.82, 0.06], materials.chromeFrame);
  const laptopLid = new Group();
  laptopLid.position.set(-0.15, 0.84, -0.18);
  laptopLid.rotation.x = -0.24;
  desk.add(laptopLid);
  addBox(laptopLid, [0.76, 0.52, 0.05], [0, 0.26, 0], materials.slateInk);

  const codeTex = materials.makeCanvasTexture(512, 340, (ctx) => {
    ctx.fillStyle = "#1d2436";
    ctx.fillRect(0, 0, 512, 340);
    ctx.fillStyle = "#2b354f";
    ctx.fillRect(0, 0, 512, 42);
    ["#ff6b57", "#f7c232", "#6fd05c"].forEach((c, idx) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(24 + idx * 22, 21, 7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#ffd97d";
    ctx.font = "bold 46px sans-serif";
    ctx.fillText("bipul.dev", 34, 122);
    ctx.fillStyle = "#8ce0a8";
    ctx.font = "24px monospace";
    ctx.fillText("ship(thoughtfulCode);", 34, 178);
    ctx.fillStyle = "#f4b518";
    ctx.fillRect(34, 226, 230, 58);
    ctx.fillStyle = "#1d2436";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("VIEW PROJECTS ↗", 52, 263);
  });
  const laptopScreen = new Mesh(
    new PlaneGeometry(0.68, 0.44),
    new MeshBasicMaterial({ map: codeTex }),
  );
  laptopScreen.position.set(0, 0.26, 0.03);
  laptopLid.add(laptopScreen);

  // Enamel camp coffee mug on desk
  const mug = new Mesh(cylinder, materials.coralPost);
  mug.scale.set(0.11, 0.2, 0.11);
  mug.position.set(0.52, 0.9, 0.15);
  desk.add(mug);

  // Up to 2 A-frame wooden Project Showcase Easels displaying real projects
  const displayProjects = (
    projects.length
      ? projects
      : [
          {
            title: "Selected Systems",
            techStack: ["TypeScript", "React", "Node.js"],
            slug: "",
          },
        ]
  ).slice(0, 2);

  displayProjects.forEach((proj, idx) => {
    const easel = new Group();
    easel.position.set(0.55 - idx * 0.25, 0, -0.75 + idx * 1.48);
    easel.rotation.y = 0.72 - idx * 0.22;
    easel.userData.section = "projects";
    if (proj.slug) easel.userData.slug = proj.slug;
    projectsGroup.add(easel);

    // Timber A-frame easel legs tucked cleanly behind the framed board
    addBox(easel, [0.1, 1.92, 0.1], [-0.54, 0.94, -0.22], materials.woodDark, [-0.1, 0, 0.05]);
    addBox(easel, [0.1, 1.92, 0.1], [0.54, 0.94, -0.22], materials.woodDark, [-0.1, 0, -0.05]);
    addBox(easel, [0.1, 1.82, 0.1], [0, 0.86, -0.62], materials.woodDark, [-0.3, 0, 0]);
    addBox(easel, [1.66, 0.1, 0.18], [0, 0.74, 0.04], materials.woodWarm);

    // Framed project board
    const frameGroup = new Group();
    frameGroup.position.set(0, 1.36, 0.02);
    frameGroup.rotation.x = -0.1;
    easel.add(frameGroup);

    addBox(
      frameGroup,
      [1.64, 1.18, 0.11],
      [0, 0, 0],
      idx === 0 ? materials.woodWarm : materials.slateInk,
    );

    const cardTex = materials.makeCanvasTexture(640, 440, (ctx) => {
      const darkCard = idx === 1;
      ctx.fillStyle = darkCard ? "#1e2538" : "#f5ebd6";
      ctx.fillRect(0, 0, 640, 440);
      ctx.fillStyle = idx === 0 ? "#db492c" : "#eea608";
      ctx.fillRect(0, 0, 640, 28);

      ctx.fillStyle = darkCard ? "#9aa5c4" : "#6c5942";
      ctx.font = "bold 23px monospace";
      ctx.fillText(`PROJECT 0${idx + 1}`, 38, 78);

      ctx.fillStyle = darkCard ? "#fff8ea" : "#1d2334";
      ctx.font = "bold 46px sans-serif";
      const words = proj.title.split(" ");
      let line = "";
      let y = 148;
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > 550 && line) {
          ctx.fillText(line, 38, y);
          line = word;
          y += 54;
        } else {
          line = test;
        }
      }
      ctx.fillText(line, 38, y);

      const tags = proj.techStack.slice(0, 3);
      let tx = 38;
      tags.forEach((tag) => {
        ctx.font = "bold 22px sans-serif";
        const w = ctx.measureText(tag).width + 32;
        ctx.fillStyle = darkCard ? "#2f3954" : "#e3d4b7";
        ctx.fillRect(tx, 344, w, 48);
        ctx.fillStyle = darkCard ? "#ffd97d" : "#252c40";
        ctx.fillText(tag, tx + 16, 376);
        tx += w + 14;
      });
    });

    const boardFace = new Mesh(
      new PlaneGeometry(1.48, 1.02),
      new MeshBasicMaterial({ map: cardTex, toneMapped: false }),
    );
    boardFace.position.z = 0.062;
    frameGroup.add(boardFace);
  });

  await stage();

  // ---------------------------------------------------------------------------
  // ZONE 4: SKILLS — Trailblazer Directional Signpost & Camp Supply Chest
  // ---------------------------------------------------------------------------
  const skillsGroup = createZoneGroup("skills");

  const signPole = new Mesh(cylinder, materials.woodDark);
  signPole.scale.set(0.11, 2.45, 0.11);
  signPole.position.set(0, 1.22, 0);
  signPole.castShadow = true;
  skillsGroup.add(signPole);

  const poleCap = new Mesh(sphere, materials.goldTrophy);
  poleCap.scale.set(0.14, 0.14, 0.14);
  poleCap.position.set(0, 2.48, 0);
  skillsGroup.add(poleCap);

  const signConfigs: readonly [string, number, number, Material, string][] = [
    ["TS · REACT", 2.08, 0.45, materials.tentYellow, "#231a08"],
    ["NODE · SPRING", 1.62, 0.95, materials.tealBadge, "#fff9ed"],
    ["SQL · DOCKER", 1.16, 0.58, materials.skyBadge, "#fff9ed"],
  ];

  signConfigs.forEach(([label, sy, rotY, mat, textHex]) => {
    const signGroup = new Group();
    signGroup.position.set(0, sy, 0);
    signGroup.rotation.y = rotY;
    skillsGroup.add(signGroup);

    addBox(signGroup, [1.28, 0.32, 0.09], [0.68, 0, 0], mat);
    const labelTex = materials.makeCanvasTexture(384, 96, (ctx) => {
      ctx.clearRect(0, 0, 384, 96);
      ctx.fillStyle = textHex;
      ctx.font = "bold 40px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, 192, 62);
    });
    const signPlane = new Mesh(
      new PlaneGeometry(1.14, 0.26),
      new MeshBasicMaterial({ map: labelTex, transparent: true, toneMapped: false }),
    );
    signPlane.position.set(0.68, 0, 0.052);
    signGroup.add(signPlane);
  });

  // Camp supply chest & brass spyglass beside the signpost
  addBox(skillsGroup, [0.95, 0.52, 0.62], [0.58, 0.26, 0.65], materials.woodWarm, [0, 0.42, 0]);
  addBox(skillsGroup, [0.99, 0.12, 0.66], [0.58, 0.54, 0.65], materials.woodDark, [0, 0.42, 0]);
  addBox(skillsGroup, [0.14, 0.14, 0.08], [0.72, 0.46, 0.88], materials.goldTrophy, [0, 0.42, 0]);

  await stage();

  // ---------------------------------------------------------------------------
  // ZONE 5: BLOG — Field Journal Reading Stump
  // ---------------------------------------------------------------------------
  const blogGroup = createZoneGroup("blog");

  const journalStump = new Mesh(cylinder, materials.woodDark);
  journalStump.scale.set(0.68, 0.62, 0.68);
  journalStump.position.y = 0.31;
  journalStump.castShadow = true;
  blogGroup.add(journalStump);

  const journalTop = new Mesh(cylinder, materials.woodLight);
  journalTop.scale.set(0.62, 0.045, 0.62);
  journalTop.position.y = 0.63;
  blogGroup.add(journalTop);

  // Open hardcover Field Notebook
  const notebook = new Group();
  notebook.position.set(0, 0.68, 0);
  notebook.rotation.y = 0.72;
  blogGroup.add(notebook);

  addBox(notebook, [0.88, 0.06, 0.64], [0, 0, 0], materials.coralPost);
  addBox(notebook, [0.4, 0.07, 0.56], [-0.21, 0.045, 0], materials.creamPaper, [0, 0, 0.05]);
  addBox(notebook, [0.4, 0.07, 0.56], [0.21, 0.045, 0], materials.creamPaper, [0, 0, -0.05]);
  // Printed note lines & coral ribbon
  for (let l = -2; l <= 2; l++) {
    addBox(notebook, [0.28, 0.015, 0.025], [-0.21, 0.085, l * 0.09], materials.slateInk, [0, 0, 0], false);
    addBox(notebook, [0.28, 0.015, 0.025], [0.21, 0.085, l * 0.09], materials.slateInk, [0, 0, 0], false);
  }
  addBox(notebook, [0.05, 0.02, 0.28], [0.05, 0.07, 0.32], materials.tentYellow, [0, 0, 0], false);

  // ---------------------------------------------------------------------------
  // ZONE 6: CONTACT — Trailhead Coral Mailbox & Parcel
  // ---------------------------------------------------------------------------
  const contactGroup = createZoneGroup("contact");

  const mailPost = new Mesh(cylinder, materials.woodDark);
  mailPost.scale.set(0.11, 1.32, 0.11);
  mailPost.position.y = 0.66;
  mailPost.castShadow = true;
  contactGroup.add(mailPost);

  const mailbox = new Group();
  mailbox.position.set(0, 1.36, 0);
  mailbox.rotation.y = 0.78;
  contactGroup.add(mailbox);

  addBox(mailbox, [0.64, 0.42, 0.94], [0, 0.12, 0], materials.coralPost);
  const mailVault = new Mesh(cylinder, materials.coralPost);
  mailVault.scale.set(0.32, 0.92, 0.32);
  mailVault.rotation.x = Math.PI / 2;
  mailVault.position.set(0, 0.32, 0);
  mailVault.castShadow = true;
  mailbox.add(mailVault);

  // Mail slot & cheerful raised golden flag
  addBox(mailbox, [0.42, 0.06, 0.05], [0, 0.24, 0.46], materials.slateInk);
  addBox(mailbox, [0.05, 0.46, 0.05], [0.35, 0.34, 0.12], materials.tentYellow);
  addBox(mailbox, [0.05, 0.16, 0.24], [0.35, 0.51, 0.22], materials.tentYellow);

  // Tied kraft parcel beside the mailbox post
  addBox(contactGroup, [0.48, 0.38, 0.44], [-0.42, 0.19, 0.35], materials.woodLight, [0, 0.3, 0]);
  addBox(contactGroup, [0.5, 0.4, 0.06], [-0.42, 0.19, 0.35], materials.coralPost, [0, 0.3, 0]);

  // ---------------------------------------------------------------------------
  // Ambient golden fireflies drifting gently above the clearing
  // ---------------------------------------------------------------------------
  const fireflyCoords: readonly [number, number, number][] = [
    [-1.8, 2.3, -1.6],
    [1.6, 2.6, -1.8],
    [-2.6, 1.9, 2.1],
    [2.5, 2.1, 2.4],
    [0.4, 3.2, -0.6],
    [-0.5, 1.8, 3.8],
  ];
  fireflyCoords.forEach(([fx, fy, fz], i) => {
    const mote = new Mesh(sphere, materials.flameGold);
    mote.scale.setScalar(0.055);
    mote.position.set(fx, fy, fz);
    mote.userData.basePos = [fx, fy, fz];
    mote.userData.phase = i * 1.35;
    mote.raycast = () => {};
    root.add(mote);
    fireflies.push(mote);
  });

  const animated: DioramaAnimatedHandles = {
    flames,
    steamPuffs,
    fireflies,
    zoneGroups: {
      about: aboutGroup,
      projects: projectsGroup,
      skills: skillsGroup,
      achievements: achievementsGroup,
      blog: blogGroup,
      contact: contactGroup,
    },
  };

  return { root, animated };
}
