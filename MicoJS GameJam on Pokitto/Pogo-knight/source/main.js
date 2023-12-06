"include source/player.js"
"include source/controls.js"
"include source/collisions.js"
"include source/enemy.js"
"include source/shots.js"

// "push header-cpp #define ENABLE_PROFILER 1";

let timestep = 0.016;
let small_map = false;

{"ifeq platform pokitto";
    timestep *= 2;
}

{"ifeq platform meta";
    timestep *= 3.5;
    small_map = true;
}
{"ifeq platform espboy";
    small_map = true;
    timestep *= 1;
}

let STATE = 0;

let base_camera_x = 0;
let base_camera_y = 0;

let max_height = 0;

function init() {
    let size = 96;
    let center = 32*5;
    if (small_map) {
        setTileMap(R.courtyard_small);
        size = 64;
        center = 32 * 4;
    } else {
        setTileMap(R.courtyard);
        size = 96;
        center = 32 * 5;
    }
    setFPS(0);
    LEFT_WALL_X = getWidth()/2 - size - 4;
    RIGHT_WALL_X = getWidth()/2 + size + 4;
    base_camera_x = center - getWidth()/2
    setTransparent(true);
}

function render() {
    if (STATE == 0) {
        setMirrored(false);
        image(R.box, getWidth()/2, getHeight()/2, 0, getWidth()*3/2);
        let frame = player_gameover % 2.5 < 0.4 ? R.title2 : R.title1
        let offset = player_gameover % 2.5;
        offset /= 2.5;
        offset = (1 - offset) * offset * 4;
        image(frame, getWidth()/2, 60 - offset*15, 0, small_map ? 2 : 3);
        image(R.ui_play, getWidth()/2-10, 110, 0, 1.5)
        // image(R.ui_info, getWidth()/2-12, 130, 0, 1.5);
    } else if (STATE == 1) {
        draw_enemies();
        player_draw();
        draw_shots();
        if (player_gameover > 0) {
            let scale = min(player_gameover, 2.0) / 2.0;
            image(R.box, getWidth()/2, getHeight()/2, 0, getWidth()/8*scale);
            if (scale == 1) {
                let print_n = (x,y,n,places) => {
                    x += 5*places;
                    let ct = 10;
                    for(let i = 0; i < places; ++i) {
                        image([R.number0, R.number1, R.number2, R.number3, R.number4, R.number5, R.number6, R.number7, R.number8, R.number9][floor((n % ct)*10/ct)], x, y);
                        ct *= 10;
                        x -= 5;
                    }
                }

                image(R.ui_gameover, getWidth()/2, getHeight()/4, 0, small_map ? 2 : 3);
                image(R.ui_maxheight, getWidth()/2 - 21, getHeight()/2, 0, 1);
                print_n(getWidth()/2+15, getHeight()/2, max_height, 4);
                image(R.ui_bopped, getWidth()/2 - 11, getHeight()/2 + 16, 0, 1);
                print_n(getWidth()/2+25, getHeight()/2 + 16, enemies_defeated, 2)
                image(R.ui_score, getWidth()/2 - 6, getHeight()/2 + 32, 0, 1);
                print_n(getWidth()/2+15, getHeight()/2+32, (floor(max_height)+enemies_defeated*50), 4);
            }
        }
    }
}

let camera_lead = 0;
let shake_timer = 0;
function update() {
    if (A) a_pressed++;
    else a_pressed = 0;

    if (STATE == 0) {
        player_gameover += timestep;
        shake_timer = 0;
        if (a_pressed == 1) {
            player_reset();
            reset_enemies(small_map);
            max_height = 0;
            STATE = 1;
        }
    } else if (STATE == 1) {
        player_update(timestep);
        if (player_state == PLAYER_BOUNCING) return;
        if (shake_timer > 0) shake_timer-=timestep;

        max_height = max(max_height, player_pos_y);

        if (update_shots(timestep, player_pos_x, player_pos_y)) {
            player_flashing = 20;
            player_health--;
            shake_timer = player_health == 0 ? 0.7 : 0.35;            
        }

        if (B) {
            player_flashing = 20;
            player_health = 0;
            shake_timer = 0.7;
        }

        min_enemy_y = player_pos_y - getHeight() * 2 / 3;
        max_enemy_y = player_pos_y + getHeight() * 2 / 3;
        player_bounce_enemy = update_enemies(timestep, player_contact_x, player_contact_y, player_vel_y < 0 && player_state == PLAYER_IN_AIR);
        camera_lead = clamp(camera_lead * 0.98 + player_vel_y/5 * 0.02, -getHeight()/6, getHeight()/6);
        base_camera_y = min(GROUND_Y - 2*32 - getHeight()/2, GROUND_Y - getHeight()/2 - player_pos_y - camera_lead);
        CAMERA_X = base_camera_x + ((shake_timer > 0) ? (rand() - 0.5)*10 : 0);
        CAMERA_Y = base_camera_y + ((shake_timer > 0) ? (rand() - 0.5)*10 : 0);
        if (player_gameover > 2.25 && a_pressed) {
            STATE = 0;
            player_gameover = 0;
            // player_boosting = false;
        }
    }
}
