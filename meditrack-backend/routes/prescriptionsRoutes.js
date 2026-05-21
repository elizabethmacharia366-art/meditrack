const express = require('express');
const router = express.Router();
const controller = require('../controllers/prescriptionController');

router.post('/', controller.createPrescription);
router.get('/', controller.getPrescriptions);
router.get('/:id', controller.getPrescription);
router.put('/:id', controller.updatePrescription);
router.delete('/:id', controller.deletePrescription);

module.exports = router;
