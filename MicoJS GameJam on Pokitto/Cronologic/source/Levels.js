// Levels.js

function loadLevel1() {
    doc.x = snap16(getWidth() * 0.75);
    doc.y = snap16(getHeight() * 0.5);
    doc.mirrored = true;
    doc.angleDir = PI;
    robot.x = snap16(getWidth() * 0.25);
    robot.y = snap16(getHeight() * 0.5);

    items[0] = new Item(snap16(getWidth() * 0.5), snap16(getHeight() * 0.5), R.PortalOn, R.PortalOff, false);
}

function loadLevel2() {
    doc.x = snap16(getWidth() * 0.75);
    doc.y = snap16(getHeight() * 0.5);
    doc.mirrored = true;
    doc.angleDir = PI;
    robot.x = snap16(getWidth() * 0.25);
    robot.y = snap16(getHeight() * 0.5);

    items[0] = new Item(snap16(getWidth() * 0.5), snap16(getHeight() * 0.5), R.PortalOn, R.PortalOff, false);
    items[1] = new Item(snap16(getWidth() * 0.5), snap16(getHeight() * 0.75), R.PortalOn, R.PortalOff, false);

    items[2] = new Item(snap16(getWidth() * 0.5) + 16, snap16(getHeight() * 0.25), R.Computer, R.Computer, true);
    items[3] = new Item(snap16(getWidth() * 0.5), snap16(getHeight() * 0.75) - 16, R.Computer, R.Computer, true);
    items[4] = new Item(snap16(getWidth() * 0.5) + 16, snap16(getHeight() * 0.5), R.Computer, R.Computer, true);
}

function loadLevel3() {
    doc.x = snap16(getWidth() * 0.9);
    doc.y = snap16(getHeight() * 0.9);
    doc.mirrored = true;
    doc.angleDir = PI;
    robot.x = snap16(getWidth() * 0.1);
    robot.y = snap16(getHeight() * 0.1);

    let px = snap16(getWidth() * 0.5);
    let py = snap16(getHeight() * 0.5);
    items[0] = new Item(px, py, R.PortalOn, R.PortalOff, false);
    items[1] = new Item(px + 16, py, R.PortalOn, R.PortalOff, false);
    items[2] = new Item(px - 16, py, R.PortalOn, R.PortalOff, false);
    items[3] = new Item(px, py + 16, R.PortalOn, R.PortalOff, false);
    items[4] = new Item(px, py - 16, R.PortalOn, R.PortalOff, false);
}