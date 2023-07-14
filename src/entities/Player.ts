import { VJoystickCursorKeys } from "../types/VirtualJoyStick";
import { emitEvent } from "../utils/event";
import { Actor } from "./Actor";

const VELOCITY = 130;
export class Player extends Actor {
  private keys!: Record<
    "W" | "A" | "S" | "D" | "Space",
    Phaser.Input.Keyboard.Key | undefined
  >;

  private playerState: "idle" | "run" | "attack" = "idle";

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private cursorKeys?: VJoystickCursorKeys
  ) {
    super(scene, x, y, "a-king");

    const keyboard = this.scene.input.keyboard;
    if (!keyboard && !cursorKeys) {
      console.error("No supported input method found!");
    }

    this.keys = {
      W: keyboard?.addKey("W"),
      A: keyboard?.addKey("A"),
      S: keyboard?.addKey("S"),
      D: keyboard?.addKey("D"),
      Space: keyboard?.addKey("SPACE"),
    };

    this.getBody().setSize(30, 30);
    this.getBody().setOffset(8, 0);

    this.initAnimation();

    this.keys.Space?.on("down", () => {
      this.setPlayerState("attack");
      emitEvent(this.scene.game.events, { type: "attack" });
    });

    this.setDepth(1);
  }

  private initAnimation() {
    if (!this.scene.anims.exists("idle")) {
      this.scene.anims.create({
        key: "idle",
        frames: this.scene.anims.generateFrameNames("a-king", {
          prefix: "idle-",
          end: 0,
        }),
        frameRate: 8,
      });
    }

    if (!this.scene.anims.exists("run")) {
      this.scene.anims.create({
        key: "run",
        frames: this.scene.anims.generateFrameNames("a-king", {
          prefix: "run-",
          end: 7,
        }),
        frameRate: 8,
      });
    }

    if (!this.scene.anims.exists("attack")) {
      this.scene.anims.create({
        key: "attack",
        frames: this.scene.anims.generateFrameNames("a-king", {
          prefix: "attack-",
          end: 2,
        }),
        frameRate: 8,
      });
    }
  }

  private setPlayerState(nextState: typeof this.playerState) {
    switch (nextState) {
      case "idle": {
        if (this.playerState === "attack" && this.anims.isPlaying) {
          return;
        } else {
          this.playerState = "idle";
          this.anims.play("idle", true);
        }
        break;
      }
      case "run": {
        this.playerState = "run";
        this.anims.isPlaying || this.anims.play("run", true);
        break;
      }
      case "attack": {
        this.playerState = "attack";
        this.anims.play("attack", true);
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
      this.getBody().setOffset(48, 15);
    }

    if (this.isDown()) {
      this.body!.velocity.y = VELOCITY;
    }

    if (this.isRight()) {
      this.body!.velocity.x = VELOCITY;
      this.checkFlip();
      this.getBody().setOffset(15, 15);
    }
    if (this.isUp() || this.isLeft() || this.isDown() || this.isRight()) {
      this.setPlayerState("run");
    } else {
      this.setPlayerState("idle");
    }
  }
}
