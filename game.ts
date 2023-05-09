// 
//              ---- CANVAS AND HTML BOILER PLATE ----
// 

const CANVAS_WIDTH = 480;       // 16 * 30
const CANVAS_HEIGHT = 160;      // 16 * 10

const canvas : HTMLCanvasElement = document.createElement("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;


const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// 
//              ---- TILE AND MAP RELATED FUNCTIONS ----
// 

const MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1],
    [1,0,1,0,3,0,1,0,3,0,1,0,3,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,1],
    [1,0,1,0,3,0,1,0,3,0,1,0,3,0,1,0,0,1,0,0,0,0,3,0,1,0,1,0,1,1],
    [1,0,1,0,3,0,1,0,3,0,1,0,3,0,1,0,0,0,0,0,0,0,3,0,1,0,1,0,1,1],
    [1,0,1,0,3,0,1,0,3,0,1,0,3,0,1,0,0,0,0,0,1,0,3,0,1,0,1,0,1,1],
    [3,0,3,0,3,0,1,0,3,0,1,0,3,0,1,0,0,0,0,0,0,0,3,0,1,0,1,0,1,1],
    [3,0,3,0,3,0,1,0,3,0,1,0,3,0,1,0,0,0,0,0,0,0,3,0,1,0,1,0,1,1],
    [3,4,3,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,3,0,0,0,1,2,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1],
];

const MAP_01 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
];

const LEVEL_01 = [
    [1,1,1,1,1,1,1],
    [1,4,0,0,0,2,1],
    [1,1,1,1,1,1,1],
];

const LEVEL_02 = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,2,1],
    [1,4,0,1,1,1,1],
    [1,1,1,1,1,1,1],
];

const LEVEL_03 = [
    [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,2],
    [1,4,0,1,0,0,1,1],
    [1,1,1,1,3,3,1,1],
];

const LEVEL_04 = [
    [1,1,1],
    [1,0,2],
    [1,0,1],
    [1,0,1],
    [1,0,1],
    [1,0,1],
    [1,4,1],
    [1,1,1],
];

const LEVEL_05 = [
    [1,1,1],
    [1,0,2],
    [1,0,3],
    [1,0,3],
    [1,0,3],
    [1,0,3],
    [1,4,3],
    [1,1,1],
];


const LEVEL_06 = [
    [1,1,1,1,1,1],
    [1,0,0,0,0,1],
    [1,0,1,1,0,1],
    [1,0,3,3,0,1],
    [1,0,3,3,0,1],
    [1,4,3,3,2,1],
    [1,1,1,1,1,1],
];

const LEVEL_07 = [
    [3,4,3],
    [3,0,3],
    [3,0,3],
    [3,0,3],
    [3,0,3],
    [3,0,3],
    [3,0,3],
    [3,0,3],
    [3,0,3],
    [3,0,3],
    [3,0,3],
    [3,0,3],
    [3,0,3],
    [3,0,3],
    [3,0,3],
    [3,0,3],
    [3,2,3],
];

const LEVEL_08 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1],
    [1,0,1,0,3,0,1,0,3,0,1,0,3,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,1],
    [1,0,1,0,3,0,1,0,3,0,1,0,3,0,1,0,0,1,0,0,0,0,3,0,1,0,1,0,1,1],
    [1,0,1,0,3,0,1,0,3,0,1,0,3,0,1,0,0,0,0,0,0,0,3,0,1,0,1,0,1,1],
    [1,0,1,0,3,0,1,0,3,0,1,0,3,0,1,0,0,0,0,0,1,0,3,0,1,0,1,0,1,1],
    [3,0,3,0,3,0,1,0,3,0,1,0,3,0,1,0,0,0,0,0,0,0,3,0,1,0,1,0,1,1],
    [3,0,3,0,3,0,1,0,3,0,1,0,3,0,1,0,0,0,0,0,0,0,3,0,1,0,1,0,1,1],
    [3,4,3,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,3,0,0,0,1,2,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1],
];

const MAPS = [LEVEL_01, LEVEL_02, LEVEL_03, LEVEL_04, LEVEL_05, LEVEL_06, LEVEL_07, LEVEL_08];
let mapIndex = 0;

function generateMap(map: number[][]): void{
    let height = map.length * 16;
    let width = map[0].length * 16;
    canvas.width = width;
    canvas.height = height;

    for(let y = 0; y < map.length; y++){
        for(let x = 0; x < map[y].length; x++){
            switch(map[y][x]){
                case 1: 
                    new BasicTile(x, y); break;
                case 2:
                    new FinishTile(x, y); break;
                case 3:
                    new LavaTile(x, y); break;
                case 4:
                    new RespawnTile(x, y); break;
            }
                
        }
    }
}

function removeMap(){
    for (let i in TILE_INSTANCES){
        TILE_INSTANCES[i].remove();
    }
    TILE_INSTANCES = [];
}

function nextMap(){
    if (mapIndex + 1 >= MAPS.length) return;
    mapIndex++;
    removeMap();
    generateMap(MAPS[mapIndex]);
}

const TILE_SIZE: number = 16;
let TILE_INSTANCES: Tile[] = [];

function drawAllTiles(): void {
    for(let i in TILE_INSTANCES){
        TILE_INSTANCES[i].draw();
    }
}


interface Tile_Constructor {
    tileX: number;
    tileY: number;
    color: string | undefined;
}

class Tile {
    public static isIntersecting(x: number, y: number, type?: string): boolean{
        if (!type) type = 'basic';
        for(let i in TILE_INSTANCES) {
            let tile = TILE_INSTANCES[i];
            if (x < tile.x) continue;
            if (y < tile.y) continue;
            if (x > tile.x + TILE_SIZE) continue;
            if (y > tile.y + TILE_SIZE) continue;

            if (tile.type !== type) continue;
            return true;
        }
        return false;
    }
    public static isWithinType(x: number, y: number, size: number, type: string): boolean{
        let returnBool: boolean = (
            Tile.isIntersecting(x, y, type) ||
            Tile.isIntersecting(x + size, y, type) ||
            Tile.isIntersecting(x + size, y + size, type) ||
            Tile.isIntersecting(x, y + size, type) 
        );
        return returnBool;
    }

    public x: number;
    public y: number;
    public color: string;
    public type: string = 'basic';
    constructor({tileX, tileY, color = "#aaaaaa"}: Tile_Constructor){
        this.x = Math.floor(tileX * TILE_SIZE);
        this.y = Math.floor(tileY * TILE_SIZE);
        this.color = color;
        TILE_INSTANCES.push(this);
    }
    public draw(): void{
        if (!ctx) return;
        ctx.fillStyle = this.color;  
        ctx.fillRect(this.x, this.y, TILE_SIZE, TILE_SIZE);
    }
    public remove(): void{
        
    }
}
class BasicTile extends Tile {
    public type: string = 'basic';
    constructor(x: number, y: number){
        super({tileX: x, tileY: y, color: "#aaaaaa"});
    }
}
class FinishTile extends Tile {
    public type: string = 'finish';
    constructor(x: number, y: number){
        super({tileX: x, tileY: y, color: "#ffff00"});
    }
}

class LavaTile extends Tile {
    public type: string = 'lava';
    constructor(x: number, y: number){
        super({tileX: x, tileY: y, color: "#ff0000"});
    }
}
class RespawnTile extends Tile {
    public type: string = 'respawn';
    public static size = 8;
    private static instances: RespawnTile[] = [];
    public static getRespawn(): RespawnTile | null {
        if (RespawnTile.instances.length) return RespawnTile.instances[0];
        return null;
    }
    constructor(x: number, y: number){
        super({tileX: x, tileY: y, color: "#0000AA"});
        RespawnTile.instances.push(this);
    }
    draw(){
        if(!ctx) return;
        ctx.fillStyle = this.color;  
        let offset = (TILE_SIZE - RespawnTile.size) / 2
        ctx.fillRect(this.x + offset, this.y + offset, RespawnTile.size, RespawnTile.size);
    }
    getX(): number{
        let offset = (TILE_SIZE - RespawnTile.size) / 2
        return this.x + offset;
    }
    getY(): number{
        let offset = (TILE_SIZE - RespawnTile.size) / 2
        return this.y + offset;
    }
    remove(){
        RespawnTile.instances = [];
    }
}
generateMap(MAPS[mapIndex]);
drawAllTiles();

// 
//              ---- INPUT CLASS AND RELATED ----
// 

class Input {
    private keys: string[];
    private states: boolean[];


    constructor(...keys: string[]){
        this.keys = [...keys];
        this.states = new Array(this.keys.length).fill(false);

        document.addEventListener('keydown', (ev)=>{this.keydown(ev)});
        document.addEventListener('keyup', (ev)=>{this.keyup(ev)});
    }


    private keyup(ev: KeyboardEvent){
        if(!this.keys.includes(ev.key)) return;
        let index = this.keys.indexOf(ev.key);
        this.states[index] = false;
    }


    private keydown(ev: KeyboardEvent){
        if(!this.keys.includes(ev.key)) return;
        let index = this.keys.indexOf(ev.key);
        this.states[index] = true;
    }

    public pressed(key: string): boolean{
        if(!this.keys.includes(key)) return false;
        let index = this.keys.indexOf(key);
        return this.states[index];
    }
}

// 
//              ---- PLAYER CLASS AND RELATED ----
// 


const PLAYER_SIZE = 8;
const PLAYER_COLOR = "#00ff00"

class Player {
    private color: string;
    public static fromTilePosition(tileX: number, tileY: number): Player{
        return new Player(
            Math.floor(tileX * TILE_SIZE) + (TILE_SIZE / 2) - (PLAYER_SIZE / 2),
            Math.floor(tileY * TILE_SIZE) + (TILE_SIZE / 2) - (PLAYER_SIZE / 2),
        )
    }
    private dead: boolean = false;
    private x: number;
    private y: number;
    private input: Input;

    constructor(x: number, y: number){
        this.x = x; 
        this.y = y; 
        this.input = new Input("w", "a", "s", "d");
        this.color = PLAYER_COLOR;
    } 

    private xV: number = 0;
    private yV: number = 0;

    private xA: number = 0;
    private yA: number = 0;

    update(progress: number){
        this.playerMovement(progress);
        this.lavaLogic(progress);
        this.goalLogic();
        this.physicsUpdate(progress);
        this.mapTileCollision(progress);
    }
    physicsUpdate(progress: number){
        let progSec = progress / 1000;

        this.yA += 400;

        this.xV += this.xA * progSec;
        this.yV += this.yA * progSec;

        this.xV *= 0.98;

        this.x += this.xV * progSec;
        this.y += this.yV * progSec;

        this.xA = 0;
        this.yA = 0;
    }
    private canJump: boolean = false;
    private bounce: number = 8000;
    private jumpVel: number = 200;
    private wallFactor: number = 0;
    playerMovement(progress: number){
        if (this.dead) return;
        const left = (this.input.pressed("a")) ? 1 : 0
        const right = (this.input.pressed("d")) ? 1 : 0
        const speed = 400;
        const xMov = (right - left) * speed;
        this.xA = xMov;

        if (this.input.pressed("w") && this.canJump) {
            let mult = 1;
            if(Math.abs(this.wallFactor)) mult = 0.6;

            this.yV = -this.jumpVel * mult; 
            this.xA = this.wallFactor; 
            this.canJump = false;
        }
    }
    lavaLogic(progress: number){
        if (this.dead) return;
        if (Tile.isWithinType(this.x, this.y, PLAYER_SIZE, 'lava')) this.die(progress);
    }
    goalLogic(){
        if (Tile.isWithinType(this.x, this.y, PLAYER_SIZE, 'finish')) {
            nextMap();
            let respawn = RespawnTile.getRespawn();
            if (respawn == null) return;
            this.x = respawn.getX();
            this.y = respawn.getY();
            this.xV = 0;
            this.yV = 0;
        };
    }
    die(progress: number){
        this.dead = true;
        this.color = "#333333"
        setTimeout(()=>{
            this.dead = false 
            this.color = PLAYER_COLOR;
            let spawn = RespawnTile.getRespawn();
            if (spawn === null) return;
            this.xA = 0;
            this.yA = 0;
            this.yV = 0;
            this.xV = 0;
            this.x = spawn.getX();
            this.y = 4 + spawn.getY();
        },progress * 100);
    }
    mapTileCollision(progress: number){
        const botLeft = Tile.isIntersecting(this.x, this.y + PLAYER_SIZE);
        const botRight = Tile.isIntersecting(this.x + PLAYER_SIZE, this.y + PLAYER_SIZE);
        const topLeft = Tile.isIntersecting(this.x, this.y);
        const topRight = Tile.isIntersecting(this.x + PLAYER_SIZE, this.y);

        const top = (topLeft && topRight);
        const bot = (botLeft && botRight);
        const left = (botLeft && topLeft);
        const right = (botRight && topRight);


        const botTarget = Math.floor((this.y + PLAYER_SIZE) / TILE_SIZE) * TILE_SIZE - PLAYER_SIZE;
        const rightTarget = Math.floor((this.x + PLAYER_SIZE) / TILE_SIZE) * TILE_SIZE - PLAYER_SIZE;
        const topTarget = Math.ceil((this.y / TILE_SIZE)) * TILE_SIZE;
        const leftTarget = Math.ceil((this.x / TILE_SIZE)) * TILE_SIZE;

        if(bot){
            this.yV = 0;
            this.y = botTarget;
            this.canJump = true;
            this.wallFactor = 0;
        }
        if(top){
            this.yV = 0;
            this.y = topTarget;
        }
        if(right){
            this.xV = 0;
            this.x = rightTarget;
            this.canJump = true;
            this.wallFactor = -this.bounce;
        }
        if(left){
            this.xV = 0;
            this.x = leftTarget;
            this.canJump = true;
            this.wallFactor = this.bounce;
        }
        if (left || right || top || bot) return;

        if (botRight){
            let dx = (this.x + PLAYER_SIZE) - leftTarget;
            let dy = (this.y + PLAYER_SIZE) - topTarget;
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
        if (botLeft){
            let dx = leftTarget - this.x;
            let dy = (this.y + PLAYER_SIZE) - topTarget;
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
        if (topRight){
            let dx = (this.x + PLAYER_SIZE) - leftTarget;
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
        if (topLeft){
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

    draw(){
        if (!ctx) return;
        ctx.fillStyle = this.color;
        let x = Math.floor(this.x)
        let y = Math.floor(this.y)
        ctx.fillRect(x, y, PLAYER_SIZE, PLAYER_SIZE);
    }
}

var player: Player;
setTimeout(()=>{
    let r = RespawnTile.getRespawn()
    if (r){
        player = new Player(r.getX(), r.getY())
    }
},500);



// 
//              ---- MAIN GAME LOGIC ----
// 

function waitPageResume(timestart: number): Promise<number>{
    return new Promise((resolve)=>{
        function checkResumed(timestamp: number){
            if (document.hasFocus()){
                resolve(timestamp);
            } else window.setTimeout(()=>{
                let timenew: number;
                window.requestAnimationFrame((time)=>{
                    timenew = time;
                    lastRender = timenew - 10;
                    checkResumed(timenew);
                });
            }, 500);
        }
        checkResumed(timestart);
    })
}


function update(progress: number){
    player.update(progress);
}


function draw(){
    if (!ctx) return;
    ctx.clearRect (0,0,canvas.width, canvas.height);
    drawAllTiles()
    player.draw()
}

var lastRender = 0;

async function loop(time: number){
    let timestamp = await waitPageResume(time);
    const progress = timestamp - lastRender;
    lastRender = timestamp; 
    update(progress);
    draw();
    window.requestAnimationFrame(loop);
}
setTimeout(()=>{
    window.requestAnimationFrame((time)=>{
        lastRender = time;
    })
    window.requestAnimationFrame(loop);
},1000);
