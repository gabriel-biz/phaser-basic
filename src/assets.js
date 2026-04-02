const ASSETS = {
  player: {
    size: 32,
    draw: (g, size) => {
      g.fillStyle(0x00d4ff, 1);
      g.fillCircle(size / 2, size / 2, size / 2 - 2);
      g.fillStyle(0x00ffff, 0.6);
      g.fillCircle(size / 2 - 4, size / 2 - 4, 6);
      g.lineStyle(2, 0xffffff, 0.8);
      g.strokeCircle(size / 2, size / 2, size / 2 - 2);
    },
  },
  enemy_normal: {
    size: 32,
    draw: (g, size) => {
      g.fillStyle(0xe53935, 1);
      g.fillRect(4, 4, size - 8, size - 8);
      g.fillStyle(0xff7672, 0.7);
      g.fillCircle(size / 2 - 4, size / 2 - 4, 5);
      g.lineStyle(2, 0xb71c1c, 1);
      g.strokeRect(4, 4, size - 8, size - 8);
      g.lineStyle(1, 0x000000, 0.5);
      g.lineBetween(size/2 - 4, 8, size/2 - 4, size/2 - 2);
      g.lineBetween(size/2 + 4, 8, size/2 + 4, size/2 - 2);
      g.fillStyle(0x000000, 0.8);
      g.fillCircle(size/2 - 4, size/2 - 2, 2);
      g.fillCircle(size/2 + 4, size/2 - 2, 2);
    },
  },
  enemy_fast: {
    size: 24,
    draw: (g, size) => {
      g.fillStyle(0xff9800, 1);
      g.fillTriangle(size/2, 2, size - 4, size - 6, 4, size - 6);
      g.fillStyle(0xffc107, 0.6);
      g.fillCircle(size / 2, size / 2 + 2, 4);
      g.lineStyle(1, 0x000000, 0.6);
      g.lineBetween(size/2 - 3, 8, size/2 - 3, 12);
      g.lineBetween(size/2 + 3, 8, size/2 + 3, 12);
      g.fillStyle(0x000000, 0.9);
      g.fillCircle(size/2 - 3, 10, 2);
      g.fillCircle(size/2 + 3, 10, 2);
    },
  },
  enemy_tank: {
    size: 40,
    draw: (g, size) => {
      g.fillStyle(0x7b1fa2, 1);
      g.fillRoundedRect(2, 2, size - 4, size - 4, 8);
      g.fillStyle(0xba68c8, 0.5);
      g.fillCircle(size / 2, size / 2, size / 4);
      g.lineStyle(3, 0x4a148c, 1);
      g.strokeRoundedRect(2, 2, size - 4, size - 4, 8);
      g.lineStyle(2, 0x000000, 0.4);
      g.strokeRoundedRect(8, 8, size - 16, size - 16, 4);
    },
  },
  enemy_elite: {
    size: 36,
    draw: (g, size) => {
      g.fillStyle(0xffd600, 1);
      g.fillCircle(size / 2, size / 2, size / 2 - 2);
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(size / 2, size / 2, size / 3);
      g.fillStyle(0xffd600, 1);
      g.fillCircle(size / 2, size / 2, size / 5);
      g.lineStyle(3, 0xffeb3b, 1);
      g.strokeCircle(size / 2, size / 2, size / 2 - 2);
      g.lineStyle(2, 0xff8f00, 1);
      g.strokeCircle(size / 2, size / 2, size / 2 - 5);
      g.fillStyle(0x000000, 0.8);
      g.fillCircle(size/2 - 4, size/2 - 2, 3);
      g.fillCircle(size/2 + 4, size/2 - 2, 3);
    },
  },
  bullet: {
    size: 12,
    draw: (g, size) => {
      g.fillStyle(0x00e676, 1);
      g.fillCircle(size / 2, size / 2, size / 2);
      g.fillStyle(0xb9f6ca, 0.8);
      g.fillCircle(size / 2 - 2, size / 2 - 2, 3);
    },
  },
  coin: {
    size: 14,
    draw: (g, size) => {
      g.fillStyle(0xffd700, 1);
      g.fillCircle(size / 2, size / 2, size / 2);
      g.fillStyle(0xfff59d, 0.8);
      g.fillCircle(size / 2 - 2, size / 2 - 2, 4);
      g.lineStyle(1, 0xffa000, 1);
      g.strokeCircle(size / 2, size / 2, size / 2);
      g.fillStyle(0xffa000, 0.9);
      g.fillCircle(size / 2, size / 2, 3);
    },
  },
  heart: {
    size: 16,
    draw: (g, size) => {
      g.fillStyle(0xf44336, 1);
      const s = size - 4;
      g.fillCircle(s / 2 + 2, s / 3, s / 4);
      g.fillCircle(s / 2 - 2 + 4, s / 3, s / 4);
      g.fillTriangle(s / 2 + 2, s / 2 + 2, 2, s / 2 + 4, s, s / 2 + 4);
    },
  },
};

function generateAsset(scene, name) {
  const def = ASSETS[name];
  if (!def) return null;
  
  const key = `asset_${name}`;
  if (scene.textures.exists(key)) return key;
  
  const gfx = scene.add.graphics();
  def.draw(gfx, def.size);
  gfx.generateTexture(key, def.size, def.size);
  gfx.destroy();
  
  return key;
}

function preloadAllAssets(scene) {
  for (const name of Object.keys(ASSETS)) {
    generateAsset(scene, name);
  }
}

export { generateAsset, preloadAllAssets, ASSETS };
