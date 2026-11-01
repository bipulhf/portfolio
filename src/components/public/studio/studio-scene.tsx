import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { BuildCancelled, whenIdle } from "./schedule";
import {
  MinusIcon,
  PlusIcon,
  RotateLeftIcon,
  RotateRightIcon,
} from "./studio-icons";
import type {
  createWorkspaceRenderer,
  DioramaSelection,
} from "./workspace-renderer";
import {
  DIORAMA_ZONES,
  type CameraPose,
  type StudioSectionId,
} from "./world-locations";
import type { SerializedProjectCard } from "~/lib/content/types";

export type StudioSceneHandle = {
  zoom: (direction: number) => void;
  rotate: (direction: number) => void;
  reset: () => void;
};

export type SceneStatus = "loading" | "ready" | "unavailable";

export function StudioScene({
  projects,
  pose,
  panelOpen,
  highlightSection,
  showPins,
  onStatusChange,
  onSelect,
  onHover,
  onUserCameraInput,
  sceneRef,
}: Readonly<{
  projects: SerializedProjectCard[];
  pose: CameraPose;
  panelOpen: boolean;
  highlightSection: StudioSectionId | null;
  showPins: boolean;
  onStatusChange: (status: SceneStatus) => void;
  onSelect: (selection: DioramaSelection) => void;
  onHover: (section: StudioSectionId | null) => void;
  onUserCameraInput?: () => void;
  sceneRef?: Ref<StudioSceneHandle>;
}>) {
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Awaited<
    ReturnType<typeof createWorkspaceRenderer>
  > | null>(null);
  const [status, setStatus] = useState<SceneStatus>("loading");

  // Keep latest callbacks in refs so the WebGL scene doesn't rebuild on UI state updates
  const callbacksRef = useRef({
    onSelect,
    onHover,
    onUserCameraInput,
    onStatusChange,
  });
  callbacksRef.current = {
    onSelect,
    onHover,
    onUserCameraInput,
    onStatusChange,
  };

  const initialPoseRef = useRef({ pose, panelOpen, highlightSection });
  initialPoseRef.current = { pose, panelOpen, highlightSection };

  useImperativeHandle(sceneRef, () => ({
    zoom: (dir) => engineRef.current?.zoom(dir),
    rotate: (dir) => engineRef.current?.rotate(dir),
    reset: () => engineRef.current?.reset(),
  }));

  useEffect(() => {
    const element = hostRef.current;
    if (!element) return;
    const controller = new AbortController();

    function updateStatus(next: SceneStatus) {
      setStatus(next);
      callbacksRef.current.onStatusChange(next);
    }

    async function start() {
      try {
        const { createWorkspaceRenderer } =
          await import("./workspace-renderer");
        if (controller.signal.aborted) return;

        const instance = await createWorkspaceRenderer(
          element!,
          projects,
          {
            onSelect: (sel) => callbacksRef.current.onSelect(sel),
            onHover: (sec) => callbacksRef.current.onHover(sec),
            onUserCameraInput: () => callbacksRef.current.onUserCameraInput?.(),
            onError: () => updateStatus("unavailable"),
          },
          controller.signal,
        );

        if (controller.signal.aborted) {
          instance.dispose();
          return;
        }

        engineRef.current = instance;
        const init = initialPoseRef.current;
        instance.setPose(init.pose, {
          panelOpen: init.panelOpen,
          highlight: init.highlightSection,
          resetUserOffsets: true,
        });
        updateStatus("ready");
      } catch (error) {
        if (error instanceof BuildCancelled || controller.signal.aborted) {
          return;
        }
        updateStatus("unavailable");
      }
    }

    const cancelIdle = whenIdle(() => void start(), 180);
    return () => {
      controller.abort();
      cancelIdle();
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [projects]);

  useEffect(() => {
    if (status === "unavailable") {
      engineRef.current?.dispose();
      engineRef.current = null;
    }
  }, [status]);

  useEffect(() => {
    if (!engineRef.current) return;
    engineRef.current.setPose(pose, {
      panelOpen,
      highlight: highlightSection,
      resetUserOffsets: true,
    });
  }, [pose, panelOpen, highlightSection]);

  return (
    <>
      <div
        className="studio-diorama-canvas"
        ref={hostRef}
        data-scene-status={status}
      />

      <div
        className="studio-world-labels"
        aria-label="Campsite destinations"
        hidden={status !== "ready" || !showPins}
      >
        {DIORAMA_ZONES.map((zone, index) => (
          <button
            key={zone.id}
            type="button"
            data-world-label={index}
            aria-label={`Inspect ${zone.title} (${zone.landmark})`}
            onClick={() => onSelect({ section: zone.id })}
          >
            <span className="studio-world-pin">{zone.code}</span>
            <span className="studio-world-label-name">{zone.title}</span>
          </button>
        ))}
      </div>

      {status === "loading" ? (
        <div className="studio-diorama-loader" role="status">
          <div className="studio-diorama-loader__badge" aria-hidden="true">
            b.
          </div>
          <p>Pitching the 3D basecamp…</p>
        </div>
      ) : null}

      {status === "ready" ? (
        <div
          className="studio-camera-dock"
          role="group"
          aria-label="3D camera controls"
        >
          <button
            type="button"
            aria-label="Rotate diorama left"
            onClick={() => engineRef.current?.rotate(-1)}
          >
            <RotateLeftIcon width={15} height={15} />
          </button>
          <button
            type="button"
            aria-label="Rotate diorama right"
            onClick={() => engineRef.current?.rotate(1)}
          >
            <RotateRightIcon width={15} height={15} />
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => engineRef.current?.zoom(1)}
          >
            <PlusIcon width={15} height={15} />
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => engineRef.current?.zoom(-1)}
          >
            <MinusIcon width={15} height={15} />
          </button>
          <button
            type="button"
            className="studio-camera-dock__reset"
            onClick={() => engineRef.current?.reset()}
          >
            Reset
          </button>
        </div>
      ) : null}
    </>
  );
}
