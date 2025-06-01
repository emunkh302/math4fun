// src/screens/game/GamePage.js
import React, { useState, useContext } from 'react';
import GameSettings from '../../components/GameSettings'; // Adjust path
import GameScreen from '../../components/GameScreen';   // Adjust path
import ResultsScreen from '../../components/ResultsScreen'; // Adjust path

import { UserContext } from '../../contexts/user-context/UserContext';         // Adjust path
import { StatisticContext } from '../../contexts/statistic-context/StatisticContext'; // Adjust path

const GamePage = () => {
  const [gameState, setGameState] = useState('settings'); // 'settings', 'playing', 'results'
  const [gameSettings, setGameSettings] = useState(null);
  const [finalQuizResults, setFinalQuizResults] = useState(null);

  const { state: userState } = useContext(UserContext);
  const { saveState } = useContext(StatisticContext);

  const handleStartGame = (settings) => {
    setGameSettings(settings);
    setGameState('playing');
  };

  const handleGameEnd = async (formattedAnswers, problemsPlayed) => {
    const correctCount = formattedAnswers.filter(ans => ans.isCorrect).length;
    const totalProblemsCount = problemsPlayed.length;
    const percentageScore = totalProblemsCount > 0 ? Math.round((correctCount / totalProblemsCount) * 100) : 0;

    const resultsForDisplayAndSave = {
        answers: formattedAnswers,
        settings: gameSettings,
        score: correctCount,
        totalProblems: totalProblemsCount,
        percentage: percentageScore,
    };

    setFinalQuizResults(resultsForDisplayAndSave);
    setGameState('results');

    if (userState.userId && userState.token) {
      const newStateForStatistic = {
        userId: userState.userId,
        timestamp: Date.now(),
        settings: {
            numDigits: gameSettings.numDigits,
            selectedOp: gameSettings.selectedOp,
            numProblems: gameSettings.numProblems,
            timerDuration: gameSettings.timerDuration,
        },
        score: correctCount,
        totalProblems: totalProblemsCount,
        percentage: percentageScore,
      };
      try {
        await saveState(newStateForStatistic, userState.token);
        // console.log("Quiz result saved successfully using StatisticContext!");
      } catch (error) {
        console.error("Error saving quiz result via StatisticContext:", error);
      }
    } else {
      console.log("User not logged in or token missing. Results not saved.");
    }
  };

  const handlePlayAgain = () => {
    setGameSettings(null);
    setFinalQuizResults(null);
    setGameState('settings');
  };

  // If user somehow lands here without being logged in, though router should prevent it
  if (!userState.token || !userState.userId) {
      return (
        <div className="p-6 bg-white rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Access Denied</h2>
            <p className="text-gray-700">You need to be logged in to play the game.</p>
        </div>
      );
  }

  return (
    <div className="w-full"> {/* GamePage container, AppBody in App.js handles centering */}
      {gameState === 'settings' && <GameSettings onStartGame={handleStartGame} />}
      {gameState === 'playing' && gameSettings && (
        <GameScreen
          settings={gameSettings}
          onGameEnd={handleGameEnd}
        />
      )}
      {gameState === 'results' && finalQuizResults && (
        <ResultsScreen
          results={finalQuizResults}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
};

export default GamePage;