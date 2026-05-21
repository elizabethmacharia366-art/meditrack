const express = require('express');
const router = express.Router();
const controller = require('../controllers/hospitalController');

router.post('/', controller.createHospital);
router.get('/', controller.getHospitals);
router.get('/:id', controller.getHospital);
router.put('/:id', controller.updateHospital);
router.delete('/:id', controller.deleteHospital);

module.exports = router;
