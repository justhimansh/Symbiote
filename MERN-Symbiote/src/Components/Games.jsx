import { div } from "@tensorflow/tfjs";
import ReactDOM from 'react-dom';
import React, { useState, useEffect } from "react";
import Snake from "snake-game-react";

const GuessingGame = () => {
  let min = 1,
    max = 10,
    winningNum = getWinningNUm(min, max),
    guessesLeft = 3;

  // Initialize the message variable with a reference to the message element
  let message;

  useEffect(() => {
    const game = document.querySelector('#game');
    const minNum = document.querySelector('.min-num');
    const maxNum = document.querySelector('.max-num');
    const guessBtn = document.querySelector('#guess-btn');
    const guessInput = document.querySelector('#guess-input');

    // Ensure that message is initialized to a reference of the message element
    message = document.querySelector('.message');

    minNum.textContent = min;
    maxNum.textContent = max;

    const handlePlayAgain = (e) => {
      if (e.target.className === 'play-again') {
        window.location.reload();
      }
    };

    const handleGuessClick = () => {
      console.log(winningNum);

      let guess = parseInt(guessInput.value);
      if (isNaN(guess) || guess < min || guess > max) {
        setMessage(`Please enter a number between ${min} and ${max}`, 'red');
      }

      if (guess === winningNum) {
        guessInput.disabled = true;
        guessInput.style.borderColor = 'green';
        setMessage(`YOU WIN ${winningNum} is correct`, 'green');
        guessBtn.value = 'Play Again';
        guessBtn.className += 'play-again';
      } else {
        guessesLeft -= 1;
        if (guessesLeft === 0) {
          guessInput.disabled = true;
          guessInput.style.borderColor = 'red';
          setMessage(`Game Over! The correct number was ${winningNum}`, 'red');
          guessBtn.value = 'Play Again';
          guessBtn.className += 'play-again';
        } else {
          guessInput.style.borderColor = 'red';
          guessInput.value = '';
          setMessage(`${guess} is not correct. Only ${guessesLeft} guesses left`, 'red');
        }
      }
    };

    game.addEventListener('mousedown', handlePlayAgain);
    guessBtn.addEventListener('click', handleGuessClick);

    return () => {
      game.removeEventListener('mousedown', handlePlayAgain);
      guessBtn.removeEventListener('click', handleGuessClick);
    };

  }, []);

  function getWinningNUm(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function setMessage(msg, color) {
    message.style.color = color;
    message.textContent = msg;
  }}

const Games = () => {
  const initialBoard = Array(9).fill("[]"); // Initialize the board with '[]'
  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);


  const handleSquareClick = (index) => {
    if (calculateWinner(board) || board[index] !== "[]") {
      return;
    }

    const newBoard = board.slice();
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const winner = calculateWinner(newBoard);
    if (winner) {
      alert(`Player ${winner} wins!`);
    }
  };

  const calculateWinner = (squares) => {
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
      if (
        squares[a] !== "[]" &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    return null;
  };

  const renderSquare = (index) => (
    <button className="square" onClick={() => handleSquareClick(index)}>
      {board[index]}
    </button>
  );

  return (
    <div className="Games">
      <div className="Game1" style={{ maxWidth: "300px", margin: "0 auto" }}>
        <h1 className="gametitle">Tic Tac Toe</h1>
        <div
          className="board"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {Array(9)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="row" style={{ display: "flex" }}>
                {renderSquare(index)}
              </div>
            ))}
        </div>
        <div style={{}}>

        <button
  className="playAgain"
  style={{ display: "flex", justifyContent: "center", width: "50%", alignItems: "center", marginLeft: "70px" }}
  onClick={() => window.location.reload()}
>
  Play Again / Reset
</button>
        </div>
      </div>
      <div className="Game2">
        <h1 className="gametitle">Snake Game</h1>
        <Snake color1="#248ec2" color2="#1d355e" backgroundColor="#ebebeb" />
      </div>
      <div className="Game3">
      <h1 className="gametitle">Number Guesser</h1>
      <GuessingGame/>
        <div id="game">
            <p className="winningNumber">Guess a number between <span class="min-num"></span> AND <span class="max-num"></span></p>
            <input type="number" id="guess-input" placeholder="Enter your guess"></input>
            <input type="submit" value="submit" id="guess-btn"></input>
            <p class="message"></p>
        </div>
      </div>
    </div>
  );
};

export default Games;
