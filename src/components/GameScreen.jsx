// src/components/GameScreen.jsx
import React, { useState, useEffect, useCallback } from "react"; // Ensure useCallback is imported
import { generateProblem } from "../utils/mathLogic";
import { FaHourglassHalf, FaRedo, FaPaperPlane } from "react-icons/fa";

const GameScreen = ({ settings, onGameEnd }) => {
  // userAnswers will be an object: { problemId: "userEnteredValue", ... }
  const [problems, setProblems] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(settings.timerDuration);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // To disable inputs after final submit

  // Sound effects
  const playSound = useCallback((soundId) => {
    // Wrapped in useCallback for stability if passed as prop or used in other effects
    const sound = document.getElementById(soundId);
    if (sound) {
      sound.currentTime = 0;
      sound
        .play()
        .catch((error) => console.warn("Error playing sound:", error));
    }
  }, []);

  const initializeQuiz = useCallback(() => {
    const newProblems = [];
    for (let i = 0; i < settings.numProblems; i++) {
      newProblems.push(
        generateProblem(settings.numDigits, settings.selectedOp)
      );
    }
    setProblems(newProblems);

    const initialAnswers = {};
    newProblems.forEach((p) => {
      initialAnswers[p.id] = "";
    });
    setUserAnswers(initialAnswers);

    setTimeLeft(settings.timerDuration);
    setIsSubmitted(false);
  }, [settings]); // Added settings to dependency array

  useEffect(() => {
    initializeQuiz();
  }, [initializeQuiz]);

  // Initialize or re-initialize quiz when settings change or on first load
  useEffect(() => {
    initializeQuiz();
  }, [initializeQuiz]);

  const handleSubmitQuiz = useCallback(() => {
    // Wrapped handleSubmitQuiz in useCallback
    if (isSubmitted) return;
    setIsSubmitted(true);
    playSound("level-complete-sound");

    const results = problems.map((p) => ({
      problem: p,
      userAnswer:
        userAnswers[p.id] === "" ? null : parseInt(userAnswers[p.id], 10),
      isCorrect: parseInt(userAnswers[p.id], 10) === p.answer,
    }));
    onGameEnd(results, problems);
  }, [isSubmitted, problems, userAnswers, onGameEnd, playSound]); // Added dependencies for handleSubmitQuiz

  // Timer logic - useEffect
  useEffect(() => {
    if (
      settings.timerDuration === 0 ||
      timeLeft <= 0 ||
      problems.length === 0 ||
      isSubmitted
    ) {
      if (timeLeft <= 0 && !isSubmitted && problems.length > 0) {
        playSound("level-complete-sound");
        handleSubmitQuiz(); // Now calling the memoized version
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [
    timeLeft,
    settings.timerDuration,
    problems,
    isSubmitted,
    playSound,
    handleSubmitQuiz,
  ]); // Added handleSubmitQuiz here

  const handleAnswerChange = (problemId, value) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [problemId]: value,
    }));
  };

  const handleRestartQuiz = useCallback(() => {
    // Also wrap this in useCallback for consistency
    playSound("click-sound");
    initializeQuiz();
  }, [playSound, initializeQuiz]);

  if (problems.length === 0) {
    return (
      <div className="text-center text-xl text-gray-600 p-10">
        Setting up your quiz... ⚙️
      </div>
    );
  }
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white bg-opacity-95 rounded-xl shadow-2xl">
      {/* Header: Timer and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {settings.timerDuration > 0 && (
          <div
            className={`text-xl font-bold p-3 rounded-lg shadow ${
              timeLeft <= 10 && timeLeft > 0
                ? "text-red-500 animate-pulse bg-red-100"
                : "text-indigo-600 bg-indigo-100"
            }`}
          >
            <FaHourglassHalf className="inline mr-2 mb-1" />
            Time: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleRestartQuiz}
            disabled={isSubmitted}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <FaRedo className="mr-2" /> Restart Quiz
          </button>
          <button
            onClick={handleSubmitQuiz}
            disabled={isSubmitted}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <FaPaperPlane className="mr-2" /> Finish & See Results
          </button>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
        {problems.map((p, index) => (
          <div
            key={p.id}
            className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm"
          >
            <div className="flex items-center w-full sm:w-auto">
              <span className="text-sm font-semibold text-blue-700 bg-blue-200 rounded-full h-7 w-7 flex items-center justify-center mr-3 select-none">
                {index + 1}
              </span>
              <p className="text-xl sm:text-2xl font-medium text-gray-800 select-none min-w-[120px] sm:min-w-[150px]">
                {p.text} =
              </p>
            </div>
            <input
              type="number"
              value={userAnswers[p.id] || ""}
              onChange={(e) => handleAnswerChange(p.id, e.target.value)}
              placeholder="?"
              disabled={isSubmitted}
              className="flex-grow w-full sm:w-auto py-2 px-3 border-2 border-gray-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-center disabled:bg-gray-100"
            />
          </div>
        ))}
      </div>
      <audio id="click-sound" src="/sounds/click.mp3" preload="auto"></audio>
      <audio
        id="level-complete-sound"
        src="/sounds/level-complete.mp3"
        preload="auto"
      ></audio>
    </div>
  );
};

export default GameScreen;
