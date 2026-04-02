class CollisionManager {
  /**
   * @param {Phaser.Scene}  scene
   * @param {Player}        player
   * @param {EnemyManager}  enemyManager
   * @param {BulletManager} bulletManager
   * @param {XPSystem}      xpSystem
   */
  constructor(scene, player, enemyManager, bulletManager, xpSystem) {
    this.scene         = scene;
    this.player        = player;
    this.enemyManager  = enemyManager;
    this.bulletManager = bulletManager;
    this.xpSystem      = xpSystem;
  }

  update() {
    this._bulletsVsEnemies();
    this._enemiesVsPlayer();
  }

  // ─── Bala × Inimigo ─────────────────────────────────────────────────────────

  _bulletsVsEnemies() {
    const { bullets } = this.bulletManager;
    const { enemies } = this.enemyManager;

    for (const bullet of bullets) {
      if (!bullet.alive) continue;

      const bBounds = bullet.sprite.getBounds();

      for (const enemy of enemies) {
        if (!enemy.alive) continue;

        if (!Phaser.Geom.Intersects.RectangleToRectangle(bBounds, enemy.sprite.getBounds())) continue;

        // Captura direção antes de destruir a bala (body removido no destroy)
        const bvx = bullet.sprite.body.velocity.x;
        const bvy = bullet.sprite.body.velocity.y;
        bullet._destroy();

        // Rola dano com possível crítico
        const { damage, isCrit } = CombatSystem.rollDamage(this.bulletManager.bulletDamage);

        // Número flutuante de dano
        CombatSystem.floatingText(this.scene, enemy.sprite.x, enemy.sprite.y, damage, isCrit);

        // Hit stop
        CombatSystem.hitStop(this.scene, isCrit);

        const died = enemy.takeDamage(damage);

        if (died) {
          this.xpSystem.addXp(enemy.xpValue);
          this.scene.events.emit('enemy-killed');
          CombatSystem.screenShake(this.scene, isCrit || enemy.typeName === 'elite' ? 'medium' : 'light');
        } else {
          enemy.applyKnockback(bvx, bvy);
          if (isCrit) CombatSystem.screenShake(this.scene, 'light');
        }

        break; // bala já destruída
      }
    }
  }

  // ─── Inimigo × Player ───────────────────────────────────────────────────────

  _enemiesVsPlayer() {
    if (this.player.invincible) return;

    const playerBounds = this.player.sprite.getBounds();

    for (const enemy of this.enemyManager.enemies) {
      if (!enemy.alive) continue;

      if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, enemy.sprite.getBounds())) {
        this.player.takeDamage(enemy.damage);
        CombatSystem.screenShake(this.scene, enemy.damage >= 2 ? 'medium' : 'light');
        break;
      }
    }
  }
}
