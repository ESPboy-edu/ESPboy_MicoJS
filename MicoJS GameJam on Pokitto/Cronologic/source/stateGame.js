// stateGame.js

function stateGameRecUpdate() {
    //input
    if (edgeB.rising) {
        ssm.setState(stateGamePlayUpdate, stateGamePlayRender);//Goto PLAY
        recorder.rewind();
        initLevel();
    }
    doc.control(LEFT, RIGHT, UP, DOWN, A, B);
    recorder.record(dt);
}

function stateGamePlayUpdate() {
    //input
    if (edgeB.rising) {
        ssm.setState(stateGameRecUpdate, stateGameRecRender);//Goto REC
        recorder.clear();
        initLevel();
    }
    recorder.replay(dt);
    doc.control(recorder.LEFT, recorder.RIGHT, recorder.UP, recorder.DOWN, recorder.A, recorder.B);
    robot.control(LEFT, RIGHT, UP, DOWN, A, B);

    //Only here you can trigger end game condition
    if (IsLevelCompleted()) {
        ssm.setState(stateGameRoomCompleteUpdate, stateGameRoomCompletedRender, 4000); //Room Complete
    }
}

function stateGameRoomCompleteUpdate() {
    if (ssm.isElapsed()) {
        actualLevel++;
        if (actualLevel < 4)
            ssm.setState(stateGameInitUpdate, stateGameInitRender, 500);
        else
            ssm.setState(stateGameEndUpdate, stateGameEndRender, 5000);
    }
}

//--------------------------------------------------------------------------------------------

function stateGameRender() {
    //-----------------------------------------------
    //DRAW GAME
    //-----------------------------------------------
    setPen(0);
    //Draw Tile
    for (let x = 0; x < getWidth(); x += 16) {
        for (let y = 0; y < getWidth(); y += 16) {
            image(R.FloorTileBlack, x, y);
        }
    }

    //Draw game stuff
    setPen(0);
    for (let i of items) { i.render(); }
    doc.render();
    robot.render();

    //TOP AND BOTTOM BARS BACK    
    setPen(BLACK);
    rect(0, 0, getWidth(), 10);

    //GUI BOTTOM
    setPen(BLACK);
    rect(0, getHeight() - 10, getWidth(), 10);
    if (dt > 0) {
        setPen(WHITE)
        text("TIME:" + round(dt / 100) / 10, 2, getHeight() - 8);
    }

}

function stateGameRecRender() {
    //Base Render------
    stateGameRender();
    //-----------------

    setPen(GREEN);
    text("DOC PLAY, B SWAP", 5, 2);

    //----
    if (recorder.iREC < MAX_EVENTS - 1) {
        setPen(VIOLET);
        text("REC:" + recorder.iREC + "/" + (MAX_EVENTS - 1), getWidth() * 0.5, getHeight() - 8);
    }
    else {
        ///FULL
        setPen(BLACK);
        rect(getWidth() * 0.5 - 40, getHeight() * 0.5 - 6, 80, 18);
        if (round(dt / 250) % 2 == 0)
            setPen(RED);
        else
            setPen(YELLOW);
        text("MEMORY FULL", getWidth() * 0.5 - 32, getHeight() * 0.5);
    }
}

function stateGamePlayRender() {
    //Base Render------
    stateGameRender();
    //-----------------

    setPen(VIOLET);
    text("ROB PLAY, B SWAP", 5, 2);

    //MEMORY STATE
    setPen(GREEN);
    text("PLAY:" + recorder.iPLAY + "/" + (MAX_EVENTS - 1), getWidth() * 0.5, getHeight() - 8);
}



function stateGameRoomCompletedRender() {

    //Normal render
    stateGameRender();
    //And Text
    if (ssm.elapsedTime() > 1000) {
        drawWarp(ssm.elapsedTime() - 1000);
        setPen(WHITE);
        text("ROOM COMPLETE!", getWidth() * 0.5 - 48, getHeight() * 0.5);
    }
}
