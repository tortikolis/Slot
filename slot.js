//create PIXI aliases
let Application = PIXI.Application;
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;
let Container = PIXI.Container;

//create PIXI app
const app = new Application(800, 600, {
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
  const textureID = PIXI.loader.resources["assets/images/images.json"].textures;

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

        symbol.y = symbol.height * k;
        reelCollectionContainer.addChild(symbol);
      }

      reelCollectionContainer.y = reelCollectionContainer.height * j;
      reelContainer.addChild(reelCollectionContainer);
    }

    reelContainer.x = reelContainer.width * i;
    allReelsContainer.addChild(reelContainer);
  }

  //add all main container to stage
  app.stage.addChild(allReelsContainer);
}
