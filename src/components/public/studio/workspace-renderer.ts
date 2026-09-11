import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  ShadowMaterial,
  OrthographicCamera,
  PCFShadowMap,
  PlaneGeometry,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
  MathUtils,
  PMREMGenerator,
  type Material,
  type Object3D,
  type BufferGeometry,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { WORLD_LOCATIONS } from "./world-locations";
import { createScrollWorld } from "./scroll-world";
import { createStage } from "./schedule";
import type { WorkspaceDestination } from "./workspace-model";
import type { SerializedProjectCard } from "~/lib/content/types";

export type WorkspaceSelection = {
  destination: WorkspaceDestination;
  slug?: string;
  location?: number;
};

export async function createWorkspaceRenderer(
  host: HTMLElement,
  projects: SerializedProjectCard[],
  callbacks: {
    onSelect: (selection: WorkspaceSelection) => void;
    onHover: (destination: WorkspaceDestination | null) => void;
    onChapter: (index: number) => void;
    onFocus: (index: number | null) => void;
    onError: () => void;
  },
  signal?: AbortSignal,
) {
  const stage = createStage(signal);
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const renderer = new WebGLRenderer({
    antialias: !coarsePointer,
    alpha: false,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, coarsePointer ? 1 : 1.25),
  );
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  const canvas = renderer.domElement;
  canvas.setAttribute(
    "aria-label",
    "Scroll-driven 3D portfolio. Drag to look around, or use the scene rotation buttons. All destinations are also available as page links.",
  );
  canvas.setAttribute("role", "img");
  host.appendChild(canvas);

  const scene = new Scene();
  scene.background = new Color("#dce6df");
  const room = new RoomEnvironment();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.04, 0.1, 100, { size: 128 });
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.55;
  room.dispose();
  pmrem.dispose();
  const camera = new OrthographicCamera(-5, 5, 4, -4, 0.1, 60);
  scene.add(new HemisphereLight("#fff4e5", "#a0ada3", 1.6));
  const sun = new DirectionalLight("#fff0db", 2.4);
  sun.position.set(-10, 24, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(coarsePointer ? 512 : 768, coarsePointer ? 512 : 768);
  Object.assign(sun.shadow.camera, {
    left: -22,
    right: 22,
    top: 22,
    bottom: -22,
    near: 0.5,
    far: 70,
  });
  sun.shadow.normalBias = 0.045;
  sun.shadow.bias = -0.0001;
  sun.shadow.radius = 5;
  scene.add(sun);
  const floor = new Mesh(
    new PlaneGeometry(200, 200),
    new ShadowMaterial({ color: "#334b33", opacity: 0.16 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.9;
  floor.receiveShadow = true;
  scene.add(floor);

  // Show the lit, empty stage first: this compiles the base shaders and gives
  // the visitor something to look at while the island is assembled.
  camera.position.set(20, 16, 20);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
  renderer.setSize(host.clientWidth || 1, host.clientHeight || 1, false);
  renderer.render(scene, camera);

  let world: Awaited<ReturnType<typeof createScrollWorld>>;
  try {
    world = await createScrollWorld(projects, stage);
    for (const chapter of world.chapters) {
      scene.add(chapter);
      await stage();
    }
    scene.add(world.island);
    await stage();
  } catch (error) {
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    environment.dispose();
    throw error;
  }

  const cinematic = host.closest<HTMLElement>(".studio-cinematic");
  const sections = Array.from(
    cinematic?.querySelectorAll<HTMLElement>("[data-studio-chapter]") ?? [],
  );
  if (cinematic) cinematic.dataset.worldReady = "true";
  const labels = Array.from(
    cinematic?.querySelectorAll<HTMLElement>("[data-world-label]") ?? [],
  );
  const labelPoint = new Vector3();
  const labelHeights = [4.5, 4.8, 5.5, 3.7, 4.8, 4.2];
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionQuery.matches;
  let frame = 0;
  let previousFrameTime = 0;
  let visible = true;
  let disposed = false;
  let mobile = false;
  let exploring = false;
  let focusedLocation: number | null = null;
  let zoomOffset = 1;
  let viewScale = 3.2;
  let viewportWidth = 1;
  let viewportHeight = 1;
  let lastShadowScroll = -Infinity;
  const overview = new Vector3(0, 0.6, -3);
  const viewTarget = overview.clone();
  const desiredTarget = overview.clone();
  const focusPoints = WORLD_LOCATIONS.map(
    (location) => new Vector3(location.position[0], 1, location.position[2]),
  );
  let hovered: WorkspaceDestination | null = null;
  let previousChapter = -1;
  let anchors: number[] = [];
  let captionSizes: { width: number; height: number }[] = [];
  let targetScroll = window.scrollY;
  let scroll = targetScroll;
  let yaw = 0;
  let pitch = 0;
  let interactive = window.matchMedia("(pointer: fine)").matches;
  canvas.style.touchAction = interactive ? "none" : "pan-y";
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const down = new Vector2();
  const last = new Vector2();
  let dragging = false;
  let pointerActive = false;
  let lastFilmProgress = Number.NaN;
  let lastCaptionKey = "";
  const lastLabelTransforms = labels.map(() => "");
  const lastLabelVisibility = labels.map(() => "");
  const lastLabelActive = labels.map(() => "");

  function requestRender() {
    if (frame || disposed || !visible || document.hidden) return;
    frame = window.requestAnimationFrame(render);
  }

  function progressAt(value: number) {
    if (anchors.length < 2) return 0;
    let index = 0;
    while (index < anchors.length - 1 && value >= anchors[index + 1]) index++;
    const span =
      (anchors[index + 1] ?? anchors[index] + window.innerHeight) -
      anchors[index];
    const local = MathUtils.clamp((value - anchors[index]) / span, 0, 1);
    // Hold each composition while its content is read, then travel to the next.
    return Math.min(5, index + MathUtils.smoothstep(local, 0.38, 1));
  }

  function render(time: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const elapsed = Math.min(250, Math.max(16, time - previousFrameTime));
    previousFrameTime = time;
    scroll = reducedMotion
      ? targetScroll
      : MathUtils.lerp(scroll, targetScroll, 1 - Math.exp(-elapsed / 90));
    if (Math.abs(scroll - targetScroll) < 0.5) scroll = targetScroll;
    const progress = progressAt(scroll);
    const displayProgress = reducedMotion ? Math.round(progress) : progress;
    const active = Math.round(progress);
    if (active !== previousChapter && !exploring) {
      if (previousChapter >= 0) {
        const previous = sections[previousChapter];
        if (previous) {
          previous.dataset.active = "false";
          previous.inert = true;
        }
      }
      const current = sections[active];
      if (current) {
        current.dataset.active = "true";
        current.inert = false;
      }
      previousChapter = active;
      callbacks.onChapter(active);
    } else if (previousChapter < 0) {
      sections.forEach((section, index) => {
        section.dataset.active = String(index === active);
        section.inert = index !== active;
      });
      previousChapter = active;
      callbacks.onChapter(active);
    }
    const from = Math.floor(displayProgress);
    const to = Math.min(from + 1, WORLD_LOCATIONS.length - 1);
    const blend = displayProgress - from;
    if (exploring)
      desiredTarget.copy(
        focusedLocation === null ? overview : focusPoints[focusedLocation],
      );
    else
      desiredTarget
        .copy(from === 0 ? overview : focusPoints[from])
        .lerp(focusPoints[to], blend);
    const desiredScale = exploring
      ? (focusedLocation === null ? 3.2 : 1.15) * zoomOffset
      : MathUtils.lerp(from === 0 ? 3.2 : 1.15, 1.15, blend);
    const alpha = reducedMotion ? 1 : 1 - Math.exp(-elapsed / 140);
    viewTarget.lerp(desiredTarget, alpha);
    viewScale = MathUtils.lerp(viewScale, desiredScale, alpha);
    if (viewTarget.distanceTo(desiredTarget) < 0.005)
      viewTarget.copy(desiredTarget);
    if (Math.abs(viewScale - desiredScale) < 0.002) viewScale = desiredScale;

    // The buildings stay in place. Scroll changes the viewpoint, not the world.
    world.chapters.forEach((chapter) => {
      chapter.visible = true;
    });
    const drift = reducedMotion ? 0 : scroll * 0.00025;
    world.knot.rotation.set(
      reducedMotion ? 0.3 : drift * 0.65,
      reducedMotion ? 0.2 : drift * 0.45,
      0.1,
    );
    const noteProgress = reducedMotion
      ? 0
      : MathUtils.clamp(progress - 3.6, 0, 1.1);
    world.noteCover.rotation.z = 0.06 + noteProgress * 0.92;
    const angle =
      0.6 +
      yaw +
      (reducedMotion || exploring ? 0 : Math.sin(progress * 1.2) * 0.18);
    const elevation = MathUtils.clamp(
      (exploring && focusedLocation === null ? 0.75 : 0.58) + pitch,
      0.25,
      1.2,
    );
    camera.position.set(
      viewTarget.x + Math.sin(angle) * 28,
      viewTarget.y + Math.sin(elevation) * 28,
      viewTarget.z + Math.cos(angle) * 28,
    );
    camera.lookAt(viewTarget);
    const aspect = viewportWidth / viewportHeight;
    const halfHeight =
      Math.max(4.05, (mobile ? 4.1 : 5.2) / aspect) * viewScale;
    const horizontalShift = mobile
      ? 0
      : -halfHeight * aspect * (exploring ? 0.24 : 0.08);
    const verticalShift = mobile ? halfHeight * (exploring ? 0.2 : -0.16) : 0;
    camera.left = -halfHeight * aspect + horizontalShift;
    camera.right = halfHeight * aspect + horizontalShift;
    camera.top = halfHeight + verticalShift;
    camera.bottom = -halfHeight + verticalShift;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    labels.forEach((label, index) => {
      const position = WORLD_LOCATIONS[index].position;
      labelPoint
        .set(position[0], labelHeights[index], position[2])
        .project(camera);
      const x = Math.round((labelPoint.x * 0.5 + 0.5) * viewportWidth);
      const y = Math.round((-labelPoint.y * 0.5 + 0.5) * viewportHeight);
      // Keep pins clear of the reading column, navigation, and camera controls.
      const leftEdge = mobile ? 28 : exploring ? 375 : 80;
      const topEdge = mobile ? (exploring ? viewportHeight * 0.53 : 95) : 105;
      const bottomEdge = mobile
        ? viewportHeight * (exploring ? 0.82 : 0.43)
        : viewportHeight - 100;
      const shown =
        labelPoint.z > -1 &&
        labelPoint.z < 1 &&
        x > leftEdge &&
        x < viewportWidth - 70 &&
        y > topEdge &&
        y < bottomEdge;
      const visibility = shown ? "visible" : "hidden";
      const transform = `translate3d(${x}px, ${y}px, 0)`;
      const activeState = String(
        exploring ? focusedLocation === index : active === index,
      );
      if (lastLabelVisibility[index] !== visibility) {
        label.style.visibility = visibility;
        lastLabelVisibility[index] = visibility;
      }
      if (shown && lastLabelTransforms[index] !== transform) {
        label.style.transform = transform;
        lastLabelTransforms[index] = transform;
      }
      if (lastLabelActive[index] !== activeState) {
        label.dataset.active = activeState;
        lastLabelActive[index] = activeState;
      }
    });
    if (
      scroll !== lastShadowScroll &&
      (Math.abs(scroll - lastShadowScroll) > 80 || scroll === targetScroll)
    ) {
      renderer.shadowMap.needsUpdate = true;
      lastShadowScroll = scroll;
    }
    const filmProgress = String(
      MathUtils.clamp(scroll / Math.max(1, anchors[5] ?? 1), 0, 1),
    );
    if (cinematic && lastFilmProgress !== Number(filmProgress)) {
      cinematic.style.setProperty("--film-progress", filmProgress);
      lastFilmProgress = Number(filmProgress);
    }
    if (!exploring) {
      const position = WORLD_LOCATIONS[active].position;
      labelPoint.set(position[0], 0.4, position[2]).project(camera);
      const anchorX = (labelPoint.x * 0.5 + 0.5) * viewportWidth;
      const anchorY = (-labelPoint.y * 0.5 + 0.5) * viewportHeight;
      const cardWidth =
        captionSizes[active]?.width ?? (mobile ? viewportWidth - 40 : 336);
      const cardHeight = captionSizes[active]?.height ?? 270;
      const x = mobile
        ? 20
        : MathUtils.clamp(
            anchorX - cardWidth - 85,
            40,
            viewportWidth - cardWidth - 60,
          );
      const y = mobile
        ? Math.max(160, viewportHeight - cardHeight - 155)
        : MathUtils.clamp(
            anchorY + 30,
            125,
            Math.max(125, viewportHeight - cardHeight - 100),
          );
      const dx = anchorX - x - cardWidth;
      const dy = anchorY - y;
      const captionKey = `${active}:${Math.round(x)}:${Math.round(y)}:${Math.round(Math.hypot(dx, dy))}`;
      if (captionKey !== lastCaptionKey) {
        const section = sections[active];
        if (section) {
          section.style.setProperty("--caption-x", `${x}px`);
          section.style.setProperty("--caption-y", `${y}px`);
          section.style.setProperty("--tether-length", `${Math.hypot(dx, dy)}px`);
          section.style.setProperty("--tether-angle", `${Math.atan2(dy, dx)}rad`);
        }
        lastCaptionKey = captionKey;
      }
    }
    try {
      renderer.render(scene, camera);
    } catch {
      callbacks.onError();
      return;
    }
    if (
      scroll !== targetScroll ||
      !viewTarget.equals(desiredTarget) ||
      viewScale !== desiredScale
    )
      requestRender();
  }

  function measure() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    mobile = width < 768;
    viewportWidth = width;
    viewportHeight = height;
    renderer.setSize(width, height, false);
    captionSizes = sections.map((section) => {
      const rect = section
        .querySelector<HTMLElement>(".studio-chapter-copy")!
        .getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
    anchors = sections.map(
      (section) =>
        section.getBoundingClientRect().top +
        window.scrollY -
        (mobile ? 0 : window.innerHeight * 0.05),
    );
    requestRender();
  }

  function pick(event: PointerEvent): WorkspaceSelection | null {
    const bounds = canvas.getBoundingClientRect();
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(
      [...world.chapters, world.island],
      true,
    );
    let object: Object3D | null = hits[0]?.object ?? null;
    let selection: WorkspaceSelection | null = null;
    while (object) {
      if (!selection && object.userData.destination)
        selection = {
          destination: object.userData.destination,
          slug: object.userData.slug,
        };
      if (selection && typeof object.userData.worldLocation === "number") {
        selection.location = object.userData.worldLocation;
        return selection;
      }
      object = object.parent;
    }
    return selection;
  }

  function setHover(destination: WorkspaceDestination | null) {
    if (hovered === destination) return;
    hovered = destination;
    canvas.style.cursor = destination
      ? "pointer"
      : interactive
        ? "grab"
        : "auto";
    callbacks.onHover(destination);
  }
  function pointerDown(event: PointerEvent) {
    down.set(event.clientX, event.clientY);
    last.copy(down);
    dragging = false;
    pointerActive = true;
    if (interactive) canvas.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: PointerEvent) {
    if (
      pointerActive &&
      Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6
    )
      dragging = true;
    if (pointerActive && interactive && dragging) {
      yaw = MathUtils.clamp(yaw + (event.clientX - last.x) * 0.004, -1, 1);
      pitch = MathUtils.clamp(
        pitch + (event.clientY - last.y) * 0.003,
        -0.15,
        0.5,
      );
      requestRender();
    }
    last.set(event.clientX, event.clientY);
    setHover(dragging ? null : (pick(event)?.destination ?? null));
  }
  function pointerUp(event: PointerEvent) {
    if (
      pointerActive &&
      !dragging &&
      Math.hypot(event.clientX - down.x, event.clientY - down.y) < 6
    ) {
      const selection = pick(event);
      if (selection) {
        if (
          exploring &&
          selection.location !== undefined &&
          !(focusedLocation === selection.location && selection.slug)
        ) {
          focusedLocation = selection.location;
          zoomOffset = 1;
          callbacks.onFocus(focusedLocation);
          requestRender();
        } else callbacks.onSelect(selection);
      }
    }
    pointerActive = false;
    dragging = false;
    if (canvas.hasPointerCapture(event.pointerId))
      canvas.releasePointerCapture(event.pointerId);
  }
  function pointerCancel() {
    pointerActive = false;
    dragging = false;
    setHover(null);
  }
  function pointerLeave() {
    setHover(null);
  }
  function onWheel(event: WheelEvent) {
    if (!exploring) return;
    event.preventDefault();
    zoomOffset = MathUtils.clamp(
      zoomOffset * Math.exp(event.deltaY * 0.001),
      0.6,
      2.2,
    );
    requestRender();
  }
  function onScroll() {
    targetScroll = window.scrollY;
    requestRender();
  }
  function visibilityChange() {
    if (!document.hidden) {
      scroll = targetScroll = window.scrollY;
      requestRender();
    }
  }
  function motionChange() {
    reducedMotion = motionQuery.matches;
    sections.forEach((section) =>
      section.style.removeProperty("--chapter-shift"),
    );
    requestRender();
  }
  function contextLost(event: Event) {
    event.preventDefault();
    callbacks.onError();
  }

  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(host);
  sections.forEach((section) => {
    const caption = section.querySelector(".studio-chapter-copy");
    if (caption) resizeObserver.observe(caption);
  });
  if (cinematic) resizeObserver.observe(cinematic);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      targetScroll = window.scrollY;
      requestRender();
    }
  });
  if (cinematic) intersection.observe(cinematic);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerup", pointerUp);
  canvas.addEventListener("pointercancel", pointerCancel);
  canvas.addEventListener("pointerleave", pointerLeave);
  canvas.addEventListener("webglcontextlost", contextLost);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", visibilityChange);
  motionQuery.addEventListener("change", motionChange);
  measure();

  return {
    setExploring(value: boolean) {
      exploring = value;
      focusedLocation = null;
      zoomOffset = 1;
      interactive = value || window.matchMedia("(pointer: fine)").matches;
      canvas.style.touchAction = interactive ? "none" : "pan-y";
      callbacks.onFocus(null);
      requestRender();
    },
    focus(index: number | null) {
      focusedLocation = index;
      zoomOffset = 1;
      callbacks.onFocus(index);
      requestRender();
    },
    zoom(direction: number) {
      zoomOffset = MathUtils.clamp(
        zoomOffset * (direction > 0 ? 0.8 : 1.25),
        0.6,
        2.2,
      );
      requestRender();
    },
    reset() {
      yaw = 0;
      pitch = 0;
      requestRender();
    },
    rotate(direction: number) {
      yaw += direction * 0.2;
      requestRender();
    },
    setInteractive(value: boolean) {
      interactive = value;
      canvas.style.touchAction = value ? "none" : "pan-y";
    },
    dispose() {
      disposed = true;
      if (cinematic) delete cinematic.dataset.worldReady;
      sections.forEach((section) => {
        section.inert = false;
      });
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerCancel);
      canvas.removeEventListener("pointerleave", pointerLeave);
      canvas.removeEventListener("webglcontextlost", contextLost);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", visibilityChange);
      motionQuery.removeEventListener("change", motionChange);
      const geometries = new Set<BufferGeometry>();
      const materials = new Set<Material>();
      scene.traverse((object) => {
        if (object instanceof Mesh) {
          geometries.add(object.geometry);
          (Array.isArray(object.material)
            ? object.material
            : [object.material]
          ).forEach((material) => materials.add(material));
          if (
            "isInstancedMesh" in object &&
            "dispose" in object &&
            typeof object.dispose === "function"
          )
            object.dispose();
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      world.textures.forEach((texture) => texture.dispose());
      sun.shadow.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
