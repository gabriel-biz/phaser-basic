class StatsTracker {
  constructor() {
    this.kills        = 0;
    this.startTime    = Date.now();
    this._pausedAt    = null;
    this._pausedTotal = 0; // ms acumulados pausado
  }

  addKill() { this.kills++; }

  pause() {
    if (this._pausedAt === null) {
      this._pausedAt = Date.now();
    }
  }

  resume() {
    if (this._pausedAt !== null) {
      this._pausedTotal += Date.now() - this._pausedAt;
      this._pausedAt = null;
    }
  }

  /** Segundos decorridos desde o início da partida, excluindo tempo pausado. */
  get elapsedSeconds() {
    return Math.floor((Date.now() - this.startTime - this._pausedTotal) / 1000);
  }

  /** Tempo no formato "M:SS". */
  get timeFormatted() {
    const s  = this.elapsedSeconds;
    const m  = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, '0');
    return `${m}:${ss}`;
  }
}

export { StatsTracker };
