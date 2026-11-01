import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ACHIEVEMENT_ITEMS,
  CONTACT_LINKS,
  EDUCATION_ITEMS,
  EXPERIENCE_ITEMS,
  SKILL_CATEGORIES,
} from "~/components/portfolio/lib/content";
import type {
  SerializedBlogCard,
  SerializedProjectCard,
} from "~/lib/content/types";
import {
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CompassIcon,
  PauseIcon,
  PlayIcon,
  ReplayIcon,
  VolumeOffIcon,
  VolumeOnIcon,
} from "./studio-icons";
import { StudioAudioDirector } from "./studio-audio";
import {
  StudioScene,
  type SceneStatus,
  type StudioSceneHandle,
} from "./studio-scene";
import type { DioramaSelection } from "./workspace-renderer";
import {
  DIORAMA_ZONES,
  OVERVIEW_CAMERA,
  TOUR_STOPS,
  type StudioSectionId,
} from "./world-locations";
import "~/styles/studio-cinematic.css";
import "~/styles/studio-world.css";

const SECTION_IDS: ReadonlyArray<StudioSectionId> = [
  "about",
  "projects",
  "skills",
  "achievements",
  "blog",
  "contact",
];

function isStudioSection(value: string): value is StudioSectionId {
  return SECTION_IDS.includes(value as StudioSectionId);
}

export default function StudioHome({
  blogs,
  projects,
}: Readonly<{
  blogs: SerializedBlogCard[];
  projects: SerializedProjectCard[];
}>) {
  const featuredProjects = useMemo(() => {
    const featured = projects.filter((p) => p.featured);
    return (featured.length ? featured : projects).slice(0, 4);
  }, [projects]);

  const sceneRef = useRef<StudioSceneHandle>(null);
  const audioRef = useRef<StudioAudioDirector | null>(null);
  const prevStopKeyRef = useRef<string>("");

  const [sceneStatus, setSceneStatus] = useState<SceneStatus>("loading");
  const [mode, setMode] = useState<"tour" | "explore">("tour");
  const [tourIndex, setTourIndex] = useState(0);
  const [tourPlaying, setTourPlaying] = useState(true);
  const [tourProgress, setTourProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<StudioSectionId | null>(
    null,
  );
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] =
    useState<StudioSectionId | null>(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [audioSpeaking, setAudioSpeaking] = useState(false);

  // Initialize generative campsite soundtrack + voiceover director
  useEffect(() => {
    const director = new StudioAudioDirector({
      onStateChange: (next) => {
        setAudioMuted(next.muted);
        setAudioBlocked(next.blocked);
        setAudioSpeaking(next.speaking);
      },
    });
    audioRef.current = director;
    void director.unlockAndStart();

    return () => {
      director.dispose();
      audioRef.current = null;
    };
  }, []);

  // Sync audio director mix mode (tour vs explore)
  useEffect(() => {
    audioRef.current?.setMode(mode);
    if (mode !== "tour") {
      prevStopKeyRef.current = "";
    }
  }, [mode]);

  // Trigger voiceover narration & harmonic transition shimmer for each tour stop
  useEffect(() => {
    const director = audioRef.current;
    if (!director || sceneStatus !== "ready" || mode !== "tour") return;

    const stop = TOUR_STOPS[tourIndex];
    if (!stop) return;

    if (audioMuted) {
      director.stopNarration();
      prevStopKeyRef.current = "";
      return;
    }

    const stopKey = `${tourIndex}:${stop.id}`;
    if (tourPlaying) {
      if (prevStopKeyRef.current !== stopKey) {
        prevStopKeyRef.current = stopKey;
        if (tourIndex > 0) {
          director.playTransitionSwell(tourIndex);
        }
        void director.playNarration(stop.audioSrc, stop.narration);
      } else {
        void director.resumeNarration().then((resumed) => {
          if (!resumed) {
            void director.playNarration(stop.audioSrc, stop.narration);
          }
        });
      }
    } else {
      director.pauseNarration();
    }
  }, [sceneStatus, mode, tourIndex, tourPlaying, audioMuted]);

  // Unlock audio automatically on first tap/keypress if browser blocked un-interacted reload
  useEffect(() => {
    if (!audioBlocked || audioMuted) return;

    function handleFirstGesture() {
      const director = audioRef.current;
      if (!director) return;
      void director.unlockAndStart().then((ok) => {
        if (ok && mode === "tour" && tourPlaying) {
          const stop = TOUR_STOPS[tourIndex];
          if (stop) {
            prevStopKeyRef.current = `${tourIndex}:${stop.id}`;
            void director.playNarration(stop.audioSrc, stop.narration);
          }
        }
      });
    }

    window.addEventListener("pointerdown", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
  }, [audioBlocked, audioMuted, mode, tourPlaying, tourIndex]);

  const toggleSound = useCallback(() => {
    const director = audioRef.current;
    if (!director) return;

    if (audioBlocked && !audioMuted) {
      void director.unlockAndStart().then((ok) => {
        if (ok && mode === "tour" && tourPlaying) {
          const stop = TOUR_STOPS[tourIndex];
          if (stop) {
            prevStopKeyRef.current = `${tourIndex}:${stop.id}`;
            void director.playNarration(stop.audioSrc, stop.narration);
          }
        }
      });
      return;
    }

    const nextMuted = !audioMuted;
    director.setMuted(nextMuted);
    if (!nextMuted && mode === "tour" && tourPlaying) {
      const stop = TOUR_STOPS[tourIndex];
      if (stop) {
        prevStopKeyRef.current = `${tourIndex}:${stop.id}`;
        void director.playNarration(stop.audioSrc, stop.narration);
      }
    }
  }, [audioBlocked, audioMuted, mode, tourPlaying, tourIndex]);

  // Respect direct hash deep links (e.g. /#about from subpage nav)
  useEffect(() => {
    const rawHash = window.location.hash.replace(/^#/, "").trim();
    if (isStudioSection(rawHash)) {
      setMode("explore");
      setTourPlaying(false);
      setActiveSection(rawHash);
    }
  }, []);

  // Graceful fallback if WebGL is unavailable on device
  useEffect(() => {
    if (sceneStatus === "unavailable") {
      setMode("explore");
      setTourPlaying(false);
      setActiveSection((prev) => prev ?? "about");
    }
  }, [sceneStatus]);

  const finishTour = useCallback(() => {
    setMode("explore");
    setTourPlaying(false);
    setTourProgress(0);
    setActiveSection(null);
    setSelectedSlug(null);
  }, []);

  const replayTour = useCallback(() => {
    setActiveSection(null);
    setSelectedSlug(null);
    setTourIndex(0);
    setTourProgress(0);
    setTourPlaying(true);
    setMode("tour");
  }, []);

  // Automatic 3D tour progression timer (synced to voiceover narration when sound is active)
  useEffect(() => {
    if (mode !== "tour" || !tourPlaying || sceneStatus !== "ready") return;

    const stop = TOUR_STOPS[tourIndex];
    const soundActive = !audioMuted && !audioBlocked;
    const baseDuration = soundActive
      ? (stop?.narrationDurationMs ?? 12500)
      : (stop?.durationMs ?? 4500);

    let rafId = 0;
    let previous = performance.now();
    let accumulated = tourProgress * baseDuration;

    function step(now: number) {
      const delta = document.hidden ? 0 : Math.max(0, now - previous);
      previous = now;
      accumulated += delta;

      let effectiveDuration = baseDuration;
      let elapsed = accumulated;

      if (soundActive && stop) {
        const clip = audioRef.current?.getNarrationProgress();
        if (clip && clip.src?.endsWith(stop.audioSrc)) {
          effectiveDuration = (clip.duration + 0.85) * 1000;
          elapsed = Math.max(accumulated, clip.currentTime * 1000);
        }
      }

      const ratio = Math.min(1, elapsed / effectiveDuration);
      setTourProgress(ratio);

      if (ratio >= 1) {
        if (tourIndex < TOUR_STOPS.length - 1) {
          setTourIndex((idx) => idx + 1);
          setTourProgress(0);
        } else {
          finishTour();
        }
        return;
      }
      rafId = window.requestAnimationFrame(step);
    }

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [
    mode,
    tourPlaying,
    tourIndex,
    sceneStatus,
    audioMuted,
    audioBlocked,
    finishTour,
  ]);

  // Keyboard navigation for tour & inspector drawer
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (mode === "tour") {
          finishTour();
        } else if (activeSection !== null) {
          setActiveSection(null);
          setSelectedSlug(null);
        }
      } else if (mode === "tour" && event.key === "ArrowRight") {
        if (tourIndex < TOUR_STOPS.length - 1) {
          setTourIndex((i) => i + 1);
          setTourProgress(0);
        } else {
          finishTour();
        }
      } else if (mode === "tour" && event.key === "ArrowLeft") {
        setTourIndex((i) => Math.max(0, i - 1));
        setTourProgress(0);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode, tourIndex, activeSection, finishTour]);

  const handleSceneSelect = useCallback((selection: DioramaSelection) => {
    audioRef.current?.playSelectChime();
    setMode("explore");
    setTourPlaying(false);
    setActiveSection(selection.section);
    setSelectedSlug(selection.slug ?? null);
  }, []);

  const handleUserCameraInput = useCallback(() => {
    if (mode === "tour" && tourPlaying) {
      setTourPlaying(false);
    }
  }, [mode, tourPlaying]);

  const openSection = useCallback((section: StudioSectionId | null) => {
    audioRef.current?.playSelectChime();
    setMode("explore");
    setTourPlaying(false);
    setActiveSection(section);
    setSelectedSlug(null);
  }, []);

  const activeZone = useMemo(
    () => DIORAMA_ZONES.find((z) => z.id === activeSection) ?? null,
    [activeSection],
  );

  const hoveredZone = useMemo(
    () => DIORAMA_ZONES.find((z) => z.id === hoveredSection) ?? null,
    [hoveredSection],
  );

  const currentTourStop = TOUR_STOPS[tourIndex] ?? TOUR_STOPS[0];

  const activePose = useMemo(() => {
    if (mode === "tour") return currentTourStop.camera;
    if (activeZone) return activeZone.camera;
    return OVERVIEW_CAMERA;
  }, [mode, currentTourStop, activeZone]);

  const highlightSection =
    mode === "tour" ? currentTourStop.highlightSection : activeSection;

  function stepSection(delta: -1 | 1) {
    if (!activeSection) {
      openSection(SECTION_IDS[0]);
      return;
    }
    const idx = SECTION_IDS.indexOf(activeSection);
    const nextIdx = (idx + delta + SECTION_IDS.length) % SECTION_IDS.length;
    openSection(SECTION_IDS[nextIdx]);
  }

  return (
    <div
      className="studio-diorama-app"
      data-studio-mode={mode}
      data-has-panel={String(mode === "explore" && activeSection !== null)}
    >
      <StudioScene
        sceneRef={sceneRef}
        projects={featuredProjects}
        pose={activePose}
        panelOpen={mode === "explore" && activeSection !== null}
        highlightSection={highlightSection}
        showPins={mode === "explore"}
        onStatusChange={setSceneStatus}
        onSelect={handleSceneSelect}
        onHover={setHoveredSection}
        onUserCameraInput={handleUserCameraInput}
      />

      {/* Top Floating Single-Page Bar */}
      <header className="studio-hud-topbar">
        <button
          type="button"
          className="studio-hud-brand"
          onClick={() => openSection(null)}
          aria-label="Bipul Basecamp Overview"
        >
          <span className="studio-hud-brand__mark" aria-hidden="true">
            b.
          </span>
          <span className="studio-hud-brand__text">
            <strong>Bipul</strong>
            <small>Software Engineer · Dhaka</small>
          </span>
        </button>

        <nav
          className="studio-hud-tabs"
          aria-label="3D portfolio sections"
        >
          <button
            type="button"
            className={`studio-hud-tab${mode === "explore" && activeSection === null ? " is-active" : ""}`}
            aria-pressed={mode === "explore" && activeSection === null}
            onClick={() => openSection(null)}
          >
            <CompassIcon width={14} height={14} />
            <span>Camp</span>
          </button>
          {DIORAMA_ZONES.map((zone) => {
            const isSelected = mode === "explore" && activeSection === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                className={`studio-hud-tab${isSelected ? " is-active" : ""}`}
                aria-pressed={isSelected}
                onClick={() => openSection(zone.id)}
              >
                <span>{zone.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="studio-hud-actions">
          <button
            type="button"
            className={`studio-hud-sound${!audioMuted && !audioBlocked ? " is-live" : ""}${audioBlocked && !audioMuted ? " is-blocked" : ""}`}
            onClick={toggleSound}
            aria-pressed={!audioMuted && !audioBlocked}
            aria-label={
              audioMuted
                ? "Unmute campsite music and narration"
                : audioBlocked
                  ? "Enable campsite music and narration"
                  : "Mute campsite music and narration"
            }
            title={
              audioMuted
                ? "Unmute music & narration"
                : audioBlocked
                  ? "Tap to enable music & narration"
                  : "Sound & narration on"
            }
          >
            {audioMuted || audioBlocked ? (
              <VolumeOffIcon width={15} height={15} />
            ) : (
              <VolumeOnIcon width={15} height={15} />
            )}
            <span className="studio-eq-bars" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>

          {mode === "tour" ? (
            <button
              type="button"
              className="studio-hud-pill"
              onClick={finishTour}
            >
              <span>Skip tour</span>
              <ChevronRightIcon width={14} height={14} />
            </button>
          ) : (
            <button
              type="button"
              className="studio-hud-pill"
              onClick={replayTour}
            >
              <ReplayIcon width={14} height={14} />
              <span>Tour</span>
            </button>
          )}
          <a
            className="studio-hud-cta"
            href={CONTACT_LINKS[0].href}
          >
            <span>Say hello</span>
            <ArrowUpRightIcon width={14} height={14} />
          </a>
        </div>
      </header>

      {/* Hover Landmark Tooltip */}
      {hoveredZone ? (
        <div className="studio-hover-chip" role="status" aria-live="polite">
          <span className="studio-hover-chip__code">{hoveredZone.code}</span>
          <span>
            Inspect <strong>{hoveredZone.landmark}</strong> · {hoveredZone.title}
          </span>
        </div>
      ) : null}

      {/* MODE 1: Automatic Guided 3D Tour Narrator Card */}
      {mode === "tour" ? (
        <section
          className="studio-tour-card"
          aria-label="Automatic 3D portfolio tour"
          aria-live="polite"
        >
          <div className="studio-tour-card__progress" aria-hidden="true">
            <span
              style={{
                transform: `scaleX(${((tourIndex + tourProgress) / TOUR_STOPS.length).toFixed(4)})`,
              }}
            />
          </div>

          <div className="studio-tour-card__meta">
            <div className="studio-tour-card__badges">
              <span className="studio-badge-pill">
                Guided Tour · {currentTourStop.step} / 0{TOUR_STOPS.length}
              </span>
              {audioBlocked && !audioMuted ? (
                <button
                  type="button"
                  className="studio-voice-chip is-prompt"
                  onClick={toggleSound}
                >
                  <VolumeOnIcon width={12} height={12} />
                  <span>Tap for sound</span>
                </button>
              ) : !audioMuted ? (
                <span
                  className={`studio-voice-chip${audioSpeaking ? " is-speaking" : ""}`}
                >
                  <VolumeOnIcon width={12} height={12} />
                  <span>{audioSpeaking ? "Voice & Music" : "Camp Music"}</span>
                </span>
              ) : null}
            </div>
            <div className="studio-tour-dots" role="tablist" aria-label="Tour stops">
              {TOUR_STOPS.map((stop, idx) => (
                <button
                  key={stop.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === tourIndex}
                  aria-label={`Tour stop ${idx + 1}: ${stop.eyebrow}`}
                  className={idx === tourIndex ? "is-active" : ""}
                  onClick={() => {
                    setTourIndex(idx);
                    setTourProgress(0);
                  }}
                />
              ))}
            </div>
          </div>

          <p className="studio-card-eyebrow">{currentTourStop.eyebrow}</p>
          <h1 className="studio-tour-card__title">{currentTourStop.headline}</h1>
          <p className="studio-tour-card__copy">{currentTourStop.description}</p>

          {currentTourStop.id === "selected-work" && featuredProjects.length ? (
            <div className="studio-tour-projects">
              {featuredProjects.slice(0, 3).map((proj) => (
                <button
                  key={proj.id}
                  type="button"
                  className="studio-mini-chip"
                  onClick={() =>
                    handleSceneSelect({ section: "projects", slug: proj.slug })
                  }
                >
                  <span>{proj.title}</span>
                  <ArrowUpRightIcon width={12} height={12} />
                </button>
              ))}
            </div>
          ) : null}

          <div className="studio-tour-card__controls">
            <div className="studio-tour-playback">
              <button
                type="button"
                aria-label="Previous tour stop"
                disabled={tourIndex === 0}
                onClick={() => {
                  setTourIndex((i) => Math.max(0, i - 1));
                  setTourProgress(0);
                }}
              >
                <ChevronLeftIcon width={16} height={16} />
              </button>
              <button
                type="button"
                aria-label={tourPlaying ? "Pause automatic tour" : "Resume automatic tour"}
                onClick={() => setTourPlaying((p) => !p)}
              >
                {tourPlaying ? (
                  <PauseIcon width={15} height={15} />
                ) : (
                  <PlayIcon width={15} height={15} />
                )}
              </button>
              <button
                type="button"
                aria-label="Next tour stop"
                onClick={() => {
                  if (tourIndex < TOUR_STOPS.length - 1) {
                    setTourIndex((i) => i + 1);
                    setTourProgress(0);
                  } else {
                    finishTour();
                  }
                }}
              >
                <ChevronRightIcon width={16} height={16} />
              </button>
            </div>

            <button
              type="button"
              className="studio-primary-btn"
              onClick={finishTour}
            >
              <span>
                {tourIndex === TOUR_STOPS.length - 1
                  ? "Enter 3D Camp"
                  : "Skip to 3D View"}
              </span>
              <ArrowUpRightIcon width={15} height={15} />
            </button>
          </div>
        </section>
      ) : null}

      {/* MODE 2A: Single-Page 3D Overview Welcome Dock (after tour finishes) */}
      {mode === "explore" && activeSection === null ? (
        <aside
          className="studio-overview-dock"
          aria-label="Interactive 3D camp overview"
        >
          <div className="studio-overview-dock__head">
            <span className="studio-badge-pill">Single-Page 3D Camp</span>
            <span className="studio-overview-dock__hint">
              Drag to orbit · Scroll to zoom
            </span>
          </div>
          <h1>Bipul’s Basecamp.</h1>
          <p>
            Click any camp landmark, numbered pin, or quick chip below to
            explore my projects, experience, skills, and notes.
          </p>
          <div className="studio-overview-chips">
            <button
              type="button"
              className="studio-chip-btn is-accent"
              onClick={() => openSection("projects")}
            >
              <span>Projects ({projects.length})</span>
              <ArrowUpRightIcon width={13} height={13} />
            </button>
            <button
              type="button"
              className="studio-chip-btn"
              onClick={() => openSection("about")}
            >
              <span>About Me</span>
            </button>
            <button
              type="button"
              className="studio-chip-btn"
              onClick={() => openSection("skills")}
            >
              <span>Skills</span>
            </button>
            <button
              type="button"
              className="studio-chip-btn"
              onClick={() => openSection("achievements")}
            >
              <span>6 Wins</span>
            </button>
            <button
              type="button"
              className="studio-chip-btn"
              onClick={() => openSection("blog")}
            >
              <span>Notes</span>
            </button>
            <button
              type="button"
              className="studio-chip-btn"
              onClick={() => openSection("contact")}
            >
              <span>Contact</span>
            </button>
          </div>
        </aside>
      ) : null}

      {/* MODE 2B: Single-Page 3D Section Inspector Drawer */}
      {mode === "explore" && activeZone ? (
        <aside
          className="studio-inspector"
          aria-label={`${activeZone.title} details`}
        >
          <div className="studio-inspector__bar">
            <span className="studio-badge-pill">
              {activeZone.code} · {activeZone.landmark}
            </span>
            <div className="studio-inspector__nav">
              <button
                type="button"
                aria-label="Previous section"
                onClick={() => stepSection(-1)}
              >
                <ChevronLeftIcon width={16} height={16} />
              </button>
              <button
                type="button"
                aria-label="Next section"
                onClick={() => stepSection(1)}
              >
                <ChevronRightIcon width={16} height={16} />
              </button>
              <button
                type="button"
                aria-label="Return to full 3D camp overview"
                onClick={() => openSection(null)}
              >
                <CloseIcon width={16} height={16} />
              </button>
            </div>
          </div>

          <div className="studio-inspector__body">
            {activeSection === "about" ? (
              <>
                <h2>Hello, I’m Bipul.</h2>
                <p className="studio-inspector__lead">
                  Software engineer in Dhaka, Bangladesh crafting calm,
                  dependable web software across frontend interfaces and backend
                  systems.
                </p>

                <div className="studio-section-block">
                  <h3>Experience</h3>
                  <div className="studio-timeline">
                    {EXPERIENCE_ITEMS.map((item) => (
                      <div className="studio-timeline__item" key={item.role + item.place}>
                        <div className="studio-timeline__head">
                          <strong>{item.role}</strong>
                          <span>{item.when}</span>
                        </div>
                        <p className="studio-timeline__place">{item.place}</p>
                        <ul>
                          {item.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="studio-section-block">
                  <h3>Education</h3>
                  {EDUCATION_ITEMS.map((edu) => (
                    <div className="studio-timeline__item" key={edu.role}>
                      <div className="studio-timeline__head">
                        <strong>{edu.role}</strong>
                        <span>{edu.when}</span>
                      </div>
                      <p className="studio-timeline__place">{edu.place}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            {activeSection === "projects" ? (
              <>
                <div className="studio-inspector__title-row">
                  <h2>Selected Work</h2>
                  <Link className="studio-inline-link" to="/projects">
                    <span>All projects</span>
                    <ArrowUpRightIcon width={13} height={13} />
                  </Link>
                </div>
                <p className="studio-inspector__lead">
                  Products, engineering case studies, and full-stack builds.
                </p>

                {projects.length ? (
                  <div className="studio-drawer-cards">
                    {projects.map((project, idx) => {
                      const highlighted = selectedSlug === project.slug;
                      return (
                        <article
                          key={project.id}
                          className={`studio-drawer-card${highlighted ? " is-highlighted" : ""}`}
                        >
                          <div className="studio-drawer-card__top">
                            <span className="studio-drawer-card__num">
                              0{idx + 1}
                            </span>
                            <div className="studio-tag-row">
                              {project.techStack.slice(0, 3).map((tag) => (
                                <span key={tag}>{tag}</span>
                              ))}
                            </div>
                          </div>
                          <h3>
                            <Link
                              to="/projects/$slug"
                              params={{ slug: project.slug }}
                            >
                              {project.title}
                            </Link>
                          </h3>
                          <p>{project.summary}</p>
                          <div className="studio-drawer-card__actions">
                            <Link
                              className="studio-inline-link"
                              to="/projects/$slug"
                              params={{ slug: project.slug }}
                            >
                              <span>Case study</span>
                              <ArrowUpRightIcon width={13} height={13} />
                            </Link>
                            {project.liveUrl ? (
                              <a
                                className="studio-inline-link"
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <span>Live</span>
                                <ArrowUpRightIcon width={13} height={13} />
                              </a>
                            ) : null}
                            {project.repoUrl ? (
                              <a
                                className="studio-inline-link"
                                href={project.repoUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <span>Code</span>
                                <ArrowUpRightIcon width={13} height={13} />
                              </a>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p className="studio-empty-note">
                    New project case studies are being prepared.
                  </p>
                )}
              </>
            ) : null}

            {activeSection === "skills" ? (
              <>
                <h2>Skills & Stack</h2>
                <p className="studio-inspector__lead">
                  Tools I rely on to take ideas from blank editor to reliable
                  production software.
                </p>
                <div className="studio-skill-groups">
                  {SKILL_CATEGORIES.map((category) => (
                    <div className="studio-skill-group" key={category.title}>
                      <h3>{category.title}</h3>
                      <div className="studio-skill-pills">
                        {category.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            {activeSection === "achievements" ? (
              <>
                <h2>Hackathon Wins</h2>
                <p className="studio-inspector__lead">
                  Fast execution, great teammates, and software shipped live
                  under pressure.
                </p>
                <div className="studio-drawer-cards">
                  {ACHIEVEMENT_ITEMS.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="studio-drawer-card studio-win-card"
                    >
                      <div className="studio-win-card__badge">{item.icon}</div>
                      <div className="studio-win-card__content">
                        <div className="studio-win-card__head">
                          <h3>{item.title}</h3>
                          <ArrowUpRightIcon width={14} height={14} />
                        </div>
                        <small>{item.meta}</small>
                        <p>{item.summary}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            ) : null}

            {activeSection === "blog" ? (
              <>
                <div className="studio-inspector__title-row">
                  <h2>Field Notes</h2>
                  <Link className="studio-inline-link" to="/blog">
                    <span>All notes</span>
                    <ArrowUpRightIcon width={13} height={13} />
                  </Link>
                </div>
                <p className="studio-inspector__lead">
                  Writing on product engineering, frontend clarity, and lessons
                  from shipping.
                </p>

                {blogs.length ? (
                  <div className="studio-drawer-cards">
                    {blogs.map((post) => (
                      <Link
                        key={post.id}
                        to="/blog/$slug"
                        params={{ slug: post.slug }}
                        className="studio-drawer-card"
                      >
                        <div className="studio-drawer-card__top">
                          <span className="studio-drawer-card__num">
                            {post.readingTimeMinutes} min read
                          </span>
                        </div>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                        <span className="studio-inline-link">
                          <span>Read note</span>
                          <ArrowUpRightIcon width={13} height={13} />
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="studio-drawer-card">
                    <h3>The notebook is open.</h3>
                    <p>
                      First engineering field notes are taking shape — check
                      back soon or explore my shipped projects in the meantime.
                    </p>
                    <div className="studio-drawer-card__actions">
                      <button
                        type="button"
                        className="studio-inline-link"
                        onClick={() => openSection("projects")}
                      >
                        <span>Explore projects</span>
                        <ArrowUpRightIcon width={13} height={13} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : null}

            {activeSection === "contact" ? (
              <>
                <h2>Say Hello.</h2>
                <p className="studio-inspector__lead">
                  Have a product, engineering role, or idea worth building
                  carefully? Let’s talk.
                </p>

                <a
                  className="studio-primary-btn studio-contact-cta"
                  href={CONTACT_LINKS[0].href}
                >
                  <span>bipulhf@gmail.com</span>
                  <ArrowUpRightIcon width={15} height={15} />
                </a>

                <div className="studio-social-grid">
                  {CONTACT_LINKS.slice(1).map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="studio-social-card"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRightIcon width={14} height={14} />
                    </a>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </aside>
      ) : null}
    </div>
  );
}
