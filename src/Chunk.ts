import ChunkLayer from "./ChunkLayer";

export default class Chunk {
  public static chunkSize = 16;

  chunkLayers: ChunkLayer[] = [];

  constructor(public chunkX: number, public chunkY: number) {
    for (let z = 0; z < Chunk.chunkSize; z++) {
      this.chunkLayers.push(new ChunkLayer(chunkX, chunkY, z));
    }
  }

  async generateChunk() {
    for (const layer of this.chunkLayers) {
      await layer.generateChunkLayer();
    }
  }

  destroyChunk() {
    for (const layer of this.chunkLayers) {
      layer.destroy();
    }
  }
}
