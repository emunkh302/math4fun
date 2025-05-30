import React, { useState, useEffect, useRef } from "react";
import Table from "../table/Table";
import CurrentScore from "../current-score/CurrentScore";
import GameTimer from "../game-timer/GameTimer";
import GameLevel from "../game-level/GameLevel";
import Operation from "../operation/Operation";
import generateRandomNumbers from "../../function/smartFunction";
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS



export default function Game({level, type}) {
  const [inputValue, setInputValue] = useState("");
  const [activeAnswerIndex, setActiveAnswerIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false); 
  const [randomNums, setRandomNums] = useState([]);
  const [operation, setOperation] = useState('add');

  const handleOperationSelect = (selectedOperation) => {
    setOperation(selectedOperation);
    // Additional logic to start game based on selected operation
  };

  const inputRef = useRef(null);

  const location = useLocation();
  const { title } = location.state || { title: 'Default Title' };

  useEffect(() => {
    if (activeAnswerIndex === 0) {
      inputRef.current.focus();
    }
  }, [activeAnswerIndex]);

  useEffect(() => {
    let interval;
  
    if (gameStarted && timer > 0 && score < randomNums.length) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000); // Decrease the timer by 1 second every second
    } else if (timer === 0 || score === randomNums.length) {
      // Handle game over or timer completion here
      clearInterval(interval);
      setGameStarted(false);
    }
  
    return () => {
      clearInterval(interval); // Clean up the interval when the component unmounts
    };
  }, [gameStarted, timer, score, randomNums.length]);
  

  useEffect(() => {
    if (activeAnswerIndex >= 0 && activeAnswerIndex < randomNums.length) {
      const activeAnswer = randomNums[activeAnswerIndex];
      if (parseInt(inputValue) === activeAnswer.answer) {
        const updatedCorrectAnswers = [...correctAnswers];
        updatedCorrectAnswers[activeAnswerIndex] = true;
        setCorrectAnswers(updatedCorrectAnswers);
        setActiveAnswerIndex((prevIndex) =>
          prevIndex < randomNums.length - 1 ? prevIndex + 1 : prevIndex
        );
        setInputValue("");
        setScore((prevScore) => prevScore + 1);
      }
    }
  }, [inputValue, randomNums, activeAnswerIndex, correctAnswers]);

  const resetGame = () => {
    setRandomNums([]);
    setInputValue("");
    setActiveAnswerIndex(0);
    setCorrectAnswers([]);
    setScore(0);
    setTimer(30);
    setGameStarted(false);
  };
  
  const startNewGame = () => {
    // Call the resetGame function to ensure a complete game reset
    resetGame();
  
    // Generate new random numbers and start the game
    const newRandomNums = generateRandomNumbers(type, level, score);
    setRandomNums(newRandomNums);
    setGameStarted(true);
  };
  
  

  const handleStartGame = () => {
    startNewGame();
  };
  
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-auto">
          <GameTimer timer={timer} disabled={score === randomNums.length} />
        </div>
        <div className="col-auto">
          <CurrentScore score={score} />
        </div>
      </div>
      {title}: <Operation title={title} onSelect={handleOperationSelect} />
      <div className="row justify-content-center mt-3">
        <div className="col-auto">
          <input
            className="form-control"
            type="number"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Enter a number"
            ref={inputRef}
            disabled={timer === 0 || score === randomNums.length}
          />
        </div>
      </div>

      <div className="row justify-content-center mt-3">
        <div className="col-auto">
          {gameStarted ? (
            <>
              <button className="btn btn-danger" onClick={handleStartGame}>Reset Game</button>
              <Table
                randomNums={randomNums}
                correctAnswers={correctAnswers}
                activeAnswerIndex={activeAnswerIndex}
              />
              <GameLevel />
            </>
          ) : <button className="btn btn-primary" onClick={handleStartGame}>START GAME</button>}
        </div>
      </div>
    </div>
  );
}
