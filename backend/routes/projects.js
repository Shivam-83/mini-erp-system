const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { create, list, update, getById } = require('../controllers/projectsController');

const createProjectValidation = [
	body('name').isString().notEmpty(),
	body('budget').isFloat({ gt: 0 }),
	body('progress').optional().isFloat({ min: 0, max: 100 })
];

const updateProjectValidation = [
	body('name').optional().isString(),
	body('budget').optional().isFloat({ gt: 0 }),
	body('progress').optional().isFloat({ min: 0, max: 100 }),
	body('spent').optional().isFloat({ min: 0 })
];

router.post('/', authenticate, authorize('admin'), createProjectValidation, (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	return create(req, res, next);
});

router.get('/', authenticate, list);
router.get('/:id', authenticate, getById);
router.put('/:id', authenticate, authorize('admin'), updateProjectValidation, (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	return update(req, res, next);
});

module.exports = router;
