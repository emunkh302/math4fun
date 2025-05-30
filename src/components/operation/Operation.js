import React from 'react';
import Button from 'react-bootstrap/Button';
import './Operation.css';

const Operation = ({ title, onSelect, disabled }) => {
  const getOperations = () => {
    if (title.includes("Fourth")) {
      return ['+', '-', '*', '/'];
    } else if (title.includes("Third")) {
      return ['+', '-', '*'];
    } else {
      return ['+', '-'];
    }
  };

  const operations = getOperations();

  const buttonVariant = (op) => {
    if(disabled) return 'secondary'; // Set to secondary if disabled

    switch(op) {
      case '+': return 'success';
      case '-': return 'warning';
      case '*': return 'info';
      case '/': return 'danger';
      default: return 'primary';
    }
  };

  return (
    <div className="d-flex justify-content-center mt-3">
      {operations.map((op, index) => (
        <Button
          key={index}
          variant={buttonVariant(op)}
          onClick={() => onSelect(op)}
          disabled={disabled}
          className="operation-button mx-2"
        >
          {op}
        </Button>
      ))}
    </div>
  );
};

export default Operation;

