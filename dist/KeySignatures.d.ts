import { Enum, EnumValue } from 'ts-enums';
import { Chord } from './Chord';
export declare const F_SHARP_SCALE: string[];
export declare const C_SHARP_SCALE: string[];
export declare const G_FLAT_SCALE: string[];
export declare const C_FLAT_SCALE: string[];
export declare enum KeyType {
    FLAT = 0,
    SHARP = 1
}
export declare class KeySignature extends EnumValue {
    majorKey: string;
    relativeMinor: string;
    keyType: KeyType;
    rank: number;
    chromaticScale: string[];
    constructor(majorKey: string, relativeMinor: string, keyType: KeyType, rank: number, chromaticScale: string[]);
}
/** Enum for each key signature. */
export declare class KeySignatureEnum extends Enum<KeySignature> {
    C: KeySignature;
    Db: KeySignature;
    D: KeySignature;
    Eb: KeySignature;
    E: KeySignature;
    F: KeySignature;
    Gb: KeySignature;
    Fsharp: KeySignature;
    G: KeySignature;
    Ab: KeySignature;
    A: KeySignature;
    Bb: KeySignature;
    B: KeySignature;
    Csharp: KeySignature;
    Cb: KeySignature;
    Dsharp: KeySignature;
    Gsharp: KeySignature;
    keySignatureMap: Map<string, KeySignature>;
    rankMap: Map<number, KeySignature>;
    constructor();
    /**
     * Returns the enum constant with the specific name or throws an error if the
     * key signature is not valid.
     */
    valueOf(name: string): KeySignature;
    forRank(rank: number): KeySignature;
}
/**
 * Transforms the given chord into a key signature.
 */
export declare function guessKeySignature(chord: Chord): KeySignature;
export declare const KeySignatures: KeySignatureEnum;
