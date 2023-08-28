import { addStats } from "pixi-stats";
import { UPDATE_PRIORITY } from "pixi.js";
import App from "./App";
import Input from "./Input";
import Viewport from "./Viewport";
import ChunkManager from "./ChunkManager";

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

const manager = new ChunkManager();
app.stage.addChild(...manager.containers)

viewport.onViewportMove((currentX, currentY) =>
  manager.onViewportMove(currentX, currentY)
);
