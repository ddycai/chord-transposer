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
`toKey`. The key signature taken by the transposer is always the major form so
Am should be given as C.

```javascript
// Transpose from F major to D major.
Transposer.transpose('F  C7 Bb   \nHello world').fromKey('F').toKey('D');
// { text: 'D  A7 G   \nHello world', key: 'D' }
```

### Transposing Up or Down Semitones

You can also transpose up or down any number of semitones.

```javascript
// Transpose up 7 semitones from F major.
Transposer.transpose('F  Am Bb   \nHello world').fromKey('F').up(7);
// { text: 'C  Em F   \nHello world', key: 'C' }

// Transpose down 4 semitones from F major.
Transposer.transpose('F  Am Bb   \nHello world').fromKey('F').down(4);
// { text: 'Db  Fm Gb   \nHello world', key: 'Db' }
```

### Auto Key Signature

You can choose not to specify the current key. Transposer will choose the first
chord of your text to be the key signature.

```javascript
Transposer.transpose('F  C7 Bb   \nHello world').toKey('D');
// { text: 'D  A7 G   \nHello world', key: 'D' }

Transposer.transpose('F  Am Bb   \nHello world').fromKey('F').up(7);
// { text: 'C  Em F   \nHello world', key: 'C' }
```

### Supported Chords

Various types of chords are supported:

```java
Transposer.transpose('C Cmaj CM').toKey('F');
// { text: 'F Fmaj FM', key: 'F' }

Transposer.transpose('Cm Cmin C-').toKey('F');
// { text: 'Dm Dmin D-', key: 'F' }

Transposer.transpose('Cdim').toKey('F');
// { text: 'Fdim', key: 'F' }

Transposer.transpose('Caug C+ C+5').toKey('F');
// { text: 'Faug F+ F+5', key: 'F' }

Transposer.transpose('C/F C7/F Cm/F').toKey('F');
// { text: 'F/Bb F7/Bb Fm/Bb', key: 'F' }
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
// Transpose and put each chord in a span
result = Transposer.transpose(text).withFormatter(
      function(sym, id) {
        return '<span>' + sym + '</span>';
      }
    ).toKey('Bb');
```
