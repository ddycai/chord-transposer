var Transposer = require('./index.js');
var chai = require('chai');
var expect = chai.expect;

var keys = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
var cmajor = 'C D E F G A B C';

describe('Transposer', function() {
  it ("The correct scales should be returned for each semitone", function() {
    var text = cmajor;
    expect(Transposer.transpose(text).up(0).text).to.equal(text);
    expect(Transposer.transpose(text).up(1).text).to.equal('Db Eb F Gb Ab Bb C Db');
    expect(Transposer.transpose(text).up(2).text).to.equal('D E F# G A B C# D');
    expect(Transposer.transpose(text).up(3).text).to.equal('Eb F G Ab Bb C D Eb');
    expect(Transposer.transpose(text).up(4).text).to.equal('E F# G# A B C# D# E');
    expect(Transposer.transpose(text).up(5).text).to.equal('F G A Bb C D E F');
    expect(Transposer.transpose(text).up(6).text).to.equal('Gb Ab Bb Cb Db Eb F Gb');
    expect(Transposer.transpose(text).up(7).text).to.equal('G A B C D E F# G');
    expect(Transposer.transpose(text).up(8).text).to.equal('Ab Bb C Db Eb F G Ab');
    expect(Transposer.transpose(text).up(9).text).to.equal('A B C# D E F# G# A');
    expect(Transposer.transpose(text).up(10).text).to.equal('Bb C D Eb F G A Bb');
    expect(Transposer.transpose(text).up(11).text).to.equal('B C# D# E F# G# A# B');
    expect(Transposer.transpose(text).up(12).text).to.equal(text);

    expect(Transposer.transpose(text).down(12).text).to.equal(text);
    expect(Transposer.transpose(text).down(11).text).to.equal('Db Eb F Gb Ab Bb C Db');
    expect(Transposer.transpose(text).down(10).text).to.equal('D E F# G A B C# D');
    expect(Transposer.transpose(text).down(9).text).to.equal('Eb F G Ab Bb C D Eb');
    expect(Transposer.transpose(text).down(8).text).to.equal('E F# G# A B C# D# E');
    expect(Transposer.transpose(text).down(7).text).to.equal('F G A Bb C D E F');
    expect(Transposer.transpose(text).down(6).text).to.equal('Gb Ab Bb Cb Db Eb F Gb');
    expect(Transposer.transpose(text).down(5).text).to.equal('G A B C D E F# G');
    expect(Transposer.transpose(text).down(4).text).to.equal('Ab Bb C Db Eb F G Ab');
    expect(Transposer.transpose(text).down(3).text).to.equal('A B C# D E F# G# A');
    expect(Transposer.transpose(text).down(2).text).to.equal('Bb C D Eb F G A Bb');
    expect(Transposer.transpose(text).down(1).text).to.equal('B C# D# E F# G# A# B');
    expect(Transposer.transpose(text).down(0).text).to.equal(text);
  });

  it ("The correct scales should be returned for each key signature", function() {
    var text = cmajor;
    expect(Transposer.transpose(text).toKey('Db').text).to.equal('Db Eb F Gb Ab Bb C Db');
    expect(Transposer.transpose(text).toKey('D').text).to.equal('D E F# G A B C# D');
    expect(Transposer.transpose(text).toKey('Eb').text).to.equal('Eb F G Ab Bb C D Eb');
    expect(Transposer.transpose(text).toKey('E').text).to.equal('E F# G# A B C# D# E');
    expect(Transposer.transpose(text).toKey('F').text).to.equal('F G A Bb C D E F');
    expect(Transposer.transpose(text).toKey('Gb').text).to.equal('Gb Ab Bb Cb Db Eb F Gb');
    expect(Transposer.transpose(text).toKey('G').text).to.equal('G A B C D E F# G');
    expect(Transposer.transpose(text).toKey('Ab').text).to.equal('Ab Bb C Db Eb F G Ab');
    expect(Transposer.transpose(text).toKey('A').text).to.equal('A B C# D E F# G# A');
    expect(Transposer.transpose(text).toKey('Bb').text).to.equal('Bb C D Eb F G A Bb');
    expect(Transposer.transpose(text).toKey('B').text).to.equal('B C# D# E F# G# A# B');
    expect(Transposer.transpose(text).toKey('C').text).to.equal(text);
  });

  it ("Auto key signature works for minor chords", function() {
      var text = "Cm D Eb Fm G Ab Bb Cm";
      // Should not be Db major.
      expect(Transposer.transpose(text).up(1).text).to.equal('C#m D# E F#m G# A B C#m');
  });

  it ("The reported change in semitones are correct", function() {
    var text = cmajor;
    for (var i = 0; i < 12; i++) {
      expect(Transposer.transpose(text).up(i).change).to.equal(i);
    }
    for (var i = 0; i < 12; i++) {
      expect(Transposer.transpose(text).toKey(keys[i]).change).to.equal(i);
    }
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

  it ("Transposing up an octave is correct", function() {
      expect(Transposer.transpose(cmajor).up(12).change).to.equal(0);
      var result = Transposer.transpose(cmajor).toKey('C');
      expect(result.change).to.equal(0);
      expect(result.key).to.equal('C');
  });


  it ("The correct chords are returned if a key signature is given", function() {
    var text = 'C D E F G A B C';
    expect(Transposer.transpose(text).toKey('Db').text).to.equal('Db Eb F Gb Ab Bb C Db');
  });

  it ("An error should be thrown for invalid key signature", function() {
    var text = 'C D E F G A B C';

    expect(function() { Transposer.transpose(text).toKey('D#').text })
      .to.throw('D# is not a valid key signature.');
    expect(function() { Transposer.transpose(text).toKey('blah').text })
      .to.throw('blah is not a valid key signature');
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
    expect(Transposer.transpose('Asus4').up(2).text).to.equal('Bsus4');
    expect(Transposer.transpose('A7').up(2).text).to.equal('B7');
    expect(Transposer.transpose('Adim').up(2).text).to.equal('Bdim');
    expect(Transposer.transpose('Am').up(2).text).to.equal('Bm');
    expect(Transposer.transpose('Amaj').up(2).text).to.equal('Bmaj');
  });

  it ("Transposes bass chords to the right key", function() {
    expect(Transposer.transpose('A/D').up(2).text).to.equal('B/E');
    expect(Transposer.transpose('G/F').up(1).text).to.equal('Ab/Gb');
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
