import {
  Level,
  Tile,
  RespawnTile
} from "./tilemap.js";
import Input from "./input.js";
const PLAYER_SIZE = 8;
const PLAYER_COLOR = "#00ff00";
export default class Player {
  constructor(x, y, canvas) {
    this.dead = false;
    this.xV = 0;
    this.yV = 0;
    this.xA = 0;
    this.yA = 0;
    this.canJump = false;
    this.bounce = 8e3;
    this.jumpVel = 200;
    this.wallFactor = 0;
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.input = new Input("w", "a", "s", "d");
    this.color = PLAYER_COLOR;
    this.size = PLAYER_SIZE;
  }
  static fromTilePosition(tileX, tileY, canvas) {
    return new Player(Math.floor(tileX * Tile.size) + Tile.size / 2 - PLAYER_SIZE / 2, Math.floor(tileY * Tile.size) + Tile.size / 2 - PLAYER_SIZE / 2, canvas);
  }
  update(progress) {
    this.playerMovement(progress);
    this.lavaLogic(progress);
    this.bounceLogic(progress);
    this.goalLogic();
    this.physicsUpdate(progress);
    this.mapTileCollision(progress);
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
    }
  }
  goalLogic() {
    if (Tile.isWithinType(this.x, this.y, this.size, "finish")) {
      Level.next(this.canvas);
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
  die(progress) {
    this.dead = true;
    this.color = "#333333";
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
    ctx.fillStyle = this.color;
    let x = Math.floor(this.x);
    let y = Math.floor(this.y);
    ctx.fillRect(x, y, this.size, this.size);
  }
}
