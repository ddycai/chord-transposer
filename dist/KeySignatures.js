import { Enum, EnumValue } from 'ts-enums';
export var KeyType;
(function (KeyType) {
    KeyType[KeyType["FLAT"] = 0] = "FLAT";
    KeyType[KeyType["SHARP"] = 1] = "SHARP";
})(KeyType || (KeyType = {}));
export class KeySignature extends EnumValue {
    constructor(majorKey, relativeMinor, keyType, rank) {
        super(majorKey);
        this.majorKey = majorKey;
        this.relativeMinor = relativeMinor;
        this.keyType = keyType;
        this.rank = rank;
    }
}
/** Enum for each key signature. */
class KeySignatureEnum extends Enum {
    constructor() {
        super();
        this.C = new KeySignature('C', 'Am', KeyType.SHARP, 0);
        this.Db = new KeySignature('Db', 'Bbm', KeyType.FLAT, 1);
        this.D = new KeySignature('D', 'Bm', KeyType.SHARP, 2);
        this.Eb = new KeySignature('Eb', 'Cm', KeyType.FLAT, 3);
        this.E = new KeySignature('E', 'C#m', KeyType.SHARP, 4);
        this.F = new KeySignature('F', 'Dm', KeyType.FLAT, 5);
        this.Gb = new KeySignature('Gb', 'Ebm', KeyType.FLAT, 6);
        this.Fsharp = new KeySignature('F#', 'D#m', KeyType.SHARP, 6);
        this.G = new KeySignature('G', 'Em', KeyType.SHARP, 7);
        this.Ab = new KeySignature('Ab', 'Fm', KeyType.FLAT, 8);
        this.A = new KeySignature('A', 'F#m', KeyType.SHARP, 9);
        this.Bb = new KeySignature('Bb', 'Gm', KeyType.FLAT, 10);
        this.B = new KeySignature('B', 'G#m', KeyType.SHARP, 11);
        // Unconventional key signatures:
        this.Csharp = new KeySignature('C#', '', KeyType.SHARP, 1);
        this.Dsharp = new KeySignature('D#', '', KeyType.SHARP, 3);
        this.Gsharp = new KeySignature('G#', '', KeyType.SHARP, 8);
        this.initEnum('KeySignature');
    }
    /** Returns the enum constant with the specific name. */
    valueOf(name) {
        for (let key of this.values) {
            if (key.majorKey === name
                || (key.relativeMinor && key.relativeMinor === name)) {
                return key;
            }
        }
        throw new Error(`${name} is not a valid key signature.`);
    }
    forRank(rank) {
        for (let key of this.values) {
            if (key.rank === rank) {
                return key;
            }
        }
        throw new Error(`${rank} is not a valid rank.`);
    }
}
export const KeySignatures = new KeySignatureEnum();
