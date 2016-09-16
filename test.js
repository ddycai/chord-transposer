var Transposer = require('./index.js');
var chai = require('chai');
var expect = chai.expect;

var keys = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
var cmajor = 'C D E F G A B C';
var cminor = 'Cm Ddim Eb Fm Gm Ab Bb Cm';

describe('Transposer', function() {
  it ("The correct scales should be returned for each semitone", function() {
    var text = cmajor;
    expect(Transposer.transpose(text).up(0).text)
      .to.equal(text);
    expect(Transposer.transpose(text).up(1).text)
      .to.equal('Db Eb F Gb Ab Bb C Db');
    expect(Transposer.transpose(text).up(2).text)
      .to.equal('D E F# G A B C# D');
    expect(Transposer.transpose(text).up(3).text)
      .to.equal('Eb F G Ab Bb C D Eb');
    expect(Transposer.transpose(text).up(4).text)
      .to.equal('E F# G# A B C# D# E');
    expect(Transposer.transpose(text).up(5).text)
      .to.equal('F G A Bb C D E F');
    expect(Transposer.transpose(text).up(6).text)
      .to.equal('Gb Ab Bb Cb Db Eb F Gb');
    expect(Transposer.transpose(text).up(7).text)
      .to.equal('G A B C D E F# G');
    expect(Transposer.transpose(text).up(8).text)
      .to.equal('Ab Bb C Db Eb F G Ab');
    expect(Transposer.transpose(text).up(9).text)
      .to.equal('A B C# D E F# G# A');
    expect(Transposer.transpose(text).up(10).text)
      .to.equal('Bb C D Eb F G A Bb');
    expect(Transposer.transpose(text).up(11).text)
      .to.equal('B C# D# E F# G# A# B');
    expect(Transposer.transpose(text).up(12).text)
      .to.equal(text);

    expect(Transposer.transpose(text).down(12).text)
      .to.equal(text);
    expect(Transposer.transpose(text).down(11).text)
      .to.equal('Db Eb F Gb Ab Bb C Db');
    expect(Transposer.transpose(text).down(10).text)
      .to.equal('D E F# G A B C# D');
    expect(Transposer.transpose(text).down(9).text)
      .to.equal('Eb F G Ab Bb C D Eb');
    expect(Transposer.transpose(text).down(8).text)
      .to.equal('E F# G# A B C# D# E');
    expect(Transposer.transpose(text).down(7).text)
      .to.equal('F G A Bb C D E F');
    expect(Transposer.transpose(text).down(6).text)
      .to.equal('Gb Ab Bb Cb Db Eb F Gb');
    expect(Transposer.transpose(text).down(5).text)
      .to.equal('G A B C D E F# G');
    expect(Transposer.transpose(text).down(4).text)
      .to.equal('Ab Bb C Db Eb F G Ab');
    expect(Transposer.transpose(text).down(3).text)
      .to.equal('A B C# D E F# G# A');
    expect(Transposer.transpose(text).down(2).text)
      .to.equal('Bb C D Eb F G A Bb');
    expect(Transposer.transpose(text).down(1).text)
      .to.equal('B C# D# E F# G# A# B');
    expect(Transposer.transpose(text).down(0).text)
      .to.equal(text);
  });

  it ("The correct scales should be returned for each major key signature", function() {
    var text = cmajor;
    expect(Transposer.transpose(text).toKey('Db').text)
      .to.equal('Db Eb F Gb Ab Bb C Db');
    expect(Transposer.transpose(text).toKey('D').text)
      .to.equal('D E F# G A B C# D');
    expect(Transposer.transpose(text).toKey('Eb').text)
      .to.equal('Eb F G Ab Bb C D Eb');
    expect(Transposer.transpose(text).toKey('E').text)
      .to.equal('E F# G# A B C# D# E');
    expect(Transposer.transpose(text).toKey('F').text)
      .to.equal('F G A Bb C D E F');
    expect(Transposer.transpose(text).toKey('Gb').text)
      .to.equal('Gb Ab Bb Cb Db Eb F Gb');
    expect(Transposer.transpose(text).toKey('G').text)
      .to.equal('G A B C D E F# G');
    expect(Transposer.transpose(text).toKey('Ab').text)
      .to.equal('Ab Bb C Db Eb F G Ab');
    expect(Transposer.transpose(text).toKey('A').text)
      .to.equal('A B C# D E F# G# A');
    expect(Transposer.transpose(text).toKey('Bb').text)
      .to.equal('Bb C D Eb F G A Bb');
    expect(Transposer.transpose(text).toKey('B').text)
      .to.equal('B C# D# E F# G# A# B');
    expect(Transposer.transpose(text).toKey('C').text)
      .to.equal(text);
  });

  it ("The correct scales should be returned for each minor key signature", function() {
    expect(Transposer.transpose(cminor).toKey('C#m').text)
      .to.equal('C#m D#dim E F#m G#m A B C#m');
    expect(Transposer.transpose(cminor).toKey('Dm').text)
      .to.equal('Dm Edim F Gm Am Bb C Dm');
    expect(Transposer.transpose(cminor).toKey('Ebm').text)
      .to.equal('Ebm Fdim Gb Abm Bbm Cb Db Ebm');
    expect(Transposer.transpose(cminor).toKey('Em').text)
      .to.equal('Em F#dim G Am Bm C D Em');
    expect(Transposer.transpose(cminor).toKey('Fm').text)
      .to.equal('Fm Gdim Ab Bbm Cm Db Eb Fm');
    expect(Transposer.transpose(cminor).toKey('F#m').text)
      .to.equal('F#m G#dim A Bm C#m D E F#m');
    expect(Transposer.transpose(cminor).toKey('Gm').text)
      .to.equal('Gm Adim Bb Cm Dm Eb F Gm');
    expect(Transposer.transpose(cminor).toKey('G#m').text)
      .to.equal('G#m A#dim B C#m D#m E F# G#m');
    expect(Transposer.transpose(cminor).toKey('Am').text)
      .to.equal('Am Bdim C Dm Em F G Am');
    expect(Transposer.transpose(cminor).toKey('Bbm').text)
      .to.equal('Bbm Cdim Db Ebm Fm Gb Ab Bbm');
    expect(Transposer.transpose(cminor).toKey('Bm').text)
      .to.equal('Bm C#dim D Em F#m G A Bm');
    expect(Transposer.transpose(cminor).toKey('Cm').text)
      .to.equal(cminor);
  });

  it ("Auto key signature works for minor chords", function() {
      // Should not be Db major.
      expect(Transposer.transpose("Cm D Eb Fm G Ab Bb Cm")
          .up(1).text).to.equal('C#m D# E F#m G# A B C#m');

      expect(Transposer.transpose("Cm7 D Eb Fm G Ab Bb Cm")
          .up(1).text).to.equal('C#m7 D# E F#m G# A B C#m');

      expect(Transposer.transpose("Cm7/Bb D Eb Fm G Ab Bb Cm")
          .up(1).text).to.equal('C#m7/B D# E F#m G# A B C#m');

      expect(Transposer.transpose("Cmin D Eb Fm G Ab Bb Cm")
          .up(1).text).to.equal('C#min D# E F#m G# A B C#m');

      expect(Transposer.transpose("Cminor D Eb Fm G Ab Bb Cm")
          .up(1).text).to.equal('C#minor D# E F#m G# A B C#m');
  });

  it ("The resulting keys are correct", function() {
    var text = cmajor;
    for (var i = 0; i < 12; i++) {
      expect(Transposer.transpose(text).up(i).key).to.equal(keys[i]);
    }
    for (var i = 0; i < 12; i++) {
      expect(Transposer.transpose(text).toKey(keys[i]).key).to.equal(keys[i]);
    }
  });

  it ("The correct chords are returned if a key signature is given", function() {
    var text = 'C D E F G A B C';
    expect(Transposer.transpose(text).toKey('Db').text).to.equal('Db Eb F Gb Ab Bb C Db');
  });

  it ("An error should be thrown for invalid key signature", function() {
    var text = 'C D E F G A B C';

    expect(function() { Transposer.transpose(text).toKey('D#').text })
      .to.throw(new Transposer.InvalidKeySignatureException('D#'));
    expect(function() { Transposer.transpose(text).toKey('blah').text })
      .to.throw(new Transposer.InvalidKeySignatureException('blah'));
  });

  it ("Mixing chords and lyrics", function() {
    var text1 = 'C D C\nHello world!';
    expect(Transposer.transpose(text1).toKey('F').text).to.equal('F G F\nHello world!');

    var text2 = "C D C\nSuddenly\nYou're here";
    expect(Transposer.transpose(text2).toKey('F').text).to.equal("F G F\nSuddenly\nYou're here");

    var text3 = 'C D C\nA A home';
    expect(Transposer.transpose(text3).toKey('F').text).to.equal('F G F\nD D home');
  });

  it ("Whitespace is preserved", function() {
    var text1 = 'C    D  C\nHello world!';
    expect(Transposer.transpose(text1).toKey('F').text).to.equal('F    G  F\nHello world!');

    var text2 = '    Bb   Bb\n   A  A';
    expect(Transposer.transpose(text2).up(2).text).to.equal('    C   C\n   B  B');
  });

  it ("Transposes various types of chords", function() {
    expect(Transposer.transpose('C Cmaj CM').toKey('F').text)
        .to.equal('F Fmaj FM');
    expect(Transposer.transpose('Cm Cmin C-').toKey('F').text)
        .to.equal('Dm Dmin D-');
    expect(Transposer.transpose('Cdim').toKey('F').text)
        .to.equal('Fdim');
    expect(Transposer.transpose('Caug C+ C+5').toKey('F').text)
        .to.equal('Faug F+ F+5');
    expect(Transposer.transpose('Asus4 Asus6').up(2).text)
        .to.equal('Bsus4 Bsus6');
  });

  it ("Transposes bass chords to the right key", function() {
    expect(Transposer.transpose('A/D').up(2).text).to.equal('B/E');
    expect(Transposer.transpose('G/F').up(1).text).to.equal('Ab/Gb');
    expect(Transposer.transpose('C/F C7/F Cm/F').toKey('Db').text)
        .to.equal('Db/Gb Db7/Gb Dbm/Gb');
  });

  it ("Invalid chords are not transposed", function() {
    expect(Transposer.transpose('I J K').fromKey('A').toKey('B').text).to.equal('I J K');
    expect(Transposer.transpose('A K C#').fromKey('A').toKey('B').text).to.equal('B K D#');
  });

  it ("Throw an error if no default chord and no chords were given", function() {
    expect(function() { Transposer.transpose('I J K').toKey('C').text })
      .to.throw('No valid chords were found for default key signature.');
  });

  it ("Behaviour is as expected if a wrong key signature is given", function() {
    expect(Transposer.transpose('A B C').fromKey('D').toKey('E').text).to.equal('B C# D');
    expect(Transposer.transpose('A B C').fromKey('B').toKey('Db').text).to.equal('Cb Db D');
  });

  it ("Test simple formatter", function() {
    expect(Transposer.transpose('A B C').withFormatter(
        function(sym, id) {
          return '<b>' + sym + '</b>';
        })
      .toKey('Bb').text).to.equal('<b>Bb</b> <b>C</b> <b>Db</b>');
  });


  it ("Test simple formatter with id", function() {
    // Only bold the first chord.
    expect(Transposer.transpose('A B A').withFormatter(
        function(sym, id) {
          if (id == 0) {
            return '<b>' + sym + '</b>';
          } else {
            return sym;
          }
        })
      .toKey('Bb').text).to.equal('<b>Bb</b> C <b>Bb</b>');
  });
});
