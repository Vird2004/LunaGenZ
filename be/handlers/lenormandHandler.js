const { dynamoDb } = require("../utils/dynamoClient");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const fs = require('fs');
const path = require('path');

// Load deck data
const lenormandDataPath = path.join(__dirname, '../local-data/lenormand.json');
let lenormandData = [];
try {
  lenormandData = JSON.parse(fs.readFileSync(lenormandDataPath, 'utf8'));
} catch (e) {
  console.error("Could not load lenormand data", e);
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { topic, spreadType = 3, cardIds } = body; // 1, 3, or 5

    if (!topic || ![1, 3, 5].includes(spreadType)) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Invalid topic or spreadType" })
      };
    }

    if (lenormandData.length === 0) {
       return {
         statusCode: 500,
         headers: { "Access-Control-Allow-Origin": "*" },
         body: JSON.stringify({ error: "Deck data unavailable" })
       }
    }

    let drawnCards = [];
    if (cardIds && Array.isArray(cardIds) && cardIds.length === spreadType) {
      drawnCards = cardIds.map(id => lenormandData.find(c => (c.card_id || c.id) === id)).filter(Boolean);
    }

    if (drawnCards.length !== spreadType) {
      // Draw unique cards if not provided or invalid
      const shuffled = [...lenormandData].sort(() => 0.5 - Math.random());
      drawnCards = shuffled.slice(0, spreadType);
    }

    // Apply topic logic for center card (if 3 or 5)
    let centerCard = null;
    let interpretation = `Bạn đã rút ${spreadType} lá bài cho chủ đề ${topic}.`;

    if (spreadType === 3 || spreadType === 5) {
      const centerIndex = Math.floor(spreadType / 2);
      centerCard = drawnCards[centerIndex];
      const cardName = centerCard.name.vi || centerCard.name;
      interpretation += ` Lá bài trung tâm là ${cardName}, đóng vai trò chủ chốt cho thông điệp vũ trụ gửi đến bạn.`;
    } else {
      const cardName = drawnCards[0].name.vi || drawnCards[0].name;
      interpretation += ` Lá bài của bạn là ${cardName}.`;
    }

    const resultData = {
      topic,
      spreadType,
      cards: drawnCards,
      interpretation
    };

    // Save to DynamoDB
    const readingId = Date.now().toString();
    if (process.env.USERS_TABLE) {
      try {
        await dynamoDb.send(new PutCommand({
          TableName: process.env.USERS_TABLE,
          Item: {
            id: readingId,
            type: "LENORMAND",
            topic,
            spreadType,
            cards: drawnCards.map(c => c.id),
            createdAt: new Date().toISOString()
          }
        }));
      } catch (dbErr) {
        console.error("DynamoDB error:", dbErr);
      }
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(resultData)
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
