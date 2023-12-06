// stateGameInit.js

function stateGameInitUpdate() {
    //input
    if (dt > 100 && (edgeA.falling || edgeB.falling)) {
        initLevel();
        recorder.clear();
        ssm.setState(stateGameRecUpdate,stateGameRecRender);
    }
}

function stateGameInitRender() {
    //-----------------------------------------------
    //DRAW INIT TEXT
    let c = abs(sin(dt / 1000)) * 125;
    let k = abs(cos(dt / 1000)) * 125;
    setPen(c, k, c);
    clear();

    setPen(WHITE);
    let tx = 5;
    let ty = 5;
    text("DOC AND ROB[ot]", tx, ty); ty += 10;
    text("MUST SHOT AT", tx, ty); ty += 10;
    text("THE SAME TIME", tx, ty); ty += 10;
    text("THE PORTAL", tx, ty); ty += 10;
    text("TO TRIGGER IT.", tx, ty); ty += 10;
    text("", tx, ty); ty += 10;
    text("BUT ROBOT CAN READ", tx, ty); ty += 10;
    text("ONLY FEW COMMANDS", tx, ty); ty += 10;
    text("AHEAD OF TIME.", tx, ty); ty += 10;

    text("", tx, ty); ty += 10;
    text("LOADED ROOM: " + actualLevel, tx, ty); ty += 10;

    text("PRESS A OR B ...", 5, getHeight() - 10);
    //-----------------------------------------------
}