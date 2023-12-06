// Item.js

class Item {
    constructor(x, y, spriteOn, spriteOff, solid) {
        this.x = x;
        this.y = y;
        this.spriteOn = spriteOn;
        this.spriteOff = spriteOff;
        this.solid = solid;
        this.active = false;
    }

    update(time) {
    }

    render() {
        setPen(0);
        if (this.active)
            image(this.spriteOn, this.x, this.y,)
        else
            image(this.spriteOff, this.x, this.y,)
    }
}

