class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    const { width, height } = this.scale;

    // ─── Fundo com grid ───────────────────────────────────────────────────────
    this._drawBackground(width, height);

    // ─── Sistemas ─────────────────────────────────────────────────────────────
    this.stats = new StatsTracker();
    this.player = new Player(this, width / 2, height / 2);
    this.enemyManager = new EnemyManager(this);
    this.spawner = new Spawner(this, this.enemyManager);
    this.bulletManager = new BulletManager(this);
    this.xpSystem = new XPSystem(this);
    this._upgrading = false;
    this.upgradeMenu = new UpgradeMenu(this, this.player, this.bulletManager);

    this.collisionManager = new CollisionManager(
      this, this.player, this.enemyManager, this.bulletManager, this.xpSystem,
    );

    // ─── Eventos ──────────────────────────────────────────────────────────────
    this.events.on('enemy-killed', () => this.stats.addKill());

    this.events.on('levelup', (level) => {
      CombatSystem.slowMotion(this, 0.25, 600);
      this.upgradeMenu.open();
      // Flash XP bar no level-up
      this.tweens.add({
        targets: this._xpBar, alpha: 0.1, duration: 120,
        yoyo: true, repeat: 2, onComplete: () => this._xpBar.setAlpha(1),
      });
    });

    // ─── HUD ──────────────────────────────────────────────────────────────────
    this._buildHud(width, height);
  }

  // ─── Fundo com grid ─────────────────────────────────────────────────────────

  _drawBackground(w, h) {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0f0c29, 0x0f0c29, 0x1a1040, 0x1a1040, 1);
    bg.fillRect(0, 0, w, h);

    // Grid sutil
    bg.lineStyle(1, 0x222244, 0.4);
    const step = 40;
    for (let x = 0; x <= w; x += step) bg.lineBetween(x, 0, x, h);
    for (let y = 0; y <= h; y += step) bg.lineBetween(0, y, w, y);
  }

  // ─── HUD ────────────────────────────────────────────────────────────────────

  _buildHud(width, height) {
    // Painel esquerdo — HP e XP
    this._hpLabel = this.add.text(16, 16, '', {
      fontSize: '14px', fontFamily: 'Arial', color: '#ffffff',
    });
    this._hpBar = this.add.graphics();

    this._xpLabel = this.add.text(16, 52, '', {
      fontSize: '13px', fontFamily: 'Arial', color: '#cc99ff',
    });
    this._xpBar = this.add.graphics();

    // Painel direito — wave e tempo
    this._waveLabel = this.add.text(width - 16, 16, '', {
      fontSize: '14px', fontFamily: 'Arial', color: '#ffffff',
    }).setOrigin(1, 0);

    this._timeLabel = this.add.text(width - 16, 36, '', {
      fontSize: '12px', fontFamily: 'Arial', color: '#aaaacc',
    }).setOrigin(1, 0);

    this._killLabel = this.add.text(width - 16, 54, '', {
      fontSize: '12px', fontFamily: 'Arial', color: '#aaaacc',
    }).setOrigin(1, 0);
  }

  _drawHpBar() {
    const { hp, maxHp } = this.player;
    const ratio = hp / maxHp;
    this._hpBar.clear();
    this._hpBar.fillStyle(0x222244, 1);
    this._hpBar.fillRect(16, 34, 130, 10);
    const col = ratio > 0.5 ? 0x4caf50 : ratio > 0.25 ? 0xffc107 : 0xf44336;
    this._hpBar.fillStyle(col, 1);
    this._hpBar.fillRect(16, 34, 130 * ratio, 10);
  }

  _drawXpBar() {
    const ratio = this.xpSystem.progress;
    this._xpBar.clear();
    this._xpBar.fillStyle(0x222244, 1);
    this._xpBar.fillRect(16, 68, 130, 7);
    this._xpBar.fillStyle(0x9c27b0, 1);
    this._xpBar.fillRect(16, 68, 130 * ratio, 7);
  }

  // ─── Update ─────────────────────────────────────────────────────────────────

  update() {
    if (this._upgrading) return;

    // ── Game Over ──────────────────────────────────────────────────────────
    if (this.player.hp <= 0) {
      this.scene.start('GameOverScene', {
        kills: this.stats.kills,
        time: this.stats.timeFormatted,
        level: this.xpSystem.level,
        wave: this.spawner.wave,
      });
      return;
    }

    this.player.update();
    this.enemyManager.update(this.player.sprite);
    this.bulletManager.update(this.player.sprite, this.enemyManager.enemies);
    this.collisionManager.update();

    // ── HUD ────────────────────────────────────────────────────────────────
    const { hp, maxHp } = this.player;
    const { level, xp, xpToNext } = this.xpSystem;

    this._hpLabel.setText(`HP  ${hp} / ${maxHp}`);
    this._drawHpBar();
    this._xpLabel.setText(`Lv.${level}   ${xp} / ${xpToNext} XP`);
    this._drawXpBar();

    this._waveLabel.setText(`Wave ${this.spawner.wave}`);
    this._timeLabel.setText(this.stats.timeFormatted);
    this._killLabel.setText(`${this.stats.kills} mortes`);
  }
}

// ─── Phaser Config ────────────────────────────────────────────────────────────

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0f0c29',
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [StartScene, ControlsScene, MainScene, GameOverScene],
  parent: document.body,
};

new Phaser.Game(config);
