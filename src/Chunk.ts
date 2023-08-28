import ChunkLayer from "./ChunkLayer";
import World from "./World";

export default class Chunk {
  chunkLayers: ChunkLayer[] = [];
  generated: boolean = false;

  constructor(public chunkX: number, public chunkY: number) {
    for (let z = 0; z < World.chunkHeight; z++) {
      this.chunkLayers.push(new ChunkLayer(chunkX, chunkY, z));
    }
  }

  public static id(chunk: { chunkX: number; chunkY: number }): string {
    return `${chunk.chunkX},${chunk.chunkY}`;
  }

  async generateChunk(world: World) {
    for (const layer of this.chunkLayers) {
      await layer.generateChunkLayer(world);
    }

    this.generated = true;
  }

  destroyChunk() {
    for (const layer of this.chunkLayers) {
      layer.destroy();
    }
  }
}
