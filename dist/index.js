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
var SUFFIX_PATTERN = '(?<suffix>\\(?(M|maj|major|m|min|minor|dim|sus|dom|aug)?(\\+|-|add)?\\d*\\)?)';
var BASS_PATTERN = '(\\/(?<bass>[A-G](#|b)?))?';
var MINOR_PATTERN = '(m|min|minor)+';
var CHORD_REGEX = XRegExp("^" + ROOT_PATTERN + SUFFIX_PATTERN + BASS_PATTERN + "$");
var MINOR_CHORD_REGEX = XRegExp("^" + ROOT_PATTERN + MINOR_PATTERN + ".*$");
/** Fluent API for transposing text containing chords. */
var Transposer = /** @class */ (function () {
    function Transposer(text) {
        if (typeof text === "string") {
            this.tokens = parse(text);
        }
        else if (text instanceof Array) {
            this.tokens = text;
        }
        else {
            throw new Error('Invalid argument (must be text or parsed text).');
        }
        this.guessKey();
    }
    Transposer.transpose = function (text) {
        return new Transposer(text);
    };
    /** Guesses the key of the text. Currently just takes the first chord. */
    Transposer.prototype.guessKey = function () {
        if (this.currentKey) {
            return;
        }
        for (var _i = 0, _a = this.tokens; _i < _a.length; _i++) {
            var line = _a[_i];
            for (var _b = 0, line_1 = line; _b < line_1.length; _b++) {
                var token = line_1[_b];
                if (token instanceof Chord) {
                    if (MINOR_CHORD_REGEX.test(token.toString())) {
                        this.currentKey = KeySignatures_1.KeySignatures.valueOf(token.root + 'm');
                    }
                    else {
                        this.currentKey = KeySignatures_1.KeySignatures.valueOf(token.root);
                    }
                    return;
                }
            }
        }
        throw new Error('Given text has no chords');
    };
    Transposer.prototype.fromKey = function (key) {
        this.currentKey = KeySignatures_1.KeySignatures.valueOf(key);
        return this;
    };
    Transposer.prototype.up = function (semitones) {
        var newKey = transposeKey(this.currentKey, semitones);
        this.tokens = _transpose(this.tokens, this.currentKey, newKey);
        this.currentKey = newKey;
        return this;
    };
    Transposer.prototype.down = function (semitones) {
        var newKey = transposeKey(this.currentKey, -semitones);
        this.tokens = _transpose(this.tokens, this.currentKey, newKey);
        this.currentKey = newKey;
        return this;
    };
    Transposer.prototype.toKey = function (key) {
        var newKey = KeySignatures_1.KeySignatures.valueOf(key);
        this.tokens = _transpose(this.tokens, this.currentKey, newKey);
        this.currentKey = newKey;
        return this;
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
/** Parses the given text into chords.
 *
 *  The ratio of chords to non-chord tokens in each line must be greater than
 *  the given threshold in order for the line to be transposed. The threshold
 *  is set to 0.5 by default.
 */
function parse(text, threshold) {
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
function _transpose(tokens, fromKey, toKey) {
    var noteMap = transpositionMap(fromKey, toKey);
    for (var _i = 0, tokens_2 = tokens; _i < tokens_2.length; _i++) {
        var line = tokens_2[_i];
        for (var _a = 0, line_2 = line; _a < line_2.length; _a++) {
            var token = line_2[_a];
            if (token instanceof Chord) {
                token.root = noteMap[token.root];
                token.bass = noteMap[token.bass];
            }
        }
    }
    return tokens;
}
/**
 * Given the current key and the number of semitones to transpose, returns a
 * mapping from each note to a transposed note.
 */
function transpositionMap(currentKey, newKey) {
    var map = {};
    var semitones = semitonesBetween(currentKey, newKey);
    var scale;
    if (newKey.keyType == KeySignatures_1.KeyType.FLAT) {
        scale = FLAT_SCALE;
    }
    else {
        scale = SHARP_SCALE;
    }
    for (var i = 0; i < N_KEYS; i++) {
        map[FLAT_SCALE[i]] = scale[(i + semitones + N_KEYS) % N_KEYS];
        map[SHARP_SCALE[i]] = scale[(i + semitones + N_KEYS) % N_KEYS];
    }
    return map;
}
/** Finds the number of semitones between the given keys. */
function semitonesBetween(a, b) {
    return b.rank - a.rank;
}
exports.transpose = function (text) { return new Transposer(text); };
exports["default"] = Transposer;
