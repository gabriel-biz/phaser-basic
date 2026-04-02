const PLAYER_CONFIG = {
  size: 32,
  color: 0x4fc3f7,
  speed: 200,
  maxHp: 5,
  invincibleDuration: 1000, // ms de invencibilidade após levar dano
};

class Player {
  /**
   * @param {Phaser.Scene} scene - A cena onde o player será criado
   * @param {number} x - Posição inicial X
   * @param {number} y - Posição inicial Y
   */
  constructor(scene, x, y) {
    this.scene = scene;
    this.speed = PLAYER_CONFIG.speed;

    // Cria o quadrado usando Graphics e gera uma textura a partir dele
    const gfx = scene.add.graphics();
    gfx.fillStyle(PLAYER_CONFIG.color, 1);
    gfx.fillRect(0, 0, PLAYER_CONFIG.size, PLAYER_CONFIG.size);
    gfx.generateTexture('player', PLAYER_CONFIG.size, PLAYER_CONFIG.size);
    gfx.destroy();

    // Sprite com física arcade usando a textura gerada
    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.sprite.setCollideWorldBounds(true);

    this.hp         = PLAYER_CONFIG.maxHp;
    this.maxHp      = PLAYER_CONFIG.maxHp;
    this.invincible = false;
    this.critChance = 0.12; // pode ser aumentado por upgrades

    // Captura as teclas WASD
    this.keys = scene.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  /**
   * Reduz o HP e ativa invencibilidade temporária com flash visual.
   * @param {number} amount
   */
  takeDamage(amount) {
    if (this.invincible) return;

    this.hp = Math.max(0, this.hp - amount);
    this.invincible = true;

    // Pisca o sprite durante o período de invencibilidade
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      duration: 120,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.sprite.setAlpha(1);
        this.invincible = false;
      },
    });
  }

  update() {
    const { up, down, left, right } = this.keys;
    const body = this.sprite.body;

    // Zera a velocidade antes de recalcular
    body.setVelocity(0);

    if (left.isDown)  body.setVelocityX(-this.speed);
    if (right.isDown) body.setVelocityX(this.speed);
    if (up.isDown)    body.setVelocityY(-this.speed);
    if (down.isDown)  body.setVelocityY(this.speed);

    // Normaliza a diagonal para não ser mais rápida que os eixos
    if (body.velocity.x !== 0 && body.velocity.y !== 0) {
      body.velocity.normalize().scale(this.speed);
    }
  }
}
