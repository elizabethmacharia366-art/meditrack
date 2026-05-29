const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.get('/', controller.getTasks);
router.get('/staff', requireRole('doctor'), controller.getAssignableStaff);
router.post('/', requireRole('doctor'), controller.createTask);
router.put('/:id', controller.updateTask);
router.post('/:id/notes', controller.addTaskNote);

module.exports = router;
