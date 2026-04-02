// ─── Mapeamento de nomes lógicos → índice de frame no spritesheet micro ──────
// Spritesheet: colored_tilemap_packed.png (128×80px, 16×10 tiles de 8×8px cada)
// Índice = linha * 16 + coluna
const MICRO_FRAMES = {
  player:       4,   // linha 0, col 4  – guerreiro laranja/amarelo
  enemy_normal: 13,  // linha 0, col 13 – monstro vermelho com olho amarelo
  enemy_fast:   14,  // linha 0, col 14 – humanoide laranja/roxo
  enemy_tank:   20,  // linha 1, col 4  – goblin verde
  enemy_elite:  27,  // linha 1, col 11 – demônio roxo/laranja
  bullet:       99,  // linha 6, col 3  – orbe mágico laranja
  coin:         39,  // linha 2, col 7  – lanterna dourada (orbe de XP)
  heart:        102, // linha 6, col 6  – coração vermelho
};

/**
 * Carrega o spritesheet kenney_micro-roguelike na cena.
 * @param {Phaser.Scene} scene
 */
function loadKenneySprites(scene) {
  scene.load.spritesheet(
    'micro',
    '/assets/sprites/kenney_micro/tilemap.png',
    { frameWidth: 8, frameHeight: 8 },
  );
}

/**
 * Retorna o índice de frame no spritesheet 'micro' para o nome dado.
 * @param {string} name
 * @returns {number}
 */
function getMicroFrame(name) {
  return MICRO_FRAMES[name] ?? 0;
}

// Alias mantido para compatibilidade com código existente
const getKenneyFrame = getMicroFrame;

export { loadKenneySprites, getMicroFrame, getKenneyFrame };
