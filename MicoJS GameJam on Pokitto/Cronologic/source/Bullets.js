// Bullets.js
const MAX_BULLETS = 3;
const BULLET_SPEED = 1.25;
const BULLET_LIFE = 3000;

class Bullet {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.zoom = 0;
        this.life = 0;
    }

    update(time) {
        if (this.life > time) {
            this.x += this.vx;
            this.y += this.vy;
            if (this.zoom > 0)
                this.zoom += 0.1;
        } else {
            this.life = 0;
            this.zoom = 0;
        }
    }

    render(ownerName) {
        setPen(0);
        let angle = this.zoom * 15;
        let scale = 1;
        if (this.zoom > 0)
            scale = this.zoom;
        if (ownerName == "doc")
            image(R.BulletViolet, this.x, this.y, angle, scale);
        else
            image(R.BulletGreen, this.x, this.y, angle, scale);        
    }
}

class Bullets {
    constructor() {
        this.bullets = new Array(MAX_BULLETS);
        for (let i = 0; i < this.bullets.length; ++i) {
            this.bullets[i] = new Bullet();
        }
    }

    add(x, y, a,) {
        for (let b of this.bullets) {
            if (b.life == 0) {
                b.x = x;
                b.y = y;
                b.vx = BULLET_SPEED * cos(a);
                b.vy = BULLET_SPEED * sin(a);
                b.life = getTime() + BULLET_LIFE;
                return;
            }
        }
    }

    update(time) {
        for (let b of this.bullets) {
            b.update(time);
        }
    }

    render(ownerName) {
        //-----
        for (let b of this.bullets) {
            if (b.life > 0) {
                b.render(ownerName);
            }
        }
    }
}

