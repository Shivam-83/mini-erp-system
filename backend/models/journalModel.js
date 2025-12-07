const db = require('../db');

async function getJournalEntries() {
  const [rows] = await db.execute(`
    SELECT je.*, u.name as created_by_name 
    FROM journal_entries je
    LEFT JOIN users u ON je.created_by = u.id
    ORDER BY je.entry_date DESC
  `);
  return rows;
}

async function getJournalEntryById(id) {
  const [entries] = await db.execute('SELECT * FROM journal_entries WHERE id = ?', [id]);
  if (entries.length === 0) return null;
  
  const [lines] = await db.execute(`
    SELECT jel.*, coa.code, coa.name as account_name 
    FROM journal_entry_lines jel
    JOIN chart_of_accounts coa ON jel.account_id = coa.id
    WHERE jel.journal_entry_id = ?
  `, [id]);
  
  return { ...entries[0], lines };
}

async function createJournalEntry(data, userId) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    
    const entryNumber = `JE${Date.now()}`;
    const { entry_date, description, reference, lines } = data;
    
    const [result] = await conn.execute(
      'INSERT INTO journal_entries (entry_number, entry_date, description, reference, created_by, status) VALUES (?, ?, ?, ?, ?, ?)',
      [entryNumber, entry_date, description, reference, userId, 'draft']
    );
    
    const entryId = result.insertId;
    
    for (const line of lines) {
      await conn.execute(
        'INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description) VALUES (?, ?, ?, ?, ?)',
        [entryId, line.account_id, line.debit || 0, line.credit || 0, line.description]
      );
    }
    
    await conn.commit();
    conn.release();
    
    return getJournalEntryById(entryId);
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }
}

async function approveJournalEntry(id, userId) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    
    await conn.execute(
      'UPDATE journal_entries SET status = ?, approved_by = ?, approved_at = NOW() WHERE id = ?',
      ['approved', userId, id]
    );
    
    // Update account balances
    const [lines] = await conn.execute(`
      SELECT jel.*, coa.type 
      FROM journal_entry_lines jel
      JOIN chart_of_accounts coa ON jel.account_id = coa.id
      WHERE jel.journal_entry_id = ?
    `, [id]);
    
    for (const line of lines) {
      const amount = line.debit - line.credit;
      await conn.execute(
        'UPDATE chart_of_accounts SET balance = balance + ? WHERE id = ?',
        [amount, line.account_id]
      );
    }
    
    await conn.commit();
    conn.release();
    
    return getJournalEntryById(id);
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }
}

async function getChartOfAccounts() {
  const [rows] = await db.execute('SELECT * FROM chart_of_accounts WHERE is_active = TRUE ORDER BY code');
  return rows;
}

module.exports = { getJournalEntries, getJournalEntryById, createJournalEntry, approveJournalEntry, getChartOfAccounts };
