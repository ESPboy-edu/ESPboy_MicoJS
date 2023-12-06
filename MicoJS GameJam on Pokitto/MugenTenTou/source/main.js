
"push title MicoJS Demo1";
"push author FManga";
"push description A MicoJS game";
"set version v0.0.1";
"set category demo";
"set url https://micojs.github.com";

"include /source/RandWord.js"

let CAMERA_Z = 0;
const MAX_CORRIDOR = 20;
const CORRIDOR_SCALE = 4;
const CORRIDOR_WIDTH = 1024;
const MAX_CAMERA_X = 350;

const agility = 20;
let speed = 1;
let player = createShip();

const MIN_ROID_SIZE = 3;
const MAX_ROID_SIZE = 20;
const MAX_ROIDS = 3;
const roids = new Array(MAX_ROIDS);

const SHOT_SIZE = 50;
const SHOT_SPEED = 1;
const SHOT_RATE = 200;
const MAX_SHOTS = 5;
const shots = new Array(MAX_SHOTS);
let nextShot = 0;

const MAX_SPLODES = 2;
const splodes = new Array(MAX_SPLODES)
let nextSplode = 0;

const MAX_NODES = MAX_ROIDS + MAX_SPLODES + MAX_SHOTS + 1;
const nodes = new Array(MAX_NODES);
const fastShipLayers = [
    null,//R.ship1,
    null,//R.ship2,
    null,//R.ship3,
    null,//R.ship4,
    R.ship5,
    null,//R.ship6,
    R.ship7,
    null,//R.ship8,
    R.ship9,
    null,//R.ship10,
    R.ship11,
    null,//R.ship12,
    R.ship13,
    null,//R.ship14,
    R.ship15,
    null,//R.ship16,
    R.ship17,
    //R.ship18
];
const fullShipLayers = [
    R.ship1, R.ship2, R.ship3, R.ship4, R.ship5, R.ship6, R.ship7, R.ship8, R.ship9, R.ship10, R.ship11, R.ship12, R.ship13, R.ship14, R.ship15, R.ship16, R.ship17, R.ship18
];
let shipLayers = fastShipLayers;

{"ifeq platform pico"; shipLayers = fullShipLayers;}
{"ifeq platform espboy"; shipLayers = fullShipLayers;}
{"ifeq platform blit"; shipLayers = fullShipLayers;}

const explosionAnim = [
    R.explosion1,
    R.explosion2,
    R.explosion3,
    R.explosion4,
    R.explosion5,
    R.explosion6,
    R.explosion7,
    R.explosion8,
    R.explosion9,
    R.explosion10,
    R.explosion11,
    R.explosion12,
    R.explosion13,
    R.explosion14,
    R.explosion15,
    R.explosion16
];

const humanNames = [
    ["$1$2$2", "$1$2", "$6$2$2", "$6$2$2$2"],
    "$3$4",
    ["$5$4", "$5$4", "$5$4n"],
    "*KGHBRNMD",
    "*2*a*i*u*e*ooueiaiueao",
    "*kghbrnmd",
    "*1AIUEO"
];

let bgColor = setPen(9, 10, 200);
const txtColor = setPen(64, 128, 255);
let screenWidth, screenHeight;
let spriteScale;
let halfWidth, halfHeight;
let name, seq = 0;

function createShip() {
    return {
        x:0, y:CORRIDOR_WIDTH/2, z:7, r:0, f:0,
        draw:drawShip,
        update:updateShip
    };
}

function updateShip() {
    speed += 0.0001;
    let rot = RIGHT - LEFT;
    this.r = (this.r * 10 - rot * 0.3) / 11;
    this.x += rot * agility;
    this.x = clamp(this.x, -CORRIDOR_WIDTH/2, CORRIDOR_WIDTH/2);
    this.y -= (UP - DOWN) * agility;
    this.y = clamp(this.y, -CORRIDOR_WIDTH/2, CORRIDOR_WIDTH/2);
    this.z += speed;
    if (A) {
        let now = getTime();
        if (now - this.f > SHOT_RATE) {
            this.f = now;
            initShot(this.x, this.y, this.z + 1, 0, 0, SHOT_SPEED + speed);
        }
    }
    /*
    if (B) {
        if (shipLayers == fastShipLayers) shipLayers = fullShipLayers;
        else shipLayers = fastShipLayers;
    }
    */
    CAMERA_X = (CAMERA_X * 3 + this.x) / 4;
    CAMERA_Y = (CAMERA_Y * 3 + this.y) / 4;
    CAMERA_Z = this.z - 5;
    CAMERA_X = clamp(CAMERA_X, -MAX_CAMERA_X, MAX_CAMERA_X);
    CAMERA_Y = clamp(CAMERA_Y, -MAX_CAMERA_X, MAX_CAMERA_X);
}

function drawShip() {
    let dz = this.z - CAMERA_Z;
    let x = this.x - CAMERA_X;
    let y = this.y - CAMERA_Y;
    const s = 6 * spriteScale;
    const sd = s / 100;
    setPen(0);
    for (let layer of shipLayers) {
        if (layer) {
            let idz = 1 / dz;
            let sx = halfWidth + x * idz;
            let sy = halfHeight + y * idz;
            image(layer, sx, sy, 0, s * idz);
        }
        dz -= sd;
    }
}

function createSplode() {
    return {
        x:0, y:0, z:0, f:0,
        draw:drawSplode
    }
}

function initSplode(x, y, z) {
    if (nextSplode >= MAX_SPLODES) nextSplode = 0;
    let splode = splodes[nextSplode++];
    splode.x = x;
    splode.y = y;
    splode.z = z;
    splode.f = 0;
}

function drawSplode() {
    let dz = this.z - CAMERA_Z;
    if (dz <= 1) {
        return;
    }
    ++this.f;
    let frame = explosionAnim[floor(this.f)];
    if (frame) {
        let sx = halfWidth + (this.x - CAMERA_X) / dz;
        let sy = halfHeight + (this.y - CAMERA_Y) / dz;
        setPen(0);
        image(frame, sx, sy, this.z, 20 * spriteScale / dz);
    }
}

function drawRoid() {
    let dz = this.z - CAMERA_Z;
    this.s = (this.s + this.ts) / 2;
    if (dz <= 1) {
        initRoid(this, CAMERA_Z + MAX_CORRIDOR * CORRIDOR_SCALE);
    } else {
        let sx = halfWidth + (this.x - CAMERA_X) / dz;
        let sy = halfHeight + (this.y - CAMERA_Y) / dz;
        setPen(0);
        image(R.asteroid, sx, sy, this.c, this.s / dz);
    }
}

function createRoid(z) {
    return initRoid({
        x: 0,
        y: 0,
        z: 0,
        s: 0,
        c: 0,
        draw: drawRoid
    }, z);
}

function initRoid(roid, z) {
    let s = (MIN_ROID_SIZE + (MAX_ROID_SIZE - MIN_ROID_SIZE) * rand(0, 1) * rand(0, 1)) * spriteScale;
    roid.z = z;
    roid.x = rand(-MIN_ROID_SIZE, MIN_ROID_SIZE) * CORRIDOR_WIDTH / 2 / ((s - MIN_ROID_SIZE) * 0.1 + MIN_ROID_SIZE);
    roid.y = rand(-MIN_ROID_SIZE, MIN_ROID_SIZE) * CORRIDOR_WIDTH / 2 / ((s - MIN_ROID_SIZE) * 0.1 + MIN_ROID_SIZE);
    roid.s = s;
    roid.ts = s;
    roid.c = rand(0, PI);
    return roid;
}

function createShot() {
    return {
        x:0, y:0, z:0,
        dx:0, dy:0, dz:0,
        ttl:0,
        update: updateShot,
        draw: drawShot
    };
}

function initShot(x, y, z, dx, dy, dz) {
    if (nextShot >= MAX_SHOTS) nextShot = 0;
    let shot = shots[nextShot++];
    shot.ttl = 300;
    shot.x = x;
    shot.y = y;
    shot.z = z;
    shot.dx = dx;
    shot.dy = dy;
    shot.dz = dz;
    return shot;
}

function updateShot() {
    if (this.ttl <= 0)
        return;
    for (let roid of roids) {
        let dz = roid.z - this.z;
        if (dz * dz > 10)
            continue;
        let dx = roid.x - this.x;
        let dy = roid.y - this.y;
        let d = dx*dx + dy*dy;
        let s = 25 * roid.s;
        if (d < s*s) {
            roid.ts = 0;
            this.ttl = 0;
            initSplode(this.x, this.y, roid.z);
            return;
        }
    }
    this.x += this.dx;
    this.y += this.dy;
    this.z += this.dz;
    --this.ttl;
}

function drawShot() {
    if (this.ttl <= 0)
        return;
    let dz = this.z - CAMERA_Z;
    if (dz <= 1) {
        return;
    } else {
        let idz = 1 / dz;
        let sx = halfWidth + (this.x - CAMERA_X) * idz;
        let sy = halfHeight + (this.y - CAMERA_Y) * idz;
        idz *= 50 * spriteScale;
        let hidz = idz / 2;
        setPen(99);
        rect(sx - hidz, sy - hidz, idz, idz);
        // image(R.shot, sx, sy, 0, idz);
    }
}

function init() {
    screenWidth = getWidth();
    screenHeight = getHeight();
    spriteScale = screenWidth / 128;
    halfWidth = screenWidth / 2;
    halfHeight = screenHeight / 2;
    setFont(R.fontTiny);
    setFPS(30);

    let j = 0;
    for (let i = 0; i < MAX_ROIDS; ++i)
        nodes[j++] = roids[i] = createRoid(rand(0.5, 1.5) * MAX_CORRIDOR * CORRIDOR_SCALE);
    for (let i = 0; i < MAX_SHOTS; ++i)
        nodes[j++] = shots[i] = createShot();
    for (let i = 0; i < MAX_SPLODES; ++i)
        nodes[j++] = splodes[i] = createSplode();
    nodes[j++] = player;
}

function update(time) {
    for (let node of nodes) {
        if (node && node.update)
            node.update();
    }

    // bgColor = 7 + floor(CAMERA_Z / (MAX_CORRIDOR * CORRIDOR_SCALE)) % 40
}

function render() {
    setPen(0);
    clear();

    setPen(bgColor + 1);
    rect(0, halfHeight, screenWidth, halfHeight);

    const z = -(CAMERA_Z % CORRIDOR_SCALE);
    let invert = floor(CAMERA_Z / CORRIDOR_SCALE) & 1;
    const count = (MAX_CORRIDOR - invert) * CORRIDOR_SCALE;
    for (let i = -CORRIDOR_SCALE; i < count; i += CORRIDOR_SCALE) {
        const iz = max(1, i + z);
        let s = CORRIDOR_WIDTH / iz;
        let halfS = s / 2;
        setPen(bgColor - invert);
        invert = !invert;
        rect(halfWidth - CAMERA_X / iz - halfS, halfHeight - CAMERA_Y / iz - halfS, s, s);
    }

    let pz = nodes[0].z;
    for (let i = 0; i < MAX_NODES; ++i) {
        const node = nodes[i];
        node.draw();
        const z = node.z;
        if (pz < z) {
            nodes[i] = nodes[i - 1];
            nodes[i - 1] = node;
        } else {
            pz = z;
        }
    }

    // setPen(txtColor);
    // text(1000 / FRAMETIME | 0, 10, 10);
}
