import { Container } from "pixi.js";
import Chunk from "./Chunk";
import World from "./World";
import Player from "./Player";

export default class ChunkManager {
  chunks: Map<string, Chunk> = new Map();
  containers: Container[] = [];

  constructor(public world: World) {
    for (let z = 0; z < World.chunkHeight; z++) {
      const container = new Container();
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

    console.log(`Creating chunk ${chunkX},${chunkY}`)

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

    console.log(`Destroying chunk ${chunkX},${chunkY}`)

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
      const aX = Math.abs(a.chunkX + 0.5 - x);
      const aY = Math.abs(a.chunkY + 0.5 - y);
      const bX = Math.abs(b.chunkX + 0.5 - x);
      const bY = Math.abs(b.chunkY + 0.5 - y);
      return Math.sqrt(aX * aX + aY * aY) - Math.sqrt(bX * bX + bY * bY);
    });

    return generating[0].generateChunk(this.world);
  }

  getScale(base: number, z: number) {
    const cameraDistance = 4;
    const cameraDOF = 64;
    const diff = base - z;
    return (1 / (-diff + cameraDistance)) * cameraDOF;
  }

  onPlayerMove(player: Player) {
    const invScale = 1 / this.getScale(0, World.chunkHeight);

    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    const minX = Math.floor((player.x - halfWidth * invScale) / World.chunkSize);
    const maxX = Math.ceil((player.x + halfWidth * invScale) / World.chunkSize);

    const minY = Math.floor((player.y - halfHeight * invScale) / World.chunkSize);
    const maxY = Math.ceil((player.y + halfHeight * invScale) / World.chunkSize);

    for (let z = 0; z < World.chunkHeight; z++) {
      const container = this.containers[z];

      const relativeScale = this.getScale(z, player.z);
      container.scale.set(relativeScale, relativeScale);

      container.x = halfWidth + -player.x * container.scale.x;
      container.y = halfHeight + -player.y * container.scale.y;

      const cameraBackClip = -4;
      if (player.z - z < cameraBackClip) {
        container.visible = false;
      } else {
        container.visible = true;
      }
    }

    for (const key of this.chunks.keys()) {
      const [x, y] = key.split(",").map((x) => Number(x));
      if (x < minX || x > maxX || y < minY || y > maxY) {
        this.destroyChunk(x, y);
      }
    }

    const chunks = [] as Chunk[];
    for (let x = minX; x < maxX; x++) {
      for (let y = minY; y < maxY; y++) {
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
