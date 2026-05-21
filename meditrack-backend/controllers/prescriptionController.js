const Prescription = require('../models/Prescriptions');

exports.getPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find().populate('patientId doctorId');
    res.json(prescriptions);
  } catch (err) {
    next(err);
  }
};

exports.getPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate('patientId doctorId');
    res.json(prescription);
  } catch (err) {
    next(err);
  }
};

exports.createPrescription = async (req, res, next) => {
  try {
    const prescription = new Prescription(req.body);
    await prescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    next(err);
  }
};

exports.updatePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('patientId doctorId');
    res.json(prescription);
  } catch (err) {
    next(err);
  }
};

exports.deletePrescription = async (req, res, next) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prescription deleted' });
  } catch (err) {
    next(err);
  }
};
