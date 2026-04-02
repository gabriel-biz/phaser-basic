// ─── Tipos de inimigos ────────────────────────────────────────────────────────

const ENEMY_TYPES = {
  normal: {
    size: 28, color: 0xe53935,
    speed: 90,  hp: 3,  xp: 20, damage: 1,
    showHpBar: false,
    assetKey: 'enemy_normal',
    scale: 1.5,
  },
  fast: {
    size: 16, color: 0xff9800,
    speed: 170, hp: 1,  xp: 15, damage: 1,
    showHpBar: false,
    assetKey: 'enemy_fast',
    scale: 1.2,
  },
  tank: {
    size: 42, color: 0x7b1fa2,
    speed: 38,  hp: 10, xp: 60, damage: 2,
    showHpBar: true,
    assetKey: 'enemy_tank',
    scale: 2,
  },
  elite: {
    size: 36, color: 0xffd600,
    speed: 62,  hp: 15, xp: 120, damage: 2,
    showHpBar: true,
    assetKey: 'enemy_elite',
    scale: 1.8,
  },
};

// ─── Enemy ────────────────────────────────────────────────────────────────────

class Enemy {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {keyof ENEMY_TYPES} [typeName='normal']
   */
  constructor(scene, x, y, typeName = 'normal') {
    this.scene    = scene;
    this.typeName = typeName;
    const def     = ENEMY_TYPES[typeName] ?? ENEMY_TYPES.normal;

    this.speed   = def.speed;
    this.hp      = def.hp;
    this.maxHp   = def.hp;
    this.xpValue = def.xp;
    this.damage  = def.damage;
    this.alive   = true;
    this._isKnockedBack = false;

    this.sprite = scene.physics.add.sprite(x, y, 'kenney', getKenneyFrame(def.assetKey));
    this.sprite.setScale(def.scale);

    // Barra de HP para tipos com showHpBar
    if (def.showHpBar) {
      this._hpBar = scene.add.graphics();
    }
  }

  // ─── Dano ─────────────────────────────────────────────────────────────────

  /**
   * @param {number} amount
   * @returns {boolean} true se morreu
   */
  takeDamage(amount) {
    this.hp -= amount;

    if (this.hp <= 0) {
      this._destroy();
      return true;
    }

    // Tint branco rápido
    this.sprite.setTint(0xffffff);
    this.scene.time.delayedCall(75, () => {
      if (this.alive) this.sprite.clearTint();
    });

    return false;
  }

  // ─── Knockback ────────────────────────────────────────────────────────────

  /**
   * @param {number} dx  componente X da direção do impacto
   * @param {number} dy  componente Y da direção do impacto
   */
  applyKnockback(dx, dy) {
    // Tanques recebem knockback reduzido
    const speedMult = this.typeName === 'tank' ? 0.4 : 1;
    const SPEED     = 240 * speedMult;
    const DURATION  = 160;

    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return;

    this._isKnockedBack = true;
    this.sprite.body.setVelocity((dx / len) * SPEED, (dy / len) * SPEED);

    this.scene.time.delayedCall(DURATION, () => {
      this._isKnockedBack = false;
    });
  }

  // ─── Morte ────────────────────────────────────────────────────────────────

  _destroy() {
    const { x, y } = this.sprite;
    this.alive = false;
    if (this._hpBar) { this._hpBar.destroy(); this._hpBar = null; }
    this._spawnDeathFX(x, y);
    this.sprite.destroy();
  }

  _spawnDeathFX(x, y) {
    const textureKey = `enemy_${this.typeName}`;
    const radius     = this.typeName === 'tank' || this.typeName === 'elite' ? 24 : 14;
    const count      = this.typeName === 'tank' ? 18 : (this.typeName === 'elite' ? 20 : 12);

    // Flash circular
    const flash = this.scene.add.graphics();
    flash.fillStyle(0xff6666, 0.85);
    flash.fillCircle(0, 0, radius);
    flash.setPosition(x, y);

    this.scene.tweens.add({
      targets: flash, scaleX: 3.5, scaleY: 3.5, alpha: 0,
      duration: 260, ease: 'Power2', onComplete: () => flash.destroy(),
    });

    // Burst de partículas
    const emitter = this.scene.add.particles(x, y, textureKey, {
      speed:    { min: 50, max: 220 },
      angle:    { min: 0,  max: 360 },
      scale:    { start: 0.5, end: 0 },
      alpha:    { start: 1,   end: 0 },
      lifespan: 520,
      gravityY: 0,
      emitting: false,
    });

    emitter.explode(count);
    emitter.once('complete', () => emitter.destroy());
  }

  // ─── Update ───────────────────────────────────────────────────────────────

  update(target) {
    if (!this.alive) return;

    if (this._hpBar) this._drawHpBar();

    if (this._isKnockedBack) return;

    const dx  = target.x - this.sprite.x;
    const dy  = target.y - this.sprite.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len > 0) {
      this.sprite.body.setVelocity(
        (dx / len) * this.speed,
        (dy / len) * this.speed,
      );
    }
  }

  _drawHpBar() {
    const { x, y }    = this.sprite;
    const def         = ENEMY_TYPES[this.typeName];
    const w           = def.size + 10;
    const barY        = y - def.size / 2 - 9;
    const ratio       = Math.max(0, this.hp / this.maxHp);
    const fillColor   = ratio > 0.5 ? 0x4caf50 : ratio > 0.25 ? 0xffc107 : 0xf44336;

    this._hpBar.clear();
    this._hpBar.fillStyle(0x1a1a1a, 0.8);
    this._hpBar.fillRect(x - w / 2, barY, w, 5);
    this._hpBar.fillStyle(fillColor, 1);
    this._hpBar.fillRect(x - w / 2, barY, w * ratio, 5);
  }
}

// ─── EnemyManager ─────────────────────────────────────────────────────────────

class EnemyManager {
  constructor(scene) {
    this.scene   = scene;
    this.enemies = [];
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {string} [type='normal']
   */
  spawnAt(x, y, type = 'normal') {
    this.enemies.push(new Enemy(this.scene, x, y, type));
  }

  update(target) {
    this.enemies = this.enemies.filter(e => e.alive);
    for (const enemy of this.enemies) {
      enemy.update(target);
    }
  }

  getSprites() {
    return this.enemies.map(e => e.sprite);
  }
}
