import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, size }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winnerCoordinate = calculateWinner(squares);
  const winner = winnerCoordinate ? squares[winnerCoordinate[0]] : null;
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
    console.log(squares);
  }
  if (!winner && squares.every((s) => s !== null)) status = "DRAW";

  return (
    <>
      <div className="status">{status}</div>
      {Array.from({ length: size }, (_, row) => (
        <div className="board-row" key={row}>
          {Array.from({ length: size }, (_, col) => (
            <Square
              value={squares[row + col + 2 * row]}
              onSquareClick={() => handleClick(row + col + (size - 1) * row)}
              key={row + col + 2 * row}
              highlight={
                winnerCoordinate &&
                winnerCoordinate.includes(row + col + (size - 1) * row)
              }
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscMove, setIsAscMove] = useState(true);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  function toggleAscMove() {
    setIsAscMove(!isAscMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    let text;
    if (move > 0) {
      let moveIndex;
      for (let i = 0; i < squares.length; i++) {
        if (history[move - 1][i] !== squares[i]) {
          moveIndex = i;
          break;
        }
      }
      console.log("Move " + move + moveIndex);
      const rowNumber = Math.floor(moveIndex / 3) + 1;
      const colNumber = (moveIndex % 3) + 1;
      description = `Go to move # ${move}. Row: ${rowNumber}, Col: ${colNumber}`;
      text =
        "You are at move #" + move + `. Row: ${rowNumber}, Col: ${colNumber}`;
    } else {
      description = "Go to game start";
      text = "You are at game start";
    }

    return (
      <li key={move}>
        {currentMove !== move ? (
          <button onClick={() => jumpTo(move)}>{description}</button>
        ) : (
          <p>{text}</p>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          size={3}
        />
      </div>
      <div className="game-info">
        <button onClick={toggleAscMove}>
          {isAscMove ? "To Descending" : "To Ascending"}
        </button>
        <ul>{isAscMove ? moves : moves.reverse()}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
