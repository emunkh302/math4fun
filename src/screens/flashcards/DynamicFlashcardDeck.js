// src/screens/flashcards/DynamicFlashcardDeck.js
import React, { useState, useCallback } from 'react';
import FlippingFlashCard from '../../components/flash-card/FlippingFlashCard'; // Adjust path
import { generateProblem } from '../../utils/mathLogic'; // We'll use this for Q&A
import { FaArrowLeft, FaArrowRight, FaCog, FaPlay } from 'react-icons/fa';

const DynamicFlashcardDeck = () => {
  // Settings State
  const [numDigits, setNumDigits] = useState(1);
  const [selectedOp, setSelectedOp] = useState('+');
  const [numCards, setNumCards] = useState(10);
  const [showSettings, setShowSettings] = useState(true); // Start with settings visible

  // Deck State
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  
  const operations = [ // For settings
    { symbol: '+', label: 'Addition' },
    { symbol: '-', label: 'Subtraction' },
    { symbol: '×', label: 'Multiplication' }, // Using actual multiplication sign
    { symbol: '÷', label: 'Division' }      // Using actual division sign
  ];

  const handleGenerateCards = useCallback(() => {
    const newCards = [];
    for (let i = 0; i < numCards; i++) {
      const problem = generateProblem(numDigits, selectedOp === '×' ? '*' : selectedOp === '÷' ? '/' : selectedOp); // Adapt symbols if mathLogic expects *, /
      newCards.push({
        id: crypto.randomUUID(),
        question: problem.text, // e.g., "5 + 3"
        answer: String(problem.answer), // e.g., "8"
        topic: `${operations.find(op => op.symbol === selectedOp)?.label || 'Mixed'} - ${numDigits} Digit(s)`,
      });
    }
    
    if (isShuffled) {
      for (let i = newCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
      }
    }
    setCards(newCards);
    setCurrentCardIndex(0);
    // eslint-disable-next-line
    setShowSettings(false); // Hide settings, show cards
    // eslint-disable-next-line
  }, [numDigits, selectedOp, numCards, isShuffled]);


  const handleNextCard = () => {
    if (cards.length === 0) return;
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePreviousCard = () => {
    if (cards.length === 0) return;
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  const toggleShuffle = () => {
    // Re-generate or just shuffle current and restart if shuffle is toggled mid-session
    // For simplicity, let's allow shuffle toggle before starting a new set.
    setIsShuffled(!isShuffled);
    // If cards are already generated, re-generate them with the new shuffle state
    if (cards.length > 0) {
        // This will trigger a re-generation via the useEffect dependency on isShuffled (if we add it to handleGenerateCards's deps)
        // Or, more directly:
        const currentCardsToShuffle = [...cards];
         if (!isShuffled) { // if it was false, and now we want to shuffle
            for (let i = currentCardsToShuffle.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [currentCardsToShuffle[i], currentCardsToShuffle[j]] = [currentCardsToShuffle[j], currentCardsToShuffle[i]];
            }
         }
         // If turning shuffle OFF, we would ideally revert to original order, 
         // or just re-generate. For now, re-generating is simpler when shuffle changes.
         // So, best to call handleGenerateCards if shuffle changes an active set
         // However, to avoid immediate re-generation on toggle if user is just setting preference:
         // We will make shuffle apply when `handleGenerateCards` is next called.
    }
  };
  
  const currentCardData = cards[currentCardIndex];

  if (showSettings) {
    return (
      <div className="w-full max-w-lg mx-auto p-6 sm:p-8 bg-white rounded-xl shadow-2xl space-y-6 text-gray-700">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
          Flash Card Setup
        </h2>
        {/* Operation Selection */}
        <div className="mb-4">
          <label className="block text-base sm:text-lg font-medium mb-2">Operation:</label>
          <div className="grid grid-cols-2 gap-3">
            {operations.map(op => (
              <button
                key={op.symbol}
                onClick={() => setSelectedOp(op.symbol)}
                className={`p-3 rounded-lg text-lg font-semibold border-2 transition-all
                  ${selectedOp === op.symbol ? 'bg-yellow-400 text-white border-yellow-500 ring-2 ring-yellow-300' : 'bg-blue-50 text-blue-600 border-blue-300 hover:bg-blue-100'}`}
              >
                {op.label} ({op.symbol})
              </button>
            ))}
          </div>
        </div>
        {/* Number of Digits */}
        <div className="mb-4">
          <label htmlFor="fc-num-digits" className="block text-base sm:text-lg font-medium mb-1">Number of Digits:</label>
          <select
            id="fc-num-digits"
            value={numDigits}
            onChange={(e) => setNumDigits(parseInt(e.target.value, 10))}
            className="mt-1 block w-full p-3 border-2 border-blue-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-base"
          >
            <option value="1">1 Digit</option>
            <option value="2">2 Digits</option>
            <option value="3">3 Digits (for +,- may be large for ×,÷)</option>
          </select>
        </div>
        {/* Number of Cards */}
        <div className="mb-6">
          <label htmlFor="fc-num-cards" className="block text-base sm:text-lg font-medium mb-1">Number of Cards:</label>
          <input
            type="number"
            id="fc-num-cards"
            value={numCards}
            onChange={(e) => setNumCards(Math.max(1, Math.min(50, parseInt(e.target.value, 10))))} // Min 1, Max 50
            min="1"
            max="50"
            className="mt-1 block w-full p-3 border-2 border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-base"
          />
        </div>
         {/* Shuffle Toggle */}
        <div className="mb-6 flex items-center">
            <label htmlFor="fc-shuffle" className="text-base sm:text-lg font-medium mr-3">Shuffle Cards?</label>
            <button
                id="fc-shuffle"
                onClick={toggleShuffle}
                className={`px-4 py-2 rounded-lg font-semibold border-2 transition-colors text-sm
                    ${isShuffled ? 'bg-green-500 text-white border-green-600' : 'bg-gray-200 text-gray-700 border-gray-300'}`}
            >
                {isShuffled ? 'Shuffle ON' : 'Shuffle OFF'}
            </button>
        </div>
        <button
          onClick={handleGenerateCards}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl text-lg shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <FaPlay className="inline mr-2 mb-1" /> Start Flashcards
        </button>
      </div>
    );
  }

  if (cards.length === 0) {
    return <div className="text-center p-10 text-gray-600">No cards generated. <button onClick={() => setShowSettings(true)} className="text-blue-500 underline">Go to Settings</button></div>;
  }

  return (
    <div className="w-full p-2 sm:p-4 flex flex-col items-center space-y-6">
      <button 
        onClick={() => setShowSettings(true)} 
        className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg text-sm shadow flex items-center"
        title="Change Settings"
      >
        <FaCog className="mr-0 sm:mr-2" /><span className="hidden sm:inline">Settings</span>
      </button>

      {currentCardData && (
        <FlippingFlashCard
          key={currentCardData.id}
          question={currentCardData.question}
          answer={currentCardData.answer}
          topic={currentCardData.topic}
        />
      )}

      <div className="flex items-center justify-center space-x-3 sm:space-x-4 w-full max-w-md mt-4">
        <button
          onClick={handlePreviousCard}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Previous Card"
        >
          <FaArrowLeft size={18} smSize={20}/>
        </button>
        <div className="text-gray-700 font-medium select-none px-2 py-1 bg-gray-100 rounded-md">
          Card {currentCardIndex + 1} / {cards.length}
        </div>
        <button
          onClick={handleNextCard}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Next Card"
        >
          <FaArrowRight size={18} smSize={20}/>
        </button>
      </div>
    </div>
  );
};

export default DynamicFlashcardDeck;