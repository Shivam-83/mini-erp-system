const db = require('../db');

async function createInvoice({ project_id, description, amount, status = 'pending', issued_at = null }) {
  const [result] = await db.execute(
    'INSERT INTO invoices (project_id, description, amount, status, issued_at, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [project_id, description, amount, status, issued_at]
  );
  return { id: result.insertId, project_id, description, amount, status };
}

async function getInvoices() {
  const [rows] = await db.execute('SELECT * FROM invoices ORDER BY id DESC');
  return rows;
}

module.exports = { createInvoice, getInvoices };
