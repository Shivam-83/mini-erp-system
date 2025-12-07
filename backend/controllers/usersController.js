const { listUsers, updateUserRole, deleteUser } = require('../models/userAdminModel');

async function list(req, res, next) {
  try {
    const users = await listUsers();
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

async function setRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: 'Missing role' });
    await updateUserRole(id, role);
    res.json({ message: 'ok' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.json({ message: 'deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, setRole, remove };
