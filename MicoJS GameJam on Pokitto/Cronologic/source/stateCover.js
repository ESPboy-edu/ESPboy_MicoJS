// stateCover.js
function stateCoverUpdate() {
    if (ssm.isElapsed() || (dt > 100 && (edgeA.falling || edgeB.falling))) {
        ssm.setState(stateGameInitUpdate,stateGameInitRender, 500);
    }
}

function stateCoverRender() {
    setPen(0);
    let zoomX = getWidth() / 96
    let zoomY = getHeight() / 96

    image(R.Cronologic96, getWidth() * 0.5, getHeight() * 0.5, 0, min(zoomX, zoomY))
}

