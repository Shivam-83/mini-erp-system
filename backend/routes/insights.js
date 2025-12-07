const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { projectInsights } = require('../controllers/insightsController');

router.get('/project/:id', authenticate, projectInsights);

module.exports = router;
