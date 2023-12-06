// Ending.js

let Ending_timer = 0;

function Ending_init()
{
    setTileMap(R.BlackMap);
    setFont(R.fontTiny);
    main_update = Ending_update;
    main_render = Ending_render;
}

function Ending_update()
{
    Ending_timer++;
}

function Ending_render()
{
    setPen(bgColor);
    clear();
    setPen(txtColor);
    if (Ending_timer > 30) text("You broke the loop.", 10, 8);
    if (Ending_timer > 30+10*5) text("It is finally 8:00.", 10, 16);
    if (Ending_timer > 30+10*5+10*8) text("You're finally awakening.", 10, 32);
    if (Ending_timer > 30+10*5+10*8+10*9) text("Inside your actual bed.", 10, 40);
    if (Ending_timer > 30+10*5+10*8+10*9+10*8) text("Inside your own bedroom...", 10, 48);
    if (Ending_timer > 30+10*5+10*8+10*9+10*8+10*7) text("It felt more and more", 10, 64);
    if (Ending_timer > 30+10*5+10*8+10*9+10*8+10*7+10*8) text("like a dream,", 10, 72);
    if (Ending_timer > 30+10*5+10*8+10*9+10*8+10*7+10*8+10*5) text("slowly fading away,", 10, 80);
    if (Ending_timer > 30+10*5+10*8+10*9+10*8+10*7+10*8+10*5+10*6) text("as the day passed.", 10, 88);

    if (Ending_timer > 30+10*5+10*8+10*9+10*8+10*7+10*8+10*5+10*6+10*5) text("...", 10, 104);
    if (Ending_timer > 30+10*5+10*8+10*9+10*8+10*7+10*8+10*5+10*6+10*5+60) text("but, was it a dream?", 10, 112);
}