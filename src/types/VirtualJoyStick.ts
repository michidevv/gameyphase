export type VJoystickCursorKeys = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
};

export type VirtualJoyStick = {
  createCursorKeys(): VJoystickCursorKeys;
  setVisible(visible?: boolean): VirtualJoyStick;
};
