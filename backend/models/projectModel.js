const db = require('../db');

async function createProject({ name, description, budget, progress = 0 }) {
  // ensure optional fields are not undefined when binding
  const desc = description == null ? null : description;
  const bud = Number(budget || 0);
  const prog = Number(progress || 0);
  const [result] = await db.execute(
    'INSERT INTO projects (name, description, budget, spent, progress, created_at) VALUES (?, ?, ?, 0, ?, NOW())',
    [name, desc, bud, prog]
  );
  return { id: result.insertId, name, description: desc, budget: bud, progress: prog, spent: 0 };
}

async function getProjects() {
  const [rows] = await db.execute('SELECT * FROM projects ORDER BY id DESC');
  return rows;
}

async function getProjectById(id) {
  const [rows] = await db.execute('SELECT * FROM projects WHERE id = ?', [id]);
  return rows[0];
}

async function updateProject(id, { name, description, budget, progress, spent }) {
  const existing = await getProjectById(id);
  if (!existing) return null;
  const nName = name == null ? existing.name : name;
  const nDesc = description == null ? existing.description : description;
  const nBudget = budget == null ? existing.budget : Number(budget);
  const nSpent = spent == null ? existing.spent : Number(spent);
  const nProgress = progress == null ? existing.progress : Number(progress);
  const q = 'UPDATE projects SET name = ?, description = ?, budget = ?, spent = ?, progress = ? WHERE id = ?';
  await db.execute(q, [nName, nDesc, nBudget, nSpent, nProgress, id]);
  return getProjectById(id);
}

async function addSpent(projectId, amount) {
  await db.execute('UPDATE projects SET spent = spent + ? WHERE id = ?', [amount, projectId]);
}

module.exports = { createProject, getProjects, getProjectById, updateProject, addSpent };
