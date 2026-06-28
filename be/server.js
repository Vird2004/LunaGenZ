const express = require('express');
const cors = require('cors');

const { calculateNumerology } = require('./src/layer1-facts/numerologyEngine');
const { drawCards } = require('./src/layer1-facts/lenormandEngine');
const { generateMockReading } = require('./src/layer3-brain/aiMock');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Numerology Endpoint
app.post('/api/numerology', async (req, res) => {
  try {
    const { name, dob } = req.body;
    
    if (!name || !dob) {
      return res.status(400).json({ error: "Missing name or dob" });
    }

    // Pass data through Layer 1
    const layer1Result = calculateNumerology(name, dob);
    
    // Pass Layer 1 results through Layer 3
    const finalReading = await generateMockReading(layer1Result);
    
    // Return the final Mock AI response to the client
    res.json(finalReading);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Lenormand Endpoint
app.post('/api/lenormand', async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: "Missing topic" });
    }

    // Pass data through Layer 1
    const layer1Result = drawCards(topic);
    
    // Pass Layer 1 results through Layer 3
    const finalReading = await generateMockReading(layer1Result);
    
    // Return the final Mock AI response to the client
    res.json(finalReading);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`LunaGenZ Backend MVP running on port ${PORT}`);
});
