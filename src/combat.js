const COMBAT_CONFIG = {
  critChance:      0.12,  // 12% de chance de acerto crítico
  critMultiplier:  2.5,   // dano × 2.5 no crítico
  hitStopMs:       45,    // ms de pausa ao acertar (hit stop)
  critHitStopMs:   80,    // ms de pausa ao crítico
};

class CombatSystem {
  // ─── Dano ──────────────────────────────────────────────────────────────────

  /**
   * Calcula o dano final com possível crítico.
   * @param {number} base - dano base (do BulletManager)
   * @param {number} [critChance]
   * @returns {{ damage: number, isCrit: boolean }}
   */
  static rollDamage(base, critChance = COMBAT_CONFIG.critChance) {
    const isCrit = Math.random() < critChance;
    return {
      damage: isCrit ? Math.ceil(base * COMBAT_CONFIG.critMultiplier) : base,
      isCrit,
    };
  }

  // ─── Hit Stop ──────────────────────────────────────────────────────────────

  /**
   * Pausa a física por um instante — "hit stop".
   * Cria a sensação de impacto sem parar a cena inteira.
   * @param {Phaser.Scene} scene
   * @param {boolean} [isCrit]
   */
  static hitStop(scene, isCrit = false) {
    const ms = isCrit ? COMBAT_CONFIG.critHitStopMs : COMBAT_CONFIG.hitStopMs;
    scene.physics.world.pause();
    scene.time.delayedCall(ms, () => {
      if (scene.physics) scene.physics.world.resume();
    });
  }

  // ─── Screen Shake ─────────────────────────────────────────────────────────

  /**
   * Aplica screen shake na câmera principal.
   * @param {Phaser.Scene} scene
   * @param {'light'|'medium'|'heavy'} [level]
   */
  static screenShake(scene, level = 'light') {
    const presets = {
      light:  { duration: 100, intensity: 0.003 },
      medium: { duration: 160, intensity: 0.006 },
      heavy:  { duration: 260, intensity: 0.012 },
    };
    const { duration, intensity } = presets[level] ?? presets.light;
    scene.cameras.main.shake(duration, intensity);
  }

  // ─── Floating Text ─────────────────────────────────────────────────────────

  /**
   * Número de dano flutuante que sobe e desaparece.
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {number|string} text
   * @param {boolean} [isCrit]
   */
  static floatingText(scene, x, y, text, isCrit = false) {
    const style = isCrit
      ? { fontSize: '22px', fontFamily: 'Arial', fontStyle: 'bold',
          color: '#ffd54f', stroke: '#000000', strokeThickness: 4 }
      : { fontSize: '15px', fontFamily: 'Arial',
          color: '#ffffff',  stroke: '#000000', strokeThickness: 2 };

    // Leve offset aleatório no X para não empilhar
    const ox = Phaser.Math.Between(-14, 14);

    const txt = scene.add.text(x + ox, y - 12, String(text), style).setOrigin(0.5);

    scene.tweens.add({
      targets:  txt,
      y:        txt.y - (isCrit ? 70 : 48),
      alpha:    0,
      scaleX:   isCrit ? 1.5 : 1,
      scaleY:   isCrit ? 1.5 : 1,
      duration: isCrit ? 950 : 720,
      ease:     isCrit ? 'Back.Out' : 'Power2',
      onComplete: () => txt.destroy(),
    });
  }

  // ─── Slow Motion ───────────────────────────────────────────────────────────

  /**
   * Reduz o timeScale da cena por `duration` ms, criando slow-mo.
   * Útil para level-up ou kills em cadeia.
   * @param {Phaser.Scene} scene
   * @param {number} [scale=0.3]
   * @param {number} [duration=800]
   */
  static slowMotion(scene, scale = 0.3, duration = 800) {
    scene.physics.world.timeScale = 1 / scale; // física precisa da inversa
    scene.time.timeScale = scale;

    scene.time.delayedCall(duration, () => {
      scene.physics.world.timeScale = 1;
      scene.time.timeScale          = 1;
    });
  }
}
