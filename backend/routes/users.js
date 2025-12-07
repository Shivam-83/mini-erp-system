const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { list, setRole, remove } = require('../controllers/usersController');

router.get('/', authenticate, authorize('admin'), list);
router.put('/:id/role', authenticate, authorize('admin'), setRole);
router.delete('/:id', authenticate, authorize('admin'), remove);

module.exports = router;
