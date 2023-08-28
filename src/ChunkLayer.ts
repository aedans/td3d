import { Container, FORMATS, Sprite, Texture } from "pixi.js";
import World from "./World";

export default class ChunkLayer extends Container {
  constructor(
    public chunkX: number,
    public chunkY: number,
    public layerZ: number
  ) {
    super();
    this.x = this.chunkX * World.chunkSize * World.pixelSize;
    this.y = this.chunkY * World.chunkSize * World.pixelSize;
  }

  async generateChunkLayer(world: World) {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const buffer = new Uint8Array(World.chunkSize * World.chunkSize * 4);
    let index = 0;

    for (let y = 0; y < World.chunkSize; y++) {
      for (let x = 0; x < World.chunkSize; x++) {
        if (
          world.getTile(
            this.chunkX * World.chunkSize + x,
            this.chunkY * World.chunkSize + y,
            this.layerZ
          )
        ) {
          buffer[index] = 0;
          buffer[index + 1] = 0;
          buffer[index + 2] = 255;
          buffer[index + 3] = 255;
        }

        index += 4;
      }
    }

    const texture = Texture.fromBuffer(
      buffer,
      World.chunkSize,
      World.chunkSize,
      {
        format: FORMATS.RGBA,
      }
    );

    const sprite = new Sprite(texture);
    sprite.scale.set(World.pixelSize);

    this.addChild(sprite);
  }
}
