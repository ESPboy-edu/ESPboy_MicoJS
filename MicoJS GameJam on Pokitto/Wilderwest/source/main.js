
//"push header-cpp #define ENABLE_PROFILER 1";
"push title Game Title";
"push author Your Name";
"push description A MicoJS game";
"set version v0.0.1";
"set category game";
"set url https://micojs.github.com";

const bgColor = setPen(0, 0, 0);
const txtColor = setPen(64, 128, 255);
const blueColor = setPen(0, 0, 255);
const redColor = setPen(255, 110, 80);
const greenColor = setPen(0, 180, 0);
const grey1Color = setPen(0, 0, 100);
const grey2Color = setPen(0, 0, 150);
const grey3Color = setPen(0, 0, 190);
const darkBlueColor = setPen(20, 20, 100);
const yellowColor = setPen(255, 255, 0);
const whiteColor = setPen(255, 255, 255);
const blackColor = setPen(0, 0, 0);
const brownColor = setPen(117, 38, 17);

let screenWidth, screenHeight;
const mazeW = 30;
const mazeH = 30;
const mazeTileSize = 16;
const worldWidthInPixels = mazeW*mazeTileSize;
const worldHeightInPixels = mazeH*mazeTileSize;
let gameState = "gameover";
const maxNumOfGobs = 15;
let allObjectArray = new Array(maxNumOfGobs);
let numOfGobs = 0;
let score = 0;
const maxBullets = 5;
let bullets = new Array(maxBullets);
const cowMaxCount = 10;
let numCows = cowMaxCount;
const foxMaxCount = 3;
let numFoxes = 1;
let numFoxesInThisLevel = 1;
let foxesKilled = 0;

//let debugTxt = "debug";


// Include the game object classes.
"include /source/gameObject.js";
"include /source/bullet.js";
"include /source/minimap.js";

let heroGob;
let gunGob;

let minimapWindow;

function init() {

    // Init.
    heroGob = new GameObject();
    gunGob = new GameObject();
    minimapWindow = new minimap();

    // Set the frame rate.
    setFPS(20);

    screenWidth = getWidth();
    screenHeight = getHeight();

    setFont(R.fontZXSpec);

    // setup the tilemap
    setTileMap(R.neonwires2);
    CAMERA_X = 0;
    CAMERA_Y = 0;

    // Create cows
    for (let i = 0; i < cowMaxCount; i++) {
        // Create the cow game object.
        let cow = new GameObject();
        cow.type = "cow";
        cow.collisionRectArr = new Array(4); 

        cow.animLeft = new AnimatedImage(
            [R.cow1, R.cow1],
            [false, true], 2, 400
        );
        cow.animRight = cow.animLeft;
        cow.animUp = cow.animLeft;
        cow.animDown = cow.animLeft;
        allObjectArray[numOfGobs++] = cow;
    }

    // Create foxes
    for (let i = 0; i < foxMaxCount; i++) {
        // Create the fox game object.
        let fox = new GameObject();
        fox.type = "fox";
        fox.collisionRectArr = new Array(4); 
        fox.animLeft = new AnimatedImage(
            [R.fox1,R.fox1],
            [false, true], 2, 100
        );
        fox.animRight = fox.animLeft;
        fox.animUp = fox.animLeft;
        fox.animDown = fox.animLeft;
        allObjectArray[numOfGobs++] = fox;
    }

    // Create the hero game object.
    heroGob.type = "hero";
    heroGob.collisionRectArr = new Array(4); 
    heroGob.animLeft = new AnimatedImage(
        [R.hero1, R.hero1],
        [false, true], 2, 200
    );
    heroGob.animRight = heroGob.animLeft;
    heroGob.animUp = heroGob.animLeft;
    heroGob.animDown = heroGob.animLeft;
    allObjectArray[numOfGobs++] = heroGob;

    // Create the gun game object.
    gunGob.type = "gun";
    gunGob.collisionRectArr = new Array(4); 
    gunGob.animLeft = new AnimatedImage(
        [R.gun],
        [], 1, 100
    );
    gunGob.animRight = gunGob.animLeft;
    gunGob.animUp = gunGob.animLeft;
    gunGob.animDown = gunGob.animLeft;
    allObjectArray[numOfGobs++] = gunGob;


    // Create bullets
    for(let i=0; i<maxBullets;i++ )
        bullets[i] = new Bullet();

    // Reset all.
    reset();

}

function reset() {

    //debug("reset 1");    

    numCows = cowMaxCount;
    foxesKilled = 0;
    numFoxesInThisLevel = 1;
    numFoxes = 1; 

    // Init game objects
    let oneFoxSetActive = false;
    for (let i = 0; i < numOfGobs; i++) {

        //debug("reset:i="+i);    

        if (allObjectArray[i].type=="cow") {           

            // init cow
            let cow = allObjectArray[i];
            InitGameObject(cow,i);
            cow.color = 0;
            cow.speed = 0.3;
            cow.speedX = rand(-1,2,0) * cow.speed;
            cow.speedY = rand(-1,2,0) * cow.speed;
            cow.collisionRectArr[0] = -10;
            cow.collisionRectArr[1] = -15;
            cow.collisionRectArr[2] = 10;
            cow.collisionRectArr[3] = 15;
            cow.halfWidth = 10;
            cow.halfHeight = 10;  
            
            while(true) {
                cow.x = rand(cow.halfWidth, worldWidthInPixels);
                cow.y = rand(cow.halfHeight, worldHeightInPixels);
                if(!cow.hasCollidedToTile(cow.x, cow.y))
                    break;
            }

            cow.scale = 1.0;
            cow.animationType = 0;
            //debug("reset 2");    
        }
        
        if (allObjectArray[i].type=="fox") {
            
            // Init fox.
            let fox = allObjectArray[i];
            InitGameObject(fox,i);
            if(oneFoxSetActive)
                fox.isActive = false;
            else {
                oneFoxSetActive = true;
                fox.isActive = true;
                }
            fox.color = 0;
            fox.speed = 4.2;
            fox.speedX = rand(-1,2,0) * fox.speed;
            fox.speedY = rand(-1,2,0) * fox.speed;
            fox.collisionRectArr[0] = -9;
            fox.collisionRectArr[1] = -15;
            fox.collisionRectArr[2] = 9;
            fox.collisionRectArr[3] = 15;
            fox.halfWidth = 9;
            fox.halfHeight = 15;
            while(true) {
                fox.x = rand(fox.halfWidth, worldWidthInPixels);
                fox.y = rand(fox.halfHeight, worldHeightInPixels);
                if(!fox.hasCollidedToTile(fox.x, fox.y))
                    break;
            }
            fox.scale = 1.0;
        }

        if (allObjectArray[i].type=="hero") {
            
            // Init the hero game object.
            InitGameObject(heroGob,i);
            heroGob.color = 0;
            heroGob.speed = 4.0;
            heroGob.speedX = heroGob.speed;
            heroGob.speedY = heroGob.speed;
            heroGob.x = 16
            heroGob.y = 16
            heroGob.scale = 1.0;
            heroGob.collisionRectArr[0] = -10;
            heroGob.collisionRectArr[1] = -10;
            heroGob.collisionRectArr[2] = 10;
            heroGob.collisionRectArr[3] = 10;
            heroGob.halfWidth = 15;
            heroGob.halfHeight = 10;
        }

        if (allObjectArray[i].type=="gun") {
            
            //debug("reset 4");    
            // Init the gun game object.  
            InitGameObject(gunGob,i);          
            gunGob.color = 0;
            gunGob.speed = 3.0;
            gunGob.speedX = gunGob.speed;
            gunGob.speedY = gunGob.speed;
            gunGob.x = 0;
            gunGob.y = 0;
            gunGob.scale = 1.0;
            gunGob.isActive = false;
        }
    }

    // Init bullets
    for(let i=0; i<maxBullets;i++ )
        bullets[i].init(0,0);
}

function update(time) {

    //!!HV TEST
    //if(B) gameState = "gameover";

    //debugTxt="dbg:";

    if (gameState == "running") {

        // Update the active game objects.
        for (let i = 0; i < numOfGobs; i++) {
            let o = allObjectArray[i]; 
            if (o.isActive)
                o.update();
        }

        // Update bullets.
        for (let i = 0; i < maxBullets; i++) {
            if (bullets[i].isActive)
                bullets[i].update();
        }

        // Scroll the map if needed
        scrollMap();

        // Make sure we do not scroll over the tilemap borders.
        CAMERA_X = mid(0, CAMERA_X, (mazeW*mazeTileSize) - screenWidth);
        CAMERA_Y = mid(0, CAMERA_Y, (mazeH*mazeTileSize) - screenHeight);  
    }
    else {

        // Game over

        if(B) {
            // *** restart game
            reset();
            gameState = "running";

        }
    }
}

// Scroll the tilemap
function scrollMap() {

    // Move the camera if nearer than 64 pixels from the screen borders.
    let scrollLimit = 64; 
    let overrun = heroGob.getScreenX() - (screenWidth-scrollLimit);
    if(overrun>0)
        CAMERA_X += overrun; 
    overrun = scrollLimit - heroGob.getScreenX();
    if(overrun>0)
        CAMERA_X -= overrun; 
    overrun = heroGob.getScreenY() - (screenHeight-scrollLimit);
    if(overrun>0)
        CAMERA_Y += overrun; 
    overrun = scrollLimit - heroGob.getScreenY();
    if(overrun>0)
        CAMERA_Y -= overrun; 
}

// Return the value between min and max.
function mid(a, x, b) {
    x = max(a,x);
    x = min(b,x);
    return x;
}

function render() {

    setPen(blackColor);
    clear();  // This clearz the command list

    if (gameState == "running") {

        // Running the game

        // Draw the active game objects.
        for (let i = 0; i < numOfGobs; i++) {
            if (allObjectArray[i].isActive) {

                allObjectArray[i].render();
            }
        }

        // Draw bullets.
        for (let i = 0; i < maxBullets; i++) {
            if (bullets[i].isActive)
                bullets[i].render();
        }

        // Draw minimap
        minimapWindow.render();

    } else {

        // *** Game over!

        // Get the suitable background. 
        CAMERA_Y = -25;
        CAMERA_X = 165;

        setPen(grey3Color);
        text(">>> WILDER", (screenWidth-128)/2+1, 5+1);
        text("         WEST <<<", (screenWidth-128)/2+1, 15+1);
        setPen(yellowColor);
        text(">>> WILDER", (screenWidth-128)/2, 5);
        text("         WEST <<<", (screenWidth-128)/2, 15);
        
        setPen(grey3Color);
        text("         v0.4", (screenWidth-128)/2, 28);

        setPen(whiteColor);
        text("G A M E   O V E R", (screenWidth-128)/2, (screenHeight/2) - 10);
        text("Press 'B' to start", (screenWidth-128)/2, (screenHeight/2) - 10 + 30);
    }

    setPen(whiteColor);
    text("Salary: " + ((numCows*1000) + (foxesKilled*400)) + "$", 1, screenHeight-10);

    //text("free bullets"+countFeeBullets(), 1, 1);

    // !!HV DEBUG
    //debugTxt = "x="+heroGob.x+" y="+heroGob.y+" a="+heroGob.isActive+" cam:"+CAMERA_X+","+CAMERA_Y;
    // debugTxt = "fox.aend=" + round(foxGob.animationEndTime)+" time="+round(getTime());

    // // Draw debug
    //setPen(blackColor);
    //rect(0,0,screenWidth,16);
    //setPen(whiteColor);
    //text(debugTxt, 0,0);
    // //text("Neon wires", 5, 5);
}

function getFeeBullet() {
    for(let i=0; i<maxBullets;i++ )
        if(bullets[i].isActive == false)
            return bullets[i];
    return null;    
}
