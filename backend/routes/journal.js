const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { listEntries, getEntry, createEntry, approveEntry, getAccounts } = require('../controllers/journalController');

router.get('/accounts', authenticate, getAccounts);
router.get('/entries', authenticate, listEntries);
router.get('/entries/:id', authenticate, getEntry);
router.post('/entries', authenticate, createEntry);
router.post('/entries/:id/approve', authenticate, approveEntry);

module.exports = router;
