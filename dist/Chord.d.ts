/**
 * The rank for each possible chord. Rank is the distance in semitones from C.
 */
export declare const CHORD_RANKS: Map<string, number>;
export declare const ROOT_PATTERN = "(?<root>[A-G](#|b)?)";
export declare const MINOR_PATTERN = "(m|min|minor)+";
/**
 * Represents a musical chord. For example, Am7/C would have:
 *
 * root: A
 * suffix: m7
 * bass: C
 */
export declare class Chord {
    root: string;
    suffix?: string;
    bass?: string;
    constructor(root: string, suffix?: string, bass?: string);
    toString(): string;
    isMinor(): boolean;
    static parse(token: string): Chord;
}
export declare function isChord(token: string): boolean;
