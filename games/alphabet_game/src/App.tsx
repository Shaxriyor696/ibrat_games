import React, { useEffect, useMemo, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

const letters = [
  {
      id: 1,
      letter: "A",
      audio: "/audio/letters/a.wav",
      img: "/img/letters/a.jpg",
  },
  {
      id: 2,
      letter: "B",
      audio: "/audio/letters/b.wav",
      img: "/img/letters/b.webp",
  },
  {
      id: 3,
      letter: "C",
      audio: "/audio/letters/c.wav",
      img: "/img/letters/c.webp",
  },
];

const DraggableLetter = ({ letter, id }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "letter",
    item: { id, letter },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        padding: "10px",
        backgroundColor: "#FFDDC1",
        border: "1px solid #FFAB76",
        margin: "10px",
        width: "50px",
        height: "50px",
        fontSize: "30px",
        color: "black",
        borderRadius: "5px",
      }}
    >
      {letter}
    </div>
  );
};

const DropTarget = ({ expectedLetter, onDrop, matchedLetter, onClick }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "letter",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      onClick={() => onClick(expectedLetter)}
      style={{
        height: "200px",
        width: "200px",
        margin: "10px",
        border: `2px dashed ${matchedLetter ? "green" : "#000"}`,
        backgroundColor: isOver ? "#F0F8FF" : "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
        fontSize: "50px",
        cursor: "pointer",
      }}
    >
      <img
        src={expectedLetter.img}
        alt={expectedLetter.letter}
        style={{ width: "150px", height: "150px", objectFit: "contain" }}
      />
      {matchedLetter || "?"}
    </div>
  );
};

const App = () => {
  const [matches, setMatches] = useState({});

  const audios = useMemo(
      () => letters.map((letter) => ([ letter.id, new Audio(letter.audio) ]))
          .reduce((acc, curr) => ({...acc, [curr[0]]: curr[1]}), {}),
      []
  );

  const unmatchedLetters = useMemo(
    () => letters.filter((letter) => !matches[letter.letter]),
    [matches]
  );

  const handleDrop = (item, expectedLetter) => {
    if (item.letter === expectedLetter) {
      setMatches((prev) => ({
        ...prev,
        [expectedLetter]: item.letter,
      }));
      audios[item.id].play();
    }
  };

  const handleLetterClick = (letter) => {
    setMatches((prev) => ({
      ...prev,
      [letter]: null,
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1>Alphabet Drag-and-Drop</h1>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          {unmatchedLetters.map((letter) => (
            <DraggableLetter key={letter.id} id={letter.id} letter={letter.letter} />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {letters.map((letter) => (
            <DropTarget
              key={letter.id}
              expectedLetter={letter}
              matchedLetter={matches[letter.letter]}
              onDrop={(item) => handleDrop(item, letter.letter)}
              onClick={() => handleLetterClick(letter.letter)}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;

