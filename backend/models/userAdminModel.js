const db = require('../db');

async function listUsers() {
  const [rows] = await db.execute('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC');
  return rows;
}

async function updateUserRole(id, role) {
  await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
}

async function deleteUser(id) {
  await db.execute('DELETE FROM users WHERE id = ?', [id]);
}

module.exports = { listUsers, updateUserRole, deleteUser };
