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
document.body.appendChild(app.view);
//app.renderer.backgroundColor = 0x00000000;
