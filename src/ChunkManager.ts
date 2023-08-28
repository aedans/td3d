import { Container } from "pixi.js";
import Chunk from "./Chunk";
import ChunkLayer from "./ChunkLayer";

export default class ChunkManager {
  chunks: Map<string, Chunk> = new Map();
  generated: Set<string> = new Set();
  containers: Container[] = [];

  constructor() {
    for (let z = 0; z < Chunk.chunkSize; z++) {
      const container = new Container();
      const scale = 1 + z / 32;
      container.scale.set(scale, scale);
      this.containers.push(container);
    }
  }

  createChunk(chunkX: number, chunkY: number) {
    chunkX = Math.floor(chunkX);
    chunkY = Math.floor(chunkY);

    const key = `${chunkX},${chunkY}`;
    const chunk = this.chunks.get(key);
    if (chunk) {
      return chunk;
    }

    const newChunk = new Chunk(chunkX, chunkY);
    this.chunks.set(key, newChunk);

    for (let i = 0; i < Chunk.chunkSize; i++) {
      this.containers[i].addChild(newChunk.chunkLayers[i]);
    }

    return newChunk;
  }

  destroyChunk(chunkX: number, chunkY: number) {
    chunkX = Math.floor(chunkX);
    chunkY = Math.floor(chunkY);

    const key = `${chunkX},${chunkY}`;
    const chunk = this.chunks.get(key);

    if (!chunk) {
      return;
    }

    this.chunks.delete(key);

    for (let i = 0; i < Chunk.chunkSize; i++) {
      this.containers[i].removeChild(chunk.chunkLayers[i]);
    }

    chunk.destroyChunk();
  }

  async onViewportMove(currentX: number, currentY: number) {
    const factor = Chunk.chunkSize * ChunkLayer.pixelSize;

    const minX = Math.floor((currentX - window.innerWidth / 2) / factor);
    const maxX = Math.ceil((currentX + window.innerWidth / 2) / factor);

    const minY = Math.floor((currentY - window.innerWidth / 2) / factor);
    const maxY = Math.ceil((currentY + window.innerHeight / 2) / factor);

    for (const container of this.containers) {
      container.x = window.innerWidth / 2 + -currentX * container.scale.x;
      container.y = window.innerHeight / 2 + -currentY * container.scale.y;
    }

    for (const key of this.chunks.keys()) {
      const [x, y] = key.split(",").map((x) => Number(x));
      if (x <= minX || x >= maxX || y <= minY || y >= maxY) {
        this.destroyChunk(x, y);
      }
    }

    const chunks = [] as Chunk[];
    for (let x = minX + 1; x < maxX; x++) {
      for (let y = minY + 1; y < maxY; y++) {
        chunks.push(this.createChunk(x, y));
      }
    }

    const toGenerate = chunks.filter(
      (chunk) => !this.generated.has(`${chunk.chunkX},${chunk.chunkY}`)
    );

    for (const chunk of toGenerate) {
      this.generated.add(`${chunk.chunkX},${chunk.chunkY}`);
    }

    toGenerate.sort((a, b) => {
      const size = Chunk.chunkSize * ChunkLayer.pixelSize;
      const aX = Math.abs((a.chunkX + 0.5) * size - currentX);
      const aY = Math.abs((a.chunkY + 0.5) * size - currentY);
      const bX = Math.abs((b.chunkX + 0.5) * size - currentX);
      const bY = Math.abs((b.chunkY + 0.5) * size - currentY);
      return Math.sqrt(aX * aX + aY * aY) - Math.sqrt(bX * bX + bY * bY);
    });

    for (const chunk of toGenerate) {
      await chunk.generateChunk();
    }
  }
}
