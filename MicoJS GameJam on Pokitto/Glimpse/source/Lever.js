// Lever.js
const Lever_TILED_OFFSET_X = 0;
const Lever_TILED_OFFSET_Y = -3;
const Lever_INTERACTION_DISTANCE = 8;
const Lever_TO_STATUS_Y = 24;
const Lever_RENDER_OFFSET_X = 0;
const Lever_RENDER_OFFSET_Y = -3;

class Lever
{
    // If onLeft is true, the lever is pointing to left.
    constructor(initX, initY, onLeft, expectedKey = null, target = null)
    {
        this.x = initX;
        this.y = initY;
        this._canBeInteractedWith = false;
        this._expectedKey = expectedKey;
        this._renderSprite = onLeft ? R.LeverLeft : R.LeverRight;
        this._target = target;
        this._onLeft = onLeft;

        Scene_add(this);
    }

    update()
    {
        if (this._onLeft)
        {
            if (this._renderSprite == R.LeverRight) this._renderSprite = R.LeverMid;
            else if (this._renderSprite == R.LeverMid) this._renderSprite = R.LeverLeft;
        }
        else
        {
            if (this._renderSprite == R.LeverLeft) this._renderSprite = R.LeverMid;
            else if (this._renderSprite == R.LeverMid) this._renderSprite = R.LeverRight;
        }
        this._canBeInteractedWith = Character_checkInteractable(this, Lever_INTERACTION_DISTANCE);
        if (this._canBeInteractedWith)
        {
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
        // rect(x - Lever_INTERACTION_DISTANCE, y - Lever_INTERACTION_DISTANCE, Lever_INTERACTION_DISTANCE*2, Lever_INTERACTION_DISTANCE*2);
        // setPen(0);

        image(this._renderSprite, x+Lever_RENDER_OFFSET_X, y+Lever_RENDER_OFFSET_Y);
        if (this._canBeInteractedWith)
        {
            image(R.Buttons1, x, y - Lever_TO_STATUS_Y - ticker_4);
            if ((this._expectedKey != null) && (this._expectedKey != Character_currentItem))
                image(this._expectedKey, x, y - Lever_TO_STATUS_Y - ticker_4);
        }
    }

    interact()
    {
        this._onLeft = !this._onLeft;
        if (this._target)
            this._target.setState(this._onLeft);
    }
}