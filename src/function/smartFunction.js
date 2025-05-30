const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getNumberOfProblems = (grade, level) => {
  // Updated logic to use both grade and level
  const gradeProblems  = {
    "pre-k": [10, 20, 30, 10, 20],
    "kinder": [10, 20, 10, 20, 30],
    "first": [20, 30, 10, 20, 30],
    "second": [30, 30, 10, 20, 30],
    "third": [30, 30, 30, 30, 30],
    "fourth": [30, 30, 30, 30, 30],
  };
  return gradeProblems[grade][level - 1];
};
const getMaxNumber = (grade, level) => {
  const gradeMaxNumbers = {
    "pre-k": [10, 20, 30, 10, 20],
    "kinder": [10, 20, 10, 20, 30],
    "first": [20, 30, 10, 20, 30],
    "second": [30, 30, 10, 20, 30],
    "third": [30, 30, 30, 30, 30],
    "fourth": [30, 30, 30, 30, 30],
  };
  return gradeMaxNumbers[grade][level - 1];
};


const getNumDigits = (grade, level) => {
  // Updated logic to use both grade and level
  const gradeDigits = {
    "pre-k": [1, 1, 1, 2, 2],
    "kinder": [1, 1, 2, 2, 2],
    "first": [1, 1, 2, 2, 2],
    "second": [1, 1, 2, 2, 2],
    "third": [1, 2, 2, 3, 4],
    "fourth": [1, 2, 3, 4, 5],
  };
  return gradeDigits[grade][level - 1];
};

const generateOperationNumbers = (operation, grade, level) => {  
  let result = [];
  let maxNumber = getMaxNumber(grade, level);
  let numDigits = getNumDigits(grade, level);
  let numberOfProblems = getNumberOfProblems(grade, level); // Get the number of problems
  let minNumber = Math.pow(10, numDigits - 1);
  let maxDigitNumber = Math.pow(10, numDigits) - 1;

  for (let i = 0; i < numberOfProblems; i++) { // Loop for the correct number of problems
    let var1, var2, answer;
    switch (operation) {
      case 'div':
        var2 = getRandomNumber(1, maxNumber);
        var1 = var2 * getRandomNumber(1, maxNumber);
        answer = var1 / var2;
        break;
      case 'sub':
        var1 = getRandomNumber(1, maxNumber);
        var2 = getRandomNumber(0, var1);
        answer = var1 - var2;
        break;
      case 'mul':
        var1 = getRandomNumber(1, maxNumber);
        var2 = getRandomNumber(1, maxNumber);
        answer = var1 * var2;   
        break;     
      case 'add':
        var1 = getRandomNumber(minNumber, maxDigitNumber);
        var2 = getRandomNumber(minNumber, maxDigitNumber);
        answer = var1 + var2;
        break;        
      default:        
        console.log("Invalid operation type");
        break;
    }
    result.push({ var1, var2, answer });
  }

  return result;
};

const generateRandomNumbers = (type, grade, level) => {
  return generateOperationNumbers(type, grade, level);
};


// Example usage
// const level = 4;  
// const grade = "pre-k";
// const type = "add";
// console.log(generateRandomNumbers(type, grade, level));

export default generateRandomNumbers;
