const db = require('../db');
const { getInvoices } = require('../models/invoiceModel');

// Create invoice with DB transaction to ensure atomicity across tables
async function create(req, res, next) {
  const conn = await db.getConnection();
  try {
    const { project_id, description, amount, status = 'pending' } = req.body;
    await conn.beginTransaction();

    // insert invoice
    const [result] = await conn.execute(
      'INSERT INTO invoices (project_id, description, amount, status, issued_at, created_at) VALUES (?, ?, ?, ?, NULL, NOW())',
      [project_id, description || null, amount, status]
    );

    // ensure Accounts Receivable account exists and update balance
    await conn.execute("INSERT INTO accounts (name, type, balance, created_at) SELECT 'Accounts Receivable','asset',0,NOW() FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE name='Accounts Receivable')");
    await conn.execute('UPDATE accounts SET balance = balance + ? WHERE name = ?', [amount, 'Accounts Receivable']);

    // update project spent
    await conn.execute('UPDATE projects SET spent = spent + ? WHERE id = ?', [amount, project_id]);

    await conn.commit();
    conn.release();

    const invoice = { id: result.insertId, project_id, description, amount, status };
    res.json({ invoice });
  } catch (err) {
    try { await conn.rollback(); } catch (e) {}
    try { conn.release(); } catch (e) {}
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const invoices = await getInvoices();
    res.json({ invoices });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list };
