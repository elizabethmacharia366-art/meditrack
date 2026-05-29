const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth, requireRole('admin'));

// Users
router.get('/users', ctrl.listUsers);
router.post('/staff', ctrl.createStaff);
router.post('/admins', ctrl.createAdmin);
router.post('/users/:id/approve', ctrl.approveUser);
router.post('/users/:id/reject', ctrl.rejectUser);

module.exports = router;
