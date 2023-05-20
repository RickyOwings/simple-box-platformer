import {
  Level,
  Tile,
  RespawnTile,
  EnemyTile
} from "./tilemap.js";
import Input from "./input.js";
const PLAYER_SIZE = 8;
const PLAYER_COLOR = "#00ff00";
export default class Player {
  constructor(x, y, canvas) {
    this.dead = false;
    this.xMusicVol = 0.1;
    this.yMusicVol = 0.1;
    this.drumMusicVol = 0.5;
    this.dieSoundVol = 0.4;
    this.scientistSoundVol = 0.4;
    this.finishLevelVol = 0.4;
    this.jumpSoundVol = 0.4;
    this.bounceSoundVol = 0.4;
    this.xV = 0;
    this.yV = 0;
    this.xA = 0;
    this.yA = 0;
    this.canJump = false;
    this.bounce = 8e3;
    this.jumpVel = 200;
    this.wallFactor = 0;
    this.volumeStore = 1;
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.input = new Input("w", "a", "s", "d");
    this.color = PLAYER_COLOR;
    this.size = PLAYER_SIZE;
    this.xMusic = new Audio("./assets/song1/1.mp3");
    this.yMusic = new Audio("./assets/song1/2.mp3");
    this.drumMusic = new Audio("./assets/song1/3.mp3");
    this.dieSound = new Audio("./assets/sfx/Die.mp3");
    this.scientistSound = new Audio("./assets/sfx/scientist_death.mp3");
    this.finishLevel = new Audio("./assets/sfx/Finish Level.mp3");
    this.jumpSound = new Audio("./assets/sfx/Jump.mp3");
    this.bounceSound = new Audio("./assets/sfx/bounce.mp3");
    this.xMusic.loop = true;
    this.yMusic.loop = true;
    this.drumMusic.loop = true;
    setTimeout(() => {
      this.xMusic.play();
      this.yMusic.play();
      this.drumMusic.play();
    }, 500);
    Enemy.summonEnemies();
  }
  static fromTilePosition(tileX, tileY, canvas) {
    return new Player(Math.floor(tileX * Tile.size) + Tile.size / 2 - PLAYER_SIZE / 2, Math.floor(tileY * Tile.size) + Tile.size / 2 - PLAYER_SIZE / 2, canvas);
  }
  update(progress) {
    Enemy.updateAll(progress);
    if (Enemy.isColliding(this.x, this.y, this.size) && !this.dead)
      this.die(progress);
    this.checkOutOfBounds(progress);
    this.playerMovement(progress);
    this.lavaLogic(progress);
    this.bounceLogic(progress);
    this.goalLogic();
    this.physicsUpdate(progress);
    this.mapTileCollision(progress);
    this.adaptiveMusicVolume();
    this.scrollCanvas();
  }
  physicsUpdate(progress) {
    let progSec = progress / 1e3;
    this.yA += 400;
    this.xV += this.xA * progSec;
    this.yV += this.yA * progSec;
    this.xV *= 0.98;
    this.x += this.xV * progSec;
    this.y += this.yV * progSec;
    this.xA = 0;
    this.yA = 0;
  }
  scrollCanvas() {
    if (this.dead)
      return;
    const zoom = Level.getZoom();
    if (zoom <= 1) {
      this.canvas.style.translate = ``;
      return;
    }
    ;
    const scale = parseFloat(this.canvas.style.scale);
    const xWindow = Math.floor(this.x + this.size / 2) * scale;
    const yWindow = Math.floor(this.y + this.size / 2) * scale;
    const xOffset = this.canvas.width * scale / 2 - xWindow;
    const yOffset = this.canvas.height * scale / 2 - yWindow;
    const rotationString = this.canvas.style.rotate ? this.canvas.style.rotate : "0deg";
    const rotation = parseFloat(rotationString.replace("deg", "")) * Math.PI / 180;
    const xRotate = xOffset * Math.cos(rotation) - yOffset * Math.sin(rotation);
    const yRotate = yOffset * Math.cos(rotation) + xOffset * Math.sin(rotation);
    this.canvas.style.translate = `${xRotate}px ${yRotate}px`;
  }
  checkOutOfBounds(progress) {
    if (this.dead)
      return;
    if (this.x < 0 || this.x + this.size > this.canvas.width || this.y < 0 || this.y + this.size > this.canvas.height)
      this.die(progress);
  }
  playerMovement(progress) {
    if (this.dead)
      return;
    const left = this.input.pressed("a") ? 1 : 0;
    const right = this.input.pressed("d") ? 1 : 0;
    const speed = 400;
    const xMov = (right - left) * speed;
    this.xA = xMov;
    if (this.input.pressed("w") && this.canJump) {
      let mult = 1;
      if (Math.abs(this.wallFactor))
        mult = 0.6;
      this.yV = -this.jumpVel * mult;
      this.xA = this.wallFactor;
      this.canJump = false;
      this.jumpSound.pause();
      this.jumpSound.currentTime = 0;
      this.jumpSound.play();
    }
  }
  lavaLogic(progress) {
    if (this.dead)
      return;
    if (Tile.isWithinType(this.x, this.y, this.size, "lava"))
      this.die(progress);
  }
  bounceLogic(progress) {
    if (Tile.isWithinType(this.x, this.y, this.size, "bounce")) {
      this.yV *= -1;
      this.y -= 1;
      this.bounceSound.pause();
      this.bounceSound.currentTime = 0;
      this.bounceSound.play();
    }
  }
  goalLogic() {
    if (Tile.isWithinType(this.x, this.y, this.size, "finish")) {
      this.finishLevel.play();
      Level.next(this.canvas, (url) => {
        this.xMusic.pause();
        this.yMusic.pause();
        this.drumMusic.pause();
        this.xMusic.currentTime = 0;
        this.yMusic.currentTime = 0;
        this.drumMusic.currentTime = 0;
        this.xMusic.setAttribute("src", `${url}1.mp3`);
        this.yMusic.setAttribute("src", `${url}2.mp3`);
        this.drumMusic.setAttribute("src", `${url}3.mp3`);
        setTimeout(() => {
          this.xMusic.play();
          this.yMusic.play();
          this.drumMusic.play();
        }, 500);
      });
      Enemy.summonEnemies();
      let respawn = RespawnTile.getRespawn();
      if (respawn == null)
        return;
      this.x = respawn.getX();
      this.y = respawn.getY();
      this.xV = 0;
      this.yV = 0;
    }
    ;
  }
  adaptiveMusicVolume() {
    const yMusicTarget = capNumberToOne(Math.log10(Math.abs(this.yV / 15))) * 0.5;
    const dy = this.yMusicVol - yMusicTarget;
    const xMusicTarget = capNumberToOne(Math.log10(Math.abs(this.xV / 25)));
    const dx = this.xMusicVol - xMusicTarget;
    const accel = 5e-3;
    this.xMusicVol = capNumberToOne(this.xMusicVol - accel * dx);
    this.yMusicVol = capNumberToOne(this.yMusicVol - accel * dy);
    this.drumMusic.volume = this.drumMusicVol * this.volumeStore;
    this.xMusic.volume = this.xMusicVol * this.volumeStore;
    this.yMusic.volume = this.yMusicVol * this.volumeStore;
    this.finishLevel.volume = this.finishLevelVol * this.volumeStore;
    this.dieSound.volume = this.dieSoundVol * this.volumeStore;
    this.scientistSound.volume = this.scientistSoundVol * this.volumeStore;
    this.jumpSound.volume = this.jumpSoundVol * this.volumeStore;
    this.bounceSound.volume = this.bounceSoundVol * this.volumeStore;
    if (this.dead) {
      this.yMusic.volume = 0;
      this.xMusic.volume = 0;
      this.drumMusic.volume = 0;
    }
    const volHTML = document.getElementById("volume");
    if (volHTML) {
      let volume = parseFloat(volHTML.value);
      volume = capNumberToOne(volume);
      this.volumeStore = volume;
    }
  }
  restartMusic() {
    this.yMusic.currentTime = 0;
    this.xMusic.currentTime = 0;
    this.drumMusic.currentTime = 0;
  }
  die(progress) {
    const scale = parseFloat(this.canvas.style.scale);
    if (Level.getZoom() == 1)
      this.canvas.style.scale = `${scale * 0.9}`;
    const canvasScaleStyle = this.canvas.style.scale;
    this.dead = true;
    this.color = "#333333";
    const diceRoll = Math.floor(Math.random() * 100);
    if (diceRoll == 69) {
      this.scientistSound.pause();
      this.scientistSound.currentTime = 0;
      this.scientistSound.play();
    } else {
      this.dieSound.pause();
      this.dieSound.currentTime = 0;
      this.dieSound.play();
    }
    setTimeout(() => {
      this.dead = false;
      this.color = PLAYER_COLOR;
      let spawn = RespawnTile.getRespawn();
      if (spawn === null)
        return;
      this.xA = 0;
      this.yA = 0;
      this.yV = 0;
      this.xV = 0;
      this.x = spawn.getX();
      this.y = 4 + spawn.getY();
      this.restartMusic();
      Enemy.summonEnemies();
      if (this.canvas.style.scale != canvasScaleStyle)
        return;
      this.canvas.style.scale = `${scale}`;
    }, progress * 100);
  }
  mapTileCollision(progress) {
    const botLeft = Tile.isIntersecting(this.x, this.y + this.size);
    const botRight = Tile.isIntersecting(this.x + this.size, this.y + this.size);
    const topLeft = Tile.isIntersecting(this.x, this.y);
    const topRight = Tile.isIntersecting(this.x + this.size, this.y);
    const top = topLeft && topRight;
    const bot = botLeft && botRight;
    const left = botLeft && topLeft;
    const right = botRight && topRight;
    const botTarget = Math.floor((this.y + this.size) / Tile.size) * Tile.size - this.size;
    const rightTarget = Math.floor((this.x + this.size) / Tile.size) * Tile.size - this.size;
    const topTarget = Math.ceil(this.y / Tile.size) * Tile.size;
    const leftTarget = Math.ceil(this.x / Tile.size) * Tile.size;
    if (bot) {
      this.yV = 0;
      this.y = botTarget;
      this.canJump = true;
      this.wallFactor = 0;
    }
    if (top) {
      this.yV = 0;
      this.y = topTarget;
    }
    if (right) {
      this.xV = 0;
      this.x = rightTarget;
      this.canJump = true;
      this.wallFactor = -this.bounce;
    }
    if (left) {
      this.xV = 0;
      this.x = leftTarget;
      this.canJump = true;
      this.wallFactor = this.bounce;
    }
    if (left || right || top || bot)
      return;
    if (botRight) {
      let dx = this.x + this.size - leftTarget;
      let dy = this.y + this.size - topTarget;
      if (dx < dy) {
        this.xV = 0;
        this.x = rightTarget;
      } else {
        this.yV = 0;
        this.y = botTarget;
        this.canJump = true;
        this.wallFactor = 0;
      }
      return;
    }
    if (botLeft) {
      let dx = leftTarget - this.x;
      let dy = this.y + this.size - topTarget;
      if (dx < dy) {
        this.xV = 0;
        this.x = leftTarget;
      } else {
        this.yV = 0;
        this.y = botTarget;
        this.canJump = true;
        this.wallFactor = 0;
      }
      return;
    }
    if (topRight) {
      let dx = this.x + this.size - leftTarget;
      let dy = topTarget - this.y;
      if (dx < dy) {
        this.xV = 0;
        this.x = rightTarget;
      } else {
        this.yV = 0;
        this.y = topTarget;
      }
      return;
    }
    if (topLeft) {
      let dx = leftTarget - this.x;
      let dy = topTarget - this.y;
      if (dx < dy) {
        this.xV = 0;
        this.x = leftTarget;
      } else {
        this.yV = 0;
        this.y = topTarget;
      }
      return;
    }
  }
  draw(ctx) {
    Enemy.drawAll(ctx);
    ctx.fillStyle = this.color;
    let x = Math.floor(this.x);
    let y = Math.floor(this.y);
    ctx.fillRect(x, y, this.size, this.size);
  }
}
function capNumberToOne(num) {
  if (!isFinite(num))
    return 0;
  if (num >= 1)
    return 1;
  if (num <= 0)
    return 0;
  return num;
}
const ENEMY_COLOR = "#ffaa00";
const ENEMY_SIZE = EnemyTile.size;
const _Enemy = class {
  constructor(x, y) {
    this.color = ENEMY_COLOR;
    this.size = ENEMY_SIZE;
    this.xV = -80;
    this.yV = 40;
    this.x = x;
    this.y = y;
    _Enemy.instances.push(this);
  }
  static isIntersecting(x, y) {
    for (let i in _Enemy.instances) {
      let enemy = _Enemy.instances[i];
      if (x < enemy.x)
        continue;
      if (y < enemy.y)
        continue;
      if (x > enemy.x + enemy.size)
        continue;
      if (y > enemy.y + enemy.size)
        continue;
      return true;
    }
    return false;
  }
  static isColliding(x, y, size) {
    if (_Enemy.isIntersecting(x, y))
      return true;
    if (_Enemy.isIntersecting(x + size, y))
      return true;
    if (_Enemy.isIntersecting(x + size, y + size))
      return true;
    if (_Enemy.isIntersecting(x + size, y))
      return true;
    return false;
  }
  static summonEnemies() {
    _Enemy.removeAll();
    for (let i in EnemyTile.spawns) {
      const tile = EnemyTile.spawns[i];
      new _Enemy(tile.getX(), tile.getY());
    }
  }
  static drawAll(ctx) {
    for (let i in _Enemy.instances) {
      _Enemy.instances[i].draw(ctx);
    }
  }
  static removeAll() {
    _Enemy.instances = [];
  }
  static updateAll(progress) {
    for (let i in _Enemy.instances) {
      _Enemy.instances[i].update(progress);
    }
  }
  update(progress) {
    this.bounce(progress);
    this.fall(progress);
  }
  bounce(progress) {
    const topLeft = Tile.isIntersecting(this.x, this.y);
    const topRight = Tile.isIntersecting(this.x + this.size, this.y);
    if (topLeft || topRight) {
      this.xV *= -1;
    }
    this.x += this.xV * (progress / 1e3);
  }
  fall(progress) {
    const bottomLeft = Tile.isIntersecting(this.x, this.y + this.size);
    const bottomRight = Tile.isIntersecting(this.x + this.size, this.y + this.size);
    if (bottomLeft || bottomRight)
      return;
    this.y += this.yV * (progress / 1e3);
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    let x = Math.floor(this.x);
    let y = Math.floor(this.y);
    ctx.fillRect(x, y, this.size, this.size);
  }
};
let Enemy = _Enemy;
Enemy.instances = [];
