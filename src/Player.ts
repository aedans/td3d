import Input from "./Input";
import World from "./World";

export type PlayerMoveListener = (player: Player) => void;

export default class Player {
  playerMoveListeners: PlayerMoveListener[] = [];
  x: number = 0;
  y: number = 0;
  z: number = 0;

  constructor(public input: Input, public speed: number) {}
  
  onPlayerMove(listener: PlayerMoveListener) {
    this.playerMoveListeners.push(listener);
  }

  update(world: World, delta: number) {
    if (this.input.isRightPressed) {
      this.x += delta * this.speed;
    }
    if (this.input.isLeftPressed) {
      this.x -= delta * this.speed;
    }
    if (this.input.isUpPressed) {
      this.y -= delta * this.speed;
    }
    if (this.input.isDownPressed) {
      this.y += delta * this.speed;
    }

    if (!world.getTile(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z - 1))) {
      this.z -= delta;
    }

    if (world.getTile(Math.floor(this.x), Math.floor(this.y), this.z)) {
      this.z = Math.floor(this.z + 1); 
    }

    for (const listener of this.playerMoveListeners) {
      listener(this);
    }
  }
}
