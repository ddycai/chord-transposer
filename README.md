Chord Transposer
========

Javascript/TypeScript library for transposing musical chords within arbitrary
text.

## Usage

Install via npm:

```
npm install chord-transposer
```

Import the package using your preferred import syntax:

```javascript
const Transposer = require('chord-transposer');

import * as Transposer from 'chord-transposer';

import { transpose } from 'chord-transposer';
```

## Transposing

To a certain key signature:

```javascript
> Transposer.transpose('F  C7 Bb   \nHello world').fromKey('F').toKey('D').toString()
'D  A7 G   \nHello world'

> Transposer.transpose('Fm  C Ab   \nHello world').fromKey('Fm').toKey('Dm').toString()
'Dm  A F   \nHello world'
```

`up` or `down` any number of semitones:

```javascript
// Up 7 semitones.
> Transposer.transpose('F  Am Bb   \nHello world').fromKey('F').up(7).toString()
'C  Em F   \nHello world'

// Down 4 semitones.
> Transposer.transpose('F  Am Bb   \nHello world').fromKey('F').down(4).toString()
'Db  Fm Gb   \nHello world'
```

### Auto Key Signature

If the key signature is not specified, the key will be inferred from the first
chord.

```javascript
> Transposer.transpose('F  C7 Bb   \nHello world').toKey('D').toString()
'D  A7 G   \nHello world'

> Transposer.transpose('Fm  C Ab   \nHello world').toKey('Dm').toString()
'Dm  A F   \nHello world'

> Transposer.transpose('F  Am Bb   \nHello world').up(7)
'C  Em F   \nHello world'
```

### Supported Chords

```javascript
> Transposer.transpose('C Cmaj CM Cm/F C7/F Csus4').toKey('F').toString()
'F Fmaj FM Fm/Bb F7/Bb Fsus4'

> Transposer.transpose('Cm Cmin C- Cdim Caug C+ C+5').toKey('Dm').toString()
'Dm Dmin D- Ddim Daug D+ D+5'
```

## Parsing

When text is passed into `transpose`, it is parsed into an
`Array<Array<string|Chord>>`. You can access these through `tokens` to parse
however you like:

```javascript
> Transposer
    .transpose('C  G  Am  G7/B  C    F  C   F   G7\nO Canada  Our home and native land')
    .tokens
[ [ Chord { root: 'C', suffix: '', bass: undefined },
    '  ',
    Chord { root: 'G', suffix: '', bass: undefined },
    '  ',
    Chord { root: 'A', suffix: 'm', bass: undefined },
    '  ',
    Chord { root: 'G', suffix: '7', bass: 'B' },
    '  ',
    Chord { root: 'C', suffix: '', bass: undefined },
    '    ',
    Chord { root: 'F', suffix: '', bass: undefined },
    '  ',
    Chord { root: 'C', suffix: '', bass: undefined },
    '   ',
    Chord { root: 'F', suffix: '', bass: undefined },
    '   ',
    Chord { root: 'G', suffix: '7', bass: undefined } ],
  [ 'O Canada  Our home and native land' ] ]
```

### Key Signatures

You can see the current key signature of the text through `currentKey`.

```javascript
> Transposer.transpose('C  G').currentKey
KeySignature {
  _description: 'C',
  _ordinal: 0,
  majorKey: 'C',
  relativeMinor: 'Am',
  keyType: 1,
  rank: 0,
  _propName: 'C' }

> Transposer.transpose('C  G').up(4).currentKey
KeySignature {
  _description: 'E',
  _ordinal: 4,
  majorKey: 'E',
  relativeMinor: 'C#m',
  keyType: 1,
  rank: 4,
  _propName: 'E' }
