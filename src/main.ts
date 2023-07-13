import Phaser from "phaser";
import { LoadingScene } from "./scenes/Loading";
import { PlaygroundScene } from "./scenes/Playground";
import { HudScene } from "./scenes/Hud";

const config: Phaser.Types.Core.GameConfig = {
  parent: "app",
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: false,
    pixelArt: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [LoadingScene, PlaygroundScene, HudScene],
};

export default new Phaser.Game(config);
