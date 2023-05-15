const _Level = class {
  static next(canvas) {
    if (_Level.index + 1 >= _Level.maps.length)
      _Level.index = 0;
    else
      _Level.index++;
    _Level.remove();
    _Level.generate(canvas);
  }
  static generate(canvas) {
    if (!_Level.maps.length)
      return;
    const level = _Level.maps[_Level.index];
    const map = level.mapArr;
    const style = level.style;
    let height = map.length * 16;
    let width = map[0].length * 16;
    canvas.width = width;
    canvas.height = height;
    let wScale = window.innerWidth / canvas.width;
    let hScale = window.innerHeight / canvas.height;
    let scale = wScale < hScale ? wScale : hScale;
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
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        switch (map[y][x]) {
          case 1:
            new BasicTile(x, y);
            break;
          case 2:
            new FinishTile(x, y);
            break;
          case 3:
            new LavaTile(x, y);
            break;
          case 4:
            new RespawnTile(x, y);
            break;
          case 5:
            new BounceTile(x, y);
            break;
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
  constructor({mapArr, style = {}}) {
    this.mapArr = mapArr;
    this.style = style;
    _Level.maps.push(this);
  }
};
let Level = _Level;
Level.cssDefault = {
  rotate: "0deg",
  filter: "unset"
};
Level.maps = [];
Level.index = 0;
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
class BasicTile extends Tile {
  constructor(x, y) {
    super({tileX: x, tileY: y, color: "#aaaaaa"});
    this.type = "basic";
  }
}
class FinishTile extends Tile {
  constructor(x, y) {
    super({tileX: x, tileY: y, color: "#ffff00"});
    this.type = "finish";
  }
}
class LavaTile extends Tile {
  constructor(x, y) {
    super({tileX: x, tileY: y, color: "#ff0000"});
    this.type = "lava";
  }
}
const _RespawnTile = class extends Tile {
  constructor(x, y) {
    super({tileX: x, tileY: y, color: "#0000AA"});
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
class BounceTile extends Tile {
  constructor(x, y) {
    super({tileX: x, tileY: y, color: "#44cc44"});
    this.type = "bounce";
  }
}
export {
  Level,
  Tile,
  BasicTile,
  FinishTile,
  LavaTile,
  RespawnTile,
  BounceTile
};
