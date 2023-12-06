"push title Glimpse";
"push author carbonacat";
"push description Explore, investigate and try to shutdown the device which produce the timeloop you're stuck into!";
"set version v1.0.0";
"set category game";
"set url https://micojs.github.com";

"include /source/Game.js";
"include /source/tools.js";
"include /source/Scene.js";
"include /source/Watch.js";
"include /source/Ending.js";

let ticker = 0
let ticker_1 = 0;
let ticker_4 = 0;
let watch = null;

let main_update;
let main_render;

function init() {
    setFPS(30);
    Game_init();
}

function update() {
    ticker++;
    ticker_1 = 1 - ticker_1;
    if ((ticker & 0x03) == 0x00)
        ticker_4 = 1 - ticker_4;
    main_update();
}

function render() {
    main_render();
}
