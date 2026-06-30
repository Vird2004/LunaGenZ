const express = require('express');
const cors = require('cors');


const { calculateNumerology } = require('./src/layer1-facts/numerologyEngine');
const { drawCards } = require('./src/layer1-facts/lenormandEngine');
const { generateMockReading } = require('./src/layer3-brain/aiMock');
const mockData = require('./local-data/mockData.json');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Test routes for Frontend mock data
app.get('/api/test-numerology', (req, res) => {
  res.json(mockData.numerology);
});

app.get('/api/test-lenormand', (req, res) => {
  res.json(mockData.lenormand);
});

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

const serverless = require('serverless-http');
// Check both IS_OFFLINE and LAMBDA_TASK_ROOT to ensure app.listen only runs in local dev
if (process.env.NODE_ENV !== 'production' && process.env.IS_OFFLINE !== 'true' && !process.env.LAMBDA_TASK_ROOT) {
    // Only listen if running pure local node (not offline serverless plugin)
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`Local dev server running on ${port}`));
}
module.exports.handler = serverless(app);
