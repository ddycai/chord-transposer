import { KeySignatures, KeySignature, KeyType } from './KeySignatures'
import * as XRegExp from 'xregexp'

const N_KEYS = 12;

// Chromatic scale starting from C using flats only.
const FLAT_SCALE = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "Cb"];

// Chromatic scale starting from C using sharps only.
const SHARP_SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Regex for recognizing chords
const ROOT_PATTERN = '(?<root>[A-G](#|b)?)';
const SUFFIX_PATTERN = '(?<suffix>\\(?(M|maj|major|m|min|minor|dim|sus|dom|aug)?(\\+|-|add)?\\d*\\)?)';
const BASS_PATTERN = '(\\/(?<bass>[A-G](#|b)?))?';
const MINOR_PATTERN = '(m|min|minor)+';

const CHORD_REGEX = XRegExp(`^${ROOT_PATTERN}${SUFFIX_PATTERN}${BASS_PATTERN}$`);
const MINOR_CHORD_REGEX = XRegExp(`^${ROOT_PATTERN}${MINOR_PATTERN}.*$`);

/** Fluent API for transposing text containing chords. */
class Transposer {
  tokens: any[][];
  currentKey: KeySignature;

  static transpose(text: string | any[][]) {
    return new Transposer(text);
  }

  constructor(text: string | any[][]) {
    if (typeof text === "string") {
      this.tokens = parse(text);
    } else if (text instanceof Array) {
      this.tokens = text;
    } else {
      throw new Error('Invalid argument (must be text or parsed text).');
    }
    this.guessKey();
  }

  /** Guesses the key of the text. Currently just takes the first chord. */
  guessKey(): KeySignature {
    if (this.currentKey) {
      return;
    }

    for (let line of this.tokens) {
      for (let token of line) {
        if (token instanceof Chord) {
          if (MINOR_CHORD_REGEX.test(token.toString())) {
            this.currentKey = KeySignatures.valueOf(token.root + 'm');
          } else {
            this.currentKey = KeySignatures.valueOf(token.root);
          }
          return;
        }
      }
    }
    throw new Error('Given text has no chords');
  }

  fromKey(key: string): Transposer {
    this.currentKey = KeySignatures.valueOf(key);
    return this;
  }

  up(semitones: number): Transposer {
    let newKey = transposeKey(this.currentKey, semitones);
    this.tokens = _transpose(this.tokens,
      this.currentKey,
      newKey);
    this.currentKey = newKey;
    return this;
  }

  down(semitones: number): Transposer {
    let newKey = transposeKey(this.currentKey, -semitones);
    this.tokens = _transpose(this.tokens,
      this.currentKey,
      newKey);
    this.currentKey = newKey;
    return this;
  }

  toKey(key: string): Transposer {
    let newKey = KeySignatures.valueOf(key);
    this.tokens = _transpose(this.tokens,
      this.currentKey,
      newKey);
    this.currentKey = newKey;
    return this;
  }

  /** Returns a string representation of the text. */
  toString(): string {
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
function transposeKey(currentKey: KeySignature, semitones: number) {
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
  constructor(public root: string,
    public suffix?: string,
    public bass?: string) { }

  toString(): string {
    if (this.bass) {
      return this.root + this.suffix + "/" + this.bass;
    } else {
      return this.root + this.suffix;
    }
  }

  static parse(token): Chord {
    const result = XRegExp.exec(token, CHORD_REGEX);
    return new Chord(result.root, result.suffix, result.bass);
  }
}

/** Parses the given text into chords.
 *  
 *  The ratio of chords to non-chord tokens in each line must be greater than
 *  the given threshold in order for the line to be transposed. The threshold
 *  is set to 0.5 by default.
 */
function parse(text: string, threshold?: number): any[][] {
  if (threshold === undefined) {
    threshold = 0.5;
  }
  const lines: Array<string> = text.split("\n");

  const newText: any[][] = [];

  for (let line of lines) {
    const newLine: any[] = [];
    let chordCount: number = 0;
    let tokenCount: number = 0;
    const tokens: string[] = line.split(/(\s+|-)/g);

    let lastTokenWasString: boolean = false;
    for (let token of tokens) {
      let isTokenEmpty = token.trim() === '';
      if (!isTokenEmpty && CHORD_REGEX.test(token)) {
        const chord: Chord = Chord.parse(token);
        newLine.push(chord);
        chordCount++;
        lastTokenWasString = false;
      } else {
        if (lastTokenWasString) {
          newLine.push(newLine.pop() + token);
        } else {
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
    } else {
      newText.push([line]);
    }
  }
  return newText;
}

/**
 * Transposes the given parsed text (by the parse() function) to another key.
 */
function _transpose(tokens: any[][],
  fromKey: KeySignature,
  toKey: KeySignature) {

  const noteMap = transpositionMap(fromKey, toKey);

  for (let line of tokens) {
    for (let token of line) {
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
function transpositionMap(currentKey: KeySignature, newKey: KeySignature) {
  const map = {};
  const semitones = semitonesBetween(currentKey, newKey);

  let scale;
  if (newKey.keyType == KeyType.FLAT) {
    scale = FLAT_SCALE;
  } else {
    scale = SHARP_SCALE;
  }

  for (let i = 0; i < N_KEYS; i++) {
    map[FLAT_SCALE[i]] = scale[(i + semitones + N_KEYS) % N_KEYS];
    map[SHARP_SCALE[i]] = scale[(i + semitones + N_KEYS) % N_KEYS];
  }
  return map;
}

/** Finds the number of semitones between the given keys. */
function semitonesBetween(a: KeySignature, b: KeySignature) {
  return b.rank - a.rank;
}

export const transpose = text => new Transposer(text);

export default Transposer;
