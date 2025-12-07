const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { getBalanceSheet, getProfitLoss, getCashFlow } = require('../controllers/financialStatementsController');

router.get('/balance-sheet', authenticate, getBalanceSheet);
router.get('/profit-loss', authenticate, getProfitLoss);
router.get('/cash-flow', authenticate, getCashFlow);

module.exports = router;
