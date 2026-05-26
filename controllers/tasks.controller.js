const { docClient } = require('../services/dynamodb.js'); 
const {
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand
} = require('@aws-sdk/lib-dynamodb');

const Tasks_Table = 'tasks';
const Projects_Table = 'projects';

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
};

// UPDATE TASK TITLE
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({
            error: 'Title is required for update'
        });
    }

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
      message: 'Task updated successfully',
      updatedTask: { id, title, completed: '...' } // Could return the full updated item if needed
    });

  } catch (error) {
    console.error('Error in updateTaskTitle:', error);
    res.status(500).json({
      error: error.message
    });
  }
};


// TOGGLE COMPLETE
exports.toggleTaskComplete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
        return res.status(400).json({
            error: 'Completed status (boolean) is required'
        });
    }

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
      message: 'Task status updated successfully',
      updatedTask: { id, completed }
    });

  } catch (error) {
    console.error('Error in toggleTaskComplete:', error);
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
        TableName: TABLE_NAME,
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


