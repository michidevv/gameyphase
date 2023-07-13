import { Actor } from "./Actor";

const VELOCITY = 130;
export class Player extends Actor {
  private keys!: Record<
    "W" | "A" | "S" | "D",
    Phaser.Input.Keyboard.Key | undefined
  >;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "king");

    const keyboard = this.scene.input.keyboard;
    if (!keyboard) {
      console.error("Keyboard controls are not supported!");
    }

    this.keys = {
      W: keyboard?.addKey("W"),
      A: keyboard?.addKey("A"),
      S: keyboard?.addKey("S"),
      D: keyboard?.addKey("D"),
    };

    const body = this.getBody();
    body.setSize(30, 30);
    body.setOffset(8, 0);

    this.initAnimation();
  }

  private initAnimation() {
    this.scene.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNames("a-king", {
        prefix: "run-",
        end: 7,
      }),
      frameRate: 8,
    });

    this.scene.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNames("a-king", {
        prefix: "attack-",
        end: 2,
      }),
      frameRate: 8,
    });
  }

  update() {
    this.getBody().setVelocity(0);
    if (this.keys.W?.isDown) {
      this.body!.velocity.y = -VELOCITY;
    }

    if (this.keys.A?.isDown) {
      this.body!.velocity.x = -VELOCITY;
      this.checkFlip();
      this.getBody().setOffset(48, 15);
    }

    if (this.keys.S?.isDown) {
      this.body!.velocity.y = VELOCITY;
    }

    if (this.keys.D?.isDown) {
      this.body!.velocity.x = VELOCITY;
      this.checkFlip();
      this.getBody().setOffset(15, 15);
    }
    if (
      this.keys.A?.isDown ||
      this.keys.D?.isDown ||
      this.keys.S?.isDown ||
      this.keys.W?.isDown
    ) {
      this.anims.isPlaying || this.anims.play("run", true);
    } else {
      this.anims.stop();
    }
  }
}
