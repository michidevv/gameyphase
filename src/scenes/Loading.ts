export class LoadingScene extends Phaser.Scene {
  constructor() {
    super("loading-scene");
  }

  preload() {
    this.load.baseURL = "/assets/";
    this.load.atlas(
      "a-king",
      "spritesheets/a-king.png",
      "spritesheets/a-king_atlas.json"
    );
    this.load.image({
      key: "tiles",
      url: "tilemaps/tiles/dungeon-16-16.png",
    });
    this.load.tilemapTiledJSON("dungeon", "tilemaps/json/dungeon.json");
    this.load.spritesheet("tiles_spr", "tilemaps/tiles/dungeon-16-16.png", {
      frameHeight: 16,
      frameWidth: 16,
    });
  }

  create() {
    this.scene.start("playground-scene");
    this.scene.start("hud-scene");
  }
}
