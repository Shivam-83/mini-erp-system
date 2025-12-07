const { createProject, getProjects, getProjectById, updateProject } = require('../models/projectModel');

async function create(req, res, next) {
  try {
    const { name, description, budget, progress } = req.body;
    if (!name || budget == null) return res.status(400).json({ message: 'Missing fields' });
    const project = await createProject({ name, description, budget, progress });
    res.json({ project });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const projects = await getProjects();
    res.json({ projects });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const project = await updateProject(id, payload);
    res.json({ project });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const project = await getProjectById(id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json({ project });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, update, getById };
