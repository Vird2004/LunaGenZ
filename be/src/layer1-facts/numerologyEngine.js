const fs = require('fs');
const path = require('path');

const numerologyDataPath = path.join(__dirname, '../../local-data/numerology.json');
const numerologyData = JSON.parse(fs.readFileSync(numerologyDataPath, 'utf8'));

// Helper function to sum digits recursively until a single digit is reached
// Master numbers 11, 22, 33 are kept
function reduceToSingleDigitOrMaster(numStr) {
  let sum = numStr.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0);
  if ([11, 22, 33].includes(sum)) return sum;
  if (sum > 9) return reduceToSingleDigitOrMaster(sum);
  return sum;
}

function calculateLifePath(dob) {
  // Parse dob format DD/MM/YYYY or YYYY-MM-DD
  const parts = dob.split(/[-/]/);
  let day, month, year;
  if (parts[0].length === 4) { // YYYY-MM-DD
    year = parts[0]; month = parts[1]; day = parts[2];
  } else { // DD/MM/YYYY
    day = parts[0]; month = parts[1]; year = parts[2];
  }

  const d = reduceToSingleDigitOrMaster(day);
  const m = reduceToSingleDigitOrMaster(month);
  const y = reduceToSingleDigitOrMaster(year);

  const lifePath = reduceToSingleDigitOrMaster(d + m + y);
  return lifePath;
}

function calculateNumerology(name, dob) {
  const lifePathNumber = calculateLifePath(dob);
  
  const meaning = numerologyData.find(item => item.id === lifePathNumber);

  return {
    name,
    dob,
    coreNumber: lifePathNumber,
    meaning: meaning || { id: lifePathNumber, name: `Số ${lifePathNumber}`, keywords: ["Không rõ"] }
  };
}

module.exports = {
  calculateNumerology
};
