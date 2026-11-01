import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  HemisphereLight,
  MathUtils,
  Mesh,
  OrthographicCamera,
  PCFSoftShadowMap,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Raycaster,
  Scene,
  ShadowMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
  type Object3D,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { SerializedProjectCard } from "~/lib/content/types";
import { buildDioramaCamp, type DioramaAnimatedHandles } from "./diorama-camp";
import { createDioramaMaterials } from "./diorama-materials";
import { buildDioramaNature } from "./diorama-nature";
import {
  buildDioramaSkyTech,
  type SkyTechAnimatedHandles,
} from "./diorama-sky-tech";
import { createStage } from "./schedule";
import {
  DIORAMA_ZONES,
  OVERVIEW_CAMERA,
  type CameraPose,
  type StudioSectionId,
} from "./world-locations";

export type DioramaSelection = {
  section: StudioSectionId;
  slug?: string;
};

export async function createWorkspaceRenderer(
  host: HTMLElement,
  projects: SerializedProjectCard[],
  callbacks: {
    onSelect: (selection: DioramaSelection) => void;
    onHover: (section: StudioSectionId | null) => void;
    onUserCameraInput?: () => void;
    onError: () => void;
  },
  signal?: AbortSignal,
) {
  const stage = createStage(signal);
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.25 : 1.5),
  );
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.96;
  // Enable shadowMap BEFORE setting castShadow / receiveShadow on lights & meshes
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;

  const canvas = renderer.domElement;
  canvas.setAttribute(
    "aria-label",
    "Interactive 3D campsite portfolio diorama. Drag to orbit, scroll to zoom, or click any landmark to inspect.",
  );
  canvas.setAttribute("role", "img");
  canvas.style.touchAction = "none";
  host.appendChild(canvas);

  // Pastel lavender-periwinkle studio backdrop matching the reference aesthetic
  const scene = new Scene();
  scene.background = new Color("#d6d3eb");

  const room = new RoomEnvironment();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.04, 0.1, 100, { size: 128 });
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.22;
  room.dispose();
  pmrem.dispose();

  const camera = new OrthographicCamera(-8, 8, 6, -6, 0.1, 90);

  // Cool lavender sky + lush meadow green ground bounce
  const hemiLight = new HemisphereLight("#e3dfff", "#7fa84f", 0.92);
  scene.add(hemiLight);

  // Soft cool periwinkle rim/fill light on shaded faces
  const fillLight = new DirectionalLight("#c0c6ff", 0.42);
  fillLight.position.set(-16, 12, 14);
  scene.add(fillLight);

  // Warm golden key sunlight casting crisp down-left shadows onto the studio floor
  const sun = new DirectionalLight("#fff0cf", 2.45);
  sun.position.set(14, 22, -18);
  sun.castShadow = true;
  const shadowRes = coarsePointer ? 1024 : 1536;
  sun.shadow.mapSize.set(shadowRes, shadowRes);
  Object.assign(sun.shadow.camera, {
    left: -13.5,
    right: 13.5,
    top: 13.5,
    bottom: -13.5,
    near: 1,
    far: 60,
  });
  sun.shadow.normalBias = 0.035;
  sun.shadow.bias = -0.0002;
  sun.shadow.radius = 3.5;
  scene.add(sun);

  // Warm campfire point light illuminating the cauldron, chairs, and tent front
  const fireLight = new PointLight("#ff8c2e", 1.5, 8.5, 1.7);
  fireLight.position.set(-0.9, 0.62, 3.3);
  scene.add(fireLight);

  // Cool lavender-tinted studio shadow plane right beneath the earth blocks
  const studioFloor = new Mesh(
    new PlaneGeometry(160, 160),
    new ShadowMaterial({ color: "#525cb3", opacity: 0.27 }),
  );
  studioFloor.rotation.x = -Math.PI / 2;
  studioFloor.position.y = -1.32;
  studioFloor.receiveShadow = true;
  studioFloor.raycast = () => {};
  scene.add(studioFloor);

  // Render initial lit studio stage immediately while assembling the diorama
  camera.position.set(22, 18, 22);
  camera.lookAt(0, 0.8, 0);
  camera.updateProjectionMatrix();
  renderer.setSize(host.clientWidth || 1, host.clientHeight || 1, false);
  renderer.render(scene, camera);

  const materials = createDioramaMaterials();
  let animated: DioramaAnimatedHandles;
  let skyTechAnimated: SkyTechAnimatedHandles;
  let interactiveRoot: Object3D;

  try {
    await stage();
    const nature = buildDioramaNature(materials);
    scene.add(nature);
    await stage();
    const camp = await buildDioramaCamp(materials, projects, stage);
    interactiveRoot = camp.root;
    animated = camp.animated;
    scene.add(camp.root);
    await stage();
    const skyTech = buildDioramaSkyTech(materials);
    skyTechAnimated = skyTech.animated;
    scene.add(skyTech.root);
    renderer.shadowMap.needsUpdate = true;
    await stage();
  } catch (error) {
    materials.textures.forEach((tex) => tex.dispose());
    environment.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    throw error;
  }

  const appRoot = host.closest<HTMLElement>(".studio-diorama-app");
  const getLabels = () =>
    Array.from(
      appRoot?.querySelectorAll<HTMLElement>("[data-world-label]") ?? [],
    );

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionQuery.matches;
  let disposed = false;
  let visible = true;
  let frame = 0;
  let lastTime = performance.now();
  let mobile = (host.clientWidth || window.innerWidth) < 768;
  let viewportWidth = Math.max(1, host.clientWidth);
  let viewportHeight = Math.max(1, host.clientHeight);

  // Camera state
  const currentTarget = new Vector3(...OVERVIEW_CAMERA.target);
  const desiredTarget = new Vector3(...OVERVIEW_CAMERA.target);
  let baseAzimuth = OVERVIEW_CAMERA.azimuth;
  let baseElevation = OVERVIEW_CAMERA.elevation;
  let baseZoom = OVERVIEW_CAMERA.zoom;

  let userYaw = 0;
  let userPitch = 0;
  let userZoom = 1;

  let currentAzimuth = baseAzimuth - 0.22; // gentle entrance sweep
  let currentElevation = baseElevation + 0.08;
  let currentZoom = baseZoom * 1.12;
  let panelOpen = false;
  let currentPanelShift = 0;
  let activeHighlight: StudioSectionId | null = null;
  let hoveredSection: StudioSectionId | null = null;

  const labelPoint = new Vector3();
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const pointerDownPos = new Vector2();
  const pointerLastPos = new Vector2();
  const activeTouches = new Map<number, Vector2>();
  let lastPinchDist = 0;
  let pointerDownActive = false;
  let dragging = false;
  let hoverDirty = false;
  let lastHoverPickAt = 0;

  function shortestAngleDelta(from: number, to: number) {
    const diff = ((to - from + Math.PI) % (Math.PI * 2)) - Math.PI;
    return diff < -Math.PI ? diff + Math.PI * 2 : diff;
  }

  function scheduleFrame() {
    if (frame || disposed || !visible || document.hidden) return;
    frame = window.requestAnimationFrame(tick);
  }

  function tick(now: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) return;

    const dt = Math.min(350, Math.max(8, now - lastTime));
    lastTime = now;
    const t = now * 0.001;

    if (hoverDirty && !dragging && now - lastHoverPickAt >= 45) {
      hoverDirty = false;
      lastHoverPickAt = now;
      const nextHover = pick(pointerLastPos.x, pointerLastPos.y)?.section ?? null;
      if (hoveredSection !== nextHover) {
        hoveredSection = nextHover;
        canvas.style.cursor = nextHover ? "pointer" : "grab";
        callbacks.onHover(nextHover);
      }
    }

    const goalAzimuth = baseAzimuth + userYaw;
    const goalElevation = MathUtils.clamp(
      baseElevation + userPitch,
      0.24,
      1.12,
    );
    const goalZoom = MathUtils.clamp(baseZoom * userZoom, 0.36, 1.85);
    const goalPanelShift = panelOpen ? 1 : 0;

    const damp = reducedMotion ? 1 : 1 - Math.exp(-dt / 155);
    currentTarget.lerp(desiredTarget, damp);
    currentAzimuth += shortestAngleDelta(currentAzimuth, goalAzimuth) * damp;
    currentElevation = MathUtils.lerp(currentElevation, goalElevation, damp);
    currentZoom = MathUtils.lerp(currentZoom, goalZoom, damp);
    currentPanelShift = MathUtils.lerp(currentPanelShift, goalPanelShift, damp);

    // Subtle hover/active lift on the 6 interactive campsite zones
    (Object.keys(animated.zoneGroups) as StudioSectionId[]).forEach((id) => {
      const group = animated.zoneGroups[id];
      const targetY =
        hoveredSection === id ? 0.14 : activeHighlight === id ? 0.1 : 0.06;
      group.position.y = reducedMotion
        ? targetY
        : MathUtils.lerp(group.position.y, targetY, 1 - Math.exp(-dt / 110));
    });

    // Ambient campfire flicker, rising cauldron steam, and drifting fireflies
    if (!reducedMotion) {
      fireLight.intensity =
        1.55 + Math.sin(t * 7.5) * 0.22 + Math.cos(t * 13.1) * 0.12;

      animated.flames.forEach((flame) => {
        const phase = flame.userData.phase as number;
        const baseScaleY = flame.userData.baseScaleY as number;
        const baseY = flame.userData.baseY as number;
        const pulse = 1 + Math.sin(t * 9.5 + phase) * 0.18;
        flame.scale.y = baseScaleY * pulse;
        flame.position.y = baseY + (pulse - 1) * 0.05;
      });

      animated.steamPuffs.forEach((puff) => {
        const phase = puff.userData.phase as number;
        const cycle = (t * 0.42 + phase) % 1;
        puff.position.y = 0.88 + cycle * 0.85;
        const s = Math.sin(cycle * Math.PI) * 0.095;
        puff.scale.set(s, s * 0.82, s);
      });

      animated.fireflies.forEach((mote) => {
        const [bx, by, bz] = mote.userData.basePos as [number, number, number];
        const phase = mote.userData.phase as number;
        mote.position.set(
          bx + Math.sin(t * 1.1 + phase) * 0.24,
          by + Math.cos(t * 1.5 + phase) * 0.16,
          bz + Math.cos(t * 0.9 + phase) * 0.24,
        );
      });

      skyTechAnimated.update(t);
    }

    const radius = 30;
    const horizRadius = Math.cos(currentElevation) * radius;
    camera.position.set(
      currentTarget.x + Math.sin(currentAzimuth) * horizRadius,
      currentTarget.y + Math.sin(currentElevation) * radius,
      currentTarget.z + Math.cos(currentAzimuth) * horizRadius,
    );
    camera.lookAt(currentTarget);

    const aspect = viewportWidth / viewportHeight;
    // Responsive framing so the whole isometric diamond + pine tips stay comfortably visible
    const baseHalfHeight =
      aspect < 1
        ? Math.max(8.15, 6.45 / Math.max(0.42, aspect))
        : Math.max(7.5, 9.4 / aspect);
    const halfHeight = baseHalfHeight * currentZoom;
    const halfWidth = halfHeight * aspect;

    // Shift frustum so the 3D diorama stays centered in the unobstructed viewport region
    const shiftX = mobile ? 0 : -halfWidth * 0.22 * currentPanelShift;
    const shiftY = mobile
      ? -halfHeight * (0.14 + 0.12 * currentPanelShift)
      : 0;

    camera.left = -halfWidth + shiftX;
    camera.right = halfWidth + shiftX;
    camera.top = halfHeight + shiftY;
    camera.bottom = -halfHeight + shiftY;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    // Project 3D zone pins into screen space with strict HUD collision avoidance
    const labels = getLabels();
    const desktopDrawerRight = 20 + Math.min(424, viewportWidth * 0.4);
    labels.forEach((label, index) => {
      const zone = DIORAMA_ZONES[index];
      if (!zone) return;
      labelPoint
        .set(zone.position[0], zone.pinHeight, zone.position[2])
        .project(camera);

      const x = Math.round((labelPoint.x * 0.5 + 0.5) * viewportWidth);
      const y = Math.round((-labelPoint.y * 0.5 + 0.5) * viewportHeight);

      const minX = mobile ? 28 : panelOpen ? desktopDrawerRight + 32 : 44;
      const maxX =
        mobile && y < 345 ? viewportWidth - 68 : viewportWidth - (mobile ? 28 : 48);
      const minY = mobile ? 132 : 88;
      const maxY = mobile
        ? panelOpen
          ? viewportHeight * 0.55 - 102
          : viewportHeight - 348
        : viewportHeight - 90;

      const inBounds =
        labelPoint.z > -1 &&
        labelPoint.z < 1 &&
        x >= minX &&
        x <= maxX &&
        y >= minY &&
        y <= maxY;

      label.style.visibility = inBounds ? "visible" : "hidden";
      if (inBounds) {
        label.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      label.dataset.active = String(activeHighlight === zone.id);
    });

    try {
      renderer.render(scene, camera);
    } catch {
      callbacks.onError();
      return;
    }

    const settling =
      currentTarget.distanceTo(desiredTarget) > 0.003 ||
      Math.abs(shortestAngleDelta(currentAzimuth, goalAzimuth)) > 0.002 ||
      Math.abs(currentElevation - goalElevation) > 0.002 ||
      Math.abs(currentZoom - goalZoom) > 0.002 ||
      Math.abs(currentPanelShift - goalPanelShift) > 0.003;

    if (!reducedMotion || settling) {
      scheduleFrame();
    }
  }

  function measure() {
    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    viewportWidth = rect.width;
    viewportHeight = rect.height;
    mobile = rect.width < 768;
    renderer.setSize(rect.width, rect.height, false);
    scheduleFrame();
  }

  function pick(clientX: number, clientY: number): DioramaSelection | null {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return null;
    pointer.set(
      ((clientX - bounds.left) / bounds.width) * 2 - 1,
      -((clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(interactiveRoot, true);
    let obj: Object3D | null = hits[0]?.object ?? null;
    let slug: string | undefined;
    while (obj) {
      if (!slug && typeof obj.userData.slug === "string") {
        slug = obj.userData.slug;
      }
      if (typeof obj.userData.section === "string") {
        return {
          section: obj.userData.section as StudioSectionId,
          slug,
        };
      }
      obj = obj.parent;
    }
    return null;
  }

  function updateHover(next: StudioSectionId | null) {
    if (hoveredSection === next) return;
    hoveredSection = next;
    canvas.style.cursor = dragging ? "grabbing" : next ? "pointer" : "grab";
    callbacks.onHover(next);
    scheduleFrame();
  }

  function onPointerDown(event: PointerEvent) {
    activeTouches.set(event.pointerId, new Vector2(event.clientX, event.clientY));
    if (activeTouches.size === 2) {
      const pts = Array.from(activeTouches.values());
      lastPinchDist = pts[0].distanceTo(pts[1]);
    }
    pointerDownPos.set(event.clientX, event.clientY);
    pointerLastPos.set(event.clientX, event.clientY);
    pointerDownActive = true;
    dragging = false;
    canvas.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent) {
    if (activeTouches.has(event.pointerId)) {
      activeTouches.set(
        event.pointerId,
        new Vector2(event.clientX, event.clientY),
      );
    }

    if (activeTouches.size === 2) {
      const pts = Array.from(activeTouches.values());
      const dist = pts[0].distanceTo(pts[1]);
      if (lastPinchDist > 0) {
        const ratio = lastPinchDist / Math.max(10, dist);
        userZoom = MathUtils.clamp(userZoom * ratio, 0.55, 1.75);
        callbacks.onUserCameraInput?.();
        scheduleFrame();
      }
      lastPinchDist = dist;
      dragging = true;
      return;
    }

    if (
      pointerDownActive &&
      Math.hypot(
        event.clientX - pointerDownPos.x,
        event.clientY - pointerDownPos.y,
      ) > 5
    ) {
      dragging = true;
      canvas.style.cursor = "grabbing";
    }

    if (pointerDownActive && dragging) {
      const dx = event.clientX - pointerLastPos.x;
      const dy = event.clientY - pointerLastPos.y;
      userYaw -= dx * 0.0065;
      userPitch = MathUtils.clamp(userPitch + dy * 0.0045, -0.26, 0.46);
      callbacks.onUserCameraInput?.();
      scheduleFrame();
    }

    pointerLastPos.set(event.clientX, event.clientY);
    if (!dragging && !coarsePointer) {
      hoverDirty = true;
      scheduleFrame();
    }
  }

  function onPointerUp(event: PointerEvent) {
    activeTouches.delete(event.pointerId);
    if (activeTouches.size < 2) lastPinchDist = 0;

    if (
      pointerDownActive &&
      !dragging &&
      Math.hypot(
        event.clientX - pointerDownPos.x,
        event.clientY - pointerDownPos.y,
      ) <= 6
    ) {
      const hit = pick(event.clientX, event.clientY);
      if (hit) callbacks.onSelect(hit);
    }

    pointerDownActive = false;
    dragging = false;
    canvas.style.cursor = hoveredSection ? "pointer" : "grab";
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  }

  function onPointerCancel(event: PointerEvent) {
    activeTouches.delete(event.pointerId);
    lastPinchDist = 0;
    pointerDownActive = false;
    dragging = false;
    updateHover(null);
  }

  function onPointerLeave() {
    if (!dragging) updateHover(null);
  }

  function onWheel(event: WheelEvent) {
    event.preventDefault();
    userZoom = MathUtils.clamp(
      userZoom * Math.exp(event.deltaY * 0.0011),
      0.52,
      1.75,
    );
    callbacks.onUserCameraInput?.();
    scheduleFrame();
  }

  function onVisibilityChange() {
    if (!document.hidden) {
      lastTime = performance.now();
      scheduleFrame();
    }
  }

  function onMotionChange() {
    reducedMotion = motionQuery.matches;
    scheduleFrame();
  }

  function onContextLost(event: Event) {
    event.preventDefault();
    callbacks.onError();
  }

  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(host);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      lastTime = performance.now();
      scheduleFrame();
    }
  });
  intersectionObserver.observe(host);

  canvas.style.cursor = "grab";
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("webglcontextlost", onContextLost);
  document.addEventListener("visibilitychange", onVisibilityChange);
  motionQuery.addEventListener("change", onMotionChange);

  measure();

  return {
    setPose(
      pose: CameraPose,
      options?: {
        panelOpen?: boolean;
        highlight?: StudioSectionId | null;
        resetUserOffsets?: boolean;
      },
    ) {
      desiredTarget.set(pose.target[0], pose.target[1], pose.target[2]);
      baseAzimuth = pose.azimuth;
      baseElevation = pose.elevation;
      baseZoom = pose.zoom;
      if (options?.panelOpen !== undefined) panelOpen = options.panelOpen;
      if (options?.highlight !== undefined) activeHighlight = options.highlight;
      if (options?.resetUserOffsets !== false) {
        userYaw = 0;
        userPitch = 0;
        userZoom = 1;
      }
      scheduleFrame();
    },
    zoom(direction: number) {
      userZoom = MathUtils.clamp(
        userZoom * (direction > 0 ? 0.82 : 1.22),
        0.52,
        1.75,
      );
      scheduleFrame();
    },
    rotate(direction: number) {
      userYaw += direction * 0.32;
      scheduleFrame();
    },
    reset() {
      userYaw = 0;
      userPitch = 0;
      userZoom = 1;
      scheduleFrame();
    },
    dispose() {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener("change", onMotionChange);

      const geometries = new Set<BufferGeometry>();
      const mats = new Set<Material>();
      scene.traverse((object) => {
        if (object instanceof Mesh) {
          geometries.add(object.geometry);
          (Array.isArray(object.material)
            ? object.material
            : [object.material]
          ).forEach((m) => mats.add(m));
          if (
            "isInstancedMesh" in object &&
            "dispose" in object &&
            typeof object.dispose === "function"
          ) {
            object.dispose();
          }
        }
      });
      geometries.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      materials.textures.forEach((t) => t.dispose());
      sun.shadow.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
