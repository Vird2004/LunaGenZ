const fs = require('fs');
const path = require('path');

const lenormandDataPath = path.join(__dirname, '../../local-data/lenormand.json');
const lenormandData = JSON.parse(fs.readFileSync(lenormandDataPath, 'utf8'));

function drawCards(topic) {
  // Draw 3 unique cards
  const shuffled = [...lenormandData].sort(() => 0.5 - Math.random());
  const drawn = shuffled.slice(0, 3);
  
  let flags = [];
  
  // Deterministic rule: Scythe (id: 10) drawn before Heart (id: 24) -> "PAST_TRAUMA"
  const scytheIndex = drawn.findIndex(c => c.id === 10);
  const heartIndex = drawn.findIndex(c => c.id === 24);
  
  if (scytheIndex !== -1 && heartIndex !== -1 && scytheIndex < heartIndex) {
    flags.push("PAST_TRAUMA");
  }

  // Create simple combination logic
  const combination = `${drawn[0].name} (Context) + ${drawn[1].name} (Action) + ${drawn[2].name} (Outcome)`;

  return {
    topic,
    cards: drawn,
    combination,
    flags
  };
}

module.exports = {
  drawCards
};
