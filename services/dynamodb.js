const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// Initializes the connection to AWS
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1", // Change to your AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// The DocumentClient automatically handles JavaScript objects/JSON for DynamoDB
const docClient = DynamoDBDocumentClient.from(client);

module.exports = { docClient };