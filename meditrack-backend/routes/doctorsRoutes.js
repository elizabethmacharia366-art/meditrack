const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctorController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);

/**
 * @openapi
 * /api/doctors/me:
 *   get:
 *     tags: [Doctors]
 *     summary: Get the doctor profile linked to the logged-in doctor user
 *     responses:
 *       200:
 *         description: Doctor profile
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Doctor' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/me', requireRole('doctor'), controller.getMyDoctor);

/**
 * @openapi
 * /api/doctors:
 *   get:
 *     tags: [Doctors]
 *     summary: List all doctors
 *     responses:
 *       200:
 *         description: A list of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Doctor' }
 *   post:
 *     tags: [Doctors]
 *     summary: Create a doctor (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DoctorInput' }
 *     responses:
 *       201:
 *         description: Created
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
router.get('/', controller.getDoctors);

/**
 * @openapi
 * /api/doctors/{id}:
 *   get:
 *     tags: [Doctors]
 *     summary: Get one doctor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: A doctor }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   put:
 *     tags: [Doctors]
 *     summary: Update a doctor (admin or that doctor)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DoctorInput' }
 *     responses:
 *       200: { description: Updated }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     tags: [Doctors]
 *     summary: Delete a doctor (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', controller.getDoctor);

router.post('/', requireRole('admin'), controller.createDoctor);
router.put('/:id', requireRole('admin', 'doctor'), controller.updateDoctor);
router.delete('/:id', requireRole('admin'), controller.deleteDoctor);

module.exports = router;
