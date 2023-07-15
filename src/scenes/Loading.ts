import { Text } from "../ui/Text";
import { getTranslation } from "../utils/i18n";
import { SCENES } from "./scenes";

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super(SCENES.loading);
  }

  preload() {
    new Text(
      this,
      this.game.scale.width / 2,
      this.game.scale.height * 0.2,
      getTranslation("loading"),
      { fontSize: 28 }
    )
      .setAlign("center")
      .setOrigin(0.5);
    this.load.baseURL = "./assets/";
    this.load.image({
      key: "tiles",
      url: "tilemaps/tiles/dungeon-16-16.png",
    });
    this.load.tilemapTiledJSON("dungeon", "tilemaps/json/dungeon.json");
    this.load.spritesheet("tiles_spr", "tilemaps/tiles/dungeon-16-16.png", {
      frameHeight: 16,
      frameWidth: 16,
    });
    this.load.spritesheet(
      "tiles_spr_char",
      "tilemaps/tiles/dungeon-16-16.png",
      {
        frameHeight: 32,
        frameWidth: 16,
      }
    );
    this.load.plugin(
      "rexvirtualjoystickplugin",
      "scripts/rexvirtualjoystickplugin.min.js"
    );
  }

  create() {
    this.scene.start(SCENES.playground);
    this.scene.start(SCENES.hud);
  }
}
