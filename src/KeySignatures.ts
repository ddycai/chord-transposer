import { Enum, EnumValue } from 'ts-enums'
import { Chord, MINOR_PATTERN, ROOT_PATTERN } from './Chord';
import XRegExp from 'xregexp';

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

const KEY_SIGNATURE_REGEX = XRegExp(`${ROOT_PATTERN}(${MINOR_PATTERN})?`)

export enum KeyType { FLAT, SHARP }

export class KeySignature extends EnumValue {
  constructor(public majorKey: string,
    public relativeMinor: string,
    public keyType: KeyType,
    public rank: number,
    public chromaticScale: string[]) {
    super(majorKey);
  }
}

/** Enum for each key signature. */
export class KeySignatureEnum extends Enum<KeySignature> {
  C: KeySignature =
    new KeySignature('C', 'Am', KeyType.SHARP, 0, SHARP_SCALE);

  Db: KeySignature =
    new KeySignature('Db', 'Bbm', KeyType.FLAT, 1, FLAT_SCALE);

  D: KeySignature =
    new KeySignature('D', 'Bm', KeyType.SHARP, 2, SHARP_SCALE);

  Eb: KeySignature =
    new KeySignature('Eb', 'Cm', KeyType.FLAT, 3, FLAT_SCALE);

  E: KeySignature =
    new KeySignature('E', 'C#m', KeyType.SHARP, 4, SHARP_SCALE);

  F: KeySignature =
    new KeySignature('F', 'Dm', KeyType.FLAT, 5, FLAT_SCALE);

  Gb: KeySignature =
    new KeySignature('Gb', 'Ebm', KeyType.FLAT, 6, G_FLAT_SCALE);

  Fsharp: KeySignature =
    new KeySignature('F#', 'D#m', KeyType.SHARP, 6, F_SHARP_SCALE);

  G: KeySignature =
    new KeySignature('G', 'Em', KeyType.SHARP, 7, SHARP_SCALE);

  Ab: KeySignature =
    new KeySignature('Ab', 'Fm', KeyType.FLAT, 8, FLAT_SCALE);

  A: KeySignature =
    new KeySignature('A', 'F#m', KeyType.SHARP, 9, SHARP_SCALE);

  Bb: KeySignature =
    new KeySignature('Bb', 'Gm', KeyType.FLAT, 10, FLAT_SCALE);

  B: KeySignature =
    new KeySignature('B', 'G#m', KeyType.SHARP, 11, SHARP_SCALE);

  // Unconventional key signatures:

  Csharp: KeySignature =
    new KeySignature('C#', 'A#m', KeyType.SHARP, 1, C_SHARP_SCALE);

  Cb: KeySignature =
    new KeySignature('Cb', 'Abm', KeyType.FLAT, 11, C_FLAT_SCALE);

  Dsharp: KeySignature =
    new KeySignature('D#', '', KeyType.SHARP, 3, SHARP_SCALE);

  Gsharp: KeySignature =
    new KeySignature('G#', '', KeyType.SHARP, 8, SHARP_SCALE);

  keySignatureMap: Map<string, KeySignature> = new Map();
  rankMap: Map<number, KeySignature> = new Map();

  constructor() {
    super();
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
  valueOf(name: string): KeySignature {
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

  forRank(rank: number) {
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
export function guessKeySignature(chord: Chord): KeySignature {
  let signature = chord.root;
  if (chord.isMinor()) {
    signature += 'm';
  }
  return KeySignatures.valueOf(signature);
}

export const KeySignatures: KeySignatureEnum = new KeySignatureEnum();
