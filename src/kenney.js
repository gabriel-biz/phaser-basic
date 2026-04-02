// ─── Mapeamento de nomes lógicos → índice de frame no spritesheet micro ──────
const MICRO_FRAMES = {
  player:       4,
  enemy_normal: 13,
  enemy_fast:   14,
  enemy_tank:   20,
  enemy_elite:  27,
  bullet:       99,
  coin:         39,
  heart:        102,
};

function loadKenneySprites(scene) {
  scene.load.spritesheet(
    'micro',
    '/assets/sprites/kenney_micro/tilemap.png',
    { frameWidth: 8, frameHeight: 8 },
  );
}

function getMicroFrame(name) {
  return MICRO_FRAMES[name] ?? 0;
}

const getKenneyFrame = getMicroFrame;

// ─── Toon Characters (Kenney) ─────────────────────────────────────────────────

function loadToonSprites(scene) {
  const base = '/assets/sprites/kenney_toon';

  scene.load.image('toon_player_idle', `${base}/player_idle.png`);
  for (let i = 0; i < 4; i++) scene.load.image(`toon_player_walk${i}`, `${base}/player_walk${i}.png`);

  scene.load.image('toon_enemy_normal_idle', `${base}/enemy_normal_idle.png`);
  for (let i = 0; i < 4; i++) scene.load.image(`toon_enemy_normal_walk${i}`, `${base}/enemy_normal_walk${i}.png`);

  scene.load.image('toon_enemy_fast_idle', `${base}/enemy_fast_idle.png`);
  for (let i = 0; i < 3; i++) scene.load.image(`toon_enemy_fast_run${i}`, `${base}/enemy_fast_run${i}.png`);

  scene.load.image('toon_enemy_tank_idle', `${base}/enemy_tank_idle.png`);
  for (let i = 0; i < 4; i++) scene.load.image(`toon_enemy_tank_walk${i}`, `${base}/enemy_tank_walk${i}.png`);

  scene.load.image('toon_enemy_elite_idle', `${base}/enemy_elite_idle.png`);
  for (let i = 0; i < 4; i++) scene.load.image(`toon_enemy_elite_walk${i}`, `${base}/enemy_elite_walk${i}.png`);
}

function createToonAnims(scene) {
  scene.anims.create({
    key: 'toon_player_walk',
    frames: [0,1,2,3].map(i => ({ key: `toon_player_walk${i}` })),
    frameRate: 8, repeat: -1,
  });
  scene.anims.create({
    key: 'toon_player_idle',
    frames: [{ key: 'toon_player_idle' }],
    frameRate: 1, repeat: -1,
  });

  scene.anims.create({
    key: 'toon_enemy_normal_walk',
    frames: [0,1,2,3].map(i => ({ key: `toon_enemy_normal_walk${i}` })),
    frameRate: 7, repeat: -1,
  });
  scene.anims.create({
    key: 'toon_enemy_normal_idle',
    frames: [{ key: 'toon_enemy_normal_idle' }],
    frameRate: 1, repeat: -1,
  });

  scene.anims.create({
    key: 'toon_enemy_fast_walk',
    frames: [0,1,2].map(i => ({ key: `toon_enemy_fast_run${i}` })),
    frameRate: 12, repeat: -1,
  });
  scene.anims.create({
    key: 'toon_enemy_fast_idle',
    frames: [{ key: 'toon_enemy_fast_idle' }],
    frameRate: 1, repeat: -1,
  });

  scene.anims.create({
    key: 'toon_enemy_tank_walk',
    frames: [0,1,2,3].map(i => ({ key: `toon_enemy_tank_walk${i}` })),
    frameRate: 4, repeat: -1,
  });
  scene.anims.create({
    key: 'toon_enemy_tank_idle',
    frames: [{ key: 'toon_enemy_tank_idle' }],
    frameRate: 1, repeat: -1,
  });

  scene.anims.create({
    key: 'toon_enemy_elite_walk',
    frames: [0,1,2,3].map(i => ({ key: `toon_enemy_elite_walk${i}` })),
    frameRate: 6, repeat: -1,
  });
  scene.anims.create({
    key: 'toon_enemy_elite_idle',
    frames: [{ key: 'toon_enemy_elite_idle' }],
    frameRate: 1, repeat: -1,
  });
}

export { loadKenneySprites, getMicroFrame, getKenneyFrame, loadToonSprites, createToonAnims };
