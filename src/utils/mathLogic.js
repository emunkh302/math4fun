// src/utils/mathLogic.js

export const generateRandomNumber = (digits) => {
    if (digits < 1) digits = 1;
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  /**
   * Generates a math problem based on selected digits and a single operation.
   * @param {number} numDigits - Number of digits for operands.
   * @param {string} operation - The selected operation (e.g., '+', '-').
   * @returns {object} Problem object: { num1, num2, operator, text, answer }.
   */
  export const generateProblem = (numDigits, operation) => { // Changed selectedOps to operation
    let num1 = generateRandomNumber(numDigits);
    let num2 = generateRandomNumber(numDigits);
    // const operator = selectedOps[Math.floor(Math.random() * selectedOps.length)]; // Old line
    const operator = operation; // Use the single passed operation
    let answer;
    let text;
  
    switch (operator) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        if (num1 < num2) {
          [num1, num2] = [num2, num1];
        }
        answer = num1 - num2;
        break;
      case '*':
        if (numDigits > 1) {
          if (Math.random() < 0.5) {
            num2 = generateRandomNumber(1);
          } else if (numDigits > 1) {
            num1 = generateRandomNumber(1);
          }
        }
        answer = num1 * num2;
        break;
      case '/':
        if (num2 === 0) num2 = 1;
        const maxDivisorOrQuotientDigits = numDigits === 1 ? 1 : Math.floor(numDigits / 2) + 1;
        let tempAnswer = generateRandomNumber(Math.max(1, maxDivisorOrQuotientDigits));
        num1 = tempAnswer * num2;
        
        // Ensure num1 does not grow excessively and maintains numDigits for display consistency if possible
        // This logic might need further refinement based on desired difficulty for division.
        let num1Digits = String(num1).length;
        const targetMaxDigits = numDigits + (numDigits === 1 ? 0 : 1); // Allow num1 to be slightly larger than numDigits for division
  
        if (num1Digits > targetMaxDigits) {
            // If num1 became too large, try to regenerate with smaller components
            num2 = generateRandomNumber(Math.max(1, numDigits -1 < 1 ? 1 : numDigits-1)); // Make num2 smaller
            tempAnswer = generateRandomNumber(Math.max(1, maxDivisorOrQuotientDigits -1 < 1 ? 1 : maxDivisorOrQuotientDigits-1));
            num1 = tempAnswer * num2;
        }
        answer = tempAnswer; // The actual answer is the quotient we generated
        break;
      default:
        answer = NaN;
    }
  
    text = `${num1} ${operator} ${num2}`;
    return { id: crypto.randomUUID(), num1, num2, operator, text, answer }; // Added a unique ID
  };