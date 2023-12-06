// Warp.js


function drawWarp(delta) {

    var t = delta / 512 % 8;

    if (t < 100) {
        setPen(240, 240, 240);
        //clear(255, 255, 255);
    }

    for (let i = 24; i > 0; i--) {
        let ii = i * i;
        if ((i + round(t / 10)) % 2 == 0) { setPen(i, ii, i); }
        else { setPen(ii, i, ii); }
        //---
        rectC(0, 0, t * ii / 16, t * ii / 16);
    }
}

function rectC(x, y, w, h) {
    let ox = (getWidth() - w) * 0.5 + x;
    let oy = (getHeight() - h) * 0.5 + y;
    rect(ox, oy, w, h)
}

