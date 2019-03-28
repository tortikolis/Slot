import Reel from "./entities/Reel.js";

//create PIXI aliases
const { Application, loader, Sprite, Container, Texture } = PIXI;
const resources = loader.resources;

const APP_WIDTH = 770;
const APP_HEIGHT = 600;
const SHOWN_REELS_HEIGHT = 470;
const SYMBOL_IDS = [
  "chibuca.png",
  "luke.png",
  "storm.png",
  "syth.png",
  "yoda.png"
];
let textureIDs;

const allReels = [];
let spinning = false;
let spinNum = 0;
let bet = 1;
let balance = 100;
let balanceAmount;
let data;
let paySound;
let stopSound;
let startSound;

//fetching data from data.json (probably data seved by server)
fetch("./data/data.json")
  .then(res => res.json())
  .then(res => {
    data = res;
    //loads resources and starts setup
    loader.add("assets/images/images.json").load(setup);
  });

sounds.load([
  "assets/sounds/pay.wav",
  "assets/sounds/blaster-firing.wav",
  "assets/sounds/lightsaber.mp3"
]);
sounds.whenLoaded = soundSetup;

function soundSetup() {
  paySound = sounds["assets/sounds/pay.wav"];
  stopSound = sounds["assets/sounds/blaster-firing.wav"];
  startSound = sounds["assets/sounds/lightsaber.mp3"];
}

//create PIXI app
const app = new Application(APP_WIDTH, APP_HEIGHT, {
  backgroundColor: 0x202020,
  transparent: true
});
//appends it to HTML
document.body.appendChild(app.view);

function setup() {
  console.log(data);
  textureIDs = resources["assets/images/images.json"].textures;
  const REEL_COUNT = 5;
  const REEL_COLLECTION_COUNT = 2;
  const SYMBOLS_IN_COLLECTION_COUNT = 3;
  const MARGIN = 20;
  const startBtnTexture = textureIDs["Replay_BTN.png"];
  const display1Texture = textureIDs["balance_display.png"];
  const display2Texture = textureIDs["bet_display.png"];
  const plusTexture = textureIDs["Forward_BTN.png"];
  const minusTexture = textureIDs["Backward_BTN.png"];

  //create reel structure
  const allReelsContainer = new Container();

  //build reels
  for (let i = 0; i < REEL_COUNT; i++) {
    const reelContainer = new Container();
    const reel = new Reel(reelContainer, i * 200);

    //build reel symbol colections inside every reel
    for (let j = 0; j < REEL_COLLECTION_COUNT; j++) {
      const reelCollectionContainer = new Container();

      //build symbols inside collections
      for (let k = 0; k < SYMBOLS_IN_COLLECTION_COUNT; k++) {
        const randomSymbolIndex =
          SYMBOL_IDS[Math.floor(Math.random() * SYMBOL_IDS.length)];
        const texture = textureIDs[randomSymbolIndex];
        const symbol = new Sprite(texture);

        symbol.y = (symbol.height + MARGIN) * k + MARGIN;
        reelCollectionContainer.addChild(symbol);
      }

      reelCollectionContainer.y = (reelCollectionContainer.height + MARGIN) * j;
      reel.reelCollections.push(reelCollectionContainer);
      reelContainer.addChild(reelCollectionContainer);
    }

    reelContainer.x = (reelContainer.width + MARGIN) * i + MARGIN;
    allReelsContainer.addChild(reelContainer);
    allReels.push(reel);
  }

  //build controlContainer
  const controlContainer = new Container();
  controlContainer.y = SHOWN_REELS_HEIGHT;

  const controlBg = new Sprite(Texture.WHITE);
  controlBg.width = APP_WIDTH;
  controlBg.height = APP_HEIGHT - SHOWN_REELS_HEIGHT;
  controlBg.tint = 0x050505;

  const startBtn = new Sprite(startBtnTexture);
  startBtn.x = APP_WIDTH - startBtn.width - MARGIN;
  startBtn.y = controlBg.height - startBtn.height;
  startBtn.interactive = true;
  startBtn.buttonMode = true;

  //display balance
  const displayBalanceContainer = new Container();
  const balanceDisplay = new Sprite(display1Texture);

  const displayTextStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: 64,
    fill: 0xffffff
  });

  balanceAmount = new PIXI.Text(balance, displayTextStyle);

  displayBalanceContainer.x =
    APP_WIDTH - balanceDisplay.width - startBtn.width - 60;
  displayBalanceContainer.y =
    (controlBg.height - balanceDisplay.height - 30) / 2;
  balanceDisplay.y = 20;
  balanceAmount.y = 55;
  balanceAmount.x = 50;

  displayBalanceContainer.addChild(balanceDisplay);
  displayBalanceContainer.addChild(balanceAmount);

  //display bet amount
  const displayBetContainer = new Container();
  const betDisplay = new Sprite(display2Texture);
  const minusBtn = new Sprite(minusTexture);
  const plusBtn = new Sprite(plusTexture);
  const betAmount = new PIXI.Text(bet, displayTextStyle);

  minusBtn.interactive = true;
  minusBtn.buttonMode = true;
  plusBtn.interactive = true;
  plusBtn.buttonMode = true;

  displayBetContainer.x = MARGIN;
  displayBetContainer.y = (controlBg.height - betDisplay.height + 5) / 2;
  betDisplay.x = 50;
  minusBtn.y = 50;
  plusBtn.x = betDisplay.width + plusBtn.width;
  plusBtn.y = 50;
  betAmount.y = 35;
  betAmount.x = 105;

  displayBetContainer.addChild(betDisplay);
  displayBetContainer.addChild(minusBtn);
  displayBetContainer.addChild(plusBtn);
  displayBetContainer.addChild(betAmount);

  controlContainer.addChild(controlBg);
  controlContainer.addChild(startBtn);
  controlContainer.addChild(displayBalanceContainer);
  controlContainer.addChild(displayBetContainer);

  //add all main container to stage
  app.stage.addChild(allReelsContainer);
  app.stage.addChild(controlContainer);

  //add event listeners to buttons
  startBtn.addListener("pointerdown", () => {
    if (spinning) return;
    spinning = true;

    balance -= bet;
    balanceAmount.text = balance;
    tweenReels(allReels);
  });

  minusBtn.addListener("pointerdown", () => {
    if (bet <= 1) return;
    bet--;
    betAmount.text = bet;
  });

  plusBtn.addListener("pointerdown", () => {
    if (bet > balance) return;
    bet++;
    betAmount.text = bet;
  });

  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  updateReelPositions();
  TWEEN.update();
}

function updateReelPositions() {
  allReels.forEach((reel, i) => {
    const { reelCollections } = reel;

    for (let j = 1; j <= reelCollections.length; j++) {
      const reelCollection = reelCollections[j - 1];
      const tweenPosition = reel.position.pos;
      const tweenToPosition = reel.tweenTo.pos;
      const roundedTweenPosition = Math.floor(tweenPosition);
      const roundedPrevTweenPos = Math.floor(reel.previousPosition);

      //sets position of every collection on screen, if it goes out of screen set it on top
      reelCollection.y =
        ((tweenPosition + j) % 2) * SHOWN_REELS_HEIGHT - SHOWN_REELS_HEIGHT;

      //detect if collection has gone outside of view and swap
      if (
        roundedTweenPosition !== roundedPrevTweenPos &&
        (roundedTweenPosition + j) % 2 === 0
      ) {
        const collectionSymbols = reelCollection.children;
        //check if its last spin and set predifined textures else set random ones
        if (roundedTweenPosition + 1 === tweenToPosition) {
          const predefinedReelImageData = data.spins[spinNum].wheelSymbols[i];
          swapTextures(collectionSymbols, predefinedReelImageData);
        } else {
          swapTextures(collectionSymbols);
        }
      }

      reel.previousPosition = tweenPosition;
    }
  });
}

function swapTextures(symbols, predifinedSymbolData) {
  symbols.forEach((symbol, i) => {
    const randomId = Math.floor(Math.random() * SYMBOL_IDS.length);
    let id = predifinedSymbolData ? predifinedSymbolData[i] : randomId;
    const texture = textureIDs[SYMBOL_IDS[id]];

    symbol.texture = texture;
  });
}

//activates tweening for all reels
function tweenReels(reels) {
  reels.forEach((reel, i) => {
    reel
      .tween()
      .start()
      .onStart(() => {
        startSound.play();
      })
      .onComplete(() => {
        stopSound.play();
        i === reels.length - 1 ? onSpinComplete() : null;
      });
    reel.tweenTo.pos += 20;
  });
}

function onSpinComplete() {
  spinning = false;
  paySound.play();
  updateBalanceAmount();
  spinNum++;
}

function updateBalanceAmount() {
  balance += data.spins[spinNum].winAmount * bet;
  balanceAmount.text = balance;
}
