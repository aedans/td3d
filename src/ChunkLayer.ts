import { Container, Sprite, Texture, Ticker } from "pixi.js";
import { createNoise3D } from "simplex-noise";
import Chunk from "./Chunk";

export default class ChunkLayer extends Container {
  static noise = createNoise3D();

  static pixelSize = 16;
  static noiseSize = 16;

  constructor(
    public chunkX: number,
    public chunkY: number,
    public layerZ: number
  ) {
    super();
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
    await new Promise((resolve) => setTimeout(resolve, 5));

    for (let x = 0; x < Chunk.chunkSize; x++) {
      for (let y = 0; y < Chunk.chunkSize; y++) {
        const sprite = new Sprite(Texture.WHITE);
        const value = this.noise(x, y, this.layerZ);

        if (value > (this.layerZ / Chunk.chunkSize)) {
          sprite.x = x * ChunkLayer.pixelSize;
          sprite.y = y * ChunkLayer.pixelSize;
          sprite.tint = (this.layerZ / Chunk.chunkSize) * 256 << 8;
          this.addChild(sprite);
        }
      }
    }

    this.cacheAsBitmap = true;
  }
}
