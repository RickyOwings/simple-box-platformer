import getSearchParams from "./getSearchParams.js";
import Cookie from "./_snowpack/pkg/js-cookie.js";
const _Tile = class {
  constructor({tileX, tileY, color = "#aaaaaa"}) {
    this.type = "basic";
    this.x = Math.floor(tileX * _Tile.size);
    this.y = Math.floor(tileY * _Tile.size);
    this.color = color;
    _Tile.instances.push(this);
  }
  static isIntersecting(x, y, type) {
    if (!type)
      type = "basic";
    for (let i in _Tile.instances) {
      let tile = _Tile.instances[i];
      if (x < tile.x)
        continue;
      if (y < tile.y)
        continue;
      if (x > tile.x + _Tile.size)
        continue;
      if (y > tile.y + _Tile.size)
        continue;
      if (tile.type !== type)
        continue;
      return true;
    }
    return false;
  }
  static isWithinType(x, y, size, type) {
    let returnBool = _Tile.isIntersecting(x, y, type) || _Tile.isIntersecting(x + size, y, type) || _Tile.isIntersecting(x + size, y + size, type) || _Tile.isIntersecting(x, y + size, type);
    return returnBool;
  }
  static drawAll(ctx) {
    for (let i in _Tile.instances) {
      _Tile.instances[i].draw(ctx);
    }
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, _Tile.size, _Tile.size);
  }
  remove() {
  }
};
let Tile = _Tile;
Tile.instances = [];
Tile.size = 16;
Tile.type = "basic";
const _BasicTile = class extends Tile {
  constructor(x, y) {
    super({tileX: x, tileY: y, color: _BasicTile.color});
    this.type = "basic";
  }
};
let BasicTile = _BasicTile;
BasicTile.color = "#aaaaaa";
BasicTile.type = "basic";
const _FinishTile = class extends Tile {
  constructor(x, y) {
    super({tileX: x, tileY: y, color: _FinishTile.color});
    this.type = "finish";
  }
};
let FinishTile = _FinishTile;
FinishTile.color = "#ffff00";
FinishTile.type = "finish";
const _LavaTile = class extends Tile {
  constructor(x, y) {
    super({tileX: x, tileY: y, color: _LavaTile.color});
    this.type = "lava";
  }
};
let LavaTile = _LavaTile;
LavaTile.color = "#ff0000";
LavaTile.type = "lava";
const _RespawnTile = class extends Tile {
  constructor(x, y) {
    super({tileX: x, tileY: y, color: _RespawnTile.color});
    this.type = "respawn";
    _RespawnTile.spawns.push(this);
  }
  static getRespawn() {
    if (_RespawnTile.instances.length)
      return _RespawnTile.spawns[0];
    return null;
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    let offset = (Tile.size - _RespawnTile.size) / 2;
    ctx.fillRect(this.x + offset, this.y + offset, _RespawnTile.size, _RespawnTile.size);
  }
  getX() {
    let offset = (Tile.size - _RespawnTile.size) / 2;
    return this.x + offset;
  }
  getY() {
    let offset = (Tile.size - _RespawnTile.size) / 2;
    return this.y + offset;
  }
  remove() {
    _RespawnTile.spawns = [];
  }
};
let RespawnTile = _RespawnTile;
RespawnTile.size = 8;
RespawnTile.spawns = [];
RespawnTile.color = "#0000aa";
RespawnTile.type = "respawn";
const _BounceTile = class extends Tile {
  constructor(x, y) {
    super({tileX: x, tileY: y, color: _BounceTile.color});
    this.type = "bounce";
  }
};
let BounceTile = _BounceTile;
BounceTile.type = "bounce";
BounceTile.color = "#44cc44";
const _EnemyTile = class extends Tile {
  constructor(x, y) {
    super({tileX: x, tileY: y, color: _EnemyTile.color});
    this.type = "enemy";
    _EnemyTile.spawns.push(this);
  }
  draw(ctx) {
    ctx.fillStyle = "#660000";
    let offset = (Tile.size - _EnemyTile.size) / 2;
    ctx.fillRect(this.x + offset, this.y + offset, _EnemyTile.size, _EnemyTile.size);
  }
  getX() {
    let offset = (Tile.size - _EnemyTile.size) / 2;
    return this.x + offset;
  }
  getY() {
    let offset = (Tile.size - _EnemyTile.size) / 2;
    return this.y + offset;
  }
  remove() {
    _EnemyTile.spawns = [];
  }
};
let EnemyTile = _EnemyTile;
EnemyTile.size = 12;
EnemyTile.spawns = [];
EnemyTile.color = "#220000";
EnemyTile.type = "enemy";
const _GunTile = class extends Tile {
  constructor(x, y) {
    super({tileX: x, tileY: y, color: _GunTile.color});
    this.type = "gun";
  }
  draw(ctx) {
    if (_GunTile.pickedUp)
      return;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x + Tile.size / 2 - 4, this.y + Tile.size / 2 + 2, 6, 2);
    ctx.fillRect(this.x + Tile.size / 2 - 4, this.y + Tile.size / 2 + 4, 2, 2);
    ctx.fillRect(this.x + Tile.size / 2 - 2, this.y + Tile.size / 2 + 4, 1, 1);
  }
};
let GunTile = _GunTile;
GunTile.color = "#ffffff";
GunTile.type = "gun";
GunTile.pickedUp = false;
const searchParams = getSearchParams();
const _Level = class {
  static getZoom() {
    return _Level.maps[_Level.index].zoom;
  }
  static getCurrentSongUrl() {
    return _Level.maps[_Level.index].songDir;
  }
  static next(canvas, changeSong) {
    const oldSongDir = _Level.maps[_Level.index].songDir;
    if (_Level.index + 1 >= _Level.maps.length)
      _Level.index = 0;
    else
      _Level.index++;
    const newSongDir = _Level.maps[_Level.index].songDir;
    if (oldSongDir != newSongDir)
      changeSong(newSongDir);
    _Level.remove();
    _Level.generate(canvas);
  }
  static updateBuilderAnchor(map) {
    const builderAnchor = document.getElementById("builderAnchor");
    builderAnchor.href = `builder.html?customLevel=${JSON.stringify({
      mapArr: map,
      zoom: _Level.getZoom()
    })}`;
  }
  static generate(canvas) {
    if (!_Level.maps.length)
      return;
    if (_Level.index >= _Level.maps.length)
      _Level.index = 0;
    Cookie.set("level", (_Level.index + 1).toString());
    const level = _Level.maps[_Level.index];
    const map = level.mapArr;
    const style = level.style;
    const zoom = level.zoom;
    _Level.updateBuilderAnchor(map);
    let height = map.length * 16;
    let width = map[0].length * 16;
    canvas.width = width;
    canvas.height = height;
    let wScale = window.innerWidth / canvas.width;
    let hScale = window.innerHeight / canvas.height;
    let scale = wScale < hScale ? wScale * zoom : hScale * zoom;
    canvas.style.scale = `${scale * 0.9}`;
    for (let key in _Level.cssDefault) {
      canvas.style[key] = _Level.cssDefault[key];
    }
    for (let key in style) {
      canvas.style[key] = style[key];
    }
    const label = document.getElementById("level");
    if (label) {
      label.innerHTML = `LEVEL_${_Level.index + 1}`;
    }
    const message = document.getElementById("message");
    if (message) {
      message.innerHTML = level.message;
    }
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (Object.keys(_Level.tileDict).includes(`${map[y][x]}`)) {
          const Something = _Level.tileDict[`${map[y][x]}`];
          if (Something) {
            new Something(x, y);
          }
        }
      }
    }
  }
  static remove() {
    for (let i in Tile.instances) {
      Tile.instances[i].remove();
    }
    Tile.instances = [];
  }
  constructor({mapArr, style = {}, message = "", songDir = "./assets/song1/", zoom = 1}) {
    this.mapArr = mapArr;
    this.style = style;
    this.message = message;
    this.songDir = songDir;
    this.zoom = zoom;
    _Level.maps.push(this);
  }
};
let Level = _Level;
Level.cssDefault = {
  rotate: "0deg",
  filter: "unset"
};
Level.maps = [];
Level.index = searchParams.level ? searchParams.level - 1 : 0;
Level.tileDict = {
  0: void 0,
  1: BasicTile,
  2: FinishTile,
  3: LavaTile,
  4: RespawnTile,
  5: BounceTile,
  6: EnemyTile,
  7: GunTile
};
export {
  Level,
  Tile,
  BasicTile,
  FinishTile,
  LavaTile,
  RespawnTile,
  BounceTile,
  EnemyTile,
  GunTile
};
