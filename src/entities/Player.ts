import { Text } from "../ui/Text";
import { Actor } from "./Actor";

const VELOCITY = 130;
export class Player extends Actor {
  private keys!: Record<
    "W" | "A" | "S" | "D",
    Phaser.Input.Keyboard.Key | undefined
  >;

  private hpValue: Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "a-king");

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

    this.getBody().setSize(30, 30);
    this.getBody().setOffset(8, 0);

    this.initAnimation();

    this.hpValue = new Text(
      this.scene,
      this.x,
      this.y - this.height * 0.4,
      this.hp.toString()
    ).setFontSize(9);
  }

  private initAnimation() {
    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNames("a-king", {
        prefix: "idle-",
        end: 0,
      }),
      frameRate: 8,
    });

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
      this.anims.isPlaying || this.anims.play("idle", true);
    }

    this.hpValue
      .setPosition(this.x, this.y - this.height * 0.4)
      .setOrigin(0.8, 0.5);
  }

  getDamage(value?: number): void {
    super.getDamage(value);
    this.hpValue.setText(this.hp.toString());
  }
}
