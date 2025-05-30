// src/components/GameSettings.jsx
import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext'; // Assuming you have an AuthContext for user info

// Using a simple text/emoji for icon to avoid SVG issues for now, replace as needed
const MathIconPlaceholder = () => <span className="text-5xl sm:text-6xl" role="img" aria-label="calculator">🧮</span>;


const GameSettings = ({ onStartGame }) => {
  // const { currentUser } = useAuth();

  const [numDigits, setNumDigits] = useState(1);
  const [selectedOp, setSelectedOp] = useState('+'); // Now a single string, default to '+'
  const [numProblems, setNumProblems] = useState(10);
  const [timerDuration, setTimerDuration] = useState(60);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOp) { // Should not happen with radio buttons if one is default
      alert("Please select an operation!");
      return;
    }
    if (numProblems < 3 || numProblems > 100) {
      alert("Number of problems must be between 3 and 100.");
      return;
    }
    onStartGame({
      numDigits: parseInt(numDigits, 10),
      selectedOp, // Pass the single selected operation
      numProblems: parseInt(numProblems, 10),
      timerDuration: parseInt(timerDuration, 10),
    });
  };

  const operations = [
    { symbol: '+', label: 'Addition' },
    { symbol: '-', label: 'Subtraction' },
    { symbol: '*', label: 'Multiplication' },
    { symbol: '/', label: 'Division' }
  ];

  return (
    <div className="max-w-xl mx-auto p-6 sm:p-8 bg-white bg-opacity-95 rounded-xl shadow-2xl space-y-6 sm:space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <MathIconPlaceholder />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
          Math Adventure Setup!
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Customize your math challenge!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Number of Digits */}
        <div>
          <label htmlFor="num-digits" className="block text-base sm:text-lg font-medium text-gray-700 mb-1">
            Number of Digits <span className="text-sm text-gray-500">(for each number)</span>
          </label>
          <select
            id="num-digits"
            value={numDigits}
            onChange={(e) => setNumDigits(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border-2 border-blue-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-base"
          >
            <option value="1">1 Digit (e.g., 5 + 3)</option>
            <option value="2">2 Digits (e.g., 12 + 34)</option>
            <option value="3">3 Digits (e.g., 100 + 200)</option>
          </select>
        </div>

        {/* Operations - Changed to Radio Buttons */}
        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 mb-2">
            Choose One Operation
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {operations.map(op => (
              <label
                key={op.symbol}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105
                  ${selectedOp === op.symbol ? 'bg-yellow-400 border-yellow-500 shadow-lg ring-2 ring-yellow-300' : 'bg-blue-100 border-blue-300 hover:bg-blue-200'}`}
              >
                <input
                  type="radio"
                  name="operation" // Radio buttons need the same name
                  value={op.symbol}
                  checked={selectedOp === op.symbol}
                  onChange={() => setSelectedOp(op.symbol)}
                  className="sr-only"
                />
                <span className={`text-3xl sm:text-4xl font-bold ${selectedOp === op.symbol ? 'text-white' : 'text-blue-600'}`}>{op.symbol}</span>
                <span className={`text-xs sm:text-sm mt-1 ${selectedOp === op.symbol ? 'text-white font-semibold' : 'text-gray-700'}`}>{op.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Number of Problems */}
        <div>
          <label htmlFor="num-problems" className="block text-base sm:text-lg font-medium text-gray-700 mb-1">
            Number of Problems
          </label>
          <input
            type="number"
            id="num-problems"
            value={numProblems}
            onChange={(e) => setNumProblems(e.target.value)}
            min="3"
            max="100"
            className="mt-1 block w-full py-2 px-3 border-2 border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-base"
          />
        </div>

        {/* Timer Duration */}
        <div>
          <label htmlFor="timer-duration" className="block text-base sm:text-lg font-medium text-gray-700 mb-1">
            Timer <span className="text-sm text-gray-500">(seconds, 0 for no timer)</span>
          </label>
          <input
            type="number"
            id="timer-duration"
            value={timerDuration}
            onChange={(e) => setTimerDuration(e.target.value)}
            min="0"
            max="600" // Max 10 minutes
            className="mt-1 block w-full py-2 px-3 border-2 border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-base"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl text-lg sm:text-xl shadow-lg hover:shadow-xl transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          🚀 Start the Adventure!
        </button>
      </form>
    </div>
  );
};

export default GameSettings;