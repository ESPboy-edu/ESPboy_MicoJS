
//https://opengameart.org/content/pixel-robot
//https://opengameart.org/content/factory-tileset

"include /source/SSM.js";

"include /source/Tools.js";
"include /source/Edge.js";
"include /source/Recorder.js";
"include /source/Event.js";
"include /source/Player.js";
"include /source/Bullets.js";
"include /source/Item.js";
"include /source/Warp.js";

"include /source/Levels.js";
"include /source/stateCover.js";
"include /source/stateGameInit.js";
"include /source/stateGame.js";
"include /source/stateGameEnd.js";


const BORDER = 10;
const WHITE = setPen(255, 255, 255);
const BLACK = setPen(0, 0, 0);
const RED = setPen(240, 0, 0);
const GREEN = setPen(0, 240, 0);
const BLUE = setPen(0, 0, 240);
const VIOLET = setPen(240, 0, 240);
const YELLOW = setPen(240, 240, 0);

let ssm;
let edgeA;
let edgeB;
let edgeC;
let doc;
let robot;
let recorder;
let dt = 0;
let items = new Array(10);
let actualLevel = 1;

function init() {
    setFPS(30);
    setFont(R.fontTIC806x6);
    ssm = new SSM();
    edgeA = new Edge(A);
    edgeB = new Edge(B);
    edgeC = new Edge(C);
    ssm.setState(stateCoverUpdate, stateCoverRender, 2000);
    doc = new Player("doc");
    robot = new Player("robot");
    recorder = new Recorder();
}

function snap16(val) {
    return round(val / 16) * 16;
}

function initLevel() {
    doc.init()
    robot.init()

    //Clean items
    for (let i = 0; i < items.length; ++i) {
        items[i] = new Item(-999, -999, R.FloorTile, R.FloorTile, false);
    }

    if (actualLevel == 1)
        loadLevel1();
    else if (actualLevel == 2)
        loadLevel2();
    else if (actualLevel == 3)
        loadLevel3();
}

function checkBulletVSItemsCollision(bullets) {
    //Chek solid item collision
    for (let b of bullets) {
        if (b.life > 0 && b.vx != 0 && b.vy != 0)
            for (let i of items) {
                if (i.solid && distance(b, i) < 8) {
                    b.life = 0;
                }
            }
    }
}

function IsLevelCompleted() {
    //Is level completed? No more PortalOFF
    for (let i of items) {
        if (i.spriteOn == R.PortalOn && !i.active) {
            return false;
        }
    }
    return true;
}

function update(time) {
    edgeA.update(A);
    edgeB.update(B);
    edgeC.update(C);

    ///Debug cheat
    if (edgeC.rising) {
        ssm.setState(stateGameRoomCompleteUpdate, stateGameRoomCompletedRender, 4000); //Room Complete
    }

    //Calc delta time
    dt = time - ssm.timer;

    //Update
    ssm.update();

    //Move actors
    if (doc)
        doc.update(time);
    if (robot)
        robot.update(time);

    //Chek bullet and solid item collision
    checkBulletVSItemsCollision(doc.bullets.bullets);
    checkBulletVSItemsCollision(robot.bullets.bullets);

    //Chek bullets TO bullet collision
    for (let b1 of doc.bullets.bullets) {
        if (b1.life > 0) {
            for (let b2 of robot.bullets.bullets) {
                if (b2.life > 0) {
                    //Bullet to Bullet collision trigger
                    if (distance(b1, b2) < 8) {
                        //Chek all items to see if have been hit and ACTIVATE
                        for (let i of items) {
                            if (distance(b1, i) < 16) {
                                i.active = true;
                                i.solid = true;
                            }
                        }
                        //STOP BOTH bullets
                        b1.vx = b1.vy = 0;
                        b2.vx = b2.vy = 0;
                        if (b1.zoom == 0)
                            b1.zoom = 1; //trigger bullet zoom                        

                        if (b2.zoom == 0)
                            b2.zoom = 1; //trigger bullet zoom                         
                    }
                }
            }
        }
    }
}



function render() {
    setPen(BLACK);
    clear();

    //Render
    ssm.render();
}

