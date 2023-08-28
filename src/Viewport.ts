import Input from "./Input";

export type ViewportMoveListener = (currentX: number, currentY: number) => void;

export default class Viewport {
  currentX = 0;
  currentY = 0;

  viewportMoveListeners: ViewportMoveListener[] = [];

  constructor(public input: Input) {}

  onViewportMove(listener: ViewportMoveListener) {
    this.viewportMoveListeners.push(listener);
  }

  update(delta: number) {
    if (this.input.isRightPressed) {
      this.currentX += delta * 10;
    }
    if (this.input.isLeftPressed) {
      this.currentX -= delta * 10;
    }
    if (this.input.isUpPressed) {
      this.currentY -= delta * 10;
    }
    if (this.input.isDownPressed) {
      this.currentY += delta * 10;
    }

    for (const listener of this.viewportMoveListeners) {
      listener(this.currentX, this.currentY);
    }
  }
}
