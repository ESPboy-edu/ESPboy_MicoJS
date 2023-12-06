
"push title OGAM";
"push author Torbuntu";
"push description A MicoJS Gamejam Game";
"set version v0.0.1-jam";
"set category game";
"set url https://micojs.github.com";

let screenWidth, screenHeight;
let selectX;
let selectY;
let move;
let size;
let checkBoard;
// The level of which Ogham are on the board. Multiplies by 5 in the generators.
let level;
// The current Ogham trying to be remembered. 
let current;
let currentIndex;

let scroll;

// This prevents being able to select individual tiles. All items must be combos.
let hardMode;

// The array of available Ogham tiles
let ogam = new Array(25);
// The goal icons to draw on the stone
let goals = new Array(5);
// Holds the current available Ogham on the board
let currentAvailable = new Array(5);
// The score holders for each individual Ogham 
let scores = new Array(5);
let score;
// The board which is a 2d array [6][6]
let board = new Array(6);

// When bomb is greater than 100
let bombAvailable;
// when cross is greater than 50
let crossAvailable;

const white = setPen(250, 250, 250);
const black = setPen(0, 0, 0);

let renderStage = renderIntro;
let updateStage = updateIntro;

function bomb() {
    score += 5000;
    checkBoard = true;
    for (let i = 0; i < 6; i++) {
        board[i].fill(-1);
    }
}

function cross() {
    checkBoard = true;
    let choiceX = (selectX - 32) / 24;
    let choiceY = (selectY - 30) / 24;

    // Get the chosen Ogham tile
    let choice = board[choiceX][choiceY];

    // Clear the space
    board[choiceX][choiceY] = -1;

    // Prepare scores
    let total = 200;
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            let ch = board[x][y];
            if (ch == choice) {
                board[x][y] = -1;
                total += 100;
            }
        }
    }

    score += total;
}

function setCurrentAvailable() {
    if (level == 1) {
        currentAvailable[0] = ogam[0];
        currentAvailable[1] = ogam[1];
        currentAvailable[2] = ogam[2];
        currentAvailable[3] = ogam[3];
        currentAvailable[4] = ogam[4];
    } else if (level == 2) {
        currentAvailable[0] = ogam[5];
        currentAvailable[1] = ogam[6];
        currentAvailable[2] = ogam[7];
        currentAvailable[3] = ogam[8];
        currentAvailable[4] = ogam[9];
    } else if (level == 3) {
        currentAvailable[0] = ogam[10];
        currentAvailable[1] = ogam[11];
        currentAvailable[2] = ogam[12];
        currentAvailable[3] = ogam[13];
        currentAvailable[4] = ogam[14];
    } else if (level == 4) {
        currentAvailable[0] = ogam[15];
        currentAvailable[1] = ogam[16];
        currentAvailable[2] = ogam[17];
        currentAvailable[3] = ogam[18];
        currentAvailable[4] = ogam[19];
    } else if (level == 5) {
        currentAvailable[0] = ogam[20];
        currentAvailable[1] = ogam[21];
        currentAvailable[2] = ogam[22];
        currentAvailable[3] = ogam[23];
        currentAvailable[4] = ogam[24];
    } else {
        let nums = [rand(25), rand(25), rand(25), rand(25), rand(25)];
        currentAvailable[0] = ogam[nums[0]];
        currentAvailable[1] = ogam[nums[1]];
        currentAvailable[2] = ogam[nums[2]];
        currentAvailable[3] = ogam[nums[3]];
        currentAvailable[4] = ogam[nums[4]];

        goals[0] = getGoalTileMap(nums[0]);
        goals[1] = getGoalTileMap(nums[1]);
        goals[2] = getGoalTileMap(nums[2]);
        goals[3] = getGoalTileMap(nums[3]);
        goals[4] = getGoalTileMap(nums[4]);
    }
}

function getGoalTileMap(number) {
    if (number == 0) { return R.BeithGoal; }
    if (number == 1) { return R.LuisGoal; }
    if (number == 2) { return R.FearnGoal; }
    if (number == 3) { return R.SailleGoal; }
    if (number == 4) { return R.NuinGoal; }

    if (number == 5) { return R.UaithGoal; }
    if (number == 6) { return R.DuirGoal; }
    if (number == 7) { return R.TinneGoal; }
    if (number == 8) { return R.CollGoal; }
    if (number == 9) { return R.CertGoal; }

    if (number == 10) { return R.MuinGoal; }
    if (number == 11) { return R.GortGoal; }
    if (number == 12) { return R.GetalGoal; }
    if (number == 13) { return R.StraifGoal; }
    if (number == 14) { return R.RuisGoal; }

    if (number == 15) { return R.AilmGoal; }
    if (number == 16) { return R.OnnGoal; }
    if (number == 17) { return R.UrGoal; }
    if (number == 18) { return R.EdadGoal; }
    if (number == 19) { return R.IdadGoal; }

    if (number == 20) { return R.EabhadhGoal; }
    if (number == 21) { return R.OrGoal; }
    if (number == 22) { return R.UilleannGoal; }
    if (number == 23) { return R.IfinGoal; }
    if (number == 24) { return R.EamhanchollGoal; }
}

function refreshBoard() {
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            board[x][y] = currentAvailable[rand(5)];
        }
    }
}

function upgradeCurrentLevel() {
    currentIndex++;
    if (currentIndex > 4) {
        score += 2000 * level;
        currentIndex = 0;
        level++;
        scores.fill(0);
        initGoals();
        setCurrentAvailable()
        refreshBoard();
    }
    current = currentAvailable[currentIndex];
}

function initGoals() {
    if (level == 1) {
        goals[0] = R.BeithGoal;
        goals[1] = R.LuisGoal;
        goals[2] = R.FearnGoal;
        goals[3] = R.SailleGoal;
        goals[4] = R.NuinGoal;
    } else if (level == 2) {
        goals[0] = R.UaithGoal;
        goals[1] = R.DuirGoal;
        goals[2] = R.TinneGoal;
        goals[3] = R.CollGoal;
        goals[4] = R.CertGoal;
    } else if (level == 3) {
        goals[0] = R.MuinGoal;
        goals[1] = R.GortGoal;
        goals[2] = R.GetalGoal;
        goals[3] = R.StraifGoal;
        goals[4] = R.RuisGoal;
    } else if (level == 4) {
        goals[0] = R.AilmGoal;
        goals[1] = R.OnnGoal;
        goals[2] = R.UrGoal;
        goals[3] = R.EdadGoal;
        goals[4] = R.IdadGoal;
    } else if (level == 5) {
        goals[0] = R.EabhadhGoal;
        goals[1] = R.OrGoal;
        goals[2] = R.UilleannGoal;
        goals[3] = R.IfinGoal;
        goals[4] = R.EamhanchollGoal;
    }
    // Goals reset in currentAvailable after main levels completed
}

function initOgham() {
    // Aicme Beithe
    ogam[0] = R.Beith;
    ogam[1] = R.Luis;
    ogam[2] = R.Fearn;
    ogam[3] = R.Saille;
    ogam[4] = R.Nuin;
    // Aicme hUaitha
    ogam[5] = R.Uaith;
    ogam[6] = R.Duir;
    ogam[7] = R.Tinne;
    ogam[8] = R.Coll;
    ogam[9] = R.Cert;
    // Aicme Muine
    ogam[10] = R.Muin;
    ogam[11] = R.Gort;
    ogam[12] = R.Getal;
    ogam[13] = R.Straif;
    ogam[14] = R.Ruis;
    // Aicme Ailme
    ogam[15] = R.Ailm;
    ogam[16] = R.Onn;
    ogam[17] = R.Ur;
    ogam[18] = R.Edad;
    ogam[19] = R.Idad;
    // Forfeda
    ogam[20] = R.Eabhadh;
    ogam[21] = R.Or;
    ogam[22] = R.Uilleann;
    ogam[23] = R.Ifin;
    ogam[24] = R.Eamhancholl;

}

function init() {
    hardMode = false;
    bombAvailable = 0;
    crossAvailable = 0;
    scroll = 0;
    screenWidth = getWidth();
    screenHeight = getHeight();
    selectX = 32;
    selectY = 30;
    move = 6;
    size = 24;
    checkBoard = false;
    score = 0;
    // Initialize current to Beith
    level = 1;
    current = R.Beith;
    currentIndex = 0;
    scores.fill(0);

    initOgham();
    initGoals();
    setCurrentAvailable();

    // init level 1 (0)
    for (let x = 0; x < 6; x++) {
        board[x] = new Array(6);
    }
    refreshBoard();
}

function updateMain() {

    if (move > 0) {
        move--;
    } else {
        if (checkBoard) {
            move = 8;
            checkBoard = false;
            // Check columns for needing new rows.
            for (let i = 0; i < 6; i++) {
                if (board[i][0] < 0) {
                    board[i][0] = currentAvailable[rand(5)];
                    checkBoard = true;
                }
            }
            for (let y = 1; y < 6; y++) {
                for (let i = 0; i < 6; i++) {
                    if (board[i][y] < 0) {
                        board[i][y] = board[i][y - 1];
                        board[i][y - 1] = -1;
                        checkBoard = true;
                    }
                }
            }
        } else if (LEFT && selectX > 32) {
            move = 6;
            selectX -= size;
        } else if (RIGHT && selectX < 130) {
            move = 6;
            selectX += size;
        } else if (UP && selectY > 30) {
            move = 6;
            selectY -= size;
        } else if (DOWN && selectY < 150) {
            move = 6;
            selectY += size;
        } else if (B) {
            // Bomb attack, clears the WHOLE BOARD! 
            // upgradeCurrentLevel();
            if (bombAvailable > 2) {
                bombAvailable = 0;
                bomb();
            }
        } else if (A) {
            checkBoard = true;
            let choiceX = (selectX - 32) / 24;
            let choiceY = (selectY - 30) / 24;

            // Get the chosen Ogham tile
            let choice = board[choiceX][choiceY];
            if (hardMode) {
                let match = false;
                // TODO - make sure to correct for checking edges
                if (choiceX > 0 && board[choiceX - 1][choiceY] == choice) {
                    match = true;
                }
                if (choiceX < 5 && board[choiceX + 1][choiceY] == choice) {
                    match = true;
                }
                if (choiceY > 0 && board[choiceX][choiceY - 1] == choice) {
                    match = true;
                }
                if (choiceY < 5 && board[choiceX][choiceY + 1] == choice) {
                    match = true;
                }

                if (!match) return;
            }

            // Clear the space
            board[choiceX][choiceY] = -1;

            // Prepare scores
            let total = 0;
            let match = false;

            let checkCrossX = 0;
            let checkCrossY = 0;

            // check left
            let xidx = choiceX - 1;
            while (xidx >= 0) {
                if (board[xidx][choiceY] == choice) {
                    board[xidx][choiceY] = -1;
                    total++;
                    checkCrossX++;
                    xidx--;
                    match = true;
                } else {
                    break;
                }
            }
            // check right
            xidx = choiceX + 1;
            while (xidx <= 5) {
                if (board[xidx][choiceY] == choice) {
                    board[xidx][choiceY] = -1;
                    total++;
                    checkCrossX++;
                    xidx++;
                    match = true;
                } else {
                    break;
                }
            }
            // check up
            let yidx = choiceY - 1;
            while (yidx >= 0) {
                if (board[choiceX][yidx] == choice) {
                    board[choiceX][yidx] = -1;
                    total++;
                    checkCrossY++;
                    yidx--;
                    match = true;
                } else {
                    break;
                }
            }
            // check down
            yidx = choiceY + 1;
            while (yidx <= 5) {
                if (board[choiceX][yidx] == choice) {
                    board[choiceX][yidx] = -1;
                    total++;
                    checkCrossY++;
                    yidx++;
                    match = true;
                } else {
                    break;
                }
            }

            // Scoring if the choice is the currently set Ogham to remember
            if (current == choice) {
                if (total >= 1) { scores[currentIndex] += total + 1; }
                if (scores[currentIndex] > 5) {
                    upgradeCurrentLevel();
                }
            }

            if (match) {
                total++;
            }

            if (checkCrossX >= 3) crossAvailable++;
            if (checkCrossY >= 3) crossAvailable++;
            if (total > 6) bombAvailable++;

            score += total * 10;
        } else if (C) {
            // Cross attack. Clears the selected ROW + COLUMN 
            if (crossAvailable > 5) {
                crossAvailable = 0;
                cross();
            }
        }
    }
}


function updateIntro() {
    if (C) hardMode = true;
    if (A || B || C) {
        renderStage = renderMain;
        updateStage = updateMain;
    }

    scroll--;
    if (scroll < -500) scroll = 0;
}

function update(time) {
    updateStage();
}

function renderIntro() {
    setFPS(0);
    setPen(black);
    clear();
    setPen(white);
    text("Start Easy   - A / B", 76, 60);
    text("Start Normal - C", 76, 70);

    setPen(0);
    for (let i = 0; i < 25; i++) {
        image(ogam[i], scroll + i * 30, 24);
    }

    image(R.DraoiB, 110, 90);

    for (let i = 0; i < 25; i++) {
        image(ogam[i], (-scroll - 500) + i * 30, 130);
    }

}

function renderMain() {
    // Clear the screen
    setFPS(0);
    // TODO -- Use a scrolling graphic background?
    setPen(black);
    clear();
    setTileMap(R.background);

    setPen(0);
    // Render Draoi climbing the stone
    image(R.Stone, 190, 80);

    // Render goals as they are completed
    // TODO - Make these dynamic based on level
    // TODO - Move the logic into Update...    
    image(goals[0], 192, 138);
    if (scores[0] > 5) { image(goals[1], 192, 116); }
    if (scores[1] > 5) { image(goals[2], 192, 94); }
    if (scores[2] > 5) { image(goals[3], 193, 72); }
    if (scores[3] > 5) { image(goals[4], 193, 50); }

    image(R.DraoiB, 180, 136 - (currentIndex) * 22);

    // Render the tile memory board
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            image(board[x][y], 24 + (x * 24), 24 + (y * 24));
        }
    }

    // Render the selector Shillelagh icon
    image(R.Shillelagh, selectX, selectY);

    if (bombAvailable > 2) { image(R.ButtonB, 164, 148); }
    if (crossAvailable > 5) { image(R.ButtonC, 164, 138); }

    setPen(white);
    text("score: " + score, 0, 160);
    if(level > 5) {
        text("Endless Mode", 0, 166);
    }
}

function render() {
    renderStage();
}
