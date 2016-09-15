var XRegExp = require('xregexp');

module.exports = {
  transpose: function(text) {
    return new Text(text);
  },
}

/**
 * Object which holds information about the text. The text is transposed and
 * returned when up, down or toKey is called.
 */
function Text(text) {
  var text = text;
  var currentKey = null;
  var formatter = null;

  this.fromKey = function(key) {
    currentKey = key;
    return this;
  }

  this.withFormatter = function(fmt) {
    formatter = fmt;
    return this;
  }

  this.up = function(n) {
    return transpose(text, semitoneMapper(n), currentKey, formatter);
  }

  this.down = function(n) {
    return transpose(text, semitoneMapper(-n), currentKey, formatter);
  }

  this.toKey = function(key) {
    return transpose(text, 
        function(currentKey) { return key; },
        currentKey,
        formatter);
  }
}

/**
 * Returns a function that when given a key, will return the key the given
 * number of semitones higher/lower.
 */
function semitoneMapper(semitones) {
  return function(currentKey) {
    return transposeKey(currentKey, semitones);
  };
}

/**
 * Transposes text into another key which is given by the mapper function.
 *
 * The mapper function is a function that takes a key signature and gives the
 * target key signature to be transposed into. If currentKey is unknown, we take
 * the first chord we see as the key signature.
 */
function transpose(text, mapper, currentKey, formatter) {
  if (formatter == null) {
    formatter = defaultFormatter;
  }

  // Initialize the variables.
  var newText = [],
    newKey, curId = 0,
    parts, table = {},
    map;

  /**
   * Saves the given symbol in the table.
   */
  function cacheSymbol(symbol, colourId) {
    table[tokens[i]] = {};
    table[tokens[i]].symbol = symbol;
    table[tokens[i]].colour = colourId;
  }

  // Split the text by parts.
  var lines = text.split("\n");

  // If current key is known, generate map.
  if (currentKey) {
    newKey = mapper(currentKey);
    map = transpositionMap(currentKey, newKey);
  }

  // Iterate lines.
  for (k = 0; k < lines.length; k++) {
    var newLine = "",
      chordCount = 0,
      tokenCount = 0;
    var tokens = lines[k].split(/(\s+)/g);

    for (var i = 0; i < tokens.length; i++) {
      // Check for all whitespace.
      if (tokens[i].trim() === '') {
        newLine += tokens[i];
        continue;
      }

      if (tokens[i] in table) {
        newLine += formatter(table[tokens[i]].symbol, table[tokens[i]].colour);
        chordCount++;
        continue;
      }

      // If symbol is chord, transpose it.
      if (chordPattern.test(tokens[i])) {
        parts = parse(tokens[i]);
        // If current key is unknown, set the first seen chord to the current key.
        if (!currentKey) {
          // If the first chord is minor, find its major equivalent.
          if (parts.suffix == 'm' || parts.suffix == 'min') {
            currentKey = minors[parts.chord];
          } else {
            currentKey = parts.chord;
          }
          newKey = mapper(currentKey);
          map = transpositionMap(currentKey, newKey);
        }
        var symbol = transposeToken(map, parts);
        cacheSymbol(symbol, curId);
        newLine += formatter(symbol, curId);
        curId++;
        chordCount++;
        // If symbol is not chord, just add it.
      } else {
        newLine += tokens[i];
        tokenCount++;
      }
    }
    if (chordCount > tokenCount / 2) {
      newText.push(newLine);
    } else {
      newText.push(lines[k]);
    }
  }
  if (!newKey) {
    throw new Error('No valid chords were found for default key signature.');
  }
  return {
    text: newText.join('\n'),
    key: newKey,
  };
}

function parse(sym) {
  return XRegExp.exec(sym, chordPattern);
}

/**
 * Transposes the token given its parts.
 */
function transposeToken(map, parts) {
  try {
    var chord = map[parts.chord];
    var suffix = (parts.suffix === undefined) ? "" : parts.suffix;
    var bass = (parts.bass === undefined) ? "" : map[parts.bass];
  } catch (err) {
    alert(err);
    return "";
  }
  if (bass) {
    return chord + suffix + "/" + bass;
  } else {
    return chord + suffix;
  }
}

/**
 * Given the current key and the number of semitones to transpose, returns a
 * mapping from each note to a transposed note.
 */
function transpositionMap(currentKey, newKey) {
  var map = {};
  // Get the number of semitones.
  semitones = semitonesBetween(currentKey, newKey);

  // Find out whether new key is sharp of flat.
  if (keys[newKey]["flats"] > 0) {
    scale = flats;
  } else {
    scale = sharps;
  }

  for (var i = 0; i < N_KEYS; i++) {
    map[flats[i]] = scale[(i + semitones + N_KEYS) % N_KEYS];
    map[sharps[i]] = scale[(i + semitones + N_KEYS) % N_KEYS];
  }
  return map;
}

function semitonesBetween(a, b) {
  if (!(a in keys)) {
    throw new Error(a + " is not a valid key signature.");
  }
  if (!(b in keys)) {
    throw new Error(b + " is not a valid key signature.");
  }
  return keys[b]["index"] - keys[a]["index"];
}

/**
 * Finds the key that is a specified number of semitones above/below the current key.
 */
function transposeKey(currentKey, semitones) {
  if (!(currentKey in keys)) {
    throw new Error(currentKey + " is not a valid key signature.");
  }
  var newInd = (keys[currentKey]["index"] + semitones + N_KEYS) % N_KEYS;
  for (var k in keys) {
    if (keys[k]["index"] == newInd) {
      return k;
    }
  }
  return null;
}

function defaultFormatter(text, id) {
  return text;
}

// List of chords using flats.
var flats = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "Cb"];

// List of chords using sharps.
var sharps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// List of key signatures and some data about each.
var keys = {
  "C": {
    index: 0,
    sharps: 0,
    flats: 0
  },
  "Db": {
    index: 1,
    sharps: 0,
    flats: 5
  },
  "D": {
    index: 2,
    sharps: 2,
    flats: 0
  },
  "Eb": {
    index: 3,
    sharps: 0,
    flats: 3
  },
  "E": {
    index: 4,
    sharps: 4,
    flats: 0
  },
  "F": {
    index: 5,
    sharps: 0,
    flats: 1
  },
  "Gb": {
    index: 6,
    sharps: 0,
    flats: 6
  },
  "G": {
    index: 7,
    sharps: 1,
    flats: 0
  },
  "Ab": {
    index: 8,
    sharps: 0,
    flats: 4
  },
  "A": {
    index: 9,
    sharps: 3,
    flats: 0
  },
  "Bb": {
    index: 10,
    sharps: 0,
    flats: 2
  },
  "B": {
    index: 11,
    sharps: 5,
    flats: 0
  }
};

// Maps each minor key to its major equivalent.
var minors = {
  "C": "Eb",
  "Db": "F",
  "D": "F",
  "Eb": "Gb",
  "E": "G",
  "F": "Ab",
  "F#": "A",
  "G": "Bb",
  "Ab": "Cb",
  "A": "C",
  "Bb": "Db",
  "B": "D"
};

var N_KEYS = 12;

// Regex for recognizing chords
var chordPattern = XRegExp('^(?<chord>[A-G](#|b)?)(?<suffix>(\\(?(M|maj|major|m|min|minor|dim|sus|dom|aug|\\+|-|add)?\\d*\\)?)*)(\\/(?<bass>[A-G](#|b)?))?$');
