import "./App.css";
import {
  ArrowCounterclockwise,
  ChevronDoubleDown,
  ChevronDoubleUp,
  ChevronDown,
  ChevronUp,
  MusicNoteList,
} from "react-bootstrap-icons";
import { ChangeEvent, useRef, useState } from "react";
import { KeySignatures, transpose } from "chord-transposer";

function App() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [chordText, setChordText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [newKey, setNewKey] = useState("");

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (textAreaRef.current) {
      setOriginalText(e.target.value);
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${e.target.scrollHeight + 16}px`;
    }
  };

  const transposeSteps = (semitones: number) => {
    setNewKey("");
    if (chordText) {
      setChordText(transpose(chordText).up(semitones).toString());
    }
  };

  const changeKey = (keySig: string) => {
    setNewKey(keySig);
    if (!!keySig && chordText) {
      setChordText(transpose(chordText).toKey(keySig).toString());
    }
  };

  const resetText = () => {
    setNewKey("");
    setChordText(originalText);
  };

  return (
    <div className="App container">
      <h3 className="mt-2 d-flex align-items-center">
        <span className="pe-2 mb-2">
          <MusicNoteList />
        </span>{" "}
        Chord Transposer
      </h3>
      <div className="row">
        <div className="col">
          <div className="input-group mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              title="Up 2 steps"
              aria-label="Transpose up 2 semitones"
              onClick={() => transposeSteps(2)}
            >
              <ChevronDoubleUp />
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              title="Up 1 step"
              aria-label="Transpose up 1 semitone"
              onClick={() => transposeSteps(1)}
            >
              <ChevronUp />
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              title="Down 1 step"
              aria-label="Transpose down 1 semitone"
              onClick={() => transposeSteps(-1)}
            >
              <ChevronDown />
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              title="Down 2 steps"
              aria-label="Transpose down 2 semitones"
              onClick={() => transposeSteps(-2)}
            >
              <ChevronDoubleDown />
            </button>
            <span className="input-group-text">or</span>
            <select
              className="form-select"
              id="newKey"
              value={newKey}
              onChange={(e) => changeKey(e.target.value)}
              aria-label="Select the new key"
            >
              <option value="" selected={true}>
                select key...
              </option>
              {KeySignatures.values
                .filter((keySig) => !!keySig.relativeMinor)
                .map((keySig) => (
                  <option value={keySig.majorKey}>
                    {keySig.majorKey}
                    {keySig.relativeMinor ? " / " + keySig.relativeMinor : ""}
                  </option>
                ))}
            </select>
            <button
              type="button"
              className="btn btn-outline-secondary"
              title="Reset to original text"
              aria-label="Reset to original text"
              onClick={resetText}
            >
              <ArrowCounterclockwise />
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <i className="bi bi-arrow-up-square-fill"></i>
          <textarea
            ref={textAreaRef}
            className="form-control chord-input"
            rows={1}
            placeholder="Paste chords here..."
            onInput={handleInput}
            value={chordText}
            onChange={(e) => setChordText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
