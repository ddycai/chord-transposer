import { KeySignatures, KeySignature, KeyType } from './KeySignatures';
import * as XRegExp from 'xregexp';
const N_KEYS = 12;
// Chromatic scale starting from C using flats only.
const FLAT_SCALE = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "Cb"];
// Chromatic scale starting from C using sharps only.
const SHARP_SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
// Regex for recognizing chords
const ROOT_PATTERN = '(?<root>[A-G](#|b)?)';
const TRIAD_PATTERN = '(M|maj|major|m|min|minor|dim|sus|dom|aug|\\+|-)';
const ADDED_TONE_PATTERN = '(([/\\.\\+]|add)?\\d+[\\+-]?)';
const SUFFIX_PATTERN = `(?<suffix>\\(?${TRIAD_PATTERN}?${ADDED_TONE_PATTERN}*\\)?)`;
const BASS_PATTERN = '(\\/(?<bass>[A-G](#|b)?))?';
const MINOR_PATTERN = '(m|min|minor)+';
const CHORD_REGEX = XRegExp(`^${ROOT_PATTERN}${SUFFIX_PATTERN}${BASS_PATTERN}$`);
const MINOR_CHORD_REGEX = XRegExp(`^${ROOT_PATTERN}${MINOR_PATTERN}.*$`);
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
            throw new Error('Invalid argument (must be text or parsed text).');
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
        for (let line of this.tokens) {
            for (let token of line) {
                if (token instanceof Chord) {
                    return KeySignatures.valueOf(token.root + (MINOR_CHORD_REGEX.test(token.toString()) ? 'm' : ''));
                }
            }
        }
        throw new Error('Given text has no chords');
    }
    fromKey(key) {
        this.currentKey = key instanceof KeySignature ? key : KeySignatures.valueOf(key);
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
        const newKey = KeySignatures.valueOf(toKey);
        const tokens = transposeTokens(this.tokens, key, newKey);
        return new Transposer(tokens).fromKey(newKey);
    }
    /** Returns a string representation of the text. */
    toString() {
        return this.tokens
            .map(line => line
            .map(token => token.toString())
            .join(''))
            .join('\n');
    }
}
/**
 * Finds the key that is a specified number of semitones above/below the current
 * key.
 */
function transposeKey(currentKey, semitones) {
    const newRank = (currentKey.rank + semitones + N_KEYS) % N_KEYS;
    return KeySignatures.forRank(newRank);
}
/**
 * Represents a musical chord. For example, Am7/C would have:
 *
 * root: A
 * suffix: m7
 * bass: C
 */
class Chord {
    constructor(root, suffix, bass) {
        this.root = root;
        this.suffix = suffix;
        this.bass = bass;
    }
    toString() {
        if (this.bass) {
            return this.root + this.suffix + "/" + this.bass;
        }
        else {
            return this.root + this.suffix;
        }
    }
    static parse(token) {
        const result = XRegExp.exec(token, CHORD_REGEX);
        return new Chord(result.root, result.suffix, result.bass);
    }
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
    for (let line of lines) {
        const newLine = [];
        let chordCount = 0;
        let tokenCount = 0;
        const tokens = line.split(/(\s+|-)/g);
        let lastTokenWasString = false;
        for (let token of tokens) {
            let isTokenEmpty = token.trim() === "";
            if (!isTokenEmpty && CHORD_REGEX.test(token)) {
                const chord = Chord.parse(token);
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
    let result = [];
    for (let line of tokens) {
        let accumulator = [];
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
                const transposedChord = new Chord(transpositionMap.get(token.root), token.suffix, transpositionMap.get(token.bass));
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
    let scale;
    if (newKey.keyType == KeyType.FLAT) {
        scale = FLAT_SCALE;
    }
    else {
        scale = SHARP_SCALE;
    }
    for (let i = 0; i < N_KEYS; i++) {
        map.set(FLAT_SCALE[i], scale[(i + semitones + N_KEYS) % N_KEYS]);
        map.set(SHARP_SCALE[i], scale[(i + semitones + N_KEYS) % N_KEYS]);
    }
    return map;
}
/** Finds the number of semitones between the given keys. */
function semitonesBetween(a, b) {
    return b.rank - a.rank;
}
export const transpose = (text) => new Transposer(text);
export default Transposer;
