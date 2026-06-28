function generateMockReading(contextData) {
  return new Promise((resolve) => {
    // Simulate Claude 3 Haiku API latency
    setTimeout(() => {
      let reading;
      let style = "Gen-Z Vibe 💅✨";
      
      if (contextData.coreNumber) {
        // Numerology response
        const { name, coreNumber, meaning } = contextData;
        reading = {
          title: `Numerology Check for bestie ${name} 🌟`,
          vibe: style,
          summary: `Omg, your Life Path is giving major ${coreNumber} energy! It's literally all about ${meaning.keywords.join(", ")}.`,
          advice: `Slay your path and don't let anyone dim your light, periodt. 💅`,
          rawContext: contextData
        };
      } else if (contextData.cards) {
        // Lenormand response
        const { topic, combination, flags } = contextData;
        let traumaWarning = flags.includes("PAST_TRAUMA") 
          ? "⚠️ Oop, sensing some past trauma bestie. Healing era loading..." 
          : "✨ Vibes are clear, no major red flags detected.";

        reading = {
          title: `Lenormand Tea on: "${topic}" ☕️🔮`,
          vibe: style,
          tea: `The cards spilled: ${combination}.`,
          warning: traumaWarning,
          advice: `Trust the universe but also trust your gut. Main character energy only! 👑`,
          rawContext: contextData
        };
      } else {
        reading = {
          error: "Bruh, no valid data found. This is a flop."
        };
      }

      resolve(reading);
    }, 2000); // Wait 2 seconds
  });
}

module.exports = {
  generateMockReading
};
