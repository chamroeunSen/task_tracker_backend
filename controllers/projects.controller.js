const { docClient } = require('../services/dynamodb.js');
const {
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand
} = require('@aws-sdk/lib-dynamodb');

// Define the DynamoDB Table Name for Projects
const Projects_Table = 'projects';

exports.getAllProjects = async (req, res, next) => {
  try {
    const response = await docClient.send(
      new ScanCommand({
        TableName: Projects_Table
      })
    );

    res.status(200).json(response.Items || []);
  } catch (error) {
    console.error('Error in getAllProjects:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const { projectId, projectName } = req.body;

    if (!projectName || !projectId) {
      return res.status(400).json({
        error: 'Project id/name is required'
      });
    }

    const newProject = {
      projectId,
      projectName,
      createdAt: new Date().toISOString()
    };

    await docClient.send(
      new PutCommand({
        TableName: Projects_Table,
        Item: newProject
      })
    );

    res.status(201).json(newProject);

  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.updateProjectName = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Project name is required for update'
      });
    }

    await docClient.send(
      new UpdateCommand({
        TableName: Projects_Table,
        Key: { projectId },
        // 1. Added the SET keyword
        UpdateExpression: 'SET projectName = :val',
        // 2. Added the actual value for :val
        ExpressionAttributeValues: {
          ':val': projectName
        },
        ReturnValues: 'ALL_NEW'
      })
    );

    res.json({
      message: 'Project name updated successfully',
      updatedProject: { projectId, projectName, status: 'Active' } // Return necessary fields
    });

  } catch (error) {
    console.error('Error in updateProjectName:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    await docClient.send(
      new DeleteCommand({
        TableName: Projects_Table,
        Key: { projectId }
      })
    );

    res.status(200).json({
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({
      error: error.message
    });
  }
};