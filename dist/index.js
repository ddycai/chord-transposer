"use strict";
exports.__esModule = true;
var KeySignatures_1 = require("./KeySignatures");
var XRegExp = require("xregexp");
var N_KEYS = 12;
// Chromatic scale starting from C using flats only.
var FLAT_SCALE = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "Cb"];
// Chromatic scale starting from C using sharps only.
var SHARP_SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
// Regex for recognizing chords
var ROOT_PATTERN = '(?<root>[A-G](#|b)?)';
var TRIAD_PATTERN = '(M|maj|major|m|min|minor|dim|sus|dom|aug|\\+|-)';
var ADDED_TONE_PATTERN = '(([/\\.\\+]|add)?\\d+[\\+-]?)';
var SUFFIX_PATTERN = "(?<suffix>\\(?" + TRIAD_PATTERN + "?" + ADDED_TONE_PATTERN + "*\\)?)";
var BASS_PATTERN = '(\\/(?<bass>[A-G](#|b)?))?';
var MINOR_PATTERN = '(m|min|minor)+';
var CHORD_REGEX = XRegExp("^" + ROOT_PATTERN + SUFFIX_PATTERN + BASS_PATTERN + "$");
var MINOR_CHORD_REGEX = XRegExp("^" + ROOT_PATTERN + MINOR_PATTERN + ".*$");
/** Fluent API for transposing text containing chords. */
var Transposer = /** @class */ (function () {
    function Transposer(text) {
        if (typeof text === "string") {
            this.tokens = tokenize(text);
        }
        else if (text instanceof Array) {
            this.tokens = text;
        }
        else {
            throw new Error('Invalid argument (must be text or parsed text).');
        }
    }
    Transposer.transpose = function (text) {
        return new Transposer(text);
    };
    /** Get the key of the text. If not explicitly set, it will be guessed from the first chord. */
    Transposer.prototype.getKey = function () {
        if (this.currentKey) {
            return this.currentKey;
        }
        for (var _i = 0, _a = this.tokens; _i < _a.length; _i++) {
            var line = _a[_i];
            for (var _b = 0, line_1 = line; _b < line_1.length; _b++) {
                var token = line_1[_b];
                if (token instanceof Chord) {
                    return KeySignatures_1.KeySignatures.valueOf(token.root + (MINOR_CHORD_REGEX.test(token.toString()) ? 'm' : ''));
                }
            }
        }
        throw new Error('Given text has no chords');
    };
    Transposer.prototype.fromKey = function (key) {
        this.currentKey = key instanceof KeySignatures_1.KeySignature ? key : KeySignatures_1.KeySignatures.valueOf(key);
        return this;
    };
    Transposer.prototype.up = function (semitones) {
        var key = this.getKey();
        var newKey = transposeKey(key, semitones);
        var tokens = transposeTokens(this.tokens, key, newKey);
        return new Transposer(tokens).fromKey(newKey);
    };
    Transposer.prototype.down = function (semitones) {
        return this.up(-semitones);
    };
    Transposer.prototype.toKey = function (toKey) {
        var key = this.getKey();
        var newKey = KeySignatures_1.KeySignatures.valueOf(toKey);
        var tokens = transposeTokens(this.tokens, key, newKey);
        return new Transposer(tokens).fromKey(newKey);
    };
    /** Returns a string representation of the text. */
    Transposer.prototype.toString = function () {
        return this.tokens
            .map(function (line) { return line
            .map(function (token) { return token.toString(); })
            .join(''); })
            .join('\n');
    };
    return Transposer;
}());
/**
 * Finds the key that is a specified number of semitones above/below the current
 * key.
 */
function transposeKey(currentKey, semitones) {
    var newRank = (currentKey.rank + semitones + N_KEYS) % N_KEYS;
    return KeySignatures_1.KeySignatures.forRank(newRank);
}
/**
 * Represents a musical chord. For example, Am7/C would have:
 *
 * root: A
 * suffix: m7
 * bass: C
 */
var Chord = /** @class */ (function () {
    function Chord(root, suffix, bass) {
        this.root = root;
        this.suffix = suffix;
        this.bass = bass;
    }
    Chord.prototype.toString = function () {
        if (this.bass) {
            return this.root + this.suffix + "/" + this.bass;
        }
        else {
            return this.root + this.suffix;
        }
    };
    Chord.parse = function (token) {
        var result = XRegExp.exec(token, CHORD_REGEX);
        return new Chord(result.root, result.suffix, result.bass);
    };
    return Chord;
}());
/** Tokenize the given text into chords.
 *
 *  The ratio of chords to non-chord tokens in each line must be greater than
 *  the given threshold in order for the line to be transposed. The threshold
 *  is set to 0.5 by default.
 */
function tokenize(text, threshold) {
    if (threshold === undefined) {
        threshold = 0.5;
    }
    var lines = text.split("\n");
    var newText = [];
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var newLine = [];
        var chordCount = 0;
        var tokenCount = 0;
        var tokens = line.split(/(\s+|-)/g);
        var lastTokenWasString = false;
        for (var _a = 0, tokens_1 = tokens; _a < tokens_1.length; _a++) {
            var token = tokens_1[_a];
            var isTokenEmpty = token.trim() === '';
            if (!isTokenEmpty && CHORD_REGEX.test(token)) {
                var chord = Chord.parse(token);
                newLine.push(chord);
                chordCount++;
                lastTokenWasString = false;
            }
            else {
                if (lastTokenWasString) {
                    newLine.push(newLine.pop() + token);
                }
                else {
                    newLine.push(token);
                }
                if (!isTokenEmpty) {
                    tokenCount++;
                }
                lastTokenWasString = true;
            }
        }
        if (chordCount / tokenCount >= threshold) {
            newText.push(newLine);
        }
        else {
            newText.push([line]);
        }
    }
    return newText;
}
/**
 * Transposes the given parsed text (by the parse() function) to another key.
 */
function transposeTokens(tokens, fromKey, toKey) {
    var transpositionMap = createTranspositionMap(fromKey, toKey);
    var result = [];
    var _loop_1 = function (line) {
        var accumulator = [];
        var spaceDebt = 0;
        line.forEach(function (token, i) {
            if (typeof token === "string") {
                if (spaceDebt > 0) {
                    var numSpaces = token.search(/\S|$/);
                    var spacesToTake = Math.min(spaceDebt, numSpaces);
                    accumulator.push(token.substring(spacesToTake));
                    spaceDebt = 0;
                }
                else if (typeof accumulator[accumulator.length - 1] === "string") {
                    accumulator.push(accumulator.pop() + token);
                }
                else {
                    accumulator.push(token);
                }
            }
            else {
                var transposedChord = new Chord(transpositionMap.get(token.root), token.suffix, transpositionMap.get(token.bass));
                var originalChordLen = token.toString().length;
                var transposedChordLen = transposedChord.toString().length;
                // Handle length differences between chord and transposed chord.
                if (originalChordLen > transposedChordLen) {
                    // Pad right with spaces.
                    accumulator.push(transposedChord);
                    if (i < line.length - 1) {
                        accumulator.push(" ".repeat(originalChordLen - transposedChordLen));
                    }
                }
                else if (originalChordLen < transposedChordLen) {
                    // Remove spaces from the right (if possible).
                    spaceDebt += transposedChordLen - originalChordLen;
                    accumulator.push(transposedChord);
                }
                else {
                    accumulator.push(transposedChord);
                }
            }
        });
        result.push(accumulator);
    };
    for (var _i = 0, tokens_2 = tokens; _i < tokens_2.length; _i++) {
        var line = tokens_2[_i];
        _loop_1(line);
    }
    return result;
}
/**
 * Given the current key and the number of semitones to transpose, returns a
 * mapping from each note to a transposed note.
 */
function createTranspositionMap(currentKey, newKey) {
    var map = new Map();
    var semitones = semitonesBetween(currentKey, newKey);
    var scale;
    if (newKey.keyType == KeySignatures_1.KeyType.FLAT) {
        scale = FLAT_SCALE;
    }
    else {
        scale = SHARP_SCALE;
    }
    for (var i = 0; i < N_KEYS; i++) {
        map.set(FLAT_SCALE[i], scale[(i + semitones + N_KEYS) % N_KEYS]);
        map.set(SHARP_SCALE[i], scale[(i + semitones + N_KEYS) % N_KEYS]);
    }
    return map;
}
/** Finds the number of semitones between the given keys. */
function semitonesBetween(a, b) {
    return b.rank - a.rank;
}
exports.transpose = function (text) { return new Transposer(text); };
exports["default"] = Transposer;
