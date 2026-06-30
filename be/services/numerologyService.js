function calculateLifePath(dobString) {
  // Extract only digits from the date string
  const digits = dobString.replace(/\D/g, '');
  if (!digits) return null;

  let sum = 0;
  for (let char of digits) {
    sum += parseInt(char, 10);
  }

  // Reduce to a single digit or master number (11, 22, 33)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    let newSum = 0;
    for (let char of sum.toString()) {
      newSum += parseInt(char, 10);
    }
    sum = newSum;
  }
  
  return sum;
}

module.exports = {
  calculateLifePath
};
