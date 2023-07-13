import { Text } from "./Text";

export type ScoreOp = "increase" | "decrease" | "set";

export class Score extends Text {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private scoreValue = 0
  ) {
    super(scene, x, y, `Score: ${scoreValue}`);
    // scene.add.existing(this);
  }

  changeValue(op: ScoreOp, value: number) {
    switch (op) {
      case "increase":
        this.scoreValue += value;
        break;
      case "decrease":
        this.scoreValue -= value;
        break;
      case "set":
        this.scoreValue = value;
        break;
      default:
        console.warn("Unknown op", op);
        break;
    }

    this.setText(`Score ${this.scoreValue}`);
  }

  getValue(): number {
    return this.scoreValue;
  }
}
