import { Physics } from "phaser";

class Chest extends Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    // scene.add.existing(this);
    // scene.physics.add.existing(this);
    scene.physics.add.sprite(x, y, "tiles_spr", 595).setScale(1.5);
    (this.body as Physics.Arcade.Body).setAllowGravity(false);
  }
}
