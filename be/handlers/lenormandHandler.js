const { dynamoDb } = require("../utils/dynamoClient");
const { PutCommand, BatchGetCommand } = require("@aws-sdk/lib-dynamodb");

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

    let idsToFetch = [];
    if (cardIds && Array.isArray(cardIds) && cardIds.length === spreadType) {
      idsToFetch = cardIds;
    } else {
      const availableIds = Array.from({ length: 36 }, (_, i) => i + 1);
      const shuffled = availableIds.sort(() => 0.5 - Math.random());
      idsToFetch = shuffled.slice(0, spreadType);
    }

    let drawnCards = [];
    if (process.env.LENORMAND_TABLE) {
      try {
        const response = await dynamoDb.send(new BatchGetCommand({
          RequestItems: {
            [process.env.LENORMAND_TABLE]: {
              Keys: idsToFetch.map(id => ({ card_id: id }))
            }
          }
        }));
        const fetchedCards = response.Responses[process.env.LENORMAND_TABLE] || [];
        drawnCards = idsToFetch.map(id => fetchedCards.find(c => c.card_id === id)).filter(Boolean);
      } catch (err) {
        console.error("DynamoDB error fetching lenormand cards:", err);
      }
    } else {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "LENORMAND_TABLE environment variable not configured" })
      };
    }

    if (drawnCards.length !== spreadType) {
       return {
         statusCode: 500,
         headers: { "Access-Control-Allow-Origin": "*" },
         body: JSON.stringify({ error: "Could not fetch all cards from DynamoDB" })
       };
    }

    // Apply topic logic for center card (if 3 or 5)
    let centerCard = null;
    let interpretation = `Bạn đã rút ${spreadType} lá bài cho chủ đề ${topic}.`;

    if (spreadType === 3 || spreadType === 5) {
      const centerIndex = Math.floor(spreadType / 2);
      centerCard = drawnCards[centerIndex];
      const cardName = centerCard.name?.vi || centerCard.name;
      interpretation += ` Lá bài trung tâm là ${cardName}, đóng vai trò chủ chốt cho thông điệp vũ trụ gửi đến bạn.`;
    } else {
      const cardName = drawnCards[0].name?.vi || drawnCards[0].name;
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
            cards: drawnCards.map(c => c.card_id || c.id),
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
