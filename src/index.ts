import { addStats } from "pixi-stats";
import { UPDATE_PRIORITY } from "pixi.js";
import App from "./App";
import Input from "./Input";
import Viewport from "./Viewport";
import ChunkManager from "./ChunkManager";
import World from "./World";

const app = new App();

document.body.appendChild(app.view as unknown as Node);
const stats = addStats(document, app);
(stats as any).stats.showPanel(1);
app.ticker.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);

const input = new Input();

addEventListener("keydown", (e) => input.setKey(e, true));
addEventListener("keyup", (e) => input.setKey(e, false));

const viewport = new Viewport(input);

app.ticker.add((delta) => viewport.update(delta));

const world = new World();

const manager = new ChunkManager(world);
app.stage.addChild(...manager.containers);

viewport.onViewportMove((currentX, currentY, currentScale) =>
  manager.onViewportMove(currentX, currentY, currentScale)
);

while (true) {
  await manager.generateChunk(viewport.currentX, viewport.currentY);
}
