import { Actor } from "./Actor";
import { Player } from "./Player";

const AGR_RADIUS = 100;
export class Enemy extends Actor {
  constructor(
    private target: Player,
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    // scene.add.existing(this);
    // scene.physics.add.existing(this);

    this.getBody().setSize(16, 16);
    this.getBody().setOffset(0, 0);
  }

  preUpdate() {
    if (
      Phaser.Math.Distance.BetweenPoints(
        { x: this.x, y: this.y },
        { x: this.target.x, y: this.target.y }
      ) < AGR_RADIUS
    ) {
      this.getBody().setVelocity(
        this.target.x - this.x,
        this.target.y - this.y
      );
    } else {
      this.getBody().setVelocity(0);
    }
  }

  setTarget(target: Player) {
    this.target = target;
  }
}
