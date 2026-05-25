const express = require('express');
const router = express.Router();
const controller = require('../controllers/hospitalController');
const { requireAuth, requireRole } = require('../middleware/auth');

/**
 * @openapi
 * /api/hospitals:
 *   get:
 *     tags: [Hospitals]
 *     summary: List all hospitals (public)
 *     security: []
 *     responses:
 *       200:
 *         description: A list of hospitals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Hospital' }
 *   post:
 *     tags: [Hospitals]
 *     summary: Create a hospital (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HospitalInput' }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Hospital' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
router.get('/', controller.getHospitals);

/**
 * @openapi
 * /api/hospitals/{id}:
 *   get:
 *     tags: [Hospitals]
 *     summary: Get one hospital
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: A hospital
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Hospital' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   put:
 *     tags: [Hospitals]
 *     summary: Update hospital (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HospitalInput' }
 *     responses:
 *       200: { description: Updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     tags: [Hospitals]
 *     summary: Delete hospital (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', controller.getHospital);

router.post('/', requireAuth, requireRole('admin'), controller.createHospital);
router.put('/:id', requireAuth, requireRole('admin'), controller.updateHospital);
router.delete('/:id', requireAuth, requireRole('admin'), controller.deleteHospital);

module.exports = router;
