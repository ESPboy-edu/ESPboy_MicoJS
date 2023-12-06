// collisions.js
"include source/constants.js"

const bounce_bottom = hash("bounce_bottom");

function check_wall_collides(x, y, vx, vy) {
    if (vy < 0) {
        if (y < 0) return COLLIDES_GROUND;
        if ((y % 32) < 5 && getTileProperty(x, GROUND_Y-CAMERA_Y-y-19, "collision") == bounce_bottom) {
            return COLLIDES_TILE;
        }
    }
    if (x < LEFT_WALL_X && vx < 0) return COLLIDES_LEFT_WALL;
    if (x > RIGHT_WALL_X && vx > 0) return COLLIDES_RIGHT_WALL;
    return NO_COLLISION;
}
