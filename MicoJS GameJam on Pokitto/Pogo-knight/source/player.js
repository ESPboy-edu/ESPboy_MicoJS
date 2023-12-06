// player.js
"include source/constants.js"
"include source/controls.js"
"include source/collisions.js"

const PLAYER_BOUNCING = 0;
const PLAYER_JUMPING = 1;
const PLAYER_IN_AIR = 2;
const PLAYER_DEFEATED = 3;

let parts_x = new Array(5);
let parts_y = new Array(5);
let parts_vx = new Array(5);
let parts_vy = new Array(5);
const parts_bounce = [0.25, 0.25, 0.4, 0.6, 0.5]
let parts_a = new Array(5);

let player_pos_x = LEFT_WALL_X + 32;
let player_pos_y = 50;
let player_vel_x = 0;
let player_vel_y = 0;
let player_angle = 0;
let player_bouncing = 0;
let player_ui_hold = 0;
let player_fuel = MAX_FUEL;
let player_health = 3;
let player_flashing = 0;

let player_state = PLAYER_IN_AIR;
let player_bounce_enemy = false;
let player_contact_x = 50;
let player_contact_y = 50;

let player_gameover = 0;
let player_boosting = 0;

function player_reset() {
    player_pos_x = LEFT_WALL_X + 8;
    player_pos_y = 50;
    player_vel_x = 0;
    player_vel_y = 0;
    player_angle = 0;
    player_bouncing = 0;
    player_ui_hold = 0;
    player_fuel = MAX_FUEL;
    player_health = 3;
    player_flashing = 0;

    player_state = PLAYER_IN_AIR;
    player_bounce_enemy = false;
    player_contact_x = 50;
    player_contact_y = 50;

    player_gameover = 0;
    player_boosting = 0;
}

function player_update(time) {
    if (player_state != PLAYER_DEFEATED) {
        player_contact_x = player_pos_x + 19 * cos(-HALF_PI - player_angle);
        player_contact_y = player_pos_y + 19 * sin(-HALF_PI - player_angle);
        {
            let da = (LEFT ? -1 : 0) + (RIGHT ? 1 : 0);
            da = da * ANGULAR_VELOCITY * time / 180 * PI;
            player_angle = clamp(player_angle + da, -PI/3, PI/3);
        }

        if (player_health <= 0) {
            player_state = PLAYER_DEFEATED;
            for(let i = 0; i < 5; ++i) {
                parts_x[i] = player_pos_x;
                parts_y[i] = player_pos_y;
                parts_vy[i] = player_vel_y + JET_VELOCITY * 0.5;
                parts_vx[i] = player_vel_x + (i - 2.5) * JET_VELOCITY * 0.25;
                parts_a[i] = player_angle;
            }
        }
    }

    if (player_bounce_enemy) {
        player_bouncing = BOUNCE_TIME;
        player_state = PLAYER_BOUNCING;
        player_flashing = 0;
        player_bounce_enemy = false;
    }

    let do_bounce = false;
    let bounce_scale = 0;

    if (player_state == PLAYER_IN_AIR) {
        player_flashing--;
        player_pos_x += player_vel_x * time;
        player_pos_y += player_vel_y * time;
        player_vel_y += (player_vel_y > 0 ? GRAVITY_UP : GRAVITY_DOWN) * -time;
        if (player_boosting > 0) player_boosting-=time;
        if (a_pressed == 1 && player_fuel > 0) {
            player_vel_y = JET_VELOCITY;
            player_vel_x += cos(HALF_PI-min(abs(player_angle), PI/6) * sign(player_angle)) * JET_VELOCITY;
            player_fuel--;
            player_boosting = 0.3;
        }
        let collision = check_wall_collides(player_contact_x, player_contact_y, player_vel_x, player_vel_y);
        

        if (collision == COLLIDES_GROUND || collision == COLLIDES_TILE) {
            do_bounce = true;
            bounce_scale = 0.25;
            if (collision == COLLIDES_GROUND) {
                player_pos_y -= player_contact_y;
            }
        } else if (collision > 0) {
            let bounce = collision == COLLIDES_LEFT_WALL && player_angle > 0;
            bounce |= collision == COLLIDES_RIGHT_WALL && player_angle < 0;

            let bounce_dir = collision == COLLIDES_LEFT_WALL ? 1 : -1;
            let dot = player_vel_x * bounce_dir;
            if (dot > 0) return;
            let x = dot * 1.8 * bounce_dir;
            player_vel_x -= x;
            if (player_vel_y < 0 && bounce) player_vel_y = min(-player_vel_y, BOUNCE_VELOCITY);
        }
    } else if (player_state == PLAYER_BOUNCING) {
        player_pos_x = player_contact_x + 19 * cos(HALF_PI - player_angle);
        player_pos_y = player_contact_y + 19 * sin(HALF_PI - player_angle);
        player_bouncing -= time;
        if (player_bouncing <= 0) {
            do_bounce = true;
            player_state = PLAYER_IN_AIR;
            player_fuel = MAX_FUEL;
        } else if (a_pressed == 1) {
            player_ui_hold = HOLD_TIME * (1 - abs(BOUNCE_TIME/2-player_bouncing)*2/BOUNCE_TIME);
            player_state = PLAYER_JUMPING;
        }
    } else if (player_state == PLAYER_JUMPING) {
        player_ui_hold -= time;
        if (player_ui_hold <= 0) {
            do_bounce = true;
            bounce_scale = (1 - abs(player_bouncing - BOUNCE_TIME/2) * 2 / BOUNCE_TIME);
            player_bouncing = 0;
            player_state = PLAYER_IN_AIR;
            player_fuel = MAX_FUEL;
        }
    } else if (player_state == PLAYER_DEFEATED) {
        for(let i = 0; i < 5; ++i) {
            if (parts_vy[i] != 0) {
                parts_x[i] += parts_vx[i] * time;
                if (parts_x[i] > RIGHT_WALL_X || parts_x[i] < LEFT_WALL_X) {
                    parts_vx[i] *= -1;
                }
                parts_y[i] += parts_vy[i] * time;
                parts_vy[i] += GRAVITY_DOWN * time * -1;
                parts_a[i] += (i - 2.5) * 25 * time;
            } else {
                player_gameover += time;
            }
            if (parts_y[i] < 0) {
                parts_vy[i] *= parts_bounce[i] * -1;
                parts_y[i] = 0;
                if (abs(parts_vy[i]) < 10) {
                    parts_vx[i] = 0;
                    parts_vy[i] = 0;
                }
            }
        }
        player_pos_y = parts_y[0];
    }
    if (do_bounce) {
        bounce_scale = 0.5 + bounce_scale * 0.5;
        player_vel_x = cos(HALF_PI - player_angle) * BOUNCE_VELOCITY * bounce_scale;
        player_vel_y = sin(HALF_PI - player_angle) * BOUNCE_VELOCITY * bounce_scale;
        if (player_vel_y <0) player_vel_y *= -1;
    }
}

function player_draw() {
    if (player_state == PLAYER_DEFEATED) {
        for(let i = 0; i < 5; ++i) {
            image([R.knight_parts1, R.knight_parts2, R.knight_parts3, R.knight_parts4, R.knight_parts5][i], parts_x[i], GROUND_Y - CAMERA_Y - parts_y[i], parts_a[i], 1);
        }
        return;
    }
    let frame = 0;
    if (player_bouncing > 0) {
        let frac = 1 - abs(BOUNCE_TIME/2-player_bouncing)*2/BOUNCE_TIME;
        frame = floor(5 * frac);
    }
    // setMirrored(false);
    let choices = [R.knight_pogo1, R.knight_pogo2, R.knight_pogo3, R.knight_pogo4, R.knight_pogo5, R.knight_pogo6];
    image(player_flashing > 0 ? R.knight_pogo7 : choices[frame], player_pos_x, GROUND_Y-CAMERA_Y-player_pos_y, -player_angle, 1);
    if (player_boosting > 0) {
        let loc_x = player_pos_x + 8 * cos(-HALF_PI - player_angle)
        let loc_y = player_pos_y + 8 * sin(-HALF_PI - player_angle);
        image(R.boosters, loc_x, GROUND_Y-CAMERA_Y-loc_y, -player_angle, 1)
    }

    let x = getWidth()/2;
    let y = 8;
    image(R.ui_gauges, x, y);

    x += 9;
    for(let i = 0; i < player_fuel; ++i) {
        image(R.ui_pill_fuel, x, y);
        x += 8;
    }

    x = getWidth()/2 - 30;

    for(let i = 0; i < player_health; ++i) {
        image(R.ui_pill_health, x, y);
        x += 8;
    }
}
