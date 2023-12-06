// SSM.js

class SSM {
    constructor() {
        this.state = "";
        this.timer = 0;
        this.startTime = 0;

        this.update;
        this.render;
    }

    isElapsed() {
        return getTime() > this.timer;
    }

    setState(stateUpdate,stateRender, timeout = 0) {
        this.update = stateUpdate;
        this.render = stateRender;
        this.timer = getTime() + timeout;
        this.startTime = getTime();
    }

    elapsedTime() {
        return getTime() - this.startTime;
    }

    update() {
        this.update();
    }

    render() {
        this.render();
    }

}

