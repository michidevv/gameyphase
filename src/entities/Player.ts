import { VJoystickCursorKeys } from "../types/VirtualJoyStick";
import { Actor } from "./Actor";

const VELOCITY = 130;
export class Player extends Actor {
  private keys!: Record<
    "W" | "A" | "S" | "D",
    Phaser.Input.Keyboard.Key | undefined
  >;

  private playerState: "idle" | "run" = "idle";

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private cursorKeys?: VJoystickCursorKeys
  ) {
    super(scene, x, y, "tiles_spr_char");

    const keyboard = this.scene.input.keyboard;
    if (!keyboard && !cursorKeys) {
      console.error("No supported input method found!");
    }

    this.keys = {
      W: keyboard?.addKey("W"),
      A: keyboard?.addKey("A"),
      S: keyboard?.addKey("S"),
      D: keyboard?.addKey("D"),
    };

    this.getBody().setSize(16, 20);

    this.initAnimation();

    this.setDepth(1);
    this.spriteScale = 1.5;
    this.setScale(this.spriteScale);
  }

  private initAnimation() {
    if (!this.scene.anims.exists("idle")) {
      this.scene.anims.create({
        key: "idle",
        frames: this.scene.anims.generateFrameNumbers("tiles_spr_char", {
          frames: [72],
        }),
        frameRate: 8,
      });
    }

    if (!this.scene.anims.exists("run")) {
      this.scene.anims.create({
        key: "run",
        frames: this.scene.anims.generateFrameNumbers("tiles_spr_char", {
          frames: [72, 73, 74, 75],
        }),
        frameRate: 8,
      });
    }
  }

  private setPlayerState(nextState: typeof this.playerState) {
    switch (nextState) {
      case "idle": {
        this.playerState = "idle";
        this.anims.play("idle", true);
        break;
      }
      case "run": {
        this.playerState = "run";
        this.anims.isPlaying || this.anims.play("run", true);
        break;
      }
    }
  }

  private isUp() {
    return this.keys.W?.isDown || this.cursorKeys?.up.isDown;
  }

  private isLeft() {
    return this.keys.A?.isDown || this.cursorKeys?.left.isDown;
  }

  private isDown() {
    return this.keys.S?.isDown || this.cursorKeys?.down.isDown;
  }

  private isRight() {
    return this.keys.D?.isDown || this.cursorKeys?.right.isDown;
  }

  update() {
    this.getBody().setVelocity(0);
    if (this.isUp()) {
      this.body!.velocity.y = -VELOCITY;
    }

    if (this.isLeft()) {
      this.body!.velocity.x = -VELOCITY;
      this.checkFlip();
      this.getBody().setOffset(16, 12);
    }

    if (this.isDown()) {
      this.body!.velocity.y = VELOCITY;
    }

    if (this.isRight()) {
      this.body!.velocity.x = VELOCITY;
      this.checkFlip();
      this.getBody().setOffset(0, 12);
    }
    if (this.isUp() || this.isLeft() || this.isDown() || this.isRight()) {
      this.setPlayerState("run");
    } else {
      this.setPlayerState("idle");
    }
  }
}
