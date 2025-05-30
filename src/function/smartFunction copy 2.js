const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getMaxNumber = (level) => {
  const levelMaxNumbers = {
    "pre-k": 10, "kinder": 10,
    "first": 20, "second": 20,
    "third": 50, "fourth": 50
  };
  return levelMaxNumbers[level] || 10;
};

const getNumDigits = (level, score) => {
  const maxScore = 10;
  const percentageThreshold = 0.8;
  let baseDigits = level === 'third' || level === 'fourth' ? 2 : 1;
  let additionalDigits = score >= percentageThreshold * maxScore 
    ? Math.floor((score - percentageThreshold * maxScore) / 5)
    : 0;
  return Math.min(baseDigits + additionalDigits, 7);
};

const generateOperationNumbers = (operation, level, score) => {  
  let result = [];
  let maxNumber = getMaxNumber(level);
  let numDigits = getNumDigits(level, score);
  let minNumber = Math.pow(10, numDigits - 1);
  let maxDigitNumber = Math.pow(10, numDigits) - 1;

  for (let i = 0; i < 30; i++) {
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

const generateRandomNumbers = (type, level, score) => {
  return generateOperationNumbers(type, level, score);
};


// Example usage
// const score = 0; // Replace with actual score from DB
// const level = "fourth";
// const type = "add";
// console.log(generateRandomNumbers(type, level, score));

export default generateRandomNumbers;