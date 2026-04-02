const BULLET_CONFIG = {
  size: 6,
  color: 0xffd54f,
  speed: 420,
  fireRate: 600,    // ms entre cada tiro
  maxDistance: 900, // px — projétil some ao ultrapassar essa distância
};

// ─── Bullet ───────────────────────────────────────────────────────────────────

class Bullet {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x - posição inicial X (centro do player)
   * @param {number} y - posição inicial Y (centro do player)
   * @param {number} dx - componente X do vetor de direção (normalizado)
   * @param {number} dy - componente Y do vetor de direção (normalizado)
   */
  constructor(scene, x, y, dx, dy, speed) {
    this.scene = scene;
    this.distanceTraveled = 0;
    this.alive = true;

    // Gera textura circular uma única vez
    if (!scene.textures.exists('bullet')) {
      const gfx = scene.add.graphics();
      gfx.fillStyle(BULLET_CONFIG.color, 1);
      gfx.fillCircle(
        BULLET_CONFIG.size,
        BULLET_CONFIG.size,
        BULLET_CONFIG.size,
      );
      gfx.generateTexture('bullet', BULLET_CONFIG.size * 2, BULLET_CONFIG.size * 2);
      gfx.destroy();
    }

    this.sprite = scene.physics.add.sprite(x, y, 'bullet');
    this.sprite.body.setVelocity(dx * speed, dy * speed);

    // Guarda a posição de origem para calcular distância percorrida
    this._originX = x;
    this._originY = y;
  }

  /**
   * Retorna true enquanto o projétil ainda estiver ativo.
   * Remove o sprite automaticamente ao ultrapassar maxDistance.
   */
  update() {
    if (!this.alive) return;

    const dx = this.sprite.x - this._originX;
    const dy = this.sprite.y - this._originY;
    this.distanceTraveled = Math.sqrt(dx * dx + dy * dy);

    if (this.distanceTraveled >= BULLET_CONFIG.maxDistance) {
      this._destroy();
    }
  }

  _destroy() {
    this.alive = false;
    this.sprite.destroy();
  }
}

// ─── BulletManager ────────────────────────────────────────────────────────────

class BulletManager {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene        = scene;
    this.bullets      = [];
    this._lastFiredAt = 0;

    // Propriedades modificáveis pelo sistema de upgrades
    this.fireRate    = BULLET_CONFIG.fireRate;
    this.bulletSpeed = BULLET_CONFIG.speed;
    this.bulletDamage = 1;
  }

  /**
   * Deve ser chamado no update() da cena.
   * Busca o inimigo mais próximo, dispara quando o cooldown permite,
   * e limpa projéteis inativos.
   *
   * @param {Phaser.GameObjects.Sprite} origin - sprite do player
   * @param {Enemy[]} enemies - lista de instâncias Enemy
   */
  update(origin, enemies) {
    const now = this.scene.time.now;

    const target = this._closestEnemy(origin, enemies);

    if (target && now - this._lastFiredAt >= this.fireRate) {
      this._fire(origin, target.sprite);
      this._lastFiredAt = now;
    }

    // Atualiza posição e remove os que expiraram
    this.bullets = this.bullets.filter(b => {
      b.update();
      return b.alive;
    });
  }

  /**
   * Varre o array de inimigos e retorna o mais próximo do origin.
   * Retorna null se não houver inimigos.
   *
   * @param {Phaser.GameObjects.Sprite} origin
   * @param {Enemy[]} enemies
   * @returns {Enemy|null}
   */
  _closestEnemy(origin, enemies) {
    let closest = null;
    let minDist = Infinity;

    for (const enemy of enemies) {
      const dx = enemy.sprite.x - origin.x;
      const dy = enemy.sprite.y - origin.y;
      const dist = dx * dx + dy * dy; // evita sqrt — só precisamos comparar

      if (dist < minDist) {
        minDist = dist;
        closest = enemy;
      }
    }

    return closest;
  }

  /**
   * Cria um projétil na direção do alvo.
   *
   * @param {Phaser.GameObjects.Sprite} origin
   * @param {Phaser.GameObjects.Sprite} target
   */
  _fire(origin, target) {
    const dx = target.x - origin.x;
    const dy = target.y - origin.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    this.bullets.push(new Bullet(
      this.scene,
      origin.x,
      origin.y,
      dx / len,
      dy / len,
      this.bulletSpeed,
    ));
  }

  /**
   * Retorna os sprites ativos para uso em collider/overlap.
   * @returns {Phaser.GameObjects.Sprite[]}
   */
  getSprites() {
    return this.bullets.map(b => b.sprite);
  }
}
