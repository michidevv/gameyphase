import { Scene, Tilemaps } from "phaser";
import { Player } from "../entities/Player";

export class PlaygroundScene extends Scene {
  private player!: Player;
  private map!: Tilemaps.Tilemap;
  private tileset!: Tilemaps.Tileset;
  private groundLayer!: Tilemaps.TilemapLayer;
  private wallsLayer!: Tilemaps.TilemapLayer;

  constructor() {
    super("playground-scene");
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
  }

  update(time: number, delta: number): void {
    this.player.update();
  }
}
