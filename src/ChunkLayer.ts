import { Texture } from "pixi.js";
import { createNoise3D } from "simplex-noise";
import Chunk from "./Chunk";
import { Tilemap } from "@pixi/tilemap";

export default class ChunkLayer extends Tilemap {
  static noise = createNoise3D();

  static pixelSize = 16;
  static noiseSize = 16;

  constructor(
    public chunkX: number,
    public chunkY: number,
    public layerZ: number
  ) {
    super(Texture.WHITE.baseTexture);
    this.x = this.chunkX * Chunk.chunkSize * ChunkLayer.pixelSize;
    this.y = this.chunkY * Chunk.chunkSize * ChunkLayer.pixelSize;
  }

  noise(x: number, y: number, z: number) {
    return (
      ChunkLayer.noise(
        (this.chunkX * Chunk.chunkSize + x) / ChunkLayer.noiseSize,
        (this.chunkY * Chunk.chunkSize + y) / ChunkLayer.noiseSize,
        z / ChunkLayer.noiseSize
      ) + 1
    );
  }

  async generateChunkLayer() {
    await new Promise((resolve) => setTimeout(resolve, 0));

    for (let x = 0; x < Chunk.chunkSize; x++) {
      for (let y = 0; y < Chunk.chunkSize; y++) {
        const value = this.noise(x, y, this.layerZ);

        if (value > this.layerZ / Chunk.chunkSize) {
          this.tile(0, x * ChunkLayer.pixelSize, y * ChunkLayer.pixelSize);
        }
      }
    }
    
    this.cacheAsBitmap = true;
  }
}
