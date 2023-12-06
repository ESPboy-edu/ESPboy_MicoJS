// stateGameEnd.js

function stateGameEndUpdate() {


}


function stateGameEndRender() {
setPen(WHITE);
        text("CONGRATULATION!", 10, 30);
        text("YOU COMPLETE THE GAME", 10, 50);
        if (ssm.isElapsed()) {
            setPen(GREEN);
            text("REALLY, THERE's NOTHING", 10, 70);
            setPen(VIOLET);
            text("ELSE HERE :)", 10, 80);
        }

}