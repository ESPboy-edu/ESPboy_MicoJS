// Watch.js

"include /source/Scene.js";


// DATA.

const Watch__timeColor = setPen(255, 163, 0);
const Watch__timeUnderColor = setPen(93, 87, 79);
const Watch__BGColor = setPen(29, 43, 83);

const Watch__MINUTES_INIT = 24;
const Watch__MINUTES_BEFORE_INIT = 1;
const Watch__IRLMILLIS_PER_MINUTES = 2000;
const Watch__MINUTES_BEFORE_LOOP = 2;
const Watch__MINUTES_BEFORE_BLACK = 1;

let Watch__minutes;
let Watch__lastSecondTime;
let Watch__x;
let Watch__y;
let Watch__targetX;
let Watch__targetY;
let Watch__life;


// LIFECYCLE.

function Watch_init()
{
    Watch__minutes = 0;
    Watch__lastSecondTime = 0;
    Scene__enabled = false;
    Watch__targetX = getWidth() / 2;
    Watch__targetY = getHeight() / 2;
    Watch__x = Watch__targetX;
    Watch__y = Watch__targetY;
    Watch__life = 0;
}

function Watch_restart()
{
    Watch__lastSecondTime = getTime();
    Watch__minutes = Watch__MINUTES_INIT - Watch__MINUTES_BEFORE_INIT;
}

function Watch_update()
{
    let newTime = getTime();

    if (newTime - Watch__lastSecondTime > Watch__IRLMILLIS_PER_MINUTES)
    {
        Watch__lastSecondTime += Watch__IRLMILLIS_PER_MINUTES;
        Watch__minutes++;
        if (Watch__minutes == 60 + Watch__MINUTES_BEFORE_LOOP)
            Game_startLoop();
    }
    Watch__x = Watch__targetX + (Watch__x - Watch__targetX) * 0.9375;
    Watch__y = Watch__targetY + (Watch__y - Watch__targetY) * 0.9375;
    if (Watch__minutes < Watch__MINUTES_INIT)
    {
        if (B)
        {
            Watch__minutes = Watch__MINUTES_INIT; // To skip the "intro".
            Watch__life = 8;
        }
        else
        {
            Scene__enabled = false;
            Watch__targetX = getWidth() / 2;
            Watch__targetY = getHeight() / 2;
            if (ticker_4 && Watch__life < 8) Watch__life++;
        }
    }
    else if (Watch__minutes == Watch__MINUTES_INIT)
    {
        Scene__enabled = true;
        Watch__targetX = getWidth() - 17;
        Watch__targetY = 17;
    }
    else if (Watch__minutes < 60)
    {
        // TODO: ??
    }
    else if (Watch__minutes == 60)
    {
        Watch__targetX = getWidth() / 2;
        Watch__targetY = getHeight() / 2;
    }
    else if (Watch__minutes <= 60 + Watch__MINUTES_BEFORE_BLACK)
    {
        if (ticker_4 && Watch__life > 0) Watch__life--;
        Scene__enabled = ticker_1;
    }
    else
        Scene__enabled = false;
}

function Watch_render()
{
    setMirrored(false);
    setPen(Watch__BGColor);
    rect(Watch__x - 16, Watch__y - 16, 33, 24);

    setFont(R.fontKoubit);
    setPen(Watch__timeUnderColor);
    text("88:88", Watch__x - 16 + 1, Watch__y - 16 + 9);
    setPen(Watch__timeColor);
    if (Watch__minutes < Watch__MINUTES_INIT)
        text("7:24", Watch__x - 16 + 8, Watch__y - 16  + 9);
    else if (Watch__minutes >= 60)
        text("8:00", Watch__x - 16 + 8, Watch__y - 16  + 9);
    else
        text("7:" + Watch__minutes, Watch__x - 16  + 8, Watch__y - 16  + 9);
    setPen(0);
    image(R.WatchUI5, Watch__x - 11, Watch__y - 11);
    image(R.WatchUI4, Watch__x + 13, Watch__y - 11);

    image(Watch__heartFor(1), Watch__x - 11, Watch__y + 5);
    image(Watch__heartFor(3), Watch__x - 3, Watch__y + 5);
    image(Watch__heartFor(5), Watch__x + 5, Watch__y + 5);
    image(Watch__heartFor(7), Watch__x + 13, Watch__y + 5);
}

function Watch__heartFor(refValue)
{
    if (Watch__life > refValue) return R.WatchUI3;
    if (Watch__life == refValue) return R.WatchUI2;
    return R.WatchUI1;
}