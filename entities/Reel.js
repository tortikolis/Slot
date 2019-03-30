const START_TWEEN_POSITION = 0;
const END_TWEEN_POSITION = 20;
const TWEEN_DURATION = 5000;

class Reel {
  constructor(container, delay) {
    this.container = container;
    this.reelCollections = [];
    this.position = { pos: START_TWEEN_POSITION };
    this.previousPosition = null;
    this.tweenTo = { pos: END_TWEEN_POSITION };
    this.delay = delay;
    this.sameAsLastFrame = this.position.pos === this.previousPosition;
    this.stopChange = false;
    this.blur = new PIXI.filters.BlurFilter();
  }

  tween() {
    return (
      new TWEEN.Tween(this.position)
        .to(this.tweenTo, TWEEN_DURATION)
        .easing(TWEEN.Easing.Quadratic.InOut)
        //.easing(TWEEN.Easing.Bounce.Out)
        .delay(this.delay)
    );
  }
}

export default Reel;
