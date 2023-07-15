import { GameObjects, Scene } from "phaser";

export class Text extends GameObjects.Text {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    text: string,
    style?: Phaser.Types.GameObjects.Text.TextStyle
  ) {
    super(scene, x, y, text, {
      fontFamily: "RetroFont",
      fontSize: 24,
      color: "#fff",
      stroke: "#000",
      strokeThickness: 3,
      ...style,
    });

    this.setOrigin(0, 0);
    scene.add.existing(this);
  }
}
