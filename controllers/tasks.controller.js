const { docClient } = require('../services/dynamodb.js'); 
const {
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand
} = require('@aws-sdk/lib-dynamodb');
const { buildUpdateParams } = require('../utils/updateParams.js');


const Tasks_Table = 'tasks';

exports.getAllTasks = async (req, res, next) => {
  try {
      const response = await docClient.send(
        new ScanCommand({
          TableName: Tasks_Table
        })
      );

      res.json(response.Items || []);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: error.message
      });
    }
}

exports.createTask = async (req, res, next) => {
  try {
      const { title, description, projectId = null, priority, status} = req.body;
  
      if (!title) {
        return res.status(400).json({
          error: 'Title is required'
        });
      }
  
      const newTask = {
        id: Date.now().toString(),
        projectId, 
        title,
        description,
        priority,
        status,
        createdAt: new Date().toISOString()
      };

      const response = await docClient.send(new PutCommand({
          TableName: Tasks_Table,
          Item: newTask
        }));
      res.status(201).json(response.Attributes)

  
    } catch (error) {
      console.error(error);
  
      res.status(500).json({
        error: error.message
      });
    }
};

// UPDATE TASK TITLE
exports.updateTask = async (req, res, next) => {
  const { id } = req.params;
  const params = buildUpdateParams(Tasks_Table, { id }, req.body);

  try {
    const response = await docClient.send(new UpdateCommand(params));
    res.status(200).json(response.Attributes)
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

  
// DELETE TASK
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    await docClient.send(
      new DeleteCommand({
        TableName: Tasks_Table,
        Key: { id }
      })
    );

    res.json({
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({
      error: error.message
    });
  }
};


