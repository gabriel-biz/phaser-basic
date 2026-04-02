const XP_CONFIG = {
  baseXp:   100, // XP necessário para sair do nível 1
  exponent: 1.4, // curvatura do crescimento exponencial
};

class XPSystem {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene    = scene;
    this.xp       = 0;
    this.level    = 1;
    this.xpToNext = this._calcXpToNext(1);
  }

  /**
   * Adiciona XP e processa level-ups em cadeia (caso o ganho seja grande).
   * @param {number} amount
   */
  addXp(amount) {
    this.xp += amount;

    while (this.xp >= this.xpToNext) {
      this.xp      -= this.xpToNext;
      this.level++;
      this.xpToNext = this._calcXpToNext(this.level);
      this.scene.events.emit('levelup', this.level);
    }
  }

  /**
   * Progresso de 0 a 1 dentro do nível atual (usado pela barra de XP).
   * @returns {number}
   */
  get progress() {
    return this.xp / this.xpToNext;
  }

  /**
   * XP necessário para sair do nível `level`.
   * Fórmula: base * level ^ exponent
   *
   * Lv 1 → 2 :  100 XP
   * Lv 2 → 3 :  264 XP
   * Lv 3 → 4 :  465 XP
   * Lv 5 → 6 :  954 XP
   * Lv10 → 11: 2512 XP
   *
   * @param {number} level
   * @returns {number}
   */
  _calcXpToNext(level) {
    return Math.floor(XP_CONFIG.baseXp * Math.pow(level, XP_CONFIG.exponent));
  }
}

export { XPSystem, XP_CONFIG };
