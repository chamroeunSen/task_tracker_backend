const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects.controller.js');


// Routes mapped to controllers
router.get('/', projectsController.getAllProjects); // GET /projects
router.post('/', projectsController.createProject); // POST /projects
router.put('/:id', projectsController.updateProjectName); // PUT /projects/:id
router.delete('/:id', projectsController.deleteProject); // DELETE /projects/:id

module.exports = router;