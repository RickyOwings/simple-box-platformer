import {
  Tile,
  RespawnTile
} from "./tilemap.js";
import {canvas, ctx} from "./createCanvas.js";
import initLevels from "./initLevels.js";
import Player from "./player.js";
async function main() {
  await userInput();
  initLevels(canvas);
  var player;
  setTimeout(() => {
    let r = RespawnTile.getRespawn();
    if (r) {
      player = new Player(r.getX(), r.getY(), canvas);
    }
  }, 500);
  function update(progress) {
    if (player)
      player.update(progress);
  }
  function draw() {
    if (!ctx)
      return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Tile.drawAll(ctx);
    if (player)
      player.draw(ctx);
  }
  const FRAME_DELAY = 1e3 / 144;
  async function loop(time) {
    await waitPageResume(time);
    const progress = FRAME_DELAY;
    update(progress);
    draw();
    setTimeout(loop, FRAME_DELAY);
  }
  window.requestAnimationFrame(loop);
}
function userInput() {
  return new Promise((resolve) => {
    window.addEventListener("keydown", () => {
      resolve();
    });
  });
}
function waitPageResume(timestart) {
  return new Promise((resolve) => {
    function checkResumed(timestamp) {
      if (document.hasFocus()) {
        resolve(timestamp);
      } else
        window.setTimeout(() => {
          let timenew;
          window.requestAnimationFrame((time) => {
            timenew = time;
            checkResumed(timenew);
          });
        }, 500);
    }
    checkResumed(timestart);
  });
}
main();
