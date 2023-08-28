import { addStats } from "pixi-stats";
import { UPDATE_PRIORITY } from "pixi.js";
import App from "./App";
import Input from "./Input";
import ChunkManager from "./ChunkManager";
import World from "./World";
import Player from "./Player";

const app = new App();

document.body.appendChild(app.view as unknown as Node);
const stats = addStats(document, app);
(stats as any).stats.showPanel(1);
app.ticker.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);

const input = new Input();

addEventListener("keydown", (e) => input.setKey(e, true));
addEventListener("keyup", (e) => input.setKey(e, false));

const world = new World();

const player = new Player(input, .5);

app.ticker.add((delta) => player.update(world, delta));

const manager = new ChunkManager(world);
app.stage.addChild(...manager.containers);

player.onPlayerMove((player) => manager.onPlayerMove(player));

while (true) {
  await manager.generateChunk(player.x / World.chunkSize, player.y / World.chunkSize);
}
