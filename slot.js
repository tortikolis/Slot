//create PIXI aliases
const { Application, loader, Sprite, Container, Texture } = PIXI;
const resources = loader.resources;

const APP_WIDTH = 770;
const APP_HEIGHT = 600;

//create PIXI app
const app = new Application(APP_WIDTH, APP_HEIGHT, {
  backgroundColor: 0x202020,
  transparent: true
});
//appends it to HTML
document.body.appendChild(app.view);

//loads images
loader.add("assets/images/images.json").load(setup);

function setup() {
  const SYMBOL_IDS = [
    "chibuca.png",
    "luke.png",
    "storm.png",
    "syth.png",
    "yoda.png"
  ];
  const REEL_COUNT = 5;
  const REEL_COLLECTION_COUNT = 2;
  const SYMBOLS_IN_COLLECTION_COUNT = 3;
  const MARGIN = 20;
  const SHOWN_REELS_HEIGHT = 470;
  const textureID = resources["assets/images/images.json"].textures;
  const startBtnTexture = textureID["Replay_BTN.png"];
  const display1Texture = textureID["balance_display.png"];
  const display2Texture = textureID["bet_display.png"];
  const plusTexture = textureID["Forward_BTN.png"];
  const minusTexture = textureID["Backward_BTN.png"];

  //create reel structure
  const allReelsContainer = new Container();

  //build reels
  for (let i = 0; i < REEL_COUNT; i++) {
    const reelContainer = new Container();

    //build reel symbol colections inside every reel
    for (let j = 0; j < REEL_COLLECTION_COUNT; j++) {
      const reelCollectionContainer = new Container();

      //build symbols inside collections
      for (let k = 0; k < SYMBOLS_IN_COLLECTION_COUNT; k++) {
        const randomSymbolIndex =
          SYMBOL_IDS[Math.floor(Math.random() * SYMBOL_IDS.length)];
        const texture = textureID[randomSymbolIndex];
        const symbol = new Sprite(texture);

        symbol.y = (symbol.height + MARGIN) * k + MARGIN;
        reelCollectionContainer.addChild(symbol);
      }

      reelCollectionContainer.y = (reelCollectionContainer.height + MARGIN) * j;
      reelContainer.addChild(reelCollectionContainer);
    }

    reelContainer.x = (reelContainer.width + MARGIN) * i + MARGIN;
    allReelsContainer.addChild(reelContainer);
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

  //display balance
  const displayBalanceContainer = new Container();
  const balanceDisplay = new Sprite(display1Texture);
  const titleTextStyle = new PIXI.TextStyle({
    fontFamily: "Verdana",
    fontWeight: "bold",
    fontSize: 14,
    fill: 0xffffff
  });
  const displayTextStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: 64,
    fill: 0xffffff
  });

  const balanceAmount = new PIXI.Text(100, displayTextStyle);

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
  const betAmount = new PIXI.Text(1, displayTextStyle);

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
}
