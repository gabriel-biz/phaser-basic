import { createWriteStream } from 'fs';
import { writeFileSync } from 'fs';

const SPRITESHEET = './assets/sprites/kenney_rpg/Spritesheet/roguelikeSheet_transparent.png';

const SPRITES = {
  player: { x: 1, y: 1 },
  enemy_normal: { x: 9, y: 1 },
  enemy_fast: { x: 10, y: 1 },
  enemy_tank: { x: 11, y: 1 },
  enemy_elite: { x: 12, y: 1 },
  bullet: { x: 3, y: 4 },
  coin: { x: 4, y: 4 },
  heart: { x: 5, y: 4 },
};

const CONFIG = {
  columns: 17,
  tileSize: 16,
  margin: 1,
};

const atlas = {
  frames: {},
  meta: {
    app: 'Kenney RPG Pack',
    version: '1.0',
    image: 'roguelikeSheet_transparent.png',
    format: 'RGBA8888',
    size: { w: 968, h: 526 },
    scale: 1,
  },
};

for (const [name, pos] of Object.entries(SPRITES)) {
  const frame = {
    frame: {
      x: pos.x * (CONFIG.tileSize + CONFIG.margin),
      y: pos.y * (CONFIG.tileSize + CONFIG.margin),
      w: CONFIG.tileSize,
      h: CONFIG.tileSize,
    },
    rotated: false,
    trimmed: false,
    spriteSourceSize: { x: 0, y: 0, w: CONFIG.tileSize, h: CONFIG.tileSize },
    sourceSize: { w: CONFIG.tileSize, h: CONFIG.tileSize },
  };
  atlas.frames[`kenney_${name}`] = frame;
}

writeFileSync(
  './assets/sprites/kenney_rpg/Spritesheet/roguelikeSheet.json',
  JSON.stringify(atlas, null, 2)
);

console.log('Atlas JSON gerado!');
