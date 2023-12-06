// Goal.js

const Goal_DEPTH_OFFSET_Y = -50; // This is a trick so the portal is always rendered under the character.
const Goal_INTERACTION_DISTANCE = 5;
const Goal_RENDER_OFFSET_X = 0;
const Goal_RENDER_OFFSET_Y = -Goal_DEPTH_OFFSET_Y;
const Goal_TILED_OFFSET_X = 0;
const Goal_TILED_OFFSET_Y = -6;

class Goal
{
    constructor(initX, initY)
    {
        this.x = initX;
        this.y = initY + Goal_DEPTH_OFFSET_Y;
        this._render = Goal_renderInactive;
        this._frameIndex = 0;

        Scene_add(this);
    }

    update()
    {
        this.y -= Goal_DEPTH_OFFSET_Y;
        if (Character_checkInteractable(this, Goal_INTERACTION_DISTANCE) && (this._render == Goal_renderActive))
            Ending_init();
        this.y += Goal_DEPTH_OFFSET_Y;
    }

    render()
    {
        var x = this.x - Scene_cameraX;
        var y = this.y - Scene_cameraY;

        // For the area.
        // setPen(255, 0, 255);
        // rect(x - Goal_INTERACTION_DISTANCE, y - Goal_INTERACTION_DISTANCE-Goal_DEPTH_OFFSET_Y, Goal_INTERACTION_DISTANCE*2, Goal_INTERACTION_DISTANCE*2);
        // setPen(0);

        this._render(x, y);
    }

    interact()
    {
        this._render = (this._render == Goal_renderActive) ? Goal_renderInactive : Goal_renderActive;
    }

    setState(state)
    {
        this._render = state ? Goal_renderActive : Goal_renderInactive;
    }
}

function Goal_renderInactive(x, y)
{
    image(R.Goal1, x+Goal_RENDER_OFFSET_X, y+Goal_RENDER_OFFSET_Y);
}

function Goal_renderActive(x, y)
{
    if (ticker_1)
    {
        this._frameIndex++;
        if (this._frameIndex == Goal__activeFrames.length)
            this._frameIndex = 0;
    }
    image(Goal__activeFrames[this._frameIndex], x+Goal_RENDER_OFFSET_X, y+Goal_RENDER_OFFSET_Y);
}

const Goal__activeFrames = [R.Goal2,R.Goal3,R.Goal4,R.Goal5,R.Goal6];