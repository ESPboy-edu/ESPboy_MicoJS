// Game.js

function Game_init()
{
    Watch_init();
    main_update = Game_update;
    main_render = Game_render;
    Game_startLoop();
}

function Game_startLoop()
{
    setTileMap(R.LeafMap);
    Scene_init();
    Watch_restart();
}

function Game_update()
{
    Watch_update();
    Scene_update();
}

function Game_render()
{
    setPen(bgColor);
    //clear();
    setPen(0);
    
    Scene_render();
    Watch_render();
}