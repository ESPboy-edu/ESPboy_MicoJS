// Character.js

const Character_TILED_OFFSET_X = 0;
const Character_TILED_OFFSET_Y = 0;
const Character_RADIUS = 3;

// DATA.

class Character
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        Character__init(x, y);

        Scene_add(this);
    }

    update()
    {
        this.y = Character_y;
        this.x = Character_x;
        Character__update();
    }
    render()
    {
        Character__render();
    }
}

let Character_x;
let Character_y;

let Character__lastA;
let Character__actingA;
let Character__lastB;
let Character__actingB;

let Character__subAnimIndex;
let Character__mirrored;
let Character__leftLegIndex;
let Character__rightLegIndex;
let Character_currentItem;


// // LIFECYCLE.

function Character__init(x, y)
{
    Character_x = x;
    Character_y = y;

    Character__lastA = A;
    Character__actingA = false;
    Character__lastB = B;
    Character__actingB = false;

    Character__subAnimIndex = 0;
    Character__mirrored = false;
    Character__leftLegIndex = 0;
    Character__rightLegIndex = 0;
    Character_currentItem = null;
}

function Character__update()
{
    let subAnimIndex = Character__subAnimIndex;
    let rightLegIndex = Character__rightLegIndex;
    let leftLegIndex = Character__leftLegIndex;

    if (Character__updateMovement())
    {
        subAnimIndex++;
        if (subAnimIndex >= 3)
        {
            subAnimIndex = 0;
            
            let leftToRight = rightLegIndex - leftLegIndex;

            if (leftToRight < 0) leftToRight += CharacterLegs.length;

            if (leftToRight == 4)
            {
                rightLegIndex += 1;
                if (rightLegIndex >= CharacterLegs.length)
                    rightLegIndex = 0;
            }
            else if (leftToRight == 5)
            {
                leftLegIndex += 1;
                if (leftLegIndex >= CharacterLegs.length)
                    leftLegIndex = 0;
                rightLegIndex += 1;
                if (rightLegIndex >= CharacterLegs.length)
                    rightLegIndex = 0;
            }
            else
            {
                leftLegIndex -= 1;
                if (leftLegIndex < 0)
                    leftLegIndex = CharacterLegs.length - 1;
                rightLegIndex += 1;
                if (rightLegIndex >= CharacterLegs.length)
                    rightLegIndex = 0;
            }
        }
    }
    else
    {
        subAnimIndex = 0;
        if (leftLegIndex > 5)
        {
            leftLegIndex++;
            if (leftLegIndex >= CharacterLegs.length) leftLegIndex = 0;
        }
        else if (leftLegIndex > 0) leftLegIndex--;
        if (rightLegIndex > 5)
        {
            rightLegIndex++;
            if (rightLegIndex >= CharacterLegs.length) rightLegIndex = 0;
        }
        else if (rightLegIndex > 0) rightLegIndex--;
    }
    
    Character__subAnimIndex = subAnimIndex;
    Character__rightLegIndex = rightLegIndex;
    Character__leftLegIndex = leftLegIndex;
    
    if (A != Character__lastA)
    {
        Character__lastA = A;
        Character__actingA = A;
    }
    else
        Character__actingA = false;
    if (B != Character__lastB)
    {
        Character__lastB = B;
        Character__actingB = B;
    }
    else
        Character__actingB = false;
    
    if (Character_currentItem && Character__actingB)
    {
        new Item(Character_x, Character_y, Character_currentItem);
        Character_currentItem = null;
        Character__actingB = false;
    }
}

function Character_onCanInteractWith(entity)
{
    if (Character__actingA)
    {
        entity.interact();
        Character__actingA = false;
    }
}

function Character_checkInteractable(entity, radius)
{
    let toCharacterX = abs(entity.x - Character_x);
    let toCharacterY = abs(entity.y - Character_y);
    
    return max(toCharacterX, toCharacterY) < radius;
}


// MOVEMENT.

function Character__attemptLeft(slide)
{
    Character_x--;

    const up = getTileProperty(Character_x - Character_RADIUS, Character_y - Character_RADIUS, "canPass");
    const down = getTileProperty(Character_x - Character_RADIUS, Character_y + Character_RADIUS, "canPass");

    if (!(up && down))
    {
        Character_x++;
        if (slide)
        {
            if (up)
                Character__attemptUp();
            else if (down)
                Character__attemptDown();
        }
        return false;
    }
    return true;
}

function Character__attemptRight(slide)
{
    Character_x++;

    const up = getTileProperty(Character_x + Character_RADIUS, Character_y - Character_RADIUS, "canPass");
    const down = getTileProperty(Character_x + Character_RADIUS, Character_y + Character_RADIUS, "canPass");

    if (!(up && down))
    {
        Character_x--;
        if (slide)
        {
            if (up)
                Character__attemptUp();
            else if (down)
                Character__attemptDown();
        }
        return false;
    }
    return true;
}

function Character__attemptUp(slide)
{
    Character_y--;

    const left = getTileProperty(Character_x - Character_RADIUS, Character_y - Character_RADIUS, "canPass");
    const right = getTileProperty(Character_x + Character_RADIUS, Character_y - Character_RADIUS, "canPass");

    if (!(left && right))
    {
        Character_y++;
        if (slide)
        {
            if (left)
                Character__attemptLeft();
            else if (right)
                Character__attemptRight();
        }
        return false;
    }
    return true;
}

function Character__attemptDown(slide)
{
    Character_y++;

    const left = getTileProperty(Character_x - Character_RADIUS, Character_y + Character_RADIUS, "canPass");
    const right = getTileProperty(Character_x + Character_RADIUS, Character_y + Character_RADIUS, "canPass");

    if (!(left && right))
    {
        Character_y--;
        if (slide)
        {
            if (left)
                Character__attemptLeft();
            else if (right)
                Character__attemptRight();
        }
        return false;
    }
    return true;
}

function Character__updateMovement()
{
    let walking = false;

    {
        if (LEFT)
        {
            Character__attemptLeft(!DOWN && !UP);
            Character__mirrored = true;
        }
        if (RIGHT)
        {
            Character__attemptRight(!DOWN && !UP);
            Character__mirrored = false;
        }
        if (UP)
            Character__attemptUp(!LEFT && !RIGHT);
        if (DOWN)
            Character__attemptDown(!LEFT && !RIGHT);
        walking = LEFT || RIGHT || UP || DOWN;
    }
    return walking;
}


// RENDERING.

function Character__render()
{
    var x = Character_x - Scene_cameraX;
    var y = Character_y - Scene_cameraY;

    // For the area.
    // setPen(128, 128, 128);
    // rect(Character_x - 3, Character_y - 3, 7, 7);
    // setPen(0);
    setMirrored(Character__mirrored);
    image(CharacterLegs[Character__leftLegIndex], x + Character__mirroredXOffset(+1), y - 2);
    image(CharacterLegs[Character__rightLegIndex], x + Character__mirroredXOffset(-1), y - 2);
    image(CharacterArms[Character__rightLegIndex], x + Character__mirroredXOffset(1), y - 9 + TorsoYOffset[Character__rightLegIndex]);
    image(R.CharacterTorso, x + Character__mirroredXOffset(1), y - 8 + TorsoYOffset[Character__leftLegIndex]);
    image(R.CharacterHeads, x, y - 15 + HeadYOffset[Character__leftLegIndex]);
    image(CharacterArms[Character__leftLegIndex], x + Character__mirroredXOffset(-1), y - 9 + TorsoYOffset[Character__leftLegIndex]);
    if (Character_currentItem)
        image(Character_currentItem, x + Character__mirroredXOffset(Character_ItemOffsetX[Character__rightLegIndex]), y + Character_ItemOffsetY[Character__rightLegIndex]);
    setMirrored(false);
}

function Character__mirroredXOffset(offset)
{
    if (Character__mirrored) return -offset;
    return offset;
}

const CharacterLegs =
[
    R.CharacterLeg1, R.CharacterLeg2, R.CharacterLeg3, R.CharacterLeg4, R.CharacterLeg5,
    R.CharacterLeg6, R.CharacterLeg7, R.CharacterLeg8, R.CharacterLeg9, R.CharacterLeg10
];
const CharacterArms =
[
    R.CharacterArms6, R.CharacterArms7, R.CharacterArms8, R.CharacterArms9, R.CharacterArms10,
    R.CharacterArms1, R.CharacterArms2, R.CharacterArms3, R.CharacterArms4, R.CharacterArms5
];
const TorsoYOffset = [0, 0, 0, 1, 1, 0, 0, 0, 1, 1];
const HeadYOffset = [0, 0, 1, 1, 0, 0, 0, 1, 1, 0];
const Character_ItemOffsetX = [0+1, 1+1, 2+1, 2+1, 1+1, 0+1, -1+1, -2+1, -2+1, -1+1];
const Character_ItemOffsetY = [0-8, 0-8, 1-8, 2-8, 2-8, 2-8, 2-8, 1-8, 0-8, 0-8];
