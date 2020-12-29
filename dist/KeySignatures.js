import { Enum, EnumValue } from 'ts-enums';
import { Chord, ROOT_PATTERN, MINOR_PATTERN } from './Chord';
import * as XRegExp from 'xregexp';
// Chromatic scale starting from C using flats only.
const FLAT_SCALE = [
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "Cb",
];
// Chromatic scale starting from C using sharps only.
const SHARP_SCALE = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
];
// Chromatic scale for F# major which includes E#.
export const F_SHARP_SCALE = SHARP_SCALE.map(note => note === "F" ? "E#" : note);
// Chromatic scale for C# major which includes E# and B#.
export const C_SHARP_SCALE = F_SHARP_SCALE.map(note => note === "C" ? "B#" : note);
// Chromatic scale for Gb major which includes Cb.
export const G_FLAT_SCALE = FLAT_SCALE.map(note => note === "B" ? "Cb" : note);
// Chromatic scale for Cb major which includes Cb and Fb.
export const C_FLAT_SCALE = G_FLAT_SCALE.map(note => note === "E" ? "Fb" : note);
const KEY_SIGNATURE_REGEX = XRegExp(`${ROOT_PATTERN}(${MINOR_PATTERN})?`);
export var KeyType;
(function (KeyType) {
    KeyType[KeyType["FLAT"] = 0] = "FLAT";
    KeyType[KeyType["SHARP"] = 1] = "SHARP";
})(KeyType || (KeyType = {}));
export class KeySignature extends EnumValue {
    constructor(majorKey, relativeMinor, keyType, rank, chromaticScale) {
        super(majorKey);
        this.majorKey = majorKey;
        this.relativeMinor = relativeMinor;
        this.keyType = keyType;
        this.rank = rank;
        this.chromaticScale = chromaticScale;
    }
}
/** Enum for each key signature. */
class KeySignatureEnum extends Enum {
    constructor() {
        super();
        this.C = new KeySignature('C', 'Am', KeyType.SHARP, 0, SHARP_SCALE);
        this.Db = new KeySignature('Db', 'Bbm', KeyType.FLAT, 1, FLAT_SCALE);
        this.D = new KeySignature('D', 'Bm', KeyType.SHARP, 2, SHARP_SCALE);
        this.Eb = new KeySignature('Eb', 'Cm', KeyType.FLAT, 3, FLAT_SCALE);
        this.E = new KeySignature('E', 'C#m', KeyType.SHARP, 4, SHARP_SCALE);
        this.F = new KeySignature('F', 'Dm', KeyType.FLAT, 5, FLAT_SCALE);
        this.Gb = new KeySignature('Gb', 'Ebm', KeyType.FLAT, 6, G_FLAT_SCALE);
        this.Fsharp = new KeySignature('F#', 'D#m', KeyType.SHARP, 6, F_SHARP_SCALE);
        this.G = new KeySignature('G', 'Em', KeyType.SHARP, 7, SHARP_SCALE);
        this.Ab = new KeySignature('Ab', 'Fm', KeyType.FLAT, 8, FLAT_SCALE);
        this.A = new KeySignature('A', 'F#m', KeyType.SHARP, 9, SHARP_SCALE);
        this.Bb = new KeySignature('Bb', 'Gm', KeyType.FLAT, 10, FLAT_SCALE);
        this.B = new KeySignature('B', 'G#m', KeyType.SHARP, 11, SHARP_SCALE);
        // Unconventional key signatures:
        this.Csharp = new KeySignature('C#', 'A#m', KeyType.SHARP, 1, C_SHARP_SCALE);
        this.Cb = new KeySignature('Cb', 'Abm', KeyType.FLAT, 11, C_FLAT_SCALE);
        this.Dsharp = new KeySignature('D#', '', KeyType.SHARP, 3, SHARP_SCALE);
        this.Gsharp = new KeySignature('G#', '', KeyType.SHARP, 8, SHARP_SCALE);
        this.keySignatureMap = new Map();
        this.rankMap = new Map();
        this.initEnum('KeySignature');
        for (const signature of this.values) {
            this.keySignatureMap.set(signature.majorKey, signature);
            this.keySignatureMap.set(signature.relativeMinor, signature);
            if (!this.rankMap.has(signature.rank)) {
                this.rankMap.set(signature.rank, signature);
            }
        }
    }
    /**
     * Returns the enum constant with the specific name or throws an error if the
     * key signature is not valid.
     */
    valueOf(name) {
        if (KEY_SIGNATURE_REGEX.test(name)) {
            const chord = Chord.parse(name);
            const signatureName = chord.isMinor() ? chord.root + 'm' : chord.root;
            const foundSignature = this.keySignatureMap.get(signatureName);
            if (foundSignature) {
                return foundSignature;
            }
            // If all else fails, try to find any key with this chord in it.
            for (const signature of this.values) {
                if (signature.chromaticScale.includes(chord.root)) {
                    return signature;
                }
            }
        }
        throw new Error(`${name} is not a valid key signature.`);
    }
    forRank(rank) {
        const signature = this.rankMap.get(rank);
        if (signature) {
            return signature;
        }
        throw new Error(`${rank} is not a valid rank.`);
    }
}
/**
 * Transforms the given chord into a key signature.
 */
export function guessKeySignature(chord) {
    let signature = chord.root;
    if (chord.isMinor()) {
        signature += 'm';
    }
    return KeySignatures.valueOf(signature);
}
export const KeySignatures = new KeySignatureEnum();
