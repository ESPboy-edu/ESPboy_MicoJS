
"push title Game Title";
"push author Your Name";
"push description A MicoJS game";
"set version v0.0.1";
"set category game";
"set url https://micojs.github.com";

class Orb {
    init(x, y, angle) {
        this.x = x;
        this.y = y;
        this.vx = cos(angle);
        this.vy = -sin(angle);
        this.deleted = false;
    }

    update() {
        this.x += this.vx;
        if(this.x - orb_r < 0) {
            this.x = orb_r;
            this.vx = -this.vx;
        }
        if(this.x + orb_r >= getWidth()) {
            this.x = getWidth() - 1 - orb_r;
            this.vx = -this.vx;
        }

        this.y += this.vy;
        if(this.y - orb_r < 0) {
            this.y = orb_r;
            this.vy = -this.vy;
        }
        if(this.y + orb_r >= getHeight()) {
            this.y = getHeight() - 1 - orb_r;
            this.vy = -this.vy;
        }
    }

    render(sprite) {
        setPen(0);
        image(sprite, this.x, this.y);
    }
}

class Rocketman {
    init(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.rot = 90;
        this.score = 0;
        this.lives = 3;
        this.orb_count = 0;
        this.powerup = 0;
        this.powerup_counter = 0;
    }

    update() {
        if(this.powerup > 0) {
            --this.powerup_counter;
            if(this.powerup_counter <= 0) this.powerup = 0;
        }

        const gravity = 0.1;

        let dx = (RIGHT ? 1 : 0) - (LEFT ? 1 : 0);
        let dy = (UP|A) ? 1: 0;
        
        let delta = (dx ? atan2(dy, dx)*(180/PI) : 90.0) - this.rot;
        if(delta > 180) delta -= 360;
        else if(delta < -180) delta += 360;
        
        this.rot += delta*0.15;
        if(this.rot > 180) this.rot -= 360;
        else if(this.rot < -180) this.rot += 360;

        if(dx|dy) {
            const cos_r = cos(this.rot*PI/180.0);
            const sin_r = sin(this.rot*PI/180.0);
            this.vx += 0.2*cos_r;
            this.vy += -0.2*sin_r;

            const px = -6*cos_r - (this.rot - 90 > 0 ? -4 : 4)*sin_r;
            const py = 6*sin_r - (this.rot - 90 > 0 ? -4 : 4)*cos_r;
            const jetrand = rand(-1.0, 1.0);
            add_particle(this.x + px, this.y + py, -3*cos_r - jetrand*sin_r, 3*sin_r - jetrand*cos_r, 0.2*30);
        }
        this.vy += gravity;

        this.x += this.vx;
        this.y += this.vy;

        if(this.y < 0 + player_r) {
            this.vy = 0;
            this.y = 0 + player_r;
            this.vx *= 0.85;
        }
        else if(this.y > getHeight() - player_r) {
            this.vy = 0;
            this.y = getHeight() - player_r;
            this.vx *= 0.85;
        }

        if(this.x < 0) {
            this.vx = 0;
            this.x = 0;
        }
        else if(this.x >= getWidth()) {
            this.vx = 0;
            this.x = getWidth();
        }
    }

    render() {
        setPen(0);
        setMirrored(this.rot - 90 > 0);
        image(R.rocketman, this.x, this.y, (this.rot+0.5)*PI/180.0 - HALF_PI, 1.0);
        setMirrored(false);

        if(this.powerup > 0) {
            if(this.powerup_counter > 2*30 || (this.powerup_counter&4)) {
                setPen(0);
                if(this.powerup == 1) {
                    image(R.shield, this.x, this.y);
                }
                else if(this.powerup == 2) {
                    image(R.stealth, this.x, this.y);
                }
            }
        }
    }
}

class CollisionInfo {
    constructor(depth, nx, ny) {
        this.depth = depth;
        this.nx = nx;
        this.ny = ny;
    }
}

class Powerup {
    init(x, y, type, time) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.time = time;
        this.deleted = false;
    }
}

class Particle {
    init(x, y, vx, vy, duration) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.duration = duration;
    }
}

const player_r = getWidth(R.rocketman)/2;
const shield_r = 12;
const orb_r = getWidth(R.blu_orb)/2;
const powerup_r = getWidth(R.powerup_shield)/2;

const elasticity = 0.90;
const player_mass = 75;
const orb_mass = 45;

let update_state = update_menu;
let render_state = render_menu;

const pal = [1,8,32,34, 120,47,231,254, 141,143,177,100, 209,112,241,247];

let player = new Rocketman();
const red_orbs = new Array(32);
const blu_orbs = new Array(10);
const collision_info = new CollisionInfo(0, 0, 0);

const powerups = new Array(16);
const particles = new Array(16);
let particles_whead = 0;

let btn_a_state = false;
let btn_b_state = false;

let high_score = 0;

let level_num = 0;
let level_state = 0; // 1:start, 2:play, 3:timeup, 4:complete, 5:gameover
let level_orb_count = 0;
let level_timer = 0;
let level_orbpoints = 0;
let level_frames = 0;

let countdown_timer = 0;

function init() {
    for(let idx = 0; idx < red_orbs.length; ++idx) {
        red_orbs[idx] = new Orb();
    }
    for(let idx = 0; idx < blu_orbs.length; ++idx) {
        blu_orbs[idx] = new Orb();
    }
    for(let idx = 0; idx < powerups.length; ++idx) {
        powerups[idx] = new Powerup();
    }
    for(let idx = 0; idx < particles.length; ++idx) {
        particles[idx] = new Particle();
    }

    init_menu();
}

function update(time) {
    update_state(time);

    btn_a_state = A;
    btn_b_state = B;
}

function render() {
    setPen(pal[0]);
    clear();

    render_state();
}

function text_outline(s, x, y) {
    text(s, x - 1, y - 1);
    text(s, x, y - 1);
    text(s, x + 1, y - 1);
    text(s, x - 1, y);
    text(s, x + 1, y);
    text(s, x - 1, y + 1);
    text(s, x, y + 1);
    text(s, x + 1, y + 1);
}

function display_score(s) {
    const midx = getWidth()/2;
    let y0 = getHeight()/2 - 11;

    setPen(pal[1]);
    rect(0, y0 - 4, getWidth(), 15);

    setPen(pal[2]);
    text_outline(s, midx - s.length*4/2, y0);
    setPen(pal[9]);
    text(s, midx - s.length*4/2, y0);

    y0 += 24;
    s = "ORB POINTS: " + level_orbpoints;
    setPen(pal[2]);
    text_outline(s, midx - 14*4/2, y0);
    setPen(pal[9]);
    text(s, midx - 14*4/2, y0);

    y0 += 24;
    s = "TIME BONUS: " + floor(level_timer*10/30);
    setPen(pal[2]);
    text_outline(s, midx - 14*4/2, y0);
    setPen(pal[9]);
    text(s, midx - 14*4/2, y0);
}

function detect_collision(this_r, ox, oy, or, /*CollisionInfo*/info) {
    let dx = player.x - ox;
    let dy = player.y - oy;
    let dist_sq = dx*dx + dy*dy;
    if(dist_sq <= (this_r + or)*(this_r + or)) {
        let dist = sqrt(dist_sq);
        info.depth = this_r + or - dist;
        info.nx = dx/dist;
        info.ny = dy/dist;
        return true;
    }
    return false;
}

function resolve_collision(ball, info) {
    let depth_x = info.depth*info.nx;
    let depth_y = info.depth*info.ny;

    // push ball apart
    ball.x -= depth_x;
    ball.y -= depth_y;

    // impact speed
    let rel_vx = player.vx - ball.vx;
    let rel_vy = player.vy - ball.vy;
    let rel_vn = rel_vx*info.nx + rel_vy*info.ny;
    rel_vn *= 2*elasticity/(player_mass + orb_mass);

    if(player.powerup != 1) {
        // No shield powerup
        player.vx += -rel_vn*orb_mass*info.nx;
        player.vy += -rel_vn*orb_mass*info.ny;
    }

    ball.vx += rel_vn*player_mass*info.nx;
    ball.vy += rel_vn*player_mass*info.ny;
}

function lose_orbs(direction) {
    for(let idx = 0; idx < blu_orbs.length; ++idx) {
        if(player.orb_count <= 0) break;

        if(blu_orbs[idx].deleted) {
            let rad = direction - HALF_PI + PI*rand();
            blu_orbs[idx].init(
                player.x + 16*cos(rad), 
                player.y - 16*sin(rad), 
                rad);
            blu_orbs[idx].deleted = false;
            --player.orb_count;
        }
    }
}

function powerups_update() {
    for(const powerup of powerups) {
        if(powerup.type > 0) {
            if(level_frames >= powerup.time) {
                if(level_frames >= powerup.time + 10*30) {
                    powerup.type = 0; // powerup expired
                }
                
                if(detect_collision(player_r, powerup.x, powerup.y, powerup_r, collision_info)) {
                    if(powerup.type == 1/*shield*/) {
                        player.powerup = powerup.type;
                        player.powerup_counter = 6*30;
                    }
                    else if(powerup.type == 2/*stealth*/) {
                        player.powerup = powerup.type;
                        player.powerup_counter = 6*30;
                    }
                    else if(powerup.type == 3/*extra time*/) {
                        level_timer += 10*30;
                    }
                    powerup.type = 0; // powerup picked
                }
            }
        }
    }
}

function powerups_render() {
    for(const powerup of powerups) {
        if(powerup.type > 0 && level_frames >= powerup.time) {
            if(level_frames - powerup.time > 7*30 && (level_frames&2)) {
                setPen(pal[7] - pal[11]);
            }
            else {
                setPen(0);
            }
            const img = [R.powerup_shield, R.powerup_stealth, R.powerup_time];
            image(img[powerup.type - 1], powerup.x, powerup.y);
        }
    }
}

function add_particle(x, y, vx, vy, duration) {
    particles[particles_whead].init(x, y, vx, vy, duration);
    particles_whead = (particles_whead + 1)&(particles.length - 1);
}

function clear_particles() {
    for(const p of particles) {
        p.duration = 0;
    }
}

function particles_update() {
    for(const p of particles) {
        if(p.duration > 0) {
            p.x += p.vx;
            p.y += p.vy;
            --p.duration;
        }
    }
}

function particles_render() {
    for(const p of particles) {
        if(p.duration > 0) {
            setPen(0);
            image(R.particle, p.x, p.y);
        }
    }
}

function init_menu() {

}

function update_menu(time) {
    if((!A&btn_a_state) || (!B&btn_b_state)) {
        player.init(getWidth()/2, getHeight() - player_r);
        level_num = 1;

        update_state = update_level;
        render_state = render_level;
        init_level();
    }
    rand(); // randomize rand
}

function render_menu() {
    setPen(0);
    image(R.title, getWidth()/2, getHeight()/2 - getHeight(R.title), 0, getWidth()/220.0);

    setFont(R.fontKarateka);

    setPen(pal[5]);
    text_outline("ORB CATCHER", (getWidth() - 11*7)/2, getHeight()/2);
    setPen(pal[6]);
    text("ORB CATCHER", (getWidth() - 11*7)/2, getHeight()/2);

    setFont(R.fontTiny);

    // Show high score
    let s = "HIGH SCORE ";
    s += (high_score < 10 ? "00000" : (high_score < 100 ? "0000" : (high_score < 1000 ? "000" : (high_score < 10000 ? "00" : (high_score < 100000 ? "0" : ""))))) + high_score;
    setPen(pal[2]);
    text_outline(s, (getWidth() - 16*5)/2, getHeight() - 32);
    setPen(pal[9]);
    text(s, (getWidth() - 16*5)/2, getHeight() - 32);

    setPen(pal[2]);
    text_outline("PRESS A / B TO START", (getWidth() - 18*5)/2, getHeight() - 8);
    setPen(pal[9]);
    text("PRESS A / B TO START", (getWidth() - 18*5)/2, getHeight() - 8);
}

function init_level() {
    level_orbpoints = 0;
    player.vx = 0;
    player.vy = 0;
    player.orb_count = 0;
    player.powerup = 0;
    player.powerup_counter = 0;

    clear_particles();

    // Initialize red_orbs
    let red_orb_count = floor(1.5 + 1.5*level_num);
    for(let idx = 0; idx < red_orbs.length; ++idx) {
        if(idx < red_orb_count) {
            red_orbs[idx].init(rand(orb_r, getWidth() - orb_r), rand(orb_r, getHeight() - orb_r), 2*PI*rand());
            red_orbs[idx].deleted = false;
        }
        else {
            red_orbs[idx].deleted = true;
        }
    }

    // Initialize blu_orbs
    level_orb_count = min(red_orb_count, 10);
    for(let idx = 0; idx < blu_orbs.length; ++idx) {
        if(idx < level_orb_count) {
            blu_orbs[idx].init(rand(orb_r, getWidth() - orb_r), rand(orb_r, getHeight() - orb_r), 2*PI*rand());
            blu_orbs[idx].deleted = false;
        }
        else {
            blu_orbs[idx].deleted = true;
        }
    }

    const num_powerups = floor(0.5*level_num);
    const powerup_size = getWidth(R.powerup_shield);
    for(let idx = 0; idx < powerups.length; ++idx) {
        if(idx < num_powerups) {
            const x = 1.5*powerup_size + rand(getWidth() - 3*powerup_size);
            const y = 1.5*powerup_size + rand(getHeight() - 3*powerup_size);
            const type = 1 + rand(3);
            const span = ceil(10 + 1.5*level_orb_count) - 5;
            const time = 5*30 + idx*span*30/num_powerups + rand(span*30/num_powerups);
            powerups[idx].init(x, y, type, time);
        }
        else {
            powerups[idx].type = 0;
        }
    }

    // 3 sec countdown before start
    countdown_timer = 3*30;
    level_state = 1;
    level_timer = ceil(10 + 2*level_orb_count)*30 - 1;
    level_frames = 0;
}

function update_level(time) {
    if(level_state == 2/*play*/) {
        player.update();

        powerups_update();
        particles_update();

        // Update red_orbs
        for(let idx = 0; idx < red_orbs.length; ++idx) {
            const orb = red_orbs[idx];
            if(!orb.deleted) {
                orb.update();

                const r = player.powerup == 1 ? shield_r : player_r;
                if(player.powerup != 2) {
                    if(detect_collision(r, orb.x, orb.y, orb_r, collision_info)) {
                        resolve_collision(orb, collision_info);
                        if(player.powerup != 1) {
                            lose_orbs(atan2(collision_info.ny, -collision_info.nx));
                        }
                    }
                }
            }
        }
        
        // Update blu_orbs
        for(let idx = 0; idx < blu_orbs.length; ++idx) {
            const orb = blu_orbs[idx];
            if(!orb.deleted) {
                orb.update();

                if(detect_collision(player_r, orb.x, orb.y, orb_r, collision_info)) {
                    ++player.orb_count;
                    orb.deleted = true;
                }
            }
        }

        if(player.orb_count >= level_orb_count) {
            level_orbpoints = 10*player.orb_count;
            // move to next level
            countdown_timer = 2*30;
            level_state = 4/*complete*/;
        }

        --level_timer;
        if(level_timer <= 0) {
            level_orbpoints = 10*player.orb_count;
            if(player.lives > 0) {
                --player.lives;
                // restart current level
                countdown_timer = 2*30;
                level_state = 3/*timeup*/;
            }
            else {
                // game over
                countdown_timer = 2*30;
                level_state = 5/*gameover*/;
            }
        }

        ++level_frames;
    }
    else if(level_state == 1/*start*/) {
        player.update();
        particles_update();

        --countdown_timer;
        if(countdown_timer <= 0) {
            level_state = 2/*play*/;
        }
    }
    else if(level_state == 3/*timeup*/ || level_state == 4/*complete*/ || level_state == 5/*gameover*/) {
        if(countdown_timer <= 0) {
            if(level_orbpoints - 1 >= 0) {
                ++player.score;
                --level_orbpoints;
            }
            
            if(level_timer - 3 >= 0) {
                ++player.score;
                level_timer -= 3;
            }
            else {
                player.score += floor(level_timer/3);
                level_timer = 0;
            }

            if(level_orbpoints <= 0 && level_timer <= 0) {
                if(level_state == 5/*gameover*/) {
                    high_score = max(high_score, player.score);
                    level_num = 0;
                    if((!A&btn_a_state) || (!B&btn_b_state)) {
                        update_state = update_menu;
                        render_state = render_menu;
                        init_menu();
                    }
                }
                else {
                    if(level_state == 4/*complete*/) {
                        ++level_num;
                    }
                    init_level();
                }
            }
        }
        else {
            --countdown_timer;
        }
    }
}

function render_level() {
    // Render red_orbs
    for(let idx = 0; idx < red_orbs.length; ++idx) {
        if(!red_orbs[idx].deleted) red_orbs[idx].render(R.red_orb);
    }

    // Render blu_orbs
    for(let idx = 0; idx < blu_orbs.length; ++idx) {
        if(!blu_orbs[idx].deleted) blu_orbs[idx].render(R.blu_orb);
    }

    const midx = getWidth()/2;
    const midy = getHeight()/2;
    
    setFont(R.fontTiny);

    // Show player score
    let s = (player.score < 10 ? "00000" : (player.score < 100 ? "0000" : (player.score < 1000 ? "000" : (player.score < 10000 ? "00" : (player.score < 100000 ? "0" : ""))))) + player.score;
    setPen(pal[2]);
    text_outline(s, 1, 1);
    setPen(pal[9]);
    text(s, 1, 1);

    // Display time
    setPen((level_state == 2/*play*/ && level_timer < 6*30 && level_timer&4) ? pal[8] : pal[2]);
    text_outline("TIME: " + floor(level_timer/30), midx - 8*4/2, 1);
    setPen(pal[9]);
    text("TIME: " + floor(level_timer/30), midx - 8*4/2, 1);
    
    // Display lives
    const lives_count = (level_state == 3/*timeup*/ && (countdown_timer&4)) ? (player.lives + 1) : player.lives;
    for(let idx = 0; idx < lives_count; ++idx) {
        setPen(0);
        image(R.life, getWidth() - getWidth(R.life)/2 - 1 - idx*(1 + getWidth(R.life)), 1 + getHeight(R.life)/2);
    }

    player.render();

    powerups_render();
    particles_render();

    if(level_state == 1/*start*/) {
        let s = "LEVEL " + level_num;

        setPen(pal[1]);
        rect(0, midy - 15, getWidth(), 15);
        setPen(pal[2]);
        text_outline(s, midx - 8*4/2, midy - 11);
        setPen(pal[9]);
        text(s, midx - 8*4/2, midy - 11);
    }
    if(level_state == 3/*timeup*/) {
        display_score("TIME'S UP");
    }
    else if(level_state == 4/*comlete*/) {
        display_score("LEVEL " + level_num + " COMPLETE");
    }
    else if(level_state == 5/*gameover*/) {
        if(countdown_timer > 0 || level_orbpoints > 0 || level_timer > 0) {
            display_score("GAME OVER");
        }
        else {
            const midx = getWidth()/2;
            const y0 = getHeight()/2 - 11;
            
            setPen(pal[1]);
            rect(0, y0 - 4, getWidth(), 15);

            let s = "GAME OVER";
            
            setPen(pal[2]);
            text_outline(s, midx - s.length*4/2, y0);
            setPen(pal[9]);
            text(s, midx - s.length*4/2, y0);

            if(player.score == high_score) {
                // Show new high score
                let s = "NEW HIGH SCORE ";
                s += (high_score < 10 ? "00000" : (high_score < 100 ? "0000" : (high_score < 1000 ? "000" : (high_score < 10000 ? "00" : (high_score < 100000 ? "0" : ""))))) + high_score;
                setPen(pal[2]);
                text_outline(s, (getWidth() - 20*5)/2, getHeight() - 32);
                setPen(pal[9]);
                text(s, (getWidth() - 20*5)/2, getHeight() - 32);
            }

            setPen(pal[2]);
            text_outline("PRESS A / B TO RETURN TO MENU", (getWidth() - 29*5)/2, getHeight() - 8);
            setPen(pal[9]);
            text("PRESS A / B TO RETURN TO MENU", (getWidth() - 29*5)/2, getHeight() - 8);
        }
    }
}
