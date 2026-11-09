"use client";

import {
  AsymmetricSmoother,
  BeatDetector,
  FFT_SIZE,
  computeBands,
  rmsFromTimeDomain,
  spectralCentroid,
} from "@/lib/audio/features";
import {
  ML_BAND_COUNT,
  computeBandVector,
  createBandEdges,
} from "@/lib/audio/mlFeatures";

export type AudioSourceType =
  | "none"
  | "track"
  | "file"
  | "mic"
  | "audius"
  | "youtube";

export type AudioSmoothed = {
  bass: number;
  mid: number;
  treble: number;
  energy: number;
  centroid: number;
};

export type AudioFrame = {
  bass: number;
  mid: number;
  treble: number;
  energy: number;
  centroid: number;
  smoothed: AudioSmoothed;
  beat: boolean;
  beatStrength: number;
  beatEnvelope: number;
  /** 40 log-spaced band means used by the optional ML mood model. */
  bands: Float32Array;
  timestamp: number;
};

export type AudioSourceInput =
  | { type: "track"; src: string }
  | { type: "file"; file: File }
  | { type: "mic" }
  | { type: "audius"; src: string }
  | { type: "youtube"; videoId: string; title: string; artist: string; artworkUrl: string; durationSec: number; reactive: boolean };

export type AudioStateEvent = {
  isPlaying: boolean;
  source: AudioSourceType;
};

const SAMPLE_INTERVAL_MS = 12;
const DEFAULT_VOLUME = 0.8;

function nowMs(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function describeMediaError(element: HTMLAudioElement): string {
  // MediaError codes: 2 = network, 3 = decode, 4 = src not supported.
  const code = element.error?.code;
  if (code === 4) {
    return "That audio file could not be played. Check the format or the path.";
  }
  if (code === 2) {
    return "The audio file could not be loaded. Check that it exists in public/audio/.";
  }
  if (code === 3) {
    return "The audio file is damaged or uses an unsupported codec.";
  }
  return "The audio file could not be loaded.";
}

/**
 * Client-only audio singleton.
 *
 * - One AudioContext, created lazily on the first user gesture.
 * - One AnalyserNode (fftSize 1024, smoothing 0.8).
 * - One HTMLAudioElement for bundled tracks and uploaded files.
 * - Microphone streams are analysed but never connected to the destination,
 *   so there is no feedback.
 *
 * The analyser is a leaf node: the audible element path goes through a gain
 * node independently. That keeps the mic path and the playback path separate.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gain: GainNode | null = null;
  private element: HTMLAudioElement | null = null;
  private reactiveElement: HTMLAudioElement | null = null;
  private plainElement: HTMLAudioElement | null = null;
  private elementSource: MediaElementAudioSourceNode | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private objectUrl: string | null = null;

  private freqData = new Uint8Array(FFT_SIZE / 2);
  private timeData = new Uint8Array(FFT_SIZE);
  private bandEdges: Uint16Array = new Uint16Array(ML_BAND_COUNT * 2);

  private bassSmoother = new AsymmetricSmoother(60, 340);
  private midSmoother = new AsymmetricSmoother(50, 300);
  private trebleSmoother = new AsymmetricSmoother(40, 260);
  private energySmoother = new AsymmetricSmoother(70, 380);
  private centroidSmoother = new AsymmetricSmoother(120, 600);
  private beatDetector = new BeatDetector();

  private frame: AudioFrame = {
    bass: 0,
    mid: 0,
    treble: 0,
    energy: 0,
    centroid: 0,
    smoothed: { bass: 0, mid: 0, treble: 0, energy: 0, centroid: 0 },
    beat: false,
    beatStrength: 0,
    beatEnvelope: 0,
    bands: new Float32Array(ML_BAND_COUNT),
    timestamp: 0,
  };

  private lastSampleTime = 0;

  private _isPlaying = false;
  private _source: AudioSourceType = "none";
  private _volume = DEFAULT_VOLUME;

  private stateListeners = new Set<(state: AudioStateEvent) => void>();
  private errorListeners = new Set<(message: string) => void>();

  subscribeState(listener: (state: AudioStateEvent) => void): () => void {
    this.stateListeners.add(listener);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  subscribeError(listener: (message: string) => void): () => void {
    this.errorListeners.add(listener);
    return () => {
      this.errorListeners.delete(listener);
    };
  }

  private emitState(): void {
    const state: AudioStateEvent = {
      isPlaying: this._isPlaying,
      source: this._source,
    };
    for (const listener of this.stateListeners) listener(state);
  }

  private emitError(message: string): void {
    for (const listener of this.errorListeners) listener(message);
  }

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  get source(): AudioSourceType {
    return this._source;
  }

  get volume(): number {
    return this._volume;
  }

  private ensureContext(): AudioContext {
    if (this.ctx) return this.ctx;

    const Ctor =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) {
      throw new Error("This browser does not support the Web Audio API.");
    }

    const ctx = new Ctor();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = 0.8;

    const gain = ctx.createGain();
    gain.gain.value = this._volume;
    gain.connect(ctx.destination);

    this.ctx = ctx;
    this.analyser = analyser;
    this.gain = gain;
    this.freqData = new Uint8Array(analyser.frequencyBinCount);
    this.timeData = new Uint8Array(analyser.fftSize);
    this.bandEdges = createBandEdges(ctx.sampleRate, analyser.fftSize);

    return ctx;
  }

  private ensureElement(): HTMLAudioElement {
    if (this.element) return this.element;

    const element = new Audio();
    element.preload = "metadata";
    element.crossOrigin = "anonymous";
    element.addEventListener("ended", () => {
      if (this._source === "track" || this._source === "file") {
        this.setPlaying(false);
        this.resetAnalysis();
      }
    });
    element.addEventListener("error", () => {
      // CORS failure - switch to plain element fallback
      if (this.reactiveElement === element) {
        this.switchToPlainElement();
      } else {
        if (!this.element?.src) return;
        this.emitError(describeMediaError(element));
        this.setPlaying(false);
      }
    });

    this.reactiveElement = element;
    return element;
  }

  private ensurePlainElement(): HTMLAudioElement {
    if (this.plainElement) return this.plainElement;

    const element = new Audio();
    element.preload = "metadata";
    // NO crossOrigin: plain element for fallback (CORS-unfriendly media still plays)
    element.addEventListener("ended", () => {
      if (this._source === "track" || this._source === "file") {
        this.setPlaying(false);
        this.resetAnalysis();
      }
    });
    // No error handler needed - we want it to play even without CORS

    this.plainElement = element;
    return element;
  }

  private switchToPlainElement(): void {
    // Detach reactive element from analyser/graph
    if (this.reactiveElement && this.elementSource) {
      // The elementSource was created by ensureElementSource reactive path
      // We need to disconnect it
      try {
        this.elementSource?.disconnect();
      } catch {
        // ignore
      }
      this.elementSource = null;
    }
    // Switch src to plain element (no crossOrigin, no Web Audio connection)
    this.plainElement?.removeAttribute("crossOrigin");
    this.plainElement?.pause();
    this.plainElement?.currentTime = 0;
    this.element = this.plainElement;
    this.elementSource = null; // no analyser connection
    this._source = this._source === "audius" ? "audius" : "track";
    // Reset analysis since we're no longer receiving analyser data
    this.resetAnalysis();
  }

  private ensureElementSource(element: HTMLAudioElement): MediaElementAudioSourceNode {
    const ctx = this.ensureContext();
    if (!this.elementSource) {
      const analyser = this.analyser;
      const gain = this.gain;
      if (!analyser || !gain) {
        throw new Error("Audio graph is not ready.");
      }
      const source = ctx.createMediaElementSource(element);
      // Analysis branch (leaf) and audible branch are independent.
      source.connect(analyser);
      source.connect(gain);
      this.elementSource = source;
    }
    return this.elementSource;
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  private teardownMic(): void {
    this.micSource?.disconnect();
    this.micSource = null;
    for (const track of this.micStream?.getTracks() ?? []) {
      track.stop();
    }
    this.micStream = null;
  }

  private setPlaying(value: boolean): void {
    this._isPlaying = value;
    this.emitState();
  }

  private resetAnalysis(): void {
    this.bassSmoother.reset();
    this.midSmoother.reset();
    this.trebleSmoother.reset();
    this.energySmoother.reset();
    this.centroidSmoother.reset();
    this.beatDetector.reset();
    this.frame.beat = false;
    this.frame.beatStrength = 0;
    this.frame.beatEnvelope = 0;
  }

  /**
   * Load a source. Must be called from a user gesture the first time so the
   * AudioContext can be created/resumed.
   */
  async setSource(input: AudioSourceInput): Promise<void> {
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") await ctx.resume();

    if (input.type === "mic") {
      this.element?.pause();
      this.teardownMic();
      this.revokeObjectUrl();

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        const name = error instanceof DOMException ? error.name : "";
        if (name === "NotAllowedError" || name === "SecurityError") {
          throw new Error(
            "Microphone access was denied. Allow it in your browser settings and try again.",
          );
        }
        if (name === "NotFoundError" || name === "DevicesNotFoundError") {
          throw new Error("No microphone was found on this device.");
        }
        throw new Error("The microphone could not be started.");
      }

      const analyser = this.analyser;
      if (!analyser) throw new Error("Audio graph is not ready.");

      this.micStream = stream;
      this.micSource = ctx.createMediaStreamSource(stream);
      // Deliberately NOT connected to gain/destination: analysis only.
      this.micSource.connect(analyser);

      this._source = "mic";
      this.resetAnalysis();
      this.setPlaying(true);
      return;
    }

    this.teardownMic();
    const element = this.ensureElement();
    this.ensureElementSource(element);

    if (this._source === "file" || this._source === "track") {
      element.pause();
    }
    this.revokeObjectUrl();

    try {
      if (input.type === "file") {
        this.objectUrl = URL.createObjectURL(input.file);
        element.src = this.objectUrl;
        this._source = "file";
      } else {
        element.src = input.src;
        this._source = "track";
      }
      element.load();
      this.resetAnalysis();
      this.setPlaying(false);
    } catch {
      throw new Error("That audio source could not be loaded.");
    }
  }

  async play(): Promise<void> {
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") await ctx.resume();

    if (this._source === "mic") {
      if (!this.micStream) {
        throw new Error("The microphone is not active.");
      }
      this.setPlaying(true);
      return;
    }

    if (!this.element || !this.element.src) {
      throw new Error("Choose a track or upload a file first.");
    }

    try {
      await this.element.play();
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        throw new Error(
          "Playback was blocked by the browser. Press play again to allow audio.",
        );
      }
      throw new Error("This audio file could not be played.");
    }
    this.setPlaying(true);
  }

  pause(): void {
    if (this._source === "mic") {
      this.teardownMic();
      this._source = "none";
    } else {
      this.element?.pause();
    }
    this.resetAnalysis();
    this.setPlaying(false);
  }

  stop(): void {
    this.pause();
    if (this.element) this.element.currentTime = 0;
  }

  setVolume(value: number): void {
    this._volume = Math.max(0, Math.min(1, value));
    if (this.gain && this.ctx) {
      this.gain.gain.setTargetAtTime(this._volume, this.ctx.currentTime, 0.02);
    }
  }

  /**
   * Current audio frame. The returned object and its `bands` array are reused
   * between calls; copy values if you need to retain them.
   */
  getFrame(): AudioFrame {
    const analyser = this.analyser;
    if (!analyser || !this.ctx || !this._isPlaying) {
      this.frame.bass = 0;
      this.frame.mid = 0;
      this.frame.treble = 0;
      this.frame.energy = 0;
      this.frame.centroid = 0;
      this.frame.smoothed.bass = 0;
      this.frame.smoothed.mid = 0;
      this.frame.smoothed.treble = 0;
      this.frame.smoothed.energy = 0;
      this.frame.smoothed.centroid = 0;
      this.frame.beat = false;
      this.frame.beatStrength = 0;
      this.frame.beatEnvelope = 0;
      this.frame.bands.fill(0);
      return this.frame;
    }

    const now = nowMs();
    if (now - this.lastSampleTime < SAMPLE_INTERVAL_MS) {
      return this.frame;
    }
    const delta = this.lastSampleTime > 0 ? now - this.lastSampleTime : 16;
    this.lastSampleTime = now;

    analyser.getByteFrequencyData(this.freqData);
    analyser.getByteTimeDomainData(this.timeData);

    const bands = computeBands(
      this.freqData,
      this.ctx.sampleRate,
      analyser.fftSize,
    );
    const energy = rmsFromTimeDomain(this.timeData);
    const centroid = spectralCentroid(
      this.freqData,
      this.ctx.sampleRate,
      analyser.fftSize,
    );
    const beat = this.beatDetector.update(bands.bass, now);

    this.frame.bass = bands.bass;
    this.frame.mid = bands.mid;
    this.frame.treble = bands.treble;
    this.frame.energy = energy;
    this.frame.centroid = centroid;
    this.frame.smoothed.bass = this.bassSmoother.process(bands.bass, delta);
    this.frame.smoothed.mid = this.midSmoother.process(bands.mid, delta);
    this.frame.smoothed.treble = this.trebleSmoother.process(bands.treble, delta);
    this.frame.smoothed.energy = this.energySmoother.process(energy, delta);
    this.frame.smoothed.centroid = this.centroidSmoother.process(
      centroid,
      delta,
    );
    this.frame.beat = beat.beat;
    this.frame.beatStrength = beat.strength;
    this.frame.beatEnvelope = beat.envelope;
    computeBandVector(this.freqData, this.bandEdges, this.frame.bands);
    this.frame.timestamp = now;

    return this.frame;
  }

  dispose(): void {
    this._isPlaying = false;
    this.element?.pause();
    this.teardownMic();
    this.revokeObjectUrl();

    this.elementSource?.disconnect();
    this.elementSource = null;
    this.gain?.disconnect();
    this.gain = null;
    this.analyser?.disconnect();
    this.analyser = null;
    this.element = null;
    this._source = "none";

    const ctx = this.ctx;
    this.ctx = null;
    if (ctx && ctx.state !== "closed") {
      void ctx.close().catch(() => {});
    }

    this.resetAnalysis();
    this.stateListeners.clear();
    this.errorListeners.clear();
  }
}

let engine: AudioEngine | null = null;

/** Lazily-created singleton. Safe to call during client rendering. */
export function getAudioEngine(): AudioEngine {
  if (!engine) engine = new AudioEngine();
  return engine;
}
