// shots.js

let actives = [false, false, false, false];
let locs_x = [0, 0, 0, 0];
let locs_y = [0, 0, 0, 0];
let dirs = [0, 0, 0, 0];
let shot_timer = 0;

const shot_count = 8;

function config_next_shot(x, y, dir) {
    let sy = GROUND_Y - y;
    if (sy < CAMERA_Y || sy > (CAMERA_Y + getHeight())) return;
    for(let i = 0; i < shot_count; ++i) {
        if (!actives[i]) {
            actives[i] = true;
            dirs[i] = dir;
            locs_x[i] = x;
            locs_y[i] = y;
            return;
        }
    }
}

function update_shots(dt, px, py) {
    shot_timer += dt;
    let collision = false;
    for(let i = 0; i < shot_count; ++i) {
        if (actives[i]) {
            locs_x[i] += 60 * dirs[i] * dt;
            if (check_wall_collides(locs_x[i], locs_y[i], dirs[i], -1)) actives[i] = false;
            if (!collision && abs(px - locs_x[i]) < 8 && abs(py - locs_y[i]) < 8) {
                actives[i] = false;
                collision = true;
            }
        }
    }
    return collision;
}

function draw_shots() {
    for(let i = 0; i < shot_count; ++i) {
        if (actives[i]) {
            image(R.fireball1, locs_x[i], GROUND_Y - CAMERA_Y - locs_y[i], shot_timer * 12, 1);
        }
    }
}
