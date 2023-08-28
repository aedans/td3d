import { createNoise2D } from "simplex-noise";

export default class World {
  static noise = createNoise2D();

  public static noiseSize = 256;
  public static chunkHeight = 64;
  public static chunkSize = 1024;
  public static pixelSize = 16;

  constructor() {}

  getTile(x: number, y: number, z: number) {
    const height =
      (World.noise(x / World.noiseSize, y / World.noiseSize) + 1) / 2;
    return height * World.chunkHeight > z;
  }
}
