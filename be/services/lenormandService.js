function drawCards(topic, gender, count) {
  const deckSize = 36;
  const cards = [];
  
  // Determine trigger card based on gender
  const triggerCard = gender === 'nam' ? 28 : (gender === 'nữ' ? 29 : null);
  
  if (triggerCard !== null && count > 0) {
      cards.push(triggerCard);
  }

  // Fill the rest with unique random cards
  while (cards.length < count) {
      const randomCard = Math.floor(Math.random() * deckSize) + 1;
      if (!cards.includes(randomCard)) {
          cards.push(randomCard);
      }
  }

  // Force trigger card into the center if drawing 3 or more cards
  if (triggerCard !== null && count >= 3) {
      const centerIndex = Math.floor(count / 2);
      const triggerIndex = cards.indexOf(triggerCard);
      if (triggerIndex !== centerIndex) {
          cards.splice(triggerIndex, 1);
          cards.splice(centerIndex, 0, triggerCard);
      }
  }

  return cards;
}

module.exports = {
  drawCards
};
