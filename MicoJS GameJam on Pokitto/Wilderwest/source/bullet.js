// bullet.js

const bulletSpeed = 8.0;

class Bullet {
    constructor() {
        this.init(0,0);
    }

    init(x,y) {
        this.x = x;  // x position
        this.y = y;  // y position
        this.speedX = 0; // x speed in pixels.
        this.speedY = 0; // y speed in pixels.
        this.color = whiteColor; // color
        this.isActive = false; // True, if the bullet should be drawn and updated. 
    }

    // Get rounded values on the screen.
    getScreenX() { return round(this.x - CAMERA_X); }
    getScreenY() { return round(this.y - CAMERA_Y); }

    update() {
        if(!this.isActive)
            return;

       this.x += this.speedX;
       this.y += this.speedY;

       if(this.getScreenX()<-10 || this.getScreenX() > screenWidth || this.getScreenY()<-10 || this.getScreenY() > screenHeight)
            this.isActive = false;
    }

    render() {
        if(!this.isActive)
            return;

        //debug("draw bullet"+this.x+" "+this.y);
        image(R.bullet, this.getScreenX(), this.getScreenY());
    }
}

