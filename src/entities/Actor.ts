import { Physics } from "phaser";

export class Actor extends Physics.Arcade.Sprite {
  protected hp = 100;

  protected spriteScale = 1;

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

  getHpValue(): number {
    return this.hp;
  }

  protected checkFlip() {
    this.scaleX =
      (this.body?.velocity.x ?? 0) <= 0 ? -this.spriteScale : this.spriteScale;
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}
