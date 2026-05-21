const express = require('express');
const router = express.Router();
const controller = require('../controllers/patientController');

router.post('/', controller.createPatient);
router.get('/', controller.getPatients);
router.get('/:id', controller.getPatient);
router.put('/:id', controller.updatePatient);
router.delete('/:id', controller.deletePatient);

module.exports = router;
