// enemy.js
"include source/constants.js"
"include source/shots.js"

// goblin, cockatrice, dragon
const enemy_widths = [10, 20, 10, 10];
const enemy_heights = [20, 8, 15, 15];

const enemy_count = 16;
let enemy_x = new Array(enemy_count);
let enemy_y = new Array(enemy_count);
let enemy_type = new Array(enemy_count);
let enemy_lbs = new Array(enemy_count);
let enemy_rbs = new Array(enemy_count);
let enemy_flashcount = new Array(enemy_count);
let enemy_dirs = new Array(enemy_count);
let enemy_active = new Array(enemy_count);
let enemies_defeated = 0;

let timer = 0;

let min_enemy_y = 0;
let max_enemy_y = 32 * 8;

function reset_enemies(small_map) {
    timer = 0;

    enemies_defeated = 0;

    let idx = 0;
    let y = 1;
    let set_enemy = (t,x,dir, lb, rb) => {
        enemy_x[idx] = x;
        enemy_y[idx] = y;
        enemy_type[idx] = t;
        enemy_lbs[idx] = lb + enemy_widths[t];
        enemy_rbs[idx] = rb - enemy_heights[t];
        enemy_dirs[idx] = dir;
        enemy_active[idx] = true;
        enemy_flashcount[idx] = 0;
        idx++;
    }

    let set_goblin = (lb, rb) => {
        set_enemy(0,(lb + rb)/2, 1, lb, rb);
    }
    let set_cockatrice = (x,dir) => {
        set_enemy(1,x,dir, LEFT_WALL_X, RIGHT_WALL_X);
    }
    let set_dragon = (face_right) => {
        set_enemy(2,face_right ? LEFT_WALL_X + 11 : RIGHT_WALL_X - 11, face_right ? 1 : -1);
    }
    let set_spitter = (face_right) => {
        set_enemy(3,face_right ? LEFT_WALL_X + 11 : RIGHT_WALL_X - 11, face_right ? 1 : -1);
    }

    let set_y = (idx,add) => y = (45-idx)*32 + (add ? add : 0);
    
    set_goblin(LEFT_WALL_X, RIGHT_WALL_X);
    y += 32*5 + 2;
    if (small_map) {
        set_goblin(LEFT_WALL_X, LEFT_WALL_X + 56);
    } else {
        set_goblin(LEFT_WALL_X, LEFT_WALL_X + 88);
    }
    y += 32*3.5;
    set_cockatrice((RIGHT_WALL_X+LEFT_WALL_X)/2, 1);
    y += 32*2.5
    set_goblin(LEFT_WALL_X, RIGHT_WALL_X);
    y += 48;
    set_dragon(true);
    y += 2*32;
    set_cockatrice((RIGHT_WALL_X+64), 1)
    y += 3 * 32;
    set_dragon(false);
    set_y(25,3);
    if (small_map) {
        set_goblin(RIGHT_WALL_X - 56, RIGHT_WALL_X + 8);
    } else {
        set_goblin(RIGHT_WALL_X - 72, RIGHT_WALL_X + 8);
    }
    set_y(22);
    set_dragon(true);
    set_y(19);
    set_spitter(true);
    set_y(17,3);
    set_goblin(LEFT_WALL_X, LEFT_WALL_X+56);
    set_y(13);
    set_cockatrice(LEFT_WALL_X + 64, true);
    set_y(11);
    set_spitter(false);
    set_y(9);
    set_spitter(true);
    set_y(7);
    set_dragon(false);
    set_y(5);
    set_cockatrice(RIGHT_WALL_X-32*4,1);
}

function update_enemies(dt, pogo_x, pogo_y, do_collisions) {
    let prev_time = timer;
    timer += dt;
    let collision = false;
    for(let i = 0; i < enemy_count; ++i) {
        if (enemy_flashcount[i] > 0) enemy_flashcount[i]--;
        if (!enemy_active[i] || enemy_y[i] < min_enemy_y || enemy_y[i] > max_enemy_y) continue;
        let type = enemy_type[i];
        if (type < 2) {
            enemy_x[i] += dt * 15 * enemy_dirs[i];
            if (enemy_dirs[i] > 0 && enemy_x[i] > enemy_rbs[i]) {
                enemy_dirs[i] = -1;
                enemy_x[i] = enemy_rbs[i];
            } else if (enemy_dirs[i] < 0 && enemy_x[i] < enemy_lbs[i]) {
                enemy_dirs[i] = 1;
                enemy_x[i] = enemy_lbs[i];
            }
        } else {
            let rate = type == 2 ? 3.0 : 1.8;
            let ready_to_fire = ((prev_time + enemy_y[i]) % rate < rate-0.5);
            ready_to_fire &= ((timer + enemy_y[i]) % rate > rate-0.5);
            if (ready_to_fire) {
                config_next_shot(enemy_x[i], enemy_y[i] + 5, enemy_dirs[i]);
            }
        }
        if (collision || !do_collisions) continue;
        collision = enemy_flashcount[i] == 0 && abs(pogo_x - enemy_x[i]) < enemy_widths[type] && abs(pogo_y - enemy_y[i]) < enemy_heights[type];
        if (collision) {
            enemy_flashcount[i] = 20;
            if (type < 3) {
                enemy_active[i] = false;
                enemies_defeated++;
            }
        }
    }
    return collision;
}

function draw_enemies() {
    for(let i = 0; i < enemy_count; ++i) {
        if (!enemy_active[i] && enemy_flashcount[i] == 0) continue;
        let f;
        if (enemy_flashcount[i] > 0) {
            f = [R.goblin1, R.cockatrice1, R.clinger1, R.clinger1][enemy_type[i]];
        } else {
            if (enemy_type[i] == 0) {
                f = [R.goblin2,R.goblin3,R.goblin4,R.goblin5][floor((timer + enemy_y[i])* 4 % 4)]
            } else if (enemy_type[i] == 1) {
                f = [R.cockatrice2,R.cockatrice3,R.cockatrice4,R.cockatrice5,R.cockatrice6][floor((timer + enemy_y[i]) * 6 % 5)];
            } else if (enemy_type[i] == 2) {
                f = ((timer + enemy_y[i]) % 3.0 > 2.5) ? R.clinger3 : R.clinger2
            } else {
                f = ((timer + enemy_y[i]) % 1.8 > 1.3) ? R.fire_spitter2 : R.fire_spitter1
            }
        }
        setMirrored(enemy_dirs[i] < 0);
        let scale = 1;
        if (enemy_flashcount[i] > 0 && enemy_type[i] < 3) {
            scale = enemy_flashcount[i]/20;
        }
        image(f, enemy_x[i], GROUND_Y - CAMERA_Y - enemy_y[i] - enemy_heights[0]/2, (1 - scale) * PI/2, scale);
    }
}