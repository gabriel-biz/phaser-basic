function loadKenneySprites(scene) {
  scene.load.atlas(
    'kenney',
    '/assets/sprites/kenney_rpg/Spritesheet/roguelikeSheet_transparent.png',
    '/assets/sprites/kenney_rpg/Spritesheet/roguelikeSheet.json'
  );
}

function getKenneyFrame(name) {
  return `kenney_${name}`;
}
