require('dotenv').config();

const express = require('express');
const cors = require('cors');

const {
  DynamoDBClient
} = require('@aws-sdk/client-dynamodb');

const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand
} = require('@aws-sdk/lib-dynamodb');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TABLE_NAME = process.env.TABLE_NAME || 'tasks';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(client);


// GET ALL TASKS
app.get('/tasks', async (req, res) => {
  try {
    const response = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME
      })
    );

    res.json(response.Items || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});


// CREATE TASK
app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        error: 'Title is required'
      });
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: newTask
      })
    );

    res.status(201).json(newTask);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});


// UPDATE TASK TITLE
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'SET title = :title',
        ExpressionAttributeValues: {
          ':title': title
        },
        ReturnValues: 'ALL_NEW'
      })
    );

    res.json({
      message: 'Task updated'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});


// TOGGLE COMPLETE
app.patch('/tasks/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'SET completed = :completed',
        ExpressionAttributeValues: {
          ':completed': completed
        },
        ReturnValues: 'ALL_NEW'
      })
    );

    res.json({
      message: 'Task status updated'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});


// DELETE TASK
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id }
      })
    );

    res.json({
      message: 'Task deleted'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});