import { Application } from "pixi.js";

export default class App extends Application {
  constructor() {
    super({
      resolution: devicePixelRatio,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    this.stage.sortableChildren = true;
  }
}
