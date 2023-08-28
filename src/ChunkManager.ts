import { ColorMatrixFilter, Container } from "pixi.js";
import Chunk from "./Chunk";
import World from "./World";
import Player from "./Player";

export default class ChunkManager {
  chunks: Map<string, Chunk> = new Map();
  containers: Container[] = [];

  constructor(public world: World) {
    for (let z = 0; z < World.chunkHeight; z++) {
      const container = new Container();
      const filter = new ColorMatrixFilter();
      filter.tint(16 * z);
      container.filters = [filter];
      this.containers.push(container);
    }
  }

  createChunk(chunkX: number, chunkY: number) {
    chunkX = Math.floor(chunkX);
    chunkY = Math.floor(chunkY);

    const key = Chunk.id({ chunkX, chunkY });
    const chunk = this.chunks.get(key);
    if (chunk) {
      return chunk;
    }

    const newChunk = new Chunk(chunkX, chunkY);
    this.chunks.set(key, newChunk);

    for (let i = 0; i < World.chunkHeight; i++) {
      this.containers[i].addChild(newChunk.chunkLayers[i]);
    }

    return newChunk;
  }

  destroyChunk(chunkX: number, chunkY: number) {
    chunkX = Math.floor(chunkX);
    chunkY = Math.floor(chunkY);

    const key = Chunk.id({ chunkX, chunkY });
    const chunk = this.chunks.get(key);

    if (!chunk) {
      return;
    }

    this.chunks.delete(key);

    for (let i = 0; i < World.chunkHeight; i++) {
      this.containers[i].removeChild(chunk.chunkLayers[i]);
    }

    chunk.destroyChunk();
  }

  generateChunk(x: number, y: number) {
    const generating = [...this.chunks.values()].filter((x) => !x.generated);

    if (generating.length == 0) {
      return new Promise((resolve) => setTimeout(resolve, 0));
    }

    generating.sort((a, b) => {
      const aX = Math.abs((a.chunkX + 0.5) - x);
      const aY = Math.abs((a.chunkY + 0.5) - y);
      const bX = Math.abs((b.chunkX + 0.5) - x);
      const bY = Math.abs((b.chunkY + 0.5) - y);
      return Math.sqrt(aX * aX + aY * aY) - Math.sqrt(bX * bX + bY * bY);
    });

    return generating[0].generateChunk(this.world);
  }

  onPlayerMove(player: Player) {
    const factor = World.chunkSize * World.pixelSize;
    const scale = 1 / (1 - player.z / 32);

    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    const pixelX = player.x * World.pixelSize;
    const pixelY = player.y * World.pixelSize;

    const minX = Math.floor((pixelX - halfWidth * scale) / factor);
    const maxX = Math.ceil((pixelX + halfWidth * scale) / factor);

    const minY = Math.floor((pixelY - halfHeight * scale) / factor);
    const maxY = Math.ceil((pixelY + halfHeight * scale) / factor);

    for (let z = 0; z < World.chunkHeight; z++) {
      const container = this.containers[z];

      const relativeScale = 1 + (z - player.z) / 32;
      container.scale.set(relativeScale, relativeScale);

      container.x = halfWidth + -pixelX * container.scale.x;
      container.y = halfHeight + -pixelY * container.scale.y;
    }

    for (const key of this.chunks.keys()) {
      const [x, y] = key.split(",").map((x) => Number(x));
      if (x < minX || x > maxX || y < minY || y >= maxY) {
        this.destroyChunk(x, y);
      }
    }

    const chunks = [] as Chunk[];
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        chunks.push(this.createChunk(x, y));
      }
    }

    for (const chunk of chunks) {
      const id = Chunk.id(chunk);
      if (!this.chunks.has(id)) {
        this.chunks.set(id, chunk);
      }
    }
  }
}
