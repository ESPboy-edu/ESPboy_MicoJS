// Recorder.js
const MAX_EVENTS = 31;

class Recorder {
    constructor() {
        this.lastInput = -1;
        this.iREC = 0;
        this.iPLAY = 0;
        this.events = new Array(MAX_EVENTS);
        for (let i = 0; i < this.events.length; i++) {
            this.events[i] = new Event();
        }

        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.DOWN = false;
        this.A = false;
        this.B = false;
    }

    rewind() {
        this.iPLAY = 0;
    }

    clear() {
        this.iREC = 0;
        this.iPLAY = 0;
        for (let e of this.events) {
            e.dt = 0;
            e.input = 0;
        }
    }

    record(dt) {
        //save f prev
        let input = (LEFT << 0) | (RIGHT << 1) | (UP << 2) | (DOWN << 3) | (A << 4) | (B << 5);
        if (input != this.lastInput) {
            if (this.iREC < MAX_EVENTS-1) {
                this.events[this.iREC].dt = dt;
                this.events[this.iREC].input = input;
                this.iREC++;
            }
            else {
                //debug("MEMORY FULL!!");
            }                        
            this.lastInput = input;
        }        
    }

    replay(dt) {
        for (let i = this.iPLAY; i < this.events.length; i++) {
            if ((dt >= this.events[i].dt && this.events[i].dt != 0)) {
                this.LEFT = this.events[i].input & (1 << 0);
                this.RIGHT = this.events[i].input & (1 << 1);
                this.UP = this.events[i].input & (1 << 2);
                this.DOWN = this.events[i].input & (1 << 3);
                this.A = this.events[i].input & (1 << 4);
                this.B = this.events[i].input & (1 << 5);
                //debug("--->", e.input)
                this.iPLAY = i + 1; //save next play index                
                break;
            }
        }
    }

}

