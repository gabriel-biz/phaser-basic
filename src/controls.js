// Esquema de controle escolhido pelo jogador. Lido por Player ao criar.
window.CONTROL_SCHEME = 'wasd'; // 'wasd' | 'arrows'

class ControlsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ControlsScene' });
  }

  create() {
    const { width, height } = this.scale;

    // ─── Fundo ────────────────────────────────────────────────────────────────
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0f0c29, 0x0f0c29, 0x302b63, 0x24243e, 1);
    bg.fillRect(0, 0, width, height);

    // Estrelas decorativas
    for (let i = 0; i < 80; i++) {
      const g = this.add.graphics();
      g.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.1, 0.6));
      g.fillCircle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.FloatBetween(0.5, 1.8),
      );
    }

    // ─── Título ───────────────────────────────────────────────────────────────
    this.add.text(width / 2, height / 2 - 160, 'CONTROLES', {
      fontSize: '42px',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#302b63',
      strokeThickness: 7,
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 108, 'Escolha o esquema de controle', {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: '#aaaacc',
    }).setOrigin(0.5);

    // ─── Opções ───────────────────────────────────────────────────────────────
    this._selected = window.CONTROL_SCHEME;

    const optionData = [
      { key: 'wasd', label: 'WASD', hint: 'W A S D para mover', x: width / 2 - 140 },
      { key: 'arrows', label: '← ↑ ↓ →', hint: 'Setas do teclado para mover', x: width / 2 + 140 },
    ];

    this._cards = {};

    for (const opt of optionData) {
      const card = this._buildCard(opt.x, height / 2, opt.key, opt.label, opt.hint);
      this._cards[opt.key] = card;
    }

    this._refreshCards();

    // ─── Botão Jogar ──────────────────────────────────────────────────────────
    const btn = this.add.text(width / 2, height / 2 + 130, '  ► JOGAR  ', {
      fontSize: '28px',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      color: '#ffd54f',
      stroke: '#000000',
      strokeThickness: 4,
      backgroundColor: '#1e1b4b',
      padding: { x: 24, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => {
      btn.setStyle({ color: '#ffffff', backgroundColor: '#302b63' });
      this.tweens.add({ targets: btn, scaleX: 1.06, scaleY: 1.06, duration: 80 });
    });
    btn.on('pointerout', () => {
      btn.setStyle({ color: '#ffd54f', backgroundColor: '#1e1b4b' });
      this.tweens.add({ targets: btn, scaleX: 1, scaleY: 1, duration: 80 });
    });
    btn.on('pointerdown', () => {
      window.CONTROL_SCHEME = this._selected;
      this.scene.start('MainScene');
    });

    // ─── Voltar ───────────────────────────────────────────────────────────────
    const back = this.add.text(width / 2, height - 36, '← Voltar ao menu', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: '#665599',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    back.on('pointerover', () => back.setStyle({ color: '#aaaacc' }));
    back.on('pointerout', () => back.setStyle({ color: '#665599' }));
    back.on('pointerdown', () => this.scene.start('StartScene'));
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  _buildCard(cx, cy, key, label, hint) {
    const W = 180, H = 140;
    const x = cx - W / 2;
    const y = cy - H / 2;

    const bg = this.add.graphics();

    const title = this.add.text(cx, cy - 24, label, {
      fontSize: '32px',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    const sub = this.add.text(cx, cy + 26, hint, {
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#aaaacc',
    }).setOrigin(0.5);

    // Área clicável invisível
    const zone = this.add.zone(cx, cy, W, H).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => {
      this._selected = key;
      this._refreshCards();
    });

    return { bg, title, sub, x, y, W, H, key };
  }

  _refreshCards() {
    for (const [key, card] of Object.entries(this._cards)) {
      const active = key === this._selected;

      card.bg.clear();
      if (active) {
        card.bg.lineStyle(2, 0xffd54f, 1);
        card.bg.fillStyle(0x302b63, 0.9);
      } else {
        card.bg.lineStyle(1, 0x444466, 0.8);
        card.bg.fillStyle(0x1a1a3a, 0.6);
      }
      card.bg.fillRoundedRect(card.x, card.y, card.W, card.H, 12);
      card.bg.strokeRoundedRect(card.x, card.y, card.W, card.H, 12);

      if (active) {
        card.title.setStyle({ color: '#ffd54f' });
        card.sub.setStyle({ color: '#ffffff' });
      } else {
        card.title.setStyle({ color: '#888899' });
        card.sub.setStyle({ color: '#555577' });
      }
    }
  }
}

export { ControlsScene };
