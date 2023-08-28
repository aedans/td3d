export default class Input {
  isLeftPressed = false;
  isRightPressed = false;
  isUpPressed = false;
  isDownPressed = false;

  setKey(e: KeyboardEvent, bool: boolean) {
    if (e.key == "ArrowRight") {
      this.isRightPressed = bool;
    } else if (e.key == "ArrowLeft") {
      this.isLeftPressed = bool;
    } else if (e.key == "ArrowUp") {
      this.isUpPressed = bool;
    } else if (e.key == "ArrowDown") {
      this.isDownPressed = bool;
    }
  }
}
