// GameObject.js

let animationType = new Array(maxNumOfGobs);
let heroAllowNewBullet = true; 

// *** AnimatedImage

class AnimatedImage {

    constructor(frameArray_, frameHMirrorArray_, frameCount_, frameDur_) {
        this.frameArray = frameArray_;  // Animation frame bitmaps
        this.frameHMirrorArray = frameHMirrorArray_;  // Horizontal mirror flags for each frame
        this.frameCount = frameCount_;  // Number of frames
        this.currFrame = 0; // The current frame index
        this.frameDur = frameDur_; // The dureation of the frame
        this.nextFrameAt = 0;  // The time when the next fram should be switched to.
    }

    // Switch the frame if needed.
    update() {
        let now = getTime();
        if (this.nextFrameAt < now) {
            if (++this.currFrame >= this.frameCount)
                this.currFrame = 0;
            this.nextFrameAt = now + this.frameDur;
        }
    }

    // Draw the current frame.  
    draw(x, y, scale, rot) {
        let hMirror = false;
        if (this.frameHMirrorArray.length == this.frameCount)
            hMirror = this.frameHMirrorArray[this.currFrame];
        setMirrored(hMirror);
        //setPen(0);
        image(this.frameArray[this.currFrame], x, y, rot, scale);
        setMirrored(false);
    }
}

// *** GameObject

function InitGameObject(o, i) {

    o.index = i;
    o.x = mazeTileSize * 1.5;  // x position
    o.y = mazeTileSize * 1.5;  // y position
    o.speed = 0.1; // Speed in pixels.
    o.speedX = o.speed; // x speed in pixels.
    o.speedY = o.speed; // y speed in pixels.
    o.color = 0; // color
    o.activeColor = 0; // color
    o.direction = 1; // Any of the four directions we are moving to. 1=right, 2=left, 3=up, 4=down
    o.isActive = true; // True, if the gob should be drawn and updated. 
    o.scale = 1.0;
    o.activeScale = 1.0;       
    o.rotation = 0.0;
    o.activeRotation = 0.0;   
    o.halfWidth = 0;
    o.halfHeight = 0;


    o.timeToChangeDir = 0;

    // Animation event
    o.animationEndTime = 0;
    //o.animationType = 0; 
    o.animationScaleFactor = 0;
    o.hitCounter = 0;

    o.collisionRectArr[0] = 0; 
    o.collisionRectArr[1] = 0; 
    o.collisionRectArr[2] = 0; 
    o.collisionRectArr[3] = 0; 

    animationType[i] = 0;
    heroAllowNewBullet = true;

    //debug("animationType="+animationType[i]);
    //debug("o.animationEndTime="+o.animationEndTime);
    //debug("o.hitCounter="+o.hitCounter);
    
}

class GameObject {

    // Get rounded values on the screen.
    getScreenX() { return round(this.x - CAMERA_X); }
    getScreenY() { return round(this.y - CAMERA_Y); }

    // Update.
    update() {

        // Check collision and move.

        // Movement controlled by the keys (micoman)
        let changed = false;
        if (this.type == "hero") {
            
            // *** Move Hero
            this.MoveHero();

        } else if (this.type == "cow" || this.type == "fox") {

            // *** Move Fox and Cows randomly.
            this.MovingAI();

            // Check fox collision to cow or bullets
            if (this.type == "fox") {
                this.CheckFoxCollisionToOtherGobs();
            }
            
        }  // end cow or fox

        // *** Update animation if needed.
        if (this.direction == 2)
            this.animLeft.update();
        else if (this.direction == 1)
            this.animRight.update();
        else if (this.direction == 3)
            this.animUp.update();
        else if (this.direction == 4)
            this.animDown.update();

        // Set active color
        //this.activeColor = this.color;

        this.activeScale = this.scale;

        // *** Animation event
        this.HandleEvents();
    }

    HandleEvents()
    {
        if(animationType[this.index] == 1 ) {

            // *** hit animation
            //debug("anim active")
            if(this.animationEndTime<getTime()) {
                // end the animation
                if(animationType[this.index] == 1) // scale
                    this.animationScaleFactor = 0; 
                animationType[this.index] = 0;
            }
            else {
                this.activeScale = this.animationScaleFactor;
            }
        }
        else if(animationType[this.index] == 2 ) {

            // *** explode animation
            //debug("anim active")
            let delta  = this.animationEndTime-getTime()
            if(delta<=0) {
                // end the animation
                //if(animationType[this.index] == 1) // scale
                //    this.animationScaleFactor = 0; 
                animationType[this.index] = 0;
                this.isActive = false; // I am dead

                // *** last cow?
                if (this.type == "cow") {
                    // *** Cow died. Is there cows left
                    numCows--;                   
                    if(numCows<=0) {
                        // Game lost. Go the gameover mode
                        gameState = "gameover";
                    }
                }
                else if(this.type == "fox") {
                    // *** Fox died. Raffle a new one!  
                    //debug("fox died")   

                    numFoxes--; 
                    if(numFoxes<=0)
                    {                   
                        // *** Respawn foxes!

                        // Increase the number of foxes
                        numFoxes = 0;
                        numFoxesInThisLevel++;
                        if(numFoxesInThisLevel>foxMaxCount) 
                            numFoxesInThisLevel = foxMaxCount;

                        //debug("numFoxesInThisLevel="+numFoxesInThisLevel) 
                        
                        for (let i = 0; i < numOfGobs; i++) {
                            //debug("i="+i)
                            let fox = allObjectArray[i];
                            if (fox.type=="fox") {

                                //  Raffle new starting posiotions.
                                let posFound = false;
                                while(!posFound) {
                                    fox.x = rand(fox.halfWidth, screenWidth);
                                    fox.y = rand(fox.halfHeight, screenHeight);
                                    if(!fox.hasCollidedToTile(fox.x, fox.y))
                                        posFound=true;
                                }
                            

                                fox.scale = 1.0;
                                fox.isActive = true;
                                //this.speed *= 1.1;  // increase speed
                                //debug("fox respawn!")

                                numFoxes++; 
                                if(numFoxes >= numFoxesInThisLevel)
                                    break;
                            }
                        }
                    }
                }
            }
            else {
                // Shrink by time
                this.activeScale = delta / 1000;
            }
        }
    }

    // Move the cows and the fox
    MovingAI() {

        let retryCount=5;    
        if (this.type == "cow") 
            retryCount = 1;

        for(let i=0; i < retryCount; i++) 
        {

            if(this.timeToChangeDir < getTime() ) {

                // *** Time to change the direction
                let newDir = rand(4); // an integer between 0 and 3
                this.speedX = 0;
                this.speedY = 0;
                if(newDir==0) this.speedY = -this.speed;
                else if(newDir==1) this.speedX = this.speed;
                else if(newDir==2) this.speedY = this.speed;
                else this.speedX = -this.speed;
                this.timeToChangeDir = getTime() + (2*1000);    
            }

            // *** Check collision to the tiles.

            let newX = this.x + this.speedX;
            let newY = this.y + this.speedY;
            if( newX > this.halfWidth &&
                newY > this.halfHeight &&
                newX < worldWidthInPixels-this.halfWidth && 
                newY < worldHeightInPixels-this.halfHeight ) {

                if( ! this.hasCollidedToTile(newX, newY) ) {
                    // *** Can move !!!
                    this.x = newX;
                    this.y = newY;
                    // if (this.type == "fox")
                    //     debug("can move !!!"+this.speedX+", "+this.speedY); 
                    break;
                } else {

                    // *** Cannot move. Collides to a tile.
                    this.timeToChangeDir = 0; // Change speed as soon as possible.
                    // if (this.type == "fox")
                    //     debug("cannot move:"+this.speedX+", "+this.speedY); 
                }
            }
            else {
                // ** Cannot move. Would go out of bounds.
                this.timeToChangeDir = 0; // Change speed as soon as possible.
            }
        }
    }


    // *** Move hero.
    MoveHero() {

        if(!A)
            heroAllowNewBullet = true;
            let rot = 0;

        // Move direction.
        let dir = null; 
        if(RIGHT)
            dir = "right";
        else if(LEFT)
            dir = "left";
        if(DOWN)
            dir = "down";
        else if(UP)
            dir = "up";

        //
        if(dir!=null)
            this.CheckCollisionAndMove(dir);

        // Set rotation
        if(RIGHT && UP) {
            rot = 0;
            gunGob.activeRotation = HALF_PI/2;
        }
        else if(RIGHT && DOWN) {
            rot = 0;
            gunGob.activeRotation = TWO_PI - HALF_PI/2;
        }
        else if(LEFT && UP){
            rot = 0;
            gunGob.activeRotation = PI - HALF_PI/2;
        }
        else if(LEFT && DOWN){
            rot = 0;
            gunGob.activeRotation = PI + HALF_PI/2;
        }
        else if(RIGHT) {
            rot = 0;
            gunGob.activeRotation = 0;
        }
        else if(UP){
            rot = 0;
            gunGob.activeRotation = HALF_PI;
        }
        else if(LEFT) {
            //debug("gun left")
            rot = 0;
            gunGob.activeRotation = PI;
        }
        else if(DOWN) {
            rot = 0;
            gunGob.activeRotation = PI+ HALF_PI;
        }

        // Set gun pos
        let r=10;
        let newX = cos(gunGob.activeRotation)*r;
        let newY = -sin(gunGob.activeRotation)*r;
        gunGob.x = this.x + newX;
        gunGob.y = this.y + newY;

        // Fired?
        if(A) {

            // Launch bullet
            if(heroAllowNewBullet) {
                heroAllowNewBullet = false;
                let bullet = getFeeBullet();
                if(bullet!=null) {
                    //debug("lauch bullet");
                    bullet.isActive  = true;
                    bullet.x = this.x;
                    bullet.y = this.y;
                    bullet.speedX = cos(gunGob.activeRotation)*bulletSpeed;
                    bullet.speedY = -sin(gunGob.activeRotation)*bulletSpeed;
                }
            }

            //this.autofireTime = getTime() + 500;
            gunGob.isActive = true;      
        }      
        else
            gunGob.isActive = false;

        // Check if the hero has collided to the other game objects
        //this.CheckCollisionToOtherGobs();
    }


    // If there are no blocking tiles ahead, move forward.
    CheckCollisionAndMove(dir) {
        let changed = false;
        if (dir == "right") {  // right
            let newX = this.x + this.speedX;

            if(newX < (mazeW*mazeTileSize)-this.halfWidth) {

                let coll = this.hasCollidedToTile(newX, this.y);
                if (!coll) {
                    // Not collided
                    this.x = newX;
                    this.direction = 1;
                    changed = true;
                }
            }
        }
        else if (dir == "left") {  // left
            let newX = this.x - this.speedX;

            if(newX > this.halfWidth) {

                let coll = this.hasCollidedToTile(newX, this.y);
                if (!coll) {
                    // Not collided, go towards the next tile center.scale
                    this.x = newX;
                    this.direction = 2;
                    changed = true;
                }
            }
        }
        else if (dir == "down") { // down

            //if(this.type=="hero") debug("hero go down");

            let newY = this.y + this.speedY;

            if(newY < (mazeH*mazeTileSize)-this.halfHeight) {

                let coll = this.hasCollidedToTile(this.x, newY);
                if (!coll) {
                    // Not collided
                    this.y = newY;
                    this.direction = 4;
                    changed = true;
                }
            }
        }
        else if (dir == "up") {  // up
            let newY = this.y - this.speedY;

            if(newY > this.halfHeight) {

                let coll = this.hasCollidedToTile(this.x, newY);
                if (!coll) {
                    // Not collided, go towards the next tile center.scale
                    this.y = newY;
                    this.direction = 3;
                    changed = true;
                }
            }
        }

        return changed;
    }

    // Check if Mr Fox have collided with other gobs
    CheckFoxCollisionToOtherGobs() {

        //debug("animType="+animationType[this.index]);

        // *** Check collision to cows

        let cow = this.CheckCollisionToOtherGobs("cow");
        //debug("fox ("+this.x+","+this.y+") hit cow.("+cow.x+","+cow.y+")");
        if(cow != null) {
            if(animationType[cow.index]==0) {
                //debug("fox hit cow!")
                cow.hitCounter++;
                if(cow.hitCounter>0)
                    cow.startExplodeAnimation();
                else 
                    cow.startHitAnimation();
            }
        }

        //debug("CheckFoxCollisionToOtherGobs 2");

        // *** Check collision to bullets

        if(animationType[this.index]==0) {
            //debug("bulletcoll1");
            let x = this.collisionRectArr[0] + this.x;
            let y = this.collisionRectArr[1] + this.y;
            let w = this.collisionRectArr[2] - this.collisionRectArr[0];
            let h = this.collisionRectArr[3] - this.collisionRectArr[1];
            for (let i = 0; i < maxBullets; i++) {
                //debug("bulletcoll2");
                let b = bullets[i];
                if (b.isActive ) {
                    //debug("bulletcoll3");
                    //debugTxt += "check fox shot";
                    let xOverlap = (b.x < x + w) && (b.x > x);
                    let yOverlap = (b.y < y + h) && (b.y > y);
                    //if(xOverlap) debug("fox shot! xOverlap");
                    //if(yOverlap) debug("fox shot! yOverlap");
                    if(xOverlap && yOverlap) {
                        
                        // *** HIT!
                        //debug("bulletcoll4");
                        //debug("fox shot!");
                        //debugTxt += "fox shot!";
                        this.hitCounter++;
                        if(this.hitCounter>3)
                        {
                            foxesKilled++;
                            this.startExplodeAnimation();
                        }
                        else 
                            this.startHitAnimation();
                    }
                }
            }
        }
    }

    // Check if we have collided with other gobs (the ghost, food, etc.)
    // Called only for the MicoMan
    CheckCollisionToOtherGobs(collidedType) {

        // my rect
        let x = this.collisionRectArr[0] + this.x;
        let y = this.collisionRectArr[1] + this.y;
        let w = this.collisionRectArr[2] - this.collisionRectArr[0];
        let h = this.collisionRectArr[3] - this.collisionRectArr[1];

        //
        //debug("test 1");
        for (let i = 0; i < numOfGobs; i++) {
            let o = allObjectArray[i]; 
            if (o.isActive && o!=this) {

                //debug("i="+i+" type="+o.type);

                let collided = this.CheckRectCollision(x, y, w, h, 
                    o.collisionRectArr[0] + o.x, o.collisionRectArr[1] + o.y, 
                    o.collisionRectArr[2] - o.collisionRectArr[0], o.collisionRectArr[3] - o.collisionRectArr[1] );

                if(collided && o.type==collidedType) {
                    return o;
                }

            }
        }

        return null;
    }

    startHitAnimation() {
        // 
        this.animationEndTime = getTime() + 200;
        animationType[this.index] = 1; 
        this.animationScaleFactor = 0.9;
    }

    startExplodeAnimation() {
        // 
        this.animationEndTime = getTime() + 1000;
        animationType[this.index] = 2; 
    }

    // Returns true, if there is a blocking tile.
    hasCollidedToTile(x, y) {

        // Check each corner
        let tlx = round(x + this.collisionRectArr[0]); 
        let tly = round(y + this.collisionRectArr[1]); 
        let brx = round(x + this.collisionRectArr[2]); 
        let bry = round(y + this.collisionRectArr[3]); 
        let rx = round(x);
        let ry = round(y);

        let collided = 
            getTileProperty(tlx - CAMERA_X, tly- CAMERA_Y, "blocking") || 
            getTileProperty(brx - CAMERA_X, tly- CAMERA_Y, "blocking") ||
            getTileProperty(tlx - CAMERA_X, bry- CAMERA_Y, "blocking") ||
            getTileProperty(brx - CAMERA_X, bry- CAMERA_Y, "blocking") ||
            getTileProperty(rx - CAMERA_X, tly- CAMERA_Y, "blocking") ||
            getTileProperty(rx - CAMERA_X, bry- CAMERA_Y, "blocking") ||
            getTileProperty(tlx - CAMERA_X, ry- CAMERA_Y, "blocking") ||
            getTileProperty(brx - CAMERA_X, ry- CAMERA_Y, "blocking");
  
        return collided;

    }

    // Function to check collision
    CheckRectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
        // Check for overlap in the x-axis
        //debug("first: ("+x1+","+y1+","+w1+","+h1+") second:("+x2+","+y2+","+w2+","+h2+")");
        let xOverlap = (x1 < x2 + w2) && (x1 + w1 > x2);
        //debug("done")

        // Check for overlap in the y-axis
        let yOverlap = (y1 < y2 + h2) && (y1 + h1 > y2);

        //if(xOverlap && yOverlap)
        //    debug("this: ("+x1+","+y1+","+w1+","+h1+") collided to:("+x2+","+y2+","+w2+","+h2+")");

        // Return true if there is a collision
        return xOverlap && yOverlap;
    }


    // Draw the frame bitmap.
    render() {

        //if(this.type == "gun" && this.activeRotation>HALF_PI && this.activeRotation<TWO_PI - HALF_PI)
        //    setFlipped(true);

        setPen(this.activeColor);

        if (this.direction == 2)
            this.animLeft.draw(this.getScreenX(), this.getScreenY(), this.activeScale, this.activeRotation);
        else if (this.direction == 1)
            this.animRight.draw(this.getScreenX(), this.getScreenY(), this.activeScale, this.activeRotation);
        else if (this.direction == 3)
            this.animUp.draw(this.getScreenX(), this.getScreenY(), this.activeScale, this.activeRotation);
        else if (this.direction == 4)
            this.animDown.draw(this.getScreenX(), this.getScreenY(), this.activeScale, this.activeRotation);

        setFlipped(false);
    }
}

