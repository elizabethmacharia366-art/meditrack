const express = require('express');
const router = express.Router();
const controller = require('../controllers/prescriptionController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);

/**
 * @openapi
 * /api/prescriptions:
 *   get:
 *     tags: [Prescriptions]
 *     summary: List prescriptions (scoped by role)
 *     responses:
 *       200:
 *         description: A list of prescriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Prescription' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Prescriptions]
 *     summary: Issue a prescription (doctor or admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/PrescriptionInput' }
 *     responses:
 *       201: { description: Created }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
router.get('/', controller.getPrescriptions);
router.post('/', requireRole('doctor', 'admin'), controller.createPrescription);

/**
 * @openapi
 * /api/prescriptions/{id}:
 *   get:
 *     tags: [Prescriptions]
 *     summary: Get one prescription (owner doctor, target patient, or admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: A prescription }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   put:
 *     tags: [Prescriptions]
 *     summary: Update prescription (issuing doctor or admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/PrescriptionInput' }
 *     responses:
 *       200: { description: Updated }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     tags: [Prescriptions]
 *     summary: Delete prescription (issuing doctor or admin)
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
router.get('/:id', controller.getPrescription);
router.put('/:id', requireRole('doctor', 'admin'), controller.updatePrescription);
router.delete('/:id', requireRole('doctor', 'admin'), controller.deletePrescription);

module.exports = router;
