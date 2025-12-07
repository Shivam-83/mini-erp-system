const db = require('../db');

async function ensureARAccount() {
  const [rows] = await db.execute("SELECT * FROM accounts WHERE name = 'Accounts Receivable'");
  if (rows.length === 0) {
    const [r] = await db.execute("INSERT INTO accounts (name, type, balance, created_at) VALUES ('Accounts Receivable','asset',0,NOW())");
    return { id: r.insertId, name: 'Accounts Receivable', type: 'asset', balance: 0 };
  }
  return rows[0];
}

async function addToAR(amount) {
  await ensureARAccount();
  await db.execute('UPDATE accounts SET balance = balance + ? WHERE name = ?', [amount, 'Accounts Receivable']);
}

async function getAccounts() {
  const [rows] = await db.execute('SELECT * FROM accounts');
  return rows;
}

module.exports = { ensureARAccount, addToAR, getAccounts };
