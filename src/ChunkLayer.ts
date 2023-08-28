import { Texture } from "pixi.js";
import { Tilemap } from "@pixi/tilemap";
import World from "./World";

export default class ChunkLayer extends Tilemap {
  constructor(
    public chunkX: number,
    public chunkY: number,
    public layerZ: number
  ) {
    super(Texture.WHITE.baseTexture);
    this.x = this.chunkX * World.chunkSize * World.pixelSize;
    this.y = this.chunkY * World.chunkSize * World.pixelSize;
  }

  async generateChunkLayer(world: World) {
    let num = 0;

    for (let x = 0; x < World.chunkSize; x++) {
      for (let y = 0; y < World.chunkSize; y++) {
        num++;
        if (num > 1024) {
          await new Promise((resolve) => setTimeout(resolve, 0));
          num = 0;
        }

        if (
          world.getTile(
            this.chunkX * World.chunkSize + x,
            this.chunkY * World.chunkSize + y,
            this.layerZ
          )
        ) {
          this.tile(0, x * World.pixelSize, y * World.pixelSize);
        }
      }
    }

    this.cacheAsBitmap = true;
  }
}
