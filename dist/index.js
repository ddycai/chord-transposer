"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpose = exports.Transposer = void 0;
const KeySignatures_1 = require("./KeySignatures");
const Chord_1 = require("./Chord");
const N_KEYS = 12;
/** Fluent API for transposing text containing chords. */
class Transposer {
    constructor(text) {
        if (typeof text === "string") {
            this.tokens = tokenize(text);
        }
        else if (text instanceof Array) {
            this.tokens = text;
        }
        else {
            throw new Error("Invalid argument (must be text or parsed text).");
        }
    }
    static transpose(text) {
        return new Transposer(text);
    }
    /** Get the key of the text. If not explicitly set, it will be guessed from the first chord. */
    getKey() {
        if (this.currentKey) {
            return this.currentKey;
        }
        for (const line of this.tokens) {
            for (const token of line) {
                if (token instanceof Chord_1.Chord) {
                    return KeySignatures_1.guessKeySignature(token);
                }
            }
        }
        throw new Error("Given text has no chords");
    }
    fromKey(key) {
        this.currentKey =
            key instanceof KeySignatures_1.KeySignature ? key : KeySignatures_1.KeySignatures.valueOf(key);
        return this;
    }
    up(semitones) {
        const key = this.getKey();
        const newKey = transposeKey(key, semitones);
        const tokens = transposeTokens(this.tokens, key, newKey);
        return new Transposer(tokens).fromKey(newKey);
    }
    down(semitones) {
        return this.up(-semitones);
    }
    toKey(toKey) {
        const key = this.getKey();
        const newKey = KeySignatures_1.KeySignatures.valueOf(toKey);
        const tokens = transposeTokens(this.tokens, key, newKey);
        return new Transposer(tokens).fromKey(newKey);
    }
    /** Returns a string representation of the text. */
    toString() {
        return this.tokens
            .map((line) => line.map((token) => token.toString()).join(''))
            .join("\n");
    }
}
exports.Transposer = Transposer;
/**
 * Finds the key that is a specified number of semitones above/below the current
 * key.
 */
function transposeKey(currentKey, semitones) {
    const newRank = (currentKey.rank + semitones + N_KEYS) % N_KEYS;
    return KeySignatures_1.KeySignatures.forRank(newRank);
}
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
    const lines = text.split("\n");
    const newText = [];
    for (const line of lines) {
        const newLine = [];
        let chordCount = 0;
        let tokenCount = 0;
        const tokens = line.split(/(\s+|-)/g);
        let lastTokenWasString = false;
        for (const token of tokens) {
            const isTokenEmpty = token.trim() === "";
            if (!isTokenEmpty && Chord_1.isChord(token)) {
                const chord = Chord_1.Chord.parse(token);
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
    const transpositionMap = createTranspositionMap(fromKey, toKey);
    const result = [];
    for (const line of tokens) {
        const accumulator = [];
        let spaceDebt = 0;
        line.forEach((token, i) => {
            if (typeof token === "string") {
                if (spaceDebt > 0) {
                    const numSpaces = token.search(/\S|$/);
                    // Keep at least one space.
                    const spacesToTake = Math.min(spaceDebt, numSpaces, token.length - 1);
                    const truncatedToken = token.substring(spacesToTake);
                    accumulator.push(truncatedToken);
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
                const transposedChord = new Chord_1.Chord(transpositionMap.get(token.root), token.suffix, transpositionMap.get(token.bass));
                const originalChordLen = token.toString().length;
                const transposedChordLen = transposedChord.toString().length;
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
    }
    return result;
}
/**
 * Given the current key and the number of semitones to transpose, returns a
 * mapping from each note to a transposed note.
 */
function createTranspositionMap(currentKey, newKey) {
    const map = new Map();
    const semitones = semitonesBetween(currentKey, newKey);
    const scale = newKey.chromaticScale;
    for (const [chord, rank] of Chord_1.CHORD_RANKS.entries()) {
        const newRank = (rank + semitones + N_KEYS) % N_KEYS;
        map.set(chord, scale[newRank]);
    }
    return map;
}
/** Finds the number of semitones between the given keys. */
function semitonesBetween(a, b) {
    return b.rank - a.rank;
}
exports.transpose = (text) => new Transposer(text);
var Chord_2 = require("./Chord");
Object.defineProperty(exports, "Chord", { enumerable: true, get: function () { return Chord_2.Chord; } });
var KeySignatures_2 = require("./KeySignatures");
Object.defineProperty(exports, "KeySignature", { enumerable: true, get: function () { return KeySignatures_2.KeySignature; } });
Object.defineProperty(exports, "KeySignatures", { enumerable: true, get: function () { return KeySignatures_2.KeySignatures; } });
exports.default = {
    transpose: exports.transpose,
    Chord: Chord_1.Chord,
    KeySignature: KeySignatures_1.KeySignature,
    KeySignatures: KeySignatures_1.KeySignatures,
    Transposer,
};
