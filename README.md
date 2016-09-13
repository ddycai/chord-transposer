Chord Transposer
========

A Javascript library for transposing musical chords from one key to another,
including chords embedded in text such those found in lyrics/tabs.  Only chords
will be identified and transposed and whitespace is preserved.

The library is unit tested, and tests can be found in `test.js`.

## Usage

Given some text containing chords, you can transpose it to any other key using
`toKey`. The key signature taken by the transposer is always the major form. So
Am should be given as C.

```javascript
// Transpose from C major to D major.
result = Transposer.transpose(text).fromKey('C').toKey('D');
// The result is an object containing the new text,
newText = result.text;
// the new key,
newKey = result.key;
// and the change in semitones between the two keys.
semitonesBetween = result.change;
```

You can also transpose up or down any number of semitones.

```javascript
// Transpose up 7 semitones from C major.
result = Transposer.transpose(text).fromKey('C').up(7);

// Transpose down 4 semitones from C major.
result = Transposer.transpose(text).fromKey('C').down(4);
```

You can choose not to specify the current key. Transposer will choose the first
chord of your text to be the key signature.

```javascript
// Transpose to C major.
result = Transposer.transpose(text).toKey('C');

// Transpose down 4 semitones.
result = Transposer.transpose(text).down(4);
```

You can pass in a formatter to format the chord symbols. A formatter takes the
chord symbol and an ID and returns the formatted chord. For each unique chord, a
unique ID (starting from 0, increasing by 1 for each unique chord) is assigned
and passed to the formatter.

You can use this to give each chord a unique colour by mapping each id to a
colour, for example.

To surround chords with a `<span>`:

```javascript
// Transpose and put each chord in a span
result = Transposer.transpose(text).withFormatter(
      function(sym, id) {
        return '<span>' + sym + '</span>';
      }
    ).toKey('Bb');
```
