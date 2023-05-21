import {canvas, ctx} from "./createCanvas.js";
import {
  Level,
  Tile
} from "./tilemap.js";
import getSearchParams from "./getSearchParams.js";
var gameWidth = 30;
var gameHeight = 10;
var gameZoom = 1;
var zoom = 1;
var selection = 1;
var map = [];
for (let y = 0; y < gameHeight; y++) {
  map.push(new Array(gameWidth).fill(0));
}
const getMap = getSearchParams().customLevel;
if (getMap !== void 0) {
  const mapArr = getMap.mapArr;
  const height = mapArr.length;
  let findWidth = 0;
  for (let i in mapArr) {
    if (mapArr[i].length > findWidth)
      findWidth = mapArr[i].length;
  }
  const width = findWidth;
  gameWidth = width;
  gameHeight = height;
  map = mapArr;
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
function formatSaveFile() {
  return `// HERE's your level!
// This is really just meant to be used for developement purposes
// 
// There is a function in the file "initLevels.js" that creates all
// the levels in the game. You would simply just add this to the
// function to create the level. Since all of the code is made using
// modules, you can't just copy paste this into the terminal to add a
// level though. You would probably have to clone the github repository
// and customize the the "generateNormalLevels" function yourself. The
// repo can be found on https://github.com/RickyOwings/simple-box-platformer

// There are also several different properties that you can give the level, like
// css styling and all that!  

new Level({
    mapArr: ${JSON.stringify(map).replace(/\[\[/g, "[\n                [").replace(/]]/g, "]\n            ]").replace(/],/g, "],\n                ")},
    message: "This is my cool level!",
    zoom: ${gameZoom}
})
`;
}
const builderDiv = document.createElement("div");
builderDiv.id = "builderItems";
document.body.appendChild(builderDiv);
const outputDiv = document.createElement("div");
outputDiv.id = "outputDiv";
document.body.appendChild(outputDiv);
const saveAsTxt = document.createElement("a");
const saveFile = new Blob([formatSaveFile()], {type: "text/plain-text"});
saveAsTxt.innerHTML = "Save as TXT (Dev tool)";
saveAsTxt.href = URL.createObjectURL(saveFile);
saveAsTxt.download = "map.txt";
outputDiv.appendChild(saveAsTxt);
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
const zoomInput = document.createElement("input");
zoomInput.type = "number";
zoomInput.value = getMap ? `${getMap.zoom}` : `1`;
zoomInput.min = "1";
zoomInput.oninput = () => {
  gameZoom = parseFloat(zoomInput.value);
  updateGameSize();
  formatSaveFile();
};
addBuildItem(zoomInput, "zoom");
const setClear = document.createElement("div");
setClear.className = "tileSelection";
setClear.onclick = () => {
  selection = 0;
};
addBuildItem(setClear, "clear");
function setTiles() {
  const length = Object.keys(Level.tileDict).length;
  for (let i = 1; i < length; i++) {
    const element = document.createElement("div");
    const numberToSet = i;
    const tileClass = Level.tileDict[i];
    console.log(tileClass);
    element.className = "tileSelection";
    element.style.backgroundColor = tileClass.color;
    element.onclick = () => {
      selection = numberToSet;
    };
    addBuildItem(element, tileClass?.type);
  }
}
setTiles();
window.addEventListener("wheel", (ev) => {
  const deltaY = ev.deltaY / 100;
  const speed = 4;
  zoom *= 0.99 ** (deltaY * speed);
  updateGameSize();
});
var mouseX = 0;
var mouseY = 0;
var mousePressed = false;
var middleMouse = false;
var panX = 0;
var panY = 0;
canvas.addEventListener("mousemove", (ev) => {
  const canvasWidth = canvas.width * zoom * Tile.size;
  const canvasHeight = canvas.height * zoom * Tile.size;
  const xPadding = (window.innerWidth - canvasWidth) / 2;
  const yPadding = (window.innerHeight - canvasHeight) / 2;
  const x = Math.floor((ev.clientX - xPadding - panX) / (Tile.size * zoom));
  const y = Math.floor((ev.clientY - yPadding - panY) / (Tile.size * zoom));
  if (x > gameWidth - 1 || x < 0)
    return;
  if (y > gameHeight - 1 || y < 0)
    return;
  mouseX = x;
  mouseY = y;
});
document.addEventListener("mousemove", (ev) => {
  const dx = ev.movementX;
  const dy = ev.movementY;
  if (middleMouse) {
    panX += dx;
    panY += dy;
    canvas.style.translate = `${panX}px ${panY}px`;
  }
});
document.addEventListener("mousedown", (ev) => {
  if (ev.button == 1)
    middleMouse = true;
});
document.addEventListener("mouseup", (ev) => {
  if (ev.button == 1)
    middleMouse = false;
});
canvas.addEventListener("mousedown", (ev) => {
  if (ev.button == 0)
    mousePressed = true;
});
canvas.addEventListener("mouseup", (ev) => {
  if (ev.button == 0)
    mousePressed = false;
});
setInterval(() => {
  if (mousePressed) {
    map[mouseY][mouseX] = selection;
    drawTiles();
    testLevelUrlUpdate();
    updateGameSize();
  }
}, 10);
function testLevelUrlUpdate() {
  const testAnchor = document.getElementById("testLevel");
  testAnchor.href = `index.html?customLevel=${JSON.stringify({
    mapArr: map,
    zoom: gameZoom
  })}`;
}
testLevelUrlUpdate();
function updateGameSize() {
  canvas.width = gameWidth;
  canvas.height = gameHeight;
  canvas.style.scale = `${Tile.size * zoom}`;
  resizeMapArray();
  drawTiles();
  testLevelUrlUpdate();
  updateSaveFile();
}
function updateSaveFile() {
  formatSaveFile();
  const file = new Blob([formatSaveFile()], {type: "text/plain-text"});
  saveAsTxt.href = URL.createObjectURL(file);
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
}
updateGameSize();
