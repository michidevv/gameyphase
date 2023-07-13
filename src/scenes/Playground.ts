import { Scene, Tilemaps } from "phaser";
import { Player } from "../entities/Player";
import { ObjectPoint } from "../types/ObjectPoint";
import { emitEvent } from "../utils/event";

export class PlaygroundScene extends Scene {
  private player!: Player;
  private map!: Tilemaps.Tilemap;
  private tileset!: Tilemaps.Tileset;
  private groundLayer!: Tilemaps.TilemapLayer;
  private wallsLayer!: Tilemaps.TilemapLayer;
  private chests!: Phaser.GameObjects.Sprite[];

  constructor() {
    super("playground-scene");
  }

  private initCamera() {
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(2);
  }

  private initChests() {
    const chestPoints = this.map.filterObjects(
      "Chests",
      (o) => o.name === "ChestPoint"
    ) as ObjectPoint[];

    this.chests = chestPoints.map((p) => {
      const chest = this.physics.add
        .sprite(p.x, p.y, "tiles_spr", 595)
        .setScale(1.5);
      chest.body.setAllowGravity(false);
      this.physics.add.overlap(this.player, chest, (_, ch) => {
        ch.destroy();
        emitEvent(this.game.events, { type: "chest-loot" });
        this.cameras.main.flash(200);
      });
      return chest;
    });
  }

  private initMap() {
    this.map = this.make.tilemap({
      key: "dungeon",
      tileWidth: 16,
      tileHeight: 16,
    });
    this.tileset = this.map.addTilesetImage(
      "dungeon",
      "tiles"
    ) as Tilemaps.Tileset;
    this.groundLayer = this.map.createLayer(
      "Ground",
      this.tileset
    ) as Tilemaps.TilemapLayer;
    this.wallsLayer = this.map.createLayer(
      "Walls",
      this.tileset
    ) as Tilemaps.TilemapLayer;
    this.wallsLayer.setCollisionByProperty({ collides: true });
    this.physics.world.setBounds(
      0,
      0,
      this.wallsLayer.width,
      this.wallsLayer.height
    );
    this.showDebugWalls();
  }

  private showDebugWalls() {
    const debugGraphics = this.add.graphics().setAlpha(0.7);
    this.wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48),
    });
  }

  create() {
    this.initMap();
    this.player = new Player(this, 200, 150);
    this.physics.add.collider(this.player, this.wallsLayer);
    this.initChests();
    this.initCamera();
  }

  update(time: number, delta: number): void {
    this.player.update();
  }
}
