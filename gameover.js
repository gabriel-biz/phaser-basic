class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  /**
   * @param {{ kills: number, time: string, level: number, wave: number }} data
   */
  create(data) {
    const { width, height } = this.scale;
    const { kills = 0, time = '0:00', level = 1, wave = 1 } = data;

    // ─── Fundo ────────────────────────────────────────────────────────────────
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.88);
    bg.fillRect(0, 0, width, height);

    // ─── Título ───────────────────────────────────────────────────────────────
    const title = this.add.text(width / 2, 90, 'GAME OVER', {
      fontSize:        '56px',
      fontFamily:      'Arial',
      fontStyle:       'bold',
      color:           '#f44336',
      stroke:          '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: title, alpha: 1, duration: 400, ease: 'Power2' });

    // ─── Painel de estatísticas ───────────────────────────────────────────────
    const pw = 300, ph = 200;
    const px = (width - pw) / 2;
    const py = 170;

    const panel = this.add.graphics().setAlpha(0);
    panel.fillStyle(0x1e1b4b, 0.92);
    panel.fillRoundedRect(px, py, pw, ph, 12);
    panel.lineStyle(1, 0x444477, 1);
    panel.strokeRoundedRect(px, py, pw, ph, 12);

    this.tweens.add({ targets: panel, alpha: 1, duration: 400, delay: 150 });

    const rows = [
      ['Nível alcançado',  String(level)],
      ['Inimigos mortos',  String(kills)],
      ['Tempo de jogo',    time         ],
      ['Wave final',       String(wave) ],
    ];

    rows.forEach(([label, value], i) => {
      const ry = py + 28 + i * 38;

      this.add.text(px + 18, ry, label, {
        fontSize: '15px', fontFamily: 'Arial', color: '#9999bb',
      }).setAlpha(0).setName(`row${i}`);

      this.add.text(px + pw - 18, ry, value, {
        fontSize: '15px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold',
      }).setOrigin(1, 0).setAlpha(0).setName(`val${i}`);
    });

    // Anima as linhas surgindo uma a uma
    this.children.getAll().filter(c => c.name?.startsWith('row') || c.name?.startsWith('val'))
      .forEach((obj, i) => {
        this.tweens.add({ targets: obj, alpha: 1, duration: 250, delay: 300 + i * 80 });
      });

    // ─── Botões ───────────────────────────────────────────────────────────────
    const retryBtn = this._makeButton(width / 2, 420, '↺  JOGAR NOVAMENTE', '#ffd54f');
    retryBtn.on('pointerdown', () => this.scene.start('MainScene'));

    const menuBtn = this._makeButton(width / 2, 480, '←  MENU PRINCIPAL', '#888899', '16px');
    menuBtn.on('pointerdown', () => this.scene.start('StartScene'));

    // Entrada com fade
    [retryBtn, menuBtn].forEach((b, i) => {
      b.setAlpha(0);
      this.tweens.add({ targets: b, alpha: 1, duration: 300, delay: 700 + i * 100 });
    });
  }

  _makeButton(x, y, label, color, fontSize = '24px') {
    const btn = this.add.text(x, y, `  ${label}  `, {
      fontSize,
      fontFamily:      'Arial',
      fontStyle:       'bold',
      color,
      stroke:          '#000000',
      strokeThickness: 3,
      backgroundColor: '#1e1b4b',
      padding:         { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => {
      btn.setStyle({ color: '#ffffff', backgroundColor: '#302b63' });
      this.tweens.add({ targets: btn, scaleX: 1.05, scaleY: 1.05, duration: 70 });
    });
    btn.on('pointerout', () => {
      btn.setStyle({ color, backgroundColor: '#1e1b4b' });
      this.tweens.add({ targets: btn, scaleX: 1, scaleY: 1, duration: 70 });
    });

    return btn;
  }
}
