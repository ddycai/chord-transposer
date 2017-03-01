Chord Transposer
========

A Javascript library for transposing musical chords, including chords embedded
in text such as those found in lyrics/tabs. The transposer distinguishes between
chords and regular text, only tranposing chords and preserving whitespace.

The library is unit tested, and tests can be found in `test.js`.

## Usage

Install via npm:

```
npm install chord-transposer
```

`require` the package:

```javascript
var Transposer = require('chord-transposer');
```

### Transposing to a Specific Key

Given some text containing chords, you can transpose it to any other key using
`toKey`.

```javascript
// Transpose from F major to D major.
> Transposer.transpose('F  C7 Bb   \nHello world').fromKey('F').toKey('D')
// output:
{ text: 'D  A7 G   \nHello world',
  key: 'D',
  original_key: 'F',
  offset: 9 }

// Transpose from F minor to D minor.
> Transposer.transpose('Fm  C Ab   \nHello world').fromKey('Fm').toKey('Dm')
{ text: 'Dm  A F   \nHello world',
  key: 'F',
  original_key: 'Ab',
  offset: 9 }
```

`offset` is the number of semitones between the original key and your new key.
The offset is always given as a positive number.

**Note** The key returned by the Transposer is always the relative major.
Therefore, you will get `F` even if you are transposing to `Dm`. If you need the
minor key, you can do this with the transposer in the following way:

```javascript
// Get the relative minor of the given key.
function getMinor(key) {
  return Transposer.transpose(key).down(3).text + 'm';
}

// Get the relative minor of F major.
> getMinor('F')
'Dm'
```

### Transposing Up or Down Semitones

You can also transpose up or down any number of semitones.

```javascript
// Transpose up 7 semitones from F major.
> Transposer.transpose('F  Am Bb   \nHello world').fromKey('F').up(7)
{ text: 'C  Em F   \nHello world',
  key: 'C',
  original_key: 'F',
  offset: 7 }

// Transpose down 4 semitones from F major.
> Transposer.transpose('F  Am Bb   \nHello world').fromKey('F').down(4)
{ text: 'Db  Fm Gb   \nHello world',
  key: 'Db',
  original_key: 'F',
  offset: 8 }
```

### Auto Key Signature

You can choose not to specify the current key. Transposer will choose the first
chord of your text to be the key signature.

```javascript
> Transposer.transpose('F  C7 Bb   \nHello world').toKey('D')
{ text: 'D  A7 G   \nHello world',
  key: 'D',
  original_key: 'F',
  offset: 9 }

> Transposer.transpose('Fm  C Ab   \nHello world').toKey('Dm')
{ text: 'Dm  A F   \nHello world',
  key: 'F',
  original_key: 'Ab',
  offset: 9 }

> Transposer.transpose('F  Am Bb   \nHello world').up(7)
{ text: 'C  Em F   \nHello world',
  key: 'C',
  original_key: 'F',
  offset: 7 }
```

### Supported Chords

Various types of chords are supported:

```java
> Transposer.transpose('C Cmaj CM').toKey('F')
{ text: 'F Fmaj FM', key: 'F', original_key: 'C', offset: 5 }

> Transposer.transpose('Cm Cmin C-').toKey('F')
{ text: 'Dm Dmin D-', key: 'F', original_key: 'Eb', offset: 2 }

> Transposer.transpose('Cdim').toKey('F')
{ text: 'Fdim', key: 'F', original_key: 'C', offset: 5 }

> Transposer.transpose('Caug C+ C+5').toKey('F')
{ text: 'Faug F+ F+5', key: 'F', original_key: 'C', offset: 5 }

> Transposer.transpose('C/F C7/F Cm/F').toKey('F')
{ text: 'F/Bb F7/Bb Fm/Bb',
  key: 'F',
  original_key: 'C',
  offset: 5 }
```

### Formatter

You can pass in a formatter to format the chord symbols. A formatter takes the
chord symbol and an ID and returns the formatted chord. For each unique chord, a
unique ID (starting from 0, increasing by 1 for each unique chord) is assigned
and passed to the formatter.

You can use this to give each chord a unique colour by mapping each id to a
colour, for example.

To surround chords with a `<span>`:

```javascript
// Transpose and put each chord in a span.
> Transposer.transpose('F  C7 Bb   \nHello world').withFormatter(
      function(sym, id) {
        return '<span>' + sym + '</span>';
      }).toKey('Bb')
// output
{ text: '<span>Bb</span>  <span>F7</span> <span>Eb</span>   \nHello world',
  key: 'Bb',
  original_key: 'F',
  offset: 5 }
```
