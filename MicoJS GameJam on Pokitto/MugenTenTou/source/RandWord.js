// RandWord.js

let seed = 9;

function rng() {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return seed & 0xFF;
}

function rwg(key, mora) {
    seed = key ^ 3487;
    let word = "$0";
    let finished = false;
    while (!finished) {
        finished = true;
        var out = "";
        for (let i = 0, max = word.length; i < max;) {
            if (word.charCodeAt(i) == 36) {
                const key = word.charCodeAt(++i) - 48;
                let dict = mora[key];
                while (dict && !dict.charCodeAt && dict.length)
                    dict = dict[rng() % dict.length];
                if (dict && dict.charCodeAt) {
                    if (dict.charCodeAt(0) == 42) {
                        let w = dict.charCodeAt(1) - 48;
                        let s = 2;
                        if (w <= 0 || w > 9) {
                            w = 1;
                            s = 1;
                        }
                        let off = s + w * (rng() % ((dict.length - s) / w));
                        for (let j = 0; j < w; ++j) {
                            if (dict.charCodeAt(off + j) != 42)
                                out += dict[off + j];
                        }
                    } else {
                        out += dict;
                    }
                }
                ++i;
                finished = false;
            } else {
                out += word[i++];
            }
        }
        word = out;
    }
    return word;
}


