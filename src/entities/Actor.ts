import { Physics } from "phaser";

export class Actor extends Physics.Arcade.Sprite {
  protected hp = 100;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.getBody().setAllowGravity(false);
  }

  getDamage(value?: number) {
    this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 3,
      yoyo: true,
      alpha: 0.5,
      onStart: () => {
        if (value) {
          this.hp -= value;
        }
      },
      onComplete: () => {
        this.setAlpha(1);
      },
    });
  }

  getHpValue(): number {
    return this.hp;
  }

  protected checkFlip() {
    this.scaleX = (this.body?.velocity.x ?? 0) <= 0 ? -1 : 1;
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}
