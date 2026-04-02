const SPAWNER_CONFIG = {
  initialDelay:  2000, // ms entre spawns no início
  minDelay:       300, // limite mínimo — nunca fica mais rápido que isso
  delayDecrement: 175, // quanto reduz o delay a cada wave
  scaleInterval: 8000, // a cada 8s sobe uma wave
  spawnMargin:     40, // px fora da tela onde o inimigo aparece
  maxEnemies:      30, // cap total de inimigos simultâneos
};

class Spawner {
  /**
   * @param {Phaser.Scene}  scene
   * @param {EnemyManager}  enemyManager
   */
  constructor(scene, enemyManager) {
    this.scene        = scene;
    this.enemyManager = enemyManager;
    this.wave         = 1;
    this.currentDelay = SPAWNER_CONFIG.initialDelay;

    // Spawn inicial — tela não começa vazia
    this._tick();
    this._startSpawnTimer();

    // Timer de escalonamento — sobe uma wave a cada scaleInterval
    scene.time.addEvent({
      delay:         SPAWNER_CONFIG.scaleInterval,
      callback:      this._scale,
      callbackScope: this,
      loop:          true,
    });
  }

  // ─── Público ──────────────────────────────────────────────────────────────

  /** Delay atual em ms (usado pelo HUD). */
  getDelay() { return this.currentDelay; }

  // ─── Privado ──────────────────────────────────────────────────────────────

  /** Spawna um inimigo numa borda aleatória da tela. */
  _tick() {
    if (this.enemyManager.enemies.length >= SPAWNER_CONFIG.maxEnemies) return;

    const { x, y } = this._randomBorderPosition();
    this.enemyManager.spawnAt(x, y, this._pickType());
  }

  /**
   * Escolhe o tipo de inimigo com base na wave atual.
   * Tipos mais difíceis desbloqueiam progressivamente.
   * @returns {string}
   */
  _pickType() {
    const w = this.wave;
    const r = Math.random();

    if (w >= 7 && r < 0.08)  return 'elite';
    if (w >= 4 && r < 0.18)  return 'tank';
    if (w >= 2 && r < 0.32)  return 'fast';
    return 'normal';
  }

  /**
   * Cria (ou recria) o timer de spawn com o delay atual.
   * Recriar é necessário porque o Phaser não permite alterar o delay
   * de um TimerEvent já em andamento.
   */
  _startSpawnTimer() {
    if (this._spawnTimer) this._spawnTimer.remove();

    this._spawnTimer = this.scene.time.addEvent({
      delay:         this.currentDelay,
      callback:      this._tick,
      callbackScope: this,
      loop:          true,
    });
  }

  /** Reduz o intervalo de spawn e avança a wave. */
  _scale() {
    const next = this.currentDelay - SPAWNER_CONFIG.delayDecrement;

    // Já está no mínimo — não faz nada
    if (this.currentDelay <= SPAWNER_CONFIG.minDelay) return;

    this.currentDelay = Math.max(SPAWNER_CONFIG.minDelay, next);
    this.wave++;

    // Reinicia o timer com o novo delay
    this._startSpawnTimer();
  }

  /** Sorteia uma posição nas bordas da tela, fora do canvas visível. */
  _randomBorderPosition() {
    const { width, height } = this.scene.scale;
    const m    = SPAWNER_CONFIG.spawnMargin;
    const side = Phaser.Math.Between(0, 3);

    switch (side) {
      case 0: return { x: Phaser.Math.Between(0, width),  y: -m          }; // cima
      case 1: return { x: Phaser.Math.Between(0, width),  y: height + m  }; // baixo
      case 2: return { x: -m,         y: Phaser.Math.Between(0, height)  }; // esquerda
      case 3: return { x: width + m,  y: Phaser.Math.Between(0, height)  }; // direita
    }
  }
}
