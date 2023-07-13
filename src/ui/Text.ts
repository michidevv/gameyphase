import { GameObjects, Scene } from "phaser";

export class Text extends GameObjects.Text {
  constructor(scene: Scene, x: number, y: number, text: string) {
    super(scene, x, y, text, {
      fontFamily: "RetroFont",
      fontSize: "calc(100dvw / 43)",
      color: "#fff",
      stroke: "#000",
      strokeThickness: 3,
    });

    this.setOrigin(0, 0);
    scene.add.existing(this);
  }
}
