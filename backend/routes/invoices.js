const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/authMiddleware');
const { create, list } = require('../controllers/invoicesController');

// Validation chain for creating invoices
const createInvoiceValidation = [
	body('project_id').isInt({ gt: 0 }).withMessage('project_id must be a positive integer'),
	body('amount').isFloat({ gt: 0 }).withMessage('amount must be a positive number'),
	body('description').optional().isString()
];

// route handlers
router.post('/', authenticate, createInvoiceValidation, async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	return create(req, res, next);
});

router.get('/', authenticate, list);

module.exports = router;
