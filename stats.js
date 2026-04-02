class StatsTracker {
  constructor() {
    this.kills     = 0;
    this.startTime = Date.now();
  }

  addKill() { this.kills++; }

  /** Segundos decorridos desde o início da partida. */
  get elapsedSeconds() {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /** Tempo no formato "M:SS". */
  get timeFormatted() {
    const s  = this.elapsedSeconds;
    const m  = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, '0');
    return `${m}:${ss}`;
  }
}
