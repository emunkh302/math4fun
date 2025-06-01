// src/components/flash-card/FlashCards.js
// (This is the one for general flashcard sets, not MultiplicationGame.js)

import React, { useState, useEffect, useCallback } from 'react';
// import FlashCard from './FlashCard'; // OLD IMPORT
import FlippingFlashCard from './FlippingFlashCard'; // <<< NEW IMPORT
import { flashcardSets } from '../../data/flashcardData'; // Adjust path
import { FaArrowLeft, FaArrowRight, FaRandom } from 'react-icons/fa';

const FlashCards = () => {
  const [selectedSetKey, setSelectedSetKey] = useState(Object.keys(flashcardSets)[0]);
  const [currentCards, setCurrentCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);

  const loadAndPrepareCards = useCallback(() => {
    let cards = [...flashcardSets[selectedSetKey].cards];
    if (isShuffled) {
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
    }
    setCurrentCards(cards);
    setCurrentCardIndex(0);
  }, [selectedSetKey, isShuffled]);

  useEffect(() => {
    loadAndPrepareCards();
  }, [loadAndPrepareCards]);

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % currentCards.length);
  };

  const handlePreviousCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + currentCards.length) % currentCards.length);
  };

  const handleSetChange = (event) => {
    setSelectedSetKey(event.target.value);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  if (currentCards.length === 0) {
    return <div className="text-center p-10 text-gray-600">Loading flashcards...</div>;
  }

  const currentCardData = currentCards[currentCardIndex];
  const currentSet = flashcardSets[selectedSetKey];

  return (
    <div className="w-full p-4 flex flex-col items-center space-y-6">
      {/* Set Selector */}
      <div className="w-full max-w-md flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <select
          value={selectedSetKey}
          onChange={handleSetChange}
          className="p-3 border-2 border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-base w-full sm:w-auto"
        >
          {Object.keys(flashcardSets).map(key => (
            <option key={key} value={key}>{flashcardSets[key].name}</option>
          ))}
        </select>
        <button
          onClick={toggleShuffle}
          className={`p-3 rounded-lg shadow-sm border-2 flex items-center justify-center transition-colors w-full sm:w-auto
            ${isShuffled ? 'bg-green-500 text-white border-green-600 hover:bg-green-600' 
                        : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'}`}
        >
          <FaRandom className="mr-2" /> Shuffle {isShuffled ? 'On' : 'Off'}
        </button>
      </div>

      {/* FlashCard Display - Now using FlippingFlashCard */}
      {currentCardData && (
        <FlippingFlashCard // <<< USING THE CORRECT COMPONENT
          key={currentCardData.id} // Use a unique key for the card
          question={currentCardData.question}
          answer={currentCardData.answer}
          topic={`${currentSet.name} - Card ${currentCardIndex + 1} of ${currentCards.length}`}
        />
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-center space-x-4 w-full max-w-md mt-4">
        <button
          onClick={handlePreviousCard}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Previous Card"
        >
          <FaArrowLeft size={20}/>
        </button>
        <div className="text-gray-700 font-medium select-none">
          Card {currentCardIndex + 1} / {currentCards.length}
        </div>
        <button
          onClick={handleNextCard}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Next Card"
        >
          <FaArrowRight size={20}/>
        </button>
      </div>
    </div>
  );
};

export default FlashCards;