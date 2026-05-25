const express = require('express');
const router = express.Router();
const controller = require('../controllers/patientController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);

/**
 * @openapi
 * /api/patients/me:
 *   get:
 *     tags: [Patients]
 *     summary: Get the patient profile linked to the logged-in patient user
 *     responses:
 *       200:
 *         description: Patient profile
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Patient' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/me', requireRole('patient'), controller.getMyPatient);

/**
 * @openapi
 * /api/patients:
 *   get:
 *     tags: [Patients]
 *     summary: List all patients (admin/doctor only)
 *     responses:
 *       200:
 *         description: A list of patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Patient' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   post:
 *     tags: [Patients]
 *     summary: Create a patient (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/PatientInput' }
 *     responses:
 *       201: { description: Created }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
router.get('/', requireRole('admin', 'doctor'), controller.getPatients);
router.post('/', requireRole('admin'), controller.createPatient);

/**
 * @openapi
 * /api/patients/{id}:
 *   get:
 *     tags: [Patients]
 *     summary: Get one patient (self, doctor, or admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: A patient }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   put:
 *     tags: [Patients]
 *     summary: Update a patient (self or admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/PatientInput' }
 *     responses:
 *       200: { description: Updated }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     tags: [Patients]
 *     summary: Delete a patient (admin only)
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
router.get('/:id', controller.getPatient);
router.put('/:id', controller.updatePatient);
router.delete('/:id', requireRole('admin'), controller.deletePatient);

module.exports = router;
