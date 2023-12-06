// Player.js

const robotIdleFrames = [R.RobotIdleA, R.RobotIdleB];
const robotRunFrames = [R.RobotRunA, R.RobotRunB];
const docIdleFrames = [R.DocIdleA, R.DocIdleB];
const docRunFrames = [R.DocRunA, R.DocRunB];

class Player {
    constructor(name) {
        this.name = name;      
        this.init()
    }

    init(){
        this.life = 100;
        this.x = getWidth() / 2;
        this.y = getHeight() / 2;
        this.vx = 0;
        this.vy = 0;
        this.mirrored = false;
        this.moving = false;
        this.a = false;
        this.bullets = new Bullets();
        this.angleDir = 0;
        this.shotX = this.x;
        this.shotY = this.y;
    }

    kill() {
        this.life = 0;
    }

    update(time) {
        if (this.life < 1) return;

        this.f = floor(time / 150) % 2;
        this.vx *= 0.75;
        this.vy *= 0.75;

        //Stop on border
        if ((this.x < BORDER && this.vx < 0) || (this.x > getWidth() - BORDER && this.vx > 0)) {
            this.vx = 0;
        }
        if ((this.y < 2 * BORDER && this.vy < 0) || (this.y > getHeight() - BORDER && this.vy > 0)) {
            this.vy = 0;
        }
        //Move
        this.x += this.vx;
        this.y += this.vy;

        //Calc short cursor        
        this.shotX = this.x + 8 * cos(this.angleDir);
        this.shotY = this.y + 8 * sin(this.angleDir);

        this.bullets.update(time);
    }

    control(left, right, up, down, a, b) {
        this.moving = false;
        if (left) {
            this.vx -= 0.5;
            this.mirrored = true;
            this.moving = true;
            this.angleDir = PI;
        }
        else if (right) {
            this.vx += 0.5;
            this.mirrored = false;
            this.moving = true;
            this.angleDir = 0;
        }
        if (up) {
            this.vy -= 0.5;
            this.moving = true;
            this.angleDir = -PI / 2;
        }
        else if (down) {
            this.vy += 0.5;
            this.moving = true;
            this.angleDir = PI / 2;
        }

        //Try move X and see if it hit somethin
        let newPos = new Item();
        newPos.x = this.x + this.vx;
        newPos.y = this.y;
        for (let i of items) {
            if (i.solid && distance(newPos, i) < 12) {
                newPos.x = this.x;
                this.vx = 0;
            }
        }

        //Try move Y and see if it hit somethin
        newPos.y = this.y + this.vy;
        for (let i of items) {
            if (i.solid && distance(newPos, i) < 12) {
                newPos.y = this.y;
                this.vy = 0;
            }
        }

        //A trigger
        if (a && !this.a) {
            let color = 0
            let angle = 0;
            this.bullets.add(this.shotX, this.shotY, this.angleDir);
        }
        this.a = a;
    }

    render() {
        setMirrored(this.mirrored)
        if (this.life > 0) {
            setPen(0);
            if (this.moving) {
                if (this.name == "doc")
                    image(docRunFrames[this.f], this.x, this.y);
                else
                    image(robotRunFrames[this.f], this.x, this.y);
            } else {
                if (this.name == "doc")
                    image(docIdleFrames[this.f], this.x, this.y);
                else
                    image(robotIdleFrames[this.f], this.x, this.y);
            }
        }
        else {
            setPen(255, 0, 0);
            if (this.name == "doc")
                image(docIdleFrames[0], this.x, this.y);
            else
                image(robotIdleFrames[0], this.x, this.y);
        }

        //Draw short cursot
        if (this.name == "doc") {
            setPen(GREEN);
        } else {
            setPen(VIOLET);
        }
        rect(this.shotX, this.shotY, 2, 2);

        setMirrored(false);
        this.bullets.render(this.name);
    }

}
