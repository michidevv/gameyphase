import { Scene, Tilemaps } from "phaser";
import { Player } from "../entities/Player";
import { ObjectPoint } from "../types/ObjectPoint";
import { emitEvent } from "../utils/event";
import { Enemy } from "../entities/Enemy";
import { VirtualJoyStick } from "../types/VirtualJoyStick";
import { SCENES } from "./scenes";
import { attachTouchListener } from "../utils/touchDetector";
import { COLORS } from "../ui/colors";

export class PlaygroundScene extends Scene {
  private player!: Player;
  private map!: Tilemaps.Tilemap;
  private tileset!: Tilemaps.Tileset;
  private groundLayer!: Tilemaps.TilemapLayer;
  private wallsLayer!: Tilemaps.TilemapLayer;
  private chests!: Phaser.GameObjects.Sprite[];
  private enemies!: Enemy[];
  private virtualJoystick?: VirtualJoyStick;

  constructor() {
    super(SCENES.playground);
    attachTouchListener(() => this.virtualJoystick?.setVisible(true));
  }

  private initCamera() {
    this.cameras.main.setZoom(2);
  }

  private initChests() {
    const chestPoints = this.map.filterObjects(
      "Chests",
      (o) => o.name === "ChestPoint"
    ) as ObjectPoint[];

    this.chests = chestPoints.map((p, i) => {
      const chest = this.physics.add
        .sprite(p.x, p.y, "tiles_spr", 595)
        .setScale(1.5);
      chest.body.setAllowGravity(false);
      const collider = this.physics.add.overlap(this.player, chest, () => {
        // emitEvent(this.game.events, { type: "chest-loot" });
        // this.cameras.main.flash(200);
        chest.setTexture("tiles_spr", 597);
        collider.active = false;
        emitEvent(this.game.events, {
          type: "show-text-dialog",
          data: { text: `note_${i + 1}` },
        });
        const timer = this.time.addEvent({
          delay: 1000,
          loop: true,
          callback: () => {
            if (
              !Phaser.Geom.Rectangle.Overlaps(
                this.player.getBounds(),
                chest.getBounds()
              )
            ) {
              timer.destroy();
              emitEvent(this.game.events, { type: "hide-text-dialog" });
              collider.active = true;
            }
          },
        });
      });

      return chest;
    });
  }

  private initTouchControls() {
    const joystickPlugin = this.plugins.get("rexvirtualjoystickplugin");
    if (!joystickPlugin) {
      return;
    }

    const radius = 40;
    this.virtualJoystick = (joystickPlugin as any).add(this, {
      radius,
      x: this.cameras.main.displayWidth / 2 + 60,
      y:
        this.cameras.main.displayHeight + this.cameras.main.displayHeight / 3.5,
      base: this.add.circle(0, 0, radius, COLORS.grey, 0.3),
      thumb: this.add.circle(0, 0, radius / 2, COLORS.lightGrey, 0.4),
    });
    this.virtualJoystick?.setVisible(false);
  }

  private initPlayer() {
    this.player = new Player(
      this,
      200,
      300,
      this.virtualJoystick?.createCursorKeys()
    );
    this.physics.add.collider(this.player, this.wallsLayer);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
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

  private initEnemies() {
    const enemyPoints = this.map.filterObjects(
      "Enemies",
      (o) => o.name === "EnemyPoint"
    ) as ObjectPoint[];

    this.enemies = enemyPoints.map((p) =>
      new Enemy(this.player, this, p.x, p.y, "tiles_spr", 251)
        .setName(p.id.toString())
        .setScale(1.5)
    );
    this.physics.add.collider(this.enemies, this.wallsLayer);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.player, this.enemies, (p) =>
      (p as Player).getDamage(1)
    );
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
    this.initCamera();
    this.initTouchControls();
    this.initPlayer();
    this.initEnemies();
    this.initChests();
  }

  update() {
    this.player.update();
  }
}
