import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { createWorkspaceRenderer } from "./workspace-renderer";
import { BuildCancelled, whenIdle } from "./schedule";
import type { WorkspaceDestination } from "./workspace-model";
import { WORLD_LOCATIONS } from "./world-locations";
import type { SerializedProjectCard } from "~/lib/content/types";

const chapters = WORLD_LOCATIONS;

export function StudioScene({
  projects,
}: Readonly<{ projects: SerializedProjectCard[] }>) {
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<Awaited<
    ReturnType<typeof createWorkspaceRenderer>
  > | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">(
    "loading",
  );
  const [hovered, setHovered] = useState<WorkspaceDestination | null>(null);
  const [chapter, setChapter] = useState(0);
  const [touchRotate, setTouchRotate] = useState(false);
  const [exploring, setExploring] = useState(false);
  const [focusedLocation, setFocusedLocation] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const controller = new AbortController();
    async function start() {
      try {
        const { createWorkspaceRenderer } =
          await import("./workspace-renderer");
        if (controller.signal.aborted) return;
        engine.current = await createWorkspaceRenderer(
          element!,
          projects,
          {
            onSelect: ({ destination, slug }) => {
              setExploring(false);
              engine.current?.setExploring(false);
              if (destination === "projects" && slug)
                void navigate({ to: "/projects/$slug", params: { slug } });
              else if (destination === "projects" || destination === "blog")
                void navigate({ to: `/${destination}` });
              else void navigate({ to: "/", hash: destination });
            },
            onHover: setHovered,
            onChapter: setChapter,
            onFocus: setFocusedLocation,
            onError: () => setStatus("unavailable"),
          },
          controller.signal,
        );
        setStatus("ready");
      } catch (error) {
        if (error instanceof BuildCancelled || controller.signal.aborted)
          return;
        setStatus("unavailable");
      }
    }
    // Let hydration and the first paint finish before the island is built.
    const cancelIdle = whenIdle(() => void start());
    return () => {
      controller.abort();
      cancelIdle();
      engine.current?.dispose();
      engine.current = null;
    };
  }, [navigate, projects]);

  useEffect(() => {
    if (status === "unavailable") {
      engine.current?.dispose();
      engine.current = null;
      setExploring(false);
    }
  }, [status]);

  useEffect(() => {
    const root = host.current?.closest<HTMLElement>(".studio-cinematic");
    const main = root?.querySelector("main");
    const previousOverflow = document.body.style.overflow;
    if (root) root.dataset.worldMode = exploring ? "explore" : "story";
    if (main) main.inert = exploring;
    if (exploring) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      if (main) main.inert = false;
    };
  }, [exploring]);

  function toggleExploration() {
    engine.current?.setExploring(!exploring);
    setExploring(!exploring);
    setTouchRotate(false);
  }

  const location =
    focusedLocation === null ? null : WORLD_LOCATIONS[focusedLocation];

  return (
    <>
      <div className="studio-world" ref={host} data-scene-status={status} />
      <div
        className="studio-world-labels"
        aria-label="Island destinations"
        hidden={status !== "ready"}
      >
        {chapters.map((place, index) => (
          <button
            key={place.id}
            type="button"
            data-world-label={index}
            aria-label={`Visit ${place.title}`}
            onClick={() => {
              engine.current?.setExploring(true);
              engine.current?.focus(index);
              setExploring(true);
              setTouchRotate(false);
            }}
          >
            <span className="studio-world-pin">0{index + 1}</span>
            <span className="studio-world-label-name">
              {place.title}
              <span aria-hidden="true"> ↗</span>
            </span>
          </button>
        ))}
      </div>
      {status !== "ready" ? (
        <div className="studio-world-fallback" role="status">
          <span aria-hidden="true">b.</span>
          <p>
            {status === "loading"
              ? "Building the island…"
              : "The 3D scene is unavailable here. Scroll to explore the portfolio."}
          </p>
        </div>
      ) : null}
      {exploring ? (
        <aside className="studio-world-map" aria-label="Explore the island">
          <p className="studio-eyebrow">
            Bipul's island /{" "}
            {location ? `0${focusedLocation! + 1}` : "A place for ideas"}
          </p>
          <h2>{location?.title ?? "The island."}</h2>
          <p>
            {location?.description ?? "Choose a stop. Drag to look around."}
          </p>
          {location ? (
            <div className="studio-world-map-actions">
              <button type="button" onClick={() => engine.current?.focus(null)}>
                ← Island view
              </button>
              <button
                className="studio-button"
                type="button"
                onClick={() => {
                  setExploring(false);
                  engine.current?.setExploring(false);
                  if (
                    location.destination === "projects" ||
                    location.destination === "blog"
                  )
                    void navigate({ to: `/${location.destination}` });
                  else void navigate({ to: "/", hash: location.id });
                }}
              >
                {location.destination === "projects"
                  ? "See the projects"
                  : location.destination === "blog"
                    ? "Read the notes"
                    : "Visit this section"}{" "}
                ↗
              </button>
            </div>
          ) : (
            <div className="studio-world-destinations">
              {chapters.map((place, index) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => engine.current?.focus(index)}
                >
                  <span>0{index + 1}</span>
                  {place.title}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          )}
        </aside>
      ) : null}
      <nav className="studio-chapter-nav" aria-label="Portfolio chapters">
        {chapters.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-label={item.title}
            aria-current={chapter === index ? "step" : undefined}
          >
            <span>0{index + 1}</span>
            <i aria-hidden="true" />
            <span>{item.title}</span>
          </a>
        ))}
      </nav>
      <div className="studio-world-caption">
        <span>0{chapter + 1} / 06</span>
        <span aria-live="polite">
          {hovered ? `Explore ${hovered} ↗` : chapters[chapter].title}
        </span>
      </div>
      <div
        className={`studio-world-controls${exploring ? " is-exploring" : ""}`}
        aria-label="3D camera controls"
      >
        <button
          className="studio-explore-button"
          disabled={status !== "ready"}
          type="button"
          aria-pressed={exploring}
          onClick={toggleExploration}
        >
          {exploring ? "Return to story" : "Explore the island"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
        {exploring ? (
          <>
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => engine.current?.zoom(1)}
            >
              +
            </button>
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => engine.current?.zoom(-1)}
            >
              −
            </button>
          </>
        ) : null}
        <button
          disabled={status !== "ready"}
          type="button"
          aria-label="Rotate scene left"
          onClick={() => engine.current?.rotate(-1)}
        >
          ←
        </button>
        <button
          disabled={status !== "ready"}
          type="button"
          aria-label="Rotate scene right"
          onClick={() => engine.current?.rotate(1)}
        >
          →
        </button>
        <button
          disabled={status !== "ready"}
          type="button"
          onClick={() => engine.current?.reset()}
        >
          Reset
        </button>
        <button
          disabled={status !== "ready"}
          className="studio-touch-rotate"
          type="button"
          aria-pressed={touchRotate}
          onClick={() => {
            engine.current?.setInteractive(!touchRotate);
            setTouchRotate(!touchRotate);
          }}
        >
          {touchRotate ? "Done" : "Rotate"}
        </button>
      </div>
    </>
  );
}
