// Studio 3D Audio Director: ElevenLabs Studio campfire soundtrack, organic hearth/forest ambience,
// ElevenLabs Multilingual v2 voiceover narration with smooth sidechain ducking, and tactile Web Audio chimes.

export type AudioDirectorCallbacks = {
  onStateChange?: (state: {
    muted: boolean;
    blocked: boolean;
    speaking: boolean;
  }) => void;
};

const CAMP_MUSIC_SRC = "/audio/tour/camp-music.mp3";
const CAMP_AMBIENCE_SRC = "/audio/tour/camp-ambience.mp3";
const SELECT_CHIME_NOTES = [65, 69, 72, 76, 79, 81];

const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

export class StudioAudioDirector {
  private musicEl: HTMLAudioElement | null = null;
  private ambienceEl: HTMLAudioElement | null = null;
  private narrationEl: HTMLAudioElement | null = null;
  private activeNarrationSrc: string | null = null;
  private onClipComplete: (() => void) | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  // Lightweight Web Audio context for tactile 3D landmark chimes & transition sparkles
  private ctx: AudioContext | null = null;
  private chimeGain: GainNode | null = null;
  private chimeIdx = 0;

  private fadeTimer = 0;
  private currentMusicVol = 0;
  private currentAmbienceVol = 0;

  private muted = false;
  private blocked = false;
  private speaking = false;
  private started = false;
  private mode: "tour" | "explore" = "tour";
  private disposed = false;
  private callbacks: AudioDirectorCallbacks;

  constructor(callbacks: AudioDirectorCallbacks = {}) {
    this.callbacks = callbacks;
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this.onVisibilityChange);
    }
  }

  private emitState() {
    this.callbacks.onStateChange?.({
      muted: this.muted,
      blocked: this.blocked,
      speaking: this.speaking,
    });
  }

  private ensureBackgroundTracks() {
    if (this.disposed || typeof window === "undefined") return;

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

    if (!this.fadeTimer) {
      this.fadeTimer = window.setInterval(() => this.stepMixFades(), 45);
    }
  }

  private ensureChimeGraph(): AudioContext | null {
    if (this.disposed || typeof window === "undefined") return null;
    if (this.ctx) return this.ctx;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;

    const ctx = new AudioCtx();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.32, ctx.currentTime);
    gain.connect(ctx.destination);
    this.ctx = ctx;
    this.chimeGain = gain;
    return ctx;
  }

  private getTargetVolumes() {
    if (this.muted || this.blocked || (typeof document !== "undefined" && document.hidden)) {
      return { music: 0, ambience: 0 };
    }
    // Smooth sidechain ducking so ElevenLabs voiceover sits crystal-clear in the center
    const music = this.speaking
      ? 0.2
      : this.mode === "tour"
        ? 0.52
        : 0.36;
    const ambience = this.speaking ? 0.2 : 0.3;
    return { music, ambience };
  }

  private stepMixFades() {
    if (this.disposed) return;
    const targets = this.getTargetVolumes();

    const musicRate = targets.music < this.currentMusicVol ? 0.22 : 0.1;
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

  async unlockAndStart(): Promise<boolean> {
    if (this.disposed || this.muted || typeof window === "undefined") {
      return false;
    }
    this.ensureBackgroundTracks();

    const ctx = this.ensureChimeGraph();
    if (ctx && ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        // ignore
      }
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
      this.started = true;
      this.blocked = false;
      this.emitState();
      return true;
    } catch (err) {
      const isNotAllowed =
        err instanceof DOMException && err.name === "NotAllowedError";
      if (isNotAllowed || (ctx && ctx.state !== "running")) {
        this.blocked = true;
        this.emitState();
        return false;
      }
      // Even if one optional asset failed, keep director unblocked for narration
      this.blocked = false;
      this.emitState();
      return true;
    }
  }

  setMode(mode: "tour" | "explore") {
    this.mode = mode;
    if (mode === "explore") {
      this.stopNarration();
    }
  }

  setMuted(nextMuted: boolean) {
    this.muted = nextMuted;
    if (nextMuted) {
      this.stopNarration();
      if (this.musicEl) this.musicEl.volume = 0;
      if (this.ambienceEl) this.ambienceEl.volume = 0;
      this.currentMusicVol = 0;
      this.currentAmbienceVol = 0;
    } else {
      void this.unlockAndStart();
    }
    this.emitState();
  }

  isMuted() {
    return this.muted;
  }

  isBlocked() {
    return this.blocked;
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
    if (this.muted || this.disposed || !this.ctx || this.ctx.state !== "running") {
      return;
    }
    const base = SELECT_CHIME_NOTES[stopIndex % 3];
    const now = this.ctx.currentTime + 0.015;
    [base, base + 4, base + 7].forEach((midi, idx) => {
      this.triggerKalimbaNote(midiToFreq(midi), now + idx * 0.07, 0.14);
    });
  }

  playSelectChime() {
    if (this.muted || this.disposed) return;
    void this.unlockAndStart().then((ok) => {
      if (!ok || !this.ctx) return;
      const now = this.ctx.currentTime + 0.01;
      const n1 = SELECT_CHIME_NOTES[this.chimeIdx % SELECT_CHIME_NOTES.length];
      const n2 =
        SELECT_CHIME_NOTES[(this.chimeIdx + 2) % SELECT_CHIME_NOTES.length];
      this.chimeIdx++;
      this.triggerKalimbaNote(midiToFreq(n1), now, 0.16);
      this.triggerKalimbaNote(midiToFreq(n2), now + 0.065, 0.13);
    });
  }

  async playNarration(
    audioSrc: string,
    fallbackText: string,
    onEnded?: () => void,
  ): Promise<boolean> {
    this.stopNarration();
    if (this.disposed || this.muted || typeof window === "undefined") {
      return false;
    }

    const unlocked = await this.unlockAndStart();
    this.onClipComplete = onEnded ?? null;

    try {
      const audio = new Audio(audioSrc);
      audio.preload = "auto";
      audio.volume = 0.98;
      this.narrationEl = audio;
      this.activeNarrationSrc = audioSrc;

      audio.onended = () => {
        if (this.narrationEl !== audio) return;
        this.speaking = false;
        this.emitState();
        const done = this.onClipComplete;
        this.onClipComplete = null;
        done?.();
      };

      audio.onerror = () => {
        if (this.narrationEl !== audio) return;
        this.narrationEl = null;
        this.playSpeechFallback(fallbackText);
      };

      await audio.play();
      this.blocked = false;
      this.speaking = true;
      this.emitState();
      return true;
    } catch (err) {
      const isNotAllowed =
        err instanceof DOMException && err.name === "NotAllowedError";
      if (isNotAllowed || !unlocked) {
        this.blocked = true;
        this.speaking = false;
        this.emitState();
        return false;
      }
      return this.playSpeechFallback(fallbackText);
    }
  }

  private playSpeechFallback(text: string): boolean {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      this.muted ||
      this.disposed
    ) {
      return false;
    }
    try {
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
        if (this.activeUtterance !== utter) return;
        this.speaking = false;
        this.emitState();
        const done = this.onClipComplete;
        this.onClipComplete = null;
        done?.();
      };
      utter.onerror = () => {
        if (this.activeUtterance !== utter) return;
        this.speaking = false;
        this.emitState();
      };

      this.activeUtterance = utter;
      this.speaking = true;
      this.emitState();
      window.speechSynthesis.speak(utter);
      return true;
    } catch {
      return false;
    }
  }

  pauseNarration() {
    if (this.narrationEl && !this.narrationEl.paused) {
      this.narrationEl.pause();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
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

  async resumeNarration(): Promise<boolean> {
    if (this.muted || this.disposed) return false;
    await this.unlockAndStart();
    if (this.narrationEl && this.narrationEl.paused && !this.narrationEl.ended) {
      try {
        await this.narrationEl.play();
        this.speaking = true;
        this.blocked = false;
        this.emitState();
        return true;
      } catch {
        return false;
      }
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
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  stopNarration() {
    this.onClipComplete = null;
    if (this.narrationEl) {
      const el = this.narrationEl;
      this.narrationEl = null;
      this.activeNarrationSrc = null;
      el.onended = null;
      el.onerror = null;
      try {
        el.pause();
        el.currentTime = 0;
      } catch {
        // ignore
      }
    }
    if (this.activeUtterance) {
      this.activeUtterance = null;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
      }
    }
    if (this.speaking) {
      this.speaking = false;
      this.emitState();
    }
  }

  getNarrationProgress(): {
    currentTime: number;
    duration: number;
    src: string | null;
  } | null {
    if (
      !this.narrationEl ||
      !Number.isFinite(this.narrationEl.duration) ||
      this.narrationEl.duration <= 0
    ) {
      return null;
    }
    return {
      currentTime: this.narrationEl.currentTime,
      duration: this.narrationEl.duration,
      src: this.activeNarrationSrc,
    };
  }

  private onVisibilityChange() {
    if (this.disposed) return;
    if (document.hidden) {
      this.musicEl?.pause();
      this.ambienceEl?.pause();
    } else if (this.started && !this.muted && !this.blocked) {
      void this.musicEl?.play().catch(() => {});
      void this.ambienceEl?.play().catch(() => {});
    }
  }

  dispose() {
    this.disposed = true;
    this.stopNarration();
    if (this.fadeTimer) {
      window.clearInterval(this.fadeTimer);
      this.fadeTimer = 0;
    }
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
    if (this.ctx) {
      void this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
