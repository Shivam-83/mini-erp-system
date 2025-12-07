const { getProjectById } = require('../models/projectModel');

function evaluateRisk(project) {
  const budget = Number(project.budget || 0);
  const spent = Number(project.spent || 0);
  const progress = Number(project.progress || 0);
  const spentPct = budget > 0 ? (spent / budget) * 100 : 0;
  // rules from spec:
  // if spent% > (progress% + 35) → Critical
  // if spent% > (progress% + 20) → High
  // else if spent% > (progress% + 10) → Medium
  // else Low
  if (spentPct > progress + 35) return { level: 'Critical', spentPct, progress };
  if (spentPct > progress + 20) return { level: 'High', spentPct, progress };
  if (spentPct > progress + 10) return { level: 'Medium', spentPct, progress };
  return { level: 'Low', spentPct, progress };
}

async function projectInsights(req, res, next) {
  try {
    const { id } = req.params;
    const project = await getProjectById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const insight = evaluateRisk(project);
    res.json({ project, insight });
  } catch (err) {
    next(err);
  }
}

module.exports = { projectInsights };
