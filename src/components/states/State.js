import React from 'react';
import { Badge } from 'react-bootstrap';
// import axios from 'axios';

export default function State({ score, problems }) {
  const rate = problems ? (score / problems * 100).toFixed(2) : 0;
  // const clearStates = async () => {
  //   try {
  //     const url = 'https://math4jem-default-rtdb.firebaseio.com/states.json';
  //     const response = await axios.put(url, {}); // or axios.put(url, {}) to send an empty object
  //     console.log('States cleared successfully', response.data);
  //   } catch (error) {
  //     console.error('Error clearing states:', error);
  //   }
  // };
   
  return (
    <Badge bg="success" text="dark">
      Rate: {rate}%
      {/* <button onClick={clearStates}>clean record</button> */}
    </Badge>
  );
}
