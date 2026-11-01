// Studio 3D Audio Director (Singleton):
// ElevenLabs Studio campfire soundtrack, organic hearth/forest ambience,
// ElevenLabs Multilingual v2 voiceover narration with smooth sidechain ducking,
// and tactile Web Audio chimes. Uses strictly one HTMLAudioElement per channel
// (music, ambience, narration) so overlapping/duplicate playback is impossible.

export type AudioDirectorSnapshot = {
  muted: boolean;
  blocked: boolean;
  speaking: boolean;
};

export type AudioStateListener = (state: AudioDirectorSnapshot) => void;

export type DesiredTourNarration = {
  active: boolean;
  playing: boolean;
  stopIndex: number;
  stopKey: string;
  audioSrc: string;
  fallbackText: string;
};

const CAMP_MUSIC_SRC = "/audio/tour/camp-music.mp3";
const CAMP_AMBIENCE_SRC = "/audio/tour/camp-ambience.mp3";

// Valid 46-byte 16-bit mono 8kHz digital-zero PCM WAV used exclusively to bless
// the persistent narration HTMLAudioElement synchronously inside a user gesture.
const SILENT_BLESS_WAV =
  "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQIAAAAAAA==";

const SELECT_CHIME_NOTES = [65, 69, 72, 76, 79, 81];

const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

const DIRECTOR_GLOBAL_KEY = "__STUDIO_AUDIO_DIRECTOR__";

export class StudioAudioDirector {
  private musicEl: HTMLAudioElement | null = null;
  private ambienceEl: HTMLAudioElement | null = null;
  private narrationEl: HTMLAudioElement | null = null;

  private activeNarrationSrc: string | null = null;
  private currentStopKey = "";
  private narrationReqId = 0;
  private narrationPrimed = false;
  private narrationPaused = false;
  private narrationEnded = false;
  private usingSpeechFallback = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private desiredNarration: DesiredTourNarration | null = null;

  // Lightweight Web Audio context for tactile 3D landmark chimes & transition sparkles
  private ctx: AudioContext | null = null;
  private chimeGain: GainNode | null = null;
  private chimeIdx = 0;

  private fadeTimer = 0;
  private detachTimer = 0;
  private primeOrphanTimer = 0;
  private unlockCommitTimer = 0;
  private unlockResetTimer = 0;

  private currentMusicVol = 0;
  private currentAmbienceVol = 0;

  private listeners = new Set<AudioStateListener>();
  private attached = false;
  private muted = false;
  private blocked = false;
  private speaking = false;
  private backgroundStarted = false;
  private unlockListenersBound = false;
  private unlockInProgress = false;
  private mode: "tour" | "explore" = "tour";
  private destroyed = false;

  constructor() {
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.onGestureStart = this.onGestureStart.bind(this);
    this.onGesturePointerUp = this.onGesturePointerUp.bind(this);
    this.onGestureCommit = this.onGestureCommit.bind(this);

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this.onVisibilityChange);
    }
  }

  getSnapshot(): AudioDirectorSnapshot {
    return {
      muted: this.muted,
      blocked: this.blocked,
      speaking: this.speaking,
    };
  }

  private emitState() {
    if (this.destroyed) return;
    const snap = this.getSnapshot();
    this.listeners.forEach((fn) => {
      try {
        fn(snap);
      } catch {
        // ignore listener errors
      }
    });
  }

  /**
   * Subscribe StudioHome to the singleton director.
   * Uses a short grace timer on detach so React StrictMode double-mounts
   * and fast route transitions never abort or double-start playback.
   */
  attach(listener: AudioStateListener): () => void {
    if (this.detachTimer) {
      window.clearTimeout(this.detachTimer);
      this.detachTimer = 0;
    }
    if (this.primeOrphanTimer) {
      window.clearTimeout(this.primeOrphanTimer);
      this.primeOrphanTimer = 0;
    }

    this.listeners.add(listener);
    this.attached = true;
    this.ensureBackgroundElements();
    this.ensureFadeLoop();

    listener(this.getSnapshot());
    void this.tryStartBackground();

    if (this.blocked && !this.muted) {
      this.attachUnlockListeners();
    }

    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0 && typeof window !== "undefined") {
        if (this.detachTimer) window.clearTimeout(this.detachTimer);
        this.detachTimer = window.setTimeout(() => {
          this.detachTimer = 0;
          if (this.listeners.size === 0) {
            this.suspendSession();
          }
        }, 90);
      }
    };
  }

  private suspendSession() {
    this.attached = false;
    this.desiredNarration = null;
    this.currentStopKey = "";
    this.stopNarration();
    this.detachUnlockListeners();

    if (this.musicEl) {
      this.musicEl.volume = 0;
      this.musicEl.pause();
    }
    if (this.ambienceEl) {
      this.ambienceEl.volume = 0;
      this.ambienceEl.pause();
    }
    this.currentMusicVol = 0;
    this.currentAmbienceVol = 0;
    this.backgroundStarted = false;

    if (this.fadeTimer) {
      window.clearInterval(this.fadeTimer);
      this.fadeTimer = 0;
    }
  }

  /**
   * Called synchronously inside a direct user click (e.g. clicking "Studio 3D")
   * BEFORE lazy chunks / Three.js finish loading, so browsers grant full audio
   * playback permission across Chrome, Safari, Firefox, and mobile.
   */
  primeFromUserGesture() {
    if (this.destroyed || this.muted || typeof window === "undefined") return;
    if (window.location.pathname !== "/") return;

    this.ensureBackgroundElements();
    this.ensureFadeLoop();

    const ctx = this.ensureChimeGraph();
    if (ctx && ctx.state === "suspended") {
      void ctx.resume().catch(() => {});
    }

    if (this.musicEl && this.musicEl.paused) {
      void this.musicEl
        .play()
        .then(() => {
          this.backgroundStarted = true;
          this.blocked = false;
          this.emitState();
        })
        .catch(() => {});
    }

    if (this.ambienceEl && this.ambienceEl.paused) {
      void this.ambienceEl.play().catch(() => {});
    }

    this.blessNarrationElement();

    this.blocked = false;
    this.detachUnlockListeners();
    this.emitState();

    // Safety cleanup if StudioHome never mounts within 5s
    if (!this.attached) {
      if (this.primeOrphanTimer) window.clearTimeout(this.primeOrphanTimer);
      this.primeOrphanTimer = window.setTimeout(() => {
        this.primeOrphanTimer = 0;
        if (!this.attached) {
          this.suspendSession();
        }
      }, 5000);
    }
  }

  private blessNarrationElement() {
    if (
      this.narrationPrimed ||
      this.speaking ||
      this.activeNarrationSrc !== null ||
      typeof window === "undefined"
    ) {
      return;
    }
    const el = this.ensureNarrationElement();
    const reqSnapshot = this.narrationReqId;
    try {
      el.muted = true;
      el.src = SILENT_BLESS_WAV;
      const p = el.play();
      if (p !== undefined) {
        p.then(() => {
          this.narrationPrimed = true;
          if (this.narrationReqId === reqSnapshot && !this.activeNarrationSrc) {
            el.pause();
            el.muted = false;
          }
        }).catch(() => {
          if (this.narrationReqId === reqSnapshot) {
            el.muted = false;
          }
        });
      }
    } catch {
      el.muted = false;
    }
  }

  private ensureBackgroundElements() {
    if (this.destroyed || typeof window === "undefined") return;

    if (!this.musicEl) {
      const music = new Audio(CAMP_MUSIC_SRC);
      music.loop = true;
      music.preload = "auto";
      music.volume = 0;
      this.musicEl = music;
    }

    if (!this.ambienceEl) {
      const amb = new Audio(CAMP_AMBIENCE_SRC);
      amb.loop = true;
      amb.preload = "auto";
      amb.volume = 0;
      this.ambienceEl = amb;
    }
  }

  private ensureNarrationElement(): HTMLAudioElement {
    if (!this.narrationEl) {
      const el = new Audio();
      el.preload = "auto";
      el.loop = false;
      el.volume = 0.98;
      this.narrationEl = el;
    }
    return this.narrationEl;
  }

  private ensureFadeLoop() {
    if (this.destroyed || typeof window === "undefined" || this.fadeTimer) {
      return;
    }
    this.fadeTimer = window.setInterval(() => this.stepMixFades(), 45);
  }

  private ensureChimeGraph(): AudioContext | null {
    if (this.destroyed || typeof window === "undefined") return null;
    if (this.ctx) return this.ctx;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;

    const ctx = new AudioCtx();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.connect(ctx.destination);
    this.ctx = ctx;
    this.chimeGain = gain;
    return ctx;
  }

  private getTargetVolumes() {
    if (
      !this.attached ||
      this.muted ||
      this.blocked ||
      (typeof document !== "undefined" && document.hidden)
    ) {
      return { music: 0, ambience: 0 };
    }
    // Smooth sidechain ducking so ElevenLabs voiceover sits crystal-clear in the center
    const music = this.speaking
      ? 0.16
      : this.mode === "tour"
        ? 0.46
        : 0.34;
    const ambience = this.speaking ? 0.14 : 0.25;
    return { music, ambience };
  }

  private stepMixFades() {
    if (this.destroyed) return;
    const targets = this.getTargetVolumes();

    const musicRate = targets.music < this.currentMusicVol ? 0.24 : 0.1;
    this.currentMusicVol += (targets.music - this.currentMusicVol) * musicRate;
    if (Math.abs(targets.music - this.currentMusicVol) < 0.004) {
      this.currentMusicVol = targets.music;
    }

    this.currentAmbienceVol +=
      (targets.ambience - this.currentAmbienceVol) * 0.14;
    if (Math.abs(targets.ambience - this.currentAmbienceVol) < 0.004) {
      this.currentAmbienceVol = targets.ambience;
    }

    if (this.musicEl) {
      this.musicEl.volume = Math.max(0, Math.min(1, this.currentMusicVol));
    }
    if (this.ambienceEl) {
      this.ambienceEl.volume = Math.max(0, Math.min(1, this.currentAmbienceVol));
    }
  }

  private async tryStartBackground(): Promise<boolean> {
    if (
      this.destroyed ||
      !this.attached ||
      this.muted ||
      typeof window === "undefined"
    ) {
      return false;
    }
    this.ensureBackgroundElements();
    this.ensureFadeLoop();

    const ctx = this.ensureChimeGraph();
    if (ctx && ctx.state === "suspended") {
      void ctx.resume().catch(() => {});
    }

    try {
      const plays: Promise<unknown>[] = [];
      if (this.musicEl && this.musicEl.paused) {
        plays.push(this.musicEl.play());
      }
      if (this.ambienceEl && this.ambienceEl.paused) {
        plays.push(this.ambienceEl.play());
      }
      if (plays.length) {
        await Promise.all(plays);
      }
      if (!this.attached || this.muted) {
        this.musicEl?.pause();
        this.ambienceEl?.pause();
        return false;
      }
      this.backgroundStarted = true;
      if (this.blocked) {
        this.blocked = false;
        this.detachUnlockListeners();
        this.emitState();
      }
      return true;
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "AbortError") {
        return false;
      }
      if (name === "NotAllowedError") {
        if (!this.blocked) {
          this.blocked = true;
          this.attachUnlockListeners();
          this.emitState();
        }
        return false;
      }
      return true;
    }
  }

  private attachUnlockListeners() {
    if (this.unlockListenersBound || typeof window === "undefined") return;
    this.unlockListenersBound = true;

    window.addEventListener("pointerdown", this.onGestureStart, {
      capture: true,
      passive: true,
    });
    window.addEventListener("touchstart", this.onGestureStart, {
      capture: true,
      passive: true,
    });
    window.addEventListener("keydown", this.onGestureStart, {
      capture: true,
      passive: true,
    });
    window.addEventListener("pointerup", this.onGesturePointerUp, false);
    window.addEventListener("touchend", this.onGesturePointerUp, false);
    window.addEventListener("click", this.onGestureCommit, false);
    window.addEventListener("keyup", this.onGestureCommit, false);
  }

  private detachUnlockListeners() {
    if (!this.unlockListenersBound || typeof window === "undefined") return;
    this.unlockListenersBound = false;

    window.removeEventListener("pointerdown", this.onGestureStart, true);
    window.removeEventListener("touchstart", this.onGestureStart, true);
    window.removeEventListener("keydown", this.onGestureStart, true);
    window.removeEventListener("pointerup", this.onGesturePointerUp, false);
    window.removeEventListener("touchend", this.onGesturePointerUp, false);
    window.removeEventListener("click", this.onGestureCommit, false);
    window.removeEventListener("keyup", this.onGestureCommit, false);

    if (this.unlockCommitTimer) {
      window.clearTimeout(this.unlockCommitTimer);
      this.unlockCommitTimer = 0;
    }
  }

  private onGestureStart() {
    if (!this.attached || this.muted || !this.blocked) return;

    this.unlockInProgress = true;
    if (this.unlockResetTimer) window.clearTimeout(this.unlockResetTimer);
    this.unlockResetTimer = window.setTimeout(() => {
      this.unlockResetTimer = 0;
      this.unlockInProgress = false;
    }, 600);

    // Synchronously unlock Web Audio + background tracks + bless narration element
    const ctx = this.ensureChimeGraph();
    if (ctx && ctx.state === "suspended") {
      void ctx.resume().catch(() => {});
    }
    this.ensureBackgroundElements();
    if (this.musicEl && this.musicEl.paused) {
      void this.musicEl.play().catch(() => {});
    }
    if (this.ambienceEl && this.ambienceEl.paused) {
      void this.ambienceEl.play().catch(() => {});
    }
    this.blessNarrationElement();
  }

  private onGesturePointerUp() {
    if (!this.attached || this.muted || !this.blocked) return;
    // Fallback commit if pointerup doesn't produce a click event (e.g. canvas drag)
    if (this.unlockCommitTimer) window.clearTimeout(this.unlockCommitTimer);
    this.unlockCommitTimer = window.setTimeout(() => {
      this.unlockCommitTimer = 0;
      this.commitUnlock();
    }, 32);
  }

  private onGestureCommit() {
    if (!this.attached || this.muted) return;
    if (this.blocked || this.unlockInProgress) {
      this.commitUnlock();
    }
  }

  private commitUnlock() {
    if (this.unlockCommitTimer) {
      window.clearTimeout(this.unlockCommitTimer);
      this.unlockCommitTimer = 0;
    }
    if (this.unlockResetTimer) {
      window.clearTimeout(this.unlockResetTimer);
      this.unlockResetTimer = 0;
    }

    const wasBlocked = this.blocked || this.unlockInProgress;
    this.blocked = false;
    this.unlockInProgress = false;
    this.detachUnlockListeners();

    if (!this.attached || this.muted) {
      this.emitState();
      return;
    }

    void this.tryStartBackground();
    if (wasBlocked) {
      this.applyDesiredNarration();
    }
    this.emitState();
  }

  setMode(mode: "tour" | "explore") {
    this.mode = mode;
    if (mode === "explore") {
      if (this.desiredNarration) {
        this.desiredNarration = { ...this.desiredNarration, active: false };
      }
      this.currentStopKey = "";
      this.stopNarration();
    }
  }

  /**
   * UI handler for both the top-bar Sound button and the "Tap for sound" chip.
   * Prevents the pointerdown-unlock -> click-mute race so tapping when blocked
   * always enables audio cleanly once.
   */
  toggleMuteFromUI() {
    if (this.blocked || this.unlockInProgress) {
      this.muted = false;
      this.commitUnlock();
      return;
    }
    this.setMuted(!this.muted);
  }

  setMuted(nextMuted: boolean) {
    if (this.muted === nextMuted) return;
    this.muted = nextMuted;

    if (nextMuted) {
      this.unlockInProgress = false;
      this.currentStopKey = "";
      this.stopNarration();
      this.detachUnlockListeners();
      if (this.musicEl) this.musicEl.volume = 0;
      if (this.ambienceEl) this.ambienceEl.volume = 0;
      this.currentMusicVol = 0;
      this.currentAmbienceVol = 0;
    } else {
      this.blocked = false;
      void this.tryStartBackground();
      this.applyDesiredNarration();
    }
    this.emitState();
  }

  /**
   * Declarative, idempotent tour narration synchronizer.
   * Safe to call repeatedly across React StrictMode double-effects and state updates:
   * a given stopKey will only start once unless explicitly reset by stop change, replay, or unmute.
   */
  syncTourNarration(next: DesiredTourNarration) {
    this.desiredNarration = next;
    this.applyDesiredNarration();
  }

  private applyDesiredNarration() {
    const target = this.desiredNarration;
    if (!target || !target.active || !this.attached || this.muted) {
      this.currentStopKey = "";
      this.stopNarration();
      return;
    }

    if (this.blocked) {
      this.attachUnlockListeners();
      return;
    }

    if (!target.playing) {
      this.pauseNarration();
      return;
    }

    // New tour stop -> play transition chime (after stop 01) and start clip once
    if (this.currentStopKey !== target.stopKey) {
      this.currentStopKey = target.stopKey;
      if (target.stopIndex > 0) {
        this.playTransitionSwell(target.stopIndex);
      }
      this.startClip(target.audioSrc, target.fallbackText);
      return;
    }

    // Same tour stop -> only resume if user previously paused the tour
    if (this.narrationPaused) {
      this.resumePausedNarration();
    }
  }

  private startClip(audioSrc: string, fallbackText: string) {
    const reqId = ++this.narrationReqId;
    this.cancelSpeechFallback();
    this.narrationPaused = false;
    this.narrationEnded = false;
    this.usingSpeechFallback = false;

    if (!this.attached || this.muted || typeof window === "undefined") {
      return;
    }

    void this.tryStartBackground();

    const el = this.ensureNarrationElement();
    el.muted = false;
    el.volume = 0.98;

    el.onended = () => {
      if (this.narrationReqId !== reqId) return;
      this.speaking = false;
      this.narrationEnded = true;
      this.emitState();
    };

    el.onerror = () => {
      if (this.narrationReqId !== reqId) return;
      if (
        this.activeNarrationSrc === audioSrc &&
        !this.blocked &&
        !this.muted &&
        this.attached
      ) {
        this.activeNarrationSrc = null;
        this.playSpeechFallback(fallbackText, reqId);
      }
    };

    try {
      if (!el.paused) {
        el.pause();
      }
      if (this.activeNarrationSrc !== audioSrc) {
        this.activeNarrationSrc = audioSrc;
        el.src = audioSrc;
        el.load();
      } else {
        el.currentTime = 0;
      }

      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.narrationPrimed = true;
            if (this.narrationReqId !== reqId) return;
            if (!this.attached || this.muted || this.narrationPaused) {
              el.pause();
              return;
            }
            this.blocked = false;
            this.speaking = true;
            this.detachUnlockListeners();
            this.emitState();
          })
          .catch((err: unknown) => {
            if (this.narrationReqId !== reqId) return;
            const name = err instanceof DOMException ? err.name : "";
            if (name === "AbortError") {
              return;
            }
            if (name === "NotAllowedError") {
              // Browser blocked un-interacted autoplay: reset state so the very first
              // click/tap/keypress blesses the element and plays this stop from 0:00.
              this.narrationPrimed = false;
              this.activeNarrationSrc = null;
              this.currentStopKey = "";
              this.blocked = true;
              this.speaking = false;
              this.attachUnlockListeners();
              this.emitState();
              return;
            }
            this.playSpeechFallback(fallbackText, reqId);
          });
      }
    } catch {
      if (this.narrationReqId !== reqId) return;
      this.currentStopKey = "";
      this.blocked = true;
      this.speaking = false;
      this.attachUnlockListeners();
      this.emitState();
    }
  }

  private playSpeechFallback(text: string, reqId: number) {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      this.muted ||
      !this.attached ||
      this.destroyed
    ) {
      return;
    }
    try {
      if (this.narrationEl && !this.narrationEl.paused) {
        this.narrationEl.pause();
      }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.0;
      utter.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            /Natural|Neural|Google|Premium|Samantha|Daniel|Alex/i.test(v.name),
        ) ?? voices.find((v) => v.lang.startsWith("en"));
      if (preferred) utter.voice = preferred;

      utter.onend = () => {
        if (this.narrationReqId !== reqId || this.activeUtterance !== utter) {
          return;
        }
        this.speaking = false;
        this.narrationEnded = true;
        this.emitState();
      };
      utter.onerror = () => {
        if (this.narrationReqId !== reqId || this.activeUtterance !== utter) {
          return;
        }
        this.speaking = false;
        this.emitState();
      };

      this.usingSpeechFallback = true;
      this.activeUtterance = utter;
      this.speaking = true;
      this.emitState();
      window.speechSynthesis.speak(utter);
    } catch {
      // ignore speech synthesis errors
    }
  }

  private cancelSpeechFallback() {
    this.usingSpeechFallback = false;
    if (this.activeUtterance) {
      this.activeUtterance = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }
      } catch {
        // ignore
      }
    }
  }

  private pauseNarration() {
    if (this.narrationPaused) return;
    this.narrationPaused = true;

    if (this.narrationEl && !this.narrationEl.paused) {
      this.narrationEl.pause();
    }
    if (
      this.activeUtterance &&
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      try {
        window.speechSynthesis.pause();
      } catch {
        // ignore
      }
    }
    if (this.speaking) {
      this.speaking = false;
      this.emitState();
    }
  }

  private resumePausedNarration() {
    if (!this.narrationPaused || this.muted || !this.attached) return;
    this.narrationPaused = false;
    const reqId = this.narrationReqId;

    void this.tryStartBackground();

    if (
      this.narrationEl &&
      this.activeNarrationSrc &&
      this.narrationEl.paused &&
      !this.narrationEnded &&
      !this.narrationEl.ended
    ) {
      void this.narrationEl
        .play()
        .then(() => {
          if (this.narrationReqId !== reqId || this.narrationPaused) return;
          this.speaking = true;
          this.blocked = false;
          this.emitState();
        })
        .catch(() => {});
      return;
    }

    if (
      this.activeUtterance &&
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      try {
        window.speechSynthesis.resume();
        this.speaking = true;
        this.emitState();
      } catch {
        // ignore
      }
    }
  }

  stopNarration() {
    ++this.narrationReqId;
    this.narrationPaused = false;
    this.narrationEnded = false;
    this.cancelSpeechFallback();

    if (this.narrationEl) {
      this.narrationEl.onended = null;
      this.narrationEl.onerror = null;
      try {
        if (!this.narrationEl.paused) {
          this.narrationEl.pause();
        }
        if (this.activeNarrationSrc) {
          this.narrationEl.currentTime = 0;
        }
      } catch {
        // ignore
      }
    }
    if (this.speaking) {
      this.speaking = false;
      this.emitState();
    }
  }

  getNarrationProgress(expectedSrc: string): {
    currentTime: number;
    duration: number;
    ended: boolean;
    ready: boolean;
  } | null {
    if (!this.narrationEl || this.activeNarrationSrc !== expectedSrc) {
      return null;
    }
    const dur = this.narrationEl.duration;
    const ready = Number.isFinite(dur) && dur > 0.25;
    return {
      currentTime: this.narrationEl.currentTime,
      duration: ready ? dur : 0,
      ended: this.narrationEnded || this.narrationEl.ended,
      ready,
    };
  }

  isUsingSpeechFallback() {
    return this.usingSpeechFallback;
  }

  isSpeaking() {
    return this.speaking;
  }

  private triggerKalimbaNote(freq: number, time: number, gainPeak: number) {
    const ctx = this.ctx;
    if (!ctx || !this.chimeGain || ctx.state !== "running") return;

    const fund = ctx.createOscillator();
    const tine = ctx.createOscillator();
    fund.type = "sine";
    tine.type = "sine";
    fund.frequency.setValueAtTime(freq, time);
    tine.frequency.setValueAtTime(freq * 4, time);

    const tineEnv = ctx.createGain();
    tineEnv.gain.setValueAtTime(gainPeak * 0.25, time);
    tineEnv.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);

    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0.0001, time);
    amp.gain.linearRampToValueAtTime(gainPeak, time + 0.008);
    amp.gain.exponentialRampToValueAtTime(0.0001, time + 0.95);

    fund.connect(amp);
    tine.connect(tineEnv);
    tineEnv.connect(amp);
    amp.connect(this.chimeGain);

    fund.start(time);
    tine.start(time);
    fund.stop(time + 1.0);
    tine.stop(time + 0.06);
    fund.onended = () => {
      fund.disconnect();
      tine.disconnect();
      tineEnv.disconnect();
      amp.disconnect();
    };
  }

  playTransitionSwell(stopIndex: number) {
    if (
      this.muted ||
      this.destroyed ||
      !this.ctx ||
      this.ctx.state !== "running"
    ) {
      return;
    }
    const base = SELECT_CHIME_NOTES[stopIndex % 3];
    const now = this.ctx.currentTime + 0.015;
    [base, base + 4, base + 7].forEach((midi, idx) => {
      this.triggerKalimbaNote(midiToFreq(midi), now + idx * 0.07, 0.14);
    });
  }

  playSelectChime() {
    if (this.muted || this.destroyed) return;
    void this.tryStartBackground().then((ok) => {
      if (!ok || !this.ctx || this.ctx.state !== "running") return;
      const now = this.ctx.currentTime + 0.01;
      const n1 = SELECT_CHIME_NOTES[this.chimeIdx % SELECT_CHIME_NOTES.length];
      const n2 =
        SELECT_CHIME_NOTES[(this.chimeIdx + 2) % SELECT_CHIME_NOTES.length];
      this.chimeIdx++;
      this.triggerKalimbaNote(midiToFreq(n1), now, 0.16);
      this.triggerKalimbaNote(midiToFreq(n2), now + 0.065, 0.13);
    });
  }

  private onVisibilityChange() {
    if (this.destroyed || !this.attached) return;
    if (document.hidden) {
      this.musicEl?.pause();
      this.ambienceEl?.pause();
    } else if (this.backgroundStarted && !this.muted && !this.blocked) {
      void this.musicEl?.play().catch(() => {});
      void this.ambienceEl?.play().catch(() => {});
    }
  }

  destroy() {
    this.destroyed = true;
    this.listeners.clear();
    this.suspendSession();

    if (this.detachTimer) window.clearTimeout(this.detachTimer);
    if (this.primeOrphanTimer) window.clearTimeout(this.primeOrphanTimer);
    if (this.unlockCommitTimer) window.clearTimeout(this.unlockCommitTimer);
    if (this.unlockResetTimer) window.clearTimeout(this.unlockResetTimer);

    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this.onVisibilityChange);
    }

    if (this.musicEl) {
      try {
        this.musicEl.pause();
        this.musicEl.src = "";
      } catch {
        // ignore
      }
      this.musicEl = null;
    }
    if (this.ambienceEl) {
      try {
        this.ambienceEl.pause();
        this.ambienceEl.src = "";
      } catch {
        // ignore
      }
      this.ambienceEl = null;
    }
    if (this.narrationEl) {
      try {
        this.narrationEl.pause();
        this.narrationEl.src = "";
      } catch {
        // ignore
      }
      this.narrationEl = null;
    }
    if (this.ctx) {
      void this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

let moduleDirector: StudioAudioDirector | null = null;

export function getStudioAudioDirector(): StudioAudioDirector {
  if (moduleDirector) return moduleDirector;

  if (typeof window !== "undefined") {
    const win = window as unknown as Record<string, unknown>;
    const existing = win[DIRECTOR_GLOBAL_KEY] as
      | StudioAudioDirector
      | undefined;
    if (existing && typeof existing.destroy === "function") {
      // Clean up any stale HMR instance before replacing
      existing.destroy();
    }
    moduleDirector = new StudioAudioDirector();
    win[DIRECTOR_GLOBAL_KEY] = moduleDirector;
    return moduleDirector;
  }

  moduleDirector = new StudioAudioDirector();
  return moduleDirector;
}

export function primeStudioAudioFromGesture() {
  if (typeof window === "undefined") return;
  getStudioAudioDirector().primeFromUserGesture();
}
