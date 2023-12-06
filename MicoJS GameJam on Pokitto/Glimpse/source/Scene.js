// Scene.js

"include /source/Character.js";
"include /source/Door.js";
"include /source/Goal.js";
"include /source/Item.js";
"include /source/Lever.js";
"include /source/tools.js";

const Scene__CAPACITY = 24;
const Scene__entities = new Array(Scene__CAPACITY);
let Scene__entitiesCount;
let Scene__enabled;
let Scene_cameraX;
let Scene_cameraY;
let Scene_screenWidth;
let Scene_screenHeight;


function Scene_init()
{
    Scene_screenWidth = getWidth();
    Scene_screenHeight = getHeight();

    Scene__entities.fill(null);
    Scene__entitiesCount = 0;

    // Scene here.

    // Portal Room.
    {
        let goalPortal = new Goal(285+Goal_TILED_OFFSET_X, 218+Goal_TILED_OFFSET_Y);

        new Lever(284+Lever_TILED_OFFSET_X, 187+Lever_TILED_OFFSET_Y, false, R.Batteries, goalPortal);
        new Door(284+Door_TILED_OFFSET_X, 257+Door_TILED_OFFSET_Y, false, R.GoldKey);
    }

    // Dark Room.
    {
        new Item(140+Item_TILED_OFFSET_X, 184+Item_TILED_OFFSET_Y, R.BlueKey);
    }
    // TODO: Supposed to have dark area, switched in by levers
    // let darkArea = new DarkArea(119, 127, 42, 74);
 
    // Lockers Room.
    {
        new Item(216+Item_TILED_OFFSET_X, 49+Item_TILED_OFFSET_Y, R.RedKey);
        // TODO: Supposed to have dark area, switched in by levers
        // new Lever(101+Lever_TILED_OFFSET_X, 128+Lever_TILED_OFFSET_Y, false, R.Screwdriver, darkArea);
        new Item(144+Item_TILED_OFFSET_X, 49+Item_TILED_OFFSET_Y, R.Gear);
        // TODO: Out of Memory! - new Item(168+Item_TILED_OFFSET_X, 49+Item_TILED_OFFSET_Y, R.Screwdriver);
        new Door(216+Door_TILED_OFFSET_X, 50+Door_TILED_OFFSET_Y, false, R.BlueKey);
        new Door(192+Door_TILED_OFFSET_X, 50+Door_TILED_OFFSET_Y, false, R.BlueKey);
        // TODO: Out of Memory! - new Door(168+Door_TILED_OFFSET_X, 50+Door_TILED_OFFSET_Y, false, null);
        new Door(144+Door_TILED_OFFSET_X, 50+Door_TILED_OFFSET_Y, false, R.RedKey);
        // TODO: Out of Memory! - new Door(120+Door_TILED_OFFSET_X, 50+Door_TILED_OFFSET_Y, false, R.BlueKey);
    }

    // Corridor next to Bedroom2
    {
        let goldKeyCloset = new Door(68+Door_TILED_OFFSET_X, 97+Door_TILED_OFFSET_Y, false, R.LeverRight);
        new Item(68+Item_TILED_OFFSET_X, 93+Item_TILED_OFFSET_Y, R.GoldKey);
        new Lever(44+Lever_TILED_OFFSET_X, 98+Lever_TILED_OFFSET_Y, false, R.Gear, goldKeyCloset);
    }

    // Bedroom2
    {
        new Item(12+Item_TILED_OFFSET_X, 159+Item_TILED_OFFSET_Y, R.Key);
        new Door(60+Door_TILED_OFFSET_X, 153+Door_TILED_OFFSET_Y, false, R.Key);
    }

    // Bedroom1
    {
        new Character(22+Character_TILED_OFFSET_X, 237+Character_TILED_OFFSET_Y);
        new Door(60+Door_TILED_OFFSET_X, 225+Door_TILED_OFFSET_Y);
    }

    // Corridor leading to Portal Room
    {
        new Item(180+Item_TILED_OFFSET_X, 280+Item_TILED_OFFSET_Y, R.Batteries);
        // TODO: Out of Memory! - new Door(188+Door_TILED_OFFSET_X, 305+Door_TILED_OFFSET_Y, false, R.WatchUI1);
        // TODO: Out of Memory! - new Door(60+Door_TILED_OFFSET_X, 305+Door_TILED_OFFSET_Y, false, R.WatchUI1);
    }
}

function Scene_update()
{
    CAMERA_X = 0;
    CAMERA_Y = 0;
    if (!Scene__enabled) return ;
    for (let i = 0; i < Scene__entitiesCount; i++)
        if (Scene__entities[i].update())
        {
            for (let j = i; j < Scene__entitiesCount; j++)
                Scene__entities[j] = Scene__entities[j + 1];
            Scene__entitiesCount--;
            i--;
        }
    Scene_cameraX = max(0, min(Character_x - Scene_screenWidth / 2, 320 - Scene_screenWidth));
    Scene_cameraY = max(0, min(Character_y - Scene_screenHeight / 2, 320 - Scene_screenHeight));

    // Sorts by y.
    for (let i = 1; i < Scene__entitiesCount; i++)
        if (Scene__entities[i - 1].y > Scene__entities[i].y)
        {
            let tmp = Scene__entities[i - 1];

            Scene__entities[i - 1] = Scene__entities[i];
            Scene__entities[i] = tmp;
        }
    CAMERA_X = Scene_cameraX;
    CAMERA_Y = Scene_cameraY;
}

function Scene_add(entity) 
{
    if (Scene__entitiesCount < Scene__CAPACITY)
    {
        Scene__entities[Scene__entitiesCount] = entity;
        Scene__entitiesCount++;
    }
    else
        debug("CRIT - UpdateList full!");
}

function Scene_render()
{
    if (!Scene__enabled)
    {
        setTileMap(R.BlackMap);
        return ;
    }

    setTileMap(R.LeafMap);

    for (let i = 0; i < Scene__entitiesCount; i++)
        Scene__entities[i].render();
}