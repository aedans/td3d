import { Texture } from "pixi.js";
import { createNoise2D } from "simplex-noise";
import { Tilemap } from "@pixi/tilemap";
import Chunk from "./Chunk";

export default class ChunkLayer extends Tilemap {
  static noise = createNoise2D();

  static chunkSize = 128;
  static pixelSize = 16;
  static noiseSize = 64;

  constructor(
    public chunkX: number,
    public chunkY: number,
    public layerZ: number
  ) {
    super(Texture.WHITE.baseTexture);
    this.x = this.chunkX * ChunkLayer.chunkSize * ChunkLayer.pixelSize;
    this.y = this.chunkY * ChunkLayer.chunkSize * ChunkLayer.pixelSize;
  }

  noise(x: number, y: number, z: number) {
    const height = (ChunkLayer.noise(
      (this.chunkX * ChunkLayer.chunkSize + x) / ChunkLayer.noiseSize,
      (this.chunkY * ChunkLayer.chunkSize + y) / ChunkLayer.noiseSize
    ) + 1) / 2;
    return height * Chunk.chunkHeight > z;
  }

  async generateChunkLayer() {
    let num = 0;

    for (let x = 0; x < ChunkLayer.chunkSize; x++) {
      for (let y = 0; y < ChunkLayer.chunkSize; y++) {
        num++;
        if (num > 1024) {
          await new Promise((resolve) => setTimeout(resolve, 0));
          num = 0;
        }

        if (this.noise(x, y, this.layerZ)) {
          this.tile(0, x * ChunkLayer.pixelSize, y * ChunkLayer.pixelSize);
        }
      }
    }

    this.cacheAsBitmap = true;
  }
}
