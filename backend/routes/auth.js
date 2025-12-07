const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { register, login } = require('../controllers/authController');

const registerValidation = [
	body('name').isString().notEmpty(),
	body('email').isEmail(),
	body('password').isLength({ min: 6 })
];

const loginValidation = [
	body('email').isEmail(),
	body('password').isString().notEmpty()
];

router.post('/register', registerValidation, (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	return register(req, res, next);
});

router.post('/login', loginValidation, (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	return login(req, res, next);
});

module.exports = router;
