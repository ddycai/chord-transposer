import { transpose } from '../src/index';
import { expect } from 'chai';
import 'mocha';

const KEYS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const C_MAJOR = 'C D E F G A B C';
const C_MINOR = 'Cm Ddim Eb Fm Gm Ab Bb Cm';

describe('Transposer', () => {
  it ("The correct scales should be returned for each semitone", () => {
    expect(transpose(C_MAJOR).up(0).toString())
      .to.equal(C_MAJOR);
    expect(transpose(C_MAJOR).up(1).toString())
      .to.equal('Db Eb F Gb Ab Bb C Db');
    expect(transpose(C_MAJOR).up(2).toString())
      .to.equal('D E F# G A B C# D');
    expect(transpose(C_MAJOR).up(3).toString())
      .to.equal('Eb F G Ab Bb C D Eb');
    expect(transpose(C_MAJOR).up(4).toString())
      .to.equal('E F# G# A B C# D# E');
    expect(transpose(C_MAJOR).up(5).toString())
      .to.equal('F G A Bb C D E F');
    expect(transpose(C_MAJOR).up(6).toString())
      .to.equal('Gb Ab Bb Cb Db Eb F Gb');
    expect(transpose(C_MAJOR).up(7).toString())
      .to.equal('G A B C D E F# G');
    expect(transpose(C_MAJOR).up(8).toString())
      .to.equal('Ab Bb C Db Eb F G Ab');
    expect(transpose(C_MAJOR).up(9).toString())
      .to.equal('A B C# D E F# G# A');
    expect(transpose(C_MAJOR).up(10).toString())
      .to.equal('Bb C D Eb F G A Bb');
    expect(transpose(C_MAJOR).up(11).toString())
      .to.equal('B C# D# E F# G# A# B');
    expect(transpose(C_MAJOR).up(12).toString())
      .to.equal(C_MAJOR);

    expect(transpose(C_MAJOR).down(12).toString())
      .to.equal(C_MAJOR);
    expect(transpose(C_MAJOR).down(11).toString())
      .to.equal('Db Eb F Gb Ab Bb C Db');
    expect(transpose(C_MAJOR).down(10).toString())
      .to.equal('D E F# G A B C# D');
    expect(transpose(C_MAJOR).down(9).toString())
      .to.equal('Eb F G Ab Bb C D Eb');
    expect(transpose(C_MAJOR).down(8).toString())
      .to.equal('E F# G# A B C# D# E');
    expect(transpose(C_MAJOR).down(7).toString())
      .to.equal('F G A Bb C D E F');
    expect(transpose(C_MAJOR).down(6).toString())
      .to.equal('Gb Ab Bb Cb Db Eb F Gb');
    expect(transpose(C_MAJOR).down(5).toString())
      .to.equal('G A B C D E F# G');
    expect(transpose(C_MAJOR).down(4).toString())
      .to.equal('Ab Bb C Db Eb F G Ab');
    expect(transpose(C_MAJOR).down(3).toString())
      .to.equal('A B C# D E F# G# A');
    expect(transpose(C_MAJOR).down(2).toString())
      .to.equal('Bb C D Eb F G A Bb');
    expect(transpose(C_MAJOR).down(1).toString())
      .to.equal('B C# D# E F# G# A# B');
    expect(transpose(C_MAJOR).down(0).toString())
      .to.equal(C_MAJOR);
  });

  it ("The correct scales should be returned for each major key signature", () => {
    expect(transpose(C_MAJOR).toKey('Db').toString())
      .to.equal('Db Eb F Gb Ab Bb C Db');
    expect(transpose(C_MAJOR).toKey('D').toString())
      .to.equal('D E F# G A B C# D');
    expect(transpose(C_MAJOR).toKey('Eb').toString())
      .to.equal('Eb F G Ab Bb C D Eb');
    expect(transpose(C_MAJOR).toKey('E').toString())
      .to.equal('E F# G# A B C# D# E');
    expect(transpose(C_MAJOR).toKey('F').toString())
      .to.equal('F G A Bb C D E F');
    expect(transpose(C_MAJOR).toKey('Gb').toString())
      .to.equal('Gb Ab Bb Cb Db Eb F Gb');
    expect(transpose(C_MAJOR).toKey('G').toString())
      .to.equal('G A B C D E F# G');
    expect(transpose(C_MAJOR).toKey('Ab').toString())
      .to.equal('Ab Bb C Db Eb F G Ab');
    expect(transpose(C_MAJOR).toKey('A').toString())
      .to.equal('A B C# D E F# G# A');
    expect(transpose(C_MAJOR).toKey('Bb').toString())
      .to.equal('Bb C D Eb F G A Bb');
    expect(transpose(C_MAJOR).toKey('B').toString())
      .to.equal('B C# D# E F# G# A# B');
    expect(transpose(C_MAJOR).toKey('C').toString())
      .to.equal(C_MAJOR);
  });

  it ("The correct scales should be returned for each minor key signature", () => {
    expect(transpose(C_MINOR).toKey('C#m').toString())
      .to.equal('C#m D#dim E F#m G#m A B C#m');
    expect(transpose(C_MINOR).toKey('Dm').toString())
      .to.equal('Dm Edim F Gm Am Bb C Dm');
    expect(transpose(C_MINOR).toKey('Ebm').toString())
      .to.equal('Ebm Fdim Gb Abm Bbm Cb Db Ebm');
    expect(transpose(C_MINOR).toKey('Em').toString())
      .to.equal('Em F#dim G Am Bm C D Em');
    expect(transpose(C_MINOR).toKey('Fm').toString())
      .to.equal('Fm Gdim Ab Bbm Cm Db Eb Fm');
    expect(transpose(C_MINOR).toKey('F#m').toString())
      .to.equal('F#m G#dim A Bm C#m D E F#m');
    expect(transpose(C_MINOR).toKey('Gm').toString())
      .to.equal('Gm Adim Bb Cm Dm Eb F Gm');
    expect(transpose(C_MINOR).toKey('G#m').toString())
      .to.equal('G#m A#dim B C#m D#m E F# G#m');
    expect(transpose(C_MINOR).toKey('Am').toString())
      .to.equal('Am Bdim C Dm Em F G Am');
    expect(transpose(C_MINOR).toKey('Bbm').toString())
      .to.equal('Bbm Cdim Db Ebm Fm Gb Ab Bbm');
    expect(transpose(C_MINOR).toKey('Bm').toString())
      .to.equal('Bm C#dim D Em F#m G A Bm');
    expect(transpose(C_MINOR).toKey('Cm').toString())
      .to.equal(C_MINOR);
  });

  it ("Auto key signature works for minor chords", () => {
      expect(transpose("Cm D Eb Fm G Ab Bb Cm")
          .up(1).toString()).to.equal('C#m D# E F#m G# A B C#m');

      expect(transpose("Cm7 D Eb Fm G Ab Bb Cm")
          .up(1).toString()).to.equal('C#m7 D# E F#m G# A B C#m');

      expect(transpose("Cm7/Bb D Eb Fm G Ab Bb Cm")
          .up(1).toString()).to.equal('C#m7/B D# E F#m G# A B C#m');

      expect(transpose("Cmin D Eb Fm G Ab Bb Cm")
          .up(1).toString()).to.equal('C#min D# E F#m G# A B C#m');

      expect(transpose("Cminor D Eb Fm G Ab Bb Cm")
          .up(1).toString()).to.equal('C#minor D# E F#m G# A B C#m');
  });

  it ("The resulting keys are correct", () => {
    for (let i = 0; i < 12; i++) {
      expect(transpose('C').up(i).currentKey.majorKey)
        .to.equal(KEYS[i]);
    }
    for (let i = 0; i < 12; i++) {
      expect(transpose('C').toKey(KEYS[i]).currentKey.majorKey)
        .to.equal(KEYS[i]);
    }
  });

  it ("Auto key signature works for major chords", () => {
    expect(transpose('C D E F G A B').toKey('Db').toString())
      .to.equal('Db Eb F Gb Ab Bb C');

    expect(transpose('C7 D7 E7 F7 G7 A7 B7').toKey('Db').toString())
      .to.equal('Db7 Eb7 F7 Gb7 Ab7 Bb7 C7');

    expect(transpose('C/G D/G E F G A B').toKey('Db').toString())
      .to.equal('Db/Ab Eb/Ab F Gb Ab Bb C');
  });

  it ("An error should be thrown for invalid key signature", () => {
    expect(() => { return transpose(C_MAJOR).toKey('D#').toString(); })
      .to.throw(Error, 'not a valid key signature');
    expect(() => { return transpose(C_MAJOR).toKey('blah').toString(); })
      .to.throw(Error, 'blah is not a valid key signature.');
  });

  it ("Mixing chords and lyrics", () => {
    expect(transpose('C D C\nHello world!').toKey('F').toString())
      .to.equal('F G F\nHello world!');

    expect(transpose("C D C\nSuddenly\nYou're here").toKey('F').toString())
      .to.equal("F G F\nSuddenly\nYou're here");

    expect(transpose('C D C\nA A home').toKey('F').toString())
      .to.equal('F G F\nD D home');
  });

  it ("Whitespace is preserved", () => {
    expect(transpose('C    D  C\nHello world!').toKey('F').toString())
      .to.equal('F    G  F\nHello world!');

    expect(transpose('    Bb   Bb\n   A  A').up(2).toString())
      .to.equal('    C   C\n   B  B');
  });

  it ("Transposes various types of chords", () => {
    expect(transpose('C Cmaj CM').toKey('F').toString())
        .to.equal('F Fmaj FM');
    expect(transpose('Cm Cmin C-').toKey('F').toString())
        .to.equal('Dm Dmin D-');
    expect(transpose('Cdim').toKey('F').toString())
        .to.equal('Fdim');
    expect(transpose('Caug C+ C+5').toKey('F').toString())
        .to.equal('Faug F+ F+5');
    expect(transpose('Asus4 Asus6').up(2).toString())
        .to.equal('Bsus4 Bsus6');
  });

  it ("Transposes bass chords to the right key", () => {
    expect(transpose('A/D').up(2).toString()).to.equal('B/E');
    expect(transpose('G/F').up(1).toString()).to.equal('Ab/Gb');
    expect(transpose('C/F C7/F Cm/F').toKey('Db').toString())
        .to.equal('Db/Gb Db7/Gb Dbm/Gb');
  });

  it ("Invalid chords are not transposed", () => {
    expect(transpose('I J K\n A').toKey('B').toString())
      .to.equal('I J K\n B');
    expect(transpose('A K C#').toKey('B').toString())
      .to.equal('B K D#');
  });

  it ("Throw an error if no default chord and no chords were given", () => {
    expect(() => transpose('I J K').toKey('C').toString())
      .to.throw(Error, 'Given text has no chords');
  });

  it ("Behaviour is as expected if a wrong key signature is given", () => {
    expect(transpose('A B C').fromKey('D').toKey('E').toString())
      .to.equal('B C# D');

    expect(transpose('A B C').fromKey('B').toKey('Db').toString())
      .to.equal('Cb Db D');
  });

  it ("Handles sequence of chords separated by dash", () => {
    expect(transpose("A-E-F#m-D").up(1).toString())
      .to.equal("Bb-F-Gm-Eb");
  });
});
