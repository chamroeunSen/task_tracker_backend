const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks.controller.js');

// Routes mapped to controllers
router.get('/', tasksController.getAllTasks); // GET /tasks
router.post('/', tasksController.createTask); // POST /tasks

// Task specific routes
router.put('/:id', tasksController.updateTask); // PUT /tasks/:id
router.patch('/:id/toggle', tasksController.toggleTaskComplete); // PATCH /tasks/:id/toggle
router.delete('/:id', tasksController.deleteTask); // DELETE /tasks/:id

module.exports = router;