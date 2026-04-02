const PLAYER_CONFIG = {
  size: 32,
  color: 0x4fc3f7,
  speed: 200,
  maxHp: 5,
  invincibleDuration: 1000,
};

class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.speed = PLAYER_CONFIG.speed;

    // Toon sprite: 96×128px, scale 0.35 → ~34×45px visual
    this.sprite = scene.physics.add.sprite(x, y, 'toon_player_idle');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setScale(0.35);
    this.sprite.play('toon_player_idle');

    this.hp = PLAYER_CONFIG.maxHp;
    this.maxHp = PLAYER_CONFIG.maxHp;
    this.invincible = false;
    this.critChance = 0.12;

    const scheme = window.CONTROL_SCHEME || 'wasd';
    if (scheme === 'arrows') {
      this.keys = scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      });
    } else {
      this.keys = scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
      });
    }
  }

  takeDamage(amount) {
    if (this.invincible) return;

    this.hp = Math.max(0, this.hp - amount);
    this.invincible = true;

    const dmgRing = this.scene.add.graphics();
    dmgRing.lineStyle(3, 0xff0000, 0.8);
    dmgRing.strokeCircle(this.sprite.x, this.sprite.y, 24);

    this.scene.tweens.add({
      targets: dmgRing,
      scaleX: 2.5, scaleY: 2.5, alpha: 0,
      duration: 400,
      onComplete: () => dmgRing.destroy(),
    });

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0, duration: 120,
      yoyo: true, repeat: 3,
      onComplete: () => {
        this.sprite.setAlpha(1);
        this.invincible = false;
      },
    });
  }

  update() {
    const { up, down, left, right } = this.keys;
    const body = this.sprite.body;

    body.setVelocity(0);

    if (left.isDown) body.setVelocityX(-this.speed);
    if (right.isDown) body.setVelocityX(this.speed);
    if (up.isDown) body.setVelocityY(-this.speed);
    if (down.isDown) body.setVelocityY(this.speed);

    if (body.velocity.x !== 0 && body.velocity.y !== 0) {
      body.velocity.normalize().scale(this.speed);
    }

    const moving = body.velocity.x !== 0 || body.velocity.y !== 0;

    if (moving) {
      if (this.sprite.anims.currentAnim?.key !== 'toon_player_walk') {
        this.sprite.play('toon_player_walk');
      }
      if (body.velocity.x < 0) this.sprite.setFlipX(true);
      else if (body.velocity.x > 0) this.sprite.setFlipX(false);
    } else {
      if (this.sprite.anims.currentAnim?.key !== 'toon_player_idle') {
        this.sprite.play('toon_player_idle');
      }
    }
  }
}

export { Player, PLAYER_CONFIG };
