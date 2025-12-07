const db = require('../db');

async function createUser({ name, email, password_hash, role = 'user' }) {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())',
    [name, email, password_hash, role]
  );
  return { id: result.insertId, name, email, role };
}

async function findUserByEmail(email) {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function findUserById(id) {
  const [rows] = await db.execute('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { createUser, findUserByEmail, findUserById };
