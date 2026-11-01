import {
  BufferGeometry,
  ConeGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  PlaneGeometry,
  SphereGeometry,
  TorusGeometry,
  type Object3D,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { DioramaMaterials } from "./diorama-materials";

export type SkyTechAnimatedHandles = {
  update: (t: number) => void;
};

function createPaperPlaneGeometry(): BufferGeometry {
  // Crisp folded origami delta paper airplane pointing along +Z
  const positions = new Float32Array([
    // Left top wing
    0, 0.04, 0.55,
    -0.42, 0.09, -0.42,
    -0.04, 0.05, -0.36,
    // Right top wing
    0, 0.04, 0.55,
    0.04, 0.05, -0.36,
    0.42, 0.09, -0.42,
    // Center keel left
    0, 0.04, 0.55,
    -0.04, 0.05, -0.36,
    0, -0.11, -0.38,
    // Center keel right
    0, 0.04, 0.55,
    0, -0.11, -0.38,
    0.04, 0.05, -0.36,
  ]);
  const geom = new BufferGeometry();
  geom.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geom.computeVertexNormals();
  return geom;
}

export function buildDioramaSkyTech(materials: DioramaMaterials): {
  root: Group;
  animated: SkyTechAnimatedHandles;
} {
  const root = new Group();

  const unitBox = new RoundedBoxGeometry(1, 1, 1, 3, 0.14);
  const sphere = new SphereGeometry(1, 18, 14);
  const cylinder = new CylinderGeometry(1, 1, 1, 16);
  const cone = new ConeGeometry(1, 1, 16);
  const octa = new OctahedronGeometry(1, 0);
  const planeGeom = createPaperPlaneGeometry();

  // Tactile sky-tech materials matching the pastel clay diorama palette
  const cloudClay = new MeshStandardMaterial({
    color: "#f4f2ff",
    roughness: 0.78,
    metalness: 0.01,
  });
  const cyanGlow = new MeshBasicMaterial({ color: "#2de2c9" });
  const goldGlow = new MeshBasicMaterial({ color: "#ffc93c" });
  const coralGlow = new MeshBasicMaterial({ color: "#ff6b4a" });
  const cyanClay = new MeshPhysicalMaterial({
    color: "#2ec4b6",
    roughness: 0.38,
    metalness: 0.08,
    clearcoat: 0.25,
  });
  const periwinkleClay = new MeshStandardMaterial({
    color: "#7c73d9",
    roughness: 0.48,
    metalness: 0.08,
  });
  const orbitRingMat = new MeshBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.28,
  });
  const rotorBlurMat = new MeshBasicMaterial({
    color: "#eef2ff",
    transparent: true,
    opacity: 0.34,
  });
  const paperDoubleMat = new MeshStandardMaterial({
    color: "#fcf5e3",
    roughness: 0.72,
    side: 2, // DoubleSide so wings look solid from every orbit angle
  });

  // ---------------------------------------------------------------------------
  // 1. TILTED ORBITAL DATA RINGS + STREAMING NETWORK PACKETS
  // ---------------------------------------------------------------------------
  const orbitPackets: Array<{
    mesh: Object3D;
    radius: number;
    speed: number;
    phase: number;
  }> = [];

  const orbitConfigs = [
    { radius: 8.6, rot: [0.28, 0.35, -0.22] as const, count: 5 },
    { radius: 10.4, rot: [-0.24, -0.3, 0.26] as const, count: 6 },
  ];

  orbitConfigs.forEach((cfg, ringIdx) => {
    const ringPivot = new Group();
    ringPivot.position.set(0, 2.6 + ringIdx * 0.6, 0);
    ringPivot.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);

    const torus = new Mesh(
      new TorusGeometry(cfg.radius, 0.022, 8, 96),
      orbitRingMat,
    );
    torus.rotation.x = Math.PI / 2;
    ringPivot.add(torus);

    const packetMats = [cyanGlow, goldGlow, coralGlow];
    for (let i = 0; i < cfg.count; i++) {
      const pkt = new Mesh(
        i % 2 === 0 ? octa : sphere,
        packetMats[(i + ringIdx) % packetMats.length],
      );
      const s = i % 2 === 0 ? 0.12 : 0.095;
      pkt.scale.set(s, s, s);
      ringPivot.add(pkt);
      orbitPackets.push({
        mesh: pkt,
        radius: cfg.radius,
        speed: (ringIdx === 0 ? 0.38 : -0.27) * (0.9 + (i % 3) * 0.1),
        phase: (i / cfg.count) * Math.PI * 2,
      });
    }

    root.add(ringPivot);
  });

  // ---------------------------------------------------------------------------
  // 2. AUTONOMOUS CLAY TECH QUADCOPTER DRONE (CARRYING GOLDEN CODE CUBE)
  // ---------------------------------------------------------------------------
  const drone = new Group();
  const droneBody = new Mesh(unitBox, materials.coralPost);
  droneBody.scale.set(0.72, 0.28, 0.92);
  drone.add(droneBody);

  const droneCanopy = new Mesh(unitBox, materials.creamPaper);
  droneCanopy.scale.set(0.56, 0.16, 0.62);
  droneCanopy.position.set(0, 0.16, -0.04);
  drone.add(droneCanopy);

  // Camera gimbal & glowing cyan lens
  const gimbal = new Mesh(sphere, materials.slateInk);
  gimbal.scale.set(0.16, 0.16, 0.16);
  gimbal.position.set(0, -0.14, 0.28);
  drone.add(gimbal);

  const lens = new Mesh(sphere, cyanGlow);
  lens.scale.set(0.075, 0.075, 0.075);
  lens.position.set(0, -0.15, 0.41);
  drone.add(lens);

  // Suspended glowing golden data cube parcel underneath
  const tether = new Mesh(cylinder, materials.chromeFrame);
  tether.scale.set(0.02, 0.32, 0.02);
  tether.position.set(0, -0.28, -0.05);
  drone.add(tether);

  const dataCube = new Mesh(unitBox, materials.goldTrophy);
  dataCube.scale.set(0.32, 0.32, 0.32);
  dataCube.position.set(0, -0.5, -0.05);
  drone.add(dataCube);

  const droneRotors: Group[] = [];
  const armOffsets: Array<[number, number]> = [
    [-0.55, 0.55],
    [0.55, 0.55],
    [-0.55, -0.55],
    [0.55, -0.55],
  ];
  armOffsets.forEach(([ax, az]) => {
    const arm = new Mesh(unitBox, materials.slateInk);
    arm.scale.set(0.1, 0.07, 0.78);
    arm.position.set(ax * 0.55, 0.03, az * 0.55);
    arm.rotation.y = Math.atan2(ax, az);
    drone.add(arm);

    const motor = new Mesh(cylinder, materials.chromeFrame);
    motor.scale.set(0.1, 0.14, 0.1);
    motor.position.set(ax, 0.09, az);
    drone.add(motor);

    const disc = new Mesh(cylinder, rotorBlurMat);
    disc.scale.set(0.38, 0.012, 0.38);
    disc.position.set(ax, 0.17, az);
    drone.add(disc);

    const rotorHub = new Group();
    rotorHub.position.set(ax, 0.175, az);
    const blade1 = new Mesh(unitBox, materials.slateInk);
    blade1.scale.set(0.72, 0.018, 0.08);
    const blade2 = new Mesh(unitBox, materials.slateInk);
    blade2.scale.set(0.08, 0.018, 0.72);
    rotorHub.add(blade1, blade2);
    drone.add(rotorHub);
    droneRotors.push(rotorHub);
  });
  drone.scale.setScalar(0.92);
  root.add(drone);

  // ---------------------------------------------------------------------------
  // 3. ORBITING SOLAR TECH SATELLITE
  // ---------------------------------------------------------------------------
  const satellite = new Group();

  const satBus = new Mesh(unitBox, materials.goldTrophy);
  satBus.scale.set(0.58, 0.58, 0.72);
  satellite.add(satBus);

  const satCoreRing = new Mesh(cylinder, materials.slateInk);
  satCoreRing.scale.set(0.34, 0.82, 0.34);
  satCoreRing.rotation.x = Math.PI / 2;
  satellite.add(satCoreRing);

  // Parabolic communications dish + gold feed horn
  const dish = new Mesh(cone, materials.creamPaper);
  dish.scale.set(0.42, 0.22, 0.42);
  dish.rotation.x = -Math.PI / 2;
  dish.position.set(0, 0, 0.52);
  satellite.add(dish);

  const feedHorn = new Mesh(sphere, cyanGlow);
  feedHorn.scale.set(0.08, 0.08, 0.08);
  feedHorn.position.set(0, 0, 0.68);
  satellite.add(feedHorn);

  // Crisp photovoltaic solar panel canvas texture
  const solarTex = materials.makeCanvasTexture(256, 128, (ctx) => {
    ctx.fillStyle = "#1a3365";
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = "#5ea4ff";
    ctx.lineWidth = 3;
    for (let x = 0; x <= 256; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 128);
      ctx.stroke();
    }
    for (let y = 0; y <= 128; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
  });
  const solarFaceMat = new MeshBasicMaterial({ map: solarTex });

  for (const side of [-1, 1]) {
    const wing = new Group();
    wing.position.set(side * 1.15, 0, 0);

    const strut = new Mesh(cylinder, materials.chromeFrame);
    strut.scale.set(0.035, 0.5, 0.035);
    strut.rotation.z = Math.PI / 2;
    strut.position.set(-side * 0.68, 0, 0);
    wing.add(strut);

    const backing = new Mesh(unitBox, materials.slateInk);
    backing.scale.set(1.25, 0.06, 0.62);
    wing.add(backing);

    const cellsTop = new Mesh(new PlaneGeometry(1.16, 0.54), solarFaceMat);
    cellsTop.rotation.x = -Math.PI / 2;
    cellsTop.position.y = 0.035;
    const cellsBottom = new Mesh(new PlaneGeometry(1.16, 0.54), solarFaceMat);
    cellsBottom.rotation.x = Math.PI / 2;
    cellsBottom.position.y = -0.035;
    wing.add(cellsTop, cellsBottom);

    wing.rotation.x = 0.35;
    satellite.add(wing);
  }
  satellite.scale.setScalar(0.86);
  root.add(satellite);

  // ---------------------------------------------------------------------------
  // 4. 3D REACT / QUANTUM ATOM GYROSCOPE & CLAY `< />` CODE SCULPTURE
  // ---------------------------------------------------------------------------
  const atomGroup = new Group();
  atomGroup.position.set(-8.1, 4.8, 2.1); // Open upper-left lavender sky

  const nucleus = new Mesh(sphere, cyanClay);
  nucleus.scale.setScalar(0.28);
  atomGroup.add(nucleus);

  const gyroRingGeom = new TorusGeometry(0.92, 0.055, 12, 48);
  const gyroRings: Mesh[] = [];
  const ringMats = [cyanClay, materials.goldTrophy, periwinkleClay];
  for (let i = 0; i < 3; i++) {
    const ring = new Mesh(gyroRingGeom, ringMats[i]);
    ring.rotation.set((i * Math.PI) / 3, (i * Math.PI) / 4, 0);
    const electron = new Mesh(sphere, i === 1 ? cyanGlow : goldGlow);
    electron.scale.setScalar(0.1);
    electron.position.set(0.92, 0, 0);
    ring.add(electron);
    atomGroup.add(ring);
    gyroRings.push(ring);
  }
  root.add(atomGroup);

  // Sculpted 3D Clay `< />` Code Brackets in right sky
  const codeTotem = new Group();
  codeTotem.position.set(8.3, 3.3, -2.5);
  codeTotem.rotation.y = Math.PI / 4;

  function makeChevron(dir: -1 | 1) {
    const g = new Group();
    const upper = new Mesh(unitBox, materials.tentYellow);
    upper.scale.set(0.56, 0.16, 0.18);
    upper.position.set(dir * 0.14, 0.17, 0);
    upper.rotation.z = dir * -0.68;

    const lower = new Mesh(unitBox, materials.tentYellow);
    lower.scale.set(0.56, 0.16, 0.18);
    lower.position.set(dir * 0.14, -0.17, 0);
    lower.rotation.z = dir * 0.68;

    g.add(upper, lower);
    g.position.x = dir * 0.68;
    return g;
  }

  const slash = new Mesh(unitBox, materials.coralPost);
  slash.scale.set(0.16, 0.92, 0.18);
  slash.rotation.z = -0.34;
  codeTotem.add(makeChevron(-1), slash, makeChevron(1));
  root.add(codeTotem);

  // ---------------------------------------------------------------------------
  // 5. FLOATING CLAY HOLOGRAM / DEV TERMINAL WINDOWS (x3)
  // ---------------------------------------------------------------------------
  const floatingCards: Array<{
    group: Group;
    baseY: number;
    phase: number;
  }> = [];

  function makeTechCard(
    pos: [number, number, number],
    rotY: number,
    phase: number,
    frameMat: MeshStandardMaterial,
    drawScreen: (ctx: CanvasRenderingContext2D) => void,
  ) {
    const card = new Group();
    card.position.set(pos[0], pos[1], pos[2]);
    card.rotation.y = rotY;

    const bezel = new Mesh(unitBox, frameMat);
    bezel.scale.set(1.75, 1.12, 0.12);
    card.add(bezel);

    const tex = materials.makeCanvasTexture(384, 240, drawScreen);
    const screen = new Mesh(
      new PlaneGeometry(1.56, 0.94),
      new MeshBasicMaterial({ map: tex }),
    );
    screen.position.z = 0.066;
    card.add(screen);

    const backScreen = new Mesh(
      new PlaneGeometry(1.56, 0.94),
      new MeshBasicMaterial({ map: tex }),
    );
    backScreen.rotation.y = Math.PI;
    backScreen.position.z = -0.066;
    card.add(backScreen);

    root.add(card);
    floatingCards.push({ group: card, baseY: pos[1], phase });
  }

  // Card 1: Live Terminal Window (Mid-Left Sky)
  makeTechCard(
    [-7.5, 2.75, 4.9],
    Math.PI / 4 + 0.15,
    0.4,
    materials.slateInk,
    (ctx) => {
      ctx.fillStyle = "#181d2c";
      ctx.fillRect(0, 0, 384, 240);
      // Traffic lights
      const dots = ["#ff5f56", "#ffbd2e", "#27c93f"];
      dots.forEach((c, idx) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(26 + idx * 20, 24, 6.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = "#8e98b8";
      ctx.font = "700 16px system-ui, monospace";
      ctx.fillText("bipul@basecamp ~", 104, 30);

      // Syntax-highlighted code blocks
      ctx.fillStyle = "#2de2c9";
      ctx.font = "700 20px monospace";
      ctx.fillText("$ deploy --prod", 24, 78);

      const bars: Array<[number, number, string]> = [
        [24, 104, "#f4b518"],
        [136, 104, "#7ea8ff"],
        [24, 132, "#ff7c5c"],
        [108, 132, "#c8b6ff"],
        [218, 132, "#2de2c9"],
      ];
      bars.forEach(([x, y, color]) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x, y, 86, 14, 7);
        ctx.fill();
      });

      ctx.fillStyle = "rgba(45, 226, 201, 0.18)";
      ctx.beginPath();
      ctx.roundRect(24, 174, 168, 38, 19);
      ctx.fill();
      ctx.fillStyle = "#2de2c9";
      ctx.font = "800 17px system-ui, sans-serif";
      ctx.fillText("● 200 LIVE · TS", 42, 199);
    },
  );

  // Card 2: Distributed Systems Architecture Graph (Upper-Right Sky)
  makeTechCard(
    [2.5, 5.35, -8.2],
    Math.PI / 4 - 0.14,
    2.1,
    materials.creamPaper,
    (ctx) => {
      ctx.fillStyle = "#f9f7ff";
      ctx.fillRect(0, 0, 384, 240);
      ctx.fillStyle = "#5c54a4";
      ctx.font = "800 16px system-ui, sans-serif";
      ctx.fillText("SYSTEM ARCHITECTURE", 24, 34);

      // Connector lines
      ctx.strokeStyle = "#8c84d8";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(80, 125);
      ctx.lineTo(192, 85);
      ctx.lineTo(304, 125);
      ctx.moveTo(80, 125);
      ctx.lineTo(192, 168);
      ctx.lineTo(304, 125);
      ctx.stroke();

      const nodes: Array<[number, number, string, string]> = [
        [80, 125, "#1f2438", "API"],
        [192, 85, "#e25438", "MQ"],
        [192, 168, "#f4b518", "CACHE"],
        [304, 125, "#2d7d6c", "SQL"],
      ];
      nodes.forEach(([nx, ny, bg, label]) => {
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.roundRect(nx - 42, ny - 24, 84, 48, 14);
        ctx.fill();
        ctx.fillStyle = bg === "#f4b518" ? "#1f2438" : "#ffffff";
        ctx.font = "800 16px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, nx, ny + 6);
      });
      ctx.textAlign = "left";
    },
  );

  // Card 3: Git Shipped Pill Card (Open Lower-Right Sky outside island edge)
  makeTechCard(
    [9.5, 2.1, -0.35],
    Math.PI / 4 - 0.1,
    4.0,
    materials.slateInk,
    (ctx) => {
      ctx.fillStyle = "#1e2336";
      ctx.fillRect(0, 0, 384, 240);
      ctx.fillStyle = "#f4b518";
      ctx.font = "800 17px monospace";
      ctx.fillText("git push origin main", 24, 48);

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 26px system-ui, sans-serif";
      ctx.fillText("✓ Build Passed", 24, 102);

      ctx.fillStyle = "#313956";
      ctx.beginPath();
      ctx.roundRect(24, 134, 336, 20, 10);
      ctx.fill();
      ctx.fillStyle = "#2de2c9";
      ctx.beginPath();
      ctx.roundRect(24, 134, 294, 20, 10);
      ctx.fill();

      ctx.fillStyle = "#a7b0cf";
      ctx.font = "700 16px system-ui, sans-serif";
      ctx.fillText("React 19 · TanStack · Docker", 24, 198);
    },
  );

  // ---------------------------------------------------------------------------
  // 6. FLUFFY CLAY "CLOUD COMPUTING" CLOUDS (WITH MINI SERVER PODS)
  // ---------------------------------------------------------------------------
  const clouds: Array<{ group: Group; baseX: number; baseZ: number; phase: number }> = [];
  const cloudSpecs: Array<{
    pos: [number, number, number];
    scale: number;
    hasServerPod: boolean;
  }> = [
    { pos: [-9.4, 6.2, -1.6], scale: 0.95, hasServerPod: true },
    { pos: [-1.4, 7.1, -9.8], scale: 1.08, hasServerPod: false },
    { pos: [8.9, 5.6, -5.8], scale: 0.92, hasServerPod: true },
    { pos: [-5.6, 5.2, 8.1], scale: 0.82, hasServerPod: false },
  ];

  cloudSpecs.forEach((spec, idx) => {
    const cg = new Group();
    cg.position.set(...spec.pos);
    cg.scale.setScalar(spec.scale);

    const puffs: Array<[number, number, number, number]> = [
      [0, 0.14, 0, 0.62],
      [-0.52, 0, 0.08, 0.46],
      [0.54, -0.02, -0.06, 0.48],
      [0.12, 0.28, -0.18, 0.44],
    ];
    puffs.forEach(([px, py, pz, r]) => {
      const p = new Mesh(sphere, cloudClay);
      p.scale.set(r * 1.15, r * 0.92, r);
      p.position.set(px, py, pz);
      cg.add(p);
    });

    // Cute miniature "Cloud Server" rack pod suspended underneath!
    if (spec.hasServerPod) {
      const rack = new Mesh(unitBox, materials.slateInk);
      rack.scale.set(0.58, 0.36, 0.42);
      rack.position.set(0, -0.42, 0);
      cg.add(rack);

      for (let row = 0; row < 2; row++) {
        const led = new Mesh(sphere, row === 0 ? cyanGlow : goldGlow);
        led.scale.setScalar(0.048);
        led.position.set(-0.18 + row * 0.14, -0.36 - row * 0.11, 0.22);
        cg.add(led);
      }
    }

    root.add(cg);
    clouds.push({
      group: cg,
      baseX: spec.pos[0],
      baseZ: spec.pos[2],
      phase: idx * 1.6,
    });
  });

  // ---------------------------------------------------------------------------
  // 7. GLIDING ORIGAMI CODE PAPER AIRPLANES (x2)
  // ---------------------------------------------------------------------------
  const paperPlanes: Mesh[] = [];
  for (let i = 0; i < 2; i++) {
    const plane = new Mesh(planeGeom, paperDoubleMat);
    plane.scale.setScalar(i === 0 ? 0.85 : 0.72);
    root.add(plane);
    paperPlanes.push(plane);
  }

  // ---------------------------------------------------------------------------
  // ANIMATION UPDATE LOOP (60 FPS, ZERO ALLOCATIONS)
  // ---------------------------------------------------------------------------
  function update(t: number) {
    // 1. Streaming data packets along orbital rings
    for (let i = 0; i < orbitPackets.length; i++) {
      const p = orbitPackets[i];
      const angle = t * p.speed + p.phase;
      p.mesh.position.set(
        Math.cos(angle) * p.radius,
        Math.sin(angle * 3) * 0.08,
        Math.sin(angle) * p.radius,
      );
      p.mesh.rotation.y = angle * 2;
    }

    // 2. Quadcopter drone patrol path + banking + high-speed rotors
    const dAngle = t * 0.36;
    const dNext = dAngle + 0.05;
    const dx = Math.cos(dAngle) * 6.8;
    const dz = Math.sin(dAngle) * 6.2 + Math.sin(dAngle * 2) * 1.1;
    const dy = 4.05 + Math.sin(t * 1.4) * 0.28;
    const nx = Math.cos(dNext) * 6.8;
    const nz = Math.sin(dNext) * 6.2 + Math.sin(dNext * 2) * 1.1;

    drone.position.set(dx, dy, dz);
    drone.rotation.set(
      0.1, // gentle forward pitch
      Math.atan2(nx - dx, nz - dz),
      Math.sin(dAngle) * -0.16, // bank into turns
    );
    for (let i = 0; i < droneRotors.length; i++) {
      droneRotors[i].rotation.y = t * (i % 2 === 0 ? 26 : -26);
    }

    // 3. Low-orbit solar satellite sweeping across upper sky
    const sAngle = -t * 0.16 + 0.85;
    satellite.position.set(
      Math.cos(sAngle) * 9.5,
      6.15 + Math.sin(t * 0.7) * 0.24,
      Math.sin(sAngle) * 9.5,
    );
    satellite.lookAt(0, 1.2, 0);
    satellite.rotateZ(Math.sin(t * 0.5) * 0.2);

    // 4. Spinning 3D React/Atom Gyroscope & `< />` Code Sculpture
    atomGroup.position.y = 4.8 + Math.sin(t * 1.2) * 0.22;
    gyroRings[0].rotation.x = t * 0.9;
    gyroRings[0].rotation.y = t * 0.5;
    gyroRings[1].rotation.y = -t * 0.85;
    gyroRings[1].rotation.z = t * 0.6;
    gyroRings[2].rotation.z = -t * 0.75;
    gyroRings[2].rotation.x = -t * 0.45;

    codeTotem.position.y = 3.3 + Math.sin(t * 1.35 + 1.2) * 0.24;
    codeTotem.rotation.y = Math.PI / 4 + Math.sin(t * 0.65) * 0.32;
    codeTotem.rotation.z = Math.cos(t * 0.8) * 0.08;

    // 5. Bobbing Hologram / Terminal Windows
    for (let i = 0; i < floatingCards.length; i++) {
      const c = floatingCards[i];
      c.group.position.y = c.baseY + Math.sin(t * 1.15 + c.phase) * 0.2;
      c.group.rotation.z = Math.sin(t * 0.75 + c.phase) * 0.04;
    }

    // 6. Gently drifting Cloud-Server Clay Clouds
    for (let i = 0; i < clouds.length; i++) {
      const cl = clouds[i];
      cl.group.position.x = cl.baseX + Math.sin(t * 0.28 + cl.phase) * 0.45;
      cl.group.position.z = cl.baseZ + Math.cos(t * 0.24 + cl.phase) * 0.35;
    }

    // 7. Banking Origami Paper Airplanes
    paperPlanes.forEach((plane, idx) => {
      const dir = idx === 0 ? 1 : -1;
      const radius = idx === 0 ? 7.6 : 9.1;
      const speed = idx === 0 ? 0.48 : 0.34;
      const a = t * speed * dir + idx * 3.1;
      const a2 = a + 0.04 * dir;
      const px = Math.cos(a) * radius;
      const pz = Math.sin(a) * radius;
      const py = (idx === 0 ? 3.25 : 4.65) + Math.sin(a * 2) * 0.42;
      const tx = Math.cos(a2) * radius;
      const tz = Math.sin(a2) * radius;
      const ty = (idx === 0 ? 3.25 : 4.65) + Math.sin(a2 * 2) * 0.42;

      plane.position.set(px, py, pz);
      plane.lookAt(tx, ty, tz);
      plane.rotateZ(-0.32 * dir);
    });
  }

  // Initialize positions for frame 0 (even when prefers-reduced-motion is enabled!)
  update(1.2);

  return {
    root,
    animated: { update },
  };
}
