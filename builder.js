import {canvas, ctx} from "./createCanvas.js";
import {
  Level,
  Tile,
  BasicTile,
  FinishTile,
  LavaTile,
  RespawnTile,
  BounceTile,
  EnemyTile
} from "./tilemap.js";
var gameWidth = 30;
var gameHeight = 10;
var zoom = 1;
var selection = 1;
var map = [];
for (let y = 0; y < gameHeight; y++) {
  map.push(new Array(gameWidth).fill(0));
}
function resizeMapArray() {
  const oldWidth = map[0].length;
  const oldHeight = map.length;
  const newArr = [];
  for (let y = 0; y < gameHeight; y++) {
    const row = [];
    for (let x = 0; x < gameWidth; x++) {
      const inRange = x < oldWidth && y < oldHeight;
      const tile = inRange ? map[y][x] : 0;
      row.push(tile);
    }
    newArr.push(row);
  }
  map = newArr;
}
const builderDiv = document.createElement("div");
builderDiv.id = "builderItems";
document.body.appendChild(builderDiv);
const outputDiv = document.createElement("div");
outputDiv.id = "outputDiv";
document.body.appendChild(outputDiv);
const title = document.createElement("p");
title.innerHTML = "Build Menu";
builderDiv.appendChild(title);
function addBuildItem(node, titleStr = void 0) {
  const title2 = document.createElement("p");
  title2.innerHTML = titleStr ? titleStr : "";
  title2.className = "buildItemLabel";
  const div = document.createElement("div");
  div.className = "buildItemContainer";
  if (titleStr)
    div.appendChild(title2);
  div.appendChild(node);
  builderDiv.appendChild(div);
}
const widthInput = document.createElement("input");
widthInput.type = "number";
widthInput.value = `${gameWidth}`;
widthInput.min = "1";
addBuildItem(widthInput, "width");
const heightInput = document.createElement("input");
heightInput.type = "number";
heightInput.value = `${gameHeight}`;
heightInput.min = "1";
addBuildItem(heightInput, "height");
const setSize = document.createElement("button");
setSize.innerHTML = "set size";
setSize.onclick = () => {
  gameWidth = parseInt(widthInput.value);
  gameHeight = parseInt(heightInput.value);
  updateGameSize();
};
addBuildItem(setSize);
const setClear = document.createElement("div");
setClear.className = "tileSelection";
setClear.onclick = () => {
  selection = 0;
};
addBuildItem(setClear, "clear");
const setBasic = document.createElement("div");
setBasic.className = "tileSelection";
setBasic.style.backgroundColor = BasicTile.color;
setBasic.onclick = () => {
  selection = 1;
};
addBuildItem(setBasic, "basic");
const setFinish = document.createElement("div");
setFinish.className = "tileSelection";
setFinish.style.backgroundColor = FinishTile.color;
setFinish.onclick = () => {
  selection = 2;
};
addBuildItem(setFinish, "finish");
const setLava = document.createElement("div");
setLava.className = "tileSelection";
setLava.style.backgroundColor = LavaTile.color;
setLava.onclick = () => {
  selection = 3;
};
addBuildItem(setLava, "lava");
const setRespawn = document.createElement("div");
setRespawn.className = "tileSelection";
setRespawn.style.backgroundColor = RespawnTile.color;
setRespawn.onclick = () => {
  selection = 4;
};
addBuildItem(setRespawn, "respawn");
const setBounce = document.createElement("div");
setBounce.className = "tileSelection";
setBounce.style.backgroundColor = BounceTile.color;
setBounce.onclick = () => {
  selection = 5;
};
addBuildItem(setBounce, "bounce");
const setEnemy = document.createElement("div");
setEnemy.className = "tileSelection";
setEnemy.style.backgroundColor = EnemyTile.color;
setEnemy.onclick = () => {
  selection = 6;
};
addBuildItem(setEnemy, "enemy");
window.addEventListener("wheel", (ev) => {
  const deltaY = ev.deltaY / 100;
  const speed = 4;
  zoom *= 0.99 ** (deltaY * speed);
  updateGameSize();
});
var mouseX = 0;
var mouseY = 0;
var mousePressed = false;
canvas.addEventListener("mousemove", (ev) => {
  const canvasWidth = canvas.width * zoom * Tile.size;
  const canvasHeight = canvas.height * zoom * Tile.size;
  const xPadding = (window.innerWidth - canvasWidth) / 2;
  const yPadding = (window.innerHeight - canvasHeight) / 2;
  const x = Math.floor((ev.clientX - xPadding) / (Tile.size * zoom));
  const y = Math.floor((ev.clientY - yPadding) / (Tile.size * zoom));
  if (x > gameWidth - 1 || x < 0)
    return;
  if (y > gameHeight - 1 || y < 0)
    return;
  mouseX = x;
  mouseY = y;
});
canvas.addEventListener("mousedown", () => {
  mousePressed = true;
});
canvas.addEventListener("mouseup", () => {
  mousePressed = false;
});
setInterval(() => {
  if (mousePressed) {
    map[mouseY][mouseX] = selection;
    drawTiles();
  }
}, 10);
function updateGameSize() {
  canvas.width = gameWidth;
  canvas.height = gameHeight;
  canvas.style.scale = `${Tile.size * zoom}`;
  resizeMapArray();
  drawTiles();
}
function drawTiles() {
  if (!ctx)
    return;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const someTile = Level.tileDict[`${map[y][x]}`];
      if (!someTile) {
        ctx.clearRect(x, y, 1, 1);
        continue;
      }
      ;
      ctx.fillStyle = someTile.color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  outputDiv.innerHTML = JSON.stringify(map, null, " ").replace("[", "").replace(/],/g, "],<br>").replace(/.$/, "");
}
updateGameSize();
