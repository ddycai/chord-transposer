import "jasmine";
import { transpose } from "../src/index";

const KEYS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const C_MAJOR = "C  D  E  F  G  A  B  C";
const C_MINOR = "Cm  Ddim  Eb Fm  Gm  Ab Bb Cm";

describe("Transposer", () => {
  it("transposes scales by # semitones", () => {
    expect(transpose(C_MAJOR).up(0).toString()).toEqual(C_MAJOR);
    expect(transpose(C_MAJOR).up(1).toString()).toEqual(
      "Db Eb F  Gb Ab Bb C  Db"
    );
    expect(transpose(C_MAJOR).up(2).toString()).toEqual(
      "D  E  F# G  A  B  C# D"
    );
    expect(transpose(C_MAJOR).up(3).toString()).toEqual(
      "Eb F  G  Ab Bb C  D  Eb"
    );
    expect(transpose(C_MAJOR).up(4).toString()).toEqual(
      "E  F# G# A  B  C# D# E"
    );
    expect(transpose(C_MAJOR).up(5).toString()).toEqual(
      "F  G  A  Bb C  D  E  F"
    );
    expect(transpose(C_MAJOR).up(6).toString()).toEqual(
      "Gb Ab Bb Cb Db Eb F  Gb"
    );
    expect(transpose(C_MAJOR).up(7).toString()).toEqual(
      "G  A  B  C  D  E  F# G"
    );
    expect(transpose(C_MAJOR).up(8).toString()).toEqual(
      "Ab Bb C  Db Eb F  G  Ab"
    );
    expect(transpose(C_MAJOR).up(9).toString()).toEqual(
      "A  B  C# D  E  F# G# A"
    );
    expect(transpose(C_MAJOR).up(10).toString()).toEqual(
      "Bb C  D  Eb F  G  A  Bb"
    );
    expect(transpose(C_MAJOR).up(11).toString()).toEqual(
      "B  C# D# E  F# G# A# B"
    );
    expect(transpose(C_MAJOR).up(12).toString()).toEqual(C_MAJOR);

    expect(transpose(C_MAJOR).down(12).toString()).toEqual(C_MAJOR);
    expect(transpose(C_MAJOR).down(11).toString()).toEqual(
      "Db Eb F  Gb Ab Bb C  Db"
    );
    expect(transpose(C_MAJOR).down(10).toString()).toEqual(
      "D  E  F# G  A  B  C# D"
    );
    expect(transpose(C_MAJOR).down(9).toString()).toEqual(
      "Eb F  G  Ab Bb C  D  Eb"
    );
    expect(transpose(C_MAJOR).down(8).toString()).toEqual(
      "E  F# G# A  B  C# D# E"
    );
    expect(transpose(C_MAJOR).down(7).toString()).toEqual(
      "F  G  A  Bb C  D  E  F"
    );
    expect(transpose(C_MAJOR).down(6).toString()).toEqual(
      "Gb Ab Bb Cb Db Eb F  Gb"
    );
    expect(transpose(C_MAJOR).down(5).toString()).toEqual(
      "G  A  B  C  D  E  F# G"
    );
    expect(transpose(C_MAJOR).down(4).toString()).toEqual(
      "Ab Bb C  Db Eb F  G  Ab"
    );
    expect(transpose(C_MAJOR).down(3).toString()).toEqual(
      "A  B  C# D  E  F# G# A"
    );
    expect(transpose(C_MAJOR).down(2).toString()).toEqual(
      "Bb C  D  Eb F  G  A  Bb"
    );
    expect(transpose(C_MAJOR).down(1).toString()).toEqual(
      "B  C# D# E  F# G# A# B"
    );
    expect(transpose(C_MAJOR).down(0).toString()).toEqual(C_MAJOR);
  });

  it("transposes scales to specific major keys", () => {
    expect(transpose(C_MAJOR).toKey("Db").toString()).toEqual(
      "Db Eb F  Gb Ab Bb C  Db"
    );
    expect(transpose(C_MAJOR).toKey("D").toString()).toEqual(
      "D  E  F# G  A  B  C# D"
    );
    expect(transpose(C_MAJOR).toKey("Eb").toString()).toEqual(
      "Eb F  G  Ab Bb C  D  Eb"
    );
    expect(transpose(C_MAJOR).toKey("E").toString()).toEqual(
      "E  F# G# A  B  C# D# E"
    );
    expect(transpose(C_MAJOR).toKey("F").toString()).toEqual(
      "F  G  A  Bb C  D  E  F"
    );
    expect(transpose(C_MAJOR).toKey("Gb").toString()).toEqual(
      "Gb Ab Bb Cb Db Eb F  Gb"
    );
    expect(transpose(C_MAJOR).toKey("G").toString()).toEqual(
      "G  A  B  C  D  E  F# G"
    );
    expect(transpose(C_MAJOR).toKey("F#").toString()).toEqual(
      "F# G# A# B  C# D# E# F#"
    );
    expect(transpose(C_MAJOR).toKey("Ab").toString()).toEqual(
      "Ab Bb C  Db Eb F  G  Ab"
    );
    expect(transpose(C_MAJOR).toKey("A").toString()).toEqual(
      "A  B  C# D  E  F# G# A"
    );
    expect(transpose(C_MAJOR).toKey("Bb").toString()).toEqual(
      "Bb C  D  Eb F  G  A  Bb"
    );
    expect(transpose(C_MAJOR).toKey("B").toString()).toEqual(
      "B  C# D# E  F# G# A# B"
    );
    expect(transpose(C_MAJOR).toKey("C").toString()).toEqual(C_MAJOR);
    expect(transpose(C_MAJOR).toKey("C#").toString()).toEqual(
      "C# D# E# F# G# A# B# C#"
    );
    expect(transpose(C_MAJOR).toKey("D#").toString()).toEqual(
      "D# F  G  G# A# C  D  D#"
    );

    expect(transpose(C_MAJOR).toKey("G#").toString()).toEqual(
      "G# A# C  C# D# F  G  G#"
    );
  });

  it("transposes scales to specific minor keys", () => {
    expect(transpose(C_MINOR).toKey("C#m").toString()).toEqual(
      "C#m D#dim E  F#m G#m A  B  C#m"
    );
    expect(transpose(C_MINOR).toKey("Dm").toString()).toEqual(
      "Dm  Edim  F  Gm  Am  Bb C  Dm"
    );
    expect(transpose(C_MINOR).toKey("Ebm").toString()).toEqual(
      "Ebm Fdim  Gb Abm Bbm Cb Db Ebm"
    );
    expect(transpose(C_MINOR).toKey("Em").toString()).toEqual(
      "Em  F#dim G  Am  Bm  C  D  Em"
    );
    expect(transpose(C_MINOR).toKey("Fm").toString()).toEqual(
      "Fm  Gdim  Ab Bbm Cm  Db Eb Fm"
    );
    expect(transpose(C_MINOR).toKey("F#m").toString()).toEqual(
      "F#m G#dim A  Bm  C#m D  E  F#m"
    );
    expect(transpose(C_MINOR).toKey("Gm").toString()).toEqual(
      "Gm  Adim  Bb Cm  Dm  Eb F  Gm"
    );
    expect(transpose(C_MINOR).toKey("G#m").toString()).toEqual(
      "G#m A#dim B  C#m D#m E  F# G#m"
    );
    expect(transpose(C_MINOR).toKey("Am").toString()).toEqual(
      "Am  Bdim  C  Dm  Em  F  G  Am"
    );
    expect(transpose(C_MINOR).toKey("Bbm").toString()).toEqual(
      "Bbm Cdim  Db Ebm Fm  Gb Ab Bbm"
    );
    expect(transpose(C_MINOR).toKey("Bm").toString()).toEqual(
      "Bm  C#dim D  Em  F#m G  A  Bm"
    );
    expect(transpose(C_MINOR).toKey("Cm").toString()).toEqual(C_MINOR);
  });

  it("detects key signature automatically for minor chords", () => {
    expect(transpose("Cm  D  Eb Fm  G  Ab Bb Cm").up(1).toString()).toEqual(
      "C#m D# E  F#m G# A  B  C#m"
    );

    expect(transpose("Cm7  D  Eb Fm  G  Ab Bb Cm").up(1).toString()).toEqual(
      "C#m7 D# E  F#m G# A  B  C#m"
    );

    expect(transpose("Cm7/Bb D  Eb Fm  G  Ab Bb Cm").up(1).toString()).toEqual(
      "C#m7/B D# E  F#m G# A  B  C#m"
    );

    expect(transpose("Cmin  D  Eb Fm  G  Ab Bb Cm").up(1).toString()).toEqual(
      "C#min D# E  F#m G# A  B  C#m"
    );

    expect(transpose("Cminor  D  Eb Fm  G  Ab Bb Cm").up(1).toString()).toEqual(
      "C#minor D# E  F#m G# A  B  C#m"
    );
  });

  it("transposes single notes", () => {
    for (let i = 0; i < 12; i++) {
      expect(transpose("C").up(i).getKey().majorKey).toEqual(KEYS[i]);
    }
    for (let i = 0; i < 12; i++) {
      expect(transpose("C").toKey(KEYS[i]).getKey().majorKey).toEqual(KEYS[i]);
    }
  });

  it("detects key signature automatically for major chords", () => {
    expect(transpose("C  D  E  F  G  A  B").toKey("Db").toString()).toEqual(
      "Db Eb F  Gb Ab Bb C"
    );

    expect(
      transpose("C7  D7  E7 F7  G7  A7  B7").toKey("Db").toString()
    ).toEqual("Db7 Eb7 F7 Gb7 Ab7 Bb7 C7");

    expect(
      transpose("C/G   D/G   E F  G  A  B").toKey("Db").toString()
    ).toEqual("Db/Ab Eb/Ab F Gb Ab Bb C");
  });

  it("throws error for invalid key signature", () => {
    expect(() => {
      return transpose(C_MAJOR).toKey("blah").toString();
    }).toThrowError("blah is not a valid key signature.");
  });

  it("transposes arbitrary chords which don't match a key signature", () => {
    expect(transpose("A#").down(1).toString()).toEqual("A");
    expect(transpose("B#").down(1).toString()).toEqual("B");
    expect(transpose("Cb").up(1).toString()).toEqual("C");
    expect(transpose("E#").down(1).toString()).toEqual("E");
    expect(transpose("Fb").up(1).toString()).toEqual("F");
  });

  it("transposes mixed chords and lyrics", () => {
    expect(transpose("C D C\nHello world!").toKey("F").toString()).toEqual(
      "F G F\nHello world!"
    );

    expect(
      transpose("C D C\nSuddenly\nYou're here").toKey("F").toString()
    ).toEqual("F G F\nSuddenly\nYou're here");

    expect(transpose("C D C\nA A home").toKey("F").toString()).toEqual(
      "F G F\nD D home"
    );
  });

  it("transposes chords inlined in square brackets (ChordPro)", () => {
    expect(transpose("[C]Hello [D] world! [C]").toKey("F").toString()).toEqual(
      "[F]Hello [G] world! [F]"
    );
  });

  it("preserves whitespace", () => {
    expect(transpose("C    D  C\nHello world!").toKey("F").toString()).toEqual(
      "F    G  F\nHello world!"
    );

    expect(transpose("    Bb   Bb\n   A  A").up(2).toString()).toEqual(
      "    C    C\n   B  B"
    );
  });

  it("preserves chord alignment", () => {
    expect(transpose("C    Am  Em").toKey("Db").toString()).toEqual(
      "Db   Bbm Fm"
    );
  });

  it("leaves at least one space between chords", () => {
    expect(transpose("C Am  Em").toKey("Db").toString()).toEqual("Db Bbm Fm");
  });

  it("tranposes major and minor chords", () => {
    expect(transpose("C Cmaj Cmaj7 CM").toKey("F").toString()).toEqual(
      "F Fmaj Fmaj7 FM"
    );
    expect(transpose("Cm Cmin Cmin7").toKey("F").toString()).toEqual(
      "Dm Dmin Dmin7"
    );
  });

  it("tranposes augmented and diminished chords", () => {
    expect(transpose("Caug C+ C+5").toKey("F").toString()).toEqual(
      "Faug F+ F+5"
    );
    expect(transpose("Cdim C-").toKey("F").toString()).toEqual("Fdim F-");
  });

  it("tranposes sus chords", () => {
    expect(transpose("Asus4 Asus2").up(2).toString()).toEqual("Bsus4 Bsus2");
  });

  it("transposes chords with added tones", () => {
    expect(transpose("Cadd9 C9 C6 C+9 Cadd13 C+13").toKey("F").toString()).toEqual(
      "Fadd9 F9 F6 F+9 Fadd13 F+13"
    );
    expect(
      transpose("C7/9 Cm7/5- C7/9/11+ C7+/9 C7.11+").toKey("F").toString()
    ).toEqual("F7/9 Fm7/5- F7/9/11+ F7+/9 F7.11+");
  });

  it("transposes chords with flat and sharp added tones", () => {
    expect(
      transpose("C7b9 C7b13 C7(b9) E7#9 E7#11").toKey("F").toString()
    ).toEqual("F7b9 F7b13 F7(b9) A7#9 A7#11");
  });

  it("transposes chords with added tones in parentheses", () => {
    expect(
      transpose("C7(b9) C7(add13) C7(b5) C7(#9) C7b9(#11)")
        .toKey("Db")
        .toString()
    ).toEqual("Db7(b9) Db7(add13) Db7(b5) Db7(#9) Db7b9(#11)");
  });

  it("transposes bass chords to the right key", () => {
    expect(transpose("A/D").up(2).toString()).toEqual("B/E");
    expect(transpose("G/F").up(1).toString()).toEqual("Ab/Gb");
    expect(transpose("C/F   C7/F   Cm/F").toKey("Db").toString()).toEqual(
      "Db/Gb Db7/Gb Dbm/Gb"
    );
  });

  it("does not transpose invalid chords", () => {
    expect(transpose("I J K\n A").toKey("B").toString()).toEqual("I J K\n B");
    expect(transpose("A K C#").toKey("B").toString()).toEqual("B K D#");
  });

  it("throws an error if no default chord and no chords were given", () => {
    expect(() => transpose("I J K").toKey("C").toString()).toThrowError(
      "Given text has no chords"
    );
  });

  it("behaves as expected if a wrong key signature is given", () => {
    expect(transpose("A B  C").fromKey("D").toKey("E").toString()).toEqual(
      "B C# D"
    );

    expect(transpose("A  B  C").fromKey("B").toKey("Db").toString()).toEqual(
      "Cb Db D"
    );
  });

  it("handles sequence of chords separated by dash", () => {
    expect(transpose("A-E-B-D").up(1).toString()).toEqual("Bb-F-C-Eb");
  });

  it("should not try to guess the key if an explicit key is provided", () => {
    expect(transpose("G#").fromKey("C#m").toKey("Cm").toString()).toEqual("G");
  });

  it("should not try to guess the key if an ", () => {
    expect(transpose("G#").fromKey("C#m").toKey("Cm").toString()).toEqual("G");
  });
});
