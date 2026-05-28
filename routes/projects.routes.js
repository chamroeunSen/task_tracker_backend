const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects.controller.js');


// Routes mapped to controllers
router.get('/', projectsController.getAllProjects); // GET /projects
router.post('/', projectsController.createProject); // POST /projects
router.put('/:projectId', projectsController.updateProjectName); // PUT /projects/:projectId
router.delete('/:projectId', projectsController.deleteProject); // DELETE /projects/:projectId

module.exports = router;