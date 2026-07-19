const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

// Setup client
const clientConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
};

// Use localstack endpoint if IS_OFFLINE is set or no table name in env
if (process.env.IS_OFFLINE || !process.env.NUMEROLOGY_TABLE) {
    clientConfig.endpoint = 'http://localhost:4566';
}

const client = new DynamoDBClient(clientConfig);
const docClient = DynamoDBDocumentClient.from(client);

const NUMEROLOGY_TABLE = process.env.NUMEROLOGY_TABLE || 'lunagenz-numerology';
const LENORMAND_TABLE = process.env.LENORMAND_TABLE || 'lunagenz-lenormand';

async function seedNumerology() {
  const dataPath = path.join(__dirname, '../data/numerology_db.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const numerology = JSON.parse(rawData);

  console.log('Seeding Numerology...');
  let count = 0;

  for (const [category, items] of Object.entries(numerology)) {
    for (const [key, value] of Object.entries(items)) {
      const id = `${category}#${key}`;
      await docClient.send(
        new PutCommand({
          TableName: NUMEROLOGY_TABLE,
          Item: {
            id,
            category,
            key,
            content: value
          }
        })
      );
      count++;
    }
  }
  console.log(`Seeded ${count} numerology items.`);
}

async function seedLenormand() {
  const dataPath = path.join(__dirname, '../local-data/lenormand.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const lenormandCards = JSON.parse(rawData);

  console.log('Seeding Lenormand...');
  let count = 0;

  for (const card of lenormandCards) {
    await docClient.send(
      new PutCommand({
        TableName: LENORMAND_TABLE,
        Item: card
      })
    );
    count++;
  }
  console.log(`Seeded ${count} lenormand cards.`);
}

async function run() {
  try {
    await seedNumerology();
    await seedLenormand();
    console.log('Done seeding!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

run();
