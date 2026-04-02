class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  create() {
    const { width, height } = this.scale;

    // ─── Fundo ────────────────────────────────────────────────────────────────
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0f0c29, 0x0f0c29, 0x302b63, 0x24243e, 1);
    bg.fillRect(0, 0, width, height);

    // Estrelas decorativas
    for (let i = 0; i < 100; i++) {
      const g = this.add.graphics();
      const a = Phaser.Math.FloatBetween(0.15, 0.75);
      const r = Phaser.Math.FloatBetween(0.5, 2.0);
      g.fillStyle(0xffffff, a);
      g.fillCircle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        r,
      );
    }

    // ─── Título ───────────────────────────────────────────────────────────────
    const title = this.add.text(width / 2, height / 2 - 100, 'ARENA ROGUE', {
      fontSize:        '56px',
      fontFamily:      'Arial',
      fontStyle:       'bold',
      color:           '#ffffff',
      stroke:          '#302b63',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.tweens.add({
      targets:  title,
      scaleX:   1.04,
      scaleY:   1.04,
      duration: 1200,
      yoyo:     true,
      repeat:   -1,
      ease:     'Sine.InOut',
    });

    this.add.text(width / 2, height / 2 - 36, 'Sobreviva o máximo que puder', {
      fontSize:   '16px',
      fontFamily: 'Arial',
      color:      '#aaaacc',
    }).setOrigin(0.5);

    // ─── Botão Jogar ──────────────────────────────────────────────────────────
    const btn = this.add.text(width / 2, height / 2 + 40, '  ► JOGAR  ', {
      fontSize:        '30px',
      fontFamily:      'Arial',
      fontStyle:       'bold',
      color:           '#ffd54f',
      stroke:          '#000000',
      strokeThickness: 4,
      backgroundColor: '#1e1b4b',
      padding:         { x: 24, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => {
      btn.setStyle({ color: '#ffffff', backgroundColor: '#302b63' });
      this.tweens.add({ targets: btn, scaleX: 1.06, scaleY: 1.06, duration: 80 });
    });
    btn.on('pointerout', () => {
      btn.setStyle({ color: '#ffd54f', backgroundColor: '#1e1b4b' });
      this.tweens.add({ targets: btn, scaleX: 1, scaleY: 1, duration: 80 });
    });
    btn.on('pointerdown', () => this.scene.start('MainScene'));

    // ─── Dica de controles ────────────────────────────────────────────────────
    this.add.text(width / 2, height - 36, 'WASD para mover  ·  Tiro automático  ·  Upgrades ao subir de nível', {
      fontSize:   '12px',
      fontFamily: 'Arial',
      color:      '#555577',
    }).setOrigin(0.5);
  }
}
