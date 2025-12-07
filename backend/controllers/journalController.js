const { getJournalEntries, getJournalEntryById, createJournalEntry, approveJournalEntry, getChartOfAccounts } = require('../models/journalModel');

async function listEntries(req, res, next) {
  try {
    const entries = await getJournalEntries();
    res.json({ entries });
  } catch (err) {
    next(err);
  }
}

async function getEntry(req, res, next) {
  try {
    const { id } = req.params;
    const entry = await getJournalEntryById(id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ entry });
  } catch (err) {
    next(err);
  }
}

async function createEntry(req, res, next) {
  try {
    const entry = await createJournalEntry(req.body, req.user.id);
    res.json({ entry });
  } catch (err) {
    next(err);
  }
}

async function approveEntry(req, res, next) {
  try {
    const { id } = req.params;
    const entry = await approveJournalEntry(id, req.user.id);
    res.json({ entry });
  } catch (err) {
    next(err);
  }
}

async function getAccounts(req, res, next) {
  try {
    const accounts = await getChartOfAccounts();
    res.json({ accounts });
  } catch (err) {
    next(err);
  }
}

module.exports = { listEntries, getEntry, createEntry, approveEntry, getAccounts };
