// Door.js

const Door_TILED_OFFSET_X = 0;
const Door_TILED_OFFSET_Y = 0;
const Door_INTERACTION_DISTANCE = 8;
const Door_TO_STATUS_Y = 24;
const Door_RADIUS_Y = 1;
const Door_RENDER_OFFSET_X = -1;
const Door_RENDER_OFFSET_Y = -8;

class Door
{
    constructor(initX, initY, opened = false, expectedKey = null)
    {
        this.x = initX;
        this.y = initY;
        this._canBeInteractedWith = false;
        this._render = opened ? Door_renderOpenDoor : Door_renderClosedDoor;
        this._expectedKey = expectedKey;

        Scene_add(this);
    }

    update()
    {
        this._canBeInteractedWith = Character_checkInteractable(this, Door_INTERACTION_DISTANCE);
        if (this._canBeInteractedWith)
        {
            if (this._render != Door_renderOpenDoor)
            {
                // TODO: Door collision might be more for Door.js.
                const relY = this.y - Character_y;

                if (abs(relY) < Door_RADIUS_Y + Character_RADIUS)
                {
                    if (relY <= 0) Character_y++;
                    else Character_y--;
                }
            }
            if ((this._expectedKey == null) || (this._expectedKey == Character_currentItem))
                Character_onCanInteractWith(this);
        }
    }

    render()
    {
        var x = this.x - Scene_cameraX;
        var y = this.y - Scene_cameraY;
        
        // For the area.
        // setPen(255, 0, 255);
        // rect(x - Door_INTERACTION_DISTANCE, y - Door_INTERACTION_DISTANCE, Door_INTERACTION_DISTANCE*2, Door_INTERACTION_DISTANCE*2);
        // setPen(0, 255, 255);
        // rect(x - Door_INTERACTION_DISTANCE, y - Door_RADIUS_Y, Door_INTERACTION_DISTANCE*2, Door_RADIUS_Y * 2);
        // setPen(0);

        this._render(x, y);
        if (this._canBeInteractedWith)
        {
            image(R.Buttons1, x, y - Door_TO_STATUS_Y - ticker_4);
            if ((this._expectedKey != null) && (this._expectedKey != Character_currentItem))
                image(this._expectedKey, x, y - Door_TO_STATUS_Y - ticker_4);
        }
    }

    interact()
    {
        this._render = (this._render == Door_renderOpenDoor) ? Door_renderClosedDoor : Door_renderOpenDoor;
    }

    setState(opened)
    {
        this._render = opened ? Door_renderOpenDoor : Door_renderClosedDoor;
    }
}

function Door_renderClosedDoor(x, y)
{
    image(R.MetalDoor1, x+Door_RENDER_OFFSET_X, y+Door_RENDER_OFFSET_Y);
}

function Door_renderOpenDoor(x, y)
{
    image(R.MetalDoor2, x+Door_RENDER_OFFSET_X, y+Door_RENDER_OFFSET_Y);
}