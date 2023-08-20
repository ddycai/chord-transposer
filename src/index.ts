import {
  KeySignatures,
  KeySignature,
  guessKeySignature,
} from "./KeySignatures";
import { Chord, isChord, CHORD_RANKS } from "./Chord";

export type Token = Chord | string;

const N_KEYS = 12;

/** Fluent API for transposing text containing chords. */
export class Transposer {
  tokens: Token[][];
  currentKey?: KeySignature;

  static transpose(text: string | Token[][]) {
    return new Transposer(text);
  }

  constructor(text: string | Token[][]) {
    if (typeof text === "string") {
      this.tokens = tokenize(text);
    } else if (text instanceof Array) {
      this.tokens = text;
    } else {
      throw new Error("Invalid argument (must be text or parsed text).");
    }
  }

  /** Get the key of the text. If not explicitly set, it will be guessed from the first chord. */
  getKey(): KeySignature {
    if (this.currentKey) {
      return this.currentKey;
    }

    for (const line of this.tokens) {
      for (const token of line) {
        if (token instanceof Chord) {
          return guessKeySignature(token);
        }
      }
    }
    throw new Error("Given text has no chords");
  }

  fromKey(key: string | KeySignature): Transposer {
    this.currentKey =
      key instanceof KeySignature ? key : KeySignatures.valueOf(key);
    return this;
  }

  up(semitones: number): Transposer {
    const key = this.getKey();
    const newKey = transposeKey(key, semitones);
    const tokens = transposeTokens(this.tokens, key, newKey);
    return new Transposer(tokens).fromKey(newKey);
  }

  down(semitones: number): Transposer {
    return this.up(-semitones);
  }

  toKey(toKey: string): Transposer {
    const key = this.getKey();
    const newKey = KeySignatures.valueOf(toKey);
    const tokens = transposeTokens(this.tokens, key, newKey);
    return new Transposer(tokens).fromKey(newKey);
  }

  /** Returns a string representation of the text. */
  toString(): string {
    return this.tokens
      .map((line) => line.map((token) => token.toString()).join(''))
      .join("\n");
  }
}

/**
 * Finds the key that is a specified number of semitones above/below the current
 * key.
 */
function transposeKey(
  currentKey: KeySignature,
  semitones: number
): KeySignature {
  const newRank = (currentKey.rank + semitones + N_KEYS) % N_KEYS;
  return KeySignatures.forRank(newRank);
}

/** Tokenize the given text into chords.
 */
function tokenize(text: string): Token[][] {
  const lines: string[] = text.split("\n");

  const newText: Token[][] = [];

  for (const line of lines) {
    const newLine: Token[] = [];
    const tokens: string[] = line.split(/(\s+|-|]|\[)/g);
    let lastTokenWasString: boolean = false;
    for (const token of tokens) {
      const isTokenEmpty = token.trim() === "";
      if (!isTokenEmpty && isChord(token)) {
        const chord: Chord = Chord.parse(token);
        newLine.push(chord);
        lastTokenWasString = false;
      } else {
        if (lastTokenWasString) {
          newLine.push(newLine.pop() + token);
        } else {
          newLine.push(token);
        }
        lastTokenWasString = true;
      }
    }
    newText.push(newLine);
  }
  return newText;
}

/**
 * Transposes the given parsed text (by the parse() function) to another key.
 */
function transposeTokens(
  tokens: Token[][],
  fromKey: KeySignature,
  toKey: KeySignature
): Token[][] {
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
        } else if (typeof accumulator[accumulator.length - 1] === "string") {
          accumulator.push(accumulator.pop() + token);
        } else {
          accumulator.push(token);
        }
      } else {
        const transposedChord = new Chord(
          transpositionMap.get(token.root),
          token.suffix,
          transpositionMap.get(token.bass)
        );
        const originalChordLen = token.toString().length;
        const transposedChordLen = transposedChord.toString().length;
        // Handle length differences between chord and transposed chord.
        if (originalChordLen > transposedChordLen) {
          // Pad right with spaces.
          accumulator.push(transposedChord);
          if (i < line.length - 1) {
            accumulator.push(" ".repeat(originalChordLen - transposedChordLen));
          }
        } else if (originalChordLen < transposedChordLen) {
          // Remove spaces from the right (if possible).
          spaceDebt += transposedChordLen - originalChordLen;
          accumulator.push(transposedChord);
        } else {
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
function createTranspositionMap(
  currentKey: KeySignature,
  newKey: KeySignature
): Map<string, string> {
  const map = new Map<string, string>();
  const semitones = semitonesBetween(currentKey, newKey);

  const scale: string[] = newKey.chromaticScale;

  for (const [chord, rank] of CHORD_RANKS.entries()) {
    const newRank = (rank + semitones + N_KEYS) % N_KEYS;
    map.set(chord, scale[newRank]);
  }
  return map;
}

/** Finds the number of semitones between the given keys. */
function semitonesBetween(a: KeySignature, b: KeySignature): number {
  return b.rank - a.rank;
}

export const transpose = (text: string) => new Transposer(text);
export { Chord } from "./Chord";
export { KeySignature, KeySignatures } from "./KeySignatures";

export default {
  transpose,
  Chord,
  KeySignature,
  KeySignatures,
  Transposer,
};
