const express = require('express');
const router = express.Router();
const {
  register,
  login,
  adminLogin,
  me,
  verifyEmail,
  resendVerification,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a patient, or an invited doctor/hospital
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegisterInput' }
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       409: { $ref: '#/components/responses/ValidationError' }
 */
router.post('/register', register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in with email + password
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginInput' }
 *     responses:
 *       200:
 *         description: Authenticated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/login', login);

/**
 * @openapi
 * /api/auth/admin-login:
 *   post:
 *     tags: [Auth]
 *     summary: Admin login for an existing admin account
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AdminLoginInput' }
 *     responses:
 *       200:
 *         description: Authenticated as admin
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
router.post('/admin-login', adminLogin);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the currently authenticated user
 *     responses:
 *       200:
 *         description: Current user
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/me', requireAuth, me);

// Email verification
router.get('/verify-email', verifyEmail);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

module.exports = router;
