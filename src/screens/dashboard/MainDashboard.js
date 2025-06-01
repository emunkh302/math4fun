// src/screens/dashboard/MainDashboard.jsx
import React, { useState } from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import GamePage from '../game/GamePage'; 
import MultiplicationGame from '../multiplication-game/MultiplicationGame'; 
import DynamicFlashcardDeck from '../flashcards/DynamicFlashcardDeck'; // <<< IMPORT NEW DECK
import { FaCalculator, FaLayerGroup, FaTimes } from 'react-icons/fa';

const MainDashboard = () => {
  const [activeTabKey, setActiveTabKey] = useState('mathGame'); 

  return (
    <Container fluid="lg" className="py-3 py-sm-4">
      <Tabs
        id="main-app-tabs"
        activeKey={activeTabKey}
        onSelect={(k) => setActiveTabKey(k)}
        className="mb-3 nav-pills nav-justified app-tabs"
      >
        <Tab 
          eventKey="mathGame" 
          title={<span className="d-flex align-items-center justify-content-center">
          <FaCalculator className="me-2" /> Math
        </span>}
        >
          {activeTabKey === 'mathGame' && <GamePage />}
        </Tab>

        <Tab
          eventKey="multiplicationGame"
          title={<span className="d-flex align-items-center justify-content-center">
          <FaTimes className="me-2" /> Multip 
        </span>}
        >
          {activeTabKey === 'multiplicationGame' && (
            <div className="p-0 pt-3 sm:p-3 mt-0 sm:mt-0">
              <MultiplicationGame />
            </div>
          )}
        </Tab>

        <Tab 
          eventKey="flashCards" // General Flash Cards Tab
          title={
            <span className="d-flex align-items-center justify-content-center">
              <FaLayerGroup className="me-2" /> Flash
            </span>
          }
        >
          {activeTabKey === 'flashCards' && (
            // No extra padding div if DynamicFlashcardDeck handles its own
            <DynamicFlashcardDeck /> // <<< USE THE NEW DYNAMIC DECK
          )}
        </Tab>
      </Tabs>
      {/* Global Sounds: flip-sound is used by FlippingFlashCard inside DynamicFlashcardDeck */}
      <audio id="flip-sound" src="/sounds/flip.mp3" preload="auto"></audio>
      <audio id="correct-sound" src="/sounds/correct.mp3" preload="auto"></audio>
      <audio id="incorrect-sound" src="/sounds/incorrect.mp3" preload="auto"></audio>
      <audio id="level-complete-sound" src="/sounds/level-complete.mp3" preload="auto"></audio>
      <audio id="click-sound" src="/sounds/click.mp3" preload="auto"></audio>
      <audio id="star-sound" src="/sounds/star.mp3" preload="auto"></audio>
    </Container>
  );
};

export default MainDashboard;