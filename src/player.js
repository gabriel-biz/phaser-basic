import { getMicroFrame } from './kenney.js';

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

    // Tiles micro-roguelike têm 8×8px; scale 4 → tamanho visual 32×32px
    this.sprite = scene.physics.add.sprite(x, y, 'micro', getMicroFrame('player'));
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setScale(4);

    this.hp = PLAYER_CONFIG.maxHp;
    this.maxHp = PLAYER_CONFIG.maxHp;
    this.invincible = false;
    this.critChance = 0.12; // pode ser aumentado por upgrades

    // Captura as teclas conforme o esquema escolhido na tela de controles
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

  /**
   * Reduz o HP e ativa invencibilidade temporária com flash visual.
   * @param {number} amount
   */
  takeDamage(amount) {
    if (this.invincible) return;

    this.hp = Math.max(0, this.hp - amount);
    this.invincible = true;

    // Efeito visual de dano
    const dmgRing = this.scene.add.graphics();
    dmgRing.lineStyle(3, 0xff0000, 0.8);
    dmgRing.strokeCircle(this.sprite.x, this.sprite.y, 24);
    
    this.scene.tweens.add({
      targets: dmgRing,
      scaleX: 2.5,
      scaleY: 2.5,
      alpha: 0,
      duration: 400,
      onComplete: () => dmgRing.destroy(),
    });

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

    if (left.isDown) body.setVelocityX(-this.speed);
    if (right.isDown) body.setVelocityX(this.speed);
    if (up.isDown) body.setVelocityY(-this.speed);
    if (down.isDown) body.setVelocityY(this.speed);

    // Normaliza a diagonal para não ser mais rápida que os eixos
    if (body.velocity.x !== 0 && body.velocity.y !== 0) {
      body.velocity.normalize().scale(this.speed);
    }
  }
}

export { Player, PLAYER_CONFIG };
