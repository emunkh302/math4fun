// src/data/flashcardData.js (New file, or place inside FlashCards.js initially)
export const flashcardSets = {
    addition_easy: {
      name: "Easy Addition",
      cards: [
        { id: 'ae1', question: '2 + 3', answer: '5' },
        { id: 'ae2', question: '1 + 4', answer: '5' },
        { id: 'ae3', question: '5 + 2', answer: '7' },
        { id: 'ae4', question: '3 + 3', answer: '6' },
        { id: 'ae5', question: '4 + 0', answer: '4' },
      ]
    },
    subtraction_easy: {
      name: "Easy Subtraction",
      cards: [
        { id: 'se1', question: '5 - 2', answer: '3' },
        { id: 'se2', question: '7 - 4', answer: '3' },
        { id: 'se3', question: '3 - 1', answer: '2' },
        { id: 'se4', question: '6 - 6', answer: '0' },
        { id: 'se5', question: '8 - 3', answer: '5' },
      ]
    },
    multiplication_basics: {
      name: "Multiplication Basics",
      cards: [
        { id: 'mb1', question: '2 x 3', answer: '6' },
        { id: 'mb2', question: '5 x 4', answer: '20' },
        { id: 'mb3', question: '7 x 1', answer: '7' },
        { id: 'mb4', question: '3 x 3', answer: '9' },
        { id: 'mb5', question: '6 x 0', answer: '0' },
      ]
    }
  };