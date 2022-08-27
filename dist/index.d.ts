import { KeySignature } from "./KeySignatures";
import { Chord } from "./Chord";
export declare type Token = Chord | string;
/** Fluent API for transposing text containing chords. */
export declare class Transposer {
    tokens: Token[][];
    currentKey?: KeySignature;
    static transpose(text: string | Token[][]): Transposer;
    constructor(text: string | Token[][]);
    /** Get the key of the text. If not explicitly set, it will be guessed from the first chord. */
    getKey(): KeySignature;
    fromKey(key: string | KeySignature): Transposer;
    up(semitones: number): Transposer;
    down(semitones: number): Transposer;
    toKey(toKey: string): Transposer;
    /** Returns a string representation of the text. */
    toString(): string;
}
export declare const transpose: (text: string) => Transposer;
export { Chord } from "./Chord";
export { KeySignature, KeySignatures } from "./KeySignatures";
declare const _default: {
    transpose: (text: string) => Transposer;
    Chord: typeof Chord;
    KeySignature: typeof KeySignature;
    KeySignatures: import("./KeySignatures").KeySignatureEnum;
    Transposer: typeof Transposer;
};
export default _default;
