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
  controlBg.height = APP_WIDTH - SHOWN_REELS_HEIGHT;
  controlBg.tint = 0x050505;

  controlContainer.addChild(controlBg);

  //add all main container to stage
  app.stage.addChild(allReelsContainer);
  app.stage.addChild(controlContainer);
}
