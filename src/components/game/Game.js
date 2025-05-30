import React, { useState, useEffect, useRef, useContext } from "react";
import { StatisticContext } from "../../contexts/statistic-context/StatisticContext";

import Table from "../table/Table";
import CurrentScore from "../current-score/CurrentScore";
import GameTimer from "../game-timer/GameTimer";
import Operation from "../operation/Operation";
import generateRandomNumbers from "../../function/smartFunction";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import InfoNav from "../info-nav/InfoNav";
import Level from "../levels/Level";
import Warning from "../badges/warnings/Warning";
import NavUser from "../nav-user/NavUser";
import State from "../states/State";

export default function Game() {
  const [inputValue, setInputValue] = useState("");
  const [activeAnswerIndex, setActiveAnswerIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(600);
  const [gameStarted, setGameStarted] = useState(false);
  const [randomNums, setRandomNums] = useState([]);
  const [type, setType] = useState("add");
  const [correctlyAnswered, setCorrectlyAnswered] = useState(new Set());
  const [isOperationSelected, setIsOperationSelected] = useState(false);
  const [isInputFixed, setIsInputFixed] = useState(false);
  const [level, setLevel] = useState(1);
  const { saveState } = useContext(StatisticContext);
  const [message, setMessage] = useState("");

  const inputRef = useRef(null);
  const activeCellRef = useRef(null);
  const location = useLocation();
  const { title } = location.state || { title: "Random" };

  const saveGameInfo = () => {
    if (localStorage.getItem("userId")) {
      saveState({
        grade: title,
        level,
        rate: (score / (randomNums.length || 1)) * 100,
        time: timer,
        date: new Date().toLocaleDateString(),
        localTime: new Date().toLocaleTimeString(),
        userId: localStorage.getItem("userId"),
        type,
      },localStorage.getItem("token"))
        .then(() => {
          setMessage("Record saved successfully!");
        })
        .catch((error) => {
          setMessage(`Error saving record: ${error.message}`);
        });
    }
  };

  const getLevel = (title) => {
    const levelMap = {
      "Pre-K": "pre-k",
      Kindergarten: "kinder",
      "First Grade": "first",
      "Second Grade": "second",
      "Third Grade": "third",
      "Fourth Grade": "fourth",
    };
    return levelMap[title.split(" ")[0] + " " + title.split(" ")[1]] || "pre-k";
  };

  useEffect(() => {
    if (activeCellRef.current) {
      const { top, bottom } = activeCellRef.current.getBoundingClientRect();
      const isInView = top >= 0 && bottom <= window.innerHeight;

      if (!isInView) {
        activeCellRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [activeAnswerIndex]);

  const grade = getLevel(title);

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      const shouldFixInput = window.scrollY > 100;
      setIsInputFixed(shouldFixInput);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (activeAnswerIndex === 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeAnswerIndex]);

  // timer
  useEffect(() => {
    if (!gameStarted || timer === 0 || score === randomNums.length) {
      return;
    }
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [gameStarted, timer, score, randomNums.length]);

  useEffect(() => {
    if (gameStarted && score === randomNums.length && timer > 0) {
      const newLevel = level < 6 ? level + 1 : 1;
      saveGameInfo();
      setLevel(newLevel);
      resetGameWithNewLevel(newLevel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, randomNums.length, timer, gameStarted]);

  const resetGameWithNewLevel = (newLevel) => {
    setGameStarted(false);
    setRandomNums(generateRandomNumbers(type, grade, newLevel));
    resetGameStates();
  };

  const resetGameStates = () => {
    setScore(0);
    setTimer(600);
    setActiveAnswerIndex(0);
    setCorrectlyAnswered(new Set());
  };

  const handleInput = (event) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);
    const currentProblem = randomNums[activeAnswerIndex];
    if (currentProblem && parseInt(newInputValue) === currentProblem.answer) {
      setCorrectlyAnswered((prev) => new Set(prev).add(activeAnswerIndex));
      setActiveAnswerIndex((prevIndex) => prevIndex + 1);
      setInputValue("");
      setScore((prevScore) => prevScore + 1);
      setMessage("Correct! 🎉");
    } else {
      setMessage("Wrong! ❌");
    }
  };

  const resetGame = () => {
    saveGameInfo();
    setInputValue("");
    setActiveAnswerIndex(0);
    setScore(0);
    setTimer(300);
    setGameStarted(false);
    setIsOperationSelected(false);
    setRandomNums([]);
    setCorrectlyAnswered(new Set());
    setType("add");
  };

  const handleOperationSelect = (selectedOperation) => {
    const operationMapping = {
      "+": "add",
      "-": "sub",
      "*": "mul",
      "/": "div",
    };
    const operationType = operationMapping[selectedOperation] || "add";
    setType(operationType);
    setIsOperationSelected(true);
    setRandomNums(generateRandomNumbers(operationType, grade, level));
    setGameStarted(false);
  };

  const handleStartGame = () => {
    setRandomNums(generateRandomNumbers(type, grade, level));
    setGameStarted(true);
  };

  useEffect(() => {
    if (timer === 0) {
      saveGameInfo();
    }
    // eslint-disable-next-line
  }, [timer]);

  return (
    <>
      <NavUser />
      <InfoNav />
      <span className="operation-title me-2 fs-4 d-flex justify-content-center align-items-center">
        <strong>{title}: </strong> <Level level={level} />_
        <State score={score} problems={randomNums.length} />
      </span>
      <div className="row justify-content-center my-3">
        <div className="col-auto">
          <Operation
            title={title}
            onSelect={handleOperationSelect}
            disabled={isOperationSelected || gameStarted}
          />
        </div>
      </div>
      <div
        className={`container mt-4 ${isInputFixed ? "fixed-top" : ""}`}
        style={{ backgroundColor: "white" }}
      >
        <div className="row justify-content-center my-2 bg-white">
          <div className="col-auto mx-2">
            <GameTimer timer={timer} disabled={score === randomNums.length} />
          </div>
          <div className="col-auto mx-2">
            <Warning score={score} />
          </div>
          <div className="col-auto mx-2">
            <CurrentScore score={score} />
          </div>
        </div>
        <div className="row justify-content-center my-3">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4 px-2">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Enter a number"
                type="number"
                value={inputValue}
                onChange={handleInput}
                ref={inputRef}
                disabled={timer === 0 || score === randomNums.length}
              />
              {gameStarted ? (
                <Button variant="danger" onClick={resetGame}>
                  Reset Game
                </Button>
              ) : (
                <Button
                  variant="outline-primary"
                  onClick={handleStartGame}
                  disabled={!isOperationSelected}
                  className="btn-secondary-gray"
                >
                  START GAME
                </Button>
              )}
            </InputGroup>
          </div>
        </div>
      </div>
      {gameStarted && (
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col">
              <Table
                randomNums={randomNums}
                activeAnswerIndex={activeAnswerIndex}
                operationType={type}
                correctlyAnswered={correctlyAnswered}
                activeCellRef={activeCellRef}
                message={message}
              />
            </div>
          </div>
        </div>
      )}      
    </>
  );
}
