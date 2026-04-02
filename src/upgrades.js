// ─── Pool de upgrades ─────────────────────────────────────────────────────────
// Cada entrada tem: label, desc e apply(player, bulletManager).

const UPGRADES = [
  {
    id:    'speed',
    label: '+Velocidade',
    desc:  'Velocidade de movimento +40',
    apply(player, _bm) {
      player.speed += 40;
    },
  },
  {
    id:    'max_hp',
    label: '+Vida Máxima',
    desc:  'Vida máxima +1 e cura 1 HP',
    apply(player, _bm) {
      player.maxHp += 1;
      player.hp = Math.min(player.hp + 1, player.maxHp);
    },
  },
  {
    id:    'heal',
    label: 'Cura',
    desc:  'Recupera 2 HP imediatamente',
    apply(player, _bm) {
      player.hp = Math.min(player.hp + 2, player.maxHp);
    },
  },
  {
    id:    'fire_rate',
    label: '+Taxa de Tiro',
    desc:  'Intervalo entre tiros -100ms',
    apply(_player, bm) {
      bm.fireRate = Math.max(150, bm.fireRate - 100);
    },
  },
  {
    id:    'bullet_speed',
    label: '+Vel. Projétil',
    desc:  'Velocidade das balas +80',
    apply(_player, bm) {
      bm.bulletSpeed += 80;
    },
  },
  {
    id:    'damage',
    label: '+Dano',
    desc:  'Dano por projétil +1',
    apply(_player, bm) {
      bm.bulletDamage += 1;
    },
  },
];

// ─── UpgradeMenu ──────────────────────────────────────────────────────────────

class UpgradeMenu {
  /**
   * @param {Phaser.Scene}  scene
   * @param {Player}        player
   * @param {BulletManager} bulletManager
   */
  constructor(scene, player, bulletManager) {
    this.scene         = scene;
    this.player        = player;
    this.bulletManager = bulletManager;
    this._isOpen       = false;
    this._container    = null;
    this._keyRefs      = [];
  }

  open() {
    if (this._isOpen) return;
    this._isOpen = true;

    this.scene.physics.world.pause();
    this.scene._upgrading = true;

    const picks = Phaser.Utils.Array.Shuffle([...UPGRADES]).slice(0, 3);
    this._buildUI(picks);
  }

  // ─── UI ─────────────────────────────────────────────────────────────────────

  _buildUI(picks) {
    const { width, height } = this.scene.scale;

    this._container = this.scene.add.container(0, 0);

    // Fundo escuro semi-transparente
    const overlay = this.scene.add.graphics();
    overlay.fillStyle(0x000000, 0.78);
    overlay.fillRect(0, 0, width, height);
    this._container.add(overlay);

    // Título
    const title = this.scene.add.text(width / 2, 110, 'ESCOLHA UM UPGRADE', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffd54f',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);
    this._container.add(title);

    const subtitle = this.scene.add.text(width / 2, 150, 'Clique no card ou pressione 1 · 2 · 3', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: '#aaaacc',
    }).setOrigin(0.5);
    this._container.add(subtitle);

    // Teclas de atalho
    ['ONE', 'TWO', 'THREE'].forEach((code, i) => {
      const key = this.scene.input.keyboard.addKey(code);
      key.once('down', () => this._pick(picks[i]));
      this._keyRefs.push(key);
    });

    // Cards
    const cardW = 185, cardH = 170, gap = 20;
    const totalW = cardW * 3 + gap * 2;
    const startX = (width - totalW) / 2;
    const cardY   = height / 2 - cardH / 2 + 20;

    picks.forEach((upgrade, i) => {
      this._buildCard(upgrade, i + 1, startX + i * (cardW + gap), cardY, cardW, cardH);
    });
  }

  _buildCard(upgrade, num, x, y, w, h) {
    const scene  = this.scene;
    const BORDER = 0x9c27b0;
    const HOVER  = 0xce93d8;
    const BG     = 0x1e1b4b;
    const BGHOV  = 0x2d2a6e;

    const drawBg = (color, border) => {
      bg.clear();
      bg.fillStyle(color, 1);
      bg.fillRoundedRect(x, y, w, h, 10);
      bg.lineStyle(2, border, 1);
      bg.strokeRoundedRect(x, y, w, h, 10);
    };

    const bg = scene.add.graphics();
    drawBg(BG, BORDER);
    this._container.add(bg);

    // Número de atalho
    const numText = scene.add.text(x + w / 2, y + 30, `${num}`, {
      fontSize: '30px',
      fontFamily: 'Arial',
      color: '#ffd54f',
    }).setOrigin(0.5);
    this._container.add(numText);

    // Nome
    const label = scene.add.text(x + w / 2, y + 72, upgrade.label, {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this._container.add(label);

    // Descrição
    const desc = scene.add.text(x + w / 2, y + 100, upgrade.desc, {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#aaaacc',
      wordWrap: { width: w - 24 },
      align: 'center',
    }).setOrigin(0.5, 0);
    this._container.add(desc);

    // Zona interativa invisível sobre o card inteiro
    const zone = scene.add.zone(x, y, w, h)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true });

    zone.on('pointerdown', () => this._pick(upgrade));
    zone.on('pointerover', () => drawBg(BGHOV, HOVER));
    zone.on('pointerout',  () => drawBg(BG, BORDER));
    this._container.add(zone);
  }

  // ─── Lógica ──────────────────────────────────────────────────────────────────

  _pick(upgrade) {
    if (!this._isOpen) return; // guard contra duplo disparo
    upgrade.apply(this.player, this.bulletManager);
    this._close();
  }

  _close() {
    this._isOpen = false;
    this.scene._upgrading = false;
    this.scene.physics.world.resume();

    // Remove os key listeners restantes
    this._keyRefs.forEach(k => this.scene.input.keyboard.removeKey(k, true));
    this._keyRefs = [];

    this._container.destroy();
    this._container = null;
  }
}
