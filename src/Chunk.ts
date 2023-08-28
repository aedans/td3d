import ChunkLayer from "./ChunkLayer";

export default class Chunk {
  public static chunkHeight = 16;

  chunkLayers: ChunkLayer[] = [];
  generated: boolean = false;

  constructor(public chunkX: number, public chunkY: number) {
    for (let z = 0; z < Chunk.chunkHeight; z++) {
      this.chunkLayers.push(new ChunkLayer(chunkX, chunkY, z));
    }
  }

  public static id(chunk: { chunkX: number; chunkY: number }): string {
    return `${chunk.chunkX},${chunk.chunkY}`;
  }

  async generateChunk() {
    for (const layer of this.chunkLayers) {
      await layer.generateChunkLayer();
    }

    this.generated = true;
  }

  destroyChunk() {
    for (const layer of this.chunkLayers) {
      layer.destroy();
    }
  }
}
