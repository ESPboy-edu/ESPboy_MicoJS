// Edge.js

class Edge {
    constructor(value) {
        this.value = value;        
        this.rising = false;
        this.falling = false;        
    }

    update(value) {
        this.rising=false;
        this.falling=false;
        if (value && !this.value){
            this.rising=true;                 
        }
        if (!value && this.value){
            this.falling=true;
        }
        this.value = value;
    }
}

